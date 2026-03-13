import { getContributions } from '@/lib/mock'

/**
 * 🎯 面试考点：Streaming 优先级
 * 
 * 此组件是页面中最慢的数据源（1200ms）
 * Streaming 的核心价值：
 *   Profile(50ms) → 先到达 ✅
 *   Notifications(500ms) → 第二到达 ✅
 *   RepoList(800ms) → 第三到达 ✅
 *   HeatMap(1200ms) → 最后到达 ✅
 * 
 * 用户体验：页面逐步填充，而非白屏等待 1200ms
 */
export default async function HeatMap() {
  const contributions = await getContributions()

  // 生成简化版热力图（7列 x 4行 = 28天）
  const weeks = []
  for (let w = 0; w < 7; w++) {
    const days = []
    for (let d = 0; d < 4; d++) {
      const idx = w * 4 + d
      days.push(contributions[idx] || { count: 0, level: 0 })
    }
    weeks.push(days)
  }

  const levelColors = ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353']

  return (
    <div className="heatmap">
      <h3>🟩 贡献热力图（1200ms 加载）</h3>
      <div className="heatmap-grid">
        {weeks.map((week, wi) => (
          <div key={wi} className="heatmap-week">
            {week.map((day, di) => (
              <div
                key={di}
                className="heatmap-cell"
                style={{ backgroundColor: levelColors[day.level] }}
                title={`${day.count} 次贡献`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="heatmap-legend">
        <span>少</span>
        {levelColors.map((color, i) => (
          <div key={i} className="heatmap-cell" style={{ backgroundColor: color }} />
        ))}
        <span>多</span>
      </div>
      <div className="interview-note">
        💡 最慢的组件（1200ms），最后流式到达
        <br />其他区域早已可交互，不受影响
      </div>
    </div>
  )
}
