# jstatd - JVM 统计监控守护进程
JDK 17 下 jstatd 需要特殊处理，主要是因为安全策略和参数解析的问题。
目前还没找到解决方法。

[[toc]]

## 工具概述

jstatd（JVM Statistics Monitoring Daemon）是 JDK 提供的远程监控守护进程工具，它允许远程客户端通过 RMI 连接到本地 JVM 进程，收集统计信息。当远程客户端（如 VisualVM、JConsole 或自定义监控程序）需要访问本地 JVM 统计信息时，jstatd 负责转发这些请求。

**工具特点**：
- 基于 RMI 的远程监控架构
- 支持多客户端并发连接
- 可配置安全策略
- 支持 SSL/TLS 加密（Java 9+）
- 与所有 JDK 监控工具兼容

**主要用途**：
- 远程监控 JVM 统计信息
- 集中化管理多台服务器 JVM
- 配合 VisualVM 实现远程监控
- 搭建自定义监控平台
- 收集性能指标数据

## 安装与基本使用

### 环境要求

jstatd 随 JDK 提供，确保环境变量中配置了 `JAVA_HOME`。

```bash
# 验证 jstatd 是否可用
jstatd -?

# JDK 版本要求
# JDK 6+: 基本功能
# JDK 8+: 安全策略增强
# JDK 9+: SSL/TLS 支持
```

### 基本语法

```bash
jstatd [options]
```

**常用选项**：

| 选项 | 说明 |
|-----|------|
| 无选项 | 使用默认配置启动 |
| `-p <port>` | 指定 RMI 注册端口（默认 1099） |
| `-n <name>` | 指定 RMI 对象名称（默认 jstatd） |
| `-r <hostname>` | 指定 RMI 服务器主机名 |
| `-nr` | 不使用 RMI 注册表 |
| `-p <policy>` | 指定安全策略文件 |
| `-J<option>` | 传递选项给 JVM |

### 快速入门示例

```bash
# 基本启动
jstatd -p 1099

# 指定 RMI 对象名称
jstatd -p 1099 -n myjstatd

# 指定服务器主机名
jstatd -p 1099 -r myserver.example.com

# 指定安全策略
jstatd -p 1099 -p /path/to/security.policy

# 不使用 RMI 注册表
jstatd -nr

# 完整配置启动
jstatd -p 1199 -n monitor -r server1.example.com
```

## 安全配置

### 安全策略文件

jstatd 需要安全策略文件来授权访问。创建策略文件：

```java
// jstatd.policy
grant {
    permission java.security.AllPermission;
};
```

或更细粒度的权限控制：

```java
// jstatd-restricted.policy
grant {
    // 允许来自特定主机的连接
    permission java.net.SocketPermission "192.168.1.*:1024-", "accept,connect,listen";
    // 允许本地访问
    permission java.net.SocketPermission "localhost:1024-", "accept,connect,listen";
    // 允许读取系统属性
    permission java.util.PropertyPermission "*", "read";
};
```

### 启动 jstatd

```bash
# 使用安全策略启动
jstatd -p 1099 -p jstatd.policy

# 查看安全策略文件
cat jstatd.policy

# 验证启动
netstat -an | grep 1099
```

## 远程监控配置

### 客户端连接配置

```bash
# 在监控端连接远程 jstatd
jps -rmi //remote-host:1099

# 使用 jstat 连接
jstat -gcutil -t -rmi //remote-host:1099 <pid> 1000

# 使用 VisualVM
# 1. 打开 VisualVM
# 2. 添加远程主机
# 3. 配置 JMX 连接
```

### 多主机监控架构

```bash
#!/bin/bash
# start-all-jstatd.sh - 在多台服务器上启动 jstatd

SERVERS=("server1" "server2" "server3")
PORT=1099

for server in "${SERVERS[@]}"; do
    echo "在 $server 上启动 jstatd..."
    ssh $server "jstatd -p $PORT -n jstatd-$server &"
    echo "$server jstatd 已启动"
done

echo "所有服务器 jstatd 已启动"
```

## 高级配置

### SSL/TLS 配置（Java 9+）

```bash
# 生成 SSL 证书
keytool -genkeypair -alias jstatd \
    -keyalg RSA -keysize 2048 \
    -validity 365 \
    -keystore jstatd_keystore.jks \
    -storepass changeit \
    -keypass changeit

# 使用 SSL 启动
jstatd -p 1099 \
    -J-Djavax.net.ssl.keyStore=jstatd_keystore.jks \
    -J-Djavax.net.ssl.keyStorePassword=changeit
```

### 自定义 RMI 配置

```bash
# 指定 RMI 服务器地址
jstatd -p 1099 \
    -r 192.168.1.100 \
    -J-Djava.rmi.server.hostname=192.168.1.100

# 配置连接超时
jstatd -p 1099 \
    -J-Dsun.rmi.transport.tcp.connectTimeout=5000
```

### jstatd 高可用配置

在分布式环境中，可以配置多个 jstatd 实例实现高可用：

