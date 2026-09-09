import{_ as d,c as m,a as n,b as u,d as l,w as a,r as t,o as b,e as s}from"./app-CXDlbpxe.js";const v={},g={class:"table-of-contents"};function h(k,e){const i=t("router-link"),p=t("CodeTabs"),o=t("RouteLink");return b(),m("div",null,[e[16]||(e[16]=n("h1",{id:"nginx的负载均衡算法",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#nginx的负载均衡算法"},[n("span",null,"Nginx的负载均衡算法")])],-1)),n("nav",g,[n("ul",null,[n("li",null,[l(i,{to:"#nginx的负载均衡算法-1"},{default:a(()=>e[0]||(e[0]=[s("Nginx的负载均衡算法")])),_:1,__:[0]}),n("ul",null,[n("li",null,[l(i,{to:"#平滑加权轮询法"},{default:a(()=>e[1]||(e[1]=[s("平滑加权轮询法")])),_:1,__:[1]})]),n("li",null,[l(i,{to:"#源地址哈希法"},{default:a(()=>e[2]||(e[2]=[s("源地址哈希法")])),_:1,__:[2]})]),n("li",null,[l(i,{to:"#fair-第三方"},{default:a(()=>e[3]||(e[3]=[s("fair(第三方)")])),_:1,__:[3]})]),n("li",null,[l(i,{to:"#url-hash-第三方"},{default:a(()=>e[4]||(e[4]=[s("url_hash(第三方)")])),_:1,__:[4]})]),n("li",null,[l(i,{to:"#nginx-配置文件设备状态详解"},{default:a(()=>e[5]||(e[5]=[s("Nginx 配置文件设备状态详解")])),_:1,__:[5]})])])]),n("li",null,[l(i,{to:"#相关文章"},{default:a(()=>e[6]||(e[6]=[s("相关文章")])),_:1,__:[6]})])])]),e[17]||(e[17]=u('<h2 id="nginx的负载均衡算法-1" tabindex="-1"><a class="header-anchor" href="#nginx的负载均衡算法-1"><span>Nginx的负载均衡算法</span></a></h2><p>Nginx有5中负载均衡算法:</p><ul><li>轮询(默认)</li><li>平滑加权轮询法</li><li>源地址哈希法</li><li>fair(第三方)</li><li>url_hash(第三方)</li></ul><h3 id="平滑加权轮询法" tabindex="-1"><a class="header-anchor" href="#平滑加权轮询法"><span>平滑加权轮询法</span></a></h3><p>Nginx 加权轮询采用的算法是平滑加权轮询算法，避免连续请求集中在高权重服务器。下面给出源地址哈希法的配置示例、完整配置文件和配置验证步骤：</p>',5)),l(p,{id:"45",data:[{id:"配置示例"},{id:"完整配置（基于宝塔面板默认配置）"},{id:"配置验证步骤"}]},{title0:a(({value:c,isActive:r})=>e[7]||(e[7]=[s("配置示例")])),title1:a(({value:c,isActive:r})=>e[8]||(e[8]=[s("完整配置（基于宝塔面板默认配置）")])),title2:a(({value:c,isActive:r})=>e[9]||(e[9]=[s("配置验证步骤")])),tab0:a(({value:c,isActive:r})=>e[10]||(e[10]=[n("div",{class:"language-json line-numbers-mode","data-highlighter":"prismjs","data-ext":"json"},[n("pre",null,[n("code",null,[n("span",{class:"line"},[s("http "),n("span",{class:"token punctuation"},"{")]),s(`
`),n("span",{class:"line"},[s("    upstream backend "),n("span",{class:"token punctuation"},"{")]),s(`
`),n("span",{class:"line"},[s("      # 格式：server "),n("span",{class:"token punctuation"},"["),s("地址"),n("span",{class:"token punctuation"},"]"),s(),n("span",{class:"token punctuation"},"["),s("参数"),n("span",{class:"token punctuation"},"]"),s(" weight="),n("span",{class:"token punctuation"},"["),s("权重值"),n("span",{class:"token punctuation"},"]")]),s(`
`),n("span",{class:"line"},[s("      server "),n("span",{class:"token number"},"192.168"),s("."),n("span",{class:"token number"},"1.100"),s(" weight="),n("span",{class:"token number"},"3"),s(";  # 权重"),n("span",{class:"token number"},"3")]),s(`
`),n("span",{class:"line"},[s("      server "),n("span",{class:"token number"},"192.168"),s("."),n("span",{class:"token number"},"1.101"),s(" weight="),n("span",{class:"token number"},"2"),s(";  # 权重"),n("span",{class:"token number"},"2")]),s(`
`),n("span",{class:"line"},[s("      server "),n("span",{class:"token number"},"192.168"),s("."),n("span",{class:"token number"},"1.102"),s(" weight="),n("span",{class:"token number"},"1"),s(";  # 权重"),n("span",{class:"token number"},"1")]),s(`
`),n("span",{class:"line"},[s("    "),n("span",{class:"token punctuation"},"}")]),s(`
`),n("span",{class:"line"}),s(`
`),n("span",{class:"line"},[s("    server "),n("span",{class:"token punctuation"},"{")]),s(`
`),n("span",{class:"line"},[s("        listen "),n("span",{class:"token number"},"80"),s(";")]),s(`
`),n("span",{class:"line"},[s("        location / "),n("span",{class:"token punctuation"},"{")]),s(`
`),n("span",{class:"line"},[s("            proxy_pass http"),n("span",{class:"token operator"},":"),n("span",{class:"token comment"},"//backend;")]),s(`
`),n("span",{class:"line"},"            proxy_set_header Host $host;"),s(`
`),n("span",{class:"line"},[s("        "),n("span",{class:"token punctuation"},"}")]),s(`
`),n("span",{class:"line"},[s("    "),n("span",{class:"token punctuation"},"}")]),s(`
`),n("span",{class:"line"},[n("span",{class:"token punctuation"},"}")]),s(`
`),n("span",{class:"line"})])]),n("div",{class:"line-numbers","aria-hidden":"true",style:{"counter-reset":"line-number 0"}},[n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"})])],-1)])),tab1:a(({value:c,isActive:r})=>e[11]||(e[11]=[n("div",{class:"language-conf line-numbers-mode","data-highlighter":"prismjs","data-ext":"conf"},[n("pre",null,[n("code",null,[n("span",{class:"line"},"user  www www;"),s(`
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
`),n("span",{class:"line"},"        # 加权轮询负载均衡配置"),s(`
`),n("span",{class:"line"},"        upstream backend {"),s(`
`),n("span",{class:"line"},"            # 格式：server [地址] [参数] weight=[权重值]"),s(`
`),n("span",{class:"line"},"            server 192.168.1.100 weight=3;  # 权重3"),s(`
`),n("span",{class:"line"},"            server 192.168.1.101 weight=2;  # 权重2"),s(`
`),n("span",{class:"line"},"            server 192.168.1.102 weight=1;  # 权重1"),s(`
`),n("span",{class:"line"},"        }"),s(`
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
`),n("span",{class:"line"},"                location ~ .*\\.(gif|jpg|jpeg|png|bmp|swf)$"),s(`
`),n("span",{class:"line"},"                {"),s(`
`),n("span",{class:"line"},"                    expires      30d;"),s(`
`),n("span",{class:"line"},"                }"),s(`
`),n("span",{class:"line"}),s(`
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
`),n("span",{class:"line"},"include /www/server/panel/vhost/nginx/*.conf; # 加载站点配置文件"),s(`
`),n("span",{class:"line"},"}"),s(`
`),n("span",{class:"line"})])]),n("div",{class:"line-numbers","aria-hidden":"true",style:{"counter-reset":"line-number 0"}},[n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"})])],-1)])),tab2:a(({value:c,isActive:r})=>e[12]||(e[12]=[n("div",{class:"language-bash line-numbers-mode","data-highlighter":"prismjs","data-ext":"sh"},[n("pre",null,[n("code",null,[n("span",{class:"line"},[n("span",{class:"token comment"},"# 检查配置文件是否有语法错误")]),s(`
`),n("span",{class:"line"},[n("span",{class:"token function"},"sudo"),s(" nginx "),n("span",{class:"token parameter variable"},"-t"),s()]),s(`
`),n("span",{class:"line"}),s(`
`),n("span",{class:"line"},[n("span",{class:"token comment"},"# 重启nginx")]),s(`
`),n("span",{class:"line"},[n("span",{class:"token function"},"sudo"),s(" systemctl reload nginx ")]),s(`
`),n("span",{class:"line"}),s(`
`),n("span",{class:"line"},[n("span",{class:"token comment"},"# 连续访问测试（替换为你的域名/IP）")]),s(`
`),n("span",{class:"line"},[n("span",{class:"token keyword"},"for"),s(),n("span",{class:"token for-or-select variable"},"i"),s(),n("span",{class:"token keyword"},"in"),s(),n("span",{class:"token punctuation"},"{"),n("span",{class:"token number"},"1"),n("span",{class:"token punctuation"},".."),n("span",{class:"token number"},"10"),n("span",{class:"token punctuation"},"}"),n("span",{class:"token punctuation"},";"),s(),n("span",{class:"token keyword"},"do"),s(),n("span",{class:"token function"},"curl"),s(" http://your-domain.com"),n("span",{class:"token punctuation"},";"),s(),n("span",{class:"token keyword"},"done")]),s(`
`),n("span",{class:"line"})])]),n("div",{class:"line-numbers","aria-hidden":"true",style:{"counter-reset":"line-number 0"}},[n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"})])],-1)])),_:1}),e[18]||(e[18]=n("h3",{id:"源地址哈希法",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#源地址哈希法"},[n("span",null,"源地址哈希法")])],-1)),e[19]||(e[19]=n("p",null,"Nginx源地址哈希法采用源地址哈希算法，根据客户端IP地址进行负载均衡。",-1)),l(p,{id:"62",data:[{id:"配置示例"}]},{title0:a(({value:c,isActive:r})=>e[13]||(e[13]=[s("配置示例")])),tab0:a(({value:c,isActive:r})=>e[14]||(e[14]=[n("div",{class:"language-json line-numbers-mode","data-highlighter":"prismjs","data-ext":"json"},[n("pre",null,[n("code",null,[n("span",{class:"line"},[s("http "),n("span",{class:"token punctuation"},"{")]),s(`
`),n("span",{class:"line"},[s("    upstream backend "),n("span",{class:"token punctuation"},"{")]),s(`
`),n("span",{class:"line"},"        ip_hash;"),s(`
`),n("span",{class:"line"},[s("        server "),n("span",{class:"token number"},"192.168"),s("."),n("span",{class:"token number"},"1.100"),s(";")]),s(`
`),n("span",{class:"line"},[s("        server "),n("span",{class:"token number"},"192.168"),s("."),n("span",{class:"token number"},"1.101"),s(";")]),s(`
`),n("span",{class:"line"},[s("        server "),n("span",{class:"token number"},"192.168"),s("."),n("span",{class:"token number"},"1.102"),s(";")]),s(`
`),n("span",{class:"line"},[s("    "),n("span",{class:"token punctuation"},"}")]),s(`
`),n("span",{class:"line"},[n("span",{class:"token punctuation"},"}")]),s(`
`),n("span",{class:"line"})])]),n("div",{class:"line-numbers","aria-hidden":"true",style:{"counter-reset":"line-number 0"}},[n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"}),n("div",{class:"line-number"})])],-1)])),_:1}),e[20]||(e[20]=u(`<h3 id="fair-第三方" tabindex="-1"><a class="header-anchor" href="#fair-第三方"><span>fair(第三方)</span></a></h3><p>按后端服务器的响应时间来分配请求，响应时间短的优先分配。</p><div class="language-json line-numbers-mode" data-highlighter="prismjs" data-ext="json"><pre><code><span class="line">http <span class="token punctuation">{</span></span>
<span class="line">  upstream backend <span class="token punctuation">{</span>  </span>
<span class="line">    server <span class="token number">192.168</span>.<span class="token number">1.100</span>;  </span>
<span class="line">    server <span class="token number">192.168</span>.<span class="token number">1.101</span>;  </span>
<span class="line">    fair;  </span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="url-hash-第三方" tabindex="-1"><a class="header-anchor" href="#url-hash-第三方"><span>url_hash(第三方)</span></a></h3><p>按访问url的hash结果来分配请求，使每个url定向到同一个后端服务器，后端服务器为缓存时比较有效。 在upstream中加入hash语句，hash_method是使用的hash算法。</p><div class="language-json line-numbers-mode" data-highlighter="prismjs" data-ext="json"><pre><code><span class="line">http <span class="token punctuation">{</span></span>
<span class="line">  upstream backend <span class="token punctuation">{</span>  </span>
<span class="line">    server <span class="token number">192.168</span>.<span class="token number">1.100</span>;  </span>
<span class="line">    server <span class="token number">192.168</span>.<span class="token number">1.101</span>;  </span>
<span class="line">    hash $request_uri;  </span>
<span class="line">    hash_method crc32;  </span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="nginx-配置文件设备状态详解" tabindex="-1"><a class="header-anchor" href="#nginx-配置文件设备状态详解"><span>Nginx 配置文件设备状态详解</span></a></h3><ul><li>down：表示当前服务器暂时不参与负载均衡</li><li>weight：权重，默认为1，权重越高，负载越大</li><li>max_fails：允许请求失败的次数，默认为1，超过次数将会把服务器从负载均衡的轮转中移除</li><li>fail_timeout：max_fails次失败后，服务器暂停的时间</li><li>backup：其它所有的非backup机器down或者忙的时候，请求backup机器</li></ul><h2 id="相关文章" tabindex="-1"><a class="header-anchor" href="#相关文章"><span>相关文章</span></a></h2>`,9)),n("p",null,[l(o,{to:"/algorithm/domain/load-balance.html"},{default:a(()=>e[15]||(e[15]=[s("算法 > 领域算法 > 负载均衡算法")])),_:1,__:[15]})])])}const f=d(v,[["render",h]]),x=JSON.parse('{"path":"/linux/web/nginx-load-balance.html","title":"Nginx的负载均衡算法","lang":"zh-CN","frontmatter":{"title":"Nginx的负载均衡算法","date":"2025-07-10T08:15:57.454Z","category":["linux","web","nginx-load-balance"],"tags":["linux","web","nginx-load-balance"]},"git":{"updatedTime":1788422102000,"contributors":[{"name":"zhaomy","username":"zhaomy","email":"3036190149@qq.com","commits":2,"url":"https://github.com/zhaomy"}],"changelog":[{"hash":"964f26bfa8592b9baf3de542da6e0c9ba5d37c81","time":1788422102000,"email":"3036190149@qq.com","author":"zhaomy","message":"refactor: 将 posts/linux/ 和 posts/code/nginx/ 移至 docs/ 顶层"},{"hash":"6106c5e202ee34d0f1e151924feb029b8ab4e319","time":1781068491000,"email":"3036190149@qq.com","author":"zhaomy","message":"新增Linux笔记并增补命令页"}]},"filePathRelative":"linux/web/nginx-load-balance.md","excerpt":"\\n\\n<h2>Nginx的负载均衡算法</h2>\\n<p>Nginx有5中负载均衡算法:</p>\\n<ul>\\n<li>轮询(默认)</li>\\n<li>平滑加权轮询法</li>\\n<li>源地址哈希法</li>\\n<li>fair(第三方)</li>\\n<li>url_hash(第三方)</li>\\n</ul>\\n<h3>平滑加权轮询法</h3>\\n<p>Nginx 加权轮询采用的算法是平滑加权轮询算法，避免连续请求集中在高权重服务器。下面给出源地址哈希法的配置示例、完整配置文件和配置验证步骤：</p>\\n\\n<h3>源地址哈希法</h3>\\n<p>Nginx源地址哈希法采用源地址哈希算法，根据客户端IP地址进行负载均衡。</p>"}');export{f as comp,x as data};
