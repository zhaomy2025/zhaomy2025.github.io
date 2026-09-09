# ASM 字节码框架入门

[[toc]]

## 什么是 ASM？

ASM 是一个轻量级的 Java 字节码操作框架。它能够直接以二进制形式读取、修改和生成 `.class` 文件，而无需依赖 `javac` 编译器。

它的核心定位是**底层、快速、精简**：

| 维度 | 说明 |
|------|------|
| 定位 | 字节码级别的操作库，不依赖源码 |
| 性能 | 极快，采用事件驱动模型，解析时只做一次遍历 |
| 体积 | 核心 jar 仅约 100KB |
| 学习曲线 | 陡峭——需要理解字节码指令、类文件结构 |

同类工具对比：

| 工具 | 抽象层级 | 特点 |
|------|---------|------|
| **ASM** | 字节码指令级 | 最底层，性能最好，但需要直接操作指令 |
| **ByteBuddy** | 类型/方法级 | 在 ASM 之上提供了高层 API，更易用 |
| **Javassist** | 源码级 | 可以用类 Java 代码操作字节码，最易上手但性能较低 |
| **CGLIB** | 方法拦截级 | 专注代理生成，底层依赖 ASM |

> 很多开发者不会直接写 ASM 代码，但他们使用的框架——Spring、MyBatis、Hibernate、Mockito、Lombok——底层几乎都依赖 ASM。

## 核心架构：事件驱动 + Visitor 模式

ASM 的设计基于两个核心思想：

### 1. 事件驱动

ASM 把 `.class` 文件看作一个**事件流**。解析一个类时，ASM 按顺序触发一系列事件：

```
visit()                        // 开始解析类
  visitSource()                // 类来源信息
  visitAnnotation()            // 类上的注解
  visitField()                 // 字段 1
    visitAnnotation()          // 字段 1 上的注解
  visitField()                 // 字段 2
  visitMethod()                // 方法 1
    visitAnnotation()          // 方法 1 上的注解
    visitCode()                // 方法 1 的字节码开始
      visitFrame()             // 栈帧
      visitInsn()              // 指令：aload_0
      visitMethodInsn()        // 指令：invokevirtual
      visitInsn()              // 指令：return
    visitEnd()                 // 方法 1 的字节码结束
  visitMethod()                // 方法 2
  ...
visitEnd()                     // 类解析完毕
```

每个方法调用就是一个"事件"，事件的顺序严格按照 JVM 类文件结构的定义来排列。

### 2. Visitor 模式

你不需要解析整个类文件，只需要**实现一个访问者**，在感兴趣的事件上写处理逻辑即可。ASM 提供了 `ClassVisitor` 和 `MethodVisitor` 两个核心抽象类，你只需要继承它们并重写相应的方法。

```
ClassReader（读取器）──解析类文件──→ ClassVisitor（你写的逻辑）──→ ClassWriter（输出字节码）
```

这个链条中：
- `ClassReader` 负责解析字节码，生成事件流
- `ClassVisitor`（你实现的）负责在事件上做处理——可以修改、过滤、增强
- `ClassWriter` 负责把处理后的结果重新编码为字节码

当你只需要**读取**类信息时，不需要 `ClassWriter`；只需要**修改**时，三者串联；只需要**生成**新类时，直接从 `ClassVisitor` 开始，不需要 `ClassReader`。

## 核心 API 详解

### ClassReader —— 读取字节码

`ClassReader` 负责解析一个 `.class` 文件的内容，将其转换为事件流。它可以从多种来源构造：

```java
// 从字节数组
byte[] classBytes = Files.readAllBytes(Path.of("MyClass.class"));
ClassReader reader = new ClassReader(classBytes);

// 从类名（从 classpath 加载）
ClassReader reader = new ClassReader("com.example.MyClass");

// 从输入流
ClassReader reader = new ClassReader(inputStream);
```

