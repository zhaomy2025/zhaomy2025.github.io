public class DistributedLockExample {
    private final CuratorFramework client;
    private final String basePath;
    // 分布式锁辅助，用于监听锁节点是否被删除
    private NodeCache lockCache;
    // 重试次数
    private final AtomicInteger retryCount = new AtomicInteger(0);
    private final ScheduledExecutorService scheduler =
            Executors.newSingleThreadScheduledExecutor();

    private static final int MAX_RETRIES = 5;
    private static final long MAX_WAIT_MS = 10000;

    public AdvancedZkLock(CuratorFramework client, String resource) {
        this.client = client;
        this.basePath = "/locks/" + resource;
    }

    public void tryLockWithWatch() throws Exception {
        try {
            client.create()
                    .creatingParentsIfNeeded()
                    .withMode(CreateMode.EPHEMERAL)// 临时节点
                    .withTtl(30000)// 30秒超时
                    .forPath(basePath);

            onLockAcquired();
        } catch (KeeperException.NodeExistsException e) {
            startWatching();
        }
    }

    private void startWatching() throws Exception {
        if (lockCache == null) {
            lockCache = new NodeCache(client, basePath);
        }

        lockCache.getListenable().addListener(() -> {
            try {
                // 监听到节点被删除，并且重试次数小于最大重试次数，则尝试获取锁
                if (lockCache.getCurrentData() == null &&
                        retryCount.get() <= MAX_RETRIES) {
                    tryLockWithWatch();
                }
            } catch (Exception ex) {
                // 重试退避策略，
                scheduler.schedule(() -> {
                    try {
                        tryLockWithWatch();
                    } catch (Exception e) {
                        // 记录错误日志
                    }
                }, calculateBackoff(), TimeUnit.MILLISECONDS);
            }
        });

        if (!lockCache.isStarted()) {
            lockCache.start(true);
        }
    }

    // 计算重试退避时间，采用指数退避算法
    // 每次重试，重试次数加一
    private long calculateBackoff() {
        int count = retryCount.incrementAndGet();
        return Math.min((long) (100 * Math.pow(2, count)), MAX_WAIT_MS);
    }

    public void unlock() {
        try {
            client.delete().forPath(basePath);
            retryCount.set(0);
        } catch (Exception e) {
            // 处理删除失败
        } finally {
            CloseableUtils.closeQuietly(lockCache);
        }
    }

    private void onLockAcquired() {
        retryCount.set(0);
        System.out.println("Lock acquired at " + System.currentTimeMillis());
        // 执行业务逻辑
    }
}