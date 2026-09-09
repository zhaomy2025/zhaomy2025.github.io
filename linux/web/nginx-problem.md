---
title: Nginx常见问题
date: 2025-07-10T02:59:32.984Z
category:
  - linux
  - nginx-problem
tags:
  - linux
  - nginx-problem
---

## Nginx 常见问题

### Nginx 被 exclude 排除
::: warning
All matches were filtered out by exclude filtering for argument: nginx
Error: Unable to find a match: nginx
:::

问题原因：Nginx 被 exclude 排除
```conf
[main]
gpgcheck=1
installonly_limit=3
clean_requirements_on_remove=True
best=True
skip_if_unavailable=False
zchunk=False
exclude=httpd nginx php mysql mairadb python-psutil python2-psutil
```
解决方案：
1. 检查 /etc/yum.conf 或仓库文件，删除 exclude=nginx
2. 腾讯云服务器宝塔面板、LNMP等会自动安装 nginx，可以忽略此问题

### 访问宝塔面板出现404 Not Found nginx
404 Not Found (nginx) 错误，表示 Nginx 无法找到请求的资源（如网页、图片、API 等）。
可能原因：访问地址不对
解决方案：腾讯云服务器的宝塔面板访问地址为`http://your-server-ip:8888/tencentcloud`，而非`http://your-server-ip:8888`。
