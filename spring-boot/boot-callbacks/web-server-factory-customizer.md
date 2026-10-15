---
title: WebServerFactoryCustomizer
date: 2026-09-23
category:
  - spring
  - spring-boot
  - callbacks
  - web-server-factory-customizer
tags:
  - spring
  - spring-boot
  - callbacks
  - web-server-factory-customizer
---

# WebServerFactoryCustomizer
[[toc]]

`WebServerFactoryCustomizer` 改的是容器本身。它拿到的不是跑起来的服务器，而是「还没造出服务器」的工厂对象——`TomcatServletWebServerFactory`、`JettyServletWebServerFactory`、`UndertowServletWebServerFactory`、`NettyReactiveWebServerFactory` 这些。端口、线程数、访问日志这类能用 `server.*` 配的优先用配置；配置表达不了的（多个 Connector、自定义 Valve、容器专属对象）才落到这个接口。

本文讲的是跨版本稳定的机制，不绑定具体版本。

## 什么时候需要它

能用 `server.*` 配的事不该写它；会落到这个接口上的，都是配置项表达不了、或者要等启动时才知道的定制。几个典型场景：

**要给同一个应用再开一个监听端口。** 一个应用默认只监听一个端口（`server.port`）。如果想让 HTTP 和 HTTPS 各听一个口，或者把管理端点单独放到另一个口，配置项里没有对应的写法，只能自己往容器上再加一个监听器。这里有个坑：额外加的监听器不会跟着走主端口那一轮的加工，端口、SSL、线程参数都得在它身上重新配一遍。

**前置代理不是标准实现，转发头要按它来解析。** 应用前面的代理如果不是最常见那个，它转发过来的原始协议和客户端 IP 可能放在非标准的位置，默认的解析规则认不出来——应用就会拿到错误的来源地址，或者把 HTTPS 当成 HTTP。这时得自己接管解析：先把容器自动挂上的那套关掉，再换上自己写的。

**要挂容器自己的组件。** 有时需要往容器内部塞一个它自己的组件，最常见的例子是访问日志：容器自带的访问日志默认写到自己目录下的文件里，若想让访问日志和业务日志走同一套采集，就得自己实现一个这样的组件挂上去——容器管它叫 `Valve`。这类位置只有容器的 API 碰得到，配置项到不了。

**跑的是 WebFlux + Reactor Netty。** WebFlux 默认用 Reactor Netty 当容器，它能通过配置调整的项很少：同样做访问日志、或者给服务器加指标，Tomcat 那边有配置项，这边一个都没有，只能写代码挂上去。还有一点要记住：servlet 容器的定制器和 WebFlux 容器的定制器是两份，不能通用。

**参数值要到启动时才算得出来。** 配置项是写死的静态值，顶多从环境变量取。像「线程数按机器的核数算」「按机器规格给不同档位」这种要先算一下才能定的值，就只能在代码里定。这条路上有个约束：定制器的调用发生在容器生命周期的极早期，官方建议别在这里用 `@Autowired` 注入依赖，需要什么等到运行时再查。

## 接口定义

一个方法，拿到要定制的工厂：

```java
@FunctionalInterface
public interface WebServerFactoryCustomizer<T extends WebServerFactory> {

    void customize(T factory);

}
```

Spring Boot 2.0.0 引入，`T` 是交给你的工厂类型。按 Web 栈分两条线，配套的容器专属回调也不同：

| 栈 | 通用工厂接口 | 具体实现 | 容器专属回调 |
| --- | --- | --- | --- |
| servlet（Spring MVC） | `ConfigurableServletWebServerFactory` | `TomcatServletWebServerFactory`<br/>`JettyServletWebServerFactory`<br/>`UndertowServletWebServerFactory` | `TomcatConnectorCustomizer`<br/>`TomcatContextCustomizer`<br/>`TomcatProtocolHandlerCustomizer`<br/>`JettyServerCustomizer`<br/>`UndertowBuilderCustomizer`<br/>`UndertowDeploymentInfoCustomizer` |
| reactive（WebFlux） | `ConfigurableReactiveWebServerFactory` | `NettyReactiveWebServerFactory`<br/>`TomcatReactiveWebServerFactory`<br/>`JettyReactiveWebServerFactory`<br/>`UndertowReactiveWebServerFactory` | `NettyServerCustomizer`<br/>Tomcat / Jetty 用的是 servlet 栈那几个 |

