# jstat - JVM 统计监控工具

[[toc]]

## 工具概述

jstat（JVM Statistics Monitoring Tool）是 JDK 内置的轻量级监控工具，无需额外安装，可以快速获取 JVM 运行时的各种统计信息。该工具主要用于监控垃圾回收（GC）性能、内存使用趋势和类加载器状态，是性能调优和问题排查的重要工具。

**工具特点**：
- 轻量级：纯命令行操作，开销极低
- 实时性：可实时获取 JVM 内部统计信息
- 便捷性：无需修改应用代码或配置
- 兼容性：支持本地和远程 JVM 监控

**主要用途**：
- 监控 GC 频率和耗时
- 分析内存使用趋势
- 检测内存泄漏
- 评估 GC 调优效果
- 监控类加载/卸载情况

## 安装与基本使用

### 环境要求

jstat 随 JDK 提供，JDK 8 及以上版本均可使用。确保环境变量中配置了 `JAVA_HOME`，使其 `bin` 目录下的 jstat 可执行文件可在命令行中直接调用。

```bash
# 验证 jstat 是否可用
jstat -help
```

### 基本语法

```bash
jstat -<option> [-t] [-h<lines>] <vmid> [<interval> [<count>]]
```

**参数说明**：

| 参数 | 说明 |
|-----|------|
| `-<option>` | 指定要输出的统计信息类型（必选） |
| `-t` | 在输出中包含时间戳列（从 JVM 启动开始的秒数） |
| `-h<lines>` | 每隔指定行数输出一次列标题 |
| `<vmid>` | JVM 进程 ID 或远程连接字符串 |
| `<interval>` | 输出间隔时间（毫秒），默认只输出一次 |
| `<count>` | 输出次数，默认无限直到进程结束 |

**vmid 格式**：
- 本地进程：进程 ID（如 12345）
- 本地 JVM：`<pid>@<hostname>:<port>`（使用 JMX 连接）
- 远程 JVM：`<hostname>:<port>`（使用 JMX 连接）

### 快速入门示例

```bash
# 查看进程 ID
jps -l

# 使用 jstat 监控 GC 情况（每 1 秒输出一次，共输出 10 次）
jstat -gcutil 12345 1000 10

# 包含时间戳的监控输出
jstat -gcutil -t 12345 1000 10

# 每 5 行输出一次列标题
jstat -gcutil -h5 12345 1000 10
```

## GC 统计监控

### 监控 GC 活动（gcutil）

`-gcutil` 选项是最常用的监控命令，显示各内存区域的使用百分比和 GC 统计信息。

```bash
# 监控 GC 统计信息
jstat -gcutil <PID> [interval] [count]
```

**输出示例**：

```
  S0     S1     E      O      M     CCS    YGC     YGCT     FGC    FGCT     CGC    CGCT       GCT
  0.00   0.00   4.01   8.27  95.65  90.66     11     0.046     9     0.337     -         -     0.382
  0.00   0.00   4.01   8.27  95.65  90.66     11     0.046     9     0.337     -         -     0.382
  0.00   0.00   4.01   8.27  95.65  90.66     11     0.046     9     0.337     -         -     0.382
```

**列说明**：

| 列名 | 说明 | 含义 |
|-----|------|------|
| S0 | Survivor Space 0 使用率 | 新生代第一个 Survivor 区的已使用百分比 |
| S1 | Survivor Space 1 使用率 | 新生代第二个 Survivor 区的已使用百分比 |
| E | Eden Space 使用率 | Eden 区的已使用百分比 |
| O | Old Generation 使用率 | 老年代的已使用百分比 |
| M | Metaspace 使用率 | 元空间的已使用百分比 |
| CCS | Compressed Class Space 使用率 | 压缩类空间的已使用百分比 |
| YGC | Young GC 次数 | 从 JVM 启动至今发生的 Young GC 总次数 |
| YGCT | Young GC 耗时 | Young GC 总耗时（秒） |
| FGC | Full GC 次数 | 从 JVM 启动至今发生的 Full GC 总次数 |
| FGCT | Full GC 耗时 | Full GC 总耗时（秒） |
| CGC | Concurrent GC 次数 | 并发 GC 总次数（G1GC/ZGC/Shenandoah 特有） |
| CGCT | Concurrent GC 耗时 | 并发 GC 总耗时（秒）（G1GC/ZGC/Shenandoah 特有） |
| GCT | GC 总耗时 | 所有 GC 耗时总和（秒） |

### 监控内存池详情（gc）

`-gc` 选项显示各内存池的容量和使用量（字节）。

```bash
# 查看内存池详情
jstat -gc <PID> 1000 5
```

