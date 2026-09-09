# Java 24 新特性

[[toc]]

## 概述

Java 24 于 2025 年 3 月发布，该版本提供24项新特性（含10项孵化/预览/实验功能）。

## JEP 404: 分代 Shenandoah（实验性）

::: info JEP 404: Generational Shenandoah (Experimental)
Enhance the Shenandoah garbage collector with experimental generational collection capabilities to improve sustainable throughput, load-spike resilience, and memory utilization.
:::

通过实验性分代收集功能增强 Shenandoah 垃圾回收器，以提高可持续吞吐量、负载峰值弹性和内存利用率。

<!-- @include:generational-shenandoah-intro.md -->

## JEP 450: 紧凑对象头（实验性）

::: info JEP 450: Compact Object Headers (Experimental)
Reduce the size of object headers in the HotSpot JVM from between 96 and 128 bits down to 64 bits on 64-bit architectures. This will reduce heap size, improve deployment density, and increase data locality.
:::

重构了Java对象的内存布局，将 HotSpot JVM 中的普通对象头大小从96到128位减少到64位，从而提升内存利用率和应用性能。

<!-- @include:compact-object-headers-intro.md -->

## JEP 472: 准备限制 JNI 的使用

::: info JEP 472: Prepare to Restrict the Use of JNI
Issue warnings about uses of the Java Native Interface (JNI) and adjust the Foreign Function & Memory (FFM) API to issue warnings in a consistent manner. All such warnings aim to prepare developers for a future release that ensures integrity by default by uniformly restricting JNI and the FFM API. Application developers can avoid both current warnings and future restrictions by selectively enabling these interfaces where essential.
:::

JEP 472（Prepare to Restrict the Use of JNI）是JDK 24中的一个重要提案，旨在**增强Java平台的安全性**，通过引入对Java本地接口（JNI）使用的限制和警告，为未来版本默认禁止通过JNI或FFM API与本地代码互操作做准备。

<!-- @include:prepare-to-restrict-the-use-of-jni-intro.md -->

## JEP 475: G1 的 Late Barrier 扩展

::: info JEP 475: Late Barrier Expansion for G1
Simplify the implementation of the G1 garbage collector's barriers, which record information about application memory accesses, by shifting their expansion from early in the C2 JIT's compilation pipeline to later.
:::

通过将G1垃圾回收器屏障的生成时机，从C2 JIT编译前期移至后期，简化了其实现。这些屏障的作用是记录有关应用程序内存访问的信息。

## JEP 478: 密钥派生函数 API（预览）

::: info JEP 478: Key Derivation Function API (Preview)
Introduce an API for Key Derivation Functions (KDFs), which are cryptographic algorithms for deriving additional keys from a secret key and other data. This is a preview API.
:::

引入一个用于密钥派生函数的预览版API。密钥派生函数是一种可从密钥及其他数据中推导出更多密钥的密码学算法。

**目标**：

- 使应用程序能够使用KDF算法，例如基于HMAC的提取-扩展密钥派生函数（HKDF，RFC 5869）和Argon2（RFC 9106）。
- 支持在密钥封装机制（KEM，JEP 452）实现（如ML-KEM）、高层协议（如TLS 1.3中的混合密钥交换）以及密码方案（如混合公钥加密HPKE，RFC 9180）中使用KDF。
- 允许安全提供商使用Java代码或原生代码来实现KDF算法。
- 包含了HKDF的一个实现，并引入了额外的HKDF专用API。

## JEP 479: 删除 Windows 32 位 x86 端口

::: info JEP 479: Remove the Windows 32-bit x86 Port
Remove the source code and build support for the Windows 32-bit x86 port. This port was deprecated for removal in JDK 21 with the express intent to remove it in a future release.
:::

移除针对 Windows 32 位 x86 端口的源代码和构建支持。该端口已在 JDK 21 中被标记为弃用并计划移除，并明确表达了在未来的版本中将其移除的意图。

## JEP 483: 提前类加载和链接

