---
title: AOP 实现原理
date: 2025-06-03
category:
  - Spring
  - Spring AOP
tags:
  - Spring
  - Spring AOP
---

# AOP 实现原理
[[toc]]

Spring AOP 的启动过程，是容器解析配置时注册自动代理创建器、创建 Bean 时判断是否需要代理、需要时再生成代理对象的一整套流程。本文从头梳理这条流程。

本文源码以 Spring Framework 6.x 为准。

::: tip
AOP 是基于 IoC 的 Bean 加载来实现的。
:::

## 从你写的代码到方法被调用

这一节先不看源码，只把「你写的代码」到「方法被调用」串成一条路径，好在读后面的源码细节之前先有一张整体地图。

1. 你写了一个 `@Aspect` 切面类，再加 `@EnableAspectJAutoProxy` 开启自动代理（用 XML 的 `aop:aspectj-autoproxy` 标签、或 Spring Boot 的自动配置也一样，最后都落到同一个类）。
2. 容器解析配置时，注册「自动代理创建器」的 BeanDefinition——也就是 `AnnotationAwareAspectJAutoProxyCreator`。
3. 容器启动、把这个 Bean 实例化出来时，因为它实现了 `BeanPostProcessor`，它被登记为一个后置处理器。
4. 之后容器创建的每一个普通 Bean，都会经过这个后置处理器。
5. 在 `postProcessAfterInitialization` 阶段，它判断这个 Bean 需不需要被增强——也就是有没有 Advisor（由切面里的切点和通知生成）命中它。
   - 命中 → 生成代理对象（JDK 或 CGLIB）并返回。
   - 没命中 → 返回原始对象。
6. 于是你从容器里拿到的，就是上一步返回的那个对象——命中的 Bean 是代理，没命中的还是原始对象。单例 Bean 最常见：容器里缓存、注入到别处用的就是这个代理。前提是通过容器获取（`getBean` 或注入）；在目标对象内部用 `this` 调自己的方法不经过代理。
7. 调用方法时，代理对象先把这次调用交给拦截器链，链一路走到目标方法，各条通知就按链上的位置在目标方法前后执行。

## Spring AOP 初始化过程
1. 解析配置并创建`AnnotationAwareAspectJAutoProxyCreator`，分为XML配置、注解配置和自动注册三种方式，下面以XML配置为例介绍：
   1. Spring IoC 容器解析 XML 配置文件的过程中会调用<Tip>AopNamespaceHandler.init()</Tip>
   2. `AopNamespaceHandler.init()`方法会注册`aop:aspectj-autoproxy`的解析类：<Tip>AspectJAutoProxyBeanDefinitionParser</Tip>
   3. `AspectJAutoProxyBeanDefinitionParser`的`parse()`方法创建了<Tip>AnnotationAwareAspectJAutoProxyCreator</Tip>
2. 创建代理：识别需要代理的Bean，如需代理返回代理对象，否则返回原始Bean
   1. `AnnotationAwareAspectJAutoProxyCreator`实现了接口[`BeanPostProcessor`](./framework-callbacks/bean-post-processor.md)
   2. 创建代理的方法是`postProcessAfterInitialization`：如果bean被子类标识为代理，则使用配置的拦截器创建一个代理；否则返回原始Bean。
3. 生成代理：代理对象的实际创建/生成过程，Spring AOP支持两种代理方式：
   1. JDK动态代理
   2. CGLIB代理
4. 拦截器链构建
   1. 将各种通知类型（Before、After等）转换为MethodInterceptor
   2. 按通知类型排序，决定各拦截器在链里的位置——这是链内的**注册顺序**，由 `ReflectiveAspectJAdvisorFactory` 里的比较器给出：`@Around → @Before → @After → @AfterReturning → @AfterThrowing`
   3. 代理对象增强：生成的代理对象内部包含原始对象和拦截器链，方法调用时，会按顺序执行拦截器链

注意，注册顺序不等于执行顺序。链按上面的顺序由外到内一层层套起来，调用时从最外层往里走。`@After` 对应的 `AspectJAfterAdvice` 把通知体写在 `finally` 里，而 `@AfterReturning` / `@AfterThrowing` 包在它更内层，所以 `@After` 在链里排在它们前面、实际却在它们之后执行。方法调用时的实际执行顺序是：

```
@Around 前半段
@Before
---- 目标方法执行 ----
正常返回 → @AfterReturning
抛异常   → @AfterThrowing
@After
@Around 后半段
```

