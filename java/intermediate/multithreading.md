---
title: Java 多线程编程
date: 2025-08-04T05:25:29.625Z
category:
  - java
  - intermediate
  - multithreading
tags:
  - java
  - intermediate
  - multithreading
---

# Java 多线程编程
[[toc]]

<!-- @include: ./multithreading_intro.md -->

## 线程的基本概念

### 什么是线程

线程是程序执行的最小单位，一个进程可以包含多个线程，每个线程都有自己的执行路径，但共享进程的内存空间和系统资源。多线程可以提高程序的执行效率，充分利用CPU资源。

### 线程的创建方式

在Java中，创建线程主要有以下三种方式：

#### 继承Thread类

通过继承`Thread`类并重写`run()`方法来创建线程：

```java
public class MyThread extends Thread {
    @Override
    public void run() {
        System.out.println("线程执行");
    }
}

// 使用方式
MyThread thread = new MyThread();
thread.setName("自定义线程名"); // 设置线程名称
thread.start(); // 启动线程，调用run()方法
```

#### 实现Runnable接口

实现`Runnable`接口并传入`Thread`构造函数：

```java
public class MyRunnable implements Runnable {
    @Override
    public void run() {
        System.out.println("线程执行");
    }
}

// 使用方式
MyRunnable runnable = new MyRunnable();
Thread thread = new Thread(runnable, "自定义线程名");
thread.start();
```

#### 使用Callable和Future

对于需要返回结果的线程，可以使用`Callable`和`Future`：

```java
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.FutureTask;

public class MyCallable implements Callable<String> {
    @Override
    public String call() throws Exception {
        Thread.sleep(1000); // 模拟耗时操作
        return Thread.currentThread().getName() + ": 线程执行结果";
    }
}

// 使用方式
FutureTask<String> futureTask = new FutureTask<>(new MyCallable());
Thread thread = new Thread(futureTask, "自定义线程名");
thread.start();

try {
    String result = futureTask.get(); // 阻塞等待线程执行完成并获取结果
    System.out.println(result);
} catch (InterruptedException | ExecutionException e) {
    e.printStackTrace();
}
```

### 线程的生命周期

线程有以下几种状态，它们之间可以相互转换：

| 状态 | 描述 |
|------|------|
| 新建(NEW) | 线程被创建但未启动 |
| 就绪(RUNNABLE) | 线程可运行，但可能正在等待CPU资源 |
| 运行(RUNNING) | 线程正在执行 |
| 阻塞(BLOCKED) | 线程因等待锁而暂时不能继续执行 |
| 等待(WAITING) | 线程等待其他线程执行特定操作，无超时限制 |
| 计时等待(TIMED_WAITING) | 线程在指定时间内等待 |
| 终止(TERMINATED) | 线程执行完成 |

## 线程同步机制

在多线程环境中，多个线程可能会同时访问共享资源，导致数据不一致的问题。这种情况被称为**竞态条件**（Race Condition）。Java提供了多种机制来实现线程同步，确保在多线程环境下共享资源的一致性和安全性。

### 同步机制分类

Java中的线程同步机制主要分为以下几类：

| 同步机制 | 特点 | 适用场景 |
|---------|------|---------|
| `synchronized` 关键字 | 简单易用，隐式获取和释放锁 | 简单的同步场景 |
| 显式锁（如`ReentrantLock`） | 更灵活，支持公平锁、可中断锁等高级特性 | 复杂的同步场景 |
| 读写锁（如`ReentrantReadWriteLock`） | 允许多个线程同时读，写操作互斥 | 读多写少的场景 |
| 线程安全集合（如`ConcurrentHashMap`） | 内部实现线程安全，无需额外同步 | 多线程共享集合数据 |

### synchronized关键字

`synchronized`是Java中最基本的同步机制，它可以修饰方法或代码块，确保同一时间只有一个线程可以执行被修饰的代码。`synchronized`基于对象监视器（Monitor）实现，具有以下特点：
- 自动获取和释放锁
- 不可中断
- 非公平锁
- 可重入（一个线程可以多次获取同一个锁）

```java
// 修饰实例方法
public synchronized void synchronizedMethod() {
    // 同步代码
    // 锁对象是当前实例（this）
}

// 修饰静态方法
public static synchronized void staticSynchronizedMethod() {
    // 同步代码
    // 锁对象是当前类的Class对象
}

// 修饰代码块
public void synchronizedBlock() {
    // 非同步代码
    
    // 同步代码块，锁对象是this
    synchronized (this) {
        // 同步代码
    }
    
    // 同步代码块，锁对象是class对象
    synchronized (MyClass.class) {
        // 同步代码
    }
    
    // 同步代码块，锁对象是任意对象
    Object lock = new Object();
    synchronized (lock) {
        // 同步代码
    }
}
```

### 显式锁(Lock)

`java.util.concurrent.locks`包提供了更灵活的锁机制，主要接口是`Lock`，常用实现类有`ReentrantLock`和`StampedLock`。与`synchronized`相比，显式锁具有以下优势：
- 支持公平锁
- 支持可中断锁
- 支持超时获取锁
- 支持尝试获取锁
- 可以实现更复杂的同步模式

