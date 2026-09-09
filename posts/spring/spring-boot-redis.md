---
title: Spring Boot 集成 Redis
date: 2025-06-05T05:37:32.740Z
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
<!-- @include:./spring-boot-redis-intro.md -->

## 环境准备

###  添加依赖
在 `pom.xml` 中添加 Spring Boot Redis Starter 依赖：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>

<!-- 如果需要连接池 -->
<dependency>
    <groupId>org.apache.commons</groupId>
    <artifactId>commons-pool2</artifactId>
</dependency>
```

###  配置 Redis 连接

在 `application.yml` 或 `application.properties` 中配置 Redis：

```yaml
spring:
  redis:
    host: localhost     # Redis服务器地址
    port: 6379         # Redis服务器端口
    password:          # Redis密码（没有则留空）
    database: 0        # 使用的数据库索引（0-15）
    timeout: 3000ms    # 连接超时时间
    lettuce:
      pool:
        max-active: 8  # 连接池最大连接数
        max-idle: 8    # 连接池最大空闲连接数
        min-idle: 0    # 连接池最小空闲连接数
```

## 基础使用

###  注入 RedisTemplate

Spring Boot 自动配置了 `RedisTemplate` 和 `StringRedisTemplate`：

```java
@Autowired
private RedisTemplate<String, Object> redisTemplate;

@Autowired
private StringRedisTemplate stringRedisTemplate;
```

###  基本操作示例

```java
// 字符串操作
stringRedisTemplate.opsForValue().set("key", "value");
String value = stringRedisTemplate.opsForValue().get("key");

// 对象操作（自动序列化）
User user = new User("John", 30);
redisTemplate.opsForValue().set("user:1", user);
User cachedUser = (User) redisTemplate.opsForValue().get("user:1");

// Hash操作
redisTemplate.opsForHash().put("user:2", "name", "Alice");
redisTemplate.opsForHash().put("user:2", "age", "25");
Map<Object, Object> userMap = redisTemplate.opsForHash().entries("user:2");

// List操作
redisTemplate.opsForList().rightPush("messages", "hello");
List<Object> messages = redisTemplate.opsForList().range("messages", 0, -1);

// Set操作
redisTemplate.opsForSet().add("tags", "java", "spring", "redis");

// 删除key
redisTemplate.delete("key");
```

## 高级配置

###  自定义 RedisTemplate
RedisTemplate 是 Spring Data Redis 提供的核心操作类，通过自定义配置可以优化序列化方式、增强功能并适应特定业务场景。

默认实现的局限性：
- 使用 JDK 序列化，可读性差且占用空间大
- 所有 key 和 value 使用相同序列化方式
- 不支持复杂对象的 JSON 序列化

扩展一般包含以下内容：
  1. 配置连接工厂：有 JedisConnectionFactory、LettuceConnectionFactory 等
  2. 自定义 key 和 value 序列化器：key 采用 StringRedisSerializer，value 根据业务场景选择
```java
@Configuration
public class RedisConfig {
    
    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory factory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        // 配置连接工厂，有 JedisConnectionFactory、LettuceConnectionFactory 等
        template.setConnectionFactory(factory);
        
        // 使用Jackson2JsonRedisSerializer序列化value
        Jackson2JsonRedisSerializer<Object> serializer = new Jackson2JsonRedisSerializer<>(Object.class);
        // ObjectMapper 是 Jackson 的核心类，负责序列化和反序列化
        ObjectMapper mapper = new ObjectMapper();
        // 默认配置下会忽略 transient 字段，仅序列化 public 字段和方法
        // PropertyAccessor.ALL 表示对所有属性类型生效
        // Visibility.ANY 表示所有访问修饰符的字段都可见
        mapper.setVisibility(PropertyAccessor.ALL, JsonAutoDetect.Visibility.ANY);
        // 为非 final 类添加类型信息
        mapper.activateDefaultTyping(mapper.getPolymorphicTypeValidator(), 
                                   ObjectMapper.DefaultTyping.NON_FINAL);
        serializer.setObjectMapper(mapper);
        
