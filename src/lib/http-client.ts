/**
 * HTTP 客户端封装
 * 
 * 统一的 API 请求封装，支持自动携带 Token、错误处理等
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

interface RequestConfig extends RequestInit {
  params?: Record<string, string>;
}

interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
}

/**
 * 发送 HTTP 请求
 */
async function request<T = unknown>(
  url: string,
  config: RequestConfig = {}
): Promise<ApiResponse<T>> {
  const { params, headers, ...restConfig } = config;

  // 构建 URL（含 query 参数）
  let fullUrl = `${API_BASE}${url}`;
  if (params) {
    const searchParams = new URLSearchParams(params);
    fullUrl += `?${searchParams.toString()}`;
  }

  // 构建请求头
  const requestHeaders = new Headers(headers);
  requestHeaders.set('Content-Type', 'application/json');

  // 自动携带 Token
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  if (token) {
    requestHeaders.set('Authorization', `Bearer ${token}`);
  }

  try {
    const response = await fetch(fullUrl, {
      ...restConfig,
      headers: requestHeaders,
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('[API] 请求失败:', response.status, data);
      throw new Error(data.message || '请求失败');
    }

    return data;
  } catch (error) {
    console.error('[API] 请求异常:', error);
    throw error;
  }
}

/**
 * GET 请求
 */
export function get<T = unknown>(url: string, config?: RequestConfig) {
  return request<T>(url, { ...config, method: 'GET' });
}

/**
 * POST 请求
 */
export function post<T = unknown>(url: string, body?: Record<string, unknown>, config?: RequestConfig) {
  return request<T>(url, {
    ...config,
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
  });
}

/**
 * PUT 请求
 */
export function put<T = unknown>(url: string, body?: Record<string, unknown>, config?: RequestConfig) {
  return request<T>(url, {
    ...config,
    method: 'PUT',
    body: body ? JSON.stringify(body) : undefined,
  });
}

/**
 * DELETE 请求
 */
export function del<T = unknown>(url: string, config?: RequestConfig) {
  return request<T>(url, { ...config, method: 'DELETE' });
}

// 导出默认对象
export const http = {
  get,
  post,
  put,
  delete: del,
};