#### ReentrantLock

```java
import java.util.concurrent.locks.ReentrantLock;

public class ReentrantLockDemo {
    // 创建可重入锁，参数为true表示公平锁
    private final ReentrantLock lock = new ReentrantLock(true);
    private int count = 0;
    
    public void increment() {
        // 尝试获取锁，如果获取不到则阻塞
        lock.lock();
        try {
            // 同步代码
            count++;
            System.out.println(Thread.currentThread().getName() + ": count = " + count);
        } finally {
            // 确保锁被释放，防止死锁
            lock.unlock();
        }
    }
    
    public void tryIncrement() {
        // 尝试获取锁，如果获取不到立即返回false
        if (lock.tryLock()) {
            try {
                count++;
                System.out.println(Thread.currentThread().getName() + ": count = " + count);
            } finally {
                lock.unlock();
            }
        } else {
            // 获取锁失败，可以执行其他逻辑
            System.out.println(Thread.currentThread().getName() + ": 获取锁失败");
        }
    }
}
```

#### StampedLock
`StampedLock`是Java 8引入的新锁机制，它虽然实现了`Lock`接口，但同时支持读写分离，功能上类似读写锁。与`ReentrantReadWriteLock`相比，`StampedLock`提供了乐观读模式，在高并发读场景下性能更好。
`StampedLock`的主要优势在于：
- 乐观读模式减少了锁竞争，提高了读操作的并发性能
- 使用戳记（stamp）而非锁对象，降低了内存开销
- 支持锁的升级和降级（但需要手动实现）

需要注意的是，`StampedLock`不支持重入，也不支持条件变量，使用时需要特别小心。

```java
import java.util.concurrent.locks.StampedLock;

public class StampedLockDemo {
    private final StampedLock lock = new StampedLock();
    private double x = 0, y = 0;
    
    // 写操作
    public void move(double deltaX, double deltaY) {
        long stamp = lock.writeLock();
        try {
            x += deltaX;
            y += deltaY;
        } finally {
            lock.unlockWrite(stamp);
        }
    }
    
    // 乐观读操作
    public double distanceFromOrigin() {
        long stamp = lock.tryOptimisticRead();
        double currentX = x, currentY = y;
        // 检查读期间是否有写操作
        if (!lock.validate(stamp)) {
            // 如果有写操作，升级为悲观读锁
            stamp = lock.readLock();
            try {
                currentX = x;
                currentY = y;
            } finally {
                lock.unlockRead(stamp);
            }
        }
        return Math.sqrt(currentX * currentX + currentY * currentY);
    }
}
```

### 读写锁(ReadWriteLock)

读写锁允许多个线程同时读，但写操作是互斥的。这种机制在**读多写少**的场景下可以提高并发性能。`ReentrantReadWriteLock`是Java中最常用的读写锁实现。

```java
import java.util.concurrent.locks.ReadWriteLock;
import java.util.concurrent.locks.ReentrantReadWriteLock;

public class ReadWriteLockDemo {
    private final ReadWriteLock rwLock = new ReentrantReadWriteLock();
    private int data = 0;
    
    // 读操作
    public int readData() {
        rwLock.readLock().lock();
        try {
            // 多个线程可以同时执行读操作
            return data;
        } finally {
            rwLock.readLock().unlock();
        }
    }
    
    // 写操作
    public void writeData(int newData) {
        rwLock.writeLock().lock();
        try {
            // 写操作是互斥的
            data = newData;
        } finally {
            rwLock.writeLock().unlock();
        }
    }
}
```

### 线程安全集合

在多线程环境中，Java提供了专门的线程安全集合类，位于`java.util.concurrent`包中。这些集合类内部实现了线程安全机制，无需额外同步。

#### 常用线程安全集合

| 集合类 | 说明 | 适用场景 |
|--------|------|---------|
| `ConcurrentHashMap` | 线程安全的HashMap实现，支持高并发读写 | 多线程共享键值对数据 |
| `CopyOnWriteArrayList` | 读多写少场景下的线程安全列表 | 频繁读取，偶尔修改的场景 |
| `CopyOnWriteArraySet` | 基于CopyOnWriteArrayList的线程安全集合 | 读多写少的集合场景 |
| `ConcurrentLinkedQueue` | 无界线程安全队列 | 高并发下的队列操作 |
| `LinkedBlockingQueue` | 基于链表的有界阻塞队列 | 生产者-消费者模式 |
| `ArrayBlockingQueue` | 基于数组的有界阻塞队列 | 固定大小的队列场景 |

#### 使用示例

```java
// ConcurrentHashMap示例
ConcurrentHashMap<String, Integer> map = new ConcurrentHashMap<>();
map.put("key1", 1);
// 原子操作，如果key不存在则添加
map.putIfAbsent("key2", 2);
// 原子更新操作
map.computeIfPresent("key1", (k, v) -> v + 1);
System.out.println(map.get("key1")); // 输出: 2

// CopyOnWriteArrayList示例
CopyOnWriteArrayList<String> list = new CopyOnWriteArrayList<>();
list.add("item1");
list.add("item2");
// 遍历不需要额外同步
list.forEach(System.out::println);

// BlockingQueue示例
BlockingQueue<String> queue = new LinkedBlockingQueue<>(10);
// 生产者线程
new Thread(() -> {
    try {
        queue.put("task1");
        queue.put("task2");
    } catch (InterruptedException e) {
        Thread.currentThread().interrupt();
    }
}).start();
// 消费者线程
new Thread(() -> {
    try {
        System.out.println(queue.take()); // 输出: task1
        System.out.println(queue.take()); // 输出: task2
    } catch (InterruptedException e) {
        Thread.currentThread().interrupt();
    }
}).start();
```

