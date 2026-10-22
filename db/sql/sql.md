---
title: SQL语法基础
date: 2025-07-24T06:53:40.390Z
category:
  - db
  - sql
  - sql
tags:
  - db
  - sql
  - sql
---

# SQL语法基础
[[toc]]


## 变量

### 查询变量
::: code-tabs
@tab Oracle
```sql 
SELECT * FROM v$parameter;
SELECT NAME,VALUE FROM v$parameter
```

@tab MySQL
```sql
show variables like 'AUTOCOMMIT'
SHOW TABLE STATUS LIKE ''
```
:::

### 设置变量
::: code-tabs
@tab MySQL
```sql
set AUTOCOMMIT =1;
set session transaction isolation level read committed;
```
:::


## NULL
NULL 表示未知值，与 0、空字符串不同：
- NULL 与任何值比较(=, <, >, <=, >=, <>)，结果都为 NULL
  + NULL = 1 返回 NULL
  + NULL = NULL 返回 NULL
  + NULL <> 1 返回 NULL
  + NULL > 1 返回 NULL
- NULL 参与计算，结果为 NULL
  + 加法：NULL + 1 = NULL
  + 减法：NULL - 1 = NULL
  + 乘法：NULL * 1 = NULL
  + 除法：NULL / 1 = NULL
- NULL 参与逻辑运算
  + NULL IN 返回 NULL 而不是 FALSE
  + NOT NULL 返回 NULL 而不是 TRUE
  + NULL OR TRUE 返回 TRUE
  + NULL OR FALSE 返回 NULL
- NULL 参与日期计算，结果为 NULL
- NULL 参与字符串连接，Oracle 会将其视为空字符串（''），其他数据库如SQL Server结果为 NULL

::: tip
NOT NULL 语法错误，但可以通过 NOT (NULL IN (1,2,3)) 来模拟，因为 NULL IN (1,2,3) 返回 NULL，所以 NOT (NULL IN (1,2,3)) 相当于 NOT NULL。
:::
::: code-tabs

@tab 比较
```sql
SELECT 
    CASE WHEN NULL = 1 THEN '相等' ELSE '不相等' END AS 比较1,  -- 结果是 不相等
    CASE WHEN NULL = NULL THEN '相等' ELSE '不相等' END AS 比较2,  -- 结果是 不相等
    CASE WHEN NULL <> 1 THEN '不相等' ELSE '相等' END AS 比较3,  -- 结果是 相等
    CASE WHEN 1 > NULL THEN '大于' ELSE '不大于' END AS 比较4  -- 结果是 不大于
FROM dual;
```

@tab 计算
```sql
SELECT 
    10 + NULL AS 加法,
    20 - NULL AS 减法,
    5 * NULL AS 乘法,
    100 / NULL AS 除法,
    NULL / 10 AS 被除数为NULL,
    MOD(10, NULL) AS 取模,
    POWER(2, NULL) AS 幂运算
FROM dual;
```

@tab 逻辑计算
```sql
SELECT
       CASE
           WHEN NULL IN (1, 2, 3) THEN '真'
           WHEN NOT (NULL IN (1, 2, 3)) THEN '假'
           ELSE '未知' END AS IN_, -- 未知
    CASE
        WHEN NULL NOT IN (1, 2, 3) THEN '真'
        WHEN NOT (NULL NOT IN (1, 2, 3)) THEN '假'
        ELSE '未知' END AS NOT_IN, -- 未知
    CASE WHEN NULL IN (1) OR 1 = 1 THEN '真'
         WHEN not  (NULL IN (1) OR 1 = 1) THEN '假'
        ELSE '未知' END AS NULL_OR_TRUE, -- 真
    CASE WHEN NULL IN (1) OR 1 = 2 THEN '真'
        WHEN not  (NULL IN (1) OR 1 = 2) THEN '假' ELSE '未知' END AS NULL_OR_FALSE -- 未知
FROM DUAL;
```

