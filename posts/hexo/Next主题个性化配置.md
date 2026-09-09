---
title: 【Hexo】Next主题个性化配置
date: 2025-03-06 09:09:50
tags:
- Hexo教程
- Next主题

categories:
- Hexo教程
- Next主题
---

# 修改菜单
修改左侧导航栏，包括关于、标签、分类、归档、日历、站点地图等。默认只有主页，其他页面需要自己添加，包括修改配置文件，添加页面，设置页面类型。
## 修改菜单主题里配置
1. 修改主题配置文件`themes/_config.yml`，放开关于、标签及分类设置
   如果是通过npm安装的主题，主题配置文件路径为`node_modules/hexo-theme-next/_config.yml`，将路径下的配置文件复制到项目主题目录下
```
menu:
  home: / || fa fa-home
  about: /about/ || fa fa-user
  tags: /tags/ || fa fa-tags
  categories: /categories/ || fa fa-th
  #archives: /archives/ || fa fa-archive
  #schedule: /schedule/ || fa fa-calendar
  #sitemap: /sitemap.xml || fa fa-sitemap
  #commonweal: /404/ || fa fa-heartbeat
```
## 设置about页面
todo: about页面创建后没有展示
1. 创建about页面
```
hexo new page about
```
2. 编辑页面，添加上`type: "about"`，让主题识别页面为about页面
3. 编辑页面内容，添加关于自己的内容


## 设置分类
1. 创建分类页
```
hexo new page categories
```
2. 编辑页面，添加上`type: "categories"`，让主题识别页面为分类页面
3. 给文章设置分类属性，支持多级分类
```
---
categories: 
- 一级分类
- 二级分类
---
```

## 设置标签
1. 创建标签页
```
hexo new page tags
```
2. 编辑页面，添加上`type: "tags"`，让主题识别页面为标签页面
3. 给文章设置标签属性，支持多个标签

# 切换风格
Next主题提供了四种不同的风格（Scheme），在主题配置文件/themes/_config.yml中查找：scheme，修改scheme属性即可切换样式：
```
# Schemes
#scheme: Muse # 经典侧边栏布局，适合文字内容为主的博客。
scheme: Mist # 简洁现代风格，适合轻量级博客。
#scheme: Pisces # 双栏布局，功能丰富，适合多功能博客。
#scheme: Gemini # 杂志风格，适合多媒体内容展示。
```

# 本地搜索
1. 安装插件`hexo-generator-searchdb`，执行以下命令:
```
npm install hexo-generator-searchdb --save
```
2. 修改hexo/_config.yml站点配置文件，新增以下内容到任意位置：
``` 
search:
   path: search.xml # 搜索后生成的文件路径，可以生成xml和json两种格式
   field: post # 搜索的字段，可以是post、page、all
   #content: true # 是否包含搜索到的文章的全部内容。默认情况下是true
   #format: html # 搜索到的内容、选项的格式。可以是html、striptags、raw，默认情况下是html
   limit: 10000
   template: themes/search.xml # 搜索结果的模板文件路径
```
3. 编辑主题配置文件，启用本地搜索功能：
```
# Local search
local_search:
enable: true
```
4. 根目录记得创建一个search.xml
很多教程都没有提到这一步，可能是因为通过git clone安装的主题，根目录已经有了search.xml文件，所以不需要再创建。
如果是通过npm安装的主题，需要在主题目录下创建search.xml文件，否则搜索功能将无法使用。
这个文件可以去 https://github.com/wzpan/hexo-generator-search 下载，也可以在刚刚安装的依赖包中找到，地址为`node_modules/hexo-generator-search/demo_output/search.xml`。



# TODO
- 浏览页面显示当前浏览进度
- 文章分享功能
- 文章加密访问
- 增加文章字数统计及阅读时常功能
- 文章置顶功能
- 评论功能