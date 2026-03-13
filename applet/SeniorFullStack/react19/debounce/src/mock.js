/** 模拟商品数据 */

// 基础商品模板
const BASE_PRODUCTS = [
  { id: 1, name: "iPhone 16 Pro Max", price: 9999, category: "手机" },
  { id: 2, name: "iPhone 16 Pro", price: 8999, category: "手机" },
  { id: 3, name: "iPhone 16", price: 6999, category: "手机" },
  { id: 4, name: "iPad Pro M4", price: 8999, category: "平板" },
  { id: 5, name: "iPad Air M2", price: 4799, category: "平板" },
  { id: 6, name: "MacBook Pro 16", price: 19999, category: "笔记本" },
  { id: 7, name: "MacBook Air M3", price: 8999, category: "笔记本" },
  { id: 8, name: "AirPods Pro 2", price: 1899, category: "耳机" },
  { id: 9, name: "AirPods Max", price: 4399, category: "耳机" },
  { id: 10, name: "Apple Watch Ultra 2", price: 6499, category: "手表" },
  { id: 11, name: "Apple Watch Series 9", price: 2999, category: "手表" },
  { id: 12, name: "Samsung Galaxy S24 Ultra", price: 9699, category: "手机" },
  { id: 13, name: "Samsung Galaxy Z Fold 5", price: 12999, category: "手机" },
  { id: 14, name: "Sony WH-1000XM5", price: 2499, category: "耳机" },
  { id: 15, name: "Sony WF-1000XM5", price: 1999, category: "耳机" },
  { id: 16, name: "华为 Mate 60 Pro", price: 6999, category: "手机" },
  { id: 17, name: "华为 MatePad Pro", price: 4999, category: "平板" },
  { id: 18, name: "小米 14 Ultra", price: 5999, category: "手机" },
  { id: 19, name: "小米平板 6 Pro", price: 2599, category: "平板" },
  { id: 20, name: "戴尔 XPS 15", price: 12999, category: "笔记本" },
  { id: 21, name: "ThinkPad X1 Carbon", price: 10999, category: "笔记本" },
  { id: 22, name: "Bose QC Ultra", price: 2999, category: "耳机" },
  { id: 23, name: "OPPO Find X7 Ultra", price: 5999, category: "手机" },
  { id: 24, name: "vivo X100 Pro", price: 4999, category: "手机" },
  { id: 25, name: "Google Pixel 8 Pro", price: 5999, category: "手机" },
  { id: 26, name: "Surface Pro 10", price: 8999, category: "平板" },
  { id: 27, name: "Nintendo Switch OLED", price: 2499, category: "游戏机" },
  { id: 28, name: "PS5 Slim", price: 3499, category: "游戏机" },
  { id: 29, name: "Xbox Series X", price: 3799, category: "游戏机" },
  { id: 30, name: "Steam Deck OLED", price: 4199, category: "游戏机" },
  { id: 31, name: "一加 12 Pro", price: 4999, category: "手机" },
  { id: 32, name: "荣耀 Magic6 Pro", price: 5499, category: "手机" },
  { id: 33, name: "realme GT5 Pro", price: 3299, category: "手机" },
  { id: 34, name: "红米 K70 Pro", price: 3299, category: "手机" },
  { id: 35, name: "iQOO 12 Pro", price: 4499, category: "手机" },
  { id: 36, name: "华为 MateBook X Pro", price: 11999, category: "笔记本" },
  { id: 37, name: "联想 YOGA Pro 16", price: 9999, category: "笔记本" },
  { id: 38, name: "华硕 ROG 幻16", price: 13999, category: "笔记本" },
  { id: 39, name: "惠普 暗影精灵9", price: 7999, category: "笔记本" },
  { id: 40, name: "宏碁 掠夺者", price: 12999, category: "笔记本" },
  { id: 41, name: "JBL Tour Pro 2", price: 1499, category: "耳机" },
  { id: 42, name: "森海塞尔 Momentum 4", price: 2699, category: "耳机" },
  { id: 43, name: "Beats Studio Pro", price: 2899, category: "耳机" },
  { id: 44, name: "华为 FreeBuds Pro 3", price: 1499, category: "耳机" },
  { id: 45, name: "小米 Buds 4 Pro", price: 999, category: "耳机" },
  { id: 46, name: "三星 Galaxy Watch 6", price: 2199, category: "手表" },
  { id: 47, name: "华为 Watch GT 4", price: 1588, category: "手表" },
  { id: 48, name: "小米 Watch S3", price: 999, category: "手表" },
  { id: 49, name: "Garmin Venu 3", price: 3480, category: "手表" },
  { id: 50, name: "OPPO Watch 4 Pro", price: 2299, category: "手表" },
];

// 生成 100 条商品数据（基础 50 条 + 变体 50 条）
const PRODUCTS = [
  ...BASE_PRODUCTS,
  ...BASE_PRODUCTS.map((p, i) => ({
    ...p,
    id: 51 + i,
    name: p.name + " 二代",
    price: Math.round(p.price * 1.1),
  })),
];

/** 模拟搜索联想 — 延迟 200ms 返回 */
export function fetchSuggestions(keyword) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!keyword.trim()) {
        resolve([]);
        return;
      }
      const lower = keyword.toLowerCase();
      const results = PRODUCTS.filter((p) =>
        p.name.toLowerCase().includes(lower)
      ).map((p) => p.name);
      resolve(results.slice(0, 8));
    }, 200);
  });
}

/** 模拟分页加载商品 — 延迟 300ms 返回 */
export function fetchProducts(page, pageSize = 12) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const start = (page - 1) * pageSize;
      const data = PRODUCTS.slice(start, start + pageSize);
      resolve({
        data,
        hasMore: start + pageSize < PRODUCTS.length,
      });
    }, 300);
  });
}
