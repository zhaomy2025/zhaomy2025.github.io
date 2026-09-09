---
title: PL/SQL
date: 2025-07-03T08:00:30.860Z
category:
  - db
  - sql
  - pl_sql
tags:
  - db
  - sql
  - pl_sql
---

# PL/SQL
[[toc]]

PL/SQL（Procedural Language extensions to SQL）是 Oracle 数据库的过程化编程语言，它扩展了 SQL，使其支持：
  - 变量、条件判断、循环（过程化编程）
  - 异常处理（错误管理）
  - 存储过程、函数、触发器（模块化编程）
  - 游标（逐行处理查询结果）

## 基本结构

PL/SQL 代码由 块（Block） 组成，分为：
  - 匿名块（临时执行）
  - 命名块（存储过程、函数等）

匿名块的语法如下：
::: code-tabs

@tab 基本语法
```sql
[DECLARE]
    -- 变量、记录类型、游标、异常声明等（可选）
BEGIN
    -- 执行逻辑
[EXCEPTION]
    -- 异常处理（可选）
END;
```

@tab 示例
```sql
DECLARE
    v_name VARCHAR2(100) := 'Alice';
    v_age NUMBER := 30;
BEGIN
    DBMS_OUTPUT.PUT_LINE('Name: ' || v_name || ', Age: ' || v_age);
EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM);
END;
```
:::



## 变量与数据类型
PL/SQL 支持以下数据类型：
  - 标准数据类型：NUMBER、VARCHAR2、DATE、BOOLEAN等
  - 动态引用列类型
    + %TYPE 动态引用列类型
    + %ROWTYPE 动态引用记录类型（整行）
  - 自定义数据类型：`TYPE type_name IS RECORD (col1 datatype1, col2 datatype2,...)` 

::: code-tabs
@tab 标准数据类型
```sql
DECLARE
    v_name VARCHAR2(20);
    v_salary NUMBER(10, 2);
BEGIN
    SELECT  name, salary INTO v_name, v_salary
    FROM employees WHERE id = 100;
    DBMS_OUTPUT.PUT_LINE(v_name || ' earns ' || v_salary);
END;
```
@tab 动态引用类型
```sql
DECLARE
    v_name employees.name%TYPE;     -- 使用 %TYPE 引用 employees 表的 name 列类型
    v_salary employees.salary%TYPE;     -- 使用 %TYPE 引用 employees 表的 salary 列类型
    v_emp employees%ROWTYPE;        -- 使用 %ROWTYPE 引用 employees 表的记录类型（所有列）
BEGIN
    SELECT name, salary INTO v_name, v_salary
    FROM employees WHERE id = 100;
    DBMS_OUTPUT.PUT_LINE(v_name || ' earns ' || v_salary);

    SELECT * INTO v_emp FROM employees WHERE id = 100;
    DBMS_OUTPUT.PUT_LINE(v_emp.name || ' works in ' || v_emp.department_id);
END;
```
@tab 自定义记录类型
```sql
DECLARE
    TYPE t_emp_record IS RECORD (
        emp_id   employees.employee_id%TYPE,
        emp_name VARCHAR2(100),
        salary   NUMBER(10, 2)
    );
    r_emp t_emp_record;
BEGIN
    r_emp.emp_id := 100;
    r_emp.emp_name := 'John Doe';
    r_emp.salary := 5000;
    DBMS_OUTPUT.PUT_LINE(r_emp.emp_name || ' has ID ' || r_emp.emp_id);
END;
```
:::

## 流程控制

### 条件判断（IF-THEN-ELSE）

```sql
DECLARE
    v_score NUMBER := 85;
BEGIN
    IF v_score >= 90 THEN
        DBMS_OUTPUT.PUT_LINE('A');
    ELSIF v_score >= 80 THEN
        DBMS_OUTPUT.PUT_LINE('B');
    ELSE
        DBMS_OUTPUT.PUT_LINE('C');
    END IF;
END;
```
### 循环（LOOP、FOR、WHILE）

#### 基本LOOP

```sql
DECLARE
    v_count NUMBER := 1;
BEGIN
    LOOP
        DBMS_OUTPUT.PUT_LINE('Count: ' || v_count);
        v_count := v_count + 1;
        EXIT WHEN v_count > 5;
    END LOOP;
END;
```

#### FOR循环
:::code-tabs
@tab 简单FOR循环
```sql
BEGIN
    FOR i IN 1..5 LOOP
        DBMS_OUTPUT.PUT_LINE('Iteration: ' || i);
    END LOOP;
END;
```
@tab 查询结果FOR循环（隐式游标）
```sql
BEGIN
    FOR emp_rec IN (SELECT * FROM employees) LOOP
        DBMS_OUTPUT.PUT_LINE(emp_rec.employee_name);
    END LOOP;
END;
```
:::

