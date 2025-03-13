---
title: Java注解机制
date: 2025-03-13 15:52:02
tags:
  - Java
  - Java中级
  - Java注解
categories:
  - Java
  - Java中级
---
# 介绍
注解（Annotation）是Java5引入的一个特性，本质是一个继承了`java.lang.annotation.Annotation`的接口。通过 Java 的反射机制相关 API 来访问注解信息，框架或工具中的类可以根据这些信息来决定如何使用程序元素或改变它们的行为。

注解通常应应用于 `public` 方法上，这是由 AOP（面向切面编程）的本质决定的。如果注解应用于 `protected` 或 `private` 方法上，可能会被忽略。

## 主要作用
1. 生成文档，通过代码里标识的元数据生成javadoc文档。
2. 编译检查，通过代码里标识的元数据让编译器在编译期间进行检查验证。
3. 编译时动态处理，编译时通过代码里标识的元数据动态处理，例如动态生成代码。
4. 运行时动态处理，运行时通过代码里标识的元数据动态处理，例如使用反射注入实例。

## 注解分类
注解可以分为以下三类：

+ Java自带的标准注解，包括@Override、@Deprecated和@SuppressWarnings
    - @Override用于标明重写某个方法
    - @Deprecated用于标明某个类或方法过时
    - @SuppressWarnings用于标明要忽略的警告
+ 元注解，元注解是用于定义注解的注解，包括@Retention、@Target、@Inherited、@Documented
    - @Retention用于标明注解被保留的阶段
    - @Target用于标明注解使用的范围，如方法、类、接口等
    - @Inherited用于标明注解可继承
    - @Documented用于标明是否生成javadoc文档
+ 自定义注解，可以根据自己的需求定义注解，并可用元注解对自定义注解进行注解

# Java内置注解
## @Override
```java
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.SOURCE)
public @interface Override {
}
```

## @Deprecated
```java
@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target(value={CONSTRUCTOR, FIELD, LOCAL_VARIABLE, METHOD, PACKAGE, PARAMETER, TYPE})
public @interface Deprecated {
}
```

该注解能够保留到运行时。

## @SuppressWarnings
```java
@Target({TYPE, FIELD, METHOD, PARAMETER, CONSTRUCTOR, LOCAL_VARIABLE})
@Retention(RetentionPolicy.SOURCE)
public @interface SuppressWarnings {
    String[] value();
}
```

可以取得值：

+ all：抑制所有警告
+ boxing：抑制装箱、拆箱操作时候的警告
+ cast：抑制映射相关的警告
+ dep-ann：抑制启用注释的警告
+ deprecation：抑制过期方法警告
+ fallthrough：抑制确在switch中缺失breaks的警告
+ finally：抑制finally模块没有返回的警告
+ hiding：抑制与隐藏变数的局部变量相关的警告
+ incomplete-switch：忽略没有完整的switch语句
+ nls：忽略非nls格式的字符
+ null：忽略对null的操作
+ rawtype：使用generics时忽略没有指定相应的类型
+ restriction：抑制与使用不建议或禁止参照相关的警告
+ serial：忽略在serializable类中没有声明serialVersionUID变量
+ static-access：抑制不正确的静态访问方式警告
+ synthetic-access：抑制没有按最优方法访问内部类的警告
+ unchecked：抑制没有进行类型检查操作的警告
+ unqualified-field-access：抑制没有权限访问的域的警告
+ unused：抑制没被使用过的代码的警告



# 元注解
在JDK 1.5中提供了4个标准的元注解：@Target，@Retention，@Documented，@Inherited, 在JDK 1.8中提供了两个元注解 @Repeatable和@Native。

## @Target
`@Target`注解的作用是：描述注解的使用范围（即：被修饰的注解可以用在什么地方） 。它的取值范围定义在ElementType 枚举中。

