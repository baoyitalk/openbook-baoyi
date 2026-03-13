import TimingPanel from '@/components/TimingPanel';

// 性能面板页 — 展示首屏性能指标
// 考点：performance API、Web Vitals（TTFB/FCP/LCP）
export default function TimingPage() {
  return (
    <div className="container">
      <h1 className="page-title">⏱️ 首屏性能面板</h1>

      <TimingPanel />

      <div className="cache-diagram" style={{ marginTop: 24 }}>
        <h3 style={{ marginBottom: 8 }}>首屏性能指标说明</h3>
        <pre>{`
时间线：
  请求发出 ──→ 首字节到达 ──→ 首次绘制 ──→ 最大内容绘制 ──→ 可交互
  │             │              │              │               │
  0ms          TTFB           FCP            LCP             TTI

关键指标：
  TTFB (Time to First Byte)
    服务器处理 + 网络传输时间
    SSR 页面 TTFB 较高（服务端要渲染）
    ISR 缓存命中时 TTFB 极低

  FCP (First Contentful Paint)
    用户看到第一个文字/图片的时刻
    目标：< 1.8s

  LCP (Largest Contentful Paint)
    首屏最大元素渲染完成
    目标：< 2.5s（本项目目标 < 600ms）

Next.js 如何优化首屏：
  1. SSR/SSG → HTML 直出，不用等 JS 下载执行
  2. Streaming → 快的部分先到，慢的用 Suspense 占位
  3. ISR → 缓存命中时等同静态页，TTFB 极低
  4. Router Cache → 二次访问 0ms
        `}</pre>
      </div>
    </div>
  );
}
