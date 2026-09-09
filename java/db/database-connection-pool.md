---
title: 数据库连接池
date: 2025-06-27T08:53:47.531Z
category:
  - java
  - db
  - database-connection-pool
tags:
  - java
  - db
  - database-connection-pool
---

# 数据库连接池
[[toc]]

## 什么是数据库连接池
数据库连接池负责分配、管理和释放数据库连接，它允许应用程序重复使用一个现有的数据库连接，而不是再重新建立一个；释放空闲时间超过最大空闲时间的数据库连接来避免因为没有释放数据库连接而引起的数据库连接遗漏。这项技术能明显提高对数据库操作的性能。

## 常见Java连接池实现

### C3P0 (Connection Pool)<Tip>被淘汰：历史悠久，过于复杂，性能差</Tip>

### Apache DBCP (Database Connection Pool)<Tip>被淘汰：依赖Commons-Pool, 性能差</Tip>

逐渐被HikariCP取代

核心优势：
  - Apache项目背书
  - 与Tomcat等Apache项目集成良好
  - 配置简单
技术特点：
  - 支持JMX
  - 提供基本的连接池功能
  - 兼容性好
适用场景：
  - 传统企业应用
  - 与Apache生态集成的项目
  - 不需要高性能的简单应用
### Tomcat JDBC Pool

### HikariCP (Hikari Connection Pool)<Tip>推荐：主流首选连接池，支持Spring Boot</Tip>

核心优势：
  - 性能卓越：基准测试显示其性能是其他连接池的2-10倍
  - 轻量级：代码精简（约130KB），无依赖
  - 零开销：优化了代理和拦截器，减少运行时开销
  - 智能优化：自动处理连接泄漏、超时等问题

适用用场景：
- 高并发Web应用
- 云原生应用
- 需要极致性能的场景

### Druid (Alibaba Druid Connection Pool)<Tip>推荐：阿里巴巴开源连接池，国内广泛适用，持续维护</Tip>
Druid功能最为全面，sql拦截等功能，统计数据较为全面，具有良好的扩展性。

核心优势：
  - 强大的监控功能：内置SQL监控、防火墙等功能
  - 针对阿里场景优化：特别适合电商等高并发场景
  - 扩展性强：支持Filter-chain扩展
  - 中文文档完善

适用场景：
  - 需要详细监控的企业应用
  - 国内互联网项目
  - 需要SQL防火墙的场景

## HikariCP
为什么HikariCP会成为默认连接池？
  - 字节码精简 ：优化代码，直到编译后的字节码最少，这样，CPU缓存可以加载更多的程序代码；
  - 优化代理和拦截器：减少代码，例如HikariCP的Statement proxy只有100行代码，只有BoneCP的十分之一；
  - 自定义数组类型（FastStatementList）代替ArrayList：避免每次get()调用都要进行range check，避免调用remove()时的从头到尾的扫描；
  - 自定义集合类型（ConcurrentBag)：提高并发读写的效率；
  - 其它：针对BoneCP缺陷的优化，比如对于耗时超过一个CPU时间片的方法调用的研究等。