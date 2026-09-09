# switch表达式与模式匹配：Java语法演进的里程碑

[[toc]]

## 引言

在Java语言的演进历程中，switch语句的变革堪称语法现代化的典范。从最初简单的整型选择器，到如今能够解构复杂对象的模式匹配引擎，这一演进不仅改变了代码的编写方式，更深刻影响了面向对象设计的思维模式。

本文将带您穿越时光，从Java 1.0的原始switch到Java 21的模式匹配，见证这一语法特性的华丽蜕变。

## 传统switch的桎梏时代

支持整数基本类型（byte, short, char, int）及其对应的包装类（在Java 5自动装箱后），以及枚举（Java 5+）和String（Java 7+）。

### Java 1.0-1.4：简单的选择器

让我们回到1996年，Java的第一个版本带来了最原始的switch语法：
- 仅支持基本数据类型（int、char、byte、short）
- 必须显式break避免贯穿
- 功能单一，仅能做等值判断

```java

// 1996年的典型用法
public class LegacySwitchDemo {
    public static String getDayType(int day) {
        String type;
        switch (day) {
            case 1: case 2: case 3: case 4: case 5:
                type = "工作日";
                break;
            case 6: case 7:
                type = "周末";
                break;
            default:
                type = "无效日期";
                break;
        }
        return type;
    }
}

```

### Java 5-6：包装类和枚举支持的加入

2004年Java 5发布，随着enum类型的引入，switch开始支持枚举，自动装箱机制让包装类也能轻松参与switch判断。

```java

// 2004年：枚举支持的switch
public enum UserRole {
    ADMIN, MODERATOR, USER, GUEST
}

public class PermissionChecker {
    public static boolean canEdit(UserRole role) {
        switch (role) {
            case ADMIN:
            case MODERATOR:
                return true;
            case USER:
            case GUEST:
                return false;
            default:
                throw new IllegalArgumentException("未知角色");
        }
    }
}

```

### Java 7-11：String支持的突破

2011年Java 7的发布是一个重要里程碑，switch开始支持String类型：

```java

// 2011年：String支持的switch
public class CommandProcessor {
    public static void processCommand(String command) {
        switch (command.toLowerCase()) {
            case "start":
                startService();
                break;
            case "stop":
                stopService();
                break;
            case "restart":
                restartService();
                break;
            default:
                System.err.println("未知命令：" + command);
        }
    }
}

```

## switch表达式的革命
传统 switch 语法源于早期 C 语言，因而沿用了冗长的 case/break 结构，并默认允许 "fall-through" 行为。这种语法虽然灵活，但也为开发者带来了不少困扰：
- 易于遗漏 break，造成逻辑错误
- 不支持表达式形式，无法作为值传递
- 不支持多个常量合并处理
- 缺乏类型安全检查
- 缺乏 Null 处理能力

- JEP 325 (Java 12): Switch表达式首次预览，引入`->`语法，终结传统贯穿问题，支持表达式返回值、`break`返回值、多标签case
- JEP 354 (Java 13): Switch表达式第二次预览，引入`yield`关键字替代break返回值，语义更清晰
- JEP 361 (Java 14): Switch表达式正式发布，API稳定化，编译器开始对 switch 表达式强制执行穷尽性检查，避免遗漏 case 导致的逻辑错误

| 特性 | Java 12 (Preview) | Java 13 (Preview) | Java 14 (Standard) |
| --- | --- | --- | --- |
| 箭头语法返回值 | ✅ case -> value | ✅ case -> value | ✅ case -> value |
| 多case标签 | ✅ case A, B -> value | ✅ case A, B -> value | ✅ case A, B -> value |
| break 返回值 | ✅ break value; | ❌ 移除 | ❌ 移除 |
| yield 关键字 | ❌ 不支持 | ✅ yield value; | ✅ yield value; |
| 代码块返回值 | break value; | yield value; | yield value; |
| 穷尽性检查 | ❌ 不支持 | ❌ 不支持 | ✅ 传统switch语句可选警告;switch表达式强制编译错误 |

### Java 12：switch表达式的诞生

Switch表达式首次预览，引入`->`语法，终结传统贯穿问题，支持表达式返回值、`break`返回值、多标签case。

