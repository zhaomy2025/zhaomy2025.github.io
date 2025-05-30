---
title: 【Hexo】更高级的Markdown渲染器
date: 2025-03-06 16:56:57
tags:
  - Hexo教程
  - Markdown
categories:
  - Hexo教程
  - Markdown
---



Hexo 默认搭配的 Markdown 渲染器为 hexo-renderer-marked，但其实现功能有限，推荐换成`hexo-renderer-markdown-it-plus`渲染器。
# 切换渲染器
```bash
npm uninstall hexo-renderer-marked --save
npm install hexo-renderer-markdown-it-plus --save
```

# 安装所需插件
使用npm命令安装以下三个插件：
```bash
npm install markdown-it --save
npm install markdown-it-checkbox --save # 任务列表
npm install markdown-it-expandable --save # 折叠/展开内容
npm install markdown-it-container --save # 自定义容器
```
其他插件`hexo-renderer-markdown-it-plus`渲染器自带，无需安装，包括以下插件：
- markdown-it-emoji 表情
- markdown-it-sub 下标
- markdown-it-sup 上标
- markdown-it-deflist
- markdown-it-abbr
- markdown-it-footnote 脚注
- markdown-it-ins 下划线
- markdown-it-mark 高亮
- @iktakahiro/markdown-it-katex
- markdown-it-toc-and-anchor

# 启用插件
修改博客目录里的 _config.yml 文件，启用插件，渲染器自带插件默认启用，无需配置。
```yaml
markdown:
  plugins:
    - markdown-it-checkbox
    - markdown-it-expandable
    - name: markdown-it-container
      options: success
    - name: markdown-it-container
      options: tips
    - name: markdown-it-container
      options: warning
    - name: markdown-it-container
      options: danger
```

# 语法
:( 添加依赖，启用插件后，手动安装的插件（任务列表和进阶语法）都不支持，先把语法贴上来，后面再解决。
## 基础语法
|名称|描述|语法|效果|
|----|----|----|----|
|markdown-it-emoji|表情|`:)`| :) |
| markdown-it-sub |下标|`H~2~O`|H~2~O|
| markdown-it-sup |上标|`X^2^`|X^2^|
|markdown-it-ins|下划线|`++下划线++`| ++下划线++ |
|markdown-it-mark|高亮|`==高亮==`| ==高亮== |
|markdown-it-checkbox|任务列表/复选框|`-[x] 任务列表/复选框`| -[x] 不支持任务列表/复选框 |

<!-- # - 脚注[^1] -->
### Emoji编码合集
https://www.emojiall.com/zh-hans#google_vignette
https://emojipedia.org/zh
https://www.webfx.com/tools/emoji-cheat-sheet/
## 进阶语法

### 折叠展开内容
语法:
```
+++ **点击折叠**
这是被隐藏的内容
+++
```
### 自定义容器
语法：
```
::: tip
提示
:::

::: warning
警告
:::

::: danger
危险
:::
```
### Markdown-it插件
https://mdit-plugins.github.io/zh/