初始化流程图如下：
```mermaid
sequenceDiagram
    participant Container as Spring IoC 容器
    participant Handler as AopNamespaceHandler
    participant Processor as AnnotationAware<br/>AspectJAutoProxyCreator
    participant ProxyFactory as ProxyFactory
    participant Target as 目标Bean
    Note over Container,Handler: 1. 解析配置并创建自动代理创建器
    Container->>Container: refresh()
    Container->>Handler: init() 经过若干层调用，最终调用该方法，创建AnnotationAwareAspectJAutoProxyCreator
    Note over Container,ProxyFactory: 2. 代理创建
    Container->>Processor: 注册后置处理器
    Container->>Target: 创建Bean实例
    Container->>Processor: postProcessAfterInitialization
    Processor->>Processor: 检查是否需要代理
    alt 需要代理
        Processor->>ProxyFactory: 获取代理对象
        ProxyFactory->>ProxyFactory: 选择JDK/CGLIB
        ProxyFactory-->>Processor: 返回代理对象
        Processor-->>Container: 返回代理对象
    else 不需要代理
        Processor-->>Container: 返回原始Bean
    end
```

### 解析配置并创建`AnnotationAwareAspectJAutoProxyCreator`
```mermaid
sequenceDiagram
   participant Ctx as ClassPathXml<br/>ApplicationContext
   participant AC as Abstract<br/>ApplicationContext
   participant RAC as AbstractRefreshable<br/>ApplicationContext
   participant BF as DefaultListable<br/>BeanFactory
   participant XBDR as XmlBean<br/>DefinitionReader
   participant DBDR as DefaultBeanDefinition<br/>DocumentReader
   participant NHR as NamespaceHandler<br/>Resolver
   participant ANH as AopNamespace<br/>Handler
   Ctx->>AC: refresh()
   AC->>RAC: refreshBeanFactory()
   RAC->>BF: loadBeanDefinitions()
   BF->>XBDR: loadBeanDefinitions()
   XBDR->>XBDR: registerBeanDefinitions()
   XBDR->>DBDR: registerBeanDefinitions()
   DBDR->>NHR: resolve()  遇到`xmlns:aop="http://www.springframework.org/schema/aop"` 命名空间声明
   NHR->>ANH: init()
```

### 代理的创建
```mermaid
sequenceDiagram
  participant User as User
  participant Creator as AnnotationAware<br/>AspectJAutoProxyCreator
  participant Creator2 as Abstract<br/>AutoProxyCreator
  participant Proxy
  User->>Creator: postProcessAfterInitialization
  Creator->>Creator: getCacheKey()
  alt earlyBeanReferences.remove(cacheKey)== bean 提前暴露的代理
    Creator ->> User: 返回原始Bean
  else
    Creator ->> Creator: wrapIfNecessary()
    alt targetSourcedBeans.contains(beanName) || !advisedBeans.get(cacheKey) 如果bean是通过TargetSource接口获取或者bean是切面类
      Creator ->> User: 返回原始Bean
    else isInfrastructureClass || shouldSkip || getAdvicesAndAdvisorsForBean() == DO_NOT_PROXY    如果是aop基础类或者跳过的类或者没有切面注解 
      Creator ->> Creator: advisedBeans.put(cacheKey, Boolean.FALSE)
      Creator ->> User: 返回原始Bean
    else   
      Creator ->> Creator2: createProxy();
      Creator2 ->> Proxy: new
      Proxy ->> Creator: return proxy
      Creator ->> Creator: advisedBeans.put(cacheKey, Boolean.TRUE);
      Creator ->> Creator: proxyTypes.put(cacheKey, proxy.getClass());
      Creator ->> User: return proxy;
    end  
  end
```
创建代理的方法是postProcessAfterInitialization：如果bean被子类标识为代理，则使用配置的拦截器创建一个代理：
```java
public Object postProcessAfterInitialization(@Nullable Object bean, String beanName) {
  if (bean != null) {
     Object cacheKey = this.getCacheKey(bean.getClass(), beanName);
     // 如果不是提前暴露的代理
     // 该字段 6.1 起改名为 earlyBeanReferences（6.0 及以前为 earlyProxyReferences）
     if (this.earlyBeanReferences.remove(cacheKey) != bean) {
        return this.wrapIfNecessary(bean, beanName, cacheKey);
     }
  }
  return bean;
}
```

