# jcmd - JVM 诊断命令行工具

jcmd（JVM Command）是 JDK 7u40 引入的综合诊断命令行工具，提供对 JVM 进行多种诊断操作的能力。它整合了多个诊断工具的功能，可以通过一个统一的接口执行 JVM 诊断、监控和故障排查任务，是 JDK 中功能最全面的诊断命令行工具。

## 工具概述

jcmd 通过 JVM 的诊断命令接口（Diagnostic Command Interface）与目标 JVM 进程通信，支持执行预定义的诊断命令、获取系统属性、查看线程堆栈、生成堆转储、执行 GC 等操作。相比单独的诊断工具，jcmd 提供了更统一、更可靠的诊断能力。

**工具特点**：
- 功能全面：整合多种诊断功能于一身
- 稳定性高：使用 JVM 官方诊断接口
- 远程支持：支持诊断远程 JVM 进程
- 扩展性强：支持自定义诊断命令

**主要用途**：
- 执行 JVM 诊断命令
- 生成线程堆栈和堆转储
- 查看和修改 JVM 选项
- 监控系统性能指标
- 执行垃圾回收
- 导出诊断信息

## 安装与基本使用

### 环境要求

jcmd 随 JDK 7u40 及以后版本提供，确保环境变量中配置了 `JAVA_HOME`。

```bash
# 验证 jcmd 是否可用
jcmd -?

# 查看 JDK 版本
java -version

# 列出所有 JVM 进程
jcmd -l
```

### 基本语法

```bash
jcmd [options] <pid | main class> <command> [arguments]

# 查看可用诊断命令
jcmd <pid> help

# 查看特定命令的帮助
jcmd <pid> help <command>
```

### 快速入门示例

```bash
# 列出所有 Java 进程
jcmd -l

# 查看进程可用的诊断命令
jcmd <PID> help

# 生成线程堆栈
jcmd <PID> Thread.print

# 生成堆转储
jcmd <PID> GC.heap_dump filename=heapdump.hprof

# 查看 JVM 系统属性
jcmd <PID> VM.system_properties

# 执行 Full GC
jcmd <PID> GC.run
```

## 核心诊断命令详解

### 1. 线程分析命令

#### Thread.print - 生成线程堆栈

```bash
# 基本用法
jcmd <PID> Thread.print

# 输出到文件
jcmd <PID> Thread.print > threaddump.txt

# 带锁信息
jcmd <PID> Thread.print -l=true
```

**输出示例**：

```
2024-12-15 14:30:22
Full thread dump Java HotSpot(TM) 64-Bit Server VM (25.271-b09 mixed mode):

"main" #1 prio=5 os_prio=0 tid=0x00007f8a4c001000 nid=0x7f8a runnable [0x00007f8a5f7f7000]
   java.lang.Thread.State: RUNNABLE
        at java.lang.Object.hashCode(Native Method)
        at java.lang.Object.equals(Object.java:122)
        at com.example.Main.main(Main.java:15)

"Reference Handler" #2 daemon prio=10 os_prio=0 tid=0x00007f8a4c01e000 nid=0x7f8b in Object.wait() [0x00007f8a5f6f6000]
   java.lang.Thread.State: WAITING (parking)
        at java.lang.Object.wait(Native Method)
        at java.lang.ref.ReferenceHandler$Lock.wait(BaseModule$2AccessorImpl.java:85)
        - locked <0x00000000c0001234> (a java.lang.Object)
```

**参数选项**：

| 选项 | 说明 |
|-----|------|
| `-l=true` | 显示锁的详细信息 |
| `-e=true` | 显示线程执行时间信息 |

### 2. 堆内存管理命令

#### GC.heap_dump - 生成堆转储

```bash
# 基本用法
jcmd <PID> GC.heap_dump filename=heapdump.hprof
```
**重要说明**：
- GC.heap_dump 会转储当前堆内存中的所有对象
- 对于内存使用分析，建议使用 `jmap -dump:live` 来转储存活对象

