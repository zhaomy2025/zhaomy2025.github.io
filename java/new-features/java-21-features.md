# Java 21 新特性

[[toc]]

## 概述
Java 21 于 2023 年 9 月发布，是一个长期支持 (LTS) 版本，包含了多个重要的新特性和改进。

## 主要新特性

### JEP 430: 字符串模板（预览）

::: info JEP 430: String Templates (Preview)
Enhance the Java programming language with string templates. String templates complement Java's existing string literals and text blocks by coupling literal text with embedded expressions and template processors to produce specialized results. This is a preview language feature and API.
:::

<!-- @include:./string-templates-intro.md -->

### JEP 431: 序列化集合

::: info
**JEP 431: Sequenced Collections**
Introduce new interfaces to represent collections with a defined encounter order. Each such collection has a well-defined first element, second element, and so forth, up to the last element. It also provides uniform APIs for accessing its first and last elements, and for processing its elements in reverse order.

"Life can only be understood backwards; but it must be lived forwards."
— Kierkegaard
:::

序列化集合为有序集合提供了统一的接口。无论是什么类型的集合（List、Set、Map），现在都有统一的方法来获取第一个、最后一个元素，以及反向遍历。

```java
import java.util.*;

// List 示例
List<String> list = List.of("苹果", "香蕉", "橙子");
System.out.println("第一个水果：" + list.getFirst());  // 苹果
System.out.println("最后一个水果：" + list.getLast());  // 橙子

// Set 示例 - LinkedHashSet保持插入顺序
SequencedSet<String> set = new LinkedHashSet<>();
set.add("Java");
set.add("Python");
set.add("JavaScript");
System.out.println("第一个编程语言：" + set.getFirst());  // Java

// Map 示例
SequencedMap<Integer, String> map = new LinkedHashMap<>();
map.put(1, "星期一");
map.put(2, "星期二");
map.put(3, "星期三");
System.out.println("第一天：" + map.firstEntry().getValue());  // 星期一
```

### JEP 439: 分代 ZGC

::: info
**JEP 439: Generational ZGC**
Improve application performance by extending the Z Garbage Collector (ZGC) to maintain separate generations for young and old objects. This will allow ZGC to collect young objects — which tend to die young — more frequently.
:::

通过扩展Z垃圾收集器（ZGC）以维护年轻对象和年老对象的独立分代，从而提高应用程序性能。这将使ZGC能够更频繁地收集年轻对象——这些对象往往"朝生暮死"。

### JEP 440: Record 模式

::: info
**JEP 440: Record Patterns**
Enhance the Java programming language with record patterns to deconstruct record values. Record patterns and type patterns can be nested to enable a powerful, declarative, and composable form of data navigation and processing.
:::

Record模式让你可以像拆积木一样拆解record对象，直接提取里面的字段值，不用再写getter方法。

```java
// 定义record
record Point(int x, int y) {}
record Color(int r, int g, int b) {}
record ColoredPoint(Point point, Color color) {}

// 使用record模式匹配
public static String describePoint(Object obj) {
    return switch (obj) {
        case ColoredPoint(Point(var x, var y), Color(var r, var g, var b)) ->
            String.format("彩色点：坐标(%d,%d)，颜色RGB(%d,%d,%d)", x, y, r, g, b);
        case Point(var x, var y) ->
            String.format("普通点：坐标(%d,%d)", x, y);
        default -> "未知类型";
    };
}

// 使用示例
ColoredPoint coloredPoint = new ColoredPoint(
    new Point(10, 20),
    new Color(255, 0, 0)
);
System.out.println(describePoint(coloredPoint));  // 输出：彩色点：坐标(10,20)，颜色RGB(255,0,0)
```

### JEP 441: switch 模式匹配

::: info
**JEP 441: Pattern Matching for switch**
Enhance the Java programming language with pattern matching for switch expressions and statements. Extending pattern matching to switch allows an expression to be tested against a number of patterns, each with a specific action, so that complex data-oriented queries can be expressed concisely and safely.
:::