```java
public enum ElementType { 
    TYPE, // 类、接口、枚举类 
    FIELD, // 成员变量（包括：枚举常量） 
    METHOD, // 成员方法 
    PARAMETER, // 方法参数
    CONSTRUCTOR, // 构造方法
    LOCAL_VARIABLE, // 局部变量
    ANNOTATION_TYPE, // 注解类
    PACKAGE, // 包
    TYPE_PARAMETER, // 类型参数，JDK 1.8 新增 
    TYPE_USE // 使用类型的任何地方，包括TYPE和TYPE_PARAMETER，JDK 1.8 新增 
}
```

## @Retention
Reteniton注解的作用是：描述注解保留的时间范围（即：被描述的注解在它所修饰的类中可以被保留到何时） 。一共有三种策略，定义在RetentionPolicy枚举中。

```java
public enum RetentionPolicy { 
    SOURCE,    // 源文件保留，，当Java文件编译成class文件的时候，注解被遗弃
    CLASS,       // 编译期保留，jvm加载class文件时候被遗弃，默认值
    RUNTIME   // 运行期保留，可通过反射去获取注解信息
}
```

## @Documented
Documented注解的作用是：描述在使用 javadoc 工具为类生成帮助文档时是否要保留其注解信息。

## @Inherited
Inherited注解的作用：被它修饰的Annotation将具有继承性。如果某个类使用了被@Inherited修饰的Annotation，则其子类将自动具有该注解。

## @Repeatable
什么是重复注解：允许在同一申明类型(类，属性，或方法)上多次使用同一个注解。

### JDK8之前
java 8之前也有重复使用注解的解决方案，但可读性不是很好。

```java
public @interface Authority {
     String role();
}
public @interface Authorities {
    Authority[] value();
}
public class RepeatAnnotationUseOldVersion {
  @Authorities({@Authority(role="Admin"),@Authority(role="Manager")})
  public void doSomeThing(){
  }
}
```

### Jdk8重复注解
```java
@Repeatable(Authorities.class)
public @interface Authority {
     String role();
}

public @interface Authorities {
    Authority[] value();
}

public class RepeatAnnotationUseNewVersion {
    @Authority(role="Admin")
    @Authority(role="Manager")
    public void doSomeThing(){ }
}
```

## @Native
使用 @Native 注解修饰成员变量，则表示这个变量可以被本地代码引用，不常使用。

# 自定义注解
## 定义注解
```java
@Target({ElementType.TYPE, ElementType.FIELD, ElementType.METHOD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface AddPermission {
    
}
```

## 处理逻辑（AOP）
AOP（面向切面编程）通过注解实现横切关注点的分离。

1. 创建一个切面类，使用@Aspect标注
2. 在切面类中通过@Pointcut定义切入点
3. 在切面类中通过@Before、@After，@Around等定义通知
4. 使用AspectJProxyFactory结合@Ascpect标注的类，来生成代理对象

```java
@Aspect
@Component
public class AddPermissionAspect {
    @Pointcut("execution(* com.my.service..*.*(..))")
    public void controllerInteceptor() {}

    @Around("controllerInteceptor()")
    public Object around(ProceedingJoinPoint proceedingJoinPoint) throws Throwable {
        Method targetMethod = ((MethodSignature) proceedingJoinPoint.getSignature()).getMethod();
        if (Objects.isNull(targetMethod.getAnnotation(AddPermission.class))) {
            return proceedingJoinPoint.proceed();
        }
    }
}
```

@Aspect：切面，标注在类上。它里面包含切入点(Pointcut)和通知（Advice）。

@Pointcut：切入点。表示需要切入的位置，比如某些类或者某些方法，也就是先定一个范围。

@Before：Advice（通知）的一种，切入点的方法体执行之前执行。

@Around：Advice（通知）的一种，环绕切入点执行也就是把切入点包裹起来执行。

@After：Advice（通知）的一种，在切入点正常运行结束后执行。

@AfterReturning：Advice（通知）的一种，在切入点正常运行结束后执行，异常则不执行

@AfterThrowing：Advice（通知）的一种，在切入点运行异常时执行。