#### GC.heap_info - 查看堆信息

```bash
# 查看堆内存使用情况
jcmd <PID> GC.heap_info
```

**输出示例**：

```
 PSYoungGen      total 75776K, used 1300K [0x00000000f1700000, 0x00000000f6b80000, 0x0000000100000000)
  eden space 65024K, 2% used [0x00000000f1700000,0x00000000f1845200,0x00000000f5680000)
  from space 10752K, 0% used [0x00000000f5680000,0x00000000f5680000,0x00000000f6100000)
  to   space 10752K, 0% used [0x00000000f6100000,0x00000000f6100000,0x00000000f6b80000)
 ParOldGen       total 166400K, used 11998K [0x00000000d4400000, 0x00000000de680000, 0x00000000f1700000)
  object space 166400K, 7% used [0x00000000d4400000,0x00000000d4fb7b00,0x00000000de680000)
 Metaspace       used 22039K, capacity 22385K, committed 22912K, reserved 1069056K
  class space    used 2422K, capacity 2538K, committed 2688K, reserved 1048576K
```

#### GC.run - 执行垃圾回收

```bash
# 执行 Full GC
jcmd <PID> GC.run
```

**使用场景**：
- 排查内存泄漏时触发 GC
- 测试 GC 行为
- 内存压力测试

### 3. GC 诊断命令

#### GC.class_histogram - 对象直方图

```bash
# 查看对象统计
jcmd <PID> GC.class_histogram

# 输出到文件
jcmd <PID> GC.class_histogram > histo.txt

# 只统计存活对象
# Linux/macOS
jcmd <PID> GC.class_histogram | grep -A 100 "Class histogram"
# Windows PowerShell 等效方案
jcmd <PID> GC.class_histogram | Select-String "Class histogram" -Context 0,100
# Windows cmd 等效方案
jcmd <PID> GC.class_histogram | findstr /R "Class histogram" -A 100
```

**输出示例**：

```
 num     #instances         #bytes  class name
----------------------------------------------
   1:          45678      3456789  [Ljava.lang.Object;
   2:          23456      1876543  java.lang.String
   3:          12345      1234567  [C
   4:           8765       987654  java.util.HashMap$Node
```

#### GC.finalizer_info - Finalizer 信息

```bash
# 查看 Finalizer 队列信息
jcmd <PID> GC.finalizer_info
```

### 4. VM 系统信息命令

#### VM.system_properties - 查看系统属性

```bash
# 查看所有系统属性
jcmd <PID> VM.system_properties

# 过滤特定属性
# Linux/macOS
jcmd <PID> VM.system_properties | grep java
# Windows PowerShell 等效方案
jcmd <PID> VM.system_properties | Select-String "java"
# Windows cmd 等效方案
jcmd <PID> VM.system_properties | findstr /R "java"
```

**输出示例**：

```
java.runtime.name = OpenJDK Runtime Environment
java.vm.name = OpenJDK 64-Bit Server VM
java.library.path = /usr/lib/jvm/java-17-openjdk-amd64/lib
file.encoding = UTF-8
```

#### VM.version - 查看 JVM 版本

```bash
# 查看 JVM 版本信息
jcmd <PID> VM.version
```

**输出示例**：

```
OpenJDK Runtime Environment (Zulu 17.0.9+11-CA) (build 17.0.9+11)
OpenJDK 64-Bit Server VM (build 25.271-b09, mixed mode)
```

#### VM.flags - 查看 JVM 参数

```bash
# 查看当前 JVM 参数
jcmd <PID> VM.flags

# 显示修改后的参数
jcmd <PID> VM.flags -modified
```

**输出示例**：

