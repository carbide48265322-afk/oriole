'use client';

import { useState } from 'react';
import { Button, Card, Empty, Input, Space, Typography, Tag } from 'antd';
import type { AuditItemStatus, AuditWorkspaceProps } from './AuditEngine.types';

const { Text } = Typography;
const { TextArea } = Input;

const STATUS_CONFIG: Record<AuditItemStatus, { color: string; label: string }> = {
  pending: { color: 'orange', label: '待审核' },
  approved: { color: 'green', label: '已通过' },
  rejected: { color: 'red', label: '已拒绝' },
};

export default function AuditWorkspace({
  item,
  onApprove,
  onReject,
}: AuditWorkspaceProps) {
  const [rejectReason, setRejectReason] = useState('');

  if (!item) {
    return (
      <div
        style={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Empty description="请选择审核项" />
      </div>
    );
  }

  const statusInfo = STATUS_CONFIG[item.status];

  return (
    <div style={{ height: '100%', padding: 16, overflow: 'auto' }}>
      {/* 审核信息 */}
      <Card size="small" title="审核信息" style={{ marginBottom: 16 }}>
        <Space orientation="vertical" size="small" style={{ width: '100%' }}>
          <div>
            <Text strong>标题：</Text>
            <Text>{item.title}</Text>
          </div>
          <div>
            <Text strong>类型：</Text>
            <Text>{item.type}</Text>
          </div>
          <div>
            <Text strong>状态：</Text>
            <Tag color={statusInfo.color}>{statusInfo.label}</Tag>
          </div>
          <div>
            <Text strong>创建时间：</Text>
            <Text>{item.createdAt}</Text>
          </div>
        </Space>
      </Card>

      {/* 审核备注 */}
      <Card size="small" title="审核备注" style={{ marginBottom: 16 }}>
        <TextArea
          rows={4}
          placeholder="请输入审核备注（选填）"
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
        />
      </Card>

      {/* 审核操作 */}
      <Space orientation="vertical" style={{ width: '100%' }}>
        <Button type="primary" block onClick={() => onApprove(item.id)}>
          通过
        </Button>
        <Button
          danger
          block
          onClick={() => onReject(item.id, rejectReason)}
        >
          拒绝
        </Button>
      </Space>
    </div>
  );
}
