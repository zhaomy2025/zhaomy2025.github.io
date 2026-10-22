---
title: 字符串在不同语言中的对比
date: 2024-04-30 10:04:11
tags:
  - 语言对比
  - 字符串
  - Java
  - JavaScript
  - Python
  - MySQL
  - Oracle
categories:
  - 语言对比
---
# 字符串在不同语言中的对比

[[toc]]

本文对照 Java、JavaScript、Python、Redis 以及 SQL 中字符串的常见操作写法。Redis 的 String 是挂在 key 上、由服务端命令操作的二进制安全值，不是 Java 等语言中的进程内字符串对象，它的命令主要覆盖取值、截取、追加和覆盖写入；查找、类型判断、分割、大小写、填充、去空白、统计出现次数这些操作没有通用命令，通常由客户端取出值后处理，需要服务端逻辑时可以使用 Lua 或 Redis Functions。组织方式和[集合对比](./collections.md)一致：以「某个需求怎么表达」为入口，不表示各语言或 Redis 命令的同名操作在边界、编码、持久化或异常行为上等价。

数据库这一侧有个额外的坑：Oracle（PL/SQL）、MySQL、SQL Server（T-SQL）三家对同一件事的函数名和参数顺序经常不一样。所以下表只在三家写法确实不同时才拆方言行，写法一致的行只标 `SQL`。

## 截取

| 语言 | 写法 | 说明 |
|---|---|---|
| Java / JavaScript | `substring(start)`<br>`substring(start, end)` | `start` 是开始位置<br>`end` 是结束位置（不含），省略表示取到末尾 |
| Python | `s[start:]`<br>`s[start:end]`<br>`s[start:end:step]` | `start` 是开始位置<br>`end` 是结束位置（不含），省略表示取到末尾<br>负下标从末尾算 |
| Redis | `GET key`<br>`GETRANGE key start end` | Redis 的下标从 0 开始<br>`GETRANGE` 的结束下标包含在结果中<br>`start` / `end` 可为负数，表示从末尾计算 |
| Oracle（PL/SQL）| `SUBSTR(char, position)`<br>`SUBSTR(char, position, substring_length)` | `position` 是开始位置，为负时从末尾往前数<br>`substring_length` 是要取的长度，省略则取到末尾 |
| MySQL | `SUBSTR(str, pos)` <br> `SUBSTR(str, pos, len)` <br> `SUBSTRING(str, pos)` <br> `SUBSTRING(str, pos, len)` | `pos` 是开始位置，为负时从末尾往前数<br>`len` 是要取的长度，省略则取到末尾 |
| SQL Server（T-SQL）| `SUBSTRING(expression, start, length)` | `start` 是开始位置，不支持负数<br>`length` 是要取的长度，必填且不能为负 |

<!--
三家把「开始位置」这个参数起了三个不同的名字：Oracle 叫 position、MySQL 叫 pos、SQL Server 叫 start；
长度参数同理，分别是 substring_length、len、length。上表沿用各家官方文档的命名。
-->

::: tip 下标起点
Java、JavaScript、Python 和 Redis 的索引从 0 开始；三家 SQL 的位置参数从 1 开始。JavaScript、Python 和 Redis 的查找结果通常用 -1 表示没找到，SQL 的位置函数通常返回 0；Python 的 `index()` 找不到时直接抛异常。
:::

## 查找

| 语言 | 写法 | 说明 |
|---|---|---|
| Java | `indexOf(ch)`<br>`indexOf(ch, fromIndex)`<br>`indexOf(str)`<br>`indexOf(str, fromIndex)`<br>`lastIndexOf()` | `fromIndex` 是开始搜索的索引，省略则从头找<br>`lastIndexOf` 从末尾往前找 |
| JavaScript | `indexOf(searchString)`<br>`indexOf(searchString, fromIndex)`<br>`lastIndexOf()` | `fromIndex` 是开始搜索的索引，省略则从头找<br>`lastIndexOf` 从末尾往前找 |
| Python | `find(str, begin, end)`<br>`rfind(str, begin, end)`<br>`index(str, begin, end)`<br>`rindex(str, begin, end)` | `find()` / `rfind()` 找到时返回起始索引，否则返回 -1<br>`index()` / `rindex()` 找到时返回起始索引，否则抛异常<br>`begin` / `end` 是搜索范围，省略则搜索全文 |
| Oracle（PL/SQL）| `INSTR(string, substring)`<br>`INSTR(string, substring, position)`<br>`INSTR(string, substring, position, occurrence)` | `position` 是开始搜索的位置，为负时从右往左搜索<br>`occurrence` 是取第几次出现 |
| MySQL | `INSTR(str, substr)`<br>`LOCATE(substr, str)`<br>`LOCATE(substr, str, pos)` | `pos` 是开始搜索的位置，省略则从头搜 |
| SQL Server（T-SQL）| `CHARINDEX(expressionToFind, expressionToSearch)`<br>`CHARINDEX(expressionToFind, expressionToSearch, start_location)` | `start_location` 是开始搜索的位置，省略则从头搜 |

