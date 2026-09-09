---
title: MyBatis-Plus代码自动生成
date: 2025-06-25T00:46:34.683Z
category:
  - java
  - orm
  - mybatis-plus-code-generator
tags:
  - java
  - orm
  - mybatis-plus-code-generator
---

# MyBatis-Plus代码自动生成
[[toc]]

::: tip
mybatis-plus-generator 3.5.1 及其以上版本，对历史版本不兼容！
:::
## 添加依赖
```xml
<dependency>
    <groupId>com.baomidou</groupId>
    <artifactId>mybatis-plus-boot-starter</artifactId>
    <version>3.5.1</version>
</dependency>
<dependency>
    <groupId>com.baomidou</groupId>
    <artifactId>mybatis-plus-generator</artifactId>
    <version>3.5.2</version>
</dependency>
<dependency>
    <groupId>org.apache.velocity</groupId>
    <artifactId>velocity-engine-core</artifactId>
    <version>2.0</version>
</dependency>
```

## 代码生成配置
```java
import com.baomidou.mybatisplus.generator.FastAutoGenerator;
import com.baomidou.mybatisplus.generator.config.OutputFile;
import com.baomidou.mybatisplus.generator.config.rules.NamingStrategy;
import org.apache.commons.lang.StringUtils;

import java.util.*;

public class Generator {

    private static final String DATASOURCE_URL = "jdbc:oracle:thin:@localhost:1521/orcl";
    private static final String USERNAME = "username";
    private static final String PASSWORD = "password";
    private static final String MODULE_NAME = "system.config";
    private static final String BASE_PATH = "D:/workspace/mybatisplus-demo/";
    private static final String RESOURCE_PATH = BASE_PATH + "/src/main/resources/";
    private static final String PACKAGE_PATH = "zmy/mybatisplus/gencode";
    private static final String SERVICE_CONTROLLER_PATH = BASE_PATH+"src/main/java/"+PACKAGE_PATH;

    private static final String PARENT_PATH = "x.y.z";

    //EDIT
    private static final String AUTHOR = "zhaomy";

    //EDIT
    private static final List<String> TABLES = new ArrayList<>(Arrays.asList("USER"));

    private static String ENTITY_SPOT_PATH      = "entity"+(StringUtils.isEmpty(MODULE_NAME)? "" : "."+MODULE_NAME);
    private static String MAPPER_SPOT_PATH      = "mapper"+(StringUtils.isEmpty(MODULE_NAME)? "" : "."+MODULE_NAME);
    private static String SERVICE_SPOT_PATH     = "service"+(StringUtils.isEmpty(MODULE_NAME)? "" : "."+MODULE_NAME);
    private static String IMPL_SPOT_PATH        = "service"+(StringUtils.isEmpty(MODULE_NAME)? "" : "."+MODULE_NAME)+".impl";
    private static String CONTROLLER_SPOT_PATH  = "controller"+(StringUtils.isEmpty(MODULE_NAME)? "" : "."+MODULE_NAME);
    private static final Map<OutputFile, String> outputMap = new HashMap<>();

    static {
        outputMap.put(OutputFile.xml,           RESOURCE_PATH           + PACKAGE_PATH + MAPPER_SPOT_PATH.replace(".", "/"));
        outputMap.put(OutputFile.entity,        SERVICE_CONTROLLER_PATH + PACKAGE_PATH + ENTITY_SPOT_PATH.replace(".", "/"));
        outputMap.put(OutputFile.mapper,        SERVICE_CONTROLLER_PATH + PACKAGE_PATH + MAPPER_SPOT_PATH.replace(".", "/"));
        outputMap.put(OutputFile.service,       SERVICE_CONTROLLER_PATH + SERVICE_SPOT_PATH.replace(".", "/"));
        outputMap.put(OutputFile.serviceImpl,   SERVICE_CONTROLLER_PATH + IMPL_SPOT_PATH.replace(".", "/"));
        outputMap.put(OutputFile.controller,    SERVICE_CONTROLLER_PATH + CONTROLLER_SPOT_PATH.replace(".", "/"));
    }

    public static void main(String[] args) {
        //1、配置数据源
        FastAutoGenerator.create(DATASOURCE_URL, USERNAME, PASSWORD)
                //2、全局配置
                .globalConfig(builder -> 
                    builder.disableOpenDir() // 禁止打开输出目录 默认 true
                            //.outputDir(OUTPUT_PATH + "java")   // 设置输出路径：项目的 java 目录下
                            .author(AUTHOR)// 设置作者
                            // .enableKotlin() //开启 kotlin 模式 默认false
                            .enableSwagger()   // 开启 swagger 模式 默认false
                            //.dateType(DateType.TIME_PACK)   // 定义生成的实体类中日期的类型 TIME_PACK=LocalDateTime;ONLY_DATE=Date;
                            //.commentDate("yyyy/MM/dd");
                )
                //3、包配置
                .packageConfig(builder -> 
                    builder.parent(PARENT_PATH) // 父包名 默认值 com.baomidou
                            .moduleName(MODULE_NAME)   // 父包模块名 默认值 无
                            .entity(ENTITY_SPOT_PATH)   // Entity 包名 默认值 entity
                            .mapper(MAPPER_SPOT_PATH)   // Mapper 包名 默认值 mapper
                            .xml(MAPPER_SPOT_PATH)  // Mapper XML 包名 默认值 mapper.xml
                            .service(SERVICE_SPOT_PATH) //Service 包名 默认值 service
                            .serviceImpl(IMPL_SPOT_PATH) // Service Impl 包名 默认值:service.impl
                            .controller(CONTROLLER_SPOT_PATH) // Controller 包名 默认值 controller
                            .pathInfo(outputMap)    //配置输出目录
                )
                //4、模版配置
                .templateConfig(builder -> {
                    builder.entity("/template/entity.java")
                            .service("/template/service.java")
                            .serviceImpl("/template/serviceImpl.java")
                            .mapper("/template/mapper.java")
                            .xml("/template/mapper.xml")
                            .controller("/template/controller.java");

                })
                //5、策略配置
                .strategyConfig(builder -> 
                    builder.addInclude(TABLES) // 设置需要生成的数据表名
                            .addTablePrefix("t_", "ts_", "sys_") // 设置过滤表前缀
                            //5.1、实体类策略配置
                            .entityBuilder()
                            .enableFileOverride() // 覆盖entity
                            //.disableSerialVersionUID()  // 禁用生成 serialVersionUID 默认值 true
                            .enableLombok() // 开启 Lombok 默认值:false
                            .enableTableFieldAnnotation()       // 开启生成实体时生成字段注解 默认值 false
                            .logicDeleteColumnName("deleted")   // 逻辑删除字段名
                            .naming(NamingStrategy.underline_to_camel)  //数据库表映射到实体的命名策略：下划线转驼峰命
                            .columnNaming(NamingStrategy.underline_to_camel)    // 数据库表字段映射到实体的命名策略：下划线转驼峰命
                            .formatFileName("%s")

                            //5.2、Mapper策略配置
                            .mapperBuilder()
                            .enableFileOverride() // 覆盖mapper
                            .mapperAnnotation(org.apache.ibatis.annotations.Mapper.class)      // 开启 @Mapper 注解
                            // .enableBaseResultMap() //启用 BaseResultMap 生成
                            .formatMapperFileName("%sMapper")   // 格式化 mapper 文件名称
                            .formatXmlFileName("%sMapper") // 格式化 Xml 文件名称

                            //5.3、service 策略配置
                            .serviceBuilder()
                            .enableFileOverride() // 覆盖service
                            .formatServiceFileName("I%sService") // 格式化 service 接口文件名称，%s进行匹配表名，如 UserService
                            .formatServiceImplFileName("%sServiceImpl") // 格式化 service 实现类文件名称，%s进行匹配表名，如 UserServiceImpl

                            //5.4、Controller策略配置
                            .controllerBuilder()
                            .enableFileOverride() // 覆盖controller
                            .enableRestStyle()  // 开启生成 @RestController 控制器
                            //.enableHyphenStyle() //开启驼峰转连字符 默认false
                            .formatFileName("%sController") // 格式化 Controller 类文件名称，%s进行匹配表名，如 UserController

                )
//                //6、自定义配置
//                .injectionConfig(consumer -> {
//                    Map<String, Object> customMap = new HashMap<>();
//                    customMap.put("dto", PARENT_PATH + ".dto");
//                    customMap.put("create", PARENT_PATH + ".vo.create");
//                    customMap.put("update", PARENT_PATH + ".vo.update");
//                    customMap.put("vo", PARENT_PATH + ".vo");
//                    customMap.put("page", PARENT_PATH + ".vo.page");
//                    customMap.put("convert", PARENT_PATH + ".convert");
//
//                    consumer.customMap(customMap);
//                    // DTO
//                    List<CustomFile> customFiles = new ArrayList<>();
//                    customFiles.add(new CustomFile.Builder().packageName("dto").fileName("DTO.java")
//                            .templatePath("/templates/dto/DTO.java.vm").enableFileOverride().build());
//                    customFiles.add(new CustomFile.Builder().packageName("vo/create").fileName("CreateVO.java")
//                            .templatePath("/templates/vo/CreateVO.java.vm").enableFileOverride().build());
//                    customFiles.add(new CustomFile.Builder().packageName("vo/update").fileName("UpdateVO.java")
//                            .templatePath("/templates/vo/UpdateVO.java.vm").enableFileOverride().build());
//                    customFiles.add(new CustomFile.Builder().packageName("vo").fileName("VO.java")
//                            .templatePath("/templates/vo/VO.java.vm").enableFileOverride().build());
//                    customFiles.add(new CustomFile.Builder().packageName("vo/page").fileName("PageVO.java")
//                            .templatePath("/templates/vo/PageVO.java.vm").enableFileOverride().build());
//                    customFiles.add(new CustomFile.Builder().packageName("convert").fileName("Convert.java")
//                            .templatePath("/templates/convert/Convert.java.vm").enableFileOverride().build());
//                    consumer.customFile(customFiles);
//                })
//                //7、模板
//                .templateEngine(new VelocityTemplateEngine())
//
//                /*
//                    .templateEngine(new VelocityTemplateEngine())
//                    .templateEngine(new FreemarkerTemplateEngine())
//                    .templateEngine(new BeetlTemplateEngine())
//                */

                //8、执行
                .execute();
    }
}

```

