# jinfo - JVM 信息查看工具

[[toc]]

## 工具概述

jinfo（JVM Info）是 JDK 内置的配置信息查看工具，用于获取和修改 JVM 的运行时配置参数。jinfo 通过 JVM 的服务接口获取目标进程的详细配置信息，包括系统属性、VM 标志参数、JVM 版本信息等。对于支持动态修改的标志（Manageable Flags），jinfo 可以在不重启 JVM 的情况下进行实时调整，这在对生产环境进行调优时非常有用。

**工具特点**：
- 实时查看 JVM 配置
- 支持动态修改部分 VM 参数
- 获取系统属性和环境变量
- 零侵入性，不需要修改应用代码
- 与 JVM 版本高度兼容

**主要用途**：
- 查看当前 JVM 配置参数
- 诊断 JVM 配置问题
- 动态调整 JVM 运行时参数
- 获取系统属性信息
- 验证 JVM 参数是否生效
- 排查配置冲突问题

## 安装与基本使用

### 环境要求

jinfo 随 JDK 提供，确保环境变量中配置了 `JAVA_HOME`。

```bash
# 验证 jinfo 是否可用
jinfo -?

# 查看 JDK 版本
java -version
```

### 基本语法

```bash
# 查看进程配置
jinfo [options] <pid>
```

**常用选项**：

| 选项 | 说明 |
|-----|------|
| 无选项 | 显示 VM 标志信息 |
| `-flags` | 显示 VM 标志信息（详细） |
| `-sysprops` | 显示系统属性信息 |
| `-flag <name>` | 显示特定标志的值 |
| `-flag [+/-]<name>` | 启用/禁用布尔标志 |
| `-flag <name>=<value>` | 设置标志值 |

### 快速入门示例

```bash
# 查看进程 ID
jps -l

# 查看基本 VM 标志
jinfo 12345

# 查看所有 VM 标志（详细）
jinfo -flags 12345

# 查看系统属性
jinfo -sysprops 12345

# 查看特定标志
jinfo -flag MaxHeapSize 12345

# 动态修改标志（需要可管理的标志）
jinfo -flag PrintGCDetails=true 12345

# 启用布尔标志
jinfo -flag +PrintGCDetails 12345

# 禁用布尔标志
jinfo -flag -PrintGCDetails 12345
```

## 查看 JVM 配置信息

### 查看 VM 标志信息

```bash
# 查看当前 VM 标志
jinfo <PID>
```
### 查看详细标志信息（-flags）

```bash
# 查看所有 VM 标志（详细）
jinfo -flags <PID>
```

### 查看系统属性（-sysprops）

```bash
# 查看所有系统属性
jinfo -sysprops <PID>
```

### 查看特定标志值

```bash
# 查看堆大小
jinfo -flag MaxHeapSize <PID>
jinfo -flag InitialHeapSize <PID>

# 查看 GC 策略
jinfo -flag UseG1GC <PID>
jinfo -flag UseConcMarkSweepGC <PID>

# 查看 GC 日志配置
jinfo -flag PrintGCDetails <PID>
jinfo -flag PrintGCDateStamps <PID>

# 查看其他常用标志
jinfo -flag MetaspaceSize <PID>
jinfo -flag MaxMetaspaceSize <PID>
jinfo -flag GCTimeRatio <PID>
jinfo -flag MaxGCPauseMillis <PID>
```

## 动态修改 JVM 参数

### 可修改的标志

| 标志 | 说明 | 示例值 |
|-----|------|-------|
| PrintGCDetails | 输出 GC 详细信息 | true/false |
| PrintGCDateStamps | 输出 GC 时间戳 | true/false |
| PrintGCTimeStamps | 输出 GC 时间戳 | true/false |
| PrintGCApplicationStoppedTime | 输出停顿时间 | true/false |
| PrintGCApplicationConcurrentTime | 输出并发时间 | true/false |
| PrintSafepointStatistics | 输出安全点统计 | true/false |
| LogFile | 日志文件路径 | /data/gc.log |

### 修改布尔标志

```bash
# 启用 PrintGCDetails
jinfo -flag +PrintGCDetails <PID>

# 禁用 PrintGCDetails
jinfo -flag -PrintGCDetails <PID>

# 检查是否启用
jinfo -flag PrintGCDetails <PID>
```

### 修改数值标志

