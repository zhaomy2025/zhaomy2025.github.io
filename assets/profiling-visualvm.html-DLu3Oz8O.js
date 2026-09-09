import{_ as n,c as a,b as e,o as l}from"./app-ekva9aW0.js";const i={};function p(c,s){return l(),a("div",null,s[0]||(s[0]=[e(`<h1 id="visualvm-实战指南" tabindex="-1"><a class="header-anchor" href="#visualvm-实战指南"><span>VisualVM 实战指南</span></a></h1><h2 id="工具概述" tabindex="-1"><a class="header-anchor" href="#工具概述"><span>工具概述</span></a></h2><h3 id="什么是-visualvm" tabindex="-1"><a class="header-anchor" href="#什么是-visualvm"><span>什么是 VisualVM</span></a></h3><p><strong>VisualVM</strong> 是一款集成化的 Java 虚拟机监控和性能分析工具，它将多种命令行工具的功能整合到一个图形化界面中，为开发者提供了直观、便捷的 JVM 诊断能力。作为 JDK 自带的免费工具（直到 JDK 9，从 JDK 11 开始需要单独下载），VisualVM 已经成为 Java 开发者进行性能分析和问题排查的常用选择之一。</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code><span class="line">VisualVM 核心能力：</span>
<span class="line"></span>
<span class="line">┌─────────────────────────────────────────────────────────┐</span>
<span class="line">│                    VisualVM                             │</span>
<span class="line">├─────────────┬─────────────┬─────────────┬───────────────┤</span>
<span class="line">│  进程监控    │  线程分析   │  堆内存分析  │   CPU 采样    │</span>
<span class="line">│  (Overview) │ (Threads)  │  (Sampler)  │  (Profiler)   │</span>
<span class="line">├─────────────┼─────────────┼─────────────┼───────────────┤</span>
<span class="line">│  • JVM 参数  │  • 线程状态 │  • 内存使用  │  • 方法耗时   │</span>
<span class="line">│  • 系统属性  │  • 死锁检测 │  • 对象统计  │  • 调用链     │</span>
<span class="line">│  • 运行环境  │  • 堆栈查看 │  • 堆转储    │  • 热点分析   │</span>
<span class="line">└─────────────┴─────────────┴─────────────┴───────────────┘</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="历史背景" tabindex="-1"><a class="header-anchor" href="#历史背景"><span>历史背景</span></a></h3><p>VisualVM 的发展历程反映了 Java 生态对性能分析工具需求的演进：</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code><span class="line">VisualVM 发展时间线：</span>
<span class="line"></span>
<span class="line">2010年    2012年    2015年    2017年    2019年    2021年</span>
<span class="line">  │        │        │        │        │        │</span>
<span class="line">  ├────────┼────────┼────────┼────────┼────────┤</span>
<span class="line">  │  首次   │  1.3   │  1.3.9 │  2.0   │  2.1   │  2.1.6</span>
<span class="line">  │ 发布   │ 版本   │ 最终版  │ 发布   │ 发布   │ 最终版</span>
<span class="line">  │        │        │        │        │        │</span>
<span class="line">  │  JDK   │  增加   │  支持   │ 全新   │ 改进   │ 兼容</span>
<span class="line">  │  6/7   │ 插件   │  JDK   │ UI     │ 插件   │ JDK</span>
<span class="line">  │  兼容   │ 架构   │  8/9   │ 设计   │ 管理   │ 11+</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="与其他工具的对比" tabindex="-1"><a class="header-anchor" href="#与其他工具的对比"><span>与其他工具的对比</span></a></h3><table><thead><tr><th>特性</th><th>VisualVM</th><th>JMC</th><th>JFR</th><th>Async Profiler</th></tr></thead><tbody><tr><td>开源免费</td><td>✅</td><td>✅</td><td>✅</td><td>✅</td></tr><tr><td>GUI 界面</td><td>✅✅</td><td>✅✅</td><td>❌</td><td>❌</td></tr><tr><td>生产环境安全</td><td>⚠️</td><td>✅✅</td><td>✅✅</td><td>⚠️</td></tr><tr><td>CPU 性能剖析</td><td>✅</td><td>✅</td><td>✅</td><td>✅✅</td></tr><tr><td>内存分析</td><td>✅</td><td>✅</td><td>✅</td><td>✅</td></tr><tr><td>线程分析</td><td>✅</td><td>✅</td><td>✅</td><td>⚠️</td></tr><tr><td>插件扩展</td><td>✅</td><td>✅</td><td>❌</td><td>❌</td></tr><tr><td>火焰图</td><td>❌</td><td>✅</td><td>⚠️</td><td>✅✅</td></tr></tbody></table><h3 id="适用场景" tabindex="-1"><a class="header-anchor" href="#适用场景"><span>适用场景</span></a></h3><p>VisualVM 在以下场景中表现优异：</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code><span class="line">适用场景分析：</span>
<span class="line"></span>
<span class="line">                    VisualVM 适用场景</span>
<span class="line">                           │</span>
<span class="line">           ┌───────────────┼───────────────┐</span>
<span class="line">           │               │               │</span>
<span class="line">           ▼               ▼               ▼</span>
<span class="line">    ┌─────────────┐  ┌─────────────┐  ┌─────────────┐</span>
<span class="line">    │  开发环境   │  │  测试环境   │  │  快速排查   │</span>
<span class="line">    │  性能调优   │  │  问题诊断   │  │  应急响应   │</span>
<span class="line">    └─────────────┘  └─────────────┘  └─────────────┘</span>
<span class="line">           │               │               │</span>
<span class="line">           ▼               ▼               ▼</span>
<span class="line">    • CPU 热点分析    • 内存泄漏排查    • 线程死锁检测</span>
<span class="line">    • 方法性能对比    • GC 调优验证    • 快速堆转储</span>
<span class="line">    • 代码优化验证    • 压力测试监控   • 资源使用评估</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="安装与配置" tabindex="-1"><a class="header-anchor" href="#安装与配置"><span>安装与配置</span></a></h2><h3 id="安装方式" tabindex="-1"><a class="header-anchor" href="#安装方式"><span>安装方式</span></a></h3><h4 id="方式一-独立安装-推荐" tabindex="-1"><a class="header-anchor" href="#方式一-独立安装-推荐"><span>方式一：独立安装（推荐）</span></a></h4><p>从 VisualVM 官方网站下载独立版本：</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line"><span class="token comment"># 官方下载页面</span></span>
<span class="line">https://visualvm.github.io/</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 下载后解压到指定目录</span></span>
<span class="line"><span class="token function">unzip</span> visualvm_216.zip <span class="token parameter variable">-d</span> /opt/</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="方式二-通过包管理器安装" tabindex="-1"><a class="header-anchor" href="#方式二-通过包管理器安装"><span>方式二：通过包管理器安装</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line"><span class="token comment"># macOS (Homebrew)</span></span>
<span class="line">brew <span class="token function">install</span> <span class="token parameter variable">--cask</span> visualvm</span>
<span class="line"></span>
<span class="line"><span class="token comment"># Windows (Chocolatey)</span></span>
<span class="line">choco <span class="token function">install</span> visualvm</span>
<span class="line"></span>
<span class="line"><span class="token comment"># Linux (Snap)</span></span>
<span class="line">snap <span class="token function">install</span> visualvm <span class="token parameter variable">--classic</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="方式三-ide-插件安装" tabindex="-1"><a class="header-anchor" href="#方式三-ide-插件安装"><span>方式三：IDE 插件安装</span></a></h4><div class="language-xml line-numbers-mode" data-highlighter="prismjs" data-ext="xml"><pre><code><span class="line"><span class="token comment">&lt;!-- IntelliJ IDEA 插件市场 --&gt;</span></span>
<span class="line"><span class="token comment">&lt;!-- 搜索: VisualVM Launcher --&gt;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">&lt;!-- Eclipse Marketplace --&gt;</span></span>
<span class="line"><span class="token comment">&lt;!-- 搜索: VisualVM Eclipse --&gt;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="启动-visualvm" tabindex="-1"><a class="header-anchor" href="#启动-visualvm"><span>启动 VisualVM</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line"><span class="token comment"># Linux/macOS</span></span>
<span class="line">./visualvm/bin/visualvm <span class="token operator">&amp;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># Windows</span></span>
<span class="line">visualvm.exe</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 指定 JDK 路径启动</span></span>
<span class="line">./visualvm/bin/visualvm <span class="token parameter variable">--jdkhome</span> /path/to/jdk</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="核心配置" tabindex="-1"><a class="header-anchor" href="#核心配置"><span>核心配置</span></a></h3><h4 id="jvm-选项配置" tabindex="-1"><a class="header-anchor" href="#jvm-选项配置"><span>JVM 选项配置</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line"><span class="token comment"># 在 visualvm.conf 文件中配置</span></span>
<span class="line"><span class="token comment"># 位置: visualvm/etc/visualvm.conf</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 增加可用内存</span></span>
<span class="line"><span class="token assign-left variable">visualvm_default_options</span><span class="token operator">=</span><span class="token string">&quot;-J-Xmx1024m -J-Xms512m&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 启用远程 JMX 连接</span></span>
<span class="line"><span class="token assign-left variable">visualvm_default_options</span><span class="token operator">=</span><span class="token string">&quot;-J-Dcom.sun.management.jmxremote=true&quot;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="插件配置" tabindex="-1"><a class="header-anchor" href="#插件配置"><span>插件配置</span></a></h4><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code><span class="line">插件安装步骤：</span>
<span class="line"></span>
<span class="line">1. 打开 VisualVM</span>
<span class="line">2. 菜单: Tools → Plugins</span>
<span class="line">3. 切换到 &quot;Available Plugins&quot; 标签</span>
<span class="line">4. 选择需要的插件:</span>
<span class="line">   ├── VisualGC              (GC 监控)</span>
<span class="line">   ├── Tracer                (方法追踪)</span>
<span class="line">   ├── HeapDump             (堆转储分析)</span>
<span class="line">   └── Threads Monitor      (线程监控)</span>
<span class="line">5. 点击 &quot;Install&quot;</span>
<span class="line">6. 重启 VisualVM</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="连接远程-jvm" tabindex="-1"><a class="header-anchor" href="#连接远程-jvm"><span>连接远程 JVM</span></a></h3><h4 id="方式一-jmx-连接" tabindex="-1"><a class="header-anchor" href="#方式一-jmx-连接"><span>方式一：JMX 连接</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line"><span class="token comment"># 启动被监控的 JVM，启用 JMX</span></span>
<span class="line"><span class="token function">java</span> <span class="token parameter variable">-Dcom.sun.management.jmxremote</span><span class="token operator">=</span>true <span class="token punctuation">\\</span></span>
<span class="line">     <span class="token parameter variable">-Dcom.sun.management.jmxremote.port</span><span class="token operator">=</span><span class="token number">9010</span> <span class="token punctuation">\\</span></span>
<span class="line">     <span class="token parameter variable">-Dcom.sun.management.jmxremote.ssl</span><span class="token operator">=</span>false <span class="token punctuation">\\</span></span>
<span class="line">     <span class="token parameter variable">-Dcom.sun.management.jmxremote.authenticate</span><span class="token operator">=</span>false <span class="token punctuation">\\</span></span>
<span class="line">     <span class="token parameter variable">-jar</span> application.jar</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 或通过 jstatd 连接（无需修改应用启动参数）</span></span>
<span class="line"><span class="token function">java</span> <span class="token parameter variable">-Dcom.sun.management.jmxremote</span> <span class="token punctuation">\\</span></span>
<span class="line">     <span class="token parameter variable">-Dcom.sun.management.jmxremote.port</span><span class="token operator">=</span><span class="token number">9010</span> <span class="token punctuation">\\</span></span>
<span class="line">     <span class="token parameter variable">-Dcom.sun.management.jmxremote.ssl</span><span class="token operator">=</span>false <span class="token punctuation">\\</span></span>
<span class="line">     <span class="token parameter variable">-Dcom.sun.management.jmxremote.authenticate</span><span class="token operator">=</span>false <span class="token punctuation">\\</span></span>
<span class="line">     <span class="token parameter variable">-cp</span> <span class="token variable">$JAVA_HOME</span>/lib/tools.jar <span class="token punctuation">\\</span></span>
<span class="line">     sun.tools.jstatd.Jstatd <span class="token parameter variable">-p</span> <span class="token number">9010</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="方式二-ssh-隧道连接" tabindex="-1"><a class="header-anchor" href="#方式二-ssh-隧道连接"><span>方式二：SSH 隧道连接</span></a></h4><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line"><span class="token comment"># 创建 SSH 隧道</span></span>
<span class="line"><span class="token function">ssh</span> <span class="token parameter variable">-L</span> <span class="token number">9010</span>:localhost:9010 user@remote-server</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 在 VisualVM 中连接</span></span>
<span class="line"><span class="token comment"># File → Add Remote Host</span></span>
<span class="line"><span class="token comment"># Host: localhost</span></span>
<span class="line"><span class="token comment"># Port: 9010</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="核心功能详解" tabindex="-1"><a class="header-anchor" href="#核心功能详解"><span>核心功能详解</span></a></h2><h3 id="进程监控概览" tabindex="-1"><a class="header-anchor" href="#进程监控概览"><span>进程监控概览</span></a></h3><h4 id="overview-面板功能" tabindex="-1"><a class="header-anchor" href="#overview-面板功能"><span>Overview 面板功能</span></a></h4><p>当连接到 JVM 进程后，Overview 面板提供了全方位的监控视图：</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code><span class="line">Overview 面板信息架构：</span>
<span class="line"></span>
<span class="line">┌──────────────────────────────────────────────────────────────┐</span>
<span class="line">│  Application: MyApplication (pid: 12345)                     │</span>
<span class="line">├──────────────────────────────────────────────────────────────┤</span>
<span class="line">│                                                              │</span>
<span class="line">│  ┌─ JVM Information ──────────────────────────────────────┐  │</span>
<span class="line">│  │  JVM: OpenJDK 17.0.2                                  │  │</span>
<span class="line">│  │  Java: 17.0.2                                         │  │</span>
<span class="line">│  │  JVM Args: -Xmx2g -XX:+UseG1GC ...                    │  │</span>
<span class="line">│  │  Main Class: com.example.Main                         │  │</span>
<span class="line">│  │  Java Home: /opt/jdk-17                               │  │</span>
<span class="line">│  │  JVM Flags: -XX:+PrintGC -XX:+UseG1GC                 │  │</span>
<span class="line">│  └────────────────────────────────────────────────────────┘  │</span>
<span class="line">│                                                              │</span>
<span class="line">│  ┌─ System Properties ─────────────────────────────────────┐ │</span>
<span class="line">│  │  java.version: 17.0.2                                │  │</span>
<span class="line">│  │  java.vendor: Oracle Corporation                      │  │</span>
<span class="line">│  │  os.name: Linux                                       │  │</span>
<span class="line">│  │  user.name: developer                                 │  │</span>
<span class="line">│  │  file.encoding: UTF-8                                 │  │</span>
<span class="line">│  └────────────────────────────────────────────────────────┘  │</span>
<span class="line">│                                                              │</span>
<span class="line">│  ┌─ Monitor 面板 ──────────────────────────────────────────┐ │</span>
<span class="line">│  │                                                              │</span>
<span class="line">│  │    CPU 使用率图表        堆内存使用图表                   │</span>
<span class="line">│  │    ┌──────────────┐     ┌──────────────┐                │</span>
<span class="line">│  │    │  ▂▃▅▆▇▆▅▃▂  │     │  ▂▃▅▆▇▆▅▃▂  │                │</span>
<span class="line">│  │    └──────────────┘     └──────────────┘                │</span>
<span class="line">│  │                                                              │</span>
<span class="line">│  │    类数量图表              线程数图表                      │</span>
<span class="line">│  │    ┌──────────────┐     ┌──────────────┐                │</span>
<span class="line">│  │    │  ▂▃▅▆▇▆▅▃▂  │     │  ▂▃▅▆▇▆▅▃▂  │                │</span>
<span class="line">│  │    └──────────────┘     └──────────────┘                │</span>
<span class="line">│  │                                                              │</span>
<span class="line">│  │  CPU: 45%    堆: 1.2GB/2GB    类: 15,230    线程: 128     │</span>
<span class="line">│  └────────────────────────────────────────────────────────┘  │</span>
<span class="line">│                                                              │</span>
<span class="line">└──────────────────────────────────────────────────────────────┘</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="monitor-面板实时监控" tabindex="-1"><a class="header-anchor" href="#monitor-面板实时监控"><span>Monitor 面板实时监控</span></a></h4><p>Monitor 面板提供四类关键指标的实时图表：</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code><span class="line">监控指标详解：</span>
<span class="line"></span>
<span class="line">1. CPU 使用率</span>
<span class="line">   ├── 反映 JVM 整体 CPU 消耗</span>
<span class="line">   ├── 高 CPU 可能原因:</span>
<span class="line">   │   ├── CPU 密集型计算</span>
<span class="line">   │   ├── 频繁的 GC 活动</span>
<span class="line">   │   └── 死循环或无限递归</span>
<span class="line">   └── 告警阈值: &gt; 80% 持续 5 分钟</span>
<span class="line"></span>
<span class="line">2. 堆内存使用</span>
<span class="line">   ├── Eden Space: 新生代</span>
<span class="line">   ├── Survivor: 存活区</span>
<span class="line">   ├── Old Gen: 老年代</span>
<span class="line">   ├── Metaspace: 元空间</span>
<span class="line">   └── 关注点: 内存增长趋势、GC 频率</span>
<span class="line"></span>
<span class="line">3. 类加载统计</span>
<span class="line">   ├── Loaded Classes: 已加载类数</span>
<span class="line">   ├── Total Classes: 总类数</span>
<span class="line">   ├── Unloaded Classes: 已卸载类数</span>
<span class="line">   └── 关注点: 类泄漏（持续增长）</span>
<span class="line"></span>
<span class="line">4. 线程统计</span>
<span class="line">   ├── Live Threads: 活跃线程数</span>
<span class="line">   ├── Daemon Threads: 守护线程数</span>
<span class="line">   ├── Peak: 峰值线程数</span>
<span class="line">   └── 关注点: 线程泄漏（持续增长）</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="线程分析" tabindex="-1"><a class="header-anchor" href="#线程分析"><span>线程分析</span></a></h3><h4 id="threads-面板功能" tabindex="-1"><a class="header-anchor" href="#threads-面板功能"><span>Threads 面板功能</span></a></h4><p>线程分析是 VisualVM 的核心功能之一：</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code><span class="line">线程分析视图：</span>
<span class="line"></span>
<span class="line">┌─────────────────────────────────────────────────────────────────┐</span>
<span class="line">│  Threads Overview                                               │</span>
<span class="line">├─────────────────────────────────────────────────────────────────┤</span>
<span class="line">│                                                                 │</span>
<span class="line">│  ┌─ 线程概览 ─────────────────────────────────────────────────┐ │</span>
<span class="line">│  │                                                                 │</span>
<span class="line">│  │   状态分布:                                                  │ │</span>
<span class="line">│  │   ┌─────────────────────────────────────────────────────┐   │ │</span>
<span class="line">│  │   │  RUNNABLE    ████████████████████  89 (69.5%)      │   │ │</span>
<span class="line">│  │   │  TIMED_WAIT  ████████              25 (19.5%)      │   │ │</span>
<span class="line">│  │   │  WAITING     ██                    8 (6.3%)        │   │ │</span>
<span class="line">│  │   │  BLOCKED     █                     4 (3.1%)        │   │ │</span>
<span class="line">│  │   │  NEW/TERM    ▏                     2 (1.6%)        │   │ │</span>
<span class="line">│  │   └─────────────────────────────────────────────────────┘   │ │</span>
<span class="line">│  │                                                                 │</span>
<span class="line">│  └─────────────────────────────────────────────────────────────┘ │</span>
<span class="line">│                                                                 │</span>
<span class="line">│  ┌─ 线程列表 ─────────────────────────────────────────────────┐ │</span>
<span class="line">│  │  [Name]              [State]      [CPU %]  [Waited(s)]       │ │</span>
<span class="line">│  │  ───────────────────────────────────────────────────────    │ │</span>
<span class="line">│  │  http-nio-8080-exec-1  RUNNABLE    12.5     0               │ │</span>
<span class="line">│  │  http-nio-8080-exec-2  TIMED_WAIT  0.0      1,245           │ │</span>
<span class="line">│  │  pool-1-thread-3      BLOCKED      0.0     3,567           │ │</span>
<span class="line">│  │  GC task thread       RUNNABLE     5.2     0               │ │</span>
<span class="line">│  │  ...                                                         │ │</span>
<span class="line">│  └─────────────────────────────────────────────────────────────┘ │</span>
<span class="line">│                                                                 │</span>
<span class="line">└─────────────────────────────────────────────────────────────────┘</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="死锁检测" tabindex="-1"><a class="header-anchor" href="#死锁检测"><span>死锁检测</span></a></h4><p>VisualVM 自动检测线程死锁：</p><div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre><code><span class="line"><span class="token comment">// 死锁示例代码</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">DeadlockDemo</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token keyword">final</span> <span class="token class-name">Object</span> lock1 <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Object</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token keyword">final</span> <span class="token class-name">Object</span> lock2 <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Object</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    </span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">new</span> <span class="token class-name">Thread</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">-&gt;</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token keyword">synchronized</span> <span class="token punctuation">(</span>lock1<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">                <span class="token keyword">try</span> <span class="token punctuation">{</span> <span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">sleep</span><span class="token punctuation">(</span><span class="token number">100</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">InterruptedException</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span></span>
<span class="line">                <span class="token keyword">synchronized</span> <span class="token punctuation">(</span>lock2<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">                    <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;Thread 1 acquired both locks&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">                <span class="token punctuation">}</span></span>
<span class="line">            <span class="token punctuation">}</span></span>
<span class="line">        <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token string">&quot;Deadlock-Thread-1&quot;</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">start</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        </span>
<span class="line">        <span class="token keyword">new</span> <span class="token class-name">Thread</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">-&gt;</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token keyword">synchronized</span> <span class="token punctuation">(</span>lock2<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">                <span class="token keyword">try</span> <span class="token punctuation">{</span> <span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">sleep</span><span class="token punctuation">(</span><span class="token number">100</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">InterruptedException</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span></span>
<span class="line">                <span class="token keyword">synchronized</span> <span class="token punctuation">(</span>lock1<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">                    <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;Thread 2 acquired both locks&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">                <span class="token punctuation">}</span></span>
<span class="line">            <span class="token punctuation">}</span></span>
<span class="line">        <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token string">&quot;Deadlock-Thread-2&quot;</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">start</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code><span class="line">死锁检测结果：</span>
<span class="line"></span>
<span class="line">┌─────────────────────────────────────────────────────────────────┐</span>
<span class="line">│  ⚠ Deadlock Detected!                                          │</span>
<span class="line">├─────────────────────────────────────────────────────────────────┤</span>
<span class="line">│                                                                 │</span>
<span class="line">│  Deadlock 1:                                                    │</span>
<span class="line">│  ────────────────────────────────────────────────────────────  │</span>
<span class="line">│  Thread: Deadlock-Thread-2                                      │</span>
<span class="line">│  State: BLOCKED                                                 │</span>
<span class="line">│  Lock: java.lang.Object@7a8c8e7a (lock2)                       │</span>
<span class="line">│  Waiting for: java.lang.Object@3f3c7680 (lock1)                │</span>
<span class="line">│                                                                 │</span>
<span class="line">│  Stack Trace:                                                   │</span>
<span class="line">│    at DeadlockDemo.lambda$main$1(DeadlockDemo.java:21)         │</span>
<span class="line">│    - waiting on &lt;0x3f3c7680&gt; (a java.lang.Object)              │</span>
<span class="line">│    at DeadlockDemo.lambda$main$0(DeadlockDemo.java:11)         │</span>
<span class="line">│    - locked &lt;0x7a8c8e7a&gt; (a java.lang.Object)                  │</span>
<span class="line">│                                                                 │</span>
<span class="line">│  ────────────────────────────────────────────────────────────  │</span>
<span class="line">│  Thread: Deadlock-Thread-1                                      │</span>
<span class="line">│  State: BLOCKED                                                 │</span>
<span class="line">│  Lock: java.lang.Object@3f3c7680 (lock1)                       │</span>
<span class="line">│  Waiting for: java.lang.Object@7a8c8e7a (lock2)                │</span>
<span class="line">│                                                                 │</span>
<span class="line">│  Stack Trace:                                                   │</span>
<span class="line">│    at DeadlockDemo.lambda$main$0(DeadlockDemo.java:21)         │</span>
<span class="line">│    - waiting on &lt;0x7a8c8e7a&gt; (a java.lang.Object)              │</span>
<span class="line">│    at DeadlockDemo.lambda$main$1(DeadlockDemo.java:11)         │</span>
<span class="line">│    - locked &lt;0x3f3c7680&gt; (a java.lang.Object)                  │</span>
<span class="line">│                                                                 │</span>
<span class="line">└─────────────────────────────────────────────────────────────────┘</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="线程堆栈查看" tabindex="-1"><a class="header-anchor" href="#线程堆栈查看"><span>线程堆栈查看</span></a></h4><p>点击任意线程可以查看其详细堆栈：</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code><span class="line">线程堆栈分析：</span>
<span class="line"></span>
<span class="line">Thread: http-nio-8080-exec-1</span>
<span class="line">State: RUNNABLE</span>
<span class="line">CPU Time: 1,234ms</span>
<span class="line"></span>
<span class="line">Call Stack:</span>
<span class="line">┌─────────────────────────────────────────────────────────────────┐</span>
<span class="line">│  java.lang.Thread.getStackTrace(Thread.java:1666)              │</span>
<span class="line">│  com.example.controller.UserController.getUser(UserController)  │  ← 业务代码</span>
<span class="line">│  ├─ com.example.service.UserService.getById(UserService.java:45)│     │</span>
<span class="line">│  ├─ com.example.repository.UserRepository.findById(...)         │     │</span>
<span class="line">│  ├─ org.mybatis.spring.SqlSessionTemplate.selectOne(...)        │     │</span>
<span class="line">│  ├─ com.mysql.cj.jdbc.ClientPreparedStatement.executeQuery()   │  ← 数据库</span>
<span class="line">│  └─ java.net.SocketInputStream.socketRead0(...)                 │     │</span>
<span class="line">└─────────────────────────────────────────────────────────────────┘</span>
<span class="line"></span>
<span class="line">Wait Info:</span>
<span class="line">  - Waited count: 5 times</span>
<span class="line">  - Waited time: 1,234ms average</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="堆内存分析" tabindex="-1"><a class="header-anchor" href="#堆内存分析"><span>堆内存分析</span></a></h3><h4 id="堆转储分析" tabindex="-1"><a class="header-anchor" href="#堆转储分析"><span>堆转储分析</span></a></h4><p>堆转储是排查内存问题的重要手段：</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line"><span class="token comment"># 使用 jcmd 创建堆转储</span></span>
<span class="line">jcmd <span class="token operator">&lt;</span>PID<span class="token operator">&gt;</span> GC.heap_dump /path/to/heapdump.hprof</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 使用 jmap 创建堆转储</span></span>
<span class="line">jmap <span class="token parameter variable">-dump:format</span><span class="token operator">=</span>b,file<span class="token operator">=</span>/path/to/heapdump.hprof <span class="token operator">&lt;</span>PID<span class="token operator">&gt;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 在 VisualVM 中手动触发</span></span>
<span class="line"><span class="token comment"># Applications → 右键进程 → Heap Dump</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="堆分析视图" tabindex="-1"><a class="header-anchor" href="#堆分析视图"><span>堆分析视图</span></a></h4><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code><span class="line">堆转储分析界面：</span>
<span class="line"></span>
<span class="line">┌─────────────────────────────────────────────────────────────────────┐</span>
<span class="line">│  Heap Dump: heapdump.hprof (Size: 256MB)                           │</span>
<span class="line">├─────────────────────────────────────────────────────────────────────┤</span>
<span class="line">│                                                                       │</span>
<span class="line">│  ┌─ 类直方图 ──────────────────────────────────────────────────────┐ │</span>
<span class="line">│  │  Classes: 15,230    Objects: 1,234,567    Size: 256MB           │ │</span>
<span class="line">│  │  ───────────────────────────────────────────────────────────    │ │</span>
<span class="line">│  │  [Class Name]                       [Count]    [Size]   [Shallow]│ │</span>
<span class="line">│  │  ───────────────────────────────────────────────────────────    │ │</span>
<span class="line">│  │  java.lang.String                 125,430   45.2MB   24B        │ │</span>
<span class="line">│  │  java.util.HashMap$Node           89,234    28.1MB   32B        │ │</span>
<span class="line">│  │  com.example.entity.User          45,678    15.8MB   48B        │ │</span>
<span class="line">│  │  java.lang.Object                 34,567    10.2MB   16B        │ │</span>
<span class="line">│  │  char[]                           28,345    9.8MB    24B        │ │</span>
<span class="line">│  │  ...                                                      ...  │ │</span>
<span class="line">│  └───────────────────────────────────────────────────────────────┘ │</span>
<span class="line">│                                                                       │</span>
<span class="line">│  ┌─ 最大对象 ──────────────────────────────────────────────────────┐ │</span>
<span class="line">│  │  [Instance]                              [Size]   [Class]         │ │</span>
<span class="line">│  │  ───────────────────────────────────────────────────────────    │ │</span>
<span class="line">│  │  0x7a8c8e7a (com.example.cache)         50MB     HashMap        │ │</span>
<span class="line">│  │  0x3f3c7680 (org.apache.commons.pool)   35MB     PooledObj      │ │</span>
<span class="line">│  │  0x1234abcd (java.lang.StringBuilder)   25MB     StringBuilder   │ │</span>
<span class="line">│  └───────────────────────────────────────────────────────────────┘ │</span>
<span class="line">│                                                                       │</span>
<span class="line">└─────────────────────────────────────────────────────────────────────┘</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="内存泄漏分析流程" tabindex="-1"><a class="header-anchor" href="#内存泄漏分析流程"><span>内存泄漏分析流程</span></a></h4><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code><span class="line">内存泄漏排查流程：</span>
<span class="line"></span>
<span class="line">Step 1: 创建基准堆转储</span>
<span class="line">    │</span>
<span class="line">    ▼</span>
<span class="line">Step 2: 运行应用一段时间（模拟生产负载）</span>
<span class="line">    │</span>
<span class="line">    ▼</span>
<span class="line">Step 3: 创建第二个堆转储</span>
<span class="line">    │</span>
<span class="line">    ▼</span>
<span class="line">Step 4: 比较两个堆转储的对象差异</span>
<span class="line">    │</span>
<span class="line">    ┌────────────────────────────────────────┐</span>
<span class="line">    │                                        │</span>
<span class="line">    ▼                                        ▼</span>
<span class="line">  正常增长                                   异常增长</span>
<span class="line">  ↓                                          ↓</span>
<span class="line">  业务正常扩展                          →  内存泄漏</span>
<span class="line">                                                   │</span>
<span class="line">                                                   ▼</span>
<span class="line">                                          Step 5: 分析泄漏对象</span>
<span class="line">                                                   │</span>
<span class="line">                                                   ▼</span>
<span class="line">                                          Step 6: 追踪引用链</span>
<span class="line">                                          找到 GC Root</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="oql-查询语言" tabindex="-1"><a class="header-anchor" href="#oql-查询语言"><span>OQL 查询语言</span></a></h4><p>VisualVM 支持 OQL（Object Query Language）进行复杂查询：</p><div class="language-sql line-numbers-mode" data-highlighter="prismjs" data-ext="sql"><pre><code><span class="line"><span class="token comment">-- 查找所有 String 对象中包含特定内容的</span></span>
<span class="line"><span class="token keyword">SELECT</span> s <span class="token keyword">FROM</span> java<span class="token punctuation">.</span>lang<span class="token punctuation">.</span>String s <span class="token keyword">WHERE</span> s<span class="token punctuation">.</span>toString<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token keyword">contains</span><span class="token punctuation">(</span><span class="token string">&quot;test&quot;</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">-- 查找大对象（&gt; 1MB）</span></span>
<span class="line"><span class="token keyword">SELECT</span> x <span class="token keyword">FROM</span> java<span class="token punctuation">.</span>lang<span class="token punctuation">.</span>Object x <span class="token keyword">WHERE</span> x<span class="token punctuation">.</span><span class="token variable">@size</span> <span class="token operator">&gt;</span> <span class="token number">1048576</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">-- 查找特定类的所有实例</span></span>
<span class="line"><span class="token keyword">SELECT</span> i <span class="token keyword">FROM</span> com<span class="token punctuation">.</span>example<span class="token punctuation">.</span>entity<span class="token punctuation">.</span><span class="token keyword">User</span> i</span>
<span class="line"></span>
<span class="line"><span class="token comment">-- 查找被缓存但长时间未使用的对象</span></span>
<span class="line"><span class="token keyword">SELECT</span> x <span class="token keyword">FROM</span> java<span class="token punctuation">.</span>lang<span class="token punctuation">.</span>Object x </span>
<span class="line"><span class="token keyword">WHERE</span> classof<span class="token punctuation">(</span>x<span class="token punctuation">)</span><span class="token punctuation">.</span>name <span class="token operator">=</span><span class="token operator">=</span> <span class="token string">&quot;com.example.cache.CachedItem&quot;</span></span>
<span class="line"><span class="token operator">AND</span> x<span class="token punctuation">.</span><span class="token variable">@age</span> <span class="token operator">&gt;</span> <span class="token number">86400</span>  <span class="token comment">-- 超过24小时</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">-- 查找线程池中的任务对象</span></span>
<span class="line"><span class="token keyword">SELECT</span> t <span class="token keyword">FROM</span> java<span class="token punctuation">.</span>util<span class="token punctuation">.</span>concurrent<span class="token punctuation">.</span>FutureTask t </span>
<span class="line"><span class="token keyword">WHERE</span> t<span class="token punctuation">.</span><span class="token variable">@cancelled</span> <span class="token operator">=</span><span class="token operator">=</span> <span class="token boolean">false</span> <span class="token operator">AND</span> t<span class="token punctuation">.</span><span class="token variable">@done</span> <span class="token operator">=</span><span class="token operator">=</span> <span class="token boolean">false</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="cpu-性能剖析" tabindex="-1"><a class="header-anchor" href="#cpu-性能剖析"><span>CPU 性能剖析</span></a></h3><h4 id="cpu-sampler" tabindex="-1"><a class="header-anchor" href="#cpu-sampler"><span>CPU Sampler</span></a></h4><p>CPU 采样器提供低开销的 CPU 分析：</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code><span class="line">CPU 采样配置：</span>
<span class="line"></span>
<span class="line">采样选项:</span>
<span class="line">├── 采样间隔: 10ms (推荐 5-20ms)</span>
<span class="line">├── 采样时间: 60s (根据需要调整)</span>
<span class="line">└── 线程过滤: 所有线程 / 选定线程</span>
<span class="line"></span>
<span class="line">采样结果:</span>
<span class="line"></span>
<span class="line">┌─────────────────────────────────────────────────────────────────┐</span>
<span class="line">│  CPU Sampler Results (Duration: 60s)                           │</span>
<span class="line">├─────────────────────────────────────────────────────────────────┤</span>
<span class="line">│                                                                 │</span>
<span class="line">│  Hot Spots (自顶向下):                                          │</span>
<span class="line">│  ────────────────────────────────────────────────────────────  │</span>
<span class="line">│  [Method]                          [Samples]   [%Time]          │</span>
<span class="line">│  ────────────────────────────────────────────────────────────  │</span>
<span class="line">│  com.example.service.UserService        1,234   25.3%          │</span>
<span class="line">│  ├─ findById()                          456    9.3%            │</span>
<span class="line">│  ├─ queryFromCache()                    345    7.1%            │</span>
<span class="line">│  └─ loadFromDatabase()                  233    4.8%            │</span>
<span class="line">│                                                                 │</span>
<span class="line">│  com.example.controller.UserController   890    18.2%          │</span>
<span class="line">│  ├─ getUser()                            567   11.6%           │</span>
<span class="line">│  └─ updateUser()                         323    6.6%            │</span>
<span class="line">│                                                                 │</span>
<span class="line">│  java.util.HashMap.get()                 678    13.9%          │</span>
<span class="line">│  org.mybatis.spring.SqlSessionTemplate   456    9.3%           │</span>
<span class="line">│  java.lang.String.charAt()               234    4.8%           │</span>
<span class="line">│  ...                                                            │</span>
<span class="line">│                                                                 │</span>
<span class="line">│  总采样数: 4,876 样本                                          │</span>
<span class="line">│  平均采样间隔: 12.3ms                                          │</span>
<span class="line">│                                                                 │</span>
<span class="line">└─────────────────────────────────────────────────────────────────┘</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="profiler-模式" tabindex="-1"><a class="header-anchor" href="#profiler-模式"><span>Profiler 模式</span></a></h4><p>Profiler 提供更精确的调用链追踪：</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code><span class="line">Profiler 配置：</span>
<span class="line"></span>
<span class="line">分析类型:</span>
<span class="line">├── CPU Profiler (方法执行时间)</span>
<span class="line">│   ├── 模式: 采样 / 插桩</span>
<span class="line">│   └── 深度: 最多 20 层调用</span>
<span class="line">│</span>
<span class="line">└── Memory Profiler (内存分配)</span>
<span class="line">    ├── 采样: 每 N 次分配采样一次</span>
<span class="line">    └── 阈值: 只追踪 &gt; 1KB 的分配</span>
<span class="line"></span>
<span class="line">CPU Profiler 结果（调用树视图）:</span>
<span class="line"></span>
<span class="line">com.example.Application.main()</span>
<span class="line">└─ com.example.boot.SpringApplication.run()</span>
<span class="line">   └─ org.springframework.boot.SpringApplication.refreshContext()</span>
<span class="line">      └─ org.springframework.context.support.AbstractApplicationContext.refresh()</span>
<span class="line">         └─ com.example.config.AppConfig Bean 初始化</span>
<span class="line">            └─ com.example.service.UserService.&lt;init&gt;()</span>
<span class="line">               └─ com.example.repository.UserRepository 初始化</span>
<span class="line">                  └─ org.mybatis.spring.SqlSessionFactoryBean.buildSessionFactory()</span>
<span class="line">                     └─ org.apache.ibatis.session.Configuration.&lt;init&gt;()</span>
<span class="line">                        └─ com.example.mapper.UserMapper XML 解析</span>
<span class="line">                           └─ org.apache.ibatis.parsing.XPathParser.evalNode()</span>
<span class="line">                              └─ com.example.service.UserService.findById()  ← 热点方法</span>
<span class="line">                                 ├─ userRepository.findById()</span>
<span class="line">                                 │  └─ sqlSession.selectOne()</span>
<span class="line">                                 │     └─ PreparedStatement.executeQuery()</span>
<span class="line">                                 │        └─ MysqlPreparedStatement.executeInternal()</span>
<span class="line">                                 │           └─ ResultSetImpl.next()</span>
<span class="line">                                 │              └─ ResultSetImpl.getString()</span>
<span class="line">                                 └─ cache.get(key)</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="插件功能扩展" tabindex="-1"><a class="header-anchor" href="#插件功能扩展"><span>插件功能扩展</span></a></h3><h4 id="visualgc-插件" tabindex="-1"><a class="header-anchor" href="#visualgc-插件"><span>VisualGC 插件</span></a></h4><p>VisualGC 提供详细的 GC 监控视图：</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code><span class="line">VisualGC 监控面板：</span>
<span class="line"></span>
<span class="line">┌─────────────────────────────────────────────────────────────────┐</span>
<span class="line">│  VisualGC - Application (pid: 12345)                           │</span>
<span class="line">├─────────────────────────────────────────────────────────────────┤</span>
<span class="line">│                                                                 │</span>
<span class="line">│  ┌─ 堆内存概览 ───────────────────────────────────────────────┐ │</span>
<span class="line">│  │                                                              │</span>
<span class="line">│  │    Metaspace      ┌─────────┐      Old Gen                 │ │</span>
<span class="line">│  │    ┌──────┐       │████████│      ┌─────────────┐          │ │</span>
<span class="line">│  │    │██████│ 45MB  │████████│ 890MB│████████████│ 1.2GB     │ │</span>
<span class="line">│  │    └──────┘       │████████│      │████████████│           │ │</span>
<span class="line">│  │    Used: 32MB     │████████│  45% │████████████│  54%      │ │</span>
<span class="line">│  │    Max:  -        │████████│      │████████████│           │ │</span>
<span class="line">│  │                   └─────────┘      └─────────────┘          │ │</span>
<span class="line">│  │                                                              │ │</span>
<span class="line">│  │    Eden          ┌──────┐      Survivor 0/1     ┌──────┐    │ │</span>
<span class="line">│  │    ┌────────┐    │██████│      ┌──────────┐     │███   │    │ │</span>
<span class="line">│  │    │████████│120MB│██████│  50% │██████████│     │███   │ 15%│ │</span>
<span class="line">│  │    │████████│     │██████│      │██████████│     │███   │    │ │</span>
<span class="line">│  │    └────────┘     └──────┘      └──────────┘     └──────┘    │ │</span>
<span class="line">│  │                                                              │ │</span>
<span class="line">│  └─────────────────────────────────────────────────────────────┘ │</span>
<span class="line">│                                                                 │</span>
<span class="line">│  ┌─ GC 活动时间线 ────────────────────────────────────────────┐ │</span>
<span class="line">│  │                                                              │</span>
<span class="line">│  │  GC 事件:                                                    │ │</span>
<span class="line">│  │  ────────────────────────────────────────────────────────  │ │</span>
<span class="line">│  │                                                              │ │</span>
<span class="line">│  │  Young GC: 2,345 次    总耗时: 12.3s    平均: 5.2ms          │ │</span>
<span class="line">│  │  Old GC:   12 次       总耗时: 3.4s     平均: 283ms          │ │</span>
<span class="line">│  │  Full GC:  3 次        总耗时: 2.1s     平均: 700ms          │ │</span>
<span class="line">│  │                                                              │ │</span>
<span class="line">│  └─────────────────────────────────────────────────────────────┘ │</span>
<span class="line">│                                                                 │</span>
<span class="line">└─────────────────────────────────────────────────────────────────┘</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="tracer-插件" tabindex="-1"><a class="header-anchor" href="#tracer-插件"><span>Tracer 插件</span></a></h4><p>Tracer 提供方法级别的性能追踪：</p><div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre><code><span class="line"><span class="token comment">// Tracer 追踪配置示例</span></span>
<span class="line"><span class="token comment">// 在 VisualVM 中配置追踪规则</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// 追踪规则配置</span></span>
<span class="line"><span class="token class-name">Tracer</span> <span class="token class-name">Configuration</span><span class="token operator">:</span></span>
<span class="line">├── <span class="token class-name">Target</span><span class="token operator">:</span> com<span class="token punctuation">.</span>example<span class="token punctuation">.</span>service<span class="token punctuation">.</span>*</span>
<span class="line">├── <span class="token class-name">Mode</span><span class="token operator">:</span> <span class="token class-name">Time</span> <span class="token class-name">Trace</span></span>
<span class="line">├── <span class="token class-name">Threshold</span><span class="token operator">:</span> <span class="token number">100</span>ms</span>
<span class="line">└── <span class="token class-name">Stack</span> <span class="token class-name">Trace</span><span class="token operator">:</span> <span class="token class-name">Enabled</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="实战案例" tabindex="-1"><a class="header-anchor" href="#实战案例"><span>实战案例</span></a></h2><h3 id="案例一-api-响应慢排查" tabindex="-1"><a class="header-anchor" href="#案例一-api-响应慢排查"><span>案例一：API 响应慢排查</span></a></h3><h4 id="问题描述" tabindex="-1"><a class="header-anchor" href="#问题描述"><span>问题描述</span></a></h4><p>某电商系统用户反馈 API 接口响应缓慢，平均响应时间从正常的 200ms 增长到 2-3 秒。</p><h4 id="分析步骤" tabindex="-1"><a class="header-anchor" href="#分析步骤"><span>分析步骤</span></a></h4><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code><span class="line">Step 1: 连接 VisualVM 并观察监控面板</span>
<span class="line">    │</span>
<span class="line">    ├── CPU 使用率: 75% (异常偏高)</span>
<span class="line">    ├── 堆内存: 1.5GB/2GB (持续增长)</span>
<span class="line">    ├── 线程数: 200+ (持续增加)</span>
<span class="line">    └── GC 频率: 每 30 秒一次 Young GC</span>
<span class="line">    │</span>
<span class="line">    ▼</span>
<span class="line"></span>
<span class="line">Step 2: 启动 CPU Sampler 分析热点方法</span>
<span class="line">    │</span>
<span class="line">    ├── 发现 com.example.service.OrderService.calculateTotal()</span>
<span class="line">    │   占用 CPU 时间: 45%</span>
<span class="line">    │   调用次数: 10,000+ 次/分钟</span>
<span class="line">    │</span>
<span class="line">    └── 深入分析发现:</span>
<span class="line">        └─ 循环中重复调用 Collections.sort()</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="问题根因与解决方案" tabindex="-1"><a class="header-anchor" href="#问题根因与解决方案"><span>问题根因与解决方案</span></a></h4><div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre><code><span class="line"><span class="token comment">// 问题代码：重复排序</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token class-name">BigDecimal</span> <span class="token function">calculateTotal</span><span class="token punctuation">(</span><span class="token class-name">Order</span> order<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">OrderItem</span><span class="token punctuation">&gt;</span></span> items <span class="token operator">=</span> order<span class="token punctuation">.</span><span class="token function">getItems</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token class-name">OrderItem</span> item <span class="token operator">:</span> items<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token comment">// 每次循环都重新排序（效率极低）</span></span>
<span class="line">        <span class="token class-name">Collections</span><span class="token punctuation">.</span><span class="token function">sort</span><span class="token punctuation">(</span>items<span class="token punctuation">,</span> <span class="token class-name">Comparator</span><span class="token punctuation">.</span><span class="token function">comparing</span><span class="token punctuation">(</span><span class="token class-name">OrderItem</span><span class="token operator">::</span><span class="token function">getId</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token class-name">BigDecimal</span> itemTotal <span class="token operator">=</span> item<span class="token punctuation">.</span><span class="token function">getPrice</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">multiply</span><span class="token punctuation">(</span>item<span class="token punctuation">.</span><span class="token function">getQuantity</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        total <span class="token operator">=</span> total<span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span>itemTotal<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    <span class="token keyword">return</span> total<span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// 优化代码：排序移到循环外部</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token class-name">BigDecimal</span> <span class="token function">calculateTotal</span><span class="token punctuation">(</span><span class="token class-name">Order</span> order<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">OrderItem</span><span class="token punctuation">&gt;</span></span> items <span class="token operator">=</span> order<span class="token punctuation">.</span><span class="token function">getItems</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token comment">// 只排序一次</span></span>
<span class="line">    <span class="token class-name">Collections</span><span class="token punctuation">.</span><span class="token function">sort</span><span class="token punctuation">(</span>items<span class="token punctuation">,</span> <span class="token class-name">Comparator</span><span class="token punctuation">.</span><span class="token function">comparing</span><span class="token punctuation">(</span><span class="token class-name">OrderItem</span><span class="token operator">::</span><span class="token function">getId</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token class-name">BigDecimal</span> total <span class="token operator">=</span> <span class="token class-name">BigDecimal</span><span class="token punctuation">.</span><span class="token constant">ZERO</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token class-name">OrderItem</span> item <span class="token operator">:</span> items<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token class-name">BigDecimal</span> itemTotal <span class="token operator">=</span> item<span class="token punctuation">.</span><span class="token function">getPrice</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">multiply</span><span class="token punctuation">(</span>item<span class="token punctuation">.</span><span class="token function">getQuantity</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        total <span class="token operator">=</span> total<span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span>itemTotal<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    <span class="token keyword">return</span> total<span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code><span class="line">优化效果：</span>
<span class="line"></span>
<span class="line">指标              优化前      优化后      提升</span>
<span class="line">───────────────────────────────────────────</span>
<span class="line">CPU 使用率        75%        35%        ↓ 53%</span>
<span class="line">平均响应时间      2500ms     180ms      ↓ 93%</span>
<span class="line">方法执行时间      1200ms     45ms       ↓ 96%</span>
<span class="line">GC 频率          每30秒     每5分钟     ↑ 10倍</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="案例二-内存泄漏排查" tabindex="-1"><a class="header-anchor" href="#案例二-内存泄漏排查"><span>案例二：内存泄漏排查</span></a></h3><h4 id="问题描述-1" tabindex="-1"><a class="header-anchor" href="#问题描述-1"><span>问题描述</span></a></h4><p>某后台管理系统运行 3-4 天后出现 OutOfMemoryError: Java heap space 错误。</p><h4 id="分析步骤-1" tabindex="-1"><a class="header-anchor" href="#分析步骤-1"><span>分析步骤</span></a></h4><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code><span class="line">Step 1: 配置 VisualVM 远程连接，启动持续监控</span>
<span class="line">    │</span>
<span class="line">    ▼</span>
<span class="line"></span>
<span class="line">Step 2: 观察内存使用趋势（24小时后）</span>
<span class="line">    │</span>
<span class="line">    ├── Eden Space: 正常回收</span>
<span class="line">    ├── Old Gen: 持续增长，从 200MB 增长到 1.8GB</span>
<span class="line">    └── Metaspace: 稳定在 150MB</span>
<span class="line">    │</span>
<span class="line">    ▼</span>
<span class="line"></span>
<span class="line">Step 3: 创建堆转储并分析</span>
<span class="line">    │</span>
<span class="line">    ├── 类直方图显示:</span>
<span class="line">    │   └── char[] 数量持续增长到 50万+</span>
<span class="line">    │       总大小: 800MB+</span>
<span class="line">    │</span>
<span class="line">    └── OQL 查询:</span>
<span class="line">        SELECT s FROM char[] s WHERE s.length &gt; 1000</span>
<span class="line">        结果: 发现大量长字符串来自同一来源</span>
<span class="line">    │</span>
<span class="line">    ▼</span>
<span class="line"></span>
<span class="line">Step 4: 追踪字符串引用链</span>
<span class="line">    │</span>
<span class="line">    └── 发现引用链:</span>
<span class="line">        char[] → String → HashMap$Node → </span>
<span class="line">        ConcurrentHashMap (静态缓存) → </span>
<span class="line">        com.example.cache.DataCache.service</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="问题根因与解决方案-1" tabindex="-1"><a class="header-anchor" href="#问题根因与解决方案-1"><span>问题根因与解决方案</span></a></h4><div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre><code><span class="line"><span class="token comment">// 问题代码：静态缓存无限增长</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">DataCache</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token comment">// 静态 Map 永不清理</span></span>
<span class="line">    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token keyword">final</span> <span class="token class-name">Map</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">,</span> <span class="token class-name">Object</span><span class="token punctuation">&gt;</span></span> cache <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ConcurrentHashMap</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token punctuation">&gt;</span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    </span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">cacheData</span><span class="token punctuation">(</span><span class="token class-name">String</span> key<span class="token punctuation">,</span> <span class="token class-name">Object</span> data<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        cache<span class="token punctuation">.</span><span class="token function">put</span><span class="token punctuation">(</span>key<span class="token punctuation">,</span> data<span class="token punctuation">)</span><span class="token punctuation">;</span>  <span class="token comment">// 只添加，不清理</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    </span>
<span class="line">    <span class="token keyword">public</span> <span class="token class-name">Object</span> <span class="token function">getData</span><span class="token punctuation">(</span><span class="token class-name">String</span> key<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">return</span> cache<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span>key<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// 优化代码：添加缓存淘汰策略</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">DataCache</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token keyword">final</span> <span class="token class-name">Map</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">,</span> <span class="token class-name">Object</span><span class="token punctuation">&gt;</span></span> cache <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">LinkedHashMap</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">,</span> <span class="token class-name">Object</span><span class="token punctuation">&gt;</span></span><span class="token punctuation">(</span></span>
<span class="line">        <span class="token number">1000</span><span class="token punctuation">,</span> <span class="token number">0.75f</span><span class="token punctuation">,</span> <span class="token boolean">true</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token annotation punctuation">@Override</span></span>
<span class="line">        <span class="token keyword">protected</span> <span class="token keyword">boolean</span> <span class="token function">removeEldestEntry</span><span class="token punctuation">(</span><span class="token class-name">Map<span class="token punctuation">.</span>Entry</span> eldest<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token keyword">return</span> <span class="token function">size</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">&gt;</span> <span class="token constant">MAX_SIZE</span><span class="token punctuation">;</span>  <span class="token comment">// 超过最大容量时淘汰</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">;</span></span>
<span class="line">    </span>
<span class="line">    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token keyword">final</span> <span class="token keyword">int</span> <span class="token constant">MAX_SIZE</span> <span class="token operator">=</span> <span class="token number">10000</span><span class="token punctuation">;</span></span>
<span class="line">    </span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">cacheData</span><span class="token punctuation">(</span><span class="token class-name">String</span> key<span class="token punctuation">,</span> <span class="token class-name">Object</span> data<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        cache<span class="token punctuation">.</span><span class="token function">put</span><span class="token punctuation">(</span>key<span class="token punctuation">,</span> data<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    </span>
<span class="line">    <span class="token keyword">public</span> <span class="token class-name">Object</span> <span class="token function">getData</span><span class="token punctuation">(</span><span class="token class-name">String</span> key<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">return</span> cache<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span>key<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code><span class="line">优化效果：</span>
<span class="line"></span>
<span class="line">指标              优化前          优化后</span>
<span class="line">─────────────────────────────────────────</span>
<span class="line">内存增长趋势      持续增长        稳定在 200MB</span>
<span class="line">堆内存峰值        1.9GB          450MB</span>
<span class="line">OOM 发生          3-4 天         无</span>
<span class="line">Full GC 频率      每小时 2-3 次   每天 1-2 次</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="案例三-线程死锁问题" tabindex="-1"><a class="header-anchor" href="#案例三-线程死锁问题"><span>案例三：线程死锁问题</span></a></h3><h4 id="问题描述-2" tabindex="-1"><a class="header-anchor" href="#问题描述-2"><span>问题描述</span></a></h4><p>某订单处理系统在高峰期出现部分请求超时，系统无响应。</p><h4 id="分析步骤-2" tabindex="-1"><a class="header-anchor" href="#分析步骤-2"><span>分析步骤</span></a></h4><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code><span class="line">Step 1: 发现线程数异常（从正常的 50 增长到 200+）</span>
<span class="line">    │</span>
<span class="line">    ▼</span>
<span class="line"></span>
<span class="line">Step 2: 查看 Threads 面板</span>
<span class="line">    │</span>
<span class="line">    ├── 发现多个线程处于 BLOCKED 状态</span>
<span class="line">    ├── CPU 使用率异常低（线程都在等待）</span>
<span class="line">    └── 警告: Deadlock Detected!</span>
<span class="line">    │</span>
<span class="line">    ▼</span>
<span class="line"></span>
<span class="line">Step 3: 分析死锁线程堆栈</span>
<span class="line">    │</span>
<span class="line">    └── 发现两个线程相互等待:</span>
<span class="line">        Thread-pool-1-thread-45 等待 inventoryLock</span>
<span class="line">        Thread-pool-1-thread-89 等待 orderLock</span>
<span class="line">        而这两个线程分别持有对方需要的锁</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="问题根因与解决方案-2" tabindex="-1"><a class="header-anchor" href="#问题根因与解决方案-2"><span>问题根因与解决方案</span></a></h4><div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre><code><span class="line"><span class="token comment">// 问题代码：锁顺序不一致导致死锁</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">OrderService</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">private</span> <span class="token keyword">final</span> <span class="token class-name">Object</span> orderLock <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Object</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">private</span> <span class="token keyword">final</span> <span class="token class-name">Object</span> inventoryLock <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Object</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    </span>
<span class="line">    <span class="token comment">// 方法 A：先获取订单锁</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">processOrder</span><span class="token punctuation">(</span><span class="token class-name">Order</span> order<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">synchronized</span> <span class="token punctuation">(</span>orderLock<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token keyword">synchronized</span> <span class="token punctuation">(</span>inventoryLock<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">                <span class="token comment">// 处理逻辑</span></span>
<span class="line">            <span class="token punctuation">}</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    </span>
<span class="line">    <span class="token comment">// 方法 B：先获取库存锁（可能导致死锁）</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">updateInventory</span><span class="token punctuation">(</span><span class="token class-name">Order</span> order<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">synchronized</span> <span class="token punctuation">(</span>inventoryLock<span class="token punctuation">)</span> <span class="token punctuation">{</span>  <span class="token comment">// 与方法 A 锁顺序相反</span></span>
<span class="line">            <span class="token keyword">synchronized</span> <span class="token punctuation">(</span>orderLock<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">                <span class="token comment">// 处理逻辑</span></span>
<span class="line">            <span class="token punctuation">}</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// 优化方案 1：统一锁顺序</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">updateInventory</span><span class="token punctuation">(</span><span class="token class-name">Order</span> order<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">synchronized</span> <span class="token punctuation">(</span>orderLock<span class="token punctuation">)</span> <span class="token punctuation">{</span>  <span class="token comment">// 统一为先获取 orderLock</span></span>
<span class="line">        <span class="token keyword">synchronized</span> <span class="token punctuation">(</span>inventoryLock<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token comment">// 处理逻辑</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// 优化方案 2：使用显式锁并设置超时</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">updateInventory</span><span class="token punctuation">(</span><span class="token class-name">Order</span> order<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">try</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">if</span> <span class="token punctuation">(</span>orderLock<span class="token punctuation">.</span><span class="token function">tryLock</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token class-name">TimeUnit</span><span class="token punctuation">.</span><span class="token constant">SECONDS</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token keyword">try</span> <span class="token punctuation">{</span></span>
<span class="line">                <span class="token keyword">if</span> <span class="token punctuation">(</span>inventoryLock<span class="token punctuation">.</span><span class="token function">tryLock</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token class-name">TimeUnit</span><span class="token punctuation">.</span><span class="token constant">SECONDS</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">                    <span class="token keyword">try</span> <span class="token punctuation">{</span></span>
<span class="line">                        <span class="token comment">// 处理逻辑</span></span>
<span class="line">                    <span class="token punctuation">}</span> <span class="token keyword">finally</span> <span class="token punctuation">{</span></span>
<span class="line">                        inventoryLock<span class="token punctuation">.</span><span class="token function">unlock</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">                    <span class="token punctuation">}</span></span>
<span class="line">                <span class="token punctuation">}</span></span>
<span class="line">            <span class="token punctuation">}</span> <span class="token keyword">finally</span> <span class="token punctuation">{</span></span>
<span class="line">                orderLock<span class="token punctuation">.</span><span class="token function">unlock</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token punctuation">}</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">InterruptedException</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token comment">// 处理中断</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code><span class="line">优化效果：</span>
<span class="line"></span>
<span class="line">指标              优化前          优化后</span>
<span class="line">─────────────────────────────────────────</span>
<span class="line">死锁发生          高峰期必现      无</span>
<span class="line">请求超时率        15%            &lt; 0.1%</span>
<span class="line">线程最大数        200+           80</span>
<span class="line">系统稳定性        频繁无响应      运行正常</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="案例四-gc-调优分析" tabindex="-1"><a class="header-anchor" href="#案例四-gc-调优分析"><span>案例四：GC 调优分析</span></a></h3><h4 id="问题描述-3" tabindex="-1"><a class="header-anchor" href="#问题描述-3"><span>问题描述</span></a></h4><p>某实时数据处理系统 GC 暂停时间过长，影响数据实时性。</p><h4 id="分析步骤-3" tabindex="-1"><a class="header-anchor" href="#分析步骤-3"><span>分析步骤</span></a></h4><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code><span class="line">Step 1: 启用 VisualGC 插件观察 GC 行为</span>
<span class="line">    │</span>
<span class="line">    ├── Young GC: 频繁（每 2 秒一次），平均耗时 50ms</span>
<span class="line">    ├── Old GC: 偶尔发生，平均耗时 500ms</span>
<span class="line">    ├── Full GC: 很少发生，但单次耗时 2-3 秒</span>
<span class="line">    └── 内存分配率: 150MB/秒</span>
<span class="line">    │</span>
<span class="line">    ▼</span>
<span class="line"></span>
<span class="line">Step 2: 分析 GC 日志</span>
<span class="line">    │</span>
<span class="line">    └── 发现问题:</span>
<span class="line">        • 新生代空间不足（Eden 只有 100MB）</span>
<span class="line">        • 老年代增长过快（每次晋升对象过多）</span>
<span class="line">        • 对象年龄分布集中在 1-2 岁</span>
<span class="line">    │</span>
<span class="line">    ▼</span>
<span class="line"></span>
<span class="line">Step 3: 优化建议</span>
<span class="line">    │</span>
<span class="line">    └── 调整 JVM 参数:</span>
<span class="line">        • 增大新生代: -XX:NewRatio=2</span>
<span class="line">        • 调整 Survivor: -XX:SurvivorRatio=8</span>
<span class="line">        • 晋升阈值: -XX:MaxTenuringThreshold=15</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code><span class="line">GC 调优效果对比：</span>
<span class="line"></span>
<span class="line">指标              调优前          调优后</span>
<span class="line">─────────────────────────────────────────</span>
<span class="line">Young GC 频率     每 2 秒        每 8 秒</span>
<span class="line">Young GC 耗时     50ms           15ms</span>
<span class="line">Old GC 频率       每天 10 次     每天 2 次</span>
<span class="line">Full GC 频率      每周 2 次      每月 1 次</span>
<span class="line">最大暂停时间      3000ms         200ms</span>
<span class="line">吞吐量            85%            98%</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="最佳实践" tabindex="-1"><a class="header-anchor" href="#最佳实践"><span>最佳实践</span></a></h2><h3 id="开发环境配置" tabindex="-1"><a class="header-anchor" href="#开发环境配置"><span>开发环境配置</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line"><span class="token comment"># VisualVM 启动配置</span></span>
<span class="line"><span class="token comment"># 位置: visualvm.conf</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 增加内存</span></span>
<span class="line"><span class="token assign-left variable">visualvm_default_options</span><span class="token operator">=</span><span class="token string">&quot;-J-Xmx2048m -J-Xms1024m&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 加快启动</span></span>
<span class="line"><span class="token assign-left variable">visualvm_default_options</span><span class="token operator">=</span><span class="token string">&quot;<span class="token variable">$visualvm_default_options</span> -J-XX:+UseG1GC&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 启用更多监控</span></span>
<span class="line"><span class="token assign-left variable">visualvm_default_options</span><span class="token operator">=</span><span class="token string">&quot;<span class="token variable">$visualvm_default_options</span> -Dcom.sun.management.jmxremote&quot;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="生产环境监控策略" tabindex="-1"><a class="header-anchor" href="#生产环境监控策略"><span>生产环境监控策略</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code><span class="line">生产环境 VisualVM 使用建议：</span>
<span class="line"></span>
<span class="line">1. 安全考虑</span>
<span class="line">   ├── 不直接在生产环境运行 VisualVM GUI</span>
<span class="line">   ├── 通过 JMX 远程连接</span>
<span class="line">   └── 使用只读模式</span>
<span class="line"></span>
<span class="line">2. 监控频率</span>
<span class="line">   ├── 持续监控：使用低开销的 Monitor 面板</span>
<span class="line">   ├── 按需采样：问题发生时启动 Sampler</span>
<span class="line">   └── 定期转储：每日自动堆转储（低峰期）</span>
<span class="line"></span>
<span class="line">3. 告警配置</span>
<span class="line">   ├── CPU &gt; 80% 持续 5 分钟</span>
<span class="line">   ├── 堆内存 &gt; 85%</span>
<span class="line">   ├── 线程数 &gt; 1000</span>
<span class="line">   └── 死锁检测告警</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="与其他工具配合使用" tabindex="-1"><a class="header-anchor" href="#与其他工具配合使用"><span>与其他工具配合使用</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code><span class="line">工具协同工作流：</span>
<span class="line"></span>
<span class="line">┌─────────────┐      ┌─────────────┐      ┌─────────────┐</span>
<span class="line">│   VisualVM  │      │    JFR      │      │ Async Prof. │</span>
<span class="line">│  (快速诊断)  │      │ (持续监控)  │      │ (深度分析)  │</span>
<span class="line">└──────┬──────┘      └──────┬──────┘      └──────┬──────┘</span>
<span class="line">       │                    │                    │</span>
<span class="line">       └────────────────────┼────────────────────┘</span>
<span class="line">                            │</span>
<span class="line">                            ▼</span>
<span class="line">                   ┌─────────────────┐</span>
<span class="line">                   │   问题定位      │</span>
<span class="line">                   └────────┬────────┘</span>
<span class="line">                            │</span>
<span class="line">            ┌───────────────┼───────────────┐</span>
<span class="line">            │               │               │</span>
<span class="line">            ▼               ▼               ▼</span>
<span class="line">     ┌───────────┐   ┌───────────┐   ┌───────────┐</span>
<span class="line">     │ 快速修复  │   │ 参数调优  │   │ 代码优化  │</span>
<span class="line">     └───────────┘   └───────────┘   └───────────┘</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="常见问题" tabindex="-1"><a class="header-anchor" href="#常见问题"><span>常见问题</span></a></h2><h3 id="q1-visualvm-连接远程-jvm-失败" tabindex="-1"><a class="header-anchor" href="#q1-visualvm-连接远程-jvm-失败"><span>Q1: VisualVM 连接远程 JVM 失败？</span></a></h3><p><strong>可能原因与解决方案</strong>：</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line"><span class="token comment"># 1. 检查 JMX 配置</span></span>
<span class="line"><span class="token comment"># 在远程 JVM 启动参数中添加：</span></span>
<span class="line"><span class="token parameter variable">-Dcom.sun.management.jmxremote</span><span class="token operator">=</span>true</span>
<span class="line"><span class="token parameter variable">-Dcom.sun.management.jmxremote.port</span><span class="token operator">=</span><span class="token number">9010</span></span>
<span class="line"><span class="token parameter variable">-Dcom.sun.management.jmxremote.ssl</span><span class="token operator">=</span>false</span>
<span class="line"><span class="token parameter variable">-Dcom.sun.management.jmxremote.authenticate</span><span class="token operator">=</span>false</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 2. 检查防火墙</span></span>
<span class="line">firewall-cmd --add-port<span class="token operator">=</span><span class="token number">9010</span>/tcp</span>
<span class="line"><span class="token comment"># 或</span></span>
<span class="line">iptables <span class="token parameter variable">-A</span> INPUT <span class="token parameter variable">-p</span> tcp <span class="token parameter variable">--dport</span> <span class="token number">9010</span> <span class="token parameter variable">-j</span> ACCEPT</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 3. 检查网络连通性</span></span>
<span class="line">telnet remote-host <span class="token number">9010</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 4. 使用 SSH 隧道</span></span>
<span class="line"><span class="token function">ssh</span> <span class="token parameter variable">-L</span> <span class="token number">9010</span>:localhost:9010 user@remote-host</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="q2-visualvm-内存不足" tabindex="-1"><a class="header-anchor" href="#q2-visualvm-内存不足"><span>Q2: VisualVM 内存不足？</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line"><span class="token comment"># 增大 VisualVM 自身内存</span></span>
<span class="line"><span class="token comment"># 编辑 visualvm.conf:</span></span>
<span class="line"><span class="token assign-left variable">visualvm_default_options</span><span class="token operator">=</span><span class="token string">&quot;-J-Xmx2048m -J-Xms1024m&quot;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 或在启动时指定</span></span>
<span class="line">visualvm -J-Xmx2048m -J-Xms1024m</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="q3-cpu-采样结果不准确" tabindex="-1"><a class="header-anchor" href="#q3-cpu-采样结果不准确"><span>Q3: CPU 采样结果不准确？</span></a></h3><p><strong>采样偏差问题</strong>：</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code><span class="line">可能原因：</span>
<span class="line">1. 采样间隔过大</span>
<span class="line">   → 解决方案：减小采样间隔（5-10ms）</span>
<span class="line"></span>
<span class="line">2. 短时间方法被忽略</span>
<span class="line">   → 解决方案：使用 Profiler 模式（插桩）</span>
<span class="line"></span>
<span class="line">3. JIT 编译导致的方法内联</span>
<span class="line">   → 解决方案：添加 -XX:+PrintCompilation</span>
<span class="line">   → 关注被 JIT 编译的方法</span>
<span class="line"></span>
<span class="line">4. 采样偏向于执行频率高的代码</span>
<span class="line">   → 注意：采样反映的是执行频率，不是绝对耗时</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="q4-堆转储文件过大" tabindex="-1"><a class="header-anchor" href="#q4-堆转储文件过大"><span>Q4: 堆转储文件过大？</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line"><span class="token comment"># 1. 限制堆转储范围</span></span>
<span class="line"><span class="token comment"># 只转储特定区域</span></span>
<span class="line">jcmd <span class="token operator">&lt;</span>PID<span class="token operator">&gt;</span> GC.heap_dump <span class="token parameter variable">-gzip</span><span class="token operator">=</span>true /path/dump.hprof.gz</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 2. 使用 MAT 进行二次分析</span></span>
<span class="line"><span class="token comment"># https://eclipse.org/mat/</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 3. 使用在线分析（无需完整转储）</span></span>
<span class="line"><span class="token comment"># VisualVM 支持在线查看堆统计</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="q5-visualvm-与-ide-集成" tabindex="-1"><a class="header-anchor" href="#q5-visualvm-与-ide-集成"><span>Q5: VisualVM 与 IDE 集成？</span></a></h3><div class="language-xml line-numbers-mode" data-highlighter="prismjs" data-ext="xml"><pre><code><span class="line"><span class="token comment">&lt;!-- IntelliJ IDEA --&gt;</span></span>
<span class="line"><span class="token comment">&lt;!-- 插件: VisualVM Launcher --&gt;</span></span>
<span class="line"><span class="token comment">&lt;!-- 安装后可通过 Run → Run with VisualVM --&gt;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">&lt;!-- Eclipse --&gt;</span></span>
<span class="line"><span class="token comment">&lt;!-- 插件: VisualVM Eclipse --&gt;</span></span>
<span class="line"><span class="token comment">&lt;!-- 安装后可通过 Run As → VisualVM --&gt;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="性能提示与技巧" tabindex="-1"><a class="header-anchor" href="#性能提示与技巧"><span>性能提示与技巧</span></a></h2><h3 id="提升分析效率" tabindex="-1"><a class="header-anchor" href="#提升分析效率"><span>提升分析效率</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code><span class="line">1. 使用过滤器</span>
<span class="line">   在 Sampler/Profiler 中设置包名过滤器</span>
<span class="line">   只分析目标代码，避免 JDK 库干扰</span>
<span class="line"></span>
<span class="line">2. 利用保存的配置</span>
<span class="line">   保存常用的监控配置</span>
<span class="line">   快速恢复到之前的监控状态</span>
<span class="line"></span>
<span class="line">3. 多进程对比</span>
<span class="line">   同时打开多个进程进行对比</span>
<span class="line">   直观发现性能差异</span>
<span class="line"></span>
<span class="line">4. 时间线标记</span>
<span class="line">   在监控时间线上标记关键事件</span>
<span class="line">   关联性能问题与业务操作</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="自动化监控脚本" tabindex="-1"><a class="header-anchor" href="#自动化监控脚本"><span>自动化监控脚本</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line"><span class="token shebang important">#!/bin/bash</span></span>
<span class="line"><span class="token comment"># visualvm-monitor.sh - 自动监控脚本</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 设置参数</span></span>
<span class="line"><span class="token assign-left variable">PID</span><span class="token operator">=</span><span class="token variable">$1</span></span>
<span class="line"><span class="token assign-left variable">OUTPUT_DIR</span><span class="token operator">=</span><span class="token string">&quot;./monitoring&quot;</span></span>
<span class="line"><span class="token assign-left variable">INTERVAL</span><span class="token operator">=</span><span class="token number">60</span>  <span class="token comment"># 60秒</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 创建输出目录</span></span>
<span class="line"><span class="token function">mkdir</span> <span class="token parameter variable">-p</span> <span class="token variable">$OUTPUT_DIR</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 监控循环</span></span>
<span class="line"><span class="token keyword">while</span> <span class="token boolean">true</span><span class="token punctuation">;</span> <span class="token keyword">do</span></span>
<span class="line">    <span class="token assign-left variable">TIMESTAMP</span><span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span><span class="token function">date</span> +%Y%m%d_%H%M%S<span class="token variable">)</span></span></span>
<span class="line">    </span>
<span class="line">    <span class="token comment"># 获取线程快照</span></span>
<span class="line">    jstack <span class="token variable">$PID</span> <span class="token operator">&gt;</span> <span class="token string">&quot;<span class="token variable">$OUTPUT_DIR</span>/thread-<span class="token variable">$TIMESTAMP</span>.txt&quot;</span></span>
<span class="line">    </span>
<span class="line">    <span class="token comment"># 获取堆统计</span></span>
<span class="line">    jcmd <span class="token variable">$PID</span> GC.heap_info <span class="token operator">&gt;</span> <span class="token string">&quot;<span class="token variable">$OUTPUT_DIR</span>/heap-<span class="token variable">$TIMESTAMP</span>.txt&quot;</span></span>
<span class="line">    </span>
<span class="line">    <span class="token comment"># CPU 和内存使用</span></span>
<span class="line">    <span class="token function">top</span> <span class="token parameter variable">-p</span> <span class="token variable">$PID</span> <span class="token parameter variable">-n</span> <span class="token number">1</span> <span class="token parameter variable">-b</span> <span class="token operator">&gt;&gt;</span> <span class="token string">&quot;<span class="token variable">$OUTPUT_DIR</span>/cpu-<span class="token variable">$TIMESTAMP</span>.txt&quot;</span></span>
<span class="line">    </span>
<span class="line">    <span class="token comment"># 睡眠</span></span>
<span class="line">    <span class="token function">sleep</span> <span class="token variable">$INTERVAL</span></span>
<span class="line"><span class="token keyword">done</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="相关资源" tabindex="-1"><a class="header-anchor" href="#相关资源"><span>相关资源</span></a></h2><h3 id="官方资源" tabindex="-1"><a class="header-anchor" href="#官方资源"><span>官方资源</span></a></h3><ul><li><a href="https://visualvm.github.io/" target="_blank" rel="noopener noreferrer">VisualVM 官方主页</a></li><li><a href="https://github.com/oracle/visualvm/blob/master/README.md" target="_blank" rel="noopener noreferrer">VisualVM 文档</a></li><li><a href="https://visualvm.github.io/plugins.html" target="_blank" rel="noopener noreferrer">VisualVM 插件中心</a></li></ul><h3 id="参考文档" tabindex="-1"><a class="header-anchor" href="#参考文档"><span>参考文档</span></a></h3><ul><li><a href="https://docs.oracle.com/en/java/java-components/jdk-mission-control/" target="_blank" rel="noopener noreferrer">JDK Mission Control 官方文档</a></li><li><a href="https://www.oreilly.com/library/view/java-performance-the/9781449363512/" target="_blank" rel="noopener noreferrer">Java Performance: The Definitive Guide</a></li><li><a href="https://docs.oracle.com/en/java/javase/17/perform/" target="_blank" rel="noopener noreferrer">Oracle Java 性能优化指南</a></li></ul><h3 id="相关工具" tabindex="-1"><a class="header-anchor" href="#相关工具"><span>相关工具</span></a></h3><ul><li><a href="https://eclipse.dev/mat/" target="_blank" rel="noopener noreferrer">Eclipse Memory Analyzer (MAT)</a></li><li><a href="https://www.ej-technologies.com/products/jprofiler/overview.html" target="_blank" rel="noopener noreferrer">JProfiler</a></li><li><a href="https://www.yourkit.com/" target="_blank" rel="noopener noreferrer">YourKit</a></li></ul>`,141)]))}const d=n(i,[["render",p]]),r=JSON.parse('{"path":"/java/advanced/diagnostic-tools/profiling-visualvm.html","title":"VisualVM 实战指南","lang":"zh-CN","frontmatter":{},"git":{"updatedTime":1767688846000,"contributors":[{"name":"zhaomy","username":"zhaomy","email":"3036190149@qq.com","commits":1,"url":"https://github.com/zhaomy"}],"changelog":[{"hash":"002042d6ccab469ab518aca6e5eb5ee2c566721e","time":1767688846000,"email":"3036190149@qq.com","author":"zhaomy","message":"docs: 新增Java诊断与监控工具相关文档"}]},"filePathRelative":"java/advanced/diagnostic-tools/profiling-visualvm.md","excerpt":"\\n<h2>工具概述</h2>\\n<h3>什么是 VisualVM</h3>\\n<p><strong>VisualVM</strong> 是一款集成化的 Java 虚拟机监控和性能分析工具，它将多种命令行工具的功能整合到一个图形化界面中，为开发者提供了直观、便捷的 JVM 诊断能力。作为 JDK 自带的免费工具（直到 JDK 9，从 JDK 11 开始需要单独下载），VisualVM 已经成为 Java 开发者进行性能分析和问题排查的常用选择之一。</p>\\n<div class=\\"language-text line-numbers-mode\\" data-highlighter=\\"prismjs\\" data-ext=\\"text\\"><pre><code><span class=\\"line\\">VisualVM 核心能力：</span>\\n<span class=\\"line\\"></span>\\n<span class=\\"line\\">┌─────────────────────────────────────────────────────────┐</span>\\n<span class=\\"line\\">│                    VisualVM                             │</span>\\n<span class=\\"line\\">├─────────────┬─────────────┬─────────────┬───────────────┤</span>\\n<span class=\\"line\\">│  进程监控    │  线程分析   │  堆内存分析  │   CPU 采样    │</span>\\n<span class=\\"line\\">│  (Overview) │ (Threads)  │  (Sampler)  │  (Profiler)   │</span>\\n<span class=\\"line\\">├─────────────┼─────────────┼─────────────┼───────────────┤</span>\\n<span class=\\"line\\">│  • JVM 参数  │  • 线程状态 │  • 内存使用  │  • 方法耗时   │</span>\\n<span class=\\"line\\">│  • 系统属性  │  • 死锁检测 │  • 对象统计  │  • 调用链     │</span>\\n<span class=\\"line\\">│  • 运行环境  │  • 堆栈查看 │  • 堆转储    │  • 热点分析   │</span>\\n<span class=\\"line\\">└─────────────┴─────────────┴─────────────┴───────────────┘</span>\\n<span class=\\"line\\"></span></code></pre>\\n<div class=\\"line-numbers\\" aria-hidden=\\"true\\" style=\\"counter-reset:line-number 0\\"><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div></div></div>"}');export{d as comp,r as data};
