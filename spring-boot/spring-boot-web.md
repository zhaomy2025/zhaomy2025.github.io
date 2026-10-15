---
title: Spring Boot 的 Web 支持
date: 2026-09-23
category:
  - spring
  - spring-boot-web
tags:
  - spring
  - spring-boot-web
---

# Spring Boot 的 Web 支持
[[toc]]

Spring Boot 为 Spring MVC 做了自动配置，绝大多数项目不需要写 MVC 配置类。Spring MVC 处理请求的基本形态是：`@Controller` 或 `@RestController` 标注的 Bean 接住进来的 HTTP 请求，控制器里的方法用 `@RequestMapping`（及其派生注解）映射到具体路径。

本文内容对 Spring Boot 2.4 及以后版本均适用。

## 自动配置提供了什么

除了 Spring MVC 本身的默认行为，自动配置还额外注册了：

- `ContentNegotiatingViewResolver` 与 `BeanNameViewResolver`
- 静态资源支持，含 WebJars
- `Converter`、`GenericConverter`、`Formatter` 的自动注册
- `HttpMessageConverters` 支持
- `MessageCodesResolver`
- 静态 `index.html` 支持
- `ConfigurableWebBindingInitializer`

## 想定制时从哪里插手

多数项目不需要 MVC 配置类，只有遇到自动配置覆盖不到的需求才会想插手：请求进出控制器时要多一层处理（登记拦截器、补 CORS 规则），要注册自定义的 `Formatter` / `Converter`，或者要加自动配置不认识的视图控制器和静态资源映射——这些属于业务规则，框架替你决定不了。再深一层是替换 `RequestMappingHandlerMapping` 这类核心组件的实例，最深的一种是连自动配置一起放弃、全都自己装配。

自动配置和 [`@EnableWebMvc`](../spring-framework/annotations/enable-annotations.md#enablewebmvc-一个完整的例子) **不能同时用**——后者会关掉前者。按定制程度从浅到深有三种做法：

| 需求 | 做法 |
| --- | --- |
| 保留自动配置，追加拦截器、格式化器、视图控制器、静态资源映射 | 加一个实现 [`WebMvcConfigurer`](../spring-framework/framework-callbacks/web-mvc-configurer.md#什么时候需要它) 的 `@Configuration` 类，**不要**加 `@EnableWebMvc` |
| 要自定义 `RequestMappingHandlerMapping`、`RequestMappingHandlerAdapter`、`ExceptionHandlerExceptionResolver` 的实例，同时保留其余自动配置 | 声明一个 `WebMvcRegistrations` Bean |
| 完全接管 Spring MVC | 用 `@EnableWebMvc`，自动配置全部失效。它本质上是导入 `DelegatingWebMvcConfiguration`，直接写后者效果相同 |

静态资源映射的写法：

```java
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Value("${web.upload.path}")
    private String uploadPath;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 将 /static/** 映射到 classpath:/static/
        registry.addResourceHandler("/static/**")
                .addResourceLocations("classpath:/static/");
        // 将 /resources/** 映射到磁盘目录
        // 路径结尾必须是分隔符，否则最后一段会被当成文件名，相对定位会落到上级目录
        registry.addResourceHandler("/resources/**")
                .addResourceLocations("file:" + uploadPath + "/");
    }
}
```

`WebMvcConfigurer` 的各个方法都有默认实现，按需覆写即可——不再需要过去那个 `WebMvcConfigurerAdapter` 中间类。

## HTTP 消息转换器

Spring MVC 用 `HttpMessageConverter` 把 HTTP 请求体和响应体转换成 Java 对象，反之亦然。对象转 JSON 走 Jackson，转 XML 走 Jackson XML 扩展（可用时）或 JAXB。

自动配置已经注册好一批默认转换器，字符串默认按 UTF-8 编码。另外，context 里任何 `HttpMessageConverter` 类型的 Bean 都会被自动加进转换器列表——只加一个转换器，未必要写配置类。

要更细粒度地调整：

| 方法 | 语义 |
| --- | --- |
| `WebMvcConfigurer#extendMessageConverters` | 在默认转换器之后调用，用来追加或调整 |
| `WebMvcConfigurer#configureMessageConverters` | 接管整个转换器列表，默认的那批不再加入 |

只想加一个转换器用前者，但要注意加的位置：`extendMessageConverters` 拿到的列表里已经有默认那批，`add` 是追加到末尾，同类型的内容会先被前面的默认转换器接走。要让自定义的优先，得插到列表头部：

```java
@Override
public void extendMessageConverters(List<HttpMessageConverter<?>> converters) {
    StringHttpMessageConverter converter = new StringHttpMessageConverter(StandardCharsets.UTF_8);
    converter.setSupportedMediaTypes(List.of(
            MediaType.TEXT_PLAIN,
            MediaType.APPLICATION_JSON));
    // 插到头部，否则 text/plain 会先被默认的 StringHttpMessageConverter 处理
    converters.add(0, converter);
}
```

## 路径匹配

Spring Boot **默认禁用了后缀模式匹配**，`GET /projects/spring-boot.json` 不会被映射到 `@GetMapping("/projects/spring-boot")`。这是官方推荐的做法——后缀匹配主要是为过去那些不发 `Accept` 头的客户端服务的，留着容易和内容协商打架。

## 模板引擎

Spring Boot 内置了 FreeMarker、Groovy、Thymeleaf、Mustache 的自动配置，用默认配置时模板自动从 `src/main/resources/templates` 加载。

::: warning 尽量避免 JSP
JSP 在嵌入式 Servlet 容器下有若干已知限制，官方文档明确建议避开它。要用服务端模板，Boot 内置自动配置了 Thymeleaf、FreeMarker、Groovy、Mustache 四种。
:::
