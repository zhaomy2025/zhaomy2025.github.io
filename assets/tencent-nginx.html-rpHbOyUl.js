import{_ as o,c as u,b as t,a as n,d as c,e as s,w as l,r as p,o as m}from"./app-DuOmEixQ.js";const v={};function b(w,e){const r=p("Tip"),d=p("CodeTabs");return m(),u("div",null,[e[11]||(e[11]=t('<h2 id="宝塔面板安装-nginx" tabindex="-1"><a class="header-anchor" href="#宝塔面板安装-nginx"><span>宝塔面板安装 Nginx</span></a></h2><p>选择宝塔面板镜像并不会自动安装 Nginx，需要登录宝塔面板安装 Nginx。</p><div class="hint-container tip"><p class="hint-container-title">提示</p><ul><li>不推荐手动安装 Nginx，会与宝塔面板安装的Nginx冲突，yum安装软件也会排除Nginx。 推荐LNMP一键安装包，安装Nginx、MySQL、PHP、phpMyAdmin。</li></ul></div><h3 id="默认目录" tabindex="-1"><a class="header-anchor" href="#默认目录"><span>默认目录</span></a></h3><p>在 宝塔面板（BT Panel） 中，Nginx 的默认安装路径和配置文件目录与手动编译或 yum 安装的有所不同。</p><h4 id="安装目录" tabindex="-1"><a class="header-anchor" href="#安装目录"><span>安装目录</span></a></h4><ul><li>安装目录：/www/server/nginx/</li></ul><h4 id="配置文件目录" tabindex="-1"><a class="header-anchor" href="#配置文件目录"><span>配置文件目录</span></a></h4>',8)),n("ul",null,[n("li",null,[e[2]||(e[2]=s("配置文件目录：/www/server/nginx/conf/ ")),n("ul",null,[n("li",null,[e[1]||(e[1]=s("默认配置文件：/www/server/nginx/conf/nginx.conf ")),c(r,null,{default:l(()=>e[0]||(e[0]=[s("默认配置文件是 Nginx 的主配置文件，一般情况下，不需要修改。")])),_:1,__:[0]})])])]),n("li",null,[e[6]||(e[6]=s("站点配置文件目录：/www/server/panel/vhost/nginx/ ")),n("ul",null,[n("li",null,[e[4]||(e[4]=s("默认站点配置文件：/www/server/panel/vhost/nginx/0.default.conf ")),c(r,null,{default:l(()=>e[3]||(e[3]=[s("如果没有找到默认站点配置文件，可以手动创建。")])),_:1,__:[3]})]),e[5]||(e[5]=n("li",null,"每个站点一个文件：/www/server/panel/vhost/nginx/your_domain.conf",-1))])])]),e[12]||(e[12]=n("div",{class:"hint-container tip"},[n("p",{class:"hint-container-title"},"提示"),n("p",null,"如果没有找到默认站点配置文件和默认网站根目录，可以手动创建。")],-1)),c(d,{id:"70",data:[{id:"nginx.conf"},{id:"手动创建默认站点配置文件、默认网页"}]},{title0:l(({value:i,isActive:a})=>e[7]||(e[7]=[s("nginx.conf")])),title1:l(({value:i,isActive:a})=>e[8]||(e[8]=[s("手动创建默认站点配置文件、默认网页")])),tab0:l(({value:i,isActive:a})=>e[9]||(e[9]=[n("div",{class:"language-conf line-numbers-mode","data-highlighter":"prismjs","data-ext":"conf"},[n("pre",null,[n("code",null,[n("span",{class:"line"},"user  www www;"),s(`
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
`),n("span",{class:"line"})])]),n("div",{class:"line-numbers","aria-hidden":"true",style:{"counter-reset":"line-number 0"}},[n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"})])],-1)])),tab1:l(({value:i,isActive:a})=>e[10]||(e[10]=[n("div",{class:"language-bash line-numbers-mode","data-highlighter":"prismjs","data-ext":"sh"},[n("pre",null,[n("code",null,[n("span",{class:"line"},[n("span",{class:"token function"},"cat"),s(),n("span",{class:"token operator"},">"),s(" /www/server/panel/vhost/nginx/0.default.conf "),n("span",{class:"token operator"},"<<"),n("span",{class:"token string"},"EOF"),s(`
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
`),n("span",{class:"line"})])]),n("div",{class:"line-numbers","aria-hidden":"true",style:{"counter-reset":"line-number 0"}},[n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"})])],-1)])),_:1}),e[13]||(e[13]=t('<h4 id="默认网站根目录" tabindex="-1"><a class="header-anchor" href="#默认网站根目录"><span>默认网站根目录</span></a></h4><ul><li>默认网站根目录：/www/wwwroot/ <ul><li>网站域名对应目录：/www/wwwroot/your_domain/</li></ul></li></ul><h4 id="日志目录" tabindex="-1"><a class="header-anchor" href="#日志目录"><span>日志目录</span></a></h4><ul><li>日志目录：/www/wwwlogs/ <ul><li>访问日志：/www/wwwlogs/your_domain.access.log</li><li>错误日志：/www/wwwlogs/your_domain.error.log</li></ul></li></ul><h4 id="其他关键目录" tabindex="-1"><a class="header-anchor" href="#其他关键目录"><span>其他关键目录</span></a></h4><ul><li>Nginx模块目录：/www/server/nginx/modules/</li><li>SSL证书目录：/www/server/panel/vhost/ssl/</li><li>宝塔面板配置：/www/server/panel/data</li></ul><h3 id="总结" tabindex="-1"><a class="header-anchor" href="#总结"><span>总结</span></a></h3><p>宝塔面板的 Nginx 目录集中存放在 /www/server/nginx/ 下，与常规 Linux 系统的 /usr/local/nginx/ 或 /etc/nginx/ 不同。如果需要修改配置或排查问题，优先通过宝塔面板操作，避免手动修改导致服务异常。</p>',8))])}const x=o(v,[["render",b]]),h=JSON.parse('{"path":"/linux/cloud/tencent-nginx.html","title":"宝塔面板安装 Nginx","lang":"zh-CN","frontmatter":{"title":"宝塔面板安装 Nginx","date":"2025-07-10T02:57:50.122Z","category":["linux","cloud","nginx"],"tags":["linux","cloud","nginx"]},"git":{"updatedTime":1788422102000,"contributors":[{"name":"zhaomy","username":"zhaomy","email":"3036190149@qq.com","commits":5,"url":"https://github.com/zhaomy"}],"changelog":[{"hash":"964f26bfa8592b9baf3de542da6e0c9ba5d37c81","time":1788422102000,"email":"3036190149@qq.com","author":"zhaomy","message":"refactor: 将 posts/linux/ 和 posts/code/nginx/ 移至 docs/ 顶层"},{"hash":"78ff1243cb10e9d83e5d96644eadd92f1163b762","time":1752628818000,"email":"3036190149@qq.com","author":"zhaomy","message":"1. deploy-docs.yml 2. nginx.conf 2. title"},{"hash":"e5db736c87d043812b2106b05ada7017fab60b62","time":1752195777000,"email":"3036190149@qq.com","author":"zhaomy","message":"1、目录调整 2、算法：动态规划、领域算法-负载均衡 3、Nginx负载均衡、配置文件"},{"hash":"037b4b58297d317e4d494bb314b88c520af07296","time":1752123198000,"email":"3036190149@qq.com","author":"zhaomy","message":"1. 腾讯云服务器 2. 宝塔面板安装 Nginx"},{"hash":"37cc25ddca5d2e8fc5dbaadd1047cf5640365b57","time":1752121317000,"email":"3036190149@qq.com","author":"zhaomy","message":"1. 腾讯云服务器 2. Nginx 3. 宝塔面板安装 Nginx"}]},"filePathRelative":"linux/cloud/tencent-nginx.md","excerpt":"<h2>宝塔面板安装 Nginx</h2>\\n<p>选择宝塔面板镜像并不会自动安装 Nginx，需要登录宝塔面板安装 Nginx。</p>\\n<div class=\\"hint-container tip\\">\\n<p class=\\"hint-container-title\\">提示</p>\\n<ul>\\n<li>不推荐手动安装 Nginx，会与宝塔面板安装的Nginx冲突，yum安装软件也会排除Nginx。\\n推荐LNMP一键安装包，安装Nginx、MySQL、PHP、phpMyAdmin。</li>\\n</ul>\\n</div>\\n<h3>默认目录</h3>\\n<p>在 宝塔面板（BT Panel） 中，Nginx 的默认安装路径和配置文件目录与手动编译或 yum 安装的有所不同。</p>"}');export{x as comp,h as data};
