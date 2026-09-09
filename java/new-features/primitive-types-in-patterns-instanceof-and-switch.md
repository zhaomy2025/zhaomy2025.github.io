# 模式、instanceof 和 switch中的原始类型

## 基本概念

模式 (Pattern)是一个通用概念，指的是在条件判断中同时进行类型检查和变量绑定的操作。例如：obj instanceof String s 就是一个类型模式，它同时检查 obj 是否是 String 类型，如果是，则将其绑定到变量 s。

instanceof 运算符是应用类型模式的第一个地方。从 Java 16 开始，instanceof 后面可以直接跟一个类型模式和变量名。

switch 表达式/语句是应用多种模式（包括类型模式、常量模式等）的更强大场所。在 Java 17 和 21 中，switch 的能力被大幅增强，case 标签可以支持模式。

所以三者关系是：模式匹配是一个范式；instanceof 和 switch 是应用该范式的语法工具。

因此，对该特性最准确的理解是：为模式、instanceof 和 switch 添加对原始类型的支持。

## 历史

该特性最初由 JEP 455 （JDK 23）预览，并由 JEP 488 （JDK 24）和 JEP 507 （JDK 25）再次预览，没有变动。

## 目标

该特性将通过允许所有模式和上下文中的原始类型来增强模式匹配。

该功能的目标包括：
- 通过允许所有类型（无论是原始类型还是引用类型）的类型模式实现统一的数据探索
- 将类型模式与 instanceof 对齐，并将 instanceof 与安全转换对齐
- 允许模式匹配在嵌套和顶级模式上下文中使用原始类型

其他目标包括：
- 提供易于使用的构造，以消除由于不安全的转换而丢失信息的风险
- 遵循 Java 5（enum switch）和 Java 7（string switch）中对 switch 的增强，允许 switch 处理任何原始类型的值

## 非目标

不添加新的转换类型到 Java 语言中。

## 动机

多个涉及原始类型的限制，在应用模式匹配、instanceof 和 switch 时引发了诸多不便。消除这些限制将使 Java 语言更加统一和更具表现力。

JEP 488 的核心是解决一个长期存在的痛点：在模式匹配中使用原始类型时，开发者的直觉（“这应该能工作”）常常会触发编译错误。它通过引入**宽松的原始类型转换**来填补这一鸿沟，使代码更符合预期。
在 JEP 488 之前，以下代码是无法编译的：

```java
// 示例 1: instanceof - 之前编译错误
Object obj = 42;
if (obj instanceof int value) { // 错误: 模式类型 int 是原始类型，而表达式类型是引用类型
    System.out.println(value);
}

// 示例 2: switch - 之前编译错误
Object obj = 42;
switch (obj) {
    case int i -> System.out.println("int: " + i); // 同样的错误
    default -> {}
}
```

因为模式匹配的语义要求：**模式变量的类型必须与选择器表达式（Selector Expression）的类型可转换**。
+ `obj` 的类型是 `Object`（引用类型）。
+ `int` 是原始类型。
+ 在严格的类型系统下，引用类型 `Object` 和原始类型 `int` 之间没有直接的子类型（Subtype）或可转换关系，因此编译器拒绝这种模式。

然而，从开发者的逻辑上看，`obj` 持有一个 `Integer`，而 `Integer` 可以自动拆箱（Unbox）为 `int`。这种直觉非常自然，JEP 488 正是为了支持这种直觉。

除此之外，记录模式对原始类型的支持也有限，下面详细介绍这些限制及 JEP 488 的解决方法。

### switch 模式匹配不支持原始类型模式

第一个限制是 switch 的模式匹配（JEP 441）不支持原始类型模式，即指定原始类型的类型模式。仅支持指定引用类型的类型模式，如 `case Integer i` 或 `case String s`。

有了对 switch 中原始类型模式的支持，我们可以改进 switch 表达式：

```java
switch (x.getStatus()) {
    case 0 -> "okay";
    case 1 -> "warning";
    case 2 -> "error";
    default -> "unknown status: " + x.getStatus();
}
```

通过将 default 子句转换为带有原始类型模式的 case 子句来暴露匹配值：

