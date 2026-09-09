# jps - JVM 进程状态工具

[[toc]]

jps（JVM Process Status）是 JDK 内置的进程查看工具，用于列出当前系统中所有正在运行的 Java 进程及其启动信息。它是进行 JVM 诊断和监控的第一个工具，通常作为排查问题的起点，用于获取目标进程的 PID，以便进一步使用其他诊断工具。

## 工具概述

jps 通过 JVM 的内部机制获取系统中所有 Java 进程的列表，类似于 Unix 系统中的 `ps` 命令，但专门针对 Java 进程设计。它能够显示每个 Java 进程的主类名、JVM 参数、启动参数等信息，是进行 JVM 诊断和问题排查的基础工具。

**工具特点**：
- 快速列出所有 Java 进程
- 显示进程启动参数和 JVM 配置
- 轻量级，无侵入性
- 跨平台支持
- 与其他 JDK 诊断工具无缝集成

**主要用途**：
- 快速查找 Java 进程 PID
- 查看进程的启动参数
- 确认应用是否正在运行
- 排查进程启动问题
- 准备后续诊断操作

## 安装与基本使用

### 环境要求

jps 随 JDK 提供，确保环境变量中配置了 `JAVA_HOME`。

```bash
# 验证 jps 是否可用
jps -?

# 查看 JDK 版本
java -version
```

### 基本语法

```bash
jps [options] [hostid]
```

**常用选项**：

| 选项 | 说明 |
|-----|------|
| 无选项 | 显示进程 ID 和主类名 |
| `-l` | 显示完整的包名或 JAR 文件路径 |
| `-m` | 显示传递给 main 方法的参数 |
| `-v` | 显示传递给 JVM 的参数 |
| `-q` | 只显示进程 ID，不显示类名 |
| `-V` | 通过 flag 文件传递参数（.hotspotrc） |
| `-Joption` | 传递选项给 JVM |

### 快速入门示例

```bash
# 基本用法：显示进程 ID 和主类名
jps

# 显示完整路径
jps -l

# 显示 main 方法参数
jps -m

# 显示 JVM 参数
jps -v

# 组合使用
jps -lmv

# 只显示进程 ID
jps -q
```

## 输出格式详解

### 基本输出

```bash
$ jps
12345 Application
67890 jar-file.jar
```

**输出格式**：

```
<PID> <主类名|JAR文件名|其他>
```

**字段说明**：

| 字段 | 说明 | 示例 |
|-----|------|------|
| PID | 进程 ID | 12345 |
| 主类名 | main 方法所在类 | Application |
| JAR 文件名 | 启动的 JAR 文件 | app.jar |
| 其他 | 特殊标识 | - |

### 带参数输出

```bash
# 带 JVM 参数
$ jps -v
12345 Application -Xms512m -Xmx2g -XX:+UseG1GC
67890 jar-file.jar -Dserver.port=8080 -jar app.jar

# 带 main 方法参数
$ jps -m
12345 Application arg1 arg2 arg3
```

### 完整信息输出

```bash
$ jps -lmv
12345 com.example.Application -Xms512m -Xmx2g -XX:+UseG1GC arg1 arg2
67890 /data/app.jar -Dconfig=/data/config.yaml -jar arg1 arg2
```

## 进程查找与分析

### 快速查找进程

```bash
# 查找特定应用
jps -l | grep Application
jps -l | grep com.example

# 查找 JAR 文件
jps -l | grep .jar

# 查找特定端口的应用
jps -l | grep myapp

# 查找多个条件
jps -l | grep -E "(app1|app2|app3)"
```

### 进程详细信息查询

```bash
#!/bin/bash
# get-jvm-info.sh - 获取 JVM 进程详细信息

PID=$1

if [ -z "$PID" ]; then
    echo "用法: $0 <PID>"
    exit 1
fi

echo "=== JVM 进程详情 (PID: $PID) ==="
echo ""

# 基本信息
echo "--- 基本信息 ---"
ps -p $PID -o pid,ppid,cmd,%cpu,%mem,etime

echo ""
echo "--- JVM 参数 ---"
jps -v $PID

echo ""
echo "--- 完整命令 ---"
cat /proc/$PID/cmdline | tr '\0' ' '
echo ""
```

