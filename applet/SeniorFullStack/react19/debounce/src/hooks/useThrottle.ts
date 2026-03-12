import { useRef, useEffect, useCallback } from "react";

/**
 * 手写节流 Hook — 面试核心
 *
 * 原理（时间戳版）：记录上次执行时间，只有距离上次执行超过 delay 才允许再次执行。
 * 特点：第一次触发立即执行（leading），最后一次可能被丢弃。
 *
 * 面试加分：时间戳版 vs 定时器版
 * - 时间戳版：立即执行第一次，最后一次可能不执行
 * - 定时器版：第一次延迟执行，最后一次一定执行
 * - 本实现采用「时间戳 + 尾调用」结合版，兼顾两者优点
 *
 * @param fn 需要节流的函数
 * @param delay 间隔时间（ms）
 * @returns [throttledFn, cancel]
 */
export function useThrottle<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number
): [(...args: Parameters<T>) => void, () => void] {
  const callbackRef = useRef(fn);
  // 上次执行的时间戳
  const lastRunRef = useRef(0);
  // 尾调用定时器（保证最后一次触发也能执行）
  const trailingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    callbackRef.current = fn;
  }, [fn]);

  useEffect(() => {
    return () => {
      if (trailingTimerRef.current) {
        clearTimeout(trailingTimerRef.current);
      }
    };
  }, []);

  const cancel = useCallback(() => {
    lastRunRef.current = 0;
    if (trailingTimerRef.current) {
      clearTimeout(trailingTimerRef.current);
      trailingTimerRef.current = null;
    }
  }, []);

  const throttledFn = useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      const elapsed = now - lastRunRef.current;

      // 清除之前的尾调用定时器
      if (trailingTimerRef.current) {
        clearTimeout(trailingTimerRef.current);
        trailingTimerRef.current = null;
      }

      if (elapsed >= delay) {
        // 时间戳版核心：距离上次执行已超过 delay，立即执行
        lastRunRef.current = now;
        callbackRef.current(...args);
      } else {
        // 尾调用：保证最后一次触发在 delay 后执行
        trailingTimerRef.current = setTimeout(() => {
          lastRunRef.current = Date.now();
          callbackRef.current(...args);
          trailingTimerRef.current = null;
        }, delay - elapsed);
      }
    },
    [delay]
  );

  return [throttledFn, cancel];
}
