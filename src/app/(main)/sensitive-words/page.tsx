'use client';

import React, { useState, useMemo } from 'react';
import { App, Button, Input, Popconfirm, Select, Space, Switch, Table, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { ColumnsType } from 'antd/es/table';
import MockSensitiveWordService from '@/services/mock-sensitive-word';
import type { SensitiveWord, WordCategory, WordLevel, CreateWordDTO, UpdateWordDTO } from '@/types/sensitive-word';
import StatCards from '@/components/sensitive-word/StatCards';
import WordForm from '@/components/sensitive-word/WordForm';

const WORDS_QUERY_KEY = ['sensitive-words'];
const STATS_QUERY_KEY = ['sensitive-word-stats'];

const CATEGORY_OPTIONS: { label: string; value: WordCategory | 'all' }[] = [
  { label: '全部分类', value: 'all' },
  { label: '文字', value: 'text' },
  { label: '图片', value: 'image' },
  { label: '视频', value: 'video' },
  { label: '音频', value: 'audio' },
];

const CATEGORY_TAG_COLOR: Record<WordCategory, string> = {
  text: 'blue',
  image: 'green',
  video: 'orange',
  audio: 'purple',
};

const CATEGORY_LABEL: Record<WordCategory, string> = {
  text: '文字',
  image: '图片',
  video: '视频',
  audio: '音频',
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

export default function SensitiveWordsPage() {
  const { message } = App.useApp();
  const queryClient = useQueryClient();

  const [searchText, setSearchText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<WordCategory | 'all'>('all');
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [editingWord, setEditingWord] = useState<SensitiveWord | undefined>(undefined);

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
      byCategory: { text: 0, image: 0, video: 0, audio: 0 },
      byLevel: { high: 0, medium: 0, low: 0 },
      enabled: 0,
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

  // 切换启用/禁用状态
  const toggleMutation = useMutation({
    mutationFn: (id: string) => MockSensitiveWordService.toggleEnabled(id),
    onSuccess: () => {
      message.success('状态更新成功');
      queryClient.invalidateQueries({ queryKey: WORDS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: STATS_QUERY_KEY });
    },
    onError: (err: Error) => {
      message.error(err.message || '状态更新失败');
    },
  });

  // 搜索和筛选
  const filteredWords = useMemo(() => {
    return words.filter((word) => {
      const matchSearch =
        !searchText || word.word.toLowerCase().includes(searchText.toLowerCase());
      const matchCategory = categoryFilter === 'all' || word.category === categoryFilter;
      return matchSearch && matchCategory;
    });
  }, [words, searchText, categoryFilter]);

  const handleCreate = () => {
    setFormMode('create');
    setEditingWord(undefined);
    setFormOpen(true);
  };

  const handleEdit = (record: SensitiveWord) => {
    setFormMode('edit');
    setEditingWord(record);
    setFormOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleToggleEnabled = (id: string, _checked: boolean) => {
    toggleMutation.mutate(id);
  };

  const handleFormSubmit = (values: { word: string; category: WordCategory; level: WordLevel }) => {
    if (formMode === 'create') {
      createMutation.mutateAsync(values).catch(() => {
        // 错误已在 mutation 的 onError 中处理
      });
    } else if (editingWord) {
      updateMutation.mutateAsync({ id: editingWord.id, data: values }).catch(() => {
        // 错误已在 mutation 的 onError 中处理
      });
    }
  };

  const handleFormCancel = () => {
    setFormOpen(false);
    setEditingWord(undefined);
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
        <Tag color={CATEGORY_TAG_COLOR[category]}>{CATEGORY_LABEL[category]}</Tag>
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
    {
      title: '状态',
      dataIndex: 'enabled',
      key: 'enabled',
      render: (enabled: boolean, record: SensitiveWord) => (
        <Switch
          checked={enabled}
          onChange={(checked) => handleToggleEnabled(record.id, checked)}
          loading={toggleMutation.isPending}
          checkedChildren="启用"
          unCheckedChildren="禁用"
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
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
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