### 同步机制的选择
选择合适的同步机制对于多线程程序的性能和正确性至关重要。以下是一些选择建议：

1. 简单同步需求：优先使用`synchronized`，因为它简单易用，且JVM会对其进行优化。
2. 复杂同步需求：使用`ReentrantLock`，它支持公平锁、可中断锁等高级特性。
3. 读多写少场景：优先考虑`StampedLock`，其次是`ReentrantReadWriteLock`。
4. 集合操作：使用`java.util.concurrent`包中的线程安全集合。


## 线程池与Executor框架

在Java多线程编程中，频繁创建和销毁线程会带来较大的性能开销。线程池技术通过重用线程、控制线程数量和管理任务队列，有效提高了多线程程序的性能和可管理性。Executor框架是Java提供的一套完整的线程池管理解决方案。

### 框架概述

Executor框架 是一个包含线程池管理、任务调度和异步执行的整体架构，主要由以下组件构成：
| 组件 | 作用 |
|------|------|
| 任务(Runnable/Callable) | 定义需要执行的工作单元 |
| 执行器(Executor/ExecutorService) | 负责任务的提交和执行 |
| 线程池(ThreadPoolExecutor) | 管理线程的创建、复用和销毁 |
| 异步结果(Future/FutureTask) | 表示异步执行的结果 |

::: tip
ThreadPoolExecutor 是 ExecutorService 的实现类，提供了更丰富的线程池管理功能。
:::

### Executor接口

`Executor`是Executor框架的基础接口，定义了任务执行的核心方法：

```java
public interface Executor {
    void execute(Runnable command);
}
```

`Executor`的核心设计理念是**将任务的提交与执行解耦**，使调用者无需关心线程的创建、调度和销毁细节。

::: warning
它只负责执行提交的 `Runnable` 任务，但不提供任务执行的生命周期管理、任务结果的获取等功能。
:::

#### Executor的优势

- **简化线程管理**：无需手动创建和管理线程
- **提高性能**：通过线程重用减少线程创建和销毁的开销
- **避免资源耗尽**：可以控制并发线程数量
- **防止this逃逸**：延迟执行任务，避免对象构造期间的并发访问问题

> this逃逸是指在构造函数中，将this引用传递给其他线程，导致其他线程在对象构造完成前访问该对象，可能引发并发问题。使用Executor延迟执行任务，可以避免这个问题。

### ExecutorService接口

`ExecutorService`是`Executor`的子接口，扩展了线程池管理功能，提供了更丰富的API。

#### 核心功能

1. **任务提交**：支持提交`Runnable`和`Callable`任务，并返回 `Future` 对象以获取任务结果。
2. **线程池生命周期管理**：提供关闭、终止检查等方法
3. **批量任务处理**：支持批量提交任务并获取结果（如 `invokeAll` 和 `invokeAny`）。

#### 重要方法

提交任务

+ `void execute(Runnable command)`  
提交一个 `Runnable` 任务，没有返回值。
+ `Future<?> submit(Runnable task)`  
提交一个 `Runnable` 任务，返回一个 `Future` 对象，可以用于检查任务是否完成。
+ `Future<T> submit(Callable<T> task)`  
提交一个 `Callable` 任务，返回一个 `Future` 对象，可以获取任务的返回值。

关闭线程池

+ `void shutdown()`  
平缓关闭线程池：不再接受新任务，但会等待已提交的任务执行完成。
+ `List<Runnable> shutdownNow()`  
立即关闭线程池：尝试停止所有正在执行的任务，并返回等待执行的任务列表。
+ `boolean isShutdown()`  
检查线程池是否已关闭。
+ `boolean isTerminated()`  
检查线程池是否完全终止（所有任务执行完毕）。

获取任务结果

+ `Future<T> submit(Callable<T> task)`  
提交一个 `Callable` 任务，返回一个 `Future` 对象，可以通过 `Future.get()` 获取任务的返回值。
+ `T invokeAny(Collection<? extends Callable<T>> tasks)`  
执行一组任务，返回其中一个成功完成的任务的结果（任意一个）。
+ `List<Future<T>> invokeAll(Collection<? extends Callable<T>> tasks)`  
执行一组任务，返回所有任务的 `Future` 列表。

#### 使用示例

