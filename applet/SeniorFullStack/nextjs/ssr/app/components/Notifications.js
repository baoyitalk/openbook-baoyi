import { getNotifications } from '@/lib/mock'
import TimeAgo from './TimeAgo'

/**
 * 🎯 面试考点：Server/Client Component 混合
 * 
 * Notifications 本身是 Server Component（async 数据获取）
 * 但内部使用了 TimeAgo（Client Component）
 * 
 * 关键理解：
 *   Server Component 可以 import Client Component ✅
 *   Client Component 不能 import Server Component ❌
 *   Client Component 可以通过 children prop 接收 Server Component ✅
 */
export default async function Notifications() {
  const notifications = await getNotifications()

  const icons = {
    star: '⭐',
    fork: '🍴',
    issue: '🐛',
    pr: '🔀',
    follow: '👤'
  }

  return (
    <div className="notifications">
      <h3>🔔 通知（500ms 加载）</h3>
      <div className="notification-list">
        {notifications.map((n, i) => (
          <div key={i} className={`notification-item ${n.type}`}>
            <span className="notification-icon">{icons[n.type] || '📌'}</span>
            <div className="notification-content">
              <p>{n.message}</p>
              <TimeAgo timestamp={n.time} />
            </div>
          </div>
        ))}
      </div>
      <div className="interview-note">
        💡 Server Component 内嵌 Client Component（TimeAgo）
        <br />数据获取在服务端，时间显示在客户端
      </div>
    </div>
  )
}