@tab 日期计算
```sql
SELECT
    SYSDATE + NULL AS 日期计算1,  -- 结果是 NULL
    SYSDATE - NULL AS 日期计算2,  -- 结果是 NULL
    MONTHS_BETWEEN(SYSDATE, NULL) AS 月份差  -- 结果是 NULL
FROM dual;
```
:::


## 递归查询 START WITH CONNECT BY

## 函数

### 字符串函数
| 函数 | 描述 |用法|
| --- | --- |---|
|CONCAT| 字符串连接|CONCAT(STRING1,STRING2)|
|INSTR| 字符串查找|INSTR(STRING,SEARCH_STRING,[START_POSITION,[OCCURRENCE]])|
|SUBSTR| 字符串截取|SUBSTR(STRING,START[,LENGTH])|
|LPAD/RPAD| 字符串填充|LPAD/RPAD(STRING,LENGTH,[PAD_STRING])|
|MID|提取字符|MID(STRING,START_POSITION,LENGTH)|
|TRIM| 去除字符串首尾指定字符|TRIM([ [LEADING|TRAILING|BOTH] [trim_char] from]STRING)|
|LTRIM| 去除字符串开头空格|LTRIM(STRING,[trim_char])|
|RTRIM| 去除字符串结尾空格|RTRIM(STRING,[trim_char])|
|REPLACE| 字符串替换|REPLACE(STRING,SEARCH_STRING,REPLACEMENT)|
|UPPER/LOWER| 字符串大小写转换|UPPER/LOWER(STRING)|

::: tip
UPPER/LOWER VS UCASE/LCASE
  UPPER/LOWER 是通用的大小写转换函数，在所有数据库中都可以使用。
  UCASE/LCASE 只能在部分数据库中使用，比如 MySQL/SQL Server/SQLite，但 Oracle、PostgreSQL 不支持。

TRIM VS LTRIM/RTRIM
  TRIM 支持查询字符串首尾指定字符，默认是空格，可以只去除开头或结尾的字符，也可以同时去除开头和结尾的字符。
  LTRIM/RTRIM 分别去除字符串开头和结尾指定字符，默认是空格。
:::

::: code-tabs
@tab TRIM
```
SELECT TRIM(' Hello World ') AS 去除空格 FROM DUAL;
SELECT TRIM('x' from 'xxxhello worldxxx') AS 去除指定字符 FROM DUAL;
SELECT TRIM(LEADING 'x' from 'xxxhello worldxxx') AS 去除开头指定字符 FROM DUAL;
SELECT TRIM(TRAILING 'x' from 'xxxhello worldxxx') AS 去除结尾指定字符 FROM DUAL;
SELECT LTRIM('hello world') AS 去除开头空格 FROM DUAL;
SELECT RTRIM('hello world') AS 去除结尾空格 FROM DUAL;
```
:::


### 正则表达式

|  函数 | 描述 | 返回值 |用法|
|  --- | --- |---|---|
| REGEXP_LIKE    | 正则匹配|  布尔值  | REGEXP_LIKE(STRING,REGEXP_PATTERN[, match_parameter])<Tip> Oracle 10g 及以上版本支持 </Tip>| 
| REGEXP_INSTR   | 正则查找|  数字  | REGEXP_INSTR(STRING,REGEXP_PATTERN,start_position,occurrence,match_parameter)|
| REGEXP_SUBSTR  | 正则截取|  字符串  | REGEXP_SUBSTR(STRING,REGEXP_PATTERN)|
| REGEXP_REPLACE | 正则替换|  字符串  | REGEXP_REPLACE(STRING,REGEXP_PATTERN,REPLACEMENT)|
| REGEXP_COUNT   | 正则计数|  数字  | REGEXP_COUNT(STRING,REGEXP_PATTERN)|

match_parameter：模式
- 'i'：不区分大小写进行检索
- 'c'：区分大小写进行检索。默认为'c'。
- 'n'：允许点号(.)匹配换行符
- 'm'：多行模式。在多行模式下，'^'匹配行的开头，'$'匹配行的结尾。