::: info JEP 483: Ahead-of-Time Class Loading & Linking
Improve startup time by making the classes of an application instantly available, in a loaded and linked state, when the HotSpot Java Virtual Machine starts.Achieve this by monitoring the application during one run and storing the loaded and linked forms of all classes in a cache for use in subsequent runs. Lay a foundation for future improvements to both startup and warmup time.
:::

通过让应用程序的类在 HotSpot Java 虚拟机启动时就能立即可用（即已完成加载和链接），来提升启动速度。
其实现方式是：在应用的一次运行期间进行监控，并将所有类的加载和链接形式存储在缓存中以供后续运行使用。
这同时也为未来优化启动与预热时间打下了基础。

## JEP 484: 类文件 API

::: info JEP 484: Class-File API
Provide a standard API for parsing, generating, and transforming Java class files.
:::

<!-- @include: ./class-file-api-intro.md -->

自第二个预览版以来的更改包括重命名枚举值、删除某些字段、添加方法和方法重载、重命名方法以及删除被认为不必要的接口和方法。

## JEP 485: 流收集器

::: info JEP 485: Stream Gatherers
Enhance the Stream API to support custom intermediate operations. This will allow stream pipelines to transform data in ways that are not easily achievable with the existing built-in intermediate operations.
:::

<!-- @include: ./stream-gatherers-guide-intro.md -->

[流收集器](./stream-gatherers-guide.md)

## JEP 486: 永久禁用安全管理器

::: info JEP 486: Permanently Disable the Security Manager
The Security Manager has not been the primary means of securing client-side Java code for many years, it has rarely been used to secure server-side code, and it is costly to maintain. We therefore deprecated it for removal in Java 17 via JEP 411 (2021). As the next step toward removing the Security Manager, we will revise the Java Platform specification so that developers cannot enable it and other Platform classes do not refer to it. This change will have no impact on the vast majority of applications, libraries, and tools. We will remove the Security Manager API in a future release.
:::

安全管理器早已不是保护客户端Java代码的主要手段，在服务端代码中也鲜有应用，且维护成本高昂。因此，该机制已于2021年通过JEP 411在Java 17中被标记为弃用并计划移除。作为移除工作的下一步，Java平台规范将进行修订，使开发者无法启用该功能，并确保其他平台类不再引用它。此项变更对绝大多数应用程序、库和工具不会产生任何影响。Security Manager API将在未来版本中被彻底移除。

## JEP 487: 作用域值（第四次预览）

::: info JEP 487: Scoped Values (Fourth Preview)
Introduce scoped values, which enable a method to share immutable data both with its callees within a thread, and with child threads. Scoped values are easier to reason about than thread-local variables. They also have lower space and time costs, especially when used together with virtual threads (JEP 444) and structured concurrency (JEP 480). This is a preview API.
:::

<!-- @include: ./scoped-values-guide-intro.md -->

[作用域值](./scoped-values-guide.md)

有一个变动：移除了 `ScopedValue` 类中的 `callWhere` 和 `runWhere` 方法，使 API 保持完全流畅的链式调用特性。现在使用一个或多个绑定作用域值的唯一方式是通过 `ScopedValue.Carrier.call` 和 `ScopedValue.Carrier.run` 方法。

## JEP 488: 模式、instanceof 和 switch中的原始类型（第二次预览）

::: info JEP 488: Primitive Types in Patterns, instanceof, and switch (Second Preview)
Enhance pattern matching by allowing primitive types in all pattern contexts, and extend instanceof and switch to work with all primitive types. This is a preview language feature.
:::

<!-- @include: ./primitive-types-in-patterns-instanceof-and-switch-intro.md -->

[模式、instanceof 和 switch中的原始类型](./primitive-types-in-patterns-instanceof-and-switch.md)

## JEP 489: 向量 API（第九个孵化器）

::: info JEP 489: Vector API (Ninth Incubator)
Introduce an API to express vector computations that reliably compile at runtime to optimal vector instructions on supported CPU architectures, thus achieving performance superior to equivalent scalar computations.
:::

<!-- @include:./vector-api-intro.md -->

## JEP 490:  ZGC：删除非分代模式

