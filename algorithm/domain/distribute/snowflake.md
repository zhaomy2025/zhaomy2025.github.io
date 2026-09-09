---
title: 雪花算法
date: 2025-07-11T01:54:09.061Z
category:
  - algorithm
  - domain
  - distribute
  - snowflake
tags:
  - algorithm
  - domain
  - distribute
  - snowflake
---

# 雪花算法
[[toc]]

## 简介

雪花算法是Twitter开发的一种分布式ID生成算法，以将 64-bit位分割成多个部分，每个部分代表不同的含义，用于在分布式系统中生成全局唯一且有序的ID。

## 算法原理
雪花算法的ID是一个64位的长整型数字，由以下几部分组成：
  1. 符号位(1位)：始终为0，保证生成的ID为正数
  2. 时间戳(41位)：精确到毫秒，可以使用约69年
  3. 数据中心ID(5位)：最多支持32个数据中心
  4. 机器ID(5位)：每个数据中心最多支持32台机器
  5. 序列号(12位)：每毫秒可以生成4096个ID

## 特点

1. 唯一性：在分布式系统中生成的ID全局唯一
2. 有序性：生成的ID随时间递增，有利于数据库索引
3. 高性能：本地生成，不依赖数据库或其他服务
4. 可扩展：通过配置不同的数据中心ID和机器ID支持横向扩展

## 实现示例 (Java)

```java
public class SnowflakeIdWorker {
    // 起始时间戳 (2020-01-01)
    private final long epoch = 1577836800000L;
    
    // 机器ID位数
    private final long workerIdBits = 5L;
    // 数据中心ID位数
    private final long datacenterIdBits = 5L;
    // 序列号位数
    private final long sequenceBits = 12L;
    
    // 最大机器ID
    private final long maxWorkerId = -1L ^ (-1L << workerIdBits);
    // 最大数据中心ID
    private final long maxDatacenterId = -1L ^ (-1L << datacenterIdBits);
    
    // 时间戳左移位数
    private final long timestampLeftShift = sequenceBits + workerIdBits + datacenterIdBits;
    // 数据中心ID左移位数
    private final long datacenterIdShift = sequenceBits + workerIdBits;
    // 机器ID左移位数
    private final long workerIdShift = sequenceBits;
    
    // 生成低 sequenceBits 位全为1的掩码，这里为4095 (0b111111111111=0xfff=4095)
    // -1L 的二进制表示是所有位都为1（即 111...111）
    // -1L << sequenceBits 将全1左移 sequenceBits 位，得到低 sequenceBits 位为0，其余位为1
    // 然后用全1与这个结果进行异或操作，相当于取反，得到低 sequenceBits 位为1，其余位为0
    private final long sequenceMask = -1L ^ (-1L << sequenceBits);
    
    private long workerId;
    private long datacenterId;
    private long sequence = 0L;
    private long lastTimestamp = -1L;
    
    public SnowflakeIdWorker(long workerId, long datacenterId) {
        if (workerId > maxWorkerId || workerId < 0) {
            throw new IllegalArgumentException("Worker ID超出范围");
        }
        if (datacenterId > maxDatacenterId || datacenterId < 0) {
            throw new IllegalArgumentException("Datacenter ID超出范围");
        }
        this.workerId = workerId;
        this.datacenterId = datacenterId;
    }
    
    /*
     * 获取下一个ID
     * */
    public synchronized long nextId() {
        long timestamp = timeGen();
        
        // 如果当前时间小于上一次ID生成的时间戳，说明系统时钟回退过，这个时候应当抛出异常
        if (timestamp < lastTimestamp) {
            throw new RuntimeException("时钟回拨");
        }
        
        // 如果是同一时间生成的，则进行毫秒内序列
        if (lastTimestamp == timestamp) {
            sequence = (sequence + 1) & sequenceMask;
            // 毫秒内序列溢出，则等待下一毫秒
            if (sequence == 0) {
                timestamp = tilNextMillis(lastTimestamp);
            }
        } else {
            sequence = 0L;
        }
        
        lastTimestamp = timestamp;
        // 移位并通过或运算拼到一起
        return ((timestamp - epoch) << timestampLeftShift)
                | (datacenterId << datacenterIdShift)
                | (workerId << workerIdShift)
                | sequence;
    }
    
    /**
     * 阻塞到下一个毫秒，直到获得新的时间戳
     */
    private long tilNextMillis(long lastTimestamp) {
        long timestamp = timeGen();
        while (timestamp <= lastTimestamp) {
            timestamp = timeGen();
        }
        return timestamp;
    }
    
    /**
     * 返回以毫秒为单位的当前时间
     */
    private long timeGen() {
        return System.currentTimeMillis();
    }
}
```

## 优缺点

优点：
- 不依赖第三方系统，性能高
- ID趋势递增，适合作为数据库主键
- 可根据业务需求灵活调整各部分的位数

缺点：
- 依赖机器时钟，如果时钟回拨会导致ID重复
- 数据中心ID和机器ID需要手动配置

## 应用场景

雪花算法广泛应用于需要分布式ID生成的场景，如：
- 分布式系统中的主键生成
- 订单号生成
- 消息ID生成
- 日志追踪ID等