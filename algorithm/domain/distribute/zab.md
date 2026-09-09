---
title: ZAB算法
date: 2025-07-11T03:05:59.589Z
category:
  - algorithm
  - domain
  - distribute
  - zab
tags:
  - algorithm
  - domain
  - distribute
  - zab
---

# ZAB算法
[[toc]]

## 简介
ZAB（Zookeeper Atomic Broadcast）是专门为分布式协调服务 Zookeeper 设计的一种支持崩溃恢复的原子广播协议，是Zookeeper实现分布式一致性的核心算法。

基于ZAB协议，Zookeeper采用主备架构来维护集群各节点间的数据一致性。在该架构中，所有客户端的写请求都由主节点（Leader）统一处理，然后由Leader将数据变更同步到备份节点（Follower）。这种设计不仅保证了数据一致性，还通过优化机制提升了系统性能：ZAB协议只需收到半数以上Follower的Ack确认即可提交数据变更，这种多数派确认机制既减少了同步阻塞，又显著提高了系统的可用性。

ZAB协议的核心设计目标在于解决分布式系统中的两个关键问题：

1. 原子广播问题 - 确保集群中的所有服务器能够按照完全一致的顺序接收并处理所有更新操作
2. 崩溃恢复问题 - 当Leader节点发生故障时，系统能够快速完成故障恢复并维持数据一致性

为实现这两个目标，ZAB协议采用了双模式工作机制：
  - 恢复模式：负责处理Leader选举和系统恢复
  - 广播模式：负责处理正常的消息广播和事务处理

这种双模式设计使得ZAB协议既能够保证消息传递的原子性和顺序性，又能够在节点故障时快速恢复服务。

ZAB定理了两个原则：
  - ZAB协议确保那些已经在Leader上提交的事务最终被所有服务器提交
  - ZAB协议确保丢弃哪些只在Leader上提出/复制，但还没有被提交的事务


### 崩溃恢复模式（选举阶段）
崩溃是指Leader 失去与过半 Follwer 的联系。

通过以下三个阶段完成Leader选举，并保证上述两个原则的实现：
1. Leader选举：集群启动或Leader失效时，进入选举过程
2. 发现阶段：新Leader与Follower同步历史事务
3. 同步阶段：确保所有节点具有相同状态


### 广播模式（消息广播）

1. 客户端请求：客户端向Leader发送写请求
2. 提案广播：Leader将提案(proposal)广播给所有Follower
3. ACK确认：Follower接收并持久化提案后发送ACK
4. 提交广播：收到多数ACK后，Leader执行commit操作，并发送commit消息
5. 请求执行：Follower节点执行提交的请求

还有一些其他细节：
  - Leader 在收到客户端请求之后，会将这个请求封装成一个事务，并给这个事务分配一个全局递增的唯一 ID，称为事务ID（ZXID），ZAB 协议按照 ZXID 顺序对事务进行处理，保证事务的顺序。
  - 在 Leader 和 Follwer 之间还有一个消息队列，用来解耦他们之间的耦合，解除同步阻塞。
  


## 关键特性

- 顺序一致性：所有事务按相同顺序执行
- 原子性：事务要么在所有节点提交，要么都不提交
- 单一系统映像：客户端看到一致的系统状态
- 可靠性：一旦事务被提交，将永久保存
- 实时性：客户端能在限定时间内看到最新状态

## 实现细节

### 事务ID（ZXID）

ZAB使用64位ZXID表示事务：
- 高32位：epoch编号（Leader任期）
- 低32位：事务计数器

### 选举算法

Zookeeper实际使用Fast Leader Election变种：
1. 每个节点投票给自己（包含ZXID信息）
2. 收到其他节点的投票后比较：
  - 优先选择epoch大的
  - epoch相同选择ZXID大的
  - ZXID相同选择server ID大的
3. 当获得多数投票时成为Leader

### 数据同步

新Leader通过以下方式同步数据：
1. 差异化同步(DIFF)：同步差异部分
2. 回滚同步(TRUNC)：回滚到公共点后同步
3. 全量同步(SNAP)：当差异太大时发送完整快照

## 伪代码示例

```java
// Leader处理写请求
void processWriteRequest(Request request) {
    // 生成提案
    Proposal p = createProposal(request);
    
    // 广播提案
    broadcastProposal(p);
    
    // 等待ACK
    waitForAcks(p);
    
    // 提交提案
    if (hasQuorumAcks(p)) {
        commit(p.zxid);
        broadcastCommit(p.zxid);
        execute(p);
    }
}

// Follower处理提案
void handleProposal(Proposal p) {
    // 持久化到事务日志
    writeToLog(p);
    
    // 发送ACK
    sendAck(p.zxid);
}

// Follower处理提交
void handleCommit(long zxid) {
    // 执行已提交的事务
    executeCommitted(zxid);
}
```

## 应用场景

ZAB协议主要用于：
- Zookeeper集群的协调服务
- 分布式锁服务
- 配置管理
- 命名服务
- 集群管理等

ZAB通过其高效的设计，在保证强一致性的同时，提供了良好的性能，成为许多分布式系统的基石。