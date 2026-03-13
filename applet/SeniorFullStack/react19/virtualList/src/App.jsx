import { useState, useTransition, useMemo } from "react";
import { contacts } from "./mock";
import BruteList from "./components/BruteList";
import VirtualList from "./components/VirtualList";

const ITEM_HEIGHT = 60;

/**
 * 主页面 — 左右对比 + Fiber 时间切片演示
 */
export default function App() {
  // ====== Fiber 时间切片演示 ======
  // 输入框 + startTransition 对比
  const [inputValue, setInputValue] = useState("");
  const [filterText, setFilterText] = useState("");
  const [useTransitionEnabled, setUseTransitionEnabled] = useState(true);
  const [isPending, startTransition] = useTransition();

  const handleInput = (e) => {
    const val = e.target.value;
    setInputValue(val); // 高优先级：输入框立即响应

    if (useTransitionEnabled) {
      // 用 startTransition 包裹低优先级更新
      // Fiber 会在空闲时间片处理这个更新，不阻塞输入
      startTransition(() => {
        setFilterText(val);
      });
    } else {
      // 不用 startTransition：同步更新，输入框会卡顿
      setFilterText(val);
    }
  };

  // 根据 filterText 过滤数据
  // useMemo 保证 filterText 不变时返回同一引用，配合子组件 React.memo 避免 FPS 更新导致的无意义重渲染
  const filteredData = useMemo(
    () =>
      filterText
        ? contacts.filter(
            (c) =>
              c.name.includes(filterText) ||
              c.department.includes(filterText) ||
              c.phone.includes(filterText)
          )
        : contacts,
    [filterText]
  );


  return (
    <div className="app">
      <header className="header">
        <h1>📇 万人通讯录 — 虚拟列表 + Fiber 时间切片</h1>
        <p className="subtitle">
          左边暴力渲染 10000 条 DOM，右边虚拟列表只渲染可视区
        </p>
      </header>

      {/* Fiber 时间切片演示区 */}
      <div className="fiber-demo">
        <div className="fiber-controls">
          <input
            className="fiber-input"
            type="text"
            placeholder="输入搜索（体验 Fiber 时间切片）..."
            value={inputValue}
            onChange={handleInput}
            aria-label="搜索联系人"
          />
          <button
            className={`toggle-btn ${useTransitionEnabled ? "toggle-on" : "toggle-off"}`}
            onClick={() => setUseTransitionEnabled((v) => !v)}
          >
            {useTransitionEnabled
              ? "✅ startTransition 已开启"
              : "❌ startTransition 已关闭"}
          </button>
          {isPending && <span className="pending-badge">⏳ 低优先级更新中...</span>}
        </div>
        <p className="fiber-hint">
          {useTransitionEnabled
            ? "💡 开启 startTransition：输入框流畅，列表异步更新（Fiber 时间切片）"
            : "⚠️ 关闭 startTransition：输入框卡顿，因为过滤 + 渲染同步阻塞主线程"}
        </p>
      </div>

      {/* 左右对比 */}
      <div className="compare-layout">
        <BruteList data={filteredData} itemHeight={ITEM_HEIGHT} />
        <VirtualList data={filteredData} itemHeight={ITEM_HEIGHT} />
      </div>

      {/* 底部原理卡片 */}
      <footer className="footer">
        <div className="principle-card">
          <h3>🧠 面试要点</h3>
          <table className="principle-table">
            <thead>
              <tr>
                <th>考点</th>
                <th>本项目体现</th>
                <th>代码位置</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>核心原理</td>
                <td>只渲染可视区 + overscan 缓冲区，用 JS 计算代替 DOM</td>
                <td>useVirtualList.js</td>
              </tr>
              <tr>
                <td>可视区计算</td>
                <td>startIndex / endIndex / offsetY + 前缀和 + 二分查找</td>
                <td>useVirtualList.js</td>
              </tr>
              <tr>
                <td>动态高度</td>
                <td>支持 getItemHeight(index)，前缀和数组 + 二分查找定位</td>
                <td>useVirtualList.js</td>
              </tr>
              <tr>
                <td>滚动节流</td>
                <td>rAF 节流：每帧最多 setState 一次</td>
                <td>useVirtualList.js onScroll</td>
              </tr>
              <tr>
                <td>滚动定位</td>
                <td>scrollToIndex(index) API + "回到顶部" 按钮</td>
                <td>useVirtualList.js + VirtualList.jsx</td>
              </tr>
              <tr>
                <td>资源清理</td>
                <td>rAF / setTimeout 在 unmount 时 cancel</td>
                <td>useVirtualList.js + VirtualList.jsx</td>
              </tr>
              <tr>
                <td>Hooks 全覆盖</td>
                <td>useRef / useCallback / useEffect / useMemo / useState</td>
                <td>全项目</td>
              </tr>
              <tr>
                <td>React.memo + key</td>
                <td>memo 浅比较 + useMemo 稳定引用 + item.id 作 key</td>
                <td>App.jsx + 子组件</td>
              </tr>
              <tr>
                <td>Fiber 时间切片</td>
                <td>useTransition + startTransition 低优先级搜索</td>
                <td>App.jsx</td>
              </tr>
            </tbody>
          </table>
        </div>
      </footer>
    </div>
  );
}
