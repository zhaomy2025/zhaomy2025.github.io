---
title: Spring Framework知识体系
date: 2025-05-07T02:03:48.388Z
category:
  - Spring
  - Spring Framework
  - AOP
tags:
  - Spring
  - Spring Framework
  - AOP
---

# Spring Framework知识体系
[[toc]]
## Spring概述
### 什么是Spring？
Spring是构建于Java平台之上的一个开源的控制反转(IoC)和面向切面(AOP)的容器框架。  
### Spring的主要目的是什么？
Spring的主要目的是为了简化Java企业级应用的开发。  

### Spring有哪些特性？
1. 控制反转（IoC：Inversion of Control）：将对象的创建权交给Spring容器管理，而不是由程序代码直接创建对象，由容器负责管理组件的生命周期。  
2. 依赖注入（DI：Dependency Injection）：是指依赖的对象不需要手动调用 setXX 方法去设置，而是通过配置赋值实现，将对象之间的依赖关系交给Spring容器管理。  
3. 面向切面编程（AOP：Aspect-Oriented Programming）：是一种通过预编译和运行期动态代理实现程序功能的一种技术。通过利用容器提供的AOP技术很容易实现如权限拦截、运行期监控等功能。  
4. 可以使用容器提供的众多服务，如：事务管理服务、消息服务等等。当我们使用容器管理事务时，开发人员就不再需要手工控制事务。也不需处理复杂的事务传播。  
5. 容器提供的众多辅作类，使用这些类能够加快应用的开发，如： JdbcTemplate、 HibernateTemplate。Spring对于主流的应用框架提供了集成支持，如：集成Hibernate、JPA、Struts等，这样更便于应用的开发。  

### Spring的核心是什么？
Spring的核心是IoC和AOP。下面给出Ioc和AOP的常见问题，可以先思考一下，在后面章节再详细介绍。
#### IoC（Inversion of Control）
- 如何理解IoC（Ioc是什么？Ioc能做什么？IoC的优点有哪些？） 
- IoC和DI的关系（IoC是设计思想，DI是实现方式）
- Ioc配置的三种方式（XML配置、Java配置类、注解配置）
- 依赖注入的三种方式（构造器注入、Setter注入、字段注入）
    + 为什么推荐构造器注入？
    + 构造器注入太多类导致 bad smell 怎么解决？
    + @Autowired、@Resource 和 @Inject 等注解注入区别？
- Ioc配置的三种方式和依赖注入的三种方式的对应关系？
- Spring IoC的实现原理
- Spring IoC的体系结构
  + BeanDefinition
  + BeanRegistry
  + BeanFactory
  + ApplicationContext
- Spring IoC的初始化流程 
- Bean的生命周期
### Spring有哪些组件？
#### 核心容器
Beans：提供了框架的基础部分，包括控制反转和依赖注入。 BeanFactory 接口是Beans模块的核心接口。   
Core：封装了 Spring 框架的底层部分，包括资源访问、类型转换及一些常用工具类。  
Context：集成 Beans 模块功能并添加资源绑定、数据验证、消息资源处理（国际化）、Java EE 支持、容器生命周期、事件传播等。ApplicationContext 接口是上下文模块的焦点。  
SpEL：提供了强大的表达式语言，支持访问和修改属性值、对象方法调用，支持从Spring容器中获取对象。  

