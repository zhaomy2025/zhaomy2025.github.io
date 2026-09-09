package com.zmy.zkclient.examples;

import java.io.IOException;
import org.I0Itec.zkclient.ZkClient;

public class ZkClientExample {
    public static void main(String[] args) throws IOException, InterruptedException {
        // 创建会话
        ZkClient zkClient = new ZkClient("127.0.0.1:2181", 5000);
        System.out.println("ZooKeeper session established.");
        String path = "/zk-book";

        // 监听子节点变化
        zkClient.subscribeChildChanges(path, new IZkChildListener() {
            public void handleChildChange(String parentPath, List<String> currentChilds) throws Exception {
                // 获取子节点
                System.out.println(parentPath + " 's child changed, currentChilds:" + currentChilds);
            }
        });

        // 监听节点数据变化
        zkClient.subscribeDataChanges(path, new IZkDataListener() {
            public void handleDataDeleted(String dataPath) throws Exception {
                System.out.println("Node " + dataPath + " deleted.");
            }

            public void handleDataChange(String dataPath, Object data) throws Exception {
                System.out.println("Node " + dataPath + " changed, new data: " + data);
            }
        });

        // 创建节点
        zkClient.createPersistent(path, true);
        Thread.sleep(1000);
        zkClient.createPersistent(path+"/c1", true);
        Thread.sleep(1000);
        zkClient.createPersistent(path+"/c2", true);
        Thread.sleep(1000);
        System.out.println("success create znode.");

        // 删除节点
        zkClient.delete(path+"/c1");// 删除单个节点
        Thread.sleep(1000);
        zkClient.deleteRecursive(path);// 递归删除节点
        System.out.println("success delete znode.");

        // 判断节点是否存在
        System.out.println("Node " + path + " exists " + zkClient.exists(path));
    }
}