```
-XX:CICompilerCount=4 -XX:InitialHeapSize=266338304 -XX:MaxHeapSize=734003200 -XX:MaxNewSize=244318208 -XX:MinHeapDeltaBytes=524288 -XX:NewSize=88604672 -XX:OldSize=177733632 -XX:+UseCompressedClassPointers -XX:+UseCompressedOops -XX:+UseFastUnorderedTimeStamps -XX:-UseLargePagesIndividualAllocation -XX:+UseParallelGC
```

#### VM.command_line - 查看命令行参数

```bash
# 查看 JVM 启动命令行
jcmd <PID> VM.command_line
```

**输出示例**：

```
VM Arguments:
java_command: com.example.Application
java_class_path: /data/app.jar
Launcher Type: SUN_STANDARD
```

### 5. 性能监控命令

#### PerfCounter.print - 性能计数器

```bash
# 查看所有性能计数器
jcmd <PID> PerfCounter.print

# 监控特定计数器
# Linux/macOS
jcmd <PID> PerfCounter.print | grep gc
# Windows PowerShell 等效方案
jcmd <PID> PerfCounter.print | Select-String "gc"
# Windows cmd 等效方案
jcmd <PID> PerfCounter.print | findstr /R "gc"
```

**常用计数器**：

| 计数器 | 说明 |
|-------|------|
| java.gc.promotion_failed | 对象晋升失败次数 |
| java.gc.major_collection_count | Major GC 次数 |
| java.gc.minor_collection_count | Minor GC 次数 |
| java.threads.started | 启动的线程数 |

## 高级诊断功能

### 动态修改 JVM 选项

```bash
# 查看 VM.flags 命令的帮助
jcmd <PID> help VM.flags

# 修改 PrintGCDetails（如果支持）
jcmd <PID> VM.flags PrintGCDetails=true

# 查看所有可修改的选项
jcmd <PID> help -all VM.flags
```

**注意**：并非所有 JVM 选项都支持动态修改。

### 诊断命令脚本化

```bash
#!/bin/bash
# jcmd-comprehensive-diagnostic.sh - 综合诊断脚本

PID=$1
OUTPUT_DIR=${2:-/tmp/diagnostics}
TIMESTAMP=$(date +%Y%m%d-%H%M%S)

if [ -z "$PID" ]; then
    echo "用法: $0 <PID> [output-dir]"
    exit 1
fi

mkdir -p $OUTPUT_DIR

echo "=== 开始综合诊断 (进程: $PID) ==="
echo "输出目录: $OUTPUT_DIR"
echo ""

# 1. 基本信息
echo "--- 1. JVM 版本信息 ---"
jcmd $PID VM.version > "$OUTPUT_DIR/vm-version.txt"

# 2. 命令行参数
echo "--- 2. JVM 命令行 ---"
jcmd $PID VM.command_line > "$OUTPUT_DIR/vm-command.txt"

# 3. JVM 标志
echo "--- 3. JVM 标志 ---"
jcmd $PID VM.flags > "$OUTPUT_DIR/vm-flags.txt"

# 4. 系统属性
echo "--- 4. 系统属性 ---"
jcmd $PID VM.system_properties > "$OUTPUT_DIR/vm-properties.txt"

# 5. 线程堆栈
echo "--- 5. 线程堆栈 ---"
jcmd $PID Thread.print > "$OUTPUT_DIR/thread-print.txt"

# 6. 堆转储
echo "--- 6. 堆转储 ---"
jcmd $PID GC.heap_dump filename="$OUTPUT_DIR/heapdump-$TIMESTAMP.hprof"

# 7. 对象直方图
echo "--- 7. 对象直方图 ---"
jcmd $PID GC.class_histogram > "$OUTPUT_DIR/class-histo.txt"

# 8. 堆信息
echo "--- 8. 堆信息 ---"
jcmd $PID GC.heap_info > "$OUTPUT_DIR/heap-info.txt"

# 9. 性能计数器
echo "--- 9. 性能计数器 ---"
jcmd $PID PerfCounter.print > "$OUTPUT_DIR/perf-count.txt"

# 10. Finalizer 信息
echo "--- 10. Finalizer 信息 ---"
jcmd $PID GC.finalizer_info > "$OUTPUT_DIR/finalizer-info.txt"

echo ""
echo "=== 诊断完成 ==="
echo "所有文件保存在: $OUTPUT_DIR"
ls -la "$OUTPUT_DIR"
```

