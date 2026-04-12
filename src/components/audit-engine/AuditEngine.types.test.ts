import { describe, it, expect } from 'vitest';
import type {
  AuditItem,
  AuditItemType,
  AuditItemStatus,
  AuditEngineProps,
  AuditTaskListProps,
  AuditPreviewProps,
  AuditWorkspaceProps,
  BaseActionBarProps,
} from './AuditEngine.types';

describe('AuditEngine.types.ts', () => {
  it('AuditItem 类型应正确约束字段', () => {
    const item: AuditItem = {
      id: 'test-1',
      type: 'image',
      title: '测试图片',
      status: 'pending',
      content: 'https://example.com/image.jpg',
      createdAt: '2026-04-12T00:00:00Z',
    };
    expect(item.id).toBe('test-1');
    expect(item.type).toBe('image');
    expect(item.status).toBe('pending');
    expect(item.previewData).toBeUndefined();
  });

  it('AuditItem 应支持可选的 previewData 字段', () => {
    const itemWithPreview: AuditItem = {
      id: 'test-2',
      type: 'image',
      title: '测试图片带预览',
      status: 'pending',
      content: 'https://example.com/image.jpg',
      createdAt: '2026-04-12T00:00:00Z',
      previewData: {
        type: 'image',
        url: 'https://example.com/image.jpg',
        title: '测试图片带预览',
      },
    };
    expect(itemWithPreview.previewData).toBeDefined();
    expect(itemWithPreview.previewData?.type).toBe('image');
    expect(itemWithPreview.previewData?.url).toBe('https://example.com/image.jpg');
  });

  it('AuditItemType 应仅允许指定类型', () => {
    const types: AuditItemType[] = ['image', 'video', 'audio', 'text'];
    expect(types).toHaveLength(4);
  });

  it('AuditItemStatus 应仅允许指定状态', () => {
    const statuses: AuditItemStatus[] = ['pending', 'approved', 'rejected'];
    expect(statuses).toHaveLength(3);
  });

  it('AuditEngineProps 类型应正确约束', () => {
    const props: AuditEngineProps = {
      items: [],
      selectedItem: null,
      onSelect: (item: AuditItem) => item,
      onApprove: (id: string) => id,
      onReject: (id: string, reason: string) => ({ id, reason }),
      onSearch: (keyword: string) => keyword,
    };
    expect(props.items).toEqual([]);
    expect(props.selectedItem).toBeNull();
  });

  it('AuditTaskListProps 类型应正确约束', () => {
    const props: AuditTaskListProps = {
      items: [],
      selectedItem: null,
      onSelect: (item: AuditItem) => item,
    };
    expect(props.items).toEqual([]);
  });

  it('AuditPreviewProps 类型应正确约束', () => {
    const props: AuditPreviewProps = {
      item: null,
      children: null,
    };
    expect(props.item).toBeNull();
    expect(props.children).toBeNull();
  });

  it('AuditWorkspaceProps 类型应正确约束', () => {
    const props: AuditWorkspaceProps = {
      item: null,
      onApprove: (id: string) => id,
      onReject: (id: string, reason: string) => ({ id, reason }),
    };
    expect(props.item).toBeNull();
  });

  it('BaseActionBarProps 类型应正确约束', () => {
    const props: BaseActionBarProps = {
      item: null,
      onZoomIn: () => {},
      onZoomOut: () => {},
      onRotate: () => {},
    };
    expect(props.item).toBeNull();
  });
});
