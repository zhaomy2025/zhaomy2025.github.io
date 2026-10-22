---
title: Spring Boot 集成 Redis
date: 2025-06-05
category:
  - spring
  - spring-boot-redis
tags:
  - spring
  - spring-boot-redis
---

# Spring Boot 集成 Redis
[[toc]]

## 简介
<!-- @include: ./spring-boot-redis-section.md -->

本文以 Spring Boot 3.x 为准（配置前缀按 3.0 起改名的 `spring.data.redis.*` 写；2.x 去掉 `data` 一层即可）。

## 环境准备

### 添加依赖

在 `pom.xml` 中添加 Spring Boot Redis Starter：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
```

只有在需要连接池时，才额外添加 `commons-pool2`：

```xml
<dependency>
    <groupId>org.apache.commons</groupId>
    <artifactId>commons-pool2</artifactId>
</dependency>
```

### 配置 Redis 连接

在 `application.yml` 中配置 Redis：

```yaml
spring:
  data:
    redis:
      host: localhost
      port: 6379
      password:                 # 没有密码时留空
      database: 0               # 使用的数据库索引
      timeout: 3000ms           # 读写超时时间
      connect-timeout: 3000ms   # 建立连接的超时时间
```

::: tip 配置前缀
Spring Boot 3.x 使用 `spring.data.redis.*`；Spring Boot 2.x 使用 `spring.redis.*`。如果项目使用 Boot 2.x，把上面的 `data` 去掉即可。
:::

配置完成后，Spring Boot 会自动创建连接工厂和两个常用模板。初学者不需要先手动写 `new LettuceConnectionFactory(...)`。

## RedisTemplate 和 StringRedisTemplate

### 先记住区别

`RedisTemplate` 和 `StringRedisTemplate` 都是操作 Redis 的工具。区别在于它们默认怎样处理 Java 数据：

| 项目 | `StringRedisTemplate` | `RedisTemplate<K, V>` |
| --- | --- | --- |
| 适合存储 | 字符串、数字、简单 JSON 字符串 | Java 对象、字符串和复杂数据 |
| Key | `String` | 通常使用 `String`，也可以是其他类型 |
| Value | `String` | 由泛型和序列化器决定 |
| 数据可读性 | Redis CLI 中通常可以直接看懂 | 取决于配置，JDK 序列化通常不可读 |
| 使用难度 | 开箱即用 | 需要明确序列化方式 |

可以把 `StringRedisTemplate` 理解成已经配置好的 `RedisTemplate<String, String>`：key 和 value 都按字符串处理。

### 什么时候使用哪个

- 只保存字符串、数字、计数结果：使用 `StringRedisTemplate`。
- 自己把 Java 对象转换成 JSON 字符串：也可以使用 `StringRedisTemplate`。
- 希望直接把 `User`、订单等 Java 对象交给模板：使用配置了 JSON 序列化器的 `RedisTemplate`。

### 字符串示例

```java
@Service
public class UserNameService {

    private final StringRedisTemplate redisTemplate;