`ClassReader` 的 `accept()` 方法接收一个 `ClassVisitor`，然后按顺序触发访问事件：

```java
reader.accept(myVisitor, 0);
```

第二个参数是解析选项，常用值：

| 选项 | 含义 |
|------|------|
| `0` | 默认行为 |
| `ClassReader.SKIP_DEBUG` | 跳过调试信息（行号表、局部变量表等），减小体积 |
| `ClassReader.SKIP_CODE` | 跳过方法体中的字节码，只读类结构 |
| `ClassReader.EXPAND_FRAMES` | 展开栈帧映射，默认展开 |

### ClassVisitor —— 访问类结构

`ClassVisitor` 是一个抽象类，定义了访问类结构各个部分的方法。你需要继承它并重写需要处理的方法。

```java
public abstract class ClassVisitor {
    // 构造时传入下一个访问者，形成链式调用
    public ClassVisitor(int api, ClassVisitor cv) { ... }

    public void visit(int version, int access, String name,
                      String signature, String superName, String[] interfaces) { ... }
    public void visitSource(String source, String debug) { ... }
    public AnnotationVisitor visitAnnotation(String desc, boolean visible) { ... }
    public FieldVisitor visitField(int access, String name, String desc,
                                   String signature, Object value) { ... }
    public MethodVisitor visitMethod(int access, String name, String desc,
                                     String signature, String[] exceptions) { ... }
    public void visitEnd() { ... }
}
```

关键方法说明：

| 方法 | 触发时机 | 返回值 |
|------|---------|--------|
| `visit()` | 类头信息（版本、访问标志、类名、父类、接口） | `void` |
| `visitField()` | 每个字段 | `FieldVisitor`——继续访问该字段的注解等 |
| `visitMethod()` | 每个方法 | `MethodVisitor`——继续访问该方法体的字节码 |
| `visitEnd()` | 类解析结束 | `void` |

**核心原则**：当你重写 `visitMethod()` 时，必须返回一个 `MethodVisitor`（可以是父类的，也可以是你自己包装过的），否则该方法的方法体字节码就不会被访问。

### ClassWriter —— 生成字节码

`ClassWriter` 是 `ClassVisitor` 的子类，它把接收到的事件重新编码为字节码：

```java
ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);
// ... 让 ClassReader 通过 ClassVisitor 链向 cw 写入事件 ...
byte[] modified = cw.toByteArray();
```

构造参数控制 `ClassWriter` 的自动计算行为：

| 参数 | 含义 |
|------|------|
| `0` | 不自动计算任何东西，你需要手动计算栈帧、局部变量和栈大小 |
| `ClassWriter.COMPUTE_MAXS` | 自动计算局部变量表最大槽数和操作数栈最大深度 |
| `ClassWriter.COMPUTE_FRAMES` | 自动计算栈帧映射（包含 `COMPUTE_MAXS` 的功能） |

> **推荐**：大多数场景下使用 `COMPUTE_FRAMES`，让 ASM 自动处理栈帧。但有两个前提：(1) `COMPUTE_FRAMES` 实际生效要求 ASM API 版本 ≥ 5（即 `Opcodes.ASM5` 或以上），因为 JDK 8 引入了新的栈帧类型；(2) `ClassWriter` 的部分构造函数默认用 `ASM4`——**即使你传了 `COMPUTE_FRAMES`，如果构造时不显式传版本常量，默认还是 ASM4，`COMPUTE_FRAMES` 的行为可能不符合预期**。
>
> 安全写法：
> ```java
> // 明确传入 ASM9（或与你项目 JDK 版本匹配的版本常量）
> ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);
> // ClassWriter 无参构造默认 ASM4，建议显式传入版本常量：
> // ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES, Opcodes.ASM9);
> ```
> ASM 库 9.x 版本的实际行为取决于具体构造器重载，保险起见始终显式传入版本常量。

