---
title: .well-known
date: 2026-09-10
category:
  - others
tags:
  - Web
  - HTTP
  - HTTPS
  - Web 标准
  - 服务发现
  - 域名验证
---

# .well-known：从网站服务发现到域名验证

[[toc]]

::: tip
`.well-known` 不是一个神秘的隐藏目录，而是 Web 标准约定的一段 URL 路径。身份认证服务、证书机构、移动操作系统和安全研究者，都可以通过它找到网站公开的协议元数据或验证文件。
:::

## 从一个域名开始

假设一个客户端需要接入某个 OpenID Connect 身份服务。它知道登录服务的地址：

```text
https://login.example.com
```

但它还不知道：

- 用户应该跳转到哪个授权地址；
- Token 应该提交到哪个接口；
- 用哪个地址获取验证身份令牌的公钥；
- 这个服务支持哪些 Scope 和响应类型。

如果把这些地址全部写死在客户端中，服务端一旦迁移路径、切换部署方式或增加新的能力，所有客户端都可能需要重新配置。

OpenID Connect 提供了一个固定的发现地址：

```text
https://login.example.com/.well-known/openid-configuration
```

客户端先请求这个地址，再根据返回的元数据找到后续端点。它不需要预先知道认证服务的全部接口，只需要知道一个可信的服务标识。

这就是 `.well-known` 最典型的使用方式：

> 客户端只知道一个域名时，通过标准化路径自动发现这个网站提供的协议配置和服务能力。

## `.well-known` 是什么

### 它是一组标准化 URL

基本形式是：

```text
https://example.com/.well-known/<名称>
```

例如：

```text
https://example.com/.well-known/security.txt
https://login.example.com/.well-known/openid-configuration
https://example.com/.well-known/acme-challenge/<token>
```

RFC 8615 定义了 Well-Known URI 的通用机制：在网站根路径下保留 `/.well-known/` 这个命名空间，由具体协议约定后面的名称、内容格式和使用方式。

因此，`.well-known` 本身不是一个独立协议，也不是只有一种文件格式。它更像一个由多个 Web 标准共同使用的“标准入口”。

### 它不一定对应服务器上的真实目录

URL 中出现：

```text
/.well-known/
```

并不意味着服务器磁盘上一定存在：

```text
/path/to/site/.well-known/
```

以下实现方式都可以提供同一个地址：

- 静态文件服务器直接映射目录；
- Nginx 使用 `location` 转发或返回文件；
- Node.js、Spring Boot 等应用注册路由；
- CDN 或对象存储提供公开文件；
- 认证服务动态生成 JSON。

客户端只关心 URL 的响应，不关心服务器内部究竟用文件还是代码生成内容。

### 它不是普通的隐藏目录

在 Linux 中，以点号开头的目录通常被当作隐藏目录；但在 Web 语境中，`.well-known` 首先是一个**标准化 URL 路径**。它的价值来自客户端和服务端对同一个协议的共同遵守，而不是因为目录名看起来特殊。

一个没有协议约定的地址，例如：

```text
/.well-known/my-config.json
```

即使可以正常访问，其他客户端也不知道它代表什么。只有当客户端知道 `my-config.json` 的协议和格式时，这个地址才有实际意义。

## 为什么需要固定的发现入口

### 把配置写死在客户端的问题

最直接的做法是把接口地址写在代码里：

```javascript
const authorizationEndpoint =
  'https://login.example.com/oauth2/authorize'

const tokenEndpoint =
  'https://login.example.com/oauth2/token'
```

这种方式在内部项目中可以工作，但不适合开放生态：

- 不同环境要维护不同配置；
- 服务端路径变化时需要重新发布客户端；
- 第三方客户端无法只凭一个域名自动接入；
- 每个厂商都可能设计一套不同的配置发现路径。

### 让服务端公开自己的协议能力

采用服务发现后，客户端只保存基础地址：

```text
https://login.example.com
```

它按照协议拼接发现地址：

```text
https://login.example.com/.well-known/openid-configuration
```

服务端返回类似下面的 JSON：

```json
{
  "issuer": "https://login.example.com",
  "authorization_endpoint": "https://login.example.com/oauth2/authorize",
  "token_endpoint": "https://login.example.com/oauth2/token",
  "userinfo_endpoint": "https://login.example.com/oauth2/userinfo",
  "jwks_uri": "https://login.example.com/oauth2/jwks",
  "scopes_supported": ["openid", "profile", "email"]
}
```

