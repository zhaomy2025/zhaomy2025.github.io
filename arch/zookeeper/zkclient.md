---
title: Zookeeper客户端——ZkClient
date: 2025-07-14T02:11:27.949Z
category:
  - arch
  - zookeeper
  - zkclient
tags:
  - arch
  - zookeeper
  - zkclient
---

# Zookeeper客户端——ZkClient
[[toc]]

## 简介
ZkClient由Datameer开发，是早期对原生ZooKeeper客户端的简单封装。曾经在早期较为流行(2012-2015年左右)，目前已逐渐被淘汰，新项目很少采用。

## 添加依赖
```xml
<dependency>
    <groupId>com.101tec</groupId>
    <artifactId>zkclient</artifactId>
    <version>0.2</version>
</dependency>
```

## 创建会话
```java
package com.zmy.zkclient.examples;

import java.io.IOException;
import org.I0Itec.zkclient.ZkClient;

public class ZkClientExample {
    public static void main(String[] args) throws IOException, InterruptedException {
        ZkClient zkClient = new ZkClient("127.0.0.1:2181", 5000);
        System.out.println("ZooKeeper session established.");
    }
}
```

## 创建节点
```java
zkClient.createPersistent("/zk-book/c1", true);
```
## 删除节点
```java
// 删除节点
zkClient.delete("/zk-book/c1");
// 删除节点及其所有子节点
zkClient.deleteRecursive("/zk-book");
```
## 获取子节点
```java
zkClient.subscribeChildChanges(path, new IZkChildListener() {
    public void handleChildChange(String parentPath, List<String> currentChilds) throws Exception {
        System.out.println(parentPath + " 's child changed, currentChilds:" + currentChilds);
    }
});
```
- 客户端可以对一个不存在的节点进行子节点变更的监听。
- 一旦客户端对一个节点注册了子节点列表变更监听之后，那么当该节点的子节点列表发生变更时，服务端都会通知客户端，并将最新的子节点列表发送给客户端。
- 该节点本身的创建或删除也会通知到客户端。

## 获取节点数据
```java
 zkClient.subscribeDataChanges(path, new IZkDataListener() {
    public void handleDataDeleted(String dataPath) throws Exception {
        System.out.println("Node " + dataPath + " deleted.");
    }

    public void handleDataChange(String dataPath, Object data) throws Exception {
        System.out.println("Node " + dataPath + " changed, new data: " + data);
    }
});

```
## 检测节点是否存在
```java
System.out.println("Node " + path + " exists " + zkClient.exists(path));
```

## 完整代码
@[code](../../code/zookeeper/ZkClientExample.java)