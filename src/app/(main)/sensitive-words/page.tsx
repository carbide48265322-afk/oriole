'use client';

import React, { useState, useMemo } from 'react';
import { App, Button, Input, Popconfirm, Select, Space, Table, Tabs, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { ColumnsType } from 'antd/es/table';
import type { TabsProps } from 'antd';
import MockSensitiveWordService from '@/services/mock-sensitive-word';
import type { SensitiveWord, WordCategory, WordStatus, CreateWordDTO, UpdateWordDTO } from '@/types/sensitive-word';
import { WORD_CATEGORY_LABELS, WORD_STATUS_LABELS } from '@/types/sensitive-word';
import StatCards from '@/components/sensitive-word/StatCards';
import WordForm from '@/components/sensitive-word/WordForm';

const WORDS_QUERY_KEY = ['sensitive-words'];
const STATS_QUERY_KEY = ['sensitive-word-stats'];

type ActiveTab = 'parent' | 'variant';

const CATEGORY_OPTIONS: { label: string; value: WordCategory | 'all' }[] = [
  { label: '全部分类', value: 'all' },
  ...Object.entries(WORD_CATEGORY_LABELS).map(([value, label]) => ({
    label,
    value: value as WordCategory,
  })),
];

const CATEGORY_TAG_COLOR: Record<WordCategory, string> = {
  politics: 'red',
  violence: 'orange',
  porn: 'magenta',
  ad: 'cyan',
  abuse: 'gold',
  other: 'default',
};

const LEVEL_TAG_COLOR: Record<SensitiveWord['level'], string> = {
  high: 'red',
  medium: 'gold',
  low: 'green',
};

const LEVEL_LABEL: Record<SensitiveWord['level'], string> = {
  high: '高',
  medium: '中',
  low: '低',
};

const TAB_ITEMS: TabsProps['items'] = [
  { key: 'parent', label: '母词库' },
  { key: 'variant', label: '变体词库' },
];

const STATUS_OPTIONS: { label: string; value: WordStatus }[] = Object.entries(WORD_STATUS_LABELS).map(
  ([value, label]) => ({
    label,
    value: value as WordStatus,
  })
);

type FormInitialValues =
  | SensitiveWord
  | { type: 'variant'; parentWordId: string }
  | undefined;

export default function SensitiveWordsPage() {
  const { message } = App.useApp();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<ActiveTab>('parent');
  const [searchText, setSearchText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<WordCategory | 'all'>('all');
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [editingWord, setEditingWord] = useState<FormInitialValues>(undefined);

  // 获取敏感词列表
  const {
    data: words = [],
    isLoading: wordsLoading,
    error: wordsError,
  } = useQuery({
    queryKey: WORDS_QUERY_KEY,
    queryFn: () => MockSensitiveWordService.getWords(),
    staleTime: 0,
    refetchOnWindowFocus: false,
  });

  // 获取统计数据
  const {
    data: stats = {
      total: 0,
      todayAdded: 0,
      enabled: 0,
      pending: 0,
      disabled: 0,
    },
  } = useQuery({
    queryKey: STATS_QUERY_KEY,
    queryFn: () => MockSensitiveWordService.getStats(),
    staleTime: 0,
    refetchOnWindowFocus: false,
  });

  // 创建敏感词
  const createMutation = useMutation({
    mutationFn: (dto: CreateWordDTO) => MockSensitiveWordService.createWord(dto),
    onSuccess: () => {
      message.success('敏感词创建成功');
      setFormOpen(false);
      queryClient.invalidateQueries({ queryKey: WORDS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: STATS_QUERY_KEY });
    },
    onError: (err: Error) => {
      message.error(err.message || '创建失败');
    },
  });

  // 更新敏感词
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateWordDTO }) =>
      MockSensitiveWordService.updateWord(id, data),
    onSuccess: () => {
      message.success('敏感词更新成功');
      setFormOpen(false);
      setEditingWord(undefined);
      queryClient.invalidateQueries({ queryKey: WORDS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: STATS_QUERY_KEY });
    },
    onError: (err: Error) => {
      message.error(err.message || '更新失败');
    },
  });

  // 删除敏感词
  const deleteMutation = useMutation({
    mutationFn: (id: string) => MockSensitiveWordService.deleteWord(id),
    onSuccess: () => {
      message.success('敏感词删除成功');
      queryClient.invalidateQueries({ queryKey: WORDS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: STATS_QUERY_KEY });
    },
    onError: (err: Error) => {
      message.error(err.message || '删除失败');
    },
  });

  // 更新状态
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: WordStatus }) =>
      MockSensitiveWordService.updateStatus(id, status),
    onSuccess: () => {
      message.success('状态更新成功');
      queryClient.invalidateQueries({ queryKey: WORDS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: STATS_QUERY_KEY });
    },
    onError: (err: Error) => {
      message.error(err.message || '状态更新失败');
    },
  });

  // 根据 Tab 和筛选条件过滤数据
  const filteredWords = useMemo(() => {
    return words.filter((word) => {
      const matchTab = word.type === activeTab;
      const matchSearch =
        !searchText || word.word.toLowerCase().includes(searchText.toLowerCase());
      const matchCategory = categoryFilter === 'all' || word.category === categoryFilter;
      return matchTab && matchSearch && matchCategory;
    });
  }, [words, activeTab, searchText, categoryFilter]);

  // 获取母词内容的辅助函数
  const getParentWord = (parentWordId?: string): string => {
    if (!parentWordId) return '-';
    const parent = words.find((w) => w.id === parentWordId);
    return parent?.word || '-';
  };

  const handleEdit = (record: SensitiveWord) => {
    setFormMode('edit');
    setEditingWord(record);
    setFormOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleCreateVariant = (parentWordId: string) => {
    setFormMode('create');
    setEditingWord({ type: 'variant', parentWordId });
    setFormOpen(true);
  };

  const handleFormSubmit = (values: CreateWordDTO) => {
    if (formMode === 'create') {
      createMutation.mutateAsync(values).catch(() => {
        // 错误已在 mutation 的 onError 中处理
      });
    } else if (editingWord && 'id' in editingWord) {
      updateMutation.mutateAsync({ id: editingWord.id, data: values }).catch(() => {
        // 错误已在 mutation 的 onError 中处理
      });
    }
  };

  const handleFormCancel = () => {
    setFormOpen(false);
    setEditingWord(undefined);
  };

  const handleTabChange = (key: string) => {
    setActiveTab(key as ActiveTab);
    setSearchText('');
    setCategoryFilter('all');
  };

  const columns: ColumnsType<SensitiveWord> = [
    {
      title: '敏感词',
      dataIndex: 'word',
      key: 'word',
      ellipsis: true,
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      render: (category: WordCategory) => (
        <Tag color={CATEGORY_TAG_COLOR[category]}>{WORD_CATEGORY_LABELS[category]}</Tag>
      ),
    },
    {
      title: '级别',
      dataIndex: 'level',
      key: 'level',
      render: (level: SensitiveWord['level']) => (
        <Tag color={LEVEL_TAG_COLOR[level]}>{LEVEL_LABEL[level]}</Tag>
      ),
    },
    ...(activeTab === 'variant'
      ? [
          {
            title: '母词',
            dataIndex: 'parentWordId',
            key: 'parentWord',
            render: (parentWordId: string | undefined) => (
              <span>{getParentWord(parentWordId)}</span>
            ),
          } as const,
        ]
      : []),
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: WordStatus, record: SensitiveWord) => (
        <Select
          value={status}
          style={{ width: 100 }}
          options={STATUS_OPTIONS}
          onChange={(newStatus) => handleStatusChange(record.id, newStatus)}
          loading={updateStatusMutation.isPending}
        />
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleString('zh-CN'),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          {record.type === 'parent' && (
            <Button
              type="link"
              icon={<PlusCircleOutlined />}
              onClick={() => handleCreateVariant(record.id)}
            >
              创建变体词条
            </Button>
          )}
          <Popconfirm
            title="确定要删除此敏感词吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />} loading={deleteMutation.isPending}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleStatusChange = (id: string, status: WordStatus) => {
    updateStatusMutation.mutate({ id, status });
  };

  if (wordsError) {
    return (
      <div style={{ padding: 24 }}>
        <App>
          <div>加载失败，请稍后重试</div>
        </App>
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      {/* 统计卡片区域 */}
      <StatCards stats={stats} />

      {/* Tab 切换 */}
      <Tabs activeKey={activeTab} items={TAB_ITEMS} onChange={handleTabChange} style={{ marginTop: 24 }} />

      {/* 搜索和操作栏 */}
      <div style={{ marginBottom: 16, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <Input.Search
          placeholder="搜索敏感词"
          allowClear
          style={{ width: 240 }}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Select
          placeholder="分类筛选"
          style={{ width: 160 }}
          value={categoryFilter}
          onChange={(value) => setCategoryFilter(value)}
          options={CATEGORY_OPTIONS}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setFormMode('create');
            setEditingWord(undefined);
            setFormOpen(true);
          }}
        >
          新增
        </Button>
      </div>

      {/* CRUD 表格 */}
      <Table
        columns={columns}
        dataSource={filteredWords}
        rowKey="id"
        loading={wordsLoading}
        pagination={{ pageSize: 10, showSizeChanger: false }}
        scroll={{ x: 'max-content' }}
      />

      {/* 新增/编辑表单 */}
      <WordForm
        mode={formMode}
        initialValues={editingWord}
        onSubmit={handleFormSubmit}
        onCancel={handleFormCancel}
        open={formOpen}
        confirmLoading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
}
