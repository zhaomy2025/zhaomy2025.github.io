---
title: Spring Boot 知识体系
date: 2025-05-14
category:
  - Spring
  - Spring Boot
tags:
  - Spring
  - Spring Boot
---

# Spring Boot 知识体系
[[toc]]

Spring Boot 在 Spring Framework 之上做了自动配置和 starter 依赖：引入一个依赖，它按约定把相关组件配好，开发者只写与约定不同的那部分配置。这一组从最小可运行的应用讲起，再拆开配置、profile、Web 支持这些自动配置最常碰到的能力，以及启动流程里能插手的回调接口——按「先跑起来、再看内部」的顺序排。

本组文章以 Spring Boot 3.x 为准。

## [Spring Boot 入门](./spring-boot-hello-world.md)

  <!-- @include: ./spring-boot-hello-world-section.md -->

## [Spring Boot 配置](./spring-boot-config.md)
## [Spring Boot Profile 机制](./spring-boot-profile.md)
## [Spring Boot 的 Web 支持](./spring-boot-web.md)
## [Spring 与 Spring Boot 回调接口](./boot-callbacks/)
## [Spring Boot 热部署](./spring-boot-hot-deploy.md)
## [Spring Boot 集成 Redis](./spring-boot-redis.md)

  <!-- @include: ./spring-boot-redis-section.md -->

## [Spring Boot 集成 Oracle（JPA、MyBatis、MyBatis-Plus）](./spring-boot-oracle.md)
## [Spring Boot 集成 HikariCP](./spring-boot-hikaricp.md)
## [Spring Boot 常见错误及解决方案](./spring-boot-faq.md)
## Spring Boot 集成日志
## Spring Boot 集成缓存
## Spring Boot 集成消息队列
## Spring Boot 集成通知（Email、短信、微信）
## Spring Boot 集成 Websocket
## Spring Boot 集成定时任务
## Spring Boot 集成视图解析
## Spring Boot 集成工作流引擎
## Spring Boot 集成监控
## Spring Boot 应用部署
