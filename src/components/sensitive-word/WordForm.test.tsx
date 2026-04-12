import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import WordForm from './WordForm';
import MockSensitiveWordService from '@/services/mock-sensitive-word';
import type { SensitiveWord } from '@/types/sensitive-word';

vi.mock('@/services/mock-sensitive-word', () => {
  const mockParentWords: SensitiveWord[] = [
    {
      id: 'sw_parent_001',
      word: '母词测试',
      category: 'politics',
      type: 'parent',
      level: 'high',
      status: 'enabled',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: 'sw_parent_002',
      word: '另一个母词',
      category: 'violence',
      type: 'parent',
      level: 'medium',
      status: 'enabled',
      createdAt: '2024-01-02T00:00:00.000Z',
      updatedAt: '2024-01-02T00:00:00.000Z',
    },
  ];

  return {
    default: {
      getParentWords: vi.fn().mockImplementation(() => Promise.resolve(mockParentWords)),
    },
  };
});

const renderWordForm = (props: Partial<React.ComponentProps<typeof WordForm>> = {}) => {
  const defaultProps: React.ComponentProps<typeof WordForm> = {
    mode: 'create',
    onSubmit: vi.fn(),
    onCancel: vi.fn(),
    open: true,
    ...props,
  };
  return render(<WordForm {...defaultProps} />);
};

// Helper to find buttons by role (handles whitespace in Chinese text)
const getSaveButton = () => screen.getByRole('button', { name: /保.*存/ });
const getCancelButton = () => screen.getByRole('button', { name: /取.*消/ });

