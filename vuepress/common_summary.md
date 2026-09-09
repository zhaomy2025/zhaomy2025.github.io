---
title: VuePress 扩展功能总结
date: 2025-05-28T05:31:54.077Z
category:
  - vuepress
tags:
  - vuepress
---
  
## 总结
[VuePress 市场](https://marketplace.vuejs.press/zh/)和[VuePress 生态系统](https://ecosystem.vuejs.press/zh/)提供了很多常用插件，包括：
  - 博客相关
  - 面向开发者
  - 搜索插件
  - 新功能
  - 站点管理
  - Markdown 相关

<!-- @include: ./common_markdown.md -->

优先使用官方插件，官方插件不支持的功能，再考虑自己编写插件或Vue组件来实现相关功能，Vue组件的开发可以参考[VuePress 编写 Vue 组件](./vue_component.md)，目前实现了以下功能：
  - 行内标签组件

部分简单功能，也可以通过HTML+CSS来实现，参考[纯CSS扩展Vuepress功能](./css.md)，目前实现了以下功能：
  - 标题自动编号