wrapIfNecessary()方法用于判断是否需要创建代理，如果Bean能够获取到advisor才需要创建代理：
```java
protected Object wrapIfNecessary(Object bean, String beanName, Object cacheKey) {
  // 如果bean是通过TargetSource接口获取
  if (StringUtils.hasLength(beanName) && this.targetSourcedBeans.contains(beanName)) {
      return bean;
  }
  // 如果bean是切面类
  else if (Boolean.FALSE.equals(this.advisedBeans.get(cacheKey))) {
      return bean;
  }
  // 如果是aop基础类？是否跳过？
  else if (!this.isInfrastructureClass(bean.getClass()) && !this.shouldSkip(bean.getClass(), beanName)) {
      // 重点：获取所有advisor，如果没有获取到，那说明不要进行增强，也就不需要代理了。
      Object[] specificInterceptors = this.getAdvicesAndAdvisorsForBean(bean.getClass(), beanName, (TargetSource)null);      
      if (specificInterceptors != DO_NOT_PROXY) {
          this.advisedBeans.put(cacheKey, Boolean.TRUE);
          Object proxy = this.createProxy(bean.getClass(), beanName, specificInterceptors, new SingletonTargetSource(bean));
          this.proxyTypes.put(cacheKey, proxy.getClass());
          return proxy;
      } else {
          this.advisedBeans.put(cacheKey, Boolean.FALSE);
          return bean;
      }
  } else {
      this.advisedBeans.put(cacheKey, Boolean.FALSE);
      return bean;
  }
}
```

getAdvicesAndAdvisorsForBean()方法获取所有的Advisor:
```mermaid
sequenceDiagram
  participant User as User
  participant Creator as AbstractAdvisor<br/>AutoProxyCreator
  participant advisorRetrievalHelper as BeanFactoryAdvisor<br/>RetrievalHelper
  User ->> Creator: getAdvicesAndAdvisorsForBean()
  Creator ->> Creator: findEligibleAdvisors()
  Creator ->> Creator: candidateAdvisors = findCandidateAdvisors() <br/>获取所有切面类的切面方法生成Advisor
  Creator ->> advisorRetrievalHelper: findAdvisorBeans()
  Creator ->> Creator: findAdvisorsThatCanApply(candidateAdvisors,beanClass,beanName) <br/>找到能够应用于beanClass的Advisor
  Creator ->> Creator: extendAdvisors(eligibleAdvisors)<br/>如果需要，交给子类拓展
  Creator ->> Creator: sortAdvisors(eligibleAdvisors)<br/>对Advisor排序
  Creator ->> User: 返回Advisor数组 或 DO_NOT_PROXY
```
```java

@Nullable
protected Object[] getAdvicesAndAdvisorsForBean(Class<?> beanClass, String beanName, @Nullable TargetSource targetSource) {
  List<Advisor> advisors = this.findEligibleAdvisors(beanClass, beanName);
  return advisors.isEmpty() ? DO_NOT_PROXY : advisors.toArray();
}

protected List<Advisor> findEligibleAdvisors(Class<?> beanClass, String beanName) {
  // 获取所有切面类的切面方法生成Advisor
  List<Advisor> candidateAdvisors = this.findCandidateAdvisors();
  // 找到能够应用于beanClass的Advisor
  List<Advisor> eligibleAdvisors = this.findAdvisorsThatCanApply(candidateAdvisors, beanClass, beanName);
  // 如果需要，交给子类拓展
  this.extendAdvisors(eligibleAdvisors);
  // 对Advisor排序
  if (!eligibleAdvisors.isEmpty()) {
    eligibleAdvisors = this.sortAdvisors(eligibleAdvisors);
  }

  return eligibleAdvisors;
}

protected List<Advisor> findCandidateAdvisors() {
  Assert.state(this.advisorRetrievalHelper != null, "No BeanFactoryAdvisorRetrievalHelper available");
  return this.advisorRetrievalHelper.findAdvisorBeans();
}

protected List<Advisor> findAdvisorsThatCanApply(List<Advisor> candidateAdvisors, Class<?> beanClass, String beanName) {
  ProxyCreationContext.setCurrentProxiedBeanName(beanName);

  List var4;
  try {
    var4 = AopUtils.findAdvisorsThatCanApply(candidateAdvisors, beanClass);
  } finally {
    ProxyCreationContext.setCurrentProxiedBeanName((String)null);
  }

  return var4;
}

```