```java
// 创建线程池
ExecutorService executorService = Executors.newFixedThreadPool(5);

// 提交Runnable任务
executorService.execute(() -> {
    System.out.println(Thread.currentThread().getName() + " 执行Runnable任务");
});

// 提交Callable任务
Future<String> future = executorService.submit(() -> {
    System.out.println(Thread.currentThread().getName() + " 执行Callable任务");
    return "任务执行结果";
});

// 获取任务结果
try {
    String result = future.get(); // 阻塞等待任务完成
    System.out.println("任务结果: " + result);
} catch (InterruptedException | ExecutionException e) {
    e.printStackTrace();
}

// 关闭线程池
executorService.shutdown();
```

### ThreadPoolExecutor

`ThreadPoolExecutor`是`ExecutorService`的核心实现类，提供了完整的线程池功能。

#### 工作原理

1. 当提交任务时，如果当前线程数小于核心线程数(`corePoolSize`)，则创建新线程执行任务
2. 如果当前线程数达到核心线程数，则将任务加入工作队列(`workQueue`)
3. 如果工作队列已满，则创建非核心线程执行任务，直到达到最大线程数(`maximumPoolSize`)
4. 如果超过最大线程数，则执行饱和策略(`handler`)

#### 构造函数

```java
public ThreadPoolExecutor(
    int corePoolSize,                    // 核心线程数
    int maximumPoolSize,                 // 最大线程数
    long keepAliveTime,                  // 非核心线程空闲时间
    TimeUnit unit,                       // 时间单位
    BlockingQueue<Runnable> workQueue,   // 工作队列
    ThreadFactory threadFactory,         // 线程工厂
    RejectedExecutionHandler handler     // 饱和策略
) {
    // 构造函数实现
}
```

#### 核心参数

+ corePoolSize：核心线程数，线程池保持的最小线程数量
+ maximumPoolSize：最大线程数，线程池允许创建的最大线程数量
+ workQueue：工作队列，用于存储等待执行的任务，常见类型：
  - `LinkedBlockingQueue`：无界队列，可能导致内存溢出
  - `ArrayBlockingQueue`：有界队列，需要指定容量
  - `SynchronousQueue`：同步队列，不存储任务，直接传递给线程
+ keepAliveTime：非核心线程的空闲存活时间
+ unit：keepAliveTime参数的时间单位
+ threadFactory：线程工厂，用于创建新线程，可以自定义线程名称等属性
+ handler：饱和策略，当线程数达到最大且队列满时的处理策略

#### 饱和策略
| 策略 | 描述 |
|------|------|
| `AbortPolicy` | 默认策略，抛出`RejectedExecutionException`异常 |
| `CallerRunsPolicy` | 由调用者线程执行被拒绝的任务 |
| `DiscardPolicy` | 直接丢弃被拒绝的任务 |
| `DiscardOldestPolicy` | 丢弃队列中最旧的任务，尝试提交新任务 |

#### 最佳配置实践

- CPU密集型任务：核心线程数 = CPU核心数 + 1
- IO密集型任务：核心线程数 = CPU核心数 * 2
- 队列选择：有限使用有界队列避免内存溢出风险
- 饱和策略，建议使用 AbortPolicy 并捕获异常，以便及时发现问题
- 避免使用 Executors 工具类创建线程池：手动创建`ThreadPoolExecutor`以明确配置参数

::: warning
避免使用`Executors`工具类创建线程池的原因：
- `FixedThreadPool`和`SingleThreadExecutor`使用无界队列，可能导致内存溢出
- `CachedThreadPool`和`ScheduledThreadPool`允许创建无限多线程，可能耗尽系统资源
:::

### Future与FutureTask

Future 与 FutureTask 是Java并发编程中用于处理异步任务结果的重要组件。

#### Future 接口

Future 是一个接口，代表异步执行的结果，主要作用是：
- 表示异步任务的执行状态（未开始、执行中、已完成、已取消）
- 获取异步任务的执行结果
- 取消尚未完成的任务

它提供了以下核心方法：

```java
public interface Future<V> {
    boolean cancel(boolean mayInterruptIfRunning);  // 取消任务
    boolean isCancelled();  // 判断任务是否被取消
    boolean isDone();  // 判断任务是否已完成
    V get() throws InterruptedException, ExecutionException;  // 获取任务结果（阻塞）
    V get(long timeout, TimeUnit unit) throws InterruptedException, ExecutionException, TimeoutException;  // 带超时的获取结果
}
```

#### FutureTask 实现类

`FutureTask` 是 `Future` 接口的实现类，同时也实现了 `Runnable` 接口，因此它既可以作为 `Runnable` 提交给线程池执行，也可以作为 `Future` 获取任务结果。

`FutureTask` 通常用于包装 `Callable` 或 `Runnable` 任务，以便在任务完成后获取其结果。

`FutureTask` 的应用场景：

1. 异步任务执行：将任务提交给线程池或线程执行，并在需要时获取任务结果。
2. 任务取消：通过 `cancel()` 方法取消尚未完成的任务。
3. 超时控制：使用 `get(long timeout, TimeUnit unit)` 方法设置超时时间，避免无限等待。
4. 任务结果缓存：将任务结果缓存到 `FutureTask` 中，避免重复计算。
5. 任务依赖：在多个任务之间存在依赖关系时，可以使用 `FutureTask` 来管理任务的执行顺序。