### 自动化监控脚本

```bash
#!/bin/bash
# jcmd-monitor.sh - jcmd 监控脚本

PID=$1
INTERVAL=${2:-60}

if [ -z "$PID" ]; then
    echo "用法: $0 <PID> [interval]"
    exit 1
fi

echo "=== jcmd 监控 (进程: $PID) ==="
echo "监控间隔: ${INTERVAL}秒"
echo ""

while true; do
    TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
    echo "--- $TIMESTAMP ---"
    
    # 堆信息
    echo "=== 堆内存使用 ==="
    jcmd $PID GC.heap_info
    
    # GC 统计
    echo ""
    echo "=== GC 统计 ==="
    jcmd $PID GC.class_histogram | head -20
    
    # 线程数
    echo ""
    echo "=== 线程统计 ==="
    jcmd $PID Thread.print | grep -c "^\\\""
    
    # Finalizer
    echo ""
    echo "=== Finalizer 状态 ==="
    jcmd $PID GC.finalizer_info
    
    echo ""
    sleep $INTERVAL
done
```

### 故障排查脚本

```bash
#!/bin/bash
# jcmd-troubleshoot.sh - 故障排查脚本

PID=$1

if [ -z "$PID" ]; then
    echo "用法: $0 <PID>"
    exit 1
fi

echo "=== jcmd 故障排查 (进程: $PID) ==="
echo ""

# 1. 检查进程状态
echo "--- 1. 进程状态 ---"
ps -p $PID -o pid,ppid,cmd,%cpu,%mem,etime

# 2. 线程分析
echo ""
echo "--- 2. 线程分析 ---"
THREAD_COUNT=$(jcmd $PID Thread.print 2>/dev/null | grep -c "^\\\"")
echo "线程总数: $THREAD_COUNT"

BLOCKED_COUNT=$(jcmd $PID Thread.print 2>/dev/null | grep "BLOCKED" | wc -l)
echo "阻塞线程数: $BLOCKED_COUNT"

# 3. 内存分析
echo ""
echo "--- 3. 内存分析 ---"
jcmd $PID GC.heap_info

# 4. 对象统计
echo ""
echo "--- 4. 对象统计 TOP 10 ---"
jcmd $PID GC.class_histogram 2>/dev/null | head -15

# 5. 死锁检测
echo ""
echo "--- 5. 死锁检测 ---"
if jcmd $PID Thread.print 2>/dev/null | grep -q "deadlock"; then
    echo "⚠️  检测到死锁!"
    jcmd $PID Thread.print 2>/dev/null | grep -A 30 "deadlock"
else
    echo "✅ 未检测到死锁"
fi

# 6. JVM 配置
echo ""
echo "--- 6. JVM 配置 ---"
jcmd $PID VM.flags | grep -E "(HeapSize|GC|Trace)"

# 7. 系统属性
echo ""
echo "--- 7. 关键系统属性 ---"
jcmd $PID VM.system_properties 2>/dev/null | grep -E "(java.version|java.vendor|os.name|user.name)"
```

## 与其他工具集成

### 工具生态系统概览

现代 Java 应用监控通常通过以下工具链实现：

