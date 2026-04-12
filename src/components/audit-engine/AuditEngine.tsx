'use client';

import { useState } from 'react';
import { Button } from 'antd';
import {
  ExpandOutlined,
  CompressOutlined,
} from '@ant-design/icons';
import AuditTaskList from './AuditTaskList';
import AuditPreview from './AuditPreview';
import AuditWorkspace from './AuditWorkspace';
import ResizableDivider from './ResizableDivider';
import type { AuditEngineProps } from './AuditEngine.types';

const DEFAULT_STYLE: React.CSSProperties = { height: '100%' };

// 分栏宽度配置
const LEFT_MIN_WIDTH = 200;
const LEFT_MAX_WIDTH = 400;
const LEFT_DEFAULT_WIDTH = 280;
const LEFT_COLLAPSED_WIDTH = 48;

const RIGHT_MIN_WIDTH = 280;
const RIGHT_MAX_WIDTH = 500;
const RIGHT_DEFAULT_WIDTH = 350;

export default function AuditEngine({
  items,
  selectedItem,
  previewComponent,
  onSelect,
  onApprove,
  onReject,
  onSearch,
}: AuditEngineProps) {
  const [leftWidth, setLeftWidth] = useState(LEFT_DEFAULT_WIDTH);
  const [rightWidth, setRightWidth] = useState(RIGHT_DEFAULT_WIDTH);
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleLeftResize = (width: number) => {
    setLeftWidth(Math.min(Math.max(width, LEFT_MIN_WIDTH), LEFT_MAX_WIDTH));
  };

  const handleRightResize = (width: number) => {
    // 右侧分隔条：往左拖（分隔条左移）应该让右侧面板变小
    // 但几何上分隔条左移意味着中间区域变小，右侧区域变大
    // 所以需要反转：用范围总和减去传入的 width
    const invertedWidth = RIGHT_MIN_WIDTH + RIGHT_MAX_WIDTH - width;
    setRightWidth(Math.min(Math.max(invertedWidth, RIGHT_MIN_WIDTH), RIGHT_MAX_WIDTH));
  };

  const toggleLeftCollapse = () => {
    setLeftCollapsed(!leftCollapsed);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div
      data-testid="audit-engine-container"
      style={{
        height: isFullscreen ? '100vh' : 'calc(100vh - 64px)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isFullscreen ? 'scale(1)' : 'scale(0.98)',
        transformOrigin: 'top right',
        position: isFullscreen ? 'fixed' : 'relative',
        inset: isFullscreen ? 0 : 'auto',
        zIndex: isFullscreen ? 9999 : 1,
        background: '#fff',
        borderRadius: isFullscreen ? 0 : 8,
        boxShadow: isFullscreen ? 'none' : '0 2px 8px rgba(0,0,0,0.1)',
      }}
    >
      {/* 全屏按钮 */}
      <Button
        data-testid="fullscreen-btn"
        type="text"
        icon={isFullscreen ? <CompressOutlined /> : <ExpandOutlined />}
        onClick={toggleFullscreen}
        style={{
          position: 'absolute',
          top: 4,
          right: 4,
          zIndex: 10000,
          background: 'rgba(255,255,255,0.9)',
        }}
      />

      {/* 内层使用纯 flex 布局，不用 Ant Design Layout */}
      <div style={{ height: '100%', display: 'flex', background: '#fff', padding: '0 4px' }}>
        {/* 左侧列表区 - 固定宽度 */}
        <div
          data-testid="audit-left-panel"
          style={{
            width: leftCollapsed ? LEFT_COLLAPSED_WIDTH : leftWidth,
            flexShrink: 0,
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <AuditTaskList
            items={items}
            selectedItem={selectedItem}
            onSelect={onSelect}
            onSearch={onSearch}
            collapsed={leftCollapsed}
            onToggleCollapse={toggleLeftCollapse}
          />
        </div>

        {/* 左侧分隔条 */}
        {!leftCollapsed && (
          <ResizableDivider
            onResize={handleLeftResize}
            minWidth={LEFT_MIN_WIDTH}
            maxWidth={LEFT_MAX_WIDTH}
            currentWidth={leftWidth}
          />
        )}

        {/* 中间预览区 - flex: 1 自适应 */}
        <div data-testid="audit-middle-panel" style={{ flex: 1, minWidth: 400, overflow: 'hidden', ...DEFAULT_STYLE }}>
          <AuditPreview item={selectedItem}>{previewComponent}</AuditPreview>
        </div>

        {/* 右侧分隔条 - 方向在 handleRightResize 中反转 */}
        <ResizableDivider
          data-testid="right-resizable-divider"
          onResize={handleRightResize}
          minWidth={RIGHT_MIN_WIDTH}
          maxWidth={RIGHT_MAX_WIDTH}
          currentWidth={rightWidth}
        />

        {/* 右侧审核工作区 - 固定宽度 */}
        <div
          data-testid="audit-right-panel"
          style={{
            width: rightWidth,
            flexShrink: 0,
            overflow: 'hidden',
            position: 'relative',
            ...DEFAULT_STYLE,
          }}
        >
          <AuditWorkspace
            item={selectedItem}
            onApprove={onApprove}
            onReject={onReject}
          />
        </div>
      </div>
    </div>
  );
}
