---
title: log4j2（升级版 · 异步日志）
date: 2026-09-22
category:
  - Java
  - Java基础
  - 日志
tags:
  - Java
  - Java基础
  - 日志
  - log4j2
---

# log4j2（升级版 · 异步日志）

[[toc]]

Apache log4j2 是对 log4j 的升级版，参考了 logback 的一些设计，同时修复了一些问题，主要有：

- **异常处理**：在 logback 中，Appender 里的异常不会被应用感知到，log4j2 提供了一些异常处理机制。
- **性能提升**：性能优势主要体现在异步日志上（见下文），同步场景与 logback 的差距不大。
- **自动重载配置**：参考 logback 的设计，提供自动刷新参数配置，可以在生产上动态修改日志级别而不需要重启应用。
- **无垃圾机制**：大部分情况下可以使用其设计的一套无垃圾机制，避免频繁的日志收集导致 JVM GC。

市面上最主流的日志门面是 slf4j。log4j2 本身也提供门面 API（`log4j-api`），但生态里各框架对 slf4j 的适配更齐全，一般还是把 log4j2 看作日志实现，配 slf4j 当门面使用。

::: warning Log4Shell（CVE-2021-44228）及 2021-12 系列 CVE
Log4Shell（CVE-2021-44228）影响 log4j2 的 2.0-beta9 ~ 2.14.1：日志内容里形如 `${jndi:...}` 的字符串会被当作 lookup 解析，攻击者借此触发远程类加载。这个漏洞本身在 2.15.0 关闭默认 lookup、2.16.0 彻底移除该功能后就已修复；但 2021 年 12 月披露的是一整批同类漏洞（除 44228 外还有 CVE-2021-45046、45105、44832 等），最后一个到 2.17.1 才修复。所以 **2.17.1 是修复这一系列全部 CVE 的最低版本**，本文依赖统一用 2.17.1。示例里的 `${sysname}` 属于同一套 lookup 语法——它取的是配置中的属性，本身不是漏洞，但只要未过滤的外部输入落在被 lookup 解析的位置上，就有风险。
:::

## 单独使用

### 添加依赖

单独使用 log4j2（不经过 slf4j）需要门面 API 和日志实现两个依赖：

```xml
<!-- Log4j2 门面API-->
<dependency>
    <groupId>org.apache.logging.log4j</groupId>
    <artifactId>log4j-api</artifactId>
    <version>2.17.1</version>
</dependency>

<!-- Log4j2 日志实现 -->
<dependency>
    <groupId>org.apache.logging.log4j</groupId>
    <artifactId>log4j-core</artifactId>
    <version>2.17.1</version>
</dependency>
```

### 配置