### MethodVisitor —— 访问方法体

`MethodVisitor` 是真正操作字节码指令的地方。它定义了访问每一条指令的方法：

```java
public abstract class MethodVisitor {
    public void visitCode() { ... }                          // 方法体开始
    public void visitInsn(int opcode) { ... }               // 零操作数指令（如 return, aload_0）
    public void visitIntInsn(int opcode, int operand) { ... }  // 单操作数指令
    public void visitVarInsn(int opcode, int varIndex) { ... } // 局部变量指令
    public void visitFieldInsn(int opcode, String owner,
                               String name, String desc) { ... }  // 字段访问指令
    public void visitMethodInsn(int opcode, String owner,
                                String name, String desc,
                                boolean isInterface) { ... }  // 方法调用指令
    public void visitLdcInsn(Object cst) { ... }             // 加载常量指令
    public void visitJumpInsn(int opcode, Label label) { ... }  // 跳转指令
    public void visitLabel(Label label) { ... }              // 标号
    public void visitFrame(int type, int nLocal, Object[] local,
                           int nStack, Object[] stack) { ... }  // 栈帧
    public void visitMaxs(int maxStack, int maxLocals) { ... }   // 方法体结束
    public void visitEnd() { ... }                           // 方法访问结束
}
```

每一条 JVM 字节码指令都有对应的 `visitXxx()` 方法。例如：
- `aload_0` → `visitVarInsn(ALOAD, 0)`
- `invokevirtual #5` → `visitMethodInsn(INVOKEVIRTUAL, "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false)`
- `return` → `visitInsn(RETURN)`

ASM 的操作码常量定义在 `Opcodes` 接口中，所有 Visitor 都实现了这个接口，所以可以直接使用 `ALOAD`、`INVOKEVIRTUAL`、`RETURN` 等常量。

> **`isInterface` 参数**：`visitMethodInsn` 的最后一个参数表示方法所属的 `owner` 是类（`false`）还是接口（`true`），例如 `INVOKEVIRTUAL` 调用 `PrintStream.println()` 时填 `false`（具体类），而 `INVOKEINTERFACE` 调用 `Runnable.run()` 时填 `true`。填错会导致 `VerifyError` 或 `ClassFormatError`。

## 三种典型场景

下面通过三个完整的例子，展示 ASM 在不同场景下的用法。

### 场景一：只读——提取类信息

需求：获取一个类的所有方法名和参数列表。

```java
import org.objectweb.asm.*;

public class MethodInfoPrinter extends ClassVisitor {

    public MethodInfoPrinter() {
        super(Opcodes.ASM9);
    }

    @Override
    public MethodVisitor visitMethod(int access, String name,
                                     String desc, String signature,
                                     String[] exceptions) {
        System.out.println("方法: " + accessDesc(access) + " " + name + desc);
        return null;  // 返回 null 表示不继续访问该方法体（不需要读字节码）
    }

    private String accessDesc(int access) {
        if ((access & Opcodes.ACC_PUBLIC) != 0) return "public";
        if ((access & Opcodes.ACC_PRIVATE) != 0) return "private";
        if ((access & Opcodes.ACC_PROTECTED) != 0) return "protected";
        return "package-private";
    }

    public static void main(String[] args) throws Exception {
        ClassReader reader = new ClassReader("java.util.ArrayList");
        MethodInfoPrinter printer = new MethodInfoPrinter();
        reader.accept(printer, ClassReader.SKIP_CODE);
    }
}
```

输出示例：

```
方法: public <init>()V
方法: public <init>(I)V
方法: public <init>(Ljava/util/Collection;)V
方法: public add(Ljava/lang/Object;)Z
方法: public get(I)Ljava/lang/Object;
...
```

关键点：
- `return null` 表示跳过该方法体的字节码，因为我们只关心方法签名
- `ClassReader.SKIP_CODE` 让解析器跳过字节码，进一步加快速度
- 不需要 `ClassWriter`，因为不修改任何东西

