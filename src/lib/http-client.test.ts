/**
 * HTTP 客户端单元测试
 * 
 * 测试覆盖:
 * - get 方法构建 URL 和 headers
 * - post 方法发送请求体
 * - 自动携带 Token
 * - 错误处理逻辑
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { http, get, post, put, del } from './http-client';

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(global, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
});

describe('http-client', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ success: true, data: { id: 1 } }),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('get 方法', () => {
    it('应该构建正确的 GET 请求 URL 和 headers', async () => {
      await get('/api/users');

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/users',
        expect.objectContaining({
          method: 'GET',
          headers: expect.any(Headers),
        })
      );

      const callArgs = mockFetch.mock.calls[0];
      const headers = callArgs[1].headers;
      expect(headers.get('Content-Type')).toBe('application/json');
    });

    it('应该正确构建带 query 参数的 URL', async () => {
      await get('/api/users', { params: { page: '1', limit: '10' } });

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/users?page=1&limit=10',
        expect.objectContaining({
          method: 'GET',
        })
      );
    });

    it('应该在没有 token 时不携带 Authorization header', async () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      await get('/api/users');

      const callArgs = mockFetch.mock.calls[0];
      const headers = callArgs[1].headers;
      expect(headers.get('Authorization')).toBeNull();
    });

    it('应该在有 token 时自动携带 Authorization header', async () => {
      mockLocalStorage.getItem.mockReturnValue('test-token-123');

      await get('/api/users');

      const callArgs = mockFetch.mock.calls[0];
      const headers = callArgs[1].headers;
      expect(headers.get('Authorization')).toBe('Bearer test-token-123');
    });
  });

  describe('post 方法', () => {
    it('应该构建正确的 POST 请求并发送请求体', async () => {
      const body = { name: 'test', email: 'test@example.com' };

      await post('/api/users', body);

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/users',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(body),
        })
      );
    });

    it('应该在 body 为 undefined 时不设置 body 字段', async () => {
      await post('/api/users');

      const callArgs = mockFetch.mock.calls[0];
      expect(callArgs[1].body).toBeUndefined();
    });

    it('应该正确发送 POST 请求并返回数据', async () => {
      const expectedData = { success: true, data: { id: 1, name: 'created' } };
      mockFetch.mockResolvedValue({
        ok: true,
        status: 201,
        json: () => Promise.resolve(expectedData),
      });

      const result = await post('/api/users', { name: 'created' });

      expect(result).toEqual(expectedData);
    });
  });

  describe('put 方法', () => {
    it('应该构建正确的 PUT 请求并发送请求体', async () => {
      const body = { name: 'updated' };

      await put('/api/users/1', body);

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/users/1',
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(body),
        })
      );
    });
  });

  describe('delete 方法', () => {
    it('应该构建正确的 DELETE 请求', async () => {
      await del('/api/users/1');

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/users/1',
        expect.objectContaining({
          method: 'DELETE',
        })
      );
    });
  });

  describe('http 对象', () => {
    it('应该导出 get, post, put, delete 方法', () => {
      expect(http.get).toBeTypeOf('function');
      expect(http.post).toBeTypeOf('function');
      expect(http.put).toBeTypeOf('function');
      expect(http.delete).toBeTypeOf('function');
    });
  });

  describe('错误处理', () => {
    it('应该在响应 status 非 2xx 时抛出错误', async () => {
      const errorMessage = 'Not Found';
      mockFetch.mockResolvedValue({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ success: false, message: errorMessage }),
      });

      await expect(get('/api/users/999')).rejects.toThrow(errorMessage);
    });

    it('应该在服务器返回自定义错误消息时使用该消息', async () => {
      const customMessage = '用户不存在';
      mockFetch.mockResolvedValue({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ success: false, message: customMessage }),
      });

      await expect(get('/api/users/999')).rejects.toThrow(customMessage);
    });

    it('应该在 fetch 网络异常时抛出错误', async () => {
      const networkError = new Error('Network Error');
      mockFetch.mockRejectedValue(networkError);

      await expect(get('/api/users')).rejects.toThrow('Network Error');
    });

    it('应该在响应没有 message 字段时使用默认错误消息', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ success: false }),
      });

      await expect(get('/api/users')).rejects.toThrow('请求失败');
    });
  });
});
