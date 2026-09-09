# Python 装饰器详解

装饰器(Decorator)是Python中一种强大的语法特性，它允许你在不修改原函数代码的情况下，为函数添加额外的功能。装饰器本质上是一个高阶函数，它接受一个函数作为参数，并返回一个新的函数。

## 装饰器基础

### 最简单的装饰器

```python
def simple_decorator(func):
    def wrapper():
        print("Before function call")
        func()
        print("After function call")
    return wrapper

@simple_decorator
def say_hello():
    print("Hello!")

say_hello()

```

输出：

```

Before function call
Hello!
After function call

```

### 装饰器语法糖

`@decorator` 语法实际上是以下代码的简写：

```python
def say_hello():
    print("Hello!")

say_hello = simple_decorator(say_hello)

```

## 带参数的函数装饰

### 装饰带参数的函数

```python
def decorator_with_args(func):
    def wrapper(*args, kwargs):
        print(f"Calling {func.__name__} with args: {args}, kwargs: {kwargs}")
        result = func(*args, kwargs)
        print(f"{func.__name__} returned: {result}")
        return result
    return wrapper

@decorator_with_args
def add(a, b):
    return a + b

print(add(3, 5))

```

输出：

```

Calling add with args: (3, 5), kwargs: {}
add returned: 8
8

```

### 保留函数元信息

使用`functools.wraps`保留原函数的元信息：

```python
from functools import wraps

def preserving_decorator(func):
    @wraps(func)
    def wrapper(*args, kwargs):
        """Wrapper docstring"""
        print(f"Calling {func.__name__}")
        return func(*args, kwargs)
    return wrapper

@preserving_decorator
def multiply(x, y):
    """Multiply two numbers"""
    return x * y

print(multiply.__name__)  # 输出 'multiply'
print(multiply.__doc__)   # 输出 'Multiply two numbers'

```

## 带参数的装饰器

### 装饰器工厂

```python
def repeat(num_times):
    def decorator_repeat(func):
        @wraps(func)
        def wrapper(*args, kwargs):
            for _ in range(num_times):
                result = func(*args, kwargs)
            return result
        return wrapper
    return decorator_repeat

@repeat(num_times=3)
def greet(name):
    print(f"Hello {name}")

greet("Alice")

```

输出：

```

Hello Alice
Hello Alice
Hello Alice

```

### 类实现的装饰器

```python
class CountCalls:
    def __init__(self, func):
        self.func = func
        self.num_calls = 0
        wraps(func)(self)

    def __call__(self, *args, kwargs):
        self.num_calls += 1
        print(f"Call {self.num_calls} of {self.func.__name__}")
        return self.func(*args, kwargs)

@CountCalls
def say_hello():
    print("Hello!")

say_hello()
say_hello()
print(f"Total calls: {say_hello.num_calls}")

```

输出：

```

Call 1 of say_hello
Hello!
Call 2 of say_hello
Hello!
Total calls: 2

```

## 多个装饰器叠加

```python
def decorator1(func):
    @wraps(func)
    def wrapper(*args, kwargs):
        print("Decorator 1 before")
        result = func(*args, kwargs)
        print("Decorator 1 after")
        return result
    return wrapper

def decorator2(func):
    @wraps(func)
    def wrapper(*args, kwargs):
        print("Decorator 2 before")
        result = func(*args, kwargs)
        print("Decorator 2 after")
        return result
    return wrapper

@decorator1
@decorator2
def my_function():
    print("Original function")

my_function()

```

输出：

```

Decorator 1 before
Decorator 2 before
Original function
Decorator 2 after
Decorator 1 after

```

注意：装饰器的应用顺序是从下往上的，即最靠近函数的装饰器最先执行。

## 内置装饰器

Python提供了一些有用的内置装饰器：

### @staticmethod

```python
class MyClass:
    @staticmethod
    def static_method():
        print("This is a static method")

MyClass.static_method()

```

### @classmethod

```python
class MyClass:
    @classmethod
    def class_method(cls):
        print(f"This is a class method of {cls.__name__}")

MyClass.class_method()

```

### @property

```python
class Circle:
    def __init__(self, radius):
        self._radius = radius
    
    @property
    def radius(self):
        return self._radius
    
    @radius.setter
    def radius(self, value):
        if value < 0:
            raise ValueError("Radius cannot be negative")
        self._radius = value

c = Circle(5)
print(c.radius)  # 5
c.radius = 10
print(c.radius)  # 10

```

## 实际应用场景

### 计时装饰器

```python
import time
from functools import wraps

def timer(func):
    @wraps(func)
    def wrapper(*args, kwargs):
        start_time = time.perf_counter()
        result = func(*args, kwargs)
        end_time = time.perf_counter()
        print(f"Function {func.__name__} took {end_time - start_time:.4f} seconds")
        return result
    return wrapper

@timer
def slow_function(n):
    time.sleep(n)

slow_function(2)

```

### 缓存装饰器

```python
from functools import lru_cache

@lru_cache(maxsize=None)
def fibonacci(n):
    if n < 2:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

print(fibonacci(30))  # 第一次计算会慢一些
print(fibonacci(30))  # 第二次直接从缓存读取，非常快

```

### 权限验证装饰器

```python
def requires_admin(func):
    @wraps(func)
    def wrapper(user, *args, kwargs):
        if not user.get('is_admin', False):
            raise PermissionError("Admin privileges required")
        return func(user, *args, kwargs)
    return wrapper

@requires_admin
def delete_user(user, username):
    print(f"Deleting user {username}")

admin_user = {'name': 'Alice', 'is_admin': True}
regular_user = {'name': 'Bob', 'is_admin': False}

delete_user(admin_user, "Charlie")  # 正常执行
delete_user(regular_user, "Dave")   # 抛出PermissionError

```

## 高级话题

### 装饰器类

```python
class DecoratorClass:
    def __init__(self, func):
        self.func = func
        wraps(func)(self)
    
    def __call__(self, *args, kwargs):
        print(f"Before calling {self.func.__name__}")
        result = self.func(*args, kwargs)
        print(f"After calling {self.func.__name__}")
        return result

@DecoratorClass
def say_goodbye():
    print("Goodbye!")

say_goodbye()

```

### 异步函数装饰器

```python
import asyncio
from functools import wraps

def async_timer(func):
    @wraps(func)
    async def wrapper(*args, kwargs):
        start_time = time.perf_counter()
        result = await func(*args, kwargs)
        end_time = time.perf_counter()
        print(f"Async function {func.__name__} took {end_time - start_time:.4f} seconds")
        return result
    return wrapper

@async_timer
async def async_sleep(n):
    await asyncio.sleep(n)
    return n

asyncio.run(async_sleep(1))

```

## 总结

Python装饰器是一种强大的工具，可以用于：
- 添加日志记录
- 性能测试
- 权限验证
- 缓存
- 事务处理
- 错误处理
- 以及许多其他横切关注点

掌握装饰器可以让你写出更干净、更模块化和更可重用的代码。记住装饰器的核心概念：它们接收一个函数，返回一个新函数，通常会在调用原函数前后执行一些额外操作。