#### 数据访问/集成
1. JDBC (Java DataBase Connectivity)：提供了JDBC的样例模板，能消除传统冗长的 JDBC 编码还有必须的事务控制，简化了对关系数据库的访问。  
2. ORM (Object Relational Mapping)：提供与ORM框架无缝集成的API，支持 JPA、JDO、Hibernate 和 MyBatis 等。JPA 是一个 Java 持久化 API 。  
3. OXM (Object XML Mappers)：提供了一个支持 Object /XML 映射的抽象层实现，如 JAXB、Castor、XMLBeans、JiBX 和 XStream。用来将 Java 对象映射成 XML 数据，或者将XML 数据映射成 Java 对象，有时候也成为 XML 的序列化和反序列化。用的比较少，了解下即可。  
4. JMS: 指 Java 消息服务，提供一套 “消息生产者、消息消费者”模板用于更加简单的使用 JMS，JMS 用于用于在两个应用程序之间，或分布式系统中发送消息，进行异步通信。  
5. TransactionSpring ：简单而强大的事务管理功能，包括声明式事务和编程式事务。 
#### Web  
1. Web 模块：提供了基本的 Web 开发集成特性，例如多文件上传功能、使用的 Servlet 监听器的 IOC 容器初始化以及 Web 应用上下文。  
2. Servlet：提供了一个 Spring MVC Web 框架实现。Spring MVC 框架提供了基于注解的请求资源注入、更简单的数据绑定、数据验证等及一套非常易用的 JSP 标签，完全无缝与 Spring 其他技术协作。  
3. WebSocket：Spring 4.0 引入了对 WebSocket 的支持，用户只要实现响应的接口就可以快速的搭建 WebSocket Server，从而实现双向通讯。  
4. WebFlux：Spring Framework 5.x中引入的新的响应式web框架。与Spring MVC不同，它不需要Servlet API，是完全异步且非阻塞的，并且通过Reactor项目实现了Reactive Streams规范。Spring WebFlux 用于创建基于事件循环执行模型的完全异步且非阻塞的应用程序。  
#### AOP、Aspects、Instrumentation和Messaging  
1. AOP：提供了面向切面编程实现，提供比如日志记录、权限控制、性能统计等通用功能和业务逻辑分离的技术，并且能动态的把这些功能添加到需要的代码中，这样各司其职，降低业务逻辑和通用功能的耦合。  
2. Aspects：提供与 AspectJ 的集成，是一个功能强大且成熟的面向切面编程（AOP）框架。  
3. Instrumentation：该层为类检测和类加载器实现提供支持。用的比较少，了解下即可。  
4. Messaging 模块：Spring 4.0 以后新增了消息（Spring-messaging）模块，该模块提供了对消息传递体系结构和协议的支持。  
5. Jcl： Spring 5.x中新增了日志框架集成的模块。  
#### Test  
1. Spring Test：提供了对 JUnit 和 TestNG 测试框架的支持，包括 Spring 的测试上下文、Spring MVC 测试、WebFlux 测试等，还提供了一些基于 Spring 的测试功能，比如在测试 Web 框架时，模拟 Http 请求的功能。

### Spring中有哪些设计模式？
#### 工厂模式
Spring中有很多地方使用了工厂模式，比如BeanFactory、ApplicationContext等。BeanFactory是Spring的核心接口，它负责实例化、定位、配置应用程序中的对象，实现类有XmlBeanFactory、DefaultListableBeanFactory等。

#### 模板模式
模板模式是一种行为型设计模式，它定义一个操作中的算法的骨架，而将一些步骤延迟到子类中。模板方法使得子类可以不改变一个算法的结构即可重定义该算法的某些特定步骤。
Spring中有很多地方使用了模板模式，比如JdbcTemplate、HibernateTemplate、RedisTemplate等。

#### 观察者模式
观察者模式定义了对象之间的一对多依赖，当对象改变状态时，依赖它的对象会收到通知并自动更新。Spring的事件驱动模型就是观察者模式的应用。
Spring中有很多地方使用了观察者模式，比如ApplicationEvent、ApplicationListener、MessageSource等。

#### 适配器模式
适配器模式将一个类的接口转换成客户希望的另一个接口，使得原本由于接口不兼容而不能一起工作的两个类可以一起工作。
- Spring的AOP就是适配器模式的应用。
- Spring MVC的适配器模式：HandlerAdapter接口用于适配处理器（Controller、ViewResolver等）的请求
  
#### 总结
Spring的设计模式主要有工厂模式、模板模式、观察者模式、适配器模式。这些设计模式应用于不同的场景，比如BeanFactory用于实例化对象，模板模式用于简化代码，观察者模式用于事件驱动，适配器模式用于AOP。但这些设计模式的实现方式是有共性的，都是基于封装、继承、多态三大特性来实现的。

工厂模式、模板模式、观察者模式都是在接口/父类中定义了一些通用的方法，子类可以根据需要重写这些方法，从而实现不同的功能。例如工厂模式覆盖了创建对象的过程，模板模式重写了算法的部分步骤，观察者模式重写了接收通知后的处理过程。

适配器模式的实现方式是通过继承或组合的方式，将一个类的接口转换成客户希望的另一个接口。