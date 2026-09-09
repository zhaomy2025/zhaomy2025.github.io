---
title: Java 17 新特性
date: 2025-08-25T10:00:00.000Z
category:
  - java
  - new-features
tags:
  - java
  - java17
  - new-features
---

# Java 17 新特性

[[toc]]

## 概述
Java 17 是 Java SE 平台的一个长期支持 (LTS) 版本，于 2021 年 9 月发布。它包含了多个重要的新特性和改进。

## 主要新特性

### JEP 406: 模式匹配（预览）
::: info JEP 406: Pattern Matching for switch (Preview)
Enhance the Java programming language with pattern matching for switch expressions and statements, along with extensions to the language of patterns. Extending pattern matching to switch allows an expression to be tested against a number of patterns, each with a specific action, so that complex data-oriented queries can be expressed concisely and safely. This is a preview language feature in JDK 17.
:::

### 密封类 (Sealed Classes)
密封类限制了哪些类可以继承它，提供了更好的封装和类型安全性。

```java
public sealed class Shape permits Circle, Rectangle, Triangle {
    // 类定义
}

public final class Circle extends Shape {
    // 类定义
}
```

### 模式匹配增强 (Pattern Matching Enhancements)
Java 17 扩展了模式匹配功能，使 instanceof 操作符更加简洁。

```java
if (obj instanceof String s) {
    // 可以直接使用变量 s
    System.out.println(s.length());
}
```

### 始终严格的浮点语义 (Always-Strict Floating-Point Semantics)
确保在所有平台上浮点运算的行为一致。

### 其他改进
- 弃用 Applet API
- 增强的伪随机数生成器
- 移除实验性的 AOT 和 JIT 编译器
- 矢量 API ( incubator )
- 外部函数和内存 API (预览)