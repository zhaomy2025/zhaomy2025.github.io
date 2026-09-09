---
title: 如何利用Trae开发VS Code插件
date: 2025-08-18 09:24:11
tags:
---
# 如何利用Trae开发VS Code插件

## 插件需求：自定义Markdown格式化工具

开发一个VS Code插件，用于格式化Markdown文档。这个插件不需要像一般Markdown格式化工具那样处理通用格式，而是专注于解决从文档平台导出的Markdown文件排版不规整的问题。

### 具体功能

1. **自定义规则支持**：
    - 删除特定的HTML标签（像`<font>`这种）
    - 移除多余的符号（比如`**`加粗符号）
    - 清理标题中的序号（比如`### 1.2 标题`变成`### 标题`）
    - 处理各种分隔线（比如`---`）
   
2. **换行符处理**：
   - 支持Windows和Linux换行符
   - 在标题后面自动加空行
   - 在代码块前后加空行
   - 调整列表项之间的间距

3. **空行控制**：
   - 支持合并多个连续空行
   - 确保不同元素之间有合适的间距

### 使用方式

- 打开Markdown文件，点击右键，选择“格式化文档”
- 针对当前打开的文件进行格式化

### 技术限制

- 不要引入额外的Markdown解析库，保持轻量
- 直接基于文本处理实现，不需要理解Markdown的完整语法结构

### 预期效果

比如处理这样的内容：
```
### 1.2 标题
<font color=red>红色文字</font>
**加粗内容**
---
```

处理后变成：
```
### 标题

红色文字
加粗内容

```

生成的项目放在 markdown-formatter 目录下

## Trae协作开发：从需求到代码实现

将上述需求交给Trae，Trae会根据需求生成对应的代码。

{% asset_img trae-develop1.png trae-develop1 %}

{% asset_img trae-develop2.png trae-develop2 %}

{% asset_img trae-develop3.png trae-develop3 %}

{% asset_img trae-develop4.png trae-develop4 %}

{% asset_img trae-develop5.png trae-develop5 %}

{% asset_img trae-develop6.png trae-develop6 %}

生成的项目结构如下：

```
markdown-formatter
│  .gitignore - 指定哪些文件和目录不应该提交到Git仓库
│  .vscodeignore - 指定哪些文件不应该包含在插件包中
│  debug-helper.js - 调试辅助工具，用于测试格式化功能
│  extension.js - 插件的主要逻辑文件，实现激活函数和格式化命令的注册
│  formatter.js - 实现具体的格式化逻辑。包含所有根据需求定义的格式化规则
│  package.json - 插件的配置文件，定义了插件的元数据、依赖和功能
│  README.md - 提供插件的说明和使用方法
│  test-format.js - 测试脚本，用于验证格式化功能的正确性
│  test.md - 测试用的Markdown文件，用于验证插件的功能
│
└─.vscode
        launch.json - 调试配置文件，以便在VS Code中测试插件
        tasks.json - VS Code任务配置文件，定义构建和测试任务
```

### 代码修改

Trae的Builder模式能够根据需求自动生成相应代码，我们只需在此基础上进行针对性修改即可。

调试过程中，你可以直接向Trae提问，例如：“我发现代码中有个问题，该如何解决？”

Trae会根据你的问题，智能生成具体的代码修改建议。

从下方案例可以看出，Trae的智能调试功能支持回归测试机制。修改代码后，Trae会自动生成测试脚本`test-merge-lines.js`，并执行测试用例来验证代码是否符合预期。若未达到预期效果，Trae会持续迭代优化代码直至满足要求（不过，偶尔也可能出现修改后仍不符合预期的情况，此时就需要我们手动介入调整）。

{% asset_img trae-debug1.png trae-debug1 %}

{% asset_img trae-debug2.png trae-debug2 %}

{% asset_img trae-debug3.png trae-debug3 %}

{% asset_img trae-debug4.png trae-debug4 %}

{% asset_img trae-debug5.png trae-debug5 %}

{% asset_img trae-debug6.png trae-debug6 %}

{% asset_img trae-debug7.png trae-debug7 %}

### 打包插件

1. 安装打包工具：打开终端，执行`npm install -g vsce`命令全局安装VSCE工具
2. 执行打包命令：在项目根目录下运行`vsce package`命令进行打包
3. 安装插件包：在VS Code插件市场点击右上角“...”菜单，选择“Install from VSIX...”选项，然后选择生成的.vsix文件
4. 重启VS Code：插件安装完成后，重启VS Code使其生效

### 测试

在VS Code中打开一个Markdown文件，点击右键，选择“Format Markdown Document”，检查格式化效果是否符合预期。

## 常见问题与解决方案

开发过程中发现一个调试问题：按F5启动调试会话后，在调试窗口的Markdown文件编辑框中右击菜单找不到“Format Markdown Document”选项；通过Ctrl + Shift + P打开命令面板并输入“Format Document”，也无法搜索到相关命令。

一开始以为是代码或配置问题，折腾了好久还是不能调试，后来尝试跳过调试环节，直接将插件打包为VSIX文件，安装该插件并重启VS Code后，可以在Markdown文件编辑框的右击菜单中正常看到并使用“Format Markdown Document”选项。

怀疑是由于Trae与VS Code的API兼容性问题导致的，如果你也有类似的问题，可以试下这个方法。

## 总结

对于没有太多开发经验的人来说，用Trae开发VS Code插件真的是一个很好的选择。你不需要记住复杂的API，也不需要担心代码结构问题，只需要把需求说清楚，剩下的交给Trae就好。

如果你也想开发一个属于自己的VS Code插件，不妨试试用Trae来辅助。相信我，它会让你的开发过程变得轻松愉快很多！

最后附上项目地址：https://github.com/zmyAI/vscode-plugin/markdown-formatter
