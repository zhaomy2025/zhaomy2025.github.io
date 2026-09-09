# Java Mission Control 实战指南

## 工具概述

### 什么是 JMC

**Java Mission Control (JMC)** 是 Oracle 官方提供的 JVM 监控和诊断工具套件，从 JDK 7 Update 40 开始随 JDK 一起分发。JMC 提供了一个图形化的用户界面，用于实时监控 JVM 性能、分析 JFR 录制数据、诊断性能问题和内存泄漏。JMC 是 Java 生态系统中最专业的性能分析工具之一，尤其在企业级应用环境中广泛使用。

JMC 的核心组件包括：**JMC 客户端**提供图形用户界面；**JMX 控制台**用于实时监控 JVM 指标；**JFR 录制文件分析器**提供深度的性能数据可视化；**飞行记录器编辑器**允许配置和创建 JFR 录制配置。这些组件协同工作，为开发者提供了从实时监控到事后分析的完整工具链。

JMC 的设计理念是**生产环境友好**。它与 JFR 深度集成，能够在极低的性能开销下收集详细的性能数据。这使得 JMC 特别适合在生产环境中进行持续监控和问题排查，而不会对业务系统造成显著的性能影响。

### 发展历程

JMC 的发展与 Java 性能监控技术的演进密切相关：

**早期阶段（2005-2013）**：JMC 的前身是 JRockit Mission Control，Oracle 在收购 BEA Systems 后获得了这一工具。经过多年的发展，JRockit Mission Control 成为了业界领先的 JVM 诊断工具。

**开源整合（2014-2017）**：随着 Oracle 对 JRockit 和 HotSpot JVM 的整合，JMC 被移植到 HotSpot 平台。JDK 11 中 JFR 开源后，JMC 成为了完全免费的工具，消除了商业许可证的限制。

**持续演进（2018-至今）**：JMC 持续获得功能增强，包括更好的虚拟线程支持、现代化的用户界面、更丰富的分析视图和更好的云原生环境支持。JMC 8.x 系列是目前最成熟的版本。

### 与其他工具的定位对比

JMC 在 Java 性能工具生态中占据独特的位置：

| 工具 | 定位 | 优势 | 适用场景 |
|-----|------|------|---------|
| **JMC** | JFR 数据分析专家 | 官方支持、功能完整、可视化强 | JFR 录制文件深度分析 |
| **JConsole** | 基础监控工具 | 内置 JDK、简单易用 | 快速查看 JVM 状态 |
| **VisualVM** | 综合分析工具 | 内存/CPU 分析、Profiling | 开发环境问题排查 |
| **Async Profiler** | 底层性能分析 | 高性能、火焰图原生支持 | 深度性能优化 |

JMC 的核心竞争力在于对 JFR 数据的深度分析和可视化能力。虽然 JConsole 和 VisualVM 也支持 JFR 数据分析，但 JMC 提供了更专业的分析视图和更丰富的诊断功能。

## 安装与配置

### 获取 JMC

JMC 包含在 JDK 安装中，也可以单独下载：

**JDK 捆绑版本**：
```bash
# JDK 8-17：包含 JMC
$JAVA_HOME/bin/jmc

# JDK 17+：需要单独启用
# 使用 --enable-native-jmc 参数运行
java --enable-native-jmc=jmc -jar jmc.jar
```

**独立下载（推荐）**：
```bash
# 从 Oracle 官网下载
# https://www.oracle.com/java/technologies/jdk-mission-control-downloads.html

# 或从 Adoptium 下载（开源构建）
# https://adoptium.net/jmc.html

# Linux 解压
tar -xzf jmc-8.x.x-linux.tar.gz

# macOS 解压
tar -xzf jmc-8.x.x-macos.tar.gz

# Windows 解压
unzip jmc-8.x.x-windows.zip
```

### 系统要求

**操作系统支持**：
- Windows：10 及以上版本
- Linux：推荐 Ubuntu 20.04、CentOS 8 及以上版本

**JVM 版本要求**：
- HotSpot JVM 8 及以上版本
- OpenJDK 8 及以上版本
- Oracle JDK 8 及以上版本

