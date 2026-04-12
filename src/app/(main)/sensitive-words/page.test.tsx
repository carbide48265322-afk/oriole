import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { App } from 'antd';
import SensitiveWordsPage from '@/app/(main)/sensitive-words/page';
import MockSensitiveWordService from '@/services/mock-sensitive-word';
import type { SensitiveWord, WordStats } from '@/types/sensitive-word';

// Mock service
vi.mock('@/services/mock-sensitive-word', () => {
  const mockWords: SensitiveWord[] = [
    {
      id: 'sw_001',
      word: '暴力',
      category: 'text',
      level: 'high',
      enabled: true,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: 'sw_002',
      word: '色情',
      category: 'text',
      level: 'high',
      enabled: true,
      createdAt: '2024-01-02T00:00:00.000Z',
      updatedAt: '2024-01-02T00:00:00.000Z',
    },
    {
      id: 'sw_003',
      word: '血腥图片',
      category: 'image',
      level: 'high',
      enabled: false,
      createdAt: '2024-01-03T00:00:00.000Z',
      updatedAt: '2024-01-03T00:00:00.000Z',
    },
  ];

  const mockStats: WordStats = {
    total: 3,
    todayAdded: 1,
    byCategory: {
      text: 2,
      image: 1,
      video: 0,
      audio: 0,
    },
    byLevel: {
      high: 3,
      medium: 0,
      low: 0,
    },
    enabled: 2,
    disabled: 1,
  };

  return {
    default: {
      getWords: vi.fn().mockResolvedValue(mockWords),
      getStats: vi.fn().mockResolvedValue(mockStats),
      createWord: vi.fn().mockResolvedValue({
        id: 'sw_new',
        word: '新敏感词',
        category: 'text',
        level: 'medium',
        enabled: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }),
      updateWord: vi.fn().mockResolvedValue({
        id: 'sw_001',
        word: '更新后的词',
        category: 'text',
        level: 'high',
        enabled: true,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: new Date().toISOString(),
      }),
      deleteWord: vi.fn().mockResolvedValue(undefined),
      toggleEnabled: vi.fn().mockResolvedValue(undefined),
    },
  };
});

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <App>{ui}</App>
    </QueryClientProvider>
  );
}

describe('SensitiveWordsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('应该正确渲染页面', async () => {
    renderWithProviders(<SensitiveWordsPage />);

    // 验证统计卡片
    expect(screen.getByText('总词数')).toBeInTheDocument();
    expect(screen.getByText('今日新增')).toBeInTheDocument();

    // 验证搜索和操作栏
    expect(screen.getByPlaceholderText('搜索敏感词')).toBeInTheDocument();
    expect(screen.getByText('新增')).toBeInTheDocument();

    // 验证表格列 - 使用 getAllByText 因为某些文本可能出现多次
    await waitFor(() => {
      const wordHeaders = screen.getAllByText('敏感词');
      expect(wordHeaders.length).toBeGreaterThan(0);
      const categoryHeaders = screen.getAllByText('分类');
      expect(categoryHeaders.length).toBeGreaterThan(0);
      const levelHeaders = screen.getAllByText('级别');
      expect(levelHeaders.length).toBeGreaterThan(0);
      expect(screen.getAllByText('状态').length).toBeGreaterThan(0);
      const timeHeaders = screen.getAllByText('创建时间');
      expect(timeHeaders.length).toBeGreaterThan(0);
      const actionHeaders = screen.getAllByText('操作');
      expect(actionHeaders.length).toBeGreaterThan(0);
    });
  });

  it('应该展示统计卡片', async () => {
    renderWithProviders(<SensitiveWordsPage />);

    await waitFor(() => {
      expect(screen.getByText('总词数')).toBeInTheDocument();
      expect(screen.getByText('今日新增')).toBeInTheDocument();
    });

    // 验证分类统计
    expect(screen.getByText('按分类')).toBeInTheDocument();
    expect(screen.getByText('文字')).toBeInTheDocument();
    expect(screen.getByText('图片')).toBeInTheDocument();

    // 验证级别统计
    expect(screen.getByText('按级别')).toBeInTheDocument();
    expect(screen.getByText('高')).toBeInTheDocument();

    // 验证状态统计 - 使用 getAllByText 因为"状态"在表格列也会出现
    const statusElements = screen.getAllByText('状态');
    expect(statusElements.length).toBeGreaterThan(0);
    const enabledElements = screen.getAllByText('启用');
    expect(enabledElements.length).toBeGreaterThan(0);
    const disabledElements = screen.getAllByText('禁用');
    expect(disabledElements.length).toBeGreaterThan(0);
  });

  it('应该渲染表格数据', async () => {
    renderWithProviders(<SensitiveWordsPage />);

    await waitFor(() => {
      expect(screen.getByText('暴力')).toBeInTheDocument();
      expect(screen.getByText('色情')).toBeInTheDocument();
      expect(screen.getByText('血腥图片')).toBeInTheDocument();
    });
  });

  it('应该支持搜索过滤', async () => {
    renderWithProviders(<SensitiveWordsPage />);

    await waitFor(() => {
      expect(screen.getByText('暴力')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('搜索敏感词');
    fireEvent.change(searchInput, { target: { value: '暴力' } });

    await waitFor(() => {
      expect(screen.getByText('暴力')).toBeInTheDocument();
      expect(screen.queryByText('色情')).not.toBeInTheDocument();
    });
  });

  it('应该支持分类筛选', async () => {
    renderWithProviders(<SensitiveWordsPage />);

    await waitFor(() => {
      expect(screen.getByText('暴力')).toBeInTheDocument();
      expect(screen.getByText('血腥图片')).toBeInTheDocument();
    });

    // 验证分类筛选下拉框存在
    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
    
    // 验证默认值是"全部分类"
    expect(screen.getByText('全部分类')).toBeInTheDocument();
  });

  it('点击新增按钮应该打开表单', async () => {
    renderWithProviders(<SensitiveWordsPage />);

    await waitFor(() => {
      const addButton = screen.getByText('新增');
      fireEvent.click(addButton);
    });

    await waitFor(() => {
      expect(screen.getByText('新增敏感词')).toBeInTheDocument();
    });
  });

  it('点击编辑按钮应该打开表单', async () => {
    renderWithProviders(<SensitiveWordsPage />);

    await waitFor(() => {
      const editButtons = screen.getAllByText('编辑');
      fireEvent.click(editButtons[0]);
    });

    await waitFor(() => {
      expect(screen.getByText('编辑敏感词')).toBeInTheDocument();
    });
  });

  it('加载错误时应该显示错误信息', async () => {
    // 覆盖 mock 返回错误
    vi.mocked(MockSensitiveWordService.getWords).mockRejectedValueOnce(
      new Error('加载失败')
    );

    renderWithProviders(<SensitiveWordsPage />);

    await waitFor(() => {
      expect(screen.getByText('加载失败，请稍后重试')).toBeInTheDocument();
    });
  });
});
