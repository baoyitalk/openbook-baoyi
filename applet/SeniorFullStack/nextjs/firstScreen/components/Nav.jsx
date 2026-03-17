'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// 导航栏（Client Component，需要 usePathname 高亮当前路由）
export default function Nav() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: '🏠 首页' },
    { href: '/products/1', label: '📱 商品详情' },
    { href: '/cart', label: '🛒 购物车' },
    { href: '/timing', label: '⏱️ 性能面板' },
  ];

  return (
    <nav className="nav">
      <span className="nav-logo">电商缓存演示</span>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={pathname === link.href ? 'nav-active' : ''}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
