# Java 25 新特性

[[toc]]

## 概述

Java 25 LTS 版本已按计划于2025年9月16日正式发布，该版本提供18项新特性（含6项预览功能），延续了两年发布一次LTS版本的策略。

## 正式特性

+ JEP 503：移除 32 位 x86 端口
+ JEP 506：作用域值由 JEP 429 （Java 20） 提议孵化，经过 Java21-24 四次预览，最终在JEP 506（Java 25）中正式引入。
  - JEP 446（Java 21）：作用域值（预览）
  - JEP 464（Java 22）：作用域值（第二次预览）
  - JEP 481（Java 23）：作用域值（第三次预览）
  - JEP 487（Java 24）：作用域值（第四次预览）
+ JEP 510：密钥派生函数 API
+ JEP 511：模块导入声明由 JEP 476（Java 23） 提议预览，经过 JEP 494（Java 24）再次预览，最终在 JEP 511（Java 25）中正式引入。
+ JEP 512：压缩源文件和实例主方法
  - JEP 445（Java 21）: 未命名类和实例主方法（预览）
  - JEP 463（Java 22）: 隐式声明的类和实例主方法（第二次预览）
  - JEP 477（Java 23）: 隐式声明的类和实例主方法（第三次预览）
  - JEP 495（Java 24）：简单源文件和实例主方法（第四次预览）
+ JEP 513：灵活的构造函数体经过Java22-24三次预览，最终在JEP 513（Java 25）中正式引入。
  - JEP 447（Java 22）: super() 前语句（预览）
  - JEP 482（Java 23）: 灵活的构造函数（第二次预览）
  - JEP 492（Java 24）：灵活的构造函数体（第三次预览）
+ JEP 514：超前命令行
+ JEP 515：超前方法剖析
+ JEP 518：JFR 协作式采样
+ JEP 519：紧凑对象标头
  - JEP 450（Java 24）：紧凑对象标头（实验性）
+ JEP 520：JFR 方法时序和跟踪
+ JEP 521：分代 Shenandoah
  - JEP 404（Java 24）：分代 Shenandoah（实验性）

## 预览特性

+ JEP 470：加密对象的 PEM 编码（预览）
+ JEP 502：稳定值（预览）
+ JEP 505：结构化并发（第五次预览）
+ JEP 507：模式、instanceof 和 switch中的原始类型（第三次预览）
+ JEP 508：向量 API（第十次孵化）
+ JEP 509：JFR CPU 时间分析（实验性）


## JEP 470：加密对象的 PEM 编码（预览）

::: info JEP 470: PEM Encodings of Cryptographic Objects (Preview)
Introduce an API for encoding objects that represent cryptographic keys, certificates, and certificate revocation lists into the widely-used Privacy-Enhanced Mail (PEM) transport format, and for decoding from that format back into objects. This is a preview API.
:::

引入一个 API，用于将表示加密密钥、证书和证书吊销列表的对象编码为广泛使用的隐私增强型邮件 （PEM） 传输格式，并从该格式解码回对象。这是一个预览 API。

## JEP 502：稳定值（预览）

::: info JEP 502: Stable Values (Preview)
Introduce an API for stable values, which are objects that hold immutable data. Stable values are treated as constants by the JVM, enabling the same performance optimizations that are enabled by declaring a field final. Compared to final fields, however, stable values offer greater flexibility as to the timing of their initialization. This is a preview API.
:::

为稳定值引入 API，稳定值是保存不可变数据的对象。稳定值被 JVM 视为常量，从而实现与声明字段final相同的性能优化。与final字段相比，稳定值在初始化时间方面提供了更大的灵活性。这是一个预览 API。

稳定值具有以下特性：
+ 灵活初始化：稳定值为我们提供了与final字段相同的初始化保证，同时保留了可变非final字段的灵活性。
+ 支持稳定列表：稳定值 API 还引入了对稳定列表的支持，这是一种特殊的稳定值，用于存储不可变的元素列表。

<!-- @include ./stable-values-intro.md -->

## JEP 503：移除 32 位 x86 端口

::: info JEP 503: Remove the 32-bit x86 Port
Remove the source code and build support for the 32-bit x86 port. This port was deprecated for removal in JDK 24 (JEP 501) with the express intent to remove it in a future release.
:::

