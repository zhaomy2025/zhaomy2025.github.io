# jstack - JVM 线程分析工具

jstack 是 JDK 内置的线程转储和分析工具，用于生成 Java 应用的线程堆栈信息，是排查线程死锁、线程饥饿、CPU 占用过高等问题的必备工具。通过 jstack 可以快速定位问题线程，分析线程状态，为性能优化提供重要依据。

## 工具概述

jstack 通过向目标 JVM 进程发送信号，获取该进程中所有线程的堆栈信息。该工具在诊断并发问题时非常有效，特别是对于发现死锁、分析线程竞争和定位 CPU 热点方法等场景有着不可替代的作用。

**工具特点**：
- 无侵入性：不需要修改应用代码或配置
- 快速获取：生成线程转储的时间很短
- 详细信息：包含线程状态、锁信息和堆栈跟踪
- 兼容性好：支持所有 JDK 8 及以上版本

**主要用途**：
- 检测线程死锁
- 分析线程阻塞原因
- 定位 CPU 占用过高的线程
- 排查线程饥饿问题
- 分析线程竞争热点

## 安装与基本使用

### 环境要求

jstack 随 JDK 提供，确保环境变量中配置了 `JAVA_HOME`，使其 `bin` 目录下的 jstack 可执行文件可在命令行中直接调用。

```bash
# 验证 jstack 是否可用
jstack -?

# 查看 jstack 版本
java -version
```

### 基本语法

```bash
jstack [options] <pid>
```

**常用选项**：

| 选项 | 说明 |
|-----|------|
| `-F` | 强制生成线程转储（当正常方式失败时） |
| `-m` | 混合模式，同时输出 Java 和本地方法的堆栈 |
| `-l` | 长列表模式，显示锁的详细信息 |
| `-h` | 显示帮助信息 |

### 快速入门示例

```bash
# 查看进程 ID
jps -l

# 生成线程转储
jstack 12345

# 强制生成转储（当正常方式无响应时）
jstack -F 12345

# 混合模式（包含本地方法）
jstack -m 12345

# 长列表模式（包含锁信息）
jstack -l 12345 > thread-dump.log

# 组合使用
jstack -lm 12345 > thread-dump-detailed.log
```

## 线程状态分析

### 理解线程状态

在分析线程转储之前，需要了解 Java 线程的几种状态：

```
线程状态流转图：

NEW (新建)
    ↓
RUNNABLE (可运行)
    │
    ├─→ 等待锁 → BLOCKED (阻塞)
    │
    ├─→ 等待条件 → WAITING (等待)
    │
    ├─→ 超时等待 → TIMED_WAITING (限时等待)
    │
    └─→ 运行完成 → TERMINATED (终止)

BLOCKED/WAITING/TIMED_WAITING
    ↓
RUNNABLE (锁释放/条件满足)
```

**状态说明**：

| 状态 | 说明 | 常见场景 |
|-----|------|---------|
| NEW | 线程已创建但未启动 | new Thread() 后未 start() |
| RUNNABLE | 可运行状态 | 正在执行或等待 CPU 调度 |
| BLOCKED | 阻塞状态 | 等待进入 synchronized 块 |
| WAITING | 等待状态 | wait()、join()、LockSupport.park() |
| TIMED_WAITING | 限时等待 | Thread.sleep()、wait(timeout)、join(timeout) |
| TERMINATED | 终止状态 | 线程执行完毕 |

### 解读线程转储

**线程转储示例**：

