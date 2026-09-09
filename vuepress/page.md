---
title: VuePress 页面
date: 2025-05-28T05:31:54.077Z
category:
  - vuepress
tags:
  - vuepress
---

# VuePress 页面
[[toc]]

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
新建页面只需要在`docs/`或其子目录下新建一个Markdown文件，相对路径名即为页面的路由路径。
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
fs.writeFileSync(path.join(__dirname, 'docs/',filePath), content);
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
然后运行 `npm run n dir/hello-world "Hello World"` 来创建`Hello World`页面。