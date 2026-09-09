# Java 内存分析工具详解

内存问题是 Java 应用最常见也最棘手的性能问题之一。内存泄漏、内存溢出、对象分配异常等问题可能导致应用性能下降、响应变慢，甚至完全崩溃。本章节系统介绍 Java 生态系统中用于内存分析和问题排查的专业工具，帮助开发者从根源上解决内存相关问题。

## 工具概览

### 内存问题分类

Java 应用面临的内存问题可以分为以下几类：

```
内存问题类型：
├── 内存泄漏（Memory Leak）
│   ├── 静态集合持有对象引用
│   ├── 监听器/回调未注销
│   ├── ThreadLocal 误用
│   ├── JDBC ResultSet/Statement 未关闭
│   └── ClassLoader 泄漏
│
├── 内存溢出（OutOfMemoryError）
│   ├── Java Heap Space
│   ├── GC Overhead Limit Exceeded
│   ├── Metaspace / PermGen Space
│   ├── Unable to allocate new object
│   └── Direct Buffer Memory
│
├── 内存碎片化
│   ├── GC 频繁但回收有限
│   └── 内存充足但分配失败
│
└── 对象分配异常
    ├── 大对象分配
    ├── 对象分配速率过高
    └── 逃逸分析失败
```

### 内存分析工具生态

```
内存分析工具体系：
├── JVM 内置工具
│   ├── jmap - 内存映射工具
│   ├── jcmd - 综合诊断工具
│   ├── jstat - 统计监控工具
│   └── VisualVM - 集成监控工具
│
├── 内存分析专业工具
│   ├── MAT (Memory Analyzer Tool) # Eclipse Memory Analyzer
│   ├── YourKit Java Profiler
│   └── JProfiler
│
├── 堆转储分析
│   ├── MAT 深度分析
│   ├── 在线分析服务
│   └── 自定义分析脚本
│
└── 持续监控
    ├── JFR 内存事件
    ├── Micrometer 指标
    └── Prometheus + Grafana
```

## jmap - 内存映射工具深度应用

jmap 是 JDK 内置的内存映射工具，用于生成堆转储、分析堆内存使用情况、查看对象统计信息等。它是进行内存问题排查的基础工具。

### 堆转储生成与分析

```bash
#!/bin/bash
# heap-dump-analysis.sh - 堆转储完整流程

PID=$1
OUTPUT_DIR=/tmp/heap_dumps
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

mkdir -p $OUTPUT_DIR

echo "=== 堆转储分析流程 (PID: $PID) ==="

# 1. 生成堆转储
DUMP_FILE=$OUTPUT_DIR/heap_${TIMESTAMP}.hprof
echo "生成堆转储: $DUMP_FILE"
jcmd $PID GC.heap_dump $DUMP_FILE

# 2. 基本统计
echo ""
echo "--- 堆转储统计 ---"
jcmd $PID GC.heap_info

# 3. 对象直方图
echo ""
echo "--- 对象直方图 TOP 20 ---"
jcmd $PID GC.class_histogram | head -25

# 4. 堆使用情况
echo ""
echo "--- 堆使用情况 ---"
jstat -gcutil $PID

echo ""
echo "堆转储文件: $DUMP_FILE"
echo "使用 MAT 分析: ./mat/MemoryAnalyzer $DUMP_FILE"
```

### 对象分配速率监控

```bash
#!/bin/bash
# alloc-rate-monitor.sh - 分配速率监控

PID=$1
INTERVAL=${2:-5}

echo "=== 对象分配速率监控 (PID: $PID) ==="
echo "监控间隔: ${INTERVAL}秒"
echo ""
echo "时间                 eden        old         total     GC"
echo "------------------- ---------- ---------- ---------- -----"

while true; do
    TIMESTAMP=$(date '+%H:%M:%S')

    # 获取 GC 统计
    STATS=$(jstat -gc $PID | tail -1)
    S0C=$(echo $STATS | awk '{print $1}')
    S1C=$(echo $STATS | awk '{print $2}')
    EC=$(echo $STATS | awk '{print $3}')
    OC=$(echo $STATS | awk '{print $5}')
    TT=$(echo $STATS | awk '{print $10}')
    MTT=$(echo $STATS | awk '{print $11}')

    # 计算各区域使用
    EU=$(echo $STATS | awk '{print $4}')
    OU=$(echo $STATS | awk '{print $6}')

    # 计算总堆
    TOTAL=$((S0C + S1C + EC + OC))
    USED=$((EU + OU))
    USAGE=$(echo "scale=2; $USED * 100 / $TOTAL" | bc)

    # 获取 GC 次数和时间
    YGC=$(echo $STATS | awk '{print $12}')
    YGCT=$(echo $STATS | awk '{print $13}')
    FGC=$(echo $STATS | awk '{print $16}')
    FGCT=$(echo $STATS | awk '{print $17}')

    echo "$TIMESTAMP $EU / $OC  $USED / $TOTAL  $USAGE%  $YGC/$YGCT $FGC/$FGCT"

    sleep $INTERVAL
done
```

