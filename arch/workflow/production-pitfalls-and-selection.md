---
title: 生产踩坑与选型
date: 2026-10-23
category:
  - arch
  - workflow
tags:
  - 流程引擎
  - Flowable
  - 生产
---

# 生产踩坑与选型

[[toc]]

前几篇解决「怎么跑通」，这一篇解决「上线后哪里会疼」。流程引擎的问题大多不在 API 本身，而在事务边界、变量存储、历史数据、版本发布和多节点作业这些工程细节上。

本文以 Flowable 8.0.0 为准，结论对 Activiti 同源引擎同样适用。

## 异步与事务

同步服务任务和业务更新可以放进同一个 Spring 事务，一起提交、一起回滚。这一点在内部原理篇验证过：

```text
业务状态=DRAFT
事务回滚后待办数=1
```

异步任务没有这个保证。`flowable:async="true"` 的节点不会在当前事务里执行，而是先往 `ACT_RU_JOB` 写一条作业，由异步执行器在新事务里执行。作业执行失败会重试，但此时业务事务可能已经提交。

这意味着两个约束：

- **外部调用要幂等**：delegate 可能执行多次，邮件、短信、HTTP 请求不能重复产生副作用
- **长耗时操作放异步，短数据库操作保持同步**：不要在同步服务任务里调几十秒的外部接口，它会拖长整个流程事务

幂等的常见做法：

| 做法 | 说明 |
| --- | --- |
| 业务唯一键 | 用 `businessKey` + 操作类型建唯一索引，重复执行直接冲突 |
| 状态判断 | 执行前查业务状态，已处理则跳过 |
| 幂等表 | 单独记录已处理的作业 ID / 请求 ID |
| 下游幂等接口 | 要求外部系统支持幂等键 |

还有一个容易踩的运维坑：**异步执行器开着的时候，不要手工 `executeJob`**。实测同时开启执行器和手动执行作业，delegate 被执行了两次，并抛出：

```text
FlowableOptimisticLockingException: HistoricProcessInstanceEntity ... was updated by another transaction concurrently
```

手工执行作业只适合排查问题时临时关掉执行器再操作。

## 流程变量

Flowable 默认把自定义对象按 Java 序列化存储。实际测试：

```text
{NAME_=payload, TYPE_=serializable, TEXT_=null, BYTEARRAY_ID_=0638bc75-...}
{NAME_=jsonText, TYPE_=string, TEXT_={"level":"high"}, BYTEARRAY_ID_=null}
```

`payload` 是一个普通 Java 对象，落成了 `serializable` 类型，值放在 `ACT_GE_BYTEARRAY` 指向的二进制里。`jsonText` 是字符串，直接存在 `TEXT_` 字段。

Java 序列化的问题是类结构一变就可能反序列化失败：

- 改类名、包名、字段类型，旧数据读不出来
- 不同版本的应用同时在线，类定义不一致
- 引擎升级或类加载器变化，反序列化报错
- 大对象反复写历史，`ACT_GE_BYTEARRAY` 迅速膨胀

生产建议：

| 数据类型 | 建议 |
| --- | --- |
| 字符串、数字、布尔、日期 | 直接作为基础类型变量 |
| 业务对象 | 序列化成 JSON 字符串，存 `string` 变量 |
| 大附件、文件 | 放对象存储，变量里只存 URL / ID |
| 临时字段 | 用任务局部变量，任务结束自动清理 |

```java
runtimeService.setVariable(instance.getId(), "leaveJson",
        "{\"days\":5,\"reason\":\"travel\"}");
```

读取时按字符串取出，再用业务层的 JSON 工具反序列化。这样变量表里存的是可读文本，跨版本、跨类加载器都稳定，也方便直接查库排查。

## 流程定义版本

重新部署同一个流程 key，版本号会加一。实际测试：

```text
部署前版本数=1
  v1 id=leaveApproval:1:...
重新部署后版本数=2
  v1 id=leaveApproval:1:...
  v2 id=leaveApproval:2:...
重新部署后，已在跑的实例仍使用：版本=1
按 key 启动：版本=2
按 id 启动：版本=1
```

