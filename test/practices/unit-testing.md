---
title: 单元测试最佳实践
date: 2026-10-12
category:
  - test
  - practices
tags:
  - test
  - unit-testing
  - spring
  - mockito
---

# 单元测试最佳实践

[[toc]]

单元测试是只验证一个类、一个方法的测试：把它的外部依赖（数据库访问、远程调用等）换成假的实现，只关注它自己的逻辑对不对。它跑得最快、出问题时定位得最准，是自动化测试里数量最多的一层。下面记录写单元测试时的几条实践，先从「依赖怎么注进来才好测」说起。

## 构造器注入让单元测试更好写

写 Service 层的单元测试时，被测类依赖的仓库、缓存、HTTP 客户端都要换成假实现（mock），只测它自己的逻辑。这时**依赖是怎么注进来的，直接决定测试好不好写**——Spring 官方推荐构造器注入，其中一条理由正是「方便测试」。

官方原文（Spring Framework Reference，讲依赖注入一节）：依赖由外部提供、而不是类自己去查找，会让类「easier to test, particularly when the dependencies are on interfaces or abstract base classes, which allow for stub or mock implementations to be used in unit tests」——大意是：依赖是接口或抽象类时，测试可以用假实现（stub / mock）顶替，类本身就好测了。同一页讲构造器注入时又说，这样的类「is a POJO that has no dependencies on container specific interfaces, base classes, or annotations」，也就是它不依赖容器，测试里自己 `new` 出来就行。

::: tip 出处
Spring Framework Reference，Core Technologies → The IoC Container → Dependencies → Dependency Injection：
<https://docs.spring.io/spring-framework/reference/core/beans/dependencies/factory-collaborators.html>
:::

三种注入方式在测试里的差别：

- **构造器注入**：依赖是构造函数的参数。测试里直接 `new UserService(mockRepo)`，把假实现当参数传进去就行——不用启动 Spring，也不用反射。
- **字段注入**（`@Autowired` 直接打在字段上）：依赖是私有字段，没有构造参数可以传。测试里只能靠反射去改这个字段，或者干脆把 Spring 上下文启起来让它注入。Spring 自己的测试工具 `ReflectionTestUtils` 就是为「改私有字段」这类场景准备的（官方 Unit Testing 页面把它列为用来「set a non-public field」的工具）；两条路都比构造器注入重。
- **setter 注入**：依赖通过 setter 传入，测试里直接调 setter 就能换掉，比字段注入轻。代价是依赖变成了「可选」——对象可能带着还没设好的依赖就被建出来，Spring 也只建议用它注入可有可无的依赖。

所以「便于单元测试」是构造器注入最实在的优点之一：依赖必须从构造参数进来，测试里就能像拼普通对象一样把它拼出来，完全不牵扯容器。
