# n8n节点

本文档围绕自动化测试流程组织 n8n 节点，按其在测试中的语义角色划分为 11 个能力维度。同一节点可因用途不同出现在多个维度中（如数据库节点既可用于准备数据，也可用于验证结果）。

## 能力维度概览

| 能力维度   | 支持节点举例                                        |
|-----------|----------------------------------------------------|
| 触发       | Manual Trigger, Schedule Trigger, Webhook, Form Trigger, Chat Trigger               |
| 数据准备   | Set, Read File, Spreadsheet File, Item Lists, Generate UUID, 数据库节点  |
| 数据转换   | Move Binary Data, Merge, Limit, Sort, Extract from File, Aggregate |
| 流程控制与循环  | Split In Batches, Wait, If/Switch                       |
| 断言验证   | Function (JS), Validate Data, If            |
| 状态持久化 | Write File, Google Sheets, Airtable, Variable Storage (社区), 数据库节点  |
| 调用被测系统 | HTTP Request, AMQP / Kafka,数据库节点            |
| 安全与加密 | Hash, HMAC, Encrypt/Decrypt, JWT |
| 通知告警   | Slack, Email, DingTalk, Discord  |
| 报告生成   | Convert to File (CSV/JSON/XLSX), Google Sheets, Airtable    |
| 调试与日志 | Debug, Console, Sticky Note  |

> **数据库节点**包括官方（PostgreSQL/MySQL/SQLite/MSSQL/CockroachDB/Oracle Database）和社区（Oracle/MongoDB/Elasticsearch/DynamoDB）
> Oracle 同时出现在两列是因为：n8n 较新版本已内置官方 Oracle Database 节点（`n8n-nodes-base.oracledb`），但本项目使用 **v1.119.1**，该版本可能早于官方内置节点的发布，因此实际依赖社区节点。
> 社区节点安装后 type 会注册到 `n8n-nodes-base` 命名空间下（如 Oracle 社区节点为 `n8n-nodes-base.oracleDatabase`），但凭证类型与官方节点不同，**不可混用**。
> ⚠️ **Oracle 特别说明**：社区节点（`@rempel/n8n-nodes-oracle`）与官方内置节点（`n8n-nodes-base.oracledb`）是两个不同的节点，详见下文「数据库节点」章节。
> **文件读写操作(Read File/Write File)**均基于`n8n-nodes-base.readWriteFile`节点，通过操作模式切换读/写功能

## 文件与数据库操作的环境约束

在使用以下能力前，请注意平台限制：

