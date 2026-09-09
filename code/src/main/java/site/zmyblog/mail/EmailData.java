package site.zmyblog.mail;

public class EmailData {
    private String[] tos;
    private String[] ccs;
    private String[] bccs;
    private String subject;
    private String text;
    private File[] files;
    public class File{
        private String name;
        private String path;
    }
}
