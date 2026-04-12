'use client';

import { useState } from 'react';
import AuditEngine from '@/components/audit-engine/AuditEngine';
import type { AuditItem } from '@/components/audit-engine/AuditEngine.types';

const MOCK_ITEMS: AuditItem[] = [
  {
    id: '1',
    type: 'image',
    title: '用户上传图片-001',
    status: 'pending',
    content: 'https://example.com/images/001.jpg',
    createdAt: '2024-01-15 10:30:00',
  },
  {
    id: '2',
    type: 'image',
    title: '用户上传图片-002',
    status: 'pending',
    content: 'https://example.com/images/002.jpg',
    createdAt: '2024-01-15 11:00:00',
  },
  {
    id: '3',
    type: 'image',
    title: '商品图片-003',
    status: 'approved',
    content: 'https://example.com/images/003.jpg',
    createdAt: '2024-01-15 11:30:00',
  },
  {
    id: '4',
    type: 'image',
    title: '头像图片-004',
    status: 'rejected',
    content: 'https://example.com/images/004.jpg',
    createdAt: '2024-01-15 12:00:00',
  },
  {
    id: '5',
    type: 'image',
    title: 'Banner图片-005',
    status: 'pending',
    content: 'https://example.com/images/005.jpg',
    createdAt: '2024-01-15 12:30:00',
  },
  {
    id: '6',
    type: 'image',
    title: '缩略图-006',
    status: 'pending',
    content: 'https://example.com/images/006.jpg',
    createdAt: '2024-01-15 13:00:00',
  },
];

export default function ImageAuditPage() {
  const [selectedItem, setSelectedItem] = useState<AuditItem | null>(null);

  const handleSelect = (item: AuditItem) => {
    setSelectedItem(item);
  };

  const handleApprove = (id: string) => {
    console.log('通过图片审核:', id);
    // TODO: 后续接入真实 API
  };

  const handleReject = (id: string, reason: string) => {
    console.log('拒绝图片审核:', id, '原因:', reason);
    // TODO: 后续接入真实 API
  };

  const handleSearch = (keyword: string) => {
    console.log('搜索图片:', keyword);
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
