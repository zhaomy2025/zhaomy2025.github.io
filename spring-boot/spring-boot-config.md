---
title: Spring Boot 配置
date: 2026-09-23
category:
  - spring
  - spring-boot-config
tags:
  - spring
  - spring-boot-config
---

# Spring Boot 配置
[[toc]]

Spring Boot 的配置能力建立在 Spring 的 `Environment` 与 `PropertySource` 抽象上：属性可以从配置文件、环境变量、命令行参数等多处来，谁覆盖谁由一套固定的优先级决定。

本文以 Spring Boot 4.1.1 为准。

## 配置来源的优先级

后面的覆盖前面的：

| 顺序 | 来源 | 说明 |
| --- | --- | --- |
| 1 | `SpringApplication.setDefaultProperties(Map)` | 默认属性 |
| 2 | `@Configuration` 类上的 `@PropertySource` | 直到 context refresh 时才加入 `Environment`，因此配不了 `logging.*`、`spring.main.*` 这类在 refresh 前就被读取的属性 |
| 3 | 配置数据（`application.properties` 等） | 见下一节 |
| 4 | `RandomValuePropertySource` | 只有 `random.*` |
| 5 | 操作系统环境变量 | 环境变量不能带点号，用下划线代替（`SPRING_CONFIG_NAME` 对应 `spring.config.name`） |
| 6 | Java 系统属性（`System.getProperties()`） | |
| 7 | `java:comp/env` 中的 JNDI 属性 | |
| 8 | `ServletContext` init parameters | |
| 9 | `ServletConfig` init parameters | |
| 10 | `SPRING_APPLICATION_JSON` | 内联 JSON，写在环境变量或系统属性里 |
| 11 | 命令行参数 | |
| 12 | 测试的 `properties` 属性 | `@SpringBootTest` 及各种 slice 测试注解上可用 |
| 13 | 测试中的 `@DynamicPropertySource` | |
| 14 | 测试中的 `@TestPropertySource` | |
| 15 | devtools 全局设置 | `$HOME/.config/spring-boot` 目录下，devtools 激活时才生效 |

::: tip 顺序靠后的赢
「覆盖」指的是同名属性取后者。所以命令行参数（11）能盖掉配置文件（3），而测试相关的几个来源（12–14）仅次于第 15 行的 devtools 全局设置，方便测试里临时改配置。
:::

::: tip 优先级只需记住这一条
测试专用 > 命令行参数 > 环境变量 > `application.properties` > 默认属性
:::

其中 `SPRING_APPLICATION_JSON` 值得单说：环境变量和系统属性对属性名的字符有限制（不能带点号），把一整块属性编码成一个 JSON 结构塞进去可以绕开这个限制。注意它是内联 JSON，不能用一个 `null` 值去覆盖来自更低优先级属性源的属性。

## 配置文件的加载位置

`application.properties` 与 `application.yaml` 会按下列位置依次查找，后面的覆盖前面的：

| 顺序 | 位置 |
| --- | --- |
| 1 | classpath 根 |
| 2 | classpath 的 `config/` 包 |
| 3 | 当前目录 |
| 4 | 当前目录的 `config/` 子目录 |
| 5 | `config/` 子目录的直接子目录（`config/*/`） |

同一位置下 `.properties` 与 `.yml` 同时存在时，`.properties` 优先。整个应用建议只保留一种格式。

带 profile 的文件（`application-{profile}.properties`）从同样的位置加载，且总是覆盖不带 profile 的那个；同时激活多个 profile 时后一个赢——激活 `prod,live` 时，`application-prod` 里的值会被 `application-live` 覆盖。

## 控制配置文件的查找

`spring.config.name`、`spring.config.location`、`spring.config.additional-location` 三个属性**很早就被读取**，用来决定加载哪些文件，所以它们不能写在 `application.properties` 里，只能用环境变量、系统属性或命令行参数指定：

