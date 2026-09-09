---
title: Java异常处理
date: 2025-03-11 17:06:48
tags:
  - Java
  - Java基础
  - Java异常处理
  - 异常
categories:
  - Java
  - Java基础
---
# 异常的层次结构
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
    │   ├── NullPointerException 空指针异常
    │   ├── NegativeArraySizeException  数组长度为负异常
    │   ├── ArrayStoreException   数组中包含不兼容的值异常
    │   ├── ArithmeticException 算术条件异常
    │   ├── IllegalArgumentException 非法参数异常
    │   ├── IllegalStateException 参数的状态不合适
    │   ├── IndexOutOfBoundsException 索引越界异常
    │   ├── ArrayIndexOutOfBoundsException 数组索引越界异常
    │   ├── ClassCastException 类型转换异常
    │   └── ClassNotFoundException 找不到类异常
    └── 非运行时异常（Checked Exception）
        ├── IOException
        ├── SQLException
        ├── FileNotFoundException
```
# 异常的捕获与处理
异常捕获处理的方法通常有：
- try-catch
- try-catch-finally
- try-finally
- try-with-resource
## try-finally
try-finally可用在不需要捕获异常的代码，可以保证资源在使用后被关闭。例如IO流中执行完相应操作后，关闭相应资源；使用Lock对象保证线程同步，通过finally可以保证锁会被释放；数据库连接代码时，关闭连接操作等等。

finally遇见如下情况不会执行：
- 在前面的代码中用了System.exit()退出程序。
- finally语句块中发生了异常。
- 程序所在的线程死亡。
- 关闭CPU。
## try-with-resource
try-with-resource是Java7引入的新语法，可以自动关闭资源，不需要手动关闭。如果你的资源实现了 AutoCloseable 接口，你可以使用这个语法。大多数的 Java 标准资源都继承了这个接口。
try-with-resource的语法格式如下：
```
try (资源类型 资源变量 = new 资源类型()) {
    // 使用资源的代码
} catch (异常类型 异常变量) {
    // 处理异常的代码
}
```
try 代码块退出时，会自动调用资源变量的close方法，和把 close 方法放在 finally 代码块中不同的是，close 抛出异常会被抑制，抛出的仍然为原始异常。被抑制的异常会由 addSusppressed 方法添加到原来的异常，如果想要获取被抑制的异常列表，可以调用 getSuppressed 方法来获取。

# 异常的使用建议
## 只针对不正常的情况才使用异常
异常只应该被用于不正常的条件，它们永远不应该被用于正常的控制流。
## 在 finally 块中清理资源或者使用 try-with-resource 语句
禁止在try块的最后关闭资源（只有在没有异常抛出时才会执行）。
## 不要捕获Throwable类
如果在 catch 子句中使用 Throwable ，它不仅会捕获所有异常，也将捕获所有的错误。
## 不要忽略异常
如果在 catch 子句中不做任何处理，异常将被忽略，无法拿到足够的错误信息来定位问题。合理的做法是至少要记录异常的信息。
## 不要记录并抛出异常
会给同一个异常输出多条日志。
仅仅当想要处理异常时才去捕获，否则只需要在方法签名中声明让调用者去处理。
捕获并抛出异常时，最好提供更加有用的信息，可以将异常包装为自定义异常。（此时不需要记录原始异常，无论何时都不应该记录并抛出异常）
## 包装异常时不要抛弃原始的异常
Exception 类提供了特殊的构造函数方法，它接受一个 Throwable 作为参数。通过这种方式包装的自定义异常不会丢失堆栈跟踪和原始异常的信息。
## 不要在finally块中使用return
try块中的return语句执行成功后，并不马上返回，而是继续执行finally块中的语句，如果此处存在return语句，则在此直接返回，无情丢弃掉try块中的返回点。
```java
int x = 0;
try {
    return ++x;// x等于1，此处不返回
} finally {
    return ++x; // 返回的结果是2
}
```