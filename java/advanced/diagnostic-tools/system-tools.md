# Java 系统级诊断工具详解

系统级诊断工具用于监控 JVM 的运行状况、系统资源使用情况和环境配置信息。这些工具对于排查性能问题、资源争用和系统配置异常至关重要。本章节全面介绍 Java 系统级诊断工具的使用方法和最佳实践，帮助开发者建立完整的系统监控体系。

## 工具概览

### 系统级诊断工具分类

```
系统级诊断工具体系：
├── JVM 系统信息工具
│   ├── jinfo - JVM 配置信息查看与修改
│   ├── jps - Java 进程状态查看
│   ├── jcmd - 综合诊断命令入口
│   └── jstatd - JVM 统计监控守护进程
│
├── 系统资源监控工具
│   ├── 处理器资源监控
│   ├── 内存资源监控
│   ├── I/O 资源监控
│   └── 网络资源监控
│
├── JVM 运行时信息工具
│   ├── Runtime 运行时信息
│   ├── ManagementFactory 管理工厂
│   ├── MBean 服务器访问
│   └── 自定义监控指标
│
└── 系统环境诊断工具
    ├── 环境变量诊断
    ├── 系统属性诊断
    ├── 类路径诊断
    └── 模块系统诊断
```

### 系统诊断核心指标

```
关键系统指标体系：
├── CPU 相关指标
│   ├── CPU 使用率
│   ├── CPU 负载
│   ├── 上下文切换
│   └── 线程 CPU 时间
│
├── 内存相关指标
│   ├── 堆内存使用
│   ├── 元空间使用
│   ├── 直接内存使用
│   └── 线程栈内存
│
├── 线程相关指标
│   ├── 线程数量
│   ├── 线程状态分布
│   ├── 死锁检测
│   └── 线程 CPU 占用
│
├── GC 相关指标
│   ├── GC 频率
│   ├── GC 耗时
│   ├── GC 暂停时间
│   └── 内存回收效率
│
└── I/O 相关指标
    ├── 文件 I/O 统计
    ├── 网络 I/O 统计
    ├── 缓冲区使用
    └── I/O 等待时间
```

## jinfo - JVM 配置信息工具深入解析

jinfo 是 JDK 内置的 JVM 配置信息查看和动态修改工具，能够帮助开发者了解 JVM 的当前配置，并在运行时进行参数调整。

### JVM 参数查看与分析

```bash
#!/bin/bash
# jvm-config-analysis.sh - JVM 配置全面分析

PID=$1

if [ -z "$PID" ]; then
    echo "用法: $0 <PID>"
    exit 1
fi

echo "=== JVM 配置全面分析 (PID: $PID) ==="
echo ""

# 1. 堆内存配置
echo "--- 堆内存配置 ---"
echo "最大堆: $(jinfo -flag MaxHeapSize $PID 2>/dev/null | cut -d= -f2)"
echo "初始堆: $(jinfo -flag InitialHeapSize $PID 2>/dev/null | cut -d= -f2)"
echo "新生代: $(jinfo -flag NewSize $PID 2>/dev/null | cut -d= -f2)"
echo "老年代: $(jinfo -flag OldSize $PID 2>/dev/null | cut -d= -f2)"

# 2. GC 配置
echo ""
echo "--- GC 配置 ---"
echo "GC 策略: $(jinfo -flag UseG1GC $PID 2>/dev/null | grep -q '+' && echo 'G1GC' || \
           jinfo -flag UseConcMarkSweepGC $PID 2>/dev/null | grep -q '+' && echo 'CMS' || \
           jinfo -flag UseParallelGC $PID 2>/dev/null | grep -q '+' && echo 'ParallelGC' || \
           echo 'SerialGC')"
echo "并行 GC 线程: $(jinfo -flag ParallelGCThreads $PID 2>/dev/null | cut -d= -f2)"

# 3. 元空间配置
echo ""
echo "--- 元空间配置 ---"
echo "最大元空间: $(jinfo -flag MaxMetaspaceSize $PID 2>/dev/null | cut -d= -f2)"
echo "初始元空间: $(jinfo -flag MetaspaceSize $PID 2>/dev/null | cut -d= -f2)"

# 4. 线程配置
echo ""
echo "--- 线程配置 ---"
echo "线程栈大小: $(jinfo -flag Xss $PID 2>/dev/null | cut -d= -f2)"
echo "最大线程数: $(jinfo -flag MaxJavaStackTraceDepth $PID 2>/dev/null | cut -d= -f2)"

# 5. JIT 编译配置
echo ""
echo "--- JIT 编译配置 ---"
echo "编译阈值: $(jinfo -flag CompileThreshold $PID 2>/dev/null | cut -d= -f2)"
echo "Tiered 编译: $(jinfo -flag TieredCompilation $PID 2>/dev/null | grep -q '+' && echo '启用' || echo '禁用')"

# 6. 性能相关配置
echo ""
echo "--- 性能优化配置 ---"
echo "TLAB 分配: $(jinfo -flag UseTLAB $PID 2>/dev/null | grep -q '+' && echo '启用' || echo '禁用')"
echo "逃逸分析: $(jinfo -flag DoEscapeAnalysis $PID 2>/dev/null | grep -q '+' && echo '启用' || echo '禁用')"
echo "压缩指针: $(jinfo -flag UseCompressedOops $PID 2>/dev/null | grep -q '+' && echo '启用' || echo '禁用')"

# 7. 诊断配置
echo ""
echo "--- 诊断配置 ---"
echo "GC 日志: $(jinfo -flag PrintGCDetails $PID 2>/dev/null | grep -q '+' && echo '启用' || echo '禁用')"
echo "GC 时间戳: $(jinfo -flag PrintGCTimeStamps $PID 2>/dev/null | grep -q '+' && echo '启用' || echo '禁用')"
echo "OOM 转储: $(jinfo -flag HeapDumpOnOutOfMemoryError $PID 2>/dev/null | grep -q '+' && echo '启用' || echo '禁用')"
```

