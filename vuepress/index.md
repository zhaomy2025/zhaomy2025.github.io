---
title: VuePress
date: 2025-05-28T05:31:54.077Z
category:
  - vuepress
tags:
  - vuepress
---

# VuePress
[[toc]]

## 简介
VuePress 是一个以 Markdown 为中心的静态网站生成器。你可以使用 Markdown 来书写内容（如文档、博客等），然后 VuePress 会帮助你生成一个静态网站来展示它们。

### 为什么不是Hexo？
从Hexo转向VuePress最主要的原因就是没有找到Hexo顶部导航栏配置，只能配置侧边栏，而侧边栏又是默认隐藏的，需要多点击一次才能展开，使用起来很不方便；多级导航栏也没有找到。虽然可以通过修改主题模板的方式实现定制化配置，但因为创建项目时选择了依赖导入的方式引入主题，所以没法做到复杂的定制化配置。习惯了Spring的配置中心化思想，实在不喜欢这种修改源代码的方式，所以转向VuePress。VuePress内置了更直观的导航栏配置系统，通过主题配置文件即可快速设置多级导航，还可以提供更灵活的组件系统来处理复杂的布局和交互。

此外 Hexo 对非标准的Markdown语法支持不够好。比如不支持高亮块，从语雀导过来的文件不能直接渲染，需要手动修改。VuePress增强了Markdown处理：支持自定义容器（如高亮块、提示框等）、可以在Markdown中直接使用Vue组件、提供更多扩展语法（如自定义代码块）等。  

之前选择Hexo最主要原因就是想快速搭建一个博客，Hexo搭建简单，适合新手，而VuePress需要有Vue基础。但转向VuePress之后发现其实VuePress的配置也不难，都是通过脚手架搭建项目，两个框架的搭建难度其实差不多，主题和插件反而是觉得VuePress的配置更简单，至于Vue组件、扩展语法等，属于锦上添花的功能，不用这些功能也一样可以搭建出一个博客，可以等用到的时候再去研究。

## 使用
### 安装
依赖环境：Node.js v18.19.0+、npm

### 创建项目
```bash
npm init vuepress vuepress
```
注意：
1. 这里的`vuepress`是项目名称，可以自定义。
2. 按回车键后根据提示选择配置，一般选择默认即可。 
3. **如果需要自动部署到 GitHub Pages，`是否需要一个自动部署文档到 GitHub Pages 的工作流？`这个选项一定要选择Yes，否则需要手动创建`.github/workflows/XXX.yml` 文件来配置工作流。**(手动创建工作流容易出错，选择npm方式初始化，但官方给定的配置文件是pnpm，先是报错没有设置pnpm版本，然后有提示没有依赖锁文件，最后重新建了一个npm项目，把工作流文件复制过去才成功)。
4. 当前最新版本是2.x，以下命令都是基于2.x版本的。

### 上传到GitHub
1. 初始化Git仓库
```bash
cd vuepress
git init
```
2. 新建`.gitignore`文件，添加以下内容
```gitignore
# VuePress 默认临时文件目录
.vuepress/.temp
# VuePress 默认缓存目录
.vuepress/.cache
# VuePress 默认构建生成的静态文件目录
.vuepress/dist
```
3. 提交代码到GitHub
```bash
git add.
git commit -m "first commit"
git checkout -b main # 创建 main 分支
git remote add origin https://github.com/zhaomy2025/vuepress.git
git push -u origin main # 首次推送 main 分支并设置上游
```

### 开始使用VuePress
#### 启动开发环境
```bash
npm run docs:dev
```
VuePress 会在 http://localhost:8080 启动一个热重载的开发服务器。

### 构建静态网站
```bash
npm run docs:build
```

## 配置
### 基本配置
VuePress 站点的基本配置文件是 .vuepress/config.js ，但也同样支持 TypeScript 配置文件。你可以使用 .vuepress/config.ts 来得到更好的类型提示。
在`.vuepress/config.js`文件中，我们可以配置 VuePress 的基本信息、主题、插件、markdown渲染器等。
```javascript
import { blogPlugin } from '@vuepress/plugin-blog'
import { defaultTheme } from '@vuepress/theme-default'
import { defineUserConfig } from 'vuepress'
import { viteBundler } from '@vuepress/bundler-vite'

export default defineUserConfig({
    lang: 'zh-CN',
    title: 'VuePress',
    description: '这是我的第一个 VuePress 站点',
    base: '/vuepress/', // 部署到 GitHub Pages 时，如果仓库名不是username.github.io,则需要设置 base为仓库名
    theme: defaultTheme({}),
})
```

