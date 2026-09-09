---
title: Nginx的负载均衡算法
date: 2025-07-10T08:15:57.454Z
category:
  - linux
  - web
  - nginx-load-balance
tags:
  - linux
  - web
  - nginx-load-balance
---

# Nginx的负载均衡算法
[[toc]]


## Nginx的负载均衡算法
Nginx有5中负载均衡算法:
- 轮询(默认)
- 平滑加权轮询法
- 源地址哈希法
- fair(第三方)
- url_hash(第三方)

### 平滑加权轮询法
Nginx 加权轮询采用的算法是平滑加权轮询算法，避免连续请求集中在高权重服务器。下面给出源地址哈希法的配置示例、完整配置文件和配置验证步骤：

::: code-tabs
@tab 配置示例
```json
http {
    upstream backend {
      # 格式：server [地址] [参数] weight=[权重值]
      server 192.168.1.100 weight=3;  # 权重3
      server 192.168.1.101 weight=2;  # 权重2
      server 192.168.1.102 weight=1;  # 权重1
    }

    server {
        listen 80;
        location / {
            proxy_pass http://backend;
            proxy_set_header Host $host;
        }
    }
}
```

@tab 完整配置（基于宝塔面板默认配置）
@[code](../../code/nginx/nginx-upstream.conf)

@tab 配置验证步骤
```bash
# 检查配置文件是否有语法错误
sudo nginx -t 

# 重启nginx
sudo systemctl reload nginx 

# 连续访问测试（替换为你的域名/IP）
for i in {1..10}; do curl http://your-domain.com; done
```
:::

### 源地址哈希法
Nginx源地址哈希法采用源地址哈希算法，根据客户端IP地址进行负载均衡。

::: code-tabs
@tab 配置示例
```json
http {
    upstream backend {
        ip_hash;
        server 192.168.1.100;
        server 192.168.1.101;
        server 192.168.1.102;
    }
}
```
:::

### fair(第三方)
按后端服务器的响应时间来分配请求，响应时间短的优先分配。
```json
http {
  upstream backend {  
    server 192.168.1.100;  
    server 192.168.1.101;  
    fair;  
  }
}
```

### url_hash(第三方)
按访问url的hash结果来分配请求，使每个url定向到同一个后端服务器，后端服务器为缓存时比较有效。
在upstream中加入hash语句，hash_method是使用的hash算法。
```json
http {
  upstream backend {  
    server 192.168.1.100;  
    server 192.168.1.101;  
    hash $request_uri;  
    hash_method crc32;  
  }
}
```

### Nginx 配置文件设备状态详解

- down：表示当前服务器暂时不参与负载均衡
- weight：权重，默认为1，权重越高，负载越大
- max_fails：允许请求失败的次数，默认为1，超过次数将会把服务器从负载均衡的轮转中移除
- fail_timeout：max_fails次失败后，服务器暂停的时间
- backup：其它所有的非backup机器down或者忙的时候，请求backup机器

## 相关文章
[算法 > 领域算法 > 负载均衡算法](../../algorithm/domain/load-balance.md)