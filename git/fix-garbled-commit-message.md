---
title: 修复乱码提交信息
date: 2026-07-14T00:00:00.000Z
category:
  - git
tags:
  - git
  - commit
  - encoding
---

# 修复乱码提交信息

[[toc]]

## 适用场景

中文提交信息在 Windows / Git Bash / CMD / PowerShell 的编码链路里处理不一致时，可能会变成类似下面的乱码：

```text
ÍêÉÆѡÌ⼼ÄܹæÔò
```

常见原因是：提交信息原本是中文，但在 shell、管道、Git 配置或终端显示之间发生了错误转码。

## 处理原则

先判断乱码提交处于哪种位置：

| 场景 | 处理方式 |
|------|----------|
| 最新一次提交乱码 | `git commit --amend -F <message-file>` |
| 历史中的某个提交乱码 | 重写从该提交到 `HEAD` 的历史 |
| 乱码提交已经推送到远端 | 修复后需要 `git push --force-with-lease` |
| 不想改历史 | 新增一个说明提交，保留原乱码提交 |

::: warning
修复历史提交信息会改变 commit hash。

如果目标提交后面还有其他提交，后续提交的 hash 也会一起变化，因为后续提交的 parent hash 变了。

如果这些提交已经推送到远端，强推前要确认没有其他人基于旧历史继续提交。
:::

## 一、先定位提交和仓库状态

### 查看工作区是否干净

```bash
git status --short --branch
```

工作区最好是干净的，再做历史修复。

### 查看目标提交信息

```bash
git show -s --format='%H%n%P%n%s%n%an <%ae>%n%ad' <bad-commit-hash>
```

输出内容含义：

| 行 | 含义 |
|----|------|
| 第 1 行 | 当前提交 hash |
| 第 2 行 | 父提交 hash |
| 第 3 行 | 提交信息 |
| 第 4 行 | 作者 |
| 第 5 行 | 提交时间 |

### 查看目标提交在哪些分支里

```bash
git branch --contains <bad-commit-hash>
```

如果输出里有当前分支，说明这个提交在当前分支历史中。

### 判断是不是最新提交

```bash
git log --oneline -5
```

判断方式：

- 如果 `<bad-commit-hash>` 是最新一行，也就是当前 `HEAD`，可以用 `git commit --amend`。
- 如果它下面还有其他提交，说明它是历史提交，不能只用 `git commit --amend`。

## 二、情况一：最新提交信息乱码

最新提交可以直接 amend。

### 写入正确提交信息

推荐把正确提交信息写入 UTF-8 文件，避免 shell 再次把中文转乱码：

```bash
printf '%s\n' '正确提交信息' > .git/commit-msg-fix.txt
```

### 修改最新一次提交信息

```bash
git commit --amend -F .git/commit-msg-fix.txt
```

### 删除临时文件

```bash
rm -f .git/commit-msg-fix.txt
```

### 验证结果

```bash
git log -1 --format=%s
```

### 推送

如果这个提交还没有推送过，正常推送：

```bash
git push origin <branch-name>
```

如果这个提交已经推送过，需要更新远端历史：

```bash
git push --force-with-lease origin <branch-name>
```

## 三、情况二：历史提交信息乱码

历史提交不能只改当前 `HEAD`，需要重写从乱码提交到当前 `HEAD` 的提交信息。

下面命令只替换目标提交的 message，其他提交的 message 原样保留。

### 设置变量

```bash
BAD_COMMIT=<bad-commit-hash>
BRANCH=<branch-name>
```

### 写入正确提交信息

```bash
printf '%s\n' '正确提交信息' > .git/commit-msg-fix.txt
```

### 重写指定范围历史

```bash
FILTER_BRANCH_SQUELCH_WARNING=1 git filter-branch -f --msg-filter '
if [ "$GIT_COMMIT" = "'"$BAD_COMMIT"'" ]; then
  cat .git/commit-msg-fix.txt
else
  cat
fi
' "$BAD_COMMIT^..HEAD"
```

这段命令的含义：

| 片段 | 含义 |
|------|------|
| `--msg-filter` | 只处理提交信息，不改文件内容 |
| `$GIT_COMMIT` | 当前正在被重写的提交 hash |
| `cat .git/commit-msg-fix.txt` | 对目标提交输出新的提交信息 |
| `else cat` | 其他提交沿用原提交信息 |
| `$BAD_COMMIT^..HEAD` | 从目标提交的父提交之后，一直重写到当前 `HEAD` |

::: tip
如果命令报 `cat: .git/commit-msg-fix.txt: No such file or directory`，说明过滤脚本运行时没有在预期目录下找到相对路径。

可以把文件路径改成绝对路径，例如：

```bash
cat /path/to/repo/.git/commit-msg-fix.txt
```
:::

### 删除临时文件

```bash
rm -f .git/commit-msg-fix.txt
```

### 验证历史

```bash
git log --oneline -5

git status --short --branch
```

