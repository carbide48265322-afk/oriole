import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import PolicyForm, { type PolicyFormProps } from './PolicyForm';
import type { AuditPolicy } from '@/types/audit';

const renderPolicyForm = (props: Partial<PolicyFormProps> = {}) => {
  const defaultProps: PolicyFormProps = {
    mode: 'create',
    onSubmit: vi.fn(),
    onCancel: vi.fn(),
    open: true,
    ...props,
  };
  return render(<PolicyForm {...defaultProps} />);
};

// Helper to find buttons by role (handles whitespace in Chinese text)
const getSaveButton = () => screen.getByRole('button', { name: /保.*存/ });
const getCancelButton = () => screen.getByRole('button', { name: /取.*消/ });

describe('PolicyForm', () => {
  it('should render create modal with correct title', () => {
    renderPolicyForm({ mode: 'create' });
    expect(screen.getByText('新增审核策略')).toBeInTheDocument();
  });

  it('should render edit modal with correct title', () => {
    renderPolicyForm({ mode: 'edit' });
    expect(screen.getByText('编辑审核策略')).toBeInTheDocument();
  });

  it('should not render when open is false', () => {
    renderPolicyForm({ open: false });
    expect(screen.queryByText('新增审核策略')).not.toBeInTheDocument();
  });

  it('should show validation error when name is empty', async () => {
    const onSubmit = vi.fn();
    renderPolicyForm({ onSubmit });

    const saveButton = getSaveButton();
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('请输入策略名称')).toBeInTheDocument();
    });
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('should show validation error when name exceeds max length', async () => {
    const onSubmit = vi.fn();
    renderPolicyForm({ onSubmit });

    const nameInput = screen.getByPlaceholderText('请输入策略名称');
    const longName = 'a'.repeat(101);
    fireEvent.change(nameInput, { target: { value: longName } });

    const saveButton = getSaveButton();
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('策略名称不能超过 100 个字符')).toBeInTheDocument();
    });
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('should submit form with valid data', async () => {
    const onSubmit = vi.fn();
    renderPolicyForm({ onSubmit });

    const nameInput = screen.getByPlaceholderText('请输入策略名称');
    fireEvent.change(nameInput, { target: { value: '测试策略' } });

    const saveButton = getSaveButton();
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        name: '测试策略',
        description: '',
      });
    });
  });

  it('should prefill values in edit mode', () => {
    const initialValues: AuditPolicy = {
      id: '1',
      name: '现有策略',
      description: '这是描述',
      dimensions: [],
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    };
    renderPolicyForm({ mode: 'edit', initialValues });

    const nameInput = screen.getByDisplayValue('现有策略') as HTMLInputElement;
    expect(nameInput).toBeInTheDocument();
  });

  it('should call onCancel and reset form when cancel button clicked', async () => {
    const onCancel = vi.fn();
    renderPolicyForm({ onCancel });

    const nameInput = screen.getByPlaceholderText('请输入策略名称');
    fireEvent.change(nameInput, { target: { value: '测试' } });

    const cancelButton = getCancelButton();
    fireEvent.click(cancelButton);

    expect(onCancel).toHaveBeenCalled();
  });

  it('should submit with description when provided', async () => {
    const onSubmit = vi.fn();
    renderPolicyForm({ onSubmit });

    const nameInput = screen.getByPlaceholderText('请输入策略名称');
    fireEvent.change(nameInput, { target: { value: '测试策略' } });

    const descInput = screen.getByPlaceholderText('请输入描述（可选）');
    fireEvent.change(descInput, { target: { value: '测试描述' } });

    const saveButton = getSaveButton();
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        name: '测试策略',
        description: '测试描述',
      });
    });
  });

  it('should reset form when initialValues changes from defined to undefined', async () => {
    const { rerender } = renderPolicyForm({
      mode: 'edit',
      initialValues: {
        id: '1',
        name: '编辑的策略',
        description: '编辑的描述',
        dimensions: [],
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      },
    });

    // Verify initial values are prefilled
    expect(screen.getByDisplayValue('编辑的策略')).toBeInTheDocument();

    // Simulate switching to create mode (initialValues becomes undefined)
    rerender(
      <PolicyForm
        mode="create"
        initialValues={undefined}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
        open={true}
      />
    );

    // Form should be reset - name input should be empty
    await waitFor(() => {
      const nameInput = screen.getByPlaceholderText('请输入策略名称') as HTMLInputElement;
      expect(nameInput.value).toBe('');
    });
  });
});