```java
switch (x.getStatus()) {
    case 0 -> "okay";
    case 1 -> "warning";
    case 2 -> "error";
    case int i -> "unknown status: " + i;
}
```

支持原始类型模式还允许守卫检查匹配值：

```java
switch (x.getYearlyFlights()) {
    case 0 -> ...;
    case 1 -> ...;
    case 2 -> issueDiscount();
    case int i when i >= 100 -> issueGoldCard();
    case int i -> ... // 当 i > 2 && i < 100 时的适当操作
}
```

### 记录模式对原始类型的支持有限

另一个限制是记录模式对原始类型的支持有限。记录模式通过将记录分解为其各个组成部分来简化数据处理。当组件是原始值时，记录模式必须精确指定值的类型。这对开发人员来说不方便，并且与 Java 语言其余部分中存在有用的自动转换不一致。

例如，假设我们希望处理通过这些记录类表示的 JSON 数据：

```java
sealed interface JsonValue {
    record JsonString(String s) implements JsonValue { }
    record JsonNumber(double d) implements JsonValue { }
    record JsonObject(Map<String, JsonValue> map) implements JsonValue { }
}
```

JSON 不区分整数和非整数，因此 JsonNumber 使用 double 组件表示数字以获得最大的灵活性。但是，我们不需要在创建 JsonNumber 记录时传递 double；我们可以传递 int，如 30，Java 编译器会自动将 int 加宽到 double：

```java
var json = new JsonObject(Map.of("name", new JsonString("John"),
                                 "age",  new JsonNumber(30)));
```

不幸的是，如果我们希望使用记录模式分解 JsonNumber，Java 编译器不会如此配合。由于 JsonNumber 是用 double 组件声明的，我们必须相对于 double 分解 JsonNumber，并手动转换为 int：

```java
if (json instanceof JsonObject(var map)
    && map.get("name") instanceof JsonString(String n)
    && map.get("age")  instanceof JsonNumber(double a)) {
    int age = (int)a;  // 不可避免的（并且可能有损的！）转换
}
```

换句话说，原始类型模式可以嵌套在记录模式内，但是是不变的：模式中的原始类型必须与记录组件的原始类型完全相同。不可能通过 `instanceof JsonNumber(int age)` 分解 JsonNumber 并让编译器自动将 double 组件缩小到 int。

造成这种限制的原因是缩小可能是有损的：运行时 double 组件的值可能太大或精度太高，无法容纳在 int 变量中。然而，模式匹配的一个关键好处是它会自动拒绝非法值，只需不匹配即可。如果 JsonNumber 的 double 组件太大或太精确，无法安全地缩小到 int，那么 `instanceof JsonNumber(int age)` 可以简单地返回 false，让程序在不同的分支中处理大的 double 组件。

有了对原始类型模式的支持，我们可以取消这一限制。模式匹配可以保护可能有损的原始类型值缩小转换，无论是在顶层还是在记录模式内嵌套时。由于任何 double 都可以转换为 int，原始类型模式 `int a` 将适用于类型为 double 的 JsonNumber 的相应组件。如果且仅当 double 组件可以在不丢失信息的情况下转换为 int 时，instanceof 才会匹配模式，并且 if 分支将被采用，局部变量 a 在作用域内：

```java
if (json instanceof JsonObject(var map)
    && map.get("name") instanceof JsonString(String n)
    && map.get("age")  instanceof JsonNumber(int a)) {
      ... n ...
      ... a ...
}
```

这将使嵌套的原始类型模式能够像嵌套的引用类型模式一样顺畅地工作。

### instanceof 模式匹配不支持原始类型模式

另一个限制是 instanceof 的模式匹配（JEP 394）不支持原始类型模式。仅支持指定引用类型的类型模式。

原始类型模式在 instanceof 中与在 switch 中一样有用。instanceof 的目的大致是测试值是否可以安全地转换为给定类型；这就是为什么我们总是看到 instanceof 和强制转换操作紧密相连。此测试对于原始类型至关重要，因为将原始值从一种类型转换为另一种类型时可能会丢失信息。