#### 终结传统贯穿问题，无需手动break

```java

public class SwitchExpressionDemo {
    static void howMany(int k) {
        switch (k) {
            case 1  -> System.out.println("one");
            case 2  -> System.out.println("two");
            default -> System.out.println("many");
        }
    }
}

```

#### 支持表达式返回值
``` java
public class SwitchExpressionDemo {
    public static String getDayTypeJava12(DayOfWeek day) {
        return switch (day) {
            case MONDAY -> "周一";
            case TUESDAY -> "周二";
            case WEDNESDAY -> "周三";
            case THURSDAY -> "周四";
            case FRIDAY -> "周五";
            case SATURDAY -> "周六";
            case SUNDAY -> "周日";
        };
    }

     public static int calculate(int x, String op) {
        return switch (op) {
            case "+" -> x + 1;
            case "-" -> x - 1;
        };
    }
}
```

#### 复杂业务逻辑可使用break返回值
``` java
public class SwitchExpressionDemo {
    public static String getDayType(int day) {
        return switch (day) {
            case 1, 2, 3, 4, 5 -> {
                System.out.println("处理工作日逻辑");
                break "工作日";
            }
            case 6, 7 -> {
                System.out.println("处理周末逻辑");
                break "周末";
            }
            default -> {
                System.out.println("处理无效输入");
                break "无效日期";
            }
        };
    }
}

```

#### 支持多case标签
``` java
public class SwitchExpressionDemo {
    public static String getDayTypeJava12(DayOfWeek day) {
        return switch (day) {
            case MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY -> "工作日";
            case SATURDAY, SUNDAY -> "周末";
        };
    }
}
```

### Java 13: switch表达式引入yield关键字

Switch表达式第二次预览，引入`yield`关键字替代break返回值，语义更清晰

```java

public class YieldSwitch {
    public static String getDayType(int day) {
        return switch (day) {
            case 1, 2, 3, 4, 5 -> {
                System.out.println("处理工作日逻辑");
                yield "工作日";
            }
            case 6, 7 -> {
                System.out.println("处理周末逻辑");
                yield "周末";
            }
            default -> {
                System.out.println("处理无效输入");
                yield "无效日期";
            }
        };
    }
}
```

### Java 14：switch表达式的正式化

Switch表达式正式发布，API稳定化，编译器开始对 switch 表达式强制执行穷尽性检查，避免遗漏 case 导致的逻辑错误。

::: info
- Java 14 为 switch 表达式引入了基础穷尽性检查，确保枚举值全覆盖
- Java 17 增加了对密封类的穷尽性检查，将穷尽性检查从值域扩展到类型系统
:::

```java
enum DayOfWeek { MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY }

public class ExhaustivenessCheckDemo {
    // 编译器会检查是否覆盖所有枚举值
    public static String getWorkType(DayOfWeek day) {
        return switch (day) {
            case MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY -> "工作日";
            case SATURDAY, SUNDAY -> "休息日";
            // 如果缺少任何一个枚举值，编译器会直接报错
        };
    }
    
    // 错误示例：遗漏枚举值会导致编译错误
    /*
    public static String getDayTypeIncomplete(DayOfWeek day) {
        return switch (day) {
            case MONDAY -> "周一";
            case TUESDAY -> "周二";
            // 编译错误：switch 表达式未涵盖所有可能的输入值
            // 缺少 WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY
        };
    }
    */
}
```

### switch模式匹配时代：控制流的智能革命

Java 17-21：switch模式匹配的演进
- JEP 406 (Java 17)：switch模式匹配首次预览，引入类型模式、守卫模式，支持null处理，简化复杂类型分支
- JEP 420 (Java 18)：switch模式匹配第二次预览，改进类型检查算法，引入括号模式，优化模式穷尽性分析
- JEP 427 (Java 19)：switch模式匹配第三次预览，引入`when`关键字表示守卫条件，改进模式变量作用域规则，增强类型推断
- JEP 433 (Java 20)：switch模式匹配第四次预览，最终确定语法细节，增强与记录模式的协同工作，优化编译器错误提示
- JEP 441 (Java 21)：switch模式匹配正式版，API完全稳定，与switch表达式、记录模式深度集成，成为现代Java控制流的核心特性

