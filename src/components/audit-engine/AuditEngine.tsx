'use client';

import { useState } from 'react';
import { Layout, Button } from 'antd';
import {
  ExpandOutlined,
  CompressOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import AuditTaskList from './AuditTaskList';
import AuditPreview from './AuditPreview';
import AuditWorkspace from './AuditWorkspace';
import ResizableDivider from './ResizableDivider';
import type { AuditEngineProps } from './AuditEngine.types';

const { Sider, Content } = Layout;

const DEFAULT_STYLE: React.CSSProperties = { height: '100%' };

// 分栏宽度配置
const LEFT_MIN_WIDTH = 200;
const LEFT_MAX_WIDTH = 400;
const LEFT_DEFAULT_WIDTH = 280;
const LEFT_COLLAPSED_WIDTH = 48;

const MID_MIN_WIDTH = 400;
const MID_MAX_WIDTH = 800;
const MID_DEFAULT_WIDTH = 500;

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
  const [midWidth, setMidWidth] = useState(MID_DEFAULT_WIDTH);
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleLeftResize = (delta: number) => {
    setLeftWidth((prev) =>
      Math.min(Math.max(prev + delta, LEFT_MIN_WIDTH), LEFT_MAX_WIDTH),
    );
  };

  const handleMidResize = (delta: number) => {
    setMidWidth((prev) =>
      Math.min(Math.max(prev + delta, MID_MIN_WIDTH), MID_MAX_WIDTH),
    );
  };

  const toggleLeftCollapse = () => {
    setLeftCollapsed(!leftCollapsed);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div
      style={{
        height: isFullscreen ? '100vh' : 'calc(100vh - 64px)',
        transition: 'height 0.3s ease-in-out, inset 0.3s ease-in-out, background 0.3s ease-in-out',
        position: isFullscreen ? 'fixed' : 'relative',
        inset: isFullscreen ? 0 : 'auto',
        zIndex: isFullscreen ? 9999 : 1,
        background: '#fff',
      }}
    >
      {/* 全屏切换按钮 */}
      <Button
        type="text"
        icon={isFullscreen ? <CompressOutlined /> : <ExpandOutlined />}
        onClick={toggleFullscreen}
        style={{
          position: 'absolute',
          top: 8,
          right: 8,
          zIndex: 10000,
        }}
      />

      <Layout style={{ height: '100%', background: '#fff' }}>
        {/* 左侧列表区 */}
        <Sider
          width={leftCollapsed ? LEFT_COLLAPSED_WIDTH : leftWidth}
          theme="light"
          style={{ borderRight: 'none', ...DEFAULT_STYLE }}
        >
          {/* 展开/收起按钮 */}
          <Button
            type="text"
            icon={leftCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={toggleLeftCollapse}
            style={{
              position: 'absolute',
              top: 8,
              right: 8,
              zIndex: 10000,
            }}
          />
          <AuditTaskList
            items={items}
            selectedItem={selectedItem}
            onSelect={onSelect}
            onSearch={onSearch}
            collapsed={leftCollapsed}
          />
        </Sider>

        {/* 左侧分隔条 */}
        {!leftCollapsed && (
          <ResizableDivider
            onResize={handleLeftResize}
            minWidth={LEFT_MIN_WIDTH}
            maxWidth={LEFT_MAX_WIDTH}
            currentWidth={leftWidth}
          />
        )}

        {/* 中间预览区 */}
        <Sider
          width={midWidth}
          theme="light"
          style={{ borderRight: 'none', ...DEFAULT_STYLE }}
        >
          <AuditPreview item={selectedItem}>{previewComponent}</AuditPreview>
        </Sider>

        {/* 中间分隔条 */}
        <ResizableDivider
          onResize={handleMidResize}
          minWidth={MID_MIN_WIDTH}
          maxWidth={MID_MAX_WIDTH}
          currentWidth={midWidth}
        />

        {/* 右侧审核工作区 */}
        <Content style={DEFAULT_STYLE}>
          <AuditWorkspace
            item={selectedItem}
            onApprove={onApprove}
            onReject={onReject}
          />
        </Content>
      </Layout>
    </div>
  );
}
