---
title: ApplicationRunner
date: 2026-09-23
category:
  - spring
  - spring-boot
  - callbacks
  - application-runner
tags:
  - spring
  - spring-boot
  - callbacks
  - application-runner
---

# ApplicationRunner
[[toc]]

`ApplicationRunner` 是 Spring Boot 提供的启动回调接口：容器 refresh 完成、单例 Bean 全部创建好之后，Spring Boot 会按顺序调用每一个实现了该接口的 Bean。缓存预热、建连、加载初始数据这类「启动后执行一次」的事适合放这里，原因是执行时机比 `@PostConstruct` 晚、又不会像 `ApplicationReadyEvent` 那样太靠后（见「执行时机」）。

本文以 Spring Boot 3.x 为准。

## 什么时候需要它

这三类事情的共同点是「启动时执行一次，且要在开始处理请求之前做完」。

**把一次性的事提前做完。** 缓存预热、建连（消息队列、搜索引擎这类连接池之外的外部依赖）、把一份配置快照灌进内存——这些如果拖到第一个请求进来才做，第一个用户会替所有人吃一次慢响应。

**加载初始数据。** 启动后往数据库或缓存里写一批初始数据（字典表、默认配置），写完才算就绪，之后所有请求都假定这些数据已经在。

**触发一次启动任务。** 有些任务不适合等定时器，需要在进程起来时立刻跑一遍，之后才交给 `@Scheduled` 或外部调度。这里只负责「这一次」。

::: tip 反复执行的任务别放这里
周期性的调度交给 `@Scheduled`，`ApplicationRunner` 只承担「启动时触发一次」的那部分。
:::

## 接口定义

接口只有一个 `run` 方法：

```java
@FunctionalInterface
public interface ApplicationRunner {

    void run(ApplicationArguments args) throws Exception;

}
```

`run` 的入参是解析后的启动参数，异常声明为 `Exception`，抛出的异常不会被吞掉（见「执行时机」）。

## 基本用法

实现接口并注册为 Bean：

```java
@Component
public class CacheWarmUpRunner implements ApplicationRunner {

    private final UserRepository userRepository;

    public CacheWarmUpRunner(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void run(ApplicationArguments args) {
        userRepository.findAll().forEach(this::preload);
    }
}
```

实现类必须交给容器管理（`@Component` 或 `@Bean`）。只实现接口、没有被扫描到的话不会执行，也不会报错，只是静默不生效。

## ApplicationArguments 里有什么

以 `java -jar app.jar --warmup=true --debug config.yml` 启动为例：

| 方法 | 返回类型 | 上例取值 | 说明 |
| --- | --- | --- | --- |
| `getSourceArgs()` | `String[]` | `["--warmup=true", "--debug", "config.yml"]` | 原样返回未解析的参数 |
| `getOptionNames()` | `Set<String>` | `["warmup", "debug"]` | 所有 `--key` 形式的选项名 |
| `containsOption("debug")` | `boolean` | `true` | 指定选项是否存在 |
| `getOptionValues("warmup")` | `List<String>` | `["true"]` | 选项名对应的值，重复给同名选项会返回多个元素 |
| `getNonOptionArgs()` | `List<String>` | `["config.yml"]` | 不带 `--` 的位置参数 |

::: tip getOptionValues 有两种「取不到」
选项不存在时返回 `null`，选项存在但没带值（如 `--debug`）时返回空集合 `[]`。判断选项是否存在要用 `containsOption`，直接对返回值调 `isEmpty()` 会在选项缺失时空指针。
:::

## 多个 Runner 的执行顺序

一次启动可以有多个 Runner，顺序用 `@Order` 或 `Ordered` 接口指定：

::: code-tabs
@tab @Order
```java
@Component
@Order(1)
public class CacheWarmUpRunner implements ApplicationRunner {

    @Override
    public void run(ApplicationArguments args) {
        // 预热缓存
    }
}
```
@tab 实现 Ordered
```java
@Component
public class SchemaInitRunner implements ApplicationRunner, Ordered {

    @Override
    public int getOrder() {
        return 2;
    }

    @Override
    public void run(ApplicationArguments args) {
        // 初始化表结构
    }
}
```
:::

两种方式都没用时按 `Ordered.LOWEST_PRECEDENCE` 处理，排在所有显式指定顺序的 Runner 之后；order 值相同的 Runner 之间没有约定顺序，要固定次序就得给出不同的值。类上同时写了 `@Order` 又实现了 `Ordered` 时，以 `Ordered#getOrder` 的返回值为准。

## 示例：启动时开启文件监听

`ApplicationRunner` 适合承载「启动后要一直跑着」的后台任务，文件监听就是一个典型场景：用 Apache Commons IO 的 `FileAlterationMonitor` 每隔一段时间扫描一次目录，有变化就回调。

`FileAlterationListenerAdaptor` 是 `FileAlterationListener` 的空实现基类，按需覆写其中几个方法即可，不必实现全套接口。

这个例子用到 Apache Commons IO，它不在 Spring Boot 的依赖管理范围内，要显式带上版本：

```xml
<dependency>
    <groupId>commons-io</groupId>
    <artifactId>commons-io</artifactId>
    <version>2.22.0</version>
</dependency>
```