### JVM 参数动态修改

```bash
#!/bin/bash
# jvm-dynamic-tuning.sh - JVM 参数动态调整

PID=$1
ACTION=$2
VALUE=$3

# 可动态调整的参数
DYNAMIC_FLAGS=(
    "PrintGCDetails"
    "PrintGCTimeStamps"
    "PrintGCDateStamps"
    "PrintHeapAtGC"
    "PrintClassHistogram"
    "PrintConcurrentLocks"
    "HeapDumpOnOutOfMemoryError"
    "PrintFlagsFinal"
)

echo "=== JVM 参数动态修改 (PID: $PID) ==="
echo ""

# 检查参数是否可动态修改
check_dynamic() {
    local flag=$1
    # 某些参数需要特定 JDK 版本
    local java_version=$(java -version 2>&1 | head -1 | cut -d'"' -f2 | cut -d'.' -f1)
    
    if [ "$java_version" -ge 9 ]; then
        # JDK 9+ 支持更多动态参数
        echo "dynamic"
    else
        # JDK 8 只支持部分参数
        case $flag in
            PrintGCDetails|PrintGCTimeStamps|HeapDumpOnOutOfMemoryError)
                echo "dynamic"
                ;;
            *)
                echo "static"
                ;;
        esac
    fi
}

# 获取当前参数值
get_flag_value() {
    local flag=$1
    jinfo -flag $flag $PID 2>/dev/null | cut -d= -f2
}

# 设置参数值
set_flag_value() {
    local flag=$1
    local value=$2
    echo "尝试设置 $flag=$value..."
    
    # 使用 jcmd 修改（如果支持）
    if jcmd $PID VM.flags "$flag=$value" 2>/dev/null; then
        echo "✓ $flag 设置成功"
    else
        echo "✗ $flag 不支持动态修改，需要重启 JVM"
    fi
}

# 列出当前所有参数
list_flags() {
    echo "--- 当前 JVM 参数 ---"
    jinfo -flags $PID 2>/dev/null | grep -oE '\-[^+][^ ]*' | sort -u
}

# 启用诊断参数
enable_diagnostic() {
    local flag=$1
    current=$(get_flag_value $flag)
    if [ "$current" == "+" ]; then
        echo "✓ $flag 已启用"
    else
        echo "启用 $flag..."
        set_flag_value $flag "+"
    fi
}

# 禁用诊断参数
disable_diagnostic() {
    local flag=$1
    current=$(get_flag_value $flag)
    if [ "$current" == "-" ]; then
        echo "✓ $flag 已禁用"
    else
        echo "禁用 $flag..."
        set_flag_value $flag "-"
    fi
}

# 根据参数执行操作
case $ACTION in
    list)
        list_flags
        ;;
    get)
        if [ -n "$VALUE" ]; then
            echo "$VALUE: $(get_flag_value $VALUE)"
        fi
        ;;
    enable)
        if [ -n "$VALUE" ]; then
            enable_diagnostic $VALUE
        fi
        ;;
    disable)
        if [ -n "$VALUE" ]; then
            disable_diagnostic $VALUE
        fi
        ;;
    tuning)
        echo "--- 性能调优参数建议 ---"
        echo ""
        echo "推荐配置:"
        echo "  -XX:+UseG1GC                    # 使用 G1 GC"
        echo "  -XX:+ParallelRefProcEnabled     # 并行引用处理"
        echo "  -XX:+AlwaysPreTouch             # 预触摸内存"
        echo "  -XX:MaxGCPauseMillis=200        # 最大 GC 暂停目标"
        ;;
    *)
        echo "用法: $0 <PID> <action> [flag]"
        echo ""
        echo "Actions:"
        echo "  list              - 列出所有参数"
        echo "  get <flag>        - 获取参数值"
        echo "  enable <flag>     - 启用诊断参数"
        echo "  disable <flag>    - 禁用诊断参数"
        echo "  tuning            - 显示调优建议"
        ;;
esac
```