**输出示例**：

```
S0C         S1C         S0U         S1U          EC           EU           OC           OU          MC         MU       CCSC      CCSU     YGC    YGCT     FGC    FGCT     CGC    CGCT       GCT
14336.0     14848.0         0.0         0.0      62976.0       2523.9     146432.0      12103.0    23168.0    22159.3    2688.0    2436.9     11     0.046     9     0.337     -         -     0.382
```

**列说明**：

| 列名 | 说明 | 单位 |
|-----|------|------|
| S0C | Survivor 0 容量 | KB |
| S1C | Survivor 1 容量 | KB |
| S0U | Survivor 0 已使用 | KB |
| S1U | Survivor 1 已使用 | KB |
| EC | Eden 容量 | KB |
| EU | Eden 已使用 | KB |
| OC | 老年代容量 | KB |
| OU | 老年代已使用 | KB |
| MC | Metaspace 容量 | KB |
| MU | Metaspace 已使用 | KB |
| CCSC | 压缩类空间容量 | KB |
| CCSU | 压缩类空间已使用 | KB |
CGC    CGCT       GCT
### 监控 GC 容量信息（gccapacity）

`-gccapacity` 选项显示各内存池的容量和最大容量信息。

```bash
# 查看 GC 容量信息
jstat -gccapacity <PID> 1000 5
```

**输出示例**：

```
NGCMN     NGCMX     NGC      S0C      S1C       EC       OGCMN     OGCMX      OGC        OC         MCMN   MCMX        MC       CCSMN  CCSMX     CCSC   YGC    FGC   CGC
86528.0   238592.0  96256.0  14336.0  14848.0   62976.0  173568.0  478208.0   146432.0   146432.0   0.0    1069056.0   23168.0  0.0    1048576.0 2688.0  11     9     -
```

**列说明**：

| 列名 | 说明 | 单位 |
|-----|------|------|
| NGCMN | 新生代最小容量 | KB |
| NGCMX | 新生代最大容量 | KB |
| NGC | 新生代当前容量 | KB |
| OGCMN | 老年代最小容量 | KB |
| OGCMX | 老年代最大容量 | KB |
| OGC | 老年代当前容量 | KB |
| MCMN | Metaspace 最小容量 | KB |
| MCMX | Metaspace 最大容量 | KB |

### 监控 GC 原因统计（gccause）

`-gccause` 选项显示 GC 原因统计信息，包括最近一次 GC 的原因。

```bash
# 查看 GC 原因统计
jstat -gccause <PID> 1000 5
```

**输出示例**：

```
S0     S1     E      O      M     CCS    YGC     YGCT     FGC    FGCT     CGC    CGCT       GCT    LGCC                 GCC
0.00   0.00   4.01   8.27  95.65  90.66  11     0.046     9     0.337     -         -     0.382 System.gc()          No GC
```

**关键列说明**：

| 列名 | 说明 |
|-----|------|
| LGCC | 最近一次 GC 的原因（Last GCC Reason） |
| GCC | 当前 GC 的原因（GCCause） |

**常见的 GC 原因**：

| 原因 | 说明 |
|-----|------|
| Allocation Failure | 对象分配失败（新生代空间不足） |
| G1 Evacuation Pause | G1 GC 的疏散暂停 |
| Metadata GC Threshold | 元空间达到阈值触发 GC |
| Ergonomics | 自适应调整触发 GC |
| System.gc() | 显式调用 System.gc() |

## 性能分析实战

### 检测内存泄漏

内存泄漏是 Java 应用最常见的问题之一，通过 jstat 可以快速发现内存增长趋势。

**内存泄漏特征**：
- 老年代（O）使用率持续增长
- Full GC 频率增加但无法释放内存
- YGC 耗时逐渐增加

```bash
# 持续监控内存使用趋势（每 5 秒输出一次）
jstat -gcutil -t <PID> 5000

# 观察输出中的 OU（老年代已使用）列
# 如果 OU 值持续增长且接近 O（老年代容量），可能存在内存泄漏
```

**内存泄漏分析流程**：

```bash
THRESHOLD_OLD=90  # 老年代使用率阈值
THRESHOLD_FGC=10  # Full GC 次数阈值（相比基线）


while true; do
    # Step 1：持续监控内存使用
    read S0 S1 E O M CCS YGC YGCT FGC FGCT GCT <<< $(jstat -gcutil $(pgrep -f "MyApp") 1000 | tail -1)

    # Step 2：发现异常后进行堆转储
    if (( $(echo "$O > $THRESHOLD_OLD" | bc -l) )); then
        echo "警告：老年代使用率过高 ($O%)，执行堆转储..."
        jcmd $(pgrep -f "MyApp") GC.heap_dump /tmp/heap_dump_$(date +%Y%m%d_%H%M%S).hprof
    fi
    sleep 5
done

# Step 3：使用 MAT 分析堆转储文件
# mat /tmp/heap_dump.hprof
```

