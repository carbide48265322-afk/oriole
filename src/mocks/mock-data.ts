/**
 * Mock 数据定义
 * 
 * 定义所有 Mock API 返回的数据结构
 */

import type { UserInfo, AuditTask } from '@/store/types';

// Mock 用户数据
export const MOCK_USERS: Record<string, UserInfo> = {
  admin: {
    id: '1',
    name: '管理员',
    email: 'admin@oriole.com',
    role: 'admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
  },
  auditor: {
    id: '2',
    name: '审核员张三',
    email: 'auditor@oriole.com',
    role: 'auditor',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=auditor',
  },
  viewer: {
    id: '3',
    name: '观察者李四',
    email: 'viewer@oriole.com',
    role: 'viewer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=viewer',
  },
};

// Mock 审核任务数据
export const MOCK_TASKS: AuditTask[] = [
  {
    id: '1',
    content: '这是一段需要审核的文本内容，可能包含敏感信息或违规内容。用户发布了关于产品推广的信息，涉嫌营销内容。',
    contentType: 'text',
    status: 'ai_reviewing',
    aiConfidence: 0.85,
    aiResult: {
      decision: 'rejected',
      reason: '检测到疑似违规营销内容',
      tags: ['营销推广', '疑似违规'],
    },
    createdAt: new Date(Date.now() - 3600000),
    updatedAt: new Date(Date.now() - 1800000),
    assignedTo: '2',
  },
  {
    id: '2',
    content: '用户上传图片内容，需要 AI 审核图片中是否包含违规信息',
    contentType: 'image',
    status: 'manual_review',
    aiConfidence: 0.45,
    aiResult: {
      decision: 'rejected',
      reason: 'AI 置信度较低，需要人工复审',
      tags: ['低置信度', '图片审核'],
    },
    createdAt: new Date(Date.now() - 7200000),
    updatedAt: new Date(Date.now() - 3600000),
    assignedTo: '2',
  },
  {
    id: '3',
    content: '用户上传的文档内容，包含 PDF 文件中的文字信息',
    contentType: 'document',
    status: 'pending',
    createdAt: new Date(Date.now() - 1800000),
    updatedAt: new Date(Date.now() - 1800000),
  },
  {
    id: '4',
    content: '另一段需要审核的文本，内容正常，无违规信息',
    contentType: 'text',
    status: 'approved',
    aiConfidence: 0.95,
    aiResult: {
      decision: 'approved',
      reason: '内容正常，无违规信息',
    },
    createdAt: new Date(Date.now() - 86400000),
    updatedAt: new Date(Date.now() - 82800000),
  },
  {
    id: '5',
    content: '待审核的用户评论，可能存在不文明用语',
    contentType: 'text',
    status: 'pending',
    createdAt: new Date(Date.now() - 900000),
    updatedAt: new Date(Date.now() - 900000),
  },
];

// Mock AI 审核结果
export const MOCK_AI_RESULT = {
  approved: {
    decision: 'approved' as const,
    reason: '内容正常，无违规信息',
    confidence: 0.95,
  },
  rejected: {
    decision: 'rejected' as const,
    reason: '检测到违规内容，建议人工复审',
    confidence: 0.78,
  },
  lowConfidence: {
    decision: 'rejected' as const,
    reason: 'AI 置信度较低，需要人工复审',
    confidence: 0.45,
  },
};

// Mock 统计数据
export const MOCK_STATS = {
  totalTasks: 128,
  pending: 23,
  aiReviewing: 10,
  manualReview: 15,
  approved: 85,
  rejected: 10,
  aiAccuracy: 92.5,
  avgReviewTime: 45, // 秒
};
