---
title: nvm
date: 2025-07-24T03:26:00.155Z
category:
  - JavaScript
  - nvm
tags:
  - JavaScript
  - nvm
---

# nvm
[[toc]]

## Node 版本说明
- ES6 模块语法在 Node.js 12.x 版本中引入，并在 Node.js 14.x 及更高版本中得到更好的支持。
- node14.3只支持Windows8.1及以上版本

## nvm 安装
1. 下载地址：https://github.com/coreybutler/nvm-windows/releases
2. 配置 node 和 npm 的镜像地址，在nvm安装目录，找到 setting.txt 文件加上如下两行：
```
node_mirror:https://npmmirror.com/mirrors/node/
npm_mirror: https://npmmirror.com/mirrors/npm/
```

## nvm 常用命令
- nvm list 查看已安装的 node 版本
- nvm list available 查看所有可用的 node 版本
- nvm install 14.3.0 安装指定版本的 node
- nvm use 14.3.0 切换到指定版本的 node
- nvm uninstall 14.3.0 卸载指定版本的 node

## 解决 npm 安装失败问题
::: warning
使用 nvm 安装 node 后，npm 会自动安装在 node 目录下，所以不需要单独安装 npm。
但有时会遇到 npm 安装失败的情况，可以手动下载 npm 安装包，然后拷贝到指定路径下。
:::

nvm/vx.x.x目录下存在以下文件就成功了，否则需要手动下载
- node_modules
- node.exe
- npm
- npm.cmd

1. 首先去npm的官网或[镜像站](https://npmmirror.com/mirrors/npm/)下载node包
2. 解压后将`node_modules`目录下的文件**全部**复制到`nvm\vx.x.x\node_modules`目录下
3. 将`node_modules\npm\bin\`下的`npm`、`npm.cmd`、`npx`和`npx.cmd`文件复制到`nvm\vx.x.x`目录下

## 设置 npm 镜像
```bash
npm config set registry https://registry.npm.taobao.org --global
npm config set disturl https://npm.taobao.org/dist --global
```