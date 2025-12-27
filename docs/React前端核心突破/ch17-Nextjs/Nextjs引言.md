# Next.js 面试知识点深度拆解

## 一、第一性原理：Next.js 到底在解决什么问题？

### 传统 React SPA 的痛点

```
┌─────────────────────────────────────────────────────────────────┐
│                    传统 React SPA 问题                           │
├─────────────────────────────────────────────────────────────────┤
│  1. SEO 差：搜索引擎爬虫看到空白 HTML                             │
│  2. 首屏慢：需要下载 JS → 执行 → 渲染                             │
│  3. 配置繁琐：Webpack、Babel、路由、代码分割...                    │
│  4. 全栈割裂：前端和后端 API 分离部署                              │
└─────────────────────────────────────────────────────────────────┘
```

### Next.js 的答案

```
Next.js = React + 预渲染 + 文件路由 + API Routes + 零配置

核心思想：让 React 应用在服务器端就生成好 HTML，
         同时保留客户端交互能力（Hydration）
```

---

## 二、什么是 Next.js？

Next.js 是一款**用于生产环境的 React 框架**，提供生产环境所需的所有功能和最佳开发体验。

### 核心能力一览

```
┌─────────────────────────────────────────────────────────────────┐
│                     Next.js 核心能力                             │
├──────────────────┬──────────────────────────────────────────────┤
│  静态+服务器渲染  │  SSG + SSR 混合，同一项目灵活选择              │
├──────────────────┼──────────────────────────────────────────────┤
│  零配置          │  自动编译打包，从一开始就为生产环境优化         │
├──────────────────┼──────────────────────────────────────────────┤
│  文件系统路由    │  pages 目录下的组件自动成为路由                 │
├──────────────────┼──────────────────────────────────────────────┤
│  API 路由        │  pages/api 目录创建后端 API 端点               │
├──────────────────┼──────────────────────────────────────────────┤
│  增量静态生成    │  构建后以增量方式更新静态页面（ISR）            │
├──────────────────┼──────────────────────────────────────────────┤
│  TypeScript      │  自动配置并编译 TypeScript                    │
├──────────────────┼──────────────────────────────────────────────┤
│  快速刷新        │  可靠的实时编辑体验，Facebook 级别验证          │
├──────────────────┼──────────────────────────────────────────────┤
│  内置 CSS 支持   │  CSS Modules + Sass 开箱即用                  │
├──────────────────┼──────────────────────────────────────────────┤
│  代码拆分打包    │  Google Chrome 团队优化的打包和拆分算法         │
└──────────────────┴──────────────────────────────────────────────┘
```

---

## 三、预渲染：Next.js 的核心机制（面试高频 ★★☆☆☆）

### 什么是预渲染？

```
┌─────────────────────────────────────────────────────────────────┐
│  默认情况下，Next.js 预渲染每个页面                               │
│  = 为每个页面预先生成 HTML 文件                                   │
│  = 无需客户端 JavaScript 渲染                                    │
│  = 更好的性能和 SEO                                              │
└─────────────────────────────────────────────────────────────────┘

每个 HTML 页面关联最少 JavaScript 代码
           ↓
浏览器加载页面时，JS 运行使页面完全具有交互性（Hydration）
```

### 两种预渲染形式对比

```
                    页面生成时机
                         │
          ┌──────────────┴──────────────┐
          │                             │
          ▼                             ▼
   ┌─────────────┐              ┌─────────────┐
   │ 静态生成 SSG │              │ 服务端渲染 SSR │
   │  (推荐使用)  │              │             │
   └──────┬──────┘              └──────┬──────┘
          │                             │
          ▼                             ▼
   构建时(Build Time)            请求时(Request Time)
   生成 HTML                     生成 HTML
          │                             │
          ▼                             ▼
   每次请求重用                   每次请求重新生成
   CDN 缓存友好                   适合频繁变化的数据
```

### 选择策略

| 场景 | 推荐方案 | 原因 |
|------|----------|------|
| 博客文章、产品列表 | SSG | 内容不常变，CDN 缓存提速 |
| 用户仪表盘、实时数据 | SSR | 数据随请求变化 |
| 混合场景 | SSG + CSR | 静态骨架 + 客户端动态数据 |

---