### JVM 系统属性管理

```bash
#!/bin/bash
# system-property-manager.sh - 系统属性管理

PID=$1

if [ -z "$PID" ]; then
    echo "用法: $0 <PID>"
    exit 1
fi

echo "=== 系统属性管理 (PID: $PID) ==="
echo ""

# 1. 列出所有系统属性
echo "--- 所有系统属性 ---"
jcmd $PID VM.system_properties 2>/dev/null

# 2. 查找特定属性
search_property() {
    local pattern=$1
    echo ""
    echo "--- 查找包含 '$pattern' 的属性 ---"
    jcmd $PID VM.system_properties 2>/dev/null | grep -i "$pattern"
}

# 3. 关键属性分析
echo ""
echo "--- 关键属性分析 ---"
echo ""
echo "Java 版本:"
jcmd $PID VM.system_properties 2>/dev/null | grep "java.version"

echo ""
echo "Java 运行时:"
jcmd $PID VM.system_properties 2>/dev/null | grep -E "(java.runtime.name|java.vm.name)"

echo ""
echo "操作系统:"
jcmd $PID VM.system_properties 2>/dev/null | grep -E "(os.name|os.version|os.arch)"

echo ""
echo "文件编码:"
jcmd $PID VM.system_properties 2>/dev/null | grep -E "(file.encoding|sun.stdout.encoding|sun.stderr.encoding)"

echo ""
echo "时区设置:"
jcmd $PID VM.system_properties 2>/dev/null | grep -E "(user.timezone|user.country)"

echo ""
echo "用户信息:"
jcmd $PID VM.system_properties 2>/dev/null | grep -E "(user.name|user.home|user.dir)"
```

## jps - 进程状态深度分析

jps 是 Java 进程状态工具，用于列出系统中所有的 Java 进程及其状态信息。虽然命令简单，但在系统诊断中起着基础性的作用。

### 进程发现与监控

```bash
#!/bin/bash
# java-process-monitor.sh - Java 进程监控

echo "=== Java 进程监控 ==="
echo ""

# 1. 基本进程列表
echo "--- 进程列表 ---"
jps -l

echo ""
echo "--- 详细进程信息 ---"
jps -lm

echo ""
echo "--- JVM 参数信息 ---"
jps -v

# 2. 进程健康检查
health_check() {
    local pid=$1
    local name=$2
    
    # 检查进程是否存活
    if ps -p $pid > /dev/null 2>&1; then
        # 获取 CPU 和内存使用
        local cpu=$(ps -p $pid -o %cpu= 2>/dev/null)
        local mem=$(ps -p $pid -o %mem= 2>/dev/null)
        local time=$(ps -p $pid -o time= 2>/dev/null)
        
        # 获取线程数
        local threads=$(ps -p $pid -o nlwp= 2>/dev/null)
        
        echo "✓ $name (PID: $pid) - CPU: ${cpu}% 内存: ${mem}% 线程: $threads 运行时间: $time"
    else
        echo "✗ $name (PID: $pid) - 进程不存在或已终止"
    fi
}

echo ""
echo "--- 进程健康检查 ---"
for pid in $(jps -q); do
    name=$(jps -l $pid 2>/dev/null | awk '{print $2}')
    health_check $pid "$name"
done

# 3. 进程资源使用趋势
echo ""
echo "--- 资源使用趋势 (5秒间隔) ---"
echo "时间            PID     进程名                   CPU%    内存%   线程"
echo "-------------- ------- ---------------------- ------- ------- -----"

for i in {1..6}; do
    TIMESTAMP=$(date '+%H:%M:%S')
    
    for pid in $(jps -q); do
        name=$(jps -l $pid 2>/dev/null | awk '{print $2}' | cut -d. -f1 | tail -c 20)
        cpu=$(ps -p $pid -o %cpu= 2>/dev/null)
        mem=$(ps -p $pid -o %mem= 2>/dev/null)
        threads=$(ps -p $pid -o nlwp= 2>/dev/null)
        
        if [ -n "$cpu" ]; then
            echo "$TIMESTAMP $pid $name $cpu $mem $threads"
        fi
    done
    
    sleep 5
done
```

### 进程启动参数分析

