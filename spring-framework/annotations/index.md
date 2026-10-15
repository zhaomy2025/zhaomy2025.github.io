---
title: 注解
date: 2026-09-29
category:
  - spring
  - spring-framework
  - annotations
tags:
  - spring
  - spring-framework
  - annotations
---

# 注解

[[toc]]

Spring 用注解声明装配意图：哪些类是 Bean、依赖从哪来、容器该扫哪些包、某个能力开不开。

这一组讲的是这些注解**本身怎么工作**——容器在什么时候读到它，注解上的一行 `@Import`、一个属性，是怎么变成容器里的一次注册动作的。翻这一组的场合一般不是「该写哪个注解」（加一行就能用），而是「它为什么生效」「为什么没生效」。

本组文章以 Spring Framework 6.x 为准。

## [@Enable 系列注解](./enable-annotations.md)

- 这一族的共同形态：空注解加一行 `@Import`
- `@Import` 的三种落点，以及怎么按落点分辨一个没见过的 `@EnableXxx`
- `@EnableWebMvc` 为什么会让 Boot 的 MVC 自动配置整体失效

## @AliasFor 与组合注解

- 注解之间怎么共享与覆盖属性
- 自定义组合注解什么时候必须写 `@AliasFor`

## @Configuration 的全模式与轻量模式

- `@Bean` 方法互相调用为什么拿到同一个 Bean
- 关掉 CGLIB 增强（`proxyBeanMethods = false`）之后为什么会重复创建

## @ComponentScan 的过滤规则

- `includeFilters` / `excludeFilters` 与 `@Filter` 的五种类型
- `useDefaultFilters` 这个开关

## Bean 作用域与装配微调

- `@Scope` 与短命 Bean 注入长命 Bean 时的代理
- `@Lazy` 怎么破循环依赖、`@Primary`、`@DependsOn`
