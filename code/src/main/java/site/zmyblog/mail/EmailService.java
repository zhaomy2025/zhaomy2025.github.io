package site.zmyblog.mail;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;

    // 发送HTML邮件
    public void sendHtmlEmail(String to, String subject, String htmlContent) {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        helper.setFrom("noreply@example.com");  // 发件人
        helper.setTo(to); // 收件人
        helper.setSubject(subject); // 邮件主题
        helper.setText(htmlContent, true);  // 第二个参数true表示HTML内容
        mailSender.send(message); // 发送邮件
    }
    /**
     * 发送带附件的邮件
     */
    public void sendEmailWithAttachment(EmailData emailData) {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        helper.setFrom("sender@example.com");
        helper.setTo(emailData.getTos());
        helper.setCc(emailData.getCcs());
        helper.setBcc(emailData.getBccs());
        helper.setSubject(emailData.getSubject());
        helper.setText(emailData.getText());
        for (EmailData.File file : emailData.getFiles()) {
            FileSystemResource fileResource = new FileSystemResource(new File(file.getPath()));
            helper.addAttachment(file.getName(), fileResource);  // 添加附件
        }
        mailSender.send(message);
    }
    public static void main(String[] args) {
        EmailService emailService = new EmailService();
        EmailData emailData = new EmailData();
        emailData.setTos(new String[]{"to@example.com"});
        emailData.setCcs(new String[]{"cc@example.com"});
        emailData.setBccs(new String[]{"bcc@example.com"});
        emailData.setSubject("测试邮件");
        emailData.setText("这是一封测试邮件，请勿回复。");
        emailData.setFiles(new EmailData.File[] {
            new EmailData.File("test.txt", "test.txt"),
            new EmailData.File("test.pdf", "test.pdf")
        });
        emailService.sendEmailWithAttachment(emailData);
    }
}