::: warning 参数顺序是这里最容易踩的坑
- **串在前、子串在后**：Oracle `INSTR(string, substring)`、MySQL `INSTR(str, substr)`
- **子串在前、串在后**：MySQL `LOCATE(substr, str)`、SQL Server `CHARINDEX(expressionToFind, expressionToSearch)`
- 两组恰好相反 —— `LOCATE` 和 `CHARINDEX` 顺序一致，`INSTR` 与它们相反
:::

## 前缀与后缀

| 语言 | 前缀 | 后缀 | 说明 |
|---|---|---|---|
| Java | `startsWith(prefix)` | `endsWith(suffix)` | |
| Python | `startswith(prefix, begin, end)` | `endswith(suffix, begin, end)` | `begin` / `end` 是搜索范围，省略则搜全文 |
| SQL | `LIKE 'prefix%'` | `LIKE '%suffix'` | `%` 匹配任意字符 |
| MySQL | `LEFT(str, len)` | `RIGHT(str, len)` | `str` 是原串，`len` 是要比对的字符数 |
| SQL Server（T-SQL）| `LEFT(expression, len)` | `RIGHT(expression, len)` | `expression` 是原串，`len` 是要比对的字符数 |

## 类型判断

| 判断 | Java | JavaScript | Python | Oracle（PL/SQL）| MySQL | SQL Server（T-SQL）|
|---|---|---|---|---|---|---|
| 全是字母 | `s.matches("[a-zA-Z]+")` | `/^[a-zA-Z]+$/.test(s)` | `isalpha()` | `REGEXP_LIKE(s, '^[[:alpha:]]+$')` | `REGEXP_LIKE(s, '^[a-zA-Z]+$')` | `s NOT LIKE '%[^a-zA-Z]%'` |
| 全是数字 | `s.matches("[0-9]+")` | `/^[0-9]+$/.test(s)` | `isdigit()` | `REGEXP_LIKE(s, '^[[:digit:]]+$')` | `REGEXP_LIKE(s, '^[0-9]+$')` | `s NOT LIKE '%[^0-9]%'` |
| 全是字母或数字 | `s.matches("[a-zA-Z0-9]+")` | `/^[a-zA-Z0-9]+$/.test(s)` | `isalnum()` | `REGEXP_LIKE(s, '^[[:alnum:]]+$')` | `REGEXP_LIKE(s, '^[a-zA-Z0-9]+$')` | `s NOT LIKE '%[^a-zA-Z0-9]%'` |
| 全是空白 | `s.matches("\\s+")` | `/^\\s+$/.test(s)` | `isspace()` | `REGEXP_LIKE(s, '^[[:space:]]+$')` | `REGEXP_LIKE(s, '^[[:space:]]+$')` | `s NOT LIKE '%[^ ]%'` |
| 只含十进制字符 | `s.matches("[0-9]+")` | `/^[0-9]+$/.test(s)` | `isdecimal()` | 同「全是数字」 | 同「全是数字」 | `TRY_CONVERT(int, s) IS NOT NULL` |
| 数字字符（范围最宽）| / | / | `isnumeric()` | / | / | / |

::: warning SQL Server 没有正则
只能靠 `LIKE` 的字符类取反；那几条 `NOT LIKE` 对空串会判为真，且 `'%[^ ]%'` 只覆盖空格，不含制表符和换行。
:::

::: tip MySQL 为什么用字符范围而不用 POSIX 字符类
MySQL 官方文档建议用范围替代字符类：`[a-zA-Z]` 比 `[[:alpha:]]` 快得多，`[0-9]` 也比 `[[:digit:]]` 快。所以上表 MySQL 列写的是范围；空白类没有对应的范围写法，仍用 `[[:space:]]`。
:::

::: tip 两个 REGEXP_LIKE 不是同一个东西
Oracle 的 `REGEXP_LIKE` 是条件（condition）而非函数，官方文档归类在 Pattern-matching Conditions 下，行为类似 `LIKE`，走 POSIX 正则；MySQL 的 `REGEXP_LIKE` 是 8.0 起提供的函数，走 ICU 正则。正则方言不同，同一个 pattern 未必两家都适用。
:::

::: tip isdecimal / isdigit / isnumeric 的区别
三者是包含关系：`isdecimal` ⊂ `isdigit` ⊂ `isnumeric`。窄的能过，宽的必然也能过；反过来不成立。