```text
"pool-1-thread-50" #50 daemon prio=10 os_prio=0 tid=0x00007f8c4c010800 nid=0x7f3a waiting on condition [0x00007f8c4a7f6000]
   java.lang.Thread.State: TIMED_WAITING (parking)
        at java.util.concurrent.locks.LockSupport.parkNanos
        - waiting on <0x00000000c0b3d8a0> (a java.util.concurrent.LinkedBlockingQueue)
        at java.util.concurrent.ThreadPoolExecutor$Worker.run
        at java.lang.Thread.run
        at java.util.concurrent.ThreadPoolExecutor$Worker.run
        at java.util.concurrent.Executors$RunnableAdapter.call
        at java.util.concurrent.FutureTask.run
        at java.util.concurrent.FutureTask.run
        at java.util.concurrent.locks.LockSupport.parkNanos(<unknown>:1)
   - parking to wait for  <0x00000000c0b3d8a0> (a java.util.concurrent.LinkedBlockingQueue)
       locked <0x00000000c0b3d8a0> (a java.util.concurrent.LinkedBlockingQueue)

"main" #1 prio=5 os_prio=0 tid=0x00007f8c4c001000 nid=0x7f3b runnable [0x00007f8c4c00a000]
   java.lang.Thread.State: RUNNABLE
        at java.io.FileInputStream.readBytes(Native Method)
        at java.io.FileInputStream.read(FileInputStream.java:255)
        at java.io.BufferedInputStream.read(BufferedInputStream.java:345)
        at java.io.FilterInputStream.read(FilterInputStream.java:133)
        at com.example.MyApplication.main(MyApplication.java:45)
```

**关键信息解读**：

| 信息 | 说明 |
|-----|------|
| "pool-1-thread-50" | 线程名称 |
| #50 | 线程编号 |
| daemon | 守护线程 |
| prio=10 | 线程优先级 |
| nid=0x7f3a | 操作系统线程 ID (16 进制) |
| waiting on condition | 等待原因 |
| java.lang.Thread.State | 线程状态 |
| locked | 持有的锁 |

## 死锁检测

### 死锁特征识别

死锁是最严重的并发问题，jstack 可以自动检测并报告死锁。

**死锁转储示例**：

```text
Found one Java-level deadlock:
=============================
"Thread-1":
  waiting to lock Monitor 0x00007f8c4c01a800 (Object 0x00000000c0a0a4c0),
  which is held by "Thread-2"
"Thread-2":
  waiting to lock Monitor 0x00007f8c4c01b800 (Object 0x00000000c0a0a4d0),
  which is held by "Thread-1"

Found 1 deadlock.
```

**死锁信息说明**：

| 信息 | 说明 |
|-----|------|
| Thread-1 | 死锁线程名称 |
| waiting to lock | 等待获取的锁 |
| which is held by | 持有该锁的线程 |

### 死锁排查实战

**场景**：两个线程相互等待对方持有的锁

**问题代码示例**：

```java
public class DeadlockDemo {
    private static final Object lock1 = new Object();
    private static final Object lock2 = new Object();
    
    public static void main(String[] args) {
        // 线程 1：先获取 lock1，再尝试获取 lock2
        new Thread(() -> {
            synchronized (lock1) {
                System.out.println("Thread 1: holding lock1");
                try { Thread.sleep(100); } catch (InterruptedException e) {}
                synchronized (lock2) {
                    System.out.println("Thread 1: acquired lock2");
                }
            }
        }, "Deadlock-Thread-1").start();
        
        // 线程 2：先获取 lock2，再尝试获取 lock1
        new Thread(() -> {
            synchronized (lock2) {
                System.out.println("Thread 2: holding lock2");
                try { Thread.sleep(100); } catch (InterruptedException e) {}
                synchronized (lock1) {
                    System.out.println("Thread 2: acquired lock1");
                }
            }
        }, "Deadlock-Thread-2").start();
    }
}
```

**使用 jstack 检测死锁**：

```bash
# 编译并运行
javac DeadlockDemo.java
java DeadlockDemo

# 新开终端，获取进程 ID 并检测死锁
jps -l | grep DeadlockDemo
# 输出: 12345 DeadlockDemo

# 生成线程转储（会自动检测死锁）
jstack 12345

# 或者使用 -l 选项获取更详细的锁信息
jstack -l 12345
```

**死锁解决方案**：

