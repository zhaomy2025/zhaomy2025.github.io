---
title: 腾讯云服务器
date: 2025-07-08T05:23:38.399Z
category:
  - linux
  - cloud
  - tencent
tags:
  - linux
  - cloud
  - tencent
---

# 腾讯云服务器
[[toc]]


## 购买服务器、域名、SSL
[https://console.cloud.tencent.com/ssl](https://console.cloud.tencent.com/ssl) 申请免费证书（3个月*50）到期重新操作一次。

## 域名备案

## 域名解析
轻量云 -> 轻量域名 -> 域名 -> 添加域名，按照提示填写。

记录类型：
- A记录：将域名指向服务器IP
- CNAME记录：将域名指向另一个域名
- MX记录：邮件服务器记录，用于接收邮件

## 安装SSL证书


## 验证绑定结果
http://zmyblog.site
http://www.zmyblog.site
<!--
http://49.235.115.66
宝塔面板： http://49.235.115.66:8888/tencentcloud   563dde5f c92bb64c1598 
-->

::: warning
网上很多资料显示宝塔面板访问路径为`http://your-server-ip:8888`，但腾讯云服务器宝塔面板的实际访问路径为`http://your-server-ip:8888/tencentcloud`。可通过服务器 -> 应用管理 -> 应用内软件信息查看到宝塔面板的实际访问路径。在终端执行`sudo /etc/init.d/bt default`可查看用户名和密码。

:::

<!-- @include:tencent-nginx.md -->
<!-- @include:../web/nginx-problem.md -->

## 宝塔Linux面板镜像默认配置

操作系统：OpenCloudOS 9

默认安装软件：
  - yum
  - curl
  - openssl
  - python3

宝塔面板推荐安装的软件：
  - LNMP一键安装包
    + Nginx
    + MySQL
    + PHP
    + phpMyAdmin

