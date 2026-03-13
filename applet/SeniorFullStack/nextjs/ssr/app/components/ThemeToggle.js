'use client'

import { useState, useEffect } from 'react'

/**
 * 🎯 面试考点：Hydration Error 经典场景
 * 
 * 问题：localStorage 只存在于浏览器端，服务端渲染时 window 不存在
 * 如果直接在初始 state 中读取 localStorage，会导致：
 *   服务端渲染: theme = undefined → 渲染 "☀️"
 *   客户端渲染: theme = "dark" → 渲染 "🌙"
 *   → Hydration Mismatch Error!
 * 
 * 解决方案：useEffect 中读取 localStorage（只在客户端执行）
 */
export default function ThemeToggle() {
  // ❌ 错误写法（会导致 Hydration Error）：
  // const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light')
  
  // ✅ 正确写法：初始值用固定值，useEffect 中同步
  const [theme, setTheme] = useState('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('dashboard-theme')
    if (saved) {
      setTheme(saved)
      document.documentElement.setAttribute('data-theme', saved)
    }
  }, [])

  const toggle = () => {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    localStorage.setItem('dashboard-theme', next)
    document.documentElement.setAttribute('data-theme', next)
  }

  // 未挂载时渲染占位，避免闪烁
  if (!mounted) {
    return <button className="theme-toggle" aria-label="切换主题">🌓</button>
  }

  return (
    <button className="theme-toggle" onClick={toggle} aria-label="切换主题">
      {theme === 'light' ? '☀️ 浅色' : '🌙 深色'}
    </button>
  )
}
