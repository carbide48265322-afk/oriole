import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DimensionForm, { type DimensionFormProps } from './DimensionForm';
import type { AuditDimension } from '@/types/audit';

const renderDimensionForm = (props: Partial<DimensionFormProps> = {}) => {
  const defaultProps: DimensionFormProps = {
    mode: 'create',
    onSubmit: vi.fn(),
    onCancel: vi.fn(),
    open: true,
    ...props,
  };
  return render(<DimensionForm {...defaultProps} />);
};

// Helper to find buttons by role (handles whitespace in Chinese text)
const getSaveButton = () => screen.getByRole('button', { name: /保.*存/ });
const getCancelButton = () => screen.getByRole('button', { name: /取.*消/ });

describe('DimensionForm', () => {
  it('should render create modal with correct title', () => {
    renderDimensionForm({ mode: 'create' });
    expect(screen.getByText('新增审核维度')).toBeInTheDocument();
  });

  it('should render edit modal with correct title', () => {
    renderDimensionForm({ mode: 'edit' });
    expect(screen.getByText('编辑审核维度')).toBeInTheDocument();
  });

  it('should not render when open is false', () => {
    renderDimensionForm({ open: false });
    expect(screen.queryByText('新增审核维度')).not.toBeInTheDocument();
  });

  it('should show validation error when name is empty', async () => {
    const onSubmit = vi.fn();
    renderDimensionForm({ onSubmit });

    const saveButton = getSaveButton();
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('请输入维度名称')).toBeInTheDocument();
    });
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('should show validation error when type is not selected', async () => {
    const onSubmit = vi.fn();
    renderDimensionForm({ onSubmit });

    const nameInput = screen.getByPlaceholderText('请输入维度名称');
    fireEvent.change(nameInput, { target: { value: '测试维度' } });

    const saveButton = getSaveButton();
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('请选择维度类型')).toBeInTheDocument();
    });
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('should submit form with valid data', async () => {
    const onSubmit = vi.fn();
    renderDimensionForm({ onSubmit });

    const nameInput = screen.getByPlaceholderText('请输入维度名称');
    fireEvent.change(nameInput, { target: { value: '测试维度' } });

    // Find the select by its placeholder text in a div, then find the select container
    const placeholder = screen.getByText('请选择维度类型');
    const selectContainer = placeholder.closest('.ant-select');
    expect(selectContainer).toBeInTheDocument();
    fireEvent.mouseDown(selectContainer!);

    const option = await screen.findByText('文本');
    fireEvent.click(option);

    const saveButton = getSaveButton();
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        name: '测试维度',
        type: 'text',
        description: '',
      });
    });
  });

  it('should prefill values in edit mode', () => {
    const initialValues: AuditDimension = {
      id: '1',
      name: '现有维度',
      type: 'image',
      description: '维度描述',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    };
    renderDimensionForm({ mode: 'edit', initialValues });

    const nameInput = screen.getByDisplayValue('现有维度') as HTMLInputElement;
    expect(nameInput).toBeInTheDocument();
  });

  it('should call onCancel when cancel button clicked', () => {
    const onCancel = vi.fn();
    renderDimensionForm({ onCancel });

    const cancelButton = getCancelButton();
    fireEvent.click(cancelButton);

    expect(onCancel).toHaveBeenCalled();
  });

  it('should submit with all fields including description', async () => {
    const onSubmit = vi.fn();
    renderDimensionForm({ onSubmit });

    const nameInput = screen.getByPlaceholderText('请输入维度名称');
    fireEvent.change(nameInput, { target: { value: '视频维度' } });

    // Find the select by its placeholder text
    const placeholder = screen.getByText('请选择维度类型');
    const selectContainer = placeholder.closest('.ant-select');
    expect(selectContainer).toBeInTheDocument();
    fireEvent.mouseDown(selectContainer!);

    const option = await screen.findByText('视频');
    fireEvent.click(option);

    const descInput = screen.getByPlaceholderText('请输入描述（可选）');
    fireEvent.change(descInput, { target: { value: '视频内容审核' } });

    const saveButton = getSaveButton();
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        name: '视频维度',
        type: 'video',
        description: '视频内容审核',
      });
    });
  });

  it('should reset form when initialValues changes from defined to undefined', async () => {
    const { rerender } = renderDimensionForm({
      mode: 'edit',
      initialValues: {
        id: '1',
        name: '编辑的维度',
        type: 'image',
        description: '编辑的描述',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      },
    });

    // Verify initial values are prefilled
    expect(screen.getByDisplayValue('编辑的维度')).toBeInTheDocument();

    // Simulate switching to create mode (initialValues becomes undefined)
    rerender(
      <DimensionForm
        mode="create"
        initialValues={undefined}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
        open={true}
      />
    );

    // Form should be reset - name input should be empty
    await waitFor(() => {
      const nameInput = screen.getByPlaceholderText('请输入维度名称') as HTMLInputElement;
      expect(nameInput.value).toBe('');
    });
  });
});