客户端解析元数据后，就能继续完成登录流程。服务端可以调整内部实现，只要发现文档仍然符合协议，客户端就不必把所有端点写死。

### 它在 Web 协议栈中的位置

可以把一次典型的服务发现过程理解成下面这条链路：

```text
域名
  ↓
DNS 解析
  ↓
建立 HTTPS 连接
  ↓
请求 /.well-known/...
  ↓
获取协议元数据或验证内容
  ↓
调用实际服务端点
```

DNS 解决“域名对应哪台服务器”，HTTP 负责“如何请求资源”，而 `.well-known` 解决的是“按照什么约定找到协议配置”。它不是 DNS 的替代品，也不是通用的服务注册中心。

## 标准名称是如何管理的

### RFC 8615 提供通用约定

RFC 8615 主要解决的是命名空间问题：

- 为 Well-Known URI 保留统一的 URL 前缀；
- 让不同协议可以在同一命名空间下定义自己的名称；
- 规定标准名称的注册方式；
- 避免客户端和服务端各自发明互不兼容的路径。

RFC 8615 并不规定 `security.txt` 应该包含哪些字段，也不规定 OpenID Connect 的 JSON 结构。具体内容仍由对应协议定义。

### IANA 注册表

标准化的 Well-Known URI 名称通常会登记在 IANA 的 Well-Known URIs Registry 中。查到一个名称后，还应该继续阅读它对应的 RFC 或官方规范，确认：

- 文件格式是什么；
- 哪些字段必填；
- 是否要求 HTTPS；
- 客户端如何校验内容；
- 文件是否需要设置有效期。

因此，需要区分三类路径：

| 类型 | 含义 | 示例 |
|---|---|---|
| 标准名称 | 有公开规范，第三方客户端知道如何读取 | `security.txt`、`openid-configuration` |
| 平台名称 | 由某个操作系统或服务平台定义 | `assetlinks.json`、`apple-app-site-association` |
| 自定义名称 | 企业内部自行约定 | `my-config.json` |

自定义名称并不是不能使用，但必须同时提供协议文档和客户端实现，否则它只是一个普通的自定义 URL。

## 常见的 `.well-known` 文件

不同文件解决的问题不同。可以把它们分成四类：安全沟通、身份服务发现、域名控制权验证，以及网站和应用关联。

### `security.txt`：告诉别人如何报告漏洞

地址：

```text
/.well-known/security.txt
```

`security.txt` 由 RFC 9116 定义，用于公开网站的安全联系信息。安全研究者发现漏洞后，可以通过这个文件知道应该向哪里报告，而不必猜测邮箱或在网站上到处寻找安全政策。

一个最小示例：

```text
Contact: mailto:security@example.com
Expires: 2027-09-10T00:00:00Z
Preferred-Languages: zh, en
```

常见字段包括：

| 字段 | 作用 |
|---|---|
| `Contact` | 漏洞报告联系方式，必填 |
| `Expires` | 文件内容的失效时间，必填 |
| `Preferred-Languages` | 接受报告的语言 |
| `Policy` | 安全政策页面地址 |
| `Canonical` | 该文件的规范地址 |
| `Acknowledgments` | 致谢页面地址 |

它体现了 `.well-known` 的一个重要用途：不一定是给业务程序调用，也可以为网站与外部参与者建立一个标准化的沟通入口。

::: warning
`security.txt` 是公开文件，不要在其中放置 API Key、密码、私钥、内部网络地址或其他敏感信息。`Contact` 只需要提供报告入口，不需要公开漏洞处理系统的内部细节。
:::

### `openid-configuration`：发现 OpenID Connect 配置

地址：

```text
/.well-known/openid-configuration
```

这是最典型的“服务发现”案例。OpenID Connect 客户端可以从发现文档中获得：

- `issuer`：身份服务的唯一标识；
- `authorization_endpoint`：授权端点；
- `token_endpoint`：Token 端点；
- `userinfo_endpoint`：用户信息端点；
- `jwks_uri`：JSON Web Key Set 公钥地址；
- `scopes_supported`：支持的 Scope；
- `response_types_supported`：支持的响应类型。

检查一个身份服务的发现文档：

```bash
curl -i https://login.example.com/.well-known/openid-configuration
```

