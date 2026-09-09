### 核心目标

+ 将稳定值的创建与其初始化分离，而不会造成重大性能损失。
+ 保证稳定值最多初始化一次，即使在多线程程序中也是如此。

### 现有问题

#### final 字段

```
class OrderController {

    private final Logger logger = Logger.create(OrderController.class);

    void submitOrder(User user, List<Product> products) {
        logger.info("order started");
        ...
        logger.info("order submitted");
    }

}
```

由于 logger 是 OrderController 类的 final 字段，因此在创建 OrderController 实例时，必须立刻初始化该字段。这意味着创建新的 OrderController 可能会很慢，毕竟，获取日志记录器有时需要进行昂贵的操作，如读取和解析配置数据，或准备记录日志事件的存储空间。这种初始化工作不仅不利于应用程序的启动，而且可能没有必要。毕竟，有些组件可能永远都不需要记录事件，那么为什么要在前面做这些昂贵的工作呢？

#### 延迟初始化

由于这些原因，我们通常会尽可能推迟复杂对象的初始化时间，以便只在需要时才创建这些对象。我们可以将其初始化移到 getter 方法中。该方法会检查是否已经存在日志对象；如果不存在，则会创建一个新的日志对象，并将其存储在一个 logger 字段中。虽然这种方法可以改善应用程序的启动，但也有一些缺点：
+ 直接访问 logger 字段可能会暴露一个尚未初始化的字段，从而导致 NullPointerException。
+ 多线程环境下，可能会导致创建多个日志记录器对象。虽然可以通过一些技术来解决这个问题，但都引入了复杂性，并且存在一些缺点或限制：
    - Class-holder允许常量折叠优化，但它只适用于 static 字段，且每个字段都需要一个单独的持有者类。
    - 双重检查锁无法应用常量折叠优化，而且必须声明 logger 字段为 volatile。

#### 总结

我们可能会期望 JVM 通过对已初始化的 logger 字段进行常量折叠访问，或在 getLogger 方法中省略 logger == null 检查等方式来优化对 logger 字段的访问。遗憾的是，由于字段不再是 final，JVM 无法相信其内容在初始更新后永远不会改变。使用可变字段实现的灵活初始化并不高效。

简而言之，Java 语言允许我们控制字段初始化的方式要么太受约束，要么太不受约束。一方面，final字段受到的约束太强，需要在对象或类的生命周期早期进行初始化，这通常会降低应用程序的启动性能。另一方面，通过使用非final可变字段进行灵活初始化使得推理正确性变得更加困难。不变性和灵活性之间的紧张关系导致开发人员采用不完美的技术，这些技术无法解决根本问题，并导致代码更加脆弱且难以维护。

### 稳定值

稳定值是一个对象，其类型为 StableValue，只保存一个数据值，即其内容。稳定值必须在首次检索其内容之前的一段时间初始化，此后将不可更改。稳定值是实现延迟不变性的一种方法。

#### 稳定对象

有两种指定初始化的方式：
+ 使用StableValue::orElseSet()方法在 getter 方法中指定初始化
+ 使用StableValue.supplier()方法在声明位置指定初始化

``` java

class OrderController {
    // 在 getter 方法中指定初始化
    private final StableValue<Logger> logger = StableValue.of();

    Logger getLogger() {
        // orElseSet方法保证提供的 lambda 表达式仅计算一次，即使logger.orElseSet(...)同时调用也是如此。
        return logger.orElseSet(() -> Logger.create(OrderController.class));
    }

    // 在声明位置指定初始化
    private final Supplier<Logger> logger
        = StableValue.supplier(() -> Logger.create(OrderController.class));

    void submitOrder(User user, List<Product> products) {
        logger.get().info("order started");
        ...
        logger.get().info("order submitted");
    }

}

```

#### 稳定列表

```java

class Application {
    static final List<OrderController> ORDERS
        = StableValue.list(POOL_SIZE, _ -> new OrderController());
    public static OrderController orders() {
        long index = Thread.currentThread().threadId() % POOL_SIZE;
        return ORDERS.get((int)index);
    }
}

```
