'use client';

import React, { useState } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { Button, Space, Empty } from 'antd';
import {
  ZoomInOutlined,
  ZoomOutOutlined,
  ReloadOutlined,
  RotateRightOutlined,
} from '@ant-design/icons';
import type { ImagePreviewProps } from './AnnotationPreview.types';

export default function ImagePreview({ src, title }: ImagePreviewProps) {
  const [rotate, setRotate] = useState(0);

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
                  onClick={() => {
                    resetTransform();
                    setRotate(0);
                  }}
                  aria-label="重置"
                />
                <Button
                  size="small"
                  icon={<RotateRightOutlined />}
                  onClick={() => setRotate((prev) => (prev + 90) % 360)}
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
              <div style={{ transform: `rotate(${rotate}deg)` }}>
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
              </div>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </div>
  );
}
