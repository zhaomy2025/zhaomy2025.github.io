public class DistributedQueueExample {
    public static void main(String[] args) throws Exception {
        DistributedQueue queue = new DistributedQueue(client, "/queue");

        // 生产消息
        queue.offer("message1".getBytes());

        // 消费消息
        byte[] message = queue.take();
    }
}