---
title: JUL（JDK 1.4 起自带）
date: 2026-09-22
category:
  - Java
  - Java基础
  - 日志
tags:
  - Java
  - Java基础
  - 日志
  - JUL
---

# JUL（JDK 1.4 起自带）

[[toc]]

JUL 全称 Java Util Logging（`java.util.logging` 包），是 JDK 从 1.4 起随标准库一起发布的日志实现。它不需要任何第三方依赖，但配置方式和后来的 slf4j / logback 差别较大，实际项目里通常只作为兜底实现存在。

## 架构

```mermaid
flowchart LR
    APP["应用程序"] --> L["Logger<br>记录器"]
    L --> H["Handler<br>决定日志去向"]
    H --> F["Filter<br>按级别放行或拦截"]
    F --> FMT["Formatter<br>排版"]
    FMT --> OUT["控制台 / 文件 / 网络<br>系统日志"]
```

- **Loggers**：记录器。应用程序通过获取 Logger 对象、调用其 API 来发布日志信息，是访问日志系统的入口。
- **Handlers**：log4j 里叫 Appender。每个 Logger 关联一组 Handler，Logger 把日志交给它们处理。Handler 是抽象，具体实现决定日志记到哪里——控制台、文件、网络上的日志服务或操作系统日志。
- **Formatters**：log4j 里叫 Layout，负责把日志事件中的数据转换成字符串，决定一条日志记录的最终形式。
- **Level**：每条日志消息都带一个级别，粗略指示其重要性，可关联到 Logger 和 Handler 上用于过滤。
- **Filters**：过滤器，定制哪些信息被记录、哪些被放过。

Level 决定一条日志是否值得记录，Filter 决定它是否放行到下一个环节。JUL 的级别过滤在 Logger 与 Handler 上各做一次：一条日志先过 Logger 自己的级别，再逐个过 Handler 的级别，两处都放行才会输出。

## 日志级别

| 级别 | 说明 |
|---|---|
| `SEVERE` | 最高，严重错误 |
| `WARNING` | 警告 |
| `INFO` | 默认级别 |
| `CONFIG` | 配置信息 |
| `FINE` | 一般调试信息 |
| `FINER` | 更细的调试信息 |
| `FINEST` | 最细的调试信息 |

另有 `OFF`（关闭日志记录）和 `ALL`（启用所有消息）两个特殊级别。

## Logger 的父子关系

JUL 中 Logger 之间存在父子关系，通过名字的路径来关联，子 Logger 继承父 Logger 的配置。JUL 初始化时会创建一个顶层 RootLogger，作为所有 Logger 的父 Logger。

## 配置文件

默认配置文件在 JDK 8 及以前是 `$JAVA_HOME\jre\lib\logging.properties`；JDK 9 模块化后不再有 `jre` 目录，路径变为 `$JAVA_HOME\conf\logging.properties`。

```properties
# 指定处理器，JDK 默认是 ConsoleHandler，这里改成 FileHandler
handlers= java.util.logging.FileHandler

# JDK 默认是 INFO，这里改成 ALL
.level= ALL

# 自定义 Logger 使用
com.example.handlers = java.util.logging.ConsoleHandler
com.example.level = CONFIG
# 关闭默认配置。只对此 Logger 对象生效，其他 Logger 仍走顶层的 RootLogger
com.example.useParentHandlers = false

# 向日志文件输出的 handler 对象
# 指定日志文件路径
java.util.logging.FileHandler.pattern = logs/java%u.log
# 指定日志文件内容大小
java.util.logging.FileHandler.limit = 50000
# 指定日志文件数量
java.util.logging.FileHandler.count = 1
# 指定 handler 对象日志消息格式对象
java.util.logging.FileHandler.formatter = java.util.logging.SimpleFormatter
# 指定以追加方式添加日志内容
java.util.logging.FileHandler.append = true

# 向控制台输出的 handler 对象
# 指定 handler 对象的日志级别
java.util.logging.ConsoleHandler.level = ALL
# 指定 handler 对象的日志消息格式对象
java.util.logging.ConsoleHandler.formatter = java.util.logging.SimpleFormatter
# 指定 handler 对象的字符集
java.util.logging.ConsoleHandler.encoding = UTF-8

# 指定日志消息格式
java.util.logging.SimpleFormatter.format = %4$s: %5$s [%1$tc]%n
```

`java.util.logging.SimpleFormatter.format` 是 Java 7 才加入的配置项，用来指定日志消息的输出格式。

## 日志原理解析

1. 初始化 LogManager
   1. LogManager 加载 `logging.properties` 配置
   2. 添加 Logger 到 LogManager
2. 从单例 LogManager 获取 Logger
3. 设置级别 Level，并指定日志记录 LogRecord
4. Filter 提供日志级别之外更细粒度的控制
5. Handler 用来处理日志输出位置
6. Formatter 用来格式化 LogRecord

## 用法

### 使用默认配置

不写任何配置、直接用 JDK 自带的 `logging.properties` 时，Logger 的级别和输出目的地都继承自 RootLogger（默认级别 INFO、默认输出到控制台）。下面的示例把七个级别依次调一遍，看哪些能打出来：

