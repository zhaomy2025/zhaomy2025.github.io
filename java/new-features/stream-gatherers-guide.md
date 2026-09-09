# JEP 485：流收集器

[[toc]]

## 核心目标：为什么需要流收集器？

想象一下，Java 的流（Stream）是一条智能工厂流水线。流水线上有各种现成的机器人（内置操作）：

+   `map` 机器人：把每个零件换成另一个零件。

+   `filter` 机器人：把不合格的零件扔掉。

+   `limit` 机器人：只放行前 N 个零件。

这些机器人很好用，但功能是固定的。有一天，厂长想：

> “能不能每两个零件来了，就把它俩打包成一个盒子，然后继续在流水线上传送？”

你用现有的机器人试试？你会发现非常别扭。你只有两个选择：

1.  强行终止流水线：用 `collect` 把零件都搬下来，在流水线外手动打包，然后再开一条新流水线。又慢又麻烦。

2.  使用复杂的组合技：：尝试用 filter 机器人筛选位置，让 map 机器人强行记住状态，再请 reduce 机器人帮忙组装。这套组合拳指令复杂、容易出错，又脆又难维护。

JEP 485 就是为了解决这个问题！

它让你可以定制自己的机器人，也就是 Gatherer。你可以给它编程，让它完成像“打包”、“分组”、“去重”这类复杂任务，然后把它安装到流水线上，和其他机器人协同工作。

它的核心价值是：让复杂的流转换操作变得声明式、可组合、可重用。

## 一个生动的例子：Before vs After

任务： 将流 `["A", "B", "C", "D", "E"]` 每两个元素打成一个包，变成 `[["A", "B"], ["C", "D"], ["E"]]`

### 以前的“蹩脚”方法（使用 `map`）

```java

List<String> list = List.of("A", "B", "C", "D", "E");
int windowSize = 2;

// “魔法”开始：用 map 实现固定窗口分组
List<List<String>> result = Stream.iterate(0, i -> i + windowSize) // 生成索引 0, 2, 4...
        .map(startIndex -> list.stream()
                .skip(startIndex)          // 性能陷阱！
                .limit(windowSize)         // 取2个
                .collect(Collectors.toList()))
        .takeWhile(window -> !window.isEmpty()) // 直到窗口为空
        .collect(Collectors.toList());

System.out.println(result); // 输出: [[A, B], [C, D], [E]]

```

缺点：
+   性能差：每次 `skip` 都可能从头遍历列表，是 O(n²) 的时间复杂度。

+   难懂：这代码是在“生成索引的流上映射一个从原列表跳过的子流”？没人一眼能看懂。

+   不通用：只能在 `List` 上这样玩，如果是来自网络或文件的流，这招完全失效。

### 现在的“优雅”方法（使用 Gatherer）

```java

import java.util.stream.Gatherers;

List<String> list = List.of("A", "B", "C", "D", "E");

List<List<String>> result = list.stream()
        .gather(Gatherers.windowFixed(2)) // 一句话，意思明确
        .toList();

System.out.println(result); // 输出: [[A, B], [C, D], [E]]

```

优点：
+   高性能：内部维护一个缓冲区，顺序处理，是 O(n) 复杂度。

+   易读：“windowFixed(2)” 就是“固定窗口大小为2”，意图清晰。

+   通用：适用于任何流（集合、IO、生成器）。

## 核心概念与 API

### 新方法：`Stream::gather(Gatherer)`

这是将自定义操作接入流管道的“万能接口”。它是一个中间操作，用完后流还在。

### 核心接口：`Gatherer<T, A, R>`

这就是你定制的“机器人”蓝图。

+   `T`：输入类型（流水线上的零件类型）。

+   `A`：（可选）机器人内部状态的类型。比如“打包机器人”需要个“篮子”来临时放零件。

+   `R`：输出类型（机器人处理后的产品类型）。

### 如何造“机器人”？`Gatherer.of()` 工厂方法

最常用的方法是接收三个参数：

```java

Gatherer.of(
    Supplier<A> initializer,      // 1. 如何初始化状态（给我个新篮子）
    Integrator<A, T, R> integrator, // 2. 核心逻辑（每个零件来了怎么处理）
    BiConsumer<A, Downstream<R>> finisher // 3. 流水线结束时做什么（清空篮子）
)

```

举个例子： 我们来实现一个“每遇到”B“就发出一个信号”的机器人。

```java

// 自定义Gatherer：每遇到一个 "B" 就输出字符串 "Found B!"
Gatherer<String, ?, String> findBGatherer = Gatherer.of(
    // 1. 初始状态：不需要状态，返回null
    () -> null,

    // 2. 处理逻辑：如果元素是"B"，就向下游发出"Found B!"
    (state, element, downstream) -> {
        if ("B".equals(element)) {
            downstream.push("Found B!");
        }
        return true; // 继续处理下一个元素
    },

    // 3. 结束逻辑：无事可做
    (state, downstream) -> {}
);

// 使用它
List<String> list = List.of("A", "B", "C", "B");
List<String> result = list.stream()
        .gather(findBGatherer)
        .toList();
System.out.println(result); // 输出: [Found B!, Found B!]

```

## `Gatherers` 工具类及替代方案对比

JDK 贴心地提供了许多现成的“机器人”，放在 `Gatherers` 类里。