## 代码生成基本原理
1. `FastAutoGenerator.create(DATASOURCE_URL, USERNAME, PASSWORD)`会创建一个`FastAutoGenerator `并初始化`dataSourceConfigBuilder`等Builder对象。
2. 通过`xxxConfig()`方法设置配置，比如`globalConfig()`设置全局配置，`packageConfig()`设置包配置等。
3. 通过`templateEngine()`设置模板引擎，默认使用`VelocityTemplateEngine`。
4. `execute()`方法执行代码生成。
  1. 首先使用`dataSourceConfigBuilder`构建`DataSourceConfig`对象
  2. 然后使用`DataSourceConfig`对象构建`AutoGenerator`对象
  3. 之后通过builder注入各种配置
  4. 最后调用`AutoGenerator`对象的`execute()`方法执行代码生成

::: code-tabs

@tab 1. FastAutoGenerator::create
```java
    private FastAutoGenerator(Builder dataSourceConfigBuilder) {
        this.scanner = new Scanner(System.in);
        this.dataSourceConfigBuilder = dataSourceConfigBuilder;
        this.globalConfigBuilder = new com.baomidou.mybatisplus.generator.config.GlobalConfig.Builder();
        this.packageConfigBuilder = new com.baomidou.mybatisplus.generator.config.PackageConfig.Builder();
        this.strategyConfigBuilder = new com.baomidou.mybatisplus.generator.config.StrategyConfig.Builder();
        this.injectionConfigBuilder = new com.baomidou.mybatisplus.generator.config.InjectionConfig.Builder();
        this.templateConfigBuilder = new com.baomidou.mybatisplus.generator.config.TemplateConfig.Builder();
    }

    public static FastAutoGenerator create(@NotNull String url, String username, String password) {
        return new FastAutoGenerator(new Builder(url, username, password));
    }
```

