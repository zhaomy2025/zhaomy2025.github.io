---
title: VuePress 编写 Vue 组件
date: 2025-05-27T06:42:51.696Z
category:
  - vuepress
tags:
  - vuepress
---

# VuePress 编写 Vue 组件
[[toc]]
## 编写 Vue 组件
VuePress 编写 Vue 组件步骤如下：
1. 创建自定义组件
1. 手动全局注册组件(可选)
2. 在 Markdown 中使用自定义组件

### 创建自定义组件
在 .vuepress/components/ 目录下创建 MyComponent.vue 文件，内容如下：
```vue
<template>
  <div class="my-component">
    <h2>这是一个自定义组件</h2>
    <p>这是组件的内容。</p>
  </div>
</template>

<script>
export default {
  name: 'MyComponent'
}
</script>

<style scoped>
.my-component {
  border: 1px solid #eaecef;
  padding: 20px;
  margin: 1em 0;
}
</style>
```
注意：
1. vuepress 1.X 和 2.X 版本的组件写法不同，请根据版本选择对应的写法，本文以 2.X 版本为例。
2. VuePress 默认会自动注册 .vuepress/components/ 下的 Vue 组件，但需确保
    1. 组件文件名为 MyComponent.vue（大小写敏感）
    2. 路径必须是 .vuepress/components/，不能是其他路径，包括子目录。

### 手动全局注册组件(可选)
如果自动注册失败，可以在 .vuepress/client.js 中手动注册：
```js
import MyComponent from './components/MyComponent.vue'

export default defineClientConfig({
    enhance({ app }) {
        app.component('MyComponent', MyComponent)
    },
})
```

### 在 Markdown 中使用自定义组件
```markdown
<MyComponent></MyComponent>
```

## 常见组件
::: tip
仅给出vue组件代码和使用方式，自动注册请参考上文。
:::

### 行内标签组件

组件代码：
::: code-tabs#shell

@tab MyTag.vue
@[code](../../.vuepress/components/MyTag.vue)

@tab Tip.vue
@[code](../../.vuepress/components/Tip.vue)

@tab Warning.vue
@[code](../../.vuepress/components/Warning.vue)

@tab Danger.vue
@[code](../../.vuepress/components/Danger.vue)

:::

公共样式放到了.vuepress/styles/index.scss 文件中：
@[code](../../.vuepress/styles/inline-tag.scss)

在 Markdown 中使用：
```markdown
<MyTag>自定义标签</MyTag> 
<Tip>提示</Tip> 
<Warning>注意</Warning> 
<Danger>警告</Danger>  
```
效果如下：
<MyTag>自定义标签</MyTag> 
<Tip>提示</Tip> 
<Warning>注意</Warning> 
<Danger>警告</Danger>  

## 客户端配置文件
有些时候用户们可能希望直接添加一些客户端代码。 VuePress 通过客户端配置文件`client.js`来支持这种需求。
layouts用于注册自定义布局组件，每个布局是一个 Vue 组件（.vue 文件），自定义布局文件放在.vuepress/layouts/目录下。
```javascript
import { defineClientConfig } from 'vuepress/client'

export default defineClientConfig({
  enhance({ app, router, siteData }) {},
  setup() {},
  rootComponents: [],
  layouts: {Article,Category,Tag,Timeline,},// 用于注册自定义布局组件，自定义布局文件放在.vuepress/layouts/目录下
})
```

<!-- @include: ./common_summary.md -->