### 分析 GC 调优效果

通过对比调优前后的 GC 统计信息，评估调优效果。

**调优前监控**：

```bash
# 记录调优前的 GC 状态
jstat -gcutil -t 12345 1000 60 > gc_before.log

# 关键指标
# YGC: Young GC 频率
# FGC: Full GC 频率
# GCT: GC 总耗时
```

**调优后对比**：

```bash
# 记录调优后的 GC 状态
jstat -gcutil -t 12345 1000 60 > gc_after.log

# 对比分析
# 期望看到：FGC 减少、YGCT 降低、GCT 占比下降
```

### 评估堆内存配置合理性

通过观察各内存区域的使用情况，评估当前堆配置是否合理。

```bash
# 完整的内存池监控
jstat -gc 12345 1000 10
```

**配置分析要点**：

```
年轻代配置分析：
- S0/S1 使用率波动是否合理（应该在 0-70% 之间循环）
- Eden 区是否有足够的空间避免频繁 Minor GC
- 如果 S0/S1 使用率经常接近 100%，考虑增加年轻代大小

老年代配置分析：
- 老年代使用率是否稳定
- Full GC 后 OU 是否能回到合理水平
- 如果 Full GC 后 OU 仍很高，考虑增加老年代或优化代码

元空间配置分析：
- M（Metaspace 使用率）是否持续增长
- 是否经常触发 Metadata GC
- 如果频繁触发 Metadata GC，考虑增加 Metaspace 大小
```

### 监控堆内存分配与回收趋势

通过 `-gcnew` 和 `-gcold` 选项分别监控新生代和老年代的详细统计信息。

```bash
# 新生代详细统计
jstat -gcnew <PID> 1000 10

# 老年代详细统计
jstat -gcold <PID> 1000 10
```

**新生代监控输出**：

```
 S0C    S1C    S0U    S1U   TT MTT  DSS      EC        EU         YGC   YGCT
1024.0 1024.0  512.0   0.0  6  15  512.0   8192.0   2048.0      156   2.345
```

**列说明**：

| 列名 | 说明 |
|-----|------|
| TT | 对象在 Survivor 区的晋升阈值 |
| MTT | 最大晋升阈值 |
| DSS | 期望的 Survivor 大小 |

## 类加载统计

### 监控类加载情况（class）

`-class` 选项显示类加载器的详细统计信息。

```bash
# 查看类加载统计
jstat -class <PID> 1000 10
```

**输出示例**：

```
Loaded  Bytes  Unloaded  Bytes     Time
 12456  24567.8      123   234.5      45.67
```

**列说明**：

| 列名 | 说明 | 单位 |
|-----|------|------|
| Loaded | 已加载的类数量 | 个 |
| Bytes | 已加载类占用的空间 | KB |
| Unloaded | 已卸载的类数量 | 个 |
| Bytes | 已卸载类释放的空间 | KB |
| Time | 类加载/卸载总耗时 | 秒 |

### 检测类加载异常

```bash
# 持续监控类加载情况
while true; do
    jstat -class $(pgrep -f "MyApp") | tail -1
    sleep 10
done

# 如果 Unloaded 数量持续增长，可能存在：
# - 热部署场景下的类卸载问题
# - 内存泄漏导致类加载器无法回收
# - 动态代理类大量生成
```

## 编译统计

### 监控 JIT 编译情况（compiler）

`-compiler` 选项显示 JIT 编译统计信息。

```bash
# 查看 JIT 编译统计
jstat -compiler <PID>
```

**输出示例**：

```
Compiled Failed  Invalid   Time   FailedType FailedMethod
   1234      5       0    123.45        1    org/example/MyClass::method
```

**列说明**：

| 列名 | 说明 |
|-----|------|
| Compiled | 成功编译的方法数 |
| Failed | 编译失败的方法数 |
| Invalid | 失效的编译数量 |
| Time | 编译总耗时 |
| FailedType | 最近一次失败的原因类型 |
| FailedMethod | 最近一次失败的编译方法 |

### 监控 JIT 编译详情（printcompilation）

`-printcompilation` 选项显示最近编译的方法。

```bash
# 查看最近编译的方法
jstat -printcompilation <PID>
```

**输出示例**：

```
Compiled  Size  Type Method
    1235     456    1 org/example/MyClass::doSomething
```

