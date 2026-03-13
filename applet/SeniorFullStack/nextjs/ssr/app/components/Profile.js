import { getProfile } from '@/lib/mock'

/**
 * 🎯 面试考点：Server Component
 * 
 * 1. 默认就是 Server Component（无需标记）
 * 2. 可以直接 async/await，无需 useEffect
 * 3. 组件代码不会发送到客户端 → 减少 bundle size
 * 4. 可以直接访问数据库/文件系统（这里用 mock 模拟）
 */
export default async function Profile() {
  const profile = await getProfile()

  return (
    <div className="profile-card">
      <div className="avatar">{profile.avatar}</div>
      <h2>{profile.name}</h2>
      <p className="bio">{profile.bio}</p>
      <div className="stats">
        <div className="stat">
          <span className="stat-value">{profile.repos}</span>
          <span className="stat-label">仓库</span>
        </div>
        <div className="stat">
          <span className="stat-value">{profile.followers}</span>
          <span className="stat-label">关注者</span>
        </div>
        <div className="stat">
          <span className="stat-value">{profile.following}</span>
          <span className="stat-label">关注中</span>
        </div>
      </div>
      <div className="interview-note">
        💡 此组件是 Server Component（50ms 加载）
        <br />代码不会发送到客户端浏览器
      </div>
    </div>
  )
}
