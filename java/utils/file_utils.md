---
title: FileUtils
date: 2025-07-14T07:34:47.254Z
category:
  - java
  - utils
  - file_utils
tags:
  - java
  - utils
  - file_utils
---

# FileUtils
[[toc]]
Commons IO + NIO.2组合能满足大部分需求，其他工具仅列出Commons IO和NIO.2没有覆盖的功能。
1. 需要中文支持：优先考虑Hutool
2. 压缩文件处理：TrueZIP是专业选择
3. 测试场景：JimFS内存文件系统
4. 内容分析：Apache Tika

## 常用工具类库

### Apache Commons IO
Apache Commons IO 是 Apache 软件基金会提供的一个 Java 工具库，它简化了文件、IO 流和文件系统的操作，提供了大量实用方法来处理常见的 IO 任务。
Apache Commons IO包括以下模块，API参考[Apache Commons IO](./apache_common.md)：
- 工具类(Utility Classes)
  + FileUtils：提供文件操作工具方法，如复制、移动、删除文件和目录，读取文件内容等
  + FilenameUtils：处理文件名和路径的工具类
  + FileSystemUtils：提供文件系统相关操作，如获取磁盘空间
  + PathUtils:
  + IOUtils：处理输入输出流
  + IOCase：提供字符串比较功能，支持大小写敏感和大小写不敏感的比较
- 输入输出(Input/Output)
  + TeeInputStream/TeeOutputStream：可以将输入流同时输出到多个输出流
  + XmlStreamReader：能够自动检测XML文件的编码
- 过滤器(Filters)
  + 提供多种文件过滤器，可以根据名称、后缀、前缀等条件过滤文件
- 比较器(Comparators)
  + 提供基于文件名、文件大小、修改时间等的文件比较器
- 文件监控(File Monitor)
  + 可以监控文件和目录的变化

### Hutool
- 文件类型检测：通过文件头而非扩展名判断真实文件类型
- 文件监听：封装JDK的WatchService，提供更易用的API
- 大文件处理：专门针对大文件的读写工具类
- ANSI乱码处理：自动处理Windows下的ANSI编码文件

### Google Guava
- 文件哈希计算：支持多种哈希算法快速计算文件指纹
- 文件树遍历：灵活的Files.fileTreeTraverser()
- 内存映射文件工具：MappedByteBuffer工具类

### Jodd - 轻量级工具集
- 文件内容比较：FileComparator快速比较文件差异
- 文件搜索：基于通配符/正则的递归搜索
- 文件系统操作：Unix权限/软链接处理

### TrueZIP - 压缩文件处理
- 透明ZIP访问：像普通目录一样操作ZIP文件
- 多种压缩格式：支持TAR/GZIP/7z等8

### JimFS - 内存文件系统
- 内存虚拟文件系统：测试时替代真实文件系统
- 自定义文件系统特性：如大小写敏感/不敏感模拟

### Tika - 内容分析
- 文件内容元数据提取：从各种文档中提取结构化信息
- 内容类型自动检测：比简单扩展名更可靠8

### JNR - 本地文件操作
- POSIX API访问：直接调用原生系统文件操作
- 高性能文件IO：绕过JVM层直接系统调用

## 代码对比

### 基于MD5哈希值比较两个文件是否相同
- Files.readAllBytes()：读取文件内容到字节数组比较，适合小文件 <Tip>Java NIO</Tip>
- Files.mismatch()：基于字节比较，快速找到第一个差异字节位置 <Tip>Java NIO</Tip>
- FileUtils.contentEquals()：基于字节比较，速度慢，适合小文件 <Tip>Apache Commons IO</Tip>
- DigestUtils.md5Hex()：基于MD5哈希值比较，速度快，适合大文件 <Tip>Apache Commons IO</Tip>
- Guava.Files.asByteSource().hash()：基于Guava的哈希算法，速度快，适合大文件 <Tip>Google Guava</Tip>

::: code-tabs

@tab  Java NIO
```java
import java.nio.file.Files;
import java.nio.file.Path;

// JDK12+ 推荐方式
long mismatch = Files.mismatch(path1, path2);
boolean isEqual = (mismatch == -1);

// JDK8+ 替代方案
byte[] bytes1 = Files.readAllBytes(path1);
byte[] bytes2 = Files.readAllBytes(path2);
boolean isEqual = Arrays.equals(bytes1, bytes2);
```

@tab FileUtils.contentEquals()
```java
import org.apache.commons.io.FileUtils;
boolea isEqual = FileUtils.contentEquals(file1,file2);
```

@tab DigestUtils.md5Hex()
```java
public static boolean compareFilesByMD5(File file1, File file2) throws IOException {
  // 快速检查
  if (!FileUtils.isFile(file1) || !FileUtils.isFile(file2)) {
    return false;
  }
  if (FileUtils.sizeOf(file1) != FileUtils.sizeOf(file2)) {
    return false;
  }

  // 使用Commons IO的打开文件方式
  String md5_1 = DigestUtils.md5Hex(FileUtils.openInputStream(file1));
  String md5_2 = DigestUtils.md5Hex(FileUtils.openInputStream(file2));

  return md5_1.equals(md5_2);
}
```

@tab Files.asByteSource().hash()
```java
import com.google.common.hash.Hashing;
import com.google.common.io.Files;

HashCode hash1 = Files.asByteSource(file1).hash(Hashing.md5());
HashCode hash2 = Files.asByteSource(file2).hash(Hashing.md5());
boolean isEqual = hash1.equals(hash2);
```
:::


## 自定义工具类FileUtils

功能：
- 基于MD5哈希值比较两个文件是否相同

@[code](../../code/src/main/java/site/zmyblog/utils/FileUtils.java)
