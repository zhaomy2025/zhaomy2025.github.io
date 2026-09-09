# 结构化并发：Java并发编程的革命性演进

> 从线程池到结构化并发的范式转换，探索Java并发模型的里程碑式演进

## 引言

在Java并发编程的历史长河中，从早期的`Thread`类到线程池，再到现代的虚拟线程，每一次演进都标志着并发模型的重大飞跃。然而，真正革命性的变化来自**结构化并发（Structured Concurrency）**的引入——它不仅改变了我们编写并发代码的方式，更从根本上解决了传统并发编程中的诸多痛点。

本文将带您深入探索结构化并发的演进历程、核心概念、实战应用，以及它如何重新定义Java并发编程的最佳实践。

## 历史演进：从混沌到结构化

### 传统并发时代：线程与线程池的困境

在结构化并发出现之前，Java开发者面临着以下挑战：
+ 线程泄露
  - 线程启动后，如果没有显式调用 join() 或 interrupt() ， 主线程退出时子线程仍在运行
+ 异常处理困难
  - 子线程抛出的异常 只会被默认的 UncaughtExceptionHandler 捕获并打印 ， 主线程无从感知
  - 如果主线程需要拿到子任务结果或做回滚，必须：手动在 run() 里 try-catch 并把异常塞进共享变量；主线程周期性轮询；或者自己实现一套 Future / Callable 的雏形。
+ 难以追踪和管理
  - 线程之间没有父子关系
    * ThreadGroup 只能按名字归类，无法表达“这两个线程属于同一个业务任务”
    * 在调试器 / jstack 里只能看到两条孤立线程，无法快速判断它们共同服务于哪段业务逻辑
  - 生命周期无法统一
    * 想等两条线程都结束再汇总结果？得自己写 join() 的循环，还要处理中断
    * 如果中途想取消整个任务，需要逐一 interrupt() ， 无法原子化取消
  - 跨线程上下文传递困难
    * MDC（日志链路 ID）、SecurityContext 等 ThreadLocal 数据无法自动跟随线程切换，需要手动复制

**Java 1.0-1.4时代：原始线程管理**

```java
// Java 1.0-1.4：手动线程管理（问题重重）
public class ManualThreadDemo {
    public static void main(String[] args) {
        Thread t1 = new Thread(() -> fetchUserData());
        Thread t2 = new Thread(() -> fetchOrderData());
        t1.start();
        t2.start();
    }
}
```

**Java 5-18时代：线程池的局限性**

```java
// Java 5-18：ExecutorService的局限性
public class ThreadPoolLimitation {
    private static final ExecutorService executor = Executors.newFixedThreadPool(10);
    public static String handle() throws Exception {
        Future<String> user = executor.submit(() -> findUser());
        Future<String> order = executor.submit(() -> fetchOrderData());
        return user.get() + order.get();
    }
}
```

+ 线程泄露
  - 如果findUser() 抛出异常，那么handle() 在调用user.get() 时也会抛出异常，但fetchOrder() 会继续在自己的线程中运行
  - 如果执行handle() 的线程被中断，中断不会传播到子任务。findUser() 和fetchOrder() 线程都会泄漏，即使handle() 失败后也会继续运行。
  - user.get() -> order.get()，是顺序等待的。即使 fetchOrder() 任务早已失败，handle() 也会被 user.get() 卡住，必须等 findUser() 完成且user.get()返回后，order.get()才会抛出异常，这会产生不必要的等待。

### 结构化并发时代：革命性的范式转换

**Java 19-20：孵化期探索**

+ **JEP 428** (Java 19)：第一次孵化
  - 首次引入`StructuredTaskScope`API，支持`ShutdownOnFailure`和`ShutdownOnSuccess`策略
+ **JEP 437** (Java 20)：第二次孵化
  - 增强了与 Scoped Values 的互操作性，使得在结构化作用域中创建的线程自动继承父线程的作用域值。

**Java 21-25：预览版**

+ **JEP 453**（Java21）：结构化并发预览特性
  - `fork()`方法返回`Subtask`而非`Future`，提供更精细的任务状态查询
+ **JEP 462**（Java22）：结构化并发（第二次预览）
+ **JEP 480**（Java23）：结构化并发（第三次预览）
+ **JEP 499**（Java24）：结构化并发（第四次预览）
+ **JEP 505**（Java25）：结构化并发（第五次预览）