四个结论：

- 部署新版本不影响已经在跑的实例，它们继续用旧定义
- `startProcessInstanceByKey` 默认启动最新版本
- `startProcessInstanceById` 可以指定旧版本，用于回放或特殊场景
- 老部署不要急着删，历史实例和旧流程定义还引用着它

发布策略：

1. 先部署 v2，不切业务流量
2. 用测试实例验证 v2 的通过、驳回、撤回、会签路径
3. 新业务切到 v2
4. 等 v1 的存量实例跑完，再评估是否清理旧部署

如果新版本改了节点 ID、变量名或任务分配规则，老实例继续跑 v1 是安全的；但要注意「同一个业务单据不能同时跑两个版本」，需要业务层控制。

## 历史表膨胀

历史表是流程引擎里最容易失控的部分。`full` 级别下，一次 4 个用户任务的请假流程，`ACT_HI_ACTINST` 就有 15 行：

```text
start            startEvent
flow1            sequenceFlow
apply            userTask
flow2            sequenceFlow
managerReview    userTask
flow3            sequenceFlow
managerDecision  exclusiveGateway
toDays           sequenceFlow
daysDecision     exclusiveGateway
toDirector       sequenceFlow
directorReview   userTask
flow4            sequenceFlow
hrRecord         userTask
flow5            sequenceFlow
end              endEvent
```

连线、网关都会记录。流程步骤多、分支多、并发多时，历史行数会成倍增长。

控制手段：

- 按业务需要选历史级别：只需要操作痕迹用 `audit`，需要变量明细才用 `full`
- 开启 Flowable 8 的历史清理配置（`enable-history-cleaning` 等），按保留天数清理
- 大表按时间归档到冷库，主库只保留近期数据
- 不要为了省空间直接删 `ACT_GE_BYTEARRAY`，流程定义还在引用
- 监控 `ACT_HI_PROCINST`、`ACT_HI_TASKINST`、`ACT_HI_ACTINST` 的日增量

更稳妥的做法是把「流程历史」和「业务审计」分开：流程引擎保留运行和轨迹所需的数据，真正的合规审计另存业务审计表。

## 多节点与作业锁

多节点部署时，每个节点都可以启动异步执行器，靠数据库锁协调：

```text
ACT_RU_JOB
  LOCK_OWNER_     = 节点标识
  LOCK_EXP_TIME_  = 锁过期时间
  RETRIES_        = 剩余重试次数
  EXCLUSIVE_      = 是否独占
```

一个节点取到作业后写入 `LOCK_OWNER_` 和 `LOCK_EXP_TIME_`，其他节点在锁过期前不会重复执行。节点崩溃后，锁过期，作业会被其他节点接手。

几个注意点：

- 各节点时钟要同步，否则锁过期判断会偏
- 长作业可能超过锁过期时间，被其他节点重复领取；delegate 必须幂等
- `EXCLUSIVE_` 作业用于控制并发，默认是独占
- 定时器作业在 `ACT_RU_TIMER_JOB`，同样依赖执行器轮询
- 失败超过重试次数的作业进 `ACT_RU_DEADLETTER_JOB`，需要监控和人工处理

| 现象 | 常见原因 |
| --- | --- |
| 作业一直不动 | 异步执行器没开，或节点都停了 |
| 作业反复重试 | delegate 抛异常、下游不可用、超时 |
| 同一作业执行两次 | 锁过期、节点时钟偏差、手工执行与执行器并发 |
| 定时器不触发 | 执行器关闭、作业被挂起、时区 / 时钟问题 |

## 组织架构同步

流程引擎自带的 `ACT_ID_USER` / `ACT_ID_GROUP` 很少直接作为主用户体系。国内项目通常接自己的组织架构，任务分配时传用户 ID 或组 ID。

需要提前想清楚：

