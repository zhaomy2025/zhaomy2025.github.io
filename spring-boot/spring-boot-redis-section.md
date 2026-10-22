Redis 是一个键值数据库。Spring Data Redis 用 `RedisTemplate` 把 Java 方法转换成 Redis 命令，Spring Boot 则通过 Starter 自动准备连接和模板。

<Card title="Spring Data Redis 是什么">Spring 生态中用于访问 Redis 的数据访问框架，封装了 Lettuce、Jedis 等 Java 客户端，提供 `RedisTemplate`、`StringRedisTemplate`、连接工厂和序列化支持。它不是 Redis 服务器，也不是独立的 Redis 客户端。</Card>

先记住这条调用链：

```text
业务代码
  ↓
RedisTemplate / StringRedisTemplate    操作数据
  ↓
RedisConnectionFactory                管理连接
  ↓
Lettuce 或 Jedis                      Java Redis 客户端
  ↓
Redis Server
```

新项目通常不需要手动创建连接工厂。引入 `spring-boot-starter-data-redis`，配置 Redis 地址后，Spring Boot 默认使用 Lettuce，并自动创建连接工厂、`RedisTemplate` 和 `StringRedisTemplate`。

实际开发可以按三步走：

1. 引入 Starter，配置 Redis 连接信息。
2. 只存字符串时直接注入 `StringRedisTemplate`。
3. 需要存 Java 对象时，再配置 JSON 序列化的 `RedisTemplate`。

Jedis、Lettuce、连接池、事务和响应式 API 都是按需了解的扩展点，不需要在第一次使用 Redis 时全部掌握。