### 本地文件操作（Read/Write File 节点）
- ❌ **n8n Cloud 不支持**：仅在**自托管实例**中可用
- 📁 **路径格式**：必须使用正斜杠 `/`，即使在 Windows 系统下也**不能使用 `\`**
- 🔐 **权限要求**：n8n 进程需对目标目录有读/写权限
- 🐳 **Docker 用户**：需通过 `-v` 挂载主机目录到容器内，并使用容器内路径

### 数据库节点
- 官方节点（PostgreSQL/MySQL/SQLite/MSSQL/CockroachDB/Oracle Database）：内置支持
- 社区节点（Oracle/MongoDB/Elasticsearch/DynamoDB）：需手动安装对应 npm 包

> **Oracle 节点选择指南**：
>
> | 属性 | 社区节点 | 官方内置节点 |
> |------|---------|-------------|
> | **npm 包** | `@rempel/n8n-nodes-oracle` | 随 n8n 内置，无需安装 |
> | **节点 type** | `n8n-nodes-base.oracleDatabase` | `n8n-nodes-base.oracledb` |
> | **凭证类型** | `oracleDBApi` | `Oracle Database credentials` |
> | **operation** | `execute` | `executeSql` / `select` / `insert` 等 |
> | **驱动程序** | 不明 | node-oracledb（Oracle 官方） |
> | **系统要求** | 未明确标注 | Oracle Database 19c+ |
> | **引入版本** | 社区维护 | 约 n8n 1.x 晚期或 2.0+ |
>
> ⚠️ **当前环境注意**：本项目使用 n8n **v1.119.1**，该版本可能**早于**官方内置 Oracle 节点的发布时间，因此需要依赖社区节点 `@rempel/n8n-nodes-oracle`。两者 type 名称和凭证类型均不同，**不可混用**。

> ⚠️ 忽略上述约束将导致节点执行失败或静默跳过。

## 触发

### Trigger Manually (n8n-nodes-base.manualTrigger)
通过点击按钮手动启动工作流，主要用于**测试和调试**。

### On app event

### On a Schedule (n8n-nodes-base.scheduleTrigger)
基于时间表达式在固定间隔或特定时间自动运行工作流。
- 支持 cron 表达式和可视化调度（每秒/分/小时/日等）

### On webhook call (n8n-nodes-base.webhook)

通过 HTTP 请求触发工作流，适用于 CI/CD 集成：
- 支持自定义路径、方法、参数接收

### On form submission (n8n-nodes-base.formTrigger)

提供简易表单界面供用户提交测试参数。
- 支持上传附件，可代替Read File节点，无需配置文件路径。

**formFields.values 中每个字段的通用属性**：

| 属性 | 类型 | 说明 |
|------|------|------|
| `fieldLabel` | string | 字段标签/名称，提交后作为 `$json` 的 key |
| `fieldType` | string | 字段类型（见下表） |
| `requiredField` | boolean | 是否必填 |
| `placeholder` | string | 占位文本（text 类型） |
| `acceptFileTypes` | string | 接受的文件类型（file 类型，如 `.csv`） |

**fieldType 可选值及特有配置**：

| fieldType | 用途 | 特有配置字段 | 说明 |
|-----------|------|-------------|------|
| `text` | 单行文本输入 | `placeholder` | — |
| `textarea` | 多行文本 | `placeholder` | — |
| `dropdown` | 下拉选择框 | **`fieldOptions`** | ⚠️ 见下方详解 |
| `checkboxes` | 复选框 | **`fieldOptions`** | 同 dropdown 结构 |
| `radioButtons` | 单选按钮组 | **`fieldOptions`** | 同 dropdown 结构 |
| `file` | 文件上传 | `acceptFileTypes` | 二进制数据在 `$binary` 中 |

> ⚠️ **dropdown / checkboxes / radioButtons 的 fieldOptions 格式（v1.119.1 实测验证）**：
>
> ```json
> "fieldOptions": {
>   "values": [
>     { "option": "显示文本1" },
>     { "option": "显示文本2" }
>   ]
> }
> ```
>
> **关键点**：
> - 字段名是 **`fieldOptions`**（不是 `options`、不是 `dropdownOptions`）
> - 类型是 **`fixedCollection`**，必须嵌套 `values` 数组
> - 每个选项只有 **`option`** 字段（字符串），**没有独立的 value 字段**
> - 显示值 = 提交值（Form 提交时 `$json.fieldLabel` 就是选中的 option 字符串）
>
> ❌ 以下写法**全部错误**（会导致下拉框无选项或选项显示异常）：
> - `"options": [{ "option": "a", "value": "b" }]` —— 不存在 value 字段
> - `"dropdownOptions": { "values": [...] }` —— 字段名错误
>
> ✅ 正确示例——环境下拉框：
> ```json
> {
>   "fieldLabel": "environment",
>   "fieldType": "dropdown",
>   "requiredField": true,
>   "fieldOptions": {
>     "values": [
>       { "option": "测试" },
>       { "option": "本地" },
>       { "option": "UAT" }
>     ]
>   }
> }
> ```
>
> 后续 Code 节点中用中文字符串做 key 映射：
> ```javascript
> const env = $input.item.json.environment; // 值为 "测试" 或 "本地" 或 "UAT"
> const envMap = {
>   '测试': 'http://10.189.66.145:8080',
>   '本地': 'http://localhost:8081',
>   'UAT': 'http://10.189.66.97:8080'
> };
> ```

### When executed by another workflow (n8n-nodes-base.executeWorkflowTrigger)

被其他工作流调用时触发。

### On chat message (@n8n/n8n-nodes-langchain.chatTrigger)

监听聊天消息（如 Slack/Discord）触发测试。

## 数据准备

用于构造或获取测试输入数据。

### Set

手动定义 JSON 数据项，常用于设置测试上下文。

### Generate UUID

生成唯一标识符，用于创建隔离的测试资源（如用户ID、订单号）。

### Item Lists

将数组拆分为多个独立项，便于后续逐条处理。

### Read Files from Disk (n8n-nodes-base.readWriteFile)

> ⚠️ 请先确认满足文件操作约束。
- 操作模式：选择 "Read File"
- 用途：加载本地 CSV/JSON/配置文件作为测试数据源
- 输出：文件内容存于 $binary.data，元信息（文件名、大小）在 $json
- 提示：支持动态路径（如 data/test_{{ $now }}.csv）

### Spreadsheet File (n8n-nodes-base.spreadsheetFile)

读取/写入 Excel、CSV、ODS 等表格文件，自动解析为结构化 JSON。

### Read PDF (n8n-nodes-base.readPDF)

提取 PDF 中的文本或图像内容，用于文档类测试验证。

### Oracle SQL（社区节点 n8n-nodes-base.oracleDatabase）
从 Oracle 数据库读取预置测试数据（如用户账号、产品列表）。
- **npm 包**：`@rempel/n8n-nodes-oracle`（⚠️ 不是 `@n8n/n8n-nodes-oracle`，后者不存在）
- **凭证类型**：`oracleDBApi`
- **operation**：`execute`
- **参数**：`sqlQuery`、`options`
- 示例查询：SELECT * FROM test_users WHERE env = 'staging'
✅ 其他数据库（MySQL/PostgreSQL 等）同理，归入本维度当且仅当用于准备测试输入。

## 数据转换

对数据进行清洗、重组或格式化。

### Merge

合并多路数据流，等待所有输入项处理完成后合并输出。若有未处理项且无法完成，则结束流程。

### Limit

截取前 N 条记录。

### Sort

按字段排序。

### Move Binary Data

在二进制字段间移动数据，便于后续处理。

### Extract from File (n8n-nodes-base.extractFromFile)

从 $binary 中提取结构化内容（如从 PDF 提取文本、从 Excel 提取表格）。
- 需配合 Read File 使用
- 输出存入指定 JSON 字段（默认 data）

### Aggregate(n8n-nodes-base.aggregate)

- 用于将多个数据项合并为一个，支持合并数组、对象等
- 可用于批量处理数据，如合并多个 API 响应

## 流程控制与循环

### If

用于条件测试，可以根据 API 响应的内容进行不同的处理：

- 支持多种比较操作符（等于、大于、包含等）
- 可以设置复杂的条件组合

### Switch

多值匹配（如根据错误码走不同处理路径）

### Split In Batches (n8n-nodes-base.splitInBatches)

实现显式循环：
- 将输入项分批处理（默认每批 1 项）
- loop 输出 → 处理节点 → 回连至本节点
- done 输出 → 循环结束后执行
- 判断是否最后一轮：`{{ $('节点名').context['noItemsLeft'] }}`

🔄 常用于批量 API 调用、分页数据拉取。

**工作流程示例：**
```
[数据源] → [Split In Batches] → [Split In Batches的loop输入]
                        ↓ (done输出)
                    [完成处理]