### 主题
VuePress 提供了多个官方主题，包括默认主题、简约主题、星空主题等。主题可设置logo、导航栏、侧边栏等。
首先给出一份比较完整的默认主题配置，注意下配置项的位置。官网给出的配置信息虽然很详细，但嵌套关系不直观。因为配置项的位置出错，导致配置未生效，花了好长时间才排查出来：比如误将sidebarDepth放在到了sidebar内部，导致侧边栏展示标题层级未生效。
```javascript
theme: defaultTheme({
    logo: 'https://vuejs.press/images/hero.png',
    navbar: [
        '/',
        {
            text: '资源',
            link: '/posts/resource/',// 链接到 posts/resource/index.md 文件
        },
        {
            text: 'Article',
            link: '/article/',//链接到.vuepress/layout/Article.vue 文件
        },
    ],
    sidebar: {
        '/posts/resource/': ['/posts/resource/'],
        '/posts/spring/': [
            {
                text: 'Spring',
                link: '/posts/spring/',
            },
            {
                text: 'Spring Framework',
                collapsible: true,
                prefix: '/posts/spring/',
                children: [
                    'spring-framework',
                    'spring-framework-ioc',
                    'spring-framework-ioc-impi',
                ],
            },
            {
                text: 'Spring Boot',
                collapsible: true,
                prefix: '/posts/spring/',
                children: ['spring-boot'],
            }
        ]
    },
    sidebarDepth: 1,
})
```

#### navbar
navbar用来配置导航栏，可以设置文本和链接。
link 可以链接到布局文件，如`link: '/article/'`，会渲染`.vuepress/layout/Article.vue`文件；也可以链接到其他页面，如`link: '/posts/resource/'`，则会渲染`posts/resource/index.md`文件。

#### sidebar
sidebar用来配置侧边栏的导航，可以根据文件结构自动生成侧边栏，也可以手动配置侧边栏。手动配置包括全局配置和按路径配置，两种配置方式都支持字符串和对象数组配置。
- 自动生成侧边栏：`sidebar: "auto"`
- 全局配置侧边栏：
    - 字符串数组：`sidebar: ['/posts/resource/','/posts/spring/']`
    - 对象数组：
      ```javascript
      sidebar: [
        {
           text: '资源', 
           link: '/posts/resource/'
        },
        {
           text: 'Spring', 
           children: ['/posts/spring/','/posts/spring/spring-framework/']
        }
      ]
      ```
- 按路径配置侧边栏，同样支持字符串和对象数组配置：
    ```javascript
    sidebar: {
        '/posts/resource/': ['/posts/resource/'],
        '/posts/spring/': [
            {
                text: 'Spring', 
                link: '/posts/spring/'
            },
            {
                text: 'Spring Framework',
                children: ['/posts/spring/spring-framework/', '/posts/spring/spring-framework-ioc', '/posts/spring/spring-framework-aop']
            }
        ]
    }
    ```

使用建议：
- 简单配置使用字符串数组方式即可，侧边栏会根据文件结构自动生成，侧边栏显示文章的h1标题（如果未设置则显示路径），默认标题层级是2，显示到h3标题。
- 如需使用更复杂的侧边栏配置，比如分组、折叠、自定义标题层级等，可以使用对象数组方式配置，对象数组支持以下属性：
    - text：分组标题
    - collapsible：是否可折叠
    - prefix：路径前缀    
    - link：链接到页面，可以是绝对路径或相对路径。
    - children：子菜单

注：
1. `text`为必填属性，其他为可选属性，`link`和`children`应该至少设置一个。
2. 一篇文章中仅第一个h1标题会显示在侧边栏，所以文章标题使用h1标题，而其余标题使用h2标题。
3. 指定link后，点击侧边栏的链接会直接跳转到指定页面，不再折叠菜单，所以建议：
   - 不要同时设置`link`和`collapsible`
   - 分组设置`children`和`collapsible`
   - 文章设置`link`
  
#### sidebarDepth
控制显示的标题层级，默认是2，显示到h3标题
注：sidebarDepth不是sidebar的属性，而是theme的属性。