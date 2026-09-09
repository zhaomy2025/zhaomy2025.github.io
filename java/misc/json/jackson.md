---  
title: Jackson库详解  
date: 2025-06-18T06:57:41.938Z  
category:  
  - java  
  - jackson  
tags:  
  - java  
  - jackson  
---  
  
# Jackson库详解  
[[toc]]  
  
## 核心模块  
Jackson 主要由三个核心模块组成：  
1. jackson-core  核心流处理 API，提供了对JSON数据的完整支持，具有最低的开销和最快的读/写操作  
2. jackson-annotations  标准注解  
3. jackson-databind  数据绑定功能，依赖于 jackson-core 和 jackson-annotations  
  
## jackson-core
jackson-core提供了两种处理JSON的方式：
- 流式API：JsonParser读取数据，而JsonGenerator负责写入数据。
- 树模型：JSON文件在内存里以树形式表示。
  
::: tip
Spring MVC对JSON消息的转换器AbstractJackson2HttpMessageConverter它就用到了底层流式API -> JsonGenerator写数据。
:::

### 流式API
底层流式API一般面向“专业人士”，应用级开发使用高阶API ObjectMapper即可。使用步骤如下：
1. 使用JsonFactory工厂来创建JsonJsonParser和JsonGenerator实例
2. 使用JsonParser读取JSON数据，使用JsonGenerator写入JSON数据

---

对于JsonFactory的实例的创建共有三种方式：
1. 直接new实例
2. 使用JsonFactoryBuilder构建（需要2.10或以上版本）
3. SPI方式创建实例

---

使用JsonFactory工厂来创建JsonJsonParser实例，通过JsonJsonParser实例把一个JSON字符串的值解析到Person对象：
::: code-tabs#java
@tab 解析JSON字符串
```java
@Test
public void test1() throws IOException {
    String jsonStr = "{\"name\":\"YourBatman\",\"age\":18}";
    Person person = new Person();
    JsonFactory factory = new JsonFactory();
    try (JsonParser jsonParser = factory.createParser(jsonStr)) {
        while (jsonParser.nextToken() != JsonToken.END_OBJECT) {
            String fieldname = jsonParser.getCurrentName();
            if ("name".equals(fieldname)) {
                jsonParser.nextToken();
                person.setName(jsonParser.getText());
            } else if ("age".equals(fieldname)) {
                jsonParser.nextToken();
                person.setAge(jsonParser.getIntValue());
            }
        }        
        System.out.println(person);
    }
}
```

@tab Person
```java
@Data
public class Person {
    private String name;
    private Integer age;
}
```
:::

---

使用JsonFactory工厂来创建JsonGenerator实例，通过JsonGenerator实例把Person对象序列化为JSON字符串。
- JsonGenerator提供了writeFieldName()方法用于写JSON的key
- Java中的数据类型和JSON中的值类型并不是一一对应的关系，那么这就需要JsonGenerator在写入时起到一个桥梁（适配）作用
  + writeString() 写入字符串，包括String、Reader、char[]
  + writeNumber() 写入数字，除数字类型外，还包括String、char[]
  
::: code-tabs#java
@tab 序列化Person对象
```java
@Test
public void test2() throws IOException {
    JsonFactory factory = new JsonFactory();
    try (JsonGenerator jsonGenerator = factory.createGenerator(System.out, JsonEncoding.UTF8)) {
        jsonGenerator.writeStartObject();
        
        // 1、写字符串
        jsonGenerator.writeFieldName("name");
        jsonGenerator.writeString("test");

        // 2、写数组（记得先写key 否则无效）
        jsonGenerator.writeFieldName("objects");
        jsonGenerator.writeStartArray();
        
        // 2.1、写字符串
        jsonGenerator.writeString("String");
        
        // 2.2、写对象
        jsonGenerator.writeStartObject();
        jsonGenerator.writeStringField("name", "Alice");
        jsonGenerator.writeEndObject();
        
        // 2.3、写数字
        jsonGenerator.writeNumber(18);
        jsonGenerator.writeEndArray();

        // 3、快捷写入数组（从第index = 2位开始，取3个）
        jsonGenerator.writeFieldName("arrays");
        jsonGenerator.writeArray(new int[]{1, 2, 3, 4, 5, 6}, 2, 3);

        // 4、写布尔值
        jsonGenerator.writeFieldName("success");
        jsonGenerator.writeBoolean(true);
        
        // 5、写null值
        jsonGenerator.writeFieldName("null");
        jsonGenerator.writeNull();

        jsonGenerator.writeEndObject();
    }
}
```

@tab Person
```java
@Data
public class Person {
    private String name;
    private Integer age;
}
```
:::

