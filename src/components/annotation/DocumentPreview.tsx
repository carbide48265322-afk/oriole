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

export default function DocumentPreview({
  file,
  title,
}: DocumentPreviewProps) {
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

  const goToPrevPage = () => {
    setPageNumber((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    if (numPages) {
      setPageNumber((prev) => Math.min(prev + 1, numPages));
    }
  };

  if (!file) {
    return <Empty description="暂无文档" />;
  }

  if (error) {
    return <Empty description="文档加载失败" />;
  }

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {title && (
        <div style={{ padding: '8px 0', fontWeight: 500 }}>{title}</div>
      )}
      <div
        style={{
          flex: 1,
          overflow: 'auto',
          display: 'flex',
          justifyContent: 'center',
          padding: 16,
        }}
      >
        {loading && <Spin size="large" />}
        <Document
          file={file}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={null}
        >
          <Page
            pageNumber={pageNumber}
            width={Math.min(600, typeof window !== 'undefined' ? window.innerWidth - 100 : 600)}
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        </Document>
      </div>
      {numPages && (
        <div
          style={{
            padding: '8px 0',
            borderTop: '1px solid #f0f0f0',
            textAlign: 'center',
          }}
        >
          <Space>
            <Button
              size="small"
              icon={<LeftOutlined />}
              onClick={goToPrevPage}
              disabled={pageNumber <= 1}
              aria-label="上一页"
            />
            <span>
              {pageNumber} / {numPages}
            </span>
            <Button
              size="small"
              icon={<RightOutlined />}
              onClick={goToNextPage}
              disabled={pageNumber >= numPages}
              aria-label="下一页"
            />
          </Space>
        </div>
      )}
    </div>
  );
}
