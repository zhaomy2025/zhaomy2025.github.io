---
title: Spring Boot 入门
date: 2025-06-04
category:
  - spring
  - spring-boot
tags:
  - spring
  - spring-boot
---

# Spring Boot 入门
[[toc]]

## Spring Boot简介
<!-- @include: ./spring-boot-hello-world-section.md -->

本文以 Spring Boot 4.1.1 为准。

## 开发
开发一个 Spring Boot 应用，大致会经历建项目、写代码、打包这几步。
### 前提条件
先确认本机已装好 JDK 和 Maven（Spring Boot 4.1 要求 JDK 17 及以上）：

```bash
java -version
mvn -v
```

### 使用Maven建立项目
在 `pom.xml` 中继承 Spring Boot 的父 POM，并引入 Web Starter：

```xml
<parent>
		<groupId>org.springframework.boot</groupId>
		<artifactId>spring-boot-starter-parent</artifactId>
		<version>4.1.1</version>
</parent>
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-webmvc</artifactId>
    </dependency>
</dependencies>
```

```bash
mvn package
```

### 编写代码
`@SpringBootApplication` 声明这是配置类并开启自动配置，`@RestController` 加 `@RequestMapping` 暴露一个接口：

```java
@RestController
@SpringBootApplication
public class MyApplication {

    @RequestMapping("/")
    String home() {
        return "Hello World!";
    }

    public static void main(String[] args) {
        SpringApplication.run(MyApplication.class, args);
    }

}
```

### 创建一个可执行Jar
通过spring-boot-maven-plugin，直接嵌套jar

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
        </plugin>
    </plugins>