```bash
#!/bin/bash
# process-argument-analysis.sh - 进程启动参数分析

PID=$1

if [ -z "$PID" ]; then
    echo "用法: $0 <PID>"
    exit 1
fi

echo "=== 进程启动参数分析 (PID: $PID) ==="
echo ""

# 从 /proc 读取命令行参数（Linux）
if [ -f "/proc/$PID/cmdline" ]; then
    echo "--- 启动命令 ---"
    tr '\0' ' ' < /proc/$PID/cmdline
    echo ""
fi

# JVM 参数分类分析
echo "--- JVM 参数分类 ---"
echo ""

# 获取完整的 JVM 参数列表
jinfo -flags $PID 2>/dev/null | grep -oE '\-[A-Za-z][^ ]*' | sort -u

echo ""
echo "--- 内存相关参数 ---"
jinfo -flags $PID 2>/dev/null | grep -oE '\-Xmx[^ ]*|\-Xms[^ ]*|\-XX:MaxHeapSize[^ ]*|\-XX:InitialHeapSize[^ ]*'

echo ""
echo "--- GC 相关参数 ---"
jinfo -flags $PID 2>/dev/null | grep -oE '\-XX:\+Use[A-Za-z]+GC|\-XX:MaxGCPauseMillis[^ ]*|\-XX:GCTimeRatio[^ ]*'

echo ""
echo "--- 调试/诊断参数 ---"
jinfo -flags $PID 2>/dev/null | grep -oE '\-XX:\+Print[A-Za-z]+|\-XX:\+HeapDump|\-Xlog:[^ ]*'

echo ""
echo "--- 应用参数 ---"
# 跳过 JVM 参数，显示应用参数
jinfo -flags $PID 2>/dev/null | sed 's/-[A-Za-z][^ ]*//g' | tr ' ' '\n' | grep -v '^$' | head -20

# 参数冲突检测
echo ""
echo "--- 参数冲突检测 ---"

# 检测多个 GC 策略
gc_count=$(jinfo -flags $PID 2>/dev/null | grep -oE 'Use[A-Za-z]+GC' | wc -l)
if [ $gc_count -gt 1 ]; then
    echo "⚠️  检测到多个 GC 策略: $(jinfo -flags $PID 2>/dev/null | grep -oE 'Use[A-Za-z]+GC')"
fi

# 检测重复的参数
echo "--- 重复参数检测 ---"
jinfo -flags $PID 2>/dev/null | grep -oE '\-[A-Za-z]+:[^ ]*' | sort | uniq -d
```

### 远程进程发现

```bash
#!/bin/bash
# remote-process-discovery.sh - 远程进程发现

HOST=${1:-localhost}
PORT=${2:-1099}

echo "=== 远程 Java 进程发现 ==="
echo "主机: $HOST:$PORT"
echo ""

# 检查 jstatd 是否运行
check_jstatd() {
    if nc -z $HOST $PORT 2>/dev/null; then
        echo "✓ jstatd 服务在 $PORT 端口运行"
        return 0
    else
        echo "✗ jstatd 服务未运行"
        return 1
    fi
}

# 远程进程列表
remote_jps() {
    echo "--- 远程进程列表 ---"
    jps -J-Djava.rmi.server.hostname=$HOST $HOST:$PORT 2>/dev/null || \
    jps -J-Dcom.sun.management.jmxremote.port=$PORT $HOST:$PORT 2>/dev/null
}

# 进程详细信息
remote_process_detail() {
    local pid=$1
    echo ""
    echo "--- 进程 $pid 详细信息 ---"
    jstat -J-Djava.rmi.server.hostname=$HOST -J-Dcom.sun.management.jmxremote.port=$PORT \
          -gcutil $HOST:$PORT $pid 2>/dev/null
}

# 主流程
if check_jstatd; then
    remote_jps
    
    echo ""
    echo "--- 性能指标监控 ---"
    for pid in $(jps -J-Djava.rmi.server.hostname=$HOST $HOST:$PORT 2>/dev/null | awk '{print $1}'); do
        if [ "$pid" != "Jps" ]; then
            echo "PID: $pid"
            jstat -J-Djava.rmi.server.hostname=$HOST \
                  -J-Dcom.sun.management.jmxremote.port=$PORT \
                  -gcutil $HOST:$PORT $pid 2>/dev/null
        fi
    done
else
    echo ""
    echo "提示: 启动 jstatd 服务"
    echo "  jstatd -J-Djava.rmi.server.hostname=<HOST> -p <PORT> &"
fi
```

## 系统性能监控综合方案

### 性能监控仪表板

