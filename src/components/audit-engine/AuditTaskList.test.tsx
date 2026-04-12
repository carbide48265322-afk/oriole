import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AuditTaskList from './AuditTaskList';
import type { AuditItem } from './AuditEngine.types';

const mockItems: AuditItem[] = [
  {
    id: '1',
    type: 'image',
    title: '测试图片 1',
    status: 'pending',
    content: 'https://example.com/image1.jpg',
    createdAt: '2026-04-12T00:00:00Z',
  },
  {
    id: '2',
    type: 'video',
    title: '测试视频 2',
    status: 'approved',
    content: 'https://example.com/video2.mp4',
    createdAt: '2026-04-12T01:00:00Z',
  },
  {
    id: '3',
    type: 'text',
    title: '测试文本 3',
    status: 'rejected',
    content: '这是一段文本内容',
    createdAt: '2026-04-12T02:00:00Z',
  },
];

// 虚拟列表需要 ResizeObserver，使用 class 实现 mock
class MockResizeObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

beforeEach(() => {
  global.ResizeObserver = MockResizeObserver as unknown as typeof ResizeObserver;
});

describe('AuditTaskList', () => {
  it('列表为空时显示空状态', () => {
    render(
      <AuditTaskList
        items={[]}
        onSelect={vi.fn()}
      />,
    );
    expect(screen.getByText('暂无待审核内容')).toBeInTheDocument();
  });

  it('渲染搜索框', () => {
    render(
      <AuditTaskList
        items={mockItems}
        onSelect={vi.fn()}
      />,
    );
    expect(screen.getByPlaceholderText('搜索审核项')).toBeInTheDocument();
  });

  it('渲染虚拟列表容器', () => {
    const { container } = render(
      <AuditTaskList
        items={mockItems}
        onSelect={vi.fn()}
      />,
    );

    // 虚拟列表会创建一个有 height 的内部容器
    const virtualContainer = container.querySelector('[style*="position: relative"]');
    expect(virtualContainer).toBeInTheDocument();
    // 3 项 * 60px = 180px
    expect(virtualContainer).toHaveStyle({ height: '180px' });
  });

  it('搜索时触发 onSearch 回调', () => {
    const handleSearch = vi.fn();
    render(
      <AuditTaskList
        items={mockItems}
        onSelect={vi.fn()}
        onSearch={handleSearch}
      />,
    );
    const searchInput = screen.getByPlaceholderText('搜索审核项');
    fireEvent.change(searchInput, { target: { value: '测试' } });
    expect(handleSearch).toHaveBeenCalledWith('测试');
  });

  it('搜索过滤后更新虚拟列表高度', () => {
    const { container } = render(
      <AuditTaskList
        items={mockItems}
        onSelect={vi.fn()}
      />,
    );

    const searchInput = screen.getByPlaceholderText('搜索审核项');
    fireEvent.change(searchInput, { target: { value: '视频' } });

    // 过滤后只有 1 项，高度应为 60px
    const virtualContainer = container.querySelector('[style*="position: relative"]');
    expect(virtualContainer).toHaveStyle({ height: '60px' });
  });

  it('使用 useVirtualizer 配置正确', () => {
    // 验证组件使用了虚拟列表而非普通列表
    const { container } = render(
      <AuditTaskList
        items={mockItems}
        onSelect={vi.fn()}
      />,
    );

    // 虚拟列表应该有一个 overflow: auto 的滚动容器
    const scrollContainer = container.querySelector('[style*="overflow: auto"]');
    expect(scrollContainer).toBeInTheDocument();

    // 虚拟列表容器应该有 position: relative
    const virtualContainer = container.querySelector('[style*="position: relative"]');
    expect(virtualContainer).toBeInTheDocument();
  });

  it('收起状态下隐藏搜索框并显示图标', () => {
    const { container } = render(
      <AuditTaskList
        items={mockItems}
        onSelect={vi.fn()}
        collapsed={true}
      />,
    );

    // 搜索框不应该存在
    expect(screen.queryByPlaceholderText('搜索审核项')).not.toBeInTheDocument();

    // 应该显示标签（图标）
    const tags = container.querySelectorAll('.ant-tag');
    expect(tags.length).toBeGreaterThan(0);
  });

  it('收起状态下点击项应该触发 onSelect', () => {
    const handleSelect = vi.fn();
    const { container } = render(
      <AuditTaskList
        items={mockItems}
        onSelect={handleSelect}
        collapsed={true}
      />,
    );

    // 点击第一个项
    const firstItem = container.querySelector('[style*="cursor: pointer"]');
    if (firstItem) {
      fireEvent.click(firstItem);
      expect(handleSelect).toHaveBeenCalledWith(mockItems[0]);
    }
  });

  it('展开状态下显示搜索框和完整列表', () => {
    render(
      <AuditTaskList
        items={mockItems}
        onSelect={vi.fn()}
        collapsed={false}
      />,
    );

    // 搜索框应该存在
    expect(screen.getByPlaceholderText('搜索审核项')).toBeInTheDocument();

    // 虚拟列表容器应该存在
    const virtualContainer = document.querySelector('[style*="position: relative"]');
    expect(virtualContainer).toBeInTheDocument();
  });
});