        // 设置序列化器：key采用StringRedisSerializer，value采用上面配置的Jackson2JsonRedisSerializer
        template.setKeySerializer(new StringRedisSerializer());
        template.setValueSerializer(serializer);
        template.setHashKeySerializer(new StringRedisSerializer());
        template.setHashValueSerializer(serializer);
        
        template.afterPropertiesSet();
        return template;
    }
}
```
序列化方案对比：
| 序列化方式|	优点|	缺点|	适用场景|
| --- | --- | --- | --- |
| StringRedisSerializer|	可读性好，性能高|	仅支持String|	Key序列化|
| Jackson2JsonRedisSerializer|	可读性好，支持复杂对象|	稍慢于二进制，需处理类型信息|	复杂对象存储（需明确类型）|
| GenericJackson2JsonRedisSerializer|	自动类型信息，支持多态对象|	额外存储类型信息，反序列化需要类型匹配|	多类型Value|
| GenericFastJsonRedisSerializer| 序列化速度快，中文支持好|安全性争议，类型信息处理不如 Jackson 灵活	|高性能场景，中文内容存储|
| JdkSerializationRedisSerializer|	支持所有Serializable对象|	二进制不可读，兼容性差|	不推荐使用|

各方案选型建议
1. Key 序列化：
  ✅ 强制使用 StringRedisSerializer（所有方案统一）
2. 简单 Value 场景：
  ✅ StringRedisSerializer（如缓存字符串、数字等）
3. 复杂对象存储：
    - 需要类型安全 → Jackson2JsonRedisSerializer
    - 追求极致性能 → GenericFastJsonRedisSerializer
    - 多态对象支持 → GenericJackson2JsonRedisSerializer
4. 不推荐方案：
  ❌ JdkSerializationRedisSerializer（除非兼容旧系统）

安全注意事项：
使用 FastJson 时需特别注意：
```java
// 必须配置安全模式（防止反序列化漏洞）
ParserConfig.getGlobalInstance().setSafeMode(true);

// 或白名单控制
ParserConfig.getGlobalInstance().addAccept("com.yourpackage.");
```
###  使用 Redis 缓存

1. 启用缓存支持：

```java
@SpringBootApplication
@EnableCaching
public class MyApplication {
    public static void main(String[] args) {
        SpringApplication.run(MyApplication.class, args);
    }
}
```
`@EnableCaching`也可放在`RedisConfig`类上（如果自定义RedisTemplate）。

2. 在方法上使用缓存注解：

```java
@Service
public class UserService {
    
    @Cacheable(value = "users", key = "#id")
    public User getUserById(Long id) {
        // 模拟数据库查询
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

## Redis 集群和哨兵配置

###  集群模式配置

```yaml
spring:
  redis:
    cluster:
      nodes: 192.168.1.1:7000,192.168.1.1:7001,192.168.1.2:7000
      max-redirects: 3  # 最大重定向次数
```

###  哨兵模式配置

```yaml
spring:
  redis:
    sentinel:
      master: mymaster
      nodes: 192.168.1.1:26379,192.168.1.2:26379,192.168.1.3:26379
```

## 性能优化建议

1. 合理使用连接池配置
2. 对大value考虑压缩后再存储
3. 批量操作使用 `multiSet`/`multiGet` 代替循环
4. 高频访问数据考虑本地缓存+Redis多级缓存
5. 监控Redis内存使用情况，设置合理的淘汰策略

## 常见问题解决

1. **连接超时**：检查防火墙设置和Redis配置的`timeout`
2. **序列化错误**：确保所有存储的对象实现`Serializable`或配置了合适的序列化器
3. **内存溢出**：监控Redis内存使用，配置`maxmemory-policy`
4. **缓存穿透**：对空结果也进行缓存或使用布隆过滤器

通过以上配置和使用方式，Spring Boot应用可以高效地集成Redis，实现缓存、会话共享、分布式锁等功能。