### 场景二：修改——给类添加方法

需求：给一个已有类添加一个 `getVersion()` 方法，返回字符串 `"1.0"`。

```java
public class AddMethodAdapter extends ClassVisitor {

    private String className;

    public AddMethodAdapter(ClassVisitor cv) {
        super(Opcodes.ASM9, cv);
    }

    @Override
    public void visit(int version, int access, String name,
                      String signature, String superName, String[] interfaces) {
        this.className = name;
        super.visit(version, access, name, signature, superName, interfaces);
    }

    @Override
    public void visitEnd() {
        // 在类的末尾添加新方法
        MethodVisitor mv = cv.visitMethod(
            Opcodes.ACC_PUBLIC,          // 访问标志
            "getVersion",                // 方法名
            "()Ljava/lang/String;",      // 描述符：无参，返回 String
            null,                        // 泛型签名
            null                         // 异常列表
        );
        mv.visitCode();
        mv.visitLdcInsn("1.0");                       // 将 "1.0" 压入栈
        mv.visitInsn(Opcodes.ARETURN);                // 返回栈顶的 String
        mv.visitMaxs(1, 1);                           // 最大栈深度=1，局部变量槽数=1
        mv.visitEnd();

        super.visitEnd();  // 必须调用，让链上的后续 Visitor 也收到 visitEnd 事件
    }
}
```

使用方式：

```java
byte[] classBytes = Files.readAllBytes(Path.of("MyClass.class"));
ClassReader reader = new ClassReader(classBytes);
ClassWriter writer = new ClassWriter(ClassWriter.COMPUTE_FRAMES);
AddMethodAdapter adapter = new AddMethodAdapter(writer);

reader.accept(adapter, 0);
byte[] modified = writer.toByteArray();

// 写入文件或直接加载
Files.write(Path.of("MyClass.class"), modified);
```

关键点：
- 在 `visitEnd()` 中添加新方法，确保方法加在类的末尾，不会干扰已有方法
- 链式调用：`reader → adapter → writer`，每一层只处理自己关心的部分，其余透传给下一层
- 方法描述符 `()Ljava/lang/String;` 遵循 JVM 规范：括号内是参数类型，括号后是返回类型

### 场景三：生成——从零创建类

需求：动态生成一个接口的实现类。

```java
public class InterfaceImplGenerator {

    public static byte[] generateImpl(String interfaceName, String implName) {
        ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);
        cw.visit(
            Opcodes.V1_8,                   // JDK 版本
            Opcodes.ACC_PUBLIC,             // 访问标志
            implName,                       // 内部类名（用 / 分隔）
            null,                           // 泛型签名
            "java/lang/Object",             // 父类
            new String[]{interfaceName}     // 实现的接口
        );

        // 生成默认构造器
        MethodVisitor mv = cw.visitMethod(
            Opcodes.ACC_PUBLIC,
            "<init>",
            "()V",
            null, null
        );
        mv.visitCode();
        mv.visitVarInsn(Opcodes.ALOAD, 0);          // 加载 this
        mv.visitMethodInsn(Opcodes.INVOKESPECIAL,
            "java/lang/Object", "<init>", "()V", false);  // 调用 super()
        mv.visitInsn(Opcodes.RETURN);
        mv.visitMaxs(1, 1);
        mv.visitEnd();

        // 生成 sayHello() 方法
        mv = cw.visitMethod(
            Opcodes.ACC_PUBLIC,
            "sayHello",
            "()Ljava/lang/String;",
            null, null
        );
        mv.visitCode();
        mv.visitLdcInsn("Hello from generated class!");
        mv.visitInsn(Opcodes.ARETURN);
        mv.visitMaxs(1, 1);
        mv.visitEnd();

        cw.visitEnd();
        return cw.toByteArray();
    }
}
```