## 远程监控配置

### JMX 远程连接配置

要监控远程 JVM，需要在启动时配置 JMX 参数。

```bash
# 启动应用时配置 JMX
java -Dcom.sun.management.jmxremote \
     -Dcom.sun.management.jmxremote.port=9010 \
     -Dcom.sun.management.jmxremote.ssl=false \
     -Dcom.sun.management.jmxremote.authenticate=false \
     -jar myapp.jar
```

### 远程监控命令

```bash
# 通过 JMX 远程连接
jstat -gcutil user@hostname:9010 1000 10

# 或使用远程进程 ID 格式
jstat -gcutil <pid>@<hostname>:<port> 1000 10
```

**安全考虑**：

```bash
# 生产环境建议配置认证
java -Dcom.sun.management.jmxremote \
     -Dcom.sun.management.jmxremote.port=9010 \
     -Dcom.sun.management.jmxremote.ssl=true \
     -Dcom.sun.management.jmxremote.authenticate=true \
     -Djava.rmi.server.hostname=<hostname> \
     -jar myapp.jar
```

## 常用命令速查

### 日常监控命令

```bash
# 快速查看 GC 概况（最常用）
jstat -gcutil <PID>

# 监控内存使用趋势
jstat -gc -t <PID> 1000 10

# 查看类加载情况
jstat -class <PID>

# 查看 JIT 编译情况
jstat -compiler <PID>
```

### 详细分析命令

```bash
# 完整的 GC 统计
jstat -gccause <PID>

# 内存池容量信息
jstat -gccapacity <PID>

# 新生代详细统计
jstat -gcnew <PID>

# 老年代详细统计
jstat -gcold <PID>

# 元空间统计
jstat -gcmetacapacity <PID>
```

### 一站式监控脚本

```bash
#!/bin/bash
# jstat-monitor.sh - 一站式 JVM 监控脚本

PID=$1
INTERVAL=${2:-1000}
COUNT=${3:-60}

if [ -z "$PID" ]; then
    echo "用法: $0 <PID> [interval] [count]"
    echo "示例: $0 12345 1000 60"
    exit 1
fi

echo "=== JVM 内存与 GC 监控 ==="
echo "进程 ID: $PID"
echo "监控间隔: ${INTERVAL}ms"
echo "监控次数: $COUNT"
echo ""

echo "--- GC 统计概览 ---"
jstat -gcutil -t -h10 $PID $INTERVAL $COUNT

echo ""
echo "--- 内存池详情 ---"
jstat -gc -h5 $PID $INTERVAL 3

echo ""
echo "--- 类加载统计 ---"
jstat -class $PID

echo ""
echo "--- JIT 编译统计 ---"
jstat -compiler $PID
```

## 与其他工具集成

### jstat + jps 组合使用

```bash
# 查看所有 Java 进程
jps -lm

# 选择目标进程进行监控
jps -lm | grep "MyApp"
# 输出示例: 12345 com.example.MyApp

# 监控特定进程
jstat -gcutil 12345 1000 10
```

### jstat + jcmd 组合使用

```bash
# 使用 jstat 监控发现问题
jstat -gcutil 12345 1000 10

# 使用 jcmd 进行进一步诊断
jcmd 12345 GC.heap_info
jcmd 12345 VM.native_memory summary
```

### jstat + 分析工具集成

```bash
#!/bin/bash
# 自动收集 GC 数据并生成报告

PID=$1
OUTPUT_DIR=/tmp/jstat-report
mkdir -p $OUTPUT_DIR

# 收集 60 秒的 GC 数据
jstat -gcutil -t $PID 1000 60 > $OUTPUT_DIR/gc-$(date +%Y%m%d-%H%M%S).log

# 生成简报
echo "=== GC 性能报告 ==="
tail -5 $OUTPUT_DIR/*.log | grep -E "^.*[0-9]+\.[0-9]+.*$"

# 提取关键指标
awk '/^[0-9]+.*$/ {sum_ygct+=$8; sum_fgct+=$10; count++}
     END {print "平均 YGCT: " sum_ygct/count "s, 平均 FGCT: " sum_fgct/count "s"}' \
    $OUTPUT_DIR/gc-*.log
```

## 性能影响与最佳实践

### 性能影响评估

jstat 是一个轻量级工具，其性能影响可以忽略不计：

| 监控选项 | 推荐使用场景 |
|---------|-------------|
| -gcutil | 生产环境持续监控 |
| -gc | 详细内存分析 |
| -class | 类加载问题排查 |
| -compiler | JIT 编译分析 |

### 最佳实践建议

