'use client';

import { useState } from 'react';
import AuditEngine from '@/components/audit-engine/AuditEngine';
import type { AuditItem } from '@/components/audit-engine/AuditEngine.types';

const MOCK_ITEMS: AuditItem[] = [
  {
    id: '1',
    type: 'audio',
    title: '语音消息-001',
    status: 'pending',
    content: 'https://example.com/audios/001.mp3',
    createdAt: '2024-01-15 10:00:00',
    previewData: {
      type: 'audio',
      url: 'https://example.com/audios/001.mp3',
      title: '语音消息-001',
    },
  },
  {
    id: '2',
    type: 'audio',
    title: '播客片段-002',
    status: 'pending',
    content: 'https://example.com/audios/002.mp3',
    createdAt: '2024-01-15 10:30:00',
    previewData: {
      type: 'audio',
      url: 'https://example.com/audios/002.mp3',
      title: '播客片段-002',
    },
  },
  {
    id: '3',
    type: 'audio',
    title: '背景音乐-003',
    status: 'approved',
    content: 'https://example.com/audios/003.mp3',
    createdAt: '2024-01-15 11:00:00',
    previewData: {
      type: 'audio',
      url: 'https://example.com/audios/003.mp3',
      title: '背景音乐-003',
    },
  },
  {
    id: '4',
    type: 'audio',
    title: '语音评论-004',
    status: 'rejected',
    content: 'https://example.com/audios/004.mp3',
    createdAt: '2024-01-15 11:30:00',
    previewData: {
      type: 'audio',
      url: 'https://example.com/audios/004.mp3',
      title: '语音评论-004',
    },
  },
  {
    id: '5',
    type: 'audio',
    title: '课程录音-005',
    status: 'pending',
    content: 'https://example.com/audios/005.mp3',
    createdAt: '2024-01-15 12:00:00',
    previewData: {
      type: 'audio',
      url: 'https://example.com/audios/005.mp3',
      title: '课程录音-005',
    },
  },
  {
    id: '6',
    type: 'audio',
    title: '会议录音-006',
    status: 'pending',
    content: 'https://example.com/audios/006.mp3',
    createdAt: '2024-01-15 12:30:00',
    previewData: {
      type: 'audio',
      url: 'https://example.com/audios/006.mp3',
      title: '会议录音-006',
    },
  },
  {
    id: '7',
    type: 'audio',
    title: '语音通知-007',
    status: 'approved',
    content: 'https://example.com/audios/007.mp3',
    createdAt: '2024-01-15 13:00:00',
    previewData: {
      type: 'audio',
      url: 'https://example.com/audios/007.mp3',
      title: '语音通知-007',
    },
  },
];

export default function AudioAuditPage() {
  const [selectedItem, setSelectedItem] = useState<AuditItem | null>(null);

  const handleSelect = (item: AuditItem) => {
    setSelectedItem(item);
  };

  const handleApprove = (id: string) => {
    console.log('通过音频审核:', id);
    // TODO: 后续接入真实 API
  };

  const handleReject = (id: string, reason: string) => {
    console.log('拒绝音频审核:', id, '原因:', reason);
    // TODO: 后续接入真实 API
  };

  const handleSearch = (keyword: string) => {
    console.log('搜索音频:', keyword);
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