**内存要求**：
- 最低 4GB RAM（推荐 8GB+）
- 足够的磁盘空间存储 JFR 录制文件

### 首次启动配置

**Linux 环境配置**：

```bash
# 赋予执行权限
chmod +x jmc

# 如果遇到权限问题，尝试
./jmc --launcher.openFile &

# 设置环境变量（可选）
export JMC_HOME=/path/to/jmc
export PATH=$JMC_HOME/bin:$PATH
```

### 连接配置

JMC 可以通过 JMX 连接到远程 JVM：

**本地连接**：
JMC 会自动检测本地运行的 Java 进程，无需额外配置。

**远程连接配置**：
```bash
# JVM 启动参数
java -Dcom.sun.management.jmxremote \
     -Dcom.sun.management.jmxremote.port=7091 \
     -Dcom.sun.management.jmxremote.ssl=false \
     -Dcom.sun.management.jmxremote.authenticate=false \
     MyApplication
```

**JMC 连接设置**：
1. 打开 JMC
2. 选择 "File" -> "Connect"
3. 点击 "Add New Connection"
4. 输入连接参数：
   - Host：目标服务器 IP
   - Port：JMX 端口（默认 7091）
   - 认证信息（如启用）

## 核心功能详解

### JMX 控制台

JMC 的 JMX 控制台提供了 JVM 运行时的实时监控能力。通过连接 JMX 接口，JMC 能够展示 JVM 的各项性能指标，包括内存使用、线程状态、CPU 负载、GC 活动等。

**内存监控视图**：

JMX 控制台的内存视图提供了堆内存和非堆内存的实时监控：

```
内存区域说明：
├── 堆内存（Heap）
│   ├── Eden Space（新生代 Eden 区）
│   ├── Survivor Space（新生代 Survivor 区）
│   └── Old Gen（老年代）
└── 非堆内存（Non-Heap）
    ├── Metaspace（元空间）
    ├── Code Cache（代码缓存）
    └── Compressed Class Space（压缩类空间）
```

**关键内存指标**：
- **Used**：当前已使用的内存量
- **Committed**：已分配的内存量
- **Max**：最大可用内存（-Xmx 设置）

**GC 监控**：

GC 视图显示了各代内存的回收统计：
- **Collection Count**：GC 发生次数
- **Collection Time**：GC 累计耗时
- **GC Cause**：触发原因（如 Allocation Failure、Ergonomics）

**线程视图**：

线程视图实时展示：
- 当前活动线程数
- 峰值线程数
- 线程状态分布（RUNNABLE、WAITING、BLOCKED、TIMED_WAITING）
- 死锁检测

**CPU 监控**：

CPU 使用情况展示：
- JVM 进程 CPU 使用率
- 系统整体 CPU 使用率
- 各线程 CPU 占用（需要采样数据）

### JFR 录制管理

JMC 提供了图形化的 JFR 录制管理界面，支持创建、启动、停止录制，并能够实时查看录制状态。

**创建录制**：

1. 在 JMC 左侧导航树中右键点击目标 JVM
2. 选择 "Start Flight Recording"
3. 在向导中配置录制参数

**录制配置模板**：

| 模板类型 | 适用场景 | 采样级别 | 事件覆盖 |
|---------|---------|---------|---------|
| Continuous | 生产环境持续监控 | 低 | 基础事件 |
| Profiling | 性能问题分析 | 高 | 完整事件 |
| Startup | 启动阶段分析 | 中 | 启动相关事件 |
| Custom | 自定义配置 | 可调 | 可选事件 |

**录制参数详解**：

```
常规配置：
├── 录制名称：标识本次录制
├── 录制时长：固定时长或持续录制
├── 录制文件路径：.jfr 文件保存位置
└── 最大磁盘空间：防止磁盘耗尽

事件配置：
├── CPU 采样：采样频率和阈值
├── 内存分配：分配采样率
├── 线程事件：线程生命周期和锁
├── GC 事件：GC 详细日志
├── I/O 事件：文件和网络 I/O
└── 异常事件：异常捕获记录
```

