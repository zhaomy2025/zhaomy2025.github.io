---
title: Spring核心 - IoC容器
date: 2025-05-08T08:49:38.561Z
category:
  - Spring
  - Spring Framework
  - IoC
tags:
  - Spring
  - Spring Framework
  - IoC
---

# Spring核心 - IoC容器
[[toc]]
## 容器概述
`ApplicationContext` 接口代表 Spring IoC 容器，容器通过读取配置元数据获取指令来实例化、配置并组装 Bean。  
Spring 有两种IoC容器：`BeanFactory` 和 `ApplicationContext`。
- BeanFactory就像一个包含 Bean 集合的工厂类。
- ApplicationContext 接口扩展了 BeanFactory 接口，它在 BeanFactory 基础上提供了一些额外的功能。
### ApplicationContext
`ApplicationContext`内置如下功能：
- MessageSource：管理 Message ，实现国际化等功能。
- ApplicationEventPublisher：事件发布。
- ResourcePatternResolver：多资源加载。
- EnvironmentCapable：系统 Environment（profile + Properties）相关。
- Lifecycle：管理生命周期。
- Closable：关闭，释放资源
- InitializingBean：自定义初始化。
- BeanNameAware：设置 beanName 的 Aware 接口。

`ApplicationContext`接口有以下几个主要实现类：
- 从注解类中加载配置元数据
  + `AnnotationConfigApplicationContext`：从Java配置类中加载配置元数据
  + `AnnotationConfigWebApplicationContext`：从Java配置类中加载配置元数据，并支持 Web 应用
- 从XML配置文件中加载配置元数据
  + `ClassPathXmlApplicationContext`：从类路径下加载XML配置文件
  + `FileSystemXmlApplicationContext`：从文件系统中加载XML配置文件
  + `XmlWebApplicationContext`：从XML配置文件中加载配置元数据，并支持 Web 应用
- 从Groovy脚本中加载配置元数据
  + `GenericGroovyApplicationContext`：从Groovy脚本中加载配置元数据
- Spring Boot 使用的 ApplicationContext 容器
  + ConfigServletWebServerApplicationContext
  
  独立应用程序中通常创建`AnnotationConfigApplicationContext`和`ClassPathXmlApplicationContext`实例。

### BeanFactory 和 ApplicationContext 的区别
|特性|BeanFactory|ApplicationContext|
|-|-|-|
|何时实例化Bean|在客户端要求时实例化 Bean 对象|自动初始化非懒加载的 Bean 对象们|
|如何管理资源对象|使用语法显式提供资源对象|自己创建和管理资源对象|

默认情况下 ApplicationContext 实现会预先实例化单例 bean，这样可以ApplicationContext 创建时发现配置问题。
## 配置元数据
配置元数据可以表示为带注解的组件类、具有工厂方法的配置类、外部 XML 文件或 Groovy 脚本（不常用）。Spring IoC 容器通过读取配置元数据获取指令，实例化、配置并组装 Bean。
### IoC 配置方式
Ioc配置关注如何定义和组装Bean，即告诉 Spring 容器如何管理对象及其依赖关系。根据配置元数据的不同，常用的IoC配置可以分为XML配置、Java配置类和注解配置三种方式：
- 优先使用**注解配置** ：在应用程序的组件类上使用基于注解的配置元数据定义 bean。（`@CompentScan` + `@Component`）
  + 当前项目可用，但在starter中一般不用这种方法（`@Component`文件中有包名，不能直接复用）
- 复杂配置结合**Java配置类**：在Java配置类上定义应用程序外部的bean。(`@Configuration`+`@Bean`)
  + starter中常用的方法
- 逐步淘汰**XML配置**（`@importResource`+XML文件）
#### Java配置类
默认加载启动类所在包的配置类，可通过以下方式加载其他包的配置类：
- 通过 @Import 显式导入配置类
- 通过 @ComponentScan 扩展扫描路径
- 通过 @SpringBootApplication(scanBasePackages) 扩展扫描路径


