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
@[code](../.vuepress/components/MyTag.vue)

@tab Tip.vue
@[code](../.vuepress/components/Tip.vue)

@tab Warning.vue
@[code](../.vuepress/components/Warning.vue)

@tab Danger.vue
@[code](../.vuepress/components/Danger.vue)

:::

公共样式放到了.vuepress/styles/index.scss 文件中：
@[code](../.vuepress/styles/inline-tag.scss)

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

### 文字颜色组件

文字颜色组件只改变文字颜色，不添加背景色。组件按彩虹顺序提供红、橙、黄、绿、蓝、靛、紫、灰八种颜色，组件名中的 `Text` 表示它用于文字，而不是底色。

组件代码：
::: code-tabs#color-text

@tab RedText.vue
@[code](../.vuepress/components/RedText.vue)

@tab OrangeText.vue
@[code](../.vuepress/components/OrangeText.vue)

@tab YellowText.vue
@[code](../.vuepress/components/YellowText.vue)

@tab GreenText.vue
@[code](../.vuepress/components/GreenText.vue)

@tab BlueText.vue
@[code](../.vuepress/components/BlueText.vue)

@tab IndigoText.vue
@[code](../.vuepress/components/IndigoText.vue)

@tab PurpleText.vue
@[code](../.vuepress/components/PurpleText.vue)

@tab GrayText.vue
@[code](../.vuepress/components/GrayText.vue)

:::

在 Markdown 中使用：
```markdown
<RedText>红色文字</RedText>
<OrangeText>橙色文字</OrangeText>
<YellowText>黄色文字</YellowText>
<GreenText>绿色文字</GreenText>
<BlueText>蓝色文字</BlueText>
<IndigoText>靛色文字</IndigoText>
<PurpleText>紫色文字</PurpleText>
<GrayText>灰色文字</GrayText>
```

效果如下：

<RedText>红色文字</RedText>
<OrangeText>橙色文字</OrangeText>
<YellowText>黄色文字</YellowText>
<GreenText>绿色文字</GreenText>
<BlueText>蓝色文字</BlueText>
<IndigoText>靛色文字</IndigoText>
<PurpleText>紫色文字</PurpleText>
<GrayText>灰色文字</GrayText>

### 卡片组件

卡片由容器 `<Cards>` 和单张 `<Card>` 组成。`title` 通过 prop 传入，正文写在默认插槽里；样式用 `<style scoped>` 内置在组件内，没有独立的样式文件。一个 `<Cards>` 里放多张 `<Card>` 即三列并排，窗口宽度 ≤719px 时折成一列。

组件代码：
::: code-tabs#shell

@tab Cards.vue
@[code](../.vuepress/components/Cards.vue)

@tab Card.vue
@[code](../.vuepress/components/Card.vue)

:::

在 Markdown 中使用：
```markdown
<Cards>
  <Card title="碰撞攻击">找到两个完全不同的输入，却产生相同的哈希值</Card>
  <Card title="预图像攻击">给定一个哈希值，找到生成它的那个输入</Card>
  <Card title="第二预图像攻击">给定输入 A 和它的哈希值，找到另一个输入 B（≠A）具有相同的哈希值</Card>
</Cards>
```
效果如下：

<Cards>
  <Card title="碰撞攻击">找到两个完全不同的输入，却产生相同的哈希值</Card>
  <Card title="预图像攻击">给定一个哈希值，找到生成它的那个输入</Card>
  <Card title="第二预图像攻击">给定输入 A 和它的哈希值，找到另一个输入 B（≠A）具有相同的哈希值</Card>
</Cards>

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