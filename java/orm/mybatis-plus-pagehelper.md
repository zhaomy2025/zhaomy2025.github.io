---
title: MyBatis Plus PageHelper分页
date: 2025-06-24T08:32:45.088Z
category:
  - java
  - orm
  - mybatis-pagehelper
tags:
  - java
  - orm
  - mybatis-pagehelper
---

# MyBatis-Plus PageHelper分页
[[toc]]
MyBatis默认实现中采用的是逻辑分页，从数据库将所有记录查询出来，存储到内存中，展示当前页，然后数据再直接从内存中获取，所以才诞生了PageHelper一类的物理分页框架。

## 引入依赖

```xml
<dependency>
    <groupId>com.github.pagehelper</groupId>
    <artifactId>pagehelper-spring-boot-starter</artifactId>
    <version>1.2.5</version>
</dependency>
```

## 简单实例
::: tip
PageHelper 有多种用法，这里主要介绍官网提供的几种常见用法。
:::

### RowBounds

```java
RowBounds rowBounds = new RowBounds(0, 10);
List<User>	list = sqlSessionTemplate.selectList('user.selectIf', param, rowBounds);
```

### startPage<Tip>推荐</Tip>
在Mapper接口方法调用前，调用`PageHelper.startPage()`方法，传入当前页码和每页显示的记录数。只有紧跟在`PageHelper.startPage()`方法后的第一个Mybatis的查询方法才会被分页。
```java
PageHelper.startPage(1, 10);
List<User> list = userMapper.selectIf(1);
```

### offsetPage<Tip>推荐</Tip>
在Mapper接口方法调用前，调用`PageHelper.offsetPage()`方法，传入当前页码和每页显示的记录数。只有紧跟在`PageHelper.offsetPage()`方法后的第一个Mybatis的查询方法才会被分页。
```java
PageHelper.offsetPage(0, 10);
List<User> list = userMapper.selectIf(1);
```

## 注意事项
- 只有紧跟在`PageHelper.startPage()/offsetPage()`方法后的第一个Mybatis的查询方法才会被分页。
- 不要配置多个分页插件：使用Spring时，mybatis-config.xml 和 Bean 配置方式选择其中一种，不要同时配置多个分页插件。
- 分页插件不支持带有for update语句的分页：对于带有for update的sql，会抛出运行时异常。
- 分页插件不支持嵌套结果映射: 由于嵌套结果方式会导致结果集被折叠，因此分页查询的结果在折叠后总数会减少，所以无法保证分页结果数量正确。