**启动录制**：

```bash
# 也可以通过命令行启动录制
jcmd <PID> JFR.start name=MyRecording settings=profile duration=60s

# 查看录制状态
jcmd <PID> JFR.check

# 停止录制并保存
jcmd <PID> JFR.stop name=MyRecording filename=/tmp/recording.jfr

# 转储当前录制数据（不停止录制）
jcmd <PID> JFR.dump name=MyRecording filename=/tmp/dump.jfr
```

### 录制文件分析

JMC 最强大的功能是对 JFR 录制文件的深度分析。打开 .jfr 文件后，JMC 提供了多个专业分析视图。

**概览视图（Overview）**：

概览视图提供了录制期间 JVM 状态的总体摘要：

```
关键指标卡片：
├── 录制时长和事件总数
├── 平均 CPU 使用率
├── GC 累计暂停时间
├── 内存分配总量
├── 热点方法排名（Top 10）
├── 异常事件统计
└── I/O 操作汇总
```

**内存视图（Memory）**：

内存分析视图提供了全面的内存使用分析：

```
标签页说明：
├── 堆内存使用：堆内存随时间变化曲线
├── GC 活动：GC 事件时间线和详情
├── 对象统计：分配量最大的对象类型
├── 内存泄漏检测：可疑的内存增长模式
└── 分配分析：热点分配路径
```

**内存泄漏检测**：

JMC 提供了自动检测潜在内存泄漏的能力：

```
检测指标：
├── 老年代持续增长
├── 对象未释放（同一对象引用持续存在）
├── 类加载器泄漏模式
└── 静态字段引用增长
```

**CPU 视图（CPU）**：

CPU 分析视图用于识别 CPU 热点方法：

```
分析维度：
├── 热点方法（Hot Methods）：CPU 时间消耗排名
├── 热点类（Hot Classes）：CPU 密集型类
├── 线程 CPU 使用：各线程 CPU 占用排名
├── 锁竞争分析：线程同步开销
└── 调用树（Call Tree）：完整方法调用链
```

**火焰图（Flame Graph）**：

JMC 8.x 提供了内置的火焰图可视化功能：

```
火焰图阅读指南：
├── 横向宽度：代表 CPU 采样比例
├── 纵向堆叠：表示调用栈深度
├── 颜色区分：随机着色或按类别着色
└── 搜索功能：快速定位特定方法
```

**线程视图（Threads）**：

线程分析视图提供了线程状态和行为的详细分析：

```
分析内容：
├── 线程时间线：线程生命周期和状态变化
├── 热点线程：CPU 占用最高的线程
├── 线程竞争：锁等待和阻塞事件
├── 死锁检测：自动检测和展示死锁
└── 虚拟线程支持（JDK 21+）：虚拟线程分析
```

**I/O 视图（I/O）**：

I/O 分析视图帮助识别文件和网络 I/O 瓶颈：

```
监控指标：
├── 文件 I/O：读写操作统计
├── 网络 I/O：网络传输量统计
├── I/O 等待：I/O 导致的线程阻塞
└── 慢 I/O 检测：识别高延迟 I/O 操作
```

### 诊断模板

JMC 提供了预置的诊断模板，帮助快速识别常见问题：

**内存诊断模板**：

```
模板配置：
├── 内存分配采样：每 10MB 采样一次
├── 对象统计：完整统计
├── GC 事件：详细记录
└── 内存泄漏检测：启用

适用场景：
├── 内存使用异常增长
├── GC 频率过高
├── 可疑的对象分配模式
└── 堆内存耗尽
```

**CPU 诊断模板**：

```
模板配置：
├── CPU 采样：100Hz
├── 方法追踪：启用
├── 线程采样：每 10ms
└── 锁分析：启用

适用场景：
├── CPU 使用率持续偏高
├── 响应时间不稳定
├── 方法执行时间异常
└── 线程竞争问题
```

**延迟诊断模板**：

```
模板配置：
├── 延迟采样：记录高延迟事件
├── 异常记录：完整异常栈追踪
├── 同步事件：锁等待记录
└── I/O 延迟：记录慢 I/O

适用场景：
├── 用户请求响应慢
├── 事务处理延迟
└── 批量任务超时
```

