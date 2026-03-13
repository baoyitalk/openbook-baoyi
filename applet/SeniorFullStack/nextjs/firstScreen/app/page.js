import Link from 'next/link';
import { getProducts } from '@/lib/mock';

// 首页 — Server Component，展示缓存层级图 + 商品列表
// 考点：静态渲染 + Router Cache（导航到详情页再返回时瞬间显示）
export default async function HomePage() {
  const products = await getProducts();

  return (
    <div className="container">
      {/* 缓存层级图 */}
      <div className="cache-diagram">
        <h2 className="page-title">Next.js 缓存层级图</h2>
        <pre>{`
用户请求
  │
  ▼
┌─────────────────────────────────────────────┐
│  ① Router Cache（客户端内存）                │
│  已访问路由缓存在浏览器中                     │
│  静态路由 5min / 动态路由 30s                 │
│  → 点详情再返回，瞬间显示                     │
└──────────────────┬──────────────────────────┘
                   │ miss
                   ▼
┌─────────────────────────────────────────────┐
│  ② Full Route Cache（服务端）                │
│  build 时预渲染的 HTML + RSC Payload         │
│  ISR 模式按 revalidate 时间刷新              │
│  → 商品详情页 revalidate: 60                 │
└──────────────────┬──────────────────────────┘
                   │ miss / 过期
                   ▼
┌─────────────────────────────────────────────┐
│  ③ Data Cache（服务端 fetch 缓存）           │
│  fetch() 的响应被缓存                        │
│  next: { revalidate: 60 } → 60秒内复用       │
│  cache: 'no-store' → 跳过缓存（购物车）       │
└──────────────────┬──────────────────────────┘
                   │ miss
                   ▼
┌─────────────────────────────────────────────┐
│  ④ 数据源（API / 数据库）                    │
│  本项目用 mock 数据模拟                       │
└─────────────────────────────────────────────┘
        `}</pre>
      </div>

      {/* 商品列表 */}
      <h2 className="page-title">
        商品列表
        <span className="cache-badge static">静态渲染</span>
      </h2>
      <div className="product-grid">
        {products.map((product) => (
          <Link key={product.id} href={`/products/${product.id}`}>
            <div className="product-card">
              <div className="emoji">{product.image}</div>
              <h3>{product.name}</h3>
              <div className="price">¥{product.price}</div>
              <div className="meta">{product.category} · ⭐ {product.rating}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* 面试考点 */}
      <div style={{ marginTop: 32 }}>
        <h2 className="page-title">面试考点覆盖</h2>
        <table className="interview-table">
          <thead>
            <tr>
              <th>考点</th>
              <th>本项目体现</th>
              <th>页面</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Data Cache</td>
              <td>fetch + next: revalidate: 60，商品数据60秒缓存</td>
              <td>/products/[id]</td>
            </tr>
            <tr>
              <td>Router Cache</td>
              <td>Link 导航，详情→返回列表瞬间显示</td>
              <td>全局导航</td>
            </tr>
            <tr>
              <td>revalidate (ISR)</td>
              <td>商品详情页60秒增量静态再生成</td>
              <td>/products/[id]</td>
            </tr>
            <tr>
              <td>cache: no-store</td>
              <td>购物车实时数据，跳过所有缓存</td>
              <td>/cart</td>
            </tr>
            <tr>
              <td>首屏性能测量</td>
              <td>performance API 测量 TTFB/FCP/LCP</td>
              <td>/timing</td>
            </tr>
            <tr>
              <td>缓存层级图</td>
              <td>首页 ASCII 图展示四层缓存</td>
              <td>/（本页）</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