log4j2 默认从 classpath 加载配置文件，按 `log4j2-test<ctx>.xml` → `log4j2-test.xml` → `log4j2<ctx>.xml` → `log4j2.xml` 的顺序查找——所以存在 `log4j2-test.xml` 时它优先于 `log4j2.xml`（常用来放测试专用配置）：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Configuration status="info" name="app" monitorInterval="30" packages="">
	<Properties>
		<Property name="logpath">logs</Property>
		<Property name="sysname">XXX</Property>
	</Properties>
	<!-- 日志文件输出的 appender 对象 -->
	<Appenders>
		<Console name="console" target="SYSTEM_OUT">
			<!-- 指定消息格式 -->
			<PatternLayout>
				<Pattern>[${sysname}-%thread]%-5p %d %X{traceId} - %c - %m%n</Pattern>
			</PatternLayout>
		</Console>
		<!-- 按照文件大小拆分的 appender 对象 fileName: 指定日志文件保存路径 filePattern:指定日志文件打包路径-->
		<RollingFile name="rollingfile" fileName="${logpath}/${sysname}.log"
			filePattern="${logpath}/${sysname}.%d{yyyy-MM-dd}-%i.log.gz">
			<!-- 指定消息格式 -->
			<PatternLayout>
				<Pattern>[${sysname}-%thread]%-5p %d %X{traceId} - %l - %m%n</Pattern>
			</PatternLayout>
			<Policies>
				<!-- 按照时间拆分-->
				<TimeBasedTriggeringPolicy />
				<!-- 指定日志文件内容的大小-->
				<SizeBasedTriggeringPolicy size="300MB"/>
			</Policies>
			<!--指定日志文件的数量；max 默认为 7，2.8 起可用 fileIndex="nomax" 取消上限-->
			<DefaultRolloverStrategy fileIndex="max" max="30"/>
		</RollingFile>
		<RollingFile name="ErrorFile"
			fileName="${logpath}/${sysname}-error.log"
			filePattern="${logpath}/${sysname}-error.%d{yyyy-MM-dd}-%i.log.gz">
			<Filters>
				<ThresholdFilter level="error" onMatch="ACCEPT" onMismatch="DENY" />
			</Filters>
			<PatternLayout>
				<Pattern>[${sysname}-%thread]%-5p %d %X{traceId} - %l - %m%n</Pattern>
			</PatternLayout>
			<Policies>
				<TimeBasedTriggeringPolicy />
				<SizeBasedTriggeringPolicy size="300MB" />
			</Policies>
			<DefaultRolloverStrategy max="30" />
		</RollingFile>
	</Appenders>

	<Loggers>
		<!-- Activiti日志 -->
		<Logger name="org.activiti" level="ERROR" />
		<Logger name="org.activiti.engine.impl.persistence.entity" level="DEBUG" />
		<Logger name="org.springframework" level="info"/>
		<Logger name="org.hibernate" level="ERROR"/>
		<Logger name="org.apache.ibatis" level="debug"/>
		<Logger name="org.apache" level="warn"/>
		<Logger name="java.sql" level="warn"/>
		<Logger name="org.quartz" level="warn"/>
		<Logger name="org.mybatis" level="debug"/>
		<Logger name="com.example" level="debug"/>
		<Logger name="com.example.core.cache" level="info"/>
		<Root level="debug">
			<AppenderRef ref="console" />
			<AppenderRef ref="rollingfile" />
			<AppenderRef ref="ErrorFile" />
		</Root>
	</Loggers>
</Configuration>
```

### Java 代码

log4j2 的入口是 `org.apache.logging.log4j.LogManager` 和 `org.apache.logging.log4j.Logger`。注意包名是 `org.apache.logging.log4j`，和 log4j 1.x 的 `org.apache.log4j` 不是同一套，API 也不通用：

```java
package com.example;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.junit.Test;

public class Log4j2Test {
    private static final Logger LOGGER = LogManager.getLogger(Log4j2Test.class);

    @Test
    public void testQuick() {
        LOGGER.error("error");
        LOGGER.warn("warn");
        LOGGER.info("info");
        LOGGER.debug("debug");
        LOGGER.trace("trace");
    }
}
```

logger 由 `LogManager.getLogger()` 取得，实际级别取决于配置文件。依赖片段只列了日志相关依赖，JUnit 需要另行引入；完整用例见 [log4j](./log4j.md) 篇。

## 结合 slf4j 使用

需要添加 log4j2 门面依赖、日志实现依赖、slf4j 门面依赖、slf4j 绑定 log4j2 适配器依赖：

```xml
<!-- Log4j2 门面API-->
<dependency>
    <groupId>org.apache.logging.log4j</groupId>
    <artifactId>log4j-api</artifactId>
    <version>2.17.1</version>
</dependency>

<!-- Log4j2 日志实现 -->
<dependency>
    <groupId>org.apache.logging.log4j</groupId>
    <artifactId>log4j-core</artifactId>
    <version>2.17.1</version>
</dependency>

<!--使用slf4j作为日志的门面,使用log4j2来记录日志 -->
<dependency>
    <groupId>org.slf4j</groupId>
    <artifactId>slf4j-api</artifactId>
    <version>1.7.30</version>
</dependency>

<!--为slf4j绑定日志实现 log4j2的适配器 -->
<dependency>
    <groupId>org.apache.logging.log4j</groupId>
    <artifactId>log4j-slf4j-impl</artifactId>
    <version>2.17.1</version>