#### 代码示例
``` java
import java.util.concurrent.*;

public class FutureExample {
    public static void main(String[] args) throws InterruptedException, ExecutionException {
        // 创建线程池
        ExecutorService executor = Executors.newFixedThreadPool(2);

        // 示例1: 使用Future获取Callable任务的结果
        Callable<Integer> callableTask = () -> {
            TimeUnit.SECONDS.sleep(2);  // 模拟耗时操作
            return 1 + 1;
        };

        Future<Integer> future = executor.submit(callableTask);
        System.out.println("任务提交成功，等待结果...");

        // 可以做其他事情
        System.out.println("主线程继续执行其他任务");

        // 获取结果（会阻塞直到任务完成）
        Integer result = future.get();
        System.out.println("任务结果: " + result);

        // 示例2: 使用FutureTask
        Callable<String> anotherTask = () -> {
            TimeUnit.SECONDS.sleep(1);
            return "Hello, FutureTask!";
        };

        // 创建FutureTask
        FutureTask<String> futureTask = new FutureTask<>(anotherTask);

        // 提交FutureTask
        executor.submit(futureTask);

        // 检查任务是否完成
        while (!futureTask.isDone()) {
            System.out.println("FutureTask任务正在执行...");
            TimeUnit.MILLISECONDS.sleep(500);
        }

        // 获取结果
        String taskResult = futureTask.get();
        System.out.println("FutureTask结果: " + taskResult);

        // 关闭线程池
        executor.shutdown();
    }
}
```

### 常见线程池类型

| 线程池 | 特点 | 队列 | 适用场景 |
| :--- | :--- | :--- | :--- |
| 可重用固定线程数的线程池<br>`FixedThreadPool` | 核心线程数=最大线程数 | LinkedBlockingQueue |已知并发量的场景 |
| `SingleThreadExecutor` | 单线程执行，确保任务按顺序执行 | 无界队列LinkedBlockingQueue |需要顺序执行任务的场景 |
| `CachedThreadPool` | corePoolSize=0<br/>maximumPoolSize=Integer.MAX_VALUE<br>按需创建线程，可缓存 |  | 短期、异步任务|
| `ScheduledThreadPoolExecutor` | 支持定时和周期性任务 | DelayQueue<br/>执行所需事件短的先被执行 |定时任务、周期性任务 |
| `WorkStealingPool` | 基于Fork/Join框架，支持工作窃取 | |递归任务、分治算法 |

### 线程池的使用步骤

1. **定义任务**：实现`Runnable`或`Callable`接口
2. **创建线程池**：使用`ThreadPoolExecutor`构造函数
3. **提交任务**：使用`execute`或`submit`方法
4. **处理结果**：对于`Callable`任务，通过`Future`获取结果
5. **关闭线程池**：使用`shutdown`或`shutdownNow`方法

### 线程池使用的最佳实践

1. **明确线程池参数**：根据任务类型和系统资源合理配置线程池参数
2. **使用有界队列**：避免无界队列导致的内存溢出风险
3. **自定义线程工厂**：设置有意义的线程名称，便于调试
4. **处理异常**：确保线程池中的异常不会被忽略
5. **优雅关闭线程池**：在应用程序关闭时调用`shutdown`方法
6. **监控线程池**：定期检查线程池状态，避免资源泄漏
7. **避免过度使用线程池**：对于短时间任务，线程池的开销可能超过其带来的好处
8. **分离不同类型的任务**：对于CPU密集型和IO密集型任务，使用不同的线程池

## 工具类

### Executors

#### 创建线程池

::: warning
线程池不允许使用Executors去创建，而是通过ThreadPoolExecutor构造函数的方式。
Executors返回线程池对象的弊端：
+ FixedThreadPool和SingleThreadExecutor允许请求队列的长度为Integer.MAX_VALUE
+ CacheThreadPool和ScheduledThreadPool允许创建的线程数量为Integer.MAX_VALUE
:::

+ newFixedThreadPool(5); 创建固定大小的线程池
+ newSingleThreadExecutor();  创建单线程池
+ newCachedThreadPool();创建缓存线程池
+ newScheduledThreadPool(3); 创建定时线程池
+ newWorkStealingPool()
+ newSingleThreadScheduledExecutor()

#### 任务转换

### ExecutorCompletionService

ExecutorCompletionService是帮助获取多个Future执行结果的工具类。

## 高级并发工具

Java还提供了许多其他多线程工具，如`CountDownLatch`、`CyclicBarrier`、`Semaphore`和`CompletableFuture`等，用于处理更复杂的并发场景。
- `CountDownLatch` 用于等待一组线程完成。
    - 例如，将一个大型任务拆分为多个子任务，使用多个线程并行执行，主线程等待所有子任务完成后再汇总结果。
- `CyclicBarrier` 用于让一组线程相互等待，直到所有线程都到达某个屏障点（barrier point）后再继续执行。
    - 它的核心思想是通过屏障点控制线程的同步，支持重复使用和可选的屏障操作。
    - 例如，将一个任务分为多个阶段，每个阶段需要所有线程都完成后才能进入下一阶段。
- `Semaphore` 用于控制对共享资源的并发访问。
    - 它的核心思想是通过许可证限制线程数量，支持公平性和非公平性模式。
    - 常用于实现资源池、限流等功能。