switch语句不仅能判断基本类型，还能直接识别对象的类型并提取字段值。

```java
// 定义几何形状
sealed interface Shape permits Circle, Rectangle, Triangle {}
record Circle(double radius) implements Shape {}
record Rectangle(double width, double height) implements Shape {}
record Triangle(double base, double height) implements Shape {}

// 使用switch模式匹配计算面积
public static double calculateArea(Shape shape) {
    return switch (shape) {
        case Circle(var r) -> Math.PI * r * r;
        case Rectangle(var w, var h) -> w * h;
        case Triangle(var b, var h) -> 0.5 * b * h;
        default -> 0.0;
    };
}

// 使用示例
Shape circle = new Circle(5.0);
Shape rectangle = new Rectangle(4.0, 3.0);
System.out.println("圆面积：" + calculateArea(circle));      // 78.53981633974483
System.out.println("矩形面积：" + calculateArea(rectangle));  // 12.0
```

### JEP 442: 外部函数和内存 API（第三次预览）

::: info
**JEP 442: Foreign Function & Memory API (Third Preview)**
Introduce an API by which Java programs can interoperate with code and data outside of the Java runtime. By efficiently invoking foreign functions (i.e., code outside the JVM), and by safely accessing foreign memory (i.e., memory not managed by the JVM), the API enables Java programs to call native libraries and process native data without the brittleness and danger of JNI. This is a preview API.
:::

这个API让Java程序可以直接调用C/C++的函数，就像调用普通Java方法一样简单，不再需要复杂的JNI代码。

```java
import java.lang.foreign.*;
import java.lang.invoke.MethodHandle;

// 调用C标准库的strlen函数
public static void main(String[] args) throws Throwable {
    // 获取C标准库
    SymbolLookup lookup = SymbolLookup.loaderLookup();
    
    // 查找strlen函数
    MemorySegment strlen = lookup.find("strlen").orElseThrow();
    
    // 定义函数签名：接收C字符串，返回long
    FunctionDescriptor descriptor = FunctionDescriptor.of(
        ValueLayout.JAVA_LONG, ValueLayout.ADDRESS
    );
    
    MethodHandle handle = Linker.nativeLinker()
        .downcallHandle(strlen, descriptor);
    
    // 创建C字符串
    try (Arena arena = Arena.ofConfined()) {
        MemorySegment str = arena.allocateUtf8String("Hello, Java 21!");
        
        // 调用strlen函数
        long length = (long) handle.invoke(str);
        System.out.println("字符串长度：" + length);  // 输出：15
    }
}
```

### JEP 443: 未命名模式和变量（预览）

::: info
**JEP 443: Unnamed Patterns and Variables (Preview)**
Enhance the Java language with unnamed patterns, which match a record component without stating the component's name or type, and unnamed variables, which can be initialized but not used. Both are denoted by an underscore character, _. This is a preview language feature.
:::

当你不需要使用某个变量时，可以用下划线`_`代替，让代码更简洁。就像说"这个我不关心"。

```java
// 使用未命名变量忽略不需要的值
public static void main(String[] args) {
    // 忽略异常中的异常对象
    try {
        int result = 10 / 0;
    } catch (ArithmeticException _) {
        System.out.println("除零错误发生了，但我不关心具体异常");
    }
    
    // 忽略Map.Entry中的key
    Map<String, Integer> scores = Map.of("张三", 90, "李四", 85);
    for (var _ : scores.entrySet()) {  // 忽略entry，只关心次数
        System.out.println("处理一个学生成绩");
    }
    
    // 忽略record中的某些字段
    record Person(String name, int age, String address) {}
    Person person = new Person("小明", 25, "北京");
    
    if (person instanceof Person(var name, _, _)) {
        // 只关心名字，忽略年龄和地址
        System.out.println("姓名：" + name);
    }
}
```

### JEP 444: 虚拟线程

::: info
**JEP 444: Virtual Threads**
Introduce virtual threads to the Java Platform. Virtual threads are lightweight threads that dramatically reduce the effort of writing, maintaining, and observing high-throughput concurrent applications.
:::

