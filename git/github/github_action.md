---
title: GitHub Action
date: 2025-07-15T06:53:49.383Z
category:
  - git
  - github
  - github_action
tags:
  - git
  - github
  - github_action
---

# GitHub Action
[[toc]]

GitHub Actions 是 GitHub 提供的持续集成和持续交付 (CI/CD) 平台，可直接在 GitHub 仓库中自动化软件开发工作流程。

## 使用场景

### 持续集成 (CI)
运行测试、构建代码、生成报告

### 持续交付 (CD)
部署应用到生产环境。

## 基本组成元素
- Workflow：工作流程，定义了自动化的任务流程，由YAML格式的配置文件定义
- Job：任务，由一个或多个步骤组成，在同一个 Runner 上执行
- Step：步骤，运行命令或执行Action的独立单元
- Action：动作，可重用的独立命令，是工作流的最小单元
- Runner：运行器，执行工作流的服务器（GitHub 托管或自托管）

## 工作流语法详解
```yaml
name: CI Pipeline

# 触发条件
on:
  # 推送代码时触发
  push:
    branches: [ main ]

# 环境变量
env:
  NODE_VERSION: '16'

# 任务
jobs:
  build:
    # 指定运行环境
    runs-on: ubuntu-latest
    # 定义任务中的步骤
    steps:
      
      # 输出信息
      - run: echo "🎉 The job was automatically triggered by a ${{ github.event_name }} event."
      - run: echo "🐧 This job is now running on a ${{ runner.os }} server hosted by GitHub!"
      - run: echo "🔎 The name of your branch is ${{ github.ref }} and your repository is ${{ github.repository }}."
    
      # 检出代码
      - uses: actions/checkout@v3
      - run: echo "💡 The ${{ github.repository }} repository has been cloned to the runner."
      - run: echo "🖥️ The workflow is now ready to test your code on the runner."
      - name: List files in the repository
        run: |
          ls ${{ github.workspace }}
      - run: echo "🍏 This job's status is ${{ job.status }}."
      
      # 设置 Node.js 环境
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          
      # 安装依赖
      - run: npm install
      
      # 运行测试
      - run: npm test
```

### 触发条件 on
- label：标签触发
- push：推送代码时触发
- pull_request：PR时触发
- schedule：定时触发
- workflow_dispatch：手动触发

```yaml
on:
  # 标签触发
  label:
    types:
      - created
      - edited  # 已编辑
      - deleted  # 已删除
  # 推送代码时触发
  push:
    # 推送到指定分支触发
    branches: [ main ]
    # 推送到指定标签时触发
    tags:
      - v1.*

  # 推送到启用了 GitHub Pages 的分支时触发
  page_build: 
    
  # 当创建或更新拉取请求时触发
  pull_request:
    branches: [ main ]
  
  # 定时触发，适用于定时运行备份、清理或数据同步任务
  schedule:
    - cron: '0 2 * * *'
  
  # 手动触发，通过 GitHub UI 或 API 手动触发，适用于需要手动触发的任务，例如部署或发布
  workflow_dispatch:
    inputs:
      environment:
        description: '部署环境'
        required: true

  # 外部事件触发，通过 GitHub API 触发外部事件，适用于与其他系统集成时触发工作流程
  repository_dispatch:
    types:
      - custom_event
  # 当创建、关闭或重新打开 Issue 时触发
  issues:
  # 当创建或发布新版本时触发
  release:
  # 当另一个工作流程完成时触发
  workflow_run:
```

### 环境变量和上下文对象
#### 环境变量 env

环境变量可以在多个层级定义，优先级从高到低：
- 步骤级 (jobs.<job_id>.steps[*].env)：仅对当前步骤有效。
- 作业级 (jobs.<job_id>.env)：对当前作业的所有步骤有效。
- 工作流级 (env)：对整个工作流的所有作业有效。

GitHub 自动提供了一些内置环境变量，例如：
- GITHUB_REPOSITORY：仓库名称（如 owner/repo）。
- GITHUB_SHA：触发工作流的提交 SHA。
- GITHUB_REF：触发工作流的分支或标签引用。
- GITHUB_WORKSPACE：工作流的工作目录路径。

使用环境变量：
- 在 run 命令中：通过 `$VAR_NAME`（Bash）或 $env:VAR_NAME（PowerShell）引用。
- 在 if 条件中：直接通过 env.VAR_NAME 访问。
- 在 with 参数中：通过 `${{ env.VAR_NAME }}` 注入。

```yaml
steps:
  - run: echo "Triggered by: $GITHUB_REF"
```

#### 上下文对象
常见上下文对象：
- github：包含 GitHub 事件信息、运行环境、仓库等信息
  + ref_name：分支短名称
- runner：包含运行器信息，例如运行器的系统类型、运行器的唯一标识符
- secrets：包含仓库的机密信息，例如 API 密钥、密码等
- steps：包含当前步骤的信息，例如步骤的名称、状态等

使用上下文对象：
- 通过表达式语法 `${{ }}` 访问
- 在支持表达式的字段（如 if、with）中通过 `${{ }}` 访问
::: code-tabs
@tab if 条件语法
```yaml
steps:
  - name: Check branch
    if: ${{ github.ref == 'refs/heads/main' }}
    run: echo "Running on main branch"
```

