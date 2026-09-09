package site.zmyblog.mail;
import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;
import java.util.Properties;

public class EmailSenderWithAttachmentExample {
    // 邮件服务器配置
    String host = "smtp.gmail.com"; // SMTP 服务器
    int port = 587; // SMTP 端口
    String username = "your-email@gmail.com";// 发件人邮箱
    String password = "your-app-password";// 发件人邮箱密码

    public void sendMailWithAttachment() {
        // 设置邮件属性
        Properties props = new Properties();
        props.put("mail.smtp.auth", "true");// 启用认证
        props.put("mail.smtp.starttls.enable", "true");// 启用 TLS
        props.put("mail.smtp.host", host); // SMTP 服务器
        props.put("mail.smtp.port", port); // SMTP 端口
        props.put("mail.smtp.ssl.trust", host);
        props.setProperty("mail.smtp.ssl.protocols", "TLSv1.2");

        // 创建会话
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
            message.setRecipients(Message.RecipientType.TO, new InternetAddress("to@example.com")); // 收件人
            message.addRecipient(Message.RecipientType.CC, new InternetAddress("cc@example.com"));// 抄送人           
            message.addRecipient(Message.RecipientType.BCC, new InternetAddress("bcc@example.com")); // 密送人
            message.setSubject("测试邮件"); // 邮件主题

            // 创建邮件正文            
            Multipart multipart = new MimeMultipart();

            // 文本部分
            MimeBodyPart textPart = new MimeBodyPart();
            textPart.setText("这是一封带附件的测试邮件，请查收附件。");

            // 创建附件
            MimeBodyPart attachmentPart = new MimeBodyPart();
            attachmentPart.setDataHandler(new DataHandler(new FileDataSource(new File("report.pdf"))));
            attachmentPart.setFileName(MimeUtility.encodeText("报表.pdf", "UTF-8", "B")); // 解决中文附件名乱码

            // 组合邮件内容
            multipart.addBodyPart(textPart);
            multipart.addBodyPart(attachmentPart);
            message.setContent(multipart);

            // 发送邮件
            Transport.send(message);
            System.out.println("带附件的邮件发送成功！");
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("邮件发送失败！");
        }
    }
    public static void main(String[] args) {
        EmailSenderWithAttachment emailSender = new EmailSenderWithAttachment();
        emailSender.sendMailWithAttachment();
    }
}