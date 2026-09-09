---
title: Claude Cowork、Kimi Work、WorkBuddy、Mano-P——通用 Agent 桌面产品横向对比
date: 2026-06-05T16:00:00.000Z
category:
  - ai
  - ai_agent
tags:
  - ai
  - ai_agent
  - Claude Cowork
  - Kimi Work
  - WorkBuddy
  - Mano-P
  - 多Agent协作
  - Vibe Working
  - Agent集群
  - 端侧AI
  - GUI Agent
---

# Claude Cowork、Kimi Work、WorkBuddy、Mano-P——通用 Agent 桌面产品横向对比

> 2026 年 AI 的趋势正在发生一次关键转向：Coding Agent 的能力正在向非程序员群体溢出。Anthropic Claude Cowork、月之暗面 Kimi Work、腾讯云 WorkBuddy、明略科技 Mano-P 同时押注同一方向——让 AI 从写代码走向写报告、做 PPT、查数据、操作浏览器。其中 Mano-P 走出了一条与三家不同的路：端侧纯视觉驱动，隐私安全零成本。

[[toc]]

---

## 一、为什么 Coding Agent 正在走向知识工作者？

Anthropic 基于 Claude Code 衍生出 **Claude Cowork**——专门服务知识工作者的通用 Agent 桌面产品，能直接操作桌面上的应用。

月之暗面基于 Kimi Code 推出了 **Kimi Work（Beta）**：原生中文、界面简洁、最多支持 **300 个 Agent 并行工作**。

腾讯云 CodeBuddy 团队早在 2026 年 3 月就推出了 **WorkBuddy**——全场景 AI 智能体桌面工作台，定位为"你的 AI 同事"。

明略科技则在 2026 年 5 月开源了 **Mano-P**——端侧 GUI-VLA（视觉语言动作）模型，走了一条截然不同的路：模型完全本地运行，通过纯视觉理解屏幕截图来操作 GUI 应用。

四家公司不约而同地做同一件事：**让 Coding Agent 的能力从程序员群体溢出到知识工作者。** 但 Mano-P 选择了端侧纯视觉的技术路线，与其他三家的云端 API 驱动路线形成互补。

---

## 二、四款产品核心对比

| 维度 | **Claude Cowork** | **Kimi Work** | **WorkBuddy** | **Mano-P** |
|:---|:---|:---|:---|:---|
| **出品方** | Anthropic | 月之暗面（Moonshot AI） | 腾讯云 CodeBuddy 团队 | 明略科技（HanningWang） |
| **底层引擎** | Claude Code | Kimi Code（自研） | 混元/DeepSeek/GLM/Kimi/MiniMax 多模型 | 端侧 4B VLA 本地模型 |
| **定位** | 通用 Agent 桌面产品 | 知识工作者 Agent 工作台 | 全场景 AI 智能体桌面工作台 | 端侧 GUI Agent（视觉驱动） |
| **技术路线** | 云端 API 驱动 + Tool Use | 云端 API 驱动 + Skill | 云端 API 驱动 + Tool Use | **端侧纯视觉**，截图定位 UI 元素 |
| **Agent 集群** | 需 Prompt 手动编排 | 一键启用，300 Agent 并行 | 支持团队协作 | 单 Agent（端侧模型） |
| **桌面操作** | Computer Use | WebBridge（浏览器操作） | 内置 Browser Automation | **纯视觉 GUI 操作**（任意软件） |
| **隐私安全** | 数据上传云端 | 数据上传云端 | 数据上传云端 | **完全本地，数据不出设备** |
| **离线运行** | ❌ 需联网 | ❌ 需联网 | ❌ 需联网 | ✅ **完全离线** |
| **中文支持** | 有限 | 原生中文 | 原生中文 | 原生中文 |
| **国内可用** | 需魔法 | 开箱即用 | 开箱即用 | ✅ 开源免费 |
| **专业数据源** | 无内置 | 同花顺、天眼查、Yahoo Finance、arXiv | 金融数据查询等 Skill 生态 | ❌ 无（仅视觉交互） |
| **扩展机制** | 无专用插件市场 | Skill | Skill 插件市场 | 开源可自行训练微调 |
| **团队协作** | 单用户 | 单用户 | ✅ 统一账号、权限管理、审计日志 | 单机运行 |
| **多模态生成** | 有限 | 有限 | ✅ 文生图/视频/3D 等 | ❌ 不涉及 |
| **定价** | 较高 | 友好 | 免费 + Credits 计费 | **完全开源免费** |
| **硬件要求** | 普通电脑 | 普通电脑 | 普通电脑 | **Apple Silicon**（推荐 M4 Pro） |
| **状态** | 正式版 | Beta 版 | 正式版 | 开源发布 |

