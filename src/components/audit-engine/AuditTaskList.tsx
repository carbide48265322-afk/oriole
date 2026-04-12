'use client';

import { useState, useMemo } from 'react';
import { List, Input, Tag, Empty, Typography } from 'antd';
import type { AuditTaskListProps, AuditItem } from './AuditEngine.types';

const { Text } = Typography;

const STATUS_CONFIG: Record<
  AuditItem['status'],
  { color: string; label: string }
> = {
  pending: { color: 'orange', label: '待审核' },
  approved: { color: 'green', label: '已通过' },
  rejected: { color: 'red', label: '已拒绝' },
};

const TYPE_LABELS: Record<AuditItem['type'], string> = {
  image: '图片',
  video: '视频',
  audio: '音频',
  text: '文本',
};

export default function AuditTaskList({
  items,
  selectedItem,
  onSelect,
  onSearch,
}: AuditTaskListProps) {
  const [keyword, setKeyword] = useState('');

  const filteredItems = useMemo(() => {
    if (!keyword) return items;
    return items.filter((item) =>
      item.title.toLowerCase().includes(keyword.toLowerCase()),
    );
  }, [items, keyword]);

  const handleSearch = (value: string) => {
    setKeyword(value);
    onSearch?.(value);
  };

  if (items.length === 0) {
    return <Empty description="暂无待审核内容" />;
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '8px 0' }}>
        <Input.Search
          placeholder="搜索审核项"
          value={keyword}
          onChange={(e) => handleSearch(e.target.value)}
          allowClear
        />
      </div>
      <List
        dataSource={filteredItems}
        style={{ flex: 1, overflow: 'auto' }}
        renderItem={(item: AuditItem) => (
          <List.Item
            onClick={() => onSelect(item)}
            style={{
              cursor: 'pointer',
              padding: '12px 16px',
              background: selectedItem?.id === item.id ? '#e6f4ff' : 'transparent',
              borderBottom: '1px solid #f0f0f0',
            }}
          >
            <div style={{ width: '100%' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 4,
                }}
              >
                <Text strong>{item.title}</Text>
                <Tag color={STATUS_CONFIG[item.status].color}>
                  {STATUS_CONFIG[item.status].label}
                </Tag>
              </div>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {TYPE_LABELS[item.type]}
              </Text>
            </div>
          </List.Item>
        )}
      />
    </div>
  );
}
