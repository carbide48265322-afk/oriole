import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import WordForm from './WordForm';
import type { SensitiveWord } from '@/types/sensitive-word';

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
    category: 'text',
    level: 'high',
    enabled: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  };

  it('应该在创建模式下正确渲染', () => {
    renderWordForm({ mode: 'create' });

    expect(screen.getByText('新增敏感词')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('请输入敏感词')).toBeInTheDocument();
    expect(screen.getByText('请选择分类')).toBeInTheDocument();
    expect(screen.getByText('请选择级别')).toBeInTheDocument();
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

  it('应该在表单验证通过后提交数据', async () => {
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

    const categoryOption = await screen.findByText('文字');
    fireEvent.click(categoryOption);

    // 选择级别
    const levelPlaceholder = screen.getByText('请选择级别');
    const levelSelect = levelPlaceholder.closest('.ant-select');
    expect(levelSelect).toBeInTheDocument();
    fireEvent.mouseDown(levelSelect!);

    const levelOption = await screen.findByText('高');
    fireEvent.click(levelOption);

    // 点击保存
    fireEvent.click(getSaveButton());

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        word: '新敏感词',
        category: 'text',
        level: 'high',
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
});
