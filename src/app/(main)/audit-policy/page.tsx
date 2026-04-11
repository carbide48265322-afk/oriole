'use client';

import React, { useState } from 'react';
import { App, Button, Card, Popconfirm, Space, Table, Tag, Empty, Spin } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, LinkOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MockAuditService } from '@/services/mock-audit';
import PolicyForm from '@/components/audit/PolicyForm';
import DimensionLinker from '@/components/audit/DimensionLinker';
import type { AuditPolicy, AuditDimension, UpdatePolicyDTO } from '@/types/audit';
import type { ColumnsType } from 'antd/es/table';

const POLICY_QUERY_KEY = ['audit-policies'];
const DIMENSION_QUERY_KEY = ['audit-dimensions'];

export default function AuditPolicyPage() {
  const { message } = App.useApp();
  const queryClient = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [editingPolicy, setEditingPolicy] = useState<AuditPolicy | undefined>(undefined);
  const [linkerOpen, setLinkerOpen] = useState(false);
  const [linkingPolicy, setLinkingPolicy] = useState<AuditPolicy | undefined>(undefined);

  // 获取策略列表
  const {
    data: policies = [],
    isLoading: policiesLoading,
    error: policiesError,
  } = useQuery({
    queryKey: POLICY_QUERY_KEY,
    queryFn: MockAuditService.getPolicies,
    staleTime: 0,
    refetchOnWindowFocus: false,
  });

  // 获取维度列表（用于关联）
  const { data: dimensions = [] } = useQuery<AuditDimension[]>({
    queryKey: DIMENSION_QUERY_KEY,
    queryFn: MockAuditService.getDimensions,
    staleTime: 0,
    refetchOnWindowFocus: false,
  });

  // 创建策略
  const createMutation = useMutation({
    mutationFn: MockAuditService.createPolicy,
    onSuccess: () => {
      message.success('策略创建成功');
      setFormOpen(false);
      queryClient.invalidateQueries({ queryKey: POLICY_QUERY_KEY });
    },
    onError: (err: Error) => {
      message.error(err.message || '创建失败');
    },
  });

  // 更新策略
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePolicyDTO }) =>
      MockAuditService.updatePolicy(id, data),
    onSuccess: () => {
      message.success('策略更新成功');
      setFormOpen(false);
      setEditingPolicy(undefined);
      queryClient.invalidateQueries({ queryKey: POLICY_QUERY_KEY });
    },
    onError: (err: Error) => {
      message.error(err.message || '更新失败');
    },
  });

  // 删除策略
  const deleteMutation = useMutation({
    mutationFn: MockAuditService.deletePolicy,
    onSuccess: () => {
      message.success('策略删除成功');
      queryClient.invalidateQueries({ queryKey: POLICY_QUERY_KEY });
    },
    onError: (err: Error) => {
      message.error(err.message || '删除失败');
    },
  });

  // 关联维度
  const linkMutation = useMutation({
    mutationFn: async ({ policyId, dimensionIds }: { policyId: string; dimensionIds: string[] }) => {
      // 获取当前策略以保留 name 和 description
      const currentPolicies = await MockAuditService.getPolicies();
      const currentPolicy = currentPolicies.find(p => p.id === policyId);
      if (!currentPolicy) {
        throw new Error('策略不存在');
      }
      return MockAuditService.updatePolicy(policyId, {
        name: currentPolicy.name,
        description: currentPolicy.description,
        dimensions: dimensionIds,
      });
    },
    onSuccess: () => {
      message.success('维度关联成功');
      setLinkerOpen(false);
      setLinkingPolicy(undefined);
      queryClient.invalidateQueries({ queryKey: POLICY_QUERY_KEY });
    },
    onError: (err: Error) => {
      message.error(err.message || '关联失败');
    },
  });

  const handleCreate = () => {
    setFormMode('create');
    setEditingPolicy(undefined);
    setFormOpen(true);
  };

  const handleEdit = (record: AuditPolicy) => {
    setFormMode('edit');
    setEditingPolicy(record);
    setFormOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleLinkDimension = (record: AuditPolicy) => {
    setLinkingPolicy(record);
    setLinkerOpen(true);
  };

  const handleFormSubmit = async (values: { name: string; description: string }) => {
    if (formMode === 'create') {
      createMutation.mutateAsync(values).catch(() => {
        // 错误已在 mutation 的 onError 中处理
      });
    } else if (editingPolicy) {
      updateMutation.mutateAsync({ id: editingPolicy.id, data: values }).catch(() => {
        // 错误已在 mutation 的 onError 中处理
      });
    }
  };

  const handleFormCancel = () => {
    setFormOpen(false);
    setEditingPolicy(undefined);
  };

  const handleLinkConfirm = (dimensionIds: string[]) => {
    if (linkingPolicy) {
      linkMutation.mutate({ policyId: linkingPolicy.id, dimensionIds });
    }
  };

  const handleLinkCancel = () => {
    setLinkerOpen(false);
    setLinkingPolicy(undefined);
  };

  const getDimensionName = (dimensionId: string): string => {
    const dimension = dimensions.find((d) => d.id === dimensionId);
    return dimension ? dimension.name : dimensionId;
  };

  const columns: ColumnsType<AuditPolicy> = [
    {
      title: '策略名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '关联维度',
      dataIndex: 'dimensions',
      key: 'dimensions',
      render: (dimensionIds: string[]) => (
        <Space wrap>
          {dimensionIds.length === 0 ? (
            <span style={{ color: '#999' }}>未关联</span>
          ) : (
            dimensionIds.map((id) => <Tag key={id}>{getDimensionName(id)}</Tag>)
          )}
        </Space>
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
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button
            type="link"
            icon={<LinkOutlined />}
            onClick={() => handleLinkDimension(record)}
          >
            关联维度
          </Button>
          <Popconfirm
            title="确定要删除此策略吗？"
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

  if (policiesError) {
    return (
      <Card>
        <Empty description="加载失败，请稍后重试" />
      </Card>
    );
  }

  return (
    <div>
      <Card
        title="审核策略管理"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            新增策略
          </Button>
        }
      >
        {policiesLoading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Spin />
          </div>
        ) : policies.length === 0 ? (
          <Empty description="暂无审核策略" />
        ) : (
          <Table
            columns={columns}
            dataSource={policies}
            rowKey="id"
            pagination={false}
            scroll={{ x: 'max-content' }}
          />
        )}
      </Card>

      <PolicyForm
        mode={formMode}
        initialValues={editingPolicy}
        onSubmit={handleFormSubmit}
        onCancel={handleFormCancel}
        open={formOpen}
        confirmLoading={createMutation.isPending || updateMutation.isPending}
      />

      {linkingPolicy && linkerOpen && (
        <DimensionLinker
          dimensions={dimensions}
          selectedIds={linkingPolicy.dimensions}
          onConfirm={handleLinkConfirm}
          onCancel={handleLinkCancel}
          open={linkerOpen}
          confirmLoading={linkMutation.isPending}
        />
      )}
    </div>
  );
}