```bash
#!/bin/bash
# performance-dashboard.sh - 性能监控仪表板

PID=$1
INTERVAL=${2:-5}
DURATION=${3:-60}

if [ -z "$PID" ]; then
    echo "用法: $0 <PID> [interval] [duration]"
    echo "  interval: 刷新间隔（秒），默认 5"
    echo "  duration: 监控时长（秒），默认 60"
    exit 1
fi

echo "=== Java 应用性能监控仪表板 ==="
echo "PID: $PID"
echo "刷新间隔: ${INTERVAL}秒"
echo "监控时长: ${DURATION}秒"
echo ""

# 清屏函数
clear_screen() {
    printf "\033[2J\033[H"
}

# 头部信息
print_header() {
    clear_screen
    echo "============================================================"
    echo "           Java 应用性能监控仪表板"
    echo "============================================================"
    echo "进程 PID: $PID"
    echo "开始时间: $(date '+%Y-%m-%d %H:%M:%S')"
    echo "刷新间隔: ${INTERVAL}秒"
    echo "------------------------------------------------------------"
}

# CPU 和内存信息
print_cpu_mem() {
    local cpu=$(ps -p $PID -o %cpu= 2>/dev/null)
    local mem=$(ps -p $PID -o %mem= 2>/dev/null)
    local vsz=$(ps -p $PID -o vsz= 2>/dev/null)
    local rss=$(ps -p $PID -o rss= 2>/dev/null)
    
    echo ""
    echo "【CPU 与 内存】"
    echo "  CPU 使用率: ${cpu}%"
    echo "  内存使用率: ${mem}%"
    echo "  虚拟内存: ${vsz} KB"
    echo "  物理内存: ${rss} KB"
}

# 线程信息
print_threads() {
    local threads=$(ps -p $PID -o nlwp= 2>/dev/null)
    local state=$(ps -p $PID -o stat= 2>/dev/null)
    
    echo ""
    echo "【线程信息】"
    echo "  线程总数: $threads"
    echo "  进程状态: $state"
}

# GC 信息
print_gc() {
    local gc_stats=$(jstat -gcutil $PID 2>/dev/null | tail -1)
    local ygc=$(echo $gc_stats | awk '{print $12}')
    local ygct=$(echo $gc_stats | awk '{print $13}')
    local fgc=$(echo $gc_stats | awk '{print $16}')
    local fgct=$(echo $gc_stats | awk '{print $17}')
    
    echo ""
    echo "【GC 统计】"
    echo "  Young GC 次数: $ygc (总耗时: ${ygct}s)"
    echo "  Full GC 次数: $fgc (总耗时: ${fgct}s)"
    echo "  GC 占比: $(echo "scale=2; ($ygct + $fgct) * 100 / $(date +%s)" | bc 2>/dev/null || echo "N/A")%"
}

# 堆内存信息
print_heap() {
    local heap_stats=$(jstat -gc $PID 2>/dev/null | tail -1)
    local s0c=$(echo $heap_stats | awk '{print $1}')
    local s1c=$(echo $heap_stats | awk '{print $2}')
    local ec=$(echo $heap_stats | awk '{print $3}')
    local oc=$(echo $heap_stats | awk '{print $5}')
    local s0u=$(echo $heap_stats | awk '{print $7}')
    local s1u=$(echo $heap_stats | awk '{print $8}')
    local eu=$(echo $heap_stats | awk '{print $4}')
    local ou=$(echo $heap_stats | awk '{print $6}')
    
    echo ""
    echo "【堆内存使用】"
    echo "  Survivor 0: ${s0c}KB (已用: ${s0u}KB)"
    echo "  Survivor 1: ${s1c}KB (已用: ${s1u}KB)"
    echo "  Eden: ${ec}KB (已用: ${eu}KB)"
    echo "  Old Gen: ${oc}KB (已用: ${ou}KB)"
}

# 元空间信息
print_metaspace() {
    local meta_stats=$(jstat -metaspace $PID 2>/dev/null | tail -1)
    local capacity=$(echo $meta_stats | awk '{print $1}')
    const used=$(echo $meta_stats | awk '{print $2}')
    local classes=$(echo $meta_stats | awk '{print $3}')
    local loaders=$(echo $meta_stats | awk '{print $4}')
    
    echo ""
    echo "【元空间使用】"
    echo "  已用空间: ${used}KB"
    echo "  容量: ${capacity}KB"
    echo "  加载类数: $classes"
    echo "  活动加载器: $loaders"
}

# 进程信息
print_process_info() {
    local cmd=$(jps -l $PID 2>/dev/null | awk '{print $2}')
    local start_time=$(ps -o lstart= -p $PID 2>/dev/null)
    
    echo ""
    echo "【进程信息】"
    echo "  进程命令: $cmd"
    echo "  启动时间: $start_time"
}

# 主循环
start_time=$(date +%s)
end_time=$((start_time + DURATION))

print_header
print_process_info
print_cpu_mem
print_threads
print_heap
print_gc
print_metaspace

echo ""
echo "============================================================"

current_time=$(date +%s)
while [ $current_time -lt $end_time ]; do
    sleep $INTERVAL
    
    current_time=$(date +%s)
    elapsed=$((current_time - start_time))
    remaining=$((end_time - current_time))
    
    print_header
    print_process_info
    print_cpu_mem
    print_threads
    print_heap
    print_gc
    print_metaspace
    
    echo ""
    echo "------------------------------------------------------------"
    echo "已运行: ${elapsed}秒  剩余: ${remaining}秒"
    echo "============================================================"
done

echo ""
echo "监控结束: $(date '+%Y-%m-%d %H:%M:%S')"
```

### 系统资源使用分析

