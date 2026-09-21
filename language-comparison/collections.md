---
title: 集合在不同语言中的对比
date: 2025-03-10 09:25:46
tags:
  - 语言对比
  - 集合
  - Python
  - Java
  - JavaScript
categories:
  - 语言对比
---
# 集合在不同语言中的对比

[[toc]]

本文以“常见操作如何表达”为入口，对照 Java、JavaScript 和 Python 的数组/列表、栈、队列和优先队列，以及Set、Map/字典。这里的“对照”是为了帮助迁移思路，不表示三种语言的容器在类型、可变性、异常或复杂度上完全等价。

::: tip 对照视角
- Java 数组是定长且元素类型固定的容器
- JavaScript Array 可以动态扩容并且可以是稀疏数组
- Python `list` 是可变长的对象序列。

下表把它们放在一起，是为了对照“同一类需求的常见写法”，具体边界见各节说明。
:::

## 数组/列表

### 基本操作
#### 创建与插入

|操作|Java数组|Java List|JavaScript数组|Python列表|
|----|----|----|----|----|
|创建集合|`int[] arr = {1, 2, 3};`<br>`int[] arr = new int[10];`|直接创建：<br>`new ArrayList<>()`<Tip>可变、可扩容</Tip><br>`Arrays.asList(1, 2, 3)`<a class="collection-note" href="#arrays-as-list"><Warning>固定长度、可修改值</Warning></a><br>`List.of(1, 2, 3)`<Tip>Java 9+</Tip><a class="collection-note" href="#arrays-as-list"><Warning>不可变</Warning></a><br>对象数组<Warning>展开为多个元素</Warning><br>`Arrays.asList(objectArr)`<br>`List.of(objectArr)`<br>基本类型数组<Warning>整个数组作为一个元素</Warning><br>`Arrays.asList(primitiveArr)`<br>`List.of(primitiveArr)`|`const arr = [1, 2, 3];`<br>`const arr = new Array();`<br>`const arr = new Array(1, 2, 3);`<br>`const arr = new Array(3);`<Warning>长度为 3 的空数组</Warning>|`[]`<br>`list()`<br>`list(iterable)`<Tip>`iterable`：可迭代对象，可用 `for` 遍历</Tip>|
|任意位置插入|/|`list.add(index, value);`|`arr.splice(index, 0, value);`|`arr.insert(index, value)`|
|头部插入|/|`list.add(0, value);`|`arr.unshift(value1, value2, ...items);`|`arr.insert(0, value)`|
|尾部插入|/|`list.add(value);`|`arr.push(value1, value2, ...items);`|`arr.append(value)`|
|批量追加|/|`list.addAll(collection)`|`arr.push(...items)`|`arr.extend(items)`|

::: tip Java List 的实现
- `new ArrayList`：长度可变、可修改元素值，基于动态数组，支持按索引快速访问，通常适合大多数 List 场景。
- `Arrays.asList`：固定长度、可修改元素值，与数组关联的视图。
- `List.of`：不可变列表，Java 9+ 可用。
:::

::: warning 容器可变性
<span id="arrays-as-list" class="collection-note-target"></span>
- `Arrays.asList(...)` 返回固定长度、与数组关联的视图，不能 `add`、`remove` 或 `clear`，但是可以通过 `set` 修改元素值，修改会同步到原数组
- `List.of(...)`、`Set.of(...)`<Warning>Java 9+</Warning> 是不可变工厂方法，不接受 `null`；`Set.of(...)` 还拒绝重复元素。
- 如果需要可变 `List`，请使用 `new ArrayList<>(...)`，例如：
    - `new ArrayList<>(List.of(1, 2, 3))`
    - `new ArrayList<>(Arrays.asList(1, 2, 3))`
:::

::: warning Java 数组转换为集合的类型差异
<span id="primitive-array-collection" class="collection-note-target"></span>

对于对象数组，例如 `Integer[] objectArr = {1, 2, 3}`：

- `Arrays.asList(objectArr)` 和 `List.of(objectArr)` 都会将数组展开为包含 3 个元素的列表

对于基本类型数组，例如 `int[] primitiveArr = {1, 2, 3}`：

- `Arrays.asList(primitiveArr)` 和 `List.of(primitiveArr)` 会把整个 `int[]` 当成一个元素，结果列表只有 1 个元素
- 基本类型数组需要先装箱：`Arrays.stream(primitiveArr).boxed().collect(Collectors.toList())`

`Set.of()` 与 `List.of` 在对象数组展开、基本类型数组整体作为元素的形态上相同，但 `Set.of` 还会拒绝重复元素和 `null`。
:::

::: tip Python 的 `list(iterable)`
`list(iterable)` 会按照迭代顺序取出 `iterable` 中的元素，创建一个新的列表。`iterable` 是可以用 `for` 逐个取出元素的对象，例如元组、字符串、字典和生成器。

```python
list((1, 2, 3))                     # [1, 2, 3]
list("abc")                         # ['a', 'b', 'c']
list({"name": "Alice", "age": 18})  # ['name', 'age']，字典默认遍历 key
list(x * 2 for x in range(3))       # [0, 2, 4]
```

不传参数时，`list()` 创建空列表；传入已有列表时，会创建浅拷贝，嵌套对象本身不会被复制。
:::

#### 删除

