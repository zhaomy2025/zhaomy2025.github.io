---
title: fastjson2
date: 2025-06-19T02:24:23.098Z
category:
  - java
  - fastjson2
tags:
  - java
  - fastjson2
---

# fastjson2
[[toc]]

速度快，API简单，json格式兼容性差，要求JSON格式符合特定规范

## 基础使用
```java
String json = JSON.toJSON(userRequest).toString();
String json = JSON.toJSONString(userRequest);
byte[] bytes = JSON.toJSONBytes(userRequest);
User user = JSON.parseObject(json, User.class);
JSONArray data = JSON.parseArray(json);
```