---
title: 索引
date: 2025-07-07T03:30:23.170Z
category:
  - db
  - sql
  - sql_index
tags:
  - db
  - sql
  - sql_index
---

# 索引
[[toc]]

## 索引类型
按照功能分类，索引可分为以下几类：
  1. 普通索引：不唯一的索引，允许有空值`CREATE INDEX idx_name ON table_name(column)`
  2. 唯一索引：保证索引列不重复，但允许有空值`CREATE UNIQUE INDEX idx_name ON table_name(column)`
  3. 主键索引：特殊的唯一索引，不允许有空值 `ALTER TABLE table_name ADD PRIMARY KEY (column1)`
  4. 组合索引：多个列组合在一起的索引 `CREATE INDEX idx_name ON table_name(column1, column2)`
  5. 函数索引：基于表达式或函数的索引 `CREATE INDEX idx_name ON table_name(UPPER(column1))`
  6. 覆盖索引：索引列包含查询列的数据，不需要回表查询 `CREATE INDEX idx_name ON table_name(column1) INCLUDE (column2, column3)`

## 创建索引
基本语法
```sql
CREATE [UNIQUE] INDEX inin_name 
ON table_name(column1 [ASC|DESC], column2,...)
[INCLUDE (column1, column2,...)]
[WHERE condition]
参数说明：
    table_name(column1, column2,...)：用于指定索引列，可以是列名、表达式或函数，多列为复合索引，基于函数或表达式为函数索引
    UNIQUE：唯一索引，可选
    WHERE：筛选条件，创建部分索引，可选
    INCLUDE：包含列，可选
```

示例：
```sql
-- 普通索引
CREATE INDEX idx_employee_name ON employees(last_name, first_name);
-- 唯一索引
CREATE UNIQUE INDEX idx_employee_email ON employees(email);
-- 部分索引
CREATE INDEX idx_employee_salary ON employees(salary) WHERE salary > 10000;
-- 函数索引
CREATE INDEX idx_upper_name ON employees(UPPER(last_name));
```

## 删除索引
基本语法：
::: code-tabs
@tab MySQL/SQL Server
```sql
DROP INDEX index_name ON table_name;
```
@tab Oracle/PostgreSQL
```sql
DROP INDEX index_name;
```
:::

## 查看索引
基本语法：
::: code-tabs
@tab MySQL
```sql
SHOW INDEX FROM table_name;
```
@tab Oracle
```sql
SELECT INDEX_NAME,INDEX_TYPE, UNIQUENESS
FROM USER_INDEXES
WHERE TABLE_NAME = 'table_name';
```
:::

## 索引性能监控

### 索引使用情况分析

::: code-tabs
@tab MySQL
```sql
SELECT * FROM sys.schema_index_statistics 
WHERE table_schema = 'your_db';
```
@tab Oracle
```sql
SELECT index_name, blevel, leaf_blocks, distinct_keys 
FROM user_indexes 
WHERE table_name = 'EMPLOYEES';
```
:::

### 执行计划分析
```sql
EXPLAIN SELECT * FROM employees WHERE last_name = 'Smith';
```

## 特性对比

| 特性 | MySQL | Oracle | PostgreSQL |
| --- | --- | --- | --- |
| 聚集索引 | InnoDB主键 | IOT表 | 不支持 |
| 函数索引 | 8.0+支持 | 支持 | 支持 |
| 部分索引 | 不支持 | 有限支持 | 支持 |
| 覆盖索引 | 通过符合索引实现 | 通过INCLUDE实现 | 通过INCLUDE实现 |
