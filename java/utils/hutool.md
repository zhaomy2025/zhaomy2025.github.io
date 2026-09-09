---
title: hutool
date: 2025-07-15T01:33:29.263Z
category:
  - java
  - utils
  - hutool
tags:
  - java
  - utils
  - hutool
---

# hutool
[[toc]]

此处仅列出apache和spring工具类没有的能力。

## 引入依赖

```bash
<dependency>
    <groupId>cn.hutool</groupId>
    <artifactId>hutool-all</artifactId>
    <version>5.8.26</version>
</dependency>
```

## 核心

### 克隆

java自带的Cloneable接口仅支持浅克隆，若要支持深克隆，可继承CloneSupport类，或者使用

```java
ObjectUtil.cloneByStream(obj)
```

前提是对象必须实现Serializable接口。

### 类型转换

```java
Convert.toStr()
Convert.toIntArray()
Convert.toDate()
Convert.toList()
Convert.convert(Class,Object)
Convert.toSBC() // 半角转全角
Convert.toDBC() // 全角转半角
Convert.toHex()
```

#### Unicode和字符串转换

```java
strToUnicode()
unicodeToStr()
```

#### 时间单位转换

```java
convertTime
```

#### 金额大小写转换

```java
digitToChinese
```

#### 数组转换

```java
numberToWord()
numberToSimple()
numberToChinese()
```

### 日期时间

#### java日期时间类

```java
java.util.Date
java.util.Calendar
java.time.LocalDateTime
```

#### 日期时间工具

- DateTime：继承java.util.Date
- Month和Week：与Calendar中的int值一一对应，新增Quarter枚举
- DateUnit：时间枚举，主要表示某个时间单位对应的毫秒数，常用于计算时间差
- DateRange： 日期范围，可求交集、差集、区间
- ChineseDate： 农历日期，提供了生肖、天干地支、传统节日等方法
- TimeInterval： 实现计时器功能，即可以计算方法或过程执行的时间

##### DateUtil