@tab 4. FastAutoGenerator::execute
```java
public void execute() {
        (new AutoGenerator(this.dataSourceConfigBuilder.build()))
               .global(this.globalConfigBuilder.build())
               .packageInfo(this.packageConfigBuilder.build())
               .strategy(this.strategyConfigBuilder.build())
               .injection(this.injectionConfigBuilder.build())
               .template(this.templateConfigBuilder.build())
            .execute(this.templateEngine);
    }
```

:::

### AutoGenerator::execute
1. 首先初始化配置
   1. 若`config`为空则构建`ConfigBuilder`对象，否则使用传入的`config`对象
   2. 若模板引擎为空则构建`VelocityTemplateEngine`对象
   3. 调用`AbstractTemplateEngine::setConfigBuilder()`配置模板引擎
2. 然后调用`templateEngine`的`init()`方法初始化模板引擎
3. 然后调用`templateEngine`的`batchOutput()`方法批量输出文件
   1. 调用`ConfigBuilder::getTableInfoList()`方法获取表信息
   2. 调用`AbstractTemplateEngine::getObjectMap()`方法单个表的详细信息
   3. 调用`AbstractTemplateEngine::outputXxx()`方法输出文件
4. 最后调用`templateEngine`的`open()`方法打开输出目录

::: code-tabs