### 代理的生成
获取所有advisor后，如果有advisor，则说明需要增强，即需要创建代理，`AbstractAutoProxyCreator::createProxy()`方法是创建代理的入口方法：
```mermaid
sequenceDiagram
  participant User as User
  participant Creator as AbstractAutoProxy<br/>Creator
  participant ProxyFactory as ProxyFactory
  participant PCS as ProxyCreator<br/>Support
  participant DAPF as DefaultAop<br/>ProxyFactory
  participant AopProxy
  User ->> Creator: createProxy()
  Creator ->> ProxyFactory: 创建代理工厂
  Creator ->> ProxyFactory: 配置代理工厂
  Creator ->> Creator: buildAdvisors(beanName, specificInterceptors);
  Creator ->> ProxyFactory: getProxy(classLoader)
  ProxyFactory->>PCS: createAopProxy()
  PCS->>DAPF: createAopProxy()
  DAPF->>AopProxy: 创建AOP代理 <br/>依据条件创建代理(jdk或cglib)
  AopProxy->>Creator: return 代理对象
```

核心方法是`DefaultAopProxyFactory::createAopProxy()`，根据依据条件创建jdk或cglib代理：
::: code-tabs#java
@tab AbstractAutoProxyCreator
```java
protected Object createProxy(Class<?> beanClass, @Nullable String beanName, @Nullable Object[] specificInterceptors, TargetSource targetSource) {
    if (this.beanFactory instanceof ConfigurableListableBeanFactory) {
        AutoProxyUtils.exposeTargetClass((ConfigurableListableBeanFactory)this.beanFactory, beanName, beanClass);
    }
    // 创建代理工厂
    ProxyFactory proxyFactory = new ProxyFactory();
    proxyFactory.copyFrom(this);
    if (proxyFactory.isProxyTargetClass()) {
        if (Proxy.isProxyClass(beanClass) || ClassUtils.isLambdaClass(beanClass)) {
            Class[] var6 = beanClass.getInterfaces();
            int var7 = var6.length;

            for(int var8 = 0; var8 < var7; ++var8) {
                Class<?> ifc = var6[var8];
                proxyFactory.addInterface(ifc);
            }
        }
    } else if (this.shouldProxyTargetClass(beanClass, beanName)) {
        proxyFactory.setProxyTargetClass(true);
    } else {
        this.evaluateProxyInterfaces(beanClass, proxyFactory);
    }

    Advisor[] advisors = this.buildAdvisors(beanName, specificInterceptors);
    proxyFactory.addAdvisors(advisors);
    proxyFactory.setTargetSource(targetSource);
    this.customizeProxyFactory(proxyFactory);
    proxyFactory.setFrozen(this.freezeProxy);
    if (this.advisorsPreFiltered()) {
        proxyFactory.setPreFiltered(true);
    }

    ClassLoader classLoader = this.getProxyClassLoader();
    if (classLoader instanceof SmartClassLoader && classLoader != beanClass.getClassLoader()) {
        classLoader = ((SmartClassLoader)classLoader).getOriginalClassLoader();
    }

    return proxyFactory.getProxy(classLoader);
}
```
@tab ProxyFactory
```java
public Object getProxy(@Nullable ClassLoader classLoader) {
    return this.createAopProxy().getProxy(classLoader);
}
```
@tab ProxyCreatorSupport
```java
protected final synchronized AopProxy createAopProxy() {
    if (!this.active) {
        this.activate();
    }
    return this.getAopProxyFactory().createAopProxy(this);
}
public AopProxyFactory getAopProxyFactory() {
  return this.aopProxyFactory;
}
```

@tab DefaultAopProxyFactory
```java
public AopProxy createAopProxy(AdvisedSupport config) throws AopConfigException {
    // 满足任一条件即走 CGLIB 分支：开启 optimize、强制 proxy-target-class、目标类没有提供自定义接口
    // config.isProxyTargetClass() 由 <aop:config proxy-target-class="true" /> 配置，表示优先用 CGLIB 代理，默认 false
    if (config.isOptimize() || config.isProxyTargetClass() || !config.hasUserSuppliedInterfaces()) {
        Class<?> targetClass = config.getTargetClass();
        // 拿不到目标类、也没有任何代理接口时无法创建代理
        if (targetClass == null && config.getProxiedInterfaces().length == 0) {
            throw new AopConfigException("TargetSource cannot determine target class: " +
                    "Either an interface or a target is required for proxy creation.");
        }
        // 目标类为空（只有接口）、本身是接口 / JDK 代理类 / Lambda 时用 JDK 动态代理，否则用 CGLIB
        if (targetClass == null || targetClass.isInterface() ||
                Proxy.isProxyClass(targetClass) || ClassUtils.isLambdaClass(targetClass)) {
            return new JdkDynamicAopProxy(config);
        }
        return new ObjenesisCglibAopProxy(config);
    } else {
        return new JdkDynamicAopProxy(config);
    }
}
```
:::


