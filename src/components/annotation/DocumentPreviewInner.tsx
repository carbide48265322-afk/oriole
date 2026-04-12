'use client';

import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { Button, Space, Empty, Spin } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import type { DocumentPreviewProps } from './AnnotationPreview.types';

// 设置 PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export function DocumentPreviewInner({ file, title }: DocumentPreviewProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const onDocumentLoadSuccess = ({ numPages: pages }: { numPages: number }) => {
    setNumPages(pages);
    setLoading(false);
    setError(false);
  };

  const onDocumentLoadError = () => {
    setError(true);
    setLoading(false);
  };

  const goToPrevPage = () => setPageNumber((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () => setPageNumber((prev) => Math.min(prev + 1, numPages || 1));

  if (!file) {
    return <Empty description="暂无文档" />;
  }

  if (error) {
    return <Empty description="文档加载失败" />;
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {title && (
        <div
          style={{
            padding: '8px 12px',
            borderBottom: '1px solid #f0f0f0',
            background: '#fafafa',
            fontSize: 14,
            color: '#666',
          }}
        >
          {title}
        </div>
      )}

      <div
        style={{
          flex: 1,
          overflow: 'auto',
          background: '#f5f5f5',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {loading && (
          <div style={{ padding: 48 }}>
            <Spin size="large" tip="加载文档中..." />
          </div>
        )}

        <Document
          file={file}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={null}
        >
          <Page
            pageNumber={pageNumber}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            scale={1.2}
          />
        </Document>
      </div>

      {numPages && numPages > 1 && (
        <div
          style={{
            padding: '8px 12px',
            borderTop: '1px solid #f0f0f0',
            background: '#fafafa',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Space>
            <Button
              size="small"
              icon={<LeftOutlined />}
              onClick={goToPrevPage}
              disabled={pageNumber <= 1}
            >
              上一页
            </Button>
            <span style={{ fontSize: 14, color: '#666' }}>
              {pageNumber} / {numPages}
            </span>
            <Button
              size="small"
              onClick={goToNextPage}
              disabled={pageNumber >= numPages}
            >
              下一页
              <RightOutlined />
            </Button>
          </Space>
        </div>
      )}
    </div>
  );
}
