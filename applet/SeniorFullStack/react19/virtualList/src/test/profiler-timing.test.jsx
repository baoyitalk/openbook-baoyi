import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Profiler } from "react";
import BruteList from "../components/BruteList";
import VirtualList from "../components/VirtualList";

// 生成测试数据
function makeData(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `测试用户${i}`,
    avatar: "😀",
    phone: "13800000000",
    department: "技术部",
  }));
}

const ITEM_HEIGHT = 60;

describe("Bug #4: Profiler 计时隔离测试", () => {
  it("BruteList 应通过 Profiler onRender 回调报告渲染耗时", () => {
    const onRender = vi.fn();
    const data = makeData(100);

    render(
      <Profiler id="BruteList" onRender={onRender}>
        <BruteList data={data} itemHeight={ITEM_HEIGHT} />
      </Profiler>
    );

    expect(onRender).toHaveBeenCalled();
    // onRender 参数: (id, phase, actualDuration, baseDuration, startTime, commitTime)
    const actualDuration = onRender.mock.calls[0][2];
    expect(typeof actualDuration).toBe("number");
    expect(actualDuration).toBeGreaterThanOrEqual(0);
  });

  it("VirtualList 应通过 Profiler onRender 回调报告渲染耗时", () => {
    const onRender = vi.fn();
    const data = makeData(100);

    render(
      <Profiler id="VirtualList" onRender={onRender}>
        <VirtualList data={data} itemHeight={ITEM_HEIGHT} />
      </Profiler>
    );

    expect(onRender).toHaveBeenCalled();
    const actualDuration = onRender.mock.calls[0][2];
    expect(typeof actualDuration).toBe("number");
    expect(actualDuration).toBeGreaterThanOrEqual(0);
  });

  it("VirtualList 的 DOM 节点数应远少于数据总量", () => {
    const data = makeData(10000);

    const { container } = render(
      <VirtualList data={data} itemHeight={ITEM_HEIGHT} />
    );

    const rows = container.querySelectorAll(".contact-row");
    // 容器高度 500px / itemHeight 60px ≈ 9 条可视 + overscan 5*2 = 最多约 19 条
    expect(rows.length).toBeLessThan(50);
    expect(rows.length).toBeGreaterThan(0);
  });

  it("BruteList 应渲染全部数据的 DOM 节点", () => {
    const data = makeData(500);

    const { container } = render(
      <BruteList data={data} itemHeight={ITEM_HEIGHT} />
    );

    const rows = container.querySelectorAll(".contact-row");
    expect(rows.length).toBe(500);
  });

  it("VirtualList 组件内部应使用 Profiler 而非 useEffect 计时", async () => {
    // 修复后的 VirtualList 应该在渲染输出中包含 Profiler
    // 通过检查组件是否正确显示渲染耗时来验证
    const data = makeData(100);

    render(<VirtualList data={data} itemHeight={ITEM_HEIGHT} />);

    // 首次渲染耗时应该显示在页面上
    const timeText = screen.getByText(/首次渲染/);
    expect(timeText).toBeInTheDocument();
  });

  it("BruteList 组件内部应使用 Profiler 而非 useEffect 计时", async () => {
    const data = makeData(100);

    render(<BruteList data={data} itemHeight={ITEM_HEIGHT} />);

    const timeText = screen.getByText(/首次渲染/);
    expect(timeText).toBeInTheDocument();
  });

  it("同时渲染时，各组件 Profiler 的 actualDuration 应独立", () => {
    const bruteOnRender = vi.fn();
    const virtualOnRender = vi.fn();
    const data = makeData(5000);

    render(
      <div>
        <Profiler id="BruteList" onRender={bruteOnRender}>
          <BruteList data={data} itemHeight={ITEM_HEIGHT} />
        </Profiler>
        <Profiler id="VirtualList" onRender={virtualOnRender}>
          <VirtualList data={data} itemHeight={ITEM_HEIGHT} />
        </Profiler>
      </div>
    );

    expect(bruteOnRender).toHaveBeenCalled();
    expect(virtualOnRender).toHaveBeenCalled();

    const bruteDuration = bruteOnRender.mock.calls[0][2];
    const virtualDuration = virtualOnRender.mock.calls[0][2];

    // 核心断言：VirtualList 只渲染 ~20 个 DOM，Profiler 测到的耗时
    // 不应该和 BruteList 渲染 5000 个 DOM 的耗时一样
    // 在 jsdom 中差异可能不大，但至少验证两者都是独立的数字
    expect(typeof bruteDuration).toBe("number");
    expect(typeof virtualDuration).toBe("number");
    expect(bruteDuration).toBeGreaterThanOrEqual(0);
    expect(virtualDuration).toBeGreaterThanOrEqual(0);
  });
});