|操作|Java数组|Java List|JavaScript数组|Python列表|
|----|----|----|----|----|
|头部删除|/|`list.remove(int index)`|`arr.shift()`|`arr.pop(0)`|
|尾部删除|/|`list.remove(int index)`|`arr.pop()`|`arr.pop()`|
|按值删除第一个|/|`list.remove(Object value)`|先查找索引，再 `splice`|`arr.remove(value)`|
|按下标删除|/|`list.remove(int index)`|`arr.splice(index, 1);`|`del arr[index]`|
|删除多个元素|/|`list.removeAll(collection);`<br>`list.removeIf(predicate);`|`arr.splice(start, deleteCount)`|`arr[:] = [x for x in arr if not predicate(x)]`|
|清空列表|/|`list.clear();`|`arr.length = 0`|`arr.clear()`<Tip>Python 3.3+</Tip>|

::: warning 删除方法的返回值与重载
<span id="list-remove-semantics" class="collection-note-target"></span>
- **Java List**
  - `remove(int index)`：按下标删除，返回被删除的元素。
  - `remove(Object value)`：按值删除第一个匹配项，返回 `boolean`。
  - 对于 `List<Integer>`，`list.remove(1)` 中的 `1` 是 `int`，会匹配 `remove(int index)`；要删除值 `1`，需要用 `list.remove(Integer.valueOf(1))` 装箱，以选择 `remove(Object value)`。
- **JavaScript Array**
  - `shift()`、`pop()`：返回被删除的元素。
  - `splice()`：返回被删除元素组成的数组；按值删除时，先用 `indexOf` 判断索引，避免未找到时把 `-1` 传给 `splice`：

    ```javascript
    const index = arr.indexOf(value);
    if (index !== -1) {
      arr.splice(index, 1);
    }
    ```
- **Python list**
  - `pop(index)`：返回被删除的元素。
  - `remove(value)`：删除第一个匹配项，但返回 `None`；找不到时抛 `ValueError`。
  - `del`、切片赋值和 `clear()`：不返回被删除的元素。
- **删除多个元素**
  - Java `removeAll`、`removeIf`：返回 `boolean`，表示是否发生删除。
  - JavaScript `splice()`：返回被删除元素组成的数组。
  - Python 切片赋值：直接修改原列表，不返回被删除的元素。
- **空集合**
  - Java `List` 和 Python `list` 的按下标删除通常抛异常。
  - JavaScript `shift()`、`pop()` 在空数组上返回 `undefined`。
:::
#### 修改

|操作|Java数组|Java List|JavaScript数组|Python列表|
|----|----|----|----|----|
|修改元素|`arr[index] = value;`|`list.set(index, value);`|`arr[index] = value`|`arr[index] = value`|
|替换全部元素|`Arrays.fill(arr, newValue)`<br>`Arrays.setAll(arr, i -> newValue)`|`Collections.fill(list, newValue)`|`arr.fill(newValue)`|`arr[:] = [newValue] * len(arr)`|
|按范围替换|/|/|`arr.splice(start, deleteCount, ...items)`|`arr[start:end] = items`|

::: warning JavaScript 字符串索引不可写
JavaScript 字符串索引不可写；严格模式下赋值可能抛 `TypeError`，非严格模式下通常静默无效。
:::

::: tip 替换操作的语义
Python 切片赋值两侧的元素数量可以不同，会同时插入或删除元素。例如：

- **替换并插入**：`arr = [1, 2, 3, 4]`，执行 `arr[1:3] = [20, 30, 40]` 后，结果为 `[1, 20, 30, 40, 4]`。原切片有 2 个元素，右侧有 3 个元素，多出的 1 个元素会被插入。
- **替换并删除**：`arr = [1, 2, 3, 4]`，执行 `arr[1:4] = [20]` 后，结果为 `[1, 20]`。原切片有 3 个元素，右侧只有 1 个元素，多出的 2 个元素会被删除。
- **只插入元素**：`arr = [1, 2, 3]`，执行 `arr[1:1] = [10, 20]` 后，结果为 `[1, 10, 20, 2, 3]`。空切片不会删除元素，只会在指定位置插入。
- **只删除元素**：`arr = [1, 2, 3, 4]`，执行 `arr[1:3] = []` 后，结果为 `[1, 4]`。
:::

#### 其他

|操作|Java数组|Java List|JavaScript数组|Python列表|
|----|----|----|----|----|
|查询长度|`arr.length`|`list.size()`|`arr.length`|`len(arr)`|
|是否为空|`arr.length == 0`|`list.isEmpty()`|`arr.length === 0`|`not arr`|
|访问元素|`arr[index]`|`list.get(index)`|`arr[index]`|`arr[index]`|
|遍历|`for(int value : arr)`<br>&nbsp;&nbsp;`{System.out.println(value)}`|`list.forEach(System.out::println);`|`arr.forEach(value => console.log(value))`|`for value in arr:print(value)`|

::: warning 不同语言的越界行为
- JavaScript 数组越界访问返回 `undefined`
- Java 和 Python 通常分别抛数组/索引越界异常。
:::

::: warning JavaScript 稀疏数组
<span id="javascript-sparse-array" class="collection-note-target"></span>
产生空槽
- `new Array(3)` 创建长度为 3 的稀疏数组，包含 3 个空槽，不等于 `[undefined, undefined, undefined]`
- 增大 `length` 或给超出当前范围的索引赋值也会产生空槽

处理空槽
- `forEach`、`some`、`every`、`filter`、`reduce` 通常跳过空槽
- `find`、`findIndex` 会以 `undefined` 调用回调。
:::

### 查找

#### 根据元素查找

