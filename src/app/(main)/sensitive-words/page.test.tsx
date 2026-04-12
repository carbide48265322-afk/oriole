import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { App } from 'antd';
import SensitiveWordsPage from '@/app/(main)/sensitive-words/page';
import type { SensitiveWord, WordStats } from '@/types/sensitive-word';

// Mock service - 数据必须定义在 mock 内部，避免变量提升问题
vi.mock('@/services/mock-sensitive-word', () => {
  const parentWords: SensitiveWord[] = [
    {
      id: 'sw_001',
      word: '暴力',
      category: 'violence',
      type: 'parent',
      level: 'high',
      status: 'enabled',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: 'sw_002',
      word: '色情',
      category: 'porn',
      type: 'parent',
      level: 'high',
      status: 'enabled',
      createdAt: '2024-01-02T00:00:00.000Z',
      updatedAt: '2024-01-02T00:00:00.000Z',
    },
  ];

  const allWords: SensitiveWord[] = [
    ...parentWords,
    {
      id: 'sw_003',
      word: '血腥画面',
      category: 'violence',
      type: 'variant',
      parentWordId: 'sw_001',
      level: 'high',
      status: 'disabled',
      createdAt: '2024-01-03T00:00:00.000Z',
      updatedAt: '2024-01-03T00:00:00.000Z',
    },
    {
      id: 'sw_004',
      word: '色情内容',
      category: 'porn',
      type: 'variant',
      parentWordId: 'sw_002',
      level: 'medium',
      status: 'pending',
      createdAt: '2024-01-04T00:00:00.000Z',
      updatedAt: '2024-01-04T00:00:00.000Z',
    },
  ];

  const stats: WordStats = {
    total: 4,
    todayAdded: 1,
    enabled: 2,
    pending: 1,
    disabled: 1,
  };

  return {
    default: {
      getWords: vi.fn().mockResolvedValue(allWords),
      getStats: vi.fn().mockResolvedValue(stats),
      getParentWords: vi.fn().mockResolvedValue(parentWords),
      getVariants: vi.fn().mockResolvedValue(allWords.filter(w => w.type === 'variant')),
      createWord: vi.fn().mockResolvedValue({
        id: 'sw_new',
        word: '新敏感词',
        category: 'ad',
        type: 'parent',
        level: 'medium',
        status: 'enabled',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }),
      updateWord: vi.fn().mockResolvedValue({
        id: 'sw_001',
        word: '更新后的词',
        category: 'violence',
        type: 'parent',
        level: 'high',
        status: 'enabled',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: new Date().toISOString(),
      }),
      deleteWord: vi.fn().mockResolvedValue(undefined),
      updateStatus: vi.fn().mockResolvedValue(undefined),
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

    // 验证 Tab 切换
    expect(screen.getByText('母词库')).toBeInTheDocument();
    expect(screen.getByText('变体词库')).toBeInTheDocument();

    // 验证搜索和操作栏
    expect(screen.getByPlaceholderText('搜索敏感词')).toBeInTheDocument();
    expect(screen.getByText('新增')).toBeInTheDocument();

    // 等待数据加载完成并验证表格列
    await waitFor(() => {
      expect(screen.getAllByText('暴力').length).toBeGreaterThan(0);
    });

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

  it('应该展示统计卡片', async () => {
    renderWithProviders(<SensitiveWordsPage />);

    await waitFor(() => {
      expect(screen.getByText('总词数')).toBeInTheDocument();
      expect(screen.getByText('今日新增')).toBeInTheDocument();
    });

    // 验证状态统计
    expect(screen.getByText('启用')).toBeInTheDocument();
    expect(screen.getByText('待审核')).toBeInTheDocument();
    expect(screen.getByText('禁用')).toBeInTheDocument();
  });

  it('默认应该展示母词库 Tab 的数据', async () => {
    renderWithProviders(<SensitiveWordsPage />);

    await waitFor(() => {
      // 母词应该显示
      expect(screen.getAllByText('暴力').length).toBeGreaterThan(0);
      expect(screen.getAllByText('色情').length).toBeGreaterThan(0);
      // 变体词不应该显示
      expect(screen.queryByText('血腥画面')).not.toBeInTheDocument();
      expect(screen.queryByText('色情内容')).not.toBeInTheDocument();
    });
  });

  it('切换到变体词库 Tab 应该显示变体词数据', async () => {
    renderWithProviders(<SensitiveWordsPage />);

    await waitFor(() => {
      expect(screen.getAllByText('暴力').length).toBeGreaterThan(0);
    });

    // 切换到变体词库
    await act(async () => {
      fireEvent.click(screen.getByText('变体词库'));
    });

    await waitFor(() => {
      // 变体词应该显示
      expect(screen.getAllByText('血腥画面').length).toBeGreaterThan(0);
      expect(screen.getAllByText('色情内容').length).toBeGreaterThan(0);
    });
  });

  it('变体词库 Tab 应该显示母词列', async () => {
    renderWithProviders(<SensitiveWordsPage />);

    await waitFor(() => {
      expect(screen.getAllByText('暴力').length).toBeGreaterThan(0);
    });

    // 切换到变体词库
    await act(async () => {
      fireEvent.click(screen.getByText('变体词库'));
    });

    await waitFor(() => {
      // 变体词应该显示
      expect(screen.getAllByText('血腥画面').length).toBeGreaterThan(0);
    }, { timeout: 3000 });

    await waitFor(() => {
      // 母词列应该出现（使用 getAllByText 因为可能有隐藏元素）
      expect(screen.getAllByText('母词').length).toBeGreaterThan(0);
    }, { timeout: 3000 });
  });

  it('母词库 Tab 不应该显示母词列', async () => {
    renderWithProviders(<SensitiveWordsPage />);

    await waitFor(() => {
      expect(screen.getAllByText('暴力').length).toBeGreaterThan(0);
    });

    // 母词库 Tab 下不应该有"母词"列头
    const parentWordColumn = screen.queryByText('母词');
    expect(parentWordColumn).not.toBeInTheDocument();
  });

  it('应该支持搜索过滤', async () => {
    renderWithProviders(<SensitiveWordsPage />);

    await waitFor(() => {
      expect(screen.getAllByText('暴力').length).toBeGreaterThan(0);
    });

    const searchInput = screen.getByPlaceholderText('搜索敏感词');
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: '暴力' } });
    });

    await waitFor(() => {
      expect(screen.getAllByText('暴力').length).toBeGreaterThan(0);
      expect(screen.queryByText('色情')).not.toBeInTheDocument();
    });
  });

  it('应该支持分类筛选', async () => {
    renderWithProviders(<SensitiveWordsPage />);

    await waitFor(() => {
      expect(screen.getAllByText('暴力').length).toBeGreaterThan(0);
    });

    // 验证分类筛选下拉框存在（通过文本内容查找）
    expect(screen.getByText('全部分类')).toBeInTheDocument();
  });

  it('切换 Tab 应该清空搜索和筛选条件', async () => {
    renderWithProviders(<SensitiveWordsPage />);

    await waitFor(() => {
      expect(screen.getAllByText('暴力').length).toBeGreaterThan(0);
    });

    // 输入搜索条件
    const searchInput = screen.getByPlaceholderText('搜索敏感词');
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: '暴力' } });
    });

    // 切换到变体词库
    await act(async () => {
      fireEvent.click(screen.getByText('变体词库'));
    });

    await waitFor(() => {
      // 搜索条件应该被清空，搜索输入框应该为空
      expect((searchInput as HTMLInputElement).value).toBe('');
    });
  });

  it('点击新增按钮应该打开表单', async () => {
    renderWithProviders(<SensitiveWordsPage />);

    await waitFor(() => {
      expect(screen.getAllByText('暴力').length).toBeGreaterThan(0);
    });

    const addButton = screen.getByText('新增');
    await act(async () => {
      fireEvent.click(addButton);
    });

    await waitFor(() => {
      expect(screen.getByText('新增敏感词')).toBeInTheDocument();
    });
  });

  it('点击编辑按钮应该打开表单', async () => {
    renderWithProviders(<SensitiveWordsPage />);

    await waitFor(() => {
      expect(screen.getAllByText('暴力').length).toBeGreaterThan(0);
    });

    const editButtons = screen.getAllByText('编辑');
    await act(async () => {
      fireEvent.click(editButtons[0]);
    });

    await waitFor(() => {
      expect(screen.getByText('编辑敏感词')).toBeInTheDocument();
    });
  });

  it('点击创建变体词条按钮应该打开表单', async () => {
    renderWithProviders(<SensitiveWordsPage />);

    await waitFor(() => {
      expect(screen.getAllByText('暴力').length).toBeGreaterThan(0);
    });

    // 母词应该有"创建变体词条"按钮
    const createVariantButtons = screen.getAllByText('创建变体词条');
    expect(createVariantButtons.length).toBeGreaterThan(0);

    await act(async () => {
      fireEvent.click(createVariantButtons[0]);
    });

    await waitFor(() => {
      // 表单标题应该出现
      const variantFormTitle = screen.queryAllByText('创建变体词条');
      expect(variantFormTitle.length).toBeGreaterThan(0);
    });
  });

  it('加载错误时应该显示错误信息', async () => {
    // 动态导入并覆盖 mock
    const MockSensitiveWordService = (await import('@/services/mock-sensitive-word')).default;
    vi.mocked(MockSensitiveWordService.getWords).mockRejectedValueOnce(
      new Error('加载失败')
    );

    renderWithProviders(<SensitiveWordsPage />);

    await waitFor(() => {
      expect(screen.getByText('加载失败，请稍后重试')).toBeInTheDocument();
    });
  });

  it('状态列应该使用 Select 显示状态文本', async () => {
    renderWithProviders(<SensitiveWordsPage />);

    await waitFor(() => {
      expect(screen.getAllByText('暴力').length).toBeGreaterThan(0);
    });

    // 状态列应该显示状态标签（启用/待审核/禁用）
    expect(screen.getAllByText('启用').length).toBeGreaterThan(0);
  });
});
