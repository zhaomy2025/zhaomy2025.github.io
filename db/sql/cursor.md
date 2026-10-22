---
title: 游标
date: 2025-07-03T07:19:02.057Z
category:
  - db
  - sql
  - cursor
tags:
  - db
  - sql
  - cursor
---

# 游标
[[toc]]
<!-- TODO 滚动游标 -->

## 游标的概念
<!-- @include:./cursor_intro.md -->

---

## 游标的作用
1. 逐行处理数据：适用于大数据量查询，避免内存溢出。
2. 支持定位更新：可以基于游标位置修改或删除数据。
3. 支持滚动操作：某些游标可以向前或向后移动（如 `SCROLL` 游标）。
4. 适用于复杂业务逻辑：在存储过程中实现多步骤数据处理。

---

## 游标的类型

### 静态游标（Static Cursor）
- 在打开游标时生成数据的快照，后续数据变化不影响游标内容
- 内存中存储完整结果集，性能较好但占用内存较多
- 适用于数据稳定、不需要实时更新的场景
- Oracle中无原生支持

### 动态游标（Dynamic Cursor）
- 实时反映数据变化，其他事务的修改会立即影响游标结果
- 不缓存数据，每次fetch都重新获取最新数据  
- 适用于需要实时数据的场景，但性能较低
- 通过`REF CURSOR`实现，可使用`OPEN-FOR`动态绑定SQL语句
- Oracle 12c+ 通过`SYS_REFCURSOR`有限支持滚动游标

### 键集驱动游标（Keyset-Driven Cursor）
- 仅缓存行的主键（Key），数据变化时会重新获取最新值
- 可用检测到已fetch行的变化，不能检测到新插入的行  
- 平衡了静态和动态游标的优缺点
- Oracle中无原生支持，通常用`FOR UPDATE`模拟，在SQL Server等数据库中可直接声明为`KEYSET`

### 前向游标（Forward-Only Cursor）
- 只能单向（向前）遍历数据，不支持回滚
- 可能看到后续数据的变化
- 不缓存或少量缓存数据，内存占用较少  
- 性能最高，适用于只读遍历
- Oracle中默认游标为前向游标

### 对比
::: tip
在Oracle PL/SQL中
  - 默认游标为前向游标
  - 动态游标通过`REF CURSOR`实现，Oracle 12c+ 通过`SYS_REFCURSOR`部分支持滚动游标(仅动态游标能支持滚动功能)
  - 键集驱动游标通过`FOR UPDATE`模拟
  - 不支持静态游标
:::

以下是四种PL/SQL游标类型的对比表格，从多个维度展示它们的区别：

| 对比维度               | 静态游标 (Static Cursor)                     | 动态游标 (Dynamic Cursor)                  | 键集驱动游标 (Keyset-Driven Cursor)       | 前向游标 (Forward-Only Cursor)         |
|------------------------|---------------------------------------------|-------------------------------------------|------------------------------------------|---------------------------------------|
| **数据快照**           | 打开时创建完整快照                          | 不创建快照，实时反映数据变化               | 仅缓存键值（主键）                       | 不创建快照                            |
| **内存占用**           | 高（存储全部结果集）                        | 低（每次fetch重新获取）                   | 中（仅存储键值）                         | 最低（仅缓存当前行）                  |
| **数据敏感性**         | 不敏感（INSENSITIVE）                       | 敏感（SENSITIVE）                         | 部分敏感（仅对已取出行敏感）             | 敏感                                  |
| **遍历方向**           | 支持双向（若声明为SCROLL）                  | 通常双向                                  | 通常双向                                 | 仅前向                                |
| **反映数据修改**       | ❌ 不反映任何后续修改                        | ✔️ 实时反映所有修改                        | ✔️ 仅反映已fetch行的更新/删除             | 取决于实现（通常反映）                |
| **检测新增数据**       | ❌ 不检测                                   | ✔️ 可检测                                 | ❌ 不检测                                | 取决于实现                            |
| **更新能力**           | 通常只读                                    | 可更新                                    | ✔️ 支持定位更新（WHERE CURRENT OF）       | 通常只读                              |
| **语法示例**           | `CURSOR c IS SELECT...`                     | `TYPE t IS REF CURSOR; c t;`              | `CURSOR c IS SELECT... FOR UPDATE;`      | `CURSOR c IS SELECT...`（默认前向）   |
| **打开性能**           | 差（需加载全部数据）                        | 优（无预加载）                            | 中（需加载键值）                         | 最优                                  |
| **Fetch性能**          | 最优（内存访问）                              | 差（需实时查询）                          | 中（需通过键值获取数据）                 | 优                                    |
| **适用场景**           | 报表生成、需要数据一致性                    | 实时监控、需反映最新数据                  | 数据修改、需要平衡性能与实时性           | 大数据量只读遍历                      |
| **Oracle实现**         | 显式游标                                    | REF CURSOR                                | 通过FOR UPDATE模拟                       | 默认游标类型                          |
| **事务隔离**           | 打开时锁定数据                              | 不锁定（读最新提交）                      | 锁定已fetch行                            | 不锁定                                |


