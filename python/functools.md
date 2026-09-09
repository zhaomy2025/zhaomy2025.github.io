# functools 模块

`functools` 是 Python 标准库中用于高阶函数（操作或返回其他函数的函数）的模块，提供了一些常用的函数式编程工具，用于增强或修改函数行为。以下是 `functools` 模块的核心函数及其用法详解：

### `functools.partial`：部分函数（参数绑定）

作用：固定函数的某些参数，生成一个新函数，简化调用。  
示例：

```python
from functools import partial

def power(base, exp):
    return base  exp

# 固定 base=2，生成平方函数
square = partial(power, exp=2)
print(square(3))  # 输出 9 (即 3^2)

```
适用场景：减少重复参数传递，适配接口。

### `functools.reduce`：累积计算

作用：对可迭代对象中的元素依次应用二元函数，累积结果。  
示例：

```python
from functools import reduce

nums = [1, 2, 3, 4]
sum_all = reduce(lambda x, y: x + y, nums)
print(sum_all)  # 输出 10 (1+2+3+4)

```
注意：Python 3 中 `reduce` 被移到 `functools` 中，推荐优先使用内置的 `sum()`、`max()` 等。

### `functools.lru_cache`：缓存装饰器

作用：缓存函数结果，避免重复计算（LRU 最近最少使用策略）。  
示例：

```python
from functools import lru_cache

@lru_cache(maxsize=128)  # 缓存大小
def fibonacci(n):
    if n < 2:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

print(fibonacci(30))  # 快速计算，避免递归重复

```
参数：
- `maxsize`：缓存的最大条目数（设为 `None` 表示无限制）。
- `typed`：若为 `True`，不同参数类型（如 `3` 和 `3.0`）会分开缓存。

### `functools.wraps`：保留原函数元信息

作用：修复装饰器导致的函数元信息（如 `__name__`、`__doc__`）丢失问题。  
示例：

```python
from functools import wraps

def my_decorator(f):
    @wraps(f)  # 保留 f 的元信息
    def wrapper(*args, kwargs):
        print("Calling decorated function")
        return f(*args, kwargs)
    return wrapper

@my_decorator
def example():
    """Example docstring."""
    pass

print(example.__name__)  # 输出 "example"（而非 "wrapper"）
print(example.__doc__)   # 输出 "Example docstring."

```

### `functools.cached_property`：缓存属性

作用：将方法结果缓存为实例属性（Python 3.8+）。  
示例：

```python
from functools import cached_property

class Data:
    def __init__(self, data):
        self.data = data

    @cached_property
    def processed_data(self):
        print("Processing...")  # 仅第一次调用时执行
        return [x * 2 for x in self.data]

d = Data([1, 2, 3])
print(d.processed_data)  # 输出 Processing... [2, 4, 6]
print(d.processed_data)  # 直接输出缓存结果 [2, 4, 6]

```

### `functools.total_ordering`：自动补全比较方法

作用：基于 `__eq__` 和任意一个比较方法（如 `__lt__`），自动生成全部比较方法。  
示例：

```python
from functools import total_ordering

@total_ordering
class Student:
    def __init__(self, score):
        self.score = score

    def __eq__(self, other):
        return self.score == other.score

    def __lt__(self, other):
        return self.score < other.score

# 自动生成 >, <=, >= 等方法
s1 = Student(80)
s2 = Student(90)
print(s1 <= s2)  # 输出 True

```

### `functools.singledispatch`：单分派泛型函数

作用：根据第一个参数的类型选择不同的函数实现（类似重载）。  
示例：

```python
from functools import singledispatch

@singledispatch
def process(data):
    print("Generic processing:", data)

@process.register(str)
def _(data):
    print("Processing string:", data.upper())

@process.register(int)
def _(data):
    print("Processing integer:", data * 2)

process(10)      # 输出 "Processing integer: 20"
process("hello") # 输出 "Processing string: HELLO"

```

### 其他函数

- `functools.partialmethod`：类似于 `partial`，但用于类方法。
- `functools.update_wrapper`：手动更新包装函数的元信息（`wraps` 的底层实现）。

### 总结

| 函数/装饰器            | 主要用途                              |
|||
| `partial`             | 固定函数参数，生成新函数              |
| `reduce`              | 可迭代对象的累积计算                  |
| `lru_cache`           | 缓存函数结果，优化性能                |
| `wraps`               | 保留被装饰函数的元信息                |
| `cached_property`     | 将方法结果缓存为实例属性              |
| `total_ordering`      | 自动生成缺失的比较方法                |
| `singledispatch`      | 根据参数类型选择不同函数实现          |

通过灵活使用 `functools`，可以简化代码、提升性能，并增强函数的行为控制。