### Java 17：模式匹配的萌芽

#### 类型模式

```java
public class ModernSwitch {
    public static String describeNumber(Object obj) {
        return switch (obj) {
            case Integer i -> "整数" + i;
            case String s -> "字符串";
            default -> "未知类型";
        };
    }
}

```

#### 守卫模式
```java
public class ModernSwitch {
    public static String describeNumber(Object obj) {
        return switch (obj) {
            case Integer i when i > 0 -> "正整数" + i;
            case Integer i when i < 0 -> "负整数" + i;
            case Integer i -> "零";
            case String s when s.length() > 5 -> "长字符串";
            case String s -> "短字符串";
            default -> "未知类型";
        };
    }
}

```

#### 允许在 case 中直接使用 case null: 来显式处理 null 值

过去，如果在 switch 中传入 null，会在运行时抛出 NullPointerException，迫使开发者必须在 switch 之前进行显式的 null 检查。允许 case null 后，可以将 null 检查直接集成到 switch 结构内部，使代码更简洁、清晰和安全。使用 case null 时需注意几个关键细节，确保代码行为符合预期：
- 显式处理：如果你想在 switch 中处理 null，必须显式地使用 `case null:`。default 分支不会自动捕获 null 值。
- 组合处理：你可以将 null 和其他情况组合在一起处理，例如 `case null, default -> ...`。
- 秩序很重要：当 switch 中同时存在 `case null:` 和 `default` 时，建议将 `case null:` 放在前面，以避免被 `default` 分支意外覆盖。

::: info
新的 switch 表达式采用模式匹配思维，语法类似 if-else 链而非传统跳转表，因此分支顺序完全自由，case 和 default 可任意排列，但匹配仍自上而下，所以顺序至关重要。可以理解为虽然语法上支持default分支在任意位置，但实际编程只能放到最后。
:::

```java
// 显式处理 null 值的 switch 模式匹配
public class NullHandlingDemo {
    
    public static String safeProcessString(String value) {
        return switch (value) {
            case null -> "值为 null";
            case "" -> "空字符串";
            default -> "字符串长度：" + value.length();
        };
    }
    
    // 对比传统写法
    public static String traditionalNullCheck(String value) {
        if (value == null) {
            return "值为 null";
        }
        return switch (value) {
            case "" -> "空字符串";
            default -> "字符串长度：" + value.length();
        };
    }
}
```

### Java 18：改进类型检查算法，引入括号模式，优化模式穷尽性分析

#### 改进类型检查算法
增强了对**泛型**密封类的穷尽性分析精度，减少了因类型擦除导致的误判：
- 精确的类型参数识别：编译器能识别 `Box<String>` 的具体实现是 `EmptyBox<String>` 和 `ValueBox<String>`，而不是泛化的 `EmptyBox<T>` 和 `ValueBox<T>`
- 减少误判：避免了因类型擦除将 `EmptyBox<String>` 和 `EmptyBox<Integer>` 误认为相同类型的情况
- 更好的编译时保证：确保 switch 表达式真正覆盖了所有可能的泛型实例，而不会漏掉某些特化类型
这种改进使得在使用泛型密封类时，模式匹配的穷尽性检查更加准确和可靠。
```java
// 定义一个泛型密封接口
sealed interface Box<T> permits EmptyBox, ValueBox {}
final class EmptyBox<T> implements Box<T> {}
record ValueBox<T>(T value) implements Box<T> {}

public class GenericExhaustiveness {
    static String processStringBox(Box<String> box) {
        return switch (box) {
            // Java 18 之前，编译器可能无法准确识别所有许可的子类型
            // 现在能精确分析泛型密封类的所有可能情况
            case EmptyBox<String> e -> "Empty box";
            case ValueBox<String> v -> "Value: " + v.value();
            // 无需 default 分支，编译器知道所有可能性都已覆盖
        };
    }
    
    static String processIntegerBox(Box<Integer> box) {
        return switch (box) {
            case EmptyBox<Integer> e -> "Empty integer box";
            case ValueBox<Integer> v -> "Integer value: " + v.value();
            // 同样穷尽所有可能
        };
    }
}
```

