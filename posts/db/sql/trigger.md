---
title: 触发器
date: 2025-07-07T05:16:50.005Z
category:
  - db
  - sql
  - trigger
tags:
  - db
  - sql
  - trigger
---

# 触发器
[[toc]]

## 创建触发器
基础语法：
```sql
CREATE OR REPLACE TRIGGER trigger_name
BEFORE INSERT OR UPDATE OR DELETE ON table_name
FOR EACH ROW
BEGIN
    -- trigger body
END;
```

示例：
::: code-tabs
@tabs 日志触发器
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

@tabs 大写字母转换前置触发器
```sql
CREATE OR REPLACE TRIGGER customer_state
    BEFORE INSERT OR UPDATE ON Customers
    FOR EACH ROW
BEGIN
    :NEW.cust_state := UPPER(:NEW.cust_state);
END;
/
```

@tab 大写字母转换后置触发器
```sql
-- NEW对象包含的时插入/修改后的行数据，即使原UPDATE语句没有显式修改cust_id，NEW.cust_id仍然会包含该行当前的cust_id值
CREATE OR REPLACE TRIGGER customer_state
    AFTER INSERT OR UPDATE ON Customers
    FOR EACH ROW
BEGIN
    UPDATE Customers
    SET cust_state = UPPER(cust_state)
    WHERE cust_id = :NEW.cust_id;
END;
```
:::

::: tip
BEFORE 触发器更高效，直接在数据写入前修改，避免额外的UPDATE语句。
:::
