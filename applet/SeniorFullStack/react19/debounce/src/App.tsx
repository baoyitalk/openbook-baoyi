import { useState, useEffect, useRef } from "react";
import { useDebounce } from "./hooks/useDebounce";
import { useThrottle } from "./hooks/useThrottle";
import { fetchSuggestions, fetchProducts, type Product } from "./mock";
import "./App.css";

/** 根据窗口宽度计算商品列表列数 */
function calcColumns(width: number): number {
  if (width >= 1200) return 4;
  if (width >= 800) return 3;
  if (width >= 500) return 2;
  return 1;
}

export default function App() {
  // ==================== 搜索联想（防抖 500ms） ====================
  const [keyword, setKeyword] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [debouncedSearch] = useDebounce(async (...args: unknown[]) => {
    const value = args[0] as string;
    console.log("[防抖] 搜索联想请求:", value || "(空)");
    const results = await fetchSuggestions(value);
    setSuggestions(results);
    setShowSuggestions(results.length > 0);
  }, 500);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setKeyword(value);
    if (!value.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    debouncedSearch(value);
  };

  const handleSelectSuggestion = (text: string) => {
    setKeyword(text);
    setShowSuggestions(false);
  };

  // ==================== 商品列表 + 滚动加载（节流 300ms） ====================
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  // 用 ref 存最新状态，避免节流回调中的闭包陷阱
  const pageRef = useRef(page);
  const hasMoreRef = useRef(hasMore);
  const loadingRef = useRef(loading);
  pageRef.current = page;
  hasMoreRef.current = hasMore;
  loadingRef.current = loading;

  const loadProducts = async (p: number) => {
    if (loadingRef.current) return;
    setLoading(true);
    loadingRef.current = true;
    console.log("[加载] 请求第", p, "页商品");
    const { data, hasMore: more } = await fetchProducts(p);
    setProducts((prev) => (p === 1 ? data : [...prev, ...data]));
    setHasMore(more);
    setPage(p);
    setLoading(false);
    loadingRef.current = false;
  };

  useEffect(() => {
    loadProducts(1);
  }, []);

  // 滚动原始触发计数 vs 节流实际执行计数，面试时可展示对比
  const scrollRawCountRef = useRef(0);
  const scrollThrottleCountRef = useRef(0);

  const [throttledScroll] = useThrottle(() => {
    scrollThrottleCountRef.current++;
    const el = listRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    const nearBottom = scrollHeight - scrollTop - clientHeight < 100;
    console.log(
      `[节流] 滚动检测 (原始${scrollRawCountRef.current}次 → 节流${scrollThrottleCountRef.current}次)`
    );
    if (nearBottom && hasMoreRef.current && !loadingRef.current) {
      console.log("[节流] 触底！加载第", pageRef.current + 1, "页");
      loadProducts(pageRef.current + 1);
    }
  }, 300);

  // 包装 onScroll：记录原始触发次数，再调用节流函数
  const handleScroll = () => {
    scrollRawCountRef.current++;
    throttledScroll();
  };

  // ==================== 窗口 resize 重算布局（防抖 300ms） ====================
  const [columns, setColumns] = useState(() => calcColumns(window.innerWidth));

  const [debouncedResize] = useDebounce(() => {
    const cols = calcColumns(window.innerWidth);
    console.log("[防抖] resize 重算布局，列数:", cols);
    setColumns(cols);
  }, 300);

  useEffect(() => {
    const handleResize = () => debouncedResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [debouncedResize]);

  // ==================== 日志面板 ====================
  const [logs, setLogs] = useState<string[]>([]);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const originalLog = console.log;
    console.log = (...args: unknown[]) => {
      originalLog(...args);
      const msg = args.map((a) => String(a)).join(" ");
      if (msg.startsWith("[")) {
        setLogs((prev) => [
          ...prev.slice(-50),
          `${new Date().toLocaleTimeString()} ${msg}`,
        ]);
      }
    };
    return () => {
      console.log = originalLog;
    };
  }, []);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // ==================== 渲染 ====================
  return (
    <div className="app">
      <header className="header">
        <h1>🔍 商品搜索 — 防抖节流实战</h1>
        <p className="subtitle">
          口诀：<strong>要结果用防抖，要过程用节流</strong>
        </p>
      </header>

      <div className="main-layout">
        {/* 左侧：搜索 + 商品列表 */}
        <div className="content">
          {/* 搜索框 */}
          <div className="search-wrapper">
            <input
              className="search-input"
              type="text"
              placeholder="搜索商品（防抖 500ms）..."
              value={keyword}
              onChange={handleInputChange}
              onBlur={() =>
                setTimeout(() => setShowSuggestions(false), 200)
              }
              onFocus={() =>
                suggestions.length > 0 && setShowSuggestions(true)
              }
              aria-label="搜索商品"
              autoComplete="off"
            />
            <span className="search-badge">防抖 500ms</span>

            {/* 联想下拉 */}
            {showSuggestions && (
              <ul className="suggestions" role="listbox">
                {suggestions.map((s, i) => (
                  <li
                    key={i}
                    role="option"
                    className="suggestion-item"
                    onMouseDown={() => handleSelectSuggestion(s)}
                  >
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* 场景标签 */}
          <div className="scene-tags">
            <span className="tag tag-debounce">🎯 搜索联想 — 防抖</span>
            <span className="tag tag-throttle">⚡ 滚动加载 — 节流</span>
            <span className="tag tag-debounce">📐 resize 布局 — 防抖</span>
          </div>

          {/* 商品列表 */}
          <div
            className="product-list"
            ref={listRef}
            onScroll={handleScroll}
            style={{
              gridTemplateColumns: `repeat(${columns}, 1fr)`,
            }}
          >
            {products.map((p) => (
              <div key={p.id} className="product-card">
                <div className="product-emoji">
                  {getCategoryEmoji(p.category)}
                </div>
                <div className="product-name">{p.name}</div>
                <div className="product-price">¥{p.price}</div>
                <div className="product-category">{p.category}</div>
              </div>
            ))}

            {loading && (
              <div className="loading-row">加载中...</div>
            )}
            {!hasMore && products.length > 0 && (
              <div className="loading-row">已加载全部商品</div>
            )}
          </div>

          <div className="scroll-hint">
            ↕ 滚动商品列表触发节流加载（300ms）
          </div>
        </div>

        {/* 右侧：实时日志 */}
        <div className="log-panel">
          <div className="log-header">
            📋 实时日志（观察防抖/节流触发时机）
          </div>
          <div className="log-body">
            {logs.length === 0 && (
              <div className="log-empty">
                试试输入搜索、滚动列表、调整窗口大小...
              </div>
            )}
            {logs.map((log, i) => (
              <div
                key={i}
                className={`log-item ${
                  log.includes("[防抖]")
                    ? "log-debounce"
                    : log.includes("[节流]")
                    ? "log-throttle"
                    : "log-load"
                }`}
              >
                {log}
              </div>
            ))}
            <div ref={logsEndRef} />
          </div>
        </div>
      </div>

      {/* 底部场景表 */}
      <footer className="footer">
        <table className="scene-table">
          <thead>
            <tr>
              <th>功能场景</th>
              <th>触发事件</th>
              <th>策略</th>
              <th>延迟</th>
              <th>核心判断依据</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>搜索联想</td>
              <td>input</td>
              <td className="text-debounce">防抖</td>
              <td>500ms</td>
              <td>仅需最终输入结果</td>
            </tr>
            <tr>
              <td>滚动加载更多</td>
              <td>scroll</td>
              <td className="text-throttle">节流</td>
              <td>300ms</td>
              <td>过程中需持续响应</td>
            </tr>
            <tr>
              <td>窗口 resize 布局</td>
              <td>resize</td>
              <td className="text-debounce">防抖</td>
              <td>300ms</td>
              <td>仅需最终窗口尺寸</td>
            </tr>
          </tbody>
        </table>
      </footer>
    </div>
  );
}

function getCategoryEmoji(category: string): string {
  const map: Record<string, string> = {
    手机: "📱",
    平板: "📟",
    笔记本: "💻",
    耳机: "🎧",
    手表: "⌚",
    游戏机: "🎮",
  };
  return map[category] || "📦";
}