@tab 表达式语法
```yaml
steps:
  - name: Build on tag
    if: startsWith(github.ref, 'refs/tags/')
    run: echo "Building a release..."
  - name: Build on heads
    if: github.ref.startsWith('refs/heads/')
```
:::

#### 环境变量、上下文对象对比
| 特性	      |   GITHUB_REF (环境变量)      |         github.ref (上下文属性)|
| ---	      |   ---	                     |         ---|
| 来源	      |   GitHub 自动注入	           |         github 上下文对象的一部分|
| 访问方式	    |   $GITHUB_REF (脚本内)      |       `${{ github.ref }}` (表达式内)|
| 可用范围	    |   所有 run 命令	             |       支持表达式的字段（如 if、with）|
| 动态性	      |   静态值（运行时不可变）    	        | 动态（可被后续步骤修改的上下文）|

总结：
- 优先使用 github.ref：在 if 条件或参数传递等表达式场景中更简洁。
- 脚本内用 GITHUB_REF：在 run 命令中直接访问环境变量更方便。

### 任务 jobs
- name：任务名称
- need：
- if：
- runs-on：运行环境，可选值：ubuntu-latest、windows-latest、macos-latest
- container：容器化运行环境，若不设置 container，所有步骤将直接在 runs-on 指定的主机上运行
- steps：任务步骤，包含多个步骤

### 步骤 steps

- uses：步骤类型，指定使用的 Action
- with：步骤参数，用于传递给 Action 的输入
- run：运行命令，在 Runner 上执行的命令

### if
使用 if 条件控制 Step 或 Job 的执行。

```yaml
if: ${{always()}} # 总是执行
```

## 常用官方Action

| Action | 说明 | 示例 |
| --- | --- | --- |
| actions/checkout | 检出仓库代码 |`uses: actions/checkout@v3`|
| actions/cache@v3 | 缓存依赖，提升构建速度 |`uses: actions/cache@v3`|
| actions/setup-node  | 设置 Node.js 环境 |`with:{node-version: '16'}`|
| actions/upload-artifact | 上传构建产物 |`with:{path: 'dist/*'}`|
| actions/download-artifact | 下载构建产物 |`with:{name: 'build'}`|
| actions/github-script | 执行 GitHub API 脚本 |`uses: actions/github-script@v6`|
| JamesIves/github-pages-deploy-action@v4 | 部署到 GitHub Pages |`with:{branch: 'gh-pages',folder: 'docs/.vuepress/dist'}`|

::: tip
在 GitHub Actions 中，多个 Job 之间默认是隔离的（每个 Job 运行在独立的 Runner 环境中），可以通过缓存（Cache）或工件（Artifacts） 实现任务间复用打包结果。
:::

### actions/cache@v3
适用场景：依赖项（如 node_modules）或可缓存的中间文件。
特点：速度快，缓存键未命中时会失效。
```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Cache dependencies
        uses: actions/cache@v3
        with:
          path: node_modules
          key: ${{ runner.os }}-node-${{ hashFiles('package-lock.json') }}
      - run: npm install
      - run: npm run build

  test:
    needs: build  # 依赖 build 任务
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Restore cache
        uses: actions/cache@v3
        with:
          path: node_modules
          key: ${{ runner.os }}-node-${{ hashFiles('package-lock.json') }}
      - run: npm test
```

### upload-artifact & download-artifact
适用场景：构建产物（如编译后的代码、二进制文件）。
特点：跨 Job/Runner 共享文件，保留时间可配置（默认 90 天）。

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm install && npm run build
      - name: Upload artifacts
        uses: actions/upload-artifact@v4
        with:
          name: dist
          path: dist/  # 上传构建结果

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Download artifacts
        uses: actions/download-artifact@v4
        with:
          name: dist
      - run: ls dist/  # 使用上一任务的构建结果
```

### JamesIves/github-pages-deploy-action@v4
适用场景：部署到 GitHub Pages。
主要能力包括：
- 自动推送构建产物 到 gh-pages 分支或指定分支。
- 支持增量更新，仅部署变化的文件。
- 保留提交历史，避免强制覆盖（可选）。
- 自定义目标目录，灵活适配不同构建工具的输出路径。

基础用法：
```yaml
# 部署前必须先检出代码
- name: 检出代码
  uses: actions/checkout@v4
  with:
    fetch-depth: 0  # 获取完整历史（某些部署需要）
    
- name: 部署文档
  uses: JamesIves/github-pages-deploy-action@v4
  with:
    branch: gh-pages
    folder: docs/.vuepress/dist
```

完整参数说明：
- branch：必填，部署到的分支
- folder：必填，部署的文件夹
- token：用于推送到分支的令牌，默认使用当前仓库的 GITHUB_TOKEN
- clean：是否清理目标分支上的旧文件，默认为 false
- preserve：保留提交历史，默认为 false
- target-folder：指定目标分支中的子目录（如 docs）
- commit-message：提交信息，默认为 "Deploy to GitHub Pages"


## 自动部署VuePress配置文件
@[code](../../code/github/workflows/deploy-docs.yml)