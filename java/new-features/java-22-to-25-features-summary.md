# Java 22到Java 25重要特性总结

> 从Java 22到Java 25的技术革新：语言现代化、并发模型进化与开发体验全面升级

## 引言

Java 22到Java 25标志着Java语言在现代编程范式下的持续演进与突破。这一时期的Java版本不仅巩固了前几个版本的创新成果，还引入了多项改变游戏规则的新特性，从构造函数灵活性增强到模式匹配的进一步扩展，再到全新的并发编程模型，全方位提升了开发者的生产力和应用性能。本文将系统梳理这一阶段的关键特性变更，帮助开发者掌握Java生态的最新动态。

## 核心语言特性演进

### 灵活的构造函数体

JEP 447 (Java 22) → JEP 482 (Java 23) → JEP 492（Java 24） → JEP 513（Java 25）

变更说明：这一特性Java22-24的三次预览，最终在Java 25中成为正式特性。它彻底改变了Java构造函数的传统限制，允许在super()或this()调用之前放置语句，使得参数校验逻辑可以直接内聚在构造函数体中，无需抽离到静态方法。

关键演进：
+ **Java 22：JEP 447第一次预览**，首次允许在super()调用前插入语句，为参数校验提供更大灵活性
+ **Java 23：JEP 482第二次预览**，一些小幅的调整和优化，并没有引入特别显著的语法变化
+ **Java 24：JEP 492第三次预览**，引入了“序言和尾声”的概念
  - 序言是显式构造函数调用前的代码：不允许显式或隐式使用this来引用当前实例，或访问当前实例的字段，或调用当前实例的方法
    * 内部类构造函数属于当前实例的方法，因此也不允许在早期构造上下文中创建内部类
    * 允许在早期构造上下文中对同类中声明的字段进行简单赋值，条件是字段声明中缺少初始化器
  - 尾声是显式构造函数调用后的代码
+ **Java 25：正式特性**，完全稳定，成为构造函数的标准写法

::: tip

早期构造上下文既包括**显式构造函数调用的参数列表**，也包括**序言中的任何语句**。

在JEP 492之前建议**构造函数不得调用可重载的方法**，因为重载方法若引用了子类字段，基类构造函数在调用子类重载方法时，子类字段没有被初始化，从而导致不可预期的行为。**允许在早期构造上下文中对同类中声明的字段进行简单赋值**可部分解决这一问题，条件是字段声明中缺少初始化器。

:::

示例代码：
```java
// 基类
class Person {
    private final String name;
    Person(String name) {
        this.name = name;
    }
}
// Java 21及以前
class User extends Person{
    private final String id;
    User(String name, String rawId) {
        // 只能通过调用静态辅助方法校验name
        super(validateName(name));
        // 调用supper()后，才能校验rawId，若校验不通过，其实super()方法没有必要被调用
        // 当然，语法上也可以在super()参数中调用validateName()校验rawId，但这样违反了单一职责原则
        Objects.requireNonNull(rawId, "ID不能为空");
        this.id = formatId(rawId);
    }
    private static String validateName(String name) {
        Objects.requireNonNull(name, "姓名不能为空");
        return name.trim();
    }
    private String formatId(String rawId) {
        return "USER-" + rawId.toUpperCase();
    }
}

// Java 25
class User {
    private final String id;
    User(String name, String rawId) {
        // 在Java 25中，可以先执行参数校验，再调用super()
        // 无论是基类的参数，还是当前类的参数，都可以此处进行校验
        Objects.requireNonNull(rawId, "ID不能为空");
        String formattedId = formatId(rawId);
        Objects.requireNonNull(name, "姓名不能为空");
        String trimmedName = name.trim();
        super(trimmedName);
        this.id = formattedId;
    }
    private String formatId(String rawId) {
        return "USER-" + rawId.toUpperCase();
    }
}
```

### 模式、instanceof 和 switch中的原始类型

JEP 455 (Java 23) → JEP 488 (Java 24) → JEP 507 (Java 25)

变更说明：Java 23引入了原始类型在模式匹配、instanceof和switch中的支持作为预览特性，并在Java 24和Java 25中继续预览，没有变动。这一特性消除了开发人员在使用模式匹配时遇到的原始类型限制，使语言更加统一且更具表达能力。

<!-- @include:./primitive-types-in-patterns-instanceof-and-switch-intro.md -->

### 字符串模板（String Templates）

JEP 430 (Java 21) → JEP 459 (Java 22)

变更说明：Java 中的字符串模板（String Templates）在 JDK 21 和 22 中作为预览功能出现后，在 JDK 23 中被移除。