```java
// 方案 1：统一锁的获取顺序
public void safeMethod() {
    // 始终先获取 lock1，再获取 lock2
    synchronized (lock1) {
        synchronized (lock2) {
            // 业务逻辑
        }
    }
}

// 方案 2：使用 tryLock 超时机制
public boolean tryLockMethod() {
    try {
        if (lock1.tryLock(1, TimeUnit.SECONDS)) {
            try {
                if (lock2.tryLock(1, TimeUnit.SECONDS)) {
                    try {
                        // 业务逻辑
                        return true;
                    } finally {
                        lock2.unlock();
                    }
                }
            } finally {
                lock1.unlock();
            }
        }
    } catch (InterruptedException e) {
        Thread.currentThread().interrupt();
    }
    return false;
}
```

### 自动死锁检测脚本

```bash
#!/bin/bash
# check-deadlock.sh - 自动检测死锁脚本

PID=$1

if [ -z "$PID" ]; then
    echo "用法: $0 <PID>"
    exit 1
fi

echo "=== 检测进程 $PID 的死锁 ==="

# 生成线程转储
DUMP=$(jstack -l $PID)

# 检查是否包含死锁信息
if echo "$DUMP" | grep -q "Found one Java-level deadlock"; then
    echo "⚠️  发现死锁！"
    echo ""
    echo "=== 死锁详情 ==="
    echo "$DUMP" | grep -A 20 "Found one Java-level deadlock"
    
    # 提取死锁线程信息
    echo ""
    echo "=== 死锁线程分析 ==="
    DEADLOCK_THREADS=$(echo "$DUMP" | grep -E "^\"[A-Za-z0-9-]+\":" | grep -A 5 "waiting to lock" | grep "Thread")
    echo "$DEADLOCK_THREADS"
    
    # 发送告警
    echo "检测到死锁，请立即处理！"
else
    echo "✅ 未发现死锁"
fi
```

## 线程阻塞分析

### BLOCKED 状态分析

BLOCKED 状态的线程通常在等待获取 synchronized 锁。

**BLOCKED 线程示例**：

```text
"pool-1-thread-2" #15 prio=5 os_prio=0 tid=0x00007f8c4c015000 nid=0x7f3c waiting for monitor entry [0x00007f8c4d8f6000]
   java.lang.Thread.State: BLOCKED (on object monitor)
        at com.example.Service.methodB(Service.java:20)
        - waiting to lock <0x00000000c0a0a4c0> (a com.example.Service)
        at com.example.Service.methodA(Service.java:15)
        at com.example.Main$1.run(Main.java:10)
```

**分析要点**：

1. **waiting to lock**：线程正在等待的锁对象
2. **locked by**：被哪个线程持有（可以从其他线程的堆栈中找到）
3. **锁竞争激烈程度**：BLOCKED 线程数量

### WAITING 状态分析

WAITING 状态的线程正在等待某个条件满足。

**WAITING 线程示例**：

```text
"pool-1-thread-1" #14 prio=5 os_prio=0 tid=0x00007f8c4c014000 nid=0x7f3b waiting on condition [0x00007f8c4d7e5000]
   java.lang.Thread.State: WAITING (parking)
        at java.util.concurrent.locks.LockSupport.park
        - waiting on <0x00000000c0b3d8a0> (a java.util.concurrent.LinkedBlockingQueue)
        at java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:2871)
        at java.lang.Thread.run(Thread.java:833)
```

**常见 WAITING 原因**：

| 等待原因 | 说明 | 解决方案 |
|---------|------|---------|
| LockSupport.park() | 使用锁同步器等待 | 检查锁释放逻辑 |
| Object.wait() | 对象条件等待 | 检查 notify/notifyAll |
| Thread.join() | 线程等待 | 检查线程完成状态 |
| Future.get() | 异步结果等待 | 检查任务执行情况 |

### 线程阻塞分析脚本

