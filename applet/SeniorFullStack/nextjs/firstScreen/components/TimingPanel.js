'use client';

import { useState, useEffect } from 'react';

// 首屏性能计时面板（Client Component）
// 考点：performance API 测量 TTFB / FCP / LCP / DOM Ready
export default function TimingPanel() {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    // 等页面完全加载后再采集指标
    const timer = setTimeout(() => {
      const nav = performance.getEntriesByType('navigation')[0];
      const paintEntries = performance.getEntriesByType('paint');
      const fcp = paintEntries.find((e) => e.name === 'first-contentful-paint');

      const data = {
        // TTFB：从请求发出到收到第一个字节
        ttfb: nav ? Math.round(nav.responseStart - nav.requestStart) : '-',
        // DOM Ready：HTML 解析完成
        domReady: nav ? Math.round(nav.domContentLoadedEventEnd - nav.fetchStart) : '-',
        // Load：所有资源加载完成
        load: nav ? Math.round(nav.loadEventEnd - nav.fetchStart) : '-',
        // FCP：首次内容绘制
        fcp: fcp ? Math.round(fcp.startTime) : '-',
        // 页面传输大小
        transferSize: nav ? `${(nav.transferSize / 1024).toFixed(1)} KB` : '-',
      };

      // 尝试获取 LCP（需要 PerformanceObserver）
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          setMetrics((prev) => ({
            ...prev,
            lcp: Math.round(lastEntry.startTime),
          }));
          lcpObserver.disconnect();
        });
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
      } catch (e) {
        // 部分浏览器不支持
      }

      setMetrics(data);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (!metrics) {
    return (
      <div className="timing-panel">
        <h3>⏱️ 首屏性能指标</h3>
        <p style={{ color: '#999' }}>采集中...</p>
      </div>
    );
  }

  const rows = [
    { label: 'TTFB（首字节时间）', value: `${metrics.ttfb} ms`, desc: '服务器响应速度' },
    { label: 'FCP（首次内容绘制）', value: `${metrics.fcp} ms`, desc: '用户看到第一个内容' },
    { label: 'LCP（最大内容绘制）', value: metrics.lcp ? `${metrics.lcp} ms` : '采集中...', desc: '首屏主要内容完成' },
    { label: 'DOM Ready', value: `${metrics.domReady} ms`, desc: 'HTML 解析完成' },
    { label: 'Load', value: `${metrics.load} ms`, desc: '所有资源加载完成' },
    { label: '传输大小', value: metrics.transferSize, desc: '页面数据量' },
  ];

  return (
    <div className="timing-panel">
      <h3>⏱️ 首屏性能指标</h3>
      {rows.map((row) => (
        <div key={row.label} className="timing-row">
          <span className="timing-label">{row.label}</span>
          <span className="timing-value">{row.value}</span>
        </div>
      ))}
    </div>
  );
}
