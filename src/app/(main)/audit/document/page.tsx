'use client';

import { useState } from 'react';
import AuditEngine from '@/components/audit-engine/AuditEngine';
import type { AuditItem } from '@/components/audit-engine/AuditEngine.types';

const MOCK_ITEMS: AuditItem[] = [
  {
    id: '1',
    type: 'text',
    title: '文章-001',
    status: 'pending',
    content: '这是一篇需要审核的文章内容，包含可能的敏感信息...',
    createdAt: '2024-01-15 08:00:00',
  },
  {
    id: '2',
    type: 'text',
    title: '评论-002',
    status: 'pending',
    content: '用户评论：这个产品真的很不错，推荐大家购买！',
    createdAt: '2024-01-15 08:30:00',
  },
  {
    id: '3',
    type: 'text',
    title: '帖子-003',
    status: 'approved',
    content: '分享一些日常生活的小确幸，感受生活的美好。',
    createdAt: '2024-01-15 09:00:00',
  },
  {
    id: '4',
    type: 'text',
    title: '私信-004',
    status: 'rejected',
    content: '包含违规内容的私信内容示例...',
    createdAt: '2024-01-15 09:30:00',
  },
  {
    id: '5',
    type: 'text',
    title: '文档-005',
    status: 'pending',
    content: '这是一份需要审核的文档，可能包含不当内容。',
    createdAt: '2024-01-15 10:00:00',
  },
  {
    id: '6',
    type: 'text',
    title: '回复-006',
    status: 'pending',
    content: '回复：感谢分享，学到了很多！',
    createdAt: '2024-01-15 10:30:00',
  },
];

export default function DocumentAuditPage() {
  const [selectedItem, setSelectedItem] = useState<AuditItem | null>(null);

  const handleSelect = (item: AuditItem) => {
    setSelectedItem(item);
  };

  const handleApprove = (id: string) => {
    console.log('通过文档审核:', id);
    // TODO: 后续接入真实 API
  };

  const handleReject = (id: string, reason: string) => {
    console.log('拒绝文档审核:', id, '原因:', reason);
    // TODO: 后续接入真实 API
  };

  const handleSearch = (keyword: string) => {
    console.log('搜索文档:', keyword);
  };

  return (
    <div style={{ height: 'calc(100vh - 64px)' }}>
      <AuditEngine
        items={MOCK_ITEMS}
        selectedItem={selectedItem}
        onSelect={handleSelect}
        onApprove={handleApprove}
        onReject={handleReject}
        onSearch={handleSearch}
      />
    </div>
  );
}
