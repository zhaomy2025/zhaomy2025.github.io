---
title: VuePress 部署指南：GitHub Pages 与云服务器
date: 2025-07-09T07:32:26.463Z
category:
  - vuepress
  - cloud
tags:
  - vuepress
  - cloud
---

# VuePress 部署指南：GitHub Pages 与云服务器
[[toc]]

## GitHub Pages 部署

VuePress 初始化时那个 `是否需要一个自动部署文档到 GitHub Pages 的工作流？` 选 Yes 就能拿到一份能用的配置（之前写过入门，见[开始使用VuePress](./index.md#开始使用vuepress)）。但那份配置只是"能跑"——没有云服务器部署、没有多仓库聚合，如果想要更好地控制部署流程，就得自己动手定制。本文介绍三种部署方式，每种方式的完整配置都包含构建、GitHub Pages 部署和云服务器部署三个 job：

1. **仓库名即 `<username>.github.io`**：配置最简单，直接部署到用户站点仓库。
2. **部署到用户站点仓库**：源码仓库和对外站点仓库分离，适合不想暴露源代码的场景。
3. **部署到同仓库 `gh-pages` 分支**：通过仓库名形成路径前缀，适合项目站点部署。

### 方式一：仓库名即 \<username\>.github.io

如果你的仓库名本身就是 `<用户名>.github.io`（如 `zhaomy2025.github.io`），GitHub 会自动将其识别为用户站点。构建产物由 GitHub Actions 直接发布到 Pages，不回写 `main` 分支，因此不会覆盖源码。

编写 workflow 配置，这份配置由四个部分组成：

- **`on`** — 触发条件，`push.branches: [main]` 表示 `main` 分支有推送时自动执行。
- **`permissions`** — 授权，`contents: read` 允许读取仓库内容，`pages: write` 允许发布 Pages，`id-token: write` 允许部署 action 获取 Pages 所需的身份令牌。
- **`build-docs`** — 构建文档，检出代码 → 安装依赖 → 构建 → 同时上传普通构建产物和 Pages 构建产物。
- **`deploy-to-pages`** — 发布用户站点，等待构建完成后调用 GitHub 官方 Pages 部署 action。它不把构建产物写回 `main`，所以不会清理或覆盖源码。

```yaml
on:                         # 触发条件
  push:
    branches:
      - main                # main 分支有推送时触发

permissions:
  contents: read            # 允许构建 job 读取仓库内容
  pages: write              # 允许发布 GitHub Pages
  id-token: write           # 允许部署 action 获取 Pages 所需的身份令牌

jobs:

  build-docs:
    name: 构建文档
    runs-on: ubuntu-latest
    steps:
      - name: 1. 检出代码
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: 2. 设置 Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - name: 3. 安装依赖
        run: npm ci                      # 按 package-lock.json 精确安装依赖

      - name: 4. 构建文档
        env:
          NODE_OPTIONS: --max_old_space_size=8192
        run: |-
          npm run build
          > docs/.vuepress/dist/.nojekyll   # GitHub Pages 看到此文件会跳过 Jekyll 处理，原样托管静态文件

      - name: 5. 上传构建产物
        uses: actions/upload-artifact@v4   # 提供给云服务器部署 job 使用
        with:
          name: docs-dist
          path: docs/.vuepress/dist/
          include-hidden-files: true

      - name: 6. 上传 Pages 构建产物
        uses: actions/upload-pages-artifact@v3 # 提供给 GitHub Pages 部署 job 使用
        with:
          path: docs/.vuepress/dist/

  deploy-server:
    name: 部署到云服务器
    runs-on: ubuntu-latest
    needs: build-docs
    steps:
      - name: 1. 下载构建产物
        uses: actions/download-artifact@v4
        with:
          name: docs-dist
          path: docs

      - name: 2. 打包构建产物
        run: tar -czvf docs.tar.gz -C docs/ .

      - name: 3. 传输到服务器
        uses: appleboy/scp-action@v1
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.KEY }}
          source: docs.tar.gz
          target: /tmp/

      - name: 4. 部署到服务器
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.KEY }}
          script: |
            mkdir -p /www/wwwroot # 确认该目录仅用于本站后再清理
            cd /www/wwwroot
            rm -rf -- ./* ./.[!.]* ./..?*
            tar -xzvf /tmp/docs.tar.gz -C .

  deploy-to-pages:
    name: 发布用户站点
    runs-on: ubuntu-latest
    needs: build-docs
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: 部署到 GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

::: tip .nojekyll
GitHub Pages 的分支托管方式默认会使用 Jekyll 处理文件，可能忽略以 `.` 或 `_` 开头的目录。方式二、方式三使用分支托管，因此构建产物中需要保留 `.nojekyll` 文件；上传普通 artifact 时已显式包含隐藏文件。方式一使用 Pages artifact + `deploy-pages`，不依赖分支托管流程。
:::

不需要 SSH deploy key，不需要跨仓库推送，也不需要 `base` 路径。完整的配置见[附录](#附录完整-workflow-配置)。

### 方式二：部署到用户站点仓库

项目仓库不是 `<用户名>.github.io`，但仍希望用 `https://<用户名>.github.io/` 访问？可以单独创建一个 `<用户名>.github.io` 仓库，把构建产物推送过去。这样还能让**源码仓库和对外站点分离**，不想暴露源码时只公开站点仓库即可。

**1. 创建用户站点仓库**

在 GitHub 上新建一个 Public 仓库，仓库名必须是 `<用户名>.github.io`（如 `zhaomy2025.github.io`），分支用 `main`。

**2. 生成 SSH deploy key**

跨仓库推送需要单独的 SSH key：

```bash
ssh-keygen -t ed25519 -C "vuepress-deploy" -f ~/.ssh/id_ed25519_vuepress_deploy
```

**3. 配置目标仓库**

在 `<用户名>.github.io` 仓库的 `Settings > Deploy keys` 中，添加 `id_ed25519_vuepress_deploy.pub` 的内容，**勾选 Allow write access**（否则只能读不能写）。

**4. 配置目标仓库的 Pages**

在目标仓库的 `Settings > Pages > Build and deployment` 中，将 `Source` 设置为 `Deploy from a branch`，选择 `main` 分支和 `/ (root)` 目录。

**5. 配置本项目仓库的 Secrets**

在项目仓库的 `Settings > Secrets and variables > Actions` 中，添加 `DEPLOY_KEY`，值为 `id_ed25519_vuepress_deploy` 私钥的完整内容（含 `-----BEGIN OPENSSH PRIVATE KEY-----` 和 `-----END OPENSSH PRIVATE KEY-----`）。

`<用户名>.github.io` 是本文的示例目标仓库，实际使用时请替换为自己的用户名和仓库名。

`on` 和 `build-docs` 与方式一基本一致，部署 job 改为跨仓库推送：

```yaml
deploy-to-user-site:
  name: 部署到用户站点仓库
  runs-on: ubuntu-latest
  needs: build-docs
  steps:
    - name: 1. 检出代码
      uses: actions/checkout@v4         # 必须先 checkout，否则 action 内部 git config 会报错
      with:
        fetch-depth: 0

    - name: 2. 下载构建产物
      uses: actions/download-artifact@v4
      with:
        name: docs-dist
        path: docs

    - name: 3. 推送到用户站点仓库
      uses: JamesIves/github-pages-deploy-action@v4
      with:
        repository-name: ${{ github.repository_owner }}/${{ github.repository_owner }}.github.io # 目标用户站点仓库
        branch: main
        folder: docs
        clean: true
        ssh-key: ${{ secrets.DEPLOY_KEY }}                 # action 内部自行处理 SSH 认证
```

### 方式三：部署到同仓库 gh-pages 分支 （样式丢失）

::: danger 样式丢失问题
用这种方式部署后站点样式都丢了，后来直接改成了方式二，此问题未解决。如果你有好的解决方案，欢迎留言。
:::

构建产物推送到同仓库的 `gh-pages` 分支。不需要额外的 SSH 配置，但需要设置 `base` 路径。

部署 job 只需将目标分支改为 `gh-pages`：

```yaml
deploy-to-gh-pages:
    name: 部署到 gh-pages 分支
    runs-on: ubuntu-latest
    needs: build-docs
    steps:
      - name: 1. 检出代码
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: 2. 下载构建产物
        uses: actions/download-artifact@v4
        with:
          name: docs-dist
          path: docs

      - name: 3. 部署文档
        uses: JamesIves/github-pages-deploy-action@v4
        with:
          branch: gh-pages
          folder: docs
          clean: true
```

::: warning GitHub Pages URL 规则
Pages 的访问路径由仓库名决定，只有仓库名恰好等于 `<用户名>.github.io` 才能享受根域名 `https://xxx.github.io/`。**其他仓库一律追加 `/仓库名/` 子路径**——也就是说，如果仓库叫 `vuepress`，访问地址一定是 `https://xxx.github.io/vuepress/`，无法通过配置绕开。
:::

在 `docs/.vuepress/config.js` 中增加对应的仓库路径（将 `<仓库名>` 替换为实际仓库名）：

```js
export default defineUserConfig({
  base: '/<仓库名>/',
})
```

如果 `base` 与 Pages URL 不匹配，资源路径会错误，导致 JS、CSS 和图片 404。

### 三种方式对比

<div class="compare-top">

| | 方式一（仓库名即 `<username>.github.io`） | 方式二（用户站点仓库） | 方式三（gh-pages 分支） |
|---|---|---|---|
| 仓库要求 | **`<用户名>.github.io`** | 无特殊要求 | 无特殊要求 |
| 部署目标 | GitHub Pages 用户站点（Pages artifact） | `${{ github.repository_owner }}.github.io` 仓库 `main` 分支 | 本仓库 `gh-pages` 分支 |
| 访问地址 | `https://xxx.github.io/` | `https://xxx.github.io/` | `https://xxx.github.io/`**`<仓库名>`**`/` |
| base 配置 | 无需 | 无需 | **`base: '/<仓库名>/'`** |
| SSH deploy key | 不需要 | **需要** | 不需要 |
| Pages Source | `GitHub Actions` | **`Deploy from a branch`** | **`Deploy from a branch`** |
| 构建 job | `checkout`<br>`setup-node` + `npm ci`<br>`npm run build`<br>`upload-artifact`<br>`upload-pages-artifact` | `checkout`<br>`setup-node` + `npm ci`<br>`npm run build`<br>`upload-artifact` | 同左 |
| 部署 job | `actions/deploy-pages` | `checkout`<br>`download-artifact`<br>`JamesIves/github-pages-deploy-action`<br>（含 `repository-name` + `ssh-key`） | `checkout`<br>`download-artifact`<br>`JamesIves/github-pages-deploy-action`<br>（推送 `gh-pages`） |

</div>

## 云服务器部署

三份完整配置中的云服务器 job，构建产物下载、打包和传输部分相同；差异在于最后解压到服务器上的目录：方式一、方式二使用 `/www/wwwroot/`，方式三使用 `/www/wwwroot/<仓库名>/`。这里先展示公共流程，解压目录的两种写法见下方选项卡。

### 编写 workflow 配置

云服务器部署的 job 负责将构建产物传输到服务器并解压：

```yaml
deploy-server:
  name: 部署到云服务器
  runs-on: ubuntu-latest
  needs: build-docs                       # 等构建完成再执行
  steps:
    - name: 1. 下载构建产物
      uses: actions/download-artifact@v4
      with:
        name: docs-dist
        path: docs

    - name: 2. 打包构建产物
      run: tar -czvf docs.tar.gz -C docs/ .

    - name: 3. 传输到服务器
      uses: appleboy/scp-action@v1
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.KEY }}
        source: docs.tar.gz
        target: /tmp/
```

部署前先使用 `nginx -t` 检查配置，确认无误后再 reload Nginx。

::: code-tabs
@tab 方式一/二：根目录
```yaml
    - name: 4. 部署到服务器
      uses: appleboy/ssh-action@v1        # SSH 连接服务器解压到网站根目录
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.KEY }}
        script: |
          mkdir -p /www/wwwroot # 确认该目录仅用于本站后再清理
          cd /www/wwwroot
          rm -rf -- ./* ./.[!.]* ./..?*
          tar -xzvf /tmp/docs.tar.gz -C .
```

@tab 方式三：`<仓库名>` 子目录
```yaml
    - name: 4. 部署到服务器
      uses: appleboy/ssh-action@v1        # SSH 连接服务器解压到网站子目录
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.KEY }}
        script: |
          mkdir -p /www/wwwroot/<仓库名> # 确认该目录仅用于本站后再清理
          cd /www/wwwroot/<仓库名>
          rm -rf -- ./* ./.[!.]* ./..?*
          tar -xzvf /tmp/docs.tar.gz -C .
```
:::

::: warning
`npm ci` 在 GitHub Actions runner 中依据仓库内的 `package-lock.json` 精确安装依赖；依赖安装发生在构建阶段，不需要将 `package-lock.json` 上传到云服务器。
:::

### 准备 Secrets

在仓库的 Settings 中，点击 Secrets，添加以下 Secrets：

| Secret | 说明 | 适用方式 |
|---|---|---|
| `HOST` | 云服务器的域名或 IP 地址 | 全部 |
| `USERNAME` | SSH 登录用户名 | 全部 |
| `KEY` | SSH 私钥（完整内容） | 全部 |
| `DEPLOY_KEY` | 推送目标仓库的 SSH 私钥 | 仅方式二 |

::: tip 方式二的 Deploy key
方式二需要在目标仓库的 `Settings > Deploy keys` 中添加对应的公钥，并勾选 `Allow write access`。
:::

### Nginx 配置

宝塔面板默认配置文件：

- **`/www/server/nginx/conf/nginx.conf`**：Nginx 主配置文件，一般无需修改。
- **`/www/server/panel/vhost/nginx/0.default.conf`**：默认站点配置文件，没有找到时可以手动创建。
- **`/www/server/panel/vhost/nginx/<仓库名>.conf`**：本站点配置文件。

这里的 Nginx 配置中，`root` 都设置为 `/www/wwwroot/`。三种方式的差异在 workflow 解压构建产物的目录：方式一、方式二解压到 `/www/wwwroot/`，方式三解压到 `/www/wwwroot/<仓库名>/`，访问 `/<仓库名>/` 时正好映射到这个子目录。

下面示例适用于本站作为服务器默认站点的情况；如果服务器上已有多个站点，应使用实际域名或端口区分，不要直接复用 `default_server` 和 `server_name _`。

```bash
cat > /www/server/panel/vhost/nginx/<仓库名>.conf <<EOF
server {
    listen 80 default_server;
    server_name _;
    root /www/wwwroot/;
    index index.html index.php;
    access_log /www/wwwlogs/<仓库名>.log;
    error_log /www/wwwlogs/<仓库名>.error.log;
}
EOF
```

::: warning

方式三中，root 配置为 `/www/wwwroot/`，而不是 `/www/wwwroot/<仓库名>/`。这是因为访问路径为 `http://ip/<仓库名>`，若配置根目录为 `/www/wwwroot/<仓库名>/`，就会从 `/www/wwwroot/<仓库名>/<仓库名>/` 目录下找 index.html 文件，导致找不到。

这里的清理命令只适用于已经确认专用于本站的目录；如果服务器上还有其他站点，请改用该站点自己的专属目录。部署前可先执行 `nginx -t` 检查配置，再 reload Nginx。

其实这里的配置放在 `0.default.conf` 中也行，但同样注意 root 不能配置为 `/www/wwwroot/default`，否则会出现和上面一样的错误（或者把 `<仓库名>` 目录放到 `/www/wwwroot/default/` 目录下也行，两种方式任选其一）。
:::

## 注意事项

- 如果 md 文件格式有错误，会导致云端部署失败（本地运行 `vuepress dev docs` 时不会报错，只会在访问到该页面时报错，所以部署后需要查看日志排查错误）

## 附录：完整 workflow 配置

三份 workflow 都采用“构建—部署”的结构，整体流程可划分为三个环节：

- **构建阶段**：`build-docs` 负责生成并上传构建产物，三份配置中的构建步骤基本一致。

- **云服务器部署**：下载、打包和传输步骤大致相同，主要差异在于最终的解压目录。

- **方式一**：Pages artifact 直接用于 GitHub Pages，`docs-dist` 另供云服务器部署；
- **方式二**：普通 artifact 经 SSH 推送至用户站点仓库的 `main` 分支；
- **方式三**：普通 artifact 推送至当前仓库的 `gh-pages` 分支。

::: code-tabs
@tab 方式一：仓库名即 \<username\>.github.io
@[code](../code/github/workflows/deploy-docs-same-repo.yml)

@tab 方式二：用户站点仓库
@[code](../code/github/workflows/deploy-docs-user-site.yml)

@tab 方式三：gh-pages 分支
@[code](../code/github/workflows/deploy-docs-gh-pages.yml)
:::