- `CompletableFuture` 是 Java 8 引入的一个用于异步编程的类，它提供了更强大的功能和更方便的使用方式。

::: tip
+ `CyclicBarrier` 与 `CountDownLatch` 相比，`CyclicBarrier` 可以重复使用，因此适用于需要多次同步的场景。
+ 与锁相比，`Semaphore` 更适合需要控制并发数量的场景。
:::

### CountDownLatch

用于等待一组线程完成。

#### 实现原理

- `CountDownLatch` 内部维护一个计数器，初始化时需要指定一个正整数（`count`）。
- 每次调用 `countDown()` 方法时，计数器减 1。
- 当计数器减到 0 时，所有等待的线程（调用 `await()` 的线程）会被唤醒，继续执行。
- 一旦计数器减到 0，`CountDownLatch` 就不能再重置或重复使用。

#### 主要方法

+ `CountDownLatch(int count)`
    - 构造函数，初始化计数器。
+ `void await()`
    - 使当前线程等待，直到计数器减到 0。如果计数器已经是 0，则立即返回。
+ `boolean await(long timeout, TimeUnit unit)`
    - 使当前线程等待，直到计数器减到 0 或超时。返回 `true` 表示计数器减到 0，`false` 表示超时。
+ `void countDown()`
    - 将计数器减 1。如果计数器减到 0，则唤醒所有等待的线程。
+ `long getCount()`
    - 返回当前计数器的值。

#### 代码示例

以下是一个简单的示例，演示如何使用 `CountDownLatch` 实现主线程等待多个子线程完成任务：

```java
import java.util.concurrent.CountDownLatch;

public class CountDownLatchExample {
    public static void main(String[] args) throws InterruptedException {
        int threadCount = 5;
        CountDownLatch latch = new CountDownLatch(threadCount);
        for (int i = 0; i < threadCount; i++) {
            new Thread(() -> {
                System.out.println(Thread.currentThread().getName() + " is working...");
                try {
                    Thread.sleep(1000); // 模拟任务执行
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                System.out.println(Thread.currentThread().getName() + " has finished.");
                latch.countDown(); // 计数器减 1
            }).start();
        }
        latch.await(); // 主线程等待所有子线程完成任务
        System.out.println("All threads have finished. Main thread continues.");
    }
}
```


### CyclicBarrier
用于让一组线程相互等待，直到所有线程都到达某个屏障点（barrier point）后再继续执行。

#### 实现原理
- 所有线程必须等待其他线程都到达屏障点后才能继续执行。
- 当最后线程到达屏障点时，可以执行一个可选的屏障操作（`Runnable`），然后所有线程继续执行。
- `CyclicBarrier` 的计数器可以重置，因此可以多次使用。
- 调用 `await()` 的线程会被阻塞，直到所有线程都调用了 `await()`。

#### 主要方法

+ `CyclicBarrier(int parties)`
    - 构造函数，指定需要等待的线程数（`parties`）。
+ `CyclicBarrier(int parties, Runnable barrierAction)`
    - 构造函数，指定需要等待的线程数和一个屏障操作（`barrierAction`）。
    - 最后一个到达屏障点的线程会执行 `barrierAction`。
+ `int await()`
    - 使当前线程等待，直到所有线程都调用了 `await()`。
    - 返回当前线程的到达索引（从 0 开始）。
+ `int await(long timeout, TimeUnit unit)`
    - 使当前线程等待，直到所有线程都调用了 `await()` 或超时。
    - 如果超时，会抛出 `TimeoutException`。
+ `int getParties()`
    - 返回需要等待的线程数。
+ `int getNumberWaiting()`
    - 返回当前正在等待的线程数。
+ `boolean isBroken()`
    - 判断屏障是否被破坏（例如，某个线程被中断或超时）。
+ `void reset()`
    - 重置屏障，使其可以重新使用。如果屏障被破坏，可以调用该方法。

#### 代码示例

以下是一个简单的示例，演示如何使用 `CyclicBarrier` 实现多线程分阶段执行：

```java
import java.util.concurrent.BrokenBarrierException;
import java.util.concurrent.CyclicBarrier;

public class CyclicBarrierExample {
    public static void main(String[] args) {
        int threadCount = 3;
        CyclicBarrier barrier = new CyclicBarrier(threadCount, () -> {
            System.out.println("All threads have reached the barrier. Proceeding to the next phase.");
        });

        for (int i = 0; i < threadCount; i++) {
            new Thread(() -> {
                System.out.println(Thread.currentThread().getName() + " is working on phase 1.");
                try {
                    Thread.sleep(1000); // 模拟任务执行
                    barrier.await(); // 等待其他线程
                } catch (InterruptedException | BrokenBarrierException e) {
                    e.printStackTrace();
                }

                System.out.println(Thread.currentThread().getName() + " is working on phase 2.");
                try {
                    Thread.sleep(1000); // 模拟任务执行
                    barrier.await(); // 等待其他线程
                } catch (InterruptedException | BrokenBarrierException e) {
                    e.printStackTrace();
                }

                System.out.println(Thread.currentThread().getName() + " has finished.");
            }).start();
        }
    }
}
```