| 工具类型 | 工具名称 | 一句话介绍 | 关联关系 |
|---------|---------|-----------|---------|
| **诊断采集** | jcmd | Java 官方进程诊断命令，提供全面的 JVM 内部状态信息 | 通过 jcmd/JMX 等工具从 Java 应用采集指标 |
| **指标导出** | Micrometer | Java 指标库抽象层，提供统一的指标收集 API | 通过 Micrometer 等工具标准化指标格式 |
| **数据存储** | Prometheus | 开源时序数据库，专为监控和告警设计，支持高维度标签查询 | 推送到 Prometheus 等时序数据库进行存储 |
| **可视化** | Grafana | 现代化的数据可视化平台，支持多种数据源和告警功能 | 在 Grafana 中配置数据源并创建 Dashboard 进行可视化与监控 |

**典型集成流程**：
Java 应用 → jcmd/Micrometer → Prometheus → Grafana → 可视化与监控

### jcmd + Prometheus 集成

```bash
#!/bin/bash
# export-jcmd-metrics.sh - 导出 jcmd 指标到 Prometheus

PID=$1
OUTPUT_FILE=/tmp/jcmd-metrics.prom

if [ -z "$PID" ]; then
    echo "用法: $0 <PID>"
    exit 1
fi

# 获取线程数
THREAD_COUNT=$(jcmd $PID Thread.print 2>/dev/null | grep -c "^\\\"")

# 获取堆信息
HEAP_INFO=$(jcmd $PID GC.heap_info 2>/dev/null)
HEAP_USED=$(echo "$HEAP_INFO" | grep -oE "used [0-9]+K" | awk '{print $2}')
HEAP_TOTAL=$(echo "$HEAP_INFO" | grep -oE "total [0-9]+K" | awk '{print $2}')

# 获取性能计数器
PERF_INFO=$(jcmd $PID PerfCounter.print 2>/dev/null)
GC_COUNT=$(echo "$PERF_INFO" | grep "gc.total" | head -1)
GC_TIME=$(echo "$PERF_INFO" | grep "gc.total.time" | head -1)

# 输出 Prometheus 格式
cat > $OUTPUT_FILE << EOF
# HELP jvm_threads_total Total number of threads
# TYPE jvm_threads_total gauge
jvm_threads_total $THREAD_COUNT
# HELP jvm_heap_used_bytes Heap used bytes
# TYPE jvm_heap_used_bytes gauge
jvm_heap_used_bytes ${HEAP_USED:-0}000
# HELP jvm_heap_total_bytes Heap total bytes
# TYPE jvm_heap_total_bytes gauge
jvm_heap_total_bytes ${HEAP_TOTAL:-0}000
$GC_COUNT
$GC_TIME
EOF

echo "指标已导出到 $OUTPUT_FILE"
```

### jcmd + Grafana Dashboard

```json
{
  "dashboard": {
    "title": "JVM Diagnostic Metrics",
    "panels": [
      {
        "title": "Thread Count",
        "type": "graph",
        "targets": [
          {
            "expr": "jvm_threads_total",
            "legendFormat": "Total Threads"
          }
        ]
      },
      {
        "title": "Heap Usage",
        "type": "graph",
        "targets": [
          {
            "expr": "jvm_heap_used_bytes",
            "legendFormat": "Heap Used"
          },
          {
            "expr": "jvm_heap_total_bytes",
            "legendFormat": "Heap Total"
          }
        ]
      }
    ]
  }
}
```

### jcmd + Grafana 集成脚本

```bash
#!/bin/bash
# update-grafana-metrics.sh - 更新 Grafana 指标

PROMETHEUS_FILE=/etc/prometheus/jvm-metrics.prom
JCMD_PROM_FILE=/tmp/jcmd-metrics.prom

# 导出 jcmd 指标
for pid in $(jcmd -l | awk '{print $1}'); do
    ./export-jcmd-metrics.sh $pid > $JCMD_PROM_FILE-$pid.prom
    cat $JCMD_PROM_FILE-$pid.prom >> $PROMETHEUS_FILE
done

# 重新加载 Prometheus 配置
curl -X POST http://localhost:9090/-/reload
```

## 性能影响与最佳实践

### 性能影响评估

jcmd 命令的性能影响因命令类型而异：