- 候选组用组织架构里的岗位 / 角色，还是单独维护流程角色
- 用户离职、调岗后，未完成的待办怎么转交
- 组织架构变更后，候选人查询是否立即生效，是否需要缓存刷新
- 历史任务里的处理人 ID 是否还能解析出姓名

建议：

- 任务分配优先用候选组，不要到处写死用户 ID
- 离职 / 调岗时批量查询该用户的待办，转交或退回候选池
- 历史展示时用 ID 查当前组织架构，查不到就显示原始 ID，不要阻断页面
- 用户和组的同步做成独立任务，流程启动前保证数据已就绪

## 监控

流程引擎的监控不需要一开始就上大屏，先盯住四类指标：

| 指标 | 查法 | 异常信号 |
| --- | --- | --- |
| 运行中实例 | `ACT_RU_EXECUTION` 按 `ACT_ID_` 分组 | 某个节点堆积 |
| 超期待办 | `ACT_RU_TASK.CREATE_TIME_` | 任务超过 SLA 未处理 |
| 失败作业 | `ACT_RU_JOB.RETRIES_`、`ACT_RU_DEADLETTER_JOB` | 重试耗尽、死信增加 |
| 历史增长 | `ACT_HI_*` 日增量 | 单日增量突增 |

再加两个业务指标：

- 流程平均耗时（按流程定义 key、版本）
- 驳回率、撤回率、会签超时率

排查时优先用引擎 API，不要直接改引擎表。直接 `update ACT_RU_TASK` 绕过历史、监听器和执行树，后面很难收拾。

## 选型

| 方案 | 适合 | 不适合 | 备注 |
| --- | --- | --- | --- |
| Flowable 8 | 新项目、Spring Boot 4、嵌入式人工审批 | 必须留在 Boot 3 | Apache 2.0，Maven Central |
| Flowable 7.2 | Spring Boot 3 项目 | 想用 Boot 4 新特性 | 与 8 同源，API 接近 |
| Activiti 8.8 | 已有 Activiti 体系、Java 21 / Boot 3.5 | 不想配 Alfresco 仓库 | 8.8.1 不在 Maven Central |
| Camunda 7 | 需要成熟商业支持、BPMN 生态 | 新云原生架构 | 与 Activiti 5 同源 |
| Camunda 8 | 云原生流程编排 | 想复用 `ACT_*` 表和经典 API | Zeebe 架构，许可单独确认 |
| 自研状态机 | 流程简单、变更少、无人工会签 | 复杂审批、审计、动态流程 | 成本最低 |
| Temporal / XXL-JOB | 纯自动任务编排、定时任务 | 人机混合审批 | 不是 BPMN 引擎 |

选型时先问三个问题：

1. 流程里有没有「等人处理」的节点？没有，状态机或任务编排可能更合适
2. 流程会不会频繁调整？不会，硬编码状态机更简单
3. 团队能不能承担引擎的表、作业、历史、版本运维？不能，选托管方案或轻量方案

## 上线检查清单

- 生产环境 `database-schema-update=false`，表结构由迁移脚本管理
- 历史级别按业务需要设置，不是一律 `full`
- 异步执行器按需开启，作业重试和死信有监控
- `businessKey` 有唯一性约束，避免同一单据重复发起
- 异步 delegate 幂等，重复执行不会产生副作用
- 流程定义发布有版本策略，旧实例能自然跑完
- 组织架构同步完成，离职 / 调岗有待办转交流程
- 历史表增长有监控和归档方案
- 关键流程有通过、驳回、撤回、会签的回归用例
- 数据库备份和回滚方案经过验证

## 小结

流程引擎上生产，难点不在「会不会写 BPMN」，而在边界：

- 事务边界：同步能保证原子性，异步不能
- 数据边界：变量存基础类型或 JSON，不存复杂对象
- 版本边界：新版本不影响老实例，旧部署不能随便删
- 运维边界：作业、历史、锁、组织架构都要有监控和预案

选型没有唯一答案。流程简单就别上引擎；需要人工审批和长期演进，再选 Flowable / Activiti / Camunda。把上面这些边界想清楚，比比较功能列表更有用。
