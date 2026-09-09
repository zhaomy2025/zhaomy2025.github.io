# Java 诊断与监控工具

[[toc]]

本章节系统介绍 Java 生态系统中常用的诊断与监控工具。这些工具能帮助开发者快速定位生产环境中的线程死锁、内存泄漏、性能瓶颈、GC 异常等各类运行时故障，是保障应用稳定性的必备利器。本目录涵盖综合诊断工具、基础信息工具、线程分析工具、内存分析工具和性能监控工具的完整指南。

## 工具概览

### 工具分类说明

本目录中的工具按JVM诊断流程和功能分为以下几类，每类工具针对不同的诊断阶段和问题类型：

| 工具类型 | 代表工具 | 适用场景 |
|---------|---------|---------|
| **综合诊断** | **JDK原生**：jcmd | 一站式诊断解决方案、批量执行诊断命令 |
| **基础信息** | **JDK原生**：jps、jinfo、jstat、jstatd | JVM基础信息查询、进程发现、系统资源监控 |
| **线程分析** | **JDK原生**：jstack | 线程死锁检测、线程堆栈分析、并发问题排查 |
| **内存分析** | **JDK原生**：jmap、JMC<br>**第三方**：MAT、VisualVM | 内存泄漏深度分析、对象分布分析、堆转储生成与分析 |
| **性能监控** | **JDK原生**：JFR、JMC<br>**第三方**：Async Profiler、VisualVM<br> | CPU/内存/线程性能剖析、火焰图生成、实时性能监控 |

> **备注**：JMC和VisualVM是多功能工具，同时支持性能监控和内存分析功能。JMC主要用于JFR数据分析，VisualVM提供综合监控能力。

### 工具选择指南

根据不同的诊断场景，选择合适的工具可以事半功倍：

| 分类 | 场景 | 推荐工具 | 原因 |
|------|------|---------|------|
| **综合诊断** | 综合诊断管理 | jcmd | 一站式诊断解决方案 |
| **基础信息** | 进程信息查询 | jps + jinfo | 快速获取进程状态 |
| **基础信息+性能监控** | GC 性能监控 | jstat + JFR | 实时统计数据分析 |
| | 远程监控配置 | jstatd + JMC | 分布式环境监控 |
| **线程分析** | 线程问题分析 | jstack | 官方工具、免费使用 |
| **内存分析** | 内存快照生成 | jmap | JDK原生堆转储工具 |
| | 内存泄漏排查 | jmap + MAT | 专业内存分析能力 |
| **性能监控** | 生产环境持续监控 | JFR + JMC | 低开销、官方支持 |
| | 性能问题深度分析 | Async Profiler | 高精度、火焰图支持 |
| | 开发环境快速排查 | VisualVM | 集成度高、使用简单 |

> **重要说明**：jcmd 是 JDK 提供的集成诊断工具，它**包含了**多个独立工具的功能：
> - `jcmd` ≈ `jps`（列出Java进程）
> - `jcmd <pid> Thread.print` ≈ `jstack <pid>`（线程堆栈分析）
> - `jcmd <pid> GC.heap_dump` ≈ `jmap -dump:live`（堆转储生成）
> - `jcmd <pid> VM.flags` ≈ `jinfo <pid>`（JVM配置信息）
> - `jcmd <pid> JFR.start/stop` ≈ `-XX:StartFlightRecording`（不同于启动参数，jcmd动态控制JFR录制）

## 综合诊断工具详解

### jcmd - 综合诊断命令行工具

**jcmd** 是 JDK 提供的多功能诊断命令行工具，能够执行特定的诊断命令，是 JVM 问题诊断的一站式解决方案。它整合了多种诊断功能，可以通过一个统一的接口访问 JVM 的各种诊断能力。
<div style="width: 50%; display: inline-block; vertical-align: top;">
<strong>核心特性</strong>：
<ul>
  <li>多功能诊断集成</li>
  <li>支持动态参数修改</li>
  <li>堆转储和线程转储</li>
  <li>GC 诊断和性能监控</li>
  <li>原生内存跟踪</li>
</ul>
</div>
<div style="width: 50%; display: inline-block; vertical-align: top;">
<strong>适用场景</strong>：
<ul>
  <li>综合问题诊断</li>
  <li>性能数据收集</li>
  <li>JVM 配置查询</li>
  <li>故障现场保留</li>
</ul>
</div>

**快速入门**：
```bash
# 列出Java进程
jcmd

# 列出所有可用命令
jcmd <pid> help

# 获取线程堆栈 ≈ jstack <pid>
jcmd <pid> Thread.print

# 生成堆转储 ≈ jmap -dump:live
jcmd <pid> GC.heap_dump filename=heap.hprof

# 启动 JFR 录制 ≈ -XX:StartFlightRecording（不同于启动参数，jcmd动态控制JFR录制）
jcmd <pid> JFR.start name=test duration=60s settings=profile

# 查看 JVM 系统属性（如 java.version, user.home, spring.profiles.active 等）
jcmd <pid> VM.system_properties

# 查看 JVM 版本
jcmd <pid> VM.version

# 查看 JVM 启动参数 ≈ jinfo <pid>
jcmd <pid> VM.flags
```

