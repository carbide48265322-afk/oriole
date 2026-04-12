/* eslint-disable no-unused-vars */
'use client';

import React, { useEffect } from 'react';
import { Form, Input, Modal, Select } from 'antd';
import type { SensitiveWord, WordCategory, WordLevel } from '@/types/sensitive-word';

export interface WordFormProps {
  mode: 'create' | 'edit';
  initialValues?: SensitiveWord;
  onSubmit: (values: { word: string; category: WordCategory; level: WordLevel }) => void;
  onCancel: () => void;
  open: boolean;
  confirmLoading?: boolean;
}

const CATEGORY_OPTIONS: { label: string; value: WordCategory }[] = [
  { label: '文字', value: 'text' },
  { label: '图片', value: 'image' },
  { label: '视频', value: 'video' },
  { label: '音频', value: 'audio' },
];

const LEVEL_OPTIONS: { label: string; value: WordLevel }[] = [
  { label: '高', value: 'high' },
  { label: '中', value: 'medium' },
  { label: '低', value: 'low' },
];

export default function WordForm({
  mode,
  initialValues,
  onSubmit,
  onCancel,
  open,
  confirmLoading = false,
}: WordFormProps) {
  const [form] = Form.useForm<{ word: string; category: WordCategory; level: WordLevel }>();

  // 当 open 或 initialValues 变化时同步表单值
  useEffect(() => {
    if (open) {
      if (initialValues) {
        form.setFieldsValue({
          word: initialValues.word,
          category: initialValues.category,
          level: initialValues.level,
        });
      } else {
        form.resetFields();
        // 新增模式下设置默认值
        form.setFieldsValue({
          word: '',
          category: undefined,
          level: undefined,
        });
      }
    }
    // 不在这里 resetFields，Modal 的 destroyOnHidden 会自动销毁表单实例
  }, [open, initialValues, form]);

  const handleFinish = (values: { word: string; category: WordCategory; level: WordLevel }) => {
    onSubmit(values);
    // 不在这里 resetFields，等弹窗关闭时再重置，避免用户看到空表单闪现
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={mode === 'create' ? '新增敏感词' : '编辑敏感词'}
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
          label="敏感词"
          name="word"
          rules={[{ required: true, message: '请输入敏感词' }]}
        >
          <Input placeholder="请输入敏感词" />
        </Form.Item>
        <Form.Item
          label="分类"
          name="category"
          rules={[{ required: true, message: '请选择分类' }]}
        >
          <Select placeholder="请选择分类" options={CATEGORY_OPTIONS} />
        </Form.Item>
        <Form.Item
          label="级别"
          name="level"
          rules={[{ required: true, message: '请选择级别' }]}
        >
          <Select placeholder="请选择级别" options={LEVEL_OPTIONS} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
