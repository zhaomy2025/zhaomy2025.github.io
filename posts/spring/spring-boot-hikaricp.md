---
title: SpringBoot 集成 HikariCP
date: 2025-06-30T01:06:24.974Z
category:
  - spring
  - spring-boot-hikaricp
tags:
  - spring
  - spring-boot-hikaricp
---

# SpringBoot 集成 HikariCP
[[toc]]

1. 引入依赖
   - Spring Boot Starter 间接引入，以下依赖都会引入 HikariCP 依赖
     + spring-boot-starter-jdbc
     + spring-boot-starter-data-jpa<Tip>包含 spring-boot-starter-jdbc</Tip>
   - Spring Boot 2.x 开始默认使用 HikariCP 作为连接池，隐式引入 HikariCP 依赖
   
2. 如果需要自定义 HikariCP 配置，可在 application.yml 中配置
3. 通过 @Bean 注解配置 HikariCP 数据源，并注入 JdbcTemplate 对象

::: code-tabs
@tab pom.xml
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-security</artifactId>
</dependency>
```
@tab application.yml
```yaml
# application.yml 配置示例
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

@tab OracleDataSourceConfig.java
```java 
package zmy.config;

import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

@Configuration
public class OracleDataSourceConfig {
    @Bean(name = "OracleDataSource")
    @ConfigurationProperties(prefix = "spring.datasource.oracle")
    public HikariDataSource dataSource() {
        return (HikariDataSource) DataSourceBuilder.create().type(HikariDataSource.class).build();
    }


    @Bean(name="oracleJdbcTemplate")
    public JdbcTemplate oracleJdbcTemplate(@Qualifier("OracleDataSource") HikariDataSource OracleDataSource){
        return new JdbcTemplate(OracleDataSource);
    }
}
```

:::