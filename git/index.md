---
title: Git
date: 2025-05-30T05:37:11.148Z
category:
  - git
tags:
  - git
---

# Git

[[toc]]

## 仓库状态

```bash
# 查看仓库当前状态
git status

# 用简短格式查看状态，同时显示分支信息
git status --short --branch

# 等价简写
git status -sb
```

`git status` 用来查看当前仓库的整体状态，包括：

- 当前所在分支
- 是否有未暂存修改
- 是否有已暂存但未提交的修改
- 是否有未跟踪文件
- 本地分支和远端分支是否存在 ahead / behind

`git status --short --branch` 适合在需要快速判断仓库状态时使用。

- `--short`：使用简短格式输出文件状态。常见状态包括 ` M file`（工作区修改未暂存）、`M  file`（修改已暂存）、`?? file`（未跟踪文件）。
- `--branch`：在简短格式顶部显示当前分支和上游分支关系，例如 `## main...origin/main [ahead 1]`。

判断工作区是否干净时，看 `git status --short --branch` 的文件状态行：

```text
## main...origin/main
```

只有分支行，没有其他文件状态行，说明暂存区和工作区没有待提交变化。

```text
## main...origin/main
 M docs/git/index.md
?? new-file.md
```

分支行下面还有文件状态行，说明工作区不干净。

::: tip
`[ahead]` / `[behind]` 表示本地分支和远端分支的提交同步关系，不等于工作区有文件修改。

例如 `## main...origin/main [ahead 1]` 说明工作区可能是干净的，但本地有 1 个提交还没有推送。
:::

## 查看提交

```bash
# 查看某个提交的完整信息和文件变更
git show <commit-hash>

# 查看某个提交的统计信息
git show --stat <commit-hash>

# 只查看某个提交涉及的文件名
git show --name-only <commit-hash>

# 只查看提交信息，不显示文件 diff
git show -s <commit-hash>

# 自定义格式查看提交元信息：完整 hash、父提交、标题、作者和时间
git show -s --format='%H%n%P%n%s%n%an <%ae>%n%ad' <commit-hash>

# 快速查看最近 N 条提交（oneline 格式）
git log --oneline -5
```

`git show` 用来查看某个 Git 对象，最常见是查看某个提交。默认情况下，它会同时显示提交信息和本次提交造成的文件 diff。

如果只是想确认某个提交的元信息，不想展开文件变更，可以加 `-s`：

- `-s`：等价于 `--no-patch`，只显示提交信息，不显示 diff。
- `--format`：自定义输出格式，适合只提取自己关心的字段。

常用 `--format` 占位符：

| 占位符 | 含义 |
|--------|------|
| `%H` | 当前提交的完整 hash |
| `%P` | 当前提交的父提交 hash，merge commit 可能有多个父提交 |
| `%s` | 提交标题，也就是 commit message 的第一行 |
| `%an` | author name，作者名字 |
| `%ae` | author email，作者邮箱 |
| `%ad` | author date，作者时间 |
| `%n` | 换行 |

示例输出：

```text
64e3499eff0b2bcb0383d2e3ebaa6e8316cbea84
3264055d59401762f28c1c2af1d20cc8ed6ccc64
修复登录状态判断
Author Name <author@example.com>
Tue Jul 14 12:59:31 2026 +0800
```

这条格式化命令适合用来定位问题提交：先确认提交 hash、父提交、提交标题、作者和时间，再决定是否需要进一步查看 diff 或修复历史。

::: tip
如果想看完整提交信息，包括标题下面的正文，可以把 `%s` 换成 `%B`。
:::

## 远程仓库

```bash

# 查看远程仓库
git remote -v

# 修改远程仓库
git remote set-url origin <new_url>

# 拉取远程库的提交
git pull

```

## 分支

### 查看分支

```bash

# 列出所有本地分支，当前分支前会有一个 * 标记。
git branch

# 查看本地分支与远程分支关联情况
git branch -vv

# 查看某个提交在哪些分支里
git branch --contains <commit-hash>

```

### 切换分支

```bash

# 切换到 master 分支
git checkout master

# 拉取并切换到 dependabot 分支
git checkout -b dependabot origin/dependabot

```

### 合并分支

```bash

git merge dependabot

```

### 远程分支

```bash

# 清理本地过时的远程分支引用
git remote prune origin

```

## 删除提交

```bash
git reset --soft [commit id]
```

## 强制删除提交 `git reset --hard`（慎用）

::: warning
单独列出来是因为真的要慎用！！！

会强制覆盖暂存区和工作区已追踪的内容，谨慎使用。比如：工作区有A、B两个文件，A修改为A1，B是新增文件，则执行后仅保留B，A的修改内容全部丢失。

保留B是因为B还没有纳入版本管理，而A已经纳入版本管理了，所以A的修改内容全部丢失。
:::

希望保持一个干净的提交记录时使用该命令，不仅仅是恢复内容，提交记录也会一并删除，基础命令：

```bash

# 保留指定提交，删除所有后续提交
git reset --hard [commit id]

# 删除最后一次提交
git reset --hard HEAD~1

```

可细分为以下场景：

场景一：本地库与远程库不一致，删除本地提交后重新拉取远程库的提交

```bash

# 删除本地提交
git reset --hard [commit id]

# 重新拉取远程库的提交
git pull

```

场景二：需要删除远程库的提交，删除本地提交后强制推送到远程库

```bash
# 删除本地提交
git reset --hard [commit id]

# 强制推送到远程库
git push -f

# 安全强推（推荐）：只有当远端分支仍是本地上次看到的状态时才允许强推
git push --force-with-lease origin <branch-name>

```

## 提交信息

### 前缀

- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档变更
- `style`: 代码格式（不影响代码运行的变动）
- `refactor`: 代码重构（既不修复 bug 也不添加新功能的变动）
- `test`: 增加测试
- `chore`: 构建过程或辅助工具的变动
- `ci`: 持续集成相关的变动
- `revert`: 回滚到上一个版本

## 文件提交

### 从文件读取提交信息

```bash
git commit -F .git/commit-msg.txt
```

### 修改最新一次提交信息

```bash
git commit --amend -F .git/commit-msg-fix.txt
```

### 推送

```bash
# 正常推送（提交尚未推送到远端时）
git push origin <branch-name>

# 安全强推（修改过历史后推送）
git push --force-with-lease origin <branch-name>
```

## 高级用法

### 指定仓库路径

不想 `cd` 进仓库时，可以用 `git -C`：

```bash
git -C /path/to/repo status --short --branch

git -C /path/to/repo show -s --format='%H%n%P%n%s%n%an <%ae>%n%ad' <commit-hash>
```

### 重写历史提交信息

```bash
FILTER_BRANCH_SQUELCH_WARNING=1 git filter-branch -f --msg-filter '
if [ "$GIT_COMMIT" = "<bad-commit-hash>" ]; then
  cat .git/commit-msg-fix.txt
else
  cat
fi
' "<bad-commit-hash>^..HEAD"
```

### 配置中文编码

```bash
git config --global i18n.commitEncoding utf-8
git config --global i18n.logOutputEncoding utf-8
```

## 问题修复

- [修复乱码提交信息](./fix-garbled-commit-message.md)：中文提交信息乱码时的定位、修复和推送处理。