## 实战案例

### 案例一：内存泄漏排查

**背景**：某电商网站的订单服务运行数天后出现 OOM 错误。

**诊断步骤**：

**步骤一：创建持续录制**

```bash
# 启动 JMC，连接目标 JVM
# 创建低开销的持续录制
# 配置：每 30 分钟滚动一次，保留最近 2 小时数据
```

**步骤二：观察内存趋势**

在 JMC 内存视图中观察：
- Old Gen 区域持续增长
- GC 后内存不下降
- 出现 Allocation Failure 警告

**步骤三：分析对象分配**

使用对象统计功能：
```
发现可疑对象：
├── 类名：OrderCache$Entry
├── 数量：持续增长
├── 大小：每个约 1KB
└── 位置：老年代
```

**步骤四：定位泄漏点**

在分配分析中查找创建位置：
```
调用路径：
└── OrderService.createOrder()
    └── OrderCache.put()
        └── new OrderCache$Entry()
```

**步骤五：确认根因**

检查代码发现：
```java
// 问题代码
public class OrderCache {
    private Map<String, OrderCache$Entry> cache = new HashMap<>();
    
    public void put(String key, Order order) {
        // 缺少过期清理机制
        cache.put(key, new OrderCache$Entry(order));
    }
}
```

**解决方案**：
- 添加 LRU 缓存淘汰机制
- 使用 WeakHashMap 避免强引用
- 定期清理过期条目

**效果验证**：
- Old Gen 内存稳定在设定范围内
- 无 OOM 错误
- GC 频率恢复正常

### 案例二：CPU 性能优化

**背景**：REST API 服务在高峰期响应时间显著增加，CPU 使用率超过 90%。

**诊断步骤**：

**步骤一：CPU 采样分析**

创建 Profiling 级别的 JFR 录制：
- 采样频率：100Hz
- 录制时长：5分钟
- 包含完整方法追踪

**步骤二：分析热点方法**

在 JMC CPU 视图中查看热点方法：
```
Top 5 热点方法：
1. com.fasterxml.jackson.core.JsonParser.encodeBytes() - 35%
2. com.example.service.OrderService.toJSON() - 25%
3. java.lang.String.getChars() - 15%
4. java.util.Arrays.copyOfRange() - 10%
5. com.example.util.JsonUtils.serialize() - 8%
```

**步骤三：火焰图分析**

打开火焰图可视化：
```
发现的问题模式：
├── JSON 序列化嵌套层级过深
├── 相同的对象被重复序列化
├── 存在大量小对象序列化
└── 序列化时创建大量临时字符串
```

**步骤四：根因定位**

进一步分析发现：
- API 响应对象包含完整实体关系
- 缺乏序列化缓存
- 使用了低效的 JSON 库配置

**优化措施**：

```java
// 优化前
@RestController
public class OrderController {
    @GetMapping("/order/{id}")
    public Order getOrder(@PathVariable String id) {
        return orderService.findById(id); // 返回完整 Order 实体
    }
}

// 优化后
@RestController
public class OrderController {
    @GetMapping("/order/{id}")
    public OrderDTO getOrder(@PathVariable String id) {
        Order order = orderService.findById(id);
        return OrderMapper.toDTO(order); // 使用轻量级 DTO
    }
}
```

- 使用 DTO 替代完整实体
- 启用 Jackson 序列化缓存
- 配置忽略不需要序列化的字段
- 使用对象池减少 GC 压力

**效果验证**：
- CPU 使用率从 90% 降至 55%
- 响应时间 P99 从 800ms 降至 200ms
- JSON 序列化热点消失

### 案例三：GC 调优

**背景**：微服务频繁触发 Full GC，导致服务暂停，影响 SLA。

**诊断步骤**：

**步骤一：GC 日志分析**

启用详细 GC 日志：
```bash
java -Xlog:gc*,gc+age*=debug,gc+heap*=debug:file=gc.log:time,uptime,level,tags:filecount=10,filesize=100m
```