::: tip
数据敏感性是指游标是否会看到其他事务对数据的修改。
:::
::: tip
为什么动态游标内存 > 前向游标？
虽然两者都不缓存完整结果集，但动态游标需要：
  - 维护更复杂的游标状态（如敏感性与事务隔离）。
  - 可能缓存部分元数据（如查询计划）。
  - 支持动态 SQL 解析（如果是 REF CURSOR 绑定变量）。
而前向游标：
  - 是数据库的最简实现，几乎无额外开销。
  - 可能直接复用数据库引擎的流式查询接口。

:::

### 选择建议：
- 需要数据一致性 → **静态游标**
- 需要实时数据 → **动态游标**
- 需要修改数据 → **键集驱动游标**
- 只需快速遍历 → **前向游标**

---

## 游标的基本操作（以 PL/SQL 为例）
使用游标涉及以下四个步骤：
1. 声明游标：使用游标前，必须声明它，这个过程实际上没有检索数据，它只是定义要使用的 SELECT 语句和游标选项
2. 打开游标：使用 `OPEN` 语句打开游标，该语句实际上执行 SELECT 语句并生成结果集。
3. 循环读取数据：使用 `LOOP` 循环，每次使用 `FETCH` 语句获取当前行数据，并处理数据。
4. 关闭游标：使用 `CLOSE` 语句关闭游标，释放资源。

### 基础用法（前向游标）
```sql
DECLARE
    CURSOR cursor_name IS
        SELECT column1, column2 FROM table_name WHERE condition;
    -- 定义变量存储游标数据
    v_column1 table_name.column1%TYPE;
    v_column2 table_name.column2%TYPE;
BEGIN
    -- 打开游标
    OPEN cursor_name;
    
    -- 循环读取数据
    LOOP
        -- 获取当前行数据
        FETCH cursor_name INTO v_column1, v_column2;        
        -- 如果没有数据，退出循环
        EXIT WHEN cursor_name%NOTFOUND;        
        -- 处理数据（如打印或更新）
        DBMS_OUTPUT.PUT_LINE(v_column1 || ', ' || v_column2);
    END LOOP;
    
    -- 关闭游标
    CLOSE cursor_name;
END;
```

### 带参数的游标
```sql
DECLARE
    CURSOR emp_cursor (dept_id NUMBER) IS
        SELECT * FROM employees WHERE department_id = dept_id;
BEGIN
    OPEN emp_cursor(10);  -- 查询部门ID=10的员工
    -- ... 处理数据
    CLOSE emp_cursor;
END;
```

### 使用 `FOR` 循环简化游标
```sql
BEGIN
    FOR emp_rec IN (SELECT * FROM employees) LOOP
        DBMS_OUTPUT.PUT_LINE(emp_rec.employee_name);
    END LOOP;
END;
```

---

---

### 动态游标

动态游标是指游标内容实时反映数据库变化，其他事务的修改立即影响游标结果。使用动态游标涉及以下四个步骤：
1. 声明游标：使用`REF CURSOR`声明游标
2. 打开游标：使用`OPEN cursor_name for select ...`打开游标并动态绑定SQL语句
3. 循环读取数据：使用 `LOOP` 循环，每次使用 `FETCH` 语句获取当前行数据，并处理数据
4. 关闭游标：使用 `CLOSE` 语句关闭游标，释放资源。

::: tip
动态游标和静态游标只有前两个步骤是不同于的，后续步骤相同：
- 步骤1：静态游标使用`CURSOR`声明游标并绑定SQL语句；动态游标先使用`TYPE cursor_type IS REF CURSOR`声明游标类型，再使用游标类型声明动态游标
- 步骤2：静态游标使用`OPEN`打开游标，并执行SQL语句；动态游标使用`OPEN cursor_name FOR select ...`打开游标并并动态绑定SQL语句
:::
  
```sql
DECLARE
  -- 动态游标声明(使用REF CURSOR)
  TYPE emp_cursor_type IS REF CURSOR;
  dynamic_emp_cursor emp_cursor_type;
  
  v_emp_id employees.employee_id%TYPE;
  v_first_name employees.first_name%TYPE;
  v_last_name employees.last_name%TYPE;
BEGIN
  OPEN dynamic_emp_cursor FOR
    SELECT employee_id, first_name, last_name
    FROM employees
    WHERE department_id = 20;
  
  DBMS_OUTPUT.PUT_LINE('--- 动态游标结果 ---');
  LOOP
    FETCH dynamic_emp_cursor INTO v_emp_id, v_first_name, v_last_name;
    EXIT WHEN dynamic_emp_cursor%NOTFOUND;
    
    DBMS_OUTPUT.PUT_LINE(v_emp_id || ' ' || v_first_name || ' ' || v_last_name);
  END LOOP;
  
  CLOSE dynamic_emp_cursor;
END;
```