移除32位x86端口的源代码和构建支持。该端口在JDK 24（JEP 501）中已被标记为弃用，明确计划在未来版本中移除。

## JEP 505：结构化并发（第五次预览）

::: info JEP 505: Structured Concurrency (Fifth Preview)
Simplify concurrent programming by introducing an API for structured concurrency. Structured concurrency treats groups of related tasks running in different threads as single units of work, thereby streamlining error handling and cancellation, improving reliability, and enhancing observability. This is a preview API.
:::

<!-- @include:./structured-concurrency-intro.md -->

[结构化并发](./structured-concurrency-guide.md)

## JEP 506：作用域值

::: info JEP 506: Scoped Values
Introduce scoped values, which enable a method to share immutable data both with its callees within a thread, and with child threads. Scoped values are easier to reason about than thread-local variables. They also have lower space and time costs, especially when used together with virtual threads (JEP 444) and structured concurrency (JEP 505).
:::

<!-- @include: ./scoped-values-guide-intro.md -->

有一个小的更改：ScopedValue.orElse 方法不再接受 null 作为其参数。

[作用域值](./scoped-values-guide.md)

## JEP 507：模式、instanceof 和 switch中的原始类型（第三次预览）

::: info JEP 507: Primitive Types in Patterns, instanceof, and switch (Third Preview)
Enhance pattern matching by allowing primitive types in all pattern contexts, and extend instanceof and switch to work with all primitive types. This is a preview language feature.
:::

<!-- @include:./primitive-types-in-patterns-instanceof-and-switch-intro.md -->

[模式、instanceof 和 switch中的原始类型](./primitive-types-in-patterns-instanceof-and-switch.md)

## JEP 508：向量 API（第十次孵化）

::: info JEP 508: Vector API (Tenth Incubator)
Introduce an API to express vector computations that reliably compile at runtime to optimal vector instructions on supported CPUs, thus achieving performance superior to equivalent scalar computations.
:::

<!-- @include:./vector-api-intro.md -->

## JEP 509：JFR CPU 时间分析（实验性）

::: info JEP 509: JFR CPU-Time Profiling (Experimental)
Enhance the JDK Flight Recorder (JFR) to capture more accurate CPU-time profiling information on Linux. This is an experimental feature.
:::

增强 JDK 飞行记录器 （JFR） 以在 Linux 上捕获更准确的 CPU 时间分析信息。这是一个实验性功能。

## JEP 510：密钥派生函数 API

::: info JEP 510: Key Derivation Function API
Introduce an API for Key Derivation Functions (KDFs), which are cryptographic algorithms for deriving additional keys from a secret key and other data.
:::

引入密钥派生函数（KDF）的 API，这是一种用于从密钥和其他数据派生其他密钥的加密算法。

## JEP 511：模块导入声明

::: info JEP 511: Module Import Declarations
Enhance the Java programming language with the ability to succinctly import all of the packages exported by a module. This simplifies the reuse of modular libraries, but does not require the importing code to be in a module itself.
:::

通过简洁地导入模块导出的所有包的功能来增强 Java 编程语言。这简化了模块库的重用，但不要求导入代码本身必须在模块中。

## JEP 512：压缩源文件和实例主方法

::: info JEP 512: Compact Source Files and Instance Main Methods
Evolve the Java programming language so that beginners can write their first programs without needing to understand language features designed for large programs. Far from using a separate dialect of the language, beginners can write streamlined declarations for single-class programs and then seamlessly expand their programs to use more advanced features as their skills grow. Experienced developers can likewise enjoy writing small programs succinctly, without the need for constructs intended for programming in the large.
:::

<!-- @include: ./jep-445-463-477-495-512-intro.md -->

改动点：
- 将简单的源文件重命名为紧凑的源文件
- 用于基本控制台 I/O 的新 IO 类现在位于 java.lang 包中，被每个源文件隐式导入。
- IO 类的静态方法不再隐式导入到紧凑的源文件中。因此，这些方法的调用必须命名类，例如`IO.println("Hello, world!")`， 除非显式导入这些方法。
- IO 类的实现现在基于`System.out`和`System.in`， 而不是`java.io.Console` 类。