### 树模型
- JsonNodeFactory  创建JsonNode实例
- JsonNode 
  + ValueNode 值类型节点
  + ContainerNode 容器类型节点
    * ObjectNode 类比Map，采用K-V结构存储。
    * ArrayNode 类比Collection、数组。里面可以放置任何节点
  

## jackson-annotations 
1. 序列化控制  
      1. 属性包含控制    
            - **@JsonInclude**  控制何时包含属性    
            - **@JsonIncludeProperties**  类级别控制包含哪些属性  
            - **@JsonIgnore**  忽略该属性  
            - **@JsonIgnoreProperties** 类级别忽略多个属性  
      1. 格式化控制    
            - **@JsonFormat**  格式化日期  
      1. 自定义序列化    
            - **@JsonSerialize**    
            - **@JsonValue**  自定义转换  
    
2. 反序列化控制  
      1. 构造与创建    
        - **@JsonCreator**  指定构造方法或工厂方法  
        - @JacksonInject  注入值  
      1. 内容处理    
        - @JsonAnySetter  处理未知属性  
      1. 自定义反序列化     
        - **@JsonDeserialize**    
  
3. 属性名控制    
      - **@JsonProperty**  指定属性名  
      - @JsonSetter  指定setter方法对应的JSON属性  
      - @JsonGetter  指定getter方法对应的JSON属性  
   
4. 展开属性    
    - **@JsonUnwrapped**  展开属性  
    
5. 类型处理    
      1. 多态类型处理    
        - @JsonTypeInfo  多态类型  
        - @JsonSubTypes  子类类型  
      1. 视图控制    
        - @JsonView  控制序列化视图    
    
6. 集合与引用处理    
      1. 集合处理    
        - @JsonFilter  过滤属性  
      1. 引用处理    
        - @JsonIdentityInfo  处理循环引用  
    
    
### @JsonInclude  控制何时包含属性
::: code-tabs#java  
@tab 修饰类  
```java  
@JsonInclude(JsonInclude.Include.NON_NULL)  
public class MyClass {  
    // 类定义  
}  
```  
@tab 修饰属性  
```java  
public class MyClass {  
    @JsonInclude(Include.NON_EMPTY)  
    private String name;  
}  
```  
:::  
可以定义在类、方法或字段上，优先级从高到低为：
1. 字段上的注解
2. 方法上的注解
3. 类上的注解
4. ObjectMapper 的全局配置  
---
Jackson 提供了多种包含规则，通过 JsonInclude.Include 枚举指定：  
  - ALWAYS  包含所有属性  
  - NON_NULL  只包含非null属性  
  - NON_ABSENT	属性值不为 null 或"absent"（如 Optional.empty()）时包含  
  - NON_EMPTY  只包含非空属性  
  - NON_DEFAULT  只包含非默认值属性  
  - CUSTOM  自定义规则  
---
最佳实践：  
  - 谨慎使用 NON_DEFAULT - 依赖于默认构造方法，可能造成混淆  
  - 优先使用类级别注解 - 保持一致性  
  - 考虑使用 @JsonIncludeProperties - Jackson 2.12+ 支持只包含特定属性  
  - 与 @JsonIgnore 配合使用：特别敏感的数据使用 @JsonIgnore  
  
### @JsonValue  自定义转换  
@JsonValue指定一个方法或字段作为类序列化的唯一表示形式。它提供了一种简洁高效的方式来控制对象如何被序列化为 JSON。具有以下特点：  
  - 标注在类的一个方法或字段上  
  - 被标注的元素返回值将作为整个对象的序列化结果  
  - 一个类只能有一个 @JsonValue 注解  
  - @JsonValue注解会覆盖其他序列化配置，但不影响反序列化  
  - 主要用于简化对象的序列化表示，常用于枚举和简单值对象的序列化控制  
---

注意事项：  
  - 为了完整支持双向转换，通常需要配合 @JsonCreator 实现反序列化  
  - 如果用于值对象，建议使类不可变  
  
### @JsonProperty  指定属性名  
Jaskson序列化时首字母或第二个字母为大写，序列化会有问题，可以使用@JsonProperty注解指定属性名。  
  
