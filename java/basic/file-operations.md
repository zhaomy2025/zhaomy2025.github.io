---
title: Java文件目录操作核心类
date: 2025-03-06 14:32:00
tags:
  - Java
  - Java基础
  - 常用类库
categories:
  - Java
  - Java基础
  - 常用类库
---
在 Java 中，`File`、`Files`、`Path` 和 `Paths` 是与文件和目录操作相关的核心类。文件和目录操作是指对文件和目录的创建、查找和删除等操作，只对文件本身进行操作，而非对文件内容进行操作。

# File
`File` 类是 Java 早期版本（Java 1.0）中用于表示文件和目录路径的类。它提供了对文件和目录的基本操作，如创建、删除、重命名、检查属性等。

## 主要方法
```
构造方法
File(String path)
File(String parent, String child)
File(File parent, String child)

获取属性
getAbsolutePath()
getPath()
getName()
length() 返回文件长度，以字节为单位

判断
exists() 检查文件或目录是否存在
isDirectory() 检查是否为目录
isFile() 检查是否为文件。

创建修改删除
createNewFile() 创建一个新文件
mkdir() 创建一个目录
mkdirs() 创建多级目录
renameTo(File dest) 重命名文件或目录
delete() 删除文件或目录

目录的遍历
String[] list() 返回目录中的文件和子目录名称列表
File[] listFiles()
```

## 缺点
+ 功能有限，不支持符号链接、文件属性等高级操作。
+ 路径处理不够灵活，跨平台兼容性较差。

# Path接口
`Path` 是 Java 7 引入的 `java.nio.file` 包中的一个接口，用于表示文件或目录的路径。它是对 `File` 类的现代化替代，提供了更强大的路径操作功能。

## 主要方法
```
判断
startsWith(Path other) 检查路径是否以指定路径开头
endsWith(Path other) 检查路径是否以指定路径结尾
isAbsolute() 检查路径是否为绝对路径

获取
getParent() 返回路径的父目录部分
getFileName() 返回路径的文件名部分
getRoot() 返回路径的根目录部分

转换
toAbsolutePath()
toFile()
toString()

解析
resolve(Path) 将两个路径合并
resolve(String)
resolveSibling(Path)
resolveSibling(String)

其他
relativize 返回两个路径的相对路径
normalize() 规范化路径（去除冗余部分）
```

# Paths
`Paths` 是 Java 7 引入的工具类，用于创建 `Path` 对象。它提供了静态方法来构造 `Path` 实例。

```
get(String first, String... more)  根据字符串路径创建 `Path` 对象
get(URI uri)   根据 URI 创建 Path 对象
```

# Files
`Files` 是 Java 7 引入的工具类，提供了丰富的静态方法用于操作文件和目录。Files 类与 java.nio.file.Path 类一起工作，需要了解 Path 类，然后才能使用 Files 类。

## 主要方法
```
创建目录和文件
createDirectory(Path, attrs) 创建目录，若目录已存在，会抛异常，不能一次创建多级目录
createDirectories(Path, attrs) 创建多级目录
createFile(path, attrs) 创建一个新文件

创建临时目录和文件
createTempDirectory(dir,prefix, attrs)
createTempDirectory(prefix, attrs)
createTempFile(dir, prefix, suffix)
createTempFile(prefix, suffix)
prefix和suffix是可以为null的字符串，若为空则为随机字符串

判断
exists(Path path, LinkOption... options) 检查文件或目录是否存在
isHidden
isReadable，isWritable，isExecutable
isDirectory 检查是否是目录
isRegularFile 检查是否是普通文件
isSymbolicLink

获取文件信息
size() 返回文件的大小（字节数）
getOwner()
readAttributes(path,type,LinkOption) 读取类型为A的文件属性

复制文件
copy(Path,OutputStream) 复制文件或目录
copy(Path,Path,CopyOption)
copy(InputStream,Path,CopyOption)

移动文件/文件夹
move(Path source, Path target, CopyOption... options) 移动文件或目录

删除文件/文件夹
static void delete(Path path); // 如果要删除的文件不存在，这个方法就会抛出异常
static boolean deleteIfExists(Path path); // 如果文件被此方法删除则返回 true

访问目录中的项
list() 不会进入子目录

遍历文件树
walk(pathToRoot,depth)
static Path walkFileTree(Path start,
                         FileVisitor<? super Path> visitor)
static Path walkFileTree(Path start,
                         Set<FileVisitOption> options,
                         int maxDepth,
                         FileVisitor<? super Path> visitor)

读写文件(适用于处理中等长度的文本文件)
readAllBytes(path) 读取文件的所有字节
readAllLines(path,charset) 读取文件的所有行
write(path,byte[],option)
lines(Path path) 返回文件的流式行读取

获取输入/输出流或者读入/写出器
newInputStream()
newOutputStream()
newBufferedReader()
newBufferedWriter()

目录流
newDirectoryStream(Path, String glob) 可对遍历过程进行更加细粒度的控制
```

