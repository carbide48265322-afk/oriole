/**
 * MSW 浏览器入口
 * 
 * 在开发环境中自动启用 Mock 服务
 */

import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// 创建 Worker 实例
export const worker = setupWorker(...handlers);

// 启动 Mock 服务
export async function initMocks() {
  if (process.env.NODE_ENV === 'development') {
    // 检查是否禁用 Mock
    const useMock = process.env.NEXT_PUBLIC_USE_MOCK !== 'false';
    
    if (useMock) {
      await worker.start({
        onUnhandledRequest: 'bypass', // 未匹配的请求直接放过，不报错
        serviceWorker: {
          url: '/mockServiceWorker.js',
        },
      });
      console.log('[MSW] Mock 服务已启动');
    } else {
      console.log('[MSW] Mock 服务已禁用');
    }
  }
}
