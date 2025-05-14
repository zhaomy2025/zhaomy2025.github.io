---
title: VuePress
date: 2025-04-30 09:01:45
tags: 
- VuePress
categories:
- 静态网站生成器
---
# 简介
VuePress 是一个以 Markdown 为中心的静态网站生成器。你可以使用 Markdown 来书写内容（如文档、博客等），然后 VuePress 会帮助你生成一个静态网站来展示它们。
## 为什么不是Hexo？
从Hexo转向VuePress最主要的原因就是没有找到Hexo顶部导航栏配置，只能配置侧边栏，而侧边栏又是默认隐藏的，需要多点击一次才能展开，使用起来很不方便；多级导航栏也没有找到。虽然可以通过修改主题模板的方式实现定制化配置，但因为创建项目时选择了依赖导入的方式引入主题，所以没法做到复杂的定制化配置。习惯了Spring的配置中心化思想，实在不喜欢这种修改源代码的方式，所以转向VuePress。VuePress内置了更直观的导航栏配置系统，通过主题配置文件即可快速设置多级导航，还可以提供更灵活的组件系统来处理复杂的布局和交互。
此外 Hexo 对非标准的Markdown语法支持不够好。比如不支持高亮块，从语雀导过来的文件不能直接渲染，需要手动修改。VuePress增强了Markdown处理：支持自定义容器（如高亮块、提示框等）、可以在Markdown中直接使用Vue组件、提供更多扩展语法（如自定义代码块）等。  
之前选择Hexo最主要原因就是想快速搭建一个博客，Hexo搭建简单，适合新手，而VuePress需要有Vue基础。但转向VuePress之后发现其实VuePress的配置也不难，都是通过脚手架搭建项目，两个框架的搭建难度其实差不多，主题和插件反而是觉得VuePress的配置更简单，至于Vue组件、扩展语法等，属于锦上添花的功能，不用这些功能也一样可以搭建出一个博客，可以等用到的时候再去研究。
# 使用
## 安装
依赖环境：Node.js v18.19.0+、npm
## 创建项目
```bash
npm init vuepress vuepress
```
注意：
1. 这里的`vuepress`是项目名称，可以自定义。
2. 按回车键后根据提示选择配置，一般选择默认即可。 
3. **如果需要自动部署到 GitHub Pages，`是否需要一个自动部署文档到 GitHub Pages 的工作流？`这个选项一定要选择Yes，否则需要手动创建`.github/workflows/XXX.yml` 文件来配置工作流。**(手动创建工作流容易出错，选择npm方式初始化，但官方给定的配置文件是pnpm，先是报错没有设置pnpm版本，然后有提示没有依赖锁文件，最后重新建了一个npm项目，把工作流文件复制过去才成功)。
4. 当前最新版本是2.x，以下命令都是基于2.x版本的。
## 上传到GitHub
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

## 开始使用VuePress
### 启动开发环境
```bash
npm run docs:dev
```
VuePress 会在 http://localhost:8080 启动一个热重载的开发服务器。

### 构建静态网站
```bash
npm run docs:build
```

# 配置
## 基本配置
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
        '/posts/resource/': ['/posts/resource/']
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

# 页面
## 路由
默认情况下，页面的路由路径是根据你的 Markdown 文件的相对路径决定的。
默认配置下，README.md 和 index.md 都会被转换成 index.html ，并且其对应的路由路径都是由斜杠结尾的。如果同时保留这两个文件，就可能会造成冲突。
设置`pagePatterns`可以避免某个文件被`VuePress`处理，例如使用 ['**/*.md', '!**/README.md', '!.vuepress', '!node_modules'] 来排除所有的 README.md 文件。

## Frontmatter
在Markdown文件中，我们可以添加YAML Frontmatter来配置页面的元数据。
```yaml
---
lang: zh-CN
title: 页面的标题
description: 页面的描述
---
```

## 内容
VuePress首先会将Markdown转换为HTML，然后将HTML作为Vue单文件组件的`<template>`。
借助`markdown-it`和Vue模板语法的能力，基础的Markdown可以得到很多的扩展功能。

## 新建页面
新建页面只需要在`docs/posts`或其子目录下新建一个Markdown文件，相对路径名即为页面的路由路径。
VuePress没有提供命令行工具来创建页面，如需使用命令行创建页面，可以通过 Node.js 脚本自动化创建文件，例如：
```javascript
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const tmpFilePath = process.argv[2].replace(/\s+/g, '-').toLowerCase();
const filePath = tmpFilePath.endsWith('/') ? `${tmpFilePath}index.md` : `${tmpFilePath}.md`;
const title = process.argv[3];
const category = tmpFilePath.split('/');
const content = `---
title: ${title}
date: ${new Date().toISOString()}
category:
` + category.map(c => `  - ${c}`).join('\n') + `
tags:
` + category.map(c => `  - ${c}`).join('\n') +`
---