```bash
#!/bin/bash
# analyze-threads.sh - 分析线程阻塞情况

PID=$1

if [ -z "$PID" ]; then
    echo "用法: $0 <PID>"
    exit 1
fi

echo "=== 线程状态分析 (进程: $PID) ==="
echo ""

# 生成线程转储
DUMP=$(jstack $PID)

# 统计各状态线程数量
echo "--- 线程状态统计 ---"
RUNNABLE=$(echo "$DUMP" | grep -c "java.lang.Thread.State: RUNNABLE")
BLOCKED=$(echo "$DUMP" | grep -c "java.lang.Thread.State: BLOCKED")
WAITING=$(echo "$DUMP" | grep -c "java.lang.Thread.State: WAITING")
TIMED_WAITING=$(echo "$DUMP" | grep -c "java.lang.Thread.State: TIMED_WAITING")

echo "RUNNABLE: $RUNNABLE"
echo "BLOCKED: $BLOCKED"
echo "WAITING: $WAITING"
echo "TIMED_WAITING: $TIMED_WAITING"

echo ""
echo "--- BLOCKED 线程详情 ---"
echo "$DUMP" | grep -A 10 "java.lang.Thread.State: BLOCKED"

echo ""
echo "--- 锁竞争分析 ---"
# 统计每个锁的等待线程数
echo "$DUMP" | grep -B 5 "waiting to lock" | grep "Thread" | cut -d'"' -f2 | sort | uniq -c | sort -rn | head -10

echo ""
echo "--- 建议 ---"
if [ "$BLOCKED" -gt 10 ]; then
    echo "⚠️  存在大量 BLOCKED 线程，建议检查锁使用策略"
fi
if [ "$WAITING" -gt 50 ]; then
    echo "⚠️  存在大量 WAITING 线程，建议检查线程池配置"
fi
```

## CPU 热点分析

### 定位 CPU 占用高的线程

当服务器 CPU 使用率过高时，可以通过 jstack 结合其他工具定位热点代码。

**分析步骤**：

```bash
# Step 1：查看系统进程 CPU 使用情况
top

# Step 2：查看线程 CPU 使用情况
top -H -p <PID>

# Step 3：找到 CPU 占用最高的线程 ID（十进制）
# 假设线程 ID 为 12345

# Step 4：将线程 ID 转换为 16 进制
printf "%x\n" 12345
# 输出: 3039

# Step 5：在 jstack 输出中查找该线程
jstack <PID> | grep -A 20 " nid=0x3039"
```

**完整示例**：

```bash
#!/bin/bash
# find-cpu-hotspot.sh - 定位 CPU 热点线程

PID=$1

if [ -z "$PID" ]; then
    echo "用法: $0 <PID>"
    exit 1
fi

echo "=== CPU 热点分析 (进程: $PID) ==="

# 获取 CPU 占用最高的线程
TOP_THREAD=$(top -H -p $PID -b -n 1 | tail -n +8 | sort -k9 -rn | head -1)
THREAD_PID=$(echo $TOP_THREAD | awk '{print $1}')
THREAD_CPU=$(echo $TOP_THREAD | awk '{print $9}')

echo "CPU 占用最高的线程 PID: $THREAD_PID"
echo "CPU 使用率: $THREAD_CPU%"

# 转换为 16 进制
HEX_TID=$(printf "%x" $THREAD_PID)
echo "线程 16 进制 ID: 0x$HEX_TID"

echo ""
echo "=== 线程堆栈 ==="
jstack $PID | grep -A 50 "nid=0x$HEX_TID"

echo ""
echo "=== 热点方法分析 ==="
# 提取堆栈中的方法调用
jstack $PID | grep -A 50 "nid=0x$HEX_TID" | grep -E "at [a-zA-Z]" | sed 's/.*at //' | awk -F'(' '{print $1}' | sort | uniq -c | sort -rn | head -10
```

### 持续 CPU 监控

```bash
#!/bin/bash
# cpu-monitor.sh - 持续监控 CPU 热点

PID=$1
INTERVAL=${2:-5}

if [ -z "$PID" ]; then
    echo "用法: $0 <PID> [interval]"
    exit 1
fi

echo "=== 持续 CPU 热点监控 ==="
echo "进程: $PID"
echo "监控间隔: ${INTERVAL}秒"
echo ""

while true; do
    echo "--- $(date) ---"
    
    # 获取 CPU 最高的 3 个线程
    TOP_THREADS=$(top -H -p $PID -b -n 1 | tail -n +8 | sort -k9 -rn | head -3)
    
    echo "$TOP_THREADS" | while read line; do
        TID=$(echo $line | awk '{print $1}')
        CPU=$(echo $line | awk '{print $9}')
        HEX_TID=$(printf "%x" $TID)
        
        echo "线程 $TID (0x$HEX_TID): CPU ${CPU}%"
        jstack $PID 2>/dev/null | grep -A 5 "nid=0x$HEX_TID" | head -6
        echo ""
    done
    
    sleep $INTERVAL
done
```

