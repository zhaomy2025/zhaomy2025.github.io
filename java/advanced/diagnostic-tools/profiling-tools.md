# Java 性能监控与剖析工具

本章节系统介绍 Java 生态系统中常用的性能监控与剖析工具，帮助开发者从多个维度分析和优化应用性能。

## 工具概览

### 为什么需要性能监控工具

在生产环境中，Java 应用可能面临各种性能挑战：

```
性能问题分类：
├── 响应时间问题
│   ├── API 响应慢
│   ├── 批处理超时
│   └── 数据库查询延迟
├── 吞吐量问题
│   ├── TPS 无法达标
│   ├── 并发能力受限
│   └── 资源利用率低
├── 资源消耗问题
│   ├── CPU 使用率过高
│   ├── 内存持续增长
│   └── 线程数持续增加
└── 稳定性问题
    ├── 频繁 Full GC
    ├── 内存溢出
    └── 死锁和线程饥饿
```

### 工具选择指南

| 场景 | 推荐工具 | 原因 |
|-----|---------|------|
| 生产环境持续监控 | JFR + JMC | 低开销、官方支持 |
| 性能问题深度分析 | Async Profiler | 高精度、火焰图支持 |
| 开发环境快速排查 | VisualVM | 集成度高、使用简单 |
| 线程问题分析 | jstack + JMC | 官方工具、免费使用 |
| 内存泄漏排查 | JMC + MAT | 专业分析能力 |

## 核心工具详解

### 1. JFR (Java Flight Recorder)

**JFR** 是 JDK 内置的性能监控和剖析工具，提供生产环境级别的低开销数据收集能力。

**核心特性**：
- 开销极低（通常 < 1%）
- 事件驱动架构
- 支持滚动录制
- 丰富的内置事件

**快速入门**：
```bash
# 启动 60 秒录制
jcmd <PID> JFR.start name=test duration=60s

# 检查录制状态
jcmd <PID> JFR.check

# 停止并保存
jcmd <PID> JFR.stop name=test filename=recording.jfr

# 或转储当前数据（不停止）
jcmd <PID> JFR.dump name=test filename=dump.jfr
```

**适用场景**：
- 生产环境持续监控
- 性能问题事后分析
- 热点方法识别
- GC 调优分析

**详细指南**：[JFR 性能监控增强详解](jfr-enhancements.md)

### 2. JMC (Java Mission Control)

**JMC** 是 Oracle 官方的 JVM 诊断工具，提供 JFR 数据的图形化分析和可视化能力。

**核心特性**：
- 专业的分析视图
- 内存泄漏检测
- 火焰图可视化
- 诊断模板支持

**快速入门**：
```bash
# 启动 JMC GUI
jmc

# 或连接远程 JVM
# File -> Connect -> New Connection
```

**适用场景**：
- JFR 数据深度分析
- 内存问题诊断
- 线程竞争分析
- GC 性能调优

**详细指南**：[Java Mission Control 实战指南](jmc-guide.md)

### 3. Async Profiler

**Async Profiler** 是一款开源的高性能分析工具，提供比 JFR 更丰富的分析维度和灵活的采样配置。

**核心特性**：
- 多种采样事件（CPU、内存、锁等）
- 原生火焰图支持
- 堆外内存分析
- 低开销实现

**快速入门**：
```bash
# CPU 采样分析
./profiler.sh -d 60 -f profile.svg <PID>

# 内存分配分析
./profiler.sh -d 60 -e alloc -f alloc.svg <PID>

# 锁分析
./profiler.sh -d 60 -e lock -f lock.svg <PID>
```

**适用场景**：
- CPU 热点方法分析
- 内存分配优化
- 锁竞争排查
- 深度性能优化

**详细指南**：[Async Profiler 实战指南](async-profiler.md)

## 工具对比与选择

### 功能对比矩阵

| 功能 | JFR | JMC | Async Profiler |
|-----|-----|-----|----------------|
| 开源免费 | ✅ | ✅ | ✅ |
| 生产环境安全 | ✅✅ | ✅✅ | ⚠️ |
| CPU 分析 | ✅ | ✅ | ✅✅ |
| 内存分析 | ✅ | ✅ | ✅✅ |
| 锁分析 | ✅ | ✅ | ✅ |
| 火焰图 | ⚠️ | ✅ | ✅✅ |
| 堆外内存 | ⚠️ | ⚠️ | ✅✅ |
| 平台支持 | 全平台 | 全平台 | Linux/macOS |

### 开销对比

| 工具 | CPU 开销 | 内存开销 | 磁盘开销 |
|-----|---------|---------|---------|
| JFR (Continuous) | < 1% | 极低 | 10-50 MB/小时 |
| JFR (Profiling) | 1-5% | 低 | 100-500 MB/小时 |
| Async Profiler | 1-5% | 低 | 取决于配置 |
| VisualVM | 5-10% | 中 | 视情况而定 |

### 选择决策树

```
开始
  │
  ├─ 生产环境？
  │     │
  │     ├─ 是 → 使用 JFR + JMC
  │     │
  │     └─ 否 → 开发/测试环境
  │               │
  │               ├─ 快速排查 → VisualVM
  │               │
  │               ├─ 深度分析 → Async Profiler
  │               │
  │               └─ 完整诊断 → JMC
  │
  └─ 问题类型
        │
        ├─ CPU 热点 → JFR/Async Profiler
        │
        ├─ 内存问题 → JMC + MAT
        │
        ├─ 线程问题 → jstack + JMC
        │
        └─ GC 问题 → JFR + GC 日志
```

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
│   ├── GC 活动监控
│   ├── 线程状态监控
│   └── 内存池监控
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