### Semaphore

`Semaphore` 用于控制对共享资源的访问。它通过维护一组许可证（permits）来限制同时访问资源的线程数量，常用于以下场景：
+ 资源池：例如，数据库连接池、线程池等，限制同时访问资源的线程数量。
+ 限流：例如，限制同时处理的请求数量，防止系统过载。
+ 生产者-消费者模型：使用 `Semaphore` 控制生产者和消费者的并发数量。

#### 实现原理

+ `Semaphore` 内部维护一个许可证计数器，初始化时可以指定许可证的数量。
+ 线程访问资源前需要获取许可证（调用 `acquire()`）
+ 访问完成后释放许可证（调用 `release()`）
+ 如果许可证数量为 0，线程会被阻塞，直到有其他线程释放许可证。
+ `Semaphore` 支持公平模式和非公平模式。
    - 在公平模式下，线程按照请求许可证的顺序获取许可证。
    - 在非公平模式下，线程可能会插队获取许可证。

::: warning
+ 确保线程在使用完资源后释放许可证，否则可能导致其他线程无法访问资源。
+ 如果线程在获取许可证后发生异常，确保在 `finally` 块中释放许可证。
:::

#### 主要方法

+ `Semaphore(int permits)`：
    - 构造函数，指定许可证的数量。
+ `Semaphore(int permits, boolean fair)`：
    - 构造函数，指定许可证的数量和公平性（`true` 表示公平模式，`false` 表示非公平模式）。
+ `void acquire()`：
    - 获取一个许可证，如果没有可用的许可证，则当前线程会被阻塞，直到获取到许可证。
+ `void acquire(int permits)`：
    - 获取指定数量的许可证。
+ `void release()`：
    - 释放一个许可证。
+ `void release(int permits)`：
    - 释放指定数量的许可证。
+ `boolean tryAcquire()`：
    - 尝试获取一个许可证，如果成功则返回 `true`，否则返回 `false`。
+ `boolean tryAcquire(long timeout, TimeUnit unit)`：
    - 在指定时间内尝试获取一个许可证，如果成功则返回 `true`，否则返回 `false`。
+ `int availablePermits()`：
    - 返回当前可用的许可证数量。
+ `boolean isFair()`：
    - 判断 `Semaphore` 是否是公平模式。
+ `void drainPermits()`：
    - 获取并返回所有可用的许可证。

#### 代码示例

以下是一个简单的示例，演示如何使用 `Semaphore` 实现资源池：

```java
import java.util.concurrent.Semaphore;

public class SemaphoreExample {
    public static void main(String[] args) {
        int poolSize = 3;
        Semaphore semaphore = new Semaphore(poolSize);

        for (int i = 0; i < 10; i++) {
            new Thread(() -> {
                try {
                    semaphore.acquire(); // 获取许可证
                    System.out.println(Thread.currentThread().getName() + " is using the resource.");
                    Thread.sleep(1000); // 模拟资源使用
                    System.out.println(Thread.currentThread().getName() + " has finished using the resource.");
                } catch (InterruptedException e) {
                    e.printStackTrace();
                } finally {
                    semaphore.release(); // 释放许可证
                }
            }).start();
        }
    }
}
```


### CompletableFuture
`CompletableFuture` 是 Java 8 引入的一个强大的并发编程工具，它实现了 `CompletionStage` 接口和 `Future` 接口，并提供了更丰富的功能来处理异步任务。与传统的 `Future` 相比，`CompletableFuture` 支持任务结果的依赖、组合、异常处理等高级特性，使得异步编程更加灵活和高效。

CompletableFuture 默认使用 `ForkJoinPool.commonPool()` 线程池执行任务，也可以指定自定义线程池。

:::tip
`CompletableFuture` 是 `Future` 的增强版，它不仅表示异步计算的结果，还提供了丰富的 API 来处理异步任务的执行过程，如任务依赖、组合和异常处理等。
:::

#### 核心特性

+ 异步任务执行：支持任务的异步执行，并可以在任务完成后触发回调。
+ 任务依赖：可以将多个任务串联起来，形成任务链。
+ 任务组合：支持将多个任务的结果组合起来。
+ 异常处理：提供了异常处理的机制。
+ 手动完成任务：可以手动设置任务的结果或异常。

#### 创建异步任务

CompletableFuture创建异步任务，一般有supplyAsync和runAsync两个方法