`ConfigurableWebServerFactory` 里是所有容器共有的 setter：`setPort`、`setAddress`、`setSsl`、`setCompression`、`setHttp2`、`setServerHeader`、`setShutdown`、`addErrorPages`。各容器自己的 setter 在 `ConfigurableTomcatWebServerFactory`、`ConfigurableJettyWebServerFactory` 这类接口上。

## 什么时候被调用

容器 refresh 到「创建 Web 服务器」这一步时，会实例化一个 `WebServerFactory` Bean；这个 Bean 在初始化前被 `WebServerFactoryCustomizerBeanPostProcessor` 拦下，容器里所有 `WebServerFactoryCustomizer` Bean 按顺序被调一遍，然后才用它去造服务器并启动（`ServletWebServerApplicationContext#onRefresh` → `createWebServer`）。

这个 `BeanPostProcessor` 由 `ServletWebServerFactoryAutoConfiguration`（reactive 栈是 `ReactiveWebServerFactoryAutoConfiguration`）通过 `ImportBeanDefinitionRegistrar` 注册，目的是赶在普通 Bean 之前就位。

::: warning 定制器调用得很早，别在这里注入依赖
`WebServerFactoryCustomizerBeanPostProcessor` 是 `BeanPostProcessor`，调用发生在容器生命周期的极早期。官方在接口注释里直接给了建议：宁可延迟到 `BeanFactory` 里查找依赖，也别用 `@Autowired` 注入。
:::

## 基本用法

把定制器声明成 Bean，泛型填你要定制的工厂类型，需要改什么就在 `customize` 里调对应的方法：

```java
@Component
public class PortCustomizer implements WebServerFactoryCustomizer<ConfigurableServletWebServerFactory> {

    @Override
    public void customize(ConfigurableServletWebServerFactory factory) {
        factory.setPort(9000);
    }
}
```

实现类必须注册成 Bean（`@Component` 或 `@Bean`）。泛型写错的情况不会抛异常：`WebServerFactoryCustomizerBeanPostProcessor` 走 `LambdaSafe` 调用回调，泛型不匹配时把 `ClassCastException` 拦下、只在日志里留一条记录，表现是「写了不生效，不报错」。

## 和 server.* 属性的分工

`server.*` 的每一项最终也是通过定制器落到容器上的。以 servlet 栈为例，`ServletWebServerFactoryCustomizer`（自动配置注册的 Bean）把 `ServerProperties` 映射到工厂：

```java
public void customize(ConfigurableServletWebServerFactory factory) {
    PropertyMapper map = PropertyMapper.get().alwaysApplyingWhenNonNull();
    map.from(this.serverProperties::getPort).to(factory::setPort);
    map.from(this.serverProperties::getAddress).to(factory::setAddress);
    // ...
}
```

`server.tomcat.*` 则由 `TomcatWebServerFactoryCustomizer` 承接，比如 `server.tomcat.threads.max` 实际是通过 `TomcatProtocolHandlerCustomizer` 调 `AbstractProtocol#setMaxThreads`。

两者的边界大致是这样：

| 你想做的事 | 用属性 | 用 Java |
| --- | --- | --- |
| 端口、绑定地址、context-path | `server.port`<br/>`server.address`<br/>`server.servlet.context-path` | 不需要 |
| SSL、HTTP/2、压缩、错误页 | `server.ssl.*`<br/>`server.http2.enabled`<br/>`server.compression.*` | 动态计算的值不够用时 |
| 连接数、线程池 | `server.tomcat.max-connections`<br/>`server.tomcat.accept-count`<br/>`server.tomcat.threads.max`<br/>`server.undertow.threads.worker` | 按运行时条件调整时 |
| 访问日志 | `server.tomcat.accesslog.*`<br/>`server.jetty.accesslog.*`<br/>`server.undertow.accesslog.*` | 要挂自定义 RequestLog / Valve 时 |
| 多个 Connector（HTTP + HTTPS 各一个监听端口） | 没有对应属性 | `addAdditionalTomcatConnectors` |
| 自定义 Valve、Engine 上的组件 | 没有对应属性 | `addContextValves` / `addEngineValves` |
| Reactor Netty 的 reactor-netty 调参（如 `metrics()`） | 只暴露了 `server.netty.*` 的少数项 | `addServerCustomizers` |