例如，将 int 值转换为 float 由赋值语句自动执行，即使它可能有损 - 并且开发人员不会收到任何警告：

```java
int getPopulation() {...}
float pop = getPopulation();  // 潜在的静默信息丢失
```

同时，将 int 值转换为 byte 通过显式强制转换执行，但强制转换可能有损，因此必须在前面进行繁琐的范围检查：

```java
if (i >= -128 && i <= 127) {
    byte b = (byte)i;
    ... b ...
}
```

instanceof 中的原始类型模式将取代 Java 语言中内置的有损转换，并避免开发人员近三十年来一直手动编码的繁琐范围检查。换句话说，instanceof 可以检查值和类型。上面的两个示例可以重写如下：

```java
if (getPopulation() instanceof float pop) {
    ... pop ...
}

if (i instanceof byte b) {
    ... b ...
}
```

instanceof 运算符结合了赋值语句的便利性和模式匹配的安全性。如果输入（getPopulation() 或 i）可以安全地转换为原始类型模式中的类型，则模式匹配，转换结果立即可用（pop 或 b）。但是，如果转换会丢失信息，则模式不匹配，程序应在不同的分支中处理无效输入。

### instanceof 和 switch 中的原始类型

如果我们要取消围绕原始类型模式的限制，那么取消相关限制将会有所帮助：当 instanceof 采用类型而不是模式时，它仅采用引用类型，而不采用原始类型。采用原始类型时，instanceof 会检查转换是否安全，但不会实际执行转换：

```java
if (i instanceof byte) {  // i 的值适合 byte
    ... (byte)i ...       // 需要传统的强制转换
}
```

对 instanceof 的这种增强恢复了 instanceof T 和 instanceof T t 之间的语义对齐，如果我们在一个上下文中允许原始类型而在另一个上下文中不允许，这种对齐将会丢失。

最后，取消 switch 可以采用 byte、short、char 和 int 值但不能采用 boolean、float、double 或 long 值的限制将会有所帮助。

对 boolean 值进行切换将是三元条件运算符（?:）的有用替代方案，因为 boolean switch 可以包含语句和表达式。例如，以下代码使用 boolean switch 在 false 时执行一些日志记录：

```java
startProcessing(OrderStatus.NEW, switch (user.isLoggedIn()) {
    case true  -> user.id();
    case false -> { log("Unrecognized user"); yield -1; }
});
```

对 long 值进行切换将允许 case 标签为 long 常量，从而无需使用单独的 if 语句处理非常大的常量：

```java
long v = ...;
switch (v) {
    case 1L              -> ...;
    case 2L              -> ...;
    case 10_000_000_000L -> ...;
    case 20_000_000_000L -> ...;
    case long x          -> ... x ...;
}
```

## 描述

在 Java 21 中，原始类型模式仅允许作为记录模式中的嵌套模式，并且仅当它们准确命名匹配候选类型时才有效，如：

```java
v instanceof JsonNumber(double a)
```

为了支持通过模式匹配对匹配候选进行更统一的数据探索，我们将：

- 扩展模式匹配，以便原始类型模式适用于更广泛的匹配候选类型。这将允许诸如 `v instanceof JsonNumber(int age)` 之类的表达式。
- 增强 instanceof 和 switch 构造以支持原始类型模式作为顶级模式。
- 进一步增强 instanceof 构造，以便在用于类型测试而不是模式匹配时，它可以针对所有类型进行测试，而不仅仅是引用类型。这将扩展 instanceof 当前作为引用类型安全转换前提条件的角色，以适用于所有类型。

更广泛地说，这意味着 instanceof 可以保护所有转换，无论匹配候选是正在测试其类型（例如，`x instanceof int` 或 `y instanceof String`）还是正在匹配其值（例如，`x instanceof int i` 或 `y instanceof String s`）。

进一步增强 switch 构造，使其适用于所有原始类型，而不仅仅是整数原始类型的子集。

我们通过更改 Java 语言中管理原始类型使用的少量规则，并通过描述何时从一种类型到另一种类型的转换是安全的（这涉及要转换的值的知识以及转换的源类型和目标类型）来实现这些更改。

