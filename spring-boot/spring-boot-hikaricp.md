---
title: Spring Boot 集成 HikariCP
date: 2025-06-30
category:
  - spring
  - spring-boot-hikaricp
tags:
  - spring
  - spring-boot-hikaricp
---

# Spring Boot 集成 HikariCP
[[toc]]

HikariCP 是 Spring Boot 默认使用的 JDBC 连接池。Spring Boot 2.x 起，只要类路径上有数据访问相关的 starter，Boot 就会自动配置一个 `HikariDataSource`，不用手写数据源配置；要调连接池参数改 `application.yml` 即可，只有需要自己控制数据源创建时才写配置类。

本文以 Spring Boot 3.x 为准。

## 引入依赖

引入下面任一 starter 都会被间接带上 HikariCP，不需要再单独声明连接池依赖：

- `spring-boot-starter-jdbc`
- `spring-boot-starter-data-jpa`<Tip>包含 spring-boot-starter-jdbc</Tip>

以 MySQL 为例，pom 里加这两项即可：

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
</dependency>
```

## 配置连接池参数

HikariCP 自己的参数统一放在 `spring.datasource.hikari` 下，不写就走默认值：

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/mydb # JDBC连接URL
    username: username
    password: password
    driver-class-name: com.mysql.cj.jdbc.Driver # JDBC驱动类名
    hikari:
      pool-name: MyPool # 连接池名称
      maximum-pool-size: 10 # 最大连接数，默认10，通常设置为CPU核心数*2+有效磁盘数
      minimum-idle: 5 # 最小空闲连接数，可设为最大连接数一半
      connection-timeout: 30000 # 连接超时时间(ms)，默认30秒
      idle-timeout: 600000 # 连接空闲超时时间(ms)，默认10分钟
      max-lifetime: 1800000 # 连接生命周期，避免长时间运行的连接可能遇到的问题
```

## 自定义数据源

需要自己创建 `HikariDataSource` 时，用 `@Bean` 声明数据源，让 `@ConfigurationProperties` 把 `spring.datasource` 下的属性绑到它上面，再注册一个绑到这个数据源的 `JdbcTemplate`：

```java
package com.example.config;

import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

@Configuration
public class DataSourceConfig {
    @Bean(name = "dataSource")
    @ConfigurationProperties(prefix = "spring.datasource")
    public HikariDataSource dataSource() {
        return (HikariDataSource) DataSourceBuilder.create().type(HikariDataSource.class).build();
    }


    @Bean(name="jdbcTemplate")
    public JdbcTemplate jdbcTemplate(@Qualifier("dataSource") HikariDataSource dataSource){
        return new JdbcTemplate(dataSource);
    }
}
```

::: warning
上面「配置连接池参数」那节写的 `spring.datasource.url` 和 `spring.datasource.hikari.*`，是走 Boot 自动配置时的写法。这里把 `spring.datasource` 直接绑到 `HikariDataSource` 上，写法不一样：`HikariDataSource` 只有 `setJdbcUrl`、没有 `setUrl`，也没有 `setHikari`，沿用上面那套 key 会找不到对应的 setter、被静默忽略，jdbcUrl 落空。这个数据源对应的 yaml 应写成：
:::

```yaml
spring:
  datasource:
    jdbc-url: jdbc:mysql://localhost:3306/mydb # JDBC连接URL
    username: username
    password: password
    driver-class-name: com.mysql.cj.jdbc.Driver # JDBC驱动类名
    # 连接池参数直接挂在 spring.datasource 下，不带 hikari 一层
    pool-name: MyPool
    maximum-pool-size: 10
    minimum-idle: 5
    connection-timeout: 30000
    idle-timeout: 600000
    max-lifetime: 1800000
```