```bash
# 主 jstatd
jstatd -p 1099 -J-Djava.rmi.server.hostname=192.168.1.100 \
       -J-Djava.security.policy=all.policy

# 备用 jstatd
jstatd -p 1099 -J-Djava.rmi.server.hostname=192.168.1.101 \
       -J-Djava.security.policy=all.policy

# 负载均衡器配置
# 将多个 jstatd 实例加入负载均衡池
```

## 性能影响与最佳实践

### 性能影响评估

jstatd 是一个轻量级服务，对 JVM 影响较小：

| 指标 | 影响 |
|-----|------|
| CPU 开销 | < 1% |
| 内存占用 | ~10-20MB |
| 网络带宽 | 低（仅传输统计数据） |

### 最佳实践建议

```bash
# 生产环境建议

# 1. 使用专用端口
jstatd -p 10199  # 避免与默认端口冲突

# 2. 配置安全策略
jstatd -p 10199 -p jstatd.policy

# 3. 限制连接来源
# 在防火墙中配置源 IP 限制

# 4. 使用监控用户运行
# 创建专用账户运行 jstatd

# 5. 配置日志
# 使用 -XX:+LogCompilation 输出日志

# 6. 健康检查
# 定期检查 jstatd 服务状态
```

### 常见问题排查

**问题 1：连接被拒绝**

```bash
# 检查 jstatd 是否运行
ps -ef | grep jstatd

# 检查端口监听
netstat -an | grep 1099

# 检查防火墙规则
iptables -L | grep 1099

# 测试网络连通性
telnet remote-host 1099
```

**问题 2：RMI 注册失败**

```bash
# 检查端口占用
lsof -i :1099

# 使用非默认端口
jstatd -p 11999

# 检查 RMI 日志
# 添加 -v 参数查看详细输出
```

**问题 3：安全策略错误**

```bash
# 检查策略文件权限
ls -la jstatd.policy

# 验证策略语法
# 使用 Java 策略工具验证

# 使用 AllPermission 测试
grant { permission java.security.AllPermission; };
```

## 与其他工具集成

### jstatd + jstat

```bash
#!/bin/bash
# remote-jstat.sh - 远程 jstat 监控

HOST=$1
PORT=${2:-1099}
INTERVAL=${3:-1000}

if [ -z "$HOST" ]; then
    echo "用法: $0 <host> [port] [interval]"
    exit 1
fi

echo "=== 远程 JVM 监控 ==="
echo "主机: $HOST"
echo "端口: $PORT"
echo "间隔: ${INTERVAL}ms"
echo ""

# 获取进程列表
echo "--- Java 进程 ---"
jps -rmi //${HOST}:${PORT}

# GC 统计
echo ""
echo "--- GC 统计 ---"
jstat -gcutil -t -rmi //${HOST}:${PORT} <pid> ${INTERVAL}
```

### jstatd + VisualVM

```bash
#!/bin/bash
# add-remote-host.sh - 配置 VisualVM 远程主机

HOST=$1
PORT=${2:-1099}

echo "=== 配置 VisualVM 远程连接 ==="
echo ""
echo "要添加远程主机，请执行以下步骤："
echo ""
echo "1. 启动 VisualVM"
echo "2. 右键'远程' -> '添加远程主机'"
echo ""
echo "主机名: $HOST"
echo "JMX 端口: $PORT"
echo ""
echo "或直接使用 JMX 连接字符串："
echo "//${HOST}:${PORT}"
```

### jstatd + Grafana + Prometheus

```bash
#!/bin/bash
# export-to-prometheus.sh - 导出到 Prometheus

HOST=$1
PORT=${2:-1099}
INTERVAL=${3:-15000}

# 获取进程列表
PIDS=$(jps -rmi //${HOST}:${PORT} -q)

for PID in $PIDS; do
    # 收集指标
    jstat -gcutil -t -rmi //${HOST}:${PORT} $PID $INTERVAL | \
    tail -1 | \
    awk -v host=$HOST -v pid=$PID '
    {
        # 输出 Prometheus 格式
        print "jvm_gc_sutily{host=\"" host "\",pid=\"" pid "\",area=\"young\"} " $3
        print "jvm_gc_sutily{host=\"" host "\",pid=\"" pid "\",area=\"old\"} " $6
    }'
done
```

## 常用命令速查表

### 服务管理

| 命令 | 说明 |
|-----|------|
| `jstatd -p 1099` | 默认配置启动 |
| `jstatd -p 1199 -n myjstatd` | 指定端口和名称 |
| `jstatd -p 1099 -p policy.file` | 指定安全策略 |
| `jstatd -nr` | 不使用 RMI 注册表 |
| `jstatd -r server.example.com` | 指定服务器主机名 |

### 客户端连接

| 命令 | 说明 |
|-----|------|
| `jps -rmi //host:1099` | 获取远程进程列表 |
| `jstat -gcutil -rmi //host:1099 <pid>` | 远程 GC 统计 |
| `jstat -class -rmi //host:1099 <pid>` | 远程类加载统计 |

### 故障排查

