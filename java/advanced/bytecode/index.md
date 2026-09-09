# Java 字节码

[[toc]]

理解 JVM 字节码是深入掌握 Java 运行时的关键。本章节从基础指令入门到实战案例分析，帮你建立字节码层面的问题排查能力。

## 文章列表

- [JVM 字节码指令入门：从方法调用说起](jvm-bytecode-instructions.md) —— 教程式入门，系统讲解五条方法调用指令（`invokestatic`, `invokespecial`, `invokevirtual`, `invokeinterface`, `invokedynamic`）的区别与应用场景，附带类文件结构简述和常用工具。
- [ASM 字节码框架入门](asm-introduction.md) —— 教程式入门，讲解 ASM 的核心架构（事件驱动 + Visitor 模式）、核心 API（`ClassReader`/`ClassVisitor`/`ClassWriter`/`MethodVisitor`）以及三种典型场景（只读/修改/生成），附带方法体字节码修改实例和框架应用分析。
- [一个诡异的线上故障：代码没问题，功能却"消失"了](asm-bytecode-compatibility.md) —— 实战案例，由 ASM 字节码版本不兼容引发的线上故障，深入讲解 JDK 8 接口 default/static 方法的字节码原理，以及为何 Lambda 能绕过 ASM4 的限制。