### @JsonDeserialize  自定义反序列化  
嵌套列表反序列化时，列表对象对应实际数据为JSON字符串，会导致反序列化失败，可以使用@JsonDeserialize注解指定自定义反序列化器。 
:::code-tabs#java  
@tab MyClass
```java
public class MyClass {
    private List<MyListItem> list;
}
public class MyClass {
    private String code;
    private String name;
}
}
```
@tab 自定义反序列化器
```java
public class MyDeserializer extends JsonDeserializer<List<?>> {
    @Override
    public List<?> deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
        // 
        Object fieldValue = p.readValueAs(Object.class);
        
        Class<T> targetType = List.class;
        
        if (fieldValue == null) {
            return null;
        }

        try {
            // 如果已经是目标类型直接返回
            if (targetType.isInstance(fieldValue)) {
                return targetType.cast(fieldValue);
            }

            // 如果是字符串但实际是JSON
            if (fieldValue instanceof String) {
                String strValue = (String) fieldValue;
                if (strValue.startsWith("{") || strValue.startsWith("[")) {
                    return mapper.readValue(strValue, targetType);
                }
            }

            // 默认转换
            return mapper.convertValue(fieldValue, targetType);
        } catch (Exception e) {
            throw new RuntimeException("转换嵌套字段失败", e);
        }
    }
}
```
@tabs 使用实例
```java
LinkedHashMap<String, Object> linkedHashMap = (LinkedHashMap<String, Object>) responseEntity.getBody();
ArrayList<LinkedHashMap<String, Object> > records = (ArrayList<LinkedHashMap<String, Object> >)linkedHashMap.get("records");
ObjectMapper objectMapper = new ObjectMapper();
List<RaiseChangeNoticeVO> result = objectMapper.convertValue(records,
  objectMapper.getTypeFactory().constructCollectionType(List.class, MyClass.class));
```
:::
### @JsonUnwrapped  
@JsonUnwrapped 将一个嵌套对象的属性"展开"到其父对象的 JSON 表示中，从而扁平化数据结构，支持前缀和后缀配置。  
```java  
public class User {  
    private String name;  
  
    @JsonUnwrapped(prefix = "addr_")  
    private Address address;  
}  
  
public class Address {  
    private String street;  
    private String city;  
}  
```  
序列化结果：  
```json  
{  
  "name": "张三",  
  "addr_street": "人民路",  
  "addr_city": "北京"  
}  
```  
  
优点：减少嵌套层级，减小 JSON 体积  
缺点：增加属性名解析复杂度  
注意事项：  
    - 不可与 @JsonValue 混用  
    - 展开可能导致循环引用问题，需要注意处理  

## jackson-databind
ObjectMapper是jackson-databind模块最为重要的一个类，主要用于读取和写入Json数据，能够很方便地将Java对象转为Json格式的数据。它是面向用户的高层API，底层依赖于Streaming API来实现读/写。ObjectMapper主要提供的功能点如下：
- 它提供读取和写入JSON的功能（最重要的功能）
  + 普通POJO的序列化/反序列化
  + JSON树模型的读/写
- 它可以被高度定制，以使用不同风格的JSON内容
  + 使用Feature进行定制
  + 使用可插拔com.fasterxml.jackson.databind.Module模块来扩展/丰富功能
- 它还支持更高级的对象概念：比如多态泛型、对象标识
- 它还充当了更为高级（更强大）的API：ObjectReader和ObjectWriter的工厂
  + ObjectReader和ObjectWriter底层亦是依赖于Streaming API实现读写

#### 数据绑定（JSON -> 对象）
数据绑定分为简单数据绑定和完全数据绑定：
- 简单数据绑定：比如绑定int类型、List、Map等
- 完全数据绑定：绑定到任意的Java Bean对象

```java
ObjectMapper mapper = new ObjectMapper();
// 绑定简单类型 和 Map类型
Integer age = objectMapper.readValue("1", Integer.class);
Map map = objectMapper.readValue("{\"name\":  \"YourBatman\"}", Map.class);

// JSON字符串转对象
MyClass obj = mapper.readValue(jsonString, MyClass.class);

// JSON字节数组转对象
MyClass obj = mapper.readValue(jsonBytes, MyClass.class);

// JSON文件转对象
MyClass obj = mapper.readValue(new File("data.json"), MyClass.class);

// InputStream转对象
MyClass obj = mapper.readValue(inputStream, MyClass.class);
```

#### 写数据（对象 ->  JSON）
```java  
ObjectMapper mapper = new ObjectMapper();  
  
// Java对象转JSON字符串
String json = mapper.writeValueAsString(myObject);  
  
// 对象转JSON字节数组
byte[] jsonBytes = mapper.writeValueAsBytes(object);

// 对象转JSON文件
mapper.writeValue(new File("data.json"), object);

// 对象转OutputStream
mapper.writeValue(outputStream, object);

// 对象转Writer
mapper.writeValue(writer, object);
```

#### 泛型类型处理 `TypeReference<T>`

```java
// JSON转List  
List<MyClass> objList = mapper.readValue(jsonString, new TypeReference<List<MyClass>>() {});
Map<String, MyClass> map = mapper.readValue(jsonString, new TypeReference<Map<String, MyClass>>() {});
```

#### 树模型

```java
valueToTree()
readTree()
```

## 安全漏洞问题
罪魁祸首 AutoType：fastjson、jackson 都支持 AutoType 功能，这个功能在序列化的 JSON 字符串中带上类型信息，在反序列化时，不需要传入类型，实现自动类型识别。