属性的覆盖面比想象中大：`ServerProperties` 按 `server.tomcat.*`、`server.jetty.*`、`server.netty.*`、`server.undertow.*` 分块，Undertow 还留了 `server.undertow.options.server.*` / `socket.*` 两个 map 兜底。反过来 `server.netty.*` 全部只有 `connection-timeout`、`initial-buffer-size`、`max-initial-line-length`、`max-keep-alive-requests`、`h2c-max-content-length`、`validate-headers`、`idle-timeout` 这几项，要动 reactor-netty 的参数基本都得写 Java。

::: tip 属性没配就不会被覆盖
映射用的是 `PropertyMapper.get().alwaysApplyingWhenNonNull()`——`server.port` 没写时根本不会调 `setPort`。所以在定制器里 `setPort` 和配置文件里的 `server.port` 同时存在时才谈得上谁赢。
:::

## 顺序：谁最后执行谁生效

所有定制器 Bean 被 `AnnotationAwareOrderComparator` 排序后依次调用，同一个属性被设了两遍，后一个生效。自动配置注册的那几个定制器里，除 Undertow 的 `UndertowServletWebServerFactoryCustomizer` 外，其余 `getOrder()` 都返回 `0`；它没实现 `Ordered`，排序时按默认的 `Ordered.LOWEST_PRECEDENCE` 处理。另外，启用虚拟线程（`spring.threads.virtual.enabled=true`）时会多注册两个 order 为 `1` 的定制器——Tomcat 和 Jetty 各一个（`TomcatVirtualThreadsWebServerFactoryCustomizer`、`JettyVirtualThreadsWebServerFactoryCustomizer`），作用是把容器线程池换成虚拟线程。你自己的定制器默认也是 `Ordered.LOWEST_PRECEDENCE`，也就是默认排在属性之后、覆盖属性。

想让属性赢（定制器只设默认值），给自己的定制器一个负 order：

```java
@Component
@Order(-100)
public class DefaultPortCustomizer implements WebServerFactoryCustomizer<ConfigurableServletWebServerFactory> {

    @Override
    public void customize(ConfigurableServletWebServerFactory factory) {
        factory.setPort(9000); // server.port 配了的话会被覆盖
    }
}
```

`WebServerFactoryCustomizerBeanPostProcessor` 里定制器列表是首次使用时查一次、缓存下来的，而且**只查当前容器的 Bean、不含父容器**。所以父容器里的定制器、以及首次创建服务器之后才注册进来的定制器，都不会被调用。

## 各容器的专属定制器

拿到容器专属工厂后，往它上面挂专属回调：

| 容器 | 回调 | 方法签名 | 管什么 |
| --- | --- | --- | --- |
| Tomcat | `TomcatConnectorCustomizer` | `void customize(Connector connector)` | Connector 层：端口、协议、请求体与头部大小、`asyncTimeout` |
| Tomcat | `TomcatProtocolHandlerCustomizer<T extends ProtocolHandler>` | `void customize(T protocolHandler)` | 协议处理器：线程数（`maxThreads` / `minSpareThreads`） |
| Tomcat | `TomcatContextCustomizer` | `void customize(Context context)` | Web 应用的 `Context`：资源、`LifecycleListener` |
| Jetty | `JettyServerCustomizer` | `void customize(Server server)` | Jetty `Server` 本体 |
| Undertow | `UndertowBuilderCustomizer` | `void customize(Undertow.Builder builder)` | Undertow `Builder`：端口、IO/Worker 线程、`UndertowOptions` |
| Undertow | `UndertowDeploymentInfoCustomizer` | `void customize(DeploymentInfo deploymentInfo)` | servlet 部署信息 |
| Reactor Netty | `NettyServerCustomizer` | 继承 `Function<HttpServer, HttpServer>` 的 `apply` | Reactor Netty 的 `HttpServer` |

