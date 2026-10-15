---
title: SpringBootCondition
date: 2026-09-23
category:
  - spring
  - spring-boot
  - callbacks
  - spring-boot-condition
tags:
  - spring
  - spring-boot
  - callbacks
  - spring-boot-condition
---

# SpringBootCondition
[[toc]]

`SpringBootCondition` 是 Spring Boot 提供的条件基类，它实现的正是 Spring Framework 的 [`Condition`](../../spring-framework/framework-callbacks/condition.md) 接口。这两个类型分属两个工程，这也是它值得单独成篇的原因：

- `Condition` 在 `org.springframework.context.annotation` 包下，属于 Spring Framework。它只管一件事：回答「匹配不匹配」这个布尔值。
- `SpringBootCondition` 在 `org.springframework.boot.autoconfigure.condition` 包下，属于 Spring Boot。它把 `matches()` 声明成 `final`，只留给子类一个 `getMatchOutcome()`——子类除了给出结论，还要给出一句说明，这句话会进启动日志，也会进启动时打印的条件评估报告。

判断逻辑本身怎么写（`ConditionContext` 里能拿到什么、`@Conditional` 挂在哪些位置、条件类有什么约束）不在这一篇展开，这一篇只讲 Boot 在这层之上加的东西。

本文以 Spring Boot 3.x 为准。

## 什么时候需要它

判断逻辑本身，裸 `Condition` 就能写。这个基类解决的是另一半问题：条件被评估之后，别人怎么知道结论、怎么知道原因。下面几种情况值得换用它。

**写给别人用的 starter，条件不生效时要能自己查。** 你发布一个 starter，里面的自动配置挂在几个条件上。使用者引了依赖却发现某个 Bean 没装配，他能看到的只有「没生效」——除非条件类继承 `SpringBootCondition`。继承之后，用 `--debug` 启动时打印的条件评估报告里会带上这个条件的结论和原因，使用者不用来问你。

**一个位置挂了多个条件，要分清是哪一条挡住了。** 比如某个配置类同时要求「类路径上有 MySQL 驱动」和「`app.db.mode=readonly`」，两个条件各有一句说明，报告里会逐条列出：是 `@ConditionalOnClass did not find required class '...'` 这一条没满足，还是 `OnDatabaseMode app.db.mode is null` 这一条没满足，一眼能看出卡在哪里。

**条件逻辑要复用别的条件类。** 同一套判断在多处用到时，父类留的 `matches(context, metadata, condition)` 可以在自己的 `getMatchOutcome` 里直接评估另一个条件类，不必把它挂到注解上。

**想让自定义条件的措辞和 Boot 自带的一致。** 用 `ConditionMessage.Builder` 的 `foundExactly` / `didNotFind` / `because` 拼出的句子，和 `OnClassCondition` 这类内置条件的格式完全相同，出现在同一份报告里不会显得格格不入。

::: tip 只在 Spring Boot 应用里用它
`Condition` 属于 Spring Framework，纯 Spring 应用也能用；`SpringBootCondition` 随 `spring-boot-autoconfigure` 发布，继承它就等于让这段条件代码依赖了 Boot。用不上条件报告，或者这段代码要放进不依赖 Boot 的公共模块，裸 `Condition` 就够了。
:::

## 类定义

基类把「评估」和「上报」两步都接了过去，子类只回答「匹配不匹配、为什么」：

```java
public abstract class SpringBootCondition implements Condition {

    @Override
    public final boolean matches(ConditionContext context, AnnotatedTypeMetadata metadata) {
        // 调 getMatchOutcome、写 TRACE 日志、把结论记进条件评估报告，最后返回 outcome.isMatch()
    }

    public abstract ConditionOutcome getMatchOutcome(ConditionContext context, AnnotatedTypeMetadata metadata);

}
```

`matches` 前面的 `final` 表示子类不能覆写它。条件怎么评估、结论报给谁，都由基类定死；子类唯一要实现的是抽象方法 `getMatchOutcome`，它的返回值 `ConditionOutcome` 里装着结论和说明。这个类自 Spring Boot 1.0.0 起就存在（`@since 1.0.0`）。

## 结论与说明：ConditionOutcome 和 ConditionMessage

`ConditionOutcome` 装两样东西：结论（`isMatch()`）和一句话说明（`getMessage()`，没写说明时返回 `null`）。构造它推荐用静态工厂，别直接 `new`（`inverse` 除外，见下表）：

