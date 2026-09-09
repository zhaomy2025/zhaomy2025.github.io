增强 Java 编程语言，使其能够简洁地导入某个模块所导出的所有包。这简化了模块化库的重用，且调用方代码自身不必是模块化的。这是一项预览语言特性。

**使用新特性导入整个模块**
假设有一个名为 com.example.utils 的模块，其 module-info.java 文件导出了了一些包：

```java
// module-info.java
module com.example.utils {
  exports com.example.utils.math;
  exports com.example.utils.logging;
}
```

在另一个非模块化的应用程序（即没有 module-info.java）中，现在可以使用一种新的导入语句来一次性导入 com.example.utils 模块导出的所有包。
```java
// 使用 'import module' 关键字一次性导入整个模块的所有导出包
import module com.example.utils.*;

public class MyApp {
  public static void main(String[] args) {
    // 现在可以直接使用被导入模块中所有导出包下的类，而无需逐个导入
    // 来自 com.example.utils.math 包
    Calculator calc = new Calculator();
    double result = calc.add(5, 3.14);

    // 来自 com.example.utils.logging 包
    Logger logger = new Logger();
    logger.info("Result is: " + result);
  }
}
```

**与之前方式的对比**

+ 方式一（传统非模块化项目）： 必须逐个导入所需的每个类或包。
  ```java
  import com.example.utils.math.Calculator;
  import com.example.utils.logging.Logger;
  // ... 还需要导入其他要用的类 ...
  ```
+ 方式二（模块化项目）： 即使只想用一两个类，也必须在自己的 module-info.java 中声明对整个模块的依赖。
  ::: code-tabs
  @tab module-info.java
  ```java
  module my.app {
    requires com.example.utils;
    // ... 其他依赖 ...
  }
  ```
  @tab MyApp.java
  ```java
  import com.example.utils..math.Calculator;
  ```
  :::
+ 使用新特性后的方式（简洁且无需模块化）：
  - 无需自身的 module-info.java。
  - 一行语句 import module com.example.utils.*; 即可获得该模块所有导出包的访问权，无需再写多个 import 语句。
