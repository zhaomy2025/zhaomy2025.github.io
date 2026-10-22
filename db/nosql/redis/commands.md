---
title: Redis 命令
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

# Redis 命令
[[toc]]

Redis 命令围绕键、数据类型和服务能力组织。先用 `TYPE key` 确认键对应的抽象数据类型，再选择对应的命令；如果需要了解当前内部表示，可以用 `OBJECT ENCODING key` 查看编码。

下面按常用场景整理命令。命令的参数、返回值和可用版本以当前 Redis 版本的官方文档为准；带有“旧命令”的条目仍可能出现在老项目中，新代码优先使用替代命令。

## 通用命令

通用命令主要处理键的查找、生命周期、重命名和遍历，不依赖键保存的是 String、Hash 还是其他类型。

| 命令 | 作用 |
| --- | --- |
| `EXISTS key` | 判断键是否存在 |
| `TYPE key` | 查看键对应的抽象数据类型 |
| `DEL key` | 同步删除键 |
| `UNLINK key` | 异步回收键占用的内存，适合大键删除 |
| `EXPIRE key seconds` | 设置秒级过期时间 |
| `PEXPIRE key milliseconds` | 设置毫秒级过期时间 |
| `EXPIREAT key timestamp` | 按 Unix 秒时间戳设置过期时间 |
| `PEXPIREAT key milliseconds` | 按 Unix 毫秒时间戳设置过期时间 |
| `TTL key` | 查看剩余秒数 |
| `PTTL key` | 查看剩余毫秒数 |
| `PERSIST key` | 移除过期时间 |
| `RENAME key newkey` | 重命名键 |
| `RENAMENX key newkey` | 仅在新键不存在时重命名 |
| `RANDOMKEY` | 随机返回一个键 |
| `SCAN cursor` | 增量遍历键空间 |
| `KEYS pattern` | 按模式查找键，生产环境大库通常不应使用 |
| `COPY source destination` | 复制键及其值 |
| `DUMP key` / `RESTORE key` | 导出和恢复键的序列化数据 |
| `OBJECT ENCODING key` | 查看键当前使用的内部编码 |
| `OBJECT IDLETIME key` | 查看键的空闲时间 |
| `MEMORY USAGE key` | 查看键占用的内存 |

`KEYS` 会一次性遍历整个键空间，可能阻塞 Redis 事件循环；在线排查通常优先使用 `SCAN`。

## String 命令

String 是 Redis 最基础的数据类型，也可以承载整数、浮点数和二进制安全的字节序列。

| 命令 | 作用 |
| --- | --- |
| `SET key value` | 写入字符串，可附带过期时间、条件和返回选项 |
| `GET key` | 读取字符串 |
| `MSET key value ...` | 批量写入多个键 |
| `MGET key ...` | 批量读取多个键 |
| `SETNX key value` | 仅在键不存在时写入 |
| `MSETNX key value ...` | 仅在所有目标键都不存在时批量写入 |
| `SETEX key seconds value` | 写入并设置秒级过期时间，旧式写法 |
| `PSETEX key milliseconds value` | 写入并设置毫秒级过期时间，旧式写法 |
| `GETDEL key` | 读取后删除键 |
| `GETEX key` | 读取并可同时调整过期时间 |
| `GETSET key value` | 写入新值并返回旧值 |
| `APPEND key value` | 在字符串末尾追加内容 |
| `STRLEN key` | 查看字符串字节长度 |
| `GETRANGE key start end` | 获取字符串的字节范围 |
| `SETRANGE key offset value` | 从指定字节偏移开始覆盖内容 |
| `INCR key` / `DECR key` | 对整数值加一或减一 |
| `INCRBY key increment` | 对整数值增加指定数值 |
| `DECRBY key decrement` | 对整数值减少指定数值 |
| `INCRBYFLOAT key increment` | 对浮点数增加指定数值 |

新代码通常用带选项的 `SET` 同时完成条件写入和过期时间设置，避免把 `SET` 与 `EXPIRE` 分成两个可能被打断的步骤。

## Hash 命令

Hash 适合把一个键组织成多个 field-value 字段，例如用户属性或对象的部分字段。

