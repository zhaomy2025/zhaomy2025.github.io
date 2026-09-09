---
title: Zookeeper客户端
date: 2025-07-14T03:00:41.879Z
category:
  - arch
  - zookeeper
  - client
tags:
  - arch
  - zookeeper
  - client
---

# Zookeeper客户端
[[toc]]

## 简介
Zookeeper客户端是Zookeeper的重要组成部分，负责与Zookeeper服务器进行交互，包括客户端API、命令行工具、Java客户端等。
常见的Zookeeper客户端有原生Java客户端、ZkClient、Apache Curator等，使用场景如下：
- 原生Java客户端：学习ZooKeeper原理时使用
- ZkClient：较为简单、功能有限的客户端，已停止维护
- Curator：功能丰富、稳定、活跃的社区，被Spring Cloud等广泛采用

## 原生Java客户端
- 优点：最基础、无额外依赖
- 缺点：需要处理大量底层细节(连接管理、重试等)
- 使用场景：学习ZooKeeper原理时使用
  
## ZkClient
由Datameer开发，是早期对原生ZooKeeper客户端的简单封装，曾经在早期较为流行(2012-2015年左右)，但现在已停止维护，不推荐新项目使用。
- 特性：
  - 对原生API的简单封装
  - 支持同步操作(原生API只有异步)
  - 简单的连接管理

## Curator
Curator是由Netflix开发并贡献给Apache，是当前最主流的ZooKeeper客户端，已成为事实标准，广泛用于各大开源项目(HBase, Kafka, Dubbo等)。
- 特性：
  - 提供Fluent风格的API
  - 内置连接管理(自动重连)
  - 提供高级特性(分布式锁、选举、计数器等)
  - 完善的错误处理

**为什么Curator成为标准？**
  1. 生产级可靠性：解决了原生API的连接管理难题
  2. 丰富的Recipe实现：提供分布式锁、选举等常见模式
  3. 活跃的社区：由Netflix支持，持续更新
  4. 良好的文档：API设计优秀，学习曲线平缓
  5. 与主流框架集成：被Spring Cloud等广泛采用

## 其他语言客户端

- C/C++: zookeeper-client-c
- Python: kazoo
- Go: go-zookeeper
- Node.js: node-zookeeper-client

## 示例代码对比

### 原生API创建节点

```java
ZooKeeper zk = new ZooKeeper(connectString, sessionTimeout, watcher);
zk.create("/path", data.getBytes(), ZooDefs.Ids.OPEN_ACL_UNSAFE, CreateMode.PERSISTENT);
```

### ZkClient创建节点

```java
ZkClient zkClient = new ZkClient(connectString);
zkClient.createPersistent("/path", data);
```

### Curator创建节点(Fluent风格)

```java
CuratorFramework client = CuratorFrameworkFactory.newClient(connectString, retryPolicy);
client.start();
client.create().withMode(CreateMode.PERSISTENT).forPath("/path", data.getBytes());
```

从代码可见，Curator既保留了灵活性又提供了更优雅的API设计。
