'use client';

import { useState, useMemo, useRef } from 'react';
import { Input, Tag, Empty, Typography, Button } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { useVirtualizer } from '@tanstack/react-virtual';
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
  document: '文档',
};

export default function AuditTaskList({
  items,
  selectedItem,
  onSelect,
  onSearch,
  collapsed = false,
  onToggleCollapse,
}: AuditTaskListProps & { onToggleCollapse?: () => void }) {
  const [keyword, setKeyword] = useState('');
  const scrollElementRef = useRef<HTMLDivElement>(null);

  const filteredItems = useMemo<AuditItem[]>(() => {
    if (!keyword) return items;
    return items.filter((item) =>
      item.title.toLowerCase().includes(keyword.toLowerCase()),
    );
  }, [items, keyword]);

  const handleSearch = (value: string) => {
    setKeyword(value);
    onSearch?.(value);
  };

  const virtualizer = useVirtualizer({
    count: filteredItems.length,
    getScrollElement: () => scrollElementRef.current,
    estimateSize: () => 60,
    overscan: 5,
  });

  if (items.length === 0) {
    return <Empty description="暂无待审核内容" />;
  }

  // 收起状态：只显示图标列表
  if (collapsed) {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* 收起状态下的展开按钮 */}
        {onToggleCollapse && (
          <div style={{ padding: '8px', display: 'flex', justifyContent: 'center' }}>
            <Button
              type="text"
              icon={<MenuUnfoldOutlined />}
              onClick={onToggleCollapse}
              size="small"
            />
          </div>
        )}
        <div style={{ flex: 1, overflow: 'auto', padding: '8px 0' }}>
          {filteredItems.map((item) => {
            const isSelected = selectedItem?.id === item.id;
            return (
              <div
                key={item.id}
                data-testid="audit-list-item"
                onClick={() => onSelect(item)}
                style={{
                  padding: '12px 8px',
                  background: isSelected ? '#e6f4ff' : 'transparent',
                  borderBottom: '1px solid #f0f0f0',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Tag color={STATUS_CONFIG[item.status].color}>
                  {TYPE_LABELS[item.type].charAt(0)}
                </Tag>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* 搜索框和收缩按钮 */}
      <div style={{ padding: '8px', display: 'flex', alignItems: 'center', gap: 8, minHeight: 40 }}>
        <Input.Search
          placeholder="搜索审核项"
          value={keyword}
          onChange={(e) => handleSearch(e.target.value)}
          allowClear
          style={{ flex: 1, minWidth: 0 }}
        />
        {onToggleCollapse && (
          <Button
            type="text"
            icon={<MenuFoldOutlined />}
            onClick={onToggleCollapse}
            size="small"
            style={{ flexShrink: 0 }}
          />
        )}
      </div>
      <div ref={scrollElementRef} style={{ flex: 1, overflow: 'auto' }}>
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {virtualizer.getVirtualItems().map((virtualRow) => {
            const item = filteredItems[virtualRow.index];
            const isSelected = selectedItem?.id === item.id;

            return (
              <div
                key={item.id}
                data-testid="audit-list-item"
                data-index={virtualRow.index}
                ref={virtualizer.measureElement}
                onClick={() => onSelect(item)}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  transform: `translateY(${virtualRow.start}px)`,
                  padding: '12px 16px',
                  background: isSelected ? '#e6f4ff' : 'transparent',
                  borderBottom: '1px solid #f0f0f0',
                  cursor: 'pointer',
                }}
              >
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
            );
          })}
        </div>
      </div>
    </div>
  );
}