**详细指南**：[jcmd 综合诊断工具详解](diagnostic-jcmd.md)

## 基础信息工具详解

### jps - JVM 进程状态工具

**jps** 是 JDK 提供的 JVM 进程列表工具，用于列出本地或远程 JVM 进程。它是进行 JVM 诊断的第一步，能够快速识别目标 JVM 进程。

<div style="width: 50%; display: inline-block; vertical-align: top;">
<strong>核心特性</strong>：
<ul>
  <li>快速列出 JVM 进程</li>
  <li>显示进程启动参数</li>
  <li>支持本地和远程进程</li>
  <li>简洁的输出格式</li>
</ul>
</div>
<div style="width: 50%; display: inline-block; vertical-align: top;">
<strong>适用场景</strong>：
<ul>
  <li>快速进程识别</li>
  <li>进程端口映射</li>
  <li>启动参数验证</li>
  <li>分布式环境排查</li>
</ul>
</div>

**快速入门**：
```bash
# 列出所有 JVM 进程
jps

# 显示完整启动参数
jps -lv

# 显示主类名和参数
jps -lm

# 显示 JVM 参数
jps -v

# 远程主机进程列表
jps -l remote-host:port
```

**详细指南**：[jps 进程状态工具详解](diagnostic-jps.md)

### jinfo - JVM 配置信息查看工具

**jinfo** 是 JDK 提供的 JVM 配置信息查看工具，能够显示和修改 JVM 的启动参数和系统属性。对于诊断 JVM 配置问题和进行运行时调优非常有用。

<div style="width: 50%; display: inline-block; vertical-align: top;">
<strong>核心特性</strong>：
<ul>
  <li>查看所有 JVM 标志</li>
  <li>查看系统属性</li>
  <li>支持动态修改部分参数</li>
  <li>详细的配置信息输出</li>
</ul>
</div>
<div style="width: 50%; display: inline-block; vertical-align: top;">
<strong>适用场景</strong>：
<ul>
  <li>JVM 配置问题诊断</li>
  <li>运行时参数调优</li>
  <li>验证配置生效情况</li>
  <li>分布式环境排查</li>
</ul>
</div>

**快速入门**：
```bash
# 查看所有标志信息
jinfo -flags <pid>

# 查看系统属性
jinfo -sysprops <pid>

# 查看特定标志值
jinfo -flag MaxHeapSize <pid>

# 启用/禁用布尔标志
jinfo -flag +PrintGCDetails <pid>
jinfo -flag -PrintGCDetails <pid>

# 查看 JVM 版本信息
jinfo -version <pid>
```

**详细指南**：[jinfo JVM 信息工具详解](diagnostic-jinfo.md)

### jstat - JVM 统计监控工具

**jstat** 是 JDK 提供的 JVM 统计监控工具，用于监控 JVM 的各种统计数据，包括 GC 性能、类加载信息和编译统计等。

<div style="width: 50%; display: inline-block; vertical-align: top;">
<strong>核心特性</strong>：
<ul>
  <li>GC 性能监控</li>
  <li>类加载统计</li>
  <li>JIT 编译统计</li>
  <li>实时数据采集</li>
  <li>多种输出格式</li>
</ul>
</div>
<div style="width: 50%; display: inline-block; vertical-align: top;">
<strong>适用场景</strong>：
<ul>
  <li>GC 性能实时监控</li>
  <li>内存使用趋势分析</li>
  <li>类加载问题排查</li>
  <li>性能调优数据收集</li>
</ul>
</div>

**快速入门**：
```bash
# GC 性能统计
jstat -gc <pid> 1000

# 类加载统计
jstat -class <pid>

# JIT 编译统计
jstat -compiler <pid>

# GC 汇总统计
jstat -gcutil <pid> 1000

# 查看所有统计选项
jstat -options

# 输出到文件
jstat -gcutil <pid> 1000 > gcstats.txt
```

**详细指南**：[jstat JVM 统计监控工具详解](diagnostic-jstat.md)

### jstatd - JVM 统计监控守护进程

**jstatd** 是 JDK 提供的 RMI 守护进程，用于在远程监控 JVM 统计数据。它允许 JMC、JConsole 等工具远程连接和监控 JVM。

<div style="width: 50%; display: inline-block; vertical-align: top;">
<strong>核心特性</strong>：
<ul>
  <li>远程监控支持</li>
  <li>RMI 协议通信</li>
  <li>安全认证配置</li>
  <li>多客户端连接</li>
