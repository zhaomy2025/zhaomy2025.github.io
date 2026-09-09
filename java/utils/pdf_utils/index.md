---
title: PDFUtils
date: 2025-07-15T01:56:02.896Z
category:
  - java
  - utils
  - pdfutils
tags:
  - java
  - utils
  - pdfutils
---

# PDFUtils
[[toc]]

## 常用工具类库

PDF处理常用工具类库有Apache PDFBox、iText以及iText的开源分支OpenPDF，这些工具类库覆盖了Java处理PDF的绝大多数场景，开发者可以根据具体需求选择合适的库。

### Apache PDFBox
特点：
- 开源免费 (Apache 2.0 许可证)
- 完整的 PDF 处理能力
- 支持文本提取、创建、渲染和打印

### iText
特点：
- 商业用途需要付费许可证
- 强大的PDF生成和操作功能
- 支持数字签名、表单处理

### OpenPDF (iText分支)
特点：
- iText的开源分支
- LGPL和MPL许可证
- 维护活跃

### 功能与类库对照表

| 功能需求	| 推荐库	        |备注 |
| :--------:	| :-------------:	| :--: |
| 密码保护	| iText/PDFBox	| iText加密选项更丰富 |
| 合并/拆分	| PDFBox	      | 轻量级解决方案 |
| 表单处理	| iText	        | 支持动态表单和静态表单 |
| 数字签名	| iText	        | 支持多种签名标准 |
| 文本提取	| PDFBox	      | 开源免费 |
| 转图片	  | PDFBox+PDFRenderer	| 质量好 |
| OCR集成	| Tesseract+PDFBox	  | 需要额外配置 |
| 压缩优化	| PDFBox/Ghostscript	| Ghostscript压缩率更高 |
| 水印添加	| iText/PDFBox	      | iText更灵活 |

## 自定义工具类FileUtils

功能：
- 利用模板生成PDF文件（表单）<Tip>iText</Tip>
- 添加水印<Tip>iText</Tip>

@[code](../../../code/src/main/java/site/zmyblog/utils/PDFUtils.java)