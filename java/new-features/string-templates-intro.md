通过模板化方式安全高效地组合字符串，相比传统字符串拼接更加清晰易读。

```java
String name = "张三";
int age = 25;

// 传统方式
String message = "你好，我的名字是" + name + "，我今年" + age + "岁了";

// 字符串模板方式（预览特性）
String message = STR."你好，我的名字是\{name}，我今年\{age}岁了";

// 更复杂的模板
String template = STR."用户\{user.name}在\{LocalDate.now()}登录了系统";
```