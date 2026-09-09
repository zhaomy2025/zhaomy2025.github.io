# Git SSH密钥管理：为不同平台配置多个SSH密钥

## 为每个平台生成不同的SSH密钥
```bash
# 基本语法
ssh-keygen -t rsa -C "email" -f key_name

# 生成github的密钥
ssh-keygen -t rsa -C "youremail" -f ~/.ssh/id_rsa.github
# 生成gitee的密钥
ssh-keygen -t rsa -C "youremail" -f ~/.ssh/id_rsa.gitee
# 同一平台也可以生成不同的密钥，通过key_name指定密钥文件名
ssh-keygen -t rsa -C "youremail" -f ~/.ssh/id_rsa.[仓库名]

```
::: tip
+ 密钥类型支持 `rsa`、`ed25519`
+ `key_name` 为私钥文件名，不指定时默认名为 id_rsa，可随意指定，并不与平台相关，但推荐使用平台名/仓库名作为文件名
+ 公钥文件名为 `key_name.pub`，需要将公钥内容添加到平台的 SSH Key 设置中
+ `~/.ssh/`是Linux/macOS 风格的路径写法，Windows 的 CMD 不支持，如果你安装了 Git for Windows，可以在 Git Bash 中运行
:::

## 创建配置文件
::: tip
SSH Config 文件 (~/.ssh/config) 用于自定义 SSH 客户端的行为，例如：
+ 管理多个 SSH Key（如不同 GitHub 账号）
+ 配置服务器别名（简化连接命令）
+ 设置代理、端口转发等高级选项
本文只涉及管理多个 SSH Key 的配置，其他选项请参考 [SSH Config 文档](https://man.openbsd.org/ssh_config)

:::

在 _**~/.ssh/**_ 目录下创建一个 _**config**_ 文件，用于配置不同平台的 SSH 连接信息。
::: code-tabs
@tab 文件格式
```
Host 别名                  # 自定义主机名（如 github-personal）
HostName 真实主机名         # 实际服务器地址（如 github.com）
User 用户名                # 登录用户名（如 git）
IdentityFile 私钥路径      # 指定 SSH 私钥（如 ~/.ssh/id_ed25519_personal）
... 其他选项

# 使用方式：使用 Host 来代替 HostName
# git clone git@github-personal:username/repo.git  # 使用个人 Key
# git clone git@github-work:company/repo.git      # 使用公司 Key
```
@tab 为不同平台配置不同 SSH Key
```
# GitHub 账号
Host github.com
HostName github.com
User git
IdentityFile ~/.ssh/id_rsa.github

# Gitee 账号
Host gitee.com
HostName gitee.com
User git
IdentityFile ~/.ssh/id_rsa.gitee
```
@tab 为不同 GitHub 账号配置不同 SSH Key
```
# 个人 GitHub 账号
# git clone git@github-personal:username/repo.git  # 使用个人 Key
Host github-personal
HostName github.com
User git
IdentityFile ~/.ssh/id_rsa.github

# 公司 GitHub 账号
# git clone git@github-work:company/repo.git      # 使用公司 Key
Host github-work
HostName github.com
User git
IdentityFile ~/.ssh/id_rsa.github_work
```
:::

测试连接：
``` bash
ssh -vT git@github-personal
```
出现以下提示，说明配置成功
```
Authenticated to github.com ([20.205.243.166]:22) using "publickey".
Hi zhaomy2025! You've successfully authenticated, but GitHub does not provide shell access.
```

## 添加 SSH 密钥到平台
分别将生成的公钥添加到 GitHub 和 Gitee 的 SSH Key 设置中：

+ GitHub: https://github.com/settings/keys
+ Gitee: https://gitee.com/profile/sshkeys

