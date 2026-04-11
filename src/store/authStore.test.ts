/**
 * 认证 Store 单元测试
 * 
 * 测试覆盖:
 * - login 方法更新状态
 * - logout 方法清空状态
 * - 权限检查逻辑
 * - updateUser 方法
 * 
 * 注意: Zustand store 测试需要每次重置状态
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useAuthStore, useMockUser } from './authStore';
import type { UserInfo } from './types';

describe('authStore', () => {
  beforeEach(() => {
    // 每次测试前重置 store 到初始状态
    const store = useAuthStore.getState();
    store.logout();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('初始状态', () => {
    it('应该初始化为未认证状态', () => {
      const store = useAuthStore.getState();
      
      expect(store.isAuthenticated).toBe(false);
      expect(store.user).toBeNull();
      expect(store.token).toBeNull();
      expect(store.permissions).toEqual([]);
    });
  });

  describe('login 方法', () => {
    it('应该更新认证状态为已登录', () => {
      const mockUser: UserInfo = {
        id: '1',
        name: '测试用户',
        email: 'test@example.com',
        role: 'auditor',
      };
      const mockToken = 'test-token-123';

      const { login } = useAuthStore.getState();
      login(mockUser, mockToken);

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toEqual(mockUser);
      expect(state.token).toBe(mockToken);
    });

    it('应该根据用户角色设置正确的权限', () => {
      const adminUser: UserInfo = {
        id: '1',
        name: '管理员',
        email: 'admin@example.com',
        role: 'admin',
      };

      const { login } = useAuthStore.getState();
      login(adminUser, 'token');

      const state = useAuthStore.getState();
      expect(state.permissions).toContain('*');
    });

    it('应该为 auditor 角色设置审核权限', () => {
      const auditorUser: UserInfo = {
        id: '2',
        name: '审核员',
        email: 'auditor@example.com',
        role: 'auditor',
      };

      const { login } = useAuthStore.getState();
      login(auditorUser, 'token');

      const state = useAuthStore.getState();
      expect(state.permissions).toContain('audit:view');
      expect(state.permissions).toContain('audit:review');
      expect(state.permissions).toContain('audit:submit');
    });

    it('应该为 viewer 角色设置查看权限', () => {
      const viewerUser: UserInfo = {
        id: '3',
        name: '观察者',
        email: 'viewer@example.com',
        role: 'viewer',
      };

      const { login } = useAuthStore.getState();
      login(viewerUser, 'token');

      const state = useAuthStore.getState();
      expect(state.permissions).toContain('audit:view');
      expect(state.permissions).not.toContain('audit:review');
    });

    it('应该为未知角色设置空权限', () => {
      const unknownUser: UserInfo = {
        id: '4',
        name: '未知',
        email: 'unknown@example.com',
        role: 'auditor', // 先用 auditor 登录
      };

      // 手动覆盖角色为未知角色
      const userWithUnknownRole = { ...unknownUser, role: 'unknown' as UserInfo['role'] };
      
      const { login } = useAuthStore.getState();
      // @ts-expect-error - 测试未知角色
      login(userWithUnknownRole, 'token');

      const state = useAuthStore.getState();
      expect(state.permissions).toEqual([]);
    });
  });

  describe('logout 方法', () => {
    it('应该清空所有认证状态', () => {
      // 先登录
      const mockUser: UserInfo = {
        id: '1',
        name: '测试用户',
        email: 'test@example.com',
        role: 'admin',
      };
      
      const { login, logout } = useAuthStore.getState();
      login(mockUser, 'test-token');

      // 验证已登录
      expect(useAuthStore.getState().isAuthenticated).toBe(true);

      // 登出
      logout();

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.permissions).toEqual([]);
    });

    it('应该允许从未登录状态调用', () => {
      const { logout } = useAuthStore.getState();
      
      expect(() => logout()).not.toThrow();
      
      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('updateUser 方法', () => {
    it('应该更新用户信息', () => {
      const mockUser: UserInfo = {
        id: '1',
        name: '原名称',
        email: 'test@example.com',
        role: 'auditor',
      };

      const { login, updateUser } = useAuthStore.getState();
      login(mockUser, 'token');

      updateUser({ name: '新名称' });

      const state = useAuthStore.getState();
      expect(state.user?.name).toBe('新名称');
      expect(state.user?.email).toBe('test@example.com'); // 其他字段不变
    });

    it('应该在用户未登录时不改变状态', () => {
      const { updateUser } = useAuthStore.getState();
      
      updateUser({ name: '新名称' });

      const state = useAuthStore.getState();
      expect(state.user).toBeNull();
    });
  });

  describe('权限检查', () => {
    it('admin 角色应该拥有所有权限', () => {
      const adminUser: UserInfo = {
        id: '1',
        name: '管理员',
        email: 'admin@example.com',
        role: 'admin',
      };

      const { login } = useAuthStore.getState();
      login(adminUser, 'token');

      const { permissions } = useAuthStore.getState();
      expect(permissions).toContain('*');
    });

    it('auditor 角色应该能审核但不能管理', () => {
      const auditorUser: UserInfo = {
        id: '2',
        name: '审核员',
        email: 'auditor@example.com',
        role: 'auditor',
      };

      const { login } = useAuthStore.getState();
      login(auditorUser, 'token');

      const { permissions } = useAuthStore.getState();
      expect(permissions).toContain('audit:view');
      expect(permissions).toContain('audit:review');
      expect(permissions).toContain('audit:submit');
    });

    it('viewer 角色应该只能查看', () => {
      const viewerUser: UserInfo = {
        id: '3',
        name: '观察者',
        email: 'viewer@example.com',
        role: 'viewer',
      };

      const { login } = useAuthStore.getState();
      login(viewerUser, 'token');

      const { permissions } = useAuthStore.getState();
      expect(permissions).toEqual(['audit:view']);
    });
  });

  describe('useMockUser Hook', () => {
    it('应该返回 mock 用户信息', () => {
      const { mockUser, loginAsMockUser } = useMockUser('admin');

      expect(mockUser).toBeDefined();
      expect(mockUser.role).toBe('admin');
      expect(loginAsMockUser).toBeTypeOf('function');
    });

    it('loginAsMockUser 应该正确登录', () => {
      const { loginAsMockUser } = useMockUser('auditor');
      
      loginAsMockUser();

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(true);
      expect(state.user?.role).toBe('auditor');
      expect(state.token).toMatch(/^mock-token-auditor-/);
    });

    it('应该支持不同的 mock 角色', () => {
      const adminMock = useMockUser('admin');
      const viewerMock = useMockUser('viewer');

      expect(adminMock.mockUser.role).toBe('admin');
      expect(viewerMock.mockUser.role).toBe('viewer');
    });
  });
});