```sql
-- Oracle 10g 及以上版本支持，可使用LIKE替代
SELECT REGEXP_LIKE('hello','[a-z]+') AS 匹配, -- 结果是 1
       REGEXP_LIKE('hello','[A-Z]+') AS 匹配2, -- 结果是 0
       REGEXP_LIKE('hello','[A-Z]+','i') AS 匹配3 -- 结果是 1
from dual;

-- 匹配不是逗号的任何字符，返回第一个匹配项
SELECT REGEXP_SUBSTR('34,56,-23','[^,]+') AS STR FROM DUAL;

-- 如需返回全部匹配项，需要使用CONNECT BY语句
-- CONNECT BY创建了一个递归查询
-- LEVEL是Oracle的一个伪列，用于表示递归深度
-- 每次递归，LEVEL会自动增加1，当LEVEL=4时，REGEXP_SUBSTR返回NULL，递归结束
SELECT REGEXP_SUBSTR('34,56,-23','[^,]+',1,LEVEL) AS STR
FROM DUAL
CONNECT BY REGEXP_SUBSTR('34,56,-23','[^,]+',1,LEVEL) IS NOT NULL;

-- 匹配次数
SELECT REGEXP_COUNT('34,56,-23','[0-9]+') AS COUNT FROM DUAL; --3
```

### 日期函数

### 截取 TRUNC

#### 截取日期

```sql
SELECT TRUNC(SYSDATE) AS 今天,
       TRUNC(SYSDATE, 'YEAR') AS 本年1号, -- y或yy或yyy或yyyy或year，大小写均可
       TRUNC(SYSDATE,'Q') AS 本季度1号,
       TRUNC(SYSDATE, 'MONTH') AS 本月1号,--'mm'或'month'
       TRUNC(SYSDATE,'hh') AS 当前小时,
       TRUNC(SYSDATE,'MI') AS 当前分钟
FROM DUAL;
```

#### 截取数值
```sql
SELECT TRUNC(123.456) AS 整数部分,
    TRUNC(123.456, -1) AS 保留至十位, -- 负数表示整数部分截取位数
    TRUNC(123.456, 2) AS 保留2位小数,
    ROUND(123.456) AS 四舍五入整数,
    ROUND(123.456, 2) AS 四舍五入保留2位小数,
    ROUND(123.456, -2) AS 四舍五入保留至百位 -- 负数表示整数部分截取位数
FROM DUAL;
```

### 行列转换

PIVOT将行中的值转换为新列，增加了列数，所以叫行转列
UNPIVOT将不同列中的值转换为新行，增加了行数，所以叫列转行

#### 行转列（高表变宽表） PIVOT
```sql
select * from t_test
pivot (sum(score) for subject in('CHINESE' as 语文, 'MATH' as 数学, 'ENGLISH' as 英语))
order by id;
```

#### 列转行（宽表变高表） unpivot
```sql
select id,
       name,
       score   成绩,
       subject 学科
  from t_test
 unpivot(score for subject in(chinese, math, english))
 order by id;
 ```

### 多行数据合并为一行
::: tip
- PIVOT将行中的值转换为新列（行转列/高表变宽表），结果是规范化的表结构
- LISTAGG和XMLAGG将多行数据合并为单行中的单个字符串值，结果是字符串拼接，不是结构化数据
:::

- Oracle中将多行数据合并为一行通常使用LISTAGG和XMLAGG函数
  - LISTAGG 有 4000 字节的限制，大数据量使用XMLAGG
  - XMLAGG返回的数据是一个 XML 片段，并且末尾包含分隔符，需搭配GETCLOBVAL/XMLCAST和RTRIM函数使用
- MySQL中将多行数据合并为一行通常使用GROUP_CONCAT函数
  - GROUP_CONCAT最大长度限制由group_concat_max_len控制

#### LISTAGG
::: tip
LISTAGG(measure_column [, delimiter]) 
WITHIN GROUP(ORDER BY sort_column )
[OVER (PARTITION BY partition_column)]

参数说明：
- measure_column：要合并的列或表达式
- delimiter：分隔符，默认为NULL
- sort_column ：用于排序的列
- partition_column：用于分组的列
:::

