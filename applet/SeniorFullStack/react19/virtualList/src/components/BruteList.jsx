import React, { Profiler, useCallback, useEffect, useRef, useState } from "react";
import { FpsBadge } from "./FpsBadge";

/**
 * 暴力渲染列表 — 直接 .map() 渲染全部 10000 条 DOM
 *
 * 计时：React.Profiler onRender 的 actualDuration
 * 防循环：用 lastRecordedDataRef 对比 currentDataRef，只在 data 真正变化时记录更新耗时
 * FPS：各组件独立计算，不污染父组件
 */
function BruteList({ data, itemHeight }) {
  const containerRef = useRef(null);
  const [mountTime, setMountTime] = useState("0");
  const [searchTime, setSearchTime] = useState("0");
  const [domCount, setDomCount] = useState(0);

  // ====== 防循环：并发安全的 data 变化检测 ======
  // currentDataRef 始终指向当前 data（幂等赋值，并发安全）
  // lastRecordedDataRef 记录上次 onRender 记录时的 data 引用
  // onRender 中比较两者，不同则记录，相同则跳过（自身 setState 引起的重渲染）
  const currentDataRef = useRef(data);
  currentDataRef.current = data;
  const lastRecordedDataRef = useRef(null);

  // DOM 节点计数
  useEffect(() => {
    if (containerRef.current) {
      setDomCount(containerRef.current.querySelectorAll(".contact-row").length);
    }
  }, [data]);

  const handleRender = useCallback((_id, phase, actualDuration) => {
    const val = actualDuration.toFixed(1);
    if (phase === "mount") {
      lastRecordedDataRef.current = currentDataRef.current;
      queueMicrotask(() => setMountTime(val));
    } else if (currentDataRef.current !== lastRecordedDataRef.current) {
      // data 真正变化了 → 搜索渲染
      lastRecordedDataRef.current = currentDataRef.current;
      queueMicrotask(() => setSearchTime(val));
    }
    // 否则是自身 setState 引起的重渲染，跳过
  }, []);

  return (
    <Profiler id="BruteList" onRender={handleRender}>
      <div className="list-panel">
        <div className="panel-header brute-header">
          <h2>💥 暴力渲染（{data.length} 条 DOM）</h2>
          <div className="panel-stats">
            <span>首次渲染: <strong>{mountTime}ms</strong></span>
            <span>搜索渲染: <strong>{searchTime}ms</strong></span>
            <span>滚动渲染: <strong>N/A</strong></span>
            <span>DOM 节点: <strong>{domCount}</strong></span>
            <FpsBadge />
          </div>
        </div>
        <div
          className="list-container"
          ref={containerRef}
          style={{ height: 500, overflowY: "auto" }}
        >
          {data.map((item) => (
            <div
              key={item.id}
              className="contact-row"
              style={{ height: itemHeight }}
            >
              <span className="contact-avatar">{item.avatar}</span>
              <span className="contact-name">{item.name}</span>
              <span className="contact-phone">{item.phone}</span>
              <span className="contact-dept">{item.department}</span>
            </div>
          ))}
        </div>
      </div>
    </Profiler>
  );
}

export default React.memo(BruteList);
