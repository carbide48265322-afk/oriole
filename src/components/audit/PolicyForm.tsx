/* eslint-disable no-unused-vars */
'use client';

import React, { useEffect } from 'react';
import { Form, Input, Modal } from 'antd';
import type { AuditPolicy } from '@/types/audit';

const { TextArea } = Input;

export interface PolicyFormProps {
  mode: 'create' | 'edit';
  initialValues?: AuditPolicy;
  onSubmit: ({ name, description }: { name: string; description: string }) => void;
  onCancel: () => void;
  open: boolean;
  confirmLoading?: boolean;
}

const MAX_NAME_LENGTH = 100;

export default function PolicyForm({
  mode,
  initialValues,
  onSubmit,
  onCancel,
  open,
  confirmLoading = false,
}: PolicyFormProps) {
  const [form] = Form.useForm<{ name: string; description: string }>();

  // 当 open 或 initialValues 变化时同步表单值
  useEffect(() => {
    if (open) {
      if (initialValues) {
        form.setFieldsValue({
          name: initialValues.name,
          description: initialValues.description,
        });
      } else {
        form.resetFields();
        // 新增模式下设置默认值
        form.setFieldsValue({
          name: '',
          description: '',
        });
      }
    }
    // 不在这里 resetFields，Modal 的 destroyOnHidden 会自动销毁表单实例
  }, [open, initialValues, form]);

  const handleFinish = (values: { name: string; description: string }) => {
    onSubmit(values);
    // 不在这里 resetFields，等弹窗关闭时再重置，避免用户看到空表单闪现
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={mode === 'create' ? '新增审核策略' : '编辑审核策略'}
      open={open}
      onOk={() => form.submit()}
      onCancel={handleCancel}
      okText="保存"
      cancelText="取消"
      destroyOnHidden
      confirmLoading={confirmLoading}
    >
      <Form
        key={mode === 'edit' && initialValues ? `edit-${initialValues.id}` : 'create'}
        form={form}
        layout="vertical"
        onFinish={handleFinish}
      >
        <Form.Item
          label="策略名称"
          name="name"
          rules={[
            { required: true, message: '请输入策略名称' },
            { max: MAX_NAME_LENGTH, message: `策略名称不能超过 ${MAX_NAME_LENGTH} 个字符` },
          ]}
        >
          <Input placeholder="请输入策略名称" maxLength={MAX_NAME_LENGTH} showCount />
        </Form.Item>
        <Form.Item label="描述" name="description">
          <TextArea placeholder="请输入描述（可选）" rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
