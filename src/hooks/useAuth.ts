/**
 * 认证 Hook
 * 
 * 封装认证相关的便捷方法
 */

import { useCallback } from 'react';
import { useAuthStore, useMockUser } from '@/store';
import type { UserRole } from '@/store/types';

/**
 * 使用认证状态
 * 
 * @example
 * const { isAuthenticated, user, hasPermission, loginAsMockUser } = useAuth();
 */
export function useAuth() {
  const {
    isAuthenticated,
    user,
    token,
    permissions,
    logout,
  } = useAuthStore();

  // 检查权限
  const hasPermission = useCallback(
    (permission: string) => {
      if (!permissions || permissions.length === 0) return false;
      // admin 拥有所有权限
      if (permissions.includes('*')) return true;
      return permissions.includes(permission);
    },
    [permissions]
  );

  // 检查角色
  const hasRole = useCallback(
    (role: UserRole) => {
      return user?.role === role;
    },
    [user]
  );

  return {
    isAuthenticated,
    user,
    token,
    permissions,
    logout,
    hasPermission,
    hasRole,
  };
}

/**
 * 使用 Mock 用户（开发环境）
 * 
 * @example
 * const { loginAsAdmin, loginAsAuditor, loginAsViewer } = useMockAuth();
 */
export function useMockAuth() {
  const admin = useMockUser('admin');
  const auditor = useMockUser('auditor');
  const viewer = useMockUser('viewer');

  return {
    loginAsAdmin: admin.loginAsMockUser,
    loginAsAuditor: auditor.loginAsMockUser,
    loginAsViewer: viewer.loginAsMockUser,
    currentUser: admin.mockUser, // 默认显示 auditor
  };
}
