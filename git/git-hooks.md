---
title: Git钩子
date: 2025-05-30T05:26:27.248Z
category:
  - git
tags:
  - git
  - hooks
  - Git Hooks
---

# Git钩子
[[toc]]

::: tip
Git 钩子（Git Hooks）是 Git 在**特定事件**（如提交、推送、合并等）发生时自动触发的**自定义脚本**。它们允许开发者在 Git 工作流程的各个阶段插入自定义逻辑，例如：
- **代码检查**（如 ESLint、Prettier）
- **测试运行**（如 `npm test`）
- **提交信息验证**
- **分支保护**（如禁止直接推送到 `main` 分支）
:::


## **Git 钩子的类型**
Git 钩子分为两大类：

### **客户端钩子（Client-Side Hooks）**
在本地 Git 仓库触发，仅影响当前用户的操作：
| 钩子名称              | 触发时机                     | 常见用途                     |
|-----------------------|----------------------------|----------------------------|
| `pre-commit`          | 执行 `git commit` 前        | 检查代码风格、运行测试       |
| `prepare-commit-msg`  | 生成提交信息后，编辑器打开前 | 自动生成提交信息模板         |
| `commit-msg`         | 提交信息编辑完成后          | 验证提交信息格式（如符合 Conventional Commits） |
| `post-commit`        | 提交完成后                 | 发送通知、记录日志           |
| `pre-push`           | 执行 `git push` 前         | 运行完整测试，防止推送错误代码 |

### **服务端钩子（Server-Side Hooks）**
在 Git 服务器（如 GitHub、GitLab）上触发，用于强制执行团队规则：
| 钩子名称              | 触发时机                     | 常见用途                     |
|-----------------------|----------------------------|----------------------------|
| `pre-receive`         | 推送前（服务器端）          | 检查提交是否符合规范         |
| `update`             | 每个分支更新前              | 精细控制分支权限             |
| `post-receive`       | 推送完成后                 | 触发 CI/CD、发送通知         |


## **Git 钩子的存放位置**
Git 钩子脚本存储在项目的 `.git/hooks/` 目录下：
```
.git/
└── hooks/
    ├── pre-commit.sample
    ├── commit-msg.sample
    ├── pre-push.sample
    └── ...
```
- 默认情况下，这些文件以 `.sample` 结尾，**不会生效**。
- **启用钩子**：删除 `.sample` 后缀并赋予可执行权限：
  ```bash
  mv .git/hooks/pre-commit.sample .git/hooks/pre-commit
  chmod +x .git/hooks/pre-commit
  ```


## **示例：`pre-commit` 钩子**
### **功能**
限制 dev 分支的提交。

### **实现步骤**
1. 创建 `pre-commit` 文件（`.git/hooks/pre-commit`）：
  @[code](../code/git-hooks/pre-commit)
2. 赋予执行权限：
   ```bash
   chmod +x .git/hooks/pre-commit
   ```
3. 测试：
   ```bash
   git commit -m "test"  # 提交到 dev 分支会失败
   ```


## **管理 Git 钩子的工具：husky（推荐）**
手动管理钩子容易出错，推荐使用工具：

- **安装**：
  ```bash
  npm install husky --save-dev
  npx husky install
  ```
- **添加钩子**：
  ```bash
  npx husky add .husky/pre-commit "npm test"
  ```
- **示例**（`.husky/pre-commit`）：
  ```bash
  #!/bin/sh
  . "$(dirname "$0")/_/husky.sh"

  npm run lint
  ```



## **跳过钩子**
如果临时需要绕过钩子检查：
```bash
git commit --no-verify  # 跳过 pre-commit 和 commit-msg 钩子
git push --no-verify    # 跳过 pre-push 钩子
```

## **最佳实践**
1. **优先使用 `husky`**：避免手动管理钩子文件。
2. **轻量化钩子逻辑**：避免在钩子中运行耗时操作（如完整构建）。
3. **团队共享钩子**：将钩子脚本纳入版本控制（如放在 `.husky/` 目录）。
4. **结合 CI/CD**：仅用钩子做快速检查，复杂逻辑交给 CI（如 GitHub Actions）。

## **总结**
| 场景                 | 推荐方案                     |
|----------------------|----------------------------|
| **个人项目**         | 手动钩子或 `husky`          |
| **团队项目**         | `husky` + 分支保护规则      |
| **服务端强制检查**   | GitHub/GitLab 的 `pre-receive` 钩子 |

Git 钩子是自动化工作流的强大工具，合理使用可以显著提升代码质量和团队协作效率！ 🚀