### 堆内存结构诊断

```bash
#!/bin/bash
# heap-structure-diagnosis.sh - 堆结构诊断

PID=$1

echo "=== 堆内存结构诊断 (PID: $PID) ==="
echo ""

# 获取堆配置
echo "--- 堆配置 ---"
jinfo -flag MaxHeapSize $PID
jinfo -flag InitialHeapSize $PID
jinfo -flag NewSize $PID
jinfo -flag OldSize $PID

# 获取 GC 策略
echo ""
echo "--- GC 策略 ---"
jinfo -flag UseG1GC $PID
jinfo -flag UseSerialGC $PID
jinfo -flag UseConcMarkSweepGC $PID

# 获取各代大小
echo ""
echo "--- 各代大小统计 ---"
jstat -gccapacity $PID

# 获取使用情况
echo ""
echo "--- 各代使用情况 ---"
jstat -gcutil $PID

# 获取对象统计
echo ""
echo "--- 大对象统计 ---"
jcmd $PID GC.class_histogram | grep -E "^\s*[0-9]+:" | awk '{if ($2 > 100000) print}'
```

## MAT (Memory Analyzer Tool) 深度应用

MAT 是 Eclipse Foundation 提供的专业内存分析工具，能够对堆转储文件进行深度分析，识别内存泄漏、内存浪费等问题。

### 堆转自动化分析

```bash
#!/bin/bash
# mat-automated-analysis.sh - MAT 自动化分析

HEAP_DUMP=$1
REPORT_DIR=./mat-reports
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

if [ -z "$HEAP_DUMP" ]; then
    echo "用法: $0 <heap-dump-file>"
    exit 1
fi

mkdir -p $REPORT_DIR

echo "=== MAT 自动化分析 ==="
echo "堆转储: $HEAP_DUMP"
echo "输出目录: $REPORT_DIR"
echo ""

# 检查 MAT 是否可用
if [ ! -d "$MAT_HOME" ]; then
    echo "⚠️  MAT_HOME 未设置，跳过 MAT 分析"
    echo "请从 https://eclipse.dev/mat/ 下载安装 MAT"
    exit 0
fi

# 1. 生成泄漏检测报告
echo "生成泄漏检测报告..."
$MAT_HOME/plugins/org.eclipse.equinox.launcher_*.jar \
    -application org.eclipse.mat.api:suspects \
    "$HEAP_DUMP" \
    -outputFolder $REPORT_DIR/leaksuspects

# 2. 生成组件报告
echo "生成组件报告..."
$MAT_HOME/plugins/org.eclipse.equinox.launcher_*.jar \
    -application org.eclipse.mat.api:overview \
    "$HEAP_DUMP" \
    -outputFolder $REPORT_DIR/overview

# 3. 生成 Top Components 报告
echo "生成 Top Components 报告..."
$MAT_HOME/plugins/org.eclipse.equinox.launcher_*.jar \
    -application org.eclipse.mat.api:topcomponents \
    "$HEAP_DUMP" \
    -outputFolder $REPORT_DIR/topcomponents

echo ""
echo "分析完成!"
echo "查看报告: ls -la $REPORT_DIR"
```

### 内存泄漏模式识别

```bash
#!/bin/bash
# leak-pattern-detection.sh - 内存泄漏模式检测

HEAP_DUMP=$1

if [ -z "$HEAP_DUMP" ]; then
    echo "用法: $0 <heap-dump-file>"
    exit 1
fi

echo "=== 内存泄漏模式检测 ==="
echo ""

# 使用 jcmd 生成类直方图
HISTOGRAM=$(jcmd $PID GC.class_histogram 2>/dev/null)

# 模式 1：静态集合持有对象
echo "--- 模式 1：静态集合分析 ---"
echo "$HISTOGRAM" | grep -E "(HashMap|ArrayList|LinkedList|HashSet|TreeSet)" | head -10

# 模式 2：ClassLoader 泄漏
echo ""
echo "--- 模式 2：ClassLoader 分析 ---"
echo "$HISTOGRAM" | grep -i "classloader\|class$" | head -10

# 模式 3：ThreadLocal 泄漏
echo ""
echo "--- 模式 3：ThreadLocal 分析 ---"
echo "$HISTOGRAM" | grep -i "threadlocal\|thread" | head -10

# 模式 4：JDBC 资源泄漏
echo ""
echo "--- 模式 4：JDBC 资源分析 ---"
echo "$HISTOGRAM" | grep -iE "(connection|statement|resultset|prepared)" | head -10

# 模式 5：监听器/回调
echo ""
echo "--- 模式 5：监听器分析 ---"
echo "$HISTOGRAM" | grep -iE "(listener|callback|observer)" | head -10

# 模式 6：字符串驻留
echo ""
echo "--- 模式 6：字符串分析 ---"
echo "$HISTOGRAM" | grep -i "string" | head -10

echo ""
echo "分析完成，建议使用 MAT 打开堆转储进行深度分析"
```