### 示例
```java
// 符合条件的目标方法时带有@MetricTime注解的方法
@Around("@annotation(metricTime)")
public Object doLogging(ProceedingJoinPoint pjp) throws Throwable {
    System.err.println("[Around] start " + pjp.getSignature());
    Object retVal = pjp.proceed(); // @Around可以决定是否执行目标方法
    System.err.println("[Around] done " + pjp.getSignature());
    return retVal;
}
```

# 底层实现原理
注解的底层实现依赖于动态代理。当通过反射获取注解时，Java 会生成一个实现了注解接口的动态代理类。这个代理类负责存储注解的属性值，并在调用注解方法时返回这些值。

注解的解析和动态代理对象的创建是通过 AnnotatedElement 接口实现的。Class、Method、Field 等类都实现了 AnnotatedElement 接口，提供了获取注解信息的方法，如 getAnnotation()、getAnnotations() 等。

当调用 getAnnotation() 方法时，Java 会通过 AnnotationParser 解析类的字节码，从常量池中提取注解信息，并将其封装为动态代理对象返回。

## AnnotatedElement
`AnnotatedElement` 是 Java 反射 API 中的一个接口，用于表示可以被注解修饰的程序元素。它提供了访问注解的方法，允许在运行时读取类、方法、字段等元素上的注解信息。

###  `AnnotatedElement` 的实现类
`AnnotatedElement` 接口由以下类和接口实现：
+ `Class`: 类或接口
+ `Method`: 方法
+ `Field`: 字段
+ `Constructor`: 构造函数
+ `Package`: 包
+ `Parameter`: 方法参数（JDK 8 引入）
+ `AccessibleObject`: 可访问对象（`Method`、`Field`、`Constructor` 的父类）
---

### `AnnotatedElement` 的核心方法
`AnnotatedElement` 接口定义了以下核心方法：

| 方法签名 | 说明 |
| --- | --- |
| `<T extends Annotation> T getAnnotation(Class<T> annotationClass)` | 返回指定类型的注解，如果不存在则返回 `null`。 |
| `Annotation[] getAnnotations()` | 返回当前元素上的所有注解（包括继承的注解）。 |
| `<T extends Annotation> T[] getAnnotationsByType(Class<T> annotationClass)` | 返回指定类型的注解数组（支持重复注解）。 |
| `<T extends Annotation> T getDeclaredAnnotation(Class<T> annotationClass)` | 返回直接修饰当前元素的指定类型注解（不包括继承的注解）。 |
| `Annotation[] getDeclaredAnnotations()` | 返回直接修饰当前元素的所有注解（不包括继承的注解）。 |
| `<T extends Annotation> T[] getDeclaredAnnotationsByType(Class<T> annotationClass)` | 返回直接修饰当前元素的指定类型注解数组（支持重复注解）。 |
| `boolean isAnnotationPresent(Class<? extends Annotation> annotationClass)` | 判断当前元素是否被指定类型的注解修饰。 |

### 总结
`AnnotatedElement` 接口是 Java 反射 API 中用于访问注解的核心接口。通过它，开发者可以在运行时读取类、方法、字段等元素上的注解信息，并根据注解的值动态调整程序的行为。

| 特性 | 说明 |
| --- | --- |
| **支持的元素** | 类、方法、字段、构造函数、包、参数等。 |
| **核心方法** | `getAnnotation`、`getAnnotations`、`isAnnotationPresent` 等。 |
| **重复注解支持** | 通过 `getAnnotationsByType` 和 `getDeclaredAnnotationsByType` 处理。 |

## 注解的解析
+ **解析时机**：当通过反射（如 `getAnnotation()` 方法）获取注解时，Java 会解析类的字节码，提取注解信息。
+ **解析过程**：
    1. Java 会从类的字节码中读取 `RuntimeVisibleAnnotations` 属性（存储运行时可见的注解信息）。
    2. 使用 `AnnotationParser` 解析这些注解信息，将其转换为内部的注解数据结构。
    3. 解析后的注解信息会被缓存，以提高后续访问的性能。