#### XML配置
XML配置不推荐使用，具体用法参考[官方文档](https://docs.spring.io/spring-framework/reference/core/beans/basics.html)，这里只给出一些使用建议并介绍常见的一些XML配置文件。  
使用建议：
- 避免使用相对路径引用上级目录的资源文件，推荐使用绝对路径
- 更换环境时资源的绝对路径可能会变更，可以考虑使用占位符`${…}`
## Bean
bean 覆盖将在未来的版本中弃用。
Bean 可以通过 id 或 name 属性进行命名，id 是唯一标识，name 是别名，支持多个别名，用逗号、分号或空格分隔。  
如果没有显式地提供 name 或 id，容器将为该 bean 生成一个唯一名称：取简单类名并将其首字母转换为小写；当有多个字符且第一和第二个字符都是大写时，会保留原始的大小写。  
在基于 XML 的配置元数据中，可以使用 `<alias/>` 元素为定义在其他地方的 bean 引入一个别名。  
如果你使用 Java 配置，可以使用 @Bean 注解来提供别名。  
虽然可以通过`getBean()`方法直接从IoC容器中获取Bean，但推荐使用依赖注入的方式，即通过构造器或setter方法注入依赖。
### Bean生命周期
|生命周期阶段|描述|方法|属性|注解|
|-|-|-|-|-|
|实例化|初始化回调方法|setup|init-method|@PostConstruct|
|实例化|卸载前回调方法|teardown|destroy-method|@PreDestroy|
## 依赖注入
### 依赖注入方式
依赖注入关注如何将依赖对象注入到目标 Bean 中，支持构造器注入、setter注入、字段注入三种方式：
  - 强制依赖使用**构造器注入**（Spring 4.3+可省略`@Autowired`）
  - 可选依赖使用**Setter注入**
  - 避免使用**字段注入**
注：还有一种分类方式：构造器注入、接口注入、Setter注入。在现代依赖注入框架(如Spring)中，接口注入的使用已经不太常见。
### 自动装配
自动装配是依赖注入的自动化实现形式，依赖注入是自动装配的设计目标。

#### 自动装配类型
Spring支持四种自动装配类型：
- byName：通过参数名自动装配。
- byType：通过参数类型自动装配，如果有多个bean符合条件，则抛出错误。
- constructor：通过构造器参数类型自动装配，如果没有确定的带参数的构造器参数类型，将会抛出异常。
- autodetect：首先尝试使用constructor来自动装配，如果无法工作，则使用byType方式。

注：默认的方式是不进行自动装配，通过显式设置ref 属性来进行装配。
#### 自动装配注解
Spring支持的用于自动装配的注解：
  - Spring自带的@Autowired注解
    + 当有多个同类型Bean时，配合@Qualifier注解使用按名称装配    
    + 或者配合@Primary注解使用，指定首选Bean
  - JSR-330的@Inject注解
    + 当有多个同类型Bean时，配合@Named注解使用按名称装配
  - JSR-250的@Resource注解
    +  默认按名称装配，当找不到与名称匹配的bean才会按类型装配
  
强制依赖：依赖关系必须存在，若不存在，则会抛出异常。  
可选依赖：设置required=false表明配置是可选的，如果没有匹配的Bean，容器不会抛出异常。   

|注解|来源|使用范围|是否支持可选依赖|默认依赖注入方式|限定歧义性的依赖|
|-|-|-|-|-|-|
|@Autowired|Spring|字段、构造器、方法|支持|类型|@Qualifier、@Primary|
|@Inject|JSR-330|字段、构造器、方法|不支持|类型|@Named|
|@Resource|JSR-250|字段、方法|不支持|名称->类型|通过name属性指定Bean名称|


## 常见问题
### IoC 和 DI 的区别
### Ioc配置和依赖注入的关系？
Ioc配置关注如何定义和组装Bean，即告诉 Spring 容器如何管理对象及其依赖关系；依赖注入关注如何将依赖对象注入到目标 Bean 中。可以认为依赖注入是IoC配置的一部分，不同配置方式支持的注入方式不同：
- XML配置支持构造器注入和Setter注入方式
- Java配置类通常使用构造器注入（`@Configuration`+`@Bean`+方法参数）
- 注解配置可以指定任一种注入方式（构造器/Setter/字段）
### IoC 的实现机制
工厂模式 + 反射机制