字符串模板被移除核心原因在于其设计上的争议，特别是围绕 StringTemplate.Processor 接口的复杂性：字符串模板的设计核心之一是StringTemplate.Processor接口，旨在允许开发人员将字符串模板安全地转换为任何类型的对象（如字符串、SQL语句、JSON对象等）。然而，许多反馈认为，这种通过处理器转换的方式在实际应用中显得多余且复杂。例如，对于数据库查询或JSON解析这样的场景，与其使用一个通用的处理器接口，不如直接在相关类中新增一个接受StringTemplate类型参数的方法来得更直接和清晰。社区反馈和讨论认为，Processor接口的实际必要性并不大，反而增加了API的复杂性和理解成本。
对于如何改进设计，社区内部缺乏足够的共识，为了避免更多开发者针对一个有潜在缺陷的预览设计进行开发，Java 23移除了字符串模板的功能。移除并不意味着字符串模板的概念被永久否定，而是为了避免有缺陷的设计被广泛应用。当前最新特性是JEP 465，期待在未来的版本中重新引入字符串模板的功能。

### 模块导入声明

JEP 476 (Java 23) → JEP 494 (Java 24) → JEP 511 (Java 25)

变更说明：这一特性从Java 23的预览阶段发展到Java 25的正式版。它允许开发人员轻松快速地导入由模块导出的所有程序包，无需将导入代码放到模块中，从而提高工作效率，简化对模块化库的重用。

<!-- @include:./module-import-declarations-intro.md -->

## 并发编程革新

### 结构化并发

JEP 428 (Java 19) → JEP 437 (Java 19) → JEP 453 (Java 21) → JEP 462 (Java 22) → JEP 480 (Java 23) → JEP 499 (Java 24) → JEP 505 (Java 25)

变更说明：结构化并发从Java 19开始孵化，经过Java 20第二次孵化，Java 21-25的五次预览，逐步完善和稳定。它提供了一种简化并发编程的方法，将相关任务组视为单个工作单元，简化错误处理和取消操作，提高代码可读性和可靠性。

关键演进：
- **Java 19：JEP 428孵化**，首次引入`StructuredTaskScope`API，支持`ShutdownOnFailure`和`ShutdownOnSuccess`策略
- **Java 20：JEP 437第二次孵化**，支持作用域值，任务作用域中创建的线程可继承作用域值
- **Java 21：JEP 453预览**，`fork()`方法返回`Subtask`而非`Future`，提供更精细的任务状态查询
- **Java 22：JEP 462第二次预览**，无 API 变更
- **Java 23：JEP 480第三次预览**，无 API 变更
- **Java 24：JEP 499第四次预览**，无 API 变更
- **Java 25：JEP 505第五次预览**，使用静态工厂方法`StructuredTaskScope::open()`创建作用域

[结构化并发](./structured-concurrency-guide.md)

### 作用域值

JEP 429 (Java 20) → JEP 446 (Java 21) → JEP 464 (Java 22) → JEP 481 (Java 23) → JEP 487 (Java 24) → JEP 506 (Java 25)

变更说明：作用域值从Java 20开始孵化，经过Java 21-24的四次预览，最终在Java 25中成为正式特性。它提供了ThreadLocal的现代替代方案，支持不可变数据在方法调用链和虚拟线程间安全传递，避免了ThreadLocal可能导致的内存泄漏问题。

关键演进：
- **Java 20：JEP 429孵化**
- **Java 21：JEP 446预览**，无 API 变更
- **Java 22：JEP 464第二次预览**，无 API 变更
- **Java 23：JEP 481第三次预览**，`ScopedValue.callWhere` 方法的操作参数类型现在改为一个新的函数式接口，这使得 Java 编译器能够推断是否可能抛出受检异常。基于这一改动，`ScopedValue.getWhere` 方法不再需要，现已被移除
- **Java 24：JEP 487第四次预览**，移除了 `ScopedValue` 类中的 `callWhere` 和 `runWhere` 方法，使 API 保持完全流畅的链式调用特性。现在使用一个或多个绑定作用域值的唯一方式是通过 `ScopedValue.Carrier.call` 和 `ScopedValue.Carrier.run` 方法
- **Java 25：JEP 506正式特性**，完全稳定，仅包含一项细微调整：`ScopedValue.orElse` 方法不再接受`null`作为其参数

### 稳定值API（Stable Value API）

Java 25

变更说明：Java 25引入了StableValue API作为延迟初始化的线程安全解决方案。它自动处理线程安全问题，避免了传统双重检查锁定模式的复杂性和潜在问题。

---

## 性能与工具链优化

### 外部函数与内存API（Foreign Function & Memory API）

JEP 454 (Java 22)

变更说明：外部函数与内存API在Java 22中正式成为标准特性。这一API允许Java程序与本地代码和内存进行交互，提供了比JNI更安全、更高效的方式，同时保持了与现有本地库的兼容性。

关键演进：
- **Java 18：JEP 419孵化**，首次引入
- **Java 19：JEP 424第二次孵化**，API改进
- **Java 20：JEP 434第三次孵化**，功能扩展
- **Java 21：JEP 442第四次孵化**，性能优化
- **Java 22：JEP 454正式特性**，完全稳定

### 向量API（Vector API）

JEP 460 (Java 22) → Java 25