注意这里的代码风格和场景二不同：场景二是**包装模式**（`ClassVisitor` 包装另一个 `ClassVisitor`），场景三是**直接访问模式**（直接调用 `ClassWriter` 的 `visitXxx()` 方法）。包装模式适合"修改已有类"，直接模式适合"从零生成类"。

## 深入：修改方法体中的字节码

前面场景二的例子是在类级别添加方法，但如果要修改**已有方法内部的字节码指令**，就需要在 `MethodVisitor` 层面做文章。

### 经典例子：在方法入口和出口插入日志

```java
public class MethodLogAdapter extends ClassVisitor {

    private String className;

    public MethodLogAdapter(ClassVisitor cv) {
        super(Opcodes.ASM9, cv);
    }

    @Override
    public void visit(int version, int access, String name,
                      String signature, String superName, String[] interfaces) {
        this.className = name;
        super.visit(version, access, name, signature, superName, interfaces);
    }

    @Override
    public MethodVisitor visitMethod(int access, String name,
                                     String desc, String signature,
                                     String[] exceptions) {
        MethodVisitor mv = super.visitMethod(access, name, desc, signature, exceptions);
        // 跳过构造器和静态初始化块
        if (name.equals("<init>") || name.equals("<clinit>")) {
            return mv;
        }
        // 包装一个自定义的 MethodVisitor
        return new LogMethodVisitor(mv, className, name);
    }

    /**
     * 自定义 MethodVisitor：在方法入口和每个 return 前插入日志
     */
    static class LogMethodVisitor extends MethodVisitor {

        private final String className;
        private final String methodName;

        public LogMethodVisitor(MethodVisitor mv, String className, String methodName) {
            super(Opcodes.ASM9, mv);
            this.className = className;
            this.methodName = methodName;
        }

        @Override
        public void visitCode() {
            // 在方法入口插入日志
            // System.out.println("Enter: " + className + "." + methodName);
            mv.visitFieldInsn(Opcodes.GETSTATIC,
                "java/lang/System", "out", "Ljava/io/PrintStream;");
            mv.visitLdcInsn("Enter: " + className + "." + methodName);
            mv.visitMethodInsn(Opcodes.INVOKEVIRTUAL,
                "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false);
            super.visitCode();
        }

        @Override
        public void visitInsn(int opcode) {
            // 在每个 return 指令前插入日志
            if (opcode >= Opcodes.IRETURN && opcode <= Opcodes.RETURN) {
                mv.visitFieldInsn(Opcodes.GETSTATIC,
                    "java/lang/System", "out", "Ljava/io/PrintStream;");
                mv.visitLdcInsn("Exit: " + className + "." + methodName);
                mv.visitMethodInsn(Opcodes.INVOKEVIRTUAL,
                    "java/io/PrintStream", "println", "(Ljava/lang/String;)V", false);
            }
            super.visitInsn(opcode);
        }
    }
}
```

这个例子展示了 ASM 的核心用法模式：
1. 在 `visitMethod()` 中返回一个包装过的 `MethodVisitor`
2. 在感兴趣的方法（`visitCode()`、`visitInsn()` 等）中插入额外的字节码指令
3. 其余方法透传给父类处理

### 注意事项

1. **栈帧问题**：插入指令后，栈帧映射会失效。使用 `ClassWriter.COMPUTE_FRAMES` 让 ASM 自动重新计算是最简单的方案。

2. **构造器的特殊处理**：构造器的第一条指令必须是 `super()` 调用（`invokespecial` 调用父类 `<init>`）。如果要在构造器中插入代码，必须放在 `super()` 调用之后。通常的做法是跳过构造器，或者用更复杂的方式定位 `super()` 调用之后的位置。

3. **局部变量索引**：插入新代码时如果需要使用局部变量，必须了解当前方法已有的局部变量分布，避免索引冲突。

## ASM 版本常量与兼容性