| 命令 | 作用 |
| --- | --- |
| `HSET key field value ...` | 写入一个或多个字段 |
| `HGET key field` | 读取一个字段 |
| `HMGET key field ...` | 批量读取字段 |
| `HGETALL key` | 读取全部字段和值 |
| `HDEL key field ...` | 删除字段 |
| `HEXISTS key field` | 判断字段是否存在 |
| `HSETNX key field value` | 仅在字段不存在时写入 |
| `HLEN key` | 查看字段数量 |
| `HKEYS key` | 读取全部字段名 |
| `HVALS key` | 读取全部字段值 |
| `HINCRBY key field increment` | 对字段中的整数加法 |
| `HINCRBYFLOAT key field increment` | 对字段中的浮点数加法 |
| `HSTRLEN key field` | 查看字段值的字节长度 |
| `HRANDFIELD key` | 随机读取字段 |
| `HSCAN key cursor` | 增量遍历 Hash 字段 |

## List 命令

List 是有序的字符串序列。命令通常从左端或右端操作，也可以按索引读取和修改。

| 命令 | 作用 |
| --- | --- |
| `LPUSH key element ...` | 从左端插入元素 |
| `RPUSH key element ...` | 从右端插入元素 |
| `LPUSHX key element ...` | 仅在 List 已存在时从左端插入 |
| `RPUSHX key element ...` | 仅在 List 已存在时从右端插入 |
| `LPOP key [count]` | 从左端弹出一个或多个元素 |
| `RPOP key [count]` | 从右端弹出一个或多个元素 |
| `LLEN key` | 查看元素数量 |
| `LRANGE key start stop` | 按索引范围读取元素 |
| `LINDEX key index` | 按索引读取元素 |
| `LSET key index element` | 按索引修改元素 |
| `LINSERT key BEFORE\|AFTER pivot element` | 在指定元素前或后插入 |
| `LREM key count element` | 删除指定数量的匹配元素 |
| `LTRIM key start stop` | 只保留指定索引范围 |
| `LPOS key element` | 查找元素的位置 |
| `BLPOP key ... timeout` | 阻塞式从左端弹出 |
| `BRPOP key ... timeout` | 阻塞式从右端弹出 |
| `LMOVE source destination LEFT\|RIGHT LEFT\|RIGHT` | 从一个 List 移动元素到另一个 List |
| `BLMOVE source destination ... timeout` | 阻塞式移动 List 元素 |
| `RPOPLPUSH source destination` | 弹出右端元素并推入另一个 List，旧式写法 |
| `BRPOPLPUSH source destination timeout` | 阻塞式移动 List 元素，旧式写法 |

`LMOVE` / `BLMOVE` 可以表达队列、栈和可靠消费中的常见移动操作；新代码优先使用它们替代 `RPOPLPUSH` 系列命令。

## Set 命令

Set 保存不重复、无序的字符串成员，适合去重、标签和集合运算。

| 命令 | 作用 |
| --- | --- |
| `SADD key member ...` | 添加成员 |
| `SREM key member ...` | 删除成员 |
| `SMEMBERS key` | 读取全部成员，小集合适用 |
| `SISMEMBER key member` | 判断成员是否存在 |
| `SMISMEMBER key member ...` | 批量判断成员是否存在 |
| `SCARD key` | 查看成员数量 |
| `SPOP key [count]` | 随机移除并返回成员 |
| `SRANDMEMBER key [count]` | 随机读取成员但不删除 |
| `SMOVE source destination member` | 移动成员到另一个 Set |
| `SINTER key ...` | 求交集 |
| `SUNION key ...` | 求并集 |
| `SDIFF key ...` | 求差集 |
| `SINTERSTORE destination key ...` | 保存交集结果 |
| `SUNIONSTORE destination key ...` | 保存并集结果 |
| `SDIFFSTORE destination key ...` | 保存差集结果 |
| `SINTERCARD numkeys key ...` | 只计算交集基数 |
| `SSCAN key cursor` | 增量遍历 Set 成员 |

## Sorted Set 命令