## 关键类解析

前面按流程走了一遍，这一节回头看清其中的几个关键类：负责注册解析器的 `AopNamespaceHandler`、真正判断要不要代理并创建代理的 `AbstractAutoProxyCreator`，以及决定用 JDK 还是 CGLIB 的 `AopProxyFactory` / `AopProxy`。

### AopNamespaceHandler
AopNamespaceHandler 注册了四个解析器，类图如下：
```mermaid
---
title: 解析器与 Handler 的对应关系
---
classDiagram
 NamespaceHandler <|-- AopNamespaceHandler
 class NamespaceHandler{
  +init() 注册命名空间下的解析器
 }
 class AopNamespaceHandler{
  +init() 注册 aop 的解析器与装饰器
 }
 class ConfigBeanDefinitionParser["Config<br/>BeanDefinitionParser"]{
  +parse(Element,ParserContext)
 }
 class AspectJAutoProxyBeanDefinitionParser["AspectJAutoProxy<br/>BeanDefinitionParser"]{
  +parse(Element,ParserContext)
 }
 class SpringConfiguredBeanDefinitionParser["SpringConfigured<br/>BeanDefinitionParser"]{
  +parse(Element,ParserContext)
 }
 class ScopedProxyBeanDefinitionDecorator["ScopedProxy<br/>BeanDefinitionDecorator"]{
  +decorate(Node, BeanDefinitionHolder, ParserContext)
 }
 class CONFIG_PARSER_NOTE["解析 aop:config 标签"]
 class AUTOPROXY_PARSER_NOTE["解析 aop:aspectj-autoproxy 标签"]
 AopNamespaceHandler --> ConfigBeanDefinitionParser
 AopNamespaceHandler --> AspectJAutoProxyBeanDefinitionParser
 AopNamespaceHandler --> SpringConfiguredBeanDefinitionParser
 AopNamespaceHandler --> ScopedProxyBeanDefinitionDecorator
 ConfigBeanDefinitionParser .. CONFIG_PARSER_NOTE
 AspectJAutoProxyBeanDefinitionParser .. AUTOPROXY_PARSER_NOTE
 style CONFIG_PARSER_NOTE fill:none,stroke:none
 style AUTOPROXY_PARSER_NOTE fill:none,stroke:none

 class NamespaceHandler:::interface
 class AopNamespaceHandler:::implementation
 class ConfigBeanDefinitionParser:::implementation
 class AspectJAutoProxyBeanDefinitionParser:::implementation
 class SpringConfiguredBeanDefinitionParser:::implementation
 class ScopedProxyBeanDefinitionDecorator:::implementation

 classDef interface fill:#dbeafe,stroke:#2563eb,stroke-width:2px,color:#1e3a8a
 classDef implementation fill:#dcfce7,stroke:#16a34a,stroke-width:2px,color:#14532d
```

- <span class="spring-legend interface"></span>接口
- <span class="spring-legend implementation"></span>实现类

时序图如下：
```mermaid
---
title: 解析这四个标签时的调用顺序
---
sequenceDiagram
 participant U as user
 participant NH as Namespace<br/>Handler
 participant NHS as NamespaceHandler<br/>Support
 U->>+NH: init()注册BeanDefinitionParser
 NH --> NHS: registerBeanDefinitionParser(ConfigBeanDefinitionParser)
 NH --> NHS: registerBeanDefinitionParser(AspectJAutoProxyBeanDefinitionParser)
 NH --> NHS: registerBeanDefinitionDecorator(ScopedProxyBeanDefinitionDecorator)
 NH --> NHS: registerBeanDefinitionParser(SpringConfiguredBeanDefinitionParser)
```

### AbstractAutoProxyCreator
::: tip
AbstractAutoProxyCreator 是 Spring AOP 自动代理创建机制的核心抽象类，它实现了 Spring IoC 容器中 Bean 的自动代理功能。
AbstractAutoProxyCreator 是一个 BeanPostProcessor，它会在 Spring IoC 容器初始化 Bean 后，检查该 Bean 是否需要被代理（根据切面配置），并在需要时创建代理对象。
:::

