---
title: 用 Redis 构建 Web 应用
date: 2026-10-16
category:
  - db
  - nosql
  - redis
tags:
  - db
  - nosql
  - redis
---

# 用 Redis 构建 Web 应用
[[toc]]

Redis 的数据结构只有在和访问模式对应时才有价值。本篇通过几个常见场景，说明如何用 Redis 组织数据和设计读写流程；示例使用 Python 风格伪代码，重点是键的组织方式和读写顺序，不是完整的生产代码。

## 登录令牌与会话清理

令牌 Cookie 可以只保存一个随机令牌，服务器再用 Redis 保存令牌到用户的映射。这样 Cookie 体积较小，服务端也可以主动撤销令牌。

```python
def check_token(conn, token):
    # 从 login: Hash 中查找令牌对应的用户 ID
    return conn.hget("login:", token)
```

除了 `login:` Hash，还可以用 Sorted Set 记录令牌最近一次出现的时间，用于淘汰长期不活跃的会话：

```python
def update_token(conn, token, user_id, product_id=None):
    # 用当前时间记录令牌最近一次被使用的时间
    now = time.time()
    # 保存“令牌 → 用户 ID”的映射
    conn.hset("login:", token, user_id)
    # 用 Sorted Set 按最近使用时间维护令牌
    conn.zadd("recent:", {token: now})

    if product_id is not None:
        # 记录用户最近浏览过的商品，商品 ID 作为 member
        conn.zadd(f"viewed:{token}", {product_id: now})
        # 只保留最近 25 个商品，避免列表无限增长
        conn.zremrangebyrank(f"viewed:{token}", 0, -26)
```

清理任务应先从 `recent:` 找出最旧的令牌，再同步删除相关 Hash 和会话键。清理批次要有上限，避免一次删除过多数据：

```python
def clean_sessions(conn, limit):
    # 当前活跃令牌数量不超过上限时，不需要清理
    recent_size = conn.zcard("recent:")
    while recent_size > limit:
        # 每轮最多清理 100 个，避免一次删除过多数据
        delete_size = min(recent_size - limit, 100)
        # Sorted Set 按 score 从小到大排列，最前面的是最久未使用的令牌
        tokens = conn.zrange("recent:", 0, delete_size - 1)

        if not tokens:
            # 防止异常情况下进入无限循环
            break

        # 删除令牌到用户的映射
        conn.hdel("login:", *tokens)
        # 删除最近使用时间记录
        conn.zrem("recent:", *tokens)
        # 一并删除这些令牌关联的浏览记录和购物车
        conn.delete(*[
            key
            for token in tokens
            for key in (f"viewed:{token}", f"cart:{token}")
        ])
        # 更新剩余数量，决定是否继续下一轮
        recent_size -= len(tokens)
```

生产实现还需要考虑删除与并发登录之间的竞态、令牌过期时间、批量命令的网络往返，以及是否用 Lua 脚本把必须原子完成的步骤放在 Redis 端执行。

## 购物车

购物车适合用 Hash：field 是商品 ID，value 是数量。数量归零时删除 field，而不是保存一个长期为零的商品：

```python
def add_to_cart(conn, session_id, item_id, count):
    # 同一个购物车对应一个 Hash key
    key = f"cart:{session_id}"
    if count > 0:
        # field 是商品 ID，value 是商品数量
        conn.hset(key, item_id, count)
    else:
        # 数量归零时删除商品，而不是保留一个 0 值 field
        conn.hdel(key, item_id)
```

购物车数据通常和用户会话具有相同的生命周期，可以设置过期时间。但续期策略要和业务定义一致：用户每次访问是否续期、下单后是否保留、匿名购物车登录后如何合并，都不能只靠一个 `EXPIRE` 解决。

## 页面缓存

页面缓存的关键是把请求规范化为稳定的缓存键，并明确哪些请求可以缓存：

```python
def cache_request(conn, request, callback):
    # 不是所有请求都能缓存，例如带用户隐私数据的页面
    if not can_cache(request):
        return callback(request)

    # 把请求转换成稳定的 key，作为页面缓存的唯一标识
    page_key = "cache:" + hash_request(request)
    # 先查缓存，命中时直接返回，避免重复生成页面
    content = conn.get(page_key)
    if content is None:
        # 缓存未命中，回源生成页面
        content = callback(request)
        # 缓存 300 秒，过期后再次回源生成
        conn.setex(page_key, 300, content)
    return content
```

实际系统还要处理以下问题：

- 缓存键必须包含会影响响应的参数、语言和权限范围。
- 设置过期时间只能降低长期脏数据风险，不能替代主动失效。
- 大量键同时过期可能形成缓存雪崩，需要给 TTL 增加抖动或分散过期时间。
- 热点键失效时，多个请求同时回源可能造成击穿，需要互斥刷新或逻辑过期方案。
- 用户私有页面不能因为缓存键设计错误而被其他用户读到。

## 数据行缓存

数据行缓存通常以业务主键生成键，例如 `user:1001`。读取时先查 Redis，未命中再查数据库并回填；更新时要明确数据库和缓存的先后关系，以及删除缓存失败后的补偿手段。

一个简化的读取流程如下：

```python
def get_user(conn, user_id, load_from_db):
    # 业务主键作为 Redis key 的一部分，避免不同用户相互覆盖
    key = f"user:{user_id}"
    # 先查 Redis，命中时不访问数据库
    cached = conn.get(key)
    if cached is not None:
        # 把缓存中的字符串/字节还原成 User 对象
        return decode(cached)

    # Redis 未命中，再从数据库查询
    user = load_from_db(user_id)
    if user is not None:
        # 查询到数据后回填缓存，缓存 300 秒
        conn.setex(key, 300, encode(user))
    return user
```

常见写入策略包括“更新数据库后删除缓存”和“更新数据库后更新缓存”。选择哪一种取决于并发写入、读写比例和一致性要求；不要只根据一句固定口诀决定所有场景。对不存在的数据也可以设置短 TTL 的空值缓存，减少对数据库的持续穿透，但要防止把短暂故障缓存成长期的“不存在”。

## 应用模式的共同边界

Redis 适合把明确的访问模式变成简单、原子的命令组合，但它不会自动提供业务级一致性。设计 Redis 应用时至少要回答：

1. 键的命名空间是什么，如何按业务或租户隔离？
2. 数据的最大大小和增长速度是多少？
3. 过期、淘汰、主动失效和重建分别由谁负责？
4. Redis 不可用时，业务是降级、回源还是直接失败？
5. 这组命令是否必须原子执行，是否需要事务、Lua 或分布式锁？
6. 数据是否需要持久化，能接受多大的丢失窗口？

这些问题比“选 Hash 还是 String”更早决定方案是否可靠。
