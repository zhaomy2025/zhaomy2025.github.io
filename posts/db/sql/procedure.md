---
title: 存储过程
date: 2025-07-07T06:16:30.232Z
category:
  - db
  - sql
  - procedure
tags:
  - db
  - sql
  - procedure
---

# 存储过程
[[toc]]


## 什么是存储过程？

存储过程（Stored Procedure）是一种数据库对象，它存储在数据库中，可以像函数一样被调用，执行存储过程中的代码。存储过程可以减少网络通信，提高数据库的性能。

存储过程具有以下优点：
  - 简单：把数据处理封装在一个易用的单元中，可以简化复杂的操作。
  - 安全：通过存储过程限制对基础数据的访问，减少了数据误修改。
  - 高性能：存储过程通常以编译过的形式存储，所以 DBMS 处理命令所需的工作量少，提高了性能。

## 创建存储过程
创建存储过程的语法如下：
```sql
CREATE OR REPLACE PROCEDURE sp_name (
    param1 IN NUMBER,-- 输入参数
    param2 OUT NUMBER,-- 输出参数
    param3 INOUT NUMBER -- 输入输出参数
) AS
BEGIN
    -- 存储过程代码
EXCEPTION
    WHEN OTHERS THEN
    -- 异常处理代码
END sp_name;
/
```
示例：
::: code-tabs
@tab 涨薪
```sql
CREATE OR REPLACE PROCEDURE raise_salary (
    p_emp_id IN NUMBER,
    p_amount IN NUMBER
) AS
BEGIN
    UPDATE employees SET salary = salary + p_amount
    WHERE employee_id = p_emp_id;
    COMMIT;
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM);
END raise_salary;
```
@tab 统计有邮件地址的顾客数量(输出参数)
```sql
CREATE OR REPLACE PROCEDURE count_customers (
    listCount OUT INTEGER
) AS
v_rows INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_rows FROM customers WHERE email IS NOT NULL;
    listCount := v_rows;
EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM);
END count_customers;

-- 执行存储过程
var listCount NUMBER;
EXEC count_customers(:listCount);
SELECT listCount;
```

:::

## 执行存储过程
```sql
EXECUTE sp_name(param1, param2, param3);
```