#### 引入括号模式
允许在守卫条件中使用括号明确逻辑优先级，支持 && 和 || 的复杂组合
```java
// Java 17：守卫条件可能存在解析歧义
case Point p && p.x > 0 || p.y > 0 -> ... // 解析不明确

// Java 18：使用括号明确逻辑
case Point p && (p.x > 0 || p.y > 0) -> ... // 明确的条件组合
```

#### 优化模式穷尽性分析
强制要求常量case必须出现在同类型的模式case之前，确保匹配顺序的合理性, 否则会编译错误。
```java
// Java 17 允许（但逻辑有问题）
String process(String input) {
    return switch (input) {
        case String s -> "任何字符串";    // 通用模式在前
        case "hello" -> "你好";          // 编译器警告：第二个case无法到达
        case null -> "空值";
    };
}

// Java 18 强制要求的正确顺序
String process(String input) {
    return switch (input) {
        case "hello" -> "你好";          // 常量在前
        case "world" -> "世界";          // 常量在前
        case String s -> "其他字符串";    // 通用模式在后
        case null -> "空值";
    };
}
```

### Java 19

#### 引入了 when 关键字来替代 && 表示守卫条件

#### 改进模式变量作用域规则
模式变量的作用域更加精确，仅限于相应的 case 分支内。

#### 增强类型推断

### Java 20：最终确定语法细节，增强与记录模式的协同工作，优化编译器错误提示

### Java 21：模式匹配的巅峰

2023年Java 21将模式匹配推向成熟，带来了完整的类型模式、守卫模式、记录模式：
#### 模式匹配 + 守卫模式

```java

public class AdvancedPatternMatching {
    
    // 复杂的JSON解析器示例
    public static Object parseJson(String json) {
        return switch (JsonParser.parse(json)) {
            case JsonObject obj when obj.has("error") ->
                new ErrorResponse(obj.getString("error"));

            case JsonObject obj when obj.has("data") -> {
                JsonArray items = obj.getArray("data");
                yield new DataResponse(items.stream()
                    .map(JsonValue::toString)
                    .toList());
            }
            
            case JsonArray arr when arr.size() == 1 ->
                new SingleItemResponse(arr.get(0));
                
            case JsonArray arr ->
                new MultiItemResponse(arr);
                
            case JsonString s when s.value().startsWith("http") ->
                new UrlResponse(s.value());
                
            case JsonString s -> new TextResponse(s.value());
            case JsonNumber n -> new NumberResponse(n.doubleValue());
            case JsonBoolean b -> new BooleanResponse(b.value());
            case JsonNull _ -> new NullResponse();
        };
    }

```



#### 记录模式

```java

sealed interface Shape permits Circle, Rectangle, Triangle {}

record Point(double x, double y) {}
record Circle(Point center, double radius) implements Shape {}
record Rectangle(Point topLeft, Point bottomRight) implements Shape {}
record Triangle(Point a, Point b, Point c) implements Shape {}

public class PatternMatchingDemo {
    public static double calculateArea(Shape shape) {
        return switch (shape) {
            case Circle(Point center, double r) -> Math.PI * r * r;
            case Rectangle(Point tl, Point br) ->
                Math.abs(br.x() - tl.x()) * Math.abs(br.y() - tl.y());
            case Triangle(Point a, Point b, Point c) -> {
                // 海伦公式计算三角形面积
                double ab = distance(a, b);
                double bc = distance(b, c);
                double ca = distance(c, a);
                double s = (ab + bc + ca) / 2;
                yield Math.sqrt(s * (s - ab) * (s - bc) * (s - ca));
            }
        };
    }
    
    private static double distance(Point p1, Point p2) {
        return Math.sqrt(Math.pow(p2.x() - p1.x(), 2) + Math.pow(p2.y() - p1.y(), 2));
    }
}

```

### Java 22-24：模式匹配的持续增强

## 核心特性深度解析

### 类型模式匹配

类型模式匹配让switch能够智能识别对象类型：

