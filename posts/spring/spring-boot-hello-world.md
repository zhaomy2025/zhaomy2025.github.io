---
title: Spring Boot 入门
date: 2025-06-04T08:59:20.234Z
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
<!-- @include:./spring-boot-hello-world-intro.md -->

## 开发
### 前提条件
```java
java -version
mvn -v
```

### 使用Maven建立项目
```xml
<parent>
		<groupId>org.springframework.boot</groupId>
		<artifactId>spring-boot-starter-parent</artifactId>
		<version>3.2.0-SNAPSHOT</version>
</parent>
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
</dependencies>
```

```bash
mvn package
```

### 编写代码
```xml
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
### 依赖管理
#### Starter
Starter是一系列开箱即用的依赖，通过Starter可以获得所有你需要的Spring和相关技术的依赖。

jpa、data-redis、json、web、mail、test
| Starter | 描述 |
| :--- | :--- |
| spring-boot-starter-data-jpa | 用于通过 Hibernate 使用 Spring Data JPA 的 Starter |
| spring-boot-starter-data-redis | 用于通过 Spring Data Redis 和 Lettuce 客户端操作 Redis 键值存储的 Starter |
| spring-boot-starter-json | 用于读写 JSON 数据的 Starter |
| spring-boot-starter-mail | 用于 Java Mail 和 Spring 框架邮件发送支持的 Starter |
| spring-boot-starter-security | 用于 Spring Security 的 Starter |
| spring-boot-starter-test | 用于测试 Spring Boot 应用的 Starter（包含 JUnit Jupiter、Hamcrest 和 Mockito 等库） |
| spring-boot-starter-web | 用于构建 Web/RESTful 应用的 Starter（使用 Spring MVC，默认内嵌 Tomcat 容器） |

## 常用注解
![Spring Boot 常用注解](/images/spring/spring-boot-hello-world-annotation.jpg)

### @SpringBootApplication
@SpringBootApplication=@SpringBootConfiguration+@ComponentScan+@EnableAutoConfiguration

+ 可搭配@ImportResource导入配置文件

```java
@SpringBootApplication
@ImportResource(value = {"classpath:spring-context.xml","classpath*:META-INF/spring.xml"})
public class myApplication {}
```

+ 如需明确导入用户定义的Bean，可去掉@ComponentScan（@SpringBootApplication换为@SpringBootConfiguration和@EnableAutoConfiguration），使用@Import注解导入指定配置类

```xml
@SpringBootConfiguration(proxyBeanMethods = false)
@EnableAutoConfiguration
@Import({SomeConfiguration.class, AnotherConfiguration.class})
public class MyApplication {
}
```

### 配置类/文件
#### @Configuration配置类
Spring Boot倾向于通过Java代码来进行配置的定义。 建议你通过 @Configuration 类来进行配置。 通常，可以把启动类是作为主要的 @Configuration 类。

#### @Import导入@Configuration类
不需要把所有的配置放在一个类中。 @Import 注解可以用来导入额外的配置类。 另外，你可以使用 @ComponentScan 来自动扫描加载所有Spring组件，包括 @Configuration 类。

#### @ImportResource 导入XML配置
如果你确实需要使用基于XML的配置，可用通过 @ImportResource 注解来加载XML配置文件。

```xml
@SpringBootApplication
@ImportResource(value = { "classpath:spring-context.xml","classpath*:META-INF/spring.xml" })
public class StartIompServiceMain {
}
```

#### @AutoConfiguration自动配置
自动配置类通过添加 @AutoConfiguration 注解实现。因为 @AutoConfiguration 注解本身是以 @Configuration 注解的，所以自动配置类可以算是一个标准的基于 @Configuration 注解的类。

#### @EnableAutoConfiguration开启自动装配功能
Spring Boot的自动装配机制会试图根据你所添加的依赖来自动配置你的Spring应用程序。 例如，如果你添加了 HSQLDB 依赖，而且你没有手动配置任何DataSource Bean，那么Spring Boot就会自动配置内存数据库。

你需要将 @EnableAutoConfiguration 或 @SpringBootApplication 注解添加到你的 @Configuration 类中，从而开启自动配置功能。

如果你想禁用掉项目中某些自动装配类，你可以在 @SpringBootApplication 注解的 exclude 属性中指定。

#### @Conditional 声明自动配置启用条件
@Conditional 注解可以用于声明自动配置启用条件，包括以下注解：

+ @ConditionalOnClass、@ConditionalOnMissingBean
+ @ConditionalOnProperty 基于 Spring 的环境变量判正
+ @ConditionalOnResource 基于是否存在特定的资源来判正
+ @ConditionalOnWebApplication、@ConditionalOnNotWebApplication基于当前是否为 Web 应用
+ @ConditionalOnWarDeployment、@ConditionalOnNotWarDeployment 判定当前应用是否为传统的部署到 servlet 容器的 WAR 包应用

HttpMessageConvertersAutoConfiguration



#### @Profile多环境配置
可搭配@PropertySource使用



### JavaBean
使用@Component、@Controller、@Service等注解标注的类都是Bean，可使用@ComponentScan注解来扫描。

第三方组件Bean可使用工厂方法（@Bean方法）来创建：在@Configuration配置类中使用@Bean注解修饰的方法即为工厂方法，工厂方法返回的对象即为JavaBean，也会交给Spring IoC容器管理。

如果一个Bean有多个构造函数，你需要用 @Autowired 注解来告诉Spring该用哪个构造函数进行注入。

### 依赖注入
通过@Resource<Tip>JSR-250</Tip>或@Autowired <Tip>Spring</Tip>可以实现依赖注入。

### 属性文件
#### @PropertySource加载指定的属性文件到 Spring 环境
+ 加载指定的属性文件(.properties/.xml)到 Spring 环境
+ 支持多文件同时加载
+ 可配合 `**@Value**` 或 `**Environment**` 接口使用
+ 可配合@Profile("dev")使用，支持多环境配置

#### @EnableConfigurationProperties()开启配置类属性绑定
配置文件的属性值自动绑定到 `**@ConfigurationProperties**`**修饰的JavaBean**



### 属性绑定
|  | @value("${}") | @ConfigurationProperties(prefix="") |
| --- | --- | --- |
| 适用场景 | 单个属性 | 整个JavaBean的属性绑定，支持指定属性的通用前缀 |
| 属性值来源 | Spring环境的属性，包括但不限于@PropertySource加载的属性 | 配置文件？？ |
| 启用注解 | | @EnableConfigurationProperties |
| | | |

## 运行/部署Spring Boot应用
### java -jar XXX.jar
### 热部署JRebel
由于Spring Boot应用程序是普通的Java应用程序，JVM的热替换功能可以直接使用。但是，JVM的热替换能替换的字节码有限。要想获得更完整的解决方案，可以使用 JRebel 。

[Welcome to JetBrains License Server!:)](https://jrebel.qekang.com/)

## 缓存
在配置类添加@EnableCaching注解

在需要将查询结果返回值添加至缓存中的方法上面添加@Cacheable注解，使用默认缓存策略对方法的返回值进行缓存。其中@Cacheable注解可以包含 value 参数，指定配置文件中自定义的缓存策略。缓存 key 值有容器自动生成。

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
#### 重启 VS 重载
重启丢弃restart classloader，并创建一个新的。Spring Boot通过两个加载类实现重启，通常比“冷启动”快得多。

重载是在类被加载时对其进行重写，比重启更快。

#### 排除资源
默认情况下，改变 /META-INF/maven, /META-INF/resources, /resources, /static, /public, /templates 中的资源不会触发重启，但会触发实时重载.。

如果你想自定义这些排除项，可以使用 spring.devtools.restart.exclude 属性。

如果你想保留这些默认值并增加额外的排除资源，请使用 spring.devtools.restart.extra-exclude 属性来代替。

#### 监控额外的路径
当你对不在classpath上的文件进行修改时，你可能希望你的应用程序被重新启动或重新加载。为此，使用 spring.devtools.restart.extra-paths 属性来配置监控变化的额外路径。你可以使用前面说过的的 spring.devtools.restart.exclude 属性来控制额外路径下的变化是触发完全重启还是实时重载。

#### 禁止重启
spring.devtools.restart.enabled 属性来禁用重启。

:::info
application.properties 中设置这个属性仍然会初始化restart 类加载器，但不会监控文件变化。

若要完全禁用重启，需在调用 SpringApplication.run(…) 之前将 spring.devtools.restart.enabled 属性设置为 false。
:::

### LiveReload
spring-boot-devtools 模块包括一个内嵌的LiveReload服务器，可以用来在资源发生变化时触发浏览器刷新。

:::info
你一次只能运行一个LiveReload服务器。 在启动你的应用程序之前，确保没有其他LiveReload服务器正在运行。 如果你从你的IDE启动多个应用程序，只有第一个有LiveReload支持。
:::