import './globals.css';
import Nav from '@/components/Nav';

export const metadata = {
  title: '电商缓存演示 - Next.js',
  description: 'Next.js 缓存机制面试演示项目',
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body>
        <Nav />
        {children}
      </body>
    </html>
  );
}
