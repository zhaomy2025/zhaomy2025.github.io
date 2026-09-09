---
title: Python依赖管理
date: 2025-07-31T08:01:02.537Z
category:
  - python
  - requirements
tags:
  - python
  - requirements
---

# Python依赖管理
[[toc]]

## 虚拟环境管理

在Python项目中，使用虚拟环境可以避免依赖冲突，以下是操作方法：

1. 创建虚拟环境
```bash
# 在项目目录下创建venv文件夹
python -m venv venv
```

参数说明：
- `--system-site-packages`：继承系统已安装的包	`python -m venv --system-site-packages venv`
- `--clear`：清空目标目录后创建	`python -m venv --clear venv`
- `--upgrade`：升级核心工具(pip/setuptools)	`python -m venv --upgrade venv`
- `--prompt PROMPT`：设置激活后的提示前缀 `python -m venv venv --prompt "myproject"`

2. 激活虚拟环境
```bash
# Windows命令提示符
venv\Scripts\activate.bat

# Windows PowerShell
venv\Scripts\Activate.ps1

# Linux
source venv/bin/activate
```

激活后终端会显示`(venv)`前缀，表示当前处于虚拟环境中。

3. 退出虚拟环境
```bash
deactivate
```

## 依赖包管理

使用pip工具管理Python包：

1. 安装依赖
```bash
# 安装指定版本
pip install requests==2.31.0

# 安装最新版本
pip install requests

# 从requirements.txt安装
pip install -r requirements.txt
```

2. 查看已安装依赖
```bash
# 简洁列表
pip list

# 详细信息（包括安装路径）
pip show requests
```

3. 更新依赖
```bash
# 更新指定包
pip install --upgrade requests

# 更新pip自身
python -m pip install --upgrade pip
```

4. 卸载依赖
```bash
pip uninstall requests
```

## requirements.txt管理

这是项目依赖的清单文件，记录所有依赖包及其版本：

1. 生成requirements.txt
```bash
# 导出当前环境所有依赖，包括未使用的
pip freeze > requirements.txt

# 只导出项目实际使用的依赖（推荐，命令不存在）
pipreqs . --encoding=utf8
```

2. 执行以下命令即可安装依赖：
```bash
pip install -r requirements.txt
```

## 高级依赖管理工具

对于复杂项目，可以考虑使用以下工具：

1. pipenv：集成虚拟环境和依赖管理
```bash
pip install pipenv
pipenv install requests
pipenv shell  # 激活虚拟环境
```

2. poetry：现代Python依赖管理和打包工具
```bash
pip install poetry
poetry new myproject
poetry add requests
poetry shell  # 激活虚拟环境
```

## 五、在项目中应用

```
# 1. 创建项目目录
mkdir myproject && cd myproject

# 2. 创建虚拟环境
python -m venv venv --prompt "myproject"

# 3. 激活环境
source venv/bin/activate  # Linux/Mac
# 或 venv\Scripts\activate  # Windows

# 4. 安装项目依赖（确保requirements.txt存在）
pip install -r requirements.txt

# 5. 开发完成后停用
deactivate
```
        