describe('WordForm', () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockSensitiveWord: SensitiveWord = {
    id: 'sw_001',
    word: '测试词',
    category: 'politics',
    type: 'parent',
    level: 'high',
    status: 'enabled',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  };

  it('应该在创建模式下正确渲染', () => {
    renderWordForm({ mode: 'create' });

    expect(screen.getByText('新增敏感词')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('请输入敏感词')).toBeInTheDocument();
    expect(screen.getByText('请选择分类')).toBeInTheDocument();
    expect(screen.getByText('请选择级别')).toBeInTheDocument();
    // 应该显示类型选择
    expect(screen.getByRole('radio', { name: '母词' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: '变体' })).toBeInTheDocument();
  });

  it('应该在编辑模式下正确渲染并填充初始值', () => {
    renderWordForm({ mode: 'edit', initialValues: mockSensitiveWord });

    expect(screen.getByText('编辑敏感词')).toBeInTheDocument();
    expect((screen.getByDisplayValue('测试词') as HTMLInputElement).value).toBe('测试词');
  });

  it('应该在未打开时不渲染表单', () => {
    renderWordForm({ open: false });

    expect(screen.queryByText('新增敏感词')).not.toBeInTheDocument();
  });

  it('应该验证必填字段', async () => {
    renderWordForm({ onSubmit: mockOnSubmit });

    const saveButton = getSaveButton();
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('请输入敏感词')).toBeInTheDocument();
      expect(screen.getByText('请选择分类')).toBeInTheDocument();
      expect(screen.getByText('请选择级别')).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('应该在表单验证通过后提交数据（母词）', async () => {
    renderWordForm({ onSubmit: mockOnSubmit });

    // 填写敏感词
    fireEvent.change(screen.getByPlaceholderText('请输入敏感词'), {
      target: { value: '新敏感词' },
    });

    // 选择分类
    const categoryPlaceholder = screen.getByText('请选择分类');
    const categorySelect = categoryPlaceholder.closest('.ant-select');
    expect(categorySelect).toBeInTheDocument();
    fireEvent.mouseDown(categorySelect!);

    const categoryOption = await screen.findByText('政治');
    fireEvent.click(categoryOption);

    // 选择级别
    const levelPlaceholder = screen.getByText('请选择级别');
    const levelSelect = levelPlaceholder.closest('.ant-select');
    expect(levelSelect).toBeInTheDocument();
    fireEvent.mouseDown(levelSelect!);

    const levelOption = await screen.findByText('高');
    fireEvent.click(levelOption);

    // 状态默认为启用，不需要额外选择

    // 点击保存
    fireEvent.click(getSaveButton());

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        word: '新敏感词',
        category: 'politics',
        level: 'high',
        status: 'enabled',
        type: 'parent',
        parentWordId: undefined,
      });
    });
  });

  it('应该在类型切换为变体时显示母词选择框', async () => {
    renderWordForm({ mode: 'create' });

    // 选择变体类型
    const variantRadio = screen.getByRole('radio', { name: '变体' });
    await act(async () => {
      fireEvent.click(variantRadio);
    });

    // 应该显示母词选择框
    await waitFor(() => {
      expect(screen.getByText('请选择母词')).toBeInTheDocument();
    });
  });

  it('应该在表单验证通过后提交数据（变体词）', async () => {
    renderWordForm({ onSubmit: mockOnSubmit });

    // 填写敏感词
    fireEvent.change(screen.getByPlaceholderText('请输入敏感词'), {
      target: { value: '变体测试词' },
    });

    // 选择分类
    const categoryPlaceholder = screen.getByText('请选择分类');
    const categorySelect = categoryPlaceholder.closest('.ant-select');
    fireEvent.mouseDown(categorySelect!);
    const categoryOption = await screen.findByText('暴力');
    fireEvent.click(categoryOption);

    // 选择级别
    const levelPlaceholder = screen.getByText('请选择级别');
    const levelSelect = levelPlaceholder.closest('.ant-select');
    fireEvent.mouseDown(levelSelect!);
    const levelOption = await screen.findByText('中');
    fireEvent.click(levelOption);

    // 选择状态（默认启用）
    // 状态默认为启用，不需要额外操作

    // 选择变体类型
    const variantRadio = screen.getByRole('radio', { name: '变体' });
    await act(async () => {
      fireEvent.click(variantRadio);
    });

    // 等待母词选择框出现
    await screen.findByText('请选择母词');

    // 选择母词
    const parentPlaceholder = screen.getByText('请选择母词');
    const parentSelect = parentPlaceholder.closest('.ant-select');
    fireEvent.mouseDown(parentSelect!);
    const parentOption = await screen.findByText('母词测试');
    fireEvent.click(parentOption);

    // 点击保存
    fireEvent.click(getSaveButton());

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        word: '变体测试词',
        category: 'violence',
        level: 'medium',
        status: 'enabled',
        type: 'variant',
        parentWordId: 'sw_parent_001',
      });
    });
  });

  it('应该在点击取消时调用 onCancel', () => {
    renderWordForm({ onCancel: mockOnCancel });

    fireEvent.click(getCancelButton());

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('应该在编辑模式下使用正确的 key', () => {
    const { rerender } = renderWordForm({
      mode: 'edit',
      initialValues: mockSensitiveWord,
    });

    expect(screen.getByDisplayValue('测试词')).toBeInTheDocument();

    const updatedWord: SensitiveWord = {
      ...mockSensitiveWord,
      id: 'sw_002',
      word: '更新后的词',
    };

    rerender(
      <WordForm
        mode="edit"
        initialValues={updatedWord}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
        open
      />
    );

    expect(screen.getByDisplayValue('更新后的词')).toBeInTheDocument();
  });

  it('应该显示 loading 状态', () => {
    renderWordForm({ confirmLoading: true });

    const saveButton = getSaveButton();
    expect(saveButton).toHaveClass('ant-btn-loading');
  });

  it('应该在打开时加载母词列表', async () => {
    renderWordForm({ mode: 'create' });

    await waitFor(() => {
      expect(MockSensitiveWordService.getParentWords).toHaveBeenCalledTimes(1);
    });
  });

  it('应该在类型从变体切回母词时清空 parentWordId', async () => {
    renderWordForm({ onSubmit: mockOnSubmit });

    // 切换到变体
    const variantRadio = screen.getByRole('radio', { name: '变体' });
    await act(async () => {
      fireEvent.click(variantRadio);
    });

    await screen.findByText('请选择母词');

    // 填写必要字段
    fireEvent.change(screen.getByPlaceholderText('请输入敏感词'), {
      target: { value: '测试词' },
    });

    // 选择分类
    const categoryPlaceholder = screen.getByText('请选择分类');
    const categorySelect = categoryPlaceholder.closest('.ant-select');
    fireEvent.mouseDown(categorySelect!);
    const categoryOption = await screen.findByText('政治');
    fireEvent.click(categoryOption);

    // 选择级别
    const levelPlaceholder = screen.getByText('请选择级别');
    const levelSelect = levelPlaceholder.closest('.ant-select');
    fireEvent.mouseDown(levelSelect!);
    const levelOption = await screen.findByText('高');
    fireEvent.click(levelOption);

    // 选择状态（默认启用）
    // 状态默认为启用

    // 选择母词
    const parentPlaceholder = screen.getByText('请选择母词');
    const parentSelect = parentPlaceholder.closest('.ant-select');
    fireEvent.mouseDown(parentSelect!);
    const parentOption = await screen.findByText('母词测试');
    fireEvent.click(parentOption);

    // 切换回母词类型
    const parentRadio = screen.getByRole('radio', { name: '母词' });
    await act(async () => {
      fireEvent.click(parentRadio);
    });

    // 提交表单
    fireEvent.click(getSaveButton());

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        word: '测试词',
        category: 'politics',
        level: 'high',
        status: 'enabled',
        type: 'parent',
        parentWordId: undefined,
      });
    });
  });

  it('应该在创建变体模式下自动填充 parentWordId 和 type', async () => {
    renderWordForm({
      mode: 'create',
      initialValues: { type: 'variant', parentWordId: 'sw_parent_001' },
      onSubmit: mockOnSubmit,
    });

    expect(screen.getByText('创建变体词条')).toBeInTheDocument();

    // 类型和母词应该被禁用
    const variantRadio = screen.getByRole('radio', { name: '变体' });
    expect(variantRadio).toBeDisabled();

    // 填写敏感词
    fireEvent.change(screen.getByPlaceholderText('请输入敏感词'), {
      target: { value: '新变体词' },
    });

    // 选择分类
    const categoryPlaceholder = screen.getByText('请选择分类');
    const categorySelect = categoryPlaceholder.closest('.ant-select');
    fireEvent.mouseDown(categorySelect!);
    const categoryOption = await screen.findByText('政治');
    fireEvent.click(categoryOption);

    // 选择级别
    const levelPlaceholder = screen.getByText('请选择级别');
    const levelSelect = levelPlaceholder.closest('.ant-select');
    fireEvent.mouseDown(levelSelect!);
    const levelOption = await screen.findByText('低');
    fireEvent.click(levelOption);

    // 选择状态（默认启用）
    // 状态默认为启用，不需要额外选择

    // 点击保存
    fireEvent.click(getSaveButton());

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        word: '新变体词',
        category: 'politics',
        level: 'low',
        status: 'enabled',
        type: 'variant',
        parentWordId: 'sw_parent_001',
      });
    });
  });

  it('应该显示状态选择框', () => {
    renderWordForm({ mode: 'create' });

    // 状态字段应该存在（通过 label 查找）
    expect(screen.getByText('状态')).toBeInTheDocument();
  });
});
