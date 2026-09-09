---
title: undefined
date: 2025-07-29T02:57:18.143Z
category:
  - java
  - module
  - mail_smtp.md
tags:
  - java
  - module
  - mail_smtp.md
---

不同邮箱服务商的 SMTP 配置不同，需特别注意：

| 邮箱类型   | SMTP服务器          | 端口（TLS） | 认证方式               |
|------------|---------------------|-------------|------------------------|
| Gmail      | smtp.gmail.com      | 587         | 应用专用密码           |
| QQ邮箱     | smtp.qq.com         | 587         | 授权码（需在邮箱设置中开启） |
| 163邮箱    | smtp.163.com        | 465         | 客户端授权密码         |

