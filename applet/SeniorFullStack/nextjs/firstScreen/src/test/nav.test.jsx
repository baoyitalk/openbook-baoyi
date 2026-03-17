import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}))

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }) => <a href={href} {...props}>{children}</a>,
}))

import Nav from '@/components/Nav'

describe('Nav 组件', () => {
  it('渲染4个导航链接', () => {
    render(<Nav />)
    expect(screen.getByText(/首页/)).toBeInTheDocument()
    expect(screen.getByText(/购物车/)).toBeInTheDocument()
    expect(screen.getByText(/性能面板/)).toBeInTheDocument()
  })

  it('当前路由高亮', () => {
    render(<Nav />)
    const homeLink = screen.getByText(/首页/).closest('a')
    expect(homeLink.className).toContain('active')
  })
})
