---
title: Apache Common
date: 2025-07-14T07:31:41.364Z
category:
  - java
  - utils
  - apache_common
tags:
  - java
  - utils
  - apache_common
---

# Apache Common
[[toc]]


## Maven依赖
```xml
<dependency>
    <groupId>commons-io</groupId>
    <artifactId>commons-io</artifactId>
    <version>2.11.0</version>
</dependency>
```

## FileUtils 常用方法
### Java标准库未覆盖功能
```java
public class FileUtilsExample {
    File readFile = new File("test.txt");
    File writeFile = new File("out.txt");

    // 获取目录大小
    // 如果参数不是目录，抛出 IllegalArgumentException
    // 目录中包含循环符号链接可能导致无限递归
    // Java 7+ 可以使用 Files.walkFileTree() 实现类似功能
    long dirSize = FileUtils.sizeOfDirectory(readFile);
    
    // 移动文件到指定目录
    // Java 7+ 使用Files.move()实现类似功能时,需要做额外处理
    // 1. 构建targetPath=目标路径+源文件名称
    // 2. 目标目录不存在时,手动创建指定目录
    FileUtils.moveFileToDirectory(srcFile,destDir,true);
    
    // 移动整个目录及其内容
    // Java 7+ 使用Files.move()实现类似功能时,需要手动删除已有文件
    // StandardCopyOption.REPLACE_EXISTING不能处理递归,即使添加该选项,也需要手动删除已有文件
    FileUtils.moveDirectory(srcDir, destDir);

    // 逐字节比较两个文件是否相同，非MD5方式
    FileUtils.contentEquals(file1, file2);
}
```

### Java标准库已经覆盖功能
Java标准库中已经覆盖以下的方法，或者可通过一两行代码实现对应功能。

#### 获取文件大小

```java
------------------------------ FileUtils ------------------------------

long size = FileUtils.sizeOf(readFile);

------------------------------    Java    ------------------------------

long size = readFile.length();
long size = Files.size(file);
```


#### 读取文件内容

```java
------------------------------ FileUtils ------------------------------

// 读取文件内容
String content = FileUtils.readFileToString(readFile, "UTF-8");

// 按行读取文件
List<String> lines = FileUtils.readLines(readFile, "UTF-8");

// 读取文件为字节数组
byte[] bytes = FileUtils.readFileToByteArray(readFile);

------------------------------    Java    ------------------------------

// 读取文件内容 Java11+
String content =Files.readString(path);

// 按行读取文件	Java7+
List<String> lines = Files.readAllLines(path);

// 读取文件为字节数组	Java 7+
byte[] bytes = Files.readAllBytes(path);
```


#### 写入文件

```java
------------------------------ FileUtils ------------------------------

// 将字符串写入文件,不推荐使用
FileUtils.writeStringToFile(writeFile, "content", "UTF-8");

// 写入文件,接受 CharSequence (更通用),较新版本引入,推荐使用
FileUtils.write(writeFile, "content", "UTF-8");

// 将字符串列表一行一行写入文件
FileUtils.writeLines(writeFile, lines, "UTF-8");

// 将字节数组写入文件
FileUtils.writeByteArrayToFile(writeFile, bytes);

------------------------------    Java    ------------------------------
  
// 将字符串写入文件,接受 CharSequence	Java11+
Files.writeString(path, "content", StandardCharsets.UTF_8);

// 将字符串列表一行一行写入文件
Files.write(path, lines, StandardCharsets.UTF_8);

// 将字节数组写入文件
Files.write(path,byte[],option)
```

#### 复制文件/目录

```java
------------------------------ FileUtils ------------------------------

  InputStream inputStream = new FileInputStream("test.txt");
// 复制文件/目录
FileUtils.copyFile(srcFile, destFile);
FileUtils.copyFileToDirectory(srcFile, destDir);
FileUtils.copyDirectory(srcDir, destDir);
// 拷贝网络资源到文件
FileUtils.copyURLToFile(new URL("http://xx"), destFile);
// 拷贝流到文件
FileUtils.copyInputStreamToFile(inputStream, destFile);

------------------------------    Java    ------------------------------
  
// 复制文件/目录
Files.copy(Path,OutputStream) 
Files.copy(Path,Path,CopyOption)

// 拷贝流到文件
Files.copy(InputStream,Path,CopyOption)
```


#### 移动文件/目录

```java
------------------------------ FileUtils ------------------------------

// 移动文件/目录
FileUtils.moveFile(srcFile, destFile);
FileUtils.moveFileToDirectory(srcFile, destDir, true);
FileUtils.moveDirectory(srcDir, destDir);

------------------------------    Java    ------------------------------
  
// 移动文件/目录,目标存在会抛出异常
Files.move(sourcePath, targetPath) ;
// 覆盖已存在文件
Files.move(sourcePath, targetPath, StandardCopyOption.REPLACE_EXISTING ) 
// 保留文件属性
Files.move(sourcePath, targetPath, StandardCopyOption.COPY_ATTRIBUTES, StandardCopyOption.REPLACE_EXISTING);
```

