import { backToTopPlugin } from '@vuepress/plugin-back-to-top'
import { blogPlugin } from '@vuepress/plugin-blog'
import { defaultTheme } from '@vuepress/theme-default'
import { defineUserConfig } from 'vuepress'
import { viteBundler } from '@vuepress/bundler-vite'
import { mdEnhancePlugin } from 'vuepress-plugin-md-enhance'
import {markdownTabPlugin} from "@vuepress/plugin-markdown-tab";
import {markdownIncludePlugin} from "@vuepress/plugin-markdown-include";
import { markdownStylizePlugin } from "@vuepress/plugin-markdown-stylize";
import { markdownExtPlugin } from "@vuepress/plugin-markdown-ext";
export default defineUserConfig({
  lang: 'zh-CN',
  title: 'Java 后端知识库',
  description: 'Java 后端技术沉淀，聚焦 JVM、Spring、数据库、架构与分布式',
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['link', { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' }],
  ],
  theme: defaultTheme({
    logo: '/images/logo.png',
    navbar: [
      {
        text: '资源',
        link: '/resource/',
      },
      {
        text: 'Java',
        children: [
          { text: 'Java 笔记', link: '/java/' },
          { text: '测试工程', link: '/test/' },
        ],
      },
      {
        text: 'Spring',
        link: '/posts/spring/',
      },
      {
        text: '数据库',
        link: '/posts/db/',
      },
      {
        text: '架构',
        link: '/arch/'
      },
      {
        text: '算法',
        link: '/algorithm/',
      },
      {
        text: 'Linux',
        link: '/linux/command.html',
      },
      {
        text: 'Git',
        link: '/git/',
      },
      {
        text: 'VuePress',
        link: '/vuepress/',
      },
      {
        text: '杂项',
        children: [
          { text: 'Web', link: '/web/' },
          { text: 'Python', link: '/python/' },
          { text: 'AI', link: '/ai/' },
          { text: '语言对比', link: '/language-comparison/' },
          { text: '其他', link: '/others/' },
        ],
      },
    ],
    sidebar: {
      '/resource/': [
        '/resource/',
        '/resource/windows-tools',
        '/resource/vscode-plugins',
        '/resource/book',
        '/resource/github'
      ],
      '/java/': [
          '/java/',
          {
            text: 'Java 基础',
            link: 'basic/',
            prefix: 'basic/',
            children: [
              'exception-handling',
              'file-operations',
            ]
          },
          {
            text: 'Java 中级',
            link: 'intermediate/',
            prefix: 'intermediate/',
            children: [
                'generics',
                'multithreading',
                'annotations',
            ]
          },
          {
            text: 'Java 高级',
            prefix: 'advanced/',
            children: [
              {
                text: 'Java 垃圾回收器详解',
                link: 'garbage-collection/',
                prefix: 'garbage-collection/',
                children: [
                    'g1',
                    'shenandoah-gc',
                    'zgc'
                ]
              },
              {
                text: 'Java 诊断与监控工具',
                link: 'diagnostic-tools/',
                prefix: 'diagnostic-tools/',
                children: [
                  'diagnostic-jcmd',
                  'diagnostic-jps',
                  'diagnostic-jinfo',
                  'diagnostic-jstat',
                  'diagnostic-jmap',
                  'memory-tools',
                  'profiling-jfr',
                  'profiling-jmc',
                  'profiling-tools'
                ]
              },
              {
                text: 'Java 字节码',
                link: 'bytecode/',
                prefix: 'bytecode/',
                children: [
                    'jvm-bytecode-instructions',
                    'asm-introduction',
                    'asm-bytecode-compatibility',
                ]
              },
            ]
          },
          {
            text: 'Java 新特性',
            link: 'new-features/',
            prefix: 'new-features/',
            children: [
                {
                  text: 'Java 25 新特性',
                  link: 'java-25-features',
                  children: [
                      'stable-values',
                      'structured-concurrency',
                      'scoped-values',
                      'primitive-types-in-patterns-instanceof-and-switch',
                  ]
                },
                'java-24-features',
                'java-23-features',
                'java-22-features'
            ]
          },
          {
            text:'工具库',
            prefix: 'utils/',
            children: [
                'file_utils',
                {
                  text: 'PDFUtils',
                  link: 'pdf_utils/',
                  prefix: 'pdf_utils/',
                  children: [
                      'itexpdf'
                  ]
                },
                'apache_common',
                'hutool'
            ]
          },
          {
            text: '模块',
            prefix: 'module/',
            children: [
              'mail',
              'java_mail',
              'java_mail_sender'
            ]
          },
          {
            text: 'ORM',
            prefix: 'orm/',
            children:[
              'mybatis',
              'mybatis-annotation',
            ]
          },
          {
            text: '其他',
            prefix: 'misc/',
            children: [
              {
                text: 'Json',
                prefix: 'json/',
                children:[
                    'fastjson2',
                    'jackson'
                ]
              },
              'linked-hash-map-to-object',
              'object-formatting',
            ]
          }
      ],
      '/test/': [
        '/test/',
        {
          text: 'framework',
          prefix: 'framework/',
          children: [
            'junit-5',
            'mockito',
            'assertj',
            'cucumber',
            'rest-assured',
            'selenium',
            'testng',
            'testcontainers',
            'spring-boot-test',
            'n8n-springboot',
          ],
        },
        {
          text: 'practices',
          prefix: 'practices/',
          children: [
            'unit-testing',
            'integration-testing',
            'e2e-testing',
            'tdd',
            'test-coverage',
            'ai-testing',
          ],
        },
        {
          text: 'tools',
          prefix: 'tools/',
          children: [
            'jacoco',
            'sonarqube',
            'pitest',
          ],
        },
        {
          text: 'examples',
          prefix: 'examples/',
          children: [
            'spring-boot',
            'testcontainers-mysql',
            'mockito-advanced',
            'microservices',
          ],
        },
      ],
      '/posts/spring/': [
          {
            text: 'Spring',
            link: '/posts/spring/',
          },
          {
            text: 'Spring Framework',
            prefix: '/posts/spring/',
            collapsible: true,
            children: [
                'spring-framework',
                'spring-framework-ioc',
                'spring-framework-ioc-impi',
                'spring-framework-aop',
                'spring-framework-aop-impi'
            ],
          },
          {
            text: 'Spring Boot',
            prefix: '/posts/spring/',
            children: [
                'spring-boot',
                'spring-boot-hello-world',
                'spring-boot-redis',
                'spring-boot-oracle',
            ],
            collapsible: true,
          }
      ],
      '/arch/':[
        {
          text: '架构',
          link: '/arch/',
        },
        {
          text:'分布式系统',
          link: 'distribute'
        },
        {
          text:'ZooKeeper',
          link: 'zookeeper/',
          prefix: 'zookeeper/',
          children: [
              'command',
              'client',
              'zkclient',
              'curator',
          ],
        }
      ],
      '/posts/db/': [
        {
          text:'数据库结构设计',
          link: 'arch/',
          prefix: 'arch/',
          children: [
              'multi-tenant',
          ],
        },
        {
          text: 'SQL',
          link: 'sql/',
          prefix: 'sql/',
          children: [
            'cursor',
            'merge-rows',
            'oracle-job-mview',
            'oracle-mview-issue',
            'pl_sql/',
          ],
        },
      ],
      '/algorithm/': [
        '/algorithm/',
        {
          text:'算法思想',
          children: [
            'dynamic-programming',
          ],
        },
        {
          text:'领域算法',
          link: 'domain/',
          prefix: 'domain/',
          children: [
            {
              text:'安全算法',
              link: 'security/',
              prefix: 'security/',
              children: [
                'hash-function-integrity',
                'symmetric-encryption',
                'message-authentication-code',
                'asymmetric-encryption-pki',
                'digital-signature',
                'modern-crypto-protocols',
                'post-quantum-cryptography',
                'crypto-algorithm-security-analysis',
              ],
            },
            {
              text: '分布式算法',
              link: 'distribute/'
            },
            'load-balance',
          ],
        },
      ],
      '/linux/': [
        'command',
        'shell',
        {
          text:'云服务器',
          prefix:'cloud/',
          children:['tencent']
        },
        {
          text: 'Web服务器',
          prefix:'web/',
          children:[
              'nginx',
              'nginx-load-balance'
          ]
        }
      ],
      '/git/': [
        '/git/',
        'git-ssh',
        'git-hooks',
        'git-worktree',
        {
          text:'Github',
          link: 'github/',
          prefix: 'github/',
          children: [
              'github_action'
          ]
        },
      ],
      '/vuepress/': [
          '/vuepress/',
          '/vuepress/page',
          '/vuepress/markdown',
          '/vuepress/plugin',
          '/vuepress/vue-component',
          '/vuepress/css',
          '/vuepress/vuepress_cloud',
      ],
      '/posts/hexo/': [
        '/posts/hexo/GitHub-Pages-Hexo搭建个人网站',
        '/posts/hexo/Next主题个性化配置',
        '/posts/hexo/【Hexo】更高级的Markdown渲染器',
      ],
      '/others/': [
        '/others/',
        'yaml',
        'nvm',
      ],
      '/language-comparison/': [
        '/language-comparison/',
        'collections',
        'regex',
      ],
      '/web/': [
        '/web/',
        'ui-framework-selection',
        {
          text: '应用框架',
          children: [
            'angularjs-lifecycle',
          ],
        },
        {
          text: 'UI 组件库·模板',
          children: [
            {
              text: 'Ace Admin 后台模板：是什么、为何淘汰、现在用什么',
              link: 'ace-admin',
              children: [
                'ace-file-input-shell',
              ],
            },
            'bootstrap',
          ],
        },
      ],
      '/python/': [
        '/python/',
        'functools',
        'wrapper',
        'functools_wraps',
        'lru_cache_vs_cached_property',
        'requirements',
      ],
      '/ai/': [
        '/ai/',
        {
          text: 'AI Agent',
          link: 'ai_agent/',
          prefix: 'ai_agent/',
          children: [
            'ai-desktop-tools',
            'ai-expert-platforms',
            'claude-cowork',
            'coze',
            'instruction',
            'prompt',
            'quesion',
            'workbuddy-vs-manop',
          ],
        },
        {
          text: 'Trae',
          prefix: 'trae/',
          children: ['trae-plugin'],
        },
        {
          text: '大模型',
          link: '大模型/',
          prefix: '大模型/',
          children: [
            'AI大模型测评体系详解',
            '免费大模型一览表2026',
            {
              text: '端侧多模态模型',
              prefix: '端侧多模态模型/',
              children: ['MiniCPM'],
            },
          ],
        },
        {
          text: 'Coze Space',
          prefix: 'coze_space/',
          children: [
            {
              text: 'DocuSphere',
              link: 'coze_space/docu_sphere/',
              children: ['coze_space/docu_sphere/requirement_v1'],
            },
          ],
        },
      ],
      '/quant/': [
        '/quant/',
        {
          text: '双均线策略',
          link: '/quant/dual-ma/',
        },
        {
          text: '多策略横评',
          link: '/quant/strategy-zoo/',
        },
      ],
    },
    sidebarDepth: 0,
  }),

  plugins: [
    blogPlugin({
      // Only files under posts are articles
      filter: ({ filePathRelative }) =>
        filePathRelative ? filePathRelative.startsWith('posts/') : false,

      // Getting article info
      getInfo: ({ frontmatter, title, data }) => ({
        title,
        author: frontmatter.author || '',
        date: frontmatter.date || null,
        category: frontmatter.category || [],
        tag: frontmatter.tag || [],
        excerpt:
          // Support manually set excerpt through frontmatter
          typeof frontmatter.excerpt === 'string'
            ? frontmatter.excerpt
            : data?.excerpt || '',
      }),

      // Generate excerpt for all pages excerpt those users choose to disable
      excerptFilter: ({ frontmatter }) =>
        !frontmatter.home &&
        frontmatter.excerpt !== false &&
        typeof frontmatter.excerpt !== 'string',

      category: [
        {
          key: 'category',
          getter: (page) => page.frontmatter.category || [],
          layout: 'Category',
          itemLayout: 'Category',
          frontmatter: () => ({
            title: 'Categories',
            sidebar: false,
          }),
          itemFrontmatter: (name) => ({
            title: `Category ${name}`,
            sidebar: false,
          }),
        },
        {
          key: 'tag',
          getter: (page) => page.frontmatter.tag || [],
          layout: 'Tag',
          itemLayout: 'Tag',
          frontmatter: () => ({
            title: 'Tags',
            sidebar: false,
          }),
          itemFrontmatter: (name) => ({
            title: `Tag ${name}`,
            sidebar: false,
          }),
        },
      ],

      type: [
        {
          key: 'article',
          // Remove archive articles
          filter: (page) => !page.frontmatter.archive,
          layout: 'Article',
          frontmatter: () => ({
            title: 'Articles',
            sidebar: false,
          }),
          // Sort pages with time and sticky
          sorter: (pageA, pageB) => {
            if (pageA.frontmatter.sticky && pageB.frontmatter.sticky)
              return pageB.frontmatter.sticky - pageA.frontmatter.sticky

            if (pageA.frontmatter.sticky && !pageB.frontmatter.sticky) return -1

            if (!pageA.frontmatter.sticky && pageB.frontmatter.sticky) return 1

            if (!pageB.frontmatter.date) return 1
            if (!pageA.frontmatter.date) return -1

            return (
              new Date(pageB.frontmatter.date).getTime() -
              new Date(pageA.frontmatter.date).getTime()
            )
          },
        },
        {
          key: 'timeline',
          // Only article with date should be added to timeline
          filter: (page) => page.frontmatter.date instanceof Date,
          // Sort pages with time
          sorter: (pageA, pageB) =>
            new Date(pageB.frontmatter.date).getTime() -
            new Date(pageA.frontmatter.date).getTime(),
          layout: 'Timeline',
          frontmatter: () => ({
            title: 'Timeline',
            sidebar: false,
          }),
        },
      ],
      hotReload: true,
    }),
    mdEnhancePlugin({
      chartjs: false,
      echarts: true,
      flowchart: false,
      markmap: false,
      mermaid: true,
      plantuml: false,
    }),
    markdownStylizePlugin({
      // 上下标、标记高亮、自定义对齐（center/right/left/justify）
      align: true,
      sup: true,
      sub: true,
      mark: true,
    }),
    markdownExtPlugin({
      // 脚注 [^1]
      footnote: true,
    }),
    backToTopPlugin(),
    markdownTabPlugin({
      // 启用代码选项卡
      codeTabs: true,
      // 启用选项卡
      tabs: true,
    }),
    markdownIncludePlugin({
    }),
  ],
  bundler: viteBundler(),
})