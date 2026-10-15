---
title: Spring Boot 常见错误及解决方案
date: 2026-09-23
category:
  - spring
  - spring-boot-faq
tags:
  - spring
  - spring-boot-faq
---

# Spring Boot 常见错误及解决方案
[[toc]]

搭 Spring Boot 项目时会撞上的报错，大多来自依赖版本、日志框架、编译级别这几处固定的地方。下面按报错原文逐条给出原因和改法。

本文以 Spring Boot 3.x 为准。

## log4j2 不输出日志

产生原因是 classpath 里同时出现了两个方向相反的 slf4j 绑定：`log4j-slf4j2-impl`（slf4j → log4j2，由 `spring-boot-starter-log4j2` 带来）和 `log4j-to-slf4j`（log4j2 API → slf4j，`spring-boot-starter-logging` 里带的）。这一组合由 Apache log4j2 自己拦截：`log4j-slf4j2-impl` 的 `Log4jLoggerFactory.validateContext()` 一旦发现 `log4j-to-slf4j` 的 `org.apache.logging.slf4j.SLF4JLoggerContext` 存在，就直接抛出 `LoggingException`，消息点名这两者不能共存（消息里的 artifact 名随 log4j2 版本变化，见下方 tip）。后果是日志丢失，甚至完全不输出。完整排查过程收录在日志系列：

::: tip 版本前提
上面的 `log4j-slf4j2-impl` 是 slf4j 2.x 的适配器，Spring Boot 3.x 起随 `spring-boot-starter-log4j2` 引入；Spring Boot 2.x 用的还是 slf4j 1.x，这个包当时叫 `log4j-slf4j-impl`。

异常消息里的 artifact 名跟的是 **log4j2 的版本**，不是 Spring Boot 的大版本：log4j2 **2.20.0** 之前抛的是 `"log4j-slf4j-impl cannot be present with log4j-to-slf4j"`，2.20.0 起才改成 `"log4j-slf4j2-impl cannot be present with log4j-to-slf4j"`。Spring Boot 3.0.x 带的是 log4j2 2.19.0，打出的是旧名——照报错原文搜的时候两种名字都得试。
:::

[log4j2 · 常见问题](../java/basic/logging/log4j2.md#log4j2-不输出日志)

## 编译报 com.sun.tools.javac.code.TypeTags

这个错是 lombok 与 JDK 版本不匹配造成的。lombok 要适配编译器的内部结构，每跟进一个新 JDK 大版本都得跟着发一次版，升了 JDK 没升 lombok 就会在初始化阶段抛出来：

```text
java.lang.ExceptionInInitializerError: com.sun.tools.javac.code.TypeTags
```

各 JDK 版本对应的最低 lombok（取自官方 changelog 的措辞）：

| JDK | 最低 lombok | changelog |
| --- | --- | --- |
| 9 | 1.16.16 | JDK9 now supported for compilation |
| 10 / 11 | 1.18.4 | Many improvements for lombok's JDK10/11 support |
| 12 | 1.18.6 | lombok wasn't working with the JDK12 preview（本版修复） |
| 13 / 14 | 1.18.12 | Support for JDK13 … Support for JDK14 |
| 15 | 1.18.16 | Improved support for recent JVM/javac versions (14 and 15) |
| 16 | 1.18.20 | JDK16 support added |
| 17 | 1.18.22 | JDK17 support added |
| 18 | 1.18.24 | JDK18 support added |
| 19 | 1.18.26 | JDK19 support added |
| 20 | 1.18.28 | JDK20 support added |
| 21 | 1.18.30 | Initial JDK21 support added |
| 22 | 1.18.32 | JDK22 support added |
| 23 | 1.18.36 | JDK23 support added |
| 24 | 1.18.38 | JDK24 support added |
| 25 | 1.18.40 | JDK25 support added |

两条路，任选其一：

- 把 lombok 升级到对应版本以上
- 把项目降回原本使用的 JDK 8

## 编译报 -source 1.5 不支持 diamond 运算符

`new ArrayList<>()` 这种把泛型实参留给编译器推断的写法叫 diamond 运算符，Java 7 才引入。报这个错说明项目的语言级别还停在 1.5：

```text
java: -source 1.5 中不支持 diamond 运算符
  (请使用 -source 7 或更高版本以启用 diamond 运算符)
```

IDEA 里改成 7 或更高：

```text
File → Project Structure → Modules → Sources → Language level
```

改完记得确认 `Project Structure → Project → Language level` 和 Maven 的 `maven-compiler-plugin`（或 `java.version` 属性）也一致——这三处任何一处没跟上，编译期仍会按旧级别处理。