### 转换的安全性

如果转换没有信息丢失，则该转换是精确的。转换是否精确取决于涉及的类型对以及输入值：

- 对于某些类型对，在编译时就知道从第一种类型到第二种类型的转换保证不会丢失任何值的信息。该转换被称为无条件精确。对于无条件精确转换，不需要在运行时执行任何操作。示例包括 byte 到 int、int 到 long 以及 String 到 Object。
- 对于其他类型对，需要运行时测试来检查值是否可以在不丢失信息的情况下从第一种类型转换为第二种类型，或者如果执行强制转换，是否会抛出异常。如果不会丢失信息或抛出异常，则转换是精确的；否则，转换不精确。可能需要精确的转换示例包括 long 到 int 和 int 到 float，其中通过使用数值相等（==）或表示等价在运行时检测精度损失。从 Object 到 String 的转换也需要运行时测试，转换是否精确取决于输入值在运行时是否为 String。

简言之，如果一种原始类型到另一种原始类型的转换从一种整数类型扩展到另一种整数类型，或从一种浮点类型扩展到另一种浮点类型，或从 byte、short 或 char 扩展到浮点类型，或从 int 扩展到 double，则该转换是无条件精确的。此外，装箱转换和扩展引用转换是无条件精确的。

### instanceof 作为安全转换的前提条件

instanceof 的类型测试传统上仅限于引用类型。instanceof 的经典含义是前提条件检查，询问：将此值强制转换为此类型是否安全且有用？对于原始类型，这个问题比引用类型更相关。对于引用类型，如果意外省略了检查，则执行不安全的强制转换可能不会造成伤害：将抛出 ClassCastException，并且错误强制转换的值将不可用。相比之下，对于原始类型，由于没有方便的方法来检查安全性，执行不安全的强制转换可能会导致细微的错误。它不会抛出异常，而是会静默地丢失大小、符号或精度等信息，允许错误强制转换的值流入程序的其余部分。

为了支持原始类型在 instanceof 类型测试运算符中的使用，我们取消了限制（JLS §15.20.2），即左侧操作数的类型必须是引用类型，右侧操作数必须指定引用类型。

在运行时，我们通过精确转换将 instanceof 扩展到原始类型：如果左侧的值可以通过精确转换转换为右侧的类型，则将该值强制转换为该类型是安全的，并且 instanceof 返回 true。

以下是扩展的 instanceof 如何保护强制转换的示例。无条件精确转换无论输入值如何都返回 true；所有其他转换都需要运行时测试，其结果如下所示。

```java
byte b = 42;
b instanceof int;         // true（无条件精确）

int i = 42;
i instanceof byte;        // true（精确）

int i = 1000;
i instanceof byte;        // false（不精确）

int i = 16_777_217;       // 2^24 + 1
i instanceof float;       // false（不精确）
i instanceof double;      // true（无条件精确）
i instanceof Integer;     // true（无条件精确）
i instanceof Number;      // true（无条件精确）

float f = 1000.0f;
f instanceof byte;        // false
f instanceof int;         // true（精确）
f instanceof double;      // true（无条件精确）

double d = 1000.0d;
d instanceof byte;        // false
d instanceof int;         // true（精确）
d instanceof float;       // true（精确）

Integer ii = 1000;
ii instanceof int;        // true（精确）
ii instanceof float;      // true（精确）
ii instanceof double;     // true（精确）

Integer ii = 16_777_217;
ii instanceof float;      // false（不精确）
ii instanceof double;     // true（精确）
```

### instanceof 和 switch 中的原始类型模式

类型模式将类型测试与条件转换合并。这避免了在类型测试成功时需要显式强制转换，而未强制转换的值可以在类型测试失败时在另一个分支中处理。当 instanceof 类型测试运算符仅支持引用类型时，instanceof 和 switch 中仅允许引用类型模式是很自然的；现在 instanceof 类型测试运算符支持原始类型，instanceof 和 switch 中允许原始类型模式是很自然的。

