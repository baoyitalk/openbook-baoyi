import './globals.css';
import ThemeToggle from '@/app/components/ThemeToggle';

export const metadata = {
  title: 'SSR Dashboard - Next.js',
  description: 'Server Components / Suspense / Streaming / Hydration Error 演示',
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body>
        <header className="header">
          <span className="header-logo">🐙 SSR Dashboard</span>
          <nav className="header-nav">
            <span>考点：Server Components · Suspense · Streaming · Hydration Error</span>
          </nav>
          <div style={{ marginLeft: 'auto' }}>
            <ThemeToggle />
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
