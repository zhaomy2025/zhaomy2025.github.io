---
title: Java基础知识点
date: 2025-03-10 16:22:08
tags:
  - Java
  - Java基础
categories:
  - Java
  - Java基础
---
本文主要对Java基础知识点进行总结。
# 数据类型
## 基本类型
Java语言提供了以下基本数据类型：
- 整型：byte、short、int、long
- 浮点型：float、double
- 字符型：char
- 布尔型：boolean
###  byte 转换为 String
可以使用 String 接收 byte[] 参数的构造器来进行转换，需要注意的点是要使用的正确的编码。
###  bytes 转换为 long
String接收bytes的构造器转成String，再Long.parseLong()转换为long。
### 隐式类型转化
+= 隐式的将加操作的结果类型强制转换为持有结果的类型。
如果两个整型相加，如 byte、short 或者 int，首先会将它们提升到 int 类型，然后在执行加法操作。
以下代码会出现编译错误，因为`s + 1`结果为 int 类型，不能隐式地将 int 类型下转型为 short 类型。
```java
short s = 1; 
s = s + 1; // 编译错误
```
但是使用`+=`可以执行隐式类型转化，编译器会自动将 int 类型下转型为 short 类型。
```java
short s = 1;
s += 1; // 隐式类型转化，相当于 s = (short) (s + 1);
```

### 浮点数计算
强制转换为整数，会舍弃小数部分，如需四舍五入，可加上0.5后再转换。

## 包装类型
基本类型都有对应的包装类型，基本类型与其对应的包装类型之间的赋值使用自动装箱与拆箱完成。 
包装类型都是不可变对象，不可变对象指对象一旦被创建，状态就不能再改变，任何修改都会创建一个新的对象。

## 缓存池
new Integer(123) 与 Integer.valueOf(123) 的区别在于:
- new Integer(123) 每次都会新建一个对象
- Integer.valueOf(123) 会使用缓存池中的对象，多次调用会取得同一个对象的引用 
  在 Java 8 中，Integer 缓存池的大小默认为 -128~127。

# 关键字
## final
final 关键字用来修饰变量、方法、类，表示该元素的值不能被修改。
- final 修饰的变量必须在声明时初始化，而且只能初始化一次。
- final 修饰的方法不能被重写。
  private 方法隐式地被指定为 final，如果在子类中定义的方法和基类中的一个 private 方法签名相同，此时子类的方法不是重写基类方法，而是在子类中定义了一个新的方法。
- final 修饰的类不能被继承。

## static
static 关键字用来修饰成员变量、方法、代码块和内部类，表示该成员属于类，不依赖于实例。
### 静态导包
静态导包可以避免使用类名来访问静态成员，从而简化代码，但可读性大大降低。
### 初始化顺序
1. 父类静态变量、静态代码块
2. 子类静态变量、静态代码块
3. 父类实例变量、普通语句块
4. 父类构造函数
5. 子类实例变量、普通语句块
6. 子类构造函数
# 面向对象编程
## 类与对象
## 封装、继承、多态
### this() & super()在构造方法中的区别调用
super()必须写在子类构造方法的第一行, 否则编译不通过
super从子类调用父类构造, this在同一类中调用其他构造均需要放在第一行
尽管可以用this调用一个构造器, 却不能调用2个
this和super不能出现在同一个构造器中, 否则编译不通过
this()、super()都指的对象,不可以在static环境中使用
本质this指向本对象的指针。super是一个关键字

# Object通用方法
Object类提供了11个通用方法（其中wait()方法被重载了3次），这些方法可以应用于所有对象：
- hashCode(),equals()
- clone()
- toString()
- notify(),notifyAll(),wait()
- getClass()
- finalize()
## equals()方法
equals()方法用来判断两个对象是否相等，默认情况下，equals()方法比较的是对象的内存地址。重写equals()方法时，需要遵循以下规则：
- 自反性：对于任何非空对象 x，x.equals(x) 应该返回 true。
- 对称性：对于任何非空对象 x 和 y，当且仅当 y.equals(x) 返回 true 时，x.equals(y) 才应该返回 true。
- 传递性：对于任何非空对象 x、y 和 z，如果 x.equals(y) 返回 true，并且 y.equals(z) 返回 true，那么 x.equals(z) 应该返回 true。
- 一致性：对于任何非空对象 x 和 y，只要 x.equals(y) 返回 true，那么反复调用 x.equals(y) 始终返回 true。
- 对于任何非空对象 x，x.equals(null) 应该返回 false。
## clone()方法
Object类中的clone()方法是protected修饰的，因此不能直接调用，需要子类重写该方法。 子类重写clone()方法时，需要实现Cloneable接口。如果一个类没有实现Cloneable接口又调用了clone()方法，就会抛出CloneNotSupportedException异常。
### clone()的替代方案
使用 clone() 方法来拷贝一个对象即复杂又有风险，它会抛出异常，并且还需要类型转换。Effective Java 书上讲到，最好不要去使用 clone()，可以使用拷贝构造函数或者拷贝工厂来拷贝一个对象。

# 异常处理
## 异常的分类
在 Java 中，异常（Exception）是程序运行时发生的错误或异常情况。Java 的异常机制基于类的层次结构，所有异常类都继承自 Throwable 类。 异常主要分为两大类： Error 和 Exception。
- Error 用来表示 JVM 无法处理的错误，通常不需要捕获和处理。如 OutOfMemoryError、StackOverflowError 等。
- Exception 用来表示程序运行过程中可能出现的异常，通常可以捕获和处理，非为两种：
  - 运行时异常（Unchecked Exception）：通常由程序逻辑错误引起，不需要在编译时显式捕获或声明，如NullPointerException、IndexOutOfBoundsException等。
  - 非运行时异常（Checked Exception）：通常由外部因素引起（如文件不存在、网络中断等），必须在编译时显式捕获或声明，如IOException、SQLException等。
``` 
Throwable
├── Error
│   ├── OutOfMemoryError
│   ├── StackOverflowError
│   └── NoClassDefFoundError
│   └── IOError
│   └── ThreadDeath
│   └── LinkageError
└── Exception
    ├── RuntimeException
    │   ├── NullPointerException
    │   ├── IndexOutOfBoundsException
    │   ├── ArithmeticException
    │   ├── IllegalArgumentException
    │   └── ClassCastException
    └── 非运行时异常（Checked Exception）
        ├── IOException
        ├── SQLException
        ├── FileNotFoundException
        └── ClassNotFoundException
```
## 异常处理的语法
Java 异常处理的语法格式如下：
```java
try {
    //可能发生异常的代码
} catch (ExceptionType e) {
    //捕获异常的处理代码
} finally {
    //不管是否发生异常，都会执行的代码
}
```
- try 块：可能发生异常的代码。
- catch 块：捕获异常的处理代码，可以有多个 catch 块，分别处理不同类型的异常。
- finally 块：不管是否发生异常，都会执行的代码，通常用于释放资源。
### finally 块
当try和catch中有return时，finally仍然会执行，finally比return先执行
finally是在return后面的表达式运算后执行的，所以函数返回值是在finally执行前确定的。
注意: finally中最好不要包含return，否则程序会提前退出，返回值不是try或catch中保存的返回值
finally不执行的几种情况: 程序提前终止如调用了System.exit, 病毒，断电。

# 常用类库
## 字符串
|比较内容|String|StringBuilder|StringBuffer|
|----|---|----|----|
|是否线程安全|是|否|是|
|是否可变|否|是|是|
|JDK版本||JDK5||

