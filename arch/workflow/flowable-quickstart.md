---
title: Flowable 8 + Spring Boot 4 最小工程
date: 2026-10-22
category:
  - arch
  - workflow
tags:
  - 流程引擎
  - Flowable
  - Spring Boot
---

# Flowable 8 + Spring Boot 4 最小工程

[[toc]]

这一篇从空目录搭一个能跑的 Flowable 工程，跑通「部署 → 启动 → 查待办 → 完成 → 看历史」。示例用 H2 内存库，所有代码都经过实际运行验证。

本文以 Flowable 8.0.0、Spring Boot 4.1.1、Java 21 为准。

## 环境与版本

| 组件 | 本文版本 | 说明 |
| --- | --- | --- |
| JDK | 21 | Flowable 8 基于 Spring Boot 4，至少需要 Java 17 |
| Maven | 3.9.x | 3.6 也能构建，3.9 更省心 |
| Spring Boot | 4.1.1 | 与仓库 Spring 基线一致 |
| Flowable | 8.0.0 | 2026-02 发布，基于 Spring Framework 7 / Spring Boot 4 |
| H2 | 2.4.240 | 由 Spring Boot 依赖管理带入 |

版本搭配要先确认，否则启动就会失败：

| Flowable | Spring Boot | 说明 |
| --- | --- | --- |
| 8.0.x | 4.x | 本文使用；不再支持 Spring Boot 3 |
| 7.2.x | 3.x | 仍在使用 Spring Boot 3 的项目选这条 |
| 6.8.x | 2.x | 存量项目常见 |

## 建工程

新建一个 Maven 工程，`pom.xml` 里只放三样东西：流程引擎 starter、JDBC、H2 驱动。

`pom.xml`：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>4.1.1</version>
        <relativePath/>
    </parent>

    <groupId>com.example</groupId>
    <artifactId>flowable-demo</artifactId>
    <version>1.0.0</version>

    <properties>
        <java.version>21</java.version>
        <flowable.version>8.0.0</flowable.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.flowable</groupId>
            <artifactId>flowable-spring-boot-starter-process</artifactId>
            <version>${flowable.version}</version>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-jdbc</artifactId>
        </dependency>
        <dependency>
            <groupId>com.h2database</groupId>
            <artifactId>h2</artifactId>
            <scope>runtime</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
```

`flowable-spring-boot-starter-process` 只带流程引擎和自动配置，不负责数据源。数据源和 `JdbcTemplate` 由 `spring-boot-starter-jdbc` 提供，数据库驱动按实际使用的库选择，这里用 H2。

## 配置

配置文件负责连数据源、自动建表、设置历史级别，以及指定 BPMN 文件从哪扫描。

`src/main/resources/application.yml`：

```yaml
spring:
  datasource:
    url: jdbc:h2:mem:flowable;DB_CLOSE_DELAY=-1
    driver-class-name: org.h2.Driver
    username: sa
    password:

flowable:
  database-schema-update: true
  history-level: full
  async-executor-activate: false
  process-definition-location-prefix: classpath*:/processes/
  process-definition-location-suffixes: "**.bpmn20.xml,**.bpmn"

logging:
  level:
    org.flowable: warn
```

几个配置项的作用：

- `database-schema-update: true`：启动时自动建表或升级表结构。只在开发环境用，生产环境应设为 `false`，用数据库迁移脚本管理
- `history-level: full`：记录最完整的历史，包括变量和活动细节。历史级别越高，写入的数据越多
- `async-executor-activate: false`：关闭异步执行器，让示例输出保持同步、可预测。有定时器或异步任务时需要打开
- `process-definition-location-prefix` / `suffixes`：启动时扫描 `classpath:/processes/` 下的 BPMN 文件并自动部署

如果流程统一通过 API 或控制台部署、classpath 下没有流程文件，可以把 `flowable.check-process-definitions` 设为 `false`，避免启动时校验失败。

## 流程图

把上一篇的请假流程放进 `src/main/resources/processes/leave.bpmn20.xml`：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL"
             xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
             xmlns:flowable="http://flowable.org/bpmn"
             targetNamespace="http://example.com/leave">

    <process id="leaveProcess" name="请假审批" isExecutable="true">

        <startEvent id="start" name="开始"/>

        <userTask id="apply" name="提交申请" flowable:assignee="${applicant}"/>

        <userTask id="managerApprove" name="主管审批" flowable:assignee="${manager}"/>

        <exclusiveGateway id="decision" name="请假天数" default="toHr"/>

        <userTask id="directorApprove" name="总监审批" flowable:assignee="${director}"/>

        <userTask id="hrRecord" name="HR 备案" flowable:assignee="hr"/>

        <endEvent id="end" name="结束"/>

        <sequenceFlow id="flow1" sourceRef="start" targetRef="apply"/>
        <sequenceFlow id="flow2" sourceRef="apply" targetRef="managerApprove"/>
        <sequenceFlow id="flow3" sourceRef="managerApprove" targetRef="decision"/>
        <sequenceFlow id="toDirector" sourceRef="decision" targetRef="directorApprove">
            <conditionExpression xsi:type="tFormalExpression"><![CDATA[${days > 3}]]></conditionExpression>
        </sequenceFlow>
        <sequenceFlow id="toHr" sourceRef="decision" targetRef="hrRecord"/>
        <sequenceFlow id="flow4" sourceRef="directorApprove" targetRef="hrRecord"/>
        <sequenceFlow id="flow5" sourceRef="hrRecord" targetRef="end"/>

    </process>
</definitions>
```

