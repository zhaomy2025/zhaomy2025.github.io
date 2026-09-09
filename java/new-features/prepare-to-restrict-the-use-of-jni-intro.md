### 核心目标

JEP 472的主要目标包括：
+ 保持JNI地位：继续保持JNI作为与本地代码互操作的标准方式的地位。
+ 准备生态系统：准备Java生态系统迎接未来的版本，默认不允许通过JNI或FFM API与本地代码互操作。自该版本起，应用程序开发者必须在启动时显式启用JNI和FFM API的使用。
+ 统一使用方式：统一JNI和FFM API的使用方式，使库维护者可以在两者之间迁移而无需应用程序开发者更改任何命令行选项。

### 动机与背景

JNI自JDK 1.1引入以来，一直是Java代码与本地代码（通常用C/C++编写）互操作的主要手段。但它也带来了显著的安全风险：
+ 未定义行为与崩溃：调用本地代码可能导致任意的未定义行为，包括JVM崩溃，且Java运行时无法阻止此类问题，也无法抛出可捕获的异常。
+ 内存安全风险：本地代码和Java代码经常通过直接字节缓冲区交换数据，这些区域不受JVM垃圾收集器管理。本地代码可能生成由无效内存区域支持的字节缓冲区，在Java代码中使用会引发未定义行为。
+ 绕过访问检查：本地代码可以使用JNI访问字段和调用方法，而不经过JVM的任何访问检查，甚至可以改变`final`字段的值，从而破坏其他Java代码的一致性。
+ 不良GC行为：不正确使用某些JNI函数（如`GetPrimitiveArrayCritical`和`GetStringCritical`）可能导致不良的垃圾回收行为。

JDK 22引入的外部函数与内存（FFM）API作为JNI的现代替代方案，虽然也面临类似风险，但其设计通过“受限方法”和要求开发者显式选择加入来缓解风险。JEP 472旨在使JNI遵循类似的安全范式，这是确保Java平台默认一致性（默认安全）的长期努力的一部分，其他相关举措包括移除`sun.misc.Unsafe`中的内存访问方法（JEP 471）和限制动态加载代理（JEP 451）。

### 核心变化

JEP 472的核心变化在于对JNI的“加载和链接本地库”操作施加本地访问限制（Native Access Restrictions），并与FFM API保持一致。

+ 受限操作：在JDK 24中，以下操作将默认触发警告（未来版本将抛出异常）：
  - 调用`System::loadLibrary`, `System::load`, `Runtime::loadLibrary`或`Runtime::load`。
  - 声明`native`方法。

+ 启用本地访问：应用程序开发者必须显式启用本地访问以避免警告和未来的异常。这可以通过以下方式实现：
  - 命令行选项：
    ```bash
    # 为类路径上的所有代码启用
    java --enable-native-access=ALL-UNNAMED -jar your_app.jar
    # 为模块路径上的特定模块启用
    java --enable-native-access=MODULE1,MODULE2 -jar your_app.jar
    ```
  -  参数文件：在 `config-file` 中写入 `--enable-native-access=ALL-UNNAMED`，然后运行 `java @config-file -jar myapp.jar`
  -  环境变量传递：`export JDK_JAVA_OPTIONS="--enable-native-access=ALL-UNNAMED"`，然后运行`java -jar myapp.jar`
  -  JAR清单属性：在可执行JAR的清单中添加`Enable-Native-Access: ALL-UNNAMED`。
  -  其他方式：如通过`jlink`定制运行时镜像时添加选项，或使用`ModuleLayer.Controller::enableNativeAccess`方法（其本身是受限方法）。

+ 控制限制效果：新的命令行选项`--illegal-native-access`用于控制违反限制时的行为：
  - `warn`（JDK 24默认）：允许操作但发出警告（每个模块最多一次）。
  - `deny`：抛出`IllegalCallerException`（未来版本的默认行为）。
  - `allow`：允许操作继续（未来版本会移除）。

### 未来计划

JEP 472是分阶段实施的长期计划的一部分：
+ JDK 24：默认行为是`--illegal-native-access=warn`，即发出警告。
+ 未来JDK版本：默认行为将变为`--illegal-native-access=deny`，即抛出异常，最终实现默认一致性。

### 重要说明

+ 不弃用JNI：JEP 472并非要弃用或移除JNI，也不是要限制本地代码本身的行为。所有本地JNI函数仍然可供本地代码使用。
+ 影响范围：此限制主要影响加载本地库和链接native方法的Java代码。仅调用其他模块中声明的`native`方法的代码本身不需要启用本地访问。
+ FFM API对齐：JNI和FFM API在本地访问限制上保持一致，简化了库的迁移和应用程序的配置。

### 总结

JEP 472是Java迈向“默认安全” 的重要一步。它通过引入对JNI使用的限制和警告，促使开发者更显式地管理本地代码访问，从而提升应用程序和Java平台整体的安全性和完整性。

虽然这增加了些许配置成本，但为构建更安全可靠的Java生态系统奠定了基础。对于开发者来说，关键是检查现有代码并适时添加`--enable-native-access`标志。