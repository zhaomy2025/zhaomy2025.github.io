public class ServiceDiscoveryExample {
    // 服务发现（订阅）
    void discoverServices(String serviceName) throws Exception {
        List<String> endpoints = zk.getChildren("/services/" + serviceName, event -> {
            if (event.getType() == Event.EventType.NodeChildrenChanged) {
                discoverServices(serviceName); // 重新获取
            }
        });
        // 更新本地服务列表...
    }
}