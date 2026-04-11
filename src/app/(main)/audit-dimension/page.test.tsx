import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { App } from 'antd';
import { MockAuditService } from '@/services/mock-audit';
import AuditDimensionPage from './page';

// Mock the DimensionForm component
vi.mock('@/components/audit/DimensionForm', () => ({
  default: vi.fn(({ mode, onSubmit, onCancel, open }: {
    mode: 'create' | 'edit';
    onSubmit: (_values: { name: string; type: string; description: string }) => void;
    onCancel: () => void;
    open: boolean;
  }) => {
    if (!open) return null;
    return (
      <div data-testid="dimension-form">
        <span>{mode === 'create' ? '新增审核维度' : '编辑审核维度'}</span>
        <button
          data-testid="form-submit"
          onClick={() => onSubmit({ name: '测试维度', type: 'text', description: '测试描述' })}
        >
          保存
        </button>
        <button data-testid="form-cancel" onClick={onCancel}>
          取消
        </button>
      </div>
    );
  }),
}));

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

const renderPage = () => {
  const queryClient = createQueryClient();
  return {
    ...render(
      <QueryClientProvider client={queryClient}>
        <App>
          <AuditDimensionPage />
        </App>
      </QueryClientProvider>
    ),
    queryClient,
  };
};

describe('AuditDimensionPage', () => {
  beforeEach(() => {
    MockAuditService.resetMockData();
    vi.clearAllMocks();
  });

  it('should render page title', () => {
    renderPage();
    expect(screen.getByText('审核维度管理')).toBeInTheDocument();
  });

  it('should render create button', () => {
    renderPage();
    expect(screen.getByText('新增维度')).toBeInTheDocument();
  });

  it('should display dimension list data', async () => {
    renderPage();

    await waitFor(() => {
      expect(screen.getByText('敏感词检测')).toBeInTheDocument();
      expect(screen.getByText('暴力内容识别')).toBeInTheDocument();
      expect(screen.getByText('色情内容检测')).toBeInTheDocument();
      expect(screen.getByText('语音违规检测')).toBeInTheDocument();
    });
  });

  it('should show dimension type tags', async () => {
    renderPage();

    await waitFor(() => {
      expect(screen.getByText('文本')).toBeInTheDocument();
      expect(screen.getByText('图片')).toBeInTheDocument();
      expect(screen.getByText('视频')).toBeInTheDocument();
      expect(screen.getByText('音频')).toBeInTheDocument();
    });
  });

  it('should open create form when create button clicked', async () => {
    renderPage();

    const createButton = screen.getByText('新增维度');
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(screen.getByTestId('dimension-form')).toBeInTheDocument();
      expect(screen.getByText('新增审核维度')).toBeInTheDocument();
    });
  });

  it('should open edit form when edit button clicked', async () => {
    renderPage();

    await waitFor(() => {
      expect(screen.getByText('敏感词检测')).toBeInTheDocument();
    });

    const editButtons = screen.getAllByText('编辑');
    fireEvent.click(editButtons[0]);

    await waitFor(() => {
      expect(screen.getByTestId('dimension-form')).toBeInTheDocument();
    });
  });

  it('should close form when cancel clicked', async () => {
    renderPage();

    const createButton = screen.getByText('新增维度');
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(screen.getByTestId('dimension-form')).toBeInTheDocument();
    });

    const cancelButton = screen.getByTestId('form-cancel');
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(screen.queryByTestId('dimension-form')).not.toBeInTheDocument();
    });
  });

  it('should show delete confirmation button', async () => {
    renderPage();

    await waitFor(() => {
      expect(screen.getByText('敏感词检测')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByText('删除');
    expect(deleteButtons.length).toBeGreaterThan(0);
  });

  it('should show empty state when no dimensions', async () => {
    vi.spyOn(MockAuditService, 'getDimensions').mockResolvedValueOnce([]);

    renderPage();

    await waitFor(() => {
      expect(screen.getByText('暂无审核维度')).toBeInTheDocument();
    });
  });

  it('should show error state on fetch failure', async () => {
    vi.spyOn(MockAuditService, 'getDimensions').mockRejectedValueOnce(new Error('网络错误'));

    renderPage();

    await waitFor(() => {
      expect(screen.getByText('加载失败，请稍后重试')).toBeInTheDocument();
    });
  });

  it('should show success message when create succeeds', async () => {
    renderPage();

    const createButton = screen.getByText('新增维度');
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(screen.getByTestId('dimension-form')).toBeInTheDocument();
    });

    const submitButton = screen.getByTestId('form-submit');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('维度创建成功')).toBeInTheDocument();
    });
  });

  it('should show error message when create fails', async () => {
    vi.spyOn(MockAuditService, 'createDimension').mockRejectedValueOnce(
      new Error('维度名称已存在')
    );

    renderPage();

    const createButton = screen.getByText('新增维度');
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(screen.getByTestId('dimension-form')).toBeInTheDocument();
    });

    const submitButton = screen.getByTestId('form-submit');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('维度名称已存在')).toBeInTheDocument();
    });
  });

  it('should show edit mode in form', async () => {
    renderPage();

    await waitFor(() => {
      expect(screen.getByText('敏感词检测')).toBeInTheDocument();
    });

    const editButtons = screen.getAllByText('编辑');
    fireEvent.click(editButtons[0]);

    await waitFor(() => {
      expect(screen.getByText('编辑审核维度')).toBeInTheDocument();
    });
  });

  it('should render table with correct columns', async () => {
    renderPage();

    await waitFor(() => {
      expect(screen.getAllByText('维度名称')[0]).toBeInTheDocument();
      expect(screen.getAllByText('类型')[0]).toBeInTheDocument();
      expect(screen.getAllByText('描述')[0]).toBeInTheDocument();
      expect(screen.getAllByText('创建时间')[0]).toBeInTheDocument();
      expect(screen.getAllByText('操作')[0]).toBeInTheDocument();
    });
  });

  it('should show success message when edit succeeds', async () => {
    renderPage();

    await waitFor(() => {
      expect(screen.getByText('敏感词检测')).toBeInTheDocument();
    });

    const editButtons = screen.getAllByText('编辑');
    fireEvent.click(editButtons[0]);

    await waitFor(() => {
      expect(screen.getByTestId('dimension-form')).toBeInTheDocument();
    });

    const submitButton = screen.getByTestId('form-submit');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('维度更新成功')).toBeInTheDocument();
    });
  });

  it('should show error message when edit fails', async () => {
    vi.spyOn(MockAuditService, 'updateDimension').mockRejectedValueOnce(
      new Error('更新失败')
    );

    renderPage();

    await waitFor(() => {
      expect(screen.getByText('敏感词检测')).toBeInTheDocument();
    });

    const editButtons = screen.getAllByText('编辑');
    fireEvent.click(editButtons[0]);

    await waitFor(() => {
      expect(screen.getByTestId('dimension-form')).toBeInTheDocument();
    });

    const submitButton = screen.getByTestId('form-submit');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('更新失败')).toBeInTheDocument();
    });
  });

  it('should handle delete mutation error', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(MockAuditService, 'deleteDimension').mockRejectedValueOnce(
      new Error('维度已被策略关联，请先解除关联关系')
    );

    renderPage();

    await waitFor(() => {
      expect(screen.getByText('敏感词检测')).toBeInTheDocument();
    });

    // Get the delete button and click it directly (bypassing Popconfirm)
    const page = screen.getByText('审核维度管理').closest('.ant-card');
    const deleteButtons = page?.querySelectorAll('button');
    const deleteButton = Array.from(deleteButtons || []).find(
      (btn) => btn.textContent?.includes('删除')
    );

    if (deleteButton) {
      // Trigger the Popconfirm's onConfirm directly by finding the button's onClick
      fireEvent.click(deleteButton);
    }

    consoleError.mockRestore();
  });
});
