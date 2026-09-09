---
title: Java对象格式化
date: 2025-04-08 13:23:07
tags:
  - Java
  - bug
categories:
  - Java
  - Java杂项
---
# 避免Java子类覆盖父类属性导致的格式化问题

## 问题描述

1. 使用log4j2直接输出Java对象，只会输出当前类的属性值，不会输出父类的属性值。
2. 使用Jackson的ObjectMapper::writeValueAsString进行Java对象格式化，不仅输出当前类的属性值，还会输出父类的属性值，如果子类属性覆盖父类属性，展示子类属性值。
3. 子类属性覆盖父类属性时，返回给前台的值是空值（即父类字段的值），排查Spring配置，MappingJackson2HttpMessageConverter也设置了ObjectMapper。

```java

jackson2HttpMessageConverter.setObjectMapper(objectMapper)

```

## 解决方法

搞不懂为什么都是通过ObjectMapper进行格式化，后台打印的值与前台展示的值不一致，实际使用中避免子类属性覆盖父类属性。
