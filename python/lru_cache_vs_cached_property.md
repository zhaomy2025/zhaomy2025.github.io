# lru_cache 与 cached_property

`cached_property` 和 `lru_cache` 都是 Python 中用于缓存的工具，但它们的应用场景和行为有显著区别。以下是它们的详细对比：

### `functools.cached_property`

#### 核心特点

- 用途：将类方法的计算结果缓存为实例属性（Python 3.8+ 引入）。
- 缓存范围：每个实例独立缓存，不同实例的缓存不共享。
- 生命周期：缓存随实例存在，实例销毁后缓存消失。
- 适用场景：计算成本高且不变化的实例属性。

#### 示例

```python
from functools import cached_property

class DataSet:
    def __init__(self, data):
        self.data = data

    @cached_property
    def stats(self):
        print("Calculating stats...")  # 仅第一次调用时执行
        return {"mean": sum(self.data) / len(self.data)}

ds = DataSet([1, 2, 3])
print(ds.stats)  # 输出 Calculating stats... 和结果
print(ds.stats)  # 直接返回缓存结果，不打印

```

#### 关键行为

- 首次访问属性时计算并缓存结果。
- 后续访问直接返回缓存值。
- 如果实例属性被手动修改（如 `del ds.stats`），下次访问会重新计算。

### `functools.lru_cache`

#### 核心特点

- 用途：缓存函数的所有调用结果（基于参数）。
- 缓存范围：所有实例共享缓存（除非装饰实例方法时用 `@lru_cache`）。
- 生命周期：缓存全局存在，直到程序结束或缓存被清空。
- 适用场景：纯函数或静态方法的重复计算优化。

#### 示例

```python
from functools import lru_cache

@lru_cache(maxsize=128)
def fibonacci(n):
    if n < 2:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

print(fibonacci(30))  # 第一次计算较慢
print(fibonacci(30))  # 直接从缓存返回

```

#### 关键行为

- 缓存所有不同参数的调用结果。
- 通过 `maxsize` 限制缓存条目数（LRU 淘汰策略）。
- 可通过 `cache_clear()` 手动清空缓存。

### 主要区别对比

| 特性                | `cached_property`                  | `lru_cache`                        |
||--|-|
| 作用对象         | 类方法（转为属性）                | 普通函数/静态方法                   |
| 缓存粒度         | 每个实例独立缓存                  | 全局缓存（所有实例共享）            |
| 参数依赖         | 无（不依赖输入参数）              | 基于函数参数缓存不同结果            |
| 缓存控制         | 通过实例属性管理（如 `del` 触发重新计算） | 通过 `maxsize` 和 `cache_clear()` 管理 |
| 典型用途         | 延迟计算实例属性                  | 优化重复计算的纯函数                |
| Python 版本      | 3.8+                              | 3.2+                                |

### 如何选择？

- 用 `cached_property` 当：  
  - 需要将方法转为属性，且该属性的计算成本高。  
  - 不同实例需要独立的缓存（如实例属性依赖实例状态）。  

- 用 `lru_cache` 当：  
  - 函数是纯函数（输出仅依赖输入，无副作用）。  
  - 需要基于不同参数缓存多个结果（如递归函数、查询函数）。  

### 注意事项

#### `cached_property` 的陷阱

- 线程不安全：多线程环境下可能导致重复计算（需额外加锁）。
- 可变对象风险：如果返回可变对象（如列表），修改它会影响缓存结果。

#### `lru_cache` 的陷阱

- 内存泄漏：缓存大量结果可能消耗过多内存（需合理设置 `maxsize`）。
- 参数限制：所有参数必须可哈希（如列表、字典等不可哈希类型需转为元组）。

### 结合使用示例

```python
from functools import cached_property, lru_cache

class WeatherAPI:
    def __init__(self, city):
        self.city = city

    @cached_property
    def location_id(self):
        # 每个实例只查询一次位置ID
        print(f"Fetching ID for {self.city}")
        return hash(self.city)  # 模拟API调用

    @lru_cache(maxsize=100)
    def get_forecast(self, date):
        # 缓存不同日期的预报结果
        print(f"Fetching forecast for {self.city} on {date}")
        return f"Weather data for {self.city} on {date}"

api = WeatherAPI("Beijing")
print(api.location_id)  # 第一次计算
print(api.location_id)  # 从缓存读取
print(api.get_forecast("2023-10-01"))  # 第一次计算
print(api.get_forecast("2023-10-01"))  # 从缓存读取

```

### 总结

- `cached_property`：优化实例属性的延迟计算，适合类设计。  
- `lru_cache`：优化函数调用的重复计算，适合工具函数。  
- 关键区别在于缓存的作用域（实例 vs 全局）和是否依赖参数。