```

### Wait

暂停当前工作流实例的执行（可以设置固定时间或直到特定条件满足）。

## 断言验证

验证被测系统行为是否符合预期。

### Validate Data

验证 API 响应的数据结构是否符合预期。

### Code

编写 JavaScript 实现复杂断言逻辑（如数值范围、字符串匹配）。

### 条件断言（使用 If 节点）

 `If` 节点在测试中常用于实现布尔断言（如响应码是否为 200）。详细用法参见「流程控制与循环」章节。

## 状态持久化

### Write File (n8n-nodes-base.readWriteFile)

> ⚠️ 请先确认满足文件操作约束。
- 操作模式：选择 "Write File"
- 用途：保存日志、响应体、截图等到磁盘
- 输入：来自 $binary.data 或 $json.data
- 建议：使用绝对路径，Docker 环境需挂载卷

### Google Sheets

将结果写入Google在线表格，便于团队协作查看。

### Airtable

将结果写入在线表格，便于团队协作查看。

### Variable Storage（社区节点）

跨工作流持久化变量（如测试会话 ID）。

### Oracle SQL（社区节点 n8n-nodes-base.oracleDatabase）

将测试结果写入数据库审计表（如 test_run_log）。节点详情同上「数据准备」章节中的 Oracle SQL 说明。

## 调用被测系统

直接与被测服务交互。

### HTTP Request

节点类型：n8n-nodes-base.httpRequest

最常用的HTTP请求节点，支持发送各种HTTP请求并处理响应数据。

**必需参数：**
- **URL**：要发送请求的完整URL（包括协议）

**常用参数：**
- **方法 (Method)**：可选，默认GET，支持GET、POST、PUT、DELETE、PATCH、HEAD、OPTIONS
- **认证 (Authentication)**：可选，默认none，支持无认证、预定义凭证类型或通用凭证类型
- **发送查询参数 (Send Query Parameters)**：布尔值，是否发送查询参数
- **发送请求头 (Send Headers)**：布尔值，是否发送自定义请求头
- **发送请求体 (Send Body)**：布尔值，是否发送请求体数据
- **请求体内容类型 (Body Content Type)**：当发送请求体时，可选择JSON、Form-Data、Raw等格式

**认证**
- 预定义凭证：n8n 为特定服务提供的固定且标准化的认证，例如：
  - Airtable：使用 Bearer Token（API Key）
  - GitHub：使用 Personal Access Token（也走 Bearer）
  - Google：OAuth2 集成，内置授权流程

- 通用凭证：自定义 Header/Bearer/OAuth，用于非官方服务
  - Header Auth
  - Bearer Token
  - Basic Auth
  - OAuth2

### HTTP Request Tool (@n8n/n8n-nodes-langchain.toolHttpRequest)

为 LangChain AI Agent 提供动态 API 调用能力。

**特点：**
- 可作为AI工具使用
- 支持占位符定义
- 适合在AI代理中动态构建请求

**使用场景：**
- 创建天气查询工具
- 构建GitHub issue创建工具
- 为AI系统提供外部API访问能力

### 数据库节点

直接查询业务数据库以验证数据写入正确性（端到端测试场景）。
> ⚠️ 注意：此用途属于“验证”，而非“准备数据”

## 安全与加密

### Hash/HMAC

使用 Hash 验证文件完整性（如下载的测试包是否被篡改）

### Encrypt/Decrypt

对敏感测试数据脱敏（如银行卡号加密存储）。

### JWT

解析令牌以验证用户权限上下文。

### Crypto节点

通用加解密工具，支持 AES/RSA 等算法。

## 通知告警

在测试异常或完成时通知团队。

### Slack / DingTalk / Discord

- 失败告警：测试用例失败时发送消息
- 支持富文本、附件（如错误日志）

### Email

- 进度通知：每日测试报告汇总推送

## 报告生成

### Convert to File

将 API 响应转换为文件格式，便于保存测试结果：
- 支持 CSV / JSON / XLS / XLSX / HTML / ICS / ODS / RTF / Text  等
- 用于生成可下载的测试结果包

### Google Sheets / Airtable

实时更新在线测试报告看板。

## 调试与日志

辅助开发与问题排查。

### Debug/Console

输出当前数据项内容至执行日志。

### Sticky Note

记录测试逻辑说明、API 文档链接等。

## 附录：内置方法和变量

### 当前节点输入
| 方法 | 说明 | 代码节点是否可用？ |
|------|------|--------------------|
| `$input.all()` | 当前节点中的所有输入项 | ✅ |
| `$input.first()` | 当前节点的第一个输入项 | ✅ |
| `$input.last()` | 当前节点中的最后一个输入项 | ✅ |
| `$input.item` | 当前节点正在处理的输入项 | ✅ |
| `$json`     | `$input.item.json` 的缩写，表示节点传入的 JSON 数据。 | ✅（仅在每个项目运行一次时） |
| `$binary`   | `$input.item.binary` 的缩写，表示节点传入的二进制数据 | ❌（需通过 items[0].binary 访问） |
| `$input.context.noItemsLeft` | 布尔值，是否仍有未处理条目 | ✅（仅在“对项目进行循环”节点可用）|
| `$input.params` | 包含前一个节点的查询设置的对象，其中包括运行的操作、结果限制等数据。 | ✅ |

### 其他节点输出
| Method 方法 | Description 说明 | Available in Code node? 代码节点是否可用？ |
|------------|------------------|--------------------------------------------|
| `$("<node>").all()` | 返回给定节点的所有项目。 | ✅ |
| `$("<node>").first()` | 给定节点输出的第一个项目。 | ✅ |
| `$("<node>").last()` | 给定节点输出的最后一项。 | ✅ |
| `$("<node>").item` | 链接项。这是用于生成当前项目的指定节点中的项目。有关项目链接的更多信息，请参阅项目链接。 | ✅ |
| `$("<node>").context` | 布尔值。仅在使用 "对项目进行循环 "节点时可用。提供节点中正在发生的信息。用它来确定节点是否仍在处理条目。 | ✅ |
| `$("<node>").params` | 包含给定节点的查询设置的对象。其中包括运行的操作、结果限制等数据。 | ✅ |
| `$("<node>").itemMatching(currentNodeInputIndex)` | 如果需要从输入项进行回溯，请使用`$("<node>").item`代替代码节点中的 。 | ✅ |

### 变量引用

| 类型 | 说明 | 引用方式 |
|------|------|----------|
| 环境变量 | 存储跨工作流的配置或敏感信息 | `{{ $env.变量名 }}` |
| 工作流变量 | 在工作流内部使用的变量 | `{{ $vars.变量名 }}`、`{{ $变量名 }}` |
| 执行上下文 | 访问执行ID、当前时间等信息 | `{{ $execution.id }}`、`{{ $workflow.name }}` |
| 日期时间 | 访问当前时间戳或日期对象 | `{{ $now }}`、`{{ $today }}` |

### 二进制数据处理

getBinaryDataBuffer()=items[0].binary.data.data