#### 删除文件/目录

```java
------------------------------ FileUtils ------------------------------

// 删除文件/目录
FileUtils.delete(file);
// 安静地删除，不抛出异常
FileUtils.deleteQuietly(file);  
// 强制删除，失败抛出异常
FileUtils.forceDelete(file);  
// 删除目录
FileUtils.deleteDirectory(dir);

------------------------------    Java    ------------------------------

// 如果要删除的文件不存在，这个方法就会抛出异常
Files.delete(Path path); 

// 如果文件被此方法删除则返回 true
Files.deleteIfExists(Path path); 
```

## FilenameUtils 常用方法
```java
// 获取文件扩展名
String ext = FilenameUtils.getExtension("/path/to/file.txt"); // 返回"txt"

// 获取包含路径的文件名称（不含扩展名）
// 等价于 FilenameUtils.getFullPath() + FilenameUtils.getBaseName()
String pathAndName = FilenameUtils.removeExtension("/path/to/file.txt"); // 返回"/path/to/file"

// 获取文件名(不含路径)
String name = FilenameUtils.getName("/path/to/file.txt"); // 返回"file.txt"

// 获取基本名称(不含扩展名)
String baseName = FilenameUtils.getBaseName("/path/to/file.txt"); // 返回"file"

// 获取完整路径
String fullPath = FilenameUtils.getFullPath("/path/to/file.txt"); // 返回"/path/to/"
```

## PathUtils
`Paths` 只用于创建 `Path` 对象，是一个工厂类， `Path` 的操作封装在`Files`工具类。所以除了`PathUtils.current()`方法外,PathUtils可以看作是对`Files`工具类的扩展。

###  Java标准库未覆盖功能
#### 检查路径是否为空
文件不存在或空目录或文件大小为0

```java
PathUtils.isEmpty(path);

// Java 11 +
public boolean isEmptyPath(Path path) throws IOException {
    if (Files.notExists(path)) return true;
    return Files.isDirectory(path) 
        ? Files.list(path).findAny().isEmpty()
        : Files.size(path) == 0;
}
```

#### 设置只读
```java
PathUtils.setReadOnly(path, true);
```

#### 统计目录内文件数量/字节大小
```java
// 统计目录内文件数量
Counters.PathCounters counters = PathUtils.countDirectory(path);
// 字节大小
counters.getByteCounter();
// 目录个数
counters.getDirectoryCounter();
// 文件个数
counters.getFileCounter();
```

#### 获取当前路径
```java
Path path = PathUtils.current();
```

### Java标准库已经覆盖功能
#### 删除文件/目录
```java
------------------------------ PathUtils ------------------------------
  
PathUtils.delete(path);

------------------------------    Java    ------------------------------

// 如果要删除的文件不存在，这个方法就会抛出异常
Files.delete(Path path); 
```

#### 复制
```java
------------------------------ PathUtils ------------------------------

PathUtils.copyFileToDirectory(Paths.get("test.txt"), path);
PathUtils.copyDirectory(Paths.get("/srcPath"), Paths.get("/destPath"));

------------------------------    Java    ------------------------------

// 如果要删除的文件不存在，这个方法就会抛出异常
Files.delete(Path path); 
```

## IOUtils
```java
// 输入流转换为byte数组
byte[] result2 = toByteArray(is);

// 输入流转换为字符串
String result2 = toString(is, "UTF-8");
// 将reader转换为字符串
String toString(Reader reader, String charset) throws IOException;
// 将url转换为字符串，也就是可以直接将网络上的内容下载为字符串
String toString(URL url, String charset) throws IOException;

// 按照行读取结果
InputStream is = new FileInputStream("test.txt");
List<String> lines = IOUtils.readLines(is, "UTF-8");

// 将行集合写入输出流
OutputStream os = new FileOutputStream("newTest.txt");
IOUtils.writeLines(lines, System.lineSeparator(), os, "UTF-8");

// 拷贝输入流到输出流
InputStream inputStream = new FileInputStream("src.txt");
OutputStream outputStream = new FileOutputStream("dest.txt");
IOUtils.copy(inputStream, outputStream);
```

## 文件监控
1. 创建MyListener，继承FileAlterationListenerAdaptor，重写监听逻辑
2. 创建FileAlterationMonitor，关联MyListener，启动监听
::: code-tabs
@tab MyListener
```java
public class MyListener extends FileAlterationListenerAdaptor {
    @Override
    public void onFileCreate(File file) {
        System.out.println("File created: " + file.getName());
    }
    
    @Override
    public void onFileDelete(File file) {
        System.out.println("File deleted: " + file.getName());
    }
}
```

@tab Client

```java
// 创建Observer，添加Listener
FileAlterationObserver observer = new FileAlterationObserver("/path/to/dir");
observer.addListener(new MyListener());
// 创建FileAlterationMonitor，添加Observer
FileAlterationMonitor monitor = new FileAlterationMonitor();
monitor.addObserver(observer);
// 启动监听
monitor.start();
```

:::