## 四、文件系统路由（面试高频 ★★★☆☆）

### 核心理念

```
Next.js 的路由基于文件系统
每个 pages 目录下的组件都是一条路由
简单直观，开箱即用，前后端统一管理
```

### 路由类型详解

#### 1. 首页路由

```
pages/index.js        →  /
pages/blog/index.js   →  /blog
```

#### 2. 嵌套路由

```
pages/blog/first-post.js  →  /blog/first-post
pages/about/team.js       →  /about/team
```

#### 3. 动态路由（重点）

```
pages/blog/[slug].js      →  /blog/:slug

示例：
/blog/hello-world  →  slug 参数为 "hello-world"
/blog/nextjs-tips  →  slug 参数为 "nextjs-tips"
```

**代码示例**：

```javascript
// pages/blog/[slug].js
import { useRouter } from 'next/router'

export default function Post() {
  const router = useRouter()
  const { slug } = router.query
  
  return <h1>Post: {slug}</h1>
}
```

#### 4. API 路由

```
pages/api/hello.js    →  /api/hello
pages/api/users/[id].js → /api/users/:id

特点：
- 只会增加服务端文件包体积
- 不会增加客户端文件包大小
```

**代码示例**：

```javascript
// pages/api/hello.js
export default function handler(req, res) {
  res.status(200).json({ message: 'Hello World' })
}

// pages/api/users/[id].js
export default function handler(req, res) {
  const { id } = req.query
  res.status(200).json({ userId: id })
}
```

#### 5. 浅路由（Shallow Routing）

```
特点：只改变 URL，不触发数据获取方法

不调用：getServerSideProps、getStaticProps、getInitialProps
通过：useRouter 或 withRouter 获取更新后的 pathname 和 query
不重新渲染页面
```

**代码示例**：

```javascript
import { useRouter } from 'next/router'

export default function Page() {
  const router = useRouter()
  
  const handleClick = () => {
    // 浅路由：只更新 URL，不重新获取数据
    router.push('/?counter=10', undefined, { shallow: true })
  }
  
  return <button onClick={handleClick}>Update URL</button>
}
```

### 路由映射图解

```
pages/
├── index.js              →  /
├── about.js              →  /about
├── blog/
│   ├── index.js          →  /blog
│   ├── [slug].js         →  /blog/:slug
│   └── [...params].js    →  /blog/* (Catch-all)
└── api/
    ├── hello.js          →  /api/hello
    └── users/
        └── [id].js       →  /api/users/:id
```

---

## 五、数据获取方法（面试高频 ★★★☆☆）

### 方法演进

```
getInitialProps (旧)
       │
       │ Next.js 9.3+ 推荐替代
       │
       ▼
┌──────┴──────┐
│             │
▼             ▼
getStaticProps    getServerSideProps
(SSG 静态生成)     (SSR 服务端渲染)
     │
     │ 配合动态路由
     ▼
getStaticPaths
```

### 方法对比表

| 方法 | 执行时机 | 适用场景 | TTFB | CDN |
|------|----------|----------|------|-----|
| `getStaticProps` | 构建时 | 静态内容 | 快 | ✅ 无需配置 |
| `getStaticPaths` | 构建时 | 动态路由 + SSG | 快 | ✅ |
| `getServerSideProps` | 每次请求 | 动态内容 | 较慢 | ⚠️ 需额外配置 |
| `getInitialProps` | 服务端/客户端 | 兼容旧版 | - | - |

### 1. getStaticProps（静态生成）

```javascript
// pages/posts.js
export default function Posts({ posts }) {
  return (
    <ul>
      {posts.map(post => <li key={post.id}>{post.title}</li>)}
    </ul>
  )
}

// 构建时执行，生成静态 HTML 和 JSON
export async function getStaticProps() {
  const res = await fetch('https://api.example.com/posts')
  const posts = await res.json()
  
  return {
    props: { posts },
    // ISR：每 60 秒重新验证
    revalidate: 60
  }
}
```

**输出文件**：
- `posts.html` - 静态 HTML
- `posts.json` - 数据文件

### 2. getStaticPaths（动态路由静态生成）