ASM 提供了一个 `Opcodes` 接口，其中定义了版本常量：

| 常量 | 数值 | 支持的 JDK 字节码 |
|------|------|------------------|
| `ASM4` | 4 << 16 | JDK 6 / 7 |
| `ASM5` | 5 << 16 | JDK 8 |
| `ASM6` | 6 << 16 | JDK 9 |
| `ASM7` | 7 << 16 | JDK 11 |
| `ASM8` | 8 << 16 | JDK 14 |
| `ASM9` | 9 << 16 | JDK 17+ |

这个版本常量在构造 `ClassVisitor`、`ClassWriter` 时需要传入：

```java
// 如果项目用的是 JDK 8，应该用 ASM5 及以上
ClassWriter cw = new ClassWriter(ClassWriter.COMPUTE_FRAMES);
// 等价于 new ClassWriter(Opcodes.ASM4) —— 但 ASM4 不认识接口 default 方法！
```

**常见踩坑点**：很多框架在底层硬编码了 `ASM4`，而项目已经升级到 JDK 8+。当代码中调用了接口的 default 方法（如 `Comparator.reversed()`）时，编译器会生成 `invokespecial` 指向接口的字节码。ASM4 遇到这种指令会抛出 `IllegalArgumentException`，表现为"功能静默丢失"。

> 注意：接口 static 方法（如 `Comparator.comparing()`）使用 `invokestatic` 指令，ASM4 对这种指令**不会报错**。因为 `invokestatic` 只检查目标方法是否是静态的，不关心 owner 是类还是接口。真正触发 ASM4 报错的是 `invokespecial` 指向接口 default 方法这一情况。

关于这个问题的详细排查过程和解决方案，参见 [这个线上故障案例](asm-bytecode-compatibility.md)。

## 框架中的 ASM 应用

了解 ASM 之后，你会发现很多框架的底层实现原理变得清晰了：

| 框架 | ASM 的用途 |
|------|-----------|
| **Spring** | AOP 代理、`@Configuration` 类增强、`@Transactional` 代理 |
| **MyBatis** | 读取接口方法参数名（用于 `#{param}` 映射） |
| **Hibernate** | 实体类字节码增强（懒加载代理） |
| **Lombok** | 注解处理器中生成 `getter`/`setter`/`builder` 等方法 |
| **Mockito** | 动态生成 mock 对象的实现类 |
| **Jackson** | 序列化/反序列化器的高性能实现 |
| **Kotlin 编译器** | 生成兼容 JVM 的字节码 |

以 MyBatis 为例，当你写 `@Param("userId") Long userId` 时，MyBatis 在运行时需要用 ASM 读取接口的字节码，从中提取参数名。如果 MyBatis 依赖的 ASM 版本过低，就无法正确读取 JDK 8+ 编译的类的参数名——这就是经典的 **"MyBatis 参数名绑定时好时坏"** 问题的根因之一。

## 总结

- **ASM 是字节码级操作框架**，速度极快但学习曲线陡峭。大多数开发者不直接使用它，而是通过 Spring、MyBatis 等框架间接依赖它。
- **核心模型是事件驱动 + Visitor 链**：`ClassReader` 解析类文件产生事件 → `ClassVisitor` 链处理事件 → `ClassWriter` 编码回字节码。
- **三种典型场景**：只读（只有 reader + visitor）、修改（reader + visitor + writer 串联）、生成（直接 writer）。
- **修改方法体**需要在 `MethodVisitor` 层面包装，在指令前后插入新指令，注意栈帧和构造器的特殊约束。
- **版本常量**很重要：JDK 版本升级后，ASM 版本常量也需要同步升级，否则遇到新语言特性（如接口 default 方法）会直接报错。

ASM 的底层性决定了它不太适合"直接手写"来开发业务功能，但理解它的工作原理，能让你在排查框架底层问题、理解字节码增强机制时多一个有力的分析工具。