## JEP 513：灵活的构造函数体

::: info JEP 513: Flexible Constructor Bodies
In the body of a constructor, allow statements to appear before an explicit constructor invocation, i.e., super(...) or this(...). Such statements cannot reference the object under construction, but they can initialize its fields and perform other safe computations. This change allows many constructors to be expressed more naturally. It also allows fields to be initialized before they become visible to other code in the class, such as methods called from a superclass constructor, thereby improving safety.
:::

在构造函数体内，允许在显式构造函数调用（即 super(...) 或 this(...)）之前出现语句。这些语句不能引用正在构造的对象，但可以初始化其字段并执行其他安全计算。这一变化使许多构造函数能够更自然地表达。它还允许在字段对类中其他代码（如从超类构造函数调用的方法）可见之前对其进行初始化，从而提高安全性。

## JEP 514：超前命令行

::: info JEP 514:	Ahead-of-Time Command-Line Ergonomics
Make it easier to create ahead-of-time caches, which accelerate the startup of Java applications, by simplifying the commands required for common use cases.
:::

这项改进旨在简化创建 Java AOT（提前编译）缓存的命令，让普通开发者更容易使用这项高级技术，从而大幅缩短 Java 应用的启动时间。

在之前的 Java 版本中，创建 AOT 缓存非常复杂：

```bash
java -XX:+UnlockExperimentalVMOptions -XX:AOTLibrary=./app_cache.so -XX:SharedArchiveFile=./app_cached.jsa -Xshare:dump -cp myapp.jar com.example.MainClass
```

新版本简化了这个过程：
```bash
java -Xaot:force -jar myapp.jar
# 或者
java -Xaot:generate -jar myapp.jar
```

这项改进使得 Java 开发者能够**通过简单的命令参数，就能获得类似原生编译语言的启动速度，同时保持 Java 的跨平台优势和运行时优化能力**。这标志着 Java 在云原生时代的重要进化，让高性能 Java 应用的门槛大大降低。

## JEP 515：超前方法剖析

::: info JEP 515:	Ahead-of-Time Method Profiling
Improve warmup time by making method-execution profiles from a previous run of an application instantly available, when the HotSpot Java Virtual Machine starts. This will enable the JIT compiler to generate native code immediately upon application startup, rather than having to wait for profiles to be collected.
:::

当 HotSpot Java 虚拟机启动时，可立即从应用程序的上一次运行中获取方法执行配置文件，从而缩短预热时间。这将使 JIT 编译器能在应用程序启动时立即生成本地代码，而无需等待收集配置文件。

<!-- @include:ahead-of-time-method-profiling-intro.md -->

## JEP 518：JFR 协作式采样

::: info JEP 518: JFR Cooperative Sampling
Improve the stability of the JDK Flight Recorder (JFR) when it asynchronously samples Java thread stacks. Achieve this by walking call stacks only at safepoints, while minimizing safepoint bias.
:::

提高 JDK Flight Recorder (JFR) 异步采样 Java 线程堆栈时的稳定性。为此，我们只在安全点处走查调用堆栈，同时尽量减少安全点偏差。

<!-- @include:jfr-cooperative-sampling-intro.md -->

## JEP 519：紧凑对象头

::: info JEP 519: Compact Object Headers
Change compact object headers from an experimental feature to a product feature.
:::

将紧凑对象头从实验功能改为产品功能，详情请查看 [紧凑对象头详解](./compact-object-headers.md)。

<!-- @include:compact-object-headers-intro.md -->

## JEP 520：JFR 方法时序和跟踪

::: info JEP 520: JFR Method Timing & Tracing
Extend the JDK Flight Recorder (JFR) with facilities for method timing and tracing via bytecode instrumentation.
:::

通过字节码检测扩展 JDK Flight Recorder （JFR），提供方法计时和跟踪功能。

## JEP 521：分代 Shenandoah

::: info JEP 521:	Generational Shenandoah
Change the generational mode of the Shenandoah garbage collector from an experimental feature to a product feature.
:::

将 Shenandoah 垃圾收集器的分代模式从实验功能改为产品功能。

## 参考资料
[JDK 25](https://openjdk.org/projects/jdk/25/)
