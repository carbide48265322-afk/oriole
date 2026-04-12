'use client';

import { Empty, Typography } from 'antd';
import BaseActionBar from './BaseActionBar';
import type { AuditPreviewProps } from './AuditEngine.types';

const { Text } = Typography;

export default function AuditPreview({ item, children }: AuditPreviewProps) {
  if (!item) {
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

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
        <BaseActionBar item={item} />
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: 16 }}>
        {children || (
          <Empty
            description={
              <Text type="secondary">
                {item.type === 'image' && '图片预览组件待接入'}
                {item.type === 'video' && '视频预览组件待接入'}
                {item.type === 'audio' && '音频预览组件待接入'}
                {item.type === 'text' && '文本预览组件待接入'}
              </Text>
            }
          />
        )}
      </div>
    </div>
  );
}