| 命令 | CPU 开销 | 性能影响核心风险 | 推荐场景 |
|-----|---------|---------|---------|
| VM.flags | 极低 | 几乎无风险，不暂停应用线程。 | 可随时安全执行，用于配置检查 |
| Thread.print | 触发全局暂停（STW）。对高并发、低延迟应用影响显著。 | 100ms-2s | 常规分析，避免在高并发业务高峰期执行。 |
| GC.class_histogram | 中高 | 长时间全局暂停，可能导致秒级甚至更长的服务中断。 | 仅在业务低峰期或预发环境使用，用于分析内存对象分布。 |
| GC.heap_dump | 高 | 极高风险的运维操作，可能造成生产服务长时间不可用。 | 视为最后手段，仅在严重内存故障时使用，并提前规划维护窗口。 |
| GC.run | 高 | 完全STW，停顿时间和影响视 GC 而定 | 生产环境通常应避免，除非在明确、受控的调优场景下。 |

### 最佳实践建议

```bash
# 生产环境最佳实践

# 1. 常规监控使用轻量级命令
jcmd $PID VM.flags                    # 查看配置
jcmd $PID VM.version                  # 查看版本
jcmd $PID PerfCounter.print | grep gc # GC 统计

# 2. 故障排查使用完整命令
jcmd $PID Thread.print > threaddump.txt
jcmd $PID GC.heap_dump filename=heapdump.hprof

# 3. 低峰期执行重量级操作
# 使用 cron 定时任务
0 3 * * * /opt/scripts/jcmd-diagnostic.sh <PID>

# 4. 限制操作频率
# 避免过于频繁的堆转储

# 5. 自动化分析流程
# 使用脚本自动执行诊断命令
```

### 常见问题排查

**问题 1：jcmd 连接失败**

```bash
# 检查进程是否存在
jcmd -l

# 检查用户权限
ps -ef | grep java

# 使用相同用户执行
sudo -u <user> jcmd $PID help

# 检查 JDK 版本兼容性
java -version
```

**问题 2：诊断命令执行超时**

```bash
# 增加超时时间
timeout 30 jcmd $PID Thread.print

# 使用 -l 参数减少输出
jcmd $PID Thread.print -l=false
```

**问题 3：生成堆转储失败**

```bash
# 检查磁盘空间
df -h /data

# 检查文件权限
ls -la /data/

# 使用其他目录
jcmd $PID GC.heap_dump filename=/tmp/heapdump.hprof
```

## 扩展功能

### 自定义诊断命令

JVM 支持通过 JVMTI 和诊断命令框架添加自定义诊断命令：

```java
// 示例：自定义诊断命令实现
import sun.management.ManagementFactory;
import com.sun.management.HotSpotDiagnosticMXBean;

public class CustomDiagnostic {
    private static final String COMMAND_NAME = "custom.diagnostic";
    
    public static void main(String[] args) {
        // 注册自定义命令
        // 需要通过 -XX:+UnlockDiagnosticVMOptions 启用
    }
}
```

### 远程诊断配置

```bash
# 启用远程诊断：开启JMX远程管理功能，允许外部工具（如JConsole、VisualVM、JMC等）通过网络连接到该JVM进程，进行监控和管理。
java -Dcom.sun.management.jmxremote.port=9010 \
     -Dcom.sun.management.jmxremote.ssl=false \
     -Dcom.sun.management.jmxremote.authenticate=false \
     -jar application.jar

# 使用 jcmd 远程诊断
jcmd <remote-pid> <command>
```

## 常用命令速查表

### 基础诊断命令

| 命令 | 说明 | 示例 |
|-----|------|------|
| `VM.version` | JVM 版本 | `jcmd <PID> VM.version` |
| `VM.flags` | JVM 参数 | `jcmd <PID> VM.flags` |
| `VM.system_properties` | 系统属性 | `jcmd <PID> VM.system_properties` |
| `VM.command_line` | 命令行参数 | `jcmd <PID> VM.command_line` |