### 堆转储对比分析

```bash
#!/bin/bash
# heap-comparison.sh - 堆转储对比分析

DUMP1=$1
DUMP2=$2
REPORT_DIR=./comparison-reports

if [ -z "$DUMP1" ] || [ -z "$DUMP2" ]; then
    echo "用法: $0 <dump1> <dump2>"
    exit 1
fi

mkdir -p $REPORT_DIR

echo "=== 堆转储对比分析 ==="
echo "转储1: $DUMP1"
echo "转储2: $DUMP2"
echo ""

# 获取两个转储的类直方图
echo "生成类直方图..."
jcmd $PID1 GC.class_histogram > $REPORT_DIR/histogram1.txt
jcmd $PID2 GC.class_histogram > $REPORT_DIR/histogram2.txt

# 对比分析
echo ""
echo "--- 对象数量变化 TOP 20 ---"
diff <(grep -E "^\s*[0-9]+:" $REPORT_DIR/histogram1.txt | sort -k2) \
     <(grep -E "^\s*[0-9]+:" $REPORT_DIR/histogram2.txt | sort -k2) || true

echo ""
echo "--- 内存使用变化 TOP 20 ---"
diff <(grep -E "^\s*[0-9]+:" $REPORT_DIR/histogram1.txt | sort -k3) \
     <(grep -E "^\s*[0-9]+:" $REPORT_DIR/histogram2.txt | sort -k3) || true

echo ""
echo "详细对比请使用 MAT: File -> Open Heap Dump -> Compare to Other Dump"
```

## 内存泄漏排查实战

### 实战案例一：静态集合泄漏

```bash
#!/bin/bash
# case-static-collection.sh - 静态集合泄漏排查

echo "=== 静态集合内存泄漏排查 ==="
echo ""

# 获取堆转储
DUMP_FILE=/tmp/heap_static.hprof
jcmd $PID GC.heap_dump $DUMP_FILE

# 使用 MAT 分析（命令行）
# 查找 HashMap 及其内容
echo "分析 HashMap 使用情况..."
# 建议在 MAT 中执行以下查询：
# 
# SELECT s FROM java.util.HashMap s
# WHERE s.@size > 1000
# 
# SELECT m FROM java.util.HashMap m 
# WHERE m.key.@class.name LIKE "%Key%"

# 快速分析脚本
echo ""
echo "--- HashMap 统计 ---"
jcmd $PID GC.class_histogram | grep HashMap

echo ""
echo "--- ArrayList 统计 ---"
jcmd $PID GC.class_histogram | grep ArrayList

echo ""
echo "建议：在 MAT 中使用 OQL 查询"
echo "SELECT m from java.util.HashMap m WHERE m.@size > 1000"
```

### 实战案例二：ThreadLocal 泄漏

```bash
#!/bin/bash
# case-threadlocal.sh - ThreadLocal 泄漏排查

echo "=== ThreadLocal 内存泄漏排查 ==="
echo ""

# 获取堆转储
DUMP_FILE=/tmp/heap_threadlocal.hprof
jcmd $PID GC.heap_dump $DUMP_FILE

# 分析 ThreadLocalMap
echo "--- ThreadLocal 相关对象统计 ---"
jcmd $PID GC.class_histogram | grep -i thread

echo ""
echo "--- 大对象 TOP 10 ---"
jcmd $PID GC.class_histogram | grep -E "^\s*[0-9]+:" | head -15

# 线程分析
echo ""
echo "--- 线程堆栈分析 ---"
jcmd $PID Thread.print | grep -A 20 "ThreadLocal"

echo ""
echo "建议在 MAT 中使用 OQL 查询："
echo "SELECT t from java.lang.Thread t WHERE t.getName() LIKE \"%\""
```

### 实战案例三：ClassLoader 泄漏