![](https://cdn.nlark.com/yuque/0/2024/webp/21987629/1715564492359-1d339f24-de57-4821-9381-a7e6d598c34c.webp)

+ supplyAsync执行CompletableFuture任务，支持返回值
+ runAsync执行CompletableFuture任务，没有返回值。

##### supplyAsync

```java
//使用默认内置线程池ForkJoinPool.commonPool()，根据supplier构建执行任务

public static <U> CompletableFuture<U> supplyAsync(Supplier<U> supplier)

//自定义线程，根据supplier构建执行任务

public static <U> CompletableFuture<U> supplyAsync(Supplier<U> supplier, Executor executor)

```

```java
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

public class Main {
    public static void main(String[] args) throws ExecutionException, InterruptedException {
        CompletableFuture<String> future = CompletableFuture.supplyAsync(() -> {
            try {
                Thread.sleep(1000); // 模拟任务执行
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            return "Task Result";
        });

        // 获取任务结果
        String result = future.get();
        System.out.println("Result: " + result);
    }
}
```

##### runAsync方法

```
//使用默认内置线程池ForkJoinPool.commonPool()，根据runnable构建执行任务

public static CompletableFuture<Void> runAsync(Runnable runnable) 

//自定义线程，根据runnable构建执行任务

public static CompletableFuture<Void> runAsync(Runnable runnable,  Executor executor)

```

```java
import java.util.concurrent.CompletableFuture;

public class Main {
    public static void main(String[] args) {
        CompletableFuture<Void> future = CompletableFuture.runAsync(() -> {
            try {
                Thread.sleep(1000); // 模拟任务执行
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println("Task Executed");
        });

        future.join(); // 等待任务完成
    }
}
```

#### 任务依赖与组合

![画板](https://cdn.nlark.com/yuque/0/2025/jpeg/21987629/1738822955998-5c8cbc2c-40b8-4ef7-8d0e-b677ebddcefe.jpeg)

```java
CompletableFuture<String> future = CompletableFuture.supplyAsync(() -> {
    simulateTask("查询数据库");
    return "查询结果";
});

future.thenApply(result -> {
    // 对结果进行处理
    return "处理后的结果：" + result;
}).thenAccept(processedResult -> {
    // 消费处理后的结果
    System.out.println("最终结果：" + processedResult);
}).thenRun(() -> {
    // 执行一些不需要前一个结果的操作
    System.out.println("所有操作完成");
});
```

#### 使用注意事项

CompletableFuture 使我们的异步编程更加便利的、代码更加优雅的同时，我们也要关注下它，使用的一些注意点。

![](https://cdn.nlark.com/yuque/0/2024/webp/21987629/1715565574455-e6029c3d-4ae3-489c-ab79-4e6d991354a4.webp)

##### 默认线程池的注意点

CompletableFuture代码中又使用了默认的线程池，处理的线程个数是电脑CPU核数-1。在大量请求过来的时候，处理逻辑复杂的话，响应会很慢。一般建议使用自定义线程池，优化线程池配置参数。

##### 自定义线程池时，注意饱和策略

CompletableFuture的get()方法是阻塞的，我们一般建议使用future.get(3, TimeUnit.SECONDS)。并且一般建议使用自定义线程池。

但是如果线程池拒绝策略是DiscardPolicy或者DiscardOldestPolicy，当线程池饱和时，会直接丢弃任务，不会抛弃异常。因此建议，CompletableFuture线程池策略最好使用AbortPolicy，然后耗时的异步线程，做好线程池隔离哈。

#### 代码示例

```java
//异步
public static void test(){
    HttpClient httpClient = HttpClient.newHttpClient();
    HttpRequest httpRequest = HttpRequest.newBuilder(URI.create("http://www.baidu.com")).build();
    HttpResponse.BodyHandler<String> stringBodyHandler = HttpResponse.BodyHandlers.ofString();

    CompletableFuture<HttpResponse<String>> sendAsync = httpClient.sendAsync(httpRequest, stringBodyHandler);
    HttpResponse<String> rep = sendAsync.join();
    String body = rep.body();
    System.out.println(body);
}
```

## SpringBoot中的线程池

SpringBoot中的线程池：ThreadPoolTaskExecutor

:::tips
Spring 通过任务执行器（TaskExecutor）来实现多线程和并发编程，该接口与juc的 Executor 接口完全相同。  
SpringBoot中的线程池ThreadPoolTaskExecutor对应juc的ThreadPoolExecutor。
:::

## 常见对比

### CountDownLatch VS CyclicBarrier

| 特性 | CountDownLatch | CyclicBarrier |
| --- | --- | --- |
| 计数器重置 | 不可重置 | 可重置 |
| 使用场景 | 一个线程等待多个线程完成任务 | 多个线程相互等待 |
| 调用方法 | `countDown()` 和 `await()` | `await()` |
| 重复使用 | 不支持 | 支持 |

### Semaphore VS 锁

| 特性 | Semaphore | 锁（如 ReentrantLock） |
| --- | --- | --- |
| 控制方式 | 控制访问资源的线程数量 | 控制对共享资源的独占访问 |
| 许可证数量 | 可以设置多个许可证 | 只有一个锁 |
| 公平性 | 支持公平和非公平模式 | 支持公平和非公平模式 |
| 适用场景 | 资源池、限流等 | 临界区保护 |

### Runnable vs Callable

| | Runnable | Callable |
| --- | --- | --- |
| JAVA | 1.0 | 1.5 |
| 返回结果 | × | √ |
| 检查异常 | × | √ |
| | | |

工具类Executors可以实现两者的相互转换

### CompletableFuture vs ExecutorService

| | CompletableFuture | ExecutorService |
| --- | --- | --- |
| 有返回值 | supplyAsync | submit |
| 无返回值 | runAsync | execute |

## 注意事项
线程池不允许使用Executors去创建，而是通过ThreadPoolExecutor构造函数的方式
