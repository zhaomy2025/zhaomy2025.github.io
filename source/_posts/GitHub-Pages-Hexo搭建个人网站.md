---
title: GitHub Pages + Hexo搭建个人网站
date: 2025-03-03 14:59:10
tags: 
- Hexo教程
categories: 
- Hexo教程
---
# 准备环境
准备一个 GitHub 账号并新建一个仓库，仓库名称为 `<username>.github.io`。

安装 Node.js 和 Git。

## Node
**hexo需要ES6 模块语法支持, ES6 模块语法在 Node.js 12.x 版本中引入，并在 Node.js 14.x 及更高版本中得到更好的支持。**

## 同时使用GitHub和GitLab
### 为每个平台生成不同的SSH密钥
```git
ssh-keygen -t rsa -f ~/.ssh/id_rsa.github -C "youremail"
# 因为gitee已经配置了SSH,文件名为id_rsa,所以注释下面这条命令
# ssh-keygen -t rsa -f ~/.ssh/id_rsa.gitee -C "youremail"
```

### 创建配置文件
在 _**~/.ssh/**_ 目录下创建一个 _**config**_ 文件，用于配置不同平台的 SSH 连接信息。文件内容如下：

```plain
# GitHub
Host github.com
HostName github.com
User git
IdentityFile ~/.ssh/id_rsa.github

# Gitee
Host gitee.com
HostName gitee.com
User git
IdentityFile ~/.ssh/id_rsa.gitee
```

### 添加 SSH 密钥到平台
分别将生成的公钥添加到 GitHub 和 Gitee 的 SSH Key 设置中：

+ GitHub: https://github.com/settings/keys
+ Gitee: https://gitee.com/profile/sshkeys

# 安装 Hexo
Hexo 是一个轻量级博客框架。

```bash
# 安装Hexo
npm install hexo-cli -g
# 初始化
hexo init zhaomy2025.github.io
# 安装依赖
cd <site> && npm install
# 启动服务器
hexo s
```

# 部署网站
在远程仓库中前往 Settings > Pages > Source，并将 Source 改为 GitHub Actions。

在本地仓库中建立 .github/workflows/pages.yml，并填入以下内容：

```yaml
name: Pages

on:
  push:
    branches:
      - main # default branch

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          submodules: recursive
      - name: Use Node.js 20
        uses: actions/setup-node@v4
        with:
          node-version: "20"
      - name: Cache NPM dependencies
        uses: actions/cache@v4
        with:
          path: node_modules
          key: ${{ runner.OS }}-npm-cache
          restore-keys: |
            ${{ runner.OS }}-npm-cache
      - name: Install Dependencies
        run: npm install
      - name: Build
        run: npm run build
      - name: Upload Pages artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./public
  deploy:
    needs: build
    permissions:
      pages: write
      id-token: write
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

# 撰写文章
```bash
hexo n "GitHub Pages + Hexo搭建个人网站"
```

# 主题
1. 安装主题包
```bash
npm install hexo-theme-next
```
2. 打开站点配置文件 _config.yml，找到 `theme` 字段，并将其值更改为 `next`
3. 将`node_modules/hexo-theme-next/_config.yml`文件复制到站点目录`themes`
   注意不能放到`themes/next`目录下，因为创建该目录后，不会再从node_modules目录下查找文件，找不到文件导致报错`WARN  No layout: archives/index.html`
4. 清除缓存再预览
```bash
hexo clean && hexo s
```

# 选择更高级的Markdown渲染器
Hexo 默认搭配的 Markdown 渲染器为 hexo-renderer-marked，但其实现功能有限，推荐换成`hexo-renderer-markdown-it-plus`渲染器。