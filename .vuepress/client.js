import { defineClientConfig } from 'vuepress/client'
import { defineMermaidConfig } from 'vuepress-plugin-md-enhance/client'
import Layout from './layouts/Layout.vue'
import Article from './layouts/Article.vue'
import Category from './layouts/Category.vue'
import Tag from './layouts/Tag.vue'
import Timeline from './layouts/Timeline.vue'
import MyTag from './components/MyTag.vue'
import Tip from './components/Tip.vue'
import Warning from './components/Warning.vue'
import Danger from "./components/Danger.vue"
import Card from './components/Card.vue'
import Cards from './components/Cards.vue'

// mermaid 默认会给没有成员/方法的类补一个空的成员栏和两条分隔线，类图上全是空框。
// 关掉它，类图只按实际内容占高。
defineMermaidConfig({
  class: { hideEmptyMembersBox: true },
})

export default defineClientConfig({
  // we provide some blog layouts
  layouts: {
    Layout,
    Article,
    Category,
    Tag,
    Timeline,
  },
  enhance({ app }) {
    app.component('MyTag', MyTag)
    app.component('Tip', Tip)
    app.component('Warning', Warning)
    app.component('Danger', Danger)
    app.component('Card', Card)
    app.component('Cards', Cards)
  },
})
