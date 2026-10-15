---
title: Spring Boot 热部署
date: 2026-09-23
category:
  - spring
  - spring-boot-hot-deploy
tags:
  - spring
  - spring-boot-hot-deploy
---

# Spring Boot 热部署
[[toc]]

改一行代码就要重启应用，开发期很磨人。Spring Boot 生态里有两条路子，但机制和代价完全不同：devtools 的重启和 JVM 层面的类重定义。

本文讲的是跨版本稳定的机制，不绑定具体版本。

## devtools 的自动重启不是热部署

`spring-boot-devtools` 会在 classpath 变化时自动重启应用，实现方式是**两个类加载器**：不变的依赖交给 base classloader，项目自己的类交给 restart classloader，重启时只丢弃后者再重建。所以它比重启整个 JVM 快得多，但本质上仍是一次应用上下文的重建——单例 Bean 重新创建，内存里的状态、连接池、会话全部丢失。这也是它不能算热部署的原因。

触发重启的前提是**更新 classpath**，也就是必须重新编译：

| 工具 | 触发方式 |
| --- | --- |
| IDEA | `Build → Build Project` |
| Maven | `mvn compile` |
| Gradle | `gradle build` |

静态资源、视图模板这类内容不需要重启，devtools 直接处理。

已知的坑：

- 双类加载器在多模块项目里可能引起类加载问题，这类问题可以先停掉 restart 功能排查；确认是它引起的，就把整个项目纳入 restart classloader
- 与 AspectJ weaving 不兼容
- 依赖应用上下文的 shutdown hook，如果调过 `SpringApplication.setRegisterShutdownHook(false)`，重启不会正常工作
- 检测到 JRebel 时会自动关闭自己的重启功能，改用 JRebel 的动态类重载

## IDEA 的 HotSwap

JVM 通过 JVMTI 提供类重定义（RedefineClasses）能力，IDEA 在 **Debug 模式**下用它实现 HotSwap：重新编译后把新的类字节码直接替换进运行中的 JVM，不重启上下文，应用状态全部保留。

设置项和配套操作：

```text
Settings → Build, Execution, Deployment → Debugger → HotSwap
```

建议配合自动编译，在 `Run/Debug Configurations` 里设置：

| 项 | 值 |
| --- | --- |
| On Update action | Update class and resources |
| On frame deactivation | Update class and resources |

手动触发编译用 `Ctrl + F9`。

## HotSwap 能改什么

JVMTI 规范对类重定义的约束是明确的（原文：*The redefinition must not add, remove or rename fields or methods, change the signatures of methods, change modifiers, or change inheritance*），可以改方法体、常量池和属性，其余一概不行：

| 改动 | HotSwap |
| --- | --- |
| 方法体内部逻辑 | ✅ |
| 新增 / 删除字段、方法 | ❌ |
| 修改方法签名、修饰符 | ❌ |
| 调整继承关系、`NestHost` / `Record` 等结构性属性 | ❌ |

还有一条容易被忽略：规范写明 *Instances of the redefined class are not affected — fields retain their previous values*。已经创建的对象保留旧字段值，新加载的逻辑读到的是旧数据，排查问题时容易误判。

::: warning 结构改动只能重启
HotSwap 改不了类结构，加字段、加方法、换父类都必须重启。要突破这个限制得靠 JRebel、DCEVM 这类工具。
:::

## 怎么选

两条路子的差别集中在生效范围、速度和应用状态上，按改动类型选：

| 维度 | devtools 自动重启 | HotSwap |
| --- | --- | --- |
| 生效范围 | 任何改动，含新增类与字段 | 只能改方法体 |
| 速度 | 秒级，重建上下文 | 毫秒级，只换类 |
| 应用状态 | 丢失 | 保留 |
| 触发方式 | classpath 更新（`Build Project`） | Debug 模式下重新编译 |
| 主要限制 | 多模块类加载问题、与 AspectJ 不兼容 | 改不了类结构 |

日常调业务逻辑用 HotSwap，改结构或调依赖时切回 devtools 重启。两者可以同时开着——HotSwap 处理能处理的，处理不了的攒够了再手动触发一次重启。
