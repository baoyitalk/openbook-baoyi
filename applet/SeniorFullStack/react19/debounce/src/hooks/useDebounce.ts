import { useRef, useEffect, useCallback } from "react";

/**
 * 手写防抖 Hook — 面试核心
 *
 * 原理：每次调用时清除上一次定时器，重新计时。
 *       只有在 delay 时间内没有再次调用，才会真正执行。
 *
 * 为什么用 useRef？
 * - timerRef：存储定时器 ID，避免每次渲染重新创建
 * - callbackRef：始终指向最新的回调函数，解决闭包陷阱
 *   （如果用 useCallback 包裹 fn，闭包会捕获旧的 state/props）
 *
 * @param fn 需要防抖的函数
 * @param delay 延迟时间（ms）
 * @returns [debouncedFn, cancel] — 防抖后的函数 + 手动取消方法
 */
export function useDebounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number
): [(...args: Parameters<T>) => void, () => void] {
  // 用 useRef 存储定时器，组件重渲染不会丢失
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // 用 useRef 存储最新回调，避免闭包陷阱
  const callbackRef = useRef(fn);

  // 每次渲染时同步最新的回调
  useEffect(() => {
    callbackRef.current = fn;
  }, [fn]);

  // 组件卸载时清理定时器，防止内存泄漏
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // 取消方法：面试加分项 — cancel 能力
  const cancel = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // 防抖核心逻辑
  const debouncedFn = useCallback(
    (...args: Parameters<T>) => {
      // 每次调用先清除上一次定时器
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      // 重新设置定时器
      timerRef.current = setTimeout(() => {
        callbackRef.current(...args);
        timerRef.current = null;
      }, delay);
    },
    [delay]
  );

  return [debouncedFn, cancel];
}
