---
title: 宝塔面板安装 Nginx
date: 2025-07-10T02:57:50.122Z
category:
  - linux
  - cloud
  - nginx
tags:
  - linux
  - cloud
  - nginx
---

## 宝塔面板安装 Nginx

选择宝塔面板镜像并不会自动安装 Nginx，需要登录宝塔面板安装 Nginx。
::: tip
- 不推荐手动安装 Nginx，会与宝塔面板安装的Nginx冲突，yum安装软件也会排除Nginx。
  推荐LNMP一键安装包，安装Nginx、MySQL、PHP、phpMyAdmin。
:::

### 默认目录

在 宝塔面板（BT Panel） 中，Nginx 的默认安装路径和配置文件目录与手动编译或 yum 安装的有所不同。

#### 安装目录

- 安装目录：/www/server/nginx/

#### 配置文件目录

- 配置文件目录：/www/server/nginx/conf/
  + 默认配置文件：/www/server/nginx/conf/nginx.conf <Tip>默认配置文件是 Nginx 的主配置文件，一般情况下，不需要修改。</Tip>
- 站点配置文件目录：/www/server/panel/vhost/nginx/
  + 默认站点配置文件：/www/server/panel/vhost/nginx/0.default.conf <Tip>如果没有找到默认站点配置文件，可以手动创建。</Tip>
  + 每个站点一个文件：/www/server/panel/vhost/nginx/your_domain.conf

::: tip
如果没有找到默认站点配置文件和默认网站根目录，可以手动创建。
:::

::: code-tabs
@tab nginx.conf
@[code](../../code/nginx/nginx.conf)

@tab 手动创建默认站点配置文件、默认网页
```bash
cat > /www/server/panel/vhost/nginx/0.default.conf <<EOF
server {
    listen 80 default_server;
    server_name _;
    root /www/wwwroot/default;  # 替换为你的网站根目录
    index index.html index.php;
    access_log /www/wwwlogs/default.log;
}
EOF
mkdir -p /www/wwwroot/default
echo "Hello, this is default site" > /www/wwwroot/default/index.html
```

:::
#### 默认网站根目录

- 默认网站根目录：/www/wwwroot/
  + 网站域名对应目录：/www/wwwroot/your_domain/

#### 日志目录

- 日志目录：/www/wwwlogs/
  + 访问日志：/www/wwwlogs/your_domain.access.log
  + 错误日志：/www/wwwlogs/your_domain.error.log

#### 其他关键目录

- Nginx模块目录：/www/server/nginx/modules/
- SSL证书目录：/www/server/panel/vhost/ssl/
- 宝塔面板配置：/www/server/panel/data

### 总结

宝塔面板的 Nginx 目录集中存放在 /www/server/nginx/ 下，与常规 Linux 系统的 /usr/local/nginx/ 或 /etc/nginx/ 不同。如果需要修改配置或排查问题，优先通过宝塔面板操作，避免手动修改导致服务异常。