# ${title}
[[toc]]
`;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
fs.writeFileSync(path.join(__dirname, 'docs/posts/',filePath), content);
console.log(`Created: ${filePath}`);
```
在 package.json 中添加命令：
```json
{
  "scripts": {
    "n": "node create-post.js"
  }
}
```
然后运行 `npm run n dir/hello-world “Hello World”` 来创建`Hello World`页面。

# Markdown
## 标准语法
- 标题
- 段落与换行
- 粗体、斜体、删除线
- 列表
- 链接、图片
- 行内代码、代码块
- 引用
- 分割线
```markdown
**粗体**
*斜体*
***加粗斜体***
~~删除线~~
<u>下划线</u>
[^footnote]: 脚注内容
# 标题1
## 标题2
### 标题3
#### 标题4
##### 标题5
###### 标题6

> 引用

- 列表1
* 列表2
+ 列表3

1. 列表1
2. 列表2
3. 列表3

[链接描述](https://vuejs.press/)

![图片描述](https://vuejs.press/images/hero.png)
---
分割线
***
```
## 语法扩展
VuePress 内置支持的 Markdown 语法扩展：
- 基础扩展
  + 表格
  + 任务列表
- 标题描点
- 链接扩展
- Emoji `:EMOJICODE:`
- 目录：`[[toc]]`
- 代码块增强
  + 代码块语法高亮：标准语法不支持高亮  
  + 行高亮：`{1,7-9}`
  + 行号：取消行号`no-line-numbers`
  + 代码标题
  + 导入外部代码
- 自定义容器
- 高级扩展  
  + 脚注 `[^note]`
  + 上下角标 `H~2~O`和`19^th^`
  + 标记高亮 `==标记==`
  + 自定义对齐 
  + 图表（Mermaid/PlantUML）
  
### 表格
```markdown
| 列1 | 列2 | 列3 |
| --- | --- | --- |
| 左对齐 | 居中 | 右对齐 |
```

### 任务列表
```markdown
- [x] 任务1
- [ ] 任务2
```

### 标题描点
```markdown
# 标题1 {#custom-id}
```

### 链接扩展
```markdown
[链接描述](https://vuejs.press/ "可选的标题")
```

### Emoji
```markdown
:smile: :100: :fire:
```

### 目录
```markdown
[[toc]]
```

### 行高亮
````ts{1,7-9}
```ts{1,7-9}
import { defaultTheme } from '@vuepress/theme-default'
import { defineUserConfig } from 'vuepress'
export default defineUserConfig({
  title: '你好， VuePress',

  theme: defaultTheme({
    logo: 'https://vuejs.org/images/logo.png',
  }),
})
```
````

### 行号
````ts:no-line-numbers
```ts:no-line-numbers
// 行号被禁用
const line2 = 'This is line 2'
const line3 = 'This is line 3'
```
````

### ~~plantuml~~
配置无效
1. 安装 markdown-it-plantuml
```bash
npm install markdown-it-plantuml --save-dev
```
2. 修改 `.vuepress/config.js` 文件，添加以下内容：
```javascript
markdown: {
    extendsMarkdown: (md) => {md.use(markdownItPlantuml);}
}
```
注意：以上为vuepress 2.x版本的配置，与vuepress 1.x版本的配置不同。

## 在Markdown中使用Vue
## Markdown组件
# 静态资源
## 相对路径
## Public文件
## Base Helper
## 依赖包和路径别名
# 多语言支持
## 站点多语言配置
## 主题多语言配置
# 部署
## GitHub Pages
GitHub Pages 可以通过路径区分来托管多个项目，需要为每个项目单独创建一个仓库。
1. 设置正确的 base 路径: `base: '/vuepress/',`。
2. 检查`.github/workflows`目录下是否存在工作流文件，项目初始化时会提示`是否需要一个自动部署文档到 GitHub Pages 的工作流？`，若选择Yes会自动生成一个工作流文件，否则需要手动创建`.github/workflows/XXX.yml` 文件来配置工作流（不推荐）。 
3. 在远程仓库中前往 `Settings > Pages > Build and deployment`，设置`Source`为 `Deploy from a brach`，分支设置为`gh-pages`。
   
`Source`的设置有两种方式：`Deploy from a brach`和`GitHub Actions`。
   - 本项目自带的部署工作流组件是`JamesIves/github-pages-deploy-action@v4`，它会自动将文档部署到的分支`gh-pages`，所以需要将 `Source` 设置为 `Deploy from a brach`，分支设置为`gh-pages`。 
   -主页项目使用的部署组件是`actions/upload-pages-artifact@v3`，没有新建分支，设置`Source`为`GitHub Actions`方式即可访问网站。

```yaml
# 本项目的部署组件
- name: 部署文档
  uses: JamesIves/github-pages-deploy-action@v4
  with:
    branch: gh-pages
    folder: docs/.vuepress/dist
# 主页项目的部署组件
- name: Upload Pages artifact
  uses: actions/upload-pages-artifact@v3
  with:
    path: ./public
```