</build>
```

## 构建系统
构建系统这块主要看 Starter：它是 Spring Boot 管理依赖的主要方式。

Starter是一系列开箱即用的依赖，通过Starter可以获得所有你需要的Spring和相关技术的依赖。

jpa、data-redis、json、webmvc、mail、security、test
| Starter | 描述 |
| :--- | :--- |
| **spring-boot-starter-data-jpa** | 用于通过 Hibernate 使用 Spring Data JPA 的 Starter |
| spring-boot-starter-data-redis | 用于通过 Spring Data Redis 和 Lettuce 客户端操作 Redis 键值存储的 Starter |
| spring-boot-starter-json | 用于读写 JSON 数据的 Starter |
| spring-boot-starter-mail | 用于 Java Mail 和 Spring 框架邮件发送支持的 Starter |
| spring-boot-starter-security | 用于 Spring Security 的 Starter |
| spring-boot-starter-test | 用于测试 Spring Boot 应用的 Starter（包含 JUnit Jupiter、Hamcrest 和 Mockito 等库） |
| **spring-boot-starter-webmvc** | 用于构建 Web/RESTful 应用的 Starter（使用 Spring MVC，默认内嵌 Tomcat 容器） |

<!-- 记住这三个就行：webmvc、data-jpa、json -->

## 常用注解

Spring Boot 的注解大致分三类：

- **标注组件、声明装配关系**：标在类、方法或字段上，说明「这是什么、依赖谁」。
- **开启某项能力的开关**：加在配置类上，让 Spring 额外做一件事（扫描组件、导入配置、开启自动配置）。
- **属性与生效条件**：说明外部配置的值从哪来、在什么条件下才生效。

下面先按这三类给三张速查表，再逐个展开。

**标注组件、声明装配关系**

| 注解 | 作用 |
| --- | --- |
| `@SpringBootApplication` | 组合注解，等于 <CategoryTag1>@SpringBootConfiguration</CategoryTag1> + <CategoryTag2>@ComponentScan</CategoryTag2> + <CategoryTag3>@EnableAutoConfiguration</CategoryTag3> |
| <CategoryTag1>@SpringBootConfiguration</CategoryTag1> | `@Configuration` 的特化，用来标记 Spring Boot 应用的主配置类（一个应用只应有一个，测试会自动找它）；`@SpringBootApplication` 就是继承它而来，可设 `proxyBeanMethods` 等属性 |
| `@Configuration` | 标记配置类；启动类本身通常就是主配置类 |
| `@AutoConfiguration` | 标记自动配置类（该注解本身已含 `@Configuration`） |
| `@Component` / `@Controller` / `@Service` | 标注 Spring Bean，由组件扫描注册 |
| `@Bean` | 标在配置类的方法上，用工厂方法创建第三方组件的 Bean |
| `@Autowired` | 按类型注入；类有多个构造函数时用它指定用哪一个 |
| `@Resource` | JSR-250 的注入注解，按名称注入 |

**开启某项能力的开关**

| 注解 | 作用 |
| --- | --- |
| <CategoryTag2>@ComponentScan</CategoryTag2> | 扫描并注册 `@Component` 及其派生注解标注的类 |
| `@Import` | 导入额外的配置类 |
| `@ImportResource` | 加载基于 XML 的配置文件 |
| <CategoryTag3>@EnableAutoConfiguration</CategoryTag3> | 开启自动配置，可用 `exclude` 属性（按类）或 `excludeName` 属性（按全限定类名）排除指定的自动配置类 |
| `@EnableConfigurationProperties` | 开启 `@ConfigurationProperties` 的属性绑定 |

**属性与生效条件**

| 注解 | 作用 |
| --- | --- |
| `@PropertySource` | 把指定的属性文件加载进 Spring 环境 |
| `@Value` | 注入单个属性值 |
| `@ConfigurationProperties` | 按前缀把属性批量绑定到 JavaBean |
| `@Conditional` | 声明自动配置的启用条件，有一族派生注解（`@ConditionalOnClass`、`@ConditionalOnMissingBean`、`@ConditionalOnProperty` 等） |
| `@Profile` | 多环境配置，可搭配 `@PropertySource` 使用 |

上面三张表里带底色的注解名，是 `@SpringBootApplication` 这个组合注解的三个组成部分：<CategoryTag1>@SpringBootConfiguration</CategoryTag1>（标记主配置类）、<CategoryTag2>@ComponentScan</CategoryTag2>（扫描组件）、<CategoryTag3>@EnableAutoConfiguration</CategoryTag3>（开启自动配置）。

### @SpringBootApplication
@SpringBootApplication=<CategoryTag1>@SpringBootConfiguration</CategoryTag1>+<CategoryTag2>@ComponentScan</CategoryTag2>+<CategoryTag3>@EnableAutoConfiguration</CategoryTag3>

+ 可搭配@ImportResource导入配置文件

```java
@SpringBootApplication
@ImportResource(value = {"classpath:spring-context.xml","classpath*:META-INF/spring.xml"})
public class MyApplication {}
```

+ 如需明确导入用户定义的Bean，可去掉<CategoryTag2>@ComponentScan</CategoryTag2>（@SpringBootApplication换为<CategoryTag1>@SpringBootConfiguration</CategoryTag1>和<CategoryTag3>@EnableAutoConfiguration</CategoryTag3>），使用@Import注解导入指定配置类

```java
@SpringBootConfiguration(proxyBeanMethods = false)
@EnableAutoConfiguration
@Import({SomeConfiguration.class, AnotherConfiguration.class})
public class MyApplication {
}
```

### 配置类/文件
这一节看配置类与配置文件：Spring Boot 首选 Java 配置类，其次是属性文件，XML 配置只在必要时才用。
#### @Configuration 配置类
Spring Boot倾向于通过Java代码来进行配置的定义。 建议你通过 @Configuration 类来进行配置。 通常，可以把启动类是作为主要的 @Configuration 类。

#### @Import 导入 @Configuration 类
不需要把所有的配置放在一个类中。 @Import 注解可以用来导入额外的配置类。 另外，你可以使用 <CategoryTag2>@ComponentScan</CategoryTag2> 来自动扫描加载所有Spring组件，包括 @Configuration 类。

#### @ImportResource 导入 XML 配置
如果你确实需要使用基于XML的配置，可用通过 @ImportResource 注解来加载XML配置文件。

```java
@SpringBootApplication
@ImportResource(value = { "classpath:spring-context.xml","classpath*:META-INF/spring.xml" })
public class MyApplication {
}
```

#### @AutoConfiguration 自动配置
自动配置类通过添加 @AutoConfiguration 注解实现。因为 @AutoConfiguration 注解本身是以 @Configuration 注解的，所以自动配置类可以算是一个标准的基于 @Configuration 注解的类。

#### <CategoryTag3>@EnableAutoConfiguration</CategoryTag3> 开启自动配置功能
Spring Boot的自动配置机制会试图根据你所添加的依赖来自动配置你的Spring应用程序。 例如，如果你添加了 HSQLDB 依赖，而且你没有手动配置任何DataSource Bean，那么Spring Boot就会自动配置内存数据库。

你需要将 <CategoryTag3>@EnableAutoConfiguration</CategoryTag3> 或 @SpringBootApplication 注解添加到你的 @Configuration 类中，从而开启自动配置功能。

如果你想禁用掉项目中某些自动配置类，你可以在 @SpringBootApplication 注解的 exclude 属性（按类）或 excludeName 属性（按全限定类名字符串）中指定。

#### @Conditional 声明自动配置启用条件
@Conditional 注解可以用于声明自动配置启用条件，常见的有以下几种：

+ @ConditionalOnClass、@ConditionalOnMissingClass 基于是否存在指定的类
+ @ConditionalOnBean、@ConditionalOnMissingBean 基于是否存在指定的 Bean
+ @ConditionalOnProperty 基于 Environment 里的配置属性判正
+ @ConditionalOnExpression 基于 SpEL 表达式判正
+ @ConditionalOnResource 基于是否存在特定的资源来判正
+ @ConditionalOnWebApplication、@ConditionalOnNotWebApplication 基于当前是否为 Web 应用
+ @ConditionalOnWarDeployment、@ConditionalOnNotWarDeployment 判定当前应用是否为传统的部署到 servlet 容器的 WAR 包应用

HttpMessageConvertersAutoConfiguration



#### @Profile 多环境配置
可搭配@PropertySource使用



### JavaBean
使用@Component、@Controller、@Service等注解标注的类都是Bean，可使用<CategoryTag2>@ComponentScan</CategoryTag2>注解来扫描。

第三方组件Bean可使用工厂方法（@Bean方法）来创建：在@Configuration配置类中使用@Bean注解修饰的方法即为工厂方法，工厂方法返回的对象即为JavaBean，也会交给 Spring IoC 容器管理。

如果一个Bean有多个构造函数，你需要用 @Autowired 注解来告诉Spring该用哪个构造函数进行注入。

### 依赖注入
通过@Resource<Tip>JSR-250</Tip>或@Autowired <Tip>Spring</Tip>可以实现依赖注入。

### 属性文件
属性文件由 `@PropertySource` 加载进 Spring 环境，再配合属性绑定把值注入 JavaBean。
#### @PropertySource加载指定的属性文件到 Spring 环境
+ 加载指定的属性文件(.properties/.xml)到 Spring 环境
+ 支持多文件同时加载
+ 可配合 **`@Value`** 或 **`Environment`** 接口使用
+ 可配合@Profile("dev")使用，支持多环境配置

#### @EnableConfigurationProperties()开启配置类属性绑定
配置文件的属性值自动绑定到 **`@ConfigurationProperties`** 修饰的 JavaBean



### 属性绑定
|  | @Value("${}") | @ConfigurationProperties(prefix="") |
| --- | --- | --- |
| 适用场景 | 单个属性 | 整个 JavaBean 的属性绑定，支持指定属性的通用前缀 |
| 属性值来源 | Spring 环境的属性，包括但不限于 @PropertySource 加载的属性 | Spring 环境中的属性，按前缀批量绑定到 JavaBean |
| 启用注解 | 无需额外注解 | @EnableConfigurationProperties |

## 运行/部署Spring Boot应用
Spring Boot 应用可以打包成可执行 jar 直接运行，这一节看打包产物怎么跑，以及开发期的热部署与自动重启。
### java -jar XXX.jar
`spring-boot-maven-plugin` 会把依赖和启动引导类一起打进 jar，产物可以直接运行：

```bash
java -jar target/demo-0.0.1-SNAPSHOT.jar
```

### 热部署JRebel
由于Spring Boot应用程序是普通的Java应用程序，JVM的热替换功能可以直接使用。但是，JVM的热替换能替换的字节码有限。要想获得更完整的解决方案，可以使用 JRebel 。

## 缓存
在配置类添加@EnableCaching注解

在需要将查询结果返回值添加至缓存中的方法上面添加@Cacheable注解，使用默认缓存策略对方法的返回值进行缓存。其中@Cacheable注解可以包含 value 参数，指定配置文件中自定义的缓存策略。缓存 key 值由容器自动生成。

使用@CacheEvict注解清除缓存，其中@CacheEvict(allEntries=true)表示清除默认缓存策略中所有缓存。

## 开发者工具（Developer Tools）
如果你的应用程序是通过 java -jar 启动的，或者是从一个特殊的classloader启动的，那么它就被认为是一个 "生产级别的应用程序"，开发者工具会被自动禁用。

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-devtools</artifactId>
        <optional>true</optional>
    </dependency>
</dependencies>
```