    public UserNameService(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public void saveName() {
        redisTemplate.opsForValue().set("user:1:name", "Alice");
    }

    public String getName() {
        return redisTemplate.opsForValue().get("user:1:name");
    }
}
```

Redis 中保存的内容可以直接看懂：

```text
user:1:name -> Alice
```

### 通用模板示例

下面的 `RedisTemplate<String, Object>` 只是为了展示 API。它能操作对象，但对象最终仍然要经过序列化；真正缓存业务对象时，建议在后面的配置中明确指定 JSON 序列化器。

```java
// 字符串
stringRedisTemplate.opsForValue().set("key", "value");
String value = stringRedisTemplate.opsForValue().get("key");

// Hash
redisTemplate.opsForHash().put("user:2", "name", "Alice");
redisTemplate.opsForHash().put("user:2", "age", "25");
Map<Object, Object> userMap = redisTemplate.opsForHash().entries("user:2");

// List
redisTemplate.opsForList().rightPush("messages", "hello");
List<Object> messages = redisTemplate.opsForList().range("messages", 0, -1);

// Set
redisTemplate.opsForSet().add("tags", "java", "spring", "redis");

// 删除 key
redisTemplate.delete("key");
```

::: warning 同一个 key 不要混用不兼容的模板
Redis 只保存字节，不认识 Java 对象。写入和读取必须使用兼容的序列化方式。不要让同一个 key 一会儿由 `StringRedisTemplate` 写入，一会儿又由使用 JDK 序列化或另一套 JSON 配置的 `RedisTemplate` 读取，否则可能出现乱码、类型转换异常或反序列化失败。
:::

## 高级配置：先看懂它在配置什么

这一节的代码看起来较长，但实际上只解决两个问题：

1. **怎么连接 Redis**：由 `RedisConnectionFactory` 负责。
2. **Java 数据怎么变成 Redis 能保存的字节**：由序列化器负责。

完整的调用关系是：

```text
业务代码
  ↓
RedisTemplate / StringRedisTemplate   操作数据
  ↓
RedisConnectionFactory               管理连接
  ↓
Lettuce 或 Jedis                     Java Redis 客户端
  ↓
Redis Server
```

### JedisConnectionFactory 和 LettuceConnectionFactory

它们都是 Spring Data Redis 的连接工厂。连接工厂不是 Redis 服务器，而是 Spring 用来管理客户端连接的对象。

| 项目 | Jedis | Lettuce |
| --- | --- | --- |
| Spring 连接工厂 | `JedisConnectionFactory` | `LettuceConnectionFactory` |
| 底层 Java 客户端 | Jedis | Lettuce |
| 并发模型 | 传统阻塞式客户端，并发时通常配合连接池 | 基于 Netty，支持连接复用、异步和响应式操作 |
| 新项目建议 | 除非项目明确要求，否则不必主动选择 | Spring Boot 默认选择，通常直接使用 |
| 常见使用原因 | 老项目已经使用 Jedis，或已有 Jedis 连接池 | 新项目、并发访问、响应式应用 |

Spring Boot 已经根据项目依赖自动选择连接工厂。新项目通常只需要：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
```

只有需要切换客户端或覆盖默认连接参数时，才需要手动声明对应的连接工厂。Jedis 和 Lettuce 是两个不同的 Java 客户端，Redis 服务器本身没有变化。

### 为什么要配置序列化器

Redis 只接收字节。以 `User` 对象为例，写入 Redis 时要经历：

```text
User 对象 → 序列化 → 字节 → Redis
Redis → 字节 → 反序列化 → User 对象
```

常见的配置思路是：

- key 使用 `StringRedisSerializer`，这样 `user:1` 这样的 key 在 Redis CLI 中可读。
- value 使用 JSON 序列化器，这样对象可以保存为 JSON，而不是难以阅读的 JDK 二进制数据。
- Hash 的 field 通常也使用字符串序列化器。
- Hash 的 value 根据实际对象类型选择 JSON 序列化器。

### 为明确类型的对象配置 JSON

如果一个模板只负责缓存 `User`，可以为它配置明确的类型。示例中的 `User.class` 表示这个模板的 value 都按 `User` 处理：

```java
@Configuration
public class RedisConfig {

    @Bean
    public RedisTemplate<String, User> userRedisTemplate(
            RedisConnectionFactory connectionFactory,
            ObjectMapper objectMapper) {
        RedisTemplate<String, User> template = new RedisTemplate<>();
        // 指定连接工厂，模板通过它访问 Redis
        template.setConnectionFactory(connectionFactory);

        StringRedisSerializer stringSerializer = new StringRedisSerializer();
        Jackson2JsonRedisSerializer<User> jsonSerializer = new Jackson2JsonRedisSerializer<>(objectMapper, User.class);

        // 普通 key 使用字符串序列化，保证 user:1 这样的 key 可读
        template.setKeySerializer(stringSerializer);
        // Hash 的 field 使用字符串序列化
        template.setHashKeySerializer(stringSerializer);

        // 普通 value 使用 JSON 序列化，按 User 类型读写
        template.setValueSerializer(jsonSerializer);
        // Hash 的 value 使用 JSON 序列化，按 User 类型读写
        template.setHashValueSerializer(jsonSerializer);

        // 完成模板初始化，使前面的配置生效
        template.afterPropertiesSet();
        return template;
    }
}
```

使用时可以直接存取 `User`：

```java
userRedisTemplate.opsForValue().set("user:1", user);
User cachedUser = userRedisTemplate.opsForValue().get("user:1");
```

这里没有直接配置 `LettuceConnectionFactory`，因为它已经由 Spring Boot 自动提供，并通过参数注入进来了。

::: tip 多种对象共用一个模板
如果同一个模板需要保存多种类型的对象，可以考虑 `GenericJackson2JsonRedisSerializer`，但要先了解类型信息、反序列化边界和允许的类型范围。不要为了“所有对象都能自动保存”就盲目打开全局默认类型信息；反序列化外部可控数据时尤其要使用安全的类型限制。
:::

### 序列化方式怎么选

| 序列化方式 | 优点 | 注意事项 | 常见用途 |
| --- | --- | --- | --- |
| <RedText>StringRedisSerializer</RedText> | 简单、可读、性能好 | 只能直接处理字符串 | key、字符串 value |
| <OrangeText>Jackson2JsonRedisSerializer&lt;T&gt;</OrangeText> | JSON 可读，类型明确 | 一个模板通常对应一个明确类型 | `User`、订单等固定类型 |
| <YellowText>Generic</YellowText><OrangeText>Jackson2JsonRedisSerializer</OrangeText> | 可保存多种对象类型 | 需要理解类型信息和安全边界 | **多类型缓存**，按项目规范使用 |
| <GreenText>GenericFastJsonRedisSerializer</GreenText> | 序列化速度快，中文支持好 | 存在安全争议，类型信息处理不如 Jackson 灵活 | **高性能场景**，中文内容存储 |
| <BlueText>JdkSerializationRedisSerializer</BlueText> | Java 对象几乎都可处理 | 内容不可读，兼容性和跨语言能力较差 | 兼容已有旧数据 |

各方案选型建议：

1. **Key 序列化**：统一使用 <RedText>StringRedisSerializer</RedText>。
2. **简单 Value**：缓存字符串、数字等值时使用 <RedText>StringRedisSerializer</RedText>。
3. **复杂对象**：
   - 需要明确类型和类型安全：使用 <OrangeText>Jackson2JsonRedisSerializer&lt;T&gt;</OrangeText>。
   - 需要支持多种对象类型或多态对象：按项目规范使用 <YellowText>Generic</YellowText><OrangeText>Jackson2JsonRedisSerializer</OrangeText>。
   - 已有 FastJSON 依赖且确实有性能需求：再考虑 <GreenText>GenericFastJsonRedisSerializer</GreenText>。
4. **不推荐方案**：除非需要兼容旧系统，否则不要使用 <BlueText>JdkSerializationRedisSerializer</BlueText>。

使用 FastJSON 时需特别注意反序列化安全，至少启用安全模式或配置允许的类型范围：

```java
// 启用安全模式，避免反序列化不受信任的类型
ParserConfig.getGlobalInstance().setSafeMode(true);

// 或者只允许业务包中的类型
ParserConfig.getGlobalInstance().addAccept("com.yourpackage.");
```

一般建议：key 统一使用字符串；简单 value 使用字符串；固定类型对象使用明确类型的 Jackson JSON；不要把“能序列化”误认为“适合长期存储”。

## 使用 Redis 缓存

前面的 `RedisTemplate` 是直接操作 Redis 数据。缓存注解是另一层抽象：应用只声明“这个方法的结果需要缓存”，Spring 负责调用方法前查询缓存、调用方法后写入缓存。

### 启用缓存支持

```java
@SpringBootApplication
@EnableCaching
public class MyApplication {
    public static void main(String[] args) {
        SpringApplication.run(MyApplication.class, args);
    }
}
```

[`@EnableCaching`](../spring-framework/annotations/enable-annotations.md#常见的-enablexxx-一览) 也可以放在配置类上。

### 使用缓存注解

```java
@Service
public class UserService {

    @Cacheable(value = "users", key = "#id")
    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    @CachePut(value = "users", key = "#user.id")
    public User updateUser(User user) {
        return userRepository.save(user);
    }

    @CacheEvict(value = "users", key = "#id")
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}
```

`@Cacheable`、`@CachePut` 和 `@CacheEvict` 的含义不同：

- `@Cacheable`：缓存命中时直接返回，不再执行方法。
- `@CachePut`：执行方法，并把返回结果放入缓存。
- `@CacheEvict`：删除指定缓存。

## Redis 集群和哨兵配置

集群和哨兵是 Redis 的部署形态，不是 `RedisTemplate` 的替代品：

- Template 负责操作数据。
- ConnectionFactory 负责连接客户端和 Redis。
- Cluster / Sentinel 决定 Redis 节点如何部署，以及客户端如何发现节点。

### 集群模式

Redis Cluster 按槽位分片。Spring Boot 只需要知道若干初始节点，客户端会根据 Redis 返回的槽位信息处理重定向：

```yaml
spring:
  data:
    redis:
      cluster:
        nodes:
          - 192.168.1.1:7000
          - 192.168.1.1:7001
          - 192.168.1.2:7000
        max-redirects: 3
```

### 哨兵模式

Sentinel 负责监控主从节点和故障转移。客户端需要知道 master 名称以及 Sentinel 节点：

```yaml
spring:
  data:
    redis:
      sentinel:
        master: mymaster
        nodes:
          - 192.168.1.1:26379
          - 192.168.1.2:26379
          - 192.168.1.3:26379
```

集群和哨兵不能同时配置；选择哪一种取决于 Redis 的部署方式。

## 性能优化建议

1. 先测量再调整连接池大小，不要直接套用一个固定数字。
2. 控制 key 和 value 的大小，避免把超大对象放入单个 key。
3. 批量操作使用 `multiSet(...)`、`multiGet(...)` 等批量 API，减少网络往返。
4. 高频访问数据可以考虑本地缓存 + Redis 的多级缓存，但要设计失效策略。
5. 监控 Redis 内存、命中率、慢查询和连接数，设置合理的淘汰策略。

## 常见问题

1. **连接超时**：检查 Redis 地址、防火墙和 `connect-timeout` 配置。
2. **序列化错误**：检查写入和读取是否使用兼容的序列化器，而不是只检查对象是否实现 `Serializable`。
3. **内存不足**：检查大 key、内存使用情况和 `maxmemory-policy`。
4. **缓存穿透**：对不存在的数据设置短 TTL 的空值缓存，或使用布隆过滤器。
5. **缓存击穿**：热点 key 失效时，多个请求可能同时回源，需要互斥刷新或逻辑过期策略。
6. **缓存雪崩**：大量 key 同时过期会形成集中回源，可以给 TTL 增加随机抖动。

理解 Redis 集成时，不要把所有类和配置看成一个问题：先用模板完成数据操作，再根据数据类型选择序列化方式；连接工厂、客户端、连接池、缓存注解和集群部署，分别解决不同层次的问题。