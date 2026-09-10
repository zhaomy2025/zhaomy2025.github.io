import{_ as u,c as v,a as n,d as l,b as o,w as a,e as s,r,o as m}from"./app-__pB_IG8.js";const b={},g={class:"table-of-contents"};function x(f,e){const i=r("router-link"),d=r("CodeTabs"),t=r("Tip");return m(),v("div",null,[e[25]||(e[25]=n("h1",{id:"nginx",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#nginx"},[n("span",null,"Nginx")])],-1)),n("nav",g,[n("ul",null,[n("li",null,[l(i,{to:"#安装"},{default:a(()=>e[0]||(e[0]=[s("安装")])),_:1,__:[0]})]),n("li",null,[l(i,{to:"#文件夹位置"},{default:a(()=>e[1]||(e[1]=[s("文件夹位置")])),_:1,__:[1]})]),n("li",null,[l(i,{to:"#校验配置文件"},{default:a(()=>e[2]||(e[2]=[s("校验配置文件")])),_:1,__:[2]})]),n("li",null,[l(i,{to:"#启动"},{default:a(()=>e[3]||(e[3]=[s("启动")])),_:1,__:[3]})]),n("li",null,[l(i,{to:"#停止"},{default:a(()=>e[4]||(e[4]=[s("停止")])),_:1,__:[4]})]),n("li",null,[l(i,{to:"#重启"},{default:a(()=>e[5]||(e[5]=[s("重启")])),_:1,__:[5]})]),n("li",null,[l(i,{to:"#其他命令"},{default:a(()=>e[6]||(e[6]=[s("其他命令")])),_:1,__:[6]})]),n("li",null,[l(i,{to:"#查看服务状态"},{default:a(()=>e[7]||(e[7]=[s("查看服务状态")])),_:1,__:[7]})]),n("li",null,[l(i,{to:"#宝塔面板安装-nginx"},{default:a(()=>e[8]||(e[8]=[s("宝塔面板安装 Nginx")])),_:1,__:[8]}),n("ul",null,[n("li",null,[l(i,{to:"#默认目录"},{default:a(()=>e[9]||(e[9]=[s("默认目录")])),_:1,__:[9]})]),n("li",null,[l(i,{to:"#总结"},{default:a(()=>e[10]||(e[10]=[s("总结")])),_:1,__:[10]})])])]),n("li",null,[l(i,{to:"#nginx-常见问题"},{default:a(()=>e[11]||(e[11]=[s("Nginx 常见问题")])),_:1,__:[11]}),n("ul",null,[n("li",null,[l(i,{to:"#nginx-被-exclude-排除"},{default:a(()=>e[12]||(e[12]=[s("Nginx 被 exclude 排除")])),_:1,__:[12]})]),n("li",null,[l(i,{to:"#访问宝塔面板出现404-not-found-nginx"},{default:a(()=>e[13]||(e[13]=[s("访问宝塔面板出现404 Not Found nginx")])),_:1,__:[13]})])])])])]),e[26]||(e[26]=n("h2",{id:"安装",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#安装"},[n("span",null,"安装")])],-1)),l(d,{id:"9",data:[]}),e[27]||(e[27]=o(`<div class="hint-container tip"><p class="hint-container-title">提示</p><p>Ubuntu 支持apt-get命令</p></div><h2 id="文件夹位置" tabindex="-1"><a class="header-anchor" href="#文件夹位置"><span>文件夹位置</span></a></h2><ul><li><code>/etc/nginx</code>：配置文件目录 <ul><li><code>/etc/nginx/nginx.conf</code>: 主配置文件</li></ul></li><li><code>/etc/nginx/conf.d/</code>：站点配置文件存放目录 <ul><li><code>/etc/nginx/conf.d/default.conf</code>：站点默认配置文件</li></ul></li></ul><p>这里给出宝塔面板的nginx默认主配置文件：</p><div class="language-conf line-numbers-mode" data-highlighter="prismjs" data-ext="conf"><pre><code><span class="line">user  www www;</span>
<span class="line">worker_processes auto;</span>
<span class="line">error_log  /www/wwwlogs/nginx_error.log  crit;</span>
<span class="line">pid        /www/server/nginx/logs/nginx.pid;</span>
<span class="line">worker_rlimit_nofile 51200;</span>
<span class="line"></span>
<span class="line">stream {</span>
<span class="line">    log_format tcp_format &#39;$time_local|$remote_addr|$protocol|$status|$bytes_sent|$bytes_received|$session_time|$upstream_addr|$upstream_bytes_sent|$upstream_bytes_received|$upstream_connect_time&#39;;</span>
<span class="line"></span>
<span class="line">    access_log /www/wwwlogs/tcp-access.log tcp_format;</span>
<span class="line">    error_log /www/wwwlogs/tcp-error.log;</span>
<span class="line">    include /www/server/panel/vhost/nginx/tcp/*.conf;</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">events</span>
<span class="line">    {</span>
<span class="line">        use epoll;</span>
<span class="line">        worker_connections 51200;</span>
<span class="line">        multi_accept on;</span>
<span class="line">    }</span>
<span class="line"></span>
<span class="line">http</span>
<span class="line">    {</span>
<span class="line">        include       mime.types;</span>
<span class="line">                #include luawaf.conf;</span>
<span class="line"></span>
<span class="line">                include proxy.conf;</span>
<span class="line">        lua_package_path &quot;/www/server/nginx/lib/lua/?.lua;;&quot;;</span>
<span class="line"></span>
<span class="line">        default_type  application/octet-stream;</span>
<span class="line"></span>
<span class="line">        server_names_hash_bucket_size 512;</span>
<span class="line">        client_header_buffer_size 32k;</span>
<span class="line">        large_client_header_buffers 4 32k;</span>
<span class="line">        client_max_body_size 50m;</span>
<span class="line"></span>
<span class="line">        sendfile   on;</span>
<span class="line">        tcp_nopush on;</span>
<span class="line"></span>
<span class="line">        keepalive_timeout 60;</span>
<span class="line"></span>
<span class="line">        tcp_nodelay on;</span>
<span class="line"></span>
<span class="line">        fastcgi_connect_timeout 300;</span>
<span class="line">        fastcgi_send_timeout 300;</span>
<span class="line">        fastcgi_read_timeout 300;</span>
<span class="line">        fastcgi_buffer_size 64k;</span>
<span class="line">        fastcgi_buffers 4 64k;</span>
<span class="line">        fastcgi_busy_buffers_size 128k;</span>
<span class="line">        fastcgi_temp_file_write_size 256k;</span>
<span class="line">                fastcgi_intercept_errors on;</span>
<span class="line"></span>
<span class="line">        gzip on;</span>
<span class="line">        gzip_min_length  1k;</span>
<span class="line">        gzip_buffers     4 16k;</span>
<span class="line">        gzip_http_version 1.1;</span>
<span class="line">        gzip_comp_level 2;</span>
<span class="line">        gzip_types     text/plain application/javascript application/x-javascript text/javascript text/css application/xml application/json image/jpeg image/gif image/png font/ttf font/otf image/svg+xml application/xml+rss text/x-js;</span>
<span class="line">        gzip_vary on;</span>
<span class="line">        gzip_proxied   expired no-cache no-store private auth;</span>
<span class="line">        gzip_disable   &quot;MSIE [1-6]\\.&quot;;</span>
<span class="line"></span>
<span class="line">        limit_conn_zone $binary_remote_addr zone=perip:10m;</span>
<span class="line">                limit_conn_zone $server_name zone=perserver:10m;</span>
<span class="line"></span>
<span class="line">        server_tokens off;</span>
<span class="line">        access_log off;</span>
<span class="line"></span>
<span class="line">        server</span>
<span class="line">            {</span>
<span class="line">                listen 888;</span>
<span class="line">                server_name phpmyadmin;</span>
<span class="line">                index index.html index.htm index.php;</span>
<span class="line">                root  /www/server/phpmyadmin;</span>
<span class="line"></span>
<span class="line">                #error_page   404   /404.html;</span>
<span class="line">                include enable-php.conf;</span>
<span class="line"></span>
<span class="line">                # 访问图片文件的配置</span>
<span class="line">                location ~ .*\\.(gif|jpg|jpeg|png|bmp|swf)$</span>
<span class="line">                {</span>
<span class="line">                    expires      30d;</span>
<span class="line">                }</span>
<span class="line"></span>
<span class="line">                # 访问js、css文件的配置</span>
<span class="line">                location ~ .*\\.(js|css)?$</span>
<span class="line">                {</span>
<span class="line">                    expires      12h;</span>
<span class="line">                }</span>
<span class="line"></span>
<span class="line">                location ~ /\\.</span>
<span class="line">                {</span>
<span class="line">                    deny all;</span>
<span class="line">                }</span>
<span class="line"></span>
<span class="line">                access_log  /www/wwwlogs/access.log;</span>
<span class="line">            }</span>
<span class="line">        include /www/server/panel/vhost/nginx/*.conf; # 加载站点配置文件</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="校验配置文件" tabindex="-1"><a class="header-anchor" href="#校验配置文件"><span>校验配置文件</span></a></h2><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line"><span class="token function">sudo</span> nginx <span class="token parameter variable">-t</span> <span class="token parameter variable">-c</span> /etc/nginx/nginx.conf</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><h2 id="启动" tabindex="-1"><a class="header-anchor" href="#启动"><span>启动</span></a></h2><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line">./usr/sbin/nginx</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><h2 id="停止" tabindex="-1"><a class="header-anchor" href="#停止"><span>停止</span></a></h2><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line"><span class="token function">sudo</span> nginx <span class="token parameter variable">-s</span> quit <span class="token comment"># 优雅停止 nginx，待nginx进程处理任务完毕进行停止</span></span>
<span class="line"><span class="token function">sudo</span> nginx <span class="token parameter variable">-s</span> stop <span class="token comment"># 强制停止 nginx</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="重启" tabindex="-1"><a class="header-anchor" href="#重启"><span>重启</span></a></h2><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line"><span class="token function">sudo</span> nginx <span class="token parameter variable">-s</span> reload <span class="token comment"># 重启 nginx</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><h2 id="其他命令" tabindex="-1"><a class="header-anchor" href="#其他命令"><span>其他命令</span></a></h2><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line"><span class="token function">sudo</span> nginx <span class="token parameter variable">-s</span> reopen <span class="token comment"># 重载 nginx 配置文件</span></span>
<span class="line"><span class="token function">sudo</span> nginx <span class="token parameter variable">-c</span> fileName <span class="token comment"># 指定配置文件启动 nginx</span></span>
<span class="line"><span class="token function">sudo</span> nginx <span class="token parameter variable">-t</span> <span class="token comment"># 测试 nginx 配置是否正确</span></span>
<span class="line"><span class="token function">sudo</span> nginx <span class="token parameter variable">-v</span> <span class="token comment"># 查看 nginx 版本</span></span>
<span class="line"><span class="token function">sudo</span> nginx <span class="token parameter variable">-V</span> <span class="token comment"># 查看 nginx 版本和配置信息</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="查看服务状态" tabindex="-1"><a class="header-anchor" href="#查看服务状态"><span>查看服务状态</span></a></h2><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line"><span class="token function">ps</span> <span class="token parameter variable">-ef</span> <span class="token operator">|</span> <span class="token function">grep</span> nginx</span>
<span class="line"><span class="token function">ps</span> aux <span class="token operator">|</span> <span class="token function">grep</span> nginx</span>
<span class="line"><span class="token function">sudo</span> systemctl status nginx</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="宝塔面板安装-nginx" tabindex="-1"><a class="header-anchor" href="#宝塔面板安装-nginx"><span>宝塔面板安装 Nginx</span></a></h2><p>选择宝塔面板镜像并不会自动安装 Nginx，需要登录宝塔面板安装 Nginx。</p><div class="hint-container tip"><p class="hint-container-title">提示</p><ul><li>不推荐手动安装 Nginx，会与宝塔面板安装的Nginx冲突，yum安装软件也会排除Nginx。 推荐LNMP一键安装包，安装Nginx、MySQL、PHP、phpMyAdmin。</li></ul></div><h3 id="默认目录" tabindex="-1"><a class="header-anchor" href="#默认目录"><span>默认目录</span></a></h3><p>在 宝塔面板（BT Panel） 中，Nginx 的默认安装路径和配置文件目录与手动编译或 yum 安装的有所不同。</p><h4 id="安装目录" tabindex="-1"><a class="header-anchor" href="#安装目录"><span>安装目录</span></a></h4><ul><li>安装目录：/www/server/nginx/</li></ul><h4 id="配置文件目录" tabindex="-1"><a class="header-anchor" href="#配置文件目录"><span>配置文件目录</span></a></h4>`,25)),n("ul",null,[n("li",null,[e[16]||(e[16]=s("配置文件目录：/www/server/nginx/conf/ ")),n("ul",null,[n("li",null,[e[15]||(e[15]=s("默认配置文件：/www/server/nginx/conf/nginx.conf ")),l(t,null,{default:a(()=>e[14]||(e[14]=[s("默认配置文件是 Nginx 的主配置文件，一般情况下，不需要修改。")])),_:1,__:[14]})])])]),n("li",null,[e[20]||(e[20]=s("站点配置文件目录：/www/server/panel/vhost/nginx/ ")),n("ul",null,[n("li",null,[e[18]||(e[18]=s("默认站点配置文件：/www/server/panel/vhost/nginx/0.default.conf ")),l(t,null,{default:a(()=>e[17]||(e[17]=[s("如果没有找到默认站点配置文件，可以手动创建。")])),_:1,__:[17]})]),e[19]||(e[19]=n("li",null,"每个站点一个文件：/www/server/panel/vhost/nginx/your_domain.conf",-1))])])]),e[28]||(e[28]=n("div",{class:"hint-container tip"},[n("p",{class:"hint-container-title"},"提示"),n("p",null,"如果没有找到默认站点配置文件和默认网站根目录，可以手动创建。")],-1)),l(d,{id:"152",data:[{id:"nginx.conf"},{id:"手动创建默认站点配置文件、默认网页"}]},{title0:a(({value:c,isActive:p})=>e[21]||(e[21]=[s("nginx.conf")])),title1:a(({value:c,isActive:p})=>e[22]||(e[22]=[s("手动创建默认站点配置文件、默认网页")])),tab0:a(({value:c,isActive:p})=>e[23]||(e[23]=[n("div",{class:"language-conf line-numbers-mode","data-highlighter":"prismjs","data-ext":"conf"},[n("pre",null,[n("code",null,[n("span",{class:"line"},"user  www www;"),s(`
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
`),n("span",{class:"line"})])]),n("div",{class:"line-numbers","aria-hidden":"true",style:{"counter-reset":"line-number 0"}},[n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"})])],-1)])),tab1:a(({value:c,isActive:p})=>e[24]||(e[24]=[n("div",{class:"language-bash line-numbers-mode","data-highlighter":"prismjs","data-ext":"sh"},[n("pre",null,[n("code",null,[n("span",{class:"line"},[n("span",{class:"token function"},"cat"),s(),n("span",{class:"token operator"},">"),s(" /www/server/panel/vhost/nginx/0.default.conf "),n("span",{class:"token operator"},"<<"),n("span",{class:"token string"},"EOF"),s(`
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
`),n("span",{class:"line"})])]),n("div",{class:"line-numbers","aria-hidden":"true",style:{"counter-reset":"line-number 0"}},[n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"})])],-1)])),_:1}),e[29]||(e[29]=o(`<h4 id="默认网站根目录" tabindex="-1"><a class="header-anchor" href="#默认网站根目录"><span>默认网站根目录</span></a></h4><ul><li>默认网站根目录：/www/wwwroot/ <ul><li>网站域名对应目录：/www/wwwroot/your_domain/</li></ul></li></ul><h4 id="日志目录" tabindex="-1"><a class="header-anchor" href="#日志目录"><span>日志目录</span></a></h4><ul><li>日志目录：/www/wwwlogs/ <ul><li>访问日志：/www/wwwlogs/your_domain.access.log</li><li>错误日志：/www/wwwlogs/your_domain.error.log</li></ul></li></ul><h4 id="其他关键目录" tabindex="-1"><a class="header-anchor" href="#其他关键目录"><span>其他关键目录</span></a></h4><ul><li>Nginx模块目录：/www/server/nginx/modules/</li><li>SSL证书目录：/www/server/panel/vhost/ssl/</li><li>宝塔面板配置：/www/server/panel/data</li></ul><h3 id="总结" tabindex="-1"><a class="header-anchor" href="#总结"><span>总结</span></a></h3><p>宝塔面板的 Nginx 目录集中存放在 /www/server/nginx/ 下，与常规 Linux 系统的 /usr/local/nginx/ 或 /etc/nginx/ 不同。如果需要修改配置或排查问题，优先通过宝塔面板操作，避免手动修改导致服务异常。</p><h2 id="nginx-常见问题" tabindex="-1"><a class="header-anchor" href="#nginx-常见问题"><span>Nginx 常见问题</span></a></h2><h3 id="nginx-被-exclude-排除" tabindex="-1"><a class="header-anchor" href="#nginx-被-exclude-排除"><span>Nginx 被 exclude 排除</span></a></h3><div class="hint-container warning"><p class="hint-container-title">注意</p><p>All matches were filtered out by exclude filtering for argument: nginx Error: Unable to find a match: nginx</p></div><p>问题原因：Nginx 被 exclude 排除</p><div class="language-conf line-numbers-mode" data-highlighter="prismjs" data-ext="conf"><pre><code><span class="line">[main]</span>
<span class="line">gpgcheck=1</span>
<span class="line">installonly_limit=3</span>
<span class="line">clean_requirements_on_remove=True</span>
<span class="line">best=True</span>
<span class="line">skip_if_unavailable=False</span>
<span class="line">zchunk=False</span>
<span class="line">exclude=httpd nginx php mysql mairadb python-psutil python2-psutil</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>解决方案：</p><ol><li>检查 /etc/yum.conf 或仓库文件，删除 exclude=nginx</li><li>腾讯云服务器宝塔面板、LNMP等会自动安装 nginx，可以忽略此问题</li></ol><h3 id="访问宝塔面板出现404-not-found-nginx" tabindex="-1"><a class="header-anchor" href="#访问宝塔面板出现404-not-found-nginx"><span>访问宝塔面板出现404 Not Found nginx</span></a></h3><p>404 Not Found (nginx) 错误，表示 Nginx 无法找到请求的资源（如网页、图片、API 等）。 可能原因：访问地址不对 解决方案：腾讯云服务器的宝塔面板访问地址为<code>http://your-server-ip:8888/tencentcloud</code>，而非<code>http://your-server-ip:8888</code>。</p>`,17))])}const w=u(b,[["render",x]]),_=JSON.parse('{"path":"/linux/web/nginx.html","title":"Nginx","lang":"zh-CN","frontmatter":{"title":"Nginx","date":"2025-07-09T08:40:21.446Z","category":["linux","web","nginx"],"tags":["linux","web","nginx"]},"git":{"updatedTime":1788422102000,"contributors":[{"name":"zhaomy","username":"zhaomy","email":"3036190149@qq.com","commits":5,"url":"https://github.com/zhaomy"}],"changelog":[{"hash":"964f26bfa8592b9baf3de542da6e0c9ba5d37c81","time":1788422102000,"email":"3036190149@qq.com","author":"zhaomy","message":"refactor: 将 posts/linux/ 和 posts/code/nginx/ 移至 docs/ 顶层"},{"hash":"78ff1243cb10e9d83e5d96644eadd92f1163b762","time":1752628818000,"email":"3036190149@qq.com","author":"zhaomy","message":"1. deploy-docs.yml 2. nginx.conf 2. title"},{"hash":"e5db736c87d043812b2106b05ada7017fab60b62","time":1752195777000,"email":"3036190149@qq.com","author":"zhaomy","message":"1、目录调整 2、算法：动态规划、领域算法-负载均衡 3、Nginx负载均衡、配置文件"},{"hash":"037b4b58297d317e4d494bb314b88c520af07296","time":1752123198000,"email":"3036190149@qq.com","author":"zhaomy","message":"1. 腾讯云服务器 2. 宝塔面板安装 Nginx"},{"hash":"37cc25ddca5d2e8fc5dbaadd1047cf5640365b57","time":1752121317000,"email":"3036190149@qq.com","author":"zhaomy","message":"1. 腾讯云服务器 2. Nginx 3. 宝塔面板安装 Nginx"}]},"filePathRelative":"linux/web/nginx.md","excerpt":"\\n\\n<h2>安装</h2>\\n\\n<div class=\\"hint-container tip\\">\\n<p class=\\"hint-container-title\\">提示</p>\\n<p>Ubuntu 支持apt-get命令</p>\\n</div>\\n<h2>文件夹位置</h2>\\n<ul>\\n<li><code>/etc/nginx</code>：配置文件目录\\n<ul>\\n<li><code>/etc/nginx/nginx.conf</code>: 主配置文件</li>\\n</ul>\\n</li>\\n<li><code>/etc/nginx/conf.d/</code>：站点配置文件存放目录\\n<ul>\\n<li><code>/etc/nginx/conf.d/default.conf</code>：站点默认配置文件</li>\\n</ul>\\n</li>\\n</ul>"}');export{w as comp,_ as data};
