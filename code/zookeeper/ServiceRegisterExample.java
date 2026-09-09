public class ServiceRegisterExample {
    // 服务注册（发布）
    void registerService(String serviceName, String endpoint) throws Exception {
        String path = "/services/" + serviceName + "/" + UUID.randomUUID();
        zk.create(path, endpoint.getBytes(), ZooDefs.Ids.OPEN_ACL_UNSAFE, CreateMode.EPHEMERAL);
    }
}