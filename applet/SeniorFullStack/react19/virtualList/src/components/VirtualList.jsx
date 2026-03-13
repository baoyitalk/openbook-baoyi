import React, { Profiler, useCallback, useEffect, useRef, useState } from "react";
import { useVirtualList } from "../hooks/useVirtualList";
import { FpsBadge } from "./FpsBadge";

/**
 * 虚拟列表组件 — 只渲染可视区 + 缓冲区
 *
 * 面试考点体现：
 * ✅ 核心原理：useVirtualList hook 计算可视区
 * ✅ Hooks：useRef/useCallback/useEffect/useMemo 全覆盖
 * ✅ key 优化：用 item.id 作为 key
 * ✅ 缓冲区域：overscan=5 防白屏
 * ✅ 滚动节流：hook 内 rAF 节流
 * ✅ 动态高度：支持 getItemHeight prop
 * ✅ 滚动定位：scrollToIndex + "回到顶部" 按钮
 * ✅ 资源清理：scrollDebounceRef 在 unmount 时清理
 * ✅ React.memo：浅比较避免无意义重渲染
 */
const CONTAINER_HEIGHT = 500;

function VirtualList({ data, itemHeight, getItemHeight }) {
  const [mountTime, setMountTime] = useState("0");
  const [searchTime, setSearchTime] = useState("0");
  const [scrollTime, setScrollTime] = useState("0");

  // ====== 防循环：并发安全的 data 变化检测 ======
  const currentDataRef = useRef(data);
  currentDataRef.current = data;
  const lastRecordedDataRef = useRef(null);

  // ====== 滚动渲染：ref 暂存 + 防抖 ======
  const scrollTimeRef = useRef("0");
  const scrollDebounceRef = useRef(null);

  // 资源清理：unmount 时清除防抖定时器
  useEffect(() => {
    return () => {
      if (scrollDebounceRef.current) {
        clearTimeout(scrollDebounceRef.current);
      }
    };
  }, []);

  const {
    visibleItems,
    totalHeight,
    offsetY,
    onScroll: hookOnScroll,
    scrollToIndex,
    containerRef,
    startIndex,
    endIndex,
  } = useVirtualList({
    data,
    itemHeight,
    getItemHeight,
    containerHeight: CONTAINER_HEIGHT,
    overscan: 5,
  });

  const handleRender = useCallback((_id, phase, actualDuration) => {
    const val = actualDuration.toFixed(1);
    if (phase === "mount") {
      lastRecordedDataRef.current = currentDataRef.current;
      queueMicrotask(() => setMountTime(val));
    } else if (currentDataRef.current !== lastRecordedDataRef.current) {
      // data 变化 → 搜索渲染
      lastRecordedDataRef.current = currentDataRef.current;
      queueMicrotask(() => setSearchTime(val));
    } else {
      // data 没变但触发了 update → 滚动渲染
      // 用 ref 暂存，500ms 防抖后再 setState，避免高频循环
      scrollTimeRef.current = val;
      if (scrollDebounceRef.current) {
        clearTimeout(scrollDebounceRef.current);
      }
      scrollDebounceRef.current = setTimeout(() => {
        setScrollTime(scrollTimeRef.current);
        scrollDebounceRef.current = null;
      }, 500);
    }
  }, []);

  // 滚动定位演示：回到顶部
  const handleScrollToTop = useCallback(() => {
    scrollToIndex(0);
  }, [scrollToIndex]);

  return (
    <Profiler id="VirtualList" onRender={handleRender}>
      <div className="list-panel">
        <div className="panel-header virtual-header">
          <h2>⚡ 虚拟列表（仅渲染 {visibleItems.length} 条 DOM）</h2>
          <div className="panel-stats">
            <span>首次渲染: <strong>{mountTime}ms</strong></span>
            <span>搜索渲染: <strong>{searchTime}ms</strong></span>
            <span>滚动渲染: <strong>{scrollTime}ms</strong></span>
            <span>可视区: <strong>{startIndex}-{endIndex}</strong></span>
            <span>DOM 节点: <strong>{visibleItems.length}</strong></span>
            <FpsBadge />
          </div>
        </div>

        <div
          className="list-container"
          style={{ height: CONTAINER_HEIGHT, overflowY: "auto" }}
          ref={containerRef}
          onScroll={hookOnScroll}
        >
          <div style={{ height: totalHeight, position: "relative" }}>
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                transform: `translateY(${offsetY}px)`,
              }}
            >
              {visibleItems.map((item) => (
                <div
                  key={item.id}
                  className="contact-row"
                  style={{ height: item._height || itemHeight }}
                >
                  <span className="contact-avatar">{item.avatar}</span>
                  <span className="contact-name">{item.name}</span>
                  <span className="contact-phone">{item.phone}</span>
                  <span className="contact-dept">{item.department}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 滚动定位演示 */}
        <button
          className="scroll-to-top-btn"
          onClick={handleScrollToTop}
          aria-label="回到顶部"
        >
          ⬆ 回到顶部
        </button>
      </div>
    </Profiler>
  );
}

export default React.memo(VirtualList);