```bash
#!/bin/bash
# system-resource-analysis.sh - 系统资源使用分析

echo "=== 系统资源使用分析 ==="
echo ""

# 1. 系统整体资源
echo "--- 系统资源概览 ---"
echo ""
echo "CPU 信息:"
lscpu | grep -E "(Model name|CPU\(s\)|CPU MHz|Thread\(s\) per core)"

echo ""
echo "内存信息:"
free -h

echo ""
echo "磁盘信息:"
df -h | grep -E "Filesystem|/dev/"

# 2. Java 进程资源占用
echo ""
echo "--- Java 进程资源占用 ---"
echo ""

# 统计所有 Java 进程的 CPU 和内存
echo "CPU 和内存统计:"
ps aux | grep java | awk '
BEGIN {
    printf "%-10s %10s %10s %10s %s\n", "USER", "CPU%", "MEM%", "RSS(KB)", "COMMAND"
}
{
    user[$1] += $3
    mem[$1] += $4
    rss[$1] += $6
    cmd[$1] = $11" "$12" "$13
}
END {
    for (u in user) {
        printf "%-10s %10.1f %10.1f %10.0f %s\n", u, user[u], mem[u], rss[u], cmd[u]
    }
}'

# 3. 线程资源分析
echo ""
echo "--- 线程资源分析 ---"
echo ""

for pid in $(jps -q); do
    name=$(jps -l $pid 2>/dev/null | awk '{print $2}')
    threads=$(ps -p $pid -o nlwp= 2>/dev/null)
    cpu_time=$(ps -p $pid -o time= 2>/dev/null)
    
    echo "进程: $name (PID: $pid)"
    echo "  线程数: $threads"
    echo "  CPU 时间: $cpu_time"
    
    # 线程状态分布
    echo "  线程状态:"
    ps -p $pid -Lo stat 2>/dev/null | tail -n +2 | sort | uniq -c | sort -rn | head -5
    
    # 线程 CPU 使用 TOP 5
    echo "  高 CPU 线程 TOP 5:"
    ps -p $pid -Lo pid,tid,%cpu,comm 2>/dev/null | tail -n +2 | sort -k3 -rn | head -5
done

# 4. I/O 资源分析
echo ""
echo "--- I/O 资源分析 ---"
echo ""

# 检查 I/O 等待
iostat -x 1 2 2>/dev/null | tail -n +7 | head -5 || echo "iostat 不可用，跳过 I/O 分析"

# Java 进程 I/O
echo "Java 进程 I/O:"
pidstat -d -p $(jps -q) 1 2>/dev/null | tail -n +4 | head -10 || echo "pidstat 不可用，跳过进程 I/O 分析"
```

## 系统诊断最佳实践

### 生产环境健康检查