### 多进程监控

```bash
#!/bin/bash
# monitor-java-processes.sh - Java 进程监控

INTERVAL=${1:-10}

echo "=== Java 进程监控 ==="
echo "刷新间隔: ${INTERVAL}秒"
echo ""
echo "PID    进程名                      CPU%   内存%   启动时间"
echo "------ -------------------------- ------ ------ ----------------"

while true; do
    # 获取 Java 进程列表
    jps -lm | while read line; do
        PID=$(echo $line | awk '{print $1}')
        NAME=$(echo $line | awk '{print $2}')
        
        if [ ! -z "$PID" ]; then
            CPU=$(ps -p $PID -o %cpu= 2>/dev/null | tr -d ' ')
            MEM=$(ps -p $PID -o %mem= 2>/dev/null | tr -d ' ')
            START=$(ps -p $PID -o lstart= 2>/dev/null)
            
            printf "%-6s %-26s %-6s %-6s %s\n" "$PID" "$NAME" "$CPU" "$MEM" "$START"
        fi
    done
    
    sleep $INTERVAL
done
```

## 与其他工具集成

### jps + jinfo 集成

```bash
#!/bin/bash
# get-full-process-info.sh - 完整进程信息获取

# 获取所有 Java 进程
PIDS=$(jps -q)

echo "=== Java 进程完整信息 ==="
echo ""

for PID in $PIDS; do
    # 基本信息
    MAIN_CLASS=$(jps -l $PID | awk '{print $2}')
    JVM_ARGS=$(jps -v $PID | tail -1)
    
    echo "----------------------------------------"
    echo "进程 ID: $PID"
    echo "主类/文件: $MAIN_CLASS"
    echo "JVM 参数: $JVM_ARGS"
    
    # 详细信息
    echo ""
    echo "系统属性:"
    jinfo -sysprops $PID 2>/dev/null | grep -E "java.version|java.vendor|user.dir" | head -3
    
    echo ""
    echo "进程状态:"
    ps -p $PID -o pid,ppid,stat,%cpu,%mem,etime,cmd
    
    echo ""
done
```

### jps + jstat 集成监控

```bash
#!/bin/bash
# monitor-jvm-health.sh - JVM 健康监控

PIDS=$(jps -q)

echo "=== JVM 健康监控 ==="
echo "时间: $(date '+%Y-%m-%d %H:%M:%S')"
echo ""

for PID in $PIDS; do
    PROC_NAME=$(jps -l $PID | awk '{print $2}')
    
    echo "--- 进程: $PID ($PROC_NAME) ---"
    
    # GC 统计
    echo "GC 统计:"
    jstat -gcutil $PID 2>/dev/null | tail -1
    
    # 内存使用
    echo ""
    echo "堆内存:"
    jstat -gccapacity $PID 2>/dev/null | tail -1
    
    echo ""
    echo "----------------------------------------"
done
```

### jps + Prometheus 集成