```javascript
// pages/posts/[id].js
export default function Post({ post }) {
  const router = useRouter()
  
  // fallback: true 时的加载状态
  if (router.isFallback) {
    return <div>Loading...</div>
  }
  
  return <h1>{post.title}</h1>
}

export async function getStaticPaths() {
  const res = await fetch('https://api.example.com/posts')
  const posts = await res.json()
  
  // 预生成的路径列表
  const paths = posts.map(post => ({
    params: { id: post.id.toString() }
  }))
  
  return {
    paths,
    // fallback 选项详解见下方
    fallback: true
  }
}

export async function getStaticProps({ params }) {
  const res = await fetch(`https://api.example.com/posts/${params.id}`)
  const post = await res.json()
  
  return { props: { post } }
}
```

**fallback 选项详解**：

```
┌─────────────────────────────────────────────────────────────────┐
│                    fallback 选项                                 │
├──────────┬──────────────────────────────────────────────────────┤
│  false   │  不在 paths 列表的路由 → 返回 404                     │
├──────────┼──────────────────────────────────────────────────────┤
│  true    │  不在列表的路由：                                     │
│          │  1. 先返回 fallback 页面（loading 状态）              │
│          │  2. 后台开始预渲染                                    │
│          │  3. 完成后，将路径加入 paths 列表                     │
│          │  4. 后续请求直接使用缓存的 HTML                       │
├──────────┼──────────────────────────────────────────────────────┤
│ 'blocking'│  不在列表的路由：                                    │
│          │  阻塞等待服务端渲染完成，无 loading 状态              │
└──────────┴──────────────────────────────────────────────────────┘
```

### 3. getServerSideProps（服务端渲染）

```javascript
// pages/dashboard.js
export default function Dashboard({ user, data }) {
  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <p>Latest data: {data.value}</p>
    </div>
  )
}

// 每次请求时执行
export async function getServerSideProps(context) {
  const { req, res, params, query } = context
  
  // 可以访问请求头、cookies 等
  const token = req.cookies.token
  
  const [userRes, dataRes] = await Promise.all([
    fetch('https://api.example.com/user', {
      headers: { Authorization: `Bearer ${token}` }
    }),
    fetch('https://api.example.com/data')
  ])
  
  const user = await userRes.json()
  const data = await dataRes.json()
  
  return {
    props: { user, data }
  }
}
```

### 数据获取流程图

```
                        ┌─────────────────┐
                        │   用户请求页面   │
                        └────────┬────────┘
                                 │
                    ┌────────────┼────────────┐
                    │            │            │
                    ▼            ▼            ▼
             ┌──────────┐  ┌──────────┐  ┌──────────┐
             │   SSG    │  │   SSR    │  │   CSR    │
             │ 静态生成  │  │ 服务端渲染 │  │ 客户端渲染│
             └────┬─────┘  └────┬─────┘  └────┬─────┘
                  │             │             │
                  ▼             ▼             ▼
           构建时已生成    每次请求生成     浏览器执行
           直接返回 HTML   返回新 HTML    fetch 获取
                  │             │             │
                  └──────┬──────┴──────┬──────┘
                         │             │
                         ▼             ▼
                    Hydration     完全交互
                   (注水激活)
```

---

## 六、静态资源 CDN 配置（面试高频 ★★☆☆☆）

### 配置步骤

```
步骤 1：上传 .next/static 文件夹到 CDN 服务器
步骤 2：配置 next.config.js 的 assetPrefix
步骤 3：重新编译部署
```

### 代码配置

```javascript
// next.config.js
const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  // 生产环境使用 CDN，开发环境使用本地
  assetPrefix: isProd ? 'https://cdn.mydomain.com' : '',
  
  // 图片 CDN 配置（如果使用 next/image）
  images: {
    loader: 'custom',
    domains: ['cdn.mydomain.com']
  }
}
```

### CDN 配置流程图

```
┌─────────────────────────────────────────────────────────────────┐
│                      CDN 配置流程                                │
└─────────────────────────────────────────────────────────────────┘

    构建阶段                    部署阶段                运行阶段
       │                          │                       │
       ▼                          ▼                       ▼
┌─────────────┐           ┌─────────────┐         ┌─────────────┐
│ npm run build│           │ 上传静态资源 │         │ 用户请求页面 │
└──────┬──────┘           │ 到 CDN 服务器│         └──────┬──────┘
       │                   └──────┬──────┘                │
       ▼                          │                       ▼