```bash
#!/bin/bash
# case-classloader.sh - ClassLoader 泄漏排查

echo "=== ClassLoader 内存泄漏排查 ==="
echo ""

# 检查元空间使用
echo "--- 元空间使用情况 ---"
jstat -metaspace $PID

# 获取类加载统计
echo ""
echo "--- 类加载统计 ---"
jstat -class $PID

# 获取堆转储
DUMP_FILE=/tmp/heap_classloader.hprof
jcmd $PID GC.heap_dump $DUMP_FILE

# 分析 ClassLoader
echo ""
echo "--- ClassLoader 统计 ---"
jcmd $PID GC.class_histogram | grep -i classloader

echo ""
echo "建议在 MAT 中执行："
echo "1. 打开堆转储"
echo "2. 使用 Dominator Tree 视图"
echo "3. 查找 ClassLoader 节点"
echo "4. 检查其保留的对象"
```

## 内存优化最佳实践

### JVM 内存配置优化

```bash
#!/bin/bash
# jvm-memory-optimization.sh - JVM 内存配置优化

echo "=== JVM 内存配置优化建议 ==="
echo ""

# 获取当前配置
PID=$1

if [ -z "$PID" ]; then
    echo "用法: $0 <PID>"
    exit 1
fi

echo "--- 当前配置分析 ---"

# 堆配置
MAX_HEAP=$(jinfo -flag MaxHeapSize $PID | awk -F= '{print $2}')
INIT_HEAP=$(jinfo -flag InitialHeapSize $PID | awk -F= '{print $2}')

echo "最大堆: $(($MAX_HEAP/1024/1024)) MB"
echo "初始堆: $(($INIT_HEAP/1024/1024)) MB"

# GC 配置
echo ""
echo "--- GC 配置 ---"
jinfo -flag UseG1GC $PID
jinfo -flag UseSerialGC $PID

# 使用情况
echo ""
echo "--- 当前使用情况 ---"
jstat -gcutil $PID | tail -1

# 优化建议
echo ""
echo "--- 优化建议 ---"

# 建议 1：堆大小
let "RECOMMENDED_MAX = MAX_HEAP * 2"
echo "建议最大堆: $(($RECOMMENDED_MAX/1024/1024)) MB"

# 建议 2：GC 选择
if [ "$(jinfo -flag UseSerialGC $PID)" == "+" ]; then
    echo "建议: 如果应用较大，考虑切换到 G1GC"
fi

# 建议 3：元空间
METASPACE=$(jstat -metaspace $PID | tail -1 | awk '{print $2}')
echo "元空间使用: $METASPACE KB"
```

### 内存使用基线管理

```bash
#!/bin/bash
# memory-baseline.sh - 内存使用基线管理

BASELINE_FILE=/tmp/memory-baseline.txt
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

echo "=== 内存使用基线收集 ==="
echo ""

# 获取当前状态
PID=$1

if [ -z "$PID" ]; then
    echo "未指定 PID，使用第一个 Java 进程"
    PID=$(jps -q)
fi

echo "PID: $PID"
echo "时间: $TIMESTAMP"

# 收集数据
echo ""
echo "--- 堆内存 ---"
jstat -gcutil $PID

echo ""
echo "--- 元空间 ---"
jstat -metaspace $PID

echo ""
echo "--- 类加载 ---"
jstat -class $PID

echo ""
echo "--- 编译 ---"
jstat -compile $PID

# 保存基线
if [ -f "$BASELINE_FILE" ]; then
    echo ""
    echo "--- 与基线对比 ---"
    echo "基线时间: $(head -1 $BASELINE_FILE)"
    echo "当前时间: $TIMESTAMP"
fi
```

### 生产环境内存监控

```bash
#!/bin/bash
# production-memory-monitor.sh - 生产环境内存监控

ALERT_HEAP=90  # 堆内存告警阈值 %
ALERT_META=90  # 元空间告警阈值 %
INTERVAL=${1:-60}

echo "=== 生产环境内存监控 ==="
echo "告警阈值 - 堆: ${ALERT_HEAP}% 元空间: ${ALERT_META}%"
echo "刷新间隔: ${INTERVAL}秒"
echo ""

while true; do
    TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
    
    # 获取所有 Java 进程
    for PID in $(jps -q); do
        PROC_NAME=$(jps -l $PID | awk '{print $2}')
        
        # 获取堆使用
        HEAP_STATS=$(jstat -gcutil $PID 2>/dev/null | tail -1)
        if [ ! -z "$HEAP_STATS" ]; then
            HEAP_USAGE=$(echo $HEAP_STATS | awk '{print $NF}')
            META_USAGE=$(jstat -metaspace $PID 2>/dev/null | tail -1 | awk '{print $NF}')
            
            # 堆告警
            if [ $(echo "$HEAP_USAGE > $ALERT_HEAP" | bc) -eq 1 ]; then
                echo "[$TIMESTAMP] ⚠️  高堆内存告警"
                echo "  进程: $PID ($PROC_NAME)"
                echo "  堆使用: $HEAP_USAGE%"
                echo "  建议: 生成堆转储进行深度分析"
                echo ""
            fi
            
            # 元空间告警
            if [ $(echo "$META_USAGE > $ALERT_META" | bc) -eq 1 ]; then
                echo "[$TIMESTAMP] ⚠️  高元空间告警"
                echo "  进程: $PID ($PROC_NAME)"
                echo "  元空间使用: $META_USAGE%"
                echo "  建议: 检查类加载和动态代理使用"
                echo ""
            fi
        fi
    done
    
    sleep $INTERVAL
done
```