---

## 三、Claude Cowork——Anthropic 的通用 Agent 桌面

### 3.1 产品背景

Claude Cowork 是 Anthropic 基于 Claude Code 衍生出的桌面级 Agent 产品。它与 Claude Code 共享同一套底层模型和工具链，但交互方式从终端转向桌面 GUI，面向的是不想碰命令行的知识工作者。

### 3.2 核心能力

- **桌面应用操作**：直接用自然语言操作电脑上的各种应用
- **文件处理**：读写 Word、PDF、Excel、PPT 等办公文档
- **浏览器自动化**：类似 Computer Use 的能力，操作网页
- **代码扩展**：保留了 Claude Code 的编码能力，只是入口变成了 GUI

### 3.3 适合人群

Claude Cowork 适合熟悉英文环境、愿意付费、需要深度 Agent 能力的知识工作者。对于开发者来说，它和 Claude Code 之间可以无缝切换。

---

## 四、Kimi Work——国产 Agent 集群的先行者

### 4.1 产品背景

Kimi Work 是月之暗面基于 Kimi Code 衍生出的知识工作者产品，目前为 Beta 版。它最核心的差异化能力是 **Agent 集群**——最多 300 个 Agent 同时并行工作。

### 4.2 Agent 集群——从单兵到军团

传统的 Agent 是"一问一答"的单个执行者，Kimi Work 的 Agent 集群则是"自燃型团队"：你一声令下，一大群 AI 同时开工，每个 Agent 领一块任务并行推进。

```
你下达指令
    ↓
Kimi Work 任务拆解
    ├── Agent 1（财务分析）→ 读同花顺数据
    ├── Agent 2（合规审计）→ 查天眼查信息
    ├── Agent 3（报告撰写）→ 生成分析报告
    ├── Agent 4（业务关联）→ 分析主营业务
    └── Agent 5（证据核验）→ 检索专利招投标
    ↓ 并行执行 ↓
    ┌──── 汇总合成 ────┐
    输出：评分表 + 证据包 + 审计报告 + PPT
```

### 4.3 WebBridge——浏览器自动化

WebBridge 是 Kimi Work 的浏览器操作能力：读网页、点按钮、填表单、截图、下载资料，全程模拟真人操作。相比传统爬虫方案，WebBridge 更安全（不会触发反爬封号）。

### 4.4 专业数据源

Kimi Work 接入了同花顺、天眼查、Yahoo Finance、arXiv 等专业数据源，金融投研和学术检索可以直接在桌面应用内完成，这是其他几款产品不具备的优势。

### 4.5 实测案例

**商机挖掘**：输入指令后，Kimi Work 调研了 **1224 个项目**、分成 97 组机会、发起 122 个子 Agent 并行处理，最终产出 50 个精选机会 + 8 页设计感 PPT，全程自动交付到本地文件夹。

---

## 五、WorkBuddy——国内最早的全场景 AI 桌面工作台

### 5.1 产品背景

WorkBuddy 由腾讯云 CodeBuddy 团队于 2026 年 3 月推出，是国内最早定位为"操作系统级 AI 工作台"的桌面产品。它不是一个聊天机器人，而是一套让大模型真正能干活的基础设施——从"会聊天的 AI"进化为"能在你电脑上实际干活的数字同事"。

### 5.2 技术路线

WorkBuddy 采用 **API 驱动的云端 Agent** 架构：

- 通过 API 调用云端大模型（混元、DeepSeek、GLM、Kimi、MiniMax 等可切换）进行推理
- 使用 **工具调用（Tool Use）** 机制操作本地文件和执行任务
- 依赖 **文件系统 API、命令行、浏览器控制** 等结构化接口与电脑交互
- 可切换多个云端模型，不绑定单一供应商

