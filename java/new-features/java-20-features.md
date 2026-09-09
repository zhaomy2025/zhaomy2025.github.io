---
title: Java 20 新特性
date: 2025-08-25T10:30:00.000Z
category:
  - java
  - new-features
tags:
  - java
  - java20
  - new-features
---

# Java 20 新特性

[[toc]]

## 概述
Java 20 于 2023 年 3 月发布，包含了多个新特性和改进。

## 主要新特性

### JEP 429: 作用域值 (孵化)

::: info JEP 429: Scoped Values (Incubator)
Introduce scoped values, which enable the sharing of immutable data within and across threads. They are preferred to thread-local variables, especially when using large numbers of virtual threads. This is an incubating API.
:::

### JEP 432: 记录模式（第二次预览）
::: info JEP 432: Record Patterns (Second Preview)
Enhance the Java programming language with record patterns to deconstruct record values. Record patterns and type patterns can be nested to enable a powerful, declarative, and composable form of data navigation and processing. This is a preview language feature.
:::
它增强了语言，允许在 instanceof 和 switch 中解构 record 值，是模式匹配的重要组成部分。
### JEP 433: 模式匹配增强（第四次预览）

::: info JEP 433: Pattern Matching for switch (Fourth Preview)
Enhance the Java programming language with pattern matching for switch expressions and statements. Extending pattern matching to switch allows an expression to be tested against a number of patterns, each with a specific action, so that complex data-oriented queries can be expressed concisely and safely. This is a preview language feature.
:::

### JEP 434: 外部函数和内存 API（第二次预览）
::: info JEP 434: Foreign Function & Memory API (Second Preview)
Introduce an API by which Java programs can interoperate with code and data outside of the Java runtime. By efficiently invoking foreign functions (i.e., code outside the JVM), and by safely accessing foreign memory (i.e., memory not managed by the JVM), the API enables Java programs to call native libraries and process native data without the brittleness and danger of JNI. This is a preview API.
:::

### JEP 436: 虚拟线程（第二次预览）

::: info JEP 436: Virtual Threads (Second Preview)
Introduce virtual threads to the Java Platform. Virtual threads are lightweight threads that dramatically reduce the effort of writing, maintaining, and observing high-throughput concurrent applications. This is a preview API.
:::

### JEP 437: 结构化并发（第二次孵化）
::: info JEP 437: Structured Concurrency (Second Incubator)
Simplify multithreaded programming by introducing an API for structured concurrency. Structured concurrency treats multiple tasks running in different threads as a single unit of work, thereby streamlining error handling and cancellation, improving reliability, and enhancing observability. This is an incubating API.
:::

### JEP 438: 向量 API（第五次孵化）
::: info JEP 438: Vector API (Fifth Incubator)
Introduce an API to express vector computations that reliably compile at runtime to optimal vector instructions on supported CPU architectures, thus achieving performance superior to equivalent scalar computations.
:::