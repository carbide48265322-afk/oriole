/* eslint-disable no-unused-vars */
'use client';

import React, { useEffect } from 'react';
import { Form, Input, Modal, Select } from 'antd';
import type { AuditDimension, DimensionType } from '@/types/audit';

const { TextArea } = Input;

export interface DimensionFormProps {
  mode: 'create' | 'edit';
  initialValues?: AuditDimension;
  onSubmit: ({ name, type, description }: { name: string; type: DimensionType; description: string }) => void;
  onCancel: () => void;
  open: boolean;
  confirmLoading?: boolean;
}

const DIMENSION_TYPE_OPTIONS: { label: string; value: DimensionType }[] = [
  { label: '文本', value: 'text' },
  { label: '图片', value: 'image' },
  { label: '视频', value: 'video' },
  { label: '音频', value: 'audio' },
];

export default function DimensionForm({
  mode,
  initialValues,
  onSubmit,
  onCancel,
  open,
  confirmLoading = false,
}: DimensionFormProps) {
  const [form] = Form.useForm<{ name: string; type: DimensionType; description: string }>();

  // 当 open 或 initialValues 变化时同步表单值
  useEffect(() => {
    if (open) {
      if (initialValues) {
        form.setFieldsValue({
          name: initialValues.name,
          type: initialValues.type,
          description: initialValues.description,
        });
      } else {
        form.resetFields();
        // 新增模式下设置默认值
        form.setFieldsValue({
          name: '',
          type: undefined,
          description: '',
        });
      }
    }
    // 不在这里 resetFields，Modal 的 destroyOnHidden 会自动销毁表单实例
  }, [open, initialValues, form]);

  const handleFinish = (values: { name: string; type: DimensionType; description: string }) => {
    onSubmit(values);
    // 不在这里 resetFields，等弹窗关闭时再重置，避免用户看到空表单闪现
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={mode === 'create' ? '新增审核维度' : '编辑审核维度'}
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
          label="维度名称"
          name="name"
          rules={[{ required: true, message: '请输入维度名称' }]}
        >
          <Input placeholder="请输入维度名称" />
        </Form.Item>
        <Form.Item
          label="维度类型"
          name="type"
          rules={[{ required: true, message: '请选择维度类型' }]}
        >
          <Select placeholder="请选择维度类型" options={DIMENSION_TYPE_OPTIONS} />
        </Form.Item>
        <Form.Item label="描述" name="description">
          <TextArea placeholder="请输入描述（可选）" rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