### 支持滚动功能的动态游标
Oracle 12c 引入了游标滚动功能，通过`SYS_REFCURSOR`的扩展功能实现。
```sql
DECLARE
  c SYS_REFCURSOR;
  v_emp employees%ROWTYPE;
BEGIN
  OPEN c FOR SELECT * FROM employees;
  -- 可以使用 FETCH FIRST/NEXT/PRIOR/LAST 等（需12c+）
  FETCH c INTO v_emp; -- 仍然默认前向
END;
```

### 键集驱动游标

键集驱动游标是指仅缓存行的主键（Key），数据变化时会重新获取最新值。Oracle中无原生支持，通常用`FOR UPDATE`模拟：

```sql
DECLARE
    CURSOR c_keyset IS
        SELECT * FROM employees
        WHERE department_id = 10
        FOR UPDATE; -- 锁定键值
BEGIN
    FOR r_emp IN c_keyset LOOP
            -- 每次FETCH需通过ROWID回表
            UPDATE employees SET salary = salary*1.1
            WHERE CURRENT OF c_keyset;
        END LOOP;
END;
```

## 游标的属性

| 属性 | 说明 |
|------|------|
| `%ISOPEN` | 判断游标是否已打开（`TRUE/FALSE`） |
| `%FOUND` | 检查 `FETCH` 是否成功获取数据 |
| `%NOTFOUND` | 检查 `FETCH` 是否没有数据 |
| `%ROWCOUNT` | 返回当前已读取的行数 |

示例：
```sql
IF cursor_name%ISOPEN THEN
    DBMS_OUTPUT.PUT_LINE('游标已打开');
END IF;
```

---

## 游标的优缺点
### 优点
- 适用于逐行处理大数据集。
- 支持定位更新（剪辑驱动游标`WHERE CURRENT OF`）。
- 灵活控制数据访问（如 `SCROLL` 游标支持前后移动）。

### 缺点
- 性能较低：相比直接 SQL 操作，游标需要额外资源。
- 可能引发锁问题：长时间打开的游标可能阻塞其他事务。
- 内存消耗：大数据量游标可能导致内存不足。

---

## 适用场景
1. 数据逐行处理（如批量更新、数据迁移）。
2. 复杂业务逻辑（如财务对账、报表生成）。
3. 需要定位更新的操作（如 `UPDATE ... WHERE CURRENT OF`）。

---

## 替代方案
如果游标性能较差，可考虑：
- 批量 SQL 操作（如 `UPDATE ... WHERE ...`）。
- 临时表 + 集合操作（如 `INSERT INTO temp_table SELECT ...`）
- 使用 `FORALL` 或 `BULK COLLECT`<Tip>Oracle PL/SQL 优化方式</Tip>
- 使用 `MERGE INTO TABLE_NAME USING ... ON ... WHEN MATCHED THEN UPDATE ... WHEN NOT MATCHED THEN INSERT ...` 批量插入或更新数据

---

## 不同数据库的游标支持

| 数据库 |  支持游标类型 | 基本语法 | 是否支持滚动 |
|--------|---------|------|------|
| Oracle     | 前向（默认）/ 动态（`REF CURSOR`）/键集（`FOR UPDATE`）游标 | `DECLARE CURSOR cursor_name IS SELECT ...` | Oracle 12c+ 通过`SYS_REFCURSOR`有限支持滚动游标(仅动态游标能支持滚动功能) |
| SQL Server | 静态/动态/键集游标      | `DECLARE cursor_name CURSOR FOR ...`  | 完全支持，可明确声明 SCROLL 或 FAST_FORWARD（前向）游标|
| MySQL      | 仅支持存储过程中的游标   | `DECLARE cursor_name CURSOR FOR ...`  | 不支持 SCROLL |
| PostgreSQL |                     | `DECLARE cursor_name CURSOR FOR ...`  | 默认为 `NO SCROLL`，可声明为 `SCROLL`|
| SQLite | 支持的游标称为步骤（step） | \ | \ |
| Microsoft Access  | 不支持游标   | \ | \ |

---

## 总结
- 游标适用于逐行处理数据，但应避免滥用（大数据量时优先考虑集合操作）。
- 静态游标性能较好，动态游标数据最新。
- 可使用 `FOR` 循环简化游标代码。
- 注意游标的打开/关闭，避免资源泄漏。