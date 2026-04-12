'use client';

import React from 'react';
import { Empty } from 'antd';
import ImagePreview from './ImagePreview';
import VideoPreview from './VideoPreview';
import AudioPreview from './AudioPreview';
import DocumentPreview from './DocumentPreview';
import type { AnnotationPreviewProps } from './AnnotationPreview.types';

export default function AnnotationPreview({ data }: AnnotationPreviewProps) {
  if (!data) {
    return (
      <div
        style={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Empty description="请选择审核项" />
      </div>
    );
  }

  const { type, url, title } = data;

  switch (type) {
    case 'image':
      return <ImagePreview src={url} title={title} />;
    case 'video':
      return <VideoPreview src={url} title={title} />;
    case 'audio':
      return <AudioPreview src={url} title={title} />;
    case 'document':
      return <DocumentPreview file={url} title={title} />;
    default:
      return (
        <Empty
          description="不支持的文件类型"
          style={{ marginTop: 40 }}
        />
      );
  }
}
