import { Suspense } from 'react'
import Profile from './components/Profile'
import RepoList from './components/RepoList'
import HeatMap from './components/HeatMap'
import Notifications from './components/Notifications'

/**
 * 🎯 面试考点汇总页
 * 
 * 1. Suspense + Streaming：每个异步组件独立加载，不互相阻塞
 * 2. Server Components：Profile/RepoList/HeatMap/Notifications 都是 SC
 * 3. Skeleton Loading：Suspense fallback 提供加载骨架屏
 * 4. 渐进式渲染：50ms → 500ms → 800ms → 1200ms 依次到达
 */

// Skeleton 组件
function ProfileSkeleton() {
  return (
    <div className="profile-card skeleton">
      <div className="skeleton-avatar" />
      <div className="skeleton-line w60" />
      <div className="skeleton-line w80" />
      <div className="skeleton-stats">
        <div className="skeleton-stat" />
        <div className="skeleton-stat" />
        <div className="skeleton-stat" />
      </div>
    </div>
  )
}

function RepoSkeleton() {
  return (
    <div className="repo-list skeleton">
      <h3>📦 热门仓库</h3>
      {[1, 2, 3].map(i => (
        <div key={i} className="repo-item">
          <div className="skeleton-line w40" />
          <div className="skeleton-line w80" />
          <div className="skeleton-line w30" />
        </div>
      ))}
    </div>
  )
}

function HeatMapSkeleton() {
  return (
    <div className="heatmap skeleton">
      <h3>🟩 贡献热力图</h3>
      <div className="skeleton-heatmap">
        {Array.from({ length: 28 }).map((_, i) => (
          <div key={i} className="heatmap-cell skeleton-cell" />
        ))}
      </div>
    </div>
  )
}

function NotificationSkeleton() {
  return (
    <div className="notifications skeleton">
      <h3>🔔 通知</h3>
      {[1, 2, 3].map(i => (
        <div key={i} className="notification-item">
          <div className="skeleton-icon" />
          <div className="notification-content">
            <div className="skeleton-line w70" />
            <div className="skeleton-line w30" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function DashboardPage() {
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>🧑‍💻 开发者 Dashboard</h1>
        <p className="subtitle">Next.js SSR 面试演示 — Suspense / Streaming / Hydration</p>
      </header>

      {/* 面试考点说明 */}
      <div className="interview-banner">
        <pre>{`
┌─────────────────────────────────────────────────┐
│         Streaming SSR 时间线                      │
│                                                   │
│  0ms    HTML shell + Skeleton 骨架屏 到达          │
│  50ms   ✅ Profile 组件流式到达                    │
│  500ms  ✅ Notifications 组件流式到达              │
│  800ms  ✅ RepoList 组件流式到达                   │
│  1200ms ✅ HeatMap 组件流式到达（最慢）            │
│                                                   │
│  💡 打开 DevTools Network 查看 chunked response   │
└─────────────────────────────────────────────────┘
        `}</pre>
      </div>

      {/* Dashboard 网格布局 */}
      <div className="dashboard-grid">
        {/* 左侧：Profile（最快 50ms） */}
        <div className="grid-sidebar">
          <Suspense fallback={<ProfileSkeleton />}>
            <Profile />
          </Suspense>
        </div>

        {/* 右侧主区域 */}
        <div className="grid-main">
          {/* 仓库列表（800ms） */}
          <Suspense fallback={<RepoSkeleton />}>
            <RepoList />
          </Suspense>

          {/* 热力图（1200ms，最慢） */}
          <Suspense fallback={<HeatMapSkeleton />}>
            <HeatMap />
          </Suspense>
        </div>

        {/* 底部：通知（500ms） */}
        <div className="grid-bottom">
          <Suspense fallback={<NotificationSkeleton />}>
            <Notifications />
          </Suspense>
        </div>
      </div>

      {/* 面试考点表格 */}
      <div className="interview-table">
        <h2>📋 本页面试考点</h2>
        <table>
          <thead>
            <tr>
              <th>考点</th>
              <th>组件</th>
              <th>说明</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Server Components</td>
              <td>Profile / RepoList / HeatMap</td>
              <td>async 组件，代码不发送到客户端</td>
            </tr>
            <tr>
              <td>Suspense + Streaming</td>
              <td>所有异步组件</td>
              <td>独立加载，skeleton fallback，chunked transfer</td>
            </tr>
            <tr>
              <td>Hydration Error</td>
              <td>ThemeToggle / TimeAgo</td>
              <td>localStorage / 时间戳 服务端客户端不一致</td>
            </tr>
            <tr>
              <td>SC + CC 混合</td>
              <td>Notifications → TimeAgo</td>
              <td>Server Component 内嵌 Client Component</td>
            </tr>
            <tr>
              <td>Skeleton Loading</td>
              <td>各 Suspense fallback</td>
              <td>骨架屏提升感知性能</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