客户端拿到文档后，不应只把它当成一份普通 JSON。它还需要检查 `issuer` 是否与预期的身份服务一致，并在后续验证令牌签名、有效期和受众等信息。

### `oauth-authorization-server`：发现 OAuth 2.0 授权服务器元数据

地址：

```text
/.well-known/oauth-authorization-server
```

OAuth 2.0 授权服务器元数据由 RFC 8414 定义，用于公开授权服务器的端点和能力。

它与 OpenID Connect 的发现文档很相似，但关注点不同：

| 发现文档 | 主要用途 |
|---|---|
| `openid-configuration` | OpenID Connect 登录和身份认证 |
| `oauth-authorization-server` | OAuth 2.0 授权和资源访问 |

OpenID Connect 建立在 OAuth 2.0 之上，因此实际系统中经常能同时看到 OAuth 和 OIDC 相关概念。客户端应该根据自己使用的协议和服务端规范选择正确的发现地址，不能仅凭文件名相似就混用字段。

### `acme-challenge`：验证域名控制权

地址：

```text
/.well-known/acme-challenge/<token>
```

ACME 协议用于自动申请和续期 HTTPS 证书。Let's Encrypt 等证书机构可以要求申请者在指定路径放置验证内容，然后从公网访问该地址，以确认申请者确实能够控制这个域名。

典型流程如下：

```text
申请 HTTPS 证书
        ↓
证书机构生成 Challenge
        ↓
申请者把验证内容放到指定路径
        ↓
证书机构访问 /.well-known/acme-challenge/<token>
        ↓
内容匹配，验证成功
        ↓
证书机构签发或续期证书
```

这个例子说明，`.well-known` 不只用于发布配置，也可以作为域名控制权验证的固定位置。

ACME 验证失败时，优先检查：

- 文件是否能从公网访问；
- 反向代理是否把请求转发到了正确的站点；
- 是否被统一登录鉴权拦截；
- 是否被前端 SPA 的 `index.html` 回退规则接管；
- 文件内容是否被 CDN 缓存成旧版本；
- HTTP 端口和 HTTPS 重定向是否符合所使用的 Challenge 类型要求。

### `assetlinks.json`：声明 Android 应用关联

地址：

```text
/.well-known/assetlinks.json
```

Android Digital Asset Links 使用这个 JSON 文件声明网站和 Android 应用之间的关联关系。例如，网站可以声明某个应用有权处理该域名下的链接。

一个简化的结构示例：

```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.example.app",
      "sha256_cert_fingerprints": [
        "AA:BB:CC:..."
      ]
    }
  }
]
```

这里的包名和证书指纹必须与实际应用一致。文件内容公开并不代表任何应用都能获得关联权限，系统还会根据应用签名等信息进行校验。

### `apple-app-site-association`：声明 Apple 应用关联

地址：

```text
/.well-known/apple-app-site-association
```

Apple Universal Links 使用这个文件声明网站路径与 iOS App 之间的关联关系。与很多 JSON 文件不同，它的文件名通常**不带 `.json` 扩展名**。

它可以描述：

- 哪些 App 有权处理这个域名；
- 哪些 URL 路径可以交给 App 打开；
- 哪些路径必须继续由浏览器处理。

Android 和 Apple 的文件都体现了同一个思路：网站通过公开声明告诉操作系统，哪些应用可以代表它处理链接。但具体字段、签名和匹配规则由各自平台定义，不能把两个文件的格式混用。

### `webfinger`：根据资源发现关联服务

地址通常是：

```text
/.well-known/webfinger?resource=acct:user@example.com
```

WebFinger 由 RFC 7033 定义，可以根据一个资源标识查询与它关联的服务信息。返回内容通常包含资源类型、规范地址和其他关联链接。

它适合联邦化系统或跨服务发现，说明 `.well-known` 的发现对象不一定只是“整个网站”：客户端也可以先拿到一个资源标识，再查询这个资源背后的服务端点。

## 一个完整的部署示例

下面以 `security.txt` 为例，演示静态文件和应用路由两种常见方式。

### 直接提供静态文件

目录结构可以是：

```text
public/
└── .well-known/
    └── security.txt
```

文件内容：

```text
Contact: mailto:security@example.com
Expires: 2027-09-10T00:00:00Z
Preferred-Languages: zh, en
```

如果站点的静态根目录是 `public/`，部署后应能通过下面的地址访问：