Sorted Set 保存 member 和 score，适合排行榜、按分值范围查询和带优先级的队列。

| 命令 | 作用 |
| --- | --- |
| `ZADD key score member ...` | 添加成员或更新 score |
| `ZREM key member ...` | 删除成员 |
| `ZSCORE key member` | 查看成员分值 |
| `ZMSCORE key member ...` | 批量查看成员分值 |
| `ZCARD key` | 查看成员数量 |
| `ZCOUNT key min max` | 按分值范围统计 |
| `ZINCRBY key increment member` | 增加成员分值 |
| `ZRANGE key start stop` | 按排名范围读取，支持 score / lex / rev 选项 |
| `ZRANK key member` | 查看成员的正向排名 |
| `ZREVRANK key member` | 查看成员的倒序排名 |
| `ZRANGEBYSCORE key min max` | 按分值范围读取，旧式写法 |
| `ZRANGEBYLEX key min max` | 按字典序范围读取，旧式写法 |
| `ZREVRANGE key start stop` | 按倒序排名读取，旧式写法 |
| `ZREVRANGEBYSCORE key max min` | 按倒序分值范围读取，旧式写法 |
| `ZRANGESTORE dst src min max` | 将范围结果保存到另一个 Sorted Set |
| `ZREMRANGEBYRANK key start stop` | 按排名范围删除 |
| `ZREMRANGEBYSCORE key min max` | 按分值范围删除 |
| `ZREMRANGEBYLEX key min max` | 按字典序范围删除 |
| `ZPOPMIN key [count]` | 弹出最小分值成员 |
| `ZPOPMAX key [count]` | 弹出最大分值成员 |
| `BZPOPMIN key ... timeout` | 阻塞式弹出最小分值成员 |
| `BZPOPMAX key ... timeout` | 阻塞式弹出最大分值成员 |
| `ZINTER numkeys key [key ...] ...` / `ZUNION numkeys key [key ...] ...` | 计算交集或并集 |
| `ZINTERSTORE destination numkeys key [key ...] ...` / `ZUNIONSTORE destination numkeys key [key ...] ...` | 保存交集或并集结果 |
| `ZINTERCARD numkeys key ...` | 只计算交集基数 |
| `ZRANDMEMBER key [count]` | 随机读取成员 |
| `ZSCAN key cursor` | 增量遍历成员 |

## Bitmap 命令

Bitmap 是 String 的位操作视图，不是独立的 Redis 对象类型。

| 命令 | 作用 |
| --- | --- |
| `SETBIT key offset value` | 设置某一位 |
| `GETBIT key offset` | 读取某一位 |
| `BITCOUNT key` | 统计置为 1 的位数 |
| `BITPOS key bit` | 查找第一个指定值的位 |
| `BITOP operation destkey key ...` | 对多个 Bitmap 做位运算 |
| `BITFIELD key ...` | 读取或修改多个位字段 |
| `BITFIELD_RO key ...` | 只读位字段操作 |

## HyperLogLog 命令

HyperLogLog 用近似算法估算基数，适合大规模 UV 等统计场景。

| 命令 | 作用 |
| --- | --- |
| `PFADD key element ...` | 添加待统计元素 |
| `PFCOUNT key ...` | 估算基数 |
| `PFMERGE destkey sourcekey ...` | 合并多个 HyperLogLog |

## Stream 命令

Stream 是带消息 ID 的追加日志，可配合消费者组实现消息消费。

| 命令 | 作用 |
| --- | --- |
| `XADD key id field value ...` | 追加消息 |
| `XLEN key` | 查看消息数量 |
| `XRANGE key start end` | 按正向范围读取消息 |
| `XREVRANGE key end start` | 按反向范围读取消息 |
| `XREAD ...` | 读取一个或多个 Stream |
| `XGROUP CREATE ...` | 创建消费者组 |
| `XREADGROUP GROUP ...` | 以消费者组身份读取 |
| `XACK key group id ...` | 确认消息 |
| `XPENDING key group` | 查看待处理消息 |
| `XCLAIM key group consumer min-idle-time id ...` | 转移待处理消息 |
| `XAUTOCLAIM key group consumer min-idle-time start` | 自动转移待处理消息 |
| `XDEL key id ...` | 删除消息 |
| `XTRIM key ...` | 裁剪 Stream |
| `XINFO ...` | 查看 Stream、消费者组和消费者信息 |

