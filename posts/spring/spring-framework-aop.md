---
title: Spring核心 - AOP
date: 2025-05-14T05:14:04.345Z
category:
  - Spring
  - Spring Framework
  - AOP
tags:
  - Spring
  - Spring Framework
  - AOP
---

# Spring核心 - AOP
[[toc]]

## AOP是什么
AOP是Aspect Oriented Programming的缩写，意为：面向切面编程。面向切面编程是指将相同逻辑的重复代码横向抽取出来，使用预编译、代理等技术将这些重复代码织入到目标对象方法中，实现和原来一样的功能。这样一来，我们就在写业务时只关心业务代码，而不用关心与业务无关的代码。

## AOP术语
- 连接点JoinPoint：方法的执行
- 织入Weaving：切面应用到目标对象的过程
  + 切面Aspect：应该使用哪个通知并在哪个关注点使用它
    * 切入点PointCut：匹配连接点的条件
    * 通知Advice：做什么+何时做
  + 目标对象Target ：真正执行业务的核心逻辑对象

:::tip
切面`Aspect`是设计概念，通知器`Advisor`是 Spring AOP 的实现方式：
+ 切面可以包含多个通知和切点
+ 通知器仅组合一个通知和一个切点
+ 在 Spring AOP 中，`@Aspect` 注解的类最终会被解析为多个 `Advisor` 对象
:::

### JoinPoint 连接点
连接点，程序运行中的一些时间点，是插入横切关注点的扩展点，连接点可能是类初始化、方法执行，异常处理等等。在 Spring AOP 中，JoinPoint 总是方法的执行点。

### PointCut 切入点
切入点决定通知应该作用于哪个连接点，可以认为是匹配连接点的条件。

### Advice 通知
定义在连接点做什么，为切面增强提供织入接口，Spring AOP 提供了五种通知类型：
+ @Before：在 JoinPoint 方法之前执行。
+ @AfterReturning：在连接点方法正常执行后执行。
+ @AfterThrowing：在 JoinPoint 方法通过抛出异常后执行。
+ @After：在连接点方法之后执行，无论方法退出是正常还是异常返回。
+ @Around：在连接点之前和之后执行。

### Aspect 切面
Aspect 由切入点和通知组成：切入点定义在哪里执行，通知定义何时执行以及在连接点干什么。

可以简单地认为, 使用 @Aspect 注解的类就是切面。

### Target 目标对象
目标对象，即真正执行业务的核心逻辑对象。

因为 Spring AOP 使用运行时代理的方式来实现 Aspect ，因此目标对象总是一个代理对象。

### AOP Proxy 代理对象
AOP代理，是客户端持有的增强后的对象引用，即AOP框架使用代理模式创建的对象，在Spring中，AOP代理可以用JDK动态代理或CGLIB代理实现。

### Weaving 织入
织入可以理解为切面应用到目标函数(类)的过程。一般分为静态织入和动态织入。

## Spring AOP的设计与实现
### AOP的实现方式
实现 AOP 的技术，主要分为两大类：

+ 静态代理 - 指使用 AOP 框架提供的命令进行编译，从而在编译阶段就可生成 AOP 代理类，因此也称为编译时增强
  - 编译时编织（特殊编译器实现）
  - 类加载时编织（特殊的类加载器实现）
+ 动态代理 - 在运行时在内存中“临时”生成 AOP 动态代理类，因此也被称为运行时增强。
  - JDK 动态代理(Proxy，底层通过反射实现)
  - CGLIB(底层通过继承实现)

### 两种动态代理区别
1. 若目标对象实现了若干接口，spring使用JDK的java.lang.reflect.Proxy类代理。
   1. 优点：因为有接口，所以使系统更加松耦合
   2. 缺点：为每一个目标类创建接口
2. 若目标对象没有实现任何接口，spring使用CGLIB库生成目标对象的子类。
   1. 优点：因为代理类与目标类是继承关系，所以不需要有接口的存在。
   2. 缺点：因为没有使用接口，所以系统的耦合性没有使用JDK的动态代理好。

### Spring AOP 和 AspectJ之间的关键区别
| 对比项 | Spring AOP | AspectJ |
| --- | --- | --- |
| 是否需要特殊编译器 | × | √ |
| 织入方式 | 运行时织入 | 编译时、编译后和加载时织入 |
| 切入点 | 方法 | 字段、方法、构造函数、静态初始值设定项、最终类/方法 |
| 对象 | Spring容器管理的bean上实现 | 所有域对象上实现 |


## AOP的配置方式
Spring AOP 支持对XML模式和基于@AspectJ注解的两种配置方式。

### XML配置
- `<aop:aspect>`定义切面
- `<aop:pointcut>` 定义切点
- `<aop:before>`、`<aop:after>`、`<aop:around>`  定义通知

```bash
<aop:config>
		<aop:aspect ref="operatorLoggerAop">
			<aop:pointcut id="pointCut" expression="(execution(* ..service..*(..))" />
			<aop:around method="logAround"  pointcut-ref="pointCut" />
		</aop:aspect>
	</aop:config>
```

### @AspectJ注解方式
- `@Aspect`定义切面
- `@Pointcut`定义切点
- `@Before`、`@After`、`@Around`定义通知

```java
@Aspect
@Component
public class XXXAspect {
	@Pointcut("@annotation(com.shcf.iomp.core.annotation.Crypt)")
	public void pointcut() {}

	@Around("pointcut()")
	public Object Around(ProceedingJoinPoint point) throws Throwable {
		...
		result = point.proceed()
		...
		return result;
	}
}
```

### 切点表达式
`execution` 是 Spring AOP 和 AspectJ 中最常用的切点表达式，用于精确匹配方法执行连接点。

#### 语法
:::tip 
execution（annotation-pattern? modifiers-pattern? ret-type-pattern declaring-type-pattern? name-pattern（param-pattern） throws-pattern?）
:::

| 组成部分 | 说明 | 示例 |
| --- | --- | --- |
| annotation-pattern | 注解修饰符（可选） | `@org.springframework.transaction.annotation.Transactional * *(..)` |
| modifiers-pattern | 访问修饰符（可选） | `public`	`protected`	`*` |
| ret-type-pattern | 返回值类型（必选） | `void``String`	`*` |
| declaring-type-pattern | 类路径（可选） | `com.example.service.*` |
| name-pattern | 方法名（必选） | `get*	`	`*` |
| param-pattern | 参数列表（必选） | `()`	`(..)`	`(String,*)` |
| throws-pattern | 异常类型（极少用） | `throws java.io.IOException` |

:::tip
常用通配符：
+ `*`：匹配任意字符（除包分隔符外）
+ `..`：
  - 在包路径中：匹配当前包及其子包（如 `com.example..*`）
  - 在参数列表中：匹配任意数量参数
+ `+`：匹配指定类型的子类型（如 `java.util.List+`）
+ `!`：不匹配指定类型（如`!void`匹配非void返回类型的方法）

:::

#### 使用实例
![](/images/spring/spring-framework-aop-execution.png)

```java
// 匹配所有public方法
execution(public * * (..))
// 匹配所有以get开头的方法
execution(* get*(..))
// 匹配com.example.service包下所有类的所有方法
execution (* com.example.service.*.*(..))
// 匹配com.example.service包及其子包下所有类的所有方法
execution (* com.example.service..*.*(..))
// 匹配带有@Transactional注解的方法
execution(@org.springframework.transaction.annotation.Transactional * *(..))
```