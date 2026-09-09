---
title: Oracle和MySQL中将多行数据合并为一行
date: 2025-04-11 12:06:48
tags:
  - 数据库
  - Oracle
  - MySQL
  - 聚合函数
categories:
  - 数据库
  - 聚合函数
---
Oracle中将多行数据合并为一行通常使用LISTAGG和XMLAGG函数：

- LISTAGG 有 4000 字节的限制，大数据量使用XMLAGG
- XMLAGG返回的数据是一个 XML 片段，并且末尾包含分隔符，需搭配GETCLOBVAL/XMLCAST和RTRIM函数使用

MySQL中将多行数据合并为一行通常使用GROUP_CONCAT函数：

- GROUP_CONCAT最大长度限制由group_concat_max_len控制

# Oracle

## LISTAGG

LISTAGG(合并字段，分隔符) WITHIN GROUP(ORDER BY 排序字段)

- 在 Oracle 12c R2 及以上版本，LISTAGG 支持 DISTINCT 关键字

## XMLAGG

1. XMLPARSE或XMLELEMENT将列值转换为XML片段
2. XMLAGG 将多行数据聚合成一个 XML 片段

```sql
XMLAGG(XMLPARSE(列值或表达式) [ORDER BY 子句])
XMLAGG(XMLELEMENT(元素名, 列值或表达式) [ORDER BY 子句])
```

3. GETCLOBVAL或XMLCAST函数提取文本内容

```sql
XMLAGG(...).GETCLOBVAL()
XMLCAST(XMLAGG(...), ', ')
```

4. RTRIM函数删除末尾分隔符

### XMLAGG + XMLPARSE

```sql
SELECT RTRIM(
    XMLAGG(XMLPARSE(CONTENT COLUMN_NAME || ',' WELLFORMED) ORDER BY COLUMN_NAME).GETCLOBVAL(),
    ',')
FROM ALL_TAB_COLUMNS
WHERE TABLE_NAME = 'MV_PFCOMPY_TYPE_TODAY'
GROUP BY TABLE_NAME;
```

### XMLAGG + XMLELEMENT

```sql
SELECT
    deptno,
    RTRIM(
        XMLCAST(
            XMLAGG(XMLELEMENT(e, ename||', ') ORDER BY ename)
            AS VARCHAR2(4000)),
        ', ')
FROM
    emp
GROUP BY
    deptno;
```

# MySQL

## GROUP_CONCAT

```sql
GROUP_CONCAT(列值 ORDER BY 子句 SEPARATOR '分隔符')
```

```sql
SELECT
    department_id,
    GROUP_CONCAT(employee_name ORDER BY employee_name SEPARATOR ', ') AS employees
FROM
    employees
GROUP BY
    department_id;
```
