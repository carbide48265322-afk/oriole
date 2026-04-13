'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Spin } from 'antd';
import type { DocumentPreviewProps } from './AnnotationPreview.types';

// 动态导入 react-pdf 避免 SSR 时 DOMMatrix 未定义的错误
const DynamicDocumentPreviewInner = dynamic(
  () => import('./DocumentPreviewInner').then((mod) => mod.DocumentPreviewInner),
  {
    ssr: false,
    loading: () => (
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Spin size="large" description="加载文档中..." />
      </div>
    ),
  },
);

export default function DocumentPreview(props: DocumentPreviewProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Spin size="large" description="加载文档中..." />
      </div>
    );
  }

  return <DynamicDocumentPreviewInner {...props} />;
}
