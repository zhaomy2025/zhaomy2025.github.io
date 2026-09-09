# 工具类
Commons IO + NIO.2组合能满足大部分需求，其他工具仅列出Commons IO和NIO.2没有覆盖的功能。

1. 需要中文支持：优先考虑Hutool
2. 压缩文件处理：TrueZIP是专业选择
3. 测试场景：JimFS内存文件系统
4. 内容分析：Apache Tika

## Apache Commons IO
Apache Commons IO 是 Apache 软件基金会提供的一个 Java 工具库，它简化了文件、IO 流和文件系统的操作，提供了大量实用方法来处理常见的 IO 任务，主要包含以下几个核心功能模块：

+ 工具类(Utility Classes)
    - FileUtils：提供文件操作工具方法，如复制、移动、删除文件和目录，读取文件内容等
    - FilenameUtils：处理文件名和路径的工具类
    - FileSystemUtils：提供文件系统相关操作，如获取磁盘空间
    - IOCase：提供字符串比较功能，支持大小写敏感和大小写不敏感的比较
+ 输入输出(Input/Output)
    - TeeInputStream/TeeOutputStream：可以将输入流同时输出到多个输出流
    - XmlStreamReader：能够自动检测XML文件的编码
+ 过滤器(Filters)
    - 提供多种文件过滤器，可以根据名称、后缀、前缀等条件过滤文件
+ 比较器(Comparators)
    - 提供基于文件名、文件大小、修改时间等的文件比较器
+ 文件监控(File Monitor)
    - 可以监控文件和目录的变化




# FileUtil
```java
public final class FileUtil {
    /
     * 获取文件最后修改时间
     * @param file 文件名
     * @return 解析时间
     * @throws IOException io异常
     */
    private String getLastModifyTime(File file) throws IOException {
        Path path = Paths.get(file.getAbsolutePath());
        BasicFileAttributes attrs = Files.readAttributes(path, BasicFileAttributes.class);
        Instant lastModifiedTime = attrs.lastModifiedTime().toInstant();
        LocalDateTime lastModifiedDateTime = LocalDateTime.ofInstant(lastModifiedTime, ZoneId.systemDefault());
        return DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss").format(lastModifiedDateTime);
    }
    
    /
     * 父目录自动创建
     *
     * @param source 源文件
     */
    public static void mkdirsParenFile(File source) {
        if (!source.getParentFile().exists()) {
            source.getParentFile().mkdirs();
        }
    }
    
    /
     * 压缩多个文件为ZIP
     *
     * @param zipFileName
     * @param srcFiles
     * @throws Exception
     */
    public static void toZip(String zipFileName, List<File> srcFiles, boolean keepDirStructure) throws Exception {
        ZipOutputStream zos = null;
        try {
            FileUtil.mkdirsParenFile(new File(zipFileName));
            FileOutputStream fileOutputstream = new FileOutputStream(zipFileName);
            zos = new ZipOutputStream(fileOutputstream);
            for (File srcFile : srcFiles) {
                compress(srcFile, zos, srcFile.getName(), keepDirStructure);
            }
        } catch (Exception e) {
            throw new RuntimeException("zip error from ZipUtils", e);
        } finally {
            if (zos != null) {
                zos.close();
            }
        }
    }

    public static void compress(File sourceFile, ZipOutputStream zos, String name, boolean keepDirStructure) throws Exception {
        if (sourceFile.isFile()) {
            zos.putNextEntry(new ZipEntry(name));
            int len;
            byte[] buf = new byte[1024];
            FileInputStream in = new FileInputStream(sourceFile);
            while ((len = in.read(buf)) != -1) {
                zos.write(buf, 0, len);
            }
            in.close();
        } else {
            File[] listFiles = sourceFile.listFiles();
            if (listFiles == null || listFiles.length == 0) {
                //需要保留原来的文件结构时，需要对空文件夹进行处理
                if (keepDirStructure) {
                    // 空文件夹的处理
                    zos.putNextEntry(new ZipEntry(name + "/"));
                    // 没有文件，不需要文件的copy
                    zos.closeEntry();
                }
            } else {
                for (File file : listFiles) {
                    //判断是否需要保留原来的文件结构
                    if (keepDirStructure) {
                        compress(file, zos, name + "/" + file.getName(), keepDirStructure);
                    } else {
                        compress(file, zos, file.getName(), keepDirStructure);
                    }
                }
            }
        }
    }

    public static void unZip(String filePath, String zipDir) {
        File source = new File(zipDir);
        if (!source.exists()) {
            source.mkdirs();
        }
        try {
            ZipFile zipFile = new ZipFile(filePath, Charset.forName("gbk"));
            Enumeration<?> dir = zipFile.entries();
            while (dir.hasMoreElements()) {
                ZipEntry entry = (ZipEntry) dir.nextElement();
                String name = entry.getName();
                if (entry.isDirectory()) {
                    name = name.substring(0, name.length() - 1);
                    File fileObject = new File(zipDir + name);
                    fileObject.mkdir();
                } else {
                    File fileObject = new File(zipDir + name);
                    mkdirsParenFile(fileObject);
                }
            }
            Enumeration<?> e = zipFile.entries();
            while (e.hasMoreElements()) {
                ZipEntry entry = (ZipEntry) e.nextElement();
                if (entry.isDirectory()) {
                    continue;
                }
                BufferedInputStream is = new BufferedInputStream(zipFile.getInputStream(entry));
                BufferedOutputStream dest = new BufferedOutputStream(new FileOutputStream(zipDir + entry.getName()), BUFFER_SIZE);          
                byte[] dataBytes = new byte[BUFFER_SIZE];
                int count;
                while ((count = is.read(dataBytes, 0, BUFFER_SIZE)) != -1) {
                    dest.write(dataBytes, 0, count);
                }
                dest.flush();
                dest.close();
                is.close();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    public static String getCanonicalPathWithoutExt(File file) {
        return removeExtension(zipFile.getCanonicalPath());
    }
    public static String removeExtension(String filePath) {
        int index = filePath.lastIndexOf(".");
        if (index == -1) {
            return filePath;
        }
        return filePath.substring(0, index);
    }
    public static String getExtension(String filePath) {
        int index = filePath.lastIndexOf(".");
        if (index == -1) {
            return "";
        }
        return filePath.substring(index);
    }
}
```