```text
https://example.com/.well-known/security.txt
```

### Nginx 配置

如果需要显式指定类型和文件处理方式，可以写成：

```nginx
location = /.well-known/security.txt {
    default_type text/plain;
    try_files $uri =404;
}
```

对于 JSON 文件，则应返回正确的媒体类型：

```nginx
location = /.well-known/assetlinks.json {
    default_type application/json;
    try_files $uri =404;
}
```

实际配置中还要确认 `root` 或 `alias` 指向了正确目录。`location` 写对但文件根目录写错，同样会得到 404。

### Node.js 路由

如果内容需要由应用动态生成，可以直接注册路由：

```javascript
import express from 'express'

const app = express()

app.get('/.well-known/security.txt', (_req, res) => {
  res
    .type('text/plain')
    .send([
      'Contact: mailto:security@example.com',
      'Expires: 2027-09-10T00:00:00Z',
      'Preferred-Languages: zh, en',
    ].join('\n'))
})

app.listen(3000)
```

不论使用静态文件还是应用路由，最终都要从公网检查实际 HTTP 响应，而不能只看本地目录或源码。

## 客户端通常如何读取和校验

不同协议的细节不同，但通用流程大致是：

```text
1. 获得基础域名或服务标识
2. 按协议拼接 Well-Known URI
3. 通过 HTTPS 发起请求
4. 检查状态码、重定向和 Content-Type
5. 解析 JSON、纯文本或其他协议格式
6. 校验域名、issuer、签名、有效期等内容
7. 使用返回的端点继续完成业务流程
```

### 能访问不等于可信

`.well-known` 下的内容通常是公开的，但“能够访问到”不等于“可以无条件信任”。客户端尤其要注意：

- 是否通过 HTTPS 获取；
- 证书是否有效；
- 返回的 `issuer` 是否与预期服务一致；
- 配置中的端点是否被替换成不相关的域名；
- 文件是否已经过期；
- 是否发生了不符合协议预期的重定向；
- CDN 或本地缓存是否返回了旧配置。

在身份认证场景中，不能因为发现文档是合法 JSON，就直接信任其中的所有 URL。发现文档本身也必须处在正确的信任边界内，后续令牌仍然需要独立验证。

### Content-Type 不是装饰

不同文件的响应类型通常应符合协议要求：

| 内容 | 常见 Content-Type |
|---|---|
| `security.txt` | `text/plain` |
| `openid-configuration` | `application/json` |
| `assetlinks.json` | `application/json` |
| `apple-app-site-association` | `application/json` |

某些客户端会严格检查媒体类型。即使浏览器能把错误类型的内容显示出来，协议客户端也可能因此拒绝处理。

## 部署时最常见的问题

### 路径拼写错误

正确路径是：

```text
/.well-known/security.txt
```

以下写法都不是同一个地址：

```text
/well-known/security.txt
/.wellknown/security.txt
/.well-known/security.txt/
```

此外，Linux 服务器通常区分大小写，`Security.txt` 和 `security.txt` 也可能对应不同资源。

### 被 SPA 回退规则接管

很多前端站点会使用类似配置：

```nginx
try_files $uri /index.html;
```

当 `.well-known` 文件不存在或路径没有被正确处理时，服务器可能返回前端首页，而不是返回 404。对协议客户端来说，得到一份 HTML 往往会表现为 JSON 解析失败或验证失败。

可以用 curl 检查响应正文，而不只看浏览器是否“打开了页面”：

```bash
curl -i https://example.com/.well-known/security.txt
```

### 被登录鉴权拦截

大多数 `.well-known` 文件需要公开访问。如果统一鉴权中间件把请求拦截成：

```http
401 Unauthorized
```

或者：

```http
302 Found
Location: /login
```

证书机构、操作系统或第三方客户端通常无法完成后续处理。需要在鉴权规则中为对应的标准路径保留公开访问能力。

### Content-Type 错误

常见错误包括：

- JSON 返回成 `text/html`；
- 纯文本返回成 `application/octet-stream`；
- 响应被网关统一加上错误的媒体类型。

检查时应同时看响应头和响应体：

```bash
curl -i https://example.com/.well-known/assetlinks.json
```

### CDN 缓存旧内容

`.well-known` 文件通常会被 CDN 和浏览器缓存。修改后仍然拿到旧版本时，需要检查：