为了实现这一点，我们取消了原始类型不能用于顶级类型模式的限制。因此，繁琐且容易出错的代码：

```java
int i = 1000;
if (i instanceof byte) {    // false -- i 无法精确转换为 byte
    byte b = (byte)i;       // 可能有损
    ... b ...
}
```

可以写成：

```java
if (i instanceof byte b) {
    ... b ...               // 没有信息丢失
}
```

因为 `i instanceof byte b` 的意思是"测试 i instanceof byte，如果是，则将 i 强制转换为 byte 并将该值绑定到 b"。

类型模式的语义由三个谓词定义：适用性、无条件性和匹配。我们取消了对原始类型模式处理的限制，如下所示：

- **适用性**是模式在编译时是否合法。以前，原始类型模式的适用性要求匹配候选具有与模式中类型完全相同的类型。例如，`switch (... 一个 int ...) { case double d: ... }` 是不允许的，因为模式 double 不适用于 int。

现在，如果 U 可以强制转换为 T 而无需未经检查的警告，则类型模式 `T t` 适用于类型 U 的匹配候选。由于 int 可以强制转换为 double，因此该 switch 现在是合法的。

- **无条件性**是在编译时就知道适用模式将匹配匹配候选的所有可能运行时值。无条件模式不需要运行时检查。

当我们将原始类型模式扩展为适用于更多类型时，我们必须指定它们对哪些类型是无条件的。如果 U 到 T 的转换是无条件精确的，则类型 T 的原始类型模式对于类型 U 的匹配候选是无条件的。这是因为无论输入值如何，无条件精确转换都是安全的。

- **匹配**以前，不是 null 引用的值 v 匹配类型 T 的类型模式，如果 v 可以强制转换为 T 而不抛出 ClassCastException。当原始类型模式作用有限时，这种匹配定义就足够了。现在原始类型模式可以广泛使用，匹配被推广为意味着值可以精确地强制转换为 T，这涵盖了抛出 ClassCastException 以及潜在的信息丢失。

### 穷举性

switch 表达式或 case 标签为模式的 switch 语句需要穷举：必须在 switch 块中处理选择器表达式的所有可能值。如果 switch 包含无条件类型模式，则它是穷举的；它也可以因其他原因而穷举，例如涵盖密封类的所有可能允许的子类型。

随着原始类型模式的引入，我们在穷举性的确定中添加了一条新规则：给定一个匹配候选是某个原始类型 P 的包装类型 W 的 switch，如果 T 对于 P 是无条件精确的，则类型模式 `T t` 穷举 W。在这种情况下，null 成为余数的一部分。

### switch 中扩展的原始类型支持

我们增强了 switch 构造以涵盖剩余的原始类型，即 long、float、double 和 boolean，以及相应的装箱类型。

如果选择器表达式具有 long、float、double 或 boolean 类型，则 case 标签中使用的任何常量必须具有与选择器表达式相同的类型或其相应的装箱类型。例如，如果选择器表达式的类型为 float 或 Float，则任何 case 常量必须是 float 类型的浮点文字（JLS §3.10.2）。

浮点文字在 case 标签中的语义是根据编译时和运行时的表示等价性来定义的。使用两个表示等价的浮点文字是编译时错误。

由于 boolean 类型只有两个不同的值，因此列出 true 和 false 情况的 switch 被认为是穷举的。

## 未来工作

在规范化了 Java 语言围绕类型比较和模式匹配的规则之后，我们可能会考虑引入常量模式。目前，在 switch 中，常量只能作为 case 常量出现，例如代码中的 42：

```java
short s = ...;
switch (s) {
    case 42 -> ...
    case int i -> ...
}
```

常量不能出现在记录模式中，这限制了模式匹配的有用性。例如，以下 switch 是不可能的：

```java
record Box(short s) {}

Box b = ...;
switch (b) {
    case Box(42) -> ...  // Box(42) 不是有效的记录模式
    case Box(int i) -> ...
}
```

由于此处定义的适用性规则，可以允许常量出现在记录模式中。在 switch 中，case Box(42) 将表示 case Box(int i) when i == 42，因为 42 是 int 类型的文字。