```bash
#!/bin/bash
# export-jps-metrics.sh - 导出 jps 指标到 Prometheus

OUTPUT_FILE=/tmp/jps-metrics.prom

# 计数器
PROCESS_COUNT=0
G1_COUNT=0
CMS_COUNT=0
SERIAL_COUNT=0

while IFS= read -r line; do
    if [ ! -z "$line" ]; then
        PROCESS_COUNT=$((PROCESS_COUNT + 1))
        
        if echo "$line" | grep -q "UseG1GC"; then
            G1_COUNT=$((G1_COUNT + 1))
        fi
        if echo "$line" | grep -q "UseConcMarkSweepGC"; then
            CMS_COUNT=$((CMS_COUNT + 1))
        fi
        if echo "$line" | grep -q "UseSerialGC"; then
            SERIAL_COUNT=$((SERIAL_COUNT + 1))
        fi
    fi
done < <(jps -v)

# 输出 Prometheus 格式
cat > $OUTPUT_FILE << EOF
# HELP jvm_processes_running Number of running Java processes
# TYPE jvm_processes_running gauge
jvm_processes_running $PROCESS_COUNT
# HELP jvm_processes_using_g1gc Number of processes using G1GC
# TYPE jvm_processes_using_g1gc gauge
jvm_processes_using_g1gc $G1_COUNT
# HELP jvm_processes_using_cms Number of processes using CMS GC
# TYPE jvm_processes_using_cms gauge
jvm_processes_using_cms $CMS_COUNT
# HELP jvm_processes_using_serial Number of processes using Serial GC
# TYPE jvm_processes_using_serial gauge
jvm_processes_using_serial $SERIAL_COUNT
EOF

echo "指标已导出到 $OUTPUT_FILE"
```

### 进程健康检查脚本

```bash
#!/bin/bash
# health-check.sh - Java 进程健康检查

ALERT_THRESHOLD=${1:-100}  # CPU 或内存阈值

echo "=== Java 进程健康检查 ==="
echo "告警阈值: ${ALERT_THRESHOLD}%"
echo ""

# 检查所有 Java 进程
jps -lm | while read line; do
    PID=$(echo $line | awk '{print $1}')
    NAME=$(echo $line | awk '{print $2}')
    
    if [ ! -z "$PID" ]; then
        CPU=$(ps -p $PID -o %cpu= 2>/dev/null | tr -d ' ')
        MEM=$(ps -p $PID -o %mem= 2>/dev/null | tr -d ' ')
        
        # CPU 检查
        if [ ! -z "$CPU" ]; then
            CPU_INT=$(echo "$CPU" | cut -d'.' -f1)
            if [ $CPU_INT -gt $ALERT_THRESHOLD ]; then
                echo "⚠️  高 CPU 占用告警"
                echo "  进程: $PID ($NAME)"
                echo "  CPU: $CPU%"
                echo "  建议: 使用 jstack 分析线程行为"
                echo ""
            fi
        fi
        
        # 内存检查
        if [ ! -z "$MEM" ]; then
            MEM_INT=$(echo "$MEM" | cut -d'.' -f1)
            if [ $MEM_INT -gt $ALERT_THRESHOLD ]; then
                echo "⚠️  高内存占用告警"
                echo "  进程: $PID ($NAME)"
                echo "  内存: $MEM%"
                echo "  建议: 使用 jmap 分析内存使用"
                echo ""
            fi
        fi
    fi
done

echo "=== 检查完成 ==="
```

## 远程进程查看

### 查看远程主机进程

```bash
# 格式: jps [options] <hostname>[:<port>]
# 需要配置 JMX 或 RMI

# 查看远程主机进程（需要 JMX 配置）
jps -l remote-host:9010
```

### SSH 隧道方式

```bash
# 建立 SSH 隧道
ssh -L 9010:localhost:9010 user@remote-host

# 然后查看远程进程
jps -l localhost:9010
```

## 最佳实践建议

```bash
# 生产环境最佳实践

# 1. 快速获取进程 ID
jps -q | grep <name>

# 2. 组合使用多个选项
jps -lmv > /dev/null  # 获取完整信息

# 3. 自动化脚本中使用
# 在脚本开头获取进程 ID
APP_PID=$(jps -l | grep "myapp" | awk '{print $1}')

# 4. 避免过于频繁执行
# 间隔至少 1-2 秒

# 5. 结合其他工具使用
# jps 获取 PID，jstack/jmap 进行诊断
```

## 常见问题排查

**问题 1：jps 不显示进程**

```bash
# 检查 JDK 版本
java -version

# 检查权限
ps -ef | grep java

# 使用 sudo 执行
sudo jps -l

# 检查进程是否真的在运行
ps -ef | grep java
```