</ul>
</div>
<div style="width: 50%; display: inline-block; vertical-align: top;">
<strong>适用场景</strong>：
<ul>
  <li>远程 JVM 监控</li>
  <li>多服务器统一监控</li>
  <li>JMC 远程连接</li>
  <li>分布式环境诊断</li>
</ul>
</div>

**快速入门**：
```bash
# 启动 jstatd（基本用法）
jstatd -J-Djava.rmi.server.hostname=192.168.1.100

# 启用安全策略
jstatd -J-Djava.security.policy=all.policy

# 指定端口
jstatd -p 1099 -J-Djava.rmi.server.hostname=192.168.1.100

# 停止 jstatd
# 使用 pkill jstatd 或任务管理器
```

**详细指南**：[jstatd 守护进程详解](diagnostic-jstatd.md)

## 内存分析工具详解

内存问题是 Java 应用最常见的性能问题之一，掌握内存分析工具对于每个 Java 开发者都至关重要。

**内存问题分类**：
```
内存问题类型：
├── 内存泄漏
│   ├── 静态集合类泄漏
│   ├── 监听器/回调泄漏
│   ├── 连接池泄漏
│   └── 类加载器泄漏
├── 内存溢出
│   ├── Heap Space 溢出
│   ├── Metaspace 溢出
│   └── Direct Buffer 溢出
└── 内存碎片
    ├── GC 停顿过长
    └── 内存利用率低
```

**核心工具**：
- jmap - 堆转储生成
- MAT - 堆转储分析
- JMC - 内存分析视图（同时支持性能监控，在后面章节详细介绍）
- VisualVM - 内存监控（同时支持性能监控，在后面章节详细介绍）

### jmap - 内存映射分析工具

**jmap** 是 JDK 提供的内存映射分析工具，用于生成堆转储、查看堆内存配置和分析对象分布。它是内存问题诊断的核心工具。

<div style="width: 50%; display: inline-block; vertical-align: top;">
<strong>核心特性</strong>：
<ul>
  <li>堆转储文件生成</li>
  <li>堆内存配置查看</li>
  <li>对象统计直方图</li>
  <li>永久代/元空间分析</li>
  <li>GC 堆摘要信息</li>
</ul>
</div>
<div style="width: 50%; display: inline-block; vertical-align: top;">
<strong>适用场景</strong>：
<ul>
  <li>内存泄漏排查</li>
  <li>堆内存使用分析</li>
  <li>对象分配分析</li>
  <li>GC 调优参考</li>
</ul>
</div>

**快速入门**：
```bash
# 查看堆内存配置
jhsdb jmap --pid <pid> --heap

# 生成堆转储文件
jmap -dump:format=b,file=heap.hprof <pid>

# 显示对象统计信息
jmap -histo <pid>

# 显示存活对象统计
jmap -histo:live <pid>

# 查看 GC 堆摘要
jmap -heap <pid>

# 永久代/元空间统计
jmap -permstat <pid>
```

**详细指南**：[jmap 内存映射分析工具详解](diagnostic-jmap.md)

### MAT - 堆转储分析工具

**MAT** 是 Eclipse Foundation 提供的专业内存分析工具，专门用于分析大型堆转储文件。它提供了强大的对象引用关系分析和内存泄漏检测能力，是内存问题诊断的利器。

<div style="width: 50%; display: inline-block; vertical-align: top;">
<strong>核心特性</strong>：
<ul>
  <li>专业堆转储分析</li>
  <li>对象引用关系图</li>
  <li>内存泄漏检测</li>
  <li>Dominator Tree分析</li>
  <li>大对象识别</li>
</ul>
</div>
<div style="width: 50%; display: inline-block; vertical-align: top;">
<strong>适用场景</strong>：
<ul>
  <li>内存泄漏深度分析</li>
  <li>对象引用链追踪</li>
  <li>大对象内存消耗分析</li>
  <li>GC Roots分析</li>
  <li>内存占用优化</li>
</ul>
</div>

**快速入门**：
```bash
# 1. 使用 jmap 生成堆转储
jmap -dump:format=b,file=heap.hprof <pid>

# 2. 使用 MAT 打开堆转储文件
# File → Open Heap Dump → 选择 heap.hprof

# 3. 常用分析视图
# - Leak Suspects Report（泄漏疑点报告）
# - Component Report（组件报告）
# - Dominator Tree（支配树）
# - Histogram（直方图）
```

**适用场景**：
- 内存泄漏深度分析
- 复杂对象引用关系追踪
- 大对象内存消耗分析
- 内存优化和调优

**详细指南**：[MAT 内存分析工具详解](memory-tools-mat.md)

## 线程分析工具详解

### jstack - 线程堆栈分析工具

**jstack** 是 JDK 提供的线程堆栈分析工具，用于生成 Java 线程的堆栈快照。它是排查线程问题、死锁和 CPU 热点的主要工具。

