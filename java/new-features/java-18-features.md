---
title: Java 18 新特性
date: 2025-08-25T10:10:00.000Z
category:
  - java
  - new-features
tags:
  - java
  - java18
  - new-features
---

# Java 18 新特性

[[toc]]

## 概述
Java 18 于 2022 年 3 月发布，是一个非长期支持版本，包含了多个新特性和改进。

## 主要新特性

### JEP 400: 默认UTF-8编码

::: info JEP 400: UTF-8 by Default
Specify UTF-8 as the default charset of the standard Java APIs. With this change, APIs that depend upon the default charset will behave consistently across all implementations, operating systems, locales, and configurations.
:::

Java 18 将 UTF-8 设为默认编码，解决了跨平台编码不一致的问题。

### JEP 408: 简单Web服务器
::: info JEP 408: Simple Web Server

:::

提供了一个轻量级的Web服务器，用于测试和开发目的。

```java
// 启动简单Web服务器
var server = com.sun.net.httpserver.SimpleFileServer.createFileServer(
    new InetSocketAddress(8080), Path.of("."), com.sun.net.httpserver.SimpleFileServer.OutputLevel.INFO);
server.start();
```

### JEP 413: Java API 文档中的代码片段
::: info
**JEP 413: Code Snippets in Java API Documentation**
Introduce an @snippet tag for JavaDoc's Standard Doclet, to simplify the inclusion of example source code in API documentation.
:::

### JEP 416: 使用方法句柄重新实现核心反射
::: info
**JEP 416: Reimplement Core Reflection with Method Handles**
Reimplement java.lang.reflect.Method, Constructor, and Field on top of java.lang.invoke method handles. Making method handles the underlying mechanism for reflection will reduce the maintenance and development cost of both the java.lang.reflect and java.lang.invoke APIs.
:::

### JEP 417: 向量 API（第三次孵化）

::: info
**JEP 417: Vector API (Third Incubator)**
Introduce an API to express vector computations that reliably compile at runtime to optimal vector instructions on supported CPU architectures, thus achieving performance superior to equivalent scalar computations.
:::

### JEP 418: 互联网地址解析服务提供者接口

::: info
**JEP 418: Internet-Address Resolution SPI**
Define a service-provider interface (SPI) for host name and address resolution, so that java.net.InetAddress can make use of resolvers other than the platform's built-in resolver.
:::

### JEP 419: 外部函数与内存 API（第二次孵化）
::: info
**JEP 419: Foreign Function & Memory API (Second Incubator)**
Introduce an API by which Java programs can interoperate with code and data outside of the Java runtime. By efficiently invoking foreign functions (i.e., code outside the JVM), and by safely accessing foreign memory (i.e., memory not managed by the JVM), the API enables Java programs to call native libraries and process native data without the brittleness and danger of JNI.
:::

### JEP 420: 模式匹配（第二次预览）
::: info
**JEP 420: Pattern Matching for switch (Second Preview)**
Enhance the Java programming language with pattern matching for switch expressions and statements, along with extensions to the language of patterns. Extending pattern matching to switch allows an expression to be tested against a number of patterns, each with a specific action, so that complex data-oriented queries can be expressed concisely and safely. This is a preview language feature in JDK 18.
:::

扩展了switch语句的模式匹配能力。

```java
Object obj = "Hello";
String result = switch (obj) {
    case String s && s.length() > 5 -> "Long string";
    case String s -> "Short string";
    case Integer i -> "Integer value";
    default -> "Other type";
};
```

### JEP 421: 弃用终结方法以便后续移除

::: info
**JEP 421: Deprecate Finalization for Removal**
Deprecate finalization for removal in a future release. Finalization remains enabled by default for now, but can be disabled to facilitate early testing. In a future release it will be disabled by default, and in a later release it will be removed. Maintainers of libraries and applications that rely upon finalization should consider migrating to other resource management techniques such as the try-with-resources statement and cleaners.
:::