**问题 2：jps 输出不完整**

```bash
# 使用 -l 选项获取完整信息
jps -l

# 检查进程是否正常
ps -p <PID>

# 查看进程详细信息
cat /proc/<PID>/cmdline
```

**问题 3：无法查看远程进程**

```bash
# 确认 JMX 配置
java -Dcom.sun.management.jmxremote.port=9010 ...

# 检查网络连接
telnet remote-host 9010

# 使用 SSH 隧道
ssh -L 9010:localhost:9010 user@remote-host
```

## 与其他工具的配合使用

### jps + jstack：线程分析

```bash
#!/bin/bash
# quick-thread-analysis.sh - 快速线程分析

# 获取进程 ID
PID=$(jps -l | grep "MyApplication" | awk '{print $1}')

if [ -z "$PID" ]; then
    echo "未找到进程"
    exit 1
fi

echo "=== 线程分析 (PID: $PID) ==="

# 线程统计
echo ""
echo "--- 线程统计 ---"
jstack $PID | grep "java.lang.Thread.State" | sort | uniq -c

# 检测死锁
echo ""
echo "--- 死锁检测 ---"
if jstack $PID | grep -q "deadlock"; then
    echo "⚠️  检测到死锁!"
    jstack $PID | grep -A 30 "deadlock"
else
    echo "✅ 未检测到死锁"
fi

# RUNNABLE 线程
echo ""
echo "--- RUNNABLE 线程 ---"
jstack $PID | grep -B 2 "java.lang.Thread.State: RUNNABLE" | head -30
```

### jps + jmap：内存分析

```bash
#!/bin/bash
# quick-memory-analysis.sh - 快速内存分析

# 获取进程 ID
PID=$(jps -l | grep "MyApplication" | awk '{print $1}')

if [ -z "$PID" ]; then
    echo "未找到进程"
    exit 1
fi

echo "=== 内存分析 (PID: $PID) ==="

# 堆配置
echo ""
echo "--- 堆配置 ---"
jinfo -flag MaxHeapSize $PID
jinfo -flag InitialHeapSize $PID

# 堆使用情况
echo ""
echo "--- 堆使用情况 ---"
jstat -gcutil $PID | tail -1

# 对象统计
echo ""
echo "--- 对象统计 TOP 10 ---"
jmap -histo $PID | head -15

# 可疑对象
echo ""
echo "--- 可疑大对象 ---"
jmap -histo $PID | grep -E "^[0-9]+:" | awk '{if ($2 > 1000000) print}' | head -10
```

### jps + jcmd：综合诊断

```bash
#!/bin/bash
# comprehensive-diagnosis.sh - 综合诊断

# 获取进程 ID
PID=$(jps -l | grep "MyApplication" | awk '{print $1}')

if [ -z "$PID" ]; then
    echo "未找到进程"
    exit 1
fi

echo "=== 综合诊断报告 (PID: $PID) ==="
echo "生成时间: $(date '+%Y-%m-%d %H:%M:%S')"
echo ""

# 1. 版本信息
echo "--- 1. JVM 版本 ---"
jcmd $PID VM.version

# 2. 配置信息
echo ""
echo "--- 2. JVM 配置 ---"
jcmd $PID VM.flags | grep -E "(HeapSize|GC)"

# 3. 线程分析
echo ""
echo "--- 3. 线程统计 ---"
jstack $PID | grep "java.lang.Thread.State" | sort | uniq -c

# 4. 内存分析
echo ""
echo "--- 4. 内存使用 ---"
jstat -gcutil $PID | tail -1

# 5. 对象统计
echo ""
echo "--- 5. 对象统计 ---"
jcmd $PID GC.class_histogram | head -20

echo ""
echo "=== 诊断完成 ==="
```

## 常见问题 FAQ

### Q1：jps 和 ps 命令有什么区别？