```java

public class TypePatternDemo {
    public static String processObject(Object obj) {
        return switch (obj) {
            case String s -> "字符串，长度：" + s.length();
            case Integer i -> "整数，平方：" + (i * i);
            case Double d -> "浮点数，绝对值：" + Math.abs(d);
            case List<?> list -> "列表，大小：" + list.size();
            case Map<?, ?> map -> "映射，键数：" + map.size();
            case null -> "空值";
            default -> "未知类型：" + obj.getClass().getSimpleName();
        };
    }
}

```

### 记录模式解构

记录模式能够深入对象内部，提取字段值：

```java

// 复杂的嵌套解构
record Address(String city, String street, String zipCode) {}
record Person(String name, int age, Address address) {}
record Company(String name, Person ceo, List<Person> employees) {}

public class RecordPatternDemo {
    public static String analyzeEntity(Object entity) {
        return switch (entity) {
            case Company(var name, Person(var ceoName, var ceoAge, Address(var city, _, _)), _) 
                -> name + "公司，CEO是" + ceoName + "，年龄" + ceoAge + "，总部在" + city;
                
            case Person(var name, var age, Address(var city, var street, _)) 
                -> name + "住在" + city + "的" + street;
                
            case Address(var city, _, var zip) 
                -> city + "的邮编是" + zip;
                
            default -> "无法识别的实体";
        };
    }
}

```
#### 解构模式（Deconstruction Patterns）

```java

public static String futurePattern(Object obj) {
    return switch (obj) {
        case Point(var x, var y) when x == y -> "对角线上的点";
        case Point(var x, var y) -> "坐标(" + x + "," + y + ")";
        case Person(var name, var age) if age >= 18 -> "成年人" + name;
        case Person(var name, _) -> "未成年人" + name;
    };
}

```
### 守卫模式增强

守卫模式为模式匹配增加了条件判断能力：

```java

public class GuardPatternDemo {
    public static String classifyNumber(Number num) {
        return switch (num) {
            case Integer i when i > 0 && i % 2 == 0 -> "正偶数" + i;
            case Integer i when i > 0 && i % 2 == 1 -> "正奇数" + i;
            case Integer i when i < 0 -> "负整数" + i;
            case Integer i -> "零";
            case Double d when d > 0 -> "正浮点数" + d;
            case Double d when d < 0 -> "负浮点数" + d;
            case Double d -> "零浮点数";
            default -> "未知数值类型";
        };
    }
    
    public static String validateUser(User user) {
        return switch (user) {
            case AdminUser(var id, var name) when id <= 0 -> 
                "管理员ID无效：" + id;
            case AdminUser(var id, var name) when name.isBlank() -> 
                "管理员名称不能为空";
            case RegularUser(var id, var name, var email) 
                when !email.contains("@") -> 
                "邮箱格式错误：" + email;
            case User(var id, var name) -> 
                "用户验证通过：" + name;
        };
    }
}

```

## 实战案例对比

### 案例一：几何图形计算器

传统实现（Java 8）：

```java

// 冗长的instanceof链
public static double calculateAreaTraditional(Shape shape) {
    if (shape instanceof Circle) {
        Circle c = (Circle) shape;
        return Math.PI * c.getRadius() * c.getRadius();
    } else if (shape instanceof Rectangle) {
        Rectangle r = (Rectangle) shape;
        return r.getWidth() * r.getHeight();
    } else if (shape instanceof Triangle) {
        Triangle t = (Triangle) shape;
        double s = (t.getA() + t.getB() + t.getC()) / 2;
        return Math.sqrt(s * (s - t.getA()) * (s - t.getB()) * (s - t.getC()));
    }
    throw new IllegalArgumentException("未知形状");
}

```

现代实现（Java 21）：

```java

// 优雅的模式匹配
public static double calculateAreaModern(Shape shape) {
    return switch (shape) {
        case Circle(var radius) -> Math.PI * radius * radius;
        case Rectangle(var width, var height) -> width * height;
        case Triangle(var a, var b, var c) -> {
            double s = (a + b + c) / 2;
            yield Math.sqrt(s * (s - a) * (s - b) * (s - c));
        }
    };
}

```

### 案例二：JSON解析器重构

传统实现：