虚拟线程就像是超级轻量的小线程，创建和销毁的成本极低。你可以同时运行成千上万个虚拟线程而不会压垮系统，非常适合处理大量并发任务。

```java
import java.util.concurrent.*;

public class VirtualThreadDemo {
    public static void main(String[] args) throws InterruptedException {
        // 传统线程池方式
        ExecutorService traditionalPool = Executors.newFixedThreadPool(100);
        
        // 虚拟线程方式
        ExecutorService virtualThreadExecutor = Executors.newVirtualThreadPerTaskExecutor();
        
        // 创建1000个任务
        for (int i = 0; i < 1000; i++) {
            final int taskId = i;
            virtualThreadExecutor.submit(() -> {
                System.out.println("任务 " + taskId + " 在虚拟线程中运行：" + Thread.currentThread());
                try {
                    Thread.sleep(1000);  // 模拟耗时操作
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            });
        }
        
        virtualThreadExecutor.shutdown();
        virtualThreadExecutor.awaitTermination(10, TimeUnit.SECONDS);
        
        // 直接创建虚拟线程
        Thread virtualThread = Thread.ofVirtual()
            .name("我的虚拟线程")
            .start(() -> {
                System.out.println("这是直接创建的虚拟线程：" + Thread.currentThread());
            });
        
        virtualThread.join();
    }
}
```

### JEP 445: 未命名类和实例主方法（预览)

::: info JEP 445: Unnamed Classes and Instance Main Methods (Preview)
Evolve the Java programming language so that students can write their first programs without needing to understand language features designed for large programs. Far from using a separate dialect of Java, students can write streamlined declarations for single-class programs and then seamlessly expand their programs to use more advanced features as their skills grow. This is a preview language feature.
:::

扩展 Java 编程语言，使初学者无需了解专为大型程序设计的语言功能，即可编写自己的第一个程序。初学者无需使用某种独立的语言变体，即可为单类程序编写简化的声明，然后随着技能的增长无缝扩展他们的程序以使用更高级的功能。

简单说就是初学者现在可以直接写main方法，不需要理解`public class`这些复杂概念，就像写脚本一样简单。

**代码示例**：
```java
// 传统写法
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}

// 使用JEP 445的简化写法
// 文件名：HelloWorld.java
void main() {
    System.out.println("Hello, Java 21!");
}

// 或者带参数的简化写法
void main(String[] args) {
    if (args.length > 0) {
        System.out.println("你好，" + args[0] + "！");
    } else {
        System.out.println("你好，世界！");
    }
}
```

### JEP 446: 作用域值（预览）

::: info
**JEP 446: Scoped Values (Preview)**
Introduce scoped values, values that may be safely and efficiently shared to methods without using method parameters. They are preferred to thread-local variables, especially when using large numbers of virtual threads. This is a preview API.

In effect, a scoped value is an implicit method parameter. It is "as if" every method in a sequence of calls has an additional, invisible, parameter. None of the methods declare this parameter and only the methods that have access to the scoped value object can access its value (the data). Scoped values make it possible to pass data securely from a caller to a faraway callee through a sequence of intermediate methods that do not declare a parameter for the data and have no access to the data.
:::

用于在线程内和跨线程共享不可变数据，旨在替代 `ThreadLocal`，特别是在虚拟线程场景下更高效、更安全。

