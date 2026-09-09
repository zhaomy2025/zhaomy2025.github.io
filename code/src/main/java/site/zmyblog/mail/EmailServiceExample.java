package site.zmyblog.mail;

@Service
public class EmailServiceExample {
    @Autowired
    private JavaMailSender mailSender;  // Spring自动配置的发送器

    // 发送HTML邮件
    public void sendHtmlEmail() {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        helper.setFrom("noreply@example.com");  // 发件人
        helper.setTo("to@example.com"); // 收件人
        helper.setCc("cc@example.com"); // 抄送人
        helper.setBcc("bcc@example.com"); // 密送人
        helper.setSubject("测试邮件"); // 邮件主题
        helper.setText("<h1>这是一封测试邮件，请勿回复。</h1>", true);  // 第二个参数true表示HTML内容
        mailSender.send(message); // 发送邮件
    }
    
    // 发送带附件的邮件
    public void sendEmailWithAttachment() {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        helper.setFrom("sender@example.com");
        helper.setTo("to@example.com");
        helper.setSubject("测试邮件");
        helper.setText("这是一封测试邮件，请勿回复。");
        FileSystemResource file = new FileSystemResource(new File("test.pdf"));
        helper.addAttachment("附件名称.pdf", file);  // 添加附件
        mailSender.send(message);
    }
}