<div style="width: 50%; display: inline-block; vertical-align: top;">
<strong>核心特性</strong>：
<ul>
  <li>线程堆栈快照生成</li>
  <li>死锁自动检测</li>
  <li>混合模式堆栈支持</li>
  <li>轻量级开销</li>
</ul>
</div>
<div style="width: 50%; display: inline-block; vertical-align: top;">
<strong>适用场景</strong>：
<ul>
  <li>死锁检测和排查</li>
  <li>线程阻塞分析</li>
  <li>CPU 热点线程识别</li>
  <li>线程状态监控</li>
</ul>
</div>

**快速入门**：
```bash
# 生成线程堆栈快照
jstack <pid>

# 生成包含锁信息的堆栈
jstack -l <pid>

# 生成混合模式堆栈（包含本地方法）
jstack -m <pid>

# 强制线程堆栈输出（用于挂起进程）
jstack -F <pid>

# 输出到文件
jstack <pid> > threaddump.txt
```

**详细指南**：[jstack 线程分析工具详解](diagnostic-jstack.md)

## 性能剖析工具详解

### JFR (Java Flight Recorder)

**JFR** 是 JDK 内置的性能监控和剖析工具，提供生产环境级别的低开销数据收集能力。作为 JDK 11 起的开源功能，JFR 已成为 Java 性能分析的标杆工具。

**核心特性**：
- 开销极低（通常 < 1%）
- 事件驱动架构
- 支持滚动录制
- 丰富的内置事件
- 零依赖，开箱即用

**快速入门**：
```bash
# 启动 60 秒录制
jcmd <pid> JFR.start name=test duration=60s

# 检查录制状态
jcmd <pid> JFR.check

# 停止并保存
jcmd <pid> JFR.stop name=test filename=recording.jfr

# 或转储当前数据（不停止）
jcmd <pid> JFR.dump name=test filename=dump.jfr
```

**适用场景**：
- 生产环境持续监控
- 性能问题事后分析
- 热点方法识别
- GC 调优分析

**详细指南**：[JFR 性能监控增强详解](profiling-jfr.md)

### JMC (Java Mission Control)

**JMC** 是 Oracle 官方的 JVM 诊断工具，提供 JFR 数据的图形化分析和可视化能力。作为 JFR 的官方配套工具，JMC 提供了专业级的分析视图。

**JMC的多功能特性**：
- **性能监控**：JFR数据分析、火焰图生成、GC性能分析
- **内存分析**：堆转储分析、内存泄漏检测、对象分布分析

**核心特性**：
- 专业的分析视图
- 内存泄漏检测
- 火焰图可视化
- 诊断模板支持
- 多维度数据展示

**快速入门**：
```bash
# 启动 JMC GUI
jmc

# 或连接远程 JVM
# File -> Connect -> New Connection
```

**适用场景**：
- JFR 数据深度分析（性能监控）
- 内存泄漏问题诊断（内存分析）
- 线程竞争分析（性能监控）
- GC 性能调优（性能监控）

**详细指南**：[Java Mission Control 实战指南](profiling-jmc.md)

### Async Profiler

**Async Profiler** 是一款开源的高性能分析工具，提供比 JFR 更丰富的分析维度和灵活的采样配置。在 Linux 和 macOS 平台上表现尤为出色。

**核心特性**：
- 多种采样事件（CPU、内存、锁等）
- 原生火焰图支持
- 堆外内存分析
- 低开销实现
- 灵活的输出格式

**快速入门**：
```bash
# CPU 采样分析
./profiler.sh -d 60 -f profile.svg <pid>

# 内存分配分析
./profiler.sh -d 60 -e alloc -f alloc.svg <pid>

# 锁分析
./profiler.sh -d 60 -e lock -f lock.svg <pid>
```

**适用场景**：
- CPU 热点方法分析
- 内存分配优化
- 锁竞争排查
- 深度性能优化

**详细指南**：[Async Profiler 实战指南](profiling-async-profiler.md)

### VisualVM

**VisualVM** 是 JDK 可选集成的多合一监控和性能分析工具，提供直观的图形化界面，适合开发环境和测试环境的快速诊断。

**VisualVM的多功能特性**：
- **性能监控**：CPU使用率、内存监控、GC活动跟踪、线程分析
- **内存分析**：堆转储分析、内存泄漏检测、对象分布分析

**核心特性**：
- 集成化监控界面
- 线程分析与死锁检测
- 堆转储与内存分析
- 插件扩展机制
- 轻量级部署

**快速入门**：
```bash
# 启动 VisualVM
jvisualvm

# 或通过命令行指定 JDK
jvisualvm --jdkhome /path/to/jdk

# 连接远程 JVM
# File → Add Remote Host → 输入远程地址
```

**适用场景**：
- 开发环境快速排查（性能监控）
- 内存泄漏问题定位（内存分析）
- 线程死锁检测（性能监控）
- 堆转储分析（内存分析）

**详细指南**：[VisualVM 实战指南](profiling-visualvm.md)



## 工具对比与选择