### Tomcat

Tomcat 的专属回调挂在工厂的 `addConnectorCustomizers`、`addProtocolHandlerCustomizers` 这些方法上，下面的定制器一次改了 Connector 的 `asyncTimeout` 和协议处理器的 `maxThreads`：

```java
@Component
public class TomcatCustomizer implements WebServerFactoryCustomizer<TomcatServletWebServerFactory> {

    @Override
    public void customize(TomcatServletWebServerFactory factory) {
        factory.addConnectorCustomizers((connector) ->
                connector.setAsyncTimeout(Duration.ofSeconds(20).toMillis()));
        factory.addProtocolHandlerCustomizers((handler) -> {
            if (handler instanceof AbstractProtocol<?> protocol) {
                protocol.setMaxThreads(400);
            }
        });
    }
}
```

再加一个 HTTP 监听端口时用 `addAdditionalTomcatConnectors`——这条属性配不出来：

```java
Connector connector = new Connector(TomcatServletWebServerFactory.DEFAULT_PROTOCOL);
connector.setPort(8080);
factory.addAdditionalTomcatConnectors(connector);
```

`TomcatServletWebServerFactory.DEFAULT_PROTOCOL` 是 `"org.apache.coyote.http11.Http11NioProtocol"` 的常量。访问日志在 Tomcat 上就是往 Engine 挂一个 `AccessLogValve`，所以 `server.tomcat.accesslog.enabled=true` 之外还想换实现，直接 `addEngineValves` 或 `addContextValves`。

### Jetty 与 Undertow

Jetty 用 `addServerCustomizers`（对象是 `org.eclipse.jetty.server.Server`）和 `addConfigurations`（Web 应用的 `Configuration`）；Undertow 用 `addBuilderCustomizers` 与 `addDeploymentInfoCustomizers`：

```java
@Component
public class UndertowCustomizer implements WebServerFactoryCustomizer<UndertowServletWebServerFactory> {

    @Override
    public void customize(UndertowServletWebServerFactory factory) {
        factory.addBuilderCustomizers((builder) ->
                builder.setServerOption(UndertowOptions.MAX_HEADER_SIZE, 64 * 1024));
        factory.addDeploymentInfoCustomizers((deploymentInfo) -> {
            // deploymentInfo 上的 servlet 部署参数
        });
        factory.setEagerFilterInit(true);
    }
}
```

`setServerOption` 的第一个参数是 `io.undertow.UndertowOptions` 里的常量，想设 socket 层的选项改用 `setSocketOption`（`org.xnio.Options`）。`server.undertow.options.server.*` / `socket.*` 两个属性 map 走的是同一条路，只是值只能给字符串。

Reactor Netty 侧对应的是 `NettyServerCustomizer`，写法是 `factory.addServerCustomizers((server) -> server.idleTimeout(Duration.ofSeconds(20)))`；同一个工厂上还有 `addRouteProviders`，可以在 Spring 的处理器之前插自己的路由。

## 坑

- **泛型必须和实际容器对上**。写 `WebServerFactoryCustomizer<TomcatServletWebServerFactory>` 就只在 Tomcat 生效；换容器跑（比如切到 Undertow）时不报错、只是不执行。
- **定制器缓存 + 不含父容器**。上面提过：父容器的定制器不生效，运行期注册的也不生效。
- **不要在自己定义的工厂 Bean 上再叠一层期望**。官方文档提醒：即使你自己 `@Bean` 一个 `ServletWebServerFactory`，自动配置的定制器仍然会作用到它上面。
- **改端口不等于改请求路径**。`setPort` 只改监听端口，`server.servlet.context-path` 才改路径前缀，两者在同一个定制器里也要分别设。
- **reactive 栈另写一份**。`ReactiveWebServerFactoryAutoConfiguration` 只拦截 `ReactiveWebServerFactory`；一个应用里 servlet 和 reactive 是两个栈，别指望一份定制器通吃。