```bash
# 生产环境监控建议
# 1. 使用 -gcutil 获取概览，开销最低
# 2. 监控间隔设为 1-5 秒，避免过于频繁
# 3. 结合 -t 参数记录时间戳，便于问题追溯
# 4. 使用输出重定向将数据保存到文件进行分析

# 示例：生产环境持续监控
jstat -gcutil -t -h100 12345 5000 > /var/log/jstat-gc.log &

# 问题排查时使用详细监控
jstat -gccause 12345 1000 60 > gc-detail.log
```

### 常见问题排查

**问题 1：jstat 无法连接进程**

```bash
# 检查进程是否存在
jps | grep <PID>

# 检查进程是否以正确的用户运行
ps -ef | grep <PID>

# 检查 SELinux 或防火墙设置
# 可能需要关闭或配置例外
```

**问题 2：输出数据显示异常**

```bash
# 可能是进程已退出
jps | grep <PID>

# 尝试使用不同的监控选项
jstat -gc <PID>
jstat -class <PID>
```

**问题 3：远程监控连接失败**

```bash
# 检查 JMX 配置是否正确
# 1. 验证远程主机的 JMX 端口是否开放
telnet <hostname> <port>

# 2. 检查防火墙规则
iptables -L -n | grep <port>

# 3. 验证 JMX 认证配置
```

## 进阶技巧

### 自动化告警脚本

```bash
#!/bin/bash
# gc-alert.sh - GC 异常告警脚本

PID=$1
WARNING_THRESHOLD=80
CRITICAL_THRESHOLD=90

while true; do
    # 获取老年代使用率
    OLD_USAGE=$(jstat -gcutil $PID | tail -1 | awk '{print $4}')
    
    if [ $(echo "$OLD_USAGE > $CRITICAL_THRESHOLD" | bc) -eq 1 ]; then
        echo "[CRITICAL] 老年代使用率: ${OLD_USAGE}%"
        # 发送告警通知
        # curl -X POST "https://alert.example.com/notify?severity=critical"
    elif [ $(echo "$OLD_USAGE > $WARNING_THRESHOLD" | bc) -eq 1 ]; then
        echo "[WARNING] 老年代使用率: ${OLD_USAGE}%"
        # 发送警告通知
    fi
    
    sleep 60
done
```

### GC 性能基线管理

```bash
#!/bin/bash
# baseline.sh - 建立 GC 性能基线

PID=$1
BASELINE_FILE=/tmp/gc-baseline-$(date +%Y%m%d).log

# 收集 5 分钟的 GC 数据
echo "建立 GC 性能基线..."
jstat -gcutil -t $PID 1000 300 > $BASELINE_FILE

# 分析基线数据
echo "=== GC 性能基线 ==="
echo "采集时间: $(date)"
echo "数据文件: $BASELINE_FILE"
echo ""

# 统计 Full GC 频率
FGC_COUNT=$(tail -n +2 $BASELINE_FILE | awk '{print $9}' | tail -1)
FGC_TIME=$(tail -n +2 $BASELINE_FILE | awk '{print $10}' | tail -1)
echo "Full GC 次数: $FGC_COUNT"
echo "Full GC 总耗时: ${FGC_TIME}s"

# 评估结果
if [ $(echo "$FGC_COUNT > 10" | bc) -eq 1 ]; then
    echo "⚠️ Full GC 频率过高，建议优化"
fi
```


### 性能基线管理

建立性能基线是有效监控的关键：

```bash
#!/bin/bash
# 性能基线收集脚本

# 收集基准数据
jstat -gcutil <PID> 1000 10 > baseline_gc.txt
jstat -class <PID> > baseline_class.txt
jstat -compiler <PID> > baseline_compiler.txt

# 记录时间戳
date > baseline_timestamp.txt

# 存储基线
tar -czf performance_baseline_$(date +%Y%m%d).tar.gz baseline_*.txt

# 后续对比
# jstat -gcutil <PID> 1000 > current_gc.txt
# diff baseline_gc.txt current_gc.txt
```

## 相关资源

### 官方文档
- [jstat 官方文档](https://docs.oracle.com/en/java/javase/17/docs/specs/man/jstat.html)
- [JVM 监控与诊断工具](https://docs.oracle.com/en/java/javase/17/gctuning/)

### 性能优化参考
- [Oracle Java 性能优化指南](https://docs.oracle.com/en/java/javase/17/perform/)
- [GC 调优完整指南](https://www.baeldung.com/jvm-garbage-collection)

### 社区资源
- [Stack Overflow - jstat](https://stackoverflow.com/questions/tagged/jstat)
- [GitHub - JVM 诊断工具集合](https://github.com/analysis-tools/jvm-tools)

