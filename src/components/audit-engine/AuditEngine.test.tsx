import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AuditEngine from './AuditEngine';
import AuditPreview from './AuditPreview';
import AuditWorkspace from './AuditWorkspace';
import BaseActionBar from './BaseActionBar';
import type { AuditItem } from './AuditEngine.types';

const mockItems: AuditItem[] = [
  {
    id: '1',
    type: 'image',
    title: '测试图片1',
    status: 'pending',
    content: 'https://example.com/image1.jpg',
    createdAt: '2024-01-01 10:00:00',
  },
  {
    id: '2',
    type: 'text',
    title: '测试文本',
    status: 'pending',
    content: '这是一段测试文本',
    createdAt: '2024-01-01 11:00:00',
  },
];

const mockHandlers = {
  onSelect: vi.fn(),
  onApprove: vi.fn(),
  onReject: vi.fn(),
  onSearch: vi.fn(),
};

describe('AuditEngine', () => {
  it('应该渲染三栏布局', () => {
    render(
      <AuditEngine
        items={mockItems}
        selectedItem={null}
        onSelect={mockHandlers.onSelect}
        onApprove={mockHandlers.onApprove}
        onReject={mockHandlers.onReject}
      />,
    );

    // 验证组件渲染成功
    expect(screen.getByText('测试图片1')).toBeInTheDocument();
    expect(screen.getByText('测试文本')).toBeInTheDocument();
  });

  it('应该在未选择时显示空状态', () => {
    render(
      <AuditEngine
        items={mockItems}
        selectedItem={null}
        onSelect={mockHandlers.onSelect}
        onApprove={mockHandlers.onApprove}
        onReject={mockHandlers.onReject}
      />,
    );

    // 预览区和工作区都应该显示空状态
    expect(screen.getAllByText('请选择审核项')).toHaveLength(2);
  });

  it('应该在左侧列表选择时调用 onSelect', () => {
    render(
      <AuditEngine
        items={mockItems}
        selectedItem={null}
        onSelect={mockHandlers.onSelect}
        onApprove={mockHandlers.onApprove}
        onReject={mockHandlers.onReject}
      />,
    );

    fireEvent.click(screen.getByText('测试图片1'));
    expect(mockHandlers.onSelect).toHaveBeenCalledWith(mockItems[0]);
  });

  it('应该支持搜索功能', () => {
    render(
      <AuditEngine
        items={mockItems}
        selectedItem={null}
        onSelect={mockHandlers.onSelect}
        onApprove={mockHandlers.onApprove}
        onReject={mockHandlers.onReject}
        onSearch={mockHandlers.onSearch}
      />,
    );

    const searchInput = screen.getByPlaceholderText('搜索审核项');
    fireEvent.change(searchInput, { target: { value: '图片' } });
    expect(mockHandlers.onSearch).toHaveBeenCalledWith('图片');
  });

  it('应该传递 previewComponent 到 AuditPreview', () => {
    const customPreview = <div data-testid="custom-preview">自定义预览</div>;

    render(
      <AuditEngine
        items={mockItems}
        selectedItem={mockItems[0]}
        previewComponent={customPreview}
        onSelect={mockHandlers.onSelect}
        onApprove={mockHandlers.onApprove}
        onReject={mockHandlers.onReject}
      />,
    );

    expect(screen.getByTestId('custom-preview')).toBeInTheDocument();
    expect(screen.getByText('自定义预览')).toBeInTheDocument();
  });

  it('应该在点击通过按钮时调用 onApprove', () => {
    render(
      <AuditEngine
        items={mockItems}
        selectedItem={mockItems[0]}
        onSelect={mockHandlers.onSelect}
        onApprove={mockHandlers.onApprove}
        onReject={mockHandlers.onReject}
      />,
    );

    const approveButton = screen.getByRole('button', { name: /通\s*过/ });
    fireEvent.click(approveButton);
    expect(mockHandlers.onApprove).toHaveBeenCalledWith('1');
  });

  it('应该在点击拒绝按钮时调用 onReject', () => {
    render(
      <AuditEngine
        items={mockItems}
        selectedItem={mockItems[0]}
        onSelect={mockHandlers.onSelect}
        onApprove={mockHandlers.onApprove}
        onReject={mockHandlers.onReject}
      />,
    );

    const rejectButton = screen.getByRole('button', { name: /拒\s*绝/ });
    fireEvent.click(rejectButton);
    expect(mockHandlers.onReject).toHaveBeenCalledWith('1', '');
  });
});