```bash
#!/bin/bash
# production-health-check.sh - 生产环境健康检查

PID=$1

if [ -z "$PID" ]; then
    echo "用法: $0 <PID>"
    exit 1
fi

echo "=== 生产环境健康检查 ==="
echo "PID: $PID"
echo "时间: $(date '+%Y-%m-%d %H:%M:%S')"
echo ""

health_score=100
issues=()

# 1. 进程状态检查
echo "--- 进程状态 ---"
if ps -p $PID > /dev/null 2>&1; then
    echo "✓ 进程运行正常"
else
    echo "✗ 进程不存在"
    health_score=0
fi

# 2. CPU 健康检查
echo ""
echo "--- CPU 健康检查 ---"
cpu_load=$(uptime | awk -F'load average:' '{print $2}' | awk -F, '{print $1}' | tr -d ' ')
cores=$(nproc 2>/dev/null || sysctl -n hw.ncpu 2>/dev/null)
cpu_usage=$(ps -p $PID -o %cpu= 2>/dev/null)

echo "系统负载: $cpu_load (核心数: $cores)"
echo "进程 CPU: ${cpu_usage}%"

if (( $(echo "$cpu_load > $cores * 2" | bc -l) )); then
    echo "⚠️  系统负载过高"
    issues+=("high_cpu_load")
    health_score=$((health_score - 20))
fi

# 3. 内存健康检查
echo ""
echo "--- 内存健康检查 ---"
heap_usage=$(jstat -gcutil $PID 2>/dev/null | tail -1 | awk '{print $NF}')
meta_usage=$(jstat -metaspace $PID 2>/dev/null | tail -1 | awk '{print $2}')

echo "堆内存使用: ${heap_usage}%"
echo "元空间使用: ${meta_usage}KB"

if (( $(echo "$heap_usage > 90" | bc -l) )); then
    echo "⚠️  堆内存使用率过高"
    issues+=("high_heap_usage")
    health_score=$((health_score - 30))
fi

# 4. GC 健康检查
echo ""
echo "--- GC 健康检查 ---"
gc_stats=$(jstat -gcutil $PID 2>/dev/null | tail -1)
ygc=$(echo $gc_stats | awk '{print $12}')
fgc=$(echo $gc_stats | awk '{print $16}')
ygct=$(echo $gc_stats | awk '{print $13}')
fgct=$(echo $gc_stats | awk '{print $17}')

echo "Young GC: $ygc 次 (总耗时: ${ygct}s)"
echo "Full GC: $fgc 次 (总耗时: ${fgct}s)"

if [ "$fgc" -gt 10 ]; then
    echo "⚠️  Full GC 频率过高"
    issues+=("high_fgc")
    health_score=$((health_score - 20))
fi

# 5. 线程健康检查
echo ""
echo "--- 线程健康检查 ---"
threads=$(ps -p $PID -o nlwp= 2>/dev/null)
echo "线程总数: $threads"

if [ "$threads" -gt 1000 ]; then
    echo "⚠️  线程数过多"
    issues+=("many_threads")
    health_score=$((health_score - 10))
fi

# 死锁检测
deadlock=$(jcmd $PID Thread.print 2>/dev/null | grep -c "deadlock")
if [ "$deadlock" -gt 0 ]; then
    echo "✗ 检测到死锁"
    issues+=("deadlock")
    health_score=0
fi

# 6. 文件描述符检查
echo ""
echo "--- 文件描述符检查 ---"
fd_usage=$(ls /proc/$PID/fd 2>/dev/null | wc -l)
fd_limit=$(ulimit -n)
echo "已用描述符: $fd_usage / $fd_limit"

if [ "$fd_usage" -gt $((fd_limit * 0.8)) ]; then
    echo "⚠️  文件描述符接近限制"
    issues+=("high_fd_usage")
    health_score=$((health_score - 10))
fi

# 总结
echo ""
echo "============================================"
echo "健康检查总结"
echo "============================================"
echo "健康评分: ${health_score}%"
echo ""

if [ $health_score -eq 100 ]; then
    echo "✓ 系统状态良好"
elif [ $health_score -ge 70 ]; then
    echo "⚠️  系统存在轻微问题"
    echo "问题: ${issues[*]}"
elif [ $health_score -ge 40 ]; then
    echo "✗ 系统存在严重问题，需要关注"
    echo "问题: ${issues[*]}"
else
    echo "✗✗✗ 系统状态危急，需要立即处理"
    echo "问题: ${issues[*]}"
fi
```

### 诊断数据收集

```bash
#!/bin/bash
# diagnostic-data-collection.sh - 诊断数据收集

PID=$1
OUTPUT_DIR=/tmp/diag-$(date +%Y%m%d_%H%M%S)

if [ -z "$PID" ]; then
    echo "用法: $0 <PID>"
    exit 1
fi

mkdir -p $OUTPUT_DIR

echo "=== 诊断数据收集 ==="
echo "输出目录: $OUTPUT_DIR"
echo "PID: $PID"
echo ""

# 1. JVM 配置信息
echo "收集 JVM 配置..."
jinfo -flags $PID > $OUTPUT_DIR/jvm-flags.txt
jinfo -sysprops $PID > $OUTPUT_DIR/system-properties.txt

# 2. 线程信息
echo "收集线程信息..."
jcmd $PID Thread.print > $OUTPUT_DIR/thread-dump.txt

# 3. 堆信息
echo "收集堆信息..."
jcmd $PID GC.heap_info > $OUTPUT_DIR/heap-info.txt
jstat -gcutil $PID > $OUTPUT_DIR/gc-stats.txt
jstat -gccapacity $PID > $OUTPUT_DIR/gc-capacity.txt

# 4. 类加载信息
echo "收集类加载信息..."
jstat -class $PID > $OUTPUT_DIR/class-stats.txt

# 5. 编译信息
echo "收集编译信息..."
jstat -compile $PID > $OUTPUT_DIR/compile-stats.txt

# 6. 堆转储（可选，文件较大）
if [ "$2" == "--with-heap" ]; then
    echo "生成堆转储..."
    jcmd $PID GC.heap_dump $OUTPUT_DIR/heap-dump.hprof
fi

# 7. GC 日志（如果启用）
echo "检查 GC 日志..."
jinfo -flag Xlog:gc* $PID 2>/dev/null | grep -oE 'Xlog:gc[^ ]*' > $OUTPUT_DIR/gc-log-config.txt

# 8. 进程信息
echo "收集进程信息..."
ps -p $PID -o pid,ppid,user,%cpu,%mem,vsz,rss,time,cmd > $OUTPUT_DIR/process-info.txt

# 9. 环境信息
echo "收集环境信息..."
env > $OUTPUT_DIR/environment.txt

# 10. 打包
echo ""
echo "打包诊断数据..."
tar -czf diag-$(hostname)-$(date +%Y%m%d_%H%M%S).tar.gz -C $OUTPUT_DIR .

echo ""
echo "诊断数据收集完成!"
echo "文件: $(ls -lh $OUTPUT_DIR)"
echo ""
echo "建议: 将 $(basename $OUTPUT_DIR).tar.gz 发送给技术支持"
```

