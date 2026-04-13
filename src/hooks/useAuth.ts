/**
 * 认证 Hook
 * 
 * 封装认证相关的便捷方法
 */

import { useCallback } from 'react';
import { useAuthStore, useMockUser } from '@/store';
import type { UserRole } from '@/store/types';
import { useSupabase } from '@/components/SupabaseProvider';

/**
 * 使用认证状态
 * 
 * @example
 * const { isAuthenticated, user, hasPermission, login, register, logout } = useAuth();
 */
export function useAuth() {
  const { supabase, session } = useSupabase();
  const {
    isAuthenticated,
    user,
    token,
    permissions,
    logout: logoutStore,
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

  // Supabase 登录
  const login = useCallback(async (email: string, password: string) => {
    if (!supabase) {
      throw new Error('Supabase is not initialized');
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }, [supabase]);

  // Supabase 注册
  const register = useCallback(async (email: string, password: string) => {
    if (!supabase) {
      throw new Error('Supabase is not initialized');
    }
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    return data;
  }, [supabase]);

  // Supabase 登出
  const logout = useCallback(async () => {
    if (supabase) {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    }
    logoutStore();
  }, [supabase, logoutStore]);

  return {
    isAuthenticated: isAuthenticated || !!session?.user,
    user: user || session?.user,
    token,
    permissions,
    logout,
    login,
    register,
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