## 线程Dump可视化分析

### 使用在线工具分析

生成线程转储后，可以使用以下工具进行可视化分析：

| 工具 | 说明 | 链接 |
|-----|------|------|
| FastThread | 在线线程分析工具 | https://fastthread.io/ |
| Thread Dump Analyzer | 高级分析工具 | https://threaddumpmonitor.com/ |
| IBM Thread Analyzer | 老牌分析工具 | https://www.ibm.com/ |

### 本地分析脚本

```bash
#!/bin/bash
# analyze-thread-dump.sh - 线程转储分析

DUMP_FILE=$1

if [ -z "$DUMP_FILE" ]; then
    echo "用法: $0 <thread-dump-file>"
    exit 1
fi

echo "=== 线程转储分析报告 ==="
echo "分析文件: $DUMP_FILE"
echo "分析时间: $(date)"
echo ""

# 基本统计
TOTAL_THREADS=$(grep -c "^\\\"[^\\\"]*\\\" #" $DUMP_FILE)
echo "总线程数: $TOTAL_THREADS"

# 线程状态统计
echo ""
echo "--- 线程状态分布 ---"
grep -o "java.lang.Thread.State: [A-Z_]*" $DUMP_FILE | sort | uniq -c | sort -rn

# 守护线程统计
DAEMON_THREADS=$(grep -c "daemon" $DUMP_FILE)
echo ""
echo "守护线程数: $DAEMON_THREADS"

# 死锁检测
if grep -q "Found one Java-level deadlock" $DUMP_FILE; then
    echo ""
    echo "⚠️  发现死锁！"
    echo "--- 死锁详情 ---"
    grep -A 30 "Found one Java-level deadlock" $DUMP_FILE
else
    echo ""
    echo "✅ 未发现死锁"
fi

# 线程池分析
echo ""
echo "--- 线程池分析 ---"
grep -E "pool-[0-9]+-thread-[0-9]+" $DUMP_FILE | cut -d'"' -f2 | sed 's/#.*//' | sort | uniq -c | sort -rn | head -10

# 锁竞争分析
echo ""
echo "--- 锁竞争分析 ---"
grep "waiting to lock" $DUMP_FILE | awk '{print $NF}' | sed 's/<//;s/>//' | sort | uniq -c | sort -rn | head -10

# 热点方法
echo ""
echo "--- 热点方法 TOP 10 ---"
grep "at " $DUMP_FILE | sed 's/.*at //' | awk -F'(' '{print $1}' | sort | uniq -c | sort -rn | head -10
```

## 混合模式与本地方法

### 使用 -m 选项查看本地方法

`-m` 选项可以同时显示 Java 方法和本地方法（如 native 方法）的堆栈。

```bash
# 混合模式输出
jstack -m <PID>
```

**输出示例**：

```
"main" #1 prio=5 os_prio=0 tid=0x00007f8c4c001000 nid=0x7f3b runnable [0x00007f8c4c00a000]
   java.lang.Thread.State: RUNNABLE
        at java.io.FileInputStream.readBytes(Native Method)
        at java.io.FileInputStream.read(FileInputStream.java:255)
        at java.io.BufferedInputStream.read(BufferedInputStream.java:345)
        at com.example.NativeLib.read(NativeLib.java:42)
        at com.example.Buffer.read(Buffer.java:115)
        at com.example.Main.main(Main.java:45)
```

**本地方法分析要点**：

- native 方法通常在堆栈顶部或接近顶部
- 可以帮助定位JNI调用问题
- 区分 Java 代码问题和 native 代码问题