```bash
# 改配置文件名：找 myproject.properties / myproject.yaml，不再找 application.*
java -jar myproject.jar --spring.config.name=myproject

# 显式指定位置（逗号分隔多个），会替换掉默认位置
java -jar myproject.jar --spring.config.location=\
  optional:classpath:/default.properties,\
  optional:classpath:/override.properties
```

路径前缀 `optional:` 表示该位置可以不存在，相应地有两种结果：

- 加了 `optional:`，位置不存在也不报错
- 不加 `optional:` 而文件又不存在，则报 `ConfigDataLocationNotFoundException`

想要全局忽略这类异常、缺文件也照常启动，把 `spring.config.on-not-found` 设为 `ignore`。

`spring.config.location` 是**替换**默认位置，`spring.config.additional-location` 是**追加**——想保留默认的 `application.properties` 又加一个外部文件，用后者。

多个配置文件之间可以用 `spring.config.import` 互相引用：

```yaml
spring:
  config:
    import: optional:file:./myconfig.properties
```

导入文件里的值**优先于**触发导入的那个文件。

## 多文档文件

一个文件里写多套配置，用分隔符切开。`.properties` 用 `#---` 或 `!---`，`.yaml` 用标准的多文档语法 `---`：

```yaml
# 第一段
server:
  port: 8080
---
# 第二段
spring:
  config:
    activate:
      on-profile: prod
server:
  port: 9090
```

后一段可以覆盖前一段的属性。注意多文档的 `.properties` 文件**不能**用 `@PropertySource` 或 `@TestPropertySource` 加载。

## 属性占位符

配置里可以用 `${}` 引用其他属性的值：

```properties
app.name=myapp
app.home=/data/${app.name}
```

占位符里写属性名时要用规范形式（kebab-case、全小写），即使目标属性本身是以驼峰命名的。

## 类型安全的配置属性

把配置绑定成对象，比到处写 `@Value("${...}")` 好维护：

```java
@ConfigurationProperties("my.service")
public class MyServiceProperties {

    private boolean enabled;
    private InetAddress remoteAddress;

    // getter / setter 省略
}
```

JavaBean 绑定的前提是有一个无参构造函数和 getter/setter。

还要让 Spring 知道这个类，有两种方式：

- 在类上加 `@Component`
- 用 `@EnableConfigurationProperties(MyServiceProperties.class)`

批量扫描用 `@ConfigurationPropertiesScan`：

```java
@SpringBootApplication
@ConfigurationPropertiesScan({"com.example.app", "com.example.another"})
public class MyApplication { }
```

不写包名时，从声明该注解的类所在包开始扫。

### 构造函数绑定

字段声明成 `final`、只留一个带参数的构造函数，Spring Boot 就用这个构造函数绑定，对象建出来即不可变：

```java
@ConfigurationProperties("my.service")
public class MyServiceProperties {

    private final boolean enabled;
    private final InetAddress remoteAddress;

    public MyServiceProperties(boolean enabled, InetAddress remoteAddress) {
        this.enabled = enabled;
        this.remoteAddress = remoteAddress;
    }

    // 只有 getter
}
```

有多个构造函数时，用 `@ConstructorBinding` 标出要用的那个。参数默认值用 `@DefaultValue` 指定。

### 绑定到第三方类

不能改源码的第三方类，把 `@ConfigurationProperties` 打在 `@Bean` 方法上：

```java
@Bean
@ConfigurationProperties("my.third.party")
public ThirdPartyComponent thirdPartyComponent() {
    return new ThirdPartyComponent();
}
```

### 宽松绑定

配置文件里的属性名比 Java 字段名宽松得多，`my.main-project.person.first-name`、`my.mainProject.person.firstName`、`MY_MAINPROJECT_PERSON_FIRSTNAME` 都能绑到同一个 `firstName` 字段。但注解上的 `prefix` 必须是 kebab 风格（小写、用 `-` 分隔），`my.main-project.person` 这样写。

## 敏感配置的加密

数据库密码这类值不适合明文写在配置文件里，jasypt-spring-boot 可以在属性被读取时解密。加依赖：