```bash
# 设置最大 GC 停顿时间
jinfo -flag MaxGCPauseMillis=200 <PID>

# 设置 GC 日志文件大小
jinfo -flag LogFileSize=10485760 <PID>

# 查看修改结果
jinfo -flag MaxGCPauseMillis <PID>
```

### 修改字符串标志

```bash
# 设置 GC 日志文件路径
jinfo -flag LogFile=/data/application/gc.log <PID>

# 设置 Xlog 日志配置（JDK 9+）
jinfo -flag Xlog:gc*=file=/data/application/gc.log <PID>
```

### 批量修改示例

```bash
#!/bin/bash
# tune-jvm-runtime.sh - 运行时 JVM 调优

PID=$1

if [ -z "$PID" ]; then
    echo "用法: $0 <PID>"
    exit 1
fi

echo "=== JVM 运行时调优 (进程: $PID) ==="
echo ""

# 启用 GC 日志详细输出
echo "启用 GC 详细日志..."
jinfo -flag +PrintGCDetails $PID

# 启用 GC 时间戳
echo "启用 GC 时间戳..."
jinfo -flag +PrintGCDateStamps $PID

# 设置最大停顿时间目标
echo "设置最大 GC 停顿时间..."
jinfo -flag MaxGCPauseMillis=200 $PID

# 显示当前配置
echo ""
echo "=== 当前配置 ==="
jinfo -flags $PID | grep -E "(PrintGCDetails|MaxGCPauseMillis|PrintGCDateStamps)"

echo ""
echo "✅ JVM 参数调整完成"
```

## JVM 配置诊断

### 诊断堆配置问题

```bash
#!/bin/bash
# diagnose-heap-config.sh - 堆配置诊断

PID=$1

if [ -z "$PID" ]; then
    echo "用法: $0 <PID>"
    exit 1
fi

echo "=== 堆配置诊断 (进程: $PID) ==="
echo ""

# 获取堆配置
MAX_HEAP=$(jinfo -flag MaxHeapSize $PID)
INIT_HEAP=$(jinfo -flag InitialHeapSize $PID)
MIN_HEAP_RATIO=$(jinfo -flag MinHeapFreeRatio $PID)
MAX_HEAP_RATIO=$(jinfo -flag MaxHeapFreeRatio $PID)

echo "最大堆内存: $MAX_HEAP"
echo "初始堆内存: $INIT_HEAP"
echo "最小堆空闲比例: $MIN_HEAP_RATIO"
echo "最大堆空闲比例: $MAX_HEAP_RATIO"

# 分析配置合理性
echo ""
echo "--- 配置分析 ---"

# 转换字节为 MB
MAX_MB=$((MAX_HEAP / 1024 / 1024))
INIT_MB=$((INIT_HEAP / 1024 / 1024))

echo "最大堆: ${MAX_MB}MB"
echo "初始堆: ${INIT_MB}MB"

if [ $MAX_MB -lt 512 ]; then
    echo "⚠️  最大堆过小，可能导致 OOM"
fi

if [ $INIT_MB -eq $MAX_MB ]; then
    echo "ℹ️  使用固定堆大小（非弹性）"
fi
```

### 诊断 GC 配置问题

```bash
#!/bin/bash
# diagnose-gc-config.sh - GC 配置诊断

PID=$1

if [ -z "$PID" ]; then
    echo "用法: $0 <PID>"
    exit 1
fi

echo "=== GC 配置诊断 (进程: $PID) ==="
echo ""

# 获取 GC 相关配置
GC_LOGGING=$(jinfo -flag PrintGCDetails $PID 2>/dev/null)
GC_TIME=$(jinfo -flag MaxGCPauseMillis $PID 2>/dev/null)
USE_G1=$(jinfo -flag UseG1GC $PID 2>/dev/null)
USE_CMS=$(jinfo -flag UseConcMarkSweepGC $PID 2>/dev/null)
USE_SERIAL=$(jinfo -flag UseSerialGC $PID 2>/dev/null)

echo "GC 日志: $GC_LOGGING"
echo "最大停顿目标: $GC_TIME"

# 识别使用的 GC 策略
echo ""
echo "--- GC 策略 ---"
if [ "$USE_G1" = "+" ]; then
    echo "使用 G1GC"
elif [ "$USE_CMS" = "+" ]; then
    echo "使用 CMS"
elif [ "$USE_SERIAL" = "+" ]; then
    echo "使用 Serial GC"
else
    echo "使用默认 GC"
fi

# 检查配置建议
echo ""
echo "--- 配置建议 ---"
if [ "$GC_LOGGING" = "-" ]; then
    echo "⚠️  未启用 GC 日志，建议启用以便排查问题"
fi
```