</dependency>
```

## 异步日志

异步日志是 log4j2 最大的特点，性能提升也主要来自这里。log4j2 提供两种实现异步的方式：`AsyncAppender` 和 `AsyncLogger`，分别对应 Appender 组件和 Logger 组件。`AsyncLogger` 是官方推荐的方式，它可以让调用 `Logger.log` 返回得更快。

有两种选择：

1. **全局异步**：所有日志都异步记录，配置文件上不用做任何改动，只需要添加一个 `log4j2.component.properties` 配置。
2. **混合异步**：可以在应用中同时使用同步日志和异步日志，配置方式更灵活。

::: warning 使用异步日志的注意事项
1. `AsyncAppender`、`AsyncLogger` 和全局异步不要叠着用。官方文档指出，同时使用 `AsyncRoot` 和 `AsyncLogger` 会创建两个异步屏障（而不是一个），反而会损害性能——多一层异步队列 / 屏障不会更快，只会更慢。
2. 设置 `includeLocation=false`。获取调用位置（类名、方法、文件、行号）本身就是昂贵的操作，对异步 logger / appender 影响更大——它必须在跨过异步屏障之前决定要不要计算，这份开销会把异步带来的收益吃掉大半。
:::

### 添加异步依赖

异步日志底层用 LMAX 的 Disruptor 队列，需要单独引入：

```xml
<!--异步日志依赖-->
<dependency>
    <groupId>com.lmax</groupId>
    <artifactId>disruptor</artifactId>
    <version>3.4.4</version>
</dependency>
```

这个依赖只有 `AsyncLogger` 和全局异步需要——`AsyncAppender` 内部用的是 `ArrayBlockingQueue` 加一条独立的派发线程，不加它也能正常工作。

### AsyncAppender

通过 `Configuration` → `Appenders` → `Async` 配置：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Configuration status="warn">
    <properties>
        <property name="logpath">logs</property>
    </properties>

    <Appenders>
        <File name="file" fileName="${logpath}/myfile.log">
            <PatternLayout>
                <Pattern>%d %p %c{1.} [%t] %m%n</Pattern>
            </PatternLayout>
        </File>
        <Async name="Async">
            <AppenderRef ref="file"/>
        </Async>
    </Appenders>

    <Loggers>
        <Root level="error">
            <AppenderRef ref="Async"/>
        </Root>
    </Loggers>
</Configuration>
```

### AsyncLogger

全局异步只需要添加一个 `log4j2.component.properties`：

```properties
Log4jContextSelector=org.apache.logging.log4j.core.async.AsyncLoggerContextSelector
```

混合异步则通过 `Configuration` → `Loggers` → `AsyncLogger` 配置：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Configuration status="WARN">
    <properties>
        <property name="logpath">logs</property>
    </properties>

    <Appenders>
        <File name="file" fileName="${logpath}/myfile.log">
            <PatternLayout>
                <Pattern>%d %p %c{1.} [%t] %m%n</Pattern>
            </PatternLayout>
        </File>
        <Async name="Async">
            <AppenderRef ref="file"/>
        </Async>
    </Appenders>

    <Loggers>
        <AsyncLogger name="com.example" level="trace"
            includeLocation="false" additivity="false">
            <AppenderRef ref="file"/>
        </AsyncLogger>

        <Root level="info" includeLocation="true">
            <AppenderRef ref="file"/>
        </Root>

    </Loggers>
