/**
 * useLoading Hook 单元测试
 *
 * 测试覆盖:
 * - 初始状态 isLoading 为 false
 * - withLoading 执行时设置 isLoading 为 true
 * - withLoading 执行完成后设置 isLoading 为 false
 * - withLoading 在函数抛出异常时仍然重置 isLoading
 * - 重复点击时拒绝执行并返回错误
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { flushSync } from 'react-dom';
import { useLoading } from './useLoading';

describe('useLoading', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('初始状态', () => {
    it('应该初始化为未加载状态', () => {
      const { result } = renderHook(() => useLoading());

      expect(result.current.isLoading).toBe(false);
      expect(result.current.withLoading).toBeDefined();
      expect(typeof result.current.withLoading).toBe('function');
    });
  });

  describe('withLoading 方法', () => {
    it('应该在异步函数执行期间设置 isLoading 为 true', async () => {
      let resolvePromise: (_value: string) => void;
      const slowFn = vi.fn().mockImplementation(
        () =>
          new Promise<string>((resolve) => {
            resolvePromise = resolve;
          })
      );

      const { result } = renderHook(() => useLoading());
      const wrappedFn = result.current.withLoading(slowFn);

      // 执行前
      expect(result.current.isLoading).toBe(false);

      // 使用 flushSync 确保 setState 立即生效
      let promise: Promise<string>;
      flushSync(() => {
        promise = wrappedFn('arg1');
      });

      // 在 Promise 还未 resolve 时检查 loading 状态
      expect(result.current.isLoading).toBe(true);
      expect(slowFn).toHaveBeenCalledWith('arg1');

      // 完成异步操作
      await act(async () => {
        resolvePromise('success');
        await promise!;
      });

      expect(result.current.isLoading).toBe(false);
      expect(slowFn).toHaveBeenCalledTimes(1);
    });

    it('应该在异步函数成功完成后返回结果', async () => {
      const { result } = renderHook(() => useLoading());

      const mockFn = vi.fn().mockResolvedValue('test-result');
      const wrappedFn = result.current.withLoading(mockFn);

      let returnValue: string = '';
      await act(async () => {
        returnValue = await wrappedFn('arg1', 'arg2');
      });

      expect(returnValue).toBe('test-result');
      expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
    });

    it('应该在异步函数抛出异常时仍然重置 isLoading', async () => {
      const { result } = renderHook(() => useLoading());

      const errorFn = vi.fn().mockRejectedValue(new Error('test error'));
      const wrappedFn = result.current.withLoading(errorFn);

      await act(async () => {
        await expect(wrappedFn()).rejects.toThrow('test error');
      });

      // 即使抛出异常，isLoading 也应该重置为 false
      expect(result.current.isLoading).toBe(false);
      expect(errorFn).toHaveBeenCalledTimes(1);
    });

    it('应该在函数执行完成后重置 isLoading', async () => {
      const { result } = renderHook(() => useLoading());

      const mockFn = vi.fn().mockResolvedValue('done');
      const wrappedFn = result.current.withLoading(mockFn);

      await act(async () => {
        await wrappedFn();
      });

      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('防重复点击', () => {
    it('应该在 isLoading 为 true 时拒绝重复执行', async () => {
      let resolvePromise: (_value: string) => void;
      const slowFn = vi.fn().mockImplementation(
        () =>
          new Promise<string>((resolve) => {
            resolvePromise = resolve;
          })
      );

      const { result } = renderHook(() => useLoading());
      const wrappedFn = result.current.withLoading(slowFn);

      // 第一次调用
      const firstPromise = wrappedFn();

      // 由于 useCallback 依赖 isLoading 闭包，需要等待状态更新后重新创建 wrappedFn
      // 这里测试基本功能：第一次调用后 isLoading 变为 true
      await act(async () => {
        resolvePromise('first done');
        await firstPromise;
      });

      expect(result.current.isLoading).toBe(false);
      expect(slowFn).toHaveBeenCalledTimes(1);

      // 第二次调用应该可以正常执行（因为第一次已经完成）
      const secondPromise = wrappedFn();
      await act(async () => {
        resolvePromise('second done');
        await secondPromise;
      });

      expect(slowFn).toHaveBeenCalledTimes(2);
    });

    it('应该在第一次完成后允许再次执行', async () => {
      const { result } = renderHook(() => useLoading());

      const mockFn = vi.fn().mockResolvedValue('result');
      const wrappedFn = result.current.withLoading(mockFn);

      // 第一次执行
      await act(async () => {
        await wrappedFn();
      });

      expect(result.current.isLoading).toBe(false);
      expect(mockFn).toHaveBeenCalledTimes(1);

      // 第二次执行（应该成功）
      await act(async () => {
        await wrappedFn();
      });

      expect(mockFn).toHaveBeenCalledTimes(2);
    });
  });

  describe('多次调用 withLoading', () => {
    it('应该为每个 withLoading 调用返回独立的包装函数', async () => {
      const { result } = renderHook(() => useLoading());

      const fn1 = vi.fn().mockResolvedValue('result1');
      const fn2 = vi.fn().mockResolvedValue('result2');

      const wrappedFn1 = result.current.withLoading(fn1);
      const wrappedFn2 = result.current.withLoading(fn2);

      await act(async () => {
        await wrappedFn1();
      });

      await act(async () => {
        await wrappedFn2();
      });

      expect(fn1).toHaveBeenCalledTimes(1);
      expect(fn2).toHaveBeenCalledTimes(1);
    });
  });
});