## 核心特性解析

### 结构化任务作用域（StructuredTaskScope）

结构化并发的核心是`StructuredTaskScope`，它提供了任务生命周期的自动管理。

1. 创建作用域，并指定关闭策略
2. 调用`fork()`在作用域中创建子任务
3. 调用`shutdown()`取消所有未完成任务
  1. 当某个子任务遇到无法处理的错误时，调用`shutdown()`主动请求取消
  2. 父任务也可以调用`shutdown()`主动取消
  3. `ShutdownOnFailure`策略会在任一子任务失败时自动调用`shutdown()`
4. 调用`join()`或`joinUntil()`等待所有子任务完成或取消
5. 处理异常或获取结果
  1. 调用`throwIfFailed()`抛出第一个失败任务的异常
  2. 调用`resultNow()`获取已完成任务的结果（如果有）
6. 通过try-with-resources 隐式关闭作用域

#### 基本使用模式

```java
public class StructuredConcurrencyDemo {
  public static String fetchUserProfile() throws Exception {
    // ShutdownOnFailure 策略会在任一子任务失败时自动调用 shutdown()
    try (var scope = new StructuredTaskScope.ShutdownOnFailure()) {
      // 并行执行多个子任务
      // Java 19-20 fork()返回Future，Java 21+ fork()返回Subtask
      Subtask<User> user = scope.fork(() -> findUser());
      Subtask<Order> order = scope.fork(() -> fetchOrderData());
      // 等待所有任务完成或任一失败
      scope.join();
      scope.throwIfFailed();
      // 获取结果并组合
      return new Response(user.resultNow(), order.resultNow());
    }
  }
}
```

#### 作用域关闭策略

有两种关闭策略：
1. 失败时关闭策略：只要有一个任务失败，就关闭所有任务

```java
public class ShutdownOnFailureDemo {
    public static String fetchCriticalData() throws Exception {
        try (var scope = new StructuredTaskScope.ShutdownOnFailure()) {
            Subtask<String> primary = scope.fork(() -> fetchFromPrimary());
            Subtask<String> secondary = scope.fork(() -> fetchFromSecondary());
            scope.join();
            scope.throwIfFailed(); // 任一任务失败则抛出异常
            return primary.get(); // 优先使用主数据源
        }
    }
}
```

2. 成功时关闭策略：只要有一个任务成功，就关闭所有任务

```java
public class ShutdownOnSuccessDemo {
  public static String fetchFirstAvailable() throws Exception {
    try (var scope = new StructuredTaskScope.ShutdownOnSuccess<String>()) {
      scope.fork(() -> fetchFromService1());
      scope.fork(() -> fetchFromService2());
      scope.fork(() -> fetchFromService3());
      scope.join();
      // 返回第一个成功的结果
      return scope.result();
    }
  }
}
```

### Subtask(Java21)

从JEP 453开始，StructuredTaskScope::fork(...)方法返回一个Subtask，而不是Future。 Subtask提供了比Future更丰富的方法来查询任务状态。

#### 核心方法

1. `get()`：获取任务结果，如果任务未完成，则阻塞直到完成；如果任务失败或取消，则抛出异常。与Future.get()类似
2. `state()`：获取任务状态，返回Subtask.State枚举值，比 Future.isDone() 提供更精细的信息。
  - UNAVAILABLE：任务未开始或仍在运行
  - SUCCESS：任务已成功完成
  - FAILED：任务因异常而失败
  - CANCELLED：任务已被取消
3. `exception()`：如果任务因异常而完成，返回该异常。否则返回 null。
4. `toString()`：返回任务的字符串表示形式，通常包含状态信息。

#### 代码对比

**使用 Future (传统方式)**

```java
Future<String> successFuture = executor.submit(() -> "Success");
Future<String> failureFuture = executor.submit(() -> throw new RuntimeException("Boom!"));

// 状态查询模糊
if (successFuture.isDone()) {
    // 是成功了？还是失败了？还是取消了？不知道，必须调用 get()
}

// 异常处理繁琐，需要捕获 ExecutionException 并提取真实异常
try {
    String result = failureFuture.get();
} catch (ExecutionException e) {
    Throwable realCause = e.getCause();
    System.out.println("Task failed: " + realCause.getMessage());
}
```

