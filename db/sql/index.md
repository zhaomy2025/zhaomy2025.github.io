---
title: SQL
date: 2025-07-03T07:19:02.059Z
category:
  - db
  - sql
tags:
  - db
  - sql
---

# SQL
[[toc]]

SQL（Structured Query Language，结构化查询语言）是操作关系型数据库的语言。它用于描述要查询、写入或修改的数据，而不是规定数据库内部应该怎样执行这些操作。

## SQL 的特点

SQL 主要有三个特点：

- **面向集合**：一次语句通常处理一组数据，而不是像普通程序一样逐行调用操作。
- **声明式**：开发者描述想要什么结果，数据库负责选择访问路径和执行计划。
- **标准与方言并存**：SQL 有标准语法，但 MySQL、Oracle、SQL Server 和 PostgreSQL 都在此基础上提供了各自的扩展。

因此，同一个业务查询在不同数据库之间迁移时，表结构和基本查询通常可以复用，但函数、分页、日期处理、递归查询和管理命令可能需要调整。

## SQL 语句的主要类别

### 数据查询语言

数据查询语言（DQL）用于从数据库读取数据，最常见的语句是 `SELECT`：

```sql
SELECT department_id, COUNT(*) AS employee_count
FROM employees
WHERE status = 'ACTIVE'
GROUP BY department_id
HAVING COUNT(*) > 10
ORDER BY employee_count DESC;
```

这条语句依次完成筛选、分组、分组筛选和排序。数据库不会机械地按照书写顺序执行，而是会先解析语句，再生成执行计划。

### 数据操作语言

数据操作语言（DML）用于新增、修改和删除数据：

```sql
INSERT INTO employees (employee_id, employee_name)
VALUES (1001, 'Alice');

UPDATE employees
SET employee_name = 'Alicia'
WHERE employee_id = 1001;

DELETE FROM employees
WHERE employee_id = 1001;
```

写操作通常受事务控制。事务的提交、回滚和隔离级别决定了这些修改什么时候对其他会话可见，以及发生异常时如何处理。

### 数据定义语言

数据定义语言（DDL）用于定义数据库对象，例如表、索引、视图和约束：

```sql
CREATE TABLE employees (
    employee_id BIGINT PRIMARY KEY,
    employee_name VARCHAR(100) NOT NULL
);

CREATE INDEX idx_employees_name
ON employees(employee_name);
```

DDL 的事务行为和隐式提交规则依数据库产品而异，执行前应确认目标数据库的语义。

### 数据控制语言

数据控制语言（DCL）用于管理数据库对象的访问权限，常见语句包括：

```sql
GRANT SELECT ON employees TO app_user;
REVOKE SELECT ON employees FROM app_user;
```

权限设计应遵循最小权限原则，不要因为排查问题而长期授予过大的访问范围。

### 事务控制语句

事务控制语句用于控制一组数据修改的边界：

```sql
BEGIN;

UPDATE accounts
SET balance = balance - 100
WHERE account_id = 1;

UPDATE accounts
SET balance = balance + 100
WHERE account_id = 2;

COMMIT;
```

不同数据库对事务开始、自动提交和 DDL 的处理方式可能不同。应用程序应明确连接的自动提交状态，并在异常路径正确回滚。

## 一条查询是怎样执行的

数据库执行查询通常会经历以下阶段：

1. **词法和语法分析**：检查关键字、表达式和语法结构是否合法。
2. **语义分析**：检查表、列、函数和权限是否存在且可用。
3. **查询重写**：根据视图、谓词和优化规则改写查询。
4. **生成执行计划**：决定使用索引还是全表扫描、采用哪种连接算法以及表的连接顺序。
5. **执行计划**：访问数据页、完成过滤和连接，并返回结果。

这也是“SQL 写法相同但性能不同”的原因之一：最终耗时不仅取决于语句文本，还取决于数据分布、统计信息、索引、参数和执行计划。

## SQL 与数据库对象

SQL 不只用于查询数据，还会和多种数据库对象协作：

- **表**：保存业务数据。
- **约束**：限制数据必须满足的规则，例如主键、唯一性、外键和检查条件。
- **索引**：为特定访问条件提供更快的查找路径，但会增加写入和存储成本。
- **视图**：保存一个查询定义，为调用方提供稳定的逻辑结构。
- **存储过程和函数**：把部分处理逻辑放到数据库端执行。
- **触发器**：在数据变更等事件发生时自动执行指定逻辑。

这些对象分别解决数据完整性、访问性能、复用查询和封装逻辑等问题，不能简单地互相替代。

## 使用 SQL 时需要注意

- 不要只凭 SQL 文本判断性能，应结合执行计划和实际数据量分析。
- 更新或删除数据时应带上明确条件，必要时先用同样条件执行 `SELECT` 验证范围。
- 需要分页、日期函数、字符串函数或递归查询时，先确认目标数据库的方言差异。
- 不要把应用层拼接用户输入直接放进 SQL，参数应通过预编译语句绑定，避免 SQL 注入。
- 结构变更、批量写入和长事务都应评估锁、日志、回滚和对线上业务的影响。

SQL 是访问关系型数据库的共同语言，但可靠的数据库应用还需要同时理解事务、约束、索引、权限和执行计划。