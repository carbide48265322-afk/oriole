/**
 * qiankun 子应用配置
 * 
 * 本文件供主应用参考，用于配置子应用加载
 * 
 * ## 主应用配置示例
 * 
 * ```javascript
 * // 主应用中注册子应用
 * import { registerMicroApps, start } from 'qiankun';
 * 
 * registerMicroApps([
 *   {
 *     name: 'oriole-audit',
 *     entry: process.env.NODE_ENV === 'development' 
 *       ? 'http://localhost:3000' 
 *       : 'https://your-production.com/oriole',
 *     container: '#sub-app-container',
 *     activeRule: '/audit',
 *     props: {
 *       userInfo: { name: '审核员', role: 'auditor' },
 *       token: 'xxx',
 *       permissions: ['audit:view', 'audit:review'],
 *     },
 *   },
 * ]);
 * 
 * start({
 *   sandbox: {
 *     strictStyleIsolation: true,  // 样式隔离
 *     experimentalStyleIsolation: true,  // 实验性样式隔离
 *   },
 * });
 * ```
 * 
 * ## 使用 loadMicroApp 单独加载
 * 
 * ```javascript
 * import { loadMicroApp } from 'qiankun';
 * 
 * const microApp = loadMicroApp({
 *   name: 'oriole-audit',
 *   entry: 'http://localhost:3000',
 *   container: '#container',
 *   props: {
 *     userInfo: { name: '审核员' },
 *     token: 'xxx',
 *   },
 * });
 * 
 * // 更新 props
 * microApp.update({
 *   userInfo: { name: '新审核员' },
 *   token: 'new-token',
 * });
 * 
 * // 卸载
 * microApp.unmount();
 * ```
 * 
 * ## 子应用运行模式
 * 
 * 1. **独立运行**: 直接访问 `http://localhost:3000`
 * 2. **子应用模式**: 设置环境变量 `NEXT_PUBLIC_MICRO_APP=true`，访问路径为 `/oriole`
 * 
 * ## 主子应用通信
 * 
 * ### 主 -> 子
 * - 通过 `props` 传递：用户信息、token、权限等
 * - 子应用通过 `initApp(props)` 接收
 * 
 * ### 子 -> 主
 * - 通过 `props.onMounted` 回调通知挂载完成
 * - 通过 `CustomEvent` 发送自定义事件
 * - 通过全局状态管理（如 Redux、Zustand）共享
 */

// 子应用名称
export const MICRO_APP_NAME = 'oriole-audit';

// 子应用入口（开发环境）
export const MICRO_APP_ENTRY_DEV = 'http://localhost:3000';

// 子应用入口（生产环境）
export const MICRO_APP_ENTRY_PROD = '/oriole';

// 支持传递的 props 类型
export interface MicroAppProps {
  userInfo?: {
    name: string;
    role: string;
    avatar?: string;
  };
  token?: string;
  permissions?: string[];
  onMounted?: () => void;
  [key: string]: unknown;
}