文件名以 `.bpmn20.xml` 结尾，和配置里的后缀匹配。BPMN 元素的含义见[上一篇](./bpmn-basics.md)。

## 启动并跑通

启动类实现 `CommandLineRunner`，应用启动后自动发起流程，循环完成所有待办。文件放在 `src/main/java/com/example/workflowdemo/WorkflowDemoApplication.java`：

```java
package com.example.workflowdemo;

import org.flowable.engine.RuntimeService;
import org.flowable.engine.TaskService;
import org.flowable.engine.runtime.ProcessInstance;
import org.flowable.task.api.Task;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.Map;

@SpringBootApplication
public class WorkflowDemoApplication implements CommandLineRunner {

    private final RuntimeService runtimeService;
    private final TaskService taskService;
    private final JdbcTemplate jdbcTemplate;

    public WorkflowDemoApplication(RuntimeService runtimeService,
                                   TaskService taskService,
                                   JdbcTemplate jdbcTemplate) {
        this.runtimeService = runtimeService;
        this.taskService = taskService;
        this.jdbcTemplate = jdbcTemplate;
    }

    public static void main(String[] args) {
        SpringApplication.run(WorkflowDemoApplication.class, args);
    }

    @Override
    public void run(String... args) {
        Map<String, Object> variables = Map.of(
                "applicant", "zhangsan",
                "manager", "lisi",
                "director", "wangwu",
                "days", 5
        );

        ProcessInstance instance = runtimeService.startProcessInstanceByKey(
                "leaveProcess", "LEAVE-2026-001", variables);
        System.out.println("processInstanceId = " + instance.getId());

        while (true) {
            Task task = taskService.createTaskQuery()
                    .processInstanceId(instance.getId())
                    .singleResult();
            if (task == null) {
                break;
            }
            System.out.printf("待办：%s，处理人：%s%n", task.getName(), task.getAssignee());
            taskService.complete(task.getId());
        }

        System.out.println("流程结束");

        for (String table : new String[]{
                "ACT_RU_EXECUTION", "ACT_RU_TASK", "ACT_RU_VARIABLE",
                "ACT_HI_PROCINST", "ACT_HI_TASKINST", "ACT_HI_ACTINST"}) {
            System.out.println(table + " = " + count(table));
        }
    }

    private long count(String table) {
        Long value = jdbcTemplate.queryForObject("select count(*) from " + table, Long.class);
        return value == null ? 0 : value;
    }
}
```

启动：

```bash
mvn spring-boot:run
```

`days = 5`，流程会经过总监审批；把 `days` 改成 `2`，排他网关会走默认流，直接到 HR 备案。

输出：

```text
processInstanceId = f62e7d80-...
待办：提交申请，处理人：zhangsan
待办：主管审批，处理人：lisi
待办：总监审批，处理人：wangwu
待办：HR 备案，处理人：hr
流程结束
ACT_RU_EXECUTION = 0
ACT_RU_TASK = 0
ACT_RU_VARIABLE = 0
ACT_HI_PROCINST = 1
ACT_HI_TASKINST = 4
ACT_HI_ACTINST = 13
```

这段代码用 `singleResult()`，前提是同一时刻只有一条待办。并行网关、多实例会同时产生多条任务，这时要用 `list()`，或者按 `taskDefinitionKey` 过滤。

## 运行后的数据

上面的 `count` 方法查的就是下面这几张表。换成文件模式的 H2 或 MySQL 后，也可以在数据库客户端执行这些 SQL：

```sql
select count(*) from ACT_RU_EXECUTION;
select count(*) from ACT_RU_TASK;
select count(*) from ACT_RU_VARIABLE;
select count(*) from ACT_HI_PROCINST;
select count(*) from ACT_HI_TASKINST;
select count(*) from ACT_HI_ACTINST;
```

这次实际运行的结果就是上一节输出里的六行：运行时表全部清空，历史表保留。这就是「运行态」和「历史态」分离的直接体现：正在跑的流程查 `ACT_RU_*`，跑完的流程查 `ACT_HI_*`。

H2 是内存库，应用停掉数据就没了。需要保留数据时换成文件模式的 H2，或者直接接 MySQL / PostgreSQL。生产用哪个库，Flowable 会按方言选择建表脚本。

## 常见问题

| 现象 | 原因 | 处理 |
| --- | --- | --- |
| 启动报找不到 `ACT_RE_DEPLOYMENT` 等表 | 没连上数据源，或 `database-schema-update` 为 `false` | 检查数据源配置；开发环境设为 `true` |
| 启动成功但查不到流程定义 | BPMN 文件名或路径不匹配 | 确认文件在 `classpath:/processes/`，后缀是 `.bpmn20.xml` |
| `No outgoing sequence flow ... could be selected` | 排他网关所有条件都不成立，且没有默认流 | 补 `default` 分支 |
| `Unknown property used in expression: days` | 变量没传或名字拼错 | 启动时补上 `days`，检查 UEL 表达式 |
| Spring Boot 3 项目启动失败 | Flowable 8 不再支持 Spring Boot 3 | 改用 Flowable 7.2.x，或升级到 Spring Boot 4 |
| 并行 / 多实例场景 `singleResult()` 报错 | 同时存在多条任务 | 改用 `list()`，按任务定义 key 过滤 |

下一篇在这个工程上做完整审批流：候选人认领、驳回撤回、会签，以及业务表怎么和流程实例关联。