@tab AutoGenerator::execute
```java
    public void execute(AbstractTemplateEngine templateEngine) {
        logger.debug("==========================准备生成文件...==========================");
        // 初始化配置
        if (null == this.config) {
            this.config = new ConfigBuilder(this.packageInfo, this.dataSource, this.strategy, this.template, this.globalConfig, this.injection);
        }

        if (null == templateEngine) {
            templateEngine = new VelocityTemplateEngine();
        }

        ((AbstractTemplateEngine)templateEngine).setConfigBuilder(this.config);
        // 模板引擎初始化执行文件输出
        ((AbstractTemplateEngine)templateEngine).init(this.config).batchOutput().open();
        logger.debug("==========================文件生成完成！！！==========================");
    }
```

@tab 3. AbstractTemplateEngine::batchOutput
```java
/**
 * 批量输出文件
 */
@NotNull
public AbstractTemplateEngine batchOutput() {
    try {
        ConfigBuilder config = this.getConfigBuilder();
        List<TableInfo> tableInfoList = config.getTableInfoList();
        tableInfoList.forEach((tableInfo) -> {
            Map<String, Object> objectMap = this.getObjectMap(config, tableInfo);
            Optional.ofNullable(config.getInjectionConfig()).ifPresent((t) -> {
                t.beforeOutputFile(tableInfo, objectMap);
                this.outputCustomFile(t.getCustomFiles(), tableInfo, objectMap);
            });
            // entity
            this.outputEntity(tableInfo, objectMap);
            // mapper xml
            this.outputMapper(tableInfo, objectMap);
            // service
            this.outputService(tableInfo, objectMap);
            // controller
            this.outputController(tableInfo, objectMap);
        });
        return this;
    } catch (Exception var3) {
        throw new RuntimeException("无法创建文件，请检查配置信息！", var3);
    }
}
```

@tab 3.1 ConfigBuilder::getTableInfoList
```java
@NotNull
public List<TableInfo> getTableInfoList() {
    if (this.tableInfoList.isEmpty()) {
        List<TableInfo> tableInfos = this.databaseQuery.queryTables();
        if (!tableInfos.isEmpty()) {
            this.tableInfoList.addAll(tableInfos);
        }
    }

    return this.tableInfoList;
}
```

@tab 3.2 AbstractTemplateEngine::getObjectMap
```java
@NotNull
public Map<String, Object> getObjectMap(@NotNull ConfigBuilder config, @NotNull TableInfo tableInfo) {
    StrategyConfig strategyConfig = config.getStrategyConfig();
    Map<String, Object> controllerData = strategyConfig.controller().renderData(tableInfo);
    Map<String, Object> objectMap = new HashMap(controllerData);
    Map<String, Object> mapperData = strategyConfig.mapper().renderData(tableInfo);
    objectMap.putAll(mapperData);
    Map<String, Object> serviceData = strategyConfig.service().renderData(tableInfo);
    objectMap.putAll(serviceData);
    Map<String, Object> entityData = strategyConfig.entity().renderData(tableInfo);
    objectMap.putAll(entityData);
    objectMap.put("config", config);
    objectMap.put("package", config.getPackageConfig().getPackageInfo());
    GlobalConfig globalConfig = config.getGlobalConfig();
    objectMap.put("author", globalConfig.getAuthor());
    objectMap.put("kotlin", globalConfig.isKotlin());
    objectMap.put("swagger", globalConfig.isSwagger());
    objectMap.put("springdoc", globalConfig.isSpringdoc());
    objectMap.put("date", globalConfig.getCommentDate());
    String schemaName = "";
    if (strategyConfig.isEnableSchema()) {
        schemaName = config.getDataSourceConfig().getSchemaName();
        if (StringUtils.isNotBlank(schemaName)) {
            schemaName = schemaName + ".";
            tableInfo.setConvert(true);
        }
    }

    objectMap.put("schemaName", schemaName);
    objectMap.put("table", tableInfo);
    objectMap.put("entity", tableInfo.getEntityName());
    return objectMap;
}

```
:::