```java

public static Object parseJsonTraditional(String json) {
    JsonElement element = JsonParser.parseString(json);
    
    if (element.isJsonObject()) {
        JsonObject obj = element.getAsJsonObject();
        if (obj.has("error")) {
            return new ErrorResponse(obj.get("error").getAsString());
        } else if (obj.has("data")) {
            JsonArray data = obj.getAsJsonArray("data");
            return new DataResponse(convertJsonArray(data));
        }
    } else if (element.isJsonArray()) {
        JsonArray arr = element.getAsJsonArray();
        if (arr.size() == 1) {
            return new SingleResponse(arr.get(0));
        } else {
            return new MultiResponse(arr);
        }
    } else if (element.isJsonPrimitive()) {
        JsonPrimitive primitive = element.getAsJsonPrimitive();
        if (primitive.isString()) {
            return new StringResponse(primitive.getAsString());
        } else if (primitive.isNumber()) {
            return new NumberResponse(primitive.getAsNumber());
        }
    }
    
    return new NullResponse();
}

```

现代实现：

```java

public static Object parseJsonModern(String json) {
    return switch (JsonParser.parse(json)) {
        case JsonObject obj when obj.has("error") -> 
            new ErrorResponse(obj.getString("error"));
            
        case JsonObject obj when obj.has("data") ->
            new DataResponse(obj.getArray("data").stream()
                .map(JsonValue::toString)
                .toList());
                
        case JsonArray arr when arr.size() == 1 ->
            new SingleResponse(arr.get(0));
            
        case JsonArray arr -> new MultiResponse(arr);
        case JsonString s -> new StringResponse(s.value());
        case JsonNumber n -> new NumberResponse(n.doubleValue());
        case JsonBoolean b -> new BooleanResponse(b.value());
        case JsonNull _ -> new NullResponse();
    };
}

```

## 性能与最佳实践

### 编译器优化

现代JVM对switch模式匹配进行了深度优化：

```java

// JIT编译器会生成高效的跳转表
public static int optimizedSwitch(Direction dir) {
    return switch (dir) {
        case NORTH -> 0;
        case SOUTH -> 1;
        case EAST -> 2;
        case WEST -> 3;
    };
}

```

### 设计模式应用

#### 策略模式的重构

传统策略模式：

```java

public interface PaymentStrategy {
    void pay(BigDecimal amount);
}

public class CreditCardStrategy implements PaymentStrategy {
    public void pay(BigDecimal amount) {
        // 信用卡支付逻辑
    }
}

public class PaymentProcessor {
    private final Map<String, PaymentStrategy> strategies = Map.of(
        "credit", new CreditCardStrategy(),
        "debit", new DebitCardStrategy()
    );
    
    public void processPayment(String type, BigDecimal amount) {
        PaymentStrategy strategy = strategies.get(type);
        if (strategy == null) {
            throw new IllegalArgumentException("未知支付方式");
        }
        strategy.pay(amount);
    }
}

```

现代模式匹配实现：

```java

sealed interface PaymentMethod {
    record CreditCard(String number, String cvv) implements PaymentMethod {}
    record DebitCard(String number, String pin) implements PaymentMethod {}
    record DigitalWallet(String email) implements PaymentMethod {}
}

public static void processPayment(PaymentMethod method, BigDecimal amount) {
    switch (method) {
        case CreditCard(var number, var cvv) -> 
            processCreditCard(number, cvv, amount);
        case DebitCard(var number, var pin) -> 
            processDebitCard(number, pin, amount);
        case DigitalWallet(var email) -> 
            processDigitalWallet(email, amount);
    }
}

```

## 总结

从Java 1.0的简单选择器到Java 21的智能模式匹配，switch的演进历程展现了Java语言设计哲学的深刻变化：

- 简洁性：代码量减少50%以上
- 可读性：业务逻辑一目了然
- 类型安全：编译时捕获更多错误
- 表达力：能够描述复杂的业务规则

这一演进不仅改变了语法，更重要的是改变了我们思考问题的方式。模式匹配让代码更加贴近业务领域，让数据结构的操作变得自然而直观。

展望未来，随着解构模式、when模式等特性的不断完善，switch表达式将继续引领Java语言走向更加现代化、更加表达力强的未来。

正如一位Java架构师所说："模式匹配不是简单的语法糖，而是Java走向函数式与面向对象完美融合的重要里程碑。"