如果目标提交已经推送到远端，本地状态可能出现类似：

```text
[ahead 2, behind 2]
```

这是历史重写后的正常现象：

- 本地有新的提交链。
- 远端还有旧的提交链。

### 推送到远端

```bash
git push --force-with-lease origin "$BRANCH"
```

`--force-with-lease` 比 `--force` 更安全：只有当远端分支仍然是本地上次看到的状态时才允许强推。如果别人已经推送了新提交，它会拒绝覆盖。

## 四、使用 `git -C` 指定仓库路径

不想 `cd` 进仓库时，可以用 `git -C`：

```bash
git -C /path/to/repo status --short --branch

git -C /path/to/repo show -s --format='%H%n%P%n%s%n%an <%ae>%n%ad' <bad-commit-hash>

git -C /path/to/repo branch --contains <bad-commit-hash>

git -C /path/to/repo log --oneline -5
```

## 五、为什么 commit hash 会变化

Git 的 commit hash 由 commit 对象内容计算而来。commit 对象里包含：

- 文件快照对应的 tree
- 父提交 parent
- author
- committer
- 提交时间
- 提交信息 message

所以只要提交信息变化，commit hash 就会变化。

如果修改的是历史提交，后续提交的 parent hash 也会变化，所以后续提交的 hash 也会一起变化。

示例：

```text
修复前：A -> B(乱码) -> C
修复后：A -> B'(正确信息) -> C'
```

其中：

- `B` 变成 `B'`，因为提交信息变了。
- `C` 变成 `C'`，因为它的父提交从 `B` 变成了 `B'`。

## 六、避免中文提交信息再次乱码

优先使用 `-F` 从 UTF-8 文件读取提交信息：

```bash
printf '%s\n' '提交信息' > .git/commit-msg.txt
git commit -F .git/commit-msg.txt
rm -f .git/commit-msg.txt
```

不要优先使用下面这种写法：

```bash
git commit -m "中文提交信息"
echo 中文提交信息 | git commit -F -
```

这些写法在 Windows shell 编码不一致时更容易产生乱码。

可以同时配置 Git 的提交和日志输出编码：

```bash
git config --global i18n.commitEncoding utf-8
git config --global i18n.logOutputEncoding utf-8
```

## 七、Windows 平台编码问题详解

### 7.1 三层编码模型

```
第1层: Git 对象存储     → 存的是 UTF-8 字节 ✅
第2层: 系统 Locale       → zh_CN.GBK，系统"认为"字节应按 GBK 解读 ⚠
第3层: 终端/Shell        → 用什么编码渲染输出
```

**核心原则**：同样的字节，解码方式不同，结果就不同。

```
字节 E4 B8 AD → UTF-8 解码 → "中"  ✓
字节 E4 B8 AD → GBK 解码  → "涓"  ✗
```

### 7.2 三种 Shell 的编码行为

| 操作 | cmd.exe | PowerShell | Git Bash |
|------|---------|------------|----------|
| `git log` 直接显示 | GBK 解码 → 乱码 | GBK 解码 → 乱码 | 设 UTF-8 locale → 正常 |
| `git log > file` | 原始字节 → **UTF-8** ✓ | PowerShell 接管 → **UTF-16 LE** ✗ | 原始字节 → UTF-8 ✓ |
| `\| Out-File file` | 不支持 | **UTF-16 LE** ✗ | 不支持 |

### 7.3 判断提交消息是否真的损坏

```bash
# 在 Git Bash 中查看原始字节
git log -1 --format=%B | xxd | head -3
```

如果字节是 `E6 96 B0 E5 A2 9E` 这样的连续三字节组合，就是正确的 UTF-8 中文。如果看到 `D6 D0` 这样的两字节组合，才是 GBK 存储——需要修复提交历史。

### 7.4 正确查看提交信息

**方案一：绕过 PowerShell 管道（推荐）**

```powershell
cmd /c "git log --format=%B -5 > commits.txt" && notepad commits.txt
```

原理：`cmd /c` 把重定向委托给 `cmd.exe`，绕过了 PowerShell 的管道编码转换。

**方案二：创建 PowerShell 快捷命令**

在 `$PROFILE` 中添加：

```powershell
function gitlog { cmd /c "git log --format=%B -5 > commits.txt" ; notepad commits.txt }
```

之后直接输入 `gitlog` 即可。

**方案三：Git Bash 中设置 UTF-8 locale**

```bash
export LANG=zh_CN.UTF-8
git log -5
```

### 7.5 避免提交时产生乱码

```bash
# 正确做法：写入 UTF-8 文件，再用 -F 读取
printf '%s\n' '提交信息' > .git/commit-msg.txt
git commit -F .git/commit-msg.txt

# 危险做法：-m 直接写中文
git commit -m "中文提交信息"
```

`-m` 在 Windows GBK locale 下，shell 传入的字节可能是 GBK 编码，Git 会原样存入对象库——导致提交消息确实以 GBK 存储。