```
User 指令
    ↓
WorkBuddy Orchestrator（编排层）
    ├── 调用云端 LLM 推理（可切换模型）
    ├── Tool Use 决策 → 调用 Skill / 文件操作 / 浏览器
    ├── 跨会话 Memory 管理
    └── 自动化调度（RRULE 定时任务）
    ↓
    输出：文件、文档、图表、自动化流水线
```

### 5.3 核心能力

- **多模态工具集成**：文件读写、代码执行、网页搜索、API 调用、文档生成等
- **Skill 插件生态**：像安装 App 一样扩展能力（金融数据、PDF 处理、浏览器自动化等）
- **跨会话记忆**：不是一次性对话，能记住用户偏好和项目上下文
- **工作流自动化**：支持定时任务（RRULE）、循环执行、多 Agent 协作
- **多模态内容生成**：文生图、视频、3D 等
- **团队协作**：统一账号体系、权限管理、审计日志
- **微信/企微联动**：扫码远程控制桌面

### 5.4 对比 Kimi Work

| 维度 | **WorkBuddy** | **Kimi Work** |
|:---|:---|:---|
| 底层模型 | 多模型可切换（混元/DeepSeek/GLM 等） | Kimi Code（自研） |
| Agent 集群 | 团队协作模式 | 300 Agent 并行 |
| 上手门槛 | Skill 市场安装即可使用 | 开箱即用，一键 Agent 集群 |
| 团队功能 | ✅ 统一账号、权限、审计 | ❌ 单用户 |
| 多模态生成 | ✅ 文生图/视频/3D | 有限 |
| 微信集成 | ✅ 原生集成 | ❌ |
| 发布状态 | 正式版 | Beta 版 |

---

## 六、Mano-P——端侧纯视觉驱动的 GUI Agent

### 6.1 产品背景

Mano-P 由明略科技（HanningWang）于 2026 年 5 月 7 日开源发布。与前三款产品不同，Mano-P 不依赖任何云端 API，而是走**端侧纯视觉驱动**路线：模型完全在本地 Apple Silicon 上运行（4B 量化版本仅需 4.3GB 显存），通过屏幕截图理解 UI 布局，直接模拟点击和输入。

### 6.2 技术路线

Mano-P 与其他三款产品的本质区别在于交互方式：

```
┌─────────────────────────────────────────────────────────────┐
│                    技术路线对比                              │
├──────────────────────────┬──────────────────────────────────┤
│  Claude/Kimi/WorkBuddy   │           Mano-P                 │
│                          │                                  │
│  自然语言指令             │   自然语言指令                    │
│      ↓                   │       ↓                         │
│  云端大模型推理            │   本地 VLA 模型推理 (4B)         │
│  (云端 API 调用)          │   (Apple MLX + Cider 加速)       │
│      ↓                   │       ↓                         │
│  工具调用决策              │   屏幕截图 → 视觉理解            │
│  (Tool Use / Skill)      │       ↓                         │
│      ↓                   │   定位 UI 元素 → 动作输出         │
│  API/CLI/文件系统         │       ↓                         │
│  结构化接口执行            │   模拟点击/输入（像人一样操作）    │
│                          │                                  │
│  ✅ 推理能力强（云端大模型）│   ✅ 隐私绝对安全                 │
│  ❌ 数据上传云端           │   ✅ 零 API 成本                 │
│  ❌ 按 Token 付费          │   ❌ 推理能力有限 (4B)           │
└──────────────────────────┴──────────────────────────────────┘
```

**核心差异**：
- Mano-P **不依赖 CDP 协议**，**不解析 HTML**，而是像人一样"看"屏幕
- 它操作的是**任意有 GUI 的应用**，不要求应用提供 API
- 数据完全不出设备，隐私安全性是所有产品中最高的

### 6.3 配套加速框架 Cider

Cider 是与 Mano-P 配套的 MLX 推理加速框架，专门为 Apple Silicon 优化：

