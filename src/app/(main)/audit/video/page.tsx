'use client';

import { useState } from 'react';
import AuditEngine from '@/components/audit-engine/AuditEngine';
import type { AuditItem } from '@/components/audit-engine/AuditEngine.types';

const MOCK_ITEMS: AuditItem[] = [
  {
    id: '1',
    type: 'video',
    title: '短视频-001',
    status: 'pending',
    content: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    createdAt: '2024-01-15 09:00:00',
    previewData: {
      type: 'video',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      title: '短视频-001',
    },
  },
  {
    id: '2',
    type: 'video',
    title: '直播回放-002',
    status: 'pending',
    content: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    createdAt: '2024-01-15 09:30:00',
    previewData: {
      type: 'video',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      title: '直播回放-002',
    },
  },
  {
    id: '3',
    type: 'video',
    title: '用户上传视频-003',
    status: 'approved',
    content: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    createdAt: '2024-01-15 10:00:00',
    previewData: {
      type: 'video',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      title: '用户上传视频-003',
    },
  },
  {
    id: '4',
    type: 'video',
    title: '广告视频-004',
    status: 'rejected',
    content: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    createdAt: '2024-01-15 10:30:00',
    previewData: {
      type: 'video',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      title: '广告视频-004',
    },
  },
  {
    id: '5',
    type: 'video',
    title: '教学视频-005',
    status: 'pending',
    content: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    createdAt: '2024-01-15 11:00:00',
    previewData: {
      type: 'video',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      title: '教学视频-005',
    },
  },
  {
    id: '6',
    type: 'video',
    title: '宣传片-006',
    status: 'pending',
    content: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    createdAt: '2024-01-15 11:30:00',
    previewData: {
      type: 'video',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
      title: '宣传片-006',
    },
  },
  {
    id: '7',
    type: 'video',
    title: 'vlog-007',
    status: 'approved',
    content: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    createdAt: '2024-01-15 12:00:00',
    previewData: {
      type: 'video',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
      title: 'vlog-007',
    },
  },
];

export default function VideoAuditPage() {
  const [selectedItem, setSelectedItem] = useState<AuditItem | null>(null);

  const handleSelect = (item: AuditItem) => {
    setSelectedItem(item);
  };

  const handleApprove = (id: string) => {
    console.log('通过视频审核:', id);
    // TODO: 后续接入真实 API
  };

  const handleReject = (id: string, reason: string) => {
    console.log('拒绝视频审核:', id, '原因:', reason);
    // TODO: 后续接入真实 API
  };

  const handleSearch = (keyword: string) => {
    console.log('搜索视频:', keyword);
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
