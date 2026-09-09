# Java 22 新特性

[[toc]]

::: info
Java 22 于 2024 年 3 月发布，包含了多个新特性和改进。
:::

## JEP 423: G1 区域固定

::: info JEP 423: Region Pinning for G1
Reduce latency by implementing region pinning in G1, so that garbage collection need not be disabled during Java Native Interface (JNI) critical regions.
:::

在G1垃圾收集器中实现区域固定机制，从而避免在Java本地接口（JNI）关键区域执行期间暂停垃圾回收，以此降低系统延迟。

## JEP 447: super() 前语句（预览）

::: info Statements before super(...) (Preview)
In constructors in the Java programming language, allow statements that do not reference the instance being created to appear before an explicit constructor invocation. This is a preview language feature.
:::

允许在构造函数中调用显示构造函数（super()、this()）之前执行不引用当前实例的语句，便于参数验证。

## JEP 454: 外部函数与内存

::: info JEP 454: API Foreign Function & Memory API
Introduce an API by which Java programs can interoperate with code and data outside of the Java runtime. By efficiently invoking foreign functions (i.e., code outside the JVM), and by safely accessing foreign memory (i.e., memory not managed by the JVM), the API enables Java programs to call native libraries and process native data without the brittleness and danger of JNI.
:::

引入外部函数与内存API，使得Java程序能够与Java运行时之外的代码和数据交互。该API通过高效调用外部函数（即JVM之外的代码）及安全访问外部内存（即JVM不管理的内存），让Java程序能够调用本地库并处理本地数据，同时避免JNI存在的脆弱性和安全隐患。

提供安全、高效的方式来调用本地代码（如 C 库）和操作堆外内存，替代 JNI。

## JEP 456: 未命名变量和模式

::: info Unnamed Variables & Patterns
Enhance the Java programming language with unnamed variables and unnamed patterns, which can be used when variable declarations or nested patterns are required but never used. Both are denoted by the underscore character, _.
:::

支持使用下划线(_)表示未使用的模式和变量，简化代码并提高可读性。

```java

// 未命名变量
int _ = calculateValue(); // 计算但不使用结果

// 未命名模式
if (obj instanceof String _) {
    // 只检查类型，不关心具体值
    System.out.println("It's a string");
}

// 在record模式中
record Point(int x, int y) {}
if (obj instanceof Point(int _, int y)) {
    // 只关心y坐标
    System.out.println("Y coordinate: " + y);
}

```

## JEP 457: 类文件 API（预览）

::: info JEP 457: Class-File API (Preview)
Provide a standard API for parsing, generating, and transforming Java class files. This is a preview API.
:::

<!-- @include: ./class-file-api-intro.md -->

## JEP 458: 启动多文件源代码程序

::: info JEP 458: Launch Multi-File Source-Code Programs
Enhance the java application launcher to be able to run a program supplied as multiple files of Java source code. This will make the transition from small programs to larger ones more gradual, enabling developers to choose whether and when to go to the trouble of configuring a build tool.
:::

无需先编译，直接用 java 命令运行由多个 Java 源文件组成的程序。

## JEP 459: 字符串模板（第二次预览）

::: info JEP 459: String Templates (Second Preview)
Enhance the Java programming language with string templates. String templates complement Java's existing string literals and text blocks by coupling literal text with embedded expressions and template processors to produce specialized results. This is a preview language feature and API.
:::

<!-- @include:./string-templates-intro.md -->

## JEP 460: 向量 API（第七次孵化）

::: info JEP 460: Vector API (Seventh Incubator)
Introduce an API to express vector computations that reliably compile at runtime to optimal vector instructions on supported CPU architectures, thus achieving performance superior to equivalent scalar computations.
:::

<!-- @include:./vector-api-intro.md -->

## JEP 461: 流收集器（预览）

::: info
Stream Gatherers (Preview)
Enhance the Stream API to support custom intermediate operations. This will allow stream pipelines to transform data in ways that are not easily achievable with the existing built-in intermediate operations. This is a preview API.
:::

流收集器（Stream Gatherers）能为Stream API轻松添加自定义的中间操作，实现更复杂的数据转换。

[流收集器](./stream-gatherers-guide.md)

## JEP 462: 结构化并发（第二次预览）

::: info JEP 462: Structured Concurrency (Second Preview)
Simplify concurrent programming by introducing an API for structured concurrency. Structured concurrency treats groups of related tasks running in different threads as a single unit of work, thereby streamlining error handling and cancellation, improving reliability, and enhancing observability. This is a preview API.
:::

<!-- @include:./structured-concurrency-intro.md -->

## JEP 463: 隐式声明的类和实例主方法（第二次预览）

::: info JEP 463: Implicitly Declared Classes and Instance Main Methods (Second Preview)
Evolve the Java programming language so that students can write their first programs without needing to understand language features designed for large programs. Far from using a separate dialect of the language, students can write streamlined declarations for single-class programs and then seamlessly expand their programs to use more advanced features as their skills grow. This is a preview language feature.
:::

<!-- @include: ./jep-445-463-477-495-512-intro.md -->

改动点：将**未命名类和实例主方法**重命名为**隐式声明的类和实例主方法**

## JEP 464: 作用域值（第二次预览）

::: info JEP 464: Scoped Values (Second Preview)
Introduce scoped values, which enable managed sharing of immutable data both with child frames in the same thread, and with child threads. Scoped values are easier to reason about than thread-local variables and have lower space and time costs, especially when used in combination with Virtual Threads and Structured Concurrency. This is a preview API.
:::

引入作用域值（Scoped Values），支持在同一线程的子帧（child frames）及子线程间安全地共享不可变数据。与线程局部变量（thread-local variables）相比，作用域值更易于逻辑推演，并具有更低的空间和时间开销——尤其在与虚拟线程（Virtual Threads）和结构化并发（Structured Concurrency）结合使用时。该功能为预览版API。

用于在线程内和跨线程共享不可变数据，旨在替代 `ThreadLocal`，特别是在虚拟线程场景下更高效、更安全。

改动点：新增 runWhere 静态方法，支持同时设置多个值，更简洁直观。

```java

// 设置多个值
ScopedValue.runWhere(USER_ID, "user123",
                    REQUEST_ID, "req456",
                    TIMEOUT, 5000,
                    () -> {
  // 扁平化设计，更清晰
  handleRequest();
});

```