## 内存分析命令速查

### jmap 命令速查

| 命令 | 说明 |
|-----|------|
| `jmap -heap <pid>` | 显示堆配置和使用情况 |
| `jmap -histo <pid>` | 显示对象直方图 |
| `jmap -histo:live <pid>` | 显示存活对象直方图 |
| `jmap -dump:file=heap.hprof <pid>` | 生成堆转储 |
| `jmap -permstat <pid>` | 显示永久代统计 |
| `jmap -finalizerinfo <pid>` | 显示待 Finalize 对象 |

### jstat 命令速查

| 命令 | 说明 |
|-----|------|
| `jstat -gcutil <pid>` | GC 统计摘要 |
| `jstat -gccapacity <pid>` | 堆容量统计 |
| `jstat -gcnew <pid>` | 新生代统计 |
| `jstat -gcold <pid>` | 老年代统计 |
| `jstat -gcmetaspace <pid>` | 元空间统计 |
| `jstat -class <pid>` | 类加载统计 |

### jcmd 命令速查

| 命令 | 说明 |
|-----|------|
| `jcmd <pid> GC.heap_info` | 获取堆信息 |
| `jcmd <pid> GC.heap_dump <file>` | 生成堆转储 |
| `jcmd <pid> GC.class_histogram` | 类直方图 |
| `jcmd <pid> VM.native_memory` | 本地内存跟踪 |

## 常见问题 FAQ

### 如何选择堆转储时机？

**建议时机**：
- Full GC 后（反映稳态）
- 内存使用高峰时
- OOM 发生时（自动生成）
- 定期（如每天一次）

```bash
# OOM 时自动生成堆转储
java -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/path/to/dumps ...
```

### 堆转储文件过大怎么办？

**解决方案**：
1. 使用 `live=true` 只转储存活对象
2. 压缩存储（gzip）
3. 使用 MAT 的堆索引
4. 采样分析（对于超大堆）

### 如何分析 MAT 转储文件？

**优化建议**：
1. 增加 MAT 内存（MemoryAnalyzer.ini）
2. 使用 64 位 MAT
3. 只分析感兴趣的区域
4. 使用 OQL 定向查询

### 如何验证内存泄漏已修复？

**验证方法**：
1. 部署后持续监控内存使用
2. 观察内存使用是否持续增长
3. 对比修复前后的内存曲线
4. 多次 Full GC 后检查内存释放情况

### 内存使用正常但还是 OOM？

**可能原因**：
1. Metaspace 溢出
2. 直接内存溢出（DirectBuffer）
3. 线程栈溢出
4. GC overhead limit exceeded

```bash
# 排查方向
jcmd <pid> VM.native_memory summary  # 本地内存
jstat -metaspace <pid>              # 元空间
ulimit -a                           # 系统限制
```

## 相关资源

### 官方文档
- [MAT 官方文档](https://help.eclipse.org/latest/topic/org.eclipse.mat.ui.help/welcome.html)
- [JVM 内存管理](https://docs.oracle.com/javase/8/docs/technotes/guides/vm/gctuning/)
- [jmap 文档](https://docs.oracle.com/en/java/javase/17/docs/specs/man/jmap.html)

### 分析工具
- [Eclipse MAT](https://eclipse.dev/mat/)
- [VisualVM](https://visualvm.github.io/)
- [JProfiler](https://www.ej-technologies.com/products/jprofiler/overview.html)
- [YourKit](https://www.yourkit.com/)

### 性能优化
- [Java 性能优化指南](https://docs.oracle.com/en/java/javase/17/perform/)
- [Garbage Collection Tuning Guide](https://docs.oracle.com/en/java/javase/17/gctuning/)