#### 继承关系
```mermaid
---
title:注解切面代理创建类
---
classDiagram
class ProxyProcessorSupport["ProxyProcessor<br/>Support"]{
  +setProxyClassLoader() 指定代理类加载器
  +evaluateProxyInterfaces() 收集可代理的接口
}
class AbstractAutoProxyCreator["Abstract<br/>AutoProxyCreator"]{
  +postProcessAfterInitialization() 判断是否代理并返回
  +wrapIfNecessary() 命中 Advisor 才创建代理
}
class InstantiationAwareBeanPostProcessor["InstantiationAware<br/>BeanPostProcessor"]{
  +postProcessBeforeInstantiation() 实例化前回调
  +postProcessProperties() 注入属性
}
class SmartInstantiationAwareBeanPostProcessor["SmartInstantiationAware<br/>BeanPostProcessor"]{
  +determineCandidateConstructors() 挑选候选构造器
  +getEarlyBeanReference() 提前暴露 Bean 引用
}
class AbstractAdvisorAutoProxyCreator["AbstractAdvisor<br/>AutoProxyCreator"]{
  +findEligibleAdvisors() 找出可用的 Advisor
  +findCandidateAdvisors() 收集候选 Advisor
}
class BeanNameAutoProxyCreator["BeanName<br/>AutoProxyCreator"]{
  +setBeanNames() 按名字指定要代理的 Bean
}
class InfrastructureAdvisorAutoProxyCreator["Infrastructure<br/>AdvisorAutoProxyCreator"]{
  +isEligibleAdvisorBean() 只认基础设施 Advisor
}
class AspectJAwareAdvisorAutoProxyCreator["AspectJAware<br/>AdvisorAutoProxyCreator"]{
  +sortAdvisors() 给 Advisor 排序
  +extendAdvisors() 交给子类扩展
}
class AnnotationAwareAspectJAutoProxyCreator["AnnotationAware<br/>AspectJAutoProxyCreator"]{
  +setAspectJAdvisorFactory() 设置切面工厂
  +findCandidateAdvisors() 扫描切面收集 Advisor
}
class DefaultAdvisorAutoProxyCreator["DefaultAdvisor<br/>AutoProxyCreator"]{
  +setUsePrefix() 是否按前缀过滤 Advisor
  +setAdvisorBeanNamePrefix() 指定 Advisor 名字前缀
}
class AUTO_PROXY_NOTE["自动代理创建机制的核心抽象类<br/>可以通过继承它以自定义代理逻辑"]
class ProxyConfig{
  +setProxyTargetClass() 是否强制 CGLIB 代理
  +setExposeProxy() 是否暴露当前代理
}
class BeanFactoryAware{
  +setBeanFactory() 注入 BeanFactory
}
ProxyConfig <|-- ProxyProcessorSupport
ProxyProcessorSupport <|-- AbstractAutoProxyCreator
BeanFactoryAware <|-- AbstractAutoProxyCreator
class BeanPostProcessor{
  +postProcessBeforeInitialization(Object,String)
  +postProcessAfterInitialization(Object,String)
}
BeanPostProcessor <|-- InstantiationAwareBeanPostProcessor
InstantiationAwareBeanPostProcessor <|-- SmartInstantiationAwareBeanPostProcessor
SmartInstantiationAwareBeanPostProcessor <|-- AbstractAutoProxyCreator
AbstractAutoProxyCreator .. AUTO_PROXY_NOTE
AbstractAutoProxyCreator <|-- BeanNameAutoProxyCreator
AbstractAutoProxyCreator <|-- AbstractAdvisorAutoProxyCreator
AbstractAdvisorAutoProxyCreator <|-- InfrastructureAdvisorAutoProxyCreator
AbstractAdvisorAutoProxyCreator <|-- AspectJAwareAdvisorAutoProxyCreator
AspectJAwareAdvisorAutoProxyCreator <|-- AnnotationAwareAspectJAutoProxyCreator
AbstractAdvisorAutoProxyCreator <| -- DefaultAdvisorAutoProxyCreator

 style AUTO_PROXY_NOTE fill:none,stroke:none

 class BeanPostProcessor:::interface
 class InstantiationAwareBeanPostProcessor:::interface
 class SmartInstantiationAwareBeanPostProcessor:::interface
 class BeanFactoryAware:::interface
 class ProxyProcessorSupport:::abstract
 class AbstractAutoProxyCreator:::abstract
 class AbstractAdvisorAutoProxyCreator:::abstract
 class ProxyConfig:::implementation
 class BeanNameAutoProxyCreator:::implementation
 class InfrastructureAdvisorAutoProxyCreator:::implementation
 class AspectJAwareAdvisorAutoProxyCreator:::implementation
 class AnnotationAwareAspectJAutoProxyCreator:::implementation
 class DefaultAdvisorAutoProxyCreator:::implementation

 classDef interface fill:#dbeafe,stroke:#2563eb,stroke-width:2px,color:#1e3a8a
 classDef abstract fill:#e0e7ff,stroke:#4f46e5,stroke-width:2px,color:#312e81
 classDef implementation fill:#dcfce7,stroke:#16a34a,stroke-width:2px,color:#14532d
```

