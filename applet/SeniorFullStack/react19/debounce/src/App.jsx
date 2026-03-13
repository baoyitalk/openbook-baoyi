import { useState, useEffect, useRef } from "react";
import { useDebounce } from "./hooks/useDebounce";
import { useThrottle } from "./hooks/useThrottle";
import { fetchSuggestions, fetchProducts } from "./mock";
import "./App.css";

/** 根据窗口宽度计算商品列表列数 */
function calcColumns(width) {
  if (width >= 1200) return 4;
  if (width >= 800) return 3;
  if (width >= 500) return 2;
  return 1;
}

export default function App() {
  // ==================== 搜索联想（防抖 500ms） ====================
  const [keyword, setKeyword] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [debouncedSearch] = useDebounce(async (...args) => {
    const value = args[0];
    console.log("[防抖] 搜索联想请求:", value || "(空)");
    const results = await fetchSuggestions(value);
    setSuggestions(results);
    setShowSuggestions(results.length > 0);
  }, 500);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setKeyword(value);
    if (!value.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    debouncedSearch(value);
  };

  const handleSelectSuggestion = (text) => {
    setKeyword(text);
    setShowSuggestions(false);
  };

  // ==================== 商品列表 + 滚动加载（节流 300ms） ====================
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const listRef = useRef(null);

  // 用 ref 存最新状态，避免节流回调中的闭包陷阱
  const pageRef = useRef(page);
  const hasMoreRef = useRef(hasMore);
  const loadingRef = useRef(loading);
  pageRef.current = page;
  hasMoreRef.current = hasMore;
  loadingRef.current = loading;

  const loadProducts = async (p) => {
    if (loadingRef.current) return;
    setLoading(true);
    loadingRef.current = true;
    console.log("[加载] 请求第", p, "页商品");
    const { data, hasMore: more } = await fetchProducts(p);
    setProducts((prev) => {
      if (p === 1) return data;
      // 追加时按 id 去重，防止 StrictMode 双调用导致重复
      const existingIds = new Set(prev.map((item) => item.id));
      const newItems = data.filter((item) => !existingIds.has(item.id));
      return [...prev, ...newItems];
    });
    setHasMore(more);
    setPage(p);
    setLoading(false);
    loadingRef.current = false;
  };

  useEffect(() => {
    loadProducts(1);
  }, []);

  // ---- 节流 vs 无节流 对比模式 ----
  const [throttleEnabled, setThrottleEnabled] = useState(true);
  const scrollRawCountRef = useRef(0);
  const scrollThrottleCountRef = useRef(0);
  // 曝光埋点：记录已曝光的商品 id，避免重复上报
  const exposedIdsRef = useRef(new Set());
  // 统计条数据
  const [statsRaw, setStatsRaw] = useState(0);
  const [statsExec, setStatsExec] = useState(0);

  // 触底检测 + 商品曝光埋点（节流和非节流共用）
  const checkScrollBottom = () => {
    scrollThrottleCountRef.current++;
    setStatsExec(scrollThrottleCountRef.current);
    const el = listRef.current;
    if (!el) return;
    const tag = throttleEnabled ? "[节流]" : "[无节流]";

    // ====== 商品曝光检测（模拟真实业务埋点）======
    // 遍历所有商品卡片，用 getBoundingClientRect 判断是否在可视区
    const containerRect = el.getBoundingClientRect();
    const cards = el.querySelectorAll(".product-card");
    const newlyExposed = [];
    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const productId = Number(card.getAttribute("data-product-id"));
      // 卡片顶部在容器底部之上 && 卡片底部在容器顶部之下 → 可见
      if (
        rect.top < containerRect.bottom &&
        rect.bottom > containerRect.top &&
        productId &&
        !exposedIdsRef.current.has(productId)
      ) {
        exposedIdsRef.current.add(productId);
        newlyExposed.push(card.textContent?.split("\n")[0] || `#${productId}`);
      }
    });
    if (newlyExposed.length > 0) {
      console.log(
        `${tag} 曝光埋点: 新增 ${newlyExposed.length} 件商品 (累计 ${exposedIdsRef.current.size} 件)`
      );
    }

    // ====== 触底检测 ======
    const { scrollTop, scrollHeight, clientHeight } = el;
    const nearBottom = scrollHeight - scrollTop - clientHeight < 100;
    console.log(
      `${tag} 滚动检测 第${scrollThrottleCountRef.current}次 | 曝光${exposedIdsRef.current.size}件 (原始已触发${scrollRawCountRef.current}次)`
    );
    if (nearBottom && hasMoreRef.current && !loadingRef.current) {
      console.log(`${tag} 触底！加载第 ${pageRef.current + 1} 页`);
      loadProducts(pageRef.current + 1);
    }
  };

  const [throttledScroll] = useThrottle(checkScrollBottom, 300);

  const handleScroll = () => {
    scrollRawCountRef.current++;
    setStatsRaw(scrollRawCountRef.current);
    if (throttleEnabled) {
      throttledScroll();
    } else {
      // 不节流：每次 scroll 事件都执行检测
      checkScrollBottom();
    }
  };

  // 切换模式时重置计数
  const toggleThrottle = () => {
    scrollRawCountRef.current = 0;
    scrollThrottleCountRef.current = 0;
    exposedIdsRef.current.clear();
    setStatsRaw(0);
    setStatsExec(0);
    setThrottleEnabled((prev) => !prev);
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
  const [logs, setLogs] = useState([]);
  const logsEndRef = useRef(null);

  useEffect(() => {
    const originalLog = console.log;
    console.log = (...args) => {
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

          {/* 场景标签 + 节流开关 */}
          <div className="scene-tags">
            <span className="tag tag-debounce">🎯 搜索联想 — 防抖</span>
            <span className="tag tag-throttle">⚡ 滚动加载 — 节流</span>
            <span className="tag tag-debounce">📐 resize 布局 — 防抖</span>
            <button
              className={`toggle-btn ${throttleEnabled ? "toggle-on" : "toggle-off"}`}
              onClick={toggleThrottle}
            >
              {throttleEnabled ? "✅ 节流已开启" : "❌ 节流已关闭"}（点击切换对比）
            </button>
          </div>

          {/* 商品列表：外层固定高度滚动容器，内层 grid 自然撑开 */}
          <div
            className="product-scroll"
            ref={listRef}
            onScroll={handleScroll}
          >
            <div
              className="product-grid"
              style={{
                gridTemplateColumns: `repeat(${columns}, 1fr)`,
              }}
            >
              {products.map((p) => (
                <div key={p.id} className="product-card" data-product-id={p.id}>
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
          {/* 统计条：节流效果一目了然 */}
          {statsRaw > 0 && (
            <div className="stats-bar">
              原始触发: <strong>{statsRaw}</strong> 次 | 实际执行: <strong>{statsExec}</strong> 次 | 节省: <strong>{statsRaw > 0 ? Math.round((1 - statsExec / statsRaw) * 100) : 0}%</strong>
            </div>
          )}
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
                    : log.includes("曝光埋点")
                    ? "log-exposure"
                    : log.includes("[节流]") || log.includes("[无节流]")
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

function getCategoryEmoji(category) {
  const map = {
    手机: "📱",
    平板: "📟",
    笔记本: "💻",
    耳机: "🎧",
    手表: "⌚",
    游戏机: "🎮",
  };
  return map[category] || "📦";
}
