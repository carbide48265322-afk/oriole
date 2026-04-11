'use client';

import React, { useState } from 'react';
import { App, Button, Card, Popconfirm, Space, Table, Tag, Empty, Spin } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MockAuditService } from '@/services/mock-audit';
import DimensionForm from '@/components/audit/DimensionForm';
import type { AuditDimension, DimensionType, UpdateDimensionDTO } from '@/types/audit';
import type { ColumnsType } from 'antd/es/table';

const DIMENSION_QUERY_KEY = ['audit-dimensions'];

const DIMENSION_TYPE_COLORS: Record<DimensionType, string> = {
  text: 'blue',
  image: 'green',
  video: 'orange',
  audio: 'purple',
};

const DIMENSION_TYPE_LABELS: Record<DimensionType, string> = {
  text: '文本',
  image: '图片',
  video: '视频',
  audio: '音频',
};

export default function AuditDimensionPage() {
  const { message } = App.useApp();
  const queryClient = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [editingDimension, setEditingDimension] = useState<AuditDimension | undefined>(undefined);

  // 获取维度列表
  const { data: dimensions = [], isLoading, error } = useQuery({
    queryKey: DIMENSION_QUERY_KEY,
    queryFn: MockAuditService.getDimensions,
    staleTime: 0,
    refetchOnWindowFocus: false,
  });

  // 创建维度
  const createMutation = useMutation({
    mutationFn: MockAuditService.createDimension,
    onSuccess: () => {
      message.success('维度创建成功');
      setFormOpen(false);
      queryClient.invalidateQueries({ queryKey: DIMENSION_QUERY_KEY });
    },
    onError: (err: Error) => {
      message.error(err.message || '创建失败');
    },
  });

  // 更新维度
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDimensionDTO }) =>
      MockAuditService.updateDimension(id, data),
    onSuccess: () => {
      message.success('维度更新成功');
      setFormOpen(false);
      setEditingDimension(undefined);
      queryClient.invalidateQueries({ queryKey: DIMENSION_QUERY_KEY });
    },
    onError: (err: Error) => {
      message.error(err.message || '更新失败');
    },
  });

  // 删除维度
  const deleteMutation = useMutation({
    mutationFn: MockAuditService.deleteDimension,
    onSuccess: () => {
      message.success('维度删除成功');
      queryClient.invalidateQueries({ queryKey: DIMENSION_QUERY_KEY });
    },
    onError: (err: Error) => {
      if (err.message.includes('关联')) {
        message.error('该维度已被策略关联，请先解除关联关系');
      } else {
        message.error(err.message || '删除失败');
      }
    },
  });

  const handleCreate = () => {
    setFormMode('create');
    setEditingDimension(undefined);
    setFormOpen(true);
  };

  const handleEdit = (record: AuditDimension) => {
    setFormMode('edit');
    setEditingDimension(record);
    setFormOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleFormSubmit = (values: { name: string; type: DimensionType; description: string }) => {
    if (formMode === 'create') {
      createMutation.mutate(values);
    } else if (editingDimension) {
      updateMutation.mutate({ id: editingDimension.id, data: values });
    }
  };

  const handleFormCancel = () => {
    setFormOpen(false);
    setEditingDimension(undefined);
  };

  const columns: ColumnsType<AuditDimension> = [
    {
      title: '维度名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: DimensionType) => (
        <Tag color={DIMENSION_TYPE_COLORS[type]}>
          {DIMENSION_TYPE_LABELS[type]}
        </Tag>
      ),
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
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
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除此维度吗？"
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

  if (error) {
    return (
      <Card>
        <Empty description="加载失败，请稍后重试" />
      </Card>
    );
  }

  return (
    <div>
      <Card
        title="审核维度管理"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            新增维度
          </Button>
        }
      >
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Spin />
          </div>
        ) : dimensions.length === 0 ? (
          <Empty description="暂无审核维度" />
        ) : (
          <Table
            columns={columns}
            dataSource={dimensions}
            rowKey="id"
            pagination={false}
            scroll={{ x: 'max-content' }}
          />
        )}
      </Card>

      <DimensionForm
        mode={formMode}
        initialValues={editingDimension}
        onSubmit={handleFormSubmit}
        onCancel={handleFormCancel}
        open={formOpen}
        confirmLoading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
}
