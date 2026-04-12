'use client';

import { useState } from 'react';
import AuditEngine from '@/components/audit-engine/AuditEngine';
import type { AuditItem } from '@/components/audit-engine/AuditEngine.types';

const MOCK_ITEMS: AuditItem[] = [
  {
    id: '1',
    type: 'document',
    title: '技术文档-001',
    status: 'pending',
    content: 'https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pldi-09.pdf',
    createdAt: '2024-01-15 08:00:00',
    previewData: {
      type: 'document',
      url: 'https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pldi-09.pdf',
      title: '技术文档-001',
    },
  },
  {
    id: '2',
    type: 'document',
    title: '用户手册-002',
    status: 'pending',
    content: 'https://raw.githubusercontent.com/mozilla/pdf.js/master/examples/learning/helloworld.pdf',
    createdAt: '2024-01-15 08:30:00',
    previewData: {
      type: 'document',
      url: 'https://raw.githubusercontent.com/mozilla/pdf.js/master/examples/learning/helloworld.pdf',
      title: '用户手册-002',
    },
  },
  {
    id: '3',
    type: 'document',
    title: '产品报告-003',
    status: 'approved',
    content: 'https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pldi-09.pdf',
    createdAt: '2024-01-15 09:00:00',
    previewData: {
      type: 'document',
      url: 'https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pldi-09.pdf',
      title: '产品报告-003',
    },
  },
  {
    id: '4',
    type: 'document',
    title: '合同文件-004',
    status: 'rejected',
    content: 'https://raw.githubusercontent.com/mozilla/pdf.js/master/examples/learning/helloworld.pdf',
    createdAt: '2024-01-15 09:30:00',
    previewData: {
      type: 'document',
      url: 'https://raw.githubusercontent.com/mozilla/pdf.js/master/examples/learning/helloworld.pdf',
      title: '合同文件-004',
    },
  },
  {
    id: '5',
    type: 'document',
    title: '培训资料-005',
    status: 'pending',
    content: 'https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pldi-09.pdf',
    createdAt: '2024-01-15 10:00:00',
    previewData: {
      type: 'document',
      url: 'https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pldi-09.pdf',
      title: '培训资料-005',
    },
  },
  {
    id: '6',
    type: 'document',
    title: '会议记录-006',
    status: 'pending',
    content: 'https://raw.githubusercontent.com/mozilla/pdf.js/master/examples/learning/helloworld.pdf',
    createdAt: '2024-01-15 10:30:00',
    previewData: {
      type: 'document',
      url: 'https://raw.githubusercontent.com/mozilla/pdf.js/master/examples/learning/helloworld.pdf',
      title: '会议记录-006',
    },
  },
  {
    id: '7',
    type: 'document',
    title: '项目计划-007',
    status: 'approved',
    content: 'https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pldi-09.pdf',
    createdAt: '2024-01-15 11:00:00',
    previewData: {
      type: 'document',
      url: 'https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pldi-09.pdf',
      title: '项目计划-007',
    },
  },
  {
    id: '8',
    type: 'document',
    title: '财务报表-008',
    status: 'rejected',
    content: 'https://raw.githubusercontent.com/mozilla/pdf.js/master/examples/learning/helloworld.pdf',
    createdAt: '2024-01-15 11:30:00',
    previewData: {
      type: 'document',
      url: 'https://raw.githubusercontent.com/mozilla/pdf.js/master/examples/learning/helloworld.pdf',
      title: '财务报表-008',
    },
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