|操作|Java数组|Java List|JavaScript数组|Python列表|
|----|----|----|----|----|
|元素是否存在|对象数组<br>`Arrays.asList(objectArr).contains(value)`<br>基本类型数组<br>`Arrays.stream(intArr).anyMatch(x -> x == value)`<br>`Arrays.stream(intArr).boxed().collect(Collectors.toSet()).contains(value)`|`list.contains(value);`<br>`list.containsAll(collection)`|`arr.includes(value)`|`value in arr`|
|元素位置|对象数组<br>`Arrays.asList(objectArr).indexOf(value)`<br>`Arrays.asList(objectArr).lastIndexOf(value)`<br>基本类型数组（首次）<br>`IntStream.range(0, intArr.length)`<br>&nbsp;&nbsp;`.filter(i -> intArr[i] == value)`<br>&nbsp;&nbsp;`.findFirst().orElse(-1)`<br>基本类型数组（末次，reduce）<br>`IntStream.range(0, intArr.length)`<br>&nbsp;&nbsp;`.filter(i -> intArr[i] == value)`<br>&nbsp;&nbsp;`.reduce((first, second) -> second).orElse(-1)`<br>基本类型数组（末次，反向查找）<br>`IntStream.range(0, intArr.length)`<br>&nbsp;&nbsp;`.map(i -> intArr.length - 1 - i)`<br>&nbsp;&nbsp;`.filter(i -> intArr[i] == value)`<br>&nbsp;&nbsp;`.findFirst().orElse(-1)`|`list.indexOf(value)`<br>`list.lastIndexOf(value)`|`arr.indexOf(value)`<br>`arr.lastIndexOf(value)`|`arr.index(value)`<br><Tip>找不到时抛 `ValueError`</Tip>|
|二分查找|`Arrays.binarySearch(arr, value)`|`Collections.binarySearch(list, value)`|不支持内置方法（需自行实现）|`bisect_left` / `bisect_right`|


::: warning Java 数组判断元素是否存在的类型陷阱
<span id="primitive-array-collection" class="collection-note-target"></span>

- **对象数组**
  - `Arrays.asList(objectArr).contains(value)` 可以直接判断元素是否存在。
  - 如果需要多次查找，可以转换为 `HashSet`：`new HashSet<>(Arrays.asList(objectArr)).contains(value)`。
  - 不建议直接使用 `Set.of(objectArr)`：数组含重复元素时会抛 `IllegalArgumentException`，含 `null` 时会抛 `NullPointerException`。
- **基本类型数组**
  - `Arrays.asList(intArr)` 和 `Set.of(intArr)` 都会把整个 `int[]` 当成一个元素，不会自动装箱展开；用它们判断 `Integer` 元素会得到错误结果。
  - 单次查找可使用：`Arrays.stream(intArr).anyMatch(x -> x == value)`。
  - 需要转换为集合时，先装箱：`Arrays.stream(intArr).boxed().collect(Collectors.toSet())`。
- **选择建议**
  - 只查找一次：对象数组使用 `Arrays.asList(...).contains(...)`，基本类型数组使用数组流。
  - 需要反复查找：对象数组先转换为 `HashSet`；基本类型数组先装箱后再转换。
:::

::: warning 元素位置查找失败时的结果
- **Java `List`**
  - `indexOf(value)` 和 `lastIndexOf(value)`：返回 `-1`。
- **JavaScript Array**
  - `indexOf(value)` 和 `lastIndexOf(value)`：返回 `-1`。
  - `findIndex(predicate)`：返回 `-1`。
- **Python list**
  - `index(value)`：找不到元素时抛 `ValueError`，不会返回 `-1`。
:::

::: warning 二分查找的前提与返回值
- 二分查找要求数组或列表已按查找规则排序。
- Python `bisect_left` / `bisect_right` 返回插入位置，不直接表示元素是否存在；使用前需要：`from bisect import bisect_left, bisect_right`
- Java `Arrays.binarySearch` / `Collections.binarySearch` 找到元素时返回索引；找不到时返回 `-(插入点) - 1`，不是简单的 `-1`。
:::


#### 根据条件查找

Java 数组和 `List` 通常借助 Stream 表达匹配和查找操作。
- 基本类型数组转换后得到 `IntStream` 等基本类型流
  - `Arrays.stream(intArr)`
- 对象数组和 `List` 转换后得到引用类型 `Stream<T>`
  - `Arrays.stream(objectArr)`
  - `list.stream()`

|操作|Java Stream|JavaScript数组|Python列表|
|----|----|----|----|
|全部满足条件|`stream.allMatch(predicate)`|`arr.every(predicate)`|`all(predicate(value) for value in arr)`|
|至少一个满足条件|`stream.anyMatch(predicate)`|`arr.some((value, index, arr) => predicate(value, index, arr))`|`any(predicate(value) for value in arr)`|
|全部不满足|`stream.noneMatch(predicate)`|`arr.every((value, index, arr) => !predicate(value, index, arr))`|`not any(predicate(value) for value in arr)`|
|第一个满足条件的元素（引用流）|`stream.filter(predicate).findFirst().orElse(defaultValue)`<br>`intStream.filter(predicate).findFirst().orElse(defaultInt)`<br>`longStream.filter(predicate).findFirst().orElse(defaultLong)`<br>`doubleStream.filter(predicate).findFirst().orElse(defaultDouble)`|`arr.find((value, index, arr) => predicate(value, index, arr))`|`next((value for value in arr if predicate(value)), None)`|
|第一个满足条件的元素位置|数组<br>`IntStream.range(0, array.length).filter(i->predicate(array[i]))  .findFirst().orElse(-1)`<br>List<br>`IntStream.range(0, list.size()).filter(i->predicate(list.get(i))) .findFirst().orElse(-1)`|`arr.findIndex((value, index, arr) => predicate(value, index, arr))`|`next((i for i, value in enumerate(arr) if predicate(value)), -1)`|
|返回所有满足条件的元素|`stream.filter(predicate).collect(Collectors.toList())`|`arr.filter(predicate)`|`[value for value in arr if predicate(value)]`|

