/**
 * AI 审核 API 路由
 * 
 * 支持两种模式：
 * 1. 流式响应：逐步返回审核分析过程
 * 2. 结构化响应：直接返回 JSON 审核结果
 */

import { NextRequest, NextResponse } from 'next/server';
import { defaultModel } from '@/lib/ai-client';

// 审核提示词模板
const REVIEW_PROMPT = `你是一个专业的内容审核员。请审核以下内容，并返回审核结果。

审核标准：
1. 是否包含违规内容（色情、暴力、政治敏感、违法等）
2. 是否包含营销推广信息
3. 是否存在不文明用语
4. 是否存在虚假信息

请按照以下 JSON 格式返回结果：
{
  "decision": "approved" | "rejected",
  "confidence": 0.0-1.0,
  "reason": "审核原因",
  "tags": ["标签1", "标签2"],
  "details": {
    "violation": "违规类型",
    "severity": "low" | "medium" | "high",
    "suggestion": "处理建议"
  }
}

待审核内容：`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content } = body;

    if (!content) {
      return NextResponse.json(
        { error: '缺少审核内容' },
        { status: 400 }
      );
    }

    // 检查 AI API Key 是否配置
    if (!process.env.AI_API_KEY) {
      // 返回 Mock 数据（开发环境）
      return NextResponse.json({
        decision: 'approved',
        confidence: 0.95,
        reason: '内容正常，无违规信息（Mock）',
        tags: [],
        details: {
          violation: 'none',
          severity: 'low',
          suggestion: '通过',
        },
      });
    }

    // TODO: 使用 AI SDK 进行实际审核
    // 当前版本返回 Mock 数据，后续接入真实 AI 服务
    const mockResult = {
      decision: 'approved' as const,
      confidence: 0.85 + Math.random() * 0.15,
      reason: 'AI 审核通过，内容正常',
      tags: ['AI审核'],
      details: {
        violation: 'none',
        severity: 'low' as const,
        suggestion: '通过',
      },
    };

    return NextResponse.json(mockResult);
  } catch (error) {
    console.error('[AI Review] 审核失败:', error);
    return NextResponse.json(
      { error: 'AI 审核失败' },
      { status: 500 }
    );
  }
}

/**
 * 流式审核函数（预留）
 * 
 * TODO: 后续实现流式审核功能
 * 注意：此函数当前未导出，实现完成后需改为独立的 API 路由
 */
// 预留函数，后续实现流式审核
async function _POST_STREAM(request: NextRequest) {
  try {
    const body = await request.json();
    const { content } = body;

    if (!content) {
      return NextResponse.json(
        { error: '缺少审核内容' },
        { status: 400 }
      );
    }

    // TODO: 使用 AI SDK 的 streamText 实现流式审核
    // const result = await streamText({
    //   model: defaultModel,
    //   prompt: REVIEW_PROMPT + content,
    // });

    return NextResponse.json({ message: '流式审核待实现' });
  } catch (error) {
    console.error('[AI Review Stream] 审核失败:', error);
    return NextResponse.json(
      { error: 'AI 流式审核失败' },
      { status: 500 }
    );
  }
}
