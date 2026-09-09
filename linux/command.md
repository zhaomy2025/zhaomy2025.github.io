---
title: 常用命令
date: 2025-07-10T01:51:23.722Z
category:
  - linux
  - command
tags:
  - linux
  - bash
  - command
---

# 常用命令
[[toc]]

## 文件内容

### grep 查找文件内容

```bash
grep "search_str" file_name [option]
```
参数说明：
- -A, --after-context=NUM：打印匹配行之后的N行
- -B, --before-context=NUM：打印匹配行之前的N行
- -C, --context=NUM：打印匹配行前后各N行
- -H, --with-filename：显示文件名
- -h, --no-filename：不显示文件名  
- -i, --ignore-case：忽略字符大小写
- -l, --files-with-matches：只显示匹配的文件名
- -L, --files-without-match：只显示不匹配的文件名  
- -n, --line-number：显示行号
- -r：递归匹配当前目录下的所有文件
  
- --color=auto：显示颜色
- -e PATTERN, --regexp=PATTERN：指定搜索的模式  
- --exclude=PATTERN：排除匹配的文件名
- --exclude-dir=PATTERN：排除匹配的目录名  
- -f FILE, --file=FILE：从文件中读取搜索模式  
- -F, --fixed-strings：将模式视为固定字符串（禁用正则）
- --include=PATTERN：只搜索匹配的文件名
- -o, --only-matching：只显示匹配到的部分
- -P, --perl-regexp：使用Perl正则表达式  
- -R, --dereference-recursive：递归搜索，并跟随符号链接（比 -r 更强） 
- -v, --invert-match：反向显示,显示未匹配到的行
- -E, --extended-regexp：支持使用扩展的正则表达式
- -q, --quiet, --silent：静默模式,即不输出任何信息
- -w, --word-regexp：整行匹配整个单词
- -c, --count：统计匹配到的行数

**示例：**
```bash
# 递归查找当前目录下文件，显示行号
grep 'search_str' /home/admin -r -n 
# 指定文件后缀
grep 'KeyWord' /home/admin -r -n --include *.{vm,java} 
# 反匹配
grep 'KeyWord' /home/admin -r -n --exclude *.{vm,java} 
# 统计个数 
grep 'KeyWord' fileName -c 
```

## 压缩包

### 保留源文件解压

```bash
gunzip -c zip_file > target_file
gunzip -k zip_file
```
- -c 保留源文件，但会将解压缩后的文件内容输出到标准输出，因此需要添加 > target
- -k 保留源文件，解压后的文件会放到同级目录下
- 如需自定义文件名，使用-c，否则推荐使用-k

### zcat 查看压缩文件内容
```bash
zcat zip_file | grep "search_string" > target_file
```

### zgrep 查找压缩文件内容

参数说明参考grep命令，仅列出与grep命令不同的参数。
- --gzexe

```bash
zgrep  "search_str" zip_file

# 只显示文件名
zgrep -l "search_str" zip_file > a.log

# -c 统计匹配的行数
zgrep -c "search_str" zip_file > a.log

# -H 显示文件名，-n 显示匹配的行号
zgrep -H -n "异常数据订阅发邮件" zip_file

# 同时查询日志文件和压缩文件
# ; 不管前一个任务是否执行成功，都会执行下一条命令
grep -H -n "search_str" log_file ; zgrep -H -n "search_str" zip_file
```

## 网络

```bash
netstat -a # 显示所有连接和监听端口
netstat -ntlp # 显示TCP连接及其监听端口
```

## 进程

### 查看进程 ps

```bash
ps -aux # 显示所有进程的详细信息
ps -ef # 显示所有进程的完整信息
```

### 中止进程 kill

从容关闭：
```bash
kill -QUIT PID # 优雅地终止进程
```

快速停止：
```bash
kill -TERM PID # 发送终止信号
kill -INT PID # 发送中断信号
```

强制停止：
```bash
kill -9 PID # 强制终止进程
```

## 服务

### 服务管理 systemctl

```bash
systemctl # 管理系统服务
```

### 启动/关闭服务

```bash
/etc/init.d/xxx start/stop/restart # 启动/停止/重启服务
/etc/init.d/network stop # 停止网络服务
```

### 开机启用或关闭

```bash
chkconfig <service-name> on/off # 设置服务开机启动或关闭
chkconfig smb on # 启用SMB服务
chkconfig nmb on # 启用NMB服务
```

### 查看 apache 运行状态

```bash
service httpd status
```

## 安装软件

### Red Hat 版本 rpm

```bash
rpm -qa # 查询所有已安装的软件包
rpm -qc # 查找配置文件
rpm -ql samba | grep '/etc' # 查找Samba的配置文件
```

### Ubuntu 版本 apt-get

```bash
sudo apt-get update # 更新软件包列表
sudo apt-get install -y [软件包名称]  # 安装软件包
```

### CentOS 版本 yum

```bash
yum -y update # 更新
yum search [软件包名称]
sudo yum install -y [软件包名称]
yum remove [软件包名称]
```

### 定时更新

```bash
vim /etc/crontab
15 2 * * * root /usr/bin/yum -y update
```

## 开关机

### 关机 shutdown / poweroff / halt

```bash
shutdown # 1分钟后关机
shutdown -r # 重启
shutdown -h # 立即关机
shutdown -c # 取消shutdown命令
poweroff 
halt
```

### 重启 reboot

```bash
reboot # 重启
```

## alias 别名

### 查看别名

```bash
alias	# 列出当前 Shell 会话中定义的所有别名
alias [别名] # 查看某个特定别名
```

### 临时别名 & 常用别名

通过 `alias` 命令直接设置的别名是临时别名，仅在当前 Shell 会话中有效。当关闭终端或退出当前 Shell 会话时，这些别名将丢失。

```bash
alias cp='cp -i'
alias l='ls -l'
alias l.='ls -d .* --color=auto'
alias la='ls -A'
alias ll='ls -l --color=auto'
alias ls='ls --color=auto'
alias mv='mv -i'
alias rm='rm -i'
alias grep='grep --color'
alias yum='yum -y'
alias readlink='readlink -f'
alias tree='tree -C'
```

### 永久设置别名

将别名定义添加到 Shell 的配置文件中：

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

### 删除别名

```bash
unalias [别名] # 删除某个特定别名
```

### 查看别名定义的文件

别名通常定义在 Shell 的配置文件中，具体文件取决于你使用的 Shell：

- Bash：`~/.bashrc` 或 `~/.bash_profile`
- Zsh：`~/.zshrc`
- Fish：`~/.config/fish/config.fish`

可以使用 `cat` 或 `grep` 命令查看这些文件中的别名定义：

```bash
cat ~/.bashrc | grep alias
```

## 数据同步写入磁盘

虽然目前的 shutdown/reboot/halt 等指令均已经在关机前进行了 sync 这个工具的调用，不过多做几次总是比较放心点。

一般帐号使用者所更新的硬盘数据就仅有自己的数据，不像 root 可以更新整个系统中的数据了。

```bash
sync
```