```java
import java.util.concurrent.*;
import java.util.concurrent.StructuredTaskScope;

public class ScopedValueDemo {
    // 定义作用域值
    private static final ScopedValue<String> USER_ID = ScopedValue.newInstance();
    private static final ScopedValue<String> REQUEST_ID = ScopedValue.newInstance();
    
    public static void main(String[] args) throws Exception {
        System.out.println("=== 单线程作用域值传递 ===");
        // 基础用法：单线程内传递
        ScopedValue.where(USER_ID, "user123").run(() -> {
            processRequest();
        });
        
        System.out.println("\n=== 多作用域值传递 ===");
        // 多作用域值同时传递
        ScopedValue.where(USER_ID, "user456")
                  .where(REQUEST_ID, "req-789")
                  .run(() -> {
            handleComplexRequest();
        });
        
        System.out.println("\n=== 虚拟线程跨线程传递 ===");
        // 跨虚拟线程传递：作用域值会自动传播到子线程
        ScopedValue.where(USER_ID, "user789").run(() -> {
            try (var scope = new StructuredTaskScope.ShutdownOnFailure()) {
                // 任务1：用户信息查询（自动继承作用域值）
                Future<String> userTask = scope.fork(() -> {
                    return "查询用户：" + USER_ID.get() + " 的详细信息";
                });
                
                // 任务2：订单处理（同样能访问作用域值）
                Future<String> orderTask = scope.fork(() -> {
                    return "为用户：" + USER_ID.get() + " 处理订单";
                });
                
                scope.join();
                System.out.println(userTask.resultNow());
                System.out.println(orderTask.resultNow());
            }
        });
        
        System.out.println("\n=== 嵌套作用域值 ===");
        // 嵌套作用域：内层可以覆盖外层值
        ScopedValue.where(USER_ID, "outer-user").run(() -> {
            System.out.println("外层用户：" + USER_ID.get());
            
            ScopedValue.where(USER_ID, "inner-user").run(() -> {
                System.out.println("内层用户：" + USER_ID.get());
                processNestedRequest();
            });
            
            System.out.println("回到外层：" + USER_ID.get());
        });
    }
    
    public static void processRequest() {
        String currentUser = USER_ID.get();
        System.out.println("处理用户：" + currentUser);
        validateUser();
    }
    
    public static void validateUser() {
        String user = USER_ID.get();
        System.out.println("验证用户：" + user);
    }
    
    public static void handleComplexRequest() {
        String user = USER_ID.get();
        String request = REQUEST_ID.get();
        System.out.println("处理请求：" + request + " 的用户：" + user);
    }
    
    public static void processNestedRequest() {
        // 即使在深层调用栈中也能访问作用域值
        String user = USER_ID.get();
        System.out.println("嵌套处理用户：" + user);
    }
}

// 高级用法：自定义作用域值载体
class RequestContext {
    private static final ScopedValue<RequestContext> CURRENT = ScopedValue.newInstance();
    
    private final String userId;
    private final String sessionId;
    private final long timestamp;
    
    public RequestContext(String userId, String sessionId) {
        this.userId = userId;
        this.sessionId = sessionId;
        this.timestamp = System.currentTimeMillis();
    }
    
    public static void runWithContext(String userId, String sessionId, Runnable task) {
        RequestContext context = new RequestContext(userId, sessionId);
        ScopedValue.where(CURRENT, context).run(task);
    }
    
    public static RequestContext current() {
        return CURRENT.get();
    }
    
    public String getUserId() { return userId; }
    public String getSessionId() { return sessionId; }
    public long getTimestamp() { return timestamp; }
}

// 使用示例
class ContextDemo {
    public static void main(String[] args) throws Exception {
        RequestContext.runWithContext("alice", "session-123", () -> {
            // 在虚拟线程中使用上下文
            try (var scope = new StructuredTaskScope<>()) {
                var task1 = scope.fork(() -> {
                    RequestContext ctx = RequestContext.current();
                    return "用户：" + ctx.getUserId() + " 开始处理";
                });
                
                var task2 = scope.fork(() -> {
                    RequestContext ctx = RequestContext.current();
                    return "会话：" + ctx.getSessionId() + " 保持活跃";
                });
                
                scope.join();
                System.out.println(task1.resultNow());
                System.out.println(task2.resultNow());
            }
        });
    }
}
```

### JEP 448: 向量 API（第六次孵化）

::: info
**JEP 448: Vector API (Sixth Incubator)**
Introduce an API to express vector computations that reliably compile at runtime to optimal vector instructions on supported CPU architectures, thus achieving performance superior to equivalent scalar computations.
:::

