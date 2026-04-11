/**
 * 认证状态管理
 * 
 * 使用 Zustand 管理用户认证状态
 * 当前使用 Mock 数据，后续接入真实认证
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthState, UserInfo } from './types';

// Mock 用户数据
const MOCK_USERS: Record<string, UserInfo> = {
  admin: {
    id: '1',
    name: '管理员',
    email: 'admin@oriole.com',
    role: 'admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
  },
  auditor: {
    id: '2',
    name: '审核员',
    email: 'auditor@oriole.com',
    role: 'auditor',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=auditor',
  },
  viewer: {
    id: '3',
    name: '观察者',
    email: 'viewer@oriole.com',
    role: 'viewer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=viewer',
  },
};

// Mock 权限映射
const ROLE_PERMISSIONS: Record<string, string[]> = {
  admin: ['*'],
  auditor: ['audit:view', 'audit:review', 'audit:submit'],
  viewer: ['audit:view'],
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // 初始状态
      isAuthenticated: false,
      user: null,
      token: null,
      permissions: [],

      // 登录
      login: (user: UserInfo, token: string) => {
        const permissions = ROLE_PERMISSIONS[user.role] || [];
        set({
          isAuthenticated: true,
          user,
          token,
          permissions,
        });
        console.log('[Auth] 登录成功:', user.name, user.role);
      },

      // 登出
      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
          token: null,
          permissions: [],
        });
        console.log('[Auth] 已登出');
      },

      // 更新用户信息
      updateUser: (updates: Partial<UserInfo>) => {
        set((state) => {
          if (!state.user) return state;
          return {
            user: { ...state.user, ...updates },
          };
        });
      },
    }),
    {
      name: 'oriole-auth-storage', // localStorage key
      partialize: (state) => ({
        // 只持久化这些字段
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        token: state.token,
        permissions: state.permissions,
      }),
    }
  )
);

// 便捷 Hook: 获取 Mock 用户
export const useMockUser = (role: 'admin' | 'auditor' | 'viewer' = 'auditor') => {
  const login = useAuthStore((state) => state.login);
  
  return {
    loginAsMockUser: () => {
      const user = MOCK_USERS[role];
      const token = `mock-token-${role}-${Date.now()}`;
      login(user, token);
    },
    mockUser: MOCK_USERS[role],
  };
};
