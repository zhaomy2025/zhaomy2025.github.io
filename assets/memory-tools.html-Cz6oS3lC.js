import{_ as n,c as a,b as e,o as l}from"./app-DuOmEixQ.js";const p={};function i(t,s){return l(),a("div",null,s[0]||(s[0]=[e(`<h1 id="java-内存分析工具详解" tabindex="-1"><a class="header-anchor" href="#java-内存分析工具详解"><span>Java 内存分析工具详解</span></a></h1><p>内存问题是 Java 应用最常见也最棘手的性能问题之一。内存泄漏、内存溢出、对象分配异常等问题可能导致应用性能下降、响应变慢，甚至完全崩溃。本章节系统介绍 Java 生态系统中用于内存分析和问题排查的专业工具，帮助开发者从根源上解决内存相关问题。</p><h2 id="工具概览" tabindex="-1"><a class="header-anchor" href="#工具概览"><span>工具概览</span></a></h2><h3 id="内存问题分类" tabindex="-1"><a class="header-anchor" href="#内存问题分类"><span>内存问题分类</span></a></h3><p>Java 应用面临的内存问题可以分为以下几类：</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code><span class="line">内存问题类型：</span>
<span class="line">├── 内存泄漏（Memory Leak）</span>
<span class="line">│   ├── 静态集合持有对象引用</span>
<span class="line">│   ├── 监听器/回调未注销</span>
<span class="line">│   ├── ThreadLocal 误用</span>
<span class="line">│   ├── JDBC ResultSet/Statement 未关闭</span>
<span class="line">│   └── ClassLoader 泄漏</span>
<span class="line">│</span>
<span class="line">├── 内存溢出（OutOfMemoryError）</span>
<span class="line">│   ├── Java Heap Space</span>
<span class="line">│   ├── GC Overhead Limit Exceeded</span>
<span class="line">│   ├── Metaspace / PermGen Space</span>
<span class="line">│   ├── Unable to allocate new object</span>
<span class="line">│   └── Direct Buffer Memory</span>
<span class="line">│</span>
<span class="line">├── 内存碎片化</span>
<span class="line">│   ├── GC 频繁但回收有限</span>
<span class="line">│   └── 内存充足但分配失败</span>
<span class="line">│</span>
<span class="line">└── 对象分配异常</span>
<span class="line">    ├── 大对象分配</span>
<span class="line">    ├── 对象分配速率过高</span>
<span class="line">    └── 逃逸分析失败</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="内存分析工具生态" tabindex="-1"><a class="header-anchor" href="#内存分析工具生态"><span>内存分析工具生态</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code><span class="line">内存分析工具体系：</span>
<span class="line">├── JVM 内置工具</span>
<span class="line">│   ├── jmap - 内存映射工具</span>
<span class="line">│   ├── jcmd - 综合诊断工具</span>
<span class="line">│   ├── jstat - 统计监控工具</span>
<span class="line">│   └── VisualVM - 集成监控工具</span>
<span class="line">│</span>
<span class="line">├── 内存分析专业工具</span>
<span class="line">│   ├── MAT (Memory Analyzer Tool) # Eclipse Memory Analyzer</span>
<span class="line">│   ├── YourKit Java Profiler</span>
<span class="line">│   └── JProfiler</span>
<span class="line">│</span>
<span class="line">├── 堆转储分析</span>
<span class="line">│   ├── MAT 深度分析</span>
<span class="line">│   ├── 在线分析服务</span>
<span class="line">│   └── 自定义分析脚本</span>
<span class="line">│</span>
<span class="line">└── 持续监控</span>
<span class="line">    ├── JFR 内存事件</span>
<span class="line">    ├── Micrometer 指标</span>
<span class="line">    └── Prometheus + Grafana</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="jmap-内存映射工具深度应用" tabindex="-1"><a class="header-anchor" href="#jmap-内存映射工具深度应用"><span>jmap - 内存映射工具深度应用</span></a></h2><p>jmap 是 JDK 内置的内存映射工具，用于生成堆转储、分析堆内存使用情况、查看对象统计信息等。它是进行内存问题排查的基础工具。</p><h3 id="堆转储生成与分析" tabindex="-1"><a class="header-anchor" href="#堆转储生成与分析"><span>堆转储生成与分析</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line"><span class="token shebang important">#!/bin/bash</span></span>
<span class="line"><span class="token comment"># heap-dump-analysis.sh - 堆转储完整流程</span></span>
<span class="line"></span>
<span class="line"><span class="token assign-left variable">PID</span><span class="token operator">=</span><span class="token variable">$1</span></span>
<span class="line"><span class="token assign-left variable">OUTPUT_DIR</span><span class="token operator">=</span>/tmp/heap_dumps</span>
<span class="line"><span class="token assign-left variable">TIMESTAMP</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span><span class="token function">date</span> +%Y%m%d_%H%M%S<span class="token variable">)</span></span></span>
<span class="line"></span>
<span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-p</span> <span class="token variable">$OUTPUT_DIR</span></span>
<span class="line"></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;=== 堆转储分析流程 (PID: <span class="token variable">$PID</span>) ===&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 1. 生成堆转储</span></span>
<span class="line"><span class="token assign-left variable">DUMP_FILE</span><span class="token operator">=</span><span class="token variable">$OUTPUT_DIR</span>/heap_<span class="token variable">\${TIMESTAMP}</span>.hprof</span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;生成堆转储: <span class="token variable">$DUMP_FILE</span>&quot;</span></span>
<span class="line">jcmd <span class="token variable">$PID</span> GC.heap_dump <span class="token variable">$DUMP_FILE</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 2. 基本统计</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;&quot;</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;--- 堆转储统计 ---&quot;</span></span>
<span class="line">jcmd <span class="token variable">$PID</span> GC.heap_info</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 3. 对象直方图</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;&quot;</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;--- 对象直方图 TOP 20 ---&quot;</span></span>
<span class="line">jcmd <span class="token variable">$PID</span> GC.class_histogram <span class="token operator">|</span> <span class="token function">head</span> <span class="token parameter variable">-25</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 4. 堆使用情况</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;&quot;</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;--- 堆使用情况 ---&quot;</span></span>
<span class="line">jstat <span class="token parameter variable">-gcutil</span> <span class="token variable">$PID</span></span>
<span class="line"></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;&quot;</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;堆转储文件: <span class="token variable">$DUMP_FILE</span>&quot;</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;使用 MAT 分析: ./mat/MemoryAnalyzer <span class="token variable">$DUMP_FILE</span>&quot;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="对象分配速率监控" tabindex="-1"><a class="header-anchor" href="#对象分配速率监控"><span>对象分配速率监控</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line"><span class="token shebang important">#!/bin/bash</span></span>
<span class="line"><span class="token comment"># alloc-rate-monitor.sh - 分配速率监控</span></span>
<span class="line"></span>
<span class="line"><span class="token assign-left variable">PID</span><span class="token operator">=</span><span class="token variable">$1</span></span>
<span class="line"><span class="token assign-left variable">INTERVAL</span><span class="token operator">=</span><span class="token variable">\${2<span class="token operator">:-</span>5}</span></span>
<span class="line"></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;=== 对象分配速率监控 (PID: <span class="token variable">$PID</span>) ===&quot;</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;监控间隔: <span class="token variable">\${INTERVAL}</span>秒&quot;</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;&quot;</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;时间                 eden        old         total     GC&quot;</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;------------------- ---------- ---------- ---------- -----&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">while</span> <span class="token boolean">true</span><span class="token punctuation">;</span> <span class="token keyword">do</span></span>
<span class="line">    <span class="token assign-left variable">TIMESTAMP</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span><span class="token function">date</span> <span class="token string">&#39;+%H:%M:%S&#39;</span><span class="token variable">)</span></span></span>
<span class="line"></span>
<span class="line">    <span class="token comment"># 获取 GC 统计</span></span>
<span class="line">    <span class="token assign-left variable">STATS</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span>jstat <span class="token parameter variable">-gc</span> $PID <span class="token operator">|</span> <span class="token function">tail</span> <span class="token parameter variable">-1</span><span class="token variable">)</span></span></span>
<span class="line">    <span class="token assign-left variable">S0C</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span><span class="token builtin class-name">echo</span> $STATS <span class="token operator">|</span> <span class="token function">awk</span> <span class="token string">&#39;{print $1}&#39;</span><span class="token variable">)</span></span></span>
<span class="line">    <span class="token assign-left variable">S1C</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span><span class="token builtin class-name">echo</span> $STATS <span class="token operator">|</span> <span class="token function">awk</span> <span class="token string">&#39;{print $2}&#39;</span><span class="token variable">)</span></span></span>
<span class="line">    <span class="token assign-left variable">EC</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span><span class="token builtin class-name">echo</span> $STATS <span class="token operator">|</span> <span class="token function">awk</span> <span class="token string">&#39;{print $3}&#39;</span><span class="token variable">)</span></span></span>
<span class="line">    <span class="token assign-left variable">OC</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span><span class="token builtin class-name">echo</span> $STATS <span class="token operator">|</span> <span class="token function">awk</span> <span class="token string">&#39;{print $5}&#39;</span><span class="token variable">)</span></span></span>
<span class="line">    <span class="token assign-left variable">TT</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span><span class="token builtin class-name">echo</span> $STATS <span class="token operator">|</span> <span class="token function">awk</span> <span class="token string">&#39;{print $10}&#39;</span><span class="token variable">)</span></span></span>
<span class="line">    <span class="token assign-left variable">MTT</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span><span class="token builtin class-name">echo</span> $STATS <span class="token operator">|</span> <span class="token function">awk</span> <span class="token string">&#39;{print $11}&#39;</span><span class="token variable">)</span></span></span>
<span class="line"></span>
<span class="line">    <span class="token comment"># 计算各区域使用</span></span>
<span class="line">    <span class="token assign-left variable">EU</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span><span class="token builtin class-name">echo</span> $STATS <span class="token operator">|</span> <span class="token function">awk</span> <span class="token string">&#39;{print $4}&#39;</span><span class="token variable">)</span></span></span>
<span class="line">    <span class="token assign-left variable">OU</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span><span class="token builtin class-name">echo</span> $STATS <span class="token operator">|</span> <span class="token function">awk</span> <span class="token string">&#39;{print $6}&#39;</span><span class="token variable">)</span></span></span>
<span class="line"></span>
<span class="line">    <span class="token comment"># 计算总堆</span></span>
<span class="line">    <span class="token assign-left variable">TOTAL</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$((</span>S0C <span class="token operator">+</span> S1C <span class="token operator">+</span> EC <span class="token operator">+</span> OC<span class="token variable">))</span></span></span>
<span class="line">    <span class="token assign-left variable">USED</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$((</span>EU <span class="token operator">+</span> OU<span class="token variable">))</span></span></span>
<span class="line">    <span class="token assign-left variable">USAGE</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span><span class="token builtin class-name">echo</span> <span class="token string">&quot;scale=2; <span class="token variable">$USED</span> * 100 / <span class="token variable">$TOTAL</span>&quot;</span> <span class="token operator">|</span> <span class="token function">bc</span><span class="token variable">)</span></span></span>
<span class="line"></span>
<span class="line">    <span class="token comment"># 获取 GC 次数和时间</span></span>
<span class="line">    <span class="token assign-left variable">YGC</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span><span class="token builtin class-name">echo</span> $STATS <span class="token operator">|</span> <span class="token function">awk</span> <span class="token string">&#39;{print $12}&#39;</span><span class="token variable">)</span></span></span>
<span class="line">    <span class="token assign-left variable">YGCT</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span><span class="token builtin class-name">echo</span> $STATS <span class="token operator">|</span> <span class="token function">awk</span> <span class="token string">&#39;{print $13}&#39;</span><span class="token variable">)</span></span></span>
<span class="line">    <span class="token assign-left variable">FGC</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span><span class="token builtin class-name">echo</span> $STATS <span class="token operator">|</span> <span class="token function">awk</span> <span class="token string">&#39;{print $16}&#39;</span><span class="token variable">)</span></span></span>
<span class="line">    <span class="token assign-left variable">FGCT</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span><span class="token builtin class-name">echo</span> $STATS <span class="token operator">|</span> <span class="token function">awk</span> <span class="token string">&#39;{print $17}&#39;</span><span class="token variable">)</span></span></span>
<span class="line"></span>
<span class="line">    <span class="token builtin class-name">echo</span> <span class="token string">&quot;<span class="token variable">$TIMESTAMP</span> <span class="token variable">$EU</span> / <span class="token variable">$OC</span>  <span class="token variable">$USED</span> / <span class="token variable">$TOTAL</span>  <span class="token variable">$USAGE</span>%  <span class="token variable">$YGC</span>/<span class="token variable">$YGCT</span> <span class="token variable">$FGC</span>/<span class="token variable">$FGCT</span>&quot;</span></span>
<span class="line"></span>
<span class="line">    <span class="token function">sleep</span> <span class="token variable">$INTERVAL</span></span>
<span class="line"><span class="token keyword">done</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="堆内存结构诊断" tabindex="-1"><a class="header-anchor" href="#堆内存结构诊断"><span>堆内存结构诊断</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line"><span class="token shebang important">#!/bin/bash</span></span>
<span class="line"><span class="token comment"># heap-structure-diagnosis.sh - 堆结构诊断</span></span>
<span class="line"></span>
<span class="line"><span class="token assign-left variable">PID</span><span class="token operator">=</span><span class="token variable">$1</span></span>
<span class="line"></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;=== 堆内存结构诊断 (PID: <span class="token variable">$PID</span>) ===&quot;</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 获取堆配置</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;--- 堆配置 ---&quot;</span></span>
<span class="line">jinfo <span class="token parameter variable">-flag</span> MaxHeapSize <span class="token variable">$PID</span></span>
<span class="line">jinfo <span class="token parameter variable">-flag</span> InitialHeapSize <span class="token variable">$PID</span></span>
<span class="line">jinfo <span class="token parameter variable">-flag</span> NewSize <span class="token variable">$PID</span></span>
<span class="line">jinfo <span class="token parameter variable">-flag</span> OldSize <span class="token variable">$PID</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 获取 GC 策略</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;&quot;</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;--- GC 策略 ---&quot;</span></span>
<span class="line">jinfo <span class="token parameter variable">-flag</span> UseG1GC <span class="token variable">$PID</span></span>
<span class="line">jinfo <span class="token parameter variable">-flag</span> UseSerialGC <span class="token variable">$PID</span></span>
<span class="line">jinfo <span class="token parameter variable">-flag</span> UseConcMarkSweepGC <span class="token variable">$PID</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 获取各代大小</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;&quot;</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;--- 各代大小统计 ---&quot;</span></span>
<span class="line">jstat <span class="token parameter variable">-gccapacity</span> <span class="token variable">$PID</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 获取使用情况</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;&quot;</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;--- 各代使用情况 ---&quot;</span></span>
<span class="line">jstat <span class="token parameter variable">-gcutil</span> <span class="token variable">$PID</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 获取对象统计</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;&quot;</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;--- 大对象统计 ---&quot;</span></span>
<span class="line">jcmd <span class="token variable">$PID</span> GC.class_histogram <span class="token operator">|</span> <span class="token function">grep</span> <span class="token parameter variable">-E</span> <span class="token string">&quot;^\\s*[0-9]+:&quot;</span> <span class="token operator">|</span> <span class="token function">awk</span> <span class="token string">&#39;{if ($2 &gt; 100000) print}&#39;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="mat-memory-analyzer-tool-深度应用" tabindex="-1"><a class="header-anchor" href="#mat-memory-analyzer-tool-深度应用"><span>MAT (Memory Analyzer Tool) 深度应用</span></a></h2><p>MAT 是 Eclipse Foundation 提供的专业内存分析工具，能够对堆转储文件进行深度分析，识别内存泄漏、内存浪费等问题。</p><h3 id="堆转自动化分析" tabindex="-1"><a class="header-anchor" href="#堆转自动化分析"><span>堆转自动化分析</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line"><span class="token shebang important">#!/bin/bash</span></span>
<span class="line"><span class="token comment"># mat-automated-analysis.sh - MAT 自动化分析</span></span>
<span class="line"></span>
<span class="line"><span class="token assign-left variable">HEAP_DUMP</span><span class="token operator">=</span><span class="token variable">$1</span></span>
<span class="line"><span class="token assign-left variable">REPORT_DIR</span><span class="token operator">=</span>./mat-reports</span>
<span class="line"><span class="token assign-left variable">TIMESTAMP</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span><span class="token function">date</span> +%Y%m%d_%H%M%S<span class="token variable">)</span></span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">if</span> <span class="token punctuation">[</span> <span class="token parameter variable">-z</span> <span class="token string">&quot;<span class="token variable">$HEAP_DUMP</span>&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">;</span> <span class="token keyword">then</span></span>
<span class="line">    <span class="token builtin class-name">echo</span> <span class="token string">&quot;用法: <span class="token variable">$0</span> &lt;heap-dump-file&gt;&quot;</span></span>
<span class="line">    <span class="token builtin class-name">exit</span> <span class="token number">1</span></span>
<span class="line"><span class="token keyword">fi</span></span>
<span class="line"></span>
<span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-p</span> <span class="token variable">$REPORT_DIR</span></span>
<span class="line"></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;=== MAT 自动化分析 ===&quot;</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;堆转储: <span class="token variable">$HEAP_DUMP</span>&quot;</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;输出目录: <span class="token variable">$REPORT_DIR</span>&quot;</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 检查 MAT 是否可用</span></span>
<span class="line"><span class="token keyword">if</span> <span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-d</span> <span class="token string">&quot;<span class="token variable">$MAT_HOME</span>&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">;</span> <span class="token keyword">then</span></span>
<span class="line">    <span class="token builtin class-name">echo</span> <span class="token string">&quot;⚠️  MAT_HOME 未设置，跳过 MAT 分析&quot;</span></span>
<span class="line">    <span class="token builtin class-name">echo</span> <span class="token string">&quot;请从 https://eclipse.dev/mat/ 下载安装 MAT&quot;</span></span>
<span class="line">    <span class="token builtin class-name">exit</span> <span class="token number">0</span></span>
<span class="line"><span class="token keyword">fi</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 1. 生成泄漏检测报告</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;生成泄漏检测报告...&quot;</span></span>
<span class="line"><span class="token variable">$MAT_HOME</span>/plugins/org.eclipse.equinox.launcher_*.jar <span class="token punctuation">\\</span></span>
<span class="line">    <span class="token parameter variable">-application</span> org.eclipse.mat.api:suspects <span class="token punctuation">\\</span></span>
<span class="line">    <span class="token string">&quot;<span class="token variable">$HEAP_DUMP</span>&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">    <span class="token parameter variable">-outputFolder</span> <span class="token variable">$REPORT_DIR</span>/leaksuspects</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 2. 生成组件报告</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;生成组件报告...&quot;</span></span>
<span class="line"><span class="token variable">$MAT_HOME</span>/plugins/org.eclipse.equinox.launcher_*.jar <span class="token punctuation">\\</span></span>
<span class="line">    <span class="token parameter variable">-application</span> org.eclipse.mat.api:overview <span class="token punctuation">\\</span></span>
<span class="line">    <span class="token string">&quot;<span class="token variable">$HEAP_DUMP</span>&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">    <span class="token parameter variable">-outputFolder</span> <span class="token variable">$REPORT_DIR</span>/overview</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 3. 生成 Top Components 报告</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;生成 Top Components 报告...&quot;</span></span>
<span class="line"><span class="token variable">$MAT_HOME</span>/plugins/org.eclipse.equinox.launcher_*.jar <span class="token punctuation">\\</span></span>
<span class="line">    <span class="token parameter variable">-application</span> org.eclipse.mat.api:topcomponents <span class="token punctuation">\\</span></span>
<span class="line">    <span class="token string">&quot;<span class="token variable">$HEAP_DUMP</span>&quot;</span> <span class="token punctuation">\\</span></span>
<span class="line">    <span class="token parameter variable">-outputFolder</span> <span class="token variable">$REPORT_DIR</span>/topcomponents</span>
<span class="line"></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;&quot;</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;分析完成!&quot;</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;查看报告: ls -la <span class="token variable">$REPORT_DIR</span>&quot;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="内存泄漏模式识别" tabindex="-1"><a class="header-anchor" href="#内存泄漏模式识别"><span>内存泄漏模式识别</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line"><span class="token shebang important">#!/bin/bash</span></span>
<span class="line"><span class="token comment"># leak-pattern-detection.sh - 内存泄漏模式检测</span></span>
<span class="line"></span>
<span class="line"><span class="token assign-left variable">HEAP_DUMP</span><span class="token operator">=</span><span class="token variable">$1</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">if</span> <span class="token punctuation">[</span> <span class="token parameter variable">-z</span> <span class="token string">&quot;<span class="token variable">$HEAP_DUMP</span>&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">;</span> <span class="token keyword">then</span></span>
<span class="line">    <span class="token builtin class-name">echo</span> <span class="token string">&quot;用法: <span class="token variable">$0</span> &lt;heap-dump-file&gt;&quot;</span></span>
<span class="line">    <span class="token builtin class-name">exit</span> <span class="token number">1</span></span>
<span class="line"><span class="token keyword">fi</span></span>
<span class="line"></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;=== 内存泄漏模式检测 ===&quot;</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 使用 jcmd 生成类直方图</span></span>
<span class="line"><span class="token assign-left variable">HISTOGRAM</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span>jcmd $PID GC.class_histogram <span class="token operator"><span class="token file-descriptor important">2</span>&gt;</span>/dev/null<span class="token variable">)</span></span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 模式 1：静态集合持有对象</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;--- 模式 1：静态集合分析 ---&quot;</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;<span class="token variable">$HISTOGRAM</span>&quot;</span> <span class="token operator">|</span> <span class="token function">grep</span> <span class="token parameter variable">-E</span> <span class="token string">&quot;(HashMap|ArrayList|LinkedList|HashSet|TreeSet)&quot;</span> <span class="token operator">|</span> <span class="token function">head</span> <span class="token parameter variable">-10</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 模式 2：ClassLoader 泄漏</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;&quot;</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;--- 模式 2：ClassLoader 分析 ---&quot;</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;<span class="token variable">$HISTOGRAM</span>&quot;</span> <span class="token operator">|</span> <span class="token function">grep</span> <span class="token parameter variable">-i</span> <span class="token string">&quot;classloader\\|class$&quot;</span> <span class="token operator">|</span> <span class="token function">head</span> <span class="token parameter variable">-10</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 模式 3：ThreadLocal 泄漏</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;&quot;</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;--- 模式 3：ThreadLocal 分析 ---&quot;</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;<span class="token variable">$HISTOGRAM</span>&quot;</span> <span class="token operator">|</span> <span class="token function">grep</span> <span class="token parameter variable">-i</span> <span class="token string">&quot;threadlocal\\|thread&quot;</span> <span class="token operator">|</span> <span class="token function">head</span> <span class="token parameter variable">-10</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 模式 4：JDBC 资源泄漏</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;&quot;</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;--- 模式 4：JDBC 资源分析 ---&quot;</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;<span class="token variable">$HISTOGRAM</span>&quot;</span> <span class="token operator">|</span> <span class="token function">grep</span> <span class="token parameter variable">-iE</span> <span class="token string">&quot;(connection|statement|resultset|prepared)&quot;</span> <span class="token operator">|</span> <span class="token function">head</span> <span class="token parameter variable">-10</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 模式 5：监听器/回调</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;&quot;</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;--- 模式 5：监听器分析 ---&quot;</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;<span class="token variable">$HISTOGRAM</span>&quot;</span> <span class="token operator">|</span> <span class="token function">grep</span> <span class="token parameter variable">-iE</span> <span class="token string">&quot;(listener|callback|observer)&quot;</span> <span class="token operator">|</span> <span class="token function">head</span> <span class="token parameter variable">-10</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 模式 6：字符串驻留</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;&quot;</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;--- 模式 6：字符串分析 ---&quot;</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;<span class="token variable">$HISTOGRAM</span>&quot;</span> <span class="token operator">|</span> <span class="token function">grep</span> <span class="token parameter variable">-i</span> <span class="token string">&quot;string&quot;</span> <span class="token operator">|</span> <span class="token function">head</span> <span class="token parameter variable">-10</span></span>
<span class="line"></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;&quot;</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;分析完成，建议使用 MAT 打开堆转储进行深度分析&quot;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="堆转储对比分析" tabindex="-1"><a class="header-anchor" href="#堆转储对比分析"><span>堆转储对比分析</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line"><span class="token shebang important">#!/bin/bash</span></span>
<span class="line"><span class="token comment"># heap-comparison.sh - 堆转储对比分析</span></span>
<span class="line"></span>
<span class="line"><span class="token assign-left variable">DUMP1</span><span class="token operator">=</span><span class="token variable">$1</span></span>
<span class="line"><span class="token assign-left variable">DUMP2</span><span class="token operator">=</span><span class="token variable">$2</span></span>
<span class="line"><span class="token assign-left variable">REPORT_DIR</span><span class="token operator">=</span>./comparison-reports</span>
<span class="line"></span>
<span class="line"><span class="token keyword">if</span> <span class="token punctuation">[</span> <span class="token parameter variable">-z</span> <span class="token string">&quot;<span class="token variable">$DUMP1</span>&quot;</span> <span class="token punctuation">]</span> <span class="token operator">||</span> <span class="token punctuation">[</span> <span class="token parameter variable">-z</span> <span class="token string">&quot;<span class="token variable">$DUMP2</span>&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">;</span> <span class="token keyword">then</span></span>
<span class="line">    <span class="token builtin class-name">echo</span> <span class="token string">&quot;用法: <span class="token variable">$0</span> &lt;dump1&gt; &lt;dump2&gt;&quot;</span></span>
<span class="line">    <span class="token builtin class-name">exit</span> <span class="token number">1</span></span>
<span class="line"><span class="token keyword">fi</span></span>
<span class="line"></span>
<span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-p</span> <span class="token variable">$REPORT_DIR</span></span>
<span class="line"></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;=== 堆转储对比分析 ===&quot;</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;转储1: <span class="token variable">$DUMP1</span>&quot;</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;转储2: <span class="token variable">$DUMP2</span>&quot;</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 获取两个转储的类直方图</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;生成类直方图...&quot;</span></span>
<span class="line">jcmd <span class="token variable">$PID1</span> GC.class_histogram <span class="token operator">&gt;</span> <span class="token variable">$REPORT_DIR</span>/histogram1.txt</span>
<span class="line">jcmd <span class="token variable">$PID2</span> GC.class_histogram <span class="token operator">&gt;</span> <span class="token variable">$REPORT_DIR</span>/histogram2.txt</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 对比分析</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;&quot;</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;--- 对象数量变化 TOP 20 ---&quot;</span></span>
<span class="line"><span class="token function">diff</span> <span class="token operator">&lt;</span><span class="token punctuation">(</span><span class="token function">grep</span> <span class="token parameter variable">-E</span> <span class="token string">&quot;^\\s*[0-9]+:&quot;</span> <span class="token variable">$REPORT_DIR</span>/histogram1.txt <span class="token operator">|</span> <span class="token function">sort</span> -k2<span class="token punctuation">)</span> <span class="token punctuation">\\</span></span>
<span class="line">     <span class="token operator">&lt;</span><span class="token punctuation">(</span><span class="token function">grep</span> <span class="token parameter variable">-E</span> <span class="token string">&quot;^\\s*[0-9]+:&quot;</span> <span class="token variable">$REPORT_DIR</span>/histogram2.txt <span class="token operator">|</span> <span class="token function">sort</span> -k2<span class="token punctuation">)</span> <span class="token operator">||</span> <span class="token boolean">true</span></span>
<span class="line"></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;&quot;</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;--- 内存使用变化 TOP 20 ---&quot;</span></span>
<span class="line"><span class="token function">diff</span> <span class="token operator">&lt;</span><span class="token punctuation">(</span><span class="token function">grep</span> <span class="token parameter variable">-E</span> <span class="token string">&quot;^\\s*[0-9]+:&quot;</span> <span class="token variable">$REPORT_DIR</span>/histogram1.txt <span class="token operator">|</span> <span class="token function">sort</span> -k3<span class="token punctuation">)</span> <span class="token punctuation">\\</span></span>
<span class="line">     <span class="token operator">&lt;</span><span class="token punctuation">(</span><span class="token function">grep</span> <span class="token parameter variable">-E</span> <span class="token string">&quot;^\\s*[0-9]+:&quot;</span> <span class="token variable">$REPORT_DIR</span>/histogram2.txt <span class="token operator">|</span> <span class="token function">sort</span> -k3<span class="token punctuation">)</span> <span class="token operator">||</span> <span class="token boolean">true</span></span>
<span class="line"></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;&quot;</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;详细对比请使用 MAT: File -&gt; Open Heap Dump -&gt; Compare to Other Dump&quot;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="内存泄漏排查实战" tabindex="-1"><a class="header-anchor" href="#内存泄漏排查实战"><span>内存泄漏排查实战</span></a></h2><h3 id="实战案例一-静态集合泄漏" tabindex="-1"><a class="header-anchor" href="#实战案例一-静态集合泄漏"><span>实战案例一：静态集合泄漏</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line"><span class="token shebang important">#!/bin/bash</span></span>
<span class="line"><span class="token comment"># case-static-collection.sh - 静态集合泄漏排查</span></span>
<span class="line"></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;=== 静态集合内存泄漏排查 ===&quot;</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 获取堆转储</span></span>
<span class="line"><span class="token assign-left variable">DUMP_FILE</span><span class="token operator">=</span>/tmp/heap_static.hprof</span>
<span class="line">jcmd <span class="token variable">$PID</span> GC.heap_dump <span class="token variable">$DUMP_FILE</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 使用 MAT 分析（命令行）</span></span>
<span class="line"><span class="token comment"># 查找 HashMap 及其内容</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;分析 HashMap 使用情况...&quot;</span></span>
<span class="line"><span class="token comment"># 建议在 MAT 中执行以下查询：</span></span>
<span class="line"><span class="token comment"># </span></span>
<span class="line"><span class="token comment"># SELECT s FROM java.util.HashMap s</span></span>
<span class="line"><span class="token comment"># WHERE s.@size &gt; 1000</span></span>
<span class="line"><span class="token comment"># </span></span>
<span class="line"><span class="token comment"># SELECT m FROM java.util.HashMap m </span></span>
<span class="line"><span class="token comment"># WHERE m.key.@class.name LIKE &quot;%Key%&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 快速分析脚本</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;&quot;</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;--- HashMap 统计 ---&quot;</span></span>
<span class="line">jcmd <span class="token variable">$PID</span> GC.class_histogram <span class="token operator">|</span> <span class="token function">grep</span> HashMap</span>
<span class="line"></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;&quot;</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;--- ArrayList 统计 ---&quot;</span></span>
<span class="line">jcmd <span class="token variable">$PID</span> GC.class_histogram <span class="token operator">|</span> <span class="token function">grep</span> ArrayList</span>
<span class="line"></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;&quot;</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;建议：在 MAT 中使用 OQL 查询&quot;</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;SELECT m from java.util.HashMap m WHERE m.@size &gt; 1000&quot;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="实战案例二-threadlocal-泄漏" tabindex="-1"><a class="header-anchor" href="#实战案例二-threadlocal-泄漏"><span>实战案例二：ThreadLocal 泄漏</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line"><span class="token shebang important">#!/bin/bash</span></span>
<span class="line"><span class="token comment"># case-threadlocal.sh - ThreadLocal 泄漏排查</span></span>
<span class="line"></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;=== ThreadLocal 内存泄漏排查 ===&quot;</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 获取堆转储</span></span>
<span class="line"><span class="token assign-left variable">DUMP_FILE</span><span class="token operator">=</span>/tmp/heap_threadlocal.hprof</span>
<span class="line">jcmd <span class="token variable">$PID</span> GC.heap_dump <span class="token variable">$DUMP_FILE</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 分析 ThreadLocalMap</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;--- ThreadLocal 相关对象统计 ---&quot;</span></span>
<span class="line">jcmd <span class="token variable">$PID</span> GC.class_histogram <span class="token operator">|</span> <span class="token function">grep</span> <span class="token parameter variable">-i</span> thread</span>
<span class="line"></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;&quot;</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;--- 大对象 TOP 10 ---&quot;</span></span>
<span class="line">jcmd <span class="token variable">$PID</span> GC.class_histogram <span class="token operator">|</span> <span class="token function">grep</span> <span class="token parameter variable">-E</span> <span class="token string">&quot;^\\s*[0-9]+:&quot;</span> <span class="token operator">|</span> <span class="token function">head</span> <span class="token parameter variable">-15</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 线程分析</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;&quot;</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;--- 线程堆栈分析 ---&quot;</span></span>
<span class="line">jcmd <span class="token variable">$PID</span> Thread.print <span class="token operator">|</span> <span class="token function">grep</span> <span class="token parameter variable">-A</span> <span class="token number">20</span> <span class="token string">&quot;ThreadLocal&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;&quot;</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;建议在 MAT 中使用 OQL 查询：&quot;</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;SELECT t from java.lang.Thread t WHERE t.getName() LIKE <span class="token entity" title="\\&quot;">\\&quot;</span>%<span class="token entity" title="\\&quot;">\\&quot;</span>&quot;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="实战案例三-classloader-泄漏" tabindex="-1"><a class="header-anchor" href="#实战案例三-classloader-泄漏"><span>实战案例三：ClassLoader 泄漏</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line"><span class="token shebang important">#!/bin/bash</span></span>
<span class="line"><span class="token comment"># case-classloader.sh - ClassLoader 泄漏排查</span></span>
<span class="line"></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;=== ClassLoader 内存泄漏排查 ===&quot;</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 检查元空间使用</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;--- 元空间使用情况 ---&quot;</span></span>
<span class="line">jstat <span class="token parameter variable">-metaspace</span> <span class="token variable">$PID</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 获取类加载统计</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;&quot;</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;--- 类加载统计 ---&quot;</span></span>
<span class="line">jstat <span class="token parameter variable">-class</span> <span class="token variable">$PID</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 获取堆转储</span></span>
<span class="line"><span class="token assign-left variable">DUMP_FILE</span><span class="token operator">=</span>/tmp/heap_classloader.hprof</span>
<span class="line">jcmd <span class="token variable">$PID</span> GC.heap_dump <span class="token variable">$DUMP_FILE</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 分析 ClassLoader</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;&quot;</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;--- ClassLoader 统计 ---&quot;</span></span>
<span class="line">jcmd <span class="token variable">$PID</span> GC.class_histogram <span class="token operator">|</span> <span class="token function">grep</span> <span class="token parameter variable">-i</span> classloader</span>
<span class="line"></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;&quot;</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;建议在 MAT 中执行：&quot;</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;1. 打开堆转储&quot;</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;2. 使用 Dominator Tree 视图&quot;</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;3. 查找 ClassLoader 节点&quot;</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;4. 检查其保留的对象&quot;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="内存优化最佳实践" tabindex="-1"><a class="header-anchor" href="#内存优化最佳实践"><span>内存优化最佳实践</span></a></h2><h3 id="jvm-内存配置优化" tabindex="-1"><a class="header-anchor" href="#jvm-内存配置优化"><span>JVM 内存配置优化</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line"><span class="token shebang important">#!/bin/bash</span></span>
<span class="line"><span class="token comment"># jvm-memory-optimization.sh - JVM 内存配置优化</span></span>
<span class="line"></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;=== JVM 内存配置优化建议 ===&quot;</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 获取当前配置</span></span>
<span class="line"><span class="token assign-left variable">PID</span><span class="token operator">=</span><span class="token variable">$1</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">if</span> <span class="token punctuation">[</span> <span class="token parameter variable">-z</span> <span class="token string">&quot;<span class="token variable">$PID</span>&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">;</span> <span class="token keyword">then</span></span>
<span class="line">    <span class="token builtin class-name">echo</span> <span class="token string">&quot;用法: <span class="token variable">$0</span> &lt;PID&gt;&quot;</span></span>
<span class="line">    <span class="token builtin class-name">exit</span> <span class="token number">1</span></span>
<span class="line"><span class="token keyword">fi</span></span>
<span class="line"></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;--- 当前配置分析 ---&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 堆配置</span></span>
<span class="line"><span class="token assign-left variable">MAX_HEAP</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span>jinfo <span class="token parameter variable">-flag</span> MaxHeapSize $PID <span class="token operator">|</span> <span class="token function">awk</span> <span class="token parameter variable">-F</span><span class="token operator">=</span> <span class="token string">&#39;{print $2}&#39;</span><span class="token variable">)</span></span></span>
<span class="line"><span class="token assign-left variable">INIT_HEAP</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span>jinfo <span class="token parameter variable">-flag</span> InitialHeapSize $PID <span class="token operator">|</span> <span class="token function">awk</span> <span class="token parameter variable">-F</span><span class="token operator">=</span> <span class="token string">&#39;{print $2}&#39;</span><span class="token variable">)</span></span></span>
<span class="line"></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;最大堆: <span class="token variable"><span class="token variable">$((</span>$MAX_HEAP<span class="token operator">/</span><span class="token number">1024</span><span class="token operator">/</span><span class="token number">1024</span><span class="token variable">))</span></span> MB&quot;</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;初始堆: <span class="token variable"><span class="token variable">$((</span>$INIT_HEAP<span class="token operator">/</span><span class="token number">1024</span><span class="token operator">/</span><span class="token number">1024</span><span class="token variable">))</span></span> MB&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># GC 配置</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;&quot;</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;--- GC 配置 ---&quot;</span></span>
<span class="line">jinfo <span class="token parameter variable">-flag</span> UseG1GC <span class="token variable">$PID</span></span>
<span class="line">jinfo <span class="token parameter variable">-flag</span> UseSerialGC <span class="token variable">$PID</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 使用情况</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;&quot;</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;--- 当前使用情况 ---&quot;</span></span>
<span class="line">jstat <span class="token parameter variable">-gcutil</span> <span class="token variable">$PID</span> <span class="token operator">|</span> <span class="token function">tail</span> <span class="token parameter variable">-1</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 优化建议</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;&quot;</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;--- 优化建议 ---&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 建议 1：堆大小</span></span>
<span class="line"><span class="token builtin class-name">let</span> <span class="token string">&quot;RECOMMENDED_MAX = MAX_HEAP * 2&quot;</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;建议最大堆: <span class="token variable"><span class="token variable">$((</span>$RECOMMENDED_MAX<span class="token operator">/</span><span class="token number">1024</span><span class="token operator">/</span><span class="token number">1024</span><span class="token variable">))</span></span> MB&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 建议 2：GC 选择</span></span>
<span class="line"><span class="token keyword">if</span> <span class="token punctuation">[</span> <span class="token string">&quot;<span class="token variable"><span class="token variable">$(</span>jinfo <span class="token parameter variable">-flag</span> UseSerialGC $PID<span class="token variable">)</span></span>&quot;</span> <span class="token operator">==</span> <span class="token string">&quot;+&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">;</span> <span class="token keyword">then</span></span>
<span class="line">    <span class="token builtin class-name">echo</span> <span class="token string">&quot;建议: 如果应用较大，考虑切换到 G1GC&quot;</span></span>
<span class="line"><span class="token keyword">fi</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 建议 3：元空间</span></span>
<span class="line"><span class="token assign-left variable">METASPACE</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span>jstat <span class="token parameter variable">-metaspace</span> $PID <span class="token operator">|</span> <span class="token function">tail</span> <span class="token parameter variable">-1</span> <span class="token operator">|</span> <span class="token function">awk</span> <span class="token string">&#39;{print $2}&#39;</span><span class="token variable">)</span></span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;元空间使用: <span class="token variable">$METASPACE</span> KB&quot;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="内存使用基线管理" tabindex="-1"><a class="header-anchor" href="#内存使用基线管理"><span>内存使用基线管理</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line"><span class="token shebang important">#!/bin/bash</span></span>
<span class="line"><span class="token comment"># memory-baseline.sh - 内存使用基线管理</span></span>
<span class="line"></span>
<span class="line"><span class="token assign-left variable">BASELINE_FILE</span><span class="token operator">=</span>/tmp/memory-baseline.txt</span>
<span class="line"><span class="token assign-left variable">TIMESTAMP</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span><span class="token function">date</span> <span class="token string">&#39;+%Y-%m-%d %H:%M:%S&#39;</span><span class="token variable">)</span></span></span>
<span class="line"></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;=== 内存使用基线收集 ===&quot;</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 获取当前状态</span></span>
<span class="line"><span class="token assign-left variable">PID</span><span class="token operator">=</span><span class="token variable">$1</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">if</span> <span class="token punctuation">[</span> <span class="token parameter variable">-z</span> <span class="token string">&quot;<span class="token variable">$PID</span>&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">;</span> <span class="token keyword">then</span></span>
<span class="line">    <span class="token builtin class-name">echo</span> <span class="token string">&quot;未指定 PID，使用第一个 Java 进程&quot;</span></span>
<span class="line">    <span class="token assign-left variable">PID</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span>jps <span class="token parameter variable">-q</span><span class="token variable">)</span></span></span>
<span class="line"><span class="token keyword">fi</span></span>
<span class="line"></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;PID: <span class="token variable">$PID</span>&quot;</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;时间: <span class="token variable">$TIMESTAMP</span>&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 收集数据</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;&quot;</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;--- 堆内存 ---&quot;</span></span>
<span class="line">jstat <span class="token parameter variable">-gcutil</span> <span class="token variable">$PID</span></span>
<span class="line"></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;&quot;</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;--- 元空间 ---&quot;</span></span>
<span class="line">jstat <span class="token parameter variable">-metaspace</span> <span class="token variable">$PID</span></span>
<span class="line"></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;&quot;</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;--- 类加载 ---&quot;</span></span>
<span class="line">jstat <span class="token parameter variable">-class</span> <span class="token variable">$PID</span></span>
<span class="line"></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;&quot;</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;--- 编译 ---&quot;</span></span>
<span class="line">jstat <span class="token parameter variable">-compile</span> <span class="token variable">$PID</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 保存基线</span></span>
<span class="line"><span class="token keyword">if</span> <span class="token punctuation">[</span> <span class="token parameter variable">-f</span> <span class="token string">&quot;<span class="token variable">$BASELINE_FILE</span>&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">;</span> <span class="token keyword">then</span></span>
<span class="line">    <span class="token builtin class-name">echo</span> <span class="token string">&quot;&quot;</span></span>
<span class="line">    <span class="token builtin class-name">echo</span> <span class="token string">&quot;--- 与基线对比 ---&quot;</span></span>
<span class="line">    <span class="token builtin class-name">echo</span> <span class="token string">&quot;基线时间: <span class="token variable"><span class="token variable">$(</span><span class="token function">head</span> <span class="token parameter variable">-1</span> $BASELINE_FILE<span class="token variable">)</span></span>&quot;</span></span>
<span class="line">    <span class="token builtin class-name">echo</span> <span class="token string">&quot;当前时间: <span class="token variable">$TIMESTAMP</span>&quot;</span></span>
<span class="line"><span class="token keyword">fi</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="生产环境内存监控" tabindex="-1"><a class="header-anchor" href="#生产环境内存监控"><span>生产环境内存监控</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line"><span class="token shebang important">#!/bin/bash</span></span>
<span class="line"><span class="token comment"># production-memory-monitor.sh - 生产环境内存监控</span></span>
<span class="line"></span>
<span class="line"><span class="token assign-left variable">ALERT_HEAP</span><span class="token operator">=</span><span class="token number">90</span>  <span class="token comment"># 堆内存告警阈值 %</span></span>
<span class="line"><span class="token assign-left variable">ALERT_META</span><span class="token operator">=</span><span class="token number">90</span>  <span class="token comment"># 元空间告警阈值 %</span></span>
<span class="line"><span class="token assign-left variable">INTERVAL</span><span class="token operator">=</span><span class="token variable">\${1<span class="token operator">:-</span>60}</span></span>
<span class="line"></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;=== 生产环境内存监控 ===&quot;</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;告警阈值 - 堆: <span class="token variable">\${ALERT_HEAP}</span>% 元空间: <span class="token variable">\${ALERT_META}</span>%&quot;</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;刷新间隔: <span class="token variable">\${INTERVAL}</span>秒&quot;</span></span>
<span class="line"><span class="token builtin class-name">echo</span> <span class="token string">&quot;&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">while</span> <span class="token boolean">true</span><span class="token punctuation">;</span> <span class="token keyword">do</span></span>
<span class="line">    <span class="token assign-left variable">TIMESTAMP</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span><span class="token function">date</span> <span class="token string">&#39;+%Y-%m-%d %H:%M:%S&#39;</span><span class="token variable">)</span></span></span>
<span class="line">    </span>
<span class="line">    <span class="token comment"># 获取所有 Java 进程</span></span>
<span class="line">    <span class="token keyword">for</span> <span class="token for-or-select variable">PID</span> <span class="token keyword">in</span> <span class="token variable"><span class="token variable">$(</span>jps <span class="token parameter variable">-q</span><span class="token variable">)</span></span><span class="token punctuation">;</span> <span class="token keyword">do</span></span>
<span class="line">        <span class="token assign-left variable">PROC_NAME</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span>jps <span class="token parameter variable">-l</span> $PID <span class="token operator">|</span> <span class="token function">awk</span> <span class="token string">&#39;{print $2}&#39;</span><span class="token variable">)</span></span></span>
<span class="line">        </span>
<span class="line">        <span class="token comment"># 获取堆使用</span></span>
<span class="line">        <span class="token assign-left variable">HEAP_STATS</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span>jstat <span class="token parameter variable">-gcutil</span> $PID <span class="token operator"><span class="token file-descriptor important">2</span>&gt;</span>/dev/null <span class="token operator">|</span> <span class="token function">tail</span> <span class="token parameter variable">-1</span><span class="token variable">)</span></span></span>
<span class="line">        <span class="token keyword">if</span> <span class="token punctuation">[</span> <span class="token operator">!</span> <span class="token parameter variable">-z</span> <span class="token string">&quot;<span class="token variable">$HEAP_STATS</span>&quot;</span> <span class="token punctuation">]</span><span class="token punctuation">;</span> <span class="token keyword">then</span></span>
<span class="line">            <span class="token assign-left variable">HEAP_USAGE</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span><span class="token builtin class-name">echo</span> $HEAP_STATS <span class="token operator">|</span> <span class="token function">awk</span> <span class="token string">&#39;{print $NF}&#39;</span><span class="token variable">)</span></span></span>
<span class="line">            <span class="token assign-left variable">META_USAGE</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span>jstat <span class="token parameter variable">-metaspace</span> $PID <span class="token operator"><span class="token file-descriptor important">2</span>&gt;</span>/dev/null <span class="token operator">|</span> <span class="token function">tail</span> <span class="token parameter variable">-1</span> <span class="token operator">|</span> <span class="token function">awk</span> <span class="token string">&#39;{print $NF}&#39;</span><span class="token variable">)</span></span></span>
<span class="line">            </span>
<span class="line">            <span class="token comment"># 堆告警</span></span>
<span class="line">            <span class="token keyword">if</span> <span class="token punctuation">[</span> <span class="token variable"><span class="token variable">$(</span><span class="token builtin class-name">echo</span> <span class="token string">&quot;<span class="token variable">$HEAP_USAGE</span> &gt; <span class="token variable">$ALERT_HEAP</span>&quot;</span> <span class="token operator">|</span> <span class="token function">bc</span><span class="token variable">)</span></span> <span class="token parameter variable">-eq</span> <span class="token number">1</span> <span class="token punctuation">]</span><span class="token punctuation">;</span> <span class="token keyword">then</span></span>
<span class="line">                <span class="token builtin class-name">echo</span> <span class="token string">&quot;[<span class="token variable">$TIMESTAMP</span>] ⚠️  高堆内存告警&quot;</span></span>
<span class="line">                <span class="token builtin class-name">echo</span> <span class="token string">&quot;  进程: <span class="token variable">$PID</span> (<span class="token variable">$PROC_NAME</span>)&quot;</span></span>
<span class="line">                <span class="token builtin class-name">echo</span> <span class="token string">&quot;  堆使用: <span class="token variable">$HEAP_USAGE</span>%&quot;</span></span>
<span class="line">                <span class="token builtin class-name">echo</span> <span class="token string">&quot;  建议: 生成堆转储进行深度分析&quot;</span></span>
<span class="line">                <span class="token builtin class-name">echo</span> <span class="token string">&quot;&quot;</span></span>
<span class="line">            <span class="token keyword">fi</span></span>
<span class="line">            </span>
<span class="line">            <span class="token comment"># 元空间告警</span></span>
<span class="line">            <span class="token keyword">if</span> <span class="token punctuation">[</span> <span class="token variable"><span class="token variable">$(</span><span class="token builtin class-name">echo</span> <span class="token string">&quot;<span class="token variable">$META_USAGE</span> &gt; <span class="token variable">$ALERT_META</span>&quot;</span> <span class="token operator">|</span> <span class="token function">bc</span><span class="token variable">)</span></span> <span class="token parameter variable">-eq</span> <span class="token number">1</span> <span class="token punctuation">]</span><span class="token punctuation">;</span> <span class="token keyword">then</span></span>
<span class="line">                <span class="token builtin class-name">echo</span> <span class="token string">&quot;[<span class="token variable">$TIMESTAMP</span>] ⚠️  高元空间告警&quot;</span></span>
<span class="line">                <span class="token builtin class-name">echo</span> <span class="token string">&quot;  进程: <span class="token variable">$PID</span> (<span class="token variable">$PROC_NAME</span>)&quot;</span></span>
<span class="line">                <span class="token builtin class-name">echo</span> <span class="token string">&quot;  元空间使用: <span class="token variable">$META_USAGE</span>%&quot;</span></span>
<span class="line">                <span class="token builtin class-name">echo</span> <span class="token string">&quot;  建议: 检查类加载和动态代理使用&quot;</span></span>
<span class="line">                <span class="token builtin class-name">echo</span> <span class="token string">&quot;&quot;</span></span>
<span class="line">            <span class="token keyword">fi</span></span>
<span class="line">        <span class="token keyword">fi</span></span>
<span class="line">    <span class="token keyword">done</span></span>
<span class="line">    </span>
<span class="line">    <span class="token function">sleep</span> <span class="token variable">$INTERVAL</span></span>
<span class="line"><span class="token keyword">done</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="内存分析命令速查" tabindex="-1"><a class="header-anchor" href="#内存分析命令速查"><span>内存分析命令速查</span></a></h2><h3 id="jmap-命令速查" tabindex="-1"><a class="header-anchor" href="#jmap-命令速查"><span>jmap 命令速查</span></a></h3><table><thead><tr><th>命令</th><th>说明</th></tr></thead><tbody><tr><td><code>jmap -heap &lt;pid&gt;</code></td><td>显示堆配置和使用情况</td></tr><tr><td><code>jmap -histo &lt;pid&gt;</code></td><td>显示对象直方图</td></tr><tr><td><code>jmap -histo:live &lt;pid&gt;</code></td><td>显示存活对象直方图</td></tr><tr><td><code>jmap -dump:file=heap.hprof &lt;pid&gt;</code></td><td>生成堆转储</td></tr><tr><td><code>jmap -permstat &lt;pid&gt;</code></td><td>显示永久代统计</td></tr><tr><td><code>jmap -finalizerinfo &lt;pid&gt;</code></td><td>显示待 Finalize 对象</td></tr></tbody></table><h3 id="jstat-命令速查" tabindex="-1"><a class="header-anchor" href="#jstat-命令速查"><span>jstat 命令速查</span></a></h3><table><thead><tr><th>命令</th><th>说明</th></tr></thead><tbody><tr><td><code>jstat -gcutil &lt;pid&gt;</code></td><td>GC 统计摘要</td></tr><tr><td><code>jstat -gccapacity &lt;pid&gt;</code></td><td>堆容量统计</td></tr><tr><td><code>jstat -gcnew &lt;pid&gt;</code></td><td>新生代统计</td></tr><tr><td><code>jstat -gcold &lt;pid&gt;</code></td><td>老年代统计</td></tr><tr><td><code>jstat -gcmetaspace &lt;pid&gt;</code></td><td>元空间统计</td></tr><tr><td><code>jstat -class &lt;pid&gt;</code></td><td>类加载统计</td></tr></tbody></table><h3 id="jcmd-命令速查" tabindex="-1"><a class="header-anchor" href="#jcmd-命令速查"><span>jcmd 命令速查</span></a></h3><table><thead><tr><th>命令</th><th>说明</th></tr></thead><tbody><tr><td><code>jcmd &lt;pid&gt; GC.heap_info</code></td><td>获取堆信息</td></tr><tr><td><code>jcmd &lt;pid&gt; GC.heap_dump &lt;file&gt;</code></td><td>生成堆转储</td></tr><tr><td><code>jcmd &lt;pid&gt; GC.class_histogram</code></td><td>类直方图</td></tr><tr><td><code>jcmd &lt;pid&gt; VM.native_memory</code></td><td>本地内存跟踪</td></tr></tbody></table><h2 id="常见问题-faq" tabindex="-1"><a class="header-anchor" href="#常见问题-faq"><span>常见问题 FAQ</span></a></h2><h3 id="如何选择堆转储时机" tabindex="-1"><a class="header-anchor" href="#如何选择堆转储时机"><span>如何选择堆转储时机？</span></a></h3><p><strong>建议时机</strong>：</p><ul><li>Full GC 后（反映稳态）</li><li>内存使用高峰时</li><li>OOM 发生时（自动生成）</li><li>定期（如每天一次）</li></ul><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line"><span class="token comment"># OOM 时自动生成堆转储</span></span>
<span class="line"><span class="token function">java</span> <span class="token parameter variable">-XX:+HeapDumpOnOutOfMemoryError</span> <span class="token parameter variable">-XX:HeapDumpPath</span><span class="token operator">=</span>/path/to/dumps <span class="token punctuation">..</span>.</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="堆转储文件过大怎么办" tabindex="-1"><a class="header-anchor" href="#堆转储文件过大怎么办"><span>堆转储文件过大怎么办？</span></a></h3><p><strong>解决方案</strong>：</p><ol><li>使用 <code>live=true</code> 只转储存活对象</li><li>压缩存储（gzip）</li><li>使用 MAT 的堆索引</li><li>采样分析（对于超大堆）</li></ol><h3 id="如何分析-mat-转储文件" tabindex="-1"><a class="header-anchor" href="#如何分析-mat-转储文件"><span>如何分析 MAT 转储文件？</span></a></h3><p><strong>优化建议</strong>：</p><ol><li>增加 MAT 内存（MemoryAnalyzer.ini）</li><li>使用 64 位 MAT</li><li>只分析感兴趣的区域</li><li>使用 OQL 定向查询</li></ol><h3 id="如何验证内存泄漏已修复" tabindex="-1"><a class="header-anchor" href="#如何验证内存泄漏已修复"><span>如何验证内存泄漏已修复？</span></a></h3><p><strong>验证方法</strong>：</p><ol><li>部署后持续监控内存使用</li><li>观察内存使用是否持续增长</li><li>对比修复前后的内存曲线</li><li>多次 Full GC 后检查内存释放情况</li></ol><h3 id="内存使用正常但还是-oom" tabindex="-1"><a class="header-anchor" href="#内存使用正常但还是-oom"><span>内存使用正常但还是 OOM？</span></a></h3><p><strong>可能原因</strong>：</p><ol><li>Metaspace 溢出</li><li>直接内存溢出（DirectBuffer）</li><li>线程栈溢出</li><li>GC overhead limit exceeded</li></ol><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line"><span class="token comment"># 排查方向</span></span>
<span class="line">jcmd <span class="token operator">&lt;</span>pid<span class="token operator">&gt;</span> VM.native_memory summary  <span class="token comment"># 本地内存</span></span>
<span class="line">jstat <span class="token parameter variable">-metaspace</span> <span class="token operator">&lt;</span>pid<span class="token operator">&gt;</span>              <span class="token comment"># 元空间</span></span>
<span class="line"><span class="token builtin class-name">ulimit</span> <span class="token parameter variable">-a</span>                           <span class="token comment"># 系统限制</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="相关资源" tabindex="-1"><a class="header-anchor" href="#相关资源"><span>相关资源</span></a></h2><h3 id="官方文档" tabindex="-1"><a class="header-anchor" href="#官方文档"><span>官方文档</span></a></h3><ul><li><a href="https://help.eclipse.org/latest/topic/org.eclipse.mat.ui.help/welcome.html" target="_blank" rel="noopener noreferrer">MAT 官方文档</a></li><li><a href="https://docs.oracle.com/javase/8/docs/technotes/guides/vm/gctuning/" target="_blank" rel="noopener noreferrer">JVM 内存管理</a></li><li><a href="https://docs.oracle.com/en/java/javase/17/docs/specs/man/jmap.html" target="_blank" rel="noopener noreferrer">jmap 文档</a></li></ul><h3 id="分析工具" tabindex="-1"><a class="header-anchor" href="#分析工具"><span>分析工具</span></a></h3><ul><li><a href="https://eclipse.dev/mat/" target="_blank" rel="noopener noreferrer">Eclipse MAT</a></li><li><a href="https://visualvm.github.io/" target="_blank" rel="noopener noreferrer">VisualVM</a></li><li><a href="https://www.ej-technologies.com/products/jprofiler/overview.html" target="_blank" rel="noopener noreferrer">JProfiler</a></li><li><a href="https://www.yourkit.com/" target="_blank" rel="noopener noreferrer">YourKit</a></li></ul><h3 id="性能优化" tabindex="-1"><a class="header-anchor" href="#性能优化"><span>性能优化</span></a></h3><ul><li><a href="https://docs.oracle.com/en/java/javase/17/perform/" target="_blank" rel="noopener noreferrer">Java 性能优化指南</a></li><li><a href="https://docs.oracle.com/en/java/javase/17/gctuning/" target="_blank" rel="noopener noreferrer">Garbage Collection Tuning Guide</a></li></ul>`,70)]))}const o=n(p,[["render",i]]),r=JSON.parse('{"path":"/java/advanced/diagnostic-tools/memory-tools.html","title":"Java 内存分析工具详解","lang":"zh-CN","frontmatter":{},"git":{"updatedTime":1767688846000,"contributors":[{"name":"zhaomy","username":"zhaomy","email":"3036190149@qq.com","commits":1,"url":"https://github.com/zhaomy"}],"changelog":[{"hash":"002042d6ccab469ab518aca6e5eb5ee2c566721e","time":1767688846000,"email":"3036190149@qq.com","author":"zhaomy","message":"docs: 新增Java诊断与监控工具相关文档"}]},"filePathRelative":"java/advanced/diagnostic-tools/memory-tools.md","excerpt":"\\n<p>内存问题是 Java 应用最常见也最棘手的性能问题之一。内存泄漏、内存溢出、对象分配异常等问题可能导致应用性能下降、响应变慢，甚至完全崩溃。本章节系统介绍 Java 生态系统中用于内存分析和问题排查的专业工具，帮助开发者从根源上解决内存相关问题。</p>\\n<h2>工具概览</h2>\\n<h3>内存问题分类</h3>\\n<p>Java 应用面临的内存问题可以分为以下几类：</p>\\n<div class=\\"language-text line-numbers-mode\\" data-highlighter=\\"prismjs\\" data-ext=\\"text\\"><pre><code><span class=\\"line\\">内存问题类型：</span>\\n<span class=\\"line\\">├── 内存泄漏（Memory Leak）</span>\\n<span class=\\"line\\">│   ├── 静态集合持有对象引用</span>\\n<span class=\\"line\\">│   ├── 监听器/回调未注销</span>\\n<span class=\\"line\\">│   ├── ThreadLocal 误用</span>\\n<span class=\\"line\\">│   ├── JDBC ResultSet/Statement 未关闭</span>\\n<span class=\\"line\\">│   └── ClassLoader 泄漏</span>\\n<span class=\\"line\\">│</span>\\n<span class=\\"line\\">├── 内存溢出（OutOfMemoryError）</span>\\n<span class=\\"line\\">│   ├── Java Heap Space</span>\\n<span class=\\"line\\">│   ├── GC Overhead Limit Exceeded</span>\\n<span class=\\"line\\">│   ├── Metaspace / PermGen Space</span>\\n<span class=\\"line\\">│   ├── Unable to allocate new object</span>\\n<span class=\\"line\\">│   └── Direct Buffer Memory</span>\\n<span class=\\"line\\">│</span>\\n<span class=\\"line\\">├── 内存碎片化</span>\\n<span class=\\"line\\">│   ├── GC 频繁但回收有限</span>\\n<span class=\\"line\\">│   └── 内存充足但分配失败</span>\\n<span class=\\"line\\">│</span>\\n<span class=\\"line\\">└── 对象分配异常</span>\\n<span class=\\"line\\">    ├── 大对象分配</span>\\n<span class=\\"line\\">    ├── 对象分配速率过高</span>\\n<span class=\\"line\\">    └── 逃逸分析失败</span>\\n<span class=\\"line\\"></span></code></pre>\\n<div class=\\"line-numbers\\" aria-hidden=\\"true\\" style=\\"counter-reset:line-number 0\\"><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div></div></div>"}');export{o as comp,r as data};