describe('AuditPreview', () => {
  it('应该在未选择项时显示空状态', () => {
    render(<AuditPreview item={null} />);
    expect(screen.getByText('请选择审核项')).toBeInTheDocument();
  });

  it('应该显示类型特定的占位提示', () => {
    const imageItem: AuditItem = {
      id: '1',
      type: 'image',
      title: '测试',
      status: 'pending',
      content: 'url',
      createdAt: '2024-01-01',
    };

    render(<AuditPreview item={imageItem} />);
    expect(screen.getByText('图片预览组件待接入')).toBeInTheDocument();
  });

  it('应该渲染 children 而不是占位提示', () => {
    render(
      <AuditPreview item={mockItems[0]}>
        <div data-testid="child-content">子内容</div>
      </AuditPreview>,
    );

    expect(screen.getByTestId('child-content')).toBeInTheDocument();
    expect(screen.queryByText('图片预览组件待接入')).not.toBeInTheDocument();
  });

  it('应该包含 BaseActionBar', () => {
    render(<AuditPreview item={mockItems[0]} />);
    expect(screen.getByText('放大')).toBeInTheDocument();
    expect(screen.getByText('缩小')).toBeInTheDocument();
    expect(screen.getByText('旋转')).toBeInTheDocument();
  });
});

describe('AuditWorkspace', () => {
  it('应该在未选择项时显示空状态', () => {
    render(
      <AuditWorkspace
        item={null}
        onApprove={mockHandlers.onApprove}
        onReject={mockHandlers.onReject}
      />,
    );
    expect(screen.getByText('请选择审核项')).toBeInTheDocument();
  });

  it('应该显示审核信息', () => {
    render(
      <AuditWorkspace
        item={mockItems[0]}
        onApprove={mockHandlers.onApprove}
        onReject={mockHandlers.onReject}
      />,
    );

    expect(screen.getByText('审核信息')).toBeInTheDocument();
    expect(screen.getByText('标题：')).toBeInTheDocument();
    expect(screen.getByText('测试图片1')).toBeInTheDocument();
    expect(screen.getByText('待审核')).toBeInTheDocument();
  });

  it('应该在点击通过时调用 onApprove', () => {
    render(
      <AuditWorkspace
        item={mockItems[0]}
        onApprove={mockHandlers.onApprove}
        onReject={mockHandlers.onReject}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /通\s*过/ }));
    expect(mockHandlers.onApprove).toHaveBeenCalledWith('1');
  });

  it('应该在点击拒绝时调用 onReject 并包含备注', () => {
    render(
      <AuditWorkspace
        item={mockItems[0]}
        onApprove={mockHandlers.onApprove}
        onReject={mockHandlers.onReject}
      />,
    );

    const textArea = screen.getByPlaceholderText('请输入审核备注（选填）');
    fireEvent.change(textArea, { target: { value: '内容违规' } });

    fireEvent.click(screen.getByRole('button', { name: /拒\s*绝/ }));
    expect(mockHandlers.onReject).toHaveBeenCalledWith('1', '内容违规');
  });
});

describe('BaseActionBar', () => {
  it('应该在未传入 item 时返回 null', () => {
    const { container } = render(<BaseActionBar item={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('应该渲染操作按钮', () => {
    render(<BaseActionBar item={mockItems[0]} />);
    expect(screen.getByText('放大')).toBeInTheDocument();
    expect(screen.getByText('缩小')).toBeInTheDocument();
    expect(screen.getByText('旋转')).toBeInTheDocument();
  });

  it('应该在未传入回调时禁用按钮', () => {
    render(<BaseActionBar item={mockItems[0]} />);

    const buttons = screen.getAllByRole('button');
    buttons.forEach((button) => {
      expect(button).toBeDisabled();
    });
  });

  it('应该在传入回调时启用按钮', () => {
    render(
      <BaseActionBar
        item={mockItems[0]}
        onZoomIn={vi.fn()}
        onZoomOut={vi.fn()}
        onRotate={vi.fn()}
      />,
    );

    const buttons = screen.getAllByRole('button');
    buttons.forEach((button) => {
      expect(button).not.toBeDisabled();
    });
  });

  it('应该调用对应的回调函数', () => {
    const onZoomIn = vi.fn();
    const onZoomOut = vi.fn();
    const onRotate = vi.fn();

    render(
      <BaseActionBar
        item={mockItems[0]}
        onZoomIn={onZoomIn}
        onZoomOut={onZoomOut}
        onRotate={onRotate}
      />,
    );

    fireEvent.click(screen.getByText('放大'));
    expect(onZoomIn).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText('缩小'));
    expect(onZoomOut).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText('旋转'));
    expect(onRotate).toHaveBeenCalledTimes(1);
  });
});