### 线程分析命令

| 命令 | 说明 | 示例 |
|-----|------|------|
| `Thread.print` | 线程堆栈 | `jcmd <PID> Thread.print -l=true` |

### 内存分析命令

| 命令 | 说明 | 示例 |
|-----|------|------|
| `GC.heap_dump` | 堆转储 | `jcmd <PID> GC.heap_dump filename=x.hprof` |
| `GC.heap_info` | 堆信息 | `jcmd <PID> GC.heap_info` |
| `GC.class_histogram` | 对象直方图 | `jcmd <PID> GC.class_histogram` |
| `GC.run` | 执行 GC | `jcmd <PID> GC.run` |
| `GC.finalizer_info` | Finalizer 信息 | `jcmd <PID> GC.finalizer_info` |

### 性能监控命令

| 命令 | 说明 | 示例 |
|-----|------|------|
| `PerfCounter.print` | 性能计数器 | `jcmd <PID> PerfCounter.print` |
| `JVMTM.data_dump` | JVMTI 数据 | `jcmd <PID> JVMTM.data_dump` |

## 常见问题 FAQ

### Q1：jcmd 和 jstack/jmap 的区别？

**jcmd** 优势：
- 统一的诊断接口
- 更稳定的连接方式
- 更多的诊断命令
- 支持远程诊断

**独立工具** 优势：
- 更轻量
- 特定的优化功能
- 熟悉的使用方式

**建议**：日常使用 jcmd，特殊场景使用独立工具。

### Q2：如何诊断无响应的 JVM？

```bash
# 1. 检查线程状态
jcmd <PID> Thread.print

# 2. 查看系统属性
jcmd <PID> VM.system_properties

# 3. 生成堆转储
jcmd <PID> GC.heap_dump filename=heapdump.hprof

# 4. 查看性能计数器
jcmd <PID> PerfCounter.print
```

### Q3：jcmd 支持多少诊断命令？

数量因 JVM 版本而异，可通过以下命令查看：

```bash
# 列出所有可用命令
jcmd <PID> help

# 查看特定分类的命令
jcmd <PID> help | grep GC
```

### Q4：如何提高 jcmd 的可靠性？

```bash
# 1. 使用最新版本的 JDK
java -version

# 2. 增加 JVM 启动参数
-XX:+UnlockDiagnosticVMOptions
```

### Q5：jcmd 可以用于生产环境吗？

可以，但需要注意：

| 操作 | 生产环境建议 |
|-----|-------------|
| `VM.flags` | ✅ 安全，读取操作 |
| `Thread.print` | ✅ 安全，可定期执行 |
| `PerfCounter.print` | ✅ 安全，读取操作 |
| `GC.heap_dump` | ⚠️ 谨慎，生成大文件 |
| `GC.run` | ⚠️ 谨慎，可能触发 Full GC |

## 相关资源

### 官方文档
- [jcmd 官方文档](https://docs.oracle.com/en/java/javase/17/docs/specs/man/jcmd.html)
- [JVM 诊断命令参考](https://docs.oracle.com/javase/8/docs/technotes/guides/troubleshoot/tooldescr007.html)

### 分析工具
- [Eclipse Memory Analyzer](https://eclipse.dev/mat/)
- [FastThread](https://fastthread.io/)
- [GCEasy](https://gceasy.io/)

### 性能优化参考
- [Oracle JVM 诊断指南](https://docs.oracle.com/en/java/javase/17/perform/)
- [JVM Performance Tuning](https://docs.oracle.com/javase/8/docs/technotes/guides/vm/performance-enhancements-7.html)

### 社区资源
- [Stack Overflow - jcmd](https://stackoverflow.com/questions/tagged/jcmd)
- [GitHub - JVM 诊断工具](https://github.com/topics/jvm-diagnostics)

