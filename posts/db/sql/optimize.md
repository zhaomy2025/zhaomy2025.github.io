---
title: SQL优化
date: 2025-07-24T06:19:28.239Z
category:
  - db
  - sql
  - optimize
tags:
  - db
  - sql
  - optimize
---

# SQL优化
[[toc]]
::: tip
本文主要给出一些通用的优化建议，包括索引相关、字段相关和查询相关的优化建议，最后给出了大表优化的建议，这部分根据实际情况判断是否需要优化。
:::

## 索引相关
### 负向查询不能使用索引
避免not in，not exists，<>，!=，is null，is not null等负向查询，负向条件通常需要全表扫描来验证。
- 优化器难以使用索引（特别是对NOT IN和NOT EXISTS）
- 对于大数据集，NOT EXISTS通常比NOT IN性能更好
- IS NULL/IS NOT NULL在某些数据库中对索引使用有限制

::: warning
注意：IS NULL虽然逻辑上是"正向"检查，但查询优化器通常将其视为负向条件
:::

```sql
-- 优化前
select name from user where id not in (1,3,4);
-- 优化后
select name from user where id in (2,5,6);
```

### 前导模糊查询不能使用索引
避免like '%xx'，like 'xx%'，like '%xx%'等前导模糊查询。
```sql
-- 不能使用索引
select name from user where name like '%Alias';
-- 能使用索引
select name from user where name like 'Alias%';
```

### 数据区分不明显的不建议创建索引
值分布很稀少的字段，如 user 表中的性别字段，只有男和女两个值，不建议创建索引。

### 在字段上进行计算不能命中索引

### 字符字段只建前缀索引

### 字符字段最好不要做主键

### 最左前缀问题
最左前缀问题是指在复合索引中，查询条件必须按照索引字段的顺序进行匹配，否则无法命中索引。
比如username，age建立了索引，单独查询age不能命中索引，但是查询username能命中索引。
```sql
-- 不能使用索引
select name from user where age = 18;
-- 能使用索引
select name from user where name = 'Alias';
select name from user where name = 'Alias' and age = 18;
```

### 尽量避免在WHERE子句中对字段进行NULL值判断
在WHERE子句中对字段进行NULL值判断将导致引擎放弃使用索引而进行全表扫描。

## 字段相关
### 字段的默认值不要为 null

## 查询优化
### 如果明确知道只有一条记录返回使用limit提高效率
```sql
-- 优化前
select name from user where name = 'Alias';
-- 优化后
select name from user where name = 'Alias' limit 1;
```

### 不要让数据库帮我们做强制类型转换
```sql
-- 优化前，强制类型转换会导致索引失效
select name from user where telno=18722222222
-- 优化后
select name from user where telno='18722222222';
```

### 对于连续数值，使用BETWEEN不用IN

## 大表优化
一般以整型值为主的表在千万级以下，字符串为主的表在五百万以下是没有太大问题的。而事实上很多时候MySQL单表的性能依然有不少优化空间，甚至能正常支撑千万级以上的数据量：

### 字段优化
- VARCHAR的长度只分配真正需要的空间
- 使用枚举或整数代替字符串类型
- 尽量使用TIMESTAMP而非DATETIME
- 单表不要有太多字段，建议在20以内
- 避免使用NULL字段，很难查询优化且占用额外索引空间
- 用整型来存IP

### 索引优化
没有放到前面的[索引相关优化]()中，仅在大表中使用：
- 不用外键，由程序保证约束
- 尽量不用UNIQUE，由程序保证约束

### 查询优化
- OR改写成IN：OR的效率是n级别，IN的效率是log(n)级别，in的个数建议控制在200以内
- 不用函数和触发器，在应用程序实现