</Configuration>
```

### 队列满了会怎样？

异步日志把事件放进队列、由后台线程消费，队列容量固定。应用写入速度长时间快于下游 Appender 时队列会满，此时的行为由配置决定，`AsyncAppender` 与 `AsyncLogger` 不一样。

`AsyncAppender` 用 `bufferSize` 指定队列长度（默认 1024，disruptor 风格的队列要求该值是 2 的幂），`blocking` 决定队列满时怎么办：

| blocking | 队列满时的行为 |
|---|---|
| `true`（默认） | 按 `AsyncQueueFullPolicy` 处理，默认策略下阻塞调用线程，等队列空出位置 |
| `false` | 不等待：事件交给 `errorRef` 指定的 appender，没配 `errorRef` 则直接丢弃 |

logback 的 `AsyncAppender` 有对应的开关 `neverBlock`，**布尔含义与 `blocking` 相反**（`neverBlock=false` 表示阻塞），默认同样在队列满时阻塞；区别是 logback 默认还会在队列接近满时提前丢掉 TRACE / DEBUG / INFO，log4j2 默认不丢，要丢得显式换策略，见 [logback 篇](./logback.md)。

全局异步与 `AsyncLogger` 用的是 Disruptor 环形缓冲区，槽位数量由 `log4j2.asyncLoggerRingBufferSize`（全局异步）、`log4j2.asyncLoggerConfigRingBufferSize`（`AsyncLogger` 元素）控制，默认 256 × 1024（无 GC 模式下为 4 × 1024），最小 128，首次使用时一次性分配、运行期不扩容。写满后由 `AsyncQueueFullPolicy` 决定路由：

| 取值 | 行为 |
|---|---|
| 未设置或 `Default` | 阻塞调用线程，直到事件能放进缓冲区 |
| `Discard` | 丢弃级别不高于 `log4j2.discardThreshold`（默认 `INFO`）的事件 |
| 其他 | 按类名加载自定义的 `AsyncQueueFullPolicy` 实现 |

队列满策略只能在配置属性里设置（JVM 系统属性，或 classpath 根目录的 `log4j2.component.properties`），XML 配置里没有对应属性：

```properties
log4j2.AsyncQueueFullPolicy=Discard
log4j2.DiscardThreshold=WARN
```

::: warning 丢弃是静默的
`DiscardingAsyncQueueFullPolicy` 丢弃事件时只在第一次通过 StatusLogger 记一条 WARN，之后不再提示，而 StatusLogger 默认只输出 ERROR 级别，线上丢没丢日志从日志里看不出来。

两种选择的代价不一样：默认的阻塞策略保住日志，但把压力转嫁给业务线程，日志写不动时会拖慢请求；换成丢弃策略则反过来，用日志换吞吐。按业务对日志的依赖程度选。
:::

## log4j2 不输出日志

Spring Boot 默认把 slf4j 绑定到 `spring-boot-starter-logging` 带进来的 logback 上。如果再引入 `spring-boot-starter-log4j2` 却不排除 `spring-boot-starter-logging`，类路径上会同时出现 `log4j-slf4j-impl`（slf4j → log4j2）与 `log4j-to-slf4j`（log4j2 API → slf4j）这两个方向相反的绑定。这一对由 log4j2 自己拦截：`log4j-slf4j-impl` 的 `Log4jLoggerFactory.validateContext()` 检测到 `log4j-to-slf4j` 的 `org.apache.logging.slf4j.SLF4JLoggerContext` 时，直接抛出 `LoggingException`，异常原文是 "log4j-slf4j-impl cannot be present with log4j-to-slf4j"，日志会丢，甚至完全不输出。排除与添加依赖的写法见 [Spring Boot 的日志体系](./spring-boot-logging.md#切换成-log4j2)。

## 总结

- 配置由 Appenders、Loggers、Properties 三段构成：Appenders 定义输出去向，Loggers 定义级别与绑定关系，`monitorInterval` 打开后运行期改配置不用重启应用。
- 同步写日志的性能与 logback 接近，异步才是 log4j2 的收益点。`AsyncLogger` 让调用线程尽快返回，`AsyncAppender` 只是把下游 Appender 的 I/O 挪到后台线程。
- 异步的代价在于队列：队列满时默认策略是阻塞调用线程，改成丢弃策略则按级别丢日志，且丢弃几乎没有痕迹。先确定业务能否接受日志缺失，再决定策略。
- 异步依赖 `com.lmax:disruptor`；与 Spring Boot 一起用时留意 `log4j-to-slf4j` 与 `log4j-slf4j-impl` 的方向冲突，两者共存时日志可能完全不输出。
