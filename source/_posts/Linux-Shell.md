---
title: Linux Shell
date: 2025-03-05 10:59:51
tags:
---
# 简介
在 Linux Shell 中，变量、条件判断、循环等概念与编程语言中的语法非常相似。Shell 脚本作为一种强大的自动化工具，不仅能够执行系统命令，还可以通过变量、条件判断和循环等编程结构实现复杂的逻辑控制。本文将详细介绍 Linux Shell 中的这些核心概念，帮助你更好地理解和编写高效的 Shell 脚本。

1. 在 Shell 中，指令的下达和编辑是日常操作的基础。通过组合键，你可以快速编辑命令行，提高工作效率。
2. 变量是 Shell 脚本中的重要组成部分，用于存储和操作数据。Shell 提供了多种变量设置方式，灵活应对不同的场景。
3. 环境变量是系统或用户定义的变量，用于配置 Shell 的行为和运行环境。通过 export 命令，可以将变量设置为环境变量，使其在子进程中可用。
4. `test` 指令用于条件判断，支持文件测试、字符串比较、数值比较等多种操作，帮助你在脚本中实现复杂的逻辑控制。
5. Shell 中的括号有多种用途，包括数组赋值、子 Shell 执行、命令替换和算术运算等。理解括号的不同用法可以让你更灵活地编写脚本。
6. `seq` 命令用于生成数字序列，支持指定格式、分隔符和宽度等选项，适用于批量生成数字或文件名。
7. 循环结构允许你重复执行一系列命令，适用于批量处理文件和自动化任务。

通过掌握这些核心概念，你将能够编写出功能强大且高效的 Shell 脚本，提升系统管理和自动化任务的效率。

# 指令下达与快速编辑按钮
## 指令下达[Enter]
## 快速编辑
| 组合键 | 功能 |
| --- | --- |
| ctrl + u | 向前删除指令串 |
| ctrl + k | 向后删除指令串 |
| ctrl + a | 移动到整个指令串最前面 |
| ctrl + e | 移动到整个指令串最后面 |

# 变量
## 设置普通变量
| 变量设置方式 | str 没有设置 | str 为空字串 | str 已设置为非空字串 |
| --- | --- | --- | --- |
| `var=${str-expr}` | `var=expr` | `var=` | `var=$str` |
| `var=${str:-expr}` | `var=expr` | `var=expr` | `var=$str` |
| `var=${str+expr}` | `var=` | `var=expr` | `var=expr` |
| `var=${str:+expr}` | `var=` | `var=` | `var=expr` |
| `var=${str=expr}` | `str=expr`<br/>`var=expr` | `str` 不变<br/>`var=` | `str` 不变<br/>`var=$str` |
| `var=${str:=expr}` | `str=expr`<br/>`var=expr` | `str=expr`<br/>`var=expr` | `str` 不变<br/>`var=$str` |
| `var=${str?expr}` | `expr` 输出至 `stderr` | `var=` | `var=$str` |
| `var=${str:?expr}` | `expr` 输出至 `stderr` | `expr` 输出至 `stderr` | `var=$str` |

```
等号两边不能直接接空白字符
变量内容若用空白字符可使用双引号或单引号，或者使用转移字符
双引号内的特殊字符可保持原本的特性
单引号内的特殊字符仅为一般文本
在一串指令的执行中，还需借由其它额外的指令所提供的信息是可使用反单引号或$()
-若变量未被设置，则使用默认值，若已设置，则使用原值
+若变量未被设置，则使用原值（未被设置），若已设置，则使用默认值
:变量为空字符串时，规则同变量未被设置
```

## export设置环境变量
若变量需要在其他子程序执行，则需要以export来使变量变成环境变量

## 取消设置 unset
## 取用
### $变量
### ${变量}

```plain
echo $PATH
```

### 执行指令，结果作为外部指令输入参数 $()
### 获取变量长度
```git
echo ${#PWD}
```