┌─────────────┐                   │              ┌─────────────┐
│.next/static │                   │              │  HTML 引用  │
│  生成静态资源│                   │              │ CDN 上的资源│
└─────────────┘                   │              └─────────────┘
                                  │
                           ┌──────▼──────┐
                           │cdn.mydomain │
                           │    .com     │
                           └─────────────┘
```

---

## 七、经典面试代码汇总

### 1. 完整的博客页面示例（SSG + 动态路由）

```javascript
// pages/blog/[slug].js
import { useRouter } from 'next/router'
import Head from 'next/head'

export default function BlogPost({ post }) {
  const router = useRouter()
  
  // fallback 状态处理
  if (router.isFallback) {
    return <div>Loading...</div>
  }
  
  return (
    <>
      <Head>
        <title>{post.title}</title>
        <meta name="description" content={post.excerpt} />
      </Head>
      <article>
        <h1>{post.title}</h1>
        <time>{post.date}</time>
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>
    </>
  )
}

// 定义需要预生成的路径
export async function getStaticPaths() {
  const posts = await getAllPosts()
  
  return {
    paths: posts.map(post => ({
      params: { slug: post.slug }
    })),
    fallback: true // 新文章可以按需生成
  }
}

// 获取文章数据
export async function getStaticProps({ params }) {
  const post = await getPostBySlug(params.slug)
  
  if (!post) {
    return { notFound: true }
  }
  
  return {
    props: { post },
    revalidate: 3600 // ISR: 1小时重新验证
  }
}
```

### 2. API 路由 + 数据库查询

```javascript
// pages/api/posts/[id].js
import { getPostById, updatePost, deletePost } from '@/lib/db'

