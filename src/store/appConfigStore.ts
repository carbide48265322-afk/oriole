/**
 * 应用配置状态管理
 * 
 * 管理 UI 配置、微前端状态等
 */

import { create } from 'zustand';
import type { AppConfigState } from './types';

export const useAppConfigStore = create<AppConfigState>()((set) => ({
  // 初始状态
  sidebarCollapsed: false,
  theme: 'light',
  language: 'zh-CN',
  isMicroApp: false,
  microAppProps: {},

  // 切换侧边栏折叠状态
  toggleSidebar: () => {
    set((state) => ({
      sidebarCollapsed: !state.sidebarCollapsed,
    }));
  },

  // 设置主题
  setTheme: (theme: 'light' | 'dark') => {
    set({ theme });
    console.log('[AppConfig] 主题切换为:', theme);
  },

  // 设置语言
  setLanguage: (language: 'zh-CN' | 'en-US') => {
    set({ language });
    console.log('[AppConfig] 语言切换为:', language);
  },

  // 设置微前端模式
  setMicroAppMode: (isMicroApp: boolean, props: Record<string, unknown> = {}) => {
    set({
      isMicroApp,
      microAppProps: props,
    });
    console.log('[AppConfig] 微前端模式:', isMicroApp ? '开启' : '关闭', props);
  },
}));