```xml
<dependency>
    <groupId>com.github.ulisesbocchio</groupId>
    <artifactId>jasypt-spring-boot-starter</artifactId>
    <version>4.0.4</version>
</dependency>
```

两种依赖的开启方式不同：

- 用 `jasypt-spring-boot-starter`：自动生效。
- 用非 starter 的 `jasypt-spring-boot`：需要手动加 `@EnableEncryptableProperties`，写法如下。

```java
@Configuration
@EnableEncryptableProperties
public class MyApplication { }
```

配置文件里的值写成 `ENC(密文)` 的形式：

```properties
spring.datasource.password=ENC(密文)
```

读取时拿到的就是解密后的值。

密文用 jasypt 的 Maven 插件生成。这个插件的 `groupId` 不在 Maven 默认的 `pluginGroups` 里，光靠 `jasypt` 这个前缀解析不到它，所以要在 `pom.xml` 里先声明：

```xml
<build>
    <plugins>
        <plugin>
            <groupId>com.github.ulisesbocchio</groupId>
            <artifactId>jasypt-maven-plugin</artifactId>
            <version>4.0.4</version>
        </plugin>
    </plugins>
</build>
```

之后就能用它的 `encrypt-value` 目标生成密文：

```bash
mvn jasypt:encrypt-value \
  -Djasypt.encryptor.password="密钥" \
  -Djasypt.plugin.value="要加密的值"
```

`jasypt.encryptor.password` 是必须提供的密钥，**它本身不能再写进配置文件**（那就等于没加密），用环境变量或启动参数传入。其余密钥派生参数（`jasypt.encryptor.algorithm`、`key-obtention-iterations`、`iv-generator-classname` 等）都有默认值，不要随意改动——改了以后已加密的值可能解不开。

## 第三方 starter 的配置

第三方 starter 通常会把配置项收敛到一个专属前缀下，直接在配置文件里写即可，不用写 XML 或 Java 配置类。以 MyBatis 的分页插件 PageHelper 为例：

```xml
<dependency>
  <groupId>com.github.pagehelper</groupId>
  <artifactId>pagehelper-spring-boot-starter</artifactId>
  <version>4.1.1</version>
</dependency>
```

它不在 Spring Boot 的依赖管理（`spring-boot-dependencies`）范围内，版本必须自己写。

```yaml
pagehelper:
  helper-dialect: mysql   # 不配则自动检测数据库类型
  reasonable: true        # 页码越界时的处理策略
  default-count: true     # 不带 count 的方法是否也执行 count 查询
  support-methods-arguments: true
```

属性名支持 kebab 风格，常用的几项在 IDE 里有自动提示；自己扩展的参数如果提示不出来，按原始参数名写。

## 应用启动相关的配置

启动阶段能直接调的配置项不多，下面两个分别控制 Bean 的创建时机和启动时打印的 Banner。

### 懒初始化

默认情况下单例 Bean 在启动时就会全部创建好，开启懒初始化后改成第一次被用到才创建。在配置文件里加一行即可：

```properties
spring.main.lazy-initialization=true
```

开启后 Bean 按需创建，而不是启动时全部创建，启动更快。代价是问题暴露得更晚——配置有问题的 Bean 不会在启动时失败，要等它被初始化时才报出来；Web 应用里大量 web 相关 Bean 会推迟到收到第一个 HTTP 请求才创建。另外 JVM 内存要按「全部 Bean 都创建出来」来预留。

也可以用编程方式开启：`SpringApplicationBuilder#lazyInitialization` 或 `SpringApplication#setLazyInitialization`。

### 自定义 Banner

启动时打印的 Banner 有两种替换方式：

- 在 classpath 下放一个 `banner.txt`
- 用 `spring.banner.location` 指向文件位置

文件不是 UTF-8 编码时，用 `spring.banner.charset` 指定编码。`banner.txt` 里除了能引用 `Environment` 中的任意属性，还可以用一组内置占位符（应用版本、Spring Boot 版本等）。