向量API让你可以用Java写出媲美C++的高性能数值计算代码，自动利用CPU的向量指令加速运算。

```java
import jdk.incubator.vector.*;

public class VectorDemo {
    public static void main(String[] args) {
        float[] a = {1.0f, 2.0f, 3.0f, 4.0f};
        float[] b = {5.0f, 6.0f, 7.0f, 8.0f};
        float[] c = new float[4];
        
        // 使用向量API进行数组加法
        VectorSpecies<Float> species = FloatVector.SPECIES_128;
        
        for (int i = 0; i < a.length; i += species.length()) {
            var va = FloatVector.fromArray(species, a, i);
            var vb = FloatVector.fromArray(species, b, i);
            var vc = va.add(vb);
            vc.intoArray(c, i);
        }
        
        // 输出结果：[6.0, 8.0, 10.0, 12.0]
        System.out.println("结果数组：" + java.util.Arrays.toString(c));
    }
}
```

### JEP 449: 弃用 Windows 32 位 x86 端口

::: info
**JEP 449: Deprecate the Windows 32-bit x86 Port for Removal**
Deprecate the Windows 32-bit x86 port, with the intent to remove it in a future release.
:::

### JEP 451: 准备禁止动态加载代理

::: info
**JEP 451: Prepare to Disallow the Dynamic Loading of Agents**
Issue warnings when agents are loaded dynamically into a running JVM. These warnings will prepare users for a future release which disallows the dynamic loading of agents by default.
:::

### JEP 452: 密钥封装机制 API

::: info
**JEP 452: Key Encapsulation Mechanism API**
Introduce an API for key encapsulation mechanisms (KEMs), an encryption technique for securing symmetric keys using public key cryptography.
:::

密钥封装机制API让Java程序可以更安全地交换对称密钥，就像用保险箱传递钥匙一样安全。

```java
import javax.crypto.*;
import java.security.*;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;

public class KEMDemo {
    public static void main(String[] args) throws Exception {
        // 1. 接收方生成密钥对
        KeyPairGenerator kpg = KeyPairGenerator.getInstance("RSA");
        kpg.initialize(2048);
        KeyPair keyPair = kpg.generateKeyPair();
        
        // 获取公钥发送给发送方
        PublicKey publicKey = keyPair.getPublic();
        byte[] publicKeyBytes = publicKey.getEncoded();
        
        // 2. 发送方使用KEM封装密钥
        KeyGenerator kem = KeyGenerator.getInstance("AES");
        kem.init(256);
        SecretKey secretKey = kem.generateKey();
        
        // 使用接收方公钥加密对称密钥
        Cipher cipher = Cipher.getInstance("RSA/ECB/OAEPWithSHA-256AndMGF1Padding");
        cipher.init(Cipher.ENCRYPT_MODE, publicKey);
        byte[] encryptedKey = cipher.doFinal(secretKey.getEncoded());
        
        System.out.println("原始对称密钥长度：" + secretKey.getEncoded().length + " 字节");
        System.out.println("封装后的密钥长度：" + encryptedKey.length + " 字节");
        System.out.println("Base64编码的封装密钥：" + Base64.getEncoder().encodeToString(encryptedKey));
        
        // 3. 接收方解密获得对称密钥
        cipher.init(Cipher.DECRYPT_MODE, keyPair.getPrivate());
        byte[] decryptedKey = cipher.doFinal(encryptedKey);
        
        SecretKey receivedKey = new SecretKeySpec(decryptedKey, "AES");
        System.out.println("成功解密获得对称密钥！");
    }
}
```

### JEP 453: 结构化并发（预览）

::: info JEP 453: Structured Concurrency (Preview)
Simplify concurrent programming by introducing an API for structured concurrency. Structured concurrency treats groups of related tasks running in different threads as a single unit of work, thereby streamlining error handling and cancellation, improving reliability, and enhancing observability. This is a preview API.
:::

<!-- @include:./structured-concurrency-intro.md -->
