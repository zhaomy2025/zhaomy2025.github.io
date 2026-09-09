# `functools.wraps` 详解
`functools.wraps` 是 Python 标准库中的一个装饰器，主要用于 保留被装饰函数（原函数）的元信息，防止装饰器导致函数名 (`__name__`)、文档字符串 (`__doc__`)、注解 (`__annotations__`) 等属性丢失或被覆盖。

## 为什么需要 `wraps`？

在 Python 中，装饰器通常会返回一个新的函数（如 `wrapper`），这会导致原函数的元信息丢失：

```python
def my_decorator(func):
    def wrapper(*args, kwargs):
        """Wrapper docstring."""
        print("Decorator is running!")
        return func(*args, kwargs)
    return wrapper

@my_decorator
def greet(name):
    """Greet someone by name."""
    print(f"Hello, {name}!")

print(greet.__name__)  # 输出 'wrapper'（而不是 'greet'）
print(greet.__doc__)   # 输出 'Wrapper docstring.'（而不是 'Greet someone by name.'）

```

问题：
- `greet.__name__` 变成了 `wrapper`（而不是 `greet`）。
- `greet.__doc__` 变成了 `wrapper` 的文档字符串（而不是原函数的文档字符串）。

## `wraps` 的作用

`wraps` 将原函数的元信息复制到装饰器返回的函数上，使其看起来像原函数：

```python
from functools import wraps

def my_decorator(func):
    @wraps(func)  # 关键：复制 func 的元信息到 wrapper
    def wrapper(*args, kwargs):
        """Wrapper docstring."""
        print("Decorator is running!")
        return func(*args, kwargs)
    return wrapper

@my_decorator
def greet(name):
    """Greet someone by name."""
    print(f"Hello, {name}!")

print(greet.__name__)  # 输出 'greet'（正确保留）
print(greet.__doc__)   # 输出 'Greet someone by name.'（正确保留）

```

关键点：
- `@wraps(func)` 将 `func` 的元信息（如 `__name__`、`__doc__`、`__module__` 等）复制到 `wrapper` 上。
- 这样，被装饰的函数 `greet` 仍然保留其原始名称、文档字符串等。

## `wraps` 保留哪些属性？

`wraps` 默认会复制以下属性：
| 属性 | 说明 |
| --- | --- |
| `__name__` | 函数名 |
| `__doc__` | 文档字符串 |
| `__module__` | 所属模块 |
| `__annotations__` | 类型注解（Python 3+） |
| `__dict__` | 其他自定义属性 |

手动查看 `wraps` 复制的属性：

```python
from functools import wraps

def my_decorator(func):
    @wraps(func)
    def wrapper(*args, kwargs):
        return func(*args, kwargs)
    return wrapper

@my_decorator
def foo():
    pass

print(foo.__wrapped__)  # 获取原始函数（Python 3.3+）

```

输出：

```

<function foo at 0x7f8b1c3b5d30>

```

`__wrapped__` 是 `wraps` 自动添加的，指向原函数（可用于调试或绕过装饰器）。

## 如果不使用 `wraps` 会怎样？

如果不使用 `wraps`，可能会导致：
1. 调试困难：日志或报错信息显示的是 `wrapper` 而非原函数名。
2. 文档工具失效：如 `help(greet)` 显示的是 `wrapper` 的文档，而非 `greet` 的文档。
3. 序列化问题：某些序列化工具（如 `pickle`）依赖 `__name__` 和 `__module__`，可能导致错误。

## 进阶用法

### 自定义复制的属性

`wraps` 可以指定要复制的属性：

```python
from functools import wraps

def my_decorator(func):
    @wraps(func, assigned=('__name__', '__doc__'))  # 仅复制名称和文档
    def wrapper(*args, kwargs):
        return func(*args, kwargs)
    return wrapper

```

### 保留原函数的签名（`inspect.signature`）

`wraps` 还会让 `inspect.signature` 正确返回原函数的参数信息：

```python
import inspect
from functools import wraps

def my_decorator(func):
    @wraps(func)
    def wrapper(*args, kwargs):
        return func(*args, kwargs)
    return wrapper

@my_decorator
def greet(name: str, age: int = 18) -> str:
    """Greet someone."""
    return f"Hello, {name}!"

print(inspect.signature(greet))  # 输出: (name: str, age: int = 18) -> str

```

如果不加 `wraps`，`inspect.signature(greet)` 会返回 `(*args, kwargs)`，丢失参数信息。

## 总结

| 场景 | 解决方案 | 作用 |
| --- | --- | --- |
| 防止装饰器覆盖元信息 | `@wraps(func)` | 保留 `__name__`、`__doc__` 等 |
| 调试和文档 | 使用 `wraps` | 让 `help()` 和日志显示正确的函数信息 |
| 序列化和反射 | 必须用 `wraps` | 确保 `pickle`、`inspect` 等工具正常工作 |

最佳实践：
- 始终在装饰器内部使用 `@wraps(func)`，除非有特殊需求。
- 如果需要自定义复制的属性，可以通过 `assigned` 参数调整。

这样，你的装饰器既能增强函数功能，又能保持代码的清晰和可维护性！ 🚀