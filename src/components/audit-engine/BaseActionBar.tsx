'use client';

import { Button, Space } from 'antd';
import { ZoomInOutlined, ZoomOutOutlined, RotateRightOutlined } from '@ant-design/icons';
import type { BaseActionBarProps } from './AuditEngine.types';

export default function BaseActionBar({
  item,
  onZoomIn,
  onZoomOut,
  onRotate,
}: BaseActionBarProps) {
  if (!item) return null;

  return (
    <Space>
      <Button
        size="small"
        icon={<ZoomInOutlined />}
        onClick={onZoomIn}
        disabled={!onZoomIn}
      >
        放大
      </Button>
      <Button
        size="small"
        icon={<ZoomOutOutlined />}
        onClick={onZoomOut}
        disabled={!onZoomOut}
      >
        缩小
      </Button>
      <Button
        size="small"
        icon={<RotateRightOutlined />}
        onClick={onRotate}
        disabled={!onRotate}
      >
        旋转
      </Button>
    </Space>
  );
}
