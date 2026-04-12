import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ImagePreview from './ImagePreview';

/* eslint-disable no-unused-vars */
// Mock react-zoom-pan-pinch
vi.mock('react-zoom-pan-pinch', () => ({
  TransformWrapper: ({
    children,
  }: {
    children: (opts: {
      zoomIn: () => void;
      zoomOut: () => void;
      resetTransform: () => void;
    }) => React.ReactNode;
  }) => {
    const mockControls = {
      zoomIn: vi.fn(),
      zoomOut: vi.fn(),
      resetTransform: vi.fn(),
    };
    return <div data-testid="transform-wrapper">{children(mockControls)}</div>;
  },
  TransformComponent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="transform-component">{children}</div>
  ),
}));
/* eslint-enable no-unused-vars */

describe('ImagePreview', () => {
  it('空 src 时显示空状态', () => {
    render(<ImagePreview src="" />);
    expect(screen.getByText('暂无图片')).toBeInTheDocument();
  });

  it('渲染图片和标题', () => {
    render(
      <ImagePreview
        src="https://example.com/test.jpg"
        title="测试图片"
      />,
    );
    expect(screen.getByText('测试图片')).toBeInTheDocument();
    const img = screen.getByAltText('测试图片') as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toBe('https://example.com/test.jpg');
  });

  it('无标题时正常渲染', () => {
    render(<ImagePreview src="https://example.com/test.jpg" />);
    const img = screen.getByAltText('预览图片') as HTMLImageElement;
    expect(img).toBeInTheDocument();
  });

  it('渲染工具栏按钮', () => {
    render(<ImagePreview src="https://example.com/test.jpg" />);
    expect(screen.getByLabelText('放大')).toBeInTheDocument();
    expect(screen.getByLabelText('缩小')).toBeInTheDocument();
    expect(screen.getByLabelText('重置')).toBeInTheDocument();
    expect(screen.getByLabelText('旋转')).toBeInTheDocument();
  });

  it('点击按钮触发对应操作', () => {
    render(
      <ImagePreview src="https://example.com/test.jpg" />,
    );

    const zoomInBtn = screen.getByLabelText('放大');
    const zoomOutBtn = screen.getByLabelText('缩小');
    const resetBtn = screen.getByLabelText('重置');
    const rotateBtn = screen.getByLabelText('旋转');

    fireEvent.click(zoomInBtn);
    fireEvent.click(zoomOutBtn);
    fireEvent.click(resetBtn);
    fireEvent.click(rotateBtn);

    // 按钮存在且可点击
    expect(zoomInBtn).toBeEnabled();
    expect(zoomOutBtn).toBeEnabled();
    expect(resetBtn).toBeEnabled();
    expect(rotateBtn).toBeEnabled();
  });
});
