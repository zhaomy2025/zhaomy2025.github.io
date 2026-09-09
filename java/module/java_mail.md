---
title: JavaMail
date: 2025-07-25T05:51:18.233Z
category:
  - java
  - module
  - java_mail
tags:
  - java
  - module
  - java_mail
---

# JavaMail
[[toc]]

在 Java 中发送邮件主要依赖 **JavaMail API** 标准库及其衍生框架`JavaMailSender`（Spring Framework）。
JavaMail API 是发送和接收电子邮件的官方标准，支持 SMTP（发送）、POP3/IMAP（接收）等协议。
以下是使用 JavaMail 发送邮件的步骤：
1. 获取邮件服务器信息
2. 引入javax.mail依赖
3. 创建会话
    1. 继承Authenticator，重写getPasswordAuthentication()方法，用于登陆校验
    2. 创建一个Properties对象，用于存放SMTP服务器地址、端口号
    3. 用步骤1和2得到的对象创建一个Session对象，相当于邮箱登录
4. 创建邮件消息（MimeMessage）
    1. 创建MimeMessage，设置发件人、收件人、抄送人、主题、内容，添加附件
5. 发送邮件
    1. 使用Transport发送邮件

## 获取邮件服务器信息

<!-- @include:mail_smtp.md -->

## 添加依赖

```java
<dependency>
    <groupId>com.sun.mail</groupId>
    <artifactId>javax.mail</artifactId>
    <version>1.6.2</version>
</dependency>
```

## 发送简单文本邮件
发送简单文本邮件步骤：
1. 创建一个Properties对象，用于存放SMTP服务器地址、端口号
2. 继承Authenticator，重写getPasswordAuthentication()方法，用于登陆校验
3. 用步骤1和2得到的对象创建一个Session对象，相当于邮箱登录
4. 创建邮件消息（MimeMessage），设置发件人、收件人、抄送人、主题、内容，添加附件
5. 使用Transport发送邮件

@[code](../../code/src/main/java/site/zmyblog/mail/EmailSenderExample.java)

:::tip
如果使用smtps协议通过SSL访问SMTP，则所有属性都将命名为mail.smtps.*  
要使用SMTP身份验证，需要设置mail.smtp.auth属性或在连接到SMTP服务器时为SMTP传输提供用户名和密码  
+ 在创建邮件Session时提供Authenticator对象，并在Authenticator回调过程中提供用户名和密码信息。
+ 使用用户名和密码参数显示调用Transport::connect方法
:::

## 发送复杂邮件
通过 MimeMultipart 和 MimeBodyPart 可组合多种内容类型，构建复杂邮件。MimeBodyPart 可以表示不同类型的内容（文本、HTML、附件等），并通过 MimeMultipart 组合成完整邮件。  
常用方法如下：
- MimeMultipart：表示邮件中的多个部分，用来组合MimeBodyPart
    - addBodyPart(MimeBodyPart);
- MimeBodyPart：表示邮件中的一个部分，如正文、附件等
    - setText()：设置文本内容
    - setContent(Object content, String mimeType)：设置正文内容及MIME类型
        - `setContent("","text/plain;charset=UTF-8")`：纯文本
        - `setContent("<h1>Hello</h1>","text/html;charset=UTF-8")`：HTML格式
    - setDataHandler(new DataHandler(new FileDataSource(File)))：添加附件
    - setFileName(String fileName)：设置附件名称（支持中文需编码）
    - addHeader(String name, String value)： 设置MIME头信息

@[code](../../code/src/main/java/site/zmyblog/mail/EmailSenderWithAttachmentExample.java)

## 配置详解
### mail.host 和 mail.[protocol].host
- mail.host（通用但不推荐）：影响所有邮件协议（如 SMTP、IMAP、POP3），除非被协议专用属性覆盖。
- mail.smtp.host（SMTP 协议）：专门用于 SMTP 协议的邮件发送服务器地址配置。
- mail.imap.host（IMAP协议）：IMAP 服务器地址配置。

总结：始终使用 mail.[protocol].host 格式明确指定协议专用主机地址，避免依赖默认的 mail.host。

```java
Properties props = new Properties();
// 发送配置（SMTP）
props.put("mail.smtp.host", "smtp.gmail.com");
props.put("mail.smtp.port", "587");
props.put("mail.smtp.auth", "true");
props.put("mail.smtp.starttls.enable", "true");

// 接收配置（IMAP，如果需要）
props.put("mail.imap.host", "imap.gmail.com");
props.put("mail.imap.ssl.enable", "true");
```

### mail.smtp.ssl.trust

控制是否信任 SMTP 服务器的 SSL 证书，无需严格验证证书有效性。

### mail.smtp.ssl.protocols

指定允许使用的 SSL/TLS 协议版本。

| 协议	    | 安全性状态|
| --- | --- | 
| SSLv3	    | ❌ 已弃用（POODLE 漏洞）|
| TLSv1.0	| ❌ 不推荐|
| TLSv1.1	| ⚠️ 逐步淘汰|
| TLSv1.2	| ✅ 推荐|
| TLSv1.3	| ✅ 最佳（需服务器支持）|

## 注意事项及常见问题
应用程序永远不要直接构造SMTPTransport的实例。 相反，他们应该使用Session方法getTransport来获取适当的Transport对象。

### 503 Error
可能原因：服务器要求身份验证但未提供凭据
解决方案：确保 mail.smtp.auth=true 且用户名/密码正确
    - 设置 mail.smtp.auth=true
    - 创建Session时提供用户名和密码
```java
props.put("mail.smtp.auth", "true");
Authenticator authenticator = new Authenticator() {
    protected PasswordAuthentication getPasswordAuthentication() {
        return new PasswordAuthentication("user@example.com", "password");
    }
};
Session session = Session.getInstance(props, authenticator);
```