### 功能对比矩阵

| 功能 | JFR | JMC | Async Profiler | VisualVM | jcmd | jstack | jmap | jstat |
|-----|-----|-----|----------------|----------|------|--------|------|-------|
| 开源免费 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| 生产环境安全 | ✅ | ✅ | ⚠️ | ⚠️ | ✅ | ✅ | ✅ | ✅ |
| CPU 分析 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ | ⚠️ |
| 内存分析 | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ | ✅ | ✅ |
| 线程分析 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ | ⚠️ |
| 锁分析 | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ | ⚠️ | ⚠️ |
| 火焰图 | ⚠️ | ✅ | ✅ | ✅ | ⚠️ | ⚠️ | ⚠️ | ⚠️ |
| 堆外内存 | ⚠️ | ⚠️ | ✅ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ |
| 实时监控 | ⚠️ | ✅ | ⚠️ | ✅ | ⚠️ | ⚠️ | ⚠️ | ✅ |
| 平台支持 | 全平台 | 全平台 | Linux/macOS | 全平台 | 全平台 | 全平台 | 全平台 | 全平台 |

### 开销对比

| 工具 | CPU 开销 | 内存开销 | 磁盘开销 | 生产环境 |
|-----|---------|---------|---------|---------|
| JFR (Continuous) | < 1% | 极低 | 10-50 MB/小时 | ✅ 安全 |
| JFR (Profiling) | 1-5% | 低 | 100-500 MB/小时 | ⚠️ 谨慎 |
| Async Profiler | 1-5% | 低 | 取决于配置 | ⚠️ 谨慎 |
| VisualVM | 5-10% | 中 | 视情况而定 | ❌ 不建议 |
| jstack | < 1% | 极低 | 无 | ✅ 安全 |
| jmap (histo) | < 1% | 极低 | 无 | ✅ 安全 |
| jmap (dump) | 1-3% | 中 | 堆大小 | ⚠️ 谨慎 |
| jstat | < 1% | 极低 | 无 | ✅ 安全 |
| jstatd | < 1% | 极低 | 无 | ✅ 安全 |
| jcmd | < 1% | 极低 | 视命令 | ✅ 安全 |
| jinfo | < 1% | 极低 | 无 | ✅ 安全 |
| jps | < 1% | 极低 | 无 | ✅ 安全 |

### 问题类型与工具选择

```
开始诊断
  │
  ├─ CPU 使用率高？
  │     │
  │     ├─ 生产环境 → jstat + JFR (CPU 采样)
  │     │
  │     └─ 开发环境 → jstack + Async Profiler
  │
  ├─ 内存问题？
  │     │
  │     ├─ 内存持续增长 → jstat + jmap + MAT
  │     │
  │     ├─ 内存溢出 → jmap (堆转储) + MAT
  │     │
  │     └─ GC 频繁 → jstat (GC 统计) + GC 日志
  │
  ├─ 线程问题？
  │     │
  │     ├─ 死锁检测 → jstack (自动检测)
  │     │
  │     ├─ 线程阻塞 → jstack + JMC
  │     │
  │     └─ 线程数过多 → jstack + jstat
  │
  ├─ 响应慢/卡顿？
  │     │
  │     ├─ 间歇性卡顿 → JFR (持续录制)
  │     │
  │     └─ 持续性慢 → jstack + jstat + GC 日志
  │
  └─ 需要远程监控？
        │
        ├─ 实时监控 → jstatd + JMC/JConsole
        │
        └─ 离线分析 → JFR dump + JMC
```

### 诊断流程标准化

**Step 1：问题识别**
```
├── 监控告警触发
├── 用户反馈响应慢
└── 自动化测试失败
```

**Step 2：快速检查**
```bash
# 进程识别
jps -lm

# 基础信息收集
jinfo -flags <pid>
jstat -gcutil <pid> 1000 5

# 线程堆栈
jstack <pid> > threaddump.txt
```

**Step 3：针对性分析**
```bash
# CPU 问题
top -H -p <pid>
jstack <pid> | grep -A 20 "nid=0x"

# 内存问题
jmap -heap <pid>
jmap -histo <pid> > histo.txt

# GC 问题
jstat -gc <pid> 1000

# 深度分析
jcmd <pid> JFR.start name=diagnosis settings=profile duration=5m
```

**Step 4：保存现场**
```bash
# 线程转储
jstack <pid> > threaddump_$(date +%Y%m%d_%H%M%S).txt

# 堆转储
jmap -dump:format=b,file=heap_$(date +%Y%m%d_%H%M%S).hprof <pid>

# JFR 录制
jcmd <pid> JFR.dump name=diagnosis filename=jfr_$(date +%Y%m%d_%H%M%S).jfr
```

**Step 5：优化实施**
- 根据分析结果优化代码或配置
- 验证优化效果
- 监控长期效果

**Step 6：复盘总结**
- 记录问题根因
- 总结优化方法
- 更新监控和告警规则

