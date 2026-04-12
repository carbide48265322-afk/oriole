import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import ResizableDivider from './ResizableDivider';

describe('ResizableDivider', () => {
  it('正确渲染分隔条', () => {
    render(
      <ResizableDivider
        onResize={vi.fn()}
        minWidth={200}
        maxWidth={400}
        currentWidth={280}
      />,
    );
    const divider = document.querySelector('div[style*="col-resize"]');
    expect(divider).toBeInTheDocument();
  });

  it('鼠标按下时改变背景色', () => {
    render(
      <ResizableDivider
        onResize={vi.fn()}
        minWidth={200}
        maxWidth={400}
        currentWidth={280}
      />,
    );
    const divider = document.querySelector('div[style*="col-resize"]') as HTMLElement;
    expect(divider).toHaveStyle({ background: '#f0f0f0' });

    fireEvent.mouseDown(divider);
    expect(divider).toHaveStyle({ background: '#1677ff' });
  });

  it('拖拽时调用 onResize 回调', () => {
    const handleResize = vi.fn();
    render(
      <ResizableDivider
        onResize={handleResize}
        minWidth={200}
        maxWidth={400}
        currentWidth={280}
      />,
    );
    const divider = document.querySelector('div[style*="col-resize"]') as HTMLElement;

    fireEvent.mouseDown(divider, { clientX: 100 });
    fireEvent.mouseMove(document, { clientX: 120 });

    expect(handleResize).toHaveBeenCalledWith(20);
  });

  it('拖拽不超过最小宽度', () => {
    const handleResize = vi.fn();
    render(
      <ResizableDivider
        onResize={handleResize}
        minWidth={200}
        maxWidth={400}
        currentWidth={220}
      />,
    );
    const divider = document.querySelector('div[style*="col-resize"]') as HTMLElement;

    // 向左拖动 50px，应该被限制在 minWidth
    fireEvent.mouseDown(divider, { clientX: 100 });
    fireEvent.mouseMove(document, { clientX: 50 });

    // 新宽度 = 220 + (-50) = 170, 但最小是 200, 所以 delta = 200 - 220 = -20
    expect(handleResize).toHaveBeenCalledWith(-20);
  });

  it('拖拽不超过最大宽度', () => {
    const handleResize = vi.fn();
    render(
      <ResizableDivider
        onResize={handleResize}
        minWidth={200}
        maxWidth={400}
        currentWidth={380}
      />,
    );
    const divider = document.querySelector('div[style*="col-resize"]') as HTMLElement;

    // 向右拖动 50px，应该被限制在 maxWidth
    fireEvent.mouseDown(divider, { clientX: 100 });
    fireEvent.mouseMove(document, { clientX: 150 });

    // 新宽度 = 380 + 50 = 430, 但最大是 400, 所以 delta = 400 - 380 = 20
    expect(handleResize).toHaveBeenCalledWith(20);
  });

  it('鼠标抬起时停止拖拽', () => {
    const handleResize = vi.fn();
    render(
      <ResizableDivider
        onResize={handleResize}
        minWidth={200}
        maxWidth={400}
        currentWidth={280}
      />,
    );
    const divider = document.querySelector('div[style*="col-resize"]') as HTMLElement;

    fireEvent.mouseDown(divider, { clientX: 100 });
    fireEvent.mouseUp(document);
    fireEvent.mouseMove(document, { clientX: 200 });

    // 鼠标抬起后，再次移动不应该触发 onResize
    expect(handleResize).toHaveBeenCalledTimes(0);
  });
});