| 静态方法 | 作用 |
| --- | --- |
| `match()` / `match(ConditionMessage)` | 匹配；无参版本不带说明，也有接受 `String` 的重载 |
| `noMatch(ConditionMessage)` | 不匹配，带说明（也有接受 `String` 的重载） |
| `inverse(outcome)`（3.5 起已废弃，计划 4.0.0 移除） | 把结论取反，说明原样保留；替代写法是 `new ConditionOutcome(boolean, ConditionMessage)` |

说明用 `ConditionMessage` 拼。它是专为条件说明做的句子构造器，用 `forCondition(...)` 起头拿到 `Builder`：

```java
ConditionMessage.Builder message = ConditionMessage.forCondition("OnDatabaseMode");
```

`forCondition` 传字符串时，这段文字就是说明的开头；传注解类型时开头会自动带上 `@`（`forCondition(ConditionalOnClass.class)` 拼出来的是 `@ConditionalOnClass ...`），Boot 自带条件用的都是后一种写法。

`Builder` 上常用的方法如下，下表列的是各自拼出的说明片段，条件名会自动补在前面：

| 方法 | 拼出的片段 |
| --- | --- |
| `because("app.db.mode is null")` | `app.db.mode is null`，原样接在条件名后面 |
| `foundExactly("app.db.mode=readonly")` | `found app.db.mode=readonly` |
| `found("bean", "beans").items("x", "y")` | `found beans x, y` |
| `didNotFind("bean").items("x")` | `did not find bean x` |
| `didNotFind("any beans").atAll()` | `did not find any beans` |
| `resultedIn("yes")` | `resulted in yes` |

`found` / `didNotFind` 返回的不是 `ConditionMessage` 而是 `ItemsBuilder`，要用 `items(...)` 把具体条目放进去；短语写成单复数两个参数时（`found("class", "classes")`），条目只有一个就用单数。

## 一个完整的例子

把「什么时候需要它」里那个按配置值切换数据源的判断，改写成 `SpringBootCondition` 的子类：

```java
public class OnDatabaseModeCondition extends SpringBootCondition {

    private static final String PROPERTY = "app.db.mode";

    @Override
    public ConditionOutcome getMatchOutcome(ConditionContext context, AnnotatedTypeMetadata metadata) {
        ConditionMessage.Builder message = ConditionMessage.forCondition("OnDatabaseMode");
        String mode = context.getEnvironment().getProperty(PROPERTY);
        if ("readonly".equals(mode)) {
            return ConditionOutcome.match(message.foundExactly(PROPERTY + "=" + mode));
        }
        return ConditionOutcome.noMatch(message.because(PROPERTY + " is " + mode));
    }
}
```

`Builder` 上的方法不改动自身，每次都返回新的 `ConditionMessage`，所以两个分支共用同一个 `message` 是安全的。

挂到配置类上的写法和裸 `Condition` 完全一样——`@Conditional` 收的是 `Class<? extends Condition>[]`，子类实现了 `Condition` 就行：

```java
@Configuration
@Conditional(OnDatabaseModeCondition.class)
public class ReadOnlyDataSourceConfiguration {

    @Bean
    public DataSource dataSource() {
        // 只读数据源
    }
}
```

两个分支分别拼出 `OnDatabaseMode found app.db.mode=readonly` 和 `OnDatabaseMode app.db.mode is null`，前者出现在报告的 Positive matches 段，后者出现在 Negative matches 段。

## 父类留的两个辅助方法

`matches` 和 `anyMatches` 都是 `protected final`，在 `getMatchOutcome` 里可以直接调用：

- `matches(context, metadata, condition)`：评估传入的一个条件，返回布尔值。传入的条件如果也是 `SpringBootCondition`，走它的 `getMatchOutcome` 拿结论；否则按普通 `Condition` 调 `condition.matches(...)`。
- `anyMatches(context, metadata, conditions...)`：上面那个的「任意一个成立即可」版本，逐个评估到第一个成立为止。

注意这两个方法触发的评估不写日志、也不进条件评估报告——记录动作在两步参数的 `matches` 里，而它只处理当前这个条件自身。想让某个条件的结论出现在报告里，它得自己作为条件类被 `@Conditional` 引用。

## 启动时看条件评估报告

条件用得多了，最常问的就是「这个 Bean 为什么没装配」。Boot 的 `ConditionEvaluationReportLoggingListener` 把每次条件评估的结论收集起来，在启动结束（`ContextRefreshedEvent`）时输出，默认走 DEBUG 级别——所以加 `--debug` 启动就能看到。官方文档里的说法是：打开一部分核心 logger 的 debug 日志，并把条件报告打到控制台。

启动失败时会改在 `ApplicationFailedEvent` 时打一次；这次仍然没能打出来，日志里会追加一句提示，让你带上 `debug` 再跑一遍。Boot 3.0 起还可以用 `ConditionEvaluationReportLoggingListener.forLogLevel(LogLevel.INFO)` 把它抬到 INFO 级别，代价是每次启动都会多出一段输出。