**步骤二：分析 GC 模式**

在 JMC 中查看 GC 视图：
```
GC 统计：
├── GC 频率：每 2 分钟一次 Full GC
├── 平均暂停：1.5秒
├── 最大暂停：3.2秒
├── 老年代增长：每次 Full GC 增长 200MB
└── 分配率：500MB/秒
```

**步骤三：内存分配分析**

使用 JMC 的分配分析：
```
分配来源 Top 5：
1. byte[] 数组 - 40%（主要来自日志框架）
2. String 对象 - 25%（主要来自日志和序列化）
3. ArrayList 扩容 - 15%（集合操作）
4. HashMap 扩容 - 10%（缓存初始化）
5. 其他对象 - 10%
```

**步骤四：调整 JVM 参数**

```bash
# 优化前
java -Xms4g -Xmx4g -XX:+UseG1GC MyApp

# 优化后
java -Xms4g -Xmx4g \
     -XX:+UseG1GC \
     -XX:MaxGCPauseMillis=200 \
     -XX:G1HeapRegionSize=16m \
     -XX:InitiatingHeapOccupancyPercent=45 \
     -XX:G1ReservePercent=10 \
     -XX:MaxInlineLevel=15 \
     -Dlog4j2.formatMsgNoLookups=true \
     MyApp
```

**步骤五：验证效果**

优化后的 GC 模式：
- Full GC 频率：每 30 分钟一次
- 平均暂停：200ms
- 老年代稳定在 2.5GB

### 案例四：虚拟线程性能分析

**背景**：基于虚拟线程构建的高并发服务需要性能调优。

**诊断步骤**：

**步骤一：创建虚拟线程专用录制**

在 JDK 21+ 环境中使用 JMC 分析虚拟线程：
- 启用虚拟线程识别
- 使用协作式采样配置（JEP 518）
- 记录虚拟线程生命周期事件

**步骤二：分析虚拟线程分布**

在 JMC 线程视图中查看：
```
虚拟线程统计：
├── 总数：50,000
├── 活动数：10,000
├── 状态分布：
│   ├── RUNNABLE：8,000（实际在执行）
│   ├── WAITING：1,500（park 等待）
│   └── TIMED_WAITING：500（限时等待）
└── 平台线程数：100（Carrier Threads）
```

**步骤三：识别热点虚拟线程**

```
Top 5 活跃虚拟线程：
1. vt-23456（数据库查询）- CPU 占比 15%
2. vt-23457（缓存访问）- CPU 占比 12%
3. vt-23458（HTTP 调用）- CPU 占比 10%
4. vt-23459（业务计算）- CPU 占比 8%
5. vt-23460（数据转换）- CPU 占比 6%
```

**步骤四：检查虚拟线程挂载**

发现部分虚拟线程频繁挂载/卸载：
- 挂载频率：每毫秒多次
- 怀疑原因：细粒度任务划分

**优化措施**：

```java
// 优化前 - 任务划分过细
for (int i = 0; i < 100000; i++) {
    try (var scope = new StructuredTaskScope<>()) {
        scope.fork(() -> processItem(i));
        scope.join();
    }
}

// 优化后 - 批量处理
int batchSize = 1000;
for (int batch = 0; batch < 100; batch++) {
    try (var scope = new StructuredTaskScope<>()) {
        for (int i = 0; i < batchSize; i++) {
            scope.fork(() -> processItem(batch * batchSize + i));
        }
        scope.join();
    }
}
```

**效果验证**：
- 挂载/卸载频率降低 90%
- CPU 利用率提升 20%
- 吞吐量提升 35%

## 最佳实践

### 生产环境监控配置

**持续录制策略**：

```
录制配置（低开销）：
├── 事件模板：Continuous
├── 采样频率：1Hz（CPU）、每 10 分钟（内存）
├── 最大文件大小：100MB
├── 滚动录制：保留最近 24 小时
└── 告警阈值：CPU > 80%、GC > 500ms
```

**监控告警规则**：