## 命令速查

### jinfo 命令速查

| 命令 | 说明 |
|-----|------|
| `jinfo -flags <pid>` | 显示所有 JVM 标志 |
| `jinfo -sysprops <pid>` | 显示系统属性 |
| `jinfo -flag <name> <pid>` | 显示指定标志值 |
| `jinfo -flag [+/-]<name> <pid>` | 启用/禁用布尔标志 |
| `jinfo -flag <name>=<value> <pid>` | 设置标志值 |

### jps 命令速查

| 命令 | 说明 |
|-----|------|
| `jps` | 列出进程 ID 和主类 |
| `jps -l` | 显示完整包名 |
| `jps -m` | 显示传递给 main 的参数 |
| `jps -v` | 显示 JVM 参数 |
| `jps -q` | 仅显示进程 ID |

### jcmd 命令速查

| 命令 | 说明 |
|-----|------|
| `jcmd <pid> VM.version` | 显示 JVM 版本 |
| `jcmd <pid> VM.system_properties` | 显示系统属性 |
| `jcmd <pid> VM.flags` | 显示 JVM 标志 |
| `jcmd <pid> Thread.print` | 打印线程堆栈 |
| `jcmd <pid> GC.heap_info` | 显示堆信息 |
| `jcmd <pid> GC.class_histogram` | 显示类直方图 |

## 常见问题 FAQ

### Q1：jinfo 无法连接进程怎么办？

**可能原因及解决方案**：
1. 进程不存在或已终止
2. 权限不足（检查用户权限）
3. JVM 不支持（使用正确的 JDK 版本的 jinfo）
4. 进程被沙箱限制（检查 SecurityManager）

```bash
# 验证进程存在
jps -l | grep $PID

# 检查 JDK 版本匹配
java -version
jinfo -version
```

### Q2：如何远程监控 JVM？

**方法一：使用 jstatd**
```bash
# 启动 jstatd
jstatd -J-Djava.rmi.server.hostname=192.168.1.100 -p 1099 &

# 远程连接
jps hostname:1099
jstat -gcutil hostname:1099 $PID
```

**方法二：使用 JMX**
```bash
# 启动时启用 JMX
java -Dcom.sun.management.jmxremote \
     -Dcom.sun.management.jmxremote.port=9010 \
     -Dcom.sun.management.jmxremote.ssl=false \
     -Dcom.sun.management.jmxremote.authenticate=false \
     MyApp
```

### Q3：JVM 参数修改不生效？

**原因分析**：
1. 参数不支持动态修改（需要重启）
2. 参数已固定（UseXX 参数）
3. 修改方式错误（布尔参数用 +/-）

```bash
# 检查参数是否可修改
jinfo -flag PrintGCDetails $PID

# JDK 9+ 可以通过 jcmd 修改部分参数
jcmd $PID VM.flags +/-PrintGCDetails
```

### Q4：如何获取完整的 JVM 参数列表？

```bash
# 方法 1：使用 jinfo
jinfo -flags $PID

# 方法 2：使用 jcmd
jcmd $PID VM.flags -all

# 方法 3：在应用启动时添加
java -XX:+PrintFlagsFinal -version 2>&1 | grep :=

# 方法 4：运行时通过 JMX
jconsole $PID
```

### Q5：系统资源不足如何排查？

**排查步骤**：
1. 检查 CPU 使用：`top` 或 `mpstat`
2. 检查内存使用：`free -m` 或 `vmstat`
3. 检查 I/O：`iostat` 或 `iotop`
4. 检查网络：`netstat` 或 `ss`
5. 检查文件描述符：`ulimit -a`

```bash
# 综合检查脚本
echo "=== 系统资源检查 ==="
top -bn1 | head -5
free -h
df -h
iostat -x 1 2 | tail -10
```

## 相关资源

### 官方文档
- [jinfo 官方文档](https://docs.oracle.com/en/java/javase/17/docs/specs/man/jinfo.html)
- [jps 官方文档](https://docs.oracle.com/en/java/javase/17/docs/specs/man/jps.html)
- [jcmd 官方文档](https://docs.oracle.com/en/java/javase/17/docs/specs/man/jcmd.html)
- [jstat 官方文档](https://docs.oracle.com/en/java/javase/17/docs/specs/man/jstat.html)

### JVM 参数参考
- [JVM Flags 官方文档](https://docs.oracle.com/javase/8/docs/technotes/guides/vm/gctuning/)
- [JVM 选项完整列表](https://www.oracle.com/java/technologies/javase-vm-options-jsp.html)

### 性能监控
- [Java Mission Control](https://www.oracle.com/java/technologies/jmc.html)
- [VisualVM](https://visualvm.github.io/)
- [Micrometer Metrics](https://micrometer.io/)

