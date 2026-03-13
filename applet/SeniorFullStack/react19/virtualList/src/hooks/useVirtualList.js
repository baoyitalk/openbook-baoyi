import { useState, useCallback, useRef, useMemo, useEffect } from "react";

/**
 * 手写虚拟列表 Hook — 面试核心考点全覆盖
 *
 * ✅ 核心原理：只渲染可视区 + 缓冲区
 * ✅ 可视区计算：startIndex / endIndex / offsetY
 * ✅ 缓冲区域（overscan）：防止快速滚动白屏
 * ✅ 滚动节流：rAF 节流，每帧最多更新一次
 * ✅ 动态高度：支持 getItemHeight(index) 函数，用前缀和 + 二分查找
 * ✅ 滚动定位：scrollToIndex(index) API
 * ✅ 资源清理：rAF 在 unmount 时取消
 *
 * @param {Object} options
 * @param {Array}  options.data             - 完整数据数组
 * @param {number} [options.itemHeight=60]  - 固定高度（当 getItemHeight 未提供时使用）
 * @param {Function} [options.getItemHeight] - 动态高度函数 (index) => height
 * @param {number} options.containerHeight  - 容器可视高度（px）
 * @param {number} [options.overscan=5]     - 上下缓冲条数
 */
export function useVirtualList({
  data,
  itemHeight = 60,
  getItemHeight,
  containerHeight,
  overscan = 5,
}) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef(null);

  // ====== rAF 节流 ======
  const rafIdRef = useRef(null);
  const pendingScrollTopRef = useRef(0);

  // 资源清理：unmount 时取消 rAF
  useEffect(() => {
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  // ====== 动态高度：前缀和数组 ======
  // prefixHeights[i] = 前 i 项的累计高度，prefixHeights[0] = 0
  const prefixHeights = useMemo(() => {
    if (!getItemHeight) return null;
    const arr = new Array(data.length + 1);
    arr[0] = 0;
    for (let i = 0; i < data.length; i++) {
      arr[i + 1] = arr[i] + getItemHeight(i);
    }
    return arr;
  }, [data, getItemHeight]);

  // ====== 二分查找：根据 scrollTop 找 startIndex ======
  const findStartIndex = useCallback(
    (st) => {
      if (!prefixHeights) {
        // 固定高度：直接除法
        return Math.floor(st / itemHeight);
      }
      // 动态高度：二分查找 prefixHeights 中第一个 >= scrollTop 的位置
      let lo = 0;
      let hi = data.length - 1;
      while (lo <= hi) {
        const mid = (lo + hi) >>> 1;
        if (prefixHeights[mid + 1] <= st) {
          lo = mid + 1;
        } else {
          hi = mid - 1;
        }
      }
      return lo;
    },
    [prefixHeights, itemHeight, data.length]
  );

  // ====== 核心计算 ======
  const totalHeight = prefixHeights
    ? prefixHeights[data.length]
    : data.length * itemHeight;

  const rawStart = findStartIndex(scrollTop);
  const startIndex = Math.max(0, rawStart - overscan);

  // 找 endIndex：从 rawStart 往下累加直到超出可视区
  let endIndex;
  if (!prefixHeights) {
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    endIndex = Math.min(data.length, rawStart + visibleCount + overscan);
  } else {
    let accumulated = 0;
    let idx = rawStart;
    while (idx < data.length && accumulated < containerHeight) {
      accumulated += getItemHeight(idx);
      idx++;
    }
    endIndex = Math.min(data.length, idx + overscan);
  }

  // 切出可视区数据
  const visibleItems = data.slice(startIndex, endIndex).map((item, i) => {
    const actualIndex = startIndex + i;
    return {
      ...item,
      _index: actualIndex,
      _offsetY: prefixHeights
        ? prefixHeights[actualIndex]
        : actualIndex * itemHeight,
      _height: prefixHeights
        ? getItemHeight(actualIndex)
        : itemHeight,
    };
  });

  const offsetY = prefixHeights
    ? prefixHeights[startIndex]
    : startIndex * itemHeight;

  // ====== 滚动处理（rAF 节流）======
  const onScroll = useCallback((e) => {
    pendingScrollTopRef.current = e.currentTarget.scrollTop;
    // 如果已有 rAF 排队，跳过，等下一帧统一处理
    if (rafIdRef.current) return;
    rafIdRef.current = requestAnimationFrame(() => {
      setScrollTop(pendingScrollTopRef.current);
      rafIdRef.current = null;
    });
  }, []);

  // ====== 滚动定位 API ======
  const scrollToIndex = useCallback(
    (index) => {
      const el = containerRef.current;
      if (!el) return;
      const clampedIndex = Math.max(0, Math.min(index, data.length - 1));
      const targetTop = prefixHeights
        ? prefixHeights[clampedIndex]
        : clampedIndex * itemHeight;
      el.scrollTop = targetTop;
      setScrollTop(targetTop);
    },
    [data.length, prefixHeights, itemHeight]
  );

  return {
    visibleItems,
    totalHeight,
    offsetY,
    onScroll,
    scrollToIndex,
    containerRef,
    startIndex,
    endIndex,
  };
}
