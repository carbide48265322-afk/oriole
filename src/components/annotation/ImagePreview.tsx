'use client';

import React, { useState } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { Button, Space, Empty } from 'antd';
import { ZoomInOutlined, ZoomOutOutlined, ReloadOutlined, RotateLeftOutlined } from '@ant-design/icons';
import type { ImagePreviewProps } from './AnnotationPreview.types';

export default function ImagePreview({ src, title }: ImagePreviewProps) {
  const [rotation, setRotation] = useState(0);

  if (!src) {
    return <Empty description="暂无图片" />;
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {title && (
        <div style={{ padding: '8px 0', fontWeight: 500 }}>{title}</div>
      )}
      <TransformWrapper
        initialScale={1}
        minScale={0.1}
        maxScale={5}
        rotation={rotation}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            <div
              style={{
                padding: '8px 0',
                borderBottom: '1px solid #f0f0f0',
                marginBottom: 8,
              }}
            >
              <Space>
                <Button
                  size="small"
                  icon={<ZoomInOutlined />}
                  onClick={() => zoomIn()}
                  aria-label="放大"
                />
                <Button
                  size="small"
                  icon={<ZoomOutOutlined />}
                  onClick={() => zoomOut()}
                  aria-label="缩小"
                />
                <Button
                  size="small"
                  icon={<ReloadOutlined />}
                  onClick={() => resetTransform()}
                  aria-label="重置"
                />
                <Button
                  size="small"
                  icon={<RotateLeftOutlined />}
                  onClick={() => setRotation((prev) => prev - 90)}
                  aria-label="旋转"
                />
              </Space>
            </div>
            <TransformComponent
              wrapperStyle={{
                width: '100%',
                flex: 1,
                overflow: 'hidden',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={title || '预览图片'}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                }}
              />
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </div>
  );
}
