---
title: Java_Agent
date: 2025-04-10 13:01:39
tags:
  - Java
  - Java高级
  - JVM和性能调优
  - Java Agent
categories:
  - Java
  - Java高级
  - JVM和性能调优
---
# Java Agent 概述

Java Agent 是一种特殊的 Java 程序，它能够在 JVM 启动时或运行时加载，用于监测、修改或增强其他 Java 应用程序的运行。
与普通Java程序通过main方法启动不同，Java Agent并不是一个可以单独启动的程序，它必须依附在一个Java应用程序（JVM）上，与主程序运行在同一个JVM进程中，通过Instrumentation 接口与JVM进行交互。

# 常见用途

1. 热部署：修改已加载类的行为,常见的热部署工具有IDEA的HotSwap和Jrebel。
1. 性能监控：收集方法执行时间、调用次数等,TProfiler就是一款优秀的性能分析工具
1. AOP编程：实现面向切面编程
1. 日志增强：自动添加日志记录
1. 在线诊断：收集运行时信息，修复问题。Arthas就是一款非常优秀的Java在线诊断工具。
1. 调试代码: 通过IDEA调试代码就是基于Java Agent技术实现的。

# 实现方式

在Java SE 5之前，要实现一个Agent只能通过编写Native代码来实现。
从Java SE 5开始，可以使用Java的Instrumentation接口(java.lang.instrument)来编写Agent，在 JVM 启动时通过 -javaagent 参数加载 Agent。
从Java SE 6开始，可以使用Java的Attach接口(java.lang.instrument)动态加载 Agent，允许在 JVM 启动后动态加载 Agent。
无论是通过Native的方式还是通过Java Instrumentation接口的方式来编写Agent，它们的工作都是借助JVMTI来进行完成的。

## 两种加载方式及其应用场景

- 静态加载: 启动时加载,通过Instrumentation接口的premain()方法来实现
- 动态加载: 运行时附加,通过Attach和agentmain()方法来实现
  - 动态加载Agent(如BTrace)
  - 运行时诊断工具(如jstack、jmap)
  - 动态开启JMX远程监控
  - Jcmd、Jps

## 基本结构

一个简单的 Java Agent 需要包含以下部分：

```java

public class MyAgent {
    // 静态加载入口
    public static void premain(String agentArgs, Instrumentation inst) {
        // 初始化代码
    }
    
    // 动态加载入口（可选）
    public static void agentmain(String agentArgs, Instrumentation inst) {
        // 初始化代码
    }
}

```

## 基于 Instrumentation 接口和premain()方法实现Java Agent

实现步骤如下:
1. 定义Java Agent入口类,实现premain()方法
2. 打包为JAR文件，再MANIFEST.MF文件中使用“Premain-Class”属性指定Agent入口类
3. 运行Java程序，通过“-javaagent”参数指定Agent的jar包路径
premain agent的模式有一个致命缺陷:一旦agent抛出异常，会导致主程序的启动失败。

### 定义Java Agent入口类

下面是一个简单的 Java Agent 实现，它通过 Instrumentation 接口的 addTransformer() 方法来实现对类的字节码修改，并在类加载时打印出类的名称。

```java

import java.lang.instrument.Instrumentation;
import java.lang.instrument.ClassFileTransformer;

public class MonitoringAgent {
    public static void premain(String agentArgs, Instrumentation inst) {
        System.out.println("Monitoring Agent started");
        inst.addTransformer(new ClassTransformer());
    }
}

class ClassTransformer implements ClassFileTransformer {
    @Override
    public byte[] transform(ClassLoader loader, 
                            String className, 
                            Class<?> classBeingRedefined,
                            ProtectionDomain protectionDomain, 
                            byte[] classfileBuffer) {
        System.out.println("Loading class: " + className);
        return null; // 返回null表示不修改字节码
    }
}

```

### 打包

Agent需要打包成一个jar包，在ManiFest属性中指定“Premain-Class”或者“Agent-Class”属性，指定 Agent 入口类。

```

Manifest-Version: 1.0
Premain-Class: MonitoringAgent
Can-Redefine-Classes: true
Can-Retransform-Classes: true

```

### 运行

运行主程序时，通过“-javaagent”参数指定Agent的jar包路径,可指定多个Agent。

```

java -javaagent:myagent.jar -jar myapp.jar

```

## 基于 Attach 接口和agentmain()方法实现Java Agent

Attach 接口其实是JVM进程之间的沟通桥梁，底层通过Socket进行通信，JVM A可以发送指令给JVM B，JVM B在收到指令之后执行相应的逻辑。
需要创建三个项目:
1. agent-demo项目：定义Java Agent入口类,实现agentmain()方法,并打包为JAR文件
2. main项目: agent-demo项目需要代理的程序
3. attach-demo项目：加载agent-demo JAR包，并通过Attach接口连接到main项目的JVM进程

### agent-demo项目

```java

package com.panda.agent;

import java.lang.instrument.Instrumentation;

public class AgentMain {
    public static void agentmain(String agentArgs, Instrumentation inst) {
        System.out.println("----------哈哈，我是agentmain");
        System.out.println("----------agentArgs = " + agentArgs);
    }
}

```

### main项目

```java

import java.io.IOException;

public class Main {
    public static void main(String[] args) throws IOException {
        System.in.read();
    }
}

```

### attach-demo项目

VirtualMachine的Attach方法就是用来将Agent挂载到目标JVM上去的

```java

package com.panda.attach;

import com.sun.tools.attach.VirtualMachine;

public class AttachMain {
    public static void main(String[] args) {
        try {
            VirtualMachine vm = VirtualMachine.attach("22640");
            vm.loadAgent("D:/agent-demo-1.0-SNAPSHOT.jar", "哈哈");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

```

# 源码解析

# 总结

Java Agent 是 Java 平台强大的工具，特别适合需要低侵入性监控和修改应用程序的场景。