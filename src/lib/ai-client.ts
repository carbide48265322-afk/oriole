/**
 * AI 客户端配置
 * 
 * ⚠️ 注意：此模块仅在服务端使用（Server Components / API Routes）
 * 因为包含 API Key 等敏感信息，不应暴露给客户端
 * 
 * 支持通义千问 (Qwen) 和美团 Longcat
 * 两者都兼容 OpenAI API 格式
 */

import { createOpenAI } from '@ai-sdk/openai';

// 通义千问配置
const qwen = createOpenAI({
  baseURL: process.env.AI_API_URL || 'https://dashscope.aliyuncs.com/compatible-mode/v1',
  apiKey: process.env.AI_API_KEY || '',
});

// 美团 Longcat 配置
const longcat = createOpenAI({
  baseURL: process.env.LONGCAT_API_URL || 'https://api.longcat.com/openai-compatible/v1',
  apiKey: process.env.LONGCAT_API_KEY || '',
});

// 模型配置
export const models = {
  // 通义千问模型
  qwen: {
    turbo: qwen('qwen-turbo'),       // 快速、便宜
    plus: qwen('qwen-plus'),         // 平衡
    max: qwen('qwen-max'),           // 最强
    vlPlus: qwen('qwen-vl-plus'),    // 多模态（图片+文本）
  },
  
  // Longcat 模型
  longcat: {
    flash: longcat('longcat-flash'), // 快速
    pro: longcat('longcat-pro'),     // 专业
  },
};

// 默认使用的模型
export const defaultModel = models.qwen.plus;

// 导出模型供外部使用
export { qwen, longcat };
