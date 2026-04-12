'use client';

import React, { useEffect, useState } from 'react';
import { Form, Input, Modal, Radio, Select } from 'antd';
import type { SensitiveWord, WordCategory, WordType, WordStatus, CreateWordDTO } from '@/types/sensitive-word';
import { WORD_CATEGORY_LABELS, WORD_STATUS_LABELS } from '@/types/sensitive-word';
import MockSensitiveWordService from '@/services/mock-sensitive-word';

export interface WordFormProps {
  mode: 'create' | 'edit';
  initialValues?: SensitiveWord | { type: WordType; parentWordId: string };
  // eslint-disable-next-line no-unused-vars
  onSubmit: (values: CreateWordDTO) => void;
  onCancel: () => void;
  open: boolean;
  confirmLoading?: boolean;
}

const CATEGORY_OPTIONS: { label: string; value: WordCategory }[] = Object.entries(WORD_CATEGORY_LABELS).map(
  ([value, label]) => ({
    label,
    value: value as WordCategory,
  })
);

const TYPE_OPTIONS: { label: string; value: WordType }[] = [
  { label: '母词', value: 'parent' },
  { label: '变体', value: 'variant' },
];

const LEVEL_OPTIONS: { label: string; value: CreateWordDTO['level'] }[] = [
  { label: '高', value: 'high' },
  { label: '中', value: 'medium' },
  { label: '低', value: 'low' },
];

const STATUS_OPTIONS: { label: string; value: WordStatus }[] = Object.entries(WORD_STATUS_LABELS).map(
  ([value, label]) => ({
    label,
    value: value as WordStatus,
  })
);

interface FormValues {
  word: string;
  category: WordCategory;
  type: WordType;
  parentWordId?: string;
  level: CreateWordDTO['level'];
  status: WordStatus;
}

export default function WordForm({
  mode,
  initialValues,
  onSubmit,
  onCancel,
  open,
  confirmLoading = false,
}: WordFormProps) {
  const [form] = Form.useForm<FormValues>();
  const [parentWords, setParentWords] = useState<SensitiveWord[]>([]);
  const [currentType, setCurrentType] = useState<WordType>('parent');
  const [isVariantCreation, setIsVariantCreation] = useState(false);

  // 判断是否是变体创建模式
  useEffect(() => {
    if (open && initialValues && 'parentWordId' in initialValues) {
      setIsVariantCreation(true);
      setCurrentType('variant');
    } else {
      setIsVariantCreation(false);
    }
  }, [open, initialValues]);

  // 加载母词列表
  useEffect(() => {
    if (open) {
      MockSensitiveWordService.getParentWords()
        .then((words) => setParentWords(words))
        .catch(() => setParentWords([]));
    }
  }, [open]);

  // 当 open 或 initialValues 变化时同步表单值
  useEffect(() => {
    if (open) {
      if (initialValues && 'word' in initialValues) {
        // 编辑模式
        setCurrentType(initialValues.type);
        form.setFieldsValue({
          word: initialValues.word,
          category: initialValues.category,
          type: initialValues.type,
          parentWordId: initialValues.parentWordId,
          level: initialValues.level,
          status: initialValues.status,
        });
      } else if (initialValues && 'parentWordId' in initialValues) {
        // 创建变体模式
        setCurrentType('variant');
        form.setFieldsValue({
          word: '',
          category: undefined,
          type: 'variant',
          parentWordId: initialValues.parentWordId,
          level: undefined,
          status: 'enabled',
        });
      } else {
        form.resetFields();
        setCurrentType('parent');
        // 新增模式下设置默认值
        form.setFieldsValue({
          word: '',
          category: undefined,
          type: 'parent',
          parentWordId: undefined,
          level: undefined,
          status: 'enabled',
        });
      }
    }
  }, [open, initialValues, form]);

  const handleFinish = (values: FormValues) => {
    const dto: CreateWordDTO = {
      word: values.word,
      category: values.category,
      type: values.type,
      parentWordId: values.type === 'variant' ? values.parentWordId : undefined,
      level: values.level,
      status: values.status,
    };
    onSubmit(dto);
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const handleTypeChange = (e: Parameters<NonNullable<Parameters<typeof Radio.Group>[0]['onChange']>>[0]) => {
    const newType = e.target.value as WordType;
    setCurrentType(newType);
    if (newType === 'parent') {
      form.setFieldsValue({ parentWordId: undefined });
    }
  };

  const parentWordOptions = parentWords.map((word) => ({
    label: word.word,
    value: word.id,
  }));

  return (
    <Modal
      title={
        isVariantCreation
          ? '创建变体词条'
          : mode === 'create'
            ? '新增敏感词'
            : '编辑敏感词'
      }
      open={open}
      onOk={() => form.submit()}
      onCancel={handleCancel}
      okText="保存"
      cancelText="取消"
      destroyOnHidden
      confirmLoading={confirmLoading}
    >
      <Form
        key={
          mode === 'edit' && initialValues && 'id' in initialValues
            ? `edit-${initialValues.id}`
            : isVariantCreation && initialValues && 'parentWordId' in initialValues
              ? `variant-${initialValues.parentWordId}`
              : 'create'
        }
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{ type: 'parent', status: 'enabled' }}
      >
        <Form.Item
          label="类型"
          name="type"
          rules={[{ required: true, message: '请选择类型' }]}
        >
          <Radio.Group
            options={TYPE_OPTIONS}
            onChange={handleTypeChange}
            disabled={isVariantCreation}
          />
        </Form.Item>

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

        <Form.Item
          label="状态"
          name="status"
          rules={[{ required: true, message: '请选择状态' }]}
        >
          <Select placeholder="请选择状态" options={STATUS_OPTIONS} />
        </Form.Item>

        {currentType === 'variant' && (
          <Form.Item
            label="母词"
            name="parentWordId"
            rules={[{ required: true, message: '请选择母词' }]}
          >
            <Select
              placeholder="请选择母词"
              options={parentWordOptions}
              showSearch
              optionFilterProp="label"
              disabled={isVariantCreation}
            />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
}