变更说明：向量API从Java 22的第七轮孵化阶段发展到Java 25的正式版。这一API提供了在Java中编写高性能向量计算的能力，利用CPU的SIMD（单指令多数据）指令加速数值计算。

关键演进：
- **Java 16：JEP 338孵化**，首次引入
- **Java 17：JEP 414第二次孵化**，扩展功能
- **Java 18：JEP 417第三次孵化**，API精炼
- **Java 19：JEP 426第四次孵化**，性能优化
- **Java 20：JEP 438第五次孵化**，跨平台改进
- **Java 21：JEP 448第六次孵化**，接近稳定
- **Java 22：JEP 460第七次孵化**，最终优化
- **Java 25：正式特性**，完全稳定

### 流收集器（Stream Gatherers）

JEP 461 (Java 22) → Java 25

变更说明：流收集器从Java 22的预览阶段发展到Java 25的正式版。它提供了一种扩展Java Stream API的新机制，允许开发者自定义流转换操作，填补了现有Stream操作之间的空白。

---

## 开发者体验提升

### 启动多文件源代码程序

JEP 458 (Java 22)

变更说明：Java 22引入了启动多文件源代码程序的功能，允许开发者直接运行分布在多个源文件中的Java程序，而无需先编译它们。这大大简化了小型程序的开发和测试流程。

### 隐式声明的类和实例main方法

JEP 463 (Java 22) → JEP 477 (Java 23) → Java 25

变更说明：这一特性从Java 21的预览经过Java 22的第二次预览和Java 23的第三次预览，最终在Java 25中成为正式特性。它简化了Java入门门槛，允许初学者编写更简洁的程序，无需了解为大型程序设计的复杂语言特性。

### JVM性能持续优化

持续改进 (Java 22-25)

变更说明：Java 22到Java 25期间，JVM性能得到了持续优化，包括启动时间缩短、内存占用减少、垃圾收集器效率提升，以及对现代硬件特性的更好利用。

## 平台与生态系统

### LTS版本策略调整

政策变更 (Java 25)

变更说明：Oracle将LTS（长期支持）版本的发布间隔从3年缩短至2年，Java 25作为新策略下的首个LTS版本，提供8年超长支持周期，增强了企业用户的规划能力和投资保护。

### 语言演进流程优化

持续改进 (Java 22-25)

变更说明：Java语言演进流程在这一时期得到了优化，预览特性和孵化特性的生命周期更加清晰，反馈机制更加高效，确保新特性能够更好地满足开发者需求。

### 教育友好性提升

持续改进 (Java 22-25)

变更说明：Java 22到Java 25期间，语言对初学者的友好性得到了显著提升，通过隐式声明的类、简化的main方法等特性，降低了Java的入门门槛，使编程教育更加高效。

---

## 版本特性对照表

| 特性类别 | Java 22 | Java 23 | Java 25 |
|----------|---------|---------|---------|
| 核心语言 | super前语句(预览1) | 原始类型模式匹配(预览) | 构造函数灵活性(正式) |
| 核心语言 | 字符串模板(预览2) | 模块导入声明(预览) | 原始类型模式匹配(正式) |
| 并发编程 | 结构化并发(预览2) | - | 结构化并发(正式) |
| 并发编程 | 作用域值(预览2) | - | 作用域值(正式) |
| 并发编程 | - | - | 稳定值API(正式) |
| 性能优化 | 外部函数与内存API(正式) | - | 向量API(正式) |
| 性能优化 | 向量API(孵化7) | - | 流收集器(正式) |
| 开发者体验 | 启动多文件源代码程序 | 隐式声明的类(预览3) | 隐式声明的类(正式) |
| 平台战略 | - | - | LTS版本(8年支持) |

## 迁移建议

### 立即采用（正式特性）
- 流收集器：Java 24正式特性，适合数据处理密集型应用
- 外部函数与内存API：Java 22正式特性，适合需要与本地代码交互的场景
- 启动多文件源代码程序：Java 22正式特性，开发效率提升，可立即使用
- 灵活的构造函数体：Java 25正式特性，可立即使用

### 谨慎评估（预览/孵化特性）
- 原始类型模式匹配：Java 25第三次预览，可逐步应用
- 稳定值API：Java 25预览特性
- 向量API：Java 25第十次孵化


## 总结

Java 22到Java 25的演进代表了Java语言在现代编程时代的深刻变革。这一时期的核心主题是：语言表达力提升、并发编程模型现代化、性能边界突破以及开发者体验的全面优化。

关键收获：
- 语言特性：构造函数灵活性和模式匹配扩展显著提升了代码简洁性和可读性
- 并发编程：结构化并发和作用域值重新定义了Java并发编程范式
- 性能优化：外部函数与内存API和向量API为计算密集型应用提供了新的性能维度
- 生态系统：LTS策略调整和教育友好性提升增强了Java平台的长期竞争力

Java 25作为新策略下的首个LTS版本，凝聚了Java 22-25期间的所有重要创新，标志着Java在云原生时代的强势回归，为企业级应用开发提供了更现代、更高效、更可靠的平台选择。