[日期时间工具-DateUtil | Hutool](https://doc.hutool.cn/pages/DateUtil/)

##### LocalDateTimeUtil

从Hutool的5.4.x开始，Hutool加入了针对JDK8+日期API的封装，此工具类的功能包括LocalDateTime和LocalDate的解析、格式化、转换等操作。

[LocalDateTime工具-LocalDateTimeUtil | Hutool](https://doc.hutool.cn/pages/LocalDateTimeUtil/)

### IO流相关

#### IO工具类-IoUtil

io包的封装主要针对流、文件的读写封装，主要以工具类为主，提供常用功能的封装，这包括：
- IoUtil 流操作工具类
- FileUtil 文件读写和操作的工具类。
- FileTypeUtil 文件类型判断工具类
- WatchMonitor 目录、文件监听，封装了JDK1.7中的WatchService
- ClassPathResource针对ClassPath中资源的访问封装
- FileReader 封装文件读取
- FileWriter 封装文件写入
- BOMInputStream针对含有BOM头的流读取
- FastByteArrayOutputStream 基于快速缓冲FastByteBuffer的OutputStream，随着数据的增长自动扩充缓冲区（from blade）
- FastByteBuffer 快速缓冲，将数据存放在缓冲集中，取代以往的单一数组（from blade）

##### 拷贝 IoUtil.copy

##### Stream转Reader、Writer

#### 文件工具类-FileUtil

总体来说，FileUtil类包含以下几类操作工具：
  1. 文件操作：包括文件目录的新建、删除、复制、移动、改名等
  2. 文件判断：判断文件或目录是否非空，是否为目录，是否为文件等等。
  3. 绝对路径：针对ClassPath中的文件转换为绝对路径文件。
  4. 文件名：主文件名，扩展名的获取
  5. 读操作：包括类似IoUtil中的getReader、readXXX操作
  6. 写操作：包括getWriter和writeXXX操作

#### 文件监听-WatchMonitor

SimpleWatcher

#### 文件类型判断-FileTypeUtil

不准确

#### 文件

##### FileReader

+ readBytes
+ readString
+ readLines
+ getReader
+ getInputStream

##### FileWriter

+ getOutputStream
+ getWriter
+ getPrintWriter

##### FileAppender

- append
- flush
- toString

##### Tailer

start()

##### FileNameUtil

- getName
- mainName
- extName

#### 资源

##### 资源工具ResourceUtil

##### ClassPathResource

### 工具类

### 语言特性

### JavaBean

#### BeanUtil

##### 是否为Bean

```java
boolean isBean = BeanUtil.isBean(HashMap.class);//false
```

##### [内省 Introspector](https://www.hutool.cn/docs/#/core/JavaBean/Bean%E5%B7%A5%E5%85%B7-BeanUtil?id=%e5%86%85%e7%9c%81-introspector)

::: tip
把一类中需要进行设置和获得的属性访问权限设置为private（私有的）让外部的使用者看不见摸不着，而通过public（共有的）set和get方法来对其属性的值来进行设置和获得，而内部的操作具体是怎样的，外界使用的人不用知道，这就称为内省。
:::

| 方法 | 描述 |
| --- | --- |
| `getPropertyDescriptors`  | 获取 bean 对象的全部属性描述符 |
| `getFieldNamePropertyDescriptorMap`  | 获得字段名和字段描述Map |
| `getPropertyDescriptor`  | 获得Bean类指定属性描述 |

##### Bean属性注入

#### DynaBean

DynaBean是使用反射机制动态操作JavaBean的一个封装类，通过这个类，可以通过字符串传入name方式动态调用get和set方法，也可以动态创建JavaBean对象，亦或者执行JavaBean中的方法。

#### 表达式解析BeanPath

通过传入一个表达式，按照表达式的规则获取bean下指定的对象。

表达式分为两种：
- `.`表达式，可以获取Bean对象中的属性（字段）值或者Map中key对应的值
- `[]`表达式，可以获取集合等对象中对应index的值


#### Bean描述BeanDesc(BeanInfo强化版本)

BeanDesc包含所有字段（属性）及对应的Getter方法和Setter方法，与`BeanInfo`不同的是，`BeanDesc`要求属性和getter、setter必须严格对应，即如果有非public属性，没有getter，则不能获取属性值，没有setter也不能注入属性值。

#### 空检查属性获取

| | |
| --- | --- |
| ofBlankAble | 相对于ofNullable考虑了字符串为空串的情况 |
| get | 原版Optional有区别的是，get不会抛出NoSuchElementException |
| peek | 新增了peek函数，相当于ifPresent的链式调用（个人常用） |

## 集合类

### StrUtil


| | |
| --- | --- |
| hasBlank<br/>hasEmpty | |
| removePrefix<br/>removeSuffix<br/>removePrefixIgnoreCase<br/>removeSuffixIgnoreCase | |
| sub | 处理越界，支持负数 |
| format |  |

### HexUtil

16进制一般针对无法显示的一些二进制进行显示，常用于： 1、图片的字符串表现形式 2、加密解密 3、编码转换

```java
String str = "我是一个字符串";

String hex = HexUtil.encodeHexStr(str, CharsetUtil.CHARSET_UTF_8);

//hex是：
//e68891e698afe4b880e4b8aae5ad97e7aca6e4b8b2

String decodedStr = HexUtil.decodeHexStr(hex);

//解码后与str相同
```

### EscapeUtil

### HashUtil

`HashUtil`其实是一个hash算法的集合，此工具类中融合了各种hash算法。

### URLUtil

| | |
| --- | --- |
| url | 通过一个字符串形式的URL地址创建对象 |
| getURL  | 主要获得ClassPath下资源的URL，方便读取Classpath下的配置文件等信息。 |
| getPath  | 获得path部分 |
| toURI  | 转URL或URL字符串为URI |
| normalize  | 标准化化URL链接 |
| encode | 封装`URLEncoder.encode`，将需要转换的内容（ASCII码形式之外的内容），用十六进制表示法转换出来，并在之前加上%开头 |
| decode  | 封装`URLDecoder.decode`，将%开头的16进制表示的内容解码。 |
|  |  |

### ReflectUtil

[反射](https://www.yuque.com/zhaomengyao2019/zcgsbp/bhu7v6qpuz6h46sq)

Hutool针对Java的反射机制做了工具化封装，封装包括：

1. 获取构造方法
2. 获取字段
3. 获取字段值
4. 获取方法
5. 执行方法（对象方法和静态方法）

#### [获取某个类的所有方法](https://www.hutool.cn/docs/#/core/%E5%B7%A5%E5%85%B7%E7%B1%BB/%E5%8F%8D%E5%B0%84%E5%B7%A5%E5%85%B7-ReflectUtil?id=%e8%8e%b7%e5%8f%96%e6%9f%90%e4%b8%aa%e7%b1%bb%e7%9a%84%e6%89%80%e6%9c%89%e6%96%b9%e6%b3%95)

```java
Method[] methods = ReflectUtil.getMethods(ExamInfoDict.class);
```

#### [获取某个类的指定方法](https://www.hutool.cn/docs/#/core/%E5%B7%A5%E5%85%B7%E7%B1%BB/%E5%8F%8D%E5%B0%84%E5%B7%A5%E5%85%B7-ReflectUtil?id=%e8%8e%b7%e5%8f%96%e6%9f%90%e4%b8%aa%e7%b1%bb%e7%9a%84%e6%8c%87%e5%ae%9a%e6%96%b9%e6%b3%95)

```java
//Method method = ExamInfoDict.class.getMethod("getId");
Method method = ReflectUtil.getMethod(ExamInfoDict.class, "getId");
```

#### [构造对象](https://www.hutool.cn/docs/#/core/%E5%B7%A5%E5%85%B7%E7%B1%BB/%E5%8F%8D%E5%B0%84%E5%B7%A5%E5%85%B7-ReflectUtil?id=%e6%9e%84%e9%80%a0%e5%af%b9%e8%b1%a1)

```java
ReflectUtil.newInstance(ExamInfoDict.class);
```

#### [执行方法](https://www.hutool.cn/docs/#/core/%E5%B7%A5%E5%85%B7%E7%B1%BB/%E5%8F%8D%E5%B0%84%E5%B7%A5%E5%85%B7-ReflectUtil?id=%e6%89%a7%e8%a1%8c%e6%96%b9%e6%b3%95)

```java
TestClass testClass = new TestClass();
ReflectUtil.invoke(testClass, "setA", 10);
```

### IterUtil

### CollUtil

### Iterator

## 加密解密


## Office文档操作（Hutool-poi）

Hutool提供的类有：

+ ExcelUtil Excel工具类，读取的快捷方法都被封装于此
+ ExcelReader Excel读取器，Excel读取的封装，可以直接构造后使用。
+ ExcelWriter Excel生成并写出器，Excel写出的封装（写出到流或者文件），可以直接构造后使用。

### 引入POI依赖

```java
<dependency>
    <groupId>org.apache.poi</groupId>
    <artifactId>poi-ooxml</artifactId>
    <version>${poi.version}</version>
</dependency>
```

### ExcelUtil

```java
ExcelReader reader = ExcelUtil.getReader(FileUtil.file("test.xlsx"));
ExcelReader reader = ExcelUtil.getReader(ResourceUtil.getStream("aaa.xlsx"));
```

```java
ExcelReader reader;

//通过sheet编号获取
reader = ExcelUtil.getReader(FileUtil.file("test.xlsx"), 0);
//通过sheet名获取
reader = ExcelUtil.getReader(FileUtil.file("test.xlsx"), "sheet1");

```

```java
private RowHandler createRowHandler() {
	return new RowHandler() {
		@Override
		public void handle(int sheetIndex, int rowIndex, List<Object> rowlist) {
			Console.log("[{}] [{}] {}", sheetIndex, rowIndex, rowlist);
		}
	};
}
ExcelUtil.readBySax("aaa.xlsx", 0, createRowHandler());
```

### ExcelReader

```java
ExcelReader reader = ExcelUtil.getReader("d:/aaa.xlsx");
List<List<Object>> readAll = reader.read();
```

```java
ExcelReader reader = ExcelUtil.getReader("d:/aaa.xlsx");
List<Map<String, Object>> readAll = reader.readAll();
```

```java
ExcelReader reader = ExcelUtil.getReader("d:/aaa.xlsx");
List<Person> all = reader.readAll(Person.class);
```

### ExcelWriter

Hutool将Excel写出封装为ExcelWriter，原理为包装了Workbook对象，每次调用merge（合并单元格）或者write（写出数据）方法后只是将数据写入到Workbook，并不写出文件，只有调用flush或者close方法后才会真正写出文件。

由于机制原因，在写出结束后需要关闭ExcelWriter对象，调用close方法即可关闭，此时才会释放Workbook对象资源，否则带有数据的Workbook一直会常驻内存。

### BigExcelWriter

使用方法与ExcelWriter完全一致

## 系统调用（Hutool-system）

此工具是针对System.getProperty(name)的封装，通过此工具，可以获取Java Virtual Machine Specification等信息

## 网络Socket（Hutool-socket）

JDK中提供了Socket功能，包括：

+ BIO
+ NIO
+ AIO

Hutool只针对NIO和AIO做了简单的封装，用于简化Socket异步开发。

现阶段，Hutool的socket封装依旧不是一个完整框架或者高效的工具类，不能提供完整的高性能IO功能，因此推荐更加专业的Socket库。例如：

[t-io(opens new window)](https://gitee.com/tywo45/t-io)

[Voovan(opens new window)](http://www.voovan.org/)

[Netty(opens new window)](https://netty.io/)

[Mina](https://mina.apache.org/)

## JWT

JWT是一种网络身份认证和信息交换格式，目前还是业内前后端分离验证用的比较多的方案。

## 扩展