```bash
# 检查服务状态
ps -ef | grep jstatd

# 检查端口状态
netstat -tlnp | grep 1099

# 测试连接
nc -zv host 1099

# 查看日志
# 使用 -v 选项
```

## 常见问题 FAQ

### Q1：jstatd 和 JMX 有什么区别？

| 特性 | jstatd | JMX |
|-----|-------|-----|
| 协议 | RMI | RMI/HTTP |
| 用途 | 统计信息收集 | 全面管理监控 |
| 数据类型 | 有限（jstat 支持） | 丰富（MBean） |
| 复杂度 | 简单 | 复杂 |

### Q2：如何限制 jstatd 的访问？

```bash
# 方法 1：防火墙限制
iptables -A INPUT -p tcp -s 192.168.1.0/24 --dport 1099 -j ACCEPT

# 方法 2：安全策略
grant {
    permission java.net.SocketPermission "192.168.1.*:1024-", "accept,connect";
};

# 方法 3：网络隔离
# 将 jstatd 放在内网
```

### Q3：jstatd 是否需要 SSL？

在生产环境中建议使用 SSL：

```bash
# Java 9+
jstatd -p 1099 \
    -J-Djavax.net.ssl.keyStore=keystore.jks \
    -J-Djavax.net.ssl.keyStorePassword=password
```

### Q4：如何排查 jstatd 连接问题？

```bash
# 1. 检查服务状态
ps -ef | grep jstatd

# 2. 检查端口监听
netstat -tlnp | grep 1099

# 3. 测试网络连通性
telnet <host> 1099

# 4. 检查防火墙
iptables -L

# 5. 检查安全策略
# 查看策略文件语法

# 6. 查看详细日志
# 添加 -v 选项启动
```

### Q5：可以监控多少个 jstatd 实例？

理论上一个客户端可以连接多个 jstatd 实例：

```bash
# 监控多个主机
for host in host1 host2 host3; do
    jstat -gcutil -rmi //${host}:1099 <pid>
done
```

### Q6：jstatd 是否支持认证？

jstatd 本身不直接支持认证，可以通过：

```bash
# 方法 1：网络层认证
# 使用 VPN 或网络隔离

# 方法 2：SSL 双向认证
# 配置客户端证书

# 方法 3：应用层
# 在监控应用中实现认证
```

### Q7：jstatd 对性能有什么影响？

影响非常小：

- CPU: < 1%
- 内存: 10-20MB
- 网络: 低（仅统计数据传输）

### Q8：JDK 9+ 安全策略错误

```bash
$ jstatd -p 1099
WARNING: A terminally deprecated method in java.lang.System has been called
WARNING: System::setSecurityManager has been called by sun.tools.jstatd.Jstatd
Could not create remote object
java.security.AccessControlException: access denied ("java.util.PropertyPermission" "java.rmi.server.ignoreSubClasses" "write")
```

**原因**：JDK 9+ 移除了 SecurityManager，但 jstatd 仍需要安全策略

**解决方案**：

```bash
# 方法 1：使用安全策略文件
# 创建 jstatd.policy 文件
grant {
    permission java.security.AllPermission;
};

# 使用策略文件启动
jstatd -p 1099 -J-Djava.security.policy=jstatd.policy

# 方法 2：跳过安全检查（JDK 11+ 推荐）
jstatd -p 1099 -J-Djava.security.manager=allow -J-Djava.security.policy=jstatd.policy

# 方法 3：直接使用 AllPermission
jstatd -p 1099 -J-Djava.security.policy=ALL_POLICY

# 方法 4：设置系统属性（解决 PropertyPermission 问题）
jstatd -p 1099 \
    -J-Djava.security.policy=jstatd.policy \
    -J-Djava.rmi.server.ignoreSubClasses=true

# 方法 5：简化启动命令（仅测试环境）
jstatd -p 1099 -J-Djava.security.policy=ALL_POLICY
```

**创建策略文件**：
```bash
# 创建 jstatd.policy
cat > jstatd.policy << 'EOF'
grant {
    permission java.security.AllPermission;
};
EOF

# 启动 jstatd
jstatd -p 1099 -J-Djava.security.policy=jstatd.policy
```

**重要提醒**：
- `AllPermission` 仅适用于测试环境
- 生产环境应使用细粒度的权限控制
- 考虑升级到 JDK 17+ 并使用 JMX + SSL 替代 jstatd
## 相关资源

### 官方文档
- [jstatd 官方文档](https://docs.oracle.com/en/java/javase/17/docs/specs/man/jstatd.html)
- [RMI 文档](https://docs.oracle.com/javase/8/docs/technotes/guides/rmi/index.html)

### 安全配置
- [Java 安全策略](https://docs.oracle.com/javase/8/docs/technotes/guides/security/PolicyFiles.html)
- [SSL/TLS 配置](https://docs.oracle.com/javase/8/docs/technotes/guides/security/jsse/JSSERefGuide.html)

### 监控工具
- [VisualVM 文档](https://visualvm.github.io/)
- [JMX 文档](https://docs.oracle.com/javase/8/docs/technotes/guides/management/agent.html)