### 分析 JNI 相关问题

```bash
# 查看包含 JNI 调用的线程
jstack -m <PID> | grep -E "JNI|java.lang.Object"

# 监控 JNI 内存使用
jcmd <PID> VM.native_memory summary 2>/dev/null | grep -A 5 "JNI"
```

## 远程线程转储

### JMX 远程连接

要获取远程 JVM 的线程转储，需要配置 JMX 或使用 jcmd。

```bash
# 方法 1：使用 jcmd
jcmd <PID> Thread.print

# 方法 2：通过 JMX 远程连接
# 在远程 JVM 启动时添加 JMX 参数
java -Dcom.sun.management.jmxremote \
     -Dcom.sun.management.jmxremote.port=9010 \
     -Dcom.sun.management.jmxremote.ssl=false \
     -Dcom.sun.management.jmxremote.authenticate=false \
     -jar app.jar

# 使用 jstack 远程连接
jstack user@hostname:9010
```

### SSH 隧道方式

```bash
# 创建 SSH 隧道
ssh -L 9010:localhost:9010 user@hostname

# 在本地连接
jstack localhost:9010
```

## 最佳实践

### 何时使用 jstack

**适用场景**：
- 响应变慢或无响应
- CPU 使用率异常升高
- 怀疑存在死锁
- 线程数量异常增长
- 排查线程竞争问题

**不适用场景**：
- 瞬时性问题（建议使用 JFR 持续录制）
- 需要详细性能分析（建议使用 Async Profiler）
- 生产环境持续监控（建议使用 JFR）

### 生成线程转储的最佳时机

```bash
# 问题复现时立即生成
jstack <PID> > threaddump-$(date +%Y%m%d-%H%M%S).log

# 多次生成以对比分析
for i in {1..5}; do
    jstack <PID> > threaddump-$i.log
    sleep 10
done

# 结合 CPU 监控生成
top -H -p <PID> -b -n 3 > cpu-usage.log &
jstack <PID> > threaddump.log
```

### 性能影响

jstack 是一个轻量级工具，其性能影响很小：

| 操作 | CPU 开销 | 延迟影响 | 建议 |
|-----|---------|---------|------|
| 正常 jstack | < 1% | < 10ms | 可频繁使用 |
| jstack -F | 1-2% | < 50ms | 问题排查时使用 |
| jstack -m | 1-2% | < 50ms | 深度分析时使用 |

### 常见问题排查

**问题 1：jstack 无响应**

```bash
# 使用 -F 强制生成
jstack -F <PID>

# 或使用 jcmd
jcmd <PID> Thread.print
```

**问题 2：线程状态为 "Unknown"**

```bash
# 可能是进程正在退出
# 尝试多次执行
jstack <PID>

# 或等待进程稳定后重试
```

**问题 3：输出不完整**

```bash
# 增加超时时间
timeout 30 jstack -l <PID> > output.log

# 或分批次获取
jstack -l <PID> | head -1000 > part1.log
```

## 与其他工具集成

### jstack + JMC

```bash
# 使用 jstack 获取初步信息
jstack <PID> > initial-dump.log

# 结合 JMC 进行深入分析
jmc -open <PID>
```

### jstack + VisualVM

```bash
# 启动 VisualVM
jvisualvm

# 通过 JMX 连接远程 JVM
# Thread 标签页提供可视化线程分析
```

### jstack + Prometheus + Grafana