`predicate` 表示用于判断元素是否满足条件的函数或表达式，返回布尔值。例如 Java 中可写 `value -> value > 10`。

### 比较

|操作|Java数组|Java List|JavaScript数组|Python列表|
|----|----|----|----|----|
|判断引用是否相同|`arr1 == arr2`|`list1 == list2`|`arr1 === arr2`|`arr1 is arr2`|
|判断一维内容相等|`Arrays.equals(arr1, arr2)`|`list1.equals(list2)`|`arr1.length === arr2.length`<br>&nbsp;&nbsp;`&& arr1.every((value, index) => value === arr2[index])`|`arr1 == arr2`|
|嵌套数组/列表相等|`Arrays.deepEquals(objectArr1, objectArr2)`|`list1.equals(list2)`<Tip>嵌套 `List` 可递归比较</Tip>|无通用内置深层比较|`arr1 == arr2`<Tip>嵌套 `list` 可递归比较</Tip>|

::: warning 比较规则
Java 的 `==`、JavaScript 数组的 `===` 和 Python 的 `is` 比较的是「是否同一个对象」，不是内容。

上表「判断一维内容相等」中的 JavaScript 代码先比较长度，再逐个比较对应位置的元素内容，但元素仍使用 ===，因此只是浅层比较：
- NaN 使用 === 比较时不等于自身；
- 对象和嵌套数组比较的是引用，不会递归比较内部内容；
- 稀疏数组的空槽可能被 `every` 跳过；详见[JavaScript 稀疏数组](#javascript-sparse-array)。

需要通用深层比较时，应明确相等规则或使用专门的比较器。
:::

### 转换

|操作|Java数组|Java List|JavaScript数组|Python列表|
|----|----|----|----|----|
|转为字符串|`Arrays.toString(intArr)`<br>`Arrays.deepToString(objectArr)`|`list.toString()`|`String(arr)`<br>`arr.toString()`<br>`arr.join()`|`str(arr)`|
|浅拷贝|`Arrays.copyOf(arr, arr.length)`|`new ArrayList<>(list)`|`arr.slice()`<br>`[...arr]`|`list(arr)`<br>`arr.copy()`<Tip>Python 3.3+</Tip>|
|数组转 List|`Arrays.asList(objectArr)`<a class="collection-note" href="#arrays-as-list"><Warning>固定长度，可修改值</Warning></a><br>`List.of(objectArr)`<a class="collection-note" href="#arrays-as-list"><Warning>不可变</Warning></a><br>`new ArrayList<>(Arrays.asList(objectArr))`<Warning>可变列表</Warning><br>`new ArrayList<>(List.of(objectArr))`<Warning>可变列表</Warning><br>`Arrays.stream(intArr).boxed().collect(Collectors.toList())`|/|/|/|
|List 转数组|/|`list.toArray(new String[0])`<br>`list.toArray(String[]::new)`<Tip>Java 11+</Tip>|/|/|
|转为 Set|`new HashSet<>(Arrays.asList(objectArr))`|`new HashSet<>(list)`|`new Set(arr)`|`set(arr)`|

::: warning Java 数组转换的类型边界
- `Arrays.deepToString` 适用于对象数组或多维数组；一维基本类型数组应使用对应的 `Arrays.toString`
- `list.toArray(new T[0])` 不能作为泛型类型变量的通用写法，Java 不允许直接创建 `new T[]`，应使用具体数组类型或数组构造器
:::

### 不修改原集合

|操作|Java数组|Java List|JavaScript数组|Python列表|
|----|----|----|----|----|
|截取|`Arrays.copyOfRange(arr, start, end)`|`list.subList(start, end)`|`arr.slice(start, end)`|`arr[start:stop:step]`|
|浅拷贝|`arr.clone()`<br>`Arrays.copyOf(arr, arr.length)`|`new ArrayList<>(list)`|`arr.slice()`<br>`[...arr]`|`arr.copy()`<Tip>Python 3.3+</Tip><br>`arr[:]`|
|复制到已有集合|`System.arraycopy(src, 0, dest, 0, src.length)`|`Collections.copy(dest, src)`|/|/|
|拼接|`int[] result = new int[arr1.length + arr2.length];`<br>`System.arraycopy(arr1, 0, result, 0, arr1.length);`<br>`System.arraycopy(arr2, 0, result, arr1.length, arr2.length);`<br><br>`IntStream.concat(Arrays.stream(arr1), Arrays.stream(arr2)).toArray()`<Tip>Java 8+</Tip><br><br>`int[] result = Arrays.copyOf(arr1, arr1.length + arr2.length);`<br>`System.arraycopy(arr2, 0, result, arr1.length, arr2.length);`|`List<T> result = new ArrayList<>(list1);`<br>`result.addAll(list2);`|`arr1.concat(arr2)`|`arr1 + arr2`|

::: warning 视图与复制
`subList(start, end)` 返回原列表的视图，修改视图会影响原列表；需要独立列表时使用 `new ArrayList<>(list.subList(start, end))`。Python 和 JavaScript 的切片通常创建新容器，Python 切片还支持步长和负索引。

`Collections.copy(dest, src)` 会修改已有的 `dest`，不会自动扩容或创建新列表；目标长度必须不小于源列表，并且目标必须支持 `set`。
:::

### 修改原集合

|操作|Java数组|Java List|JavaScript数组|Python列表|
|----|----|----|----|----|
|排序|`Arrays.sort(arr)`<br>`Arrays.sort(arr, start, end)`<br>`Arrays.sort(objectArr, comparator)`<br>`Arrays.sort(objectArr, start, end, comparator)`|`list.sort(null)`<br>`list.sort(comparator)`<br>`Collections.sort(list)`|`arr.sort()`<br>`arr.sort(compareFunction)`|`arr.sort()`<br>`arr.sort(key=key_func, reverse=True)`|
|并行排序|`Arrays.parallelSort(arr)`<br>`Arrays.parallelSort(arr, start, end)`<br>`Arrays.parallelSort(objectArr, comparator)`<br>`Arrays.parallelSort(objectArr, start, end, comparator)`|/|/|/|
|反转|/|`Collections.reverse(list)`|`arr.reverse()`|`arr.reverse()`|
|填充|`Arrays.fill(arr, value)`<br>`Arrays.fill(arr, start, end, value)`|`Collections.fill(list, value)`|`arr.fill(value)`<br>`arr.fill(value, start, end)`|`arr[:] = [value] * len(arr)`|
|按索引设置元素|`Arrays.setAll(arr, i -> i * 2)`|`IntStream.range(0, list.size()).forEach(i -> list.set(i, i * 2))`|`arr.forEach((value, i) => { arr[i] = i * 2; })`|`arr[:] = [i * 2 for i in range(len(arr))]`|
|插入多个元素|/|`list.addAll(index, collection)`|`arr.splice(index, 0, ...items)`|`arr[index:index] = items`|
|保留指定元素|/|`list.retainAll(collection)`|/|`arr[:] = [x for x in arr if x in items]`|

::: warning 排序边界
- Java 对象数组和 `List` 的自然排序都要求元素类型实现 `Comparable`；Comparator 版本必须与元素类型匹配并满足排序契约。
- Java `Arrays.sort` 和 `Arrays.parallelSort` 的 Comparator 重载仅适用于对象数组；基本类型数组使用自然顺序。
- JavaScript `sort()` 默认按字符串顺序排序，数字排序应传入 `(a, b) => a - b`。
- Python `list.sort()` 返回 `None`，需要新列表时使用 `sorted(arr)`。
:::

### 变换与规约

数组和 `List` 除了基本的增删改查，还可以进行元素变换、分组、收集和规约。Java 中通常借助 Stream 表达这些操作；这里仅将其作为数组和 `List` 能力的扩展进行对照，不展开介绍 Stream API 本身。

#### 元素变换与收集

|操作|Java Stream|JavaScript数组|Python列表|
|----|----|----|----|
|元素变换|`stream.map(mapper)`|`arr.map(mapper)`|`[mapper(value) for value in arr]`|
|展平|`stream.flatMap(item -> item.stream())`|`arr.flatMap(mapper)`<Tip>ES2019+</Tip>|`[value for group in groups for value in group]`|
|去重|`stream.distinct()`|`[...new Set(arr)]`|`list(dict.fromkeys(arr))`|
|排序|`stream.sorted()`|`arr.toSorted()`<Tip>ES2023+</Tip>|`sorted(arr)`|
|跳过/截取|`stream.skip(n).limit(size)`|`arr.slice(start, end)`|`arr[start:end]`|
|元素数量|`stream.count()`|`arr.length`|`len(arr)`|
|收集为 List|`stream.toList()`<Tip>Java 16+</Tip><br>`stream.collect(Collectors.toList())`<Tip>Java 8+</Tip>|`[...arr]`<Warning>稀疏数组的空槽会转为 `undefined`</Warning>|`list(iterable)`|
|按键分组|`Collectors.groupingBy(Item::category)`|`Object.groupBy(items, item => item.category)`<Tip>ES2024+</Tip>|`defaultdict(list)`<br>`grouped = {category: [item for item in items if item["category"] == category] for category in categories}`|
|转换为 Map|`Collectors.toMap(Item::id, Function.identity())`|`new Map(items.map(item => [item.id, item]))`|`{item.id: item for item in items}`|

::: warning Map 转换的重复键行为
Java `Collectors.toMap` 遇到重复键时默认抛 `IllegalStateException`；JavaScript `Map` 和 Python 字典通常保留后出现的值。Java 需要后值覆盖时，可传入 `(oldValue, newValue) -> newValue` 合并函数。
:::

::: warning 去重与分组的键必须可哈希
- `list(dict.fromkeys(arr))` 会把元素作为字典 key，因此元素必须可哈希；包含列表或字典等不可哈希元素时会抛出 `TypeError`。
- 使用 `defaultdict(list)` 分组时，分组键也必须可哈希。

`defaultdict(list)` 是 Python 中进行分组时更简洁、直观的写法。它在首次访问不存在的分组键时自动创建一个空列表，但仍需要遍历数据，并将每个元素追加到对应分组。如果不使用 `defaultdict`，也可以通过普通字典配合显式判断或 `setdefault` 实现相同逻辑。

下面对比三种写法：

::: code-tabs
@tab 普通字典
```python
items = [
    {"name": "苹果", "category": "水果"},
    {"name": "香蕉", "category": "水果"},
    {"name": "白菜", "category": "蔬菜"},
]

grouped = {}
for item in items:
    category = item["category"]
    if category not in grouped:
        grouped[category] = []  # 第一次遇到分组键时创建空列表
    grouped[category].append(item)  # 将元素追加到对应分组
```
@tab setdefault
```python
items = [
    {"name": "苹果", "category": "水果"},
    {"name": "香蕉", "category": "水果"},
    {"name": "白菜", "category": "蔬菜"},
]

grouped = {}
for item in items:
    # 缺少分组键时创建空列表，再将元素追加到对应分组。
    grouped.setdefault(item["category"], []).append(item)
```
@tab defaultdict
```python
from collections import defaultdict

items = [
    {"name": "苹果", "category": "水果"},
    {"name": "香蕉", "category": "水果"},
    {"name": "白菜", "category": "蔬菜"},
]

grouped = defaultdict(list)  # 为每个新分组键自动创建一个空列表
for item in items:
    grouped[item["category"]].append(item)  # 将元素追加到对应分组
```
:::


::: warning Stream 的版本与生命周期
- `Stream.toList()` 仅 Java 16+，且返回不可修改列表
- Java 8+ 的通用写法是 `collect(Collectors.toList())`
- `IntStream`、`LongStream`、`DoubleStream` 没有引用流的 `toList()`，需要先 `boxed()`

Stream 的终结操作只能执行一次；不要在调用 `anyMatch` 后继续使用同一个 `stream`，每个终结操作都应重新创建 Stream。
:::

#### 规约

|操作|Java Stream|JavaScript数组|Python列表|
|----|----|----|----|
|从左向右规约|`stream.reduce(identity, accumulator)`|`arr.reduce((total, value) => total + value, identity)`|`from functools import reduce`<br>`reduce(accumulator, arr, identity)`|
|从右向左处理|/|`arr.reduceRight((total, value) => total + value, identity)`|`reduce(accumulator, reversed(arr), identity)`|

::: warning 空集合上的规约行为
- Java 不提供初始值时返回 `Optional<T>` 或对应的 `OptionalInt/OptionalLong/OptionalDouble`
- JavaScript 无初始值的空数组 `reduce/reduceRight` 会抛异常
- Python 无 `initializer` 的空序列 `reduce` 会抛 `TypeError`。
:::

::: warning 右折叠的参数顺序
JavaScript 的 `reduceRight` 和 Python 的 `reversed(arr)` 都是从右向左处理元素，但不会自动提供传统 `f(value, accumulator)` 形式的右折叠；如果需要这种形式，应明确交换 accumulator 的参数。
:::

## 栈、队列与优先队列

数组/List 表中的插入和删除是序列操作；当需求明确要求“后进先出”“先进先出”或“按优先级取出”时，应使用相应的抽象数据结构。JavaScript 和 Python 没有与 Java 集合接口完全同构的标准类型，下面对照的是常见实现。

### 栈：后进先出（LIFO）

|操作|Java `Deque`|JavaScript Array|Python list|
|----|----|----|----|
|创建|`Deque<Integer> stack = new ArrayDeque<>();`|`const stack = [];`|`stack = []`|
|压栈|`stack.push(value)`|`stack.push(value)`|`stack.append(value)`|
|弹栈并返回|`stack.pop()`|`stack.pop()`|`stack.pop()`|
|查看栈顶|`stack.peek()`|`stack[stack.length - 1]`|`stack[-1]`|

::: tip 栈的实现选择
Java 推荐使用 `Deque`/`ArrayDeque`，不建议把遗留的 `Stack` 作为首选。Python `list.append/pop()` 适合只在尾部操作。
:::

::: warning 空栈行为
空栈时 Java `pop`、Python `pop` 会抛异常，JavaScript `pop` 返回 `undefined`。
:::

### 队列：先进先出（FIFO）

|操作|Java `Deque`|JavaScript Array|Python `collections.deque`|
|----|----|----|----|
|创建|`Deque<Integer> queue = new ArrayDeque<>();`|`const queue = [];`|`from collections import deque`<br>`queue = deque()`|
|入队|`queue.offer(value)`|`queue.push(value)`|`queue.append(value)`|
|出队并返回|`queue.poll()`|`queue.shift()`|`queue.popleft()`|
|查看队首|`queue.peek()`|`queue[0]`|`queue[0]`|

::: warning 队列的头部操作复杂度
JavaScript `shift()` 和 Python `list.pop(0)` 需要移动后续元素，反复头部操作通常为 O(n)；高频队列操作应使用 Java `ArrayDeque` 或 Python `collections.deque`。Java `poll()` 和 Python `popleft()` 在空队列时分别返回 `null` 和抛 `IndexError`，JavaScript `shift()` 返回 `undefined`。
:::

### 优先队列：按优先级取出

|操作|Java `PriorityQueue`|JavaScript|Python `heapq`|
|----|----|----|----|
|创建|`PriorityQueue<Integer> queue = new PriorityQueue<>();`|没有内置通用优先队列|`import heapq`<br>`heap = []`<br>`heapq.heapify_max(heap)`<Tip>Python 3.14+</Tip>|
|插入|`queue.offer(value)`|需要自行实现堆或使用第三方库|`heapq.heappush(heap, value)`<br>`heapq.heappush_max(heap, value)`<Tip>Python 3.14+</Tip>|
|取出堆顶元素（默认最小值优先）|`queue.poll()`|需要自行实现|`heapq.heappop(heap)`<br>`heapq.heappop_max(heap)`<Tip>Python 3.14+</Tip>|
|查看堆顶元素（默认最小值）|`queue.peek()`|需要自行实现|`heap[0]`<br>`heap[0]`（最大堆，Python 3.14+）|

::: warning 优先级方向
- **Java `PriorityQueue`**：默认是最小堆，优先取出较小的元素；可通过 `new PriorityQueue<>(Comparator.reverseOrder())` 构造最大堆。
- **Python `heapq`**：默认是最小堆，优先取出较小的元素。
- **Python 最大堆**：Python 3.14+ 可使用 `heapq.heapify_max`、`heapq.heappush_max`、`heapq.heappop_max` 等 API；旧版本常用存入负值模拟最大堆。
:::

::: warning 优先队列的迭代顺序
优先队列内部通常使用堆结构，只保证堆顶是当前最高优先级元素，不保证从头到尾按优先级整体有序。需要按优先级依次取出时，应反复执行 `poll()`、`heappop()` 等取出操作，而不是直接遍历优先队列。
:::

::: tip 堆操作复杂度
二叉堆插入和删除堆顶通常为 O(log n)，查看堆顶为 O(1)。
:::

## Set

### 基本操作

|操作|Java Set|JavaScript Set|Python Set|
|----|----|----|----|
|创建集合|`new HashSet<>()`<Tip>无序</Tip><br>`new LinkedHashSet<>()`<Tip>按插入顺序</Tip><br>`new TreeSet<>()`<Tip>按自然顺序或自定义顺序</Tip>|`new Set(iterable)`|`set()`<br>`{1, 2}`|
|添加元素|`set.add(value)`<br>`set.addAll(collection)`|`set.add(value)`|`set.add(value)`<br>`set.update(iterable)`|
|删除元素|`set.remove(value)`<br>`set.removeAll(collection)`|`set.delete(value)`|`set.remove(value)`<br>`set.discard(value)`|
|判断元素是否存在|`set.contains(value)`<br>`set.containsAll(collection)`|`set.has(value)`|`value in set`|
|清空集合|`set.clear()`|`set.clear()`|`set.clear()`|
|查询长度|`set.size()`|`set.size`|`len(set)`|
|是否为空|`set.isEmpty()`|`set.size === 0`|`not set`|
|遍历|`set.forEach(value -> ...)`|`for (const value of set) { ... }`|`for value in set:`|
|转为数组/列表|`new ArrayList<>(set)`|`Array.from(set)`|`list(set)`|

::: tip Java Set 的实现
- `HashSet`：无序，允许一个 `null` 元素。
- `LinkedHashSet`：按插入顺序遍历，允许一个 `null` 元素。
- `TreeSet`：按自然顺序或 `Comparator` 排序，通常不接受 `null`。
- JavaScript Set 对对象按引用判断。
:::

::: warning Set 元素的限制
Python Set 元素必须可哈希。
:::

### 集合运算

|操作|Java Set|JavaScript Set|Python Set|
|----|----|----|----|
|交集|`Set<T> result = new HashSet<>(set1);`<br>`result.retainAll(set2);`|`set1.intersection(set2)`<Tip>ES2025+</Tip>|`set1.intersection(set2)`<br>`set1 & set2`|
|交集更新|`set1.retainAll(set2)`|/|`set1.intersection_update(set2)`|
|并集|`Set<T> result = new HashSet<>(set1);`<br>`result.addAll(set2);`|`set1.union(set2)`<Tip>ES2025+</Tip>|`set1.union(set2)`<br><code>set1 &#124; set2</code>|
|并集更新|`set1.addAll(set2)`|/|`set1.update(set2)`|
|差集|`Set<T> result = new HashSet<>(set1);`<br>`result.removeAll(set2);`|`set1.difference(set2)`<Tip>ES2025+</Tip>|`set1.difference(set2)`<br>`set1 - set2`|
|差集更新|`set1.removeAll(set2)`|/|`set1.difference_update(set2)`|
|对称差集|组合 `addAll`、`retainAll`、`removeAll` 实现|`set1.symmetricDifference(set2)`<Tip>ES2025+</Tip>|`set1.symmetric_difference(set2)`<br>`set1 ^ set2`|
|子集|`set2.containsAll(set1)`|`set1.isSubsetOf(set2)`<Tip>ES2025+</Tip>|`set1.issubset(set2)`<br>`set1 <= set2`|
|超集|`set1.containsAll(set2)`|`set1.isSupersetOf(set2)`<Tip>ES2025+</Tip>|`set1.issuperset(set2)`<br>`set1 >= set2`|
|不相交|`Collections.disjoint(set1, set2)`|`set1.isDisjointFrom(set2)`<Tip>ES2025+</Tip>|`set1.isdisjoint(set2)`|
|判断集合相等|`set1.equals(set2)`|`set1.size === set2.size && [...set1].every(value => set2.has(value))`|`set1 == set2`|
|浅拷贝|`new HashSet<>(set)`|`new Set(set)`|`set.copy()`|

::: warning 集合运算的修改语义
- **Java：运算方法会修改调用者**。`retainAll`、`addAll`、`removeAll` 等方法直接修改调用它们的集合。如果不想修改原集合，需要先复制一份，再对副本执行运算：

  ```java
  Set<T> result = new HashSet<>(set1);  // 先复制，保留 set1
  result.retainAll(set2);               // 对副本求交集
  ```

- **JavaScript：集合运算方法不会修改原集合**。`intersection()`、`union()`、`difference()` 等方法会返回新集合；如果想把结果写回 `set1`，需要先清空原集合，再将结果中的元素添加回去：

  ```javascript
  const result = set1.intersection(set2); // 计算交集，不修改 set1 和 set2
  set1.clear();                           // 清空 set1
  result.forEach(value => set1.add(value)); // 将结果写回 set1
  ```

- **Python：同时提供两类方法**。`&`、`intersection()` 等方法返回新集合；`intersection_update()`、`update()`、`difference_update()` 等方法修改原集合：

  ```python
  result = set1 & set2       # 返回新集合，不修改 set1
  set1.intersection_update(set2)  # 修改 set1
  ```
:::

::: warning Set 删除返回值与关系判断
- **Java `Set.remove`**：删除不存在的元素返回 `false`。
- **JavaScript `Set.delete`**：返回布尔值，表示是否成功删除。
- **Python `set.remove`**：删除不存在的元素抛出 `KeyError`；`set.discard` 删除不存在的元素时不抛异常。
- **集合关系判断**：子集和超集判断是非严格关系，集合相等时也会返回真。
:::

## Map / 字典

Java 的 `Map`、JavaScript 的 `Map` 和 Python 的 `dict` 都以键值对存储数据，通常通过键查找值；但键的相等规则、空值、返回对象和顺序语义并不完全相同。

### 基本操作

|操作|Java Map|JavaScript Map|Python dict|
|----|----|----|----|
|创建集合|`new HashMap<>()`<Tip>无序</Tip><br>`new LinkedHashMap<>()`<Tip>按插入顺序</Tip><br>`Map.of(key, value)`<Tip>Java 9+，不可变</Tip>|`new Map()`<br>`new Map(entries)`|`{}`<br>`dict()`<br>`{key: value}`|
|添加或修改键值|`map.put(key, value)`|`map.set(key, value)`|`mapping[key] = value`|
|批量添加|`map.putAll(otherMap)`|`otherMap.forEach((value, key) => map.set(key, value))`|`mapping.update(other_mapping)`|
|获取值|`map.get(key)`|`map.get(key)`|`mapping.get(key)`<br>`mapping[key]`|
|获取默认值|`map.getOrDefault(key, defaultValue)`|/|`mapping.get(key, defaultValue)`|
|写入默认值|`map.putIfAbsent(key, defaultValue)`<Tip>已有 `null` 时会写入</Tip>|/|`mapping.setdefault(key, defaultValue)`<Tip>已有 `None` 时不会覆盖</Tip>|
|是否包含键|`map.containsKey(key)`|`map.has(key)`|`key in mapping`|
|是否包含值|`map.containsValue(value)`|`[...map.values()].includes(value)`|`value in mapping.values()`|
|删除键值|`map.remove(key)`|`map.delete(key)`|`mapping.pop(key)`<br>`del mapping[key]`|
|获取所有键|`map.keySet()`|`map.keys()`|`mapping.keys()`|
|获取所有值|`map.values()`|`map.values()`|`mapping.values()`|
|获取所有键值对|`map.entrySet()`|`map.entries()`|`mapping.items()`|
|清空集合|`map.clear()`|`map.clear()`|`mapping.clear()`|
|查询长度|`map.size()`|`map.size`|`len(mapping)`|
|是否为空|`map.isEmpty()`|`map.size === 0`|`not mapping`|
|遍历键值|`map.forEach((key, value) -> ...)`|`map.forEach((value, key) => ...)`|`for key, value in mapping.items():`|
|按键计算/累积|`map.computeIfAbsent(key, k -> new ArrayList<>())`<br>`map.merge(key, value, operator)`|显式判断或使用 `??=`|`from collections import defaultdict`<br>`defaultdict` / `setdefault`|
|按值替换|`map.replaceAll((key, value) -> newValue)`|`map.forEach((value, key) => map.set(key, newValue))`|`mapping.update(...)`|

::: tip Java Map 的实现
- `HashMap`：无序，允许一个 `null` 键和多个 `null` 值。
- `LinkedHashMap`：按插入顺序遍历，允许 `null` 键和值。
- `Map.of`：不可变，不允许 `null` 键和值。
:::

::: warning Map 空值与缺少键
- **空值**
  - Java `get` 不能仅凭返回值区分“键不存在”和“键存在但值为 `null`”；`getOrDefault` 对缺失键返回 `defaultValue`、对已映射 `null` 返回 `null`，但真实值可能等于 `defaultValue` 时仍不能仅凭返回结果判断。
  - JavaScript `get` 也不能区分缺失键与显式存储的 `undefined`。
  - Python `get` 不能区分缺失键与实际存储的 `None`。需要分别配合 `containsKey`、`has`、`in`。
- **缺少键**
  - Python `mapping[key]` 和 `mapping.pop(key)` 缺少键时抛 `KeyError`，需要默认值时写 `mapping.get(key, default)` 或 `mapping.pop(key, default)`。
  - Java `remove` 返回旧值，旧值为 `null` 时也不能仅凭返回值判断键是否存在。
:::
::: warning Map 视图与按值查找复杂度
Java 的 `keySet()`、`values()`、`entrySet()` 和 Python 的 `keys()`、`values()`、`items()` 都是与映射关联的视图；JavaScript 的 `keys()`、`values()`、`entries()` 返回迭代器。需要独立数组/列表时分别复制，例如 `new ArrayList<>(map.keySet())`、`[...map.keys()]`、`list(mapping.keys())`。

按键查找通常是哈希实现下的平均 O(1)，按值查找通常要扫描全部值，为 O(n)。JavaScript 的 `includes` 使用 SameValueZero；Java 主要依据 `equals`，Python 依据对象的相等和哈希规则，三者对 `NaN`、对象和自定义类型不一定等价。
:::

## 总结

- 数组/List 适合按位置访问；频繁头部操作应考虑 `Deque` 或 `collections.deque`。
- 栈关注后进先出，队列关注先进先出，优先队列按优先级取出元素；不要只因 API 名称相似就把三者当成同一种容器。
- Java Stream、JavaScript Array 方法和 Python 推导式都能表达变换，但元素类型、空值、可变性、异常和版本边界需要单独确认。
- Set 和 Map 的对象相等、空值、顺序、视图及迭代器语义存在差异；跨语言迁移时应以目标语言的实际 API 契约为准。
