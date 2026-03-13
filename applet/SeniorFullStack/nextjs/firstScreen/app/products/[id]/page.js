import Link from 'next/link';
import { Suspense } from 'react';

// 考点：ISR — revalidate: 60 秒，Data Cache 缓存 fetch 响应
// 商品基本信息走缓存，评论走实时

export async function generateStaticParams() {
  return [{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }, { id: '5' }, { id: '6' }];
}

async function getProduct(id) {
  const res = await fetch(`http://localhost:3002/api/products/${id}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return null;
  return res.json();
}

async function getReviews(productId) {
  const res = await fetch(`http://localhost:3002/api/reviews/${productId}`, {
    cache: 'no-store',
  });
  return res.json();
}

// 评论区组件（异步，配合 Suspense）
async function ReviewSection({ productId }) {
  const reviews = await getReviews(productId);
  return (
    <div className="reviews">
      <h2>用户评论 <span className="cache-badge dynamic">实时数据</span></h2>
      {reviews.length === 0 && <p style={{ color: '#999' }}>暂无评论</p>}
      {reviews.map((r) => (
        <div key={r.id} className="review-item">
          <div className="user">{r.user}</div>
          <div className="content">{r.content}</div>
          <div className="time">{r.time}</div>
        </div>
      ))}
    </div>
  );
}

export default async function ProductPage({ params }) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return (
      <div className="container">
        <Link href="/" className="back-btn">← 返回列表</Link>
        <p>商品不存在</p>
      </div>
    );
  }

  return (
    <div className="container">
      <Link href="/" className="back-btn">← 返回列表</Link>

      <div className="product-detail">
        <div className="emoji">{product.image}</div>
        <h1>
          {product.name}
          <span className="cache-badge isr">ISR 60s</span>
        </h1>
        <div className="price">¥{product.price}</div>
        <div className="desc">{product.description}</div>
        <div className="stock">库存：{product.stock} 件 · ⭐ {product.rating}</div>
        <div className="fetched-at">
          数据获取时间：{product.fetchedAt}（60秒内刷新页面会看到相同时间 = 命中缓存）
        </div>
      </div>

      {/* 评论区用 Suspense 包裹，不阻塞商品信息的显示 */}
      <Suspense fallback={<div className="reviews"><h2>用户评论</h2><p>加载中...</p></div>}>
        <ReviewSection productId={id} />
      </Suspense>
    </div>
  );
}
