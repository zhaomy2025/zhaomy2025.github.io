---
title: MyBatis-Plus 基于字段隔离的多租户
date: 2025-06-25T02:57:42.596Z
category:
  - java
  - orm
  - mybatis-plus-multi-tenant
tags:
  - java
  - orm
  - mybatis-plus-multi-tenant
---

# MyBatis-Plus 基于字段隔离的多租户
[[toc]]

::: tip
插件效果：所有 SQL 自动追加 WHERE tenant_id = xxx 条件，无需手动编写，支持静态租户ID、动态租户ID、多租户字段自动识别等。
:::
## 引入依赖

```xml
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>8.0.28</version>
</dependency>
<dependency>
    <groupId>com.baomidou</groupId>
    <artifactId>mybatis-plus-boot-starter</artifactId>
    <version>3.5.1</version>
</dependency>
```

## 配置多租户
::: code-tabs
@tab application.yml
```yaml
spring:
  datasource:
    url: jdbc:oracle:thin:@localhost:1521:orcl
    username: username
    password: password
    driver-class-name: oracle.jdbc.driver.OracleDriver

mybatis-plus:
  mapper-locations: classpath:mapper/*.xml
  type-aliases-package: com.example.demo.entity
  configuration:
    map-underscore-to-camel-case: true
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl
    use-generated-keys: true
    default-executor-type: REUSE
    use-actual-param-name: true
  global-config:
    db-config:
      id-type: auto # 全局主键生成策略
      logic-delete-field: deleted # 逻辑删除字段名
      logic-delete-value: 1 # 逻辑删除值
      logic-not-delete-value: 0 # 逻辑未删除值
```

@tab MyBatisConfig.java
```java
@Configuration
public class MyBatisConfig {    
    @Bean
    public MybatisPlusInterceptor mybatisPlusInterceptor() {
        MybatisPlusInterceptor interceptor = new MybatisPlusInterceptor();
        // 多租户插件（需在分页插件前添加）
        interceptor.addInnerInterceptor(new TenantLineInnerInterceptor(new TenantLineHandler() {
            @Override
            public Expression getTenantId() {
                // 静态租户ID
                // 实际可以将TenantId放在threadLocale中(比如xxxxContext中)，并获取。
                return new LongValue(1);
            }

            @Override
            public String getTenantIdColumn() {
                return "tenant_id"; // 默认字段名
            }

            @Override
            public boolean ignoreTable(String tableName) {
                return false; // 所有表均拼接租户条件
            }

            @Override
            public boolean ignoreInsert(List<Column> columns, String tenantIdColumn) {
                return TenantLineHandler.super.ignoreInsert(columns, tenantIdColumn);
            }
        }));
        return interceptor;
    }
}
```
:::