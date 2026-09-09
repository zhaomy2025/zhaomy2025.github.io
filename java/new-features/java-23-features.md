# Java 23 新特性

[[toc]]

## 概述
Java 23 于 2024 年 9 月发布，该版本提供12项新特性（含9项孵化/预览/实验功能）。

## 主要新特性

### JEP 455: 模式、instanceof 和 switch中的原始类型（预览）

::: info
Enhance pattern matching by allowing primitive type patterns in all pattern contexts, and extend instanceof and switch to work with all primitive types. This is a preview language feature.
:::

<!-- @include: ./primitive-types-in-patterns-instanceof-and-switch-intro.md -->

[模式、instanceof 和 switch中的原始类型](./primitive-types-in-patterns-instanceof-and-switch.md)

### JER 466: 类文件 API（第二次预览）

::: info JEP 466: Class-File API (Second Preview)
Provide a standard API for parsing, generating, and transforming Java class files. This is a preview API.
:::

<!-- @include: ./class-file-api-intro.md -->

### JER 467: Markdown 文档注释

::: info JEP 467: Markdown Documentation Comments
Enable JavaDoc documentation comments to be written in Markdown rather than solely in a mixture of HTML and JavaDoc @-tags.
:::

允许JavaDoc文档注释使用Markdown语法编写，而不再仅限于HTML和JavaDoc @-tags的混合格式。

### JER 469: 向量 API (第八个孵化器)
::: info JEP 469: Vector API (Eighth Incubator)
Introduce an API to express vector computations that reliably compile at runtime to optimal vector instructions on supported CPU architectures, thus achieving performance superior to equivalent scalar computations.
:::

<!-- @include:./vector-api-intro.md -->
[向量 API](./vector-api-guide.md)

### JER 471: 弃用 sun.misc.Unsafe 中的内存访问方法，以便删除

::: info JEP 471: Deprecate the Memory-Access Methods in sun.misc.Unsafe for Removal
Deprecate the memory-access methods in sun.misc.Unsafe for removal in a future release. These unsupported methods have been superseded by standard APIs, namely the VarHandle API (JEP 193, JDK 9) and the Foreign Function & Memory API (JEP 454, JDK 22). We strongly encourage library developers to migrate from sun.misc.Unsafe to supported replacements, so that applications can migrate smoothly to modern JDK releases.
:::

弃用 sun.misc.Unsafe 的内存访问方法以便在未来的版本中移除。这些不受支持的方法已被标准 API 取代，即 VarHandle API（JEP 193，JDK 9）和外部函数与内存 API（JEP 454，JDK 22）。我们强烈建议库开发者从 sun.misc.Unsafe 迁移到受支持的替代方案，以便应用程序能够顺利迁移到现代 JDK 版本。

### JEP 473: 流收集器（第二次预览）

::: info JEP 473: Stream Gatherers (Second Preview)
Enhance the Stream API to support custom intermediate operations. This will allow stream pipelines to transform data in ways that are not easily achievable with the existing built-in intermediate operations. This is a preview API.
:::

流收集器（Stream Gatherers）能为Stream API轻松添加自定义的中间操作，实现更复杂的数据转换。

### JER 474: ZGC: 默认的分代模式

::: info JEP 474: ZGC: Generational Mode by Default
Switch the default mode of the Z Garbage Collector (ZGC) to the generational mode. Deprecate the non-generational mode, with the intent to remove it in a future release.
:::

将 Z 垃圾回收器（ZGC）的默认模式切换为分代模式。弃用非分代模式，并计划在未来的版本中移除该模式。

### JEP 476: 模块导入声明（预览）

::: info JEP 476: Module Import Declarations (Preview)
Enhance the Java programming language with the ability to succinctly import all of the packages exported by a module. This simplifies the reuse of modular libraries, but does not require the importing code to be in a module itself. This is a preview language feature.
:::

<!-- @include: ./module-Import-declarations-intro.md -->

### JEP 477: 隐式声明的类和实例主方法（第三次预览）

::: info JEP 477: Implicitly Declared Classes and Instance Main Methods (Third Preview)
Evolve the Java programming language so that beginners can write their first programs without needing to understand language features designed for large programs. Far from using a separate dialect of the language, beginners can write streamlined declarations for single-class programs and then seamlessly expand their programs to use more advanced features as their skills grow. Experienced developers can likewise enjoy writing small programs succinctly, without the need for constructs intended for programming in the large. This is a preview language feature.
:::

<!-- @include: ./jep-445-463-477-495-512-intro.md -->

### JEP 480: 结构化并发（第三次预览）

::: info JEP 480: Structured Concurrency (Third Preview)
Simplify concurrent programming by introducing an API for structured concurrency. Structured concurrency treats groups of related tasks running in different threads as a single unit of work, thereby streamlining error handling and cancellation, improving reliability, and enhancing observability. This is a preview API.
:::

<!-- @include:./structured-concurrency-intro.md -->

[结构化并发](./structured-concurrency-guide.md)

### JEP 481: 作用域值（第三次预览）

::: info JEP 481: Scoped Values (Third Preview)
Introduce scoped values, which enable a method to share immutable data both with its callees within a thread, and with child threads. Scoped values are easier to reason about than thread-local variables. They also have lower space and time costs, especially when used together with virtual threads (JEP 444) and structured concurrency (JEP 480). This is a preview API.
:::

用于在线程内和跨线程共享不可变数据，旨在替代 `ThreadLocal`，特别是在虚拟线程场景下更高效、更安全。

有一个变动：`ScopedValue.callWhere` 方法的操作参数类型现在改为一个新的函数式接口，这使得 Java 编译器能够推断是否可能抛出受检异常。基于这一改动，`ScopedValue.getWhere` 方法不再需要，现已被移除。


### JEP 482: 灵活的构造函数体（第二次预览）

::: info JEP 482: Flexible Constructor Bodies (Second Preview)
In constructors in the Java programming language, allow statements to appear before an explicit constructor invocation, i.e., super(..) or this(..). The statements cannot reference the instance under construction, but they can initialize its fields. Initializing fields before invoking another constructor makes a class more reliable when methods are overridden. This is a preview language feature.
:::

<!-- @include:./flexible-constructor-bodies-intro.md -->

## 参考资料
[JDK 23](https://openjdk.org/projects/jdk/23/)
