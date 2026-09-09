---
title: MyBatis/MyBatis-Plus注解
date: 2025-06-23T06:52:35.125Z
category:
  - framework
  - mybatis-annotation
tags:
  - framework
  - mybatis-annotation
---

# MyBatis/MyBatis-Plus注解
[[toc]]
# MyBatis核心注解
## SQL操作注解
| @Select | |
| --- | --- |
| @Update | |
| @Insert | |
| @Delete | |
| @Options | |


## 参数处理注解
| @Param | |
| --- | --- |
| @MapKey | |
|  | |


## 结果映射注解
| @Results | |
| --- | --- |
| @Result | |
| @ResultMap | |
|  | |
|  | |


## Mapper接口相关注解
| 注解 | 所属框架 | 主要用途 |
| --- | --- | --- |
| `@Mapper` | Mybatis原生 | 标记接口为 MyBatis 的 Mapper 接口 |
| `@MapperScan` | Mybatis-Spring | 批量扫描注册 Mapper 接口 |

在接口类上添加了@Mapper，在编译之后会生成相应的接口实现类，这个注解就是用来映射`mapper.xml`文件的。使用@mapper后，不需要在spring配置中设置扫描地址，通过mapper.xml里面的namespace属性对应相关的mapper类，spring将动态的生成Bean后注入到ServiceImpl中。

注意：

+ **在Dao层不要存在相同名字的接口，也就是在Dao不要写重载。**因为mapper文件是通过id与接口进行对应的，如果写了两个同名的接口，就会导致mapper文件映射出错。
+ 如果想要每个接口都要变成实现类，那么需要在每个接口类上加上@Mapper注解，比较麻烦，解决这个问题用@MapperScan。

# MyBatis-Plus增强注解
## 实体类注解
| @TableName  | | |
| --- | --- | --- |
| @TableId | | |
| @TableField | | |
| @TableLogic | | |

### @TableField
处理实体类字段与数据库表字段之间的映射关系

1. 字段映射配置`@TableField("db_column") `
  1. 当实体字段名与数据库字段名不一致时使用
  2. 未配置时默认采用驼峰转下划线命名规则
2. 排除非表字段`@TableField(exist = false) `
  1. 用于实体类中的临时属性或计算字段
  2. 查询/更新时会自动忽略该字段
3. 自动填充
  1.  插入时自动填充`@TableField(fill = FieldFill.INSERT)`
  2. 更新时填充`@TableField(fill = FieldFill.UPDATE) `
  3. 插入和更新时填充`@TableField(fill = FieldFill.INSERT_UPDATE)`
4. 字段验证
  1. `@TableField(condition = SqlCondition.LIKE)`
    1. `LIKE`
    2. `NOT_IN`
  2. `@TableField(whereStrategy = FieldStrategy.NOT_EMPTY)`
    1. `IGNORED`
    2. `NOT_NULL`
    3. `NOT_EMPTY`
5. 类型处理器
  1. `@TableField(typeHandler = BlobTypeHandler.class)`大字段处理

## 条件构造器注解
| @Select  | | |
| --- | --- | --- |
| @Update | | |
| | | |


## 扩展功能注解
| **@KeySequence** | | |
| --- | --- | --- |
| @InterceptorIgnore | | |
| | | |




# 其他注解
既不属于MyBatis注解，也不属于MyBatis-Plus注解，但在使用MyBatis/MyBatis-Plus时会用到的注解。

## @MapperScan
添加在Springboot启动类上面，指定要变成实现类的接口所在的包，包下面的所有接口在编译之后都会生成相应的实现类。

:::tip
@Repository是Spring的注解，标注在Dao层接口上，作用是将接口的一个实现类交给Spring管理。

使用这个注解的前提是必须在启动类上添加@MapperScan("Mapper接口层路径") 注解，这个`@Repository`完全可以省略不写，也完全可以实现自动注入

:::