### 配置对比分析

```bash
#!/bin/bash
# compare-config.sh - 配置对比分析

PID1=$1
PID2=$2

if [ -z "$PID1" ] || [ -z "$PID2" ]; then
    echo "用法: $0 <PID1> <PID2>"
    exit 1
fi

echo "=== JVM 配置对比 (PID: $PID1 vs PID: $PID2) ==="
echo ""

echo "--- 堆配置对比 ---"
echo "PID $PID1:"
jinfo -flag MaxHeapSize $PID1
jinfo -flag InitialHeapSize $PID1
echo "PID $PID2:"
jinfo -flag MaxHeapSize $PID2
jinfo -flag InitialHeapSize $PID2

echo ""
echo "--- GC 配置对比 ---"
echo "PID $PID1:"
jinfo -flag UseG1GC $PID1
jinfo -flag MaxGCPauseMillis $PID1
echo "PID $PID2:"
jinfo -flag UseG1GC $PID2
jinfo -flag MaxGCPauseMillis $PID2

echo ""
echo "--- 系统属性对比 ---"
echo "PID $PID1:"
jinfo -sysprops $PID1 | grep java.version
echo "PID $PID2:"
jinfo -sysprops $PID2 | grep java.version
```

## 与其他工具集成

### jinfo + jstat 集成监控

```bash
#!/bin/bash
# comprehensive-config-monitor.sh - 综合配置监控

PID=$1

if [ -z "$PID" ]; then
    echo "用法: $0 <PID>"
    exit 1
fi

echo "=== JVM 配置与状态综合监控 ==="
echo "进程: $PID"
echo ""

echo "--- JVM 配置 ---"
echo "版本信息:"
jinfo -sysprops $PID | grep java.version
jinfo -sysprops $PID | grep java.vm.name

echo ""
echo "堆配置:"
jinfo -flag MaxHeapSize $PID
jinfo -flag InitialHeapSize $PID

echo ""
echo "GC 配置:"
jinfo -flag UseG1GC $PID 2>/dev/null || echo "G1: 未单独配置"
jinfo -flag MaxGCPauseMillis $PID 2>/dev/null || echo "暂停时间: 使用默认值"

echo ""
echo "--- 运行时状态 (jstat) ---"
jstat -gcutil $PID | tail -1
```

### jinfo + Prometheus 集成

```bash
#!/bin/bash
# export-jinfo-metrics.sh - 导出 jinfo 指标

PID=$1
OUTPUT_FILE=/tmp/jinfo-metrics.prom

if [ -z "$PID" ]; then
    echo "用法: $0 <PID>"
    exit 1
fi

# 获取配置值
MAX_HEAP=$(jinfo -flag MaxHeapSize $PID 2>/dev/null)
INIT_HEAP=$(jinfo -flag InitialHeapSize $PID 2>/dev/null)
METASPACE=$(jinfo -flag MetaspaceSize $PID 2>/dev/null)
GC_PAU=$(jinfo -flag MaxGCPauseMillis $PID 2>/dev/null)

# 转换为数值（字节）
MAX_HEAP_BYTES=${MAX_HEAP:-0}
INIT_HEAP_BYTES=${INIT_HEAP:-0}
METASPACE_BYTES=${METASPACE:-0}

# 输出 Prometheus 格式
cat > $OUTPUT_FILE << EOF
# HELP jvm_max_heap_bytes Maximum heap size in bytes
# TYPE jvm_max_heap_bytes gauge
jvm_max_heap_bytes $MAX_HEAP_BYTES
# HELP jvm_initial_heap_bytes Initial heap size in bytes
# TYPE jvm_initial_heap_bytes gauge
jvm_initial_heap_bytes $INIT_HEAP_BYTES
# HELP jvm_metaspace_size_bytes Metaspace size in bytes
# TYPE jvm_metaspace_size_bytes gauge
jvm_metaspace_size_bytes $METASPACE_BYTES
# HELP jvm_gc_max_pause_millis Maximum GC pause in milliseconds
# TYPE jvm_gc_max_pause_millis gauge
jvm_gc_max_pause_millis ${GC_PAU:-0}
EOF

echo "指标已导出到 $OUTPUT_FILE"
```