- CDN 的缓存时间；
- 是否命中了旧缓存；
- 是否需要主动刷新；
- 不同地区或不同域名是否返回了不同内容。

但也不能简单地把所有文件都设置成“永不缓存”。身份配置、证书验证文件和应用关联文件的更新策略应根据对应协议和实际部署需求确定。

### 重定向和 HTTPS 配置不符合协议

有些客户端可以接受有限的重定向，有些验证流程对访问协议、端口和最终响应有更严格的要求。因此，不要凭经验假设“重定向最终能打开就一定没问题”，应按照具体协议的要求检查完整请求链路。

## 它和其他网站文件有什么区别

`.well-known` 经常和其他根目录文件一起出现，但它们服务的对象不同：

| 路径 | 主要服务对象 | 主要用途 |
|---|---|---|
| `/robots.txt` | 搜索引擎爬虫 | 声明哪些路径不希望被抓取 |
| `/sitemap.xml` | 搜索引擎 | 提供网站页面索引 |
| `/favicon.ico` | 浏览器 | 网站图标 |
| `/manifest.json` | 浏览器和 Web App | 描述渐进式 Web 应用 |
| `/.well-known/security.txt` | 安全研究者 | 提供漏洞报告入口 |
| `/.well-known/openid-configuration` | 身份认证客户端 | 发现 OIDC 服务配置 |
| `/.well-known/acme-challenge/` | 证书机构 | 验证域名控制权 |

`robots.txt`、`sitemap.xml` 和 `manifest.json` 也都是约定俗成的站点级文件，但它们并不等同于 RFC 8615 定义的 Well-Known URI。判断一个路径属于哪种规范，应该看它对应的协议，而不是只看它是否位于网站根目录。

## 什么时候应该使用 `.well-known`

适合使用的场景：

- 已有标准明确规定了 `.well-known` 路径；
- 需要让第三方客户端自动发现服务配置；
- 需要让证书机构验证域名控制权；
- 需要声明网站与 Android 或 Apple 应用的关联；
- 需要公开网站级别的安全联系信息。

不适合使用的场景：

- 普通业务 API，例如用户、订单和支付接口；
- 必须经过权限控制的后台配置；
- 存放密码、Token、私钥或其他秘密；
- 只是为了让自定义接口看起来更“标准”；
- 没有任何客户端约定的临时 JSON 文件。

::: tip
`.well-known` 不是万能配置目录。它真正的价值来自“服务端和客户端共同遵守同一个协议”，而不是来自目录名称本身。
:::

## 上线前检查清单

### 路径

- [ ] 使用了正确的 `/.well-known/` 前缀；
- [ ] 文件名符合对应协议；
- [ ] 注意大小写和是否需要扩展名；
- [ ] 没有误加末尾斜杠或多余路径。

### HTTP 响应

- [ ] 返回了预期的状态码；
- [ ] `Content-Type` 符合协议要求；
- [ ] 没有被意外重定向；
- [ ] 没有被登录鉴权拦截；
- [ ] 没有被 SPA fallback 返回 `index.html`。

### 内容

- [ ] JSON 或纯文本格式可以正常解析；
- [ ] 域名、`issuer`、包名和证书指纹等内容正确；
- [ ] 必填字段完整；
- [ ] 有效期和版本信息符合规范；
- [ ] 没有写入敏感信息。

### 运维

- [ ] 反向代理转发到了正确服务；
- [ ] CDN 没有继续返回旧内容；
- [ ] HTTP、HTTPS 和重定向行为符合具体协议；
- [ ] 已从公网而不是只在本地进行验证。

## 小结

`.well-known` 是网站根域名下用于发布协议元数据、验证内容和站点关联声明的一组标准 URL。它的核心价值可以概括为三点：

- 它不是普通的隐藏目录，而是标准化的 URL 命名空间；
- 它让客户端只凭一个域名，就能发现身份认证配置、证书验证内容或应用关联关系；
- 它的实际可用性不仅取决于文件内容，还取决于路径、HTTPS、Content-Type、鉴权、缓存和安全校验。

以后再看到：

```text
https://example.com/.well-known/...
```

可以先问三个问题：

1. 这个名称对应哪一个协议或平台规范？
2. 客户端需要从这里发现什么或验证什么？
3. 服务器是否以正确的状态码、媒体类型和内容公开提供它？

回答这三个问题，基本就能理解一个 `.well-known` 地址在系统中的真实作用。