## 最佳实践

### 生产环境监控策略

**分层监控**：

```
监控层次：
├── 基础设施层
│   ├── CPU 使用率
│   ├── 内存使用
│   └── 磁盘 I/O
├── JVM 运行时层
│   ├── GC 活动监控 (jstat)
│   ├── 线程状态监控 (jstack)
│   ├── 内存池监控 (jstat/jmap)
│   └── JVM 配置监控 (jinfo)
└── 应用层
    ├── 业务指标
    ├── 异常监控
    └── 性能指标
```

**告警配置**：

| 指标 | Warning | Critical | 说明 |
|-----|---------|----------|------|
| CPU | > 70% | > 90% | 持续 5 分钟 |
| GC 暂停 | > 200ms | > 1s | P99 |
| 堆内存 | > 80% | > 95% | 10 分钟趋势 |
| 线程数 | > 1000 | > 2000 | 持续增长 |
| 错误率 | > 1% | > 5% | 5 分钟窗口 |
| Old Gen 使用率 | > 70% | > 85% | 持续增长 |
| Metaspace | > 80% | > 90% | 持续增长 |

### 工具协同使用

**组合方案一：JFR + JMC**
```
JFR 负责数据采集 → JMC 负责数据可视化
优势：生产环境友好，官方支持
适用：全面性能分析、内存泄漏检测
```

**组合方案二：jstat + jstack + jmap**
```
jstat 实时监控 → jstack 线程分析 → jmap 堆分析
优势：轻量级、无 GUI 依赖
适用：生产环境快速排查、自动化脚本
```

**组合方案三：jstatd + JMC**
```
jstatd 远程服务 → JMC 图形化连接
优势：远程监控、集中管理
适用：分布式环境、多服务器监控
```

**组合方案四：jcmd 一站式诊断**
```
jcmd 统一接口 → 执行各类诊断命令
优势：功能全面、接口统一
适用：综合问题诊断、自动化运维
```

**组合方案五：第三方工具深度分析**
```
Async Profiler CPU 分析 → MAT 内存分析 → VisualVM 综合监控
优势：功能丰富、分析深入
适用：开发环境深度优化、专项问题分析
```

### 安全使用指南

**生产环境工具使用规则**：

```
生产环境工具使用规则：
├── ✅ JDK 内置工具（可日常使用）
│   ├── jstat - gcutil/gc 监控
│   ├── jinfo - flags/sysprops 查询
│   ├── jps - 进程列表
│   ├── jstack - 线程堆栈（短时间）
│   ├── jstatd - 监控守护进程
│   └── JFR - 持续录制（低开销）
├── ⚠️ 需谨慎评估（问题排查时使用）
│   ├── jcmd - JFR 录制（Profiling 模板）
│   ├── jmap - heap/histo（禁止 dump）
│   └── Async Profiler - CPU 采样
└── ❌ 禁止使用（生产环境）
    ├── jmap - dump（会导致暂停）
    ├── VisualVM（高开销）
    ├── JMC（分析时高开销）
    └── MAT（需加载堆转储）
```


### CI/CD 集成

在 CI/CD 流水线中集成性能测试：

```yaml
# GitHub Actions 示例
jobs:
  performance-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Java
        uses: actions/setup-java@v2
        with:
          java-version: '11'
      
      - name: Run Performance Test
        run: |
          java -jar application.jar &
          APP_PID=$!
          
          # 收集 JFR 数据
          jcmd $APP_PID JFR.start name=ci-test duration=2m settings=profile
          sleep 130
          jcmd $APP_PID JFR.dump name=ci-test filename=perf-test.jfr
          jcmd $APP_PID JFR.stop name=ci-test
      
      - name: Analyze Results
        run: |
          # 使用 jstat 分析 GC 性能
          jstat -gcutil $APP_PID 1000 120 > gc-stats.txt
          
          # 检查 GC 暂停是否超标
          if grep -q "GC.allocate" gc-stats.txt; then
            echo "GC performance check failed"
            exit 1
          fi
      
      - name: Upload JFR
        uses: actions/upload-artifact@v2
        with:
          name: perf-test.jfr
          path: perf-test.jfr
```

## 常见问题

### Q1：JDK 内置工具和第三方工具如何选择？

**生产环境**：优先使用 JDK 内置工具（jstat、jstack、jinfo、jps、JFR），这些工具经过充分测试，开销可控。

**开发环境**：可以自由选择，第三方工具通常提供更丰富的分析功能。

**深度优化**：建议组合使用，JDK 工具负责日常监控，第三方工具负责深度分析。

### Q2：jstack 和 JMC 的线程分析如何选择？

**jstack** 是命令行工具，开销极低，适合快速排查和自动化脚本。它能够快速生成线程堆栈快照，支持死锁自动检测。

**JMC** 提供图形化的线程分析视图，支持线程竞争时间线分析，适合需要深入分析线程问题的场景。

