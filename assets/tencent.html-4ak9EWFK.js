import{_ as u,c as m,a as n,b as d,d as i,w as e,e as s,r as t,o as v}from"./app-DuOmEixQ.js";const b={},g={class:"table-of-contents"};function h(w,l){const a=t("router-link"),p=t("Tip"),o=t("CodeTabs");return v(),m("div",null,[l[23]||(l[23]=n("h1",{id:"腾讯云服务器",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#腾讯云服务器"},[n("span",null,"腾讯云服务器")])],-1)),n("nav",g,[n("ul",null,[n("li",null,[i(a,{to:"#购买服务器、域名、ssl"},{default:e(()=>l[0]||(l[0]=[s("购买服务器、域名、SSL")])),_:1,__:[0]})]),n("li",null,[i(a,{to:"#域名备案"},{default:e(()=>l[1]||(l[1]=[s("域名备案")])),_:1,__:[1]})]),n("li",null,[i(a,{to:"#域名解析"},{default:e(()=>l[2]||(l[2]=[s("域名解析")])),_:1,__:[2]})]),n("li",null,[i(a,{to:"#安装ssl证书"},{default:e(()=>l[3]||(l[3]=[s("安装SSL证书")])),_:1,__:[3]})]),n("li",null,[i(a,{to:"#验证绑定结果"},{default:e(()=>l[4]||(l[4]=[s("验证绑定结果")])),_:1,__:[4]})]),n("li",null,[i(a,{to:"#宝塔面板安装-nginx"},{default:e(()=>l[5]||(l[5]=[s("宝塔面板安装 Nginx")])),_:1,__:[5]}),n("ul",null,[n("li",null,[i(a,{to:"#默认目录"},{default:e(()=>l[6]||(l[6]=[s("默认目录")])),_:1,__:[6]})]),n("li",null,[i(a,{to:"#总结"},{default:e(()=>l[7]||(l[7]=[s("总结")])),_:1,__:[7]})])])]),n("li",null,[i(a,{to:"#nginx-常见问题"},{default:e(()=>l[8]||(l[8]=[s("Nginx 常见问题")])),_:1,__:[8]}),n("ul",null,[n("li",null,[i(a,{to:"#nginx-被-exclude-排除"},{default:e(()=>l[9]||(l[9]=[s("Nginx 被 exclude 排除")])),_:1,__:[9]})]),n("li",null,[i(a,{to:"#访问宝塔面板出现404-not-found-nginx"},{default:e(()=>l[10]||(l[10]=[s("访问宝塔面板出现404 Not Found nginx")])),_:1,__:[10]})])])]),n("li",null,[i(a,{to:"#宝塔linux面板镜像默认配置"},{default:e(()=>l[11]||(l[11]=[s("宝塔Linux面板镜像默认配置")])),_:1,__:[11]})])])]),l[24]||(l[24]=d('<h2 id="购买服务器、域名、ssl" tabindex="-1"><a class="header-anchor" href="#购买服务器、域名、ssl"><span>购买服务器、域名、SSL</span></a></h2><p><a href="https://console.cloud.tencent.com/ssl" target="_blank" rel="noopener noreferrer">https://console.cloud.tencent.com/ssl</a> 申请免费证书（3个月*50）到期重新操作一次。</p><h2 id="域名备案" tabindex="-1"><a class="header-anchor" href="#域名备案"><span>域名备案</span></a></h2><h2 id="域名解析" tabindex="-1"><a class="header-anchor" href="#域名解析"><span>域名解析</span></a></h2><p>轻量云 -&gt; 轻量域名 -&gt; 域名 -&gt; 添加域名，按照提示填写。</p><p>记录类型：</p><ul><li>A记录：将域名指向服务器IP</li><li>CNAME记录：将域名指向另一个域名</li><li>MX记录：邮件服务器记录，用于接收邮件</li></ul><h2 id="安装ssl证书" tabindex="-1"><a class="header-anchor" href="#安装ssl证书"><span>安装SSL证书</span></a></h2><h2 id="验证绑定结果" tabindex="-1"><a class="header-anchor" href="#验证绑定结果"><span>验证绑定结果</span></a></h2><p>http://zmyblog.site http://www.zmyblog.site</p><div class="hint-container warning"><p class="hint-container-title">注意</p><p>网上很多资料显示宝塔面板访问路径为<code>http://your-server-ip:8888</code>，但腾讯云服务器宝塔面板的实际访问路径为<code>http://your-server-ip:8888/tencentcloud</code>。可通过服务器 -&gt; 应用管理 -&gt; 应用内软件信息查看到宝塔面板的实际访问路径。在终端执行<code>sudo /etc/init.d/bt default</code>可查看用户名和密码。</p></div><h2 id="宝塔面板安装-nginx" tabindex="-1"><a class="header-anchor" href="#宝塔面板安装-nginx"><span>宝塔面板安装 Nginx</span></a></h2><p>选择宝塔面板镜像并不会自动安装 Nginx，需要登录宝塔面板安装 Nginx。</p><div class="hint-container tip"><p class="hint-container-title">提示</p><ul><li>不推荐手动安装 Nginx，会与宝塔面板安装的Nginx冲突，yum安装软件也会排除Nginx。 推荐LNMP一键安装包，安装Nginx、MySQL、PHP、phpMyAdmin。</li></ul></div><h3 id="默认目录" tabindex="-1"><a class="header-anchor" href="#默认目录"><span>默认目录</span></a></h3><p>在 宝塔面板（BT Panel） 中，Nginx 的默认安装路径和配置文件目录与手动编译或 yum 安装的有所不同。</p><h4 id="安装目录" tabindex="-1"><a class="header-anchor" href="#安装目录"><span>安装目录</span></a></h4><ul><li>安装目录：/www/server/nginx/</li></ul><h4 id="配置文件目录" tabindex="-1"><a class="header-anchor" href="#配置文件目录"><span>配置文件目录</span></a></h4>',19)),n("ul",null,[n("li",null,[l[14]||(l[14]=s("配置文件目录：/www/server/nginx/conf/ ")),n("ul",null,[n("li",null,[l[13]||(l[13]=s("默认配置文件：/www/server/nginx/conf/nginx.conf ")),i(p,null,{default:e(()=>l[12]||(l[12]=[s("默认配置文件是 Nginx 的主配置文件，一般情况下，不需要修改。")])),_:1,__:[12]})])])]),n("li",null,[l[18]||(l[18]=s("站点配置文件目录：/www/server/panel/vhost/nginx/ ")),n("ul",null,[n("li",null,[l[16]||(l[16]=s("默认站点配置文件：/www/server/panel/vhost/nginx/0.default.conf ")),i(p,null,{default:e(()=>l[15]||(l[15]=[s("如果没有找到默认站点配置文件，可以手动创建。")])),_:1,__:[15]})]),l[17]||(l[17]=n("li",null,"每个站点一个文件：/www/server/panel/vhost/nginx/your_domain.conf",-1))])])]),l[25]||(l[25]=n("div",{class:"hint-container tip"},[n("p",{class:"hint-container-title"},"提示"),n("p",null,"如果没有找到默认站点配置文件和默认网站根目录，可以手动创建。")],-1)),i(o,{id:"127",data:[{id:"nginx.conf"},{id:"手动创建默认站点配置文件、默认网页"}]},{title0:e(({value:r,isActive:c})=>l[19]||(l[19]=[s("nginx.conf")])),title1:e(({value:r,isActive:c})=>l[20]||(l[20]=[s("手动创建默认站点配置文件、默认网页")])),tab0:e(({value:r,isActive:c})=>l[21]||(l[21]=[n("div",{class:"language-conf line-numbers-mode","data-highlighter":"prismjs","data-ext":"conf"},[n("pre",null,[n("code",null,[n("span",{class:"line"},"user  www www;"),s(`
`),n("span",{class:"line"},"worker_processes auto;"),s(`
`),n("span",{class:"line"},"error_log  /www/wwwlogs/nginx_error.log  crit;"),s(`
`),n("span",{class:"line"},"pid        /www/server/nginx/logs/nginx.pid;"),s(`
`),n("span",{class:"line"},"worker_rlimit_nofile 51200;"),s(`
`),n("span",{class:"line"}),s(`
`),n("span",{class:"line"},"stream {"),s(`
`),n("span",{class:"line"},"    log_format tcp_format '$time_local|$remote_addr|$protocol|$status|$bytes_sent|$bytes_received|$session_time|$upstream_addr|$upstream_bytes_sent|$upstream_bytes_received|$upstream_connect_time';"),s(`
`),n("span",{class:"line"}),s(`
`),n("span",{class:"line"},"    access_log /www/wwwlogs/tcp-access.log tcp_format;"),s(`
`),n("span",{class:"line"},"    error_log /www/wwwlogs/tcp-error.log;"),s(`
`),n("span",{class:"line"},"    include /www/server/panel/vhost/nginx/tcp/*.conf;"),s(`
`),n("span",{class:"line"},"}"),s(`
`),n("span",{class:"line"}),s(`
`),n("span",{class:"line"},"events"),s(`
`),n("span",{class:"line"},"    {"),s(`
`),n("span",{class:"line"},"        use epoll;"),s(`
`),n("span",{class:"line"},"        worker_connections 51200;"),s(`
`),n("span",{class:"line"},"        multi_accept on;"),s(`
`),n("span",{class:"line"},"    }"),s(`
`),n("span",{class:"line"}),s(`
`),n("span",{class:"line"},"http"),s(`
`),n("span",{class:"line"},"    {"),s(`
`),n("span",{class:"line"},"        include       mime.types;"),s(`
`),n("span",{class:"line"},"                #include luawaf.conf;"),s(`
`),n("span",{class:"line"}),s(`
`),n("span",{class:"line"},"                include proxy.conf;"),s(`
`),n("span",{class:"line"},'        lua_package_path "/www/server/nginx/lib/lua/?.lua;;";'),s(`
`),n("span",{class:"line"}),s(`
`),n("span",{class:"line"},"        default_type  application/octet-stream;"),s(`
`),n("span",{class:"line"}),s(`
`),n("span",{class:"line"},"        server_names_hash_bucket_size 512;"),s(`
`),n("span",{class:"line"},"        client_header_buffer_size 32k;"),s(`
`),n("span",{class:"line"},"        large_client_header_buffers 4 32k;"),s(`
`),n("span",{class:"line"},"        client_max_body_size 50m;"),s(`
`),n("span",{class:"line"}),s(`
`),n("span",{class:"line"},"        sendfile   on;"),s(`
`),n("span",{class:"line"},"        tcp_nopush on;"),s(`
`),n("span",{class:"line"}),s(`
`),n("span",{class:"line"},"        keepalive_timeout 60;"),s(`
`),n("span",{class:"line"}),s(`
`),n("span",{class:"line"},"        tcp_nodelay on;"),s(`
`),n("span",{class:"line"}),s(`
`),n("span",{class:"line"},"        fastcgi_connect_timeout 300;"),s(`
`),n("span",{class:"line"},"        fastcgi_send_timeout 300;"),s(`
`),n("span",{class:"line"},"        fastcgi_read_timeout 300;"),s(`
`),n("span",{class:"line"},"        fastcgi_buffer_size 64k;"),s(`
`),n("span",{class:"line"},"        fastcgi_buffers 4 64k;"),s(`
`),n("span",{class:"line"},"        fastcgi_busy_buffers_size 128k;"),s(`
`),n("span",{class:"line"},"        fastcgi_temp_file_write_size 256k;"),s(`
`),n("span",{class:"line"},"                fastcgi_intercept_errors on;"),s(`
`),n("span",{class:"line"}),s(`
`),n("span",{class:"line"},"        gzip on;"),s(`
`),n("span",{class:"line"},"        gzip_min_length  1k;"),s(`
`),n("span",{class:"line"},"        gzip_buffers     4 16k;"),s(`
`),n("span",{class:"line"},"        gzip_http_version 1.1;"),s(`
`),n("span",{class:"line"},"        gzip_comp_level 2;"),s(`
`),n("span",{class:"line"},"        gzip_types     text/plain application/javascript application/x-javascript text/javascript text/css application/xml application/json image/jpeg image/gif image/png font/ttf font/otf image/svg+xml application/xml+rss text/x-js;"),s(`
`),n("span",{class:"line"},"        gzip_vary on;"),s(`
`),n("span",{class:"line"},"        gzip_proxied   expired no-cache no-store private auth;"),s(`
`),n("span",{class:"line"},'        gzip_disable   "MSIE [1-6]\\.";'),s(`
`),n("span",{class:"line"}),s(`
`),n("span",{class:"line"},"        limit_conn_zone $binary_remote_addr zone=perip:10m;"),s(`
`),n("span",{class:"line"},"                limit_conn_zone $server_name zone=perserver:10m;"),s(`
`),n("span",{class:"line"}),s(`
`),n("span",{class:"line"},"        server_tokens off;"),s(`
`),n("span",{class:"line"},"        access_log off;"),s(`
`),n("span",{class:"line"}),s(`
`),n("span",{class:"line"},"        server"),s(`
`),n("span",{class:"line"},"            {"),s(`
`),n("span",{class:"line"},"                listen 888;"),s(`
`),n("span",{class:"line"},"                server_name phpmyadmin;"),s(`
`),n("span",{class:"line"},"                index index.html index.htm index.php;"),s(`
`),n("span",{class:"line"},"                root  /www/server/phpmyadmin;"),s(`
`),n("span",{class:"line"}),s(`
`),n("span",{class:"line"},"                #error_page   404   /404.html;"),s(`
`),n("span",{class:"line"},"                include enable-php.conf;"),s(`
`),n("span",{class:"line"}),s(`
`),n("span",{class:"line"},"                # 访问图片文件的配置"),s(`
`),n("span",{class:"line"},"                location ~ .*\\.(gif|jpg|jpeg|png|bmp|swf)$"),s(`
`),n("span",{class:"line"},"                {"),s(`
`),n("span",{class:"line"},"                    expires      30d;"),s(`
`),n("span",{class:"line"},"                }"),s(`
`),n("span",{class:"line"}),s(`
`),n("span",{class:"line"},"                # 访问js、css文件的配置"),s(`
`),n("span",{class:"line"},"                location ~ .*\\.(js|css)?$"),s(`
`),n("span",{class:"line"},"                {"),s(`
`),n("span",{class:"line"},"                    expires      12h;"),s(`
`),n("span",{class:"line"},"                }"),s(`
`),n("span",{class:"line"}),s(`
`),n("span",{class:"line"},"                location ~ /\\."),s(`
`),n("span",{class:"line"},"                {"),s(`
`),n("span",{class:"line"},"                    deny all;"),s(`
`),n("span",{class:"line"},"                }"),s(`
`),n("span",{class:"line"}),s(`
`),n("span",{class:"line"},"                access_log  /www/wwwlogs/access.log;"),s(`
`),n("span",{class:"line"},"            }"),s(`
`),n("span",{class:"line"},"        include /www/server/panel/vhost/nginx/*.conf; # 加载站点配置文件"),s(`
`),n("span",{class:"line"},"}"),s(`
`),n("span",{class:"line"})])]),n("div",{class:"line-numbers","aria-hidden":"true",style:{"counter-reset":"line-number 0"}},[n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"})])],-1)])),tab1:e(({value:r,isActive:c})=>l[22]||(l[22]=[n("div",{class:"language-bash line-numbers-mode","data-highlighter":"prismjs","data-ext":"sh"},[n("pre",null,[n("code",null,[n("span",{class:"line"},[n("span",{class:"token function"},"cat"),s(),n("span",{class:"token operator"},">"),s(" /www/server/panel/vhost/nginx/0.default.conf "),n("span",{class:"token operator"},"<<"),n("span",{class:"token string"},"EOF"),s(`
`),n("span",{class:"line"},"server {"),s(`
`),n("span",{class:"line"},"    listen 80 default_server;"),s(`
`),n("span",{class:"line"},"    server_name _;"),s(`
`),n("span",{class:"line"},"    root /www/wwwroot/default;  # 替换为你的网站根目录"),s(`
`),n("span",{class:"line"},"    index index.html index.php;"),s(`
`),n("span",{class:"line"},"    access_log /www/wwwlogs/default.log;"),s(`
`),n("span",{class:"line"},"}"),s(`
`),n("span",{class:"line"},"EOF")]),s(`
`),n("span",{class:"line"},[n("span",{class:"token function"},"mkdir"),s(),n("span",{class:"token parameter variable"},"-p"),s(" /www/wwwroot/default")]),s(`
`),n("span",{class:"line"},[n("span",{class:"token builtin class-name"},"echo"),s(),n("span",{class:"token string"},'"Hello, this is default site"'),s(),n("span",{class:"token operator"},">"),s(" /www/wwwroot/default/index.html")]),s(`
`),n("span",{class:"line"})])]),n("div",{class:"line-numbers","aria-hidden":"true",style:{"counter-reset":"line-number 0"}},[n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"})])],-1)])),_:1}),l[26]||(l[26]=d(`<h4 id="默认网站根目录" tabindex="-1"><a class="header-anchor" href="#默认网站根目录"><span>默认网站根目录</span></a></h4><ul><li>默认网站根目录：/www/wwwroot/ <ul><li>网站域名对应目录：/www/wwwroot/your_domain/</li></ul></li></ul><h4 id="日志目录" tabindex="-1"><a class="header-anchor" href="#日志目录"><span>日志目录</span></a></h4><ul><li>日志目录：/www/wwwlogs/ <ul><li>访问日志：/www/wwwlogs/your_domain.access.log</li><li>错误日志：/www/wwwlogs/your_domain.error.log</li></ul></li></ul><h4 id="其他关键目录" tabindex="-1"><a class="header-anchor" href="#其他关键目录"><span>其他关键目录</span></a></h4><ul><li>Nginx模块目录：/www/server/nginx/modules/</li><li>SSL证书目录：/www/server/panel/vhost/ssl/</li><li>宝塔面板配置：/www/server/panel/data</li></ul><h3 id="总结" tabindex="-1"><a class="header-anchor" href="#总结"><span>总结</span></a></h3><p>宝塔面板的 Nginx 目录集中存放在 /www/server/nginx/ 下，与常规 Linux 系统的 /usr/local/nginx/ 或 /etc/nginx/ 不同。如果需要修改配置或排查问题，优先通过宝塔面板操作，避免手动修改导致服务异常。</p><h2 id="nginx-常见问题" tabindex="-1"><a class="header-anchor" href="#nginx-常见问题"><span>Nginx 常见问题</span></a></h2><h3 id="nginx-被-exclude-排除" tabindex="-1"><a class="header-anchor" href="#nginx-被-exclude-排除"><span>Nginx 被 exclude 排除</span></a></h3><div class="hint-container warning"><p class="hint-container-title">注意</p><p>All matches were filtered out by exclude filtering for argument: nginx Error: Unable to find a match: nginx</p></div><p>问题原因：Nginx 被 exclude 排除</p><div class="language-conf line-numbers-mode" data-highlighter="prismjs" data-ext="conf"><pre><code><span class="line">[main]</span>
<span class="line">gpgcheck=1</span>
<span class="line">installonly_limit=3</span>
<span class="line">clean_requirements_on_remove=True</span>
<span class="line">best=True</span>
<span class="line">skip_if_unavailable=False</span>
<span class="line">zchunk=False</span>
<span class="line">exclude=httpd nginx php mysql mairadb python-psutil python2-psutil</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>解决方案：</p><ol><li>检查 /etc/yum.conf 或仓库文件，删除 exclude=nginx</li><li>腾讯云服务器宝塔面板、LNMP等会自动安装 nginx，可以忽略此问题</li></ol><h3 id="访问宝塔面板出现404-not-found-nginx" tabindex="-1"><a class="header-anchor" href="#访问宝塔面板出现404-not-found-nginx"><span>访问宝塔面板出现404 Not Found nginx</span></a></h3><p>404 Not Found (nginx) 错误，表示 Nginx 无法找到请求的资源（如网页、图片、API 等）。 可能原因：访问地址不对 解决方案：腾讯云服务器的宝塔面板访问地址为<code>http://your-server-ip:8888/tencentcloud</code>，而非<code>http://your-server-ip:8888</code>。</p><h2 id="宝塔linux面板镜像默认配置" tabindex="-1"><a class="header-anchor" href="#宝塔linux面板镜像默认配置"><span>宝塔Linux面板镜像默认配置</span></a></h2><p>操作系统：OpenCloudOS 9</p><p>默认安装软件：</p><ul><li>yum</li><li>curl</li><li>openssl</li><li>python3</li></ul><p>宝塔面板推荐安装的软件：</p><ul><li>LNMP一键安装包 <ul><li>Nginx</li><li>MySQL</li><li>PHP</li><li>phpMyAdmin</li></ul></li></ul>`,23))])}const f=u(b,[["render",h]]),_=JSON.parse('{"path":"/linux/cloud/tencent.html","title":"腾讯云服务器","lang":"zh-CN","frontmatter":{"title":"腾讯云服务器","date":"2025-07-08T05:23:38.399Z","category":["linux","cloud","tencent"],"tags":["linux","cloud","tencent"]},"git":{"updatedTime":1788422102000,"contributors":[{"name":"zhaomy","username":"zhaomy","email":"3036190149@qq.com","commits":5,"url":"https://github.com/zhaomy"}],"changelog":[{"hash":"964f26bfa8592b9baf3de542da6e0c9ba5d37c81","time":1788422102000,"email":"3036190149@qq.com","author":"zhaomy","message":"refactor: 将 posts/linux/ 和 posts/code/nginx/ 移至 docs/ 顶层"},{"hash":"78ff1243cb10e9d83e5d96644eadd92f1163b762","time":1752628818000,"email":"3036190149@qq.com","author":"zhaomy","message":"1. deploy-docs.yml 2. nginx.conf 2. title"},{"hash":"e5db736c87d043812b2106b05ada7017fab60b62","time":1752195777000,"email":"3036190149@qq.com","author":"zhaomy","message":"1、目录调整 2、算法：动态规划、领域算法-负载均衡 3、Nginx负载均衡、配置文件"},{"hash":"037b4b58297d317e4d494bb314b88c520af07296","time":1752123198000,"email":"3036190149@qq.com","author":"zhaomy","message":"1. 腾讯云服务器 2. 宝塔面板安装 Nginx"},{"hash":"37cc25ddca5d2e8fc5dbaadd1047cf5640365b57","time":1752121317000,"email":"3036190149@qq.com","author":"zhaomy","message":"1. 腾讯云服务器 2. Nginx 3. 宝塔面板安装 Nginx"}]},"filePathRelative":"linux/cloud/tencent.md","excerpt":"\\n\\n<h2>购买服务器、域名、SSL</h2>\\n<p><a href=\\"https://console.cloud.tencent.com/ssl\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">https://console.cloud.tencent.com/ssl</a> 申请免费证书（3个月*50）到期重新操作一次。</p>\\n<h2>域名备案</h2>\\n<h2>域名解析</h2>\\n<p>轻量云 -&gt; 轻量域名 -&gt; 域名 -&gt; 添加域名，按照提示填写。</p>\\n<p>记录类型：</p>\\n<ul>\\n<li>A记录：将域名指向服务器IP</li>\\n<li>CNAME记录：将域名指向另一个域名</li>\\n<li>MX记录：邮件服务器记录，用于接收邮件</li>\\n</ul>"}');export{f as comp,_ as data};