## GEO 命令

GEO 命令基于 Sorted Set 保存地理位置数据。

| 命令 | 作用 |
| --- | --- |
| `GEOADD key longitude latitude member ...` | 添加地理位置 |
| `GEOPOS key member ...` | 查询经纬度 |
| `GEOHASH key member ...` | 查询 GeoHash |
| `GEODIST key member1 member2` | 计算距离 |
| `GEOSEARCH key ...` | 按圆形或矩形范围搜索 |
| `GEOSEARCHSTORE destination source ...` | 保存地理范围搜索结果 |

## Pub/Sub 命令

Pub/Sub 通过频道发布和订阅消息，不负责消息持久化和离线补发。

| 命令 | 作用 |
| --- | --- |
| `PUBLISH channel message` | 发布消息 |
| `SUBSCRIBE channel ...` | 订阅频道 |
| `UNSUBSCRIBE channel ...` | 取消频道订阅 |
| `PSUBSCRIBE pattern ...` | 按模式订阅频道 |
| `PUNSUBSCRIBE pattern ...` | 取消模式订阅 |
| `PUBSUB ...` | 查询频道和订阅信息 |
| `SSUBSCRIBE shardchannel ...` | 订阅分片频道 |
| `SPUBLISH shardchannel message` | 发布分片频道消息 |
| `SUNSUBSCRIBE shardchannel ...` | 取消分片频道订阅 |

## 事务、脚本与 Functions

| 命令 | 作用 |
| --- | --- |
| `MULTI` | 开始事务队列 |
| `EXEC` | 执行事务队列 |
| `DISCARD` | 丢弃事务队列 |
| `WATCH key ...` | 监视键的变化 |
| `UNWATCH` | 取消监视 |
| `EVAL script numkeys ...` | 执行 Lua 脚本 |
| `EVALSHA sha1 numkeys ...` | 按 SHA1 执行已缓存脚本 |
| `EVAL_RO` / `EVALSHA_RO` | 只读 Lua 脚本 |
| `SCRIPT LOAD` / `SCRIPT EXISTS` | 管理脚本缓存 |
| `SCRIPT KILL` / `SCRIPT FLUSH` | 中止或清理脚本 |
| `FUNCTION LOAD` | 加载 Redis Function |
| `FCALL function numkeys ...` | 调用 Redis Function |
| `FCALL_RO function numkeys ...` | 只读调用 Redis Function |

## 连接与服务管理

这些命令面向连接、实例或运维管理，不属于某一种数据类型。

| 命令 | 作用 |
| --- | --- |
| `PING` | 检查连接 |
| `AUTH` | 身份认证 |
| `SELECT index` | 切换逻辑数据库 |
| `CLIENT ...` | 查看和管理客户端连接 |
| `ACL ...` | 管理访问控制列表 |
| `INFO` | 查看服务器信息 |
| `ROLE` | 查看实例角色 |
| `DBSIZE` | 查看当前数据库键数量 |
| `FLUSHDB` / `FLUSHALL` | 清空当前数据库或全部数据库，执行前必须确认目标 |
| `CONFIG ...` | 查看或修改配置 |
| `SLOWLOG ...` | 查看慢日志 |
| `LATENCY ...` | 查看延迟事件 |
| `MEMORY ...` | 查看内存使用情况 |
| `SAVE` / `BGSAVE` | 创建 RDB 快照 |
| `BGREWRITEAOF` | 重写 AOF |
| `REPLICAOF` | 配置复制关系 |
| `FAILOVER` | 执行故障转移 |
| `TIME` | 获取 Redis 服务器时间 |
| `WAIT` / `WAITAOF` | 等待复制或 AOF 达到指定确认条件 |
| `SHUTDOWN` | 关闭 Redis 服务 |

`FLUSHDB`、`FLUSHALL` 和 `SHUTDOWN` 会影响实例状态，不应在生产环境直接执行。