### 属性的默认值
默认禁用缓存选项

### 自动重启
devtools 里最常用的是自动重启，先分清「重启」和「重载」两件事。
#### 重启 VS 重载
重启丢弃restart classloader，并创建一个新的。Spring Boot通过两个加载类实现重启，通常比“冷启动”快得多。

重载是在类被加载时对其进行重写，比重启更快。

#### 排除资源
默认情况下，改变 /META-INF/maven, /META-INF/resources, /resources, /static, /public, /templates 中的资源不会触发重启，但会触发实时重载.。

如果你想自定义这些排除项，可以使用 spring.devtools.restart.exclude 属性。

如果你想保留这些默认值并增加额外的排除资源，请使用 spring.devtools.restart.additional-exclude 属性来代替。

#### 监控额外的路径
当你对不在classpath上的文件进行修改时，你可能希望你的应用程序被重新启动或重新加载。为此，使用 spring.devtools.restart.additional-paths 属性来配置监控变化的额外路径。你可以使用前面说过的的 spring.devtools.restart.exclude 属性来控制额外路径下的变化是触发完全重启还是实时重载。

#### 禁止重启
spring.devtools.restart.enabled 属性来禁用重启。

::: tip
application.properties 中设置这个属性仍然会初始化restart 类加载器，但不会监控文件变化。

若要完全禁用重启，需在调用 SpringApplication.run(…) 之前将 spring.devtools.restart.enabled 属性设置为 false。
:::

### LiveReload
spring-boot-devtools 模块包括一个内嵌的LiveReload服务器，可以用来在资源发生变化时触发浏览器刷新。

::: warning
LiveReload 自 Spring Boot 4.1.0 起已废弃，官方没有提供替代方案。
:::

::: tip
你一次只能运行一个LiveReload服务器。 在启动你的应用程序之前，确保没有其他LiveReload服务器正在运行。 如果你从你的IDE启动多个应用程序，只有第一个有LiveReload支持。
:::