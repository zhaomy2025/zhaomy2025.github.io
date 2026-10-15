Redis是最常用的KV数据库，Spring 通过模板方式（RedisTemplate）提供了对Redis的数据查询和操作功能。

Spring Boot 为 Redis 集成提供了开箱即用的支持，通过 spring-boot-starter-data-redis 简化了配置流程。该 starter 会自动配置 Redis 连接工厂和模板类，开发者只需关注业务实现即可。

在客户端选择方面，Spring Boot 2.x 默认使用高性能的 Lettuce 客户端（支持响应式编程和连接复用），而 1.x 版本则采用 Jedis。

当存在相关依赖时，还会激活可选功能：
- 若检测到 commons-pool2 依赖，会自动配置连接池
- 检测到事务支持时，把 Redis 连接绑定到已有事务上（Spring Data Redis 本身不提供 `PlatformTransactionManager`；要用 Redis 自己的 MULTI/EXEC 事务，还要在连接工厂上显式开启 `setEnableTransactionSupport(true)`）
- 支持 @Cacheable 等注解的 Redis 缓存实现
- 引入 spring-boot-starter-data-redis-reactive 时支持 ReactiveRedisTemplate

实际开发中只需三步：
1. 引入 starter 依赖，自动获取 RedisTemplate 和连接工厂
2. 通过 @Bean 自定义 RedisTemplate，主要配置序列化器（推荐使用 JSON 格式）
3. 直接注入 RedisTemplate 即可操作各种数据结构



