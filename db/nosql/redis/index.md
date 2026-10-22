---
title: Redis
date: 2026-10-16
category:
  - db
  - nosql
  - redis
tags:
  - db
  - nosql
  - redis
---

# Redis
[[toc]]

Redis 是一个以内存为主要工作介质的键值数据库。它把数据模型从“表和行”换成了“键和数据结构”，因此适合处理低延迟、访问模式明确的场景。Redis 也支持持久化、复制、发布订阅、事务、Lua 脚本和 Stream，因此不只是一个简单的缓存。

## 适合解决什么问题

Redis 的优势不只来自“数据放在内存里”，还来自它提供了与访问模式匹配的数据结构和原子命令：

- **缓存热点数据**：减少关系型数据库的重复查询，但需要处理过期、淘汰和缓存一致性。
- **计数与限流**：`INCR`、`INCRBY` 等命令对单个键的更新是原子的。
- **排行榜**：用 Sorted Set 的 score 表示排名依据。
- **短列表和队列**：用 List 或 Stream 保存有顺序的消息。
- **集合运算**：用 Set 做去重、交集、并集和差集。
- **会话共享**：多个应用实例通过同一个 Redis 保存会话状态。

Redis 不适合直接替代关系型数据库处理复杂关联查询、任意条件检索或强依赖多行事务的数据。把 Redis 当作主数据库时，还必须单独设计持久化、故障转移、备份和恢复方案。

## 数据类型

| 类别（核心数据类型 / 数据能力） | 主要特征 | 常见用途 | 常用命令 |
| --- | --- | --- | --- |
| 核心数据类型：String | 一个键对应一段二进制安全的值 | 缓存、计数器、分布式锁标记 | `GET`、`SET`、`INCRBY`、`SETEX` |
| 核心数据类型：Hash | 一个键下包含多个 field-value | 用户属性、对象的部分字段 | `HGET`、`HSET`、`HINCRBY` |
| 核心数据类型：List | 有序的字符串序列 | 最新列表、简单队列 | `LPUSH`、`RPUSH`、`LRANGE`、`LPOP` |
| 核心数据类型：Set | 无序且不重复 | 去重、标签、集合运算 | `SADD`、`SISMEMBER`、`SINTER` |
| 核心数据类型：Sorted Set | 每个成员有一个 score，按 score 排序 | 排行榜、带权重的优先级 | `ZADD`、`ZRANGE`、`ZRANK` |
| 数据能力：Bitmap | String 的位操作视图 | 签到、状态位统计 | `SETBIT`、`GETBIT`、`BITCOUNT` |
| 数据能力：HyperLogLog | 用近似算法统计基数 | 大规模 UV 估算 | `PFADD`、`PFCOUNT` |
| 核心数据类型：Stream | 带消息 ID 的追加日志 | 消息队列、消费者组 | `XADD`、`XREADGROUP`、`XACK` |

Redis 还提供 GEO、发布订阅和 Lua 脚本等能力。它们不是与 String、Hash、List 等完全平行的数据类型：例如 GEO 底层使用 Sorted Set，Bitmap 使用 String 的位操作。

## 键的生命周期

键相关命令可以独立于键保存的具体数据类型使用：

```text
SET profile:1001 "..."
EXPIRE profile:1001 300
TTL profile:1001
TYPE profile:1001
DEL profile:1001
```

常见命令的语义如下：

| 命令 | 作用 | 注意事项 |
| --- | --- | --- |
| `EXPIRE key seconds` | 设置相对过期时间 | 重新设置值时要确认是否会覆盖过期时间 |
| `PEXPIRE key milliseconds` | 以毫秒设置过期时间 | 需要更细粒度时使用 |
| `TTL key` | 查看剩余秒数 | 返回负数表示没有过期时间或键不存在 |
| `PERSIST key` | 移除过期时间 | 会让键变为持久键 |
| `SCAN cursor` | 增量遍历键 | 生产环境通常比 `KEYS *` 更安全 |
| `UNLINK key` | 异步回收键关联的内存 | 大键删除时可减少主线程阻塞 |

不要在生产环境对大库使用 `KEYS *`。它会一次性遍历整个键空间，在键很多时阻塞 Redis 的事件循环；排查和运维通常应优先使用 `SCAN`，并为业务键设计可管理的命名空间。

## 原子性与事务

Redis 的命令在服务器端按顺序执行。单条命令不会被另一个客户端的命令插入，因此 `INCR` 这类操作可以用于简单的并发计数。

`MULTI`、`EXEC`、`DISCARD` 和 `WATCH` 可以把多条命令组织成一个事务批次：

```text
WATCH stock:1001
MULTI
DECRBY stock:1001 1
EXEC
```

Redis 事务需要注意三点：

- 事务中的命令会按顺序执行，执行期间不会被其他客户端命令插入。
- 命令执行失败不会像关系型数据库那样自动回滚已经执行成功的命令。
- `WATCH` 只是在 `EXEC` 前检测被监视键是否发生变化；检测到变化时，事务会放弃执行。

需要把多条命令封装为一个不可分割的服务端操作时，可以使用 Lua 脚本或 Redis Functions。脚本应保持短小，避免长时间占用事件循环。

## 持久化与高可用

Redis 的持久化和高可用解决的是不同问题，不能把“有持久化”直接等同于“不会丢数据”：

- **RDB**：在某个时间点生成数据快照，文件紧凑，适合备份和重启恢复；两次快照之间的写入可能无法恢复。
- **AOF**：记录改变数据集的写命令，可以配置不同的刷盘策略；文件可能更大，重写用于控制体积。
- **复制**：副本从主节点同步数据，用于读扩展和故障恢复，但副本同步存在延迟。
- **Sentinel**：监控主从节点并协助故障检测、选主和通知客户端。
- **Cluster**：按槽位分片，把数据分布到多个主节点，并为槽位提供副本。

实际部署时，应根据可接受的恢复点目标（RPO）、恢复时间目标（RTO）、数据量和访问模式选择组合，而不是只打开一个配置项。持久化、备份、复制和故障转移都需要通过恢复演练验证。

## 与应用集成

应用代码一般只负责选择合适的数据结构和访问模式，连接池、序列化、超时、集群和哨兵配置属于客户端集成问题。Java/Spring 项目可参考 [Spring Boot 集成 Redis](/spring-boot/spring-boot-redis.html)，不要在业务文章中重复维护两套连接配置。

## 参考资料

- [Redis 数据类型](https://redis.io/docs/latest/develop/data-types/)
- [Redis 持久化](https://redis.io/docs/latest/operate/oss_and_stack/management/persistence/)
- [Redis 事务](https://redis.io/docs/latest/develop/interact/transactions/)
- [Redis Streams](https://redis.io/docs/latest/develop/data-types/streams/)