**建议**：日常排查使用 jstack，深度分析使用 JMC。

### Q3：jstatd 如何配置安全的远程监控？

jstatd 的远程监控需要配置安全策略：

```bash
# 1. 创建安全策略文件 jstatd.policy
grant codebase "file:${java.home}/../lib/tools.jar" {
    permission java.security.AllPermission;
};

# 2. 启动 jstatd 并指定安全策略
jstatd -J-Djava.rmi.server.hostname=192.168.1.100 \
       -J-Djava.security.policy=jstatd.policy

# 3. 限制客户端连接（可选）
# 在安全策略文件中添加客户端IP限制
```

**安全建议**：
- 使用防火墙限制访问 IP
- 启用 SSL/TLS 加密
- 定期更新安全策略

### Q4：jmap 命令在生产环境是否安全？

jmap 的安全性取决于使用的选项：

| 选项 | 安全性 | 说明 |
|-----|-------|------|
| `-heap` | ✅ 安全 | 查看堆配置，不暂停 JVM |
| `-histo` | ✅ 安全 | 查看对象统计，不暂停 JVM |
| `-permstat` | ✅ 安全 | 查看元空间统计，不暂停 JVM |
| `-dump` | ⚠️ 危险 | 生成堆转储，会触发 Full GC |

**建议**：生产环境只使用 `-heap` 和 `-histo` 选项，禁止使用 `-dump` 选项。如需堆转储，请在低峰期或问题排查时使用。

### Q5：如何选择 JFR 和 Async Profiler？

**JFR 优势**：
- JDK 内置，无需安装
- 生产环境开销极低
- 事件元数据丰富
- 支持滚动录制

**Async Profiler 优势**：
- 火焰图原生支持
- 采样精度更高
- 堆外内存分析
- 灵活的采样配置

**选择建议**：
- 生产环境持续监控：选择 JFR
- 开发环境深度优化：选择 Async Profiler
- 需要火焰图：选择 Async Profiler
- 需要完整事件数据：选择 JFR

### Q6：jstat 监控选项太多，如何选择？

jstat 提供了多种监控选项，选择取决于你的监控目标：

| 监控目标 | 推荐选项 | 输出内容 |
|---------|---------|---------|
| GC 性能概览 | `-gcutil` | 各区域使用率和 GC 次数 |
| 详细 GC 数据 | `-gc` | 各区域容量和使用量 |
| 内存池信息 | `-gcpermcapacity` | 永久代/元空间详情 |
| 类加载统计 | `-class` | 类加载、卸载数量 |
| JIT 编译统计 | `-compiler` | 编译方法和耗时 |

**常用命令**：
```bash
# GC 性能监控（最常用）
jstat -gcutil <pid> 1000

# 内存趋势分析
jstat -gc <pid> 1000

# 类加载问题排查
jstat -class <pid>

# JIT 编译性能
jstat -compiler <pid>
```

### Q7：如何用 jcmd 替代其他诊断工具？

jcmd 是 JDK 内置的"瑞士军刀"，可以执行大多数诊断功能：

| 功能 | 传统命令 | jcmd 等效命令 |
|-----|---------|--------------|
| 线程堆栈 | `jstack <pid>` | `jcmd <pid> Thread.print` |
| 堆转储 | `jmap -dump:file=h.hprof <pid>` | `jcmd <pid> GC.heap_dump file=h.hprof` |
| JFR 录制 | `java -XX:StartFlightRecording` | `jcmd <pid> JFR.start` |
| JVM 标志 | `jinfo -flags <pid>` | `jcmd <pid> VM.flags` |
| 系统属性 | `jinfo -sysprops <pid>` | `jcmd <pid> VM.system_properties` |
| GC 堆摘要 | `jmap -heap <pid>` | `jcmd <pid> GC.heap_info` |

**使用技巧**：
```bash
# 查看所有可用命令
jcmd <pid> help

# 执行特定命令
jcmd <pid> <command> [arguments]

# 组合多个诊断操作
jcmd <pid> VM.flags
jcmd <pid> Thread.print
jcmd <pid> GC.heap_info
```

### Q8：GC 日志如何配合 jstat 数据分析？

GC 日志和 jstat 数据可以互补使用：

```bash
# 1. 启用详细 GC 日志
java -Xlog:gc*=info:file=gc.log:time,uptime,level,tags:filecount=10,filesize=100m

# 2. 同步收集 jstat 数据
jstat -gcutil <pid> 1000 > gcstats.txt

# 3. 分析相关性
# - GC 日志显示 GC 发生时间点
# - jstat 数据提供 GC 前后的内存状态
# - 对比分析可以定位 GC 频繁的原因
```

**分析技巧**：
- 在 GC 日志中找到 GC 暂停时间点
- 查看对应时刻的 jstat 数据
- 分析内存变化趋势和 GC 模式

---


## 相关资源

### 官方文档

