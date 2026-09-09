---
title: MyBatis
date: 2025-06-20T08:45:23.497Z
category:
  - framework
  - mybatis
tags:
  - framework
  - mybatis
---

# MyBatis 简介
[[toc]]

## 什么是 MyBatis
<!-- @include:./mybatis-intro.md -->

## MyBatis栈技术演进

### JDBC
Java5的时代，通常的开发中会自行封装JDBC的Util，比如创建 Connection，以及确保关闭 Connection等。

### iBatis
MyBatis的前身，它封装了绝大多数的 JDBC 样板代码，使得开发者只需关注 SQL 本身，无需处理注册驱动，创建 Connection，以及确保关闭 Connection 等代码。

### MyBatis
伴随着JDK5+ 泛型和注解特性开始流行，IBatis在3.0变更为MyBatis，对泛型和注解等特性开始全面支持，同时支持了很多新的特性，比如：
- 实现了接口绑定，通过Dao接口 和xml映射文件的绑定，自动生成接口的具体实现
- 支持 ognl表达式，比如 `<if>`, `<else>`使用ognl进行解析
- 支持插件机制，PageHelper分页插件应用而生，解决了数据库层的分页封装问题

所以这个时期，MyBatis XML 配置方式 + PageHelper 成为重要的开发方式。

### MyBatis衍生：代码生成工具等

MyBatis提供了开发上的便捷，但是依然需要写大量的xml配置，并且很多都是CRUD级别的，为了减少重复编码，衍生出了MyBatis代码生成工具, 比如CodeGenerator等。
由于后端视图解析引擎多样性（比如freemarker, volicty, thymeleaf等），以及前后端分离前端独立等，为了进一步减少重复代码的编写（包括视图层），自动生成的代码工具也开始演化为自动生成前端视图代码。

### Spring + MyBatis

与此同时，Spring 2.5 开始完全支持基于注解的配置并且也支持JSR250 注解。在Spring后续的版本发展倾向于通过注解和Java配置结合使用。

Spring Boot的出现便是要解决配置过多的问题，通过自动配置和 mybatis-spring-boot-starter 依赖，可以简化 MyBatis 的配置。

这个阶段，主要的开发技术栈是 Spring + mybatis-spring-boot-starter 自动化配置 + PageHelper，并且很多数据库实体mapper还是通过xml方式配置的（伴随着使用一些自动化生成工具）。

### MyBatis-Plus

为了更高的效率，出现了MyBatis-Plus这类工具，对MyBatis进行增强。
- 全自动ORM
    + MyBatis-Plus 启动即会自动注入基本 CURD，性能基本无损耗，直接面向对象操作
    + 内置通用 Mapper、通用 Service，仅仅通过少量配置即可实现单表大部分 CRUD 操作 
    + 强大的条件构造器，满足各类使用需求
- 支持Lambda表达式
- 内置分页插件
- 内置diamond生成器
- 内置性能分析插件，可输出SQL语句以及其执行时间
- 支持主键自动生成：支持4种主键策略，可自由配置
- 内置全局拦截插件，提供全表delete、update操作只能分析阻断，也可自动逸拦截规则，预防误操作