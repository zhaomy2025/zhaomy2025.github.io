import{_ as t,c as d,a as n,b as p,d as e,w as i,r as c,o as r,e as l}from"./app-D2QDxWPY.js";const v={},o={class:"table-of-contents"};function u(m,s){const a=c("router-link");return r(),d("div",null,[s[11]||(s[11]=n("h1",{id:"java文件目录操作",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#java文件目录操作"},[n("span",null,"Java文件目录操作")])],-1)),n("nav",o,[n("ul",null,[n("li",null,[e(a,{to:"#file"},{default:i(()=>s[0]||(s[0]=[l("File")])),_:1,__:[0]}),n("ul",null,[n("li",null,[e(a,{to:"#主要方法"},{default:i(()=>s[1]||(s[1]=[l("主要方法")])),_:1,__:[1]})]),n("li",null,[e(a,{to:"#缺点"},{default:i(()=>s[2]||(s[2]=[l("缺点")])),_:1,__:[2]})])])]),n("li",null,[e(a,{to:"#path接口"},{default:i(()=>s[3]||(s[3]=[l("Path接口")])),_:1,__:[3]}),n("ul",null,[n("li",null,[e(a,{to:"#主要方法-1"},{default:i(()=>s[4]||(s[4]=[l("主要方法")])),_:1,__:[4]})])])]),n("li",null,[e(a,{to:"#paths"},{default:i(()=>s[5]||(s[5]=[l("Paths")])),_:1,__:[5]})]),n("li",null,[e(a,{to:"#files"},{default:i(()=>s[6]||(s[6]=[l("Files")])),_:1,__:[6]}),n("ul",null,[n("li",null,[e(a,{to:"#主要方法-2"},{default:i(()=>s[7]||(s[7]=[l("主要方法")])),_:1,__:[7]})]),n("li",null,[e(a,{to:"#walkfiletree"},{default:i(()=>s[8]||(s[8]=[l("walkFileTree()")])),_:1,__:[8]})])])]),n("li",null,[e(a,{to:"#其他文件操作类"},{default:i(()=>s[9]||(s[9]=[l("其他文件操作类")])),_:1,__:[9]})]),n("li",null,[e(a,{to:"#总结"},{default:i(()=>s[10]||(s[10]=[l("总结")])),_:1,__:[10]})])])]),s[12]||(s[12]=p(`<p>本文依次介绍 Java 文件和目录操作中的几个核心类：</p><ul><li><code>File</code>：Java 早期版本提供的传统文件和目录路径类，支持创建、删除、重命名以及属性检查等基本操作。</li><li><code>Path</code>：Java 7 引入的路径接口，用于更灵活地表示和处理文件或目录路径，是 <code>File</code> 的现代化替代方案。</li><li><code>Paths</code>：Java 7 引入的路径工具类，通过静态方法创建 <code>Path</code> 对象。</li><li><code>Files</code>：Java 7 引入的文件操作工具类，配合 <code>Path</code> 提供创建、判断、复制、移动、删除、遍历及读写文件等丰富功能。</li><li>其他文件操作类：补充介绍 <code>FileOutputStream</code> 等类在创建文件和目录时的行为差异。</li></ul><p>在 Java 中，<code>File</code>、<code>Files</code>、<code>Path</code> 和 <code>Paths</code> 是与文件和目录操作相关的核心类。文件和目录操作是指对文件和目录的创建、查找和删除等操作，只对文件本身进行操作，而非对文件内容进行操作。</p><h2 id="file" tabindex="-1"><a class="header-anchor" href="#file"><span>File</span></a></h2><p><code>File</code> 类是 Java 早期版本（Java 1.0）中用于表示文件和目录路径的类。它提供了对文件和目录的基本操作，如创建、删除、重命名、检查属性等。</p><h3 id="主要方法" tabindex="-1"><a class="header-anchor" href="#主要方法"><span>主要方法</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code><span class="line">构造方法</span>
<span class="line">File(String path)</span>
<span class="line">File(String parent, String child)</span>
<span class="line">File(File parent, String child)</span>
<span class="line"></span>
<span class="line">获取属性</span>
<span class="line">getAbsolutePath()</span>
<span class="line">getPath()</span>
<span class="line">getName()</span>
<span class="line">length() 返回文件长度，以字节为单位</span>
<span class="line"></span>
<span class="line">判断</span>
<span class="line">exists() 检查文件或目录是否存在</span>
<span class="line">isDirectory() 检查是否为目录</span>
<span class="line">isFile() 检查是否为文件。</span>
<span class="line"></span>
<span class="line">创建修改删除</span>
<span class="line">createNewFile() 创建一个新文件</span>
<span class="line">mkdir() 创建一个目录</span>
<span class="line">mkdirs() 创建多级目录</span>
<span class="line">renameTo(File dest) 重命名文件或目录</span>
<span class="line">delete() 删除文件或目录</span>
<span class="line"></span>
<span class="line">目录的遍历</span>
<span class="line">String[] list() 返回目录中的文件和子目录名称列表</span>
<span class="line">File[] listFiles()</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="缺点" tabindex="-1"><a class="header-anchor" href="#缺点"><span>缺点</span></a></h3><ul><li>功能有限，不支持符号链接、文件属性等高级操作。</li><li>路径处理不够灵活，跨平台兼容性较差。</li></ul><h2 id="path接口" tabindex="-1"><a class="header-anchor" href="#path接口"><span>Path接口</span></a></h2><p><code>Path</code> 是 Java 7 引入的 <code>java.nio.file</code> 包中的一个接口，用于表示文件或目录的路径。它是对 <code>File</code> 类的现代化替代，提供了更强大的路径操作功能。</p><h3 id="主要方法-1" tabindex="-1"><a class="header-anchor" href="#主要方法-1"><span>主要方法</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code><span class="line">判断</span>
<span class="line">startsWith(Path other) 检查路径是否以指定路径开头</span>
<span class="line">endsWith(Path other) 检查路径是否以指定路径结尾</span>
<span class="line">isAbsolute() 检查路径是否为绝对路径</span>
<span class="line"></span>
<span class="line">获取</span>
<span class="line">getParent() 返回路径的父目录部分</span>
<span class="line">getFileName() 返回路径的文件名部分</span>
<span class="line">getRoot() 返回路径的根目录部分</span>
<span class="line"></span>
<span class="line">转换</span>
<span class="line">toAbsolutePath()</span>
<span class="line">toFile()</span>
<span class="line">toString()</span>
<span class="line"></span>
<span class="line">解析</span>
<span class="line">resolve(Path) 将两个路径合并</span>
<span class="line">resolve(String)</span>
<span class="line">resolveSibling(Path)</span>
<span class="line">resolveSibling(String)</span>
<span class="line"></span>
<span class="line">其他</span>
<span class="line">relativize 返回两个路径的相对路径</span>
<span class="line">normalize() 规范化路径（去除冗余部分）</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="paths" tabindex="-1"><a class="header-anchor" href="#paths"><span>Paths</span></a></h2><p><code>Paths</code> 是 Java 7 引入的工具类，用于创建 <code>Path</code> 对象。它提供了静态方法来构造 <code>Path</code> 实例。</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code><span class="line">get(String first, String... more)  根据字符串路径创建 \`Path\` 对象</span>
<span class="line">get(URI uri)   根据 URI 创建 Path 对象</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="files" tabindex="-1"><a class="header-anchor" href="#files"><span>Files</span></a></h2><p><code>Files</code> 是 Java 7 引入的工具类，提供了丰富的静态方法用于操作文件和目录。Files 类与 java.nio.file.Path 类一起工作，需要了解 Path 类，然后才能使用 Files 类。</p><h3 id="主要方法-2" tabindex="-1"><a class="header-anchor" href="#主要方法-2"><span>主要方法</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code><span class="line">创建目录和文件</span>
<span class="line">createDirectory(Path, attrs) 创建目录，若目录已存在，会抛异常，不能一次创建多级目录</span>
<span class="line">createDirectories(Path, attrs) 创建多级目录</span>
<span class="line">createFile(path, attrs) 创建一个新文件</span>
<span class="line"></span>
<span class="line">创建临时目录和文件</span>
<span class="line">createTempDirectory(dir,prefix, attrs)</span>
<span class="line">createTempDirectory(prefix, attrs)</span>
<span class="line">createTempFile(dir, prefix, suffix)</span>
<span class="line">createTempFile(prefix, suffix)</span>
<span class="line">prefix和suffix是可以为null的字符串，若为空则为随机字符串</span>
<span class="line"></span>
<span class="line">判断</span>
<span class="line">exists(Path path, LinkOption... options) 检查文件或目录是否存在</span>
<span class="line">isHidden</span>
<span class="line">isReadable，isWritable，isExecutable</span>
<span class="line">isDirectory 检查是否是目录</span>
<span class="line">isRegularFile 检查是否是普通文件</span>
<span class="line">isSymbolicLink</span>
<span class="line"></span>
<span class="line">获取文件信息</span>
<span class="line">size() 返回文件的大小（字节数）</span>
<span class="line">getOwner()</span>
<span class="line">readAttributes(path,type,LinkOption) 读取类型为A的文件属性</span>
<span class="line"></span>
<span class="line">复制文件</span>
<span class="line">copy(Path,OutputStream) 复制文件或目录</span>
<span class="line">copy(Path,Path,CopyOption)</span>
<span class="line">copy(InputStream,Path,CopyOption)</span>
<span class="line"></span>
<span class="line">移动文件/文件夹</span>
<span class="line">move(Path source, Path target, CopyOption... options) 移动文件或目录</span>
<span class="line"></span>
<span class="line">删除文件/文件夹</span>
<span class="line">static void delete(Path path); // 如果要删除的文件不存在，这个方法就会抛出异常</span>
<span class="line">static boolean deleteIfExists(Path path); // 如果文件被此方法删除则返回 true</span>
<span class="line"></span>
<span class="line">访问目录中的项</span>
<span class="line">list() 不会进入子目录</span>
<span class="line"></span>
<span class="line">遍历文件树</span>
<span class="line">walk(pathToRoot,depth)</span>
<span class="line">static Path walkFileTree(Path start,</span>
<span class="line">                         FileVisitor&lt;? super Path&gt; visitor)</span>
<span class="line">static Path walkFileTree(Path start,</span>
<span class="line">                         Set&lt;FileVisitOption&gt; options,</span>
<span class="line">                         int maxDepth,</span>
<span class="line">                         FileVisitor&lt;? super Path&gt; visitor)</span>
<span class="line"></span>
<span class="line">读写文件(适用于处理中等长度的文本文件)</span>
<span class="line">readAllBytes(path) 读取文件的所有字节</span>
<span class="line">readAllLines(path,charset) 读取文件的所有行</span>
<span class="line">write(path,byte[],option)</span>
<span class="line">lines(Path path) 返回文件的流式行读取</span>
<span class="line"></span>
<span class="line">获取输入/输出流或者读入/写出器</span>
<span class="line">newInputStream()</span>
<span class="line">newOutputStream()</span>
<span class="line">newBufferedReader()</span>
<span class="line">newBufferedWriter()</span>
<span class="line"></span>
<span class="line">目录流</span>
<span class="line">newDirectoryStream(Path, String glob) 可对遍历过程进行更加细粒度的控制</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>复制、移动文件时可指定CopyOption：</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code><span class="line">StandardCopyOption.ATOMIC_MOVE 保证文件移动的原子性</span>
<span class="line">StandardCopyOption.COPY_ATTRIBUTES 复制所有的文件属性</span>
<span class="line">StandardCopyOption.REPLACE_EXISTING 覆盖已有的目标路径</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>获取输入/输出流或者读入/写出器可指定StandardOpenOption：</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code><span class="line">READ</span>
<span class="line">WRITE</span>
<span class="line">APPEND</span>
<span class="line">TRUNCATE_EXISTING</span>
<span class="line">CREATE_NEW</span>
<span class="line">CREATE</span>
<span class="line">DELETE_ON_CLOSE</span>
<span class="line">...</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>复制文件夹的时候，只能复制空文件夹，如果文件夹非空，需要递归复制，否则只能得到一个空文件夹，而文件夹里面的文件不会被复制。 如果文件是目录，则该目录必须为空才能删除 除了文件复制比较简洁通用，其他两个方法个人认为使用IO流或者NIO流比较方便一点。</p><h3 id="walkfiletree" tabindex="-1"><a class="header-anchor" href="#walkfiletree"><span>walkFileTree()</span></a></h3><p>Files类有两个重载的walkFileTree()方法：</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code><span class="line">static Path walkFileTree(Path start,</span>
<span class="line">                         FileVisitor&lt;? super Path&gt; visitor)</span>
<span class="line"></span>
<span class="line">static Path walkFileTree(Path start,</span>
<span class="line">                         Set&lt;FileVisitOption&gt; options,</span>
<span class="line">                         int maxDepth,</span>
<span class="line">                         FileVisitor&lt;? super Path&gt; visitor)</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Path实例指向要遍历的目录，在遍历期间调用FileVisitor，必须实现 FileVisitor 接口，并将其实现的实例传递给 walkFileTree() 方法，如果不需要使用到所有方法，可以扩展SimpleFileVisitor类。FileVisitor接口定义如下：</p><div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre><code><span class="line"><span class="token keyword">public</span> <span class="token keyword">interface</span> <span class="token class-name">FileVisitor</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">T</span><span class="token punctuation">&gt;</span></span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token class-name">FileVisitResult</span> <span class="token function">preVisitDirectory</span><span class="token punctuation">(</span><span class="token class-name">T</span> dir<span class="token punctuation">,</span> <span class="token class-name">BasicFileAttributes</span> attrs<span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">IOException</span><span class="token punctuation">;</span> </span>
<span class="line">    <span class="token class-name">FileVisitResult</span> <span class="token function">visitFile</span><span class="token punctuation">(</span><span class="token class-name">T</span> file<span class="token punctuation">,</span> <span class="token class-name">BasicFileAttributes</span> attrs<span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">IOException</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token class-name">FileVisitResult</span> <span class="token function">visitFileFailed</span><span class="token punctuation">(</span><span class="token class-name">T</span> file<span class="token punctuation">,</span> <span class="token class-name">IOException</span> exc<span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">IOException</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token class-name">FileVisitResult</span> <span class="token function">postVisitDirectory</span><span class="token punctuation">(</span><span class="token class-name">T</span> dir<span class="token punctuation">,</span> <span class="token class-name">IOException</span> exc<span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">IOException</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="其他文件操作类" tabindex="-1"><a class="header-anchor" href="#其他文件操作类"><span>其他文件操作类</span></a></h2><p>FileOutputStream会自动创建文件，但是如果是多级目录，就创建不了并且报错。</p><h2 id="总结" tabindex="-1"><a class="header-anchor" href="#总结"><span>总结</span></a></h2><table><thead><tr><th>特性</th><th><code>File</code> 类</th><th><code>Path</code> 接口</th><th><code>Paths</code> 类</th><th><code>Files</code> 类</th></tr></thead><tbody><tr><td>引入版本</td><td>Java 1.0</td><td>Java 7</td><td>Java 7</td><td>Java 7</td></tr><tr><td>功能</td><td>基本文件操作</td><td>路径操作</td><td>路径创建</td><td>高级文件操作</td></tr><tr><td>路径表示</td><td>字符串路径</td><td>路径对象</td><td>路径对象</td><td>路径对象</td></tr><tr><td>跨平台兼容性</td><td>较差</td><td>较好</td><td>较好</td><td>较好</td></tr><tr><td>符号链接支持</td><td>不支持</td><td>支持</td><td>支持</td><td>支持</td></tr><tr><td>流式操作</td><td>不支持</td><td>不支持</td><td>不支持</td><td>支持</td></tr></tbody></table><ul><li><code>File</code>：适用于简单的文件操作，但功能有限。</li><li><code>Path</code>：现代化的路径表示，支持更灵活的路径操作。</li><li><code>Paths</code>：用于创建 <code>Path</code> 对象的工具类。</li><li><code>Files</code>：提供了丰富的文件操作方法，是对 <code>File</code> 类的现代化替代。</li></ul><p>在 Java 7 及以上版本中，推荐使用 <code>Path</code>、<code>Paths</code> 和 <code>Files</code> 类进行文件和目录操作，因为它们功能更强大、兼容性更好。</p>`,36))])}const h=t(v,[["render",u]]),k=JSON.parse('{"path":"/java/basic/file-operations.html","title":"Java文件目录操作","lang":"zh-CN","frontmatter":{"title":"Java文件目录操作","date":"2025-03-06T14:32:00.000Z","tags":["Java","Java基础","常用类库"],"categories":["Java","Java基础","常用类库"]},"git":{"updatedTime":1789953116000,"contributors":[{"name":"zhaomy","username":"zhaomy","email":"3036190149@qq.com","commits":2,"url":"https://github.com/zhaomy"}],"changelog":[{"hash":"e382c674459e26e7fb814dd0bb4d32762c8f8f88","time":1789953116000,"email":"3036190149@qq.com","author":"zhaomy","message":"新增日期时间与 I/O 笔记并补全常用类库索引、图例样式"},{"hash":"f147a7969d7dd58344661d0215872878d6f4274c","time":1788834454000,"email":"3036190149@qq.com","author":"zhaomy","message":"docs(java): 新增 Java 基础分组，补充基础/中级/高级/杂项文章"}]},"filePathRelative":"java/basic/file-operations.md","excerpt":"\\n\\n<p>本文依次介绍 Java 文件和目录操作中的几个核心类：</p>\\n<ul>\\n<li><code>File</code>：Java 早期版本提供的传统文件和目录路径类，支持创建、删除、重命名以及属性检查等基本操作。</li>\\n<li><code>Path</code>：Java 7 引入的路径接口，用于更灵活地表示和处理文件或目录路径，是 <code>File</code> 的现代化替代方案。</li>\\n<li><code>Paths</code>：Java 7 引入的路径工具类，通过静态方法创建 <code>Path</code> 对象。</li>\\n<li><code>Files</code>：Java 7 引入的文件操作工具类，配合 <code>Path</code> 提供创建、判断、复制、移动、删除、遍历及读写文件等丰富功能。</li>\\n<li>其他文件操作类：补充介绍 <code>FileOutputStream</code> 等类在创建文件和目录时的行为差异。</li>\\n</ul>"}');export{h as comp,k as data};
