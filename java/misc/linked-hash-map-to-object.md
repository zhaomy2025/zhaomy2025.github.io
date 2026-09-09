---
title: LinkedHashMap解析
date: 2025-06-18T01:08:11.652Z
category:
  - java
  - LinkedHashMap解析
tags:
  - java
  - LinkedHashMap解析
  - ObjectMap
  - JSON
---

# LinkedHashMap解析
[[toc]]

## 简介
LinkedHashMap转为对象有多种方式，这里介绍两种常用的方式：
1. 使用反射，需要手动编写转换代码
2. 使用ObjectMap，直接调用方法转换，推荐使用

## 使用反射
支持嵌套对象和列表。
::: code-tabs#java
@tab deepMapToObject
```java
public static <T> T deepMapToObject(LinkedHashMap<String, Object> map, Class<T> clazz) 
    throws Exception {
    T obj = clazz.newInstance();
    for (Field field : clazz.getDeclaredFields()) {
        field.setAccessible(true);
        if (map.containsKey(field.getName())) {
            Object value = map.get(field.getName());
            if (value instanceof LinkedHashMap) {
                field.set(obj, deepMapToObject((LinkedHashMap<String, Object>) value, field.getType()));
            } else if (value instanceof List && ((List) value).get(0) instanceof LinkedHashMap) {
                field.set(obj, ((List<LinkedHashMap<String, Object>>)value).stream()
                    .map(map -> deepMapToObject(map, field.getType())).collect(Collectors.toList());
            }else {
              field.set(obj, map.get(field.getName()));
            }
        }
    }
    return obj;
}
```

@tab 使用实例
```java
LinkedHashMap<String, Object> department = new LinkedHashMap<>();
// 普通属性
department.put("name", "研发部");
// 嵌套对象
LinkedHashMap<String, Object> address = new LinkedHashMap<>();
address.put("city", "北京");
address.put("street", "朝阳区建国路88号");
department.put("address", address);
// 嵌套列表
List<LinkedHashMap<String, Object>> employees = new ArrayList<>();
LinkedHashMap<String, Object> user1 = new LinkedHashMap<>();
user1.put("name", "张三");
user1.put("age", 30);
LinkedHashMap<String, Object> user2 = new LinkedHashMap<>();
user2.put("name", "李四");
user2.put("age", 28);
employees.add(user1);
employees.add(user2);
department.put("employees", employees);

Department departmentObj = deepMapToObject(department, Department.class);
```
:::

## 使用ObjectMap
ObjectMap是Java Jackson库的一个重要工具类，可以将LinkedHashMap转为对象。

::: tip
如果入参是JSON字符串，可以先将JSON字符串转换为LinkedHashMap，然后再转换为对象，不过不推荐使用这种方式。因为objectMapper可以直接将JSON字符串转换为对象，不需要使用LinkedHashMap作为中间转换，此处只是为了说明ObjectMap可以将JSON字符串转换为对象，重点介绍LinkedHashMap到对象的转换。
:::

1. 通过`readValue`将JSON字符串转换为LinkedHashMap
2. 通过`convertValue`将LinkedHashMap转换为对象
  1. 对于对象，需要指定对象类型`elementType`
  2. 对于列表，需要通过`objectMapper.getTypeFactory().constructCollectionType(List.class, elementType)`指定列表及元素类型
3. 对于嵌套列表，需要手动遍历，将LinkedHashMap转换为对象

```java
// 将Json字符串转换为LinkedHashMap
String json = "{\"name\":\"研发部\",\"address\":{\"city\":\"北京\"},\"employees\":[{\"name\":\"张三\",\"age\":30},{\"age\":28}]}";
LinkedHashMap<String, Object> linkedHashMap = new ObjectMapper().readValue(json, LinkedHashMap.class);
// 转换为对象，注意嵌套列表会解析为字符串，需要额外处理
Department dept = mapper.convertValue(department, Department.class);
// 处理嵌套列表
List<LinkedHashMap<String, Object> employees = linkedHashMap.get("employees");
List<Employee> result = objectMapper.convertValue(employees,
        objectMapper.getTypeFactory().constructCollectionType(List.class, Employee.class));
```

## ObjectMap + @JsonDeserialize
通过`LinkedHashMap<String, Object> linkedHashMap = (LinkedHashMap<String, Object>) responseEntity.getBody();
`获取的LinkedHashMap，所有属性值都为String类型，需要自定义反序列化器将其转换为对象。

::: code-tabs#java
@tab MyObject
```java
public class MyObject  {
    @JsonDeserialize(using = ContractVOListDeserializer.class)
    private List<ContractVO> phones;
}
```

@tab ContractVO
```java
public class ContractVO {
    private String name;
    private String phone;
}
```

@tab ContractVOListDeserializer
```java
public class ContractVOListDeserializer extends JsonDeserializer<List<ContractVO>> {
    @Override
    public List<ContractVO> deserialize(JsonParser jp, DeserializationContext ctxt) throws IOException {
        Object fieldValue = p.readValueAs(Object.class);
        if (fieldValue == null) {
            return null;
        }
        try {
            // 如果已经是List类型直接返回
            if (List.class.isInstance(fieldValue)) {
                return List.class.cast(fieldValue);
            }

            // 如果是JSON字符串
            if (fieldValue instanceof String) {
                String strValue = (String) fieldValue;
                if (strValue.startsWith("[")) {
                    return mapper.readValue(strValue, new TypeReference<List<ContractVO>>() {});
                }
            }

            // 默认转换
            return mapper.convertValue(fieldValue, List.class);
        } catch (Exception e) {
            throw new RuntimeException("转换嵌套字段失败", e);
        }
    }
}
```
:::