export default async function handler(req, res) {
  const { id } = req.query
  
  switch (req.method) {
    case 'GET':
      try {
        const post = await getPostById(id)
        if (!post) {
          return res.status(404).json({ error: 'Post not found' })
        }
        res.status(200).json(post)
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch post' })
      }
      break
      
    case 'PUT':
      try {
        const updated = await updatePost(id, req.body)
        res.status(200).json(updated)
      } catch (error) {
        res.status(500).json({ error: 'Failed to update post' })
      }
      break
      
    case 'DELETE':
      try {
        await deletePost(id)
        res.status(204).end()
      } catch (error) {
        res.status(500).json({ error: 'Failed to delete post' })
      }
      break
      
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
```

### 3. ISR（增量静态再生）示例

```javascript
// pages/products/[id].js
export default function Product({ product, lastUpdated }) {
  return (
    <div>
      <h1>{product.name}</h1>
      <p>Price: ${product.price}</p>
      <p>Stock: {product.stock}</p>
      <small>Last updated: {lastUpdated}</small>
    </div>
  )
}

export async function getStaticPaths() {
  // 只预生成热门商品
  const topProducts = await getTopProducts(100)
  
  return {
    paths: topProducts.map(p => ({ params: { id: p.id } })),
    fallback: 'blocking' // 其他商品按需生成
  }
}

export async function getStaticProps({ params }) {
  const product = await getProduct(params.id)
  
  return {
    props: {
      product,
      lastUpdated: new Date().toISOString()
    },
    // 关键：每 60 秒重新生成
    revalidate: 60
  }
}
```

### 4. 中间件示例（Next.js 12+）

```javascript
// middleware.js（项目根目录）
import { NextResponse } from 'next/server'

export function middleware(request) {
  // 获取请求路径
  const { pathname } = request.nextUrl
  
  // 认证检查
  const token = request.cookies.get('token')
  
  // 保护 /dashboard 路由
  if (pathname.startsWith('/dashboard') && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  // 国际化重定向
  const locale = request.headers.get('accept-language')?.split(',')[0]
  if (pathname === '/' && locale?.startsWith('zh')) {
    return NextResponse.redirect(new URL('/zh', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/dashboard/:path*']
}
```

---

## 八、Next.js 渲染策略决策树

```
                        ┌─────────────────────┐
                        │   页面数据需求分析   │
                        └──────────┬──────────┘
                                   │
                    ┌──────────────┼──────────────┐
                    │              │              │
                    ▼              ▼              ▼
              无需外部数据    数据构建时确定    数据随请求变化
                    │              │              │
                    ▼              ▼              ▼
              ┌─────────┐    ┌─────────┐    ┌─────────┐
              │ 纯静态页面│    │   SSG   │    │   SSR   │
              │ (默认)   │    │+getStatic│    │+getServer│
              └─────────┘    │  Props  │    │SideProps │
                             └────┬────┘    └─────────┘
                                  │
                           ┌──────┼──────┐
                           │             │
                           ▼             ▼
                      固定路径       动态路径
                           │             │
                           ▼             ▼
                     直接使用      + getStaticPaths
                                        │
                                  ┌─────┼─────┐
                                  │           │
                                  ▼           ▼
                           fallback:     fallback:
                             false      true/'blocking'
                                  │           │
                                  ▼           ▼
                            仅预生成路径   按需生成新路径
                            其他返回404
```

---

## 九、面试高频指数速查

| 题目 | 高频指数 | 核心考点 |
|------|----------|----------|
| 什么是 Next.js？ | ★☆☆☆☆ | 生产级 React 框架 |
| Next.js 预渲染有哪些形式？ | ★★☆☆☆ | SSG vs SSR 区别 |
| 为什么要重新设计一套路由？ | ★★★☆☆ | 文件系统路由优势 |
| Next.js 中获取数据有哪些方法？ | ★★★☆☆ | 三个 getXxxProps |
| 如何为静态资源配置 CDN？ | ★★☆☆☆ | assetPrefix 配置 |
| getStaticPaths 的 fallback？ | ★★★☆☆ | false/true/blocking |
| ISR 是什么？ | ★★★☆☆ | revalidate 增量更新 |

---

## 十、核心概念关系图

```
┌─────────────────────────────────────────────────────────────────┐
│                      Next.js 核心架构                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐                          ┌─────────────┐       │
│  │   pages/    │ ◄──── 文件系统路由 ────► │   路由系统   │       │
│  └──────┬──────┘                          └─────────────┘       │
│         │                                                       │
│         │                                                       │
│  ┌──────▼──────┐     ┌─────────────┐     ┌─────────────┐       │
│  │ 数据获取方法 │────►│   预渲染    │────►│  HTML 输出  │       │
│  │             │     │             │     │             │       │
│  │getStaticProps│    │     SSG     │     │ 静态 HTML   │       │
│  │getStaticPaths│    │     SSR     │     │ + JS Hydrate│       │
│  │getServerSide │    │     ISR     │     │             │       │
│  │    Props    │     │             │     │             │       │
│  └─────────────┘     └─────────────┘     └─────────────┘       │
│                                                                 │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐       │
│  │  pages/api  │────►│  API Routes │────►│ Serverless  │       │
│  └─────────────┘     └─────────────┘     │  Functions  │       │
│                                          └─────────────┘       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 一句话总结

> **Next.js 的核心奥义是通过"文件即路由 + 灵活预渲染 + API 一体化"三大支柱，让 React 应用在保持开发体验的同时，获得传统服务端渲染的 SEO 和首屏性能优势，实现"编写一次，智能渲染"的生产级全栈体验。**

---

## 附：版本演进关键特性

| 版本 | 关键特性 |
|------|----------|
| 9.3 | getStaticProps/getServerSideProps |
| 9.5 | ISR（增量静态再生） |
| 10 | next/image 图片优化 |
| 11 | next/script 脚本优化 |
| 12 | Middleware、SWC 编译器 |
| 13 | App Router、Server Components |
| 14 | Turbopack（稳定版） |

我来基于这些 Next.js 面试资料，使用第一性原理进行深度拆解和总结。已完成 Next.js 面试知识点的第一性原理拆解总结，包含：

**核心内容**：
- Next.js 解决的本质问题分析（SPA 痛点 → 预渲染方案）
- SSG vs SSR 两种预渲染形式对比图
- 文件系统路由完整映射（首页/嵌套/动态/API/浅路由）
- 四种数据获取方法详解及代码示例
- getStaticPaths 的 fallback 选项深度解析
- CDN 配置流程图
- 渲染策略决策树

**一句话核心奥义**：Next.js 通过"文件即路由 + 灵活预渲染 + API 一体化"三大支柱，实现"编写一次，智能渲染"的生产级全栈体验。