```bash
#!/bin/bash
# export-thread-metrics.sh - 导出线程指标到 Prometheus

PID=$1
OUTPUT_FILE=/tmp/thread-metrics.prom

# 生成线程转储
DUMP=$(jstack $PID)

# 提取指标
TOTAL_THREADS=$(grep -c "^\\\"[^\\\"]*\\\" #" <<< "$DUMP")
RUNNABLE=$(grep -c "java.lang.Thread.State: RUNNABLE" <<< "$DUMP")
BLOCKED=$(grep -c "java.lang.Thread.State: BLOCKED" <<< "$DUMP")
WAITING=$(grep -c "java.lang.Thread.State: WAITING" <<< "$DUMP")
TIMED_WAITING=$(grep -c "java.lang.Thread.State: TIMED_WAITING" <<< "$DUMP")

# 输出 Prometheus 格式
cat > $OUTPUT_FILE << EOF
# HELP jvm_threads_total Total number of JVM threads
# TYPE jvm_threads_total gauge
jvm_threads_total $TOTAL_THREADS
# HELP jvm_threads_runnable Number of runnable threads
# TYPE jvm_threads_runnable gauge
jvm_threads_runnable $RUNNABLE
# HELP jvm_threads_blocked Number of blocked threads
# TYPE jvm_threads_blocked gauge
jvm_threads_blocked $BLOCKED
# HELP jvm_threads_waiting Number of waiting threads
# TYPE jvm_threads_waiting gauge
jvm_threads_waiting $WAITING
# HELP jvm_threads_timed_waiting Number of timed waiting threads
# TYPE jvm_threads_timed_waiting gauge
jvm_threads_timed_waiting $TIMED_WAITING
EOF

echo "指标已导出到 $OUTPUT_FILE"
```

## 常见问题 FAQ

### Q1：如何区分守护线程和用户线程？

在 jstack 输出中，守护线程会标注 `daemon` 标记：

```text
"Service Thread" #7 daemon prio=9 os_prio=0 tid=...  // 守护线程
"main" #1 prio=5 os_prio=0 tid=...                   // 用户线程
```

### Q2：线程数多少算正常？

线程数量取决于应用特性：

| 应用类型 | 典型线程数 | 说明 |
|---------|-----------|------|
| 简单应用 | 20-50 | 少量业务线程 |
| Web 应用 | 50-200 | 线程池处理请求 |
| 微服务 | 100-500 | 包含各种池 |
| 大数据处理 | 500+ | 并行处理大量线程 |

### Q3：为什么线程处于 RUNNABLE 但 CPU 不高？

```text
"thread-1" #15 prio=5 os_prio=0 tid=... nid=... runnable [...]
   java.lang.Thread.State: RUNNABLE
        at java.io.SocketInputStream.socketRead0(Native Method)
        at java.io.SocketInputStream.read(SocketInputStream.java:150)
        - locked <0x00000000c0a0a4c0> (a java.net.Socket)
```

可能原因：
- I/O 阻塞操作（网络/磁盘）
- 等待数据库响应
- 外部服务调用
- LockSupport.parkNanos() 短时间等待

### Q4：如何减少线程竞争？

```java
// 方案 1：减少 synchronized 范围
// 不推荐
synchronized (this) {
    // 大量业务逻辑
}

// 推荐
String result;
synchronized (this) {
    result = cache.get(key);  // 只同步必要的代码
}
// 业务逻辑
process(result);

// 方案 2：使用并发工具类
// 不推荐
synchronized (map) {
    map.put(key, value);
}

// 推荐
ConcurrentHashMap<String, Value> map = new ConcurrentHashMap<>();
map.put(key, value);  // 线程安全

// 方案 3：使用细粒度锁
// 不推荐
synchronized (account) {
    balance += amount;
}

// 推荐：使用 Striped Lock 或并发容器
```

## 相关资源

### 官方文档
- [jstack 官方文档](https://docs.oracle.com/en/java/javase/17/docs/specs/man/jstack.html)
- [Java 线程管理](https://docs.oracle.com/javase/8/docs/api/java/lang/Thread.html)

### 性能优化参考
- [Java 并发编程实践](https://jcip.net/)
- [IBM Java 诊断指南](https://www.ibm.com/docs/zh-cn/sdk-java/8?topic=diagnostics-thread-dumps)

### 线程分析工具
- [FastThread 在线分析](https://fastthread.io/)
- [Thread Dump Analyzer](https://threaddumpmonitor.com/)

### 社区资源
- [Stack Overflow - jstack](https://stackoverflow.com/questions/tagged/jstack)
- [GitHub - 线程分析工具集](https://github.com/topics/thread-dump)

