---
title: 约束
date: 2025-07-04T03:13:18.017Z
category:
  - db
  - sql
  - constraint
tags:
  - db
  - sql
  - constraint
---

# 约束
[[toc]]

## 创建表时定义约束
::: tip
MySQL 定义约束时，除NOT NULL外，约束单独一行，放在字段定义后面。
SQL Server/Oracle 定义约束时，除CHECK外，约束与字段定义在同一行。
根据是否有名称，约束可分为匿名约束和命名约束。
:::
### 单个约束
基本语法：
```sql
CONSTRAINT [constraint_name] [constraint_type] (parameter_list)
参数说明：
[constraint_name] 约束名称，可选
当不指定约束名称时，CONSTRAINT 关键字可以省略
```
| 约束类型 | MySQL | SQL Server/Oracle |
| --- | --- | --- |
| NOT NULL | `NOT NULL` | `NOT NULL` |
| UNIQUE | `UNIQUE(p_id)` | `p_id int UNIQUE` |
| PRIMARY KEY | `PRIMARY KEY(p_id)` | `p_id int PRIMARY KEY` |
| FOREIGN KEY | `FOREIGN KEY(p_id) REFERENCES t_person(p_id)` | `p_id int FOREIGN KEY REFERENCES t_person(p_id)` |
| CHECK | `CHECK(GENDER LIKE '[MF]')` |`CHECK(GENDER LIKE '[MF]')` |

## 修改表时定义约束
::: tip
MySQL/SQL Server/Oracle 为已存在的表添加约束时，都通过 `ALTER TABLE table_name ADD CONSTRAINT constraint_name constraint_type(parameter_list)` 语句来实现。
和创建表时定义约束时一样，根据是否有名称，约束可分为匿名约束和命名约束。
:::

基本语法：
```sql
ALTER TABLE table_name ADD [CONSTRAINT [constraint_name] constraint_type(parameter_list)
```

## 删除约束
```sql
ALTER TABLE table_name DROP constraint_type constraint_name
```