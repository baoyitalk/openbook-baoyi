// 考点：cache: 'no-store' — 跳过所有缓存，每次请求最新数据
// 购物车数据实时变化，不能用缓存

async function getCart() {
  const res = await fetch('http://localhost:3002/api/cart', {
    cache: 'no-store', // 关键：跳过 Data Cache
  });
  return res.json();
}

export default async function CartPage() {
  const cart = await getCart();

  const total = cart.reduce((sum, item) => {
    return sum + (item.product ? item.product.price * item.quantity : 0);
  }, 0);

  return (
    <div className="container">
      <h1 className="page-title">
        🛒 购物车
        <span className="cache-badge dynamic">no-store 实时</span>
      </h1>

      <div className="cart-list">
        {cart.map((item) => (
          <div key={item.productId} className="cart-item">
            <span className="emoji">{item.product?.image}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600 }}>{item.product?.name}</div>
              <div style={{ color: '#888', fontSize: 13 }}>数量：{item.quantity}</div>
            </div>
            <div style={{ color: '#e53e3e', fontWeight: 700 }}>
              ¥{item.product ? item.product.price * item.quantity : 0}
            </div>
          </div>
        ))}

        <div style={{ textAlign: 'right', marginTop: 16, fontSize: 18, fontWeight: 700 }}>
          合计：<span style={{ color: '#e53e3e' }}>¥{total}</span>
        </div>
      </div>

      <div className="cache-diagram" style={{ marginTop: 24 }}>
        <h3 style={{ marginBottom: 8 }}>为什么购物车用 no-store？</h3>
        <pre>{`
购物车数据特点：
  - 用户随时增删商品 → 数据实时变化
  - 价格可能因促销随时调整
  - 不同用户购物车不同 → 不能共享缓存

fetch('http://.../api/cart', {
  cache: 'no-store'  // ← 告诉 Next.js 跳过 Data Cache
})

效果：
  ┌─ Router Cache ─┐  ┌─ Full Route Cache ─┐  ┌─ Data Cache ─┐
  │    跳过 ❌      │  │      跳过 ❌        │  │   跳过 ❌     │
  └────────────────┘  └────────────────────┘  └──────────────┘
                                                      │
                                                      ▼
                                               直接请求数据源
        `}</pre>
      </div>
    </div>
  );
}