| 字符 | `isdecimal()` | `isdigit()` | `isnumeric()` |
|---|---|---|---|
| `'0'`、`'٠'`（阿拉伯-印度数字零）| ✓ | ✓ | ✓ |
| `'²'`（上标 2）| ✗ | ✓ | ✓ |
| `'⅕'`、`'Ⅻ'`、`'三'` | ✗ | ✗ | ✓ |

差别在「能不能用来拼出十进制数」：`'²'` 算数字，但拼不出 22；`'⅕'` 连数字字符都不算，只是个数值。

所以要判断「这串能不能转成整数」，只能用 `isdecimal()` —— `'²'.isdigit()` 为真，但 `int('²')` 抛 `ValueError`。反过来注意 `isdecimal()` 不等于「只认 0-9」，`'٠'` 它判真且 `int()` 能转成 `0`。
:::

## 分割

| 语言 | 写法 | 说明 |
|---|---|---|
| Java | `split(regex)`<br>`split(regex, limit)` | `limit` 是切分次数上限<br>为正时最多切 `limit - 1` 次<br>为 0 时丢弃末尾空串<br>为负时不限次数 |
| JavaScript | `split(separator)`<br>`split(separator, limit)` | `separator` 可以是字符串或正则表达式<br>`limit` 限制结果数量 |
| Python | `split()`<br>`splitlines()`<br>`splitlines(keepends)` | `splitlines()` 按行分隔符（`\r`、`\r\n`、`\n`）切分，返回各行组成的列表<br>`keepends=True` 时保留换行符 |
| Oracle（PL/SQL）| `REGEXP_SUBSTR(s, '[^,]+', 1, level)` 配合 `CONNECT BY` 逐段取 | |
| MySQL | `SUBSTRING_INDEX(str, delim, count)` | /<br>`count` 是第几次出现<br>为正从左侧数<br>为负从右侧数 |
| SQL Server（T-SQL）| `STRING_SPLIT(string, separator)` | SQL Server 2016 及以上<br>数据库兼容级别不低于 130 |


只有 SQL Server 有真正的分割函数。Oracle 和 MySQL 都要绕：Oracle 走正则加层级查询，MySQL 的 `SUBSTRING_INDEX` 一次只能按分隔符切一刀，切多段要嵌套调用。

## 大小写

| 语言 | 转换所有字符 | 转换首字符 | 说明 |
|---|---|---|---|
| Java | `toLowerCase()` / `toUpperCase()`<br>`toLowerCase(locale)` / `toUpperCase(locale)` | / | 不带参数的用默认语言环境<br>带 `locale` 的用指定 Locale 的规则转换 |
| Python | `lower()`<br>`upper()`<br>`swapcase()` | `capitalize()` | |
| SQL | `UPPER(s)` / `LOWER(s)` | / | 三家写法一致 |
| Oracle（PL/SQL）| / | `INITCAP(s)` | `INITCAP`（首字母大写）只有 Oracle 有 |
| MySQL | `UCASE(s)` / `LCASE(s)` | / | `UPPER` / `LOWER` 的同义写法，只有 MySQL 有 |
| SQL Server（T-SQL）| `UPPER(s)` / `LOWER(s)` | / | 与 Oracle、MySQL 写法一致 |

## 填充

| 语言 | 写法 |
|---|---|
| Python | `center(width, fillchar)`<br>`ljust(width, fillchar)` / `rjust(width, fillchar)`<br>`zfill()` |
| Oracle（PL/SQL）| `LPAD(expr1, n)` / `RPAD(expr1, n)`<br>`LPAD(expr1, n, expr2)` / `RPAD(expr1, n, expr2)` |
| MySQL | `LPAD(str, len, padstr)` / `RPAD(str, len, padstr)` |

- **Oracle 与 MySQL 的 `LPAD` 参数个数不同**：`n` / `len` 都是目标长度，`expr1` / `str` 是原串。Oracle 的填充串 `expr2` 可省略（默认单个空格），MySQL 的 `padstr` 必填。两者在「原串长于目标长度时截断到目标长度」上一致。
- **SQL Server 没有 `LPAD` / `RPAD`**，要用 `RIGHT(REPLICATE(pad, n) + s, n)` 这类写法自己拼。

## 去空白