#### WHILE循环

```sql
DECLARE
    v_count NUMBER := 1;
BEGIN
    WHILE v_count <= 5 LOOP
        DBMS_OUTPUT.PUT_LINE('Count: ' || v_count);
        v_count := v_count + 1;
    END LOOP;
END;
```

## 异常处理
```sql
DECLARE
    v_divisor NUMBER := 0;
    v_result NUMBER;
BEGIN
    v_result := 100 / v_divisor; -- 会触发 ZERO_DIVIDE 异常
EXCEPTION
    WHEN ZERO_DIVIDE THEN
        DBMS_OUTPUT.PUT_LINE('Error: Division by zero');
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Unknown error: ' || SQLERRM);
END;
```

## 存储过程
::: code-tabs
@tab 定义存储过程
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

@tab 使用存储过程
```sql
EXEC raise_salary(100, 500);
```

:::

## 函数

```sql
CREATE OR REPLACE FUNCTION get_employee_name (
    p_emp_id IN NUMBER
) RETURN VARCHAR2 AS
    v_name VARCHAR2(100);
BEGIN
    SELECT name INTO v_name
    FROM employees WHERE id = p_emp_id;
    RETURN v_name;
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        RETURN 'Not Found';
END get_employee_name;
```

## 触发器

```sql
CREATE OR REPLACE TRIGGER audit_employee_changes
BEFORE INSERT OR UPDATE OR DELETE ON employees
FOR EACH ROW
BEGIN
    IF INSERTING THEN
        INSERT INTO audit_log VALUES ('INSERT', :NEW.employee_id, SYSDATE);
    ELSIF UPDATING THEN
        INSERT INTO audit_log VALUES ('UPDATE', :OLD.employee_id, SYSDATE);
    ELSIF DELETING THEN
        INSERT INTO audit_log VALUES ('DELETE', :OLD.employee_id, SYSDATE);
    END IF;
END;
```

## 游标

### 显示游标

```sql
DECLARE
    CURSOR c_emp IS SELECT * FROM employees;
    v_emp employees%ROWTYPE;
BEGIN
    OPEN c_emp;
    LOOP
        FETCH c_emp INTO v_emp;
        EXIT WHEN c_emp%NOTFOUND;
        DBMS_OUTPUT.PUT_LINE(v_emp.employee_name);
    END LOOP;
    CLOSE c_emp;
END;
```

### 隐式游标

```sql
BEGIN
    FOR emp_rec IN (SELECT * FROM employees) LOOP
        DBMS_OUTPUT.PUT_LINE(emp_rec.employee_name);
    END LOOP;
END;
```


## 语法对比

### 声明语法对比

| 名称 | 语法 | 说明 |
| --- | --- | --- |
| 块 | DECLARE block_name IS <br> BEGIN <br> &nbsp;&nbsp;block_body <br> EXCEPTION <br> &nbsp;&nbsp;exception_handler <br> END; | 声明块 |
| 类型 | DECLARE TYPE type_name IS <br> &nbsp;&nbsp;RECORD (column_name datatype,...) <br> &nbsp;&nbsp;TABLE OF datatype INDEX BY index_name; | 定义类型 |
| 变量 | DECLARE variable_name datatype; | 声明变量 |

### 创建语法对比

| 名称 | 语法 | 说明 |
| --- | --- | --- |
| 存储过程 | CREATE OR REPLACE PROCEDURE <br> procedure_name (parameter_list) AS <br> BEGIN <br> &nbsp;&nbsp;procedure_body <br> EXCEPTION <br> &nbsp;&nbsp;exception_handler <br> END; | 定义存储过程 |
| 函数 | CREATE OR REPLACE FUNCTION <br> function_name (parameter_list) <br>**RETURN data_type** AS <Tip>指定函数返回值的数据类型</Tip> <br> BEGIN <br> &nbsp;&nbsp;&nbsp;&nbsp;function_body <br> EXCEPTION <br> &nbsp;&nbsp;exception_handler <br> END; | 定义函数 |
| 触发器 | CREATE OR REPLACE TRIGGER <br> trigger_name <br> BEFORE/AFTER insert/update/delete ON table_name FOR EACH ROW <br> BEGIN <br> &nbsp;&nbsp;&nbsp;&nbsp;... <br> END; | 定义触发器 |


## 关键字

| 关键字 | 说明 |
| --- | --- |
| %TYPE | 引用表的列类型 |
| %ROWTYPE | 引用表的记录类型 |
| NO_DATA_FOUND | 查询无结果 |
| TOO_MANY_ROWS | 查询结果多于一条 |
| DUP_VAL_ON_INDEX | 唯一索引冲突 |
| ZERO_DIVIDE | 除数为零 |
| OTHERS | 其他异常 |