---
title: JavaMailSender
date: 2025-07-28
category:
  - java
  - module
  - JavaMailSender

tags:
  - java
  - module
  - JavaMailSender

---

# JavaMailSender
[[toc]]

JavaMailSender 是Spring Framework提供的邮件发送接口，对JavaMail API进行了封装，简化了邮件发送流程，支持Spring依赖注入和配置文件管理，是企业级Java应用的首选方案。  
以下是使用 JavaMail 发送邮件的步骤：
1. 获取邮件服务器信息
2. 引入`spring-boot-starter-mail`依赖
3. 配置文件
4. 创建会话
    1. 继承Authenticator，重写getPasswordAuthentication()方法，用于登陆校验
    2. 创建一个Properties对象，用于存放SMTP服务器地址、端口号
    3. 用步骤1和2得到的对象创建一个Session对象，相当于邮箱登录
5. 创建邮件消息（MimeMessage）
    1. 创建MimeMessage，设置发件人、收件人、抄送人、主题、内容，添加附件
6. 发送邮件
    1. 使用Transport发送邮件

本文以 Spring Boot 4.1.1 为准。

## 获取邮件服务器信息

<!-- @include:mail_smtp.md -->

## 引入依赖
```
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-mail</artifactId>
</dependency>
```

## 配置文件（application.yml）
```yaml
spring:
  mail:
    host: smtp.qq.com
    port: 587
    username: your-qq@qq.com
    password: your-authorization-code # QQ邮箱需使用授权码而非登录密码
    properties:
      mail.smtp.auth: true
      mail.smtp.starttls.enable: true
```

## 发送附件
@[code](../../code/src/main/java/site/zmyblog/mail/EmailServiceExample.java)

## 抄送与密送
```java
// 抄送
helper.setCc("cc@example.com");
helper.setCc(new InternetAddress("cc@example.com", "张三")); // 支持带个人名称的抄送
// 设置多个抄送人
helper.setCc(String[] cc);
helper.setCc(InternetAddress[] cc);
// 逐个添加抄送人
helper.addCc(String cc);
helper.addCc(InternetAddress cc);

// 密送
helper.setBcc(String bcc);
helper.setBcc(InternetAddress bcc);
// 设置多个密送人
helper.setBcc(String[] bcc);
helper.setBcc(InternetAddress[] bcc);
// 逐个添加密送人
helper.addBcc(String bcc);
helper.addBcc(InternetAddress bcc);
```

## 连接池和配置
```java
@Bean
public JavaMailSender javaMailSender() {
    JavaMailSenderImpl sender = new JavaMailSenderImpl();
    // 其他基础配置...
    Properties props = sender.getJavaMailProperties();
    props.put("mail.smtp.connectiontimeout", 5000);  // 连接超时
    props.put("mail.smtp.timeout", 3000);             // 发送超时
    return sender;
}
```

## 配置来自数据库时手动构造

发信账号不固定（运行中可能被改）时，配置存在数据库里，`spring.mail.*` 就用不上了——它读的是启动那一刻的静态配置。这种情况直接 new 一个 `JavaMailSenderImpl`，把从库里取到的属性填进去：

```java
public class DynamicMailSender {

    private final JavaMailSenderImpl mailSender;

    // config 是从数据库读出的发信配置
    public DynamicMailSender(MailConfig config) {
        this.mailSender = new JavaMailSenderImpl();
        mailSender.setHost(config.getHost());
        mailSender.setPort(config.getPort());
        mailSender.setUsername(config.getUsername());
        mailSender.setPassword(config.getPassword());
        mailSender.setDefaultEncoding("utf-8");

        Properties props = mailSender.getJavaMailProperties();
        props.setProperty("mail.smtp.auth", "true");
        props.setProperty("mail.smtp.timeout", "25000");
    }

    public void send(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setFrom(mailSender.getUsername());
        message.setSubject(subject);
        message.setText(text);
        mailSender.send(message);
    }
}
```

代价是 `spring.mail.*` 不再作用于这个手建实例：配置改了就得重建实例，`JavaMailSenderImpl` 的生命周期也由调用方自己管。要注意，手建实例只有注册成 `MailSender` bean 时，自动配置才会整体退让；否则只要 yml 里还配着 `spring.mail.host`，Boot 照样会另建一个用不上的 `MailSender` bean。配置固定、只是不想写在 yml 里的场景，用上一节的 `@Bean` 方式更省事。

## 关键类说明
- JavaMailSender 核心发送接口，提供创建消息、发送邮件等方法 
- MimeMessageHelper 辅助类，简化复杂邮件构建（支持HTML、附件等） 
- MimeMessage 表示一封MIME邮件，支持多部分内容

## 代码示例

@[code](../../code/src/main/java/site/zmyblog/mail/EmailService.java)