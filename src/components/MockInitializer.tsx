'use client';

import { useEffect } from 'react';

/**
 * Mock 服务初始化组件
 * 
 * 在客户端自动启动 MSW Mock 服务
 * 使用 useEffect 确保只在浏览器端执行
 */
export function MockInitializer() {
  useEffect(() => {
    async function initMocks() {
      try {
        // 检查是否启用 Mock
        const useMock = process.env.NEXT_PUBLIC_USE_MOCK !== 'false';
        
        if (useMock && process.env.NODE_ENV === 'development') {
          const { worker } = await import('@/mocks/browser');
          await worker.start({
            onUnhandledRequest: 'bypass',
            serviceWorker: {
              url: '/mockServiceWorker.js',
            },
          });
          console.log('[MSW] ✅ Mock 服务已启动');
        }
      } catch (error) {
        console.error('[MSW] ❌ Mock 服务启动失败:', error);
      }
    }

    initMocks();
  }, []);

  // 这个组件不渲染任何内容
  return null;
}
