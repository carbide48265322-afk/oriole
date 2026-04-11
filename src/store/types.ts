/**
 * 全局状态类型定义
 */

// 用户角色类型
export type UserRole = 'admin' | 'auditor' | 'viewer';

// 用户信息接口
export interface UserInfo {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

// 认证状态接口
export interface AuthState {
  isAuthenticated: boolean;
  user: UserInfo | null;
  token: string | null;
  permissions: string[];
  
  // Actions
  login: (user: UserInfo, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<UserInfo>) => void;
}

// 应用配置状态接口
export interface AppConfigState {
  // UI 配置
  sidebarCollapsed: boolean;
  theme: 'light' | 'dark';
  language: 'zh-CN' | 'en-US';
  
  // 微前端配置
  isMicroApp: boolean;
  microAppProps: Record<string, unknown>;
  
  // Actions
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setLanguage: (language: 'zh-CN' | 'en-US') => void;
  setMicroAppMode: (isMicroApp: boolean, props?: Record<string, unknown>) => void;
}

// 审核任务状态
export type AuditTaskStatus = 'pending' | 'ai_reviewing' | 'manual_review' | 'approved' | 'rejected';

// 审核任务接口
export interface AuditTask {
  id: string;
  content: string;
  contentType: 'text' | 'image' | 'document';
  status: AuditTaskStatus;
  aiConfidence?: number;
  aiResult?: {
    decision: 'approved' | 'rejected';
    reason: string;
    tags?: string[];
  };
  createdAt: Date;
  updatedAt: Date;
  assignedTo?: string;
}

// 审核任务状态接口
export interface AuditTaskState {
  tasks: AuditTask[];
  currentTask: AuditTask | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchTasks: (status?: AuditTaskStatus) => Promise<void>;
  setCurrentTask: (task: AuditTask | null) => void;
  updateTaskStatus: (taskId: string, status: AuditTaskStatus) => void;
}