### 配置变更追踪

```bash
#!/bin/bash
# track-config-changes.sh - 配置变更追踪

PID=$1
OUTPUT_DIR=/tmp/jvm-config-tracker
INTERVAL=${2:-60}

if [ -z "$PID" ]; then
    echo "用法: $0 <PID> [interval]"
    exit 1
fi

mkdir -p $OUTPUT_DIR
TIMESTAMP=$(date +%Y%m%d-%H%M%S)

echo "=== 配置变更追踪 (进程: $PID) ==="
echo "输出目录: $OUTPUT_DIR"
echo "检查间隔: ${INTERVAL}秒"
echo ""

# 初始配置
jinfo -flags $PID > "$OUTPUT_DIR/initial-flags-$TIMESTAMP.txt"
jinfo -sysprops $PID > "$OUTPUT_DIR/initial-sysprops-$TIMESTAMP.txt"

COUNTER=0
while true; do
    CURRENT_TIME=$(date '+%Y-%m-%d %H:%M:%S')
    
    # 定期记录配置
    if [ $((COUNTER % 10)) -eq 0 ]; then
        jinfo -flags $PID > "$OUTPUT_DIR/flags-$(date +%Y%m%d-%H%M%S).txt"
    fi
    
    # 监控可管理标志变化
    FLAGS=$(jinfo -flags $PID 2>/dev/null)
    
    # 简单的变更检测
    if [ $COUNTER -gt 0 ]; then
        PREV_FILE=$(ls -t "$OUTPUT_DIR"/flags-*.txt 2>/dev/null | head -1)
        if [ ! -z "$PREV_FILE" ]; then
            DIFF=$(diff "$PREV_FILE" <(echo "$FLAGS") | head -20)
            if [ ! -z "$DIFF" ]; then
                echo "[$CURRENT_TIME] 检测到配置变更:"
                echo "$DIFF"
            fi
        fi
    fi
    
    sleep $INTERVAL
    COUNTER=$((COUNTER + 1))
done
```

## 最佳实践

### 最佳实践建议

```bash
# 生产环境最佳实践

# 1. 定期检查配置状态
# 使用 cron 定期记录配置
0 */4 * * * jinfo -flags <PID> > /var/log/jvm-flags-$(date +\%Y\%m\%d-\%H\%M\%S).log

# 2. 记录配置变更历史
# 创建配置变更审计日志

# 3. 验证配置是否生效
# 启动后检查关键参数

# 4. 使用只读模式为主
# 避免不必要的动态修改

# 5. 在测试环境验证
# 动态修改前先在测试环境验证
```

### 配置验证清单

```bash
#!/bin/bash
# validate-jvm-config.sh - JVM 配置验证

PID=$1

if [ -z "$PID" ]; then
    echo "用法: $0 <PID>"
    exit 1
fi

echo "=== JVM 配置验证 (进程: $PID) ==="
echo ""

# 1. 验证关键配置
echo "--- 1. 堆配置 ---"
MAX_HEAP=$(jinfo -flag MaxHeapSize $PID)
echo "最大堆: $MAX_HEAP"

if [ $((MAX_HEAP / 1024 / 1024)) -lt 512 ]; then
    echo "⚠️  堆大小可能不足"
fi

# 2. 验证 GC 配置
echo ""
echo "--- 2. GC 配置 ---"
USE_G1=$(jinfo -flag UseG1GC $PID 2>/dev/null)
if [ "$USE_G1" = "+" ]; then
    echo "✅ 使用 G1GC"
else
    echo "ℹ️  使用其他 GC 策略"
fi

# 3. 验证日志配置
echo ""
echo "--- 3. 日志配置 ---"
PRINT_GC=$(jinfo -flag PrintGCDetails $PID 2>/dev/null)
if [ "$PRINT_GC" = "+" ]; then
    echo "✅ GC 日志已启用"
else
    echo "⚠️  GC 日志未启用"
fi

# 4. 验证版本信息
echo ""
echo "--- 4. 版本信息 ---"
jinfo -sysprops $PID | grep -E "java.version|java.vm.name"

echo ""
echo "=== 验证完成 ==="
```

## 常见问题 FAQ

### 如何查找所有可动态修改的标志？

```bash
# 查看 JVM 文档
java -XX:+PrintFlagsFinal -version | grep manageable
```