**使用 Subtask (结构化并发)**

```java
try (var scope = new StructuredTaskScope.ShutdownOnFailure()) {
  Subtask<String> successSubtask = scope.fork(() -> "Success");
  Subtask<String> failureSubtask = scope.fork(() -> throw new RuntimeException("Boom!"));

  scope.join();

  // 状态查询清晰明了
  if (successSubtask.state() == Subtask.State.SUCCESS) {
    System.out.println("Task succeeded: " + successSubtask.get());
  }
  // 异常处理直接了当
  if (failureSubtask.state() == Subtask.State.FAILED) {
    Throwable cause = failureSubtask.exception(); // 直接获取原始异常
    System.out.println("Task failed: " + cause.getMessage());
  }
}
```

### 异常传播与取消机制

结构化并发提供了优雅的异常处理机制：

```java
public class ExceptionHandlingDemo {
    public static UserProfile fetchUserProfileWithFallback() throws Exception {
        try (var scope = new StructuredTaskScope.ShutdownOnFailure()) {
            // 并行获取用户数据
            Subtask<User> userTask = scope.fork(() -> fetchUserFromAPI());
            Subtask<List<Order>> ordersTask = scope.fork(() -> fetchUserOrders());
            scope.join();
            try {
                scope.throwIfFailed();
                return new UserProfile(userTask.get(), ordersTask.get());
            } catch (ExecutionException e) {
                // 优雅降级：使用缓存数据
                return fetchFromCache();
            }
        }
    }
}
```

### 与虚拟线程的完美结合

结构化并发与虚拟线程的结合创造了强大的并发模型：

```java
public class VirtualThreadIntegration {
  public static CompletableFuture<String> processLargeDataset(List<Integer> data) {
    return CompletableFuture.supplyAsync(() -> {
      try (var scope = new StructuredTaskScope.ShutdownOnFailure()) {
        // 使用虚拟线程并行处理数据块
        List<Subtask<String>> tasks = data.stream()
            .map(chunk -> scope.fork(() -> processChunk(chunk)))
            .toList();
        scope.join();
        scope.throwIfFailed();
        return tasks.stream()
            .map(Subtask::get)
            .collect(Collectors.joining());
      }
    }, Executors.newVirtualThreadPerTaskExecutor());
  }
}
```

## 实战案例对比

### 案例1：微服务聚合API

**传统方式 vs 结构化并发**
从下面案例对比看出：
1. `scope.throwIfFailed()`代替了传统方式的复杂异常处理，一行代码即可取消所有任务
2. `Subtask.get()`代替了传统方式的`Future.get()`，无需传参，API更简洁
```java
// ❌ 传统方式：复杂且易出错
public class TraditionalAggregationService {
    private final ExecutorService executor = Executors.newFixedThreadPool(20);
    public UserDashboard getDashboard(String userId) throws Exception {
        Future<User> userFuture = executor.submit(() -> userService.getUser(userId));
        Future<List<Order>> ordersFuture = executor.submit(() -> orderService.getOrders(userId));
        Future<List<Notification>> notifsFuture = executor.submit(() -> notificationService.getNotifications(userId));
        try {
            return new UserDashboard(
                userFuture.get(5, TimeUnit.SECONDS),
                ordersFuture.get(5, TimeUnit.SECONDS),
                notifsFuture.get(5, TimeUnit.SECONDS)
            );
        } catch (TimeoutException e) {
            // 取消所有任务
            userFuture.cancel(true);
            ordersFuture.cancel(true);
            notifsFuture.cancel(true);
            throw e;
        }
    }
}

// ✅ 结构化并发：简洁且可靠
public class StructuredAggregationService {
    public UserDashboard getDashboard(String userId) throws Exception {
        try (var scope = new StructuredTaskScope.ShutdownOnFailure()) {
            Subtask<User> userTask = scope.fork(() -> userService.getUser(userId));
            Subtask<List<Order>> ordersTask = scope.fork(() -> orderService.getOrders(userId));
            Subtask<List<Notification>> notificationsTask = scope.fork(() -> notificationService.getNotifications(userId));
            scope.join();
            scope.throwIfFailed();
            return new UserDashboard(userTask.get(), ordersTask.get(), notificationsTask.get());
        }
    }
}
```

