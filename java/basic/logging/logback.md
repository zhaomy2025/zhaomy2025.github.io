---
title: logback（原生实现 slf4j）
date: 2026-09-22
category:
  - Java
  - Java基础
  - 日志
tags:
  - Java
  - Java基础
  - 日志
  - logback
---

# logback（原生实现 slf4j）

[[toc]]

logback 由 log4j 的作者设计，完整实现了 slf4j API。按官方说法，内部实现重写后在部分关键执行路径上比 log4j 快约十倍（对比对象是 log4j 1.x）。它的组件模型和 log4j 类似，因此从 log4j 迁过来主要是改配置文件和 `pom.xml` 依赖，日志代码不用动。

logback 分为三个模块：

- `logback-core`：其他两个模块的基础模块
- `logback-classic`：log4j 的改良版本，完整实现了 slf4j API
- `logback-access`：访问模块，与 Servlet 容器（如 Tomcat 和 Jetty）集成，提供通过 HTTP 访问日志的功能

## 组件结构

组件模型与 log4j 相同（Logger / Appender / Layout），见 [log4j 的三大组件](./log4j.md#三大组件)。logback 特有的差异是 Layout 被封装在 encoder 里。

## 配置

### 添加依赖

logback 完整实现了 slf4j，只用门面和实现两个依赖：

```xml
<!--slf4j 日志门面 使用slf4j必须添加-->
<dependency>
	<groupId>org.slf4j</groupId>
	<artifactId>slf4j-api</artifactId>
	<version>1.7.30</version>
</dependency>

<!--logback 日志实现，出现的比slf4j迟，所以不需要适配器，直接日志实现就行-->
<dependency>
	<groupId>ch.qos.logback</groupId>
	<artifactId>logback-classic</artifactId>
	<version>1.2.11</version>
</dependency>
```

logback 按以下顺序查找配置文件，命中第一个就停：

1. `logback.configurationFile` 系统属性指定的文件
2. `logback-test.xml`
3. `logback.xml`

::: tip logback.groovy
上面三步对的是本文用的 logback 1.2.11。1.2.10 之前还多一步：在 `logback-test.xml` 之后、`logback.xml` 之前查找 `logback.groovy`。Groovy 配置支持在 1.2.9 中因安全原因被移除，但 `ContextInitializer` 里对 `logback.groovy` 的查找直到 1.2.10 才一并删掉（LOGBACK-1601）——1.2.9 及更早即使没有这个文件，也会在状态信息里报「找不到 logback.groovy」。
:::

### 一份 logback.xml 的递进配置：控制台 → 文件 → 滚动 → 异步

下面四小节是同一份 `logback.xml` 的递进版本：第一小节给完整文件，后面几小节只列相对上一节新增或改动的部分，没列出的沿用上一节。

#### ConsoleAppender 配置

这是完整文件的基础版本：只配一个控制台 appender 和 root，先让日志能打出来。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
	<!--格式化输出:%d表示日期，%c类的完整名称，%thread表示线程名，%-5level:级别从左显示5个字符宽度 %m或者%msg:日志消息，%n是换行符-->
	<property name="pattern" value="%d{yyyy-MM-dd HH:mm:ss.SSS} %c [%thread] %-5level  %msg%n"/>

	<!--
	Appender：设置日志信息的去向,常用的有以下几个
	ch.qos.logback.core.ConsoleAppender (控制台)
	ch.qos.logback.core.rolling.RollingFileAppender (文件大小到达指定尺寸的时候产生一个新文件)
	ch.qos.logback.core.FileAppender (文件)
	-->
	<appender name="console" class="ch.qos.logback.core.ConsoleAppender">
		<!--输出流对象 默认 System.out 改为 System.err-->
		<target>System.err</target>
		<!--日志格式配置-->
		<encoder class="ch.qos.logback.classic.encoder.PatternLayoutEncoder">
			<pattern>${pattern}</pattern>
		</encoder>
	</appender>

	<!--
	<logger> 用来设置某一个包或者具体的某一个类的日志打印级别、以及指定<appender>。
	仅有一个name属性，一个可选的level和一个可选的additivity属性
	name：用来指定受此logger约束的某一个包或者具体的某一个类。
	level：用来设置打印级别，大小写无关:TRACE, DEBUG, INFO, WARN, ERROR, ALL 和 OFF，如果未设置此属性，那么当前logger将会继承上级的级别。
	additivity：是否继续向上级logger（含root）传播事件，由祖先的appender重复输出。默认是true。
	<logger>可以包含零个或多个<appender-ref>元素，标识这个appender将会添加到这个logger
	root也是<logger>元素，但是它是根logger。默认debug
	-->
	<root level="ALL">
		<appender-ref ref="console"/>
	</root>
</configuration>
```

pattern 里的 `%X{key}` 从 [MDC](./slf4j.md#mdc-mapped-diagnostic-context)（Mapped Diagnostic Context，映射诊断上下文）取值。

#### FileAppender 配置

与上一节相比，本节把 pattern 换成带方法名 `%M`、行号 `%L` 的版本，加一个日志目录属性 `LOG_DIR`，并新增两个文件 appender；`console` appender 与上一节相同。

```xml
<!-- 自定义属性 可以通过${name}进行引用 -->
<property name="pattern" value="[%-5level] %d{yyyy-MM-dd HH:mm:ss} %c %M %L [%thread] %m %n"/>
<!-- 日志文件存放目录 -->
<property name="LOG_DIR" value="logs"/>

<!--普通文件 appender：整个运行期只写这一个文件-->
<appender name="file" class="ch.qos.logback.core.FileAppender">
	<!--日志格式配置-->
	<encoder class="ch.qos.logback.classic.encoder.PatternLayoutEncoder">
		<pattern>${pattern}</pattern>
	</encoder>
	<!--日志输出路径-->
	<file>${LOG_DIR}/logback.log</file>
</appender>

<!--生成 html 格式 appender：用 HTMLLayout 把日志排成表格-->
<appender name="htmlFile" class="ch.qos.logback.core.FileAppender">
	<!--日志格式配置-->
	<encoder class="ch.qos.logback.core.encoder.LayoutWrappingEncoder">
		<layout class="ch.qos.logback.classic.html.HTMLLayout">
			<pattern>%level%d{yyyy-MM-dd HH:mm:ss}%c%M%L%thread%m</pattern>
		</layout>
	</encoder>
	<!--日志输出路径-->
	<file>${LOG_DIR}/logback.html</file>
</appender>

<!--RootLogger对象-->
<root level="all">
	<appender-ref ref="console"/>
	<appender-ref ref="file"/>
	<appender-ref ref="htmlFile"/>
</root>
```

#### RollingFileAppender 配置

本节只替换文件 appender，改成按大小和时间拆分、归档，非本节的属性与 appender 同上。

```xml
<!-- 按大小和时间拆分归档的 appender；property 与 console appender 同上 -->
<appender name="rollFile" class="ch.qos.logback.core.rolling.RollingFileAppender">
	<!--日志格式配置-->
	<encoder class="ch.qos.logback.classic.encoder.PatternLayoutEncoder">
		<pattern>${pattern}</pattern>
	</encoder>
	<!--日志输出路径-->
	<file>${LOG_DIR}/roll_logback.log</file>
	<!--指定日志文件拆分和压缩规则-->
	<rollingPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedRollingPolicy">
		<!--通过指定压缩文件名称，来确定分割文件方式-->
		<fileNamePattern>${LOG_DIR}/rolling.%d{yyyy-MM-dd}.log%i.gz</fileNamePattern>
		<!--文件拆分大小-->
		<maxFileSize>1MB</maxFileSize>
	</rollingPolicy>
</appender>

<!--RootLogger对象-->
<root level="all">
	<appender-ref ref="console"/>
	<appender-ref ref="rollFile"/>
</root>
```

#### Filter 与异步日志配置

本节在上一节的 `rollFile` 里加 filter（只放行 error），并新增一个异步 appender 和自定义 logger。

```xml
<!-- 在上一节的 rollFile 内追加：只放行 error -->
<filter class="ch.qos.logback.classic.filter.LevelFilter">
	<!--设置拦截日志级别-->
	<level>error</level>
	<onMatch>ACCEPT</onMatch>
	<onMismatch>DENY</onMismatch>
</filter>

<!--异步日志：把 rollFile 挂到 AsyncAppender 下-->
<appender name="async" class="ch.qos.logback.classic.AsyncAppender">
	<appender-ref ref="rollFile"/>
</appender>

<!--RootLogger对象-->
<root level="all">
	<appender-ref ref="console"/>
	<appender-ref ref="async"/>
</root>

<!--自定义logger：additivity 控制事件是否继续向上级logger（含root）传播、由祖先的appender重复输出-->
<logger name="com.example" level="debug" additivity="false">
	<appender-ref ref="console"/>
</logger>
```

四节一路抄完，最终被引用的 appender 只有 `root` 上的 `console`、`async`（其下是 `rollFile`）和自定义 logger 上的 `console`；第 2 节引入的 `file`、`htmlFile` 到第 3 节已被 `rollFile` 顶掉，定义还在但没有任何地方引用，不会再产生输出。另外自定义 logger 的 `additivity="false"` 会截住 `com.example` 包下的事件——示例类 `com.example.LogbackTest` 的日志只走这条 logger（只挂 `console`），不再向上传给 `root`，所以 `roll_logback.log` 里不会出现它的日志。

### 异步日志默认行为

上面的 `<appender name="async">` 没写任何属性，走的全是 `AsyncAppender` 的默认值。三个参数决定队列满时的行为：

| 参数 | 默认值 | 作用 |
| --- | --- | --- |
| `queueSize` | 256 | 存放待落盘事件的阻塞队列容量 |
| `discardingThreshold` | `queueSize / 5`（默认队列下为 51） | 队列剩余容量**低于**该值时，丢弃 TRACE / DEBUG / INFO |
| `neverBlock` | false | 队列满时阻塞业务线程，而不是丢弃事件 |

丢弃的判断写在 `AsyncAppenderBase.append()` 里：`remainingCapacity() < discardingThreshold` 且事件可丢弃时才丢。可丢弃的范围由 `AsyncAppender.isDiscardable()` 定死，条件是 `level.toInt() <= Level.INFO_INT`，也就是只有 TRACE、DEBUG、INFO 会被丢，WARN 和 ERROR 无论队列多满都会进队列。把 `discardingThreshold` 设成 0 可以关掉丢弃（`remainingCapacity() < 0` 恒不成立）。

`neverBlock` 取默认的 false 时，队列满后写队列的操作会一直等待，业务线程卡在日志调用上；设成 true 则改用 `offer`，队列满时直接舍弃事件，此时不再区分级别，WARN 和 ERROR 一样会丢。

log4j2 的 `AsyncAppender` 用 `blocking` 表示队列满时是否阻塞，**布尔含义与 `neverBlock` 相反**（`blocking=true` 才阻塞），默认同样阻塞，见 [log4j2 篇](./log4j2.md)。

::: warning
默认配置下高并发时会同时遇到两种损失：TRACE / DEBUG / INFO 在队列接近满时被丢弃，WARN / ERROR 则可能把业务线程堵在日志调用上；丢弃过程不产生任何日志输出，只能靠观察日志量发现。异步 appender 只是把写磁盘的开销移出业务线程，队列满时的取舍仍由上面三个参数决定。
:::

### Java 代码

用 slf4j 的接口，实现换成 logback，代码没有区别。下面的示例用 JUnit 4 运行，依赖片段里没有单独列出 JUnit。

```java
package com.example;

import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class LogbackTest {
    public static final Logger LOGGER = LoggerFactory.getLogger(LogbackTest.class);

    // 快速入门
    @Test
    public void testQuick()throws Exception{
            // 日志输出
            LOGGER.error("error");
            LOGGER.warn("wring");
            LOGGER.info("info");
            LOGGER.debug("debug");// 默认级别
            LOGGER.trace("trace");
    }
}
```

## logback-access

logback-access 模块与 Servlet 容器（如 Tomcat 和 Jetty）集成，提供 HTTP 访问日志功能，可以用来替换 Tomcat 自带的访问日志。

1. 将 `logback-access.jar` 与 `logback-core.jar` 复制到 `$TOMCAT_HOME/lib/` 目录下
2. 修改 `$TOMCAT_HOME/conf/server.xml`，在 Host 元素中添加：

```xml
<Valve className="ch.qos.logback.access.tomcat.LogbackValve" />
```

3. logback 默认会在 `$TOMCAT_HOME/conf` 下查找文件 `logback-access.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <statusListener class="ch.qos.logback.core.status.OnConsoleStatusListener"/>
  <property name="LOG_DIR" value="${catalina.base}/logs"/>
  <appender name="FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
    <file>${LOG_DIR}/access.log</file>
    <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
      <fileNamePattern>access.%d{yyyy-MM-dd}.log.zip</fileNamePattern>
    </rollingPolicy>
    <encoder>
      <!-- 访问日志的格式 -->
      <pattern>combined</pattern>
    </encoder>
  </appender>
  <appender-ref ref="FILE"/>
</configuration>
```

## 总结

- logback 原生实现 slf4j API，从 log4j 迁过来只改依赖和配置文件，日志代码不动。
- 配置文件按 `logback.configurationFile` → `logback-test.xml` → `logback.xml` 的顺序查找，命中第一个就停（`logback.groovy` 是 1.2.10 之前才有的中间一步，随 1.2.9 移除 Groovy 配置支持后已不在查找链里）；测试类路径下的 `logback-test.xml` 会盖掉 `logback.xml`，「配置没生效」多数是命中了另一份文件。
- `additivity` 默认为 true，自定义 logger 的事件会继续传给 root，同一个事件被父子两级 logger 的 appender 各输出一次；只要一处输出就显式设成 false。
- 异步 appender 的默认参数（`queueSize` / `discardingThreshold` / `neverBlock`）决定队列满时是丢日志还是阻塞业务线程，丢的过程没有任何输出，日志量异常时先查这里。
