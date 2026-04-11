/**
 * MSW Handlers
 * 
 * 定义所有 API 的 Mock 处理器
 */

import { http, HttpResponse, delay } from 'msw';
import { MOCK_USERS, MOCK_TASKS, MOCK_STATS } from './mock-data';

// API 基础路径
const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';

export const handlers = [
  // ========== 认证相关 ==========
  
  // 登录
  http.post(`${API_BASE}/auth/login`, async ({ request }) => {
    await delay(500); // 模拟网络延迟
    
    const body = await request.json() as Record<string, string>;
    const { username, password } = body;
    
    // 简单验证（Mock 环境）
    if (username && password) {
      const user = MOCK_USERS.auditor; // 默认返回 auditor
      return HttpResponse.json({
        success: true,
        data: {
          user,
          token: `mock-token-${user.id}-${Date.now()}`,
        },
      });
    }
    
    return HttpResponse.json(
      { success: false, message: '用户名或密码错误' },
      { status: 401 }
    );
  }),

  // 获取当前用户信息
  http.get(`${API_BASE}/auth/me`, async () => {
    await delay(300);
    return HttpResponse.json({
      success: true,
      data: MOCK_USERS.auditor,
    });
  }),

  // 登出
  http.post(`${API_BASE}/auth/logout`, async () => {
    await delay(200);
    return HttpResponse.json({
      success: true,
      message: '已登出',
    });
  }),

  // ========== 审核任务相关 ==========

  // 获取任务列表
  http.get(`${API_BASE}/tasks`, async ({ request }) => {
    await delay(500);
    
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    
    let filteredTasks = MOCK_TASKS;
    if (status) {
      filteredTasks = MOCK_TASKS.filter((task) => task.status === status);
    }
    
    return HttpResponse.json({
      success: true,
      data: {
        tasks: filteredTasks,
        total: filteredTasks.length,
        page: 1,
        pageSize: 20,
      },
    });
  }),

  // 获取单个任务详情
  http.get(`${API_BASE}/tasks/:taskId`, async ({ params }) => {
    await delay(300);
    
    const { taskId } = params;
    const task = MOCK_TASKS.find((t) => t.id === taskId);
    
    if (task) {
      return HttpResponse.json({
        success: true,
        data: task,
      });
    }
    
    return HttpResponse.json(
      { success: false, message: '任务不存在' },
      { status: 404 }
    );
  }),

  // 提交审核结果
  http.post(`${API_BASE}/tasks/:taskId/review`, async ({ request, params }) => {
    await delay(800);
    
    const { taskId } = params;
    const body = await request.json() as Record<string, string>;
    
    console.log('[MSW] 审核结果提交:', taskId, body);
    
    return HttpResponse.json({
      success: true,
      message: '审核结果已提交',
      data: {
        taskId,
        status: 'completed',
        reviewedAt: new Date().toISOString(),
      },
    });
  }),

  // ========== 统计数据 ==========

  // 获取统计数据
  http.get(`${API_BASE}/stats`, async () => {
    await delay(400);
    return HttpResponse.json({
      success: true,
      data: MOCK_STATS,
    });
  }),

  // ========== AI 审核 ==========

  // AI 审核接口（注意：实际 AI 流式接口不应被 MSW 拦截，此处仅用于非流式测试）
  http.post(`${API_BASE}/ai/review`, async ({ request }) => {
    await delay(1500); // AI 审核耗时较长
    
    const body = await request.json() as Record<string, string>;
    
    console.log('[MSW] AI 审核请求:', body);
    
    return HttpResponse.json({
      success: true,
      data: {
        decision: 'approved',
        reason: '内容正常，无违规信息',
        confidence: 0.95,
        tags: [],
      },
    });
  }),
];
