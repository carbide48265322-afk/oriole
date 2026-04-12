'use client';

import { Layout } from 'antd';
import AuditTaskList from './AuditTaskList';
import AuditPreview from './AuditPreview';
import AuditWorkspace from './AuditWorkspace';
import type { AuditEngineProps } from './AuditEngine.types';

const { Sider, Content } = Layout;

const DEFAULT_STYLE: React.CSSProperties = { height: '100%' };

export default function AuditEngine({
  items,
  selectedItem,
  previewComponent,
  onSelect,
  onApprove,
  onReject,
  onSearch,
}: AuditEngineProps) {
  return (
    <Layout style={{ height: '100%', background: '#fff' }}>
      {/* 左侧列表区 */}
      <Sider
        width={280}
        theme="light"
        style={{ borderRight: '1px solid #f0f0f0', ...DEFAULT_STYLE }}
      >
        <AuditTaskList
          items={items}
          selectedItem={selectedItem}
          onSelect={onSelect}
          onSearch={onSearch}
        />
      </Sider>

      {/* 中间预览区 */}
      <Sider
        width={500}
        theme="light"
        style={{ borderRight: '1px solid #f0f0f0', ...DEFAULT_STYLE }}
      >
        <AuditPreview item={selectedItem}>{previewComponent}</AuditPreview>
      </Sider>

      {/* 右侧审核工作区 */}
      <Content style={DEFAULT_STYLE}>
        <AuditWorkspace
          item={selectedItem}
          onApprove={onApprove}
          onReject={onReject}
        />
      </Content>
    </Layout>
  );
}
