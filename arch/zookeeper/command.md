---
title: Zookeeper命令行
date: 2025-07-14T01:16:53.994Z
category:
  - arch
  - zookeeper
  - command
tags:
  - arch
  - zookeeper
  - command
---

# Zookeeper命令行
[[toc]]

## 服务端

### 启动Zookeeper
```bash
zkServer.sh start
```

### 停止Zookeeper
```bash
zkServer.sh stop
```

## 客户端
### 打开客户端
```bash
zkCli.sh
zkCli.sh -server host:port
```

### 退出客户端
```bash
quit
```

### 创建节点
```bash
create [-s] [-e] path data acl
```
::: tip
-s：顺序节点，会按照路径名的字母顺序在子节点中排列；
-e：临时节点，会话失效则节点自动删除。
:::

```bash
# 创建zk-temp临时节点
create -e /zk-temp 123
# 创建永久节点
create /zk-perm 123
```

### 读取节点
```bash
# 列出Zookeeper指定节点下的所有子节点
ls path [watch]
# 查看指定节点下的第一级的所有子节点
ls2 path [watch]
get path [watch] 
```

### 更新节点
```bash
set path data [version]
```

### 删除节点

```bash
delete path [version]
```
::: tip
若删除节点存在子节点，那么无法删除该节点，必须先删除子节点，再删除父节点。
:::