- <span class="spring-legend interface"></span>接口
- <span class="spring-legend abstract"></span>抽象类
- <span class="spring-legend implementation"></span>实现类

AbstractAutoProxyCreator 实现了两个接口：
- [`BeanFactoryAware`](./spring-framework-ioc-impi.md#aware-接口)：BeanFactoryAware接口用于获取BeanFactory，并将BeanFactory注入到AbstractAutoProxyCreator中。
- SmartInstantiationAwareBeanPostProcessor：SmartInstantiationAwareBeanPostProcessor接口是BeanPostProcessor的子接口，自身声明的方法是`predictBeanType`、`determineCandidateConstructors`和`getEarlyBeanReference`：
   + 常提到的`postProcessBeforeInstantiation`来自父接口 InstantiationAwareBeanPostProcessor，它在Bean实例化之前调用，可以返回一个替代实例来短路后续的创建流程，决定这个Bean还要不要按常规方式实例化
   + `getEarlyBeanReference`在循环依赖提前暴露引用时调用，返回（可能已被代理的）早期引用
主要子类及功能： 
- BeanNameAutoProxyCreator
   + 基于 Bean 名称的自动代理创建器
   + 通过配置 Bean 名称列表来决定哪些 Bean 需要代理
   + 不依赖 AspectJ 注解或 Pointcut 表达式
   + 适合简单的、基于名称的代理需求

- AbstractAdvisorAutoProxyCreator
   - AspectJAwareAdvisorAutoProxyCreator：支持 AspectJ 风格（XML 配置 / Advisor）切面定义的基类自动代理创建器，@Aspect 注解的支持由子类 AnnotationAwareAspectJAutoProxyCreator 补齐，它的注册过程取决于 Spring 配置方式
      + 能够识别容器中的 Advisor Bean
      + 支持基于 Pointcut 的匹配
   - AnnotationAwareAspectJAutoProxyCreator：支持 AspectJ 注解风格的自动代理创建器（最常用的实现）
      + 匹配带 `@Aspect` 注解的类，或实现 `Advisor` 接口的 Bean
      + 自动检测 @Before, @After, @Around 等注解
      + 是 @EnableAspectJAutoProxy 默认注册的类型
   - InfrastructureAdvisorAutoProxyCreator
      + 专门为 Spring 基础设施 Bean 提供自动代理支持。
      + 只处理基础设施角色（ROLE_INFRASTRUCTURE）的 Advisor
      + 通常用于 Spring 内部事务管理、缓存等基础设施
      + 不处理常规应用 @Aspect 切面
   - DefaultAdvisorAutoProxyCreator
      + 自动应用容器中所有的 Advisor
      + 不需要显式配置每个 Bean 的代理
      + 适合需要全局应用某些切面的场景

| 类名 | 代理触发条件 | 主要用途 | 支持注解 |
| ---- | ---- | ---- | ---- |
| BeanNameAutoProxyCreator | 匹配配置的 Bean 名称 | 简单名称匹配场景 | |
| AspectJAwareAdvisorAutoProxyCreator | 能够识别容器中的 Advisor Bean || |
| AnnotationAwareAspectJAutoProxyCreator |匹配带 @Aspect 注解的类，或实现 Advisor 接口的 Bean| 常规应用 AOP | @Before, @After, @Around  |
| InfrastructureAdvisorAutoProxyCreator|匹配基础设施角色（ROLE_INFRASTRUCTURE）的 Advisor| Spring 内部基础设施 ||
| DefaultAdvisorAutoProxyCreator | 匹配所有 Advisor | 全局切面应用 | |

#### 注册过程

不管用 XML、注解还是 Spring Boot 自动配置，最终注册的都是同一个自动代理创建器 `AnnotationAwareAspectJAutoProxyCreator`，区别只在触发方式。下面按这三种方式分别看。

##### XML配置方式注册
当使用传统 XML 配置 AOP 时，注册发生在 <aop:config> 或 <aop:aspectj-autoproxy> 标签解析过程中：
1. 解析 aop 命名空间时，AopNamespaceHandler 会处理 <aop:aspectj-autoproxy> 标签
2. 调用 AspectJAutoProxyBeanDefinitionParser.parse() 方法
3. 最终注册 AnnotationAwareAspectJAutoProxyCreator
```java
class AspectJAutoProxyBeanDefinitionParser implements BeanDefinitionParser {
   @Nullable
   public BeanDefinition parse(Element element, ParserContext parserContext) {
      AopNamespaceUtils.registerAspectJAnnotationAutoProxyCreatorIfNecessary(parserContext, element);
      this.extendBeanDefinition(element, parserContext);
      return null;
   }
}
public abstract class AopNamespaceUtils {
   public static void registerAspectJAnnotationAutoProxyCreatorIfNecessary(ParserContext parserContext, Element sourceElement) {
      BeanDefinition beanDefinition = AopConfigUtils.registerAspectJAnnotationAutoProxyCreatorIfNecessary(parserContext.getRegistry(), parserContext.extractSource(sourceElement));
      useClassProxyingIfNecessary(parserContext.getRegistry(), sourceElement);
      registerComponentIfNecessary(beanDefinition, parserContext);
   }
}
```

##### 注解配置方式注册
使用 @EnableAspectJAutoProxy 注解时：
1. @EnableAspectJAutoProxy 注解通过 @Import(AspectJAutoProxyRegistrar.class) 引入注册逻辑
2. AspectJAutoProxyRegistrar 实现 ImportBeanDefinitionRegistrar 接口
3. 在 registerBeanDefinitions() 方法中注册 AnnotationAwareAspectJAutoProxyCreator

##### 自动注册机制
在 Spring Boot 中，自动配置会隐式注册：
1. 通过 spring-boot-autoconfigure 中的 AopAutoConfiguration 自动配置类
2. 当检测到存在 AOP 相关依赖时自动生效
3. 同样注册的是 AnnotationAwareAspectJAutoProxyCreator

##### 注册的具体位置
在 Spring 内部，所有路径最终都会调用 AopConfigUtils 工具类的`registerAspectJAnnotationAutoProxyCreatorIfNecessary`方法：
```java
public static BeanDefinition registerAspectJAnnotationAutoProxyCreatorIfNecessary(
    BeanDefinitionRegistry registry, Object source) {    
    return registerOrEscalateApcAsRequired(AnnotationAwareAspectJAutoProxyCreator.class, registry, source);
}
```

### AopProxyFactory & AopProxy
Spring AOP 中的 AopProxyFactory 和 AopProxy 是代理创建机制的核心接口，它们共同决定了 Spring 如何为目标对象创建代理。
```mermaid
classDiagram
AopProxyFactory <|-- DefaultAopProxyFactory
AopProxyFactory --> AopProxy
DefaultAopProxyFactory --> JdkDynamicAopProxy
DefaultAopProxyFactory --> ObjenesisCglibAopProxy
AopProxy <|-- JdkDynamicAopProxy
AopProxy <|-- CglibAopProxy 
CglibAopProxy <|-- ObjenesisCglibAopProxy

 class AopProxyFactory:::interface
 class AopProxy:::interface
 class DefaultAopProxyFactory:::implementation
 class JdkDynamicAopProxy:::implementation
 class CglibAopProxy:::implementation
 class ObjenesisCglibAopProxy:::implementation

 classDef interface fill:#dbeafe,stroke:#2563eb,stroke-width:2px,color:#1e3a8a
 classDef implementation fill:#dcfce7,stroke:#16a34a,stroke-width:2px,color:#14532d
```

- <span class="spring-legend interface"></span>接口
- <span class="spring-legend implementation"></span>实现类

#### AopProxyFactory
AopProxyFactory 是创建 AOP 代理的工厂接口，它根据配置决定使用 JDK 动态代理还是 CGLIB 代理。

#### AopProxy
常见实现类比较：
|特性及性能|JdkDynamicAopProxy|ObjenesisCglibAopProxy|
|----|----|----|
|实现原理|基于 JDK 动态代理实现|基于 CGLIB 字节码生成|
|创建方式|使用 java.lang.reflect.Proxy 创建|通过生成目标类的子类创建|
|目标类是否需要实现接口|需要|不需要|
|创建开销|低|高|
|调用性能|两者性能差异取决于 JDK 版本与调用次数，没有普适结论||
|内存占用|低|较高|

选择建议：
- 优先 JDK 动态代理
- 当目标没有接口或需要代理非public方法时只能选择CGLIB

识别代理类型:
```java
if (AopUtils.isJdkDynamicProxy(bean)) {
    System.out.println("JDK动态代理");
} else if (AopUtils.isCglibProxy(bean)) {
    System.out.println("CGLIB代理");
}
```

常见问题：
- CGLIB 无法代理 final 方法
- CGLIB 代理对象需要额外处理序列化