| 指标 | 阈值 | 告警级别 |
|-----|------|---------|
| CPU 使用率 | > 80% 持续 5 分钟 | Warning |
| CPU 使用率 | > 95% 持续 1 分钟 | Critical |
| GC 暂停 | > 500ms | Warning |
| GC 暂停 | > 1 秒 | Critical |
| 内存使用 | > 80% | Warning |
| 线程数 | > 1000 | Warning |
| 异常频率 | > 10/分钟 | Warning |

### 开发环境调试配置

**详细分析配置**：

```
录制配置（详细分析）：
├── 事件模板：Profiling
├── 采样频率：100Hz（CPU）
├── 录制时长：30 秒 - 5 分钟
├── 事件覆盖：完整
└── 包含：方法追踪、分配追踪、锁分析
```

**快速诊断技巧**：

1. **CPU 问题**：使用 CPU 视图快速定位热点方法
2. **内存问题**：使用分配分析查找泄漏点
3. **线程问题**：使用线程视图分析锁竞争
4. **启动问题**：创建 Startup 模板录制启动过程

### 与 CI/CD 集成

将 JMC 分析集成到持续集成流程中：

```yaml
# GitHub Actions 示例
name: Performance Check

on:
  push:
    branches: [main]

jobs:
  performance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Java
        uses: actions/setup-java@v3
        with:
          java-version: '17'
          
      - name: Run Application
        run: |
          java -XX:StartFlightRecording:settings=profile,filename=baseline.jfr,duration=60s -jar app.jar &
          APP_PID=$!
          sleep 60
          kill $APP_PID
          
      - name: Analyze with JMC
        run: |
          # 使用 jfr-core 或其他工具分析
          jfr summary baseline.jfr
          
      - name: Upload Report
        uses: actions/upload-artifact@v3
        with:
          name: jfr-report
          path: report.html
```

### 远程诊断流程

**安全连接配置**：

```bash
# JVM 启动参数（生产环境）
java \
  -Dcom.sun.management.jmxremote \
  -Dcom.sun.management.jmxremote.port=7091 \
  -Dcom.sun.management.jmxremote.ssl=true \
  -Dcom.sun.management.jmxremote.authenticate=true \
  -Dcom.sun.management.jmxremote.access.file=/etc/jmxremote.access \
  -Dcom.sun.management.jmxremote.password.file=/etc/jmxremote.password \
  -Djava.rmi.server.hostname=your-server-ip \
  MyApplication
```

**连接步骤**：
1. 配置 SSH 隧道（推荐）
2. 启动 JMC
3. 创建 JMX 连接
4. 启用飞行录制
5. 复现问题
6. 停止录制并保存
7. 下载录制文件进行离线分析

## 常见问题与解决方案

### 连接问题

**问题：无法连接到远程 JVM**

```
排查步骤：
1. 检查 JVM 启动参数是否包含 JMX 配置
2. 验证网络连通性（telnet <host> <port>）
3. 检查防火墙规则
4. 确认 JMX 认证配置正确
5. 查看 JVM 日志中的绑定错误
```

**解决方案**：

```bash
# 测试 JMX 连接
telnet <server-ip> 7091

# 检查端口监听
netstat -tlnp | grep 7091

# SSH 隧道方式连接
ssh -L 7091:localhost:7091 user@server-ip
```

### 性能问题

**问题：JMC 本身运行缓慢**

```
优化建议：
1. 增大 JMC 堆内存（编辑 jmc.ini）
2. 减少同时打开的录制文件数量
3. 使用更快的磁盘存储录制文件
4. 关闭不需要的分析视图
```

**jmc.ini 配置优化**：

```ini
# 增大堆内存
-Xmx4g
-Xms2g

# 启用 G1 GC
-XX:+UseG1GC

# 性能优化参数
-XX:+UseStringDeduplication
-XX:+ParallelRefProcEnabled
```

### 录制文件过大

**问题：JFR 录制文件占用大量磁盘空间**

```
解决方案：
1. 降低采样频率
2. 减少录制事件类型
3. 设置最大文件大小限制
4. 启用滚动录制
5. 压缩归档文件
```

**磁盘空间管理脚本**：

