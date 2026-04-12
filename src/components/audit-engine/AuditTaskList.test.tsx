import { describe, it, expect, vi } from 'vitest';
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

  it('正确渲染所有审核项', () => {
    render(
      <AuditTaskList
        items={mockItems}
        onSelect={vi.fn()}
      />,
    );
    expect(screen.getByText('测试图片 1')).toBeInTheDocument();
    expect(screen.getByText('测试视频 2')).toBeInTheDocument();
    expect(screen.getByText('测试文本 3')).toBeInTheDocument();
  });

  it('显示正确的状态标签', () => {
    render(
      <AuditTaskList
        items={mockItems}
        onSelect={vi.fn()}
      />,
    );
    expect(screen.getByText('待审核')).toBeInTheDocument();
    expect(screen.getByText('已通过')).toBeInTheDocument();
    expect(screen.getByText('已拒绝')).toBeInTheDocument();
  });

  it('显示正确的类型标签', () => {
    render(
      <AuditTaskList
        items={mockItems}
        onSelect={vi.fn()}
      />,
    );
    expect(screen.getByText('图片')).toBeInTheDocument();
    expect(screen.getByText('视频')).toBeInTheDocument();
    expect(screen.getByText('文本')).toBeInTheDocument();
  });

  it('点击列表项触发 onSelect', () => {
    const handleSelect = vi.fn();
    render(
      <AuditTaskList
        items={mockItems}
        onSelect={handleSelect}
      />,
    );
    fireEvent.click(screen.getByText('测试图片 1'));
    expect(handleSelect).toHaveBeenCalledTimes(1);
    expect(handleSelect).toHaveBeenCalledWith(mockItems[0]);
  });

  it('选中项高亮显示', () => {
    render(
      <AuditTaskList
        items={mockItems}
        selectedItem={mockItems[1]}
        onSelect={vi.fn()}
      />,
    );
    const selectedItem = screen.getByText('测试视频 2').closest('.ant-list-item');
    expect(selectedItem).toHaveStyle({ background: '#e6f4ff' });
  });

  it('搜索过滤列表项', () => {
    render(
      <AuditTaskList
        items={mockItems}
        onSelect={vi.fn()}
      />,
    );
    const searchInput = screen.getByPlaceholderText('搜索审核项');
    fireEvent.change(searchInput, { target: { value: '视频' } });
    expect(screen.getByText('测试视频 2')).toBeInTheDocument();
    expect(screen.queryByText('测试图片 1')).not.toBeInTheDocument();
    expect(screen.queryByText('测试文本 3')).not.toBeInTheDocument();
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
});