- 补齐 MLX 缺失的 W8A8/W4A8 量化能力
- 通过 Metal 4 API 实现 INT8 硬件加速
- W8A8 下算子速度提升 **1.4x ~ 1.9x**
- 不仅服务于 Mano-P，Qwen/Llama/Mistral 等 MLX 模型通用

### 6.4 适用场景

Mano-P 特别适合以下场景：

- **隐私敏感场景**：金融、医疗、政府领域，数据不能出设备
- **桌面应用自动化**：操作无 API 的传统桌面软件（CAD、专业工具等）
- **GUI 自动化测试**：替代 Selenium/Playwright 做端到端测试
- **大规模 GUI 操作**：高频截图+点击类任务，Token 成本敏感
- **私有化部署**：企业内网环境，无法连接云端 API

### 6.5 一句话定位

**Mano-P = 端侧纯视觉 GUI Agent，隐私安全零成本，适合操作无 API 的桌面软件。**

---

## 七、四款产品对比总览

### 7.1 能力矩阵

| 能力 | Claude Cowork | Kimi Work | WorkBuddy | Mano-P |
|:---|:---|:---|:---|:---|
| 桌面应用操作 | ✅ Computer Use | ✅ 桌面操作 | ✅ 工具调用 | ✅ **纯视觉 GUI，任意软件** |
| 浏览器自动化 | ✅ Computer Use | ✅ WebBridge | ✅ 内置 Browser Automation | ✅ 纯视觉操作 |
| 多 Agent 并行 | ⚠️ 需手动编排 | ✅ 一键启用，300 Agent | ⚠️ 团队协作模式 | ❌ 单 Agent |
| 中文原生 | ❌ 英文为主 | ✅ 原生中文 | ✅ 原生中文 | ✅ 原生中文 |
| 国内使用 | ❌ 需魔法 | ✅ 开箱即用 | ✅ 开箱即用 | ✅ **开源免费** |
| 隐私安全 | ⚠️ 数据上云 | ⚠️ 数据上云 | ⚠️ 数据上云 | ✅ **完全本地** |
| 离线运行 | ❌ | ❌ | ❌ | ✅ **完全离线** |
| 专业数据源 | ❌ | ✅ 同花顺/天眼查/arXiv | ✅ Skill 生态扩展 | ❌ 仅视觉交互 |
| 文档生成（PPT/Word） | ✅ | ✅ | ✅ | ❌ 不涉及 |
| 多模态内容生成 | ❌ | ❌ | ✅ 文生图/视频/3D | ❌ 不涉及 |
| 跨会话记忆 | ✅ 记忆系统 | 有限 | ✅ 跨会话 Memory | ❌ 无 |
| 团队协作 | ❌ 单用户 | ❌ 单用户 | ✅ 团队协作 | ❌ 单机运行 |
| Skill/插件生态 | ❌ | ✅ Skill | ✅ Skill 插件市场 | ✅ **开源可训练** |
| 自动化/定时任务 | 有限 | 有限 | ✅ RRULE 调度 | ❌ 需外部编排 |
| 硬件要求 | 普通电脑 | 普通电脑 | 普通电脑 | **Apple Silicon** |
| 价格 | ⚠️ 较高 | ✅ 友好 | ✅ 免费+Credits | ✅ **完全免费** |

### 7.2 选型建议

| 场景 | 推荐选择 |
|:---|:---|
| 英文环境、深度 Agent 工作 | Claude Cowork |
| 中文环境、国内个人用户 | Kimi Work / WorkBuddy |
| 大规模并行任务（100+ Agent） | **Kimi Work**（300 Agent 集群） |
| 金融投研场景 | **Kimi Work**（同花顺+天眼查数据源） |
| 企业团队协作 | **WorkBuddy**（账号体系+审计） |
| 多模态内容生成 | **WorkBuddy** |
| 自动化定时任务 | **WorkBuddy**（RRULE 调度） |
| **操作无 API 的传统桌面软件** | **Mano-P**（纯视觉 GUI） |
| **隐私敏感场景（金融/医疗）** | **Mano-P**（完全本地） |
| **GUI 自动化测试** | **Mano-P**（替代 Selenium） |
| **零成本/完全开源** | **Mano-P** |
| 需要开源/自建 | Mano-P（完全开源）/ Claude Cowork（Claude Code 底层） |