- **Oracle JVM Tools**: https://docs.oracle.com/javase/8/docs/technotes/tools/universal/
- **JFR 官方文档**: https://docs.oracle.com/javase/8/docs/technotes/guides/troubleshoot/tooldescr007.html
- **JMC 官方文档**: https://docs.oracle.com/javase/8/docs/technotes/guides/troubleshoot/tooldescr006.html
- **jcmd 官方文档**: https://docs.oracle.com/javase/8/docs/technotes/guides/troubleshoot/tooldescr004.html
- **jstack 官方文档**: https://docs.oracle.com/javase/8/docs/technotes/guides/troubleshoot/tooldescr007.html
- **jmap 官方文档**: https://docs.oracle.com/javase/8/docs/technotes/guides/troubleshoot/tooldescr007.html
- **jstat 官方文档**: https://docs.oracle.com/javase/8/docs/technotes/guides/troubleshoot/tooldescr007.html
- **jinfo 官方文档**: https://docs.oracle.com/javase/8/docs/technotes/guides/troubleshoot/tooldescr004.html
- **jps 官方文档**: https://docs.oracle.com/javase/8/docs/technotes/guides/troubleshoot/tooldescr004.html
- **jstatd 官方文档**: https://docs.oracle.com/javase/8/docs/technotes/guides/troubleshoot/tooldescr007.html

### 性能优化资源

- **Oracle Java 性能指南**: https://docs.oracle.com/javase/8/docs/technotes/guides/vm/performance-enhancements-7.html
- **Red Hat JVM 调优指南**: https://access.redhat.com/documentation/en-us/red_hat_jboss_fuse/7.0/html/optimizing_fuse_performance/performance_tuning_java_virtual_machine
- **阿里 JVM 参数指南**: https://github.com/alibaba/arthas/blob/master/README_CN.md

### 社区资源

- **Async Profiler GitHub**: https://github.com/jvm-profiling-tools/async-profiler
- **VisualVM GitHub**: https://github.com/oracle/visualvm
- **Eclipse MAT**: https://www.eclipse.org/mat/
- **FlameGraph**: https://github.com/brendangregg/FlameGraph

### 推荐阅读

- 《Java 性能权威指南》（Java Performance: The Definitive Guide）
- 《深入理解 Java 虚拟机》（周志明著）
- 《高性能 Java 编程》（High-Performance Java Computing）

---

## 工具速查表

### JDK 内置工具速查

| 命令 | 主要用途 | 常用选项 | 生产安全 |
|-----|---------|---------|---------|
| `jcmd <pid> <cmd>` | 综合诊断 | `help`, `Thread.print`, `GC.heap_dump`, `JFR.start` | ✅ |
| `jps` | 进程列表 | `-l`, `-m`, `-v`, `-lv` | ✅ |
| `jinfo <pid>` | 配置查看 | `-flags`, `-sysprops`, `-flag <name>` | ✅ |
| `jstack <pid>` | 线程分析 | `-l`, `-m`, `-F` | ✅ |
| `jmap <pid>` | 内存分析 | `-heap`, `-histo`, `-dump` | ⚠️ |
| `jstat <pid> <opts> <interval>` | 性能监控 | `-gc`, `-gcutil`, `-class`, `-compiler` | ✅ |
| `jstatd` | 远程监控 | `-p <port>`, `-J-Djava.rmi.server.hostname` | ✅ |
| `jcmd <pid> JFR.start` | 性能录制 | `name=`, `duration=`, `settings=` | ✅ |

### 第三方工具速查

| 工具 | 来源 | 安装方式 | 主要用途 | 生产环境 |
|-----|------|---------|---------|---------|
| Async Profiler | 社区开源 | GitHub 下载 | CPU 采样、火焰图 | ⚠️ 谨慎 |
| VisualVM | JDK 可选 | 独立下载/JDK 可选 | 综合监控、堆分析 | ❌ 不建议 |
| JMC | Oracle 官方 | Oracle 官网下载 | JFR 数据分析 | ⚠️ 分析时 |
| Eclipse MAT | Eclipse 社区 | Eclipse 下载 | 堆转储深度分析 | ❌ 不建议 |

### 工具选择快速参考

```
场景选择：
├── 生产环境日常监控
│   └── jstat + JFR + jinfo
├── 生产环境问题排查
│   └── jstack + jstat + jcmd
├── 开发环境快速排查
│   └── VisualVM
├── 开发环境深度优化
│   └── Async Profiler + MAT
├── 远程服务器诊断
│   └── jstatd + JMC
└── 综合诊断管理
    └── jcmd（一站式）
```

---

本章节提供了 Java 诊断工具的完整指南，涵盖了 JDK 内置工具和第三方工具的详细介绍、使用方法和最佳实践。建议根据具体场景选择合适的工具组合，生产环境优先使用 JDK 内置工具，开发环境可以充分利用第三方工具的强大分析能力。