::: info JEP 490: ZGC: Remove the Non-Generational Mode
Remove the non-generational mode of the Z Garbage Collector (ZGC), keeping the generational mode as the default for ZGC.
:::

移除Z垃圾回收器（ZGC）的非分代模式，保留分代模式作为ZGC的默认配置。

## JEP 491: 无需固定即可同步虚拟线程

::: info JEP 491: Synchronize Virtual Threads without Pinning
Improve the scalability of Java code that uses synchronized methods and statements by arranging for virtual threads that block in such constructs to release their underlying platform threads for use by other virtual threads. This will eliminate nearly all cases of virtual threads being pinned to platform threads, which severely restricts the number of virtual threads available to handle an application's workload.
:::

本改进旨在提升使用同步方法和语句的Java代码的可扩展性。其机制是：当虚拟线程在此类同步结构中阻塞时，会主动释放其占用的平台线程，以供其他虚拟线程使用。此举将消除虚拟线程被“固定”在平台线程上的绝大多数情况，从而避免其对应用工作负载处理能力的严重限制。

## JEP 492: 灵活的构造函数体（第三次预览）

::: info JEP 492: Flexible Constructor Bodies (Third Preview)
In constructors in the Java programming language, allow statements to appear before an explicit constructor invocation, i.e., super(..) or this(..). The statements cannot reference the instance under construction, but they can initialize its fields. Initializing fields before invoking another constructor makes a class more reliable when methods are overridden. This is a preview language feature.
:::

<!-- @include:./flexible-constructor-bodies-intro.md -->

## JEP 493: 无需 JMOD 即可链接运行时图像

::: info JEP 493: Linking Run-Time Images without JMODs
Reduce the size of the JDK by approximately 25% by enabling the jlink tool to create custom run-time images without using the JDK's JMOD files. This feature must be enabled when the JDK is built; it will not be enabled by default, and some JDK vendors may choose not to enable it.
:::
通过让 jlink 工具能够在不依赖 JDK 的 JMOD 文件的情况下创建自定义运行时镜像，可将 JDK 的体积减小约 25%。此功能需在构建 JDK 时手动启用，它不会默认生效，且部分 JDK 供应商可能会选择不启用它。

## JEP 494: 模块导入声明（第二次预览）

::: info JEP 494: Module Import Declarations (Second Preview)
Enhance the Java programming language with the ability to succinctly import all of the packages exported by a module. This simplifies the reuse of modular libraries, but does not require the importing code to be in a module itself. This is a preview language feature.
:::

<!-- @include: ./module-Import-declarations-intro.md -->

之前在 JDK 23 中预览过，本次改动点：

- 解除任何模块都不能声明对 java.base 模块的传递依赖的限制
- 修改 java.se 模块的声明
- 允许 type-import-on-demand 声明遮蔽模块导入声明

## JEP 495: 简单源文件和实例主方法（第四次预览）

::: info JEP 495: Simple Source Files and Instance Main Methods (Fourth Preview)
Evolve the Java programming language so that beginners can write their first programs without needing to understand language features designed for large programs. Far from using a separate dialect of the language, beginners can write streamlined declarations for single-class programs and then seamlessly expand their programs to use more advanced features as their skills grow. Experienced developers can likewise enjoy writing small programs succinctly, without the need for constructs intended for programming in the large. This is a preview language feature.
:::

<!-- @include: ./jep-445-463-477-495-512-intro.md -->

改动点：将**隐式声明的类和实例主方法**重命名为**简单源文件和实例主要方法**

## JEP 496: 基于抗量子模块格的密钥封装机制

::: info JEP 496: Quantum-Resistant Module-Lattice-Based Key Encapsulation Mechanism
Enhance the security of Java applications by providing an implementation of the quantum-resistant Module-Lattice-Based Key-Encapsulation Mechanism (ML-KEM). Key encapsulation mechanisms (KEMs) are used to secure symmetric keys over insecure communication channels using public key cryptography. ML-KEM is designed to be secure against future quantum computing attacks. It has been standardized by the United States National Institute of Standards and Technology (NIST) in FIPS 203.
:::

