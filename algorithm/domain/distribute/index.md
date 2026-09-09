---
title: 分布式算法
date: 2025-07-11T00:58:09.918Z
category:
  - algorithm
  - domain
  - distribute
tags:
  - algorithm
  - domain
  - distribute
---

# 分布式算法
[[toc]]

## 雪花算法-SnowFlake
雪花算法是Twitter开发的一种分布式ID生成算法，以将 64-bit位分割成多个部分，每个部分代表不同的含义，用于在分布式系统中生成全局唯一且有序的ID。