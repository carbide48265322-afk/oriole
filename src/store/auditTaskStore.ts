/**
 * 审核任务状态管理
 * 
 * 管理审核任务列表和当前任务状态
 * 当前使用 Mock 数据，后续接入真实 API
 */

import { create } from 'zustand';
import type { AuditTaskState, AuditTask, AuditTaskStatus } from './types';

// Mock 审核任务数据
const MOCK_TASKS: AuditTask[] = [
  {
    id: '1',
    content: '这是一段需要审核的文本内容，可能包含敏感信息或违规内容...',
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
    content: '用户上传图片内容，需要 AI 审核',
    contentType: 'image',
    status: 'manual_review',
    aiConfidence: 0.45,
    aiResult: {
      decision: 'rejected',
      reason: 'AI 置信度较低，需要人工复审',
      tags: ['低置信度'],
    },
    createdAt: new Date(Date.now() - 7200000),
    updatedAt: new Date(Date.now() - 3600000),
    assignedTo: '2',
  },
  {
    id: '3',
    content: '用户上传的文档内容',
    contentType: 'document',
    status: 'pending',
    createdAt: new Date(Date.now() - 1800000),
    updatedAt: new Date(Date.now() - 1800000),
  },
  {
    id: '4',
    content: '另一段需要审核的文本',
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
];

export const useAuditTaskStore = create<AuditTaskState>()((set) => ({
  // 初始状态
  tasks: [],
  currentTask: null,
  loading: false,
  error: null,

  // 获取任务列表
  fetchTasks: async (status?: AuditTaskStatus) => {
    set({ loading: true, error: null });
    
    try {
      // 模拟 API 调用延迟
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      let filteredTasks = MOCK_TASKS;
      if (status) {
        filteredTasks = MOCK_TASKS.filter((task) => task.status === status);
      }
      
      set({
        tasks: filteredTasks,
        loading: false,
      });
      
      console.log('[AuditTask] 获取任务列表:', filteredTasks.length, '条');
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : '获取任务失败',
      });
    }
  },

  // 设置当前任务
  setCurrentTask: (task: AuditTask | null) => {
    set({ currentTask: task });
    console.log('[AuditTask] 当前任务:', task?.id || '无');
  },

  // 更新任务状态
  updateTaskStatus: (taskId: string, status: AuditTaskStatus) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId
          ? { ...task, status, updatedAt: new Date() }
          : task
      ),
      currentTask:
        state.currentTask?.id === taskId
          ? { ...state.currentTask, status, updatedAt: new Date() }
          : state.currentTask,
    }));
    console.log('[AuditTask] 任务状态更新:', taskId, status);
  },
}));
