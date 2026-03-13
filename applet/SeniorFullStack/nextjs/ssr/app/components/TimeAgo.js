'use client'

import { useState, useEffect } from 'react'

/**
 * 🎯 面试考点：Hydration Error — 时间戳不一致
 * 
 * 经典问题：
 *   服务端渲染时间: 14:30:00 → "3 分钟前"
 *   客户端 hydrate 时间: 14:30:02 → "3 分钟前"（可能变成 "4 分钟前"）
 *   → Hydration Mismatch!
 * 
 * 解决方案：
 *   1. suppressHydrationWarning 属性（治标）
 *   2. useEffect 中更新时间（治本）
 *   3. 使用 Date.now() 而非 new Date() 的字符串表示
 */
export default function TimeAgo({ timestamp, label }) {
  const [display, setDisplay] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    const update = () => {
      const diff = Date.now() - timestamp
      const seconds = Math.floor(diff / 1000)
      const minutes = Math.floor(seconds / 60)
      const hours = Math.floor(minutes / 60)

      if (seconds < 60) setDisplay(`${seconds} 秒前`)
      else if (minutes < 60) setDisplay(`${minutes} 分钟前`)
      else if (hours < 24) setDisplay(`${hours} 小时前`)
      else setDisplay(`${Math.floor(hours / 24)} 天前`)
    }

    update()
    const timer = setInterval(update, 10000)
    return () => clearInterval(timer)
  }, [timestamp])

  return (
    <span className="time-ago" suppressHydrationWarning>
      {label && <span className="time-label">{label}</span>}
      {mounted ? display : '加载中...'}
    </span>
  )
}
