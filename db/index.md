---
title: 数据库
date: 2025-07-03T07:19:02.059Z
category:
  - db
tags:
  - db
---

# 数据库
[[toc]]

数据库板块按基础、架构、SQL 和 NoSQL 组织。这个页面负责展示整个板块的内容地图；具体概念和使用方法放在各自的专题入口及文章中。

## 数据库基础

- [关系型数据库原理](./base/how-it-word.md)：从数据库组件、查询处理流程和数据管理器等部分，介绍关系型数据库的基本原理。

## 数据库架构设计

- [多租户数据存储](./arch/multi-tenant.md)：介绍独立数据库、独立 Schema、共享 Schema 和混合模式等数据隔离方案。

## [SQL](./sql/)

### 通用 SQL

- [SQL 语法基础](./sql/sql.md)：介绍变量、`NULL`、函数、递归查询、行列转换和分析函数等常用语法。
- [约束](./sql/constraint.md)：介绍 `NOT NULL`、`UNIQUE`、`PRIMARY KEY`、`FOREIGN KEY` 和 `CHECK` 等常见约束。
- [索引](./sql/sql_index.md)：介绍普通索引、唯一索引、主键索引、组合索引、函数索引和覆盖索引。
- [游标](./sql/cursor.md)：介绍游标的类型、基本操作、属性和适用场景。
- [多行合并](./sql/merge-rows.md)：介绍 Oracle 的 `LISTAGG`、`XMLAGG` 与 MySQL 的 `GROUP_CONCAT`。
- [SQL 优化](./sql/optimize.md)：介绍索引、字段、查询和大表等方面的优化方法。
- [存储过程](./sql/procedure.md)：介绍存储过程的概念、创建和执行。
- [触发器](./sql/trigger.md)：介绍触发器的创建和使用。

### Oracle

- [PL/SQL](./sql/pl_sql/)：介绍 Oracle 的过程化 SQL 语言、流程控制、异常处理、存储过程、函数和游标。
- [定时任务与物化视图](./sql/oracle-job-mview.md)：整理 Oracle 定时任务和物化视图的常用命令。
- [物化视图问题](./sql/oracle-mview-issue.md)：分析 Oracle 物化视图未更新的原因和排查方法。

## [NoSQL](./nosql/)

### [Redis](./nosql/redis/)

Redis 是以键值和内存数据结构为核心的数据库，适合缓存、会话、计数、排行榜以及访问模式明确的应用场景。

- [Redis 数据结构与底层编码](./nosql/redis/data-structures.md)：介绍 String、Hash、Set、Sorted Set 等数据类型及其底层编码。
- [Redis 命令](./nosql/redis/commands.md)：按通用命令、数据类型和服务能力整理 Redis 命令。
- [用 Redis 构建 Web 应用](./nosql/redis/web-applications.md)：介绍登录令牌、购物车、页面缓存和数据行缓存等应用模式。
- [Spring Boot 集成 Redis](/spring-boot/spring-boot-redis.html)：介绍 Redis 连接配置、模板、序列化、缓存注解和集群配置。

### MongoDB

### Elasticsearch
