// 模拟开发者 Dashboard 数据

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// 个人信息（快，50ms）
export async function getProfile() {
  await delay(50);
  return {
    name: 'Zhang San',
    avatar: '👨‍💻',
    bio: '全栈工程师 · React / Next.js / Node.js',
    followers: 1234,
    following: 56,
    stars: 890,
  };
}

// 仓库列表（中等，800ms，模拟慢查询）
export async function getRepos() {
  await delay(800);
  return [
    { id: 1, name: 'nextjs-cache-demo', desc: 'Next.js 缓存机制演示', lang: 'JavaScript', stars: 128, updated: Date.now() - 180000 },
    { id: 2, name: 'virtual-list', desc: '万人通讯录虚拟列表', lang: 'React', stars: 256, updated: Date.now() - 3600000 },
    { id: 3, name: 'fiber-scheduler', desc: 'React Fiber 调度器学习', lang: 'TypeScript', stars: 64, updated: Date.now() - 86400000 },
    { id: 4, name: 'ssr-streaming', desc: 'SSR Streaming 演示', lang: 'JavaScript', stars: 32, updated: Date.now() - 172800000 },
    { id: 5, name: 'debounce-hooks', desc: '防抖节流自定义 Hooks', lang: 'React', stars: 96, updated: Date.now() - 604800000 },
  ];
}

// 贡献热力图（最慢，1200ms）
export async function getContributions() {
  await delay(1200);
  // 生成最近 52 周的模拟数据
  const weeks = [];
  for (let w = 0; w < 20; w++) {
    const days = [];
    for (let d = 0; d < 7; d++) {
      days.push(Math.floor(Math.random() * 5)); // 0-4 级活跃度
    }
    weeks.push(days);
  }
  return { weeks, totalContributions: 847 };
}

// 通知列表（中等，500ms）
export async function getNotifications() {
  await delay(500);
  return [
    { id: 1, type: 'star', message: '有人 star 了你的 nextjs-cache-demo', time: Date.now() - 120000 },
    { id: 2, type: 'issue', message: 'virtual-list #12: 动态高度计算有误', time: Date.now() - 600000 },
    { id: 3, type: 'pr', message: 'fiber-scheduler PR #3 已合并', time: Date.now() - 3600000 },
  ];
}