```bash
#!/bin/bash
# cleanup-old-jfr.sh

JFR_DIR=/var/jfr
MAX_AGE=7  # 天

# 删除旧文件
find $JFR_DIR -name "*.jfr" -mtime +$MAX_AGE -delete

# 检查剩余空间
FREE_SPACE=$(df -BG /var | awk '{print $4}' | tail -1)
if [ ${FREE_SPACE%G} -lt 10 ]; then
    echo "WARNING: Low disk space: $FREE_SPACE"
fi
```

### JFR 录制失败

**问题：启动录制时报错**

```
常见错误：
1. 磁盘空间不足
2. 权限问题
3. 录制配置无效
4. JVM 版本不兼容
```

**排查方法**：

```bash
# 检查磁盘空间
df -h /path/to/jfr

# 检查文件权限
ls -la /path/to/jfr

# 使用命令行检查录制
jcmd <PID> JFR.check

# 查看 JVM 日志
tail -f /path/to/gc.log | grep -i "jfr\|flight\|recording"
```

## 进阶功能

### 自定义事件

JMC 支持定义自定义 JFR 事件：

```java
import jdk.jfr.*;

public class CustomEvents {
    @Label("业务操作")
    @Description("记录业务操作耗时")
    static class BusinessOperation extends Event {
        @Label("操作名称")
        String operationName;
        
        @Label("耗时(ms)")
        long duration;
        
        @Label("状态")
        String status;
    }
    
    public static void main(String[] args) {
        // 记录事件
        BusinessOperation event = new BusinessOperation();
        event.begin();
        try {
            // 业务逻辑
            doBusiness();
            event.status = "SUCCESS";
        } catch (Exception e) {
            event.status = "ERROR";
            throw e;
        } finally {
            event.end();
            event.commit();
        }
    }
}
```

### 诊断模板开发

创建自定义诊断模板：

```xml
<!-- template.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<configuration version="1.0" label="My Custom Template">
    <eventSettings>
        <event name="jdk.CPULoad" threshold="0s"/>
        <event name="jdk.GarbageCollection" threshold="10ms"/>
        <event name="jdk.JVMInformation" />
        <event name="jdk.NativeMemory" threshold="1MB"/>
        <event name="com.myapp.BusinessEvent" />
    </eventSettings>
    
    <control>
        <samplingFrequency>1Hz</samplingFrequency>
        <stackDepth>64</stackDepth>
        <threadFilter>myapp.*</threadFilter>
    </control>
</configuration>
```

### 插件开发

JMC 支持插件扩展：

```
插件结构：
├── META-INF/MANIFEST.MF
├── plugin.xml
├── myplugin.jar
└── icons/
```

**plugin.xml 示例**：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<plugin>
    <extensionPoint id="org.jmc.diagnostics" 
                    class="org.jmc.ui.diagnostics.IDiagnosticPage"/>
    
    <extension to="org.jmc.diagnostics"
               point="org.jmc.ui.diagnostics.IDiagnosticPage">
        <diagnosticPage class="com.myplugin.MyDiagnosticPage"
                       name="My Analysis"
                       description="Custom performance analysis"/>
    </extension>
</plugin>
```

## 相关资源

**官方文档**：
- [Oracle JMC 官方文档](https://docs.oracle.com/en/java/java-components/jdk-mission-control/)
- [JFR 用户指南](https://docs.oracle.com/en/java/java-components/flight-recorder/2.0/user-guide/)
- [JMC 插件开发指南](https://wiki.openjdk.org/display/jmc/Plugin+Development)

**学习资源**：
- [JFR 性能监控增强详解](jfr-enhancements.md)
- [Async Profiler 实战指南](async-profiler.md)
- [Oracle Learning Library - JMC Videos](https://www.oracle.com/technical-resources/articles/java/performance-with-jmc/)

**社区资源**：
- [JMC GitHub 仓库](https://github.com/JDKMissionControl)
- [OpenJDK JFR 邮件列表](https://mail.openjdk.org/mailman/listinfo/jdk-jfr)
- [Stack Overflow - JMC 标签](https://stackoverflow.com/questions/tagged/java-mission-control)
