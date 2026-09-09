package site.zmyblog.utils;

import org.apache.commons.codec.digest.DigestUtils;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;

public class FileUtils {

    /**
     * 基于MD5哈希值比较两个文件是否相同
     * @author zmy
     * @version 1.0
     * @date 2025-07-14 16:19
     */
    public static boolean compareByMD5(File file1, File file2) throws IOException {
        // 快速检查文件是否存在
        if (!file1.exists() || !file2.exists()) {
            return false;
        }
        // 快速检查是否为文件
        if (!FileUtils.isFile(file1) || !FileUtils.isFile(file2)) {
            return false;
        }
        // 快速检查文件大小
        if (file1.length() != file2.length()) {
            return false;
        }

        // 计算MD5哈希
        String md5_1 = DigestUtils.md5Hex(new FileInputStream(file1));
        String md5_2 = DigestUtils.md5Hex(new FileInputStream(file2));

        return md5_1.equals(md5_2);
    }
}