### 诊断流程标准化

**Step 1：问题识别**
```
├── 监控告警触发
├── 用户反馈响应慢
└── 自动化测试失败
```

**Step 2：快速检查**
```bash
# 基础信息收集
jps                          # 进程列表
top -H -p <PID>              # 线程 CPU 使用
jstack <PID>                 # 线程堆栈
jcmd <PID> VM.native_memory  # 内存分布
```

**Step 3：深度分析**
```bash
# 启动 JFR 录制
jcmd <PID> JFR.start name=diagnosis settings=profile duration=5m

# 等待问题复现

# 保存录制
jcmd <PID> JFR.stop name=diagnosis filename=diagnosis.jfr

# 使用 JMC 分析
jmc -open diagnosis.jfr
```

**Step 4：优化实施**
- 根据分析结果优化代码或配置
- 验证优化效果
- 监控长期效果

**Step 5：复盘总结**
- 记录问题根因
- 总结优化方法
- 更新监控和告警规则

### 工具协同使用

**组合方案一：JFR + JMC**
```
JFR 负责数据采集 → JMC 负责数据可视化
优势：生产环境友好，官方支持
```

**组合方案二：Async Profiler + FlameGraph**
```
Async Profiler 负责采样 → FlameGraph 负责渲染
优势：分析维度丰富，视觉效果直观
```

**组合方案三：全链路监控**
```
JFR (JVM) + Prometheus (指标) + Grafana (可视化) + ELK (日志)
优势：全方位监控，问题快速定位
```

## 常见问题

### Q1：JFR 和 Async Profiler 如何选择？

**JFR** 适合生产环境持续监控和事后分析，开销极低但分析维度相对有限。

**Async Profiler** 适合深度性能优化，开销稍高但分析更精细。

**建议**：生产环境使用 JFR + JMC，开发环境配合使用 Async Profiler。

### Q2：如何分析内存泄漏？

**步骤**：
1. 使用 JMC 创建持续 JFR 录制
2. 观察内存使用趋势，特别是老年代
3. 使用对象统计功能查找持续增长的对象
4. 分析对象分配路径定位泄漏点
5. 结合 MAT（Memory Analyzer Tool）进行堆转储分析

### Q3：CPU 使用率高如何排查？

**步骤**：
1. 使用 `top -H -p <PID>` 查看热点线程
2. 使用 `jstack <PID>` 获取线程堆栈
3. 创建 JFR CPU 采样录制
4. 在 JMC 或 Async Profiler 中分析热点方法
5. 优化热点代码或调整算法

### Q4：生产环境能否使用 Profiling？

**JFR**：可以，Continuous 模板开销 < 1%

**Async Profiler**：谨慎使用，建议仅在问题排查时启用，采样时间控制在 1-5 分钟

**VisualVM**：不建议在生产环境使用

## 进阶主题

### 自定义 JFR 事件

在代码中添加自定义事件：

```java
import jdk.jfr.*;

public class CustomEvent {
    @Label("业务操作")
    @Description("记录业务操作的执行时间和结果")
    static class BusinessOperation extends Event {
        @Label("操作名称")
        String operation;
        
        @Label("耗时(ms)")
        long duration;
        
        @Label("状态")
        String status;
    }
    
    public void doSomething() {
        BusinessOperation event = new BusinessOperation();
        event.begin();
        try {
            // 业务逻辑
            event.status = "SUCCESS";
        } catch (Exception e) {
            event.status = "ERROR: " + e.getMessage();
            throw e;
        } finally {
            event.end();
            event.commit();
        }
    }
}
```

### 性能基线管理

建立性能基线进行趋势分析：

```
基线指标：
├── 响应时间 P50/P95/P99
├── 吞吐量 TPS/QPS
├── 资源使用率
├── GC 频率和暂停时间
└── 错误率
```

### 与 CI/CD 集成

将性能测试集成到持续集成流程：

```yaml
# 性能门禁示例
- name: Performance Test
  run: |
    # 运行压力测试
    k6 run performance-test.js
    
    # 收集 JFR 数据
    java -XX:StartFlightRecording=dumponexit=true,filename=jfr/data.jfr -jar app.jar
    
    # 分析结果
    jfr summary jfr/data.jfr > performance-report.txt
    
    # 检查性能退化
    if grep -q "P95 > 500ms" performance-report.txt; then
      echo "ERROR: Performance regression detected"
      exit 1
    fi
```

## 相关资源

### 官方文档
- [JFR 用户指南](https://docs.oracle.com/en/java/java-components/flight-recorder/2.0/user-guide/)
- [JMC 官方文档](https://docs.oracle.com/en/java/java-components/jdk-mission-control/)
- [Async Profiler GitHub](https://github.com/async-profiler/async-profiler)

### 性能优化资源
- [Oracle Java 性能优化指南](https://docs.oracle.com/en/java/javase/17/perform/)
- [阿里巴巴 Java 开发手册 - 性能优化篇](https://developer.aliyun.com/topic/ebook/javach)
- [SpotBugs 最佳实践](https://spotbugs.github.io/)

### 社区资源
- [Stack Overflow - Java Performance](https://stackoverflow.com/questions/tagged/java-performance)
- [Reddit - r/java](https://www.reddit.com/r/java/)
- [Baeldung - Java 性能](https://www.baeldung.com/category/java/performance/)

## 贡献指南

本章节持续更新中，欢迎贡献：

- 新工具介绍
- 实战案例分享
- 最佳实践总结
- 常见问题解答

提交 Pull Request 或 Issue 参与贡献。