### 案例2：数据流处理管道

```java
public class DataProcessingPipeline {
    public static ProcessingResult processTransaction(Transaction tx) throws Exception {
        try (var scope = new StructuredTaskScope.ShutdownOnFailure()) {
            // 并行验证
            Subtask<Boolean> fraudCheck = scope.fork(() -> fraudService.check(tx));
            Subtask<Boolean> complianceCheck = scope.fork(() -> complianceService.validate(tx));
            // 并行处理
            Subtask<String> riskScore = scope.fork(() -> riskEngine.calculate(tx));
            Subtask<String> notification = scope.fork(() -> notificationService.prepare(tx));
            scope.join();
            scope.throwIfFailed();
            return new ProcessingResult(
                fraudCheck.get(),
                complianceCheck.get(),
                riskScore.get(),
                notification.get()
            );
        }
    }
}
```

### 设计模式应用

#### 1. 扇出-扇入模式（Fan-out/Fan-in）

```java
public class FanOutFanInPattern {

    public static <T, R> List<R> parallelMap(Collection<T> items, Function<T, R> mapper) throws Exception {
        try (var scope = new StructuredTaskScope.ShutdownOnFailure()) {
            List<Subtask<R>> tasks = items.stream()
                .map(item -> scope.fork(() -> mapper.apply(item)))
                .toList();

            scope.join();
            scope.throwIfFailed();

            return tasks.stream()
                .map(Subtask::get)
                .toList();
        }
    }
}
```

#### 2. 超时处理模式

```java
public class TimeoutHandlingPattern {

    public static String fetchWithTimeout(Duration timeout) throws Exception {
        try (var scope = new StructuredTaskScope.ShutdownOnFailure()) {
            Subtask<String> primary = scope.fork(() -> fetchFromPrimary());
            Subtask<String> fallback = scope.fork(() -> fetchFromFallback());

            boolean completed = scope.joinUntil(Instant.now().plus(timeout));
            if (!completed) {
                throw new TimeoutException("操作超时");
            }

            scope.throwIfFailed();
            return primary.state() == Subtask.State.SUCCESS ? primary.get() : fallback.get();
        }
    }
}
```

### 迁移策略

#### 逐步迁移路径

```java
// 阶段1：识别传统并发代码
public class LegacyService {
    public Future<String> oldMethod() {
        return executor.submit(() -> doWork());
    }
}

// 阶段2：包装为结构化并发
public class TransitionalService {
    public String newMethod() throws Exception {
        try (var scope = new StructuredTaskScope.ShutdownOnFailure()) {
            Subtask<String> task = scope.fork(() -> doWork());
            scope.join();
            scope.throwIfFailed();
            return task.get();
        }
    }
}

// 阶段3：充分利用结构化特性
public class ModernService {
    public String optimizedMethod() throws Exception {
        try (var scope = new StructuredTaskScope.ShutdownOnFailure()) {
            // 多个相关任务并行执行
            Subtask<String> task1 = scope.fork(() -> fetchPart1());
            Subtask<String> task2 = scope.fork(() -> fetchPart2());
            scope.join();
            scope.throwIfFailed();
            return combine(task1.get(), task2.get());
        }
    }
}
```

## 总结

结构化并发代表了Java并发编程的范式转换，从**手动管理**转向**自动生命周期管理**，从**复杂异常处理**转向**优雅传播机制**。

> **参考资料**：
> - [JEP 428: Structured Concurrency (Incubator)](https://openjdk.org/jeps/428)
> - [JEP 437: Structured Concurrency (Second Incubator)](https://openjdk.org/jeps/437)
> - [JEP 453: Structured Concurrency (Preview)](https://openjdk.org/jeps/453)
> - [JEP 462: Structured Concurrency (Second Preview)](https://openjdk.org/jeps/462)
> - [JEP 480: Structured Concurrency (Third Preview)](https://openjdk.org/jeps/480)
> - [JEP 499: Structured Concurrency (Fourth Preview)](https://openjdk.org/jeps/499)
> - [JEP 505: Structured Concurrency (Fifth Preview)](https://openjdk.org/jeps/505)