复制、移动文件时可指定CopyOption：

```
StandardCopyOption.ATOMIC_MOVE 保证文件移动的原子性
StandardCopyOption.COPY_ATTRIBUTES 复制所有的文件属性
StandardCopyOption.REPLACE_EXISTING 覆盖已有的目标路径
```

获取输入/输出流或者读入/写出器可指定StandardOpenOption：

```
READ
WRITE
APPEND
TRUNCATE_EXISTING
CREATE_NEW
CREATE
DELETE_ON_CLOSE
...
```

复制文件夹的时候，只能复制空文件夹，如果文件夹非空，需要递归复制，否则只能得到一个空文件夹，而文件夹里面的文件不会被复制。
如果文件是目录，则该目录必须为空才能删除
除了文件复制比较简洁通用，其他两个方法个人认为使用IO流或者NIO流比较方便一点。

## walkFileTree()
Files类有两个重载的walkFileTree()方法：

```
static Path walkFileTree(Path start,
                         FileVisitor<? super Path> visitor)

static Path walkFileTree(Path start,
                         Set<FileVisitOption> options,
                         int maxDepth,
                         FileVisitor<? super Path> visitor)
```

Path实例指向要遍历的目录，在遍历期间调用FileVisitor，必须实现 FileVisitor 接口，并将其实现的实例传递给 walkFileTree() 方法，如果不需要使用到所有方法，可以扩展SimpleFileVisitor类。FileVisitor接口定义如下：

```java
public interface FileVisitor<T> {
    FileVisitResult preVisitDirectory(T dir, BasicFileAttributes attrs) throws IOException; 
    FileVisitResult visitFile(T file, BasicFileAttributes attrs) throws IOException;
    FileVisitResult visitFileFailed(T file, IOException exc) throws IOException;
    FileVisitResult postVisitDirectory(T dir, IOException exc) throws IOException;
}
```

# 其他文件操作类
FileOutputStream会自动创建文件，但是如果是多级目录，就创建不了并且报错。

# 总结
| 特性 | `File` 类 | `Path` 接口 | `Paths` 类 | `Files` 类 |
| --- | --- | --- | --- | --- |
| 引入版本 | Java 1.0 | Java 7 | Java 7 | Java 7 |
| 功能 | 基本文件操作 | 路径操作 | 路径创建 | 高级文件操作 |
| 路径表示 | 字符串路径 | 路径对象 | 路径对象 | 路径对象 |
| 跨平台兼容性 | 较差 | 较好 | 较好 | 较好 |
| 符号链接支持 | 不支持 | 支持 | 支持 | 支持 |
| 流式操作 | 不支持 | 不支持 | 不支持 | 支持 |

- `File`：适用于简单的文件操作，但功能有限。
- `Path`：现代化的路径表示，支持更灵活的路径操作。
- `Paths`：用于创建 `Path` 对象的工具类。
- `Files`：提供了丰富的文件操作方法，是对 `File` 类的现代化替代。

在 Java 7 及以上版本中，推荐使用 `Path`、`Paths` 和 `Files` 类进行文件和目录操作，因为它们功能更强大、兼容性更好。

