---
title: Nginx
date: 2025-07-09T08:40:21.446Z
category:
  - linux
  - web
  - nginx
tags:
  - linux
  - web
  - nginx
---

# Nginx
[[toc]]

## 安装
::: code-tabs
@yum
```bash
sudo yum install -y nginx
```
@apt-get
```bash
sudo apt-get install nginx
```
:::

::: tip
Ubuntu 支持apt-get命令
:::

## 文件夹位置
- `/etc/nginx`：配置文件目录
  + `/etc/nginx/nginx.conf`: 主配置文件
- `/etc/nginx/conf.d/`：站点配置文件存放目录
  + `/etc/nginx/conf.d/default.conf`：站点默认配置文件

这里给出宝塔面板的nginx默认主配置文件：
@[code](../../code/nginx/nginx.conf)

## 校验配置文件
```bash
sudo nginx -t -c /etc/nginx/nginx.conf
```

## 启动
```bash
./usr/sbin/nginx
```

## 停止
```bash
sudo nginx -s quit # 优雅停止 nginx，待nginx进程处理任务完毕进行停止
sudo nginx -s stop # 强制停止 nginx
```

## 重启
```bash
sudo nginx -s reload # 重启 nginx
```

## 其他命令
```bash
sudo nginx -s reopen # 重载 nginx 配置文件
sudo nginx -c fileName # 指定配置文件启动 nginx
sudo nginx -t # 测试 nginx 配置是否正确
sudo nginx -v # 查看 nginx 版本
sudo nginx -V # 查看 nginx 版本和配置信息
```

## 查看服务状态
```bash
ps -ef | grep nginx
ps aux | grep nginx
sudo systemctl status nginx
```

<!-- @include:../cloud/tencent-nginx.md -->

<!-- @include:nginx-problem.md -->