| 特性 | jps | ps |
|-----|-----|-----|
| 范围 | 仅 Java 进程 | 所有进程 |
| 信息 | JVM 相关信息 | 系统级信息 |
| 速度 | 快（只查 Java） | 慢（所有进程） |
| JVM 参数 | 显示 | 不显示 |

### Q2：如何过滤 jps 输出？

#### Linux/macOS 方案
```bash
# 使用 grep 过滤
jps -l | grep myapp

# 使用 awk 提取特定字段
jps -l | awk '/myapp/ {print $1}'

# 使用正则表达式
jps -l | grep -E "(app1|app2)"
```

#### Windows PowerShell 方案
```powershell
# 使用 Select-String 过滤（大小写不敏感）
jps -l | Select-String "myapp"

# 使用正则表达式
jps -l | Select-String "(app1|app2)"

# 提取 PID (Windows)
jps -l | Select-String "myapp" | ForEach-Object { ($_ -split '\s+')[0] }

# 使用 Where-Object 过滤
jps -l | Where-Object { $_ -match "myapp" }
```

#### Windows cmd 方案
```cmd
# 使用 findstr 过滤（大小写敏感）
jps -l | findstr myapp

# Windows findstr 不支持标准正则语法，建议使用简单匹配或 PowerShell 方案

# 查找多个关键词 (简单方式)
jps -l | findstr "app1 app2"
```

> **📝 跨平台兼容性说明**：
> 本文档中包含大量 `grep` 命令示例。在 Windows 环境下，请使用上述 PowerShell 或 cmd 等效命令。
> 建议 Windows 用户优先使用 PowerShell 命令，功能更强大。

### Q3：jps 可以查看已终止的进程吗？

不可以。jps 只显示当前正在运行的 Java 进程，终止的进程不会显示。

### Q4：如何批量获取所有 Java 进程的 PID？

```bash
# 方法 1：使用 -q 选项
jps -q

# 方法 2
# Linux/macOS 使用 awk 提取
jps | awk '{print $1}'
# Windows PowerShell 等效命令
jps | ForEach-Object { ($_ -split '\s+')[0] }
# Windows cmd 批处理等效命令
for /f "tokens=1" %i in ('jps -q') do @echo %i
```

### Q5：jps 的输出顺序是什么？

jps 的输出按进程启动顺序排列，新启动的进程排在后面。

### Q6：如何查看启动 jps 的 JDK 版本？

```bash
# 方法 1：检查 Java 版本（jps 使用此 JDK）
java -version

# 方法 2：查看 jps 的路径
which jps
# 或在 Windows 上
where jps

# 方法 3：检查 JAVA_HOME 环境变量
# 在 Linux/macOS 上
echo $JAVA_HOME

# 在 Windows 上 (cmd)
echo %JAVA_HOME%

# 在 Windows 上 (PowerShell)
$env:JAVA_HOME
```
> 注意：
> - where jps可能返回多个路径，以第一个为准。
> - JAVA_HOME 环境变量指向的 JDK 版本与 jps 使用的版本可能不同。以`java -version`和`where jps`输出的版本为准。

### Q7：jps 可以监控 Docker 容器中的进程吗？

可以，但需要相应权限：

```bash
# 在容器内执行
docker exec <container> jps

# 或挂载 proc 文件系统
docker run -v /proc:/host/proc <image> jps
```

## 相关资源

### 官方文档
- [jps 官方文档](https://docs.oracle.com/en/java/javase/17/docs/specs/man/jps.html)
- [JDK 工具参考](https://docs.oracle.com/en/java/javase/17/docs/specs/man/)

### 进程管理
- [Linux 进程管理](https://man7.org/linux/man-pages/man1/ps.1.html)
- [Java 进程调试](https://docs.oracle.com/javase/8/docs/technotes/guides/troubleshoot/tooldescr007.html)

### 社区资源
- [Stack Overflow - jps](https://stackoverflow.com/questions/tagged/jps)
- [GitHub - JVM 工具集合](https://github.com/topics/jvm-diagnostics)