### 字符串截取
| 格式 | 说明 |
| --- | --- |
| `${string:start:length}` | 从 string 字符串的左边第 start 个字符开始，向右截取 length 个字符。 |
| `${string:start}` | 从 string 字符串的左边第 start 个字符开始截取，直到最后。 |
| `${string:0-start:length}` | 从 string 字符串的右边第 start 个字符开始，向右截取 length 个字符。 |
| `${string:0-start}` | 从 string 字符串的右边第 start 个字符开始截取，直到最后。 |
| `${string#*chars}` | 从 string 字符串第一次出现 *chars 的位置开始，截取 *chars 右边的所有字符。 |
| `${string##*chars}` | 从 string 字符串最后一次出现 *chars 的位置开始，截取 *chars 右边的所有字符。 |
| `${string%*chars}` | 从 string 字符串第一次出现 *chars 的位置开始，截取 *chars 左边的所有字符。 |
| `${string%%*chars}` | 从 string 字符串最后一次出现 *chars 的位置开始，截取 *chars 左边的所有字符。 |

## 修改
### 删除
`${variable#pattern}`: 删除开头到第一个`pattern`的内容

`${variable##pattern}`: 删除开头到最后一个`pattern`的内容

`${variable%pattern}`: 从结尾删除最短匹配的`pattern`

`${variable%%pattern}`: 从结尾删除最长匹配的`pattern`

#### 实际应用场景
删除文件扩展名

```yaml
filename="example.tar.gz"
name=${filename%%.*}
echo $name # example
```

### 替换
`/old_str/new_str` 替换第一个

`//old_str/new_str` 替换最后一个

# 环境变量
export > env

## export
## env
## 环境变量配置文件
### login shell
1. /etc/profile：这是系统整体的设置，你最好不要修改这个文件；

2. ~/.bash_profile 或 ~/.bash_login 或 ~/.profile：属于使用者个人设置，你要改自己的数据，就写入这里！

### 可执行文件路径
将自己创建的可执行文件放置到~/bin/ 目录，就可以直接执行该可执行文件而不需要使用绝对/相对路径来执行该文件

### source
### non-login shell
~/.bashrc 别名通常定义在该文件中

# 括号
## 小括号
### ()
1. 数组赋值
2. 子shell
3. 命令集结果重定向

```bash
(echo "a";echo "b";) | awk '{print NR,$0}'
```

### $()
执行命令

### $(()) 执行计算
```bash
echo $((13%3))
```

输入两个变量，输出相乘的结果

```bash
echo -e "输入两个变量，输出相乘的结果"
read -p "first number:" firstnum
read -p "second number:" secondnum
total = $((${firstnum}*${secondnum}))
echo -e "${total}"
```

## 中括号
### []
1. `[`等同于test, `]`用于关闭条件判断。
2. 用于正则表达式中，描述一个匹配的字符范围。
3. 数组编号

```
如果要在 bash 的语法当中使用中括号作为 shell 的判断式，必须要注意中括号的两端需要有空白字符来分隔
中括号内的变量使用`${var}`格式，最好都以双引号括起来
中括号内的变量会被翻译为原始值再进行比较，若有空格会被翻译为多个值
中括号内的常数，最好都以单或双引号括起来
```

### [[]]
&&、||、<、>操作符可以出现在[[]]结构中

## 大括号
### ${var}
当变量名和后面的内容都是变量命名所允许的内容时候这时候直接用$var是不行的得用{}把变量名括起来

### `var=${str-expr}`
如果 `str` 未设置（未定义），则 `var` 的值为 `expr`；否则，`var` 的值为 `str` 的值。

### `var=${str:-expr}`
如果 `str` 未设置或为空字符串，则 `var` 的值为 `expr`；否则，`var` 的值为 `str` 的值。

### `var=${str+expr}`
如果 `str` 已设置（无论是否为空），则 `var` 的值为 `expr`；否则，`var` 为空。

### `var=${str:+expr}`
如果 `str` 已设置且不为空，则 `var` 的值为 `expr`；否则，`var` 为空。

### `var=${str=expr}`
如果 `str` 未设置，则 `str` 的值为 `expr`，且 `var` 的值为 `expr`；否则，`var` 的值为 `str` 的值。

### `var=${str:=expr}`
如果 `str` 未设置或为空字符串，则 `str` 的值为 `expr`，且 `var` 的值为 `expr`；否则，`var` 的值为 `str` 的值。