报告分四段，段名是框架写死的：

| 段 | 内容 |
| --- | --- |
| Positive matches | 匹配上的条件及其原因 |
| Negative matches | 没匹配上的条件，先列 `Did not match`，再列其中匹配上的部分 |
| Exclusions | 被 exclude 掉的自动配置类 |
| Unconditional classes | 无条件装配的类 |

每条匹配的格式是「类名 matched:」加一行缩进说明，行尾括号里是条件类的短名：

```text
   ReadOnlyDataSourceConfiguration matched:
      - OnDatabaseMode found app.db.mode=readonly (OnDatabaseModeCondition)
```

短横线后面那句就是 `ConditionOutcome` 里的说明——用 `because(...)` 拼，报告里显示的就是你写的措辞。这也是继承 `SpringBootCondition` 而不是直接实现 `Condition` 的直接收益：报告只记录 `SpringBootCondition` 子类的评估结果（记录动作在 `SpringBootCondition#matches` 里的 `recordEvaluation`），直接实现 `Condition` 的条件不会出现在这份报告里。

条件类另有一条 TRACE 通道（`SpringBootCondition#logOutcome`），把日志级别调到 TRACE 也能看到同样的结论；报告更完整的地方在于它把同一批条件按类名排好序、分段呈现。

## Boot 自带的条件类都继承自它

Spring Boot 自带的那批 `@ConditionalOnXxx` 注解，每个都通过 `@Conditional(...)` 指向一个继承自 `SpringBootCondition` 的条件类。它们和你的自定义条件走的是同一套流程，结论同样出现在报告里：

| 注解 | 背后的条件类 |
| --- | --- |
| `@ConditionalOnClass` / `@ConditionalOnMissingClass` | `OnClassCondition` |
| `@ConditionalOnBean` / `@ConditionalOnMissingBean` / `@ConditionalOnSingleCandidate` | `OnBeanCondition` |
| `@ConditionalOnProperty` | `OnPropertyCondition` |
| `@ConditionalOnResource` | `OnResourceCondition` |
| `@ConditionalOnJava` | `OnJavaCondition` |
| `@ConditionalOnExpression` | `OnExpressionCondition` |
| `@ConditionalOnJndi` | `OnJndiCondition` |
| `@ConditionalOnCloudPlatform` | `OnCloudPlatformCondition` |
| `@ConditionalOnWarDeployment` / `@ConditionalOnNotWarDeployment` | `OnWarDeploymentCondition` |
| `@ConditionalOnWebApplication` / `@ConditionalOnNotWebApplication` | `OnWebApplicationCondition` |
| `@ConditionalOnThreading` | `OnThreadingCondition` |

`@ConditionalOnCheckpointRestore` 是这组里的例外：它没有直接挂 `@Conditional`，而是组合了 `@ConditionalOnClass(name = "org.crac.Resource")`。

`OnClassCondition` 和 `OnBeanCondition` 中间还夹了一层 `FilteringSpringBootCondition`，它在这个基类之上多实现了一个 `AutoConfigurationImportFilter`，可以在自动配置类被加载之前先按类名筛掉一批。这一层是包内可见的抽象类，写自定义条件时用不到。

另外，用来组合条件的 `AnyNestedCondition` / `AllNestedConditions` / `NoneNestedConditions` 三个基础类共同继承自 `AbstractNestedCondition`，而它也是 `SpringBootCondition` 的子类——通过它们写出来的条件同样会进报告。

## 写的时候容易出错的地方

**抛异常不等于「不匹配」。** 条件里抛出的异常会直接让启动失败，不会退化成一次「不匹配」。`matches`（基类那个 `final` 的入口）会把 `RuntimeException` 包成 `IllegalStateException: Error processing condition on ...` 再抛出；想表达不匹配就返回 `noMatch(...)`。

**`Error` 也一样会被包。** 引用到一个类路径上不存在的类时，抛出的 `NoClassDefFoundError` 会被包成 `IllegalStateException`，提示里还特意点了一句：可能是你把 `@ComponentScan` 写在了默认包下，扫到了 Spring 自己的包。

**覆写 `matches` 是行不通的。** 它是 `final` 方法，重写会直接编译不过；要改结论只能改 `getMatchOutcome` 的返回值。

**没有「不表态」这个选项。** `getMatchOutcome` 必须明确返回 `match(...)` 或 `noMatch(...)`。返回 `null` 不会当成「不匹配」，而是在基类里抛 `NullPointerException`，再被包成 `IllegalStateException`，启动直接失败。