| 语言 | 去左侧 | 去右侧 | 去两端 |
|---|---|---|---|
| Java | `stripLeading()`（Java 11+）| `stripTrailing()`（Java 11+）| `trim()`<br>`strip()`（Java 11+）|
| Python | `lstrip()`<br>`lstrip(chars)` | `rstrip()`<br>`rstrip(chars)` | `strip()`<br>`strip(chars)` |
| Oracle（PL/SQL）| `LTRIM(char, set)` | `RTRIM(char, set)` | `TRIM(char)`<br>`TRIM(chars FROM char)` |
| MySQL | `LTRIM(str)` | `RTRIM(str)` | `TRIM(str)`<br>`TRIM(chars FROM str)` |
| SQL Server（T-SQL）| `LTRIM(s)`<br>`LTRIM(s, chars)`（2022+）| `RTRIM(s)`<br>`RTRIM(s, chars)`（2022+）| `TRIM(s)`（2017+）<br>`TRIM(chars FROM s)` |

- Oracle 的 `LTRIM` / `RTRIM` 的 `set` 省略时默认只去空格；`TRIM` 还可加 `LEADING` / `TRAILING` 只去一侧。
- **SQL Server 的 `TRIM` 是 2017 才有的**；`LTRIM` / `RTRIM` 在 2022 之前**只能去空格**，2022 起才支持指定要去除的字符（需要兼容级别 160）。
- Java 的 `trim()` 只去掉码点小于等于 `U+0020` 的字符，`strip()` 按 `Character.isWhitespace` 判定，覆盖面更广。

## 出现次数

| 语言 | 写法 | 说明 |
|---|---|---|
| Java | `s.split(x, -1).length - 1`<br>`indexOf` 循环 | |
| Python | `count(str, begin, end)` | `begin` / `end` 是搜索范围<br>省略则搜全文 |
| Oracle（PL/SQL）| `REGEXP_COUNT(source_char, pattern)` | |
| MySQL | `(LENGTH(s) - LENGTH(REPLACE(s, x, ''))) / LENGTH(x)` | |
| SQL Server（T-SQL）| 同上 | |

只有 Oracle 有 `REGEXP_COUNT` 可以直接数出现次数，MySQL、SQL Server 和 Java 都要用「原长度减去替换后的长度再除以子串长度」的差值算法。

## 编码

| 语言 | 写法 |
|---|---|
| Java | `getBytes(StandardCharsets.UTF_8)`<br>`new String(bytes, charset)` |
| Python | `encode` |
| Redis | `GET key` 取值<br>字节长度可用 `STRLEN key`<br>十六进制表示需由客户端转换 |
| Oracle（PL/SQL）| `CONVERT(char, dest_charset)`<br>`CONVERT(char, dest_charset, source_charset)`<br>`DUMP()` 查看内部表示 |
| MySQL | `CONVERT(str USING charset)`<br>`HEX(str)` 取十六进制 |
| SQL Server（T-SQL）| `CONVERT(VARBINARY, s)` 取字节 |

各家含义并不完全对应：Python 的 `encode` 和 Java 的 `getBytes` 是字符串转字节，MySQL 和 Oracle 的 `CONVERT` 是字符集之间的转换，SQL Server 的 `CONVERT(VARBINARY, s)` 才是取字节。

## Java 常用方法

| 方法 | 说明 |
|---|---|
| `compareTo(str)`<br>`compareTo(obj)`<br>`compareToIgnoreCase(str)` | 按字典顺序比较 |
| `equals()`<br>`equalsIgnoreCase()` | 按字典顺序判断是否相等 |
| `copyValueOf(data)`<br>`copyValueOf(data, offset, count)` | 获取字符数组对应的字符串 |
| `startsWith(prefix)`<br>`startsWith(prefix, toffset)` | 是否以指定前缀开始<br>带 `toffset` 的版本从指定索引开始的子串判断 |
| `subSequence(beginIndex, endIndex)` | 返回一个新的字符序列，是其子序列 |
| `getBytes()`<br>`getBytes(charsetName)` | 编码为 byte 序列，存入新数组<br>不带参数的用平台默认字符集 |
| `getChars(srcBegin, srcEnd, dst, dstBegin)` | 将字符从此字符串复制到目标字符数组 |
| `matches(regex)` | 是否匹配给定的正则表达式 |
| `regionMatches(toffset, other, ooffset, len)`<br>`regionMatches(ignoreCase, toffset, other, ooffset, len)` | `toffset` / `ooffset` 是两边各自的起始偏移，`len` 是要比对的字符数 |

## Python 内置方法

| 方法 | 说明 |
|---|---|
| `expandtabs(tabsize=8)` | 把 tab 符号转为空格，默认 8 个空格 |
| `maketrans()` | 创建字符映射的转换表。最简用法传两个等长字符串，第一个表示待转换字符，第二个表示转换目标 |
| `max(str)` | 返回字符串中最大的字母 |
| `min(str)` | 返回字符串中最小的字母 |
