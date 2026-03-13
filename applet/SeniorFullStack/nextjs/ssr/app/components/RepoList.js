import { getRepos } from '@/lib/mock'

/**
 * 🎯 面试考点：Streaming SSR
 * 
 * 1. 此组件加载需要 800ms（模拟慢查询）
 * 2. 被 Suspense 包裹后，不会阻塞页面其他部分
 * 3. 服务端渲染完成后，通过 HTTP chunked transfer 流式发送到客户端
 * 4. 客户端收到后自动替换 fallback（skeleton loading）
 * 
 * 面试追问：Streaming 和传统 SSR 的区别？
 * - 传统 SSR：等所有数据就绪 → 一次性发送完整 HTML
 * - Streaming：先发送 shell + fallback → 数据就绪后逐块发送
 */
export default async function RepoList() {
  const repos = await getRepos()

  return (
    <div className="repo-list">
      <h3>📦 热门仓库（800ms 加载）</h3>
      {repos.map(repo => (
        <div key={repo.name} className="repo-item">
          <div className="repo-header">
            <span className="repo-name">{repo.name}</span>
            <span className={`repo-visibility ${repo.visibility}`}>
              {repo.visibility === 'public' ? '🔓 公开' : '🔒 私有'}
            </span>
          </div>
          <p className="repo-desc">{repo.description}</p>
          <div className="repo-meta">
            <span className="repo-lang">
              <span className="lang-dot" style={{ background: repo.langColor }} />
              {repo.language}
            </span>
            <span>⭐ {repo.stars}</span>
            <span>🍴 {repo.forks}</span>
          </div>
        </div>
      ))}
      <div className="interview-note">
        💡 此组件通过 Suspense + Streaming 加载
        <br />800ms 后流式到达，不阻塞其他区域
      </div>
    </div>
  )
}
