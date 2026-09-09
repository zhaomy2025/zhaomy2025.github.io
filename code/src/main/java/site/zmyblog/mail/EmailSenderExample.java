package site.zmyblog.mail;
import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.util.Properties;

public class EmailSenderExample {
    // 邮件服务器配置
    String host = "smtp.gmail.com"; // SMTP 服务器
    int port = 587; // SMTP 端口
    String username = "your-email@gmail.com";// 发件人邮箱
    String password = "your-app-password";// 发件人邮箱密码

    public void sendMail() {

        // 设置邮件属性
        Properties props = new Properties();
        props.put("mail.smtp.auth", "true"); // 启用认证
        props.put("mail.smtp.starttls.enable", "true"); // 启用 TLS
        props.put("mail.smtp.host", host); // SMTP 服务器
        props.put("mail.smtp.port", port); // SMTP 端口
        props.put("mail.smtp.ssl.trust", host);
        props.setProperty("mail.smtp.ssl.protocols", "TLSv1.2");

        // 创建会话，为保证邮箱通道配置变更后立马生效,需每次创建新的Session
        Session session = Session.getInstance(props, new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(username, password);
            }
        });

        try {
            // 创建邮件消息
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(username)); // 发件人
            message.setRecipient(Message.RecipientType.TO, new InternetAddress("to@example.com")); // 收件人
            message.setRecipient(Message.RecipientType.CC, new InternetAddress("cc@example.com"));// 抄送人           
            message.setRecipient(Message.RecipientType.BCC, new InternetAddress("bcc@example.com")); // 密送人
            message.setSubject("测试邮件"); // 邮件主题
            message.setText("这是一封测试邮件，请勿回复。"); // 邮件内容

            // 发送邮件
            Transport.send(message);
            System.out.println("邮件发送成功！");
        } catch (MessagingException e) {
            e.printStackTrace();
            System.out.println("邮件发送失败！");
        }
    }
    public static void main(String[] args) {
        EmailSenderExample emailSender = new EmailSenderExample();
        emailSender.sendMail();
    }
}