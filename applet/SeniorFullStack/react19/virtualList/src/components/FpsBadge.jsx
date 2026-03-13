import { useState, useEffect, useRef } from "react";

/**
 * FPS 徽章组件 — 独立渲染，不影响父组件
 * 用独立组件而非 hook，避免 setFps 触发父组件（如 BruteList 10000 DOM）重渲染
 */
export function FpsBadge() {
  const [fps, setFps] = useState(0);
  const frameRef = useRef({ count: 0, lastTime: performance.now() });

  useEffect(() => {
    let rafId;
    const tick = () => {
      frameRef.current.count++;
      const now = performance.now();
      const delta = now - frameRef.current.lastTime;
      if (delta >= 1000) {
        setFps(Math.round((frameRef.current.count * 1000) / delta));
        frameRef.current.count = 0;
        frameRef.current.lastTime = now;
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return <span>FPS: <strong>{fps}</strong></span>;
}
