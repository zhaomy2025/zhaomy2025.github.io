package site.zmyblog.utils;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.pdf.AcroFields;
import com.itextpdf.text.pdf.BaseFont;
import com.itextpdf.text.pdf.PdfCopy;
import com.itextpdf.text.pdf.PdfImportedPage;
import com.itextpdf.text.pdf.PdfReader;
import com.itextpdf.text.pdf.PdfStamper;

import lombok.Getter;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class PDFUtils {
    @Getter
    private static String FONT_PATH;
    @Getter
    private static String SEAL_PATH;
    private static Logger logger = LoggerFactory.getLogger(PDFUtil.class);

    @Value("${font.path}")
    public void setFontPath(String fontPath) {
        PDFUtil.FONT_PATH = fontPath;
    }

    @Value("${seal.path:}")
    public void setSealPath(String sealPath) {
        SEAL_PATH = sealPath;
    }

    /**
     * 利用模板生成pdf
     *
     * @param o            写入的数据
     * @param templatePath pdf模板路径
     * @param outFile      自定义保存pdf的文件流
     */
    public static File fillTemplate(Map<String, String> o, String templatePath, String outFile) {
        File file = new File(outFile);
        try {
            if (!file.getParentFile().exists()) {
                file.getParentFile().mkdirs();
            }
            if(!new File(templatePath).exists()){
                logger.error("模板文件不存在：{}", templatePath);
                return null;
            }
            PdfReader reader = new PdfReader(templatePath);
            FileOutputStream out = new FileOutputStream(file);
            ByteArrayOutputStream bos = new ByteArrayOutputStream();
            PdfStamper stamper = new PdfStamper(reader, bos);
            // 获取pdf上的表单集合
            AcroFields form = stamper.getAcroFields();
            Iterator<String> it = form.getFields().keySet().iterator();
            String fontPath = StringUtils.isEmpty(o.get("font")) ? FONT_PATH + "simsun.ttc,0" : o.get("font");
            BaseFont baseFont = BaseFont.createFont(fontPath, BaseFont.IDENTITY_H, BaseFont.EMBEDDED);
            form.addSubstitutionFont(baseFont);
            while (it.hasNext()) {
                String name = it.next();
                String value = o.get(name);
                form.setField(name, value, true);
            }
            form.setFieldProperty("end1", "textsize", new Float(14), null);
            stamper.setFormFlattening(true);
            stamper.close();

            Document doc = new Document();
            PdfCopy copy = new PdfCopy(doc, out);
            doc.open();
            PdfImportedPage importPage = null;
            for (int i = 1; i <= reader.getNumberOfPages(); i++) {
                importPage = copy.getImportedPage(new PdfReader(bos.toByteArray()), i);
                copy.addPage(importPage);
            }
            reader.close();
            doc.close();
            out.close();
            importPage.closePath();
        } catch (IOException e) {
            logger.error("生成pdf失败：{}",e);
            return null;
        } catch (DocumentException e) {
            logger.error("生成pdf失败：{}",e);
            return null;
        }
        return file;
    }



    /**
     * pdf普通盖章
     *
     * @param templatePath 模板文件路径 未命名1.pdf
     * @param targetPath   生成的文件路径
     * @param imagePath    图片路径
     * @param fitWidth     图片宽
     * @param fitHeight    图片高
     * @param abX          右往左距离
     * @param abY          下往上距离
     */
    public static void stamperPDF(String templatePath, String targetPath, String imagePath, int fitWidth, int fitHeight,
                                  int abX, int abY, boolean centerAdjust) throws IOException, DocumentException {
        logger.info("模板文件路径{}，目标文件路径{}，印章路径{}", templatePath,targetPath, imagePath);
        Document document = null;
        PdfStamper stamper = null;
        PdfReader reader = null;
        try {
            // 读取模板文件
            InputStream input = new FileInputStream(templatePath);
            reader = new PdfReader(input);
            //获取页数
            int pagecount = reader.getNumberOfPages();

            PdfReader.unethicalreading = true;
            stamper = new PdfStamper(reader, new FileOutputStream(
                    targetPath));
            document = new Document(reader.getPageSize(1));

            // 获取页面宽度
            float width = document.getPageSize().getWidth();
            // 获取页面高度
            float height = document.getPageSize().getHeight();

            // 读图片
            logger.info("{}印章路径：{}", targetPath, imagePath);
            Image image = Image.getInstance(imagePath);
            // 根据域的大小缩放图片
            image.scaleToFit(fitWidth, fitHeight);
            logger.info("{}印章大小：{},{}", targetPath, fitWidth, fitHeight);
            //是否以页面高度居中位置为基准进行调整
            if (centerAdjust) {
                logger.info("{}印章位置：{},{}", targetPath, width - abX, abY);
                image.setAbsolutePosition(width - abX, height / 2 + abY - fitHeight / 2);
            } else {
                logger.info("{}印章位置：{},{}", targetPath, width - abX, abY);
                image.setAbsolutePosition(width - abX, abY);
            }
            for (int i = 1; i <= pagecount; i++) {
                PdfContentByte under = stamper.getOverContent(i);
                under.addImage(image);
                logger.info("{}第{}页添加图片", targetPath, i);
            }
        } catch (Exception e) {
            logger.error("pdf盖章失败{}", e);
        } finally {
            if (document != null) {
                document.close();
            }
            if (stamper != null) {
                stamper.close();
            }
            if (reader != null) {
                reader.close();
            }
        }
    }

}