### `var=${str?expr}`
如果 `str` 未设置，则将 `expr` 输出到标准错误（stderr），并终止脚本；否则，`var` 的值为 `str` 的值。

### `var=${str:?expr}`
如果 `str` 未设置或为空字符串，则将 `expr` 输出到标准错误（stderr），并终止脚本；否则，`var` 的值为 `str` 的值。

# test
| 文件类型判断 | -e | 文件是否存在 |
| --- | --- | --- |
| | -f | 文件是否存在且为普通文件 |
| | -d |  文件是否存在且为目录 |
| | -b | 检查文件是否是块设备文件。 |
| | -c | 检查文件是否是字符设备文件。 |
| | -S | 检查文件是否是套接字文件。 |
| | -p | 检查文件是否是命名管道（FIFO） |
| | -L | 文件是否存在且为符号链接 |
| 文件的权限侦测 | -r | 文件是否存在且可读 |
| | -w | 文件是否存在且可写 |
| | -x | 文件是否存在且可执行 |
| | -u | 检查文件是否设置了Set User ID（SUID） |
| | -g | 检查文件是否设置了Set Group ID（SGID） |
| | -k | 检查文件是否设置了粘滞位（Sticky Bit） |
| | -s | 文件是否存在且大小大于 0 |
| 两个文件之间的比较 | -nt | 检查文件1是否比文件2更新 |
| | -ot | 检查文件1是否比文件2更旧 |
| | -ef | 检查文件1和文件2是否是同一个文件（相同的 inode）判断hard link |
| 两个整数之间的判定 | -eq | 等于 |
| | -ne | 不等于 |
| | -gt | 大于 |
| | -lt | 小于 |
| | -ge | 大于等于 |
| | -le | 小于等于 |
| 判定字符串的数据 | -z | 字符串长度是否为 0 |
| | -n | 字符串长度是否不为 0 |
| | = | 字符串1 是否等于 字符串2 |
| | != | 字符串1 是否不等于 字符串2 |
| 条件组合/逻辑操作 | ! | 逻辑非 |
|  | -a | 逻辑与 |
|  | -o | 逻辑或 |

## 若目录不存在则创建
```bash
[! -d "$basedir"] && mkdir $basedir
```

## 判定字符串是否为空
```bash
if [ -n "$a" ]; then
else
fi
```

# seq
```
seq [option] [start] [increment] end
option:
-f 指定格式
-s 指定分隔符
-w 宽度一致，不能与-f一起用
```

```bash
# 指定数字宽度，不足用空格补足
seq -f "%3g" 98 101 
# 指定数字宽度，不足用0补足
seq -f "%03g" 98 101 
seq -s ":::" -f "%03g" 98 101
```

# 循环
```bash
for file in *.sql;
do mysql -h localhost -uroot -p park < $file;done
```

```bash
find $PWD -type f | (while read args;do (md5sum $args);done)
```

# 脚本调用
在运行shell脚本时候，有三个命令来实现调用外部脚本：exec、source、fork

| 命令 | 产生新进程 | 继承环境变量 | 是否保留环境变量和声明变量 |
| --- | --- | --- | --- |
| exec | √ | √ | 不保留（原主shell剩下的内容不会执行） |
| source | × | √ | 保留 |
| fork | √ | √ | 保留 |

## exec
使用exec来调用脚本，被执行的脚本会继承当前shell的环境变量。exec产生了新的进程，会把主shell的进程资源占用并替换脚本内容，继承原主shell的PID号，原主shell剩下的内容不会执行。

## source
使用source调用外部脚本，不会产生新的进程，继承当前shell环境变量，而且被调用的脚本运行结束后，它拥有的环境变量和声明变量会被当前shell保留，类似将调用脚本的内容复制过来直接执行。执行完毕后原主shell继续运行。

## fork
直接运行脚本，会以当前shell为父进程，产生新的进程，并且继承主脚本的环境变量和声明变量。执行完毕后，主脚本不会保留其环境变量和声明变量。

## 总结
这样来看fork最灵活，source次之，exec最诡异。