### 动态修改标志失败怎么办？

```bash
# 1. 检查标志类型
jinfo -flags <PID> | grep <flag-name>

# 2. 确认是可管理标志
# 只有 manageable 类型可动态修改

# 3. 尝试使用正确语法
jinfo -flag +PrintGCDetails <PID>    # 启用
jinfo -flag -PrintGCDetails <PID>    # 禁用
jinfo -flag LogFile=/data/application/gc.log <PID> # 设置值

# 4. 检查 JVM 版本支持
java -version
```

### jinfo 和其他工具如何选择？

| 工具 | 用途 | 使用场景 |
|-----|------|---------|
| jinfo | 配置查看和修改 | JVM 参数诊断 |
| jps | 进程查看 | 查找 JVM 进程 |
| jstack | 线程分析 | 线程问题排查 |
| jmap | 内存分析 | 内存问题排查 |
| jcmd | 综合诊断 | 全面诊断操作 |

### 如何验证 JVM 启动参数是否生效？

```bash
# 方法 1：使用 jinfo 查看
jinfo -flags <PID> | grep <parameter>

# 方法 2：使用 jcmd 查看
jcmd <PID> VM.flags

# 方法 3：检查 JVM 日志
# 如果启用了 PrintFlagsFinal，会输出生效的标志
java -XX:+PrintFlagsFinal -version
```

### jinfo 可以修改远程 JVM 的配置吗？

jinfo 本身不支持远程连接，但可以通过以下方式：

```bash
# 方式 1：使用 jcmd（支持远程）
jcmd <remote-pid> VM.flags

# 方式 2：配置 JMX
# 启动 JVM 时添加 JMX 参数
java -Dcom.sun.management.jmxremote.port=9010 ...

# 方式 3：使用 SSH 隧道
ssh -L 9010:localhost:9010 user@remote-host
```

## 常用标志速查表

### 堆内存相关标志

| 标志 | 说明 | 默认值 |
|-----|------|-------|
| Xms | 初始堆大小 | 物理内存的 1/64 |
| Xmx | 最大堆大小 | 物理内存的 1/4 |
| MaxHeapSize | 最大堆大小（精确） | 同 Xmx |
| InitialHeapSize | 初始堆大小（精确） | 同 Xms |
| MinHeapFreeRatio | 最小空闲比例 | 0 |
| MaxHeapFreeRatio | 最大空闲比例 | 100 |

### GC 相关标志

| 标志 | 说明 | 默认值 |
|-----|------|-------|
| UseG1GC | 使用 G1 GC | false |
| UseConcMarkSweepGC | 使用 CMS GC | false |
| UseSerialGC | 使用 Serial GC | false |
| MaxGCPauseMillis | 最大 GC 停顿目标 | 无 |
| GCTimeRatio | GC 时间占比 | 99 |

### 日志相关标志

| 标志 | 说明 | 默认值 |
|-----|------|-------|
| PrintGCDetails | 输出 GC 详情 | false |
| PrintGCDateStamps | 输出日期时间戳 | false |
| PrintGCTimeStamps | 输出时间戳 | false |
| LogFile | 日志文件路径 | 无 |

### 元空间相关标志

| 标志 | 说明 | 默认值 |
|-----|------|-------|
| MetaspaceSize | 元空间初始大小 | 约 21MB |
| MaxMetaspaceSize | 最大元空间 | 无限制 |
| CompressedClassSpaceSize | 压缩类空间 | 1GB |

## 相关资源

### 官方文档
- [jinfo 官方文档](https://docs.oracle.com/en/java/javase/17/docs/specs/man/jinfo.html)
- [JVM 标志参考](https://docs.oracle.com/javase/8/docs/technotes/guides/vm/gctoolkit/flags.html)

### 配置工具
- [JVM Options Explorer](https://www.jvm-options.org/)
- [GC 日志配置](https://docs.oracle.com/javase/8/docs/technotes/guides/vm/gctoolkit/flags.html)

### 性能优化参考
- [JVM 性能调优指南](https://docs.oracle.com/en/java/javase/17/perform/)
- [G1GC 调优指南](https://docs.oracle.com/javase/8/docs/technotes/guides/vm/gctuning/cms.html)

### 社区资源
- [Stack Overflow - jinfo](https://stackoverflow.com/questions/tagged/jinfo)
- [JVM 参数配置大全](https://github.com/lets-mica/mica-jvm-options)