### 7.3 两条技术路线的关系

四款产品按技术路线分为两大阵营：

```
云端 API 驱动                    端侧纯视觉驱动
──────────────────────────────────────────────────
Claude Cowork (Computer Use)
Kimi Work (WebBridge)           Mano-P (本地 VLA 模型)
WorkBuddy (Tool Use + Skill)    屏幕截图 → 模拟操作
                                    ↑
API/结构化接口                      完全离线
推理能力强                          隐私安全
                                   零成本
```

**不是竞品，是互补关系**：
- 云端 API 驱动：推理能力强、生态丰富、适合日常办公和内容创作
- 端侧纯视觉：隐私安全、零成本、能操作任意 GUI 应用（包括无 API 的传统桌面软件）

Mano-P 的差异化价值在于"纯视觉 GUI 操作"——它能操作任意有界面的应用，不依赖 API，这是其他三款产品目前做不到的。而 Claude Cowork / Kimi Work / WorkBuddy 的优势在于云端大模型的强推理能力和完整的办公生态。

---

## 八、Vibe Working——从 Coding 到 Working

### 8.1 概念演进

```
Vibe Coding            →    Vibe Working
用自然语言写代码           用自然语言指挥一整个办公室的 AI
单 Agent 写一个程序        多 Agent 集群做一整套工作
面向程序员                 面向所有知识工作者
```

Vibe Coding 是用自然语言指挥 AI 写代码，而 **Vibe Working** 是：你说了句话，一整个办公室的人（AI）开始同时动起来。

### 8.2 核心变化

- **从单 Agent 到多 Agent**：不再是一个人机对话，而是你指挥整个 Agent 团队
- **从代码到产出**：关注的是 PPT、报告、数据表、网页等终端产出
- **从开发者到白领**：写 Prompt 的门槛降低，自然语言就是界面

### 8.3 三个关键驱动力

1. **Agent 集群能力成熟**：以 Kimi Work 300 Agent 集群、WorkBuddy 团队协作为代表的并行调度技术，让大规模 AI 协作成为可能
2. **模型成本下降**：Token 价格持续走低，Agent 并行调用的经济性显著提升
3. **工具生态完善**：Skill、MCP、Function Calling 等标准化接口，让 Agent 能操作各种专业工具

---

## 九、总结

Claude Cowork、Kimi Work、WorkBuddy、Mano-P 四款产品，代表了同一趋势的不同切入点：

- **Claude Cowork**：西方高端路线，强在 Agent 深度和 Computer Use
- **Kimi Work**：中国普惠路线，Agent 集群数量（300）和性价比是其核心差异点
- **WorkBuddy**：国内最早的全场景路线，Skill 生态 + 团队协作 + 多模态生成是其综合优势
- **Mano-P**：端侧纯视觉路线，隐私安全 + 零成本 + 任意 GUI 操作是其独特价值（来自明略科技，开源发布）

对于国内用户：
- **个人日常办公**：Kimi Work（低门槛、Agent 集群）或 WorkBuddy（生态丰富）
- **企业团队场景**：WorkBuddy 有明显优势（账号体系、审计、协作）
- **金融投研**：Kimi Work（同花顺+天眼查数据源）
- **操作无 API 的传统软件 / 隐私敏感场景**：**Mano-P**（纯视觉 GUI，完全本地，开源免费）
- **需要定量/周期性任务**：WorkBuddy（RRULE 调度）

而从更长远的视角看，云端 API 驱动和端侧纯视觉两条路线不互斥。未来的 Agent 桌面产品很可能融合两者：用云端大模型做推理和规划，用端侧视觉模型做 GUI 操作。这种混合架构，可能比任何单一路线都更强大。

---

## 参考

- [AI 变了，要用 300 个 Agent 解救非程序员们 - 微信公众号「尹John AGI Hunt」](https://mp.weixin.qq.com/s/SISf_IS0-BOg1VwjUy9Ycg)
- [WorkBuddy vs Mano-P 对比分析](./workbuddy-vs-manop.md)
- [AI 智能体（Agent）入门](./index.md)
