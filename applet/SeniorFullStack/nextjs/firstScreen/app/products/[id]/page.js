import Link from 'next/link';
import { Suspense } from 'react';
import { getProduct, getReviews } from '@/lib/mock';

/**
 * 🎯 面试考点：ISR + Suspense
 * 
 * 原本用 fetch + revalidate 演示 Data Cache，
 * 但 build 时 API 服务未运行会导致 ECONNREFUSED。
 * 
 * 改为直接 import mock 数据（Server Component 可以直接调用服务端函数）。
 * 面试时讲解：实际项目中这里会是 fetch 外部 API 或查数据库，
 * revalidate: 60 控制 ISR 缓存时间。
 * 
 * generateStaticParams → 构建时预渲染6个商品页
 * revalidatePath / revalidateTag → 按需刷新
 */

export async function generateStaticParams() {
  return [{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }, { id: '5' }, { id: '6' }];
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
      <div style={{ marginTop: 12, padding: 12, background: '#f0f9ff', borderRadius: 8, fontSize: 13 }}>
        💡 实际项目中评论用 <code>fetch(url, {'{'} cache: &apos;no-store&apos; {'}'})</code> 获取实时数据
      </div>
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
          数据获取时间：{product.fetchedAt}（ISR 模式下60秒内刷新会看到相同时间 = 命中缓存）
        </div>
      </div>

      <div style={{ margin: '16px 0', padding: 16, background: '#fffbeb', borderRadius: 8, fontSize: 13 }}>
        💡 面试说明：实际项目中商品数据用 <code>fetch(url, {'{'} next: {'{'} revalidate: 60 {'}'} {'}'})</code>，
        60秒内复用 Data Cache，过期后增量再生成（ISR）。
        本 demo 直接调用 mock 函数模拟数据源。
      </div>

      {/* 评论区用 Suspense 包裹，不阻塞商品信息的显示 */}
      <Suspense fallback={<div className="reviews"><h2>用户评论</h2><p>加载中...</p></div>}>
        <ReviewSection productId={id} />
      </Suspense>
    </div>
  );
}
