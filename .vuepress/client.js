import { defineClientConfig } from 'vuepress/client'
import Layout from './layouts/Layout.vue'
import Article from './layouts/Article.vue'
import Category from './layouts/Category.vue'
import Tag from './layouts/Tag.vue'
import Timeline from './layouts/Timeline.vue'
import MyTag from './components/MyTag.vue'
import Tip from './components/Tip.vue'
import Warning from './components/Warning.vue'
import Danger from "./components/Danger.vue"

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
  },
})
