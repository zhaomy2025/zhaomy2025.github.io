---
title: Linux常用命令
date: 2025-03-05 14:47:35
tags:
---
Linux 是一个功能强大且灵活的操作系统，广泛应用于服务器、开发环境和嵌入式设备中。掌握常用的 Linux 命令是高效管理和操作系统的基础。本文整理了一些在日常工作中最常用的 Linux 命令，涵盖了网络、进程管理、服务控制、软件安装、开关机操作、别名设置等多个方面。无论你是初学者还是有一定经验的用户，这些命令都能帮助你更高效地完成系统管理和开发任务。

# 网络
```bash
netstat -a # 显示所有连接和监听端口
netstat -ntlp # 显示TCP连接及其监听端口
```

# 进程
## 查看进程ps
```bash
ps -aux # 显示所有进程的详细信息
ps -ef # 显示所有进程的完整信息
```

## 中止进程kill
### 从容关闭
```bash
kill -QUIT PID # 优雅地终止进程
```

### 快速停止
```bash
kill -TERM PID # 发送终止信号
kill -INT PID # 发送中断信号
```

### 强制停止
```bash
kill -9 PID # 强制终止进程
```

# 服务
## 服务管理
```bash
systemctl # 管理系统服务
```

## 启动/关闭服务
```bash
/etc/init.d/xxx start/stop/restart # 启动/停止/重启服务
/etc/init.d/network stop # 停止网络服务
```

## 开机启用或关闭
```bash
chkconfig <service-name> on/off # 设置服务开机启动或关闭
chkconfig smb on # 启用SMB服务
chkconfig nmb on # 启用NMB服务
```

## 查看apache运行状态 
```bash
service httpd status
```

# 安装软件
## Red Hat版本 rpm
```
rpm [参数]
-a：查询所有套件
-c：只列出组态配置文件
-l：显示套件的文件列表
-q：使用询问模式
```

```bash
rpm -qa # 查询所有已安装的软件包
rpm -qc # 查找配置文件
rpm -ql samba | grep '/etc' # 查找Samba的配置文件
```

## Ubuntu版本 apt-get
```bash
sudo apt-get update # 更新软件包列表
sudo apt-get install -y [软件包名称]  # 安装软件包
```

## CentOS版本 yum
```
yum -y update 更新
yum search [软件包名称]
sudo yum install -y [软件包名称]
yum remove [软件包名称]
```

```bash
yum search samba # 搜索Samba软件包
sudo yum install -y samba # 安装Samba软件包
```

## 定时更新
```bash
vim /etc/crontab
15 2 * * * root /usr/bin/yum -y update
```

# 开关机
## 关机 shutdown/poweroff/halt
```bash
shutdown # 1分钟后关机
shutdown -r # 重启
shutdown -h # 立即关机
shutdown -c # 取消shutdown命令
poweroff 
halt
```

## 重启reboot
```bash
reboot # 重启
```

# alias别名
## 查看别名
```bash
alias	#列出当前 Shell 会话中定义的所有别名
alias [别名] #查看某个特定别名
```

## 设置临时别名&常用别名
通过`alias`命令直接设置的别名是临时别名，它们仅在当前 Shell 会话中有效。当关闭终端或退出当前 Shell 会话时，这些别名将丢失。

```bash
alias cp='cp -i'
alias l='ls -l'
alias l.='ls -d .* --color=auto'
alias la='ls -A'
alias ll='ls -l --color=auto'
alias ls='ls --color=auto'
alias mv='mv -i'
alias rm='rm -i'
alias which='alias | /usr/bin/which --tty-only --read-alias --show-dot --show-ti
alias grep='grep --color'
alias yum='yum -y'
alias readlink='readlink -f'
alias tree='tree -C'
```

## 永久设置别名
如果你想永久设置别名，可以将别名定义添加到 Shell 的配置文件中。例如，在 Bash 中：

1. 打开 `~/.bashrc` 文件

```bash
vi ~/.bashrc
```

2. 添加别名定义

```bash
alias ll='ls -l'
alias la='ls -A'
```

3. 使更改生效

```bash
source ~/.bashrc
```

## 删除别名
```bash
unalias  [别名] #删除某个特定别名
```

## 查看别名定义的文件
别名通常定义在 Shell 的配置文件中，具体文件取决于你使用的 Shell：

+ Bash：`~/.bashrc` 或 `~/.bash_profile`
+ Zsh：`~/.zshrc`
+ Fish：`~/.config/fish/config.fish`

你可以使用 `cat` 或 `grep` 命令查看这些文件中的别名定义。

```bash
cat ~/.bashrc | grep alias
```

# 数据同步写入磁盘
虽然目前的 shutdown/reboot/halt 等等指令均已经在关机前进行了 sync 这个工具的调用，不过，多做几次总是比较放心点

一般帐号使用者所更新的硬盘数据就仅有自己的数据，不像root可以更新整个系统中的数据了

```bash
sync  
```
