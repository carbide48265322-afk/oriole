import { useState, useCallback } from 'react';

interface UseLoadingReturn {
  isLoading: boolean;
  withLoading: <T extends (..._args: any[]) => Promise<any>>(
    fn: T
  ) => (..._args: Parameters<T>) => Promise<ReturnType<T>>;
}

/**
 * 通用 loading hook，用于防止按钮重复点击
 * @returns isLoading - 是否正在加载
 * @returns withLoading - 包装函数，执行时设置 loading 状态
 */
export function useLoading(): UseLoadingReturn {
  const [isLoading, setIsLoading] = useState(false);

  const withLoading = useCallback(
    <T extends (..._args: any[]) => Promise<any>>(fn: T) => {
      return async (..._args: Parameters<T>): Promise<ReturnType<T>> => {
        if (isLoading) return Promise.reject(new Error('请勿重复操作'));

        setIsLoading(true);
        try {
          return await fn(..._args);
        } finally {
          setIsLoading(false);
        }
      };
    },
    [isLoading]
  );

  return { isLoading, withLoading };
}