用法示例：
::: code-tabs
@tab 基础用法
```sql
-- 合并部门员工姓名，按字母排序
SELECT 
    department_id,
    LISTAGG(employee_name, ', ') 
    WITHIN GROUP (ORDER BY employee_name) AS employees
FROM employees
GROUP BY department_id;
```
@tab 使用分析函数
```sql
-- 为每行显示同部门所有员工列表
SELECT 
    employee_id,
    employee_name,
    department_id,
    LISTAGG(employee_name, ', ') 
    WITHIN GROUP (ORDER BY hire_date) 
    OVER (PARTITION BY department_id) AS dept_colleagues
FROM employees;
```
:::

#### XMLAGG
语法：
::: tip
XMLAGG(<Tip>XMLELEMENT(列值或表达式)</Tip> [ORDER BY 子句])  
XMLAGG(<Tip>XMLPARSE(列值或表达式)</Tip> [ORDER BY 子句]) 

1. XMLELEMENT或XMLPARSE将列值转换为XML片段
2. XMLAGG 将多行数据聚合成一个 XML 片段
:::

- XMLAGG返回的结果是XML片段，需要搭配EXTRACT/GETCLOBVAL/XMLCAST函数提取文本内容
  - EXTRACT(xml_data, xpath_expression)
    - 从XML数据中提取指定节点的值，返回XML片段或文本值
  - xml_data.GETCLOBVAL() 
    - 从XMLType数据中提取文本内容，返回CLOB类型
  - XMLCAST(xml_data AS data_type)
    - 将XML数据转换为指定SQL数据类型
- 提取文本内容后，使用RTRIM函数删除末尾分隔符

##### XMLELEMENT
::: code-tabs
@tab EXTRACT

```sql
SELECT 
    department_id,
    RTRIM(
        XMLAGG(XMLELEMENT(e, employee_name||', ') ORDER BY employee_name)
        .EXTRACT('//text()'),
        ', '
    ) AS employees
FROM employees
GROUP BY department_id;
```

@tab XMLCAST
```sql
SELECT 
    department_id,
    RTRIM(
      XMLCAST(
          XMLAGG(XMLELEMENT(e, employee_name||', ') ORDER BY employee_name)
          AS VARCHAR2(4000)
      ), 
      ', '
    ) AS employees
FROM 
    emp
GROUP BY 
    deptno;
```
@tab GETCLOBVAL
```sql
SELECT 
    department_id,
    RTRIM(
      XMLAGG(XMLELEMENT(e, employee_name||CHR(10)) ORDER BY seq_num)
      .GETCLOBVAL(),
      ', '
    ) AS employees
FROM employees
GROUP BY department_id;
```
:::

##### XMLPARSE
::: code-tabs
@tab EXTRACT
```sql
SELECT RTRIM(XMLAGG(XMLPARSE(CONTENT COLUMN_NAME || ',' WELLFORMED) ORDER BY COLUMN_NAME)
             .EXTRACT('//text()'),
             ',')
  FROM ALL_TAB_COLUMNS
 WHERE TABLE_NAME = 'USER'
 GROUP BY TABLE_NAME;
```

@tab GETCLOBVAL
```sql
SELECT RTRIM(XMLAGG(XMLPARSE(CONTENT COLUMN_NAME || ',' WELLFORMED) ORDER BY COLUMN_NAME)
             .GETCLOBVAL(),
             ',')
  FROM ALL_TAB_COLUMNS
 WHERE TABLE_NAME = 'USER'
 GROUP BY TABLE_NAME;
```

@tab XMLCAST
```sql
SELECT RTRIM(XMLCAST(XMLAGG(XMLPARSE(CONTENT COLUMN_NAME || ',' WELLFORMED) ORDER BY COLUMN_NAME)
             AS VARCHAR2(4000)),
             ',')
  FROM ALL_TAB_COLUMNS
 WHERE TABLE_NAME = 'USER'
 GROUP BY TABLE_NAME;
```
:::

### 分析函数

## 存储过程

## 游标

<!-- @include:./cursor_intro.md -->

## 约束

## 索引

## 触发器