```java
@Component
public class FileWatchRunner implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(FileWatchRunner.class);

    @Override
    public void run(ApplicationArguments args) throws Exception {
        FileAlterationObserver observer = new FileAlterationObserver("/data/inbox");
        observer.addListener(new FileAlterationListenerAdaptor() {
            @Override
            public void onFileCreate(File file) {
                log.info("发现新文件：{}", file.getName());
                // 处理文件
            }
        });

        FileAlterationMonitor monitor = new FileAlterationMonitor(60_000, observer);
        monitor.start();
        log.info("文件监听已启动");
    }
}
```

`FileAlterationMonitor` 的构造参数是「轮询间隔（毫秒）+ 若干 Observer」。`start()` 内部会起一个独立线程跑轮询（`FileAlterationMonitor` 自己实现了 `Runnable`），不会卡住启动流程；commons-io 2.22.0 起这个线程被命名为 `commons-io-FileAlterationMonitor`，更早的版本不设线程名，形如 `Thread-N`。这个线程默认不是守护线程，应用退出前建议显式调用 `stop()`。

## 与 CommandLineRunner 的区别

Spring Boot 还提供了 `CommandLineRunner`，两者的调用时机和排序方式完全一致，只有参数形态不同：

| 项 | ApplicationRunner | CommandLineRunner |
| --- | --- | --- |
| 接口方法 | `void run(ApplicationArguments args) throws Exception` | `void run(String... args) throws Exception` |
| 起始版本 | Spring Boot 1.3.0 | Spring Boot 1.0.0 |
| 参数 | 解析后的选项与位置参数 | 未解析的原始参数数组 |
| 适用 | 需要按名字取 `--key=value` | 只按位置顺序读参数 |

::: warning 同时实现两个接口会被调用两次
Spring Boot 3.x 里 `SpringApplication#callRunners` 用 `beanFactory.getBeanNamesForType(Runner.class)` 一次性取出所有 Runner 类型的 Bean 名（`CommandLineRunner` / `ApplicationRunner` 自 3.x 起都 extends 包内的 `Runner` 标记接口），具体分派在 `callRunner(Runner, ApplicationArguments)` 里，对每个实例分别做两次 `instanceof`。所以一个 Bean 同时实现 `ApplicationRunner` 和 `CommandLineRunner` 时，两个分支各命中一次，它的 `run` 会被调用两次。
:::

## 执行时机

Spring Boot 启动过程中按固定顺序发布一串事件，Runner 就落在其中：

| 事件 | 时机 |
| --- | --- |
| `ApplicationStartingEvent` | 启动开始，除监听器和初始化器注册外未做任何处理 |
| `ApplicationEnvironmentPreparedEvent` | `Environment` 已就绪，但 context 尚未创建 |
| `ApplicationContextInitializedEvent` | `ApplicationContext` 已准备好、Initializers 已调用，Bean 定义尚未加载 |
| `ApplicationPreparedEvent` | refresh 开始前，Bean 定义已加载 |
| `ApplicationStartedEvent` | context refresh 完成，**Runner 尚未调用** |
| `AvailabilityChangeEvent`（`LivenessState.CORRECT`） | 紧随其后，表示应用已存活 |
| `ApplicationReadyEvent` | **Runner 调用完成之后** |
| `AvailabilityChangeEvent`（`ReadinessState.ACCEPTING_TRAFFIC`） | 紧随其后，表示可以接收请求 |
| `ApplicationFailedEvent` | 启动过程出现异常时 |

`ApplicationPreparedEvent` 与 `ApplicationStartedEvent` 之间还会发布 `WebServerInitializedEvent` 和 `ContextRefreshedEvent`。

Runner 执行时容器和 Bean 都已就绪，注入和访问都正常。`run` 里抛出的异常会被包装成 `IllegalStateException: Failed to execute ApplicationRunner` 向上抛出，**直接导致启动失败**——不打算阻断启动的逻辑不要放在这里。

### 追踪启动过程

启动慢但看不出慢在哪时，可以用 `ApplicationStartup` 配合 `StartupStep` 记录各阶段的耗时：

```java
@SpringBootApplication
public class MyApplication {

    public static void main(String[] args) {
        SpringApplication application = new SpringApplication(MyApplication.class);
        application.setApplicationStartup(new BufferingApplicationStartup(2048));
        application.run(args);
    }
}
```

`BufferingApplicationStartup` 把步骤缓冲在内存里，构造参数是缓冲的步数上限。

### 多层级上下文下的事件重复

事件走 Spring 的发布机制传播，发到子 context 监听器的事件同样会发给祖先 context 的监听器。应用里存在多层 `SpringApplication` 时，同一个监听器可能收到同一事件的多个实例。要区分事件来自哪个 context，把自身的 `ApplicationContext` 注入进来（实现 `ApplicationContextAware`，或作为 Bean 用 `@Autowired` 注入），和事件携带的 context 比对。

## 与其他启动回调的取舍

| 回调 | 时机 | 注意 |
| --- | --- | --- |
| `@PostConstruct` | Bean 初始化阶段，早于容器 refresh 完成 | 此时其他 Bean 可能尚未创建，做依赖外部组件的操作容易出问题 |
| `ApplicationRunner` | refresh 完成之后、`ApplicationReadyEvent` 之前 | 抛异常会中断启动 |
| `ApplicationListener<ApplicationReadyEvent>` | 所有 Runner 之后 | 应用此时已可用，适合做与启动成败无关的收尾工作 |

三者都能承载「启动后执行一次」的逻辑，差别在于处在启动流程的哪一段：`@PostConstruct` 在容器还没装配完时就跑，处理不当会拖慢甚至阻塞启动；`ApplicationReadyEvent` 的监听器跑在最后，此时改配置、连依赖都是安全的。