## 注解代理对象的创建
+ **创建时机**：在注解解析完成后，Java 会动态生成一个代理对象来表示注解实例。
+ **创建过程**：
    1. 使用 `AnnotationInvocationHandler` 创建一个动态代理对象。
    2. 代理对象会存储解析后的注解属性值。
    3. 当调用注解方法（如 `value()`）时，代理对象会返回存储的属性值。

### 实现了InvocationHandler接口的类
jdk的动态代理，需要一个Proxy类（jdk提供的用于生成对象的类），一个实现了InvocationHandler接口的类（用于封装代理逻辑的类）。

动态代理类的生成过程是通过 AnnotationInvocationHandler 实现的，AnnotationInvocationHandler 是 JDK 提供的一个内部类。

在创建代理对象之前，解析注解时候 从该注解类的常量池中取出注解的信息，包括之前写到注解中的参数，然后将这些信息在创建 AnnotationInvocationHandler时候 ，传入进去 作为构造函数的参数。

```java
static class AnnotationInvocationHandler implements InvocationHandler{
    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        //处理注解的解析
    }
}
```

### 使用Proxy.newProxyInstance()创建代理对象
```java
   public static Object newProxyInstance(ClassLoader loader,
                                          Class<?>[] interfaces,
                                          InvocationHandler h)
        throws IllegalArgumentException
```

# 深入理解注解
## 注解不支持继承
# 常见注解
## lombok注解
@NoArgsConstructor: 自动生成无参数构造函数
@AllArgsConstructor: 自动生成全参数构造函数
@Data: 自动为所有字段添加@ToString, @EqualsAndHashCode, @Getter方法，为非final字段添加@Setter和@RequiredArgsConstructor

## @inheritDoc
在@Override上加上{@inheritDoc}注解，对项目导出详细设计时，可自动获取接口的注释

```java
/**
 * {@inheritDoc}
 */
```
## AspectJ 注解
- @Aspect：定义切面。
- @Pointcut：定义切入点。
- @Before、@After、@Around、@AfterReturning、@Afterthrowing：定义通知。
- @AspectJ 声明切面
- @DeclareParents

## Servlet注解
Servlet 注解用于简化 Web 应用的配置。常见的注解包括：
- @WebServlet：定义 Servlet。
- @WebFilter：定义过滤器。
- @WebListener：定义监听器。

[Servlet注解](https://www.yuque.com/zhaomengyao2019/kzz0dr/hm0mk3gfnphb6ouz)

## Spring注解
Spring 框架提供了丰富的注解，用于依赖注入、事务管理、AOP 等。
- 核心注解：
    - @Component：通用组件注解。
    - @Service：标注服务层组件。
    - @Repository：标注数据访问层组件。
    - @Controller：标注控制器组件。
- 依赖注入：
    - @Autowired：自动注入依赖。
    - @Qualifier：指定注入的 Bean。
- AOP：
    - Spring AOP 支持使用 AspectJ 的注解风格，包括 @Pointcut、@Before、@After、@AfterReturning、@AfterThrowing、@Around 等。
    - Spring AOP 可以与 AspectJ 集成，利用 AspectJ 的强大功能（如编译时织入）。

[Spring注解](https://www.yuque.com/zhaomengyao2019/kzz0dr/plryge1pbba2pcu1)

## Spring Boot注解
Spring Boot 进一步简化了 Spring 应用的开发。
- 启动类注解：
    - @SpringBootApplication：标注 Spring Boot 应用的启动类。
- 配置注解：
    - @Configuration：标注配置类。
    - @Bean：标注方法返回的 Bean。
- Web 开发：
    - @RestController：标注 RESTful 控制器。
    - @RequestMapping：映射请求路径。
    
[SpringBoot注解](https://www.yuque.com/zhaomengyao2019/kzz0dr/iau341)