```java
package com.example;

import java.util.logging.Logger;
import org.junit.Test;

public class JULTest {

    @Test
    public void testLogLevel() throws Exception{
        // 1.获取日志对象
        Logger logger = Logger.getLogger("com.example.log.QuickTest");

        // 2.日志记录输出
        logger.severe("severe");
        logger.warning("warning");
        logger.info("info");// 默认日志输出级别

        // 比info高的级别进行控制台输出，比info低的这些级别将进行过滤
        logger.config("config");
        logger.fine("fine");
        logger.finer("finer");
        logger.finest("finest");
    }
}
```

### 自定义日志级别配置

默认配置下低级别日志会被挡掉。不碰配置文件，也可以在代码里给单个 Logger 设级别、挂 Handler——下面的示例把级别放开到 `ALL`，并同时挂上控制台和文件两个 Handler：

```java
package com.example;

import java.util.logging.ConsoleHandler;
import java.util.logging.FileHandler;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.logging.SimpleFormatter;
import org.junit.Test;

public class JULTest {

    @Test
    public void testLogConfig() throws Exception{
        Logger logger = Logger.getLogger("com.example.Demo");
        // 1、关闭系统默认配置
        logger.setUseParentHandlers(false);
        // 2、创建简单格式转换对象
        SimpleFormatter simpleFormatter = new SimpleFormatter();
        // 3、配置日志具体级别
        logger.setLevel(Level.ALL);

        // 4、创建控制台输出
        ConsoleHandler consoleHandler = new ConsoleHandler();
        // 4.1、进行关联
        consoleHandler.setFormatter(simpleFormatter);
        consoleHandler.setLevel(Level.ALL);
        logger.addHandler(consoleHandler);

        // 5、创建文件输出
        FileHandler fileHandler = new FileHandler("logs/java%u.log");
        // 5.1、进行关联
        fileHandler.setFormatter(simpleFormatter);
        logger.addHandler(fileHandler);

        // 6、日志记录输出
        logger.severe("severe");
        logger.warning("warning");
        logger.info("info"); // 默认日志输出级别
        logger.config("config");
        logger.fine("fine");
        logger.finer("finer");
        logger.finest("finest");
    }
}
```

::: warning
`FileHandler` 不会创建目录：`logs` 不存在时，上面那行构造直接抛 `java.nio.file.NoSuchFileException: logs\java0.log.lck`（实测；log4j 会自动建目录，JUL 不会），运行前要先把 `logs` 目录建好。上面「配置文件」一节里的 `java.util.logging.FileHandler.pattern = logs/java%u.log` 同理。
:::

### 加载自定义配置文件

上面的 `logging.properties` 也可以由程序自己加载：把它放到类路径下（如 `src/main/resources/`），用类加载器读成流交给 `LogManager.readConfiguration()`。下面的示例同时看两个 Logger——其中一个在配置文件里有自己的条目，另一个没有、走 RootLogger 的配置：

```java
package com.example;

import java.io.InputStream;
import java.util.logging.LogManager;
import java.util.logging.Logger;
import org.junit.Test;

public class JULTest {

    @Test
    public void testLogProperties()throws Exception{
        // 1、加载配置文件
        // 1.1、通过类加载器读取配置文件
        InputStream ins = JULTest.class.getClassLoader().getResourceAsStream("logging.properties");
        // 1.2、创建LogManager
        LogManager logManager = LogManager.getLogManager();
        // 1.3、通过LogManager加载配置文件
        logManager.readConfiguration(ins);

        // 2、创建日志记录器
        // 2.1、这个logger对象用的是自定义的配置，所以走的是properties文件里面的配置
        Logger logger = Logger.getLogger("com.example");
        logger.severe("severe");
        logger.warning("warning");
        logger.info("info");
        logger.config("config");
        logger.fine("fine");
        logger.finer("finer");
        logger.finest("finest");

        // 2.2、这个对象没有自定义的配置，所以走的是父元素的配置，也就是顶级元素的配置，
        //      所以走的是properties中的通用配置
        Logger logger2 = Logger.getLogger("test");
        logger2.severe("severe test");
        logger2.warning("warning test");
        logger2.info("info test");
        logger2.config("config test");
        logger2.fine("fine test");
        logger2.finer("finer test");
        logger2.finest("finest test");
    }
}
```

## 总结

- JUL 是 JDK 1.4 起自带的日志实现，不需要任何第三方依赖；能力够用，但配置方式与后来的 slf4j / logback 差别较大，实际项目里通常只作为兜底实现存在。
- 结构是 Logger → Handler → Formatter，中间还可以挂 Filter；Logger 之间有父子关系，子 Logger 默认继承父 Logger 的 Handler 与配置。
- 配置的加载有两条路径：默认读默认位置的 `logging.properties`，或者换成指定的配置文件——用系统属性 `-Djava.util.logging.config.file=<路径>`，或在程序里用 `LogManager.readConfiguration()` 加载。
- 最容易踩的坑是级别过滤做了两次：Logger 和 Handler 的级别都要放行日志才会输出，只把其中一个调低，日志仍会被另一处挡掉。
