import type { ReactNode } from 'react';
import type { PreviewData } from '@/components/annotation/AnnotationPreview.types';

/* eslint no-unused-vars: ["warn", { "args": "none" }] */

// 审核项类型
export type AuditItemType = 'image' | 'video' | 'audio' | 'text';

// 审核项状态
export type AuditItemStatus = 'pending' | 'approved' | 'rejected';

// 审核项数据
export interface AuditItem {
  id: string;
  type: AuditItemType;
  title: string;
  status: AuditItemStatus;
  content: string; // URL 或文本内容
  createdAt: string;
  previewData?: PreviewData; // 预览数据，用于 AnnotationPreview
}

// 左侧列表 Props
export interface AuditTaskListProps {
  items: AuditItem[];
  selectedItem?: AuditItem | null;
  onSelect: (item: AuditItem) => void;
  onSearch?: (keyword: string) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

// 引擎 Props
export interface AuditEngineProps {
  items: AuditItem[];
  selectedItem?: AuditItem | null;
  previewComponent?: ReactNode; // 可插拔预览组件
  onSelect: (item: AuditItem) => void;
  onApprove: (id: string) => void;
  onReject: (id: string, reason: string) => void;
  onSearch?: (keyword: string) => void;
}

// 预览区 Props
export interface AuditPreviewProps {
  item?: AuditItem | null;
  children?: ReactNode; // 可插拔预览组件
}

// 工作区 Props
export interface AuditWorkspaceProps {
  item?: AuditItem | null;
  onApprove: (id: string) => void;
  onReject: (id: string, reason: string) => void;
}

// 基础操作区 Props
export interface BaseActionBarProps {
  item?: AuditItem | null;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onRotate?: () => void;
}