| 收集器 (Gatherer) | 功能描述 | 优雅版（JEP 485） | 蹩脚版（替代方案） |
| :--- | :--- | :--- | :--- |
| `windowFixed(int size)` | 固定大小窗口 | `.gather(Gatherers.windowFixed(2))` | `Stream.iterate(0, i->i+size)`<br>`.map(i->list.stream().skip(i).limit(size).collect(Collectors.toList()))`<br>`.takeWhile(w->!w.isEmpty())` |
| `windowSliding(int size)` | 滑动窗口 | `.gather(Gatherers.windowSliding(2))` | 极其复杂，需要维护状态和列表拷贝，代码冗长，会终止流 |
| `fold(init, folder)` | 累积并发出中间结果 | `.gather(Gatherers.fold(()->0, (sum, e)->sum+e))` | 代码冗长，会终止流 |
| `scan(init, scanner)` | 带初始值的累积 | `.gather(Gatherers.scan(()->0, (sum, e)->sum+e))` | 代码冗长，会终止流 |
| `distinct()` | 去重 | `.gather(Gatherers.distinct())` | `.distinct()`（这个本来就有，但展示了API统一性） |
| `distinctBy(Function)` | 根据Key去重 | `.gather(Gatherers.distinctBy(Person::name))` |  代码冗长，会终止流 |
| `mapConcurrent(...)` | 并发映射 | `.gather(Gatherers.mapConcurrent(4, func))` | 几乎无法正确实现，涉及复杂的线程池和同步 |
| `peek(Consumer)` | 查看元素 | `.gather(Gatherers.peek(System.out::println))` | `.peek(System.out::println)`（已有） |
| `takeWhile(Predicate)` | 条件获取 | `.gather(Gatherers.takeWhile(e->e<5))` | `.takeWhile(e->e<5)`（已有） |
| `dropWhile(Predicate)` | 条件丢弃 | `.gather(Gatherers.dropWhile(e->e<5))` | `.dropWhile(e->e<5)`（已有） |

总结一下表格：
+   优雅版：一行代码，意图清晰，性能高效。

+   蹩脚版：要么无法实现，要么代码复杂难懂，要么性能极差，甚至会终止流，违背了“中间操作”的初衷。

### windowFixed 固定大小窗口

可以看作是flatMap的逆操作。

```java
Stream.iterate(0, i->i+size)
    .map(i->list.stream().skip(i).limit(size).collect(Collectors.toList()))
    .takeWhile(w->!w.isEmpty())
```

### windowSliding 滑动窗口

::: code-tabs

@tab List版本
```java
List<String> list = List.of("A", "B", "C", "D", "E");
int windowSize = 2;

// 手动实现滑动窗口的"蹩脚"版本
List<List<String>> result = IntStream.range(0, list.size() - windowSize + 1)
    .mapToObj(startIndex -> list.subList(startIndex, startIndex + windowSize))
    .collect(Collectors.toList());

System.out.println(result);
```

@tab 通用版本

```
List<String> list = List.of("A", "B", "C", "D", "E");
int windowSize = 2;

// 使用状态管理的复杂版本
List<List<String>> result = list.stream()
    .collect(Collector.of(
        () -> {
            List<List<String>> windows = new ArrayList<>();
            LinkedList<String> buffer = new LinkedList<>();
            return new Object() {
                List<List<String>> windows = windows;
                LinkedList<String> buffer = buffer;
            };
        },
        (state, element) -> {
            state.buffer.offer(element);
            if (state.buffer.size() == windowSize) {
                state.windows.add(new ArrayList<>(state.buffer));
                state.buffer.poll();
            }
        },
        (state1, state2) -> { throw new UnsupportedOperationException(); },
        state -> state.windows
    ));
System.out.println(result);
```
:::

### fold 累积并发出中间结果

```java
List<Integer> result = numbers.stream()
    .collect(Collector.of(
        () -> new ArrayList<Integer>(),
        (list, element) -> {
            int last = list.isEmpty() ? 0 : list.get(list.size() - 1);
            list.add(last + element);
        },
        (list1, list2) -> { throw new UnsupportedOperationException(); }
    ));

System.out.println(result); // 输出: [1, 3, 6, 10]
```

问题：

+ 使用 collect 终止流：无法继续后续的流操作

+ 代码复杂：需要手动管理状态

+ 并行流支持困难

### scan(init, scanner) 带初始值的累积

```java
List<Integer> result = Stream.concat(
    Stream.of(0), // 初始值
    numbers.stream()
        .collect(ArrayList::new, (list, element) -> {
            int last = list.isEmpty() ? 0 : list.get(list.size() - 1);
            list.add(last + element);
        }, (list1, list2) -> {})
        .stream()
).toList();

System.out.println(result); // 输出: [0, 1, 3, 6, 10]
```

问题：

- 性能低下：多次流转换

- 代码晦涩：难以理解和维护

- 依然终止流：本质还是收集操作

### distinctBy

```
people.stream()
.collect(Collectors.toMap(Person::name, p->p, (p1,p2)->p1)) // 把流转换成了一个 Map<String, Person>
.values() // 从 Map 中提取所有的 value，得到一个 Collection<Person>
```

问题：

- 代码晦涩：难以理解和维护

- 依然终止流：本质还是收集操作

## 最终总结

JEP 485 就像是为 Java 流生态系统开启了“模组（Mod）”支持。
以前，你只能使用游戏本体自带的武器（内置操作）。现在，你可以自己制作武器（自定义 Gatherer），或者下载别人制作好的精美武器（使用 `Gatherers` 工具类或第三方库）。

它将流从一套固定的操作变成了一个可扩展的数据处理平台，解决了社区多年来的痛点，是流 API 一次真正意义上的进化。