通过提供抗量子的基于模块格的密钥封装机制（ML-KEM）实现，增强Java应用程序的安全性。密钥封装机制（KEM）利用公钥密码学，在不安全通信信道中保护对称密钥的安全传输。ML-KEM的设计旨在抵御未来量子计算攻击，并已由美国国家标准与技术研究院（NIST）在FIPS 203中完成标准化。

## JEP 497: 基于模块格的抗量子数字签名算法

::: info JEP 497: Quantum-Resistant Module-Lattice-Based Digital Signature Algorithm
Enhance the security of Java applications by providing an implementation of the quantum-resistant Module-Lattice-Based Digital Signature Algorithm (ML-DSA). Digital signatures are used to detect unauthorized modifications to data and to authenticate the identity of signatories. ML-DSA is designed to be secure against future quantum computing attacks. It has been standardized by the United States National Institute of Standards and Technology (NIST) in FIPS 204.
:::

通过提供抗量子计算的基于模块格的数字签名算法（ML-DSA）实现，增强Java应用程序的安全性。数字签名技术用于检测数据的非法篡改，并对签名者身份进行认证。ML-DSA的设计旨在抵御未来量子计算攻击，并已由美国国家标准与技术研究院（NIST）在FIPS 204中完成标准化。

## JEP 498: 在 sun.misc.Unsafe 中使用内存访问方法时发出警告

::: info JEP 498: Warn upon Use of Memory-Access Methods in sun.misc.Unsafe
Issue a warning at run time on the first occasion that any memory-access method in sun.misc.Unsafe is invoked. All of these unsupported methods were terminally deprecated in JDK 23. They have been superseded by standard APIs, namely the VarHandle API (JEP 193, JDK 9) and the Foreign Function & Memory API (JEP 454, JDK 22). We strongly encourage library developers to migrate from sun.misc.Unsafe to supported replacements, so that applications can migrate smoothly to modern JDK releases.
:::

在运行时首次调用 sun.misc.Unsafe 中的任何内存访问方法时发出警告。 所有这些不受支持的方法已在 JDK 23 中被最终标记为弃用。它们已被标准 API 所取代，即 VarHandle API（JEP 193，JDK 9）和外部函数与内存 API（JEP 454，JDK 22）。强烈建议库开发者从 sun.misc.Unsafe 迁移至受支持的替代方案，以确保应用能够顺利过渡到现代 JDK 版本。

> 创建 sun.misc.Unsafe 类是为了为 Java 类提供一种执行低级操作的机制。它的大多数方法用于访问内存，无论是在 JVM 的垃圾收集堆中还是在堆外内存中，这些内存不受 JVM 控制。正如类名所示，这些内存访问方法是不安全的。

## JEP 499: 结构化并发（第四次预览）

::: info JEP 499: Structured Concurrency (Fourth Preview)
Simplify concurrent programming by introducing an API for structured concurrency. Structured concurrency treats groups of related tasks running in different threads as a single unit of work, thereby streamlining error handling and cancellation, improving reliability, and enhancing observability. This is a preview API.
:::

<!-- @include:./structured-concurrency-intro.md -->

## JEP 501: 弃用 32 位 x86 端口并将其删除

::: info JEP 501: Deprecate the 32-bit x86 Port for Removal
Deprecate the 32-bit x86 port, with the intent to remove it in a future release. This will thereby deprecate the Linux 32-bit x86 port, which is the only 32-bit x86 port remaining in the JDK. It will also, effectively, deprecate any remaining downstream 32-bit x86 ports. After the 32-bit x86 port is removed, the architecture-agnostic Zero port will be the only way to run Java programs on 32-bit x86 processors.
:::

弃用 32 位 x86 端口，并计划在未来版本中将其移除。此举将导致目前 JDK 中唯一剩余的 32 位 x86 端口——Linux 32 位 x86 端口被弃用，同时也将实质上弃用所有下游衍生的 32 位 x86 移植版本。在该端口被移除后，与架构无关的 Zero 移植版本将成为在 32 位 x86 处理器上运行 Java 程序的唯一方式。

## 参考资料

[JDK 24](https://openjdk.org/projects/jdk/24/)
