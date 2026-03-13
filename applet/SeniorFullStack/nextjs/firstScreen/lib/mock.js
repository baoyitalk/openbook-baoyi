// 模拟商品数据
const products = [
  { id: 1, name: 'iPhone 16 Pro', price: 8999, stock: 128, category: '手机', image: '📱', description: 'A18 Pro 芯片，钛金属设计，4800万像素相机系统', rating: 4.8 },
  { id: 2, name: 'MacBook Air M3', price: 9499, stock: 56, category: '电脑', image: '💻', description: 'M3 芯片，15.3英寸 Liquid Retina 显示屏', rating: 4.9 },
  { id: 3, name: 'AirPods Pro 2', price: 1899, stock: 320, category: '配件', image: '🎧', description: '自适应音频，个性化空间音频，USB-C', rating: 4.7 },
  { id: 4, name: 'iPad Pro M4', price: 8999, stock: 42, category: '平板', image: '📋', description: 'M4 芯片，Ultra Retina XDR，超薄设计', rating: 4.8 },
  { id: 5, name: 'Apple Watch Ultra 2', price: 6499, stock: 88, category: '手表', image: '⌚', description: 'S9 芯片，双频GPS，100米防水', rating: 4.6 },
  { id: 6, name: 'HomePod mini', price: 749, stock: 200, category: '配件', image: '🔊', description: '全频驱动单元，计算音频，智能家居中枢', rating: 4.4 },
];

// 模拟评论数据
const reviews = {
  1: [
    { id: 'r1', user: '数码达人', content: '拍照效果太好了，夜景模式惊艳', time: Date.now() - 180000 },
    { id: 'r2', user: '果粉小王', content: '钛金属手感一流，比上代轻不少', time: Date.now() - 3600000 },
    { id: 'r3', user: '摄影师老李', content: '5倍光学变焦终于等到了', time: Date.now() - 86400000 },
  ],
  2: [
    { id: 'r4', user: '程序员小张', content: 'M3 编译速度飞快，风扇几乎不转', time: Date.now() - 600000 },
    { id: 'r5', user: '设计师阿花', content: '屏幕色准很好，修图利器', time: Date.now() - 7200000 },
  ],
  3: [
    { id: 'r6', user: '音乐爱好者', content: '降噪效果比一代强太多', time: Date.now() - 300000 },
  ],
  4: [
    { id: 'r7', user: '画师小美', content: 'Apple Pencil Pro 配合使用体验极佳', time: Date.now() - 1200000 },
  ],
  5: [
    { id: 'r8', user: '运动达人', content: '潜水时用很方便，GPS定位准', time: Date.now() - 5400000 },
  ],
  6: [
    { id: 'r9', user: '智能家居玩家', content: '小巧但音质不错，Siri响应快', time: Date.now() - 9000000 },
  ],
};

// 模拟购物车
let cart = [
  { productId: 1, quantity: 1 },
  { productId: 3, quantity: 2 },
];

/**
 * 模拟网络延迟
 * @param {number} ms 延迟毫秒数
 */
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 获取商品列表（模拟 200ms 延迟）
 */
export async function getProducts() {
  await delay(200);
  return products;
}

/**
 * 获取单个商品（模拟 150ms 延迟）
 * 价格和库存会有微小波动，模拟实时变化
 */
export async function getProduct(id) {
  await delay(150);
  const product = products.find((p) => p.id === Number(id));
  if (!product) return null;
  // 模拟价格/库存微小波动
  return {
    ...product,
    price: product.price + Math.floor(Math.random() * 100 - 50),
    stock: Math.max(0, product.stock + Math.floor(Math.random() * 10 - 5)),
    fetchedAt: new Date().toISOString(),
  };
}

/**
 * 获取商品评论（模拟 300ms 延迟，实时数据）
 */
export async function getReviews(productId) {
  await delay(300);
  return (reviews[Number(productId)] || []).map((r) => ({
    ...r,
    time: new Date(r.time).toISOString(),
  }));
}

/**
 * 获取购物车（模拟 100ms 延迟，实时数据）
 */
export async function getCart() {
  await delay(100);
  return cart.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    return {
      ...item,
      product: product ? { id: product.id, name: product.name, price: product.price, image: product.image } : null,
    };
  });
}
