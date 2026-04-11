/**
 * AI 审核 Hook
 * 
 * 封装 AI 审核相关的功能：
 * - useAIReview: 结构化审核（直接返回 JSON 结果）
 * - useStreamReview: 流式审核（逐步输出分析过程）
 */

import { useState, useCallback } from 'react';

// AI 审核结果类型
export interface AIReviewResult {
  decision: 'approved' | 'rejected';
  confidence: number;
  reason: string;
  tags: string[];
  details: {
    violation: string;
    severity: 'low' | 'medium' | 'high';
    suggestion: string;
  };
}

// Hook 返回类型
interface UseAIReviewReturn {
  loading: boolean;
  error: string | null;
  result: AIReviewResult | null;
  review: (content: string, contentType?: 'text' | 'image' | 'document') => Promise<void>;
  reset: () => void;
}

/**
 * 结构化审核 Hook
 * 
 * 提交内容后等待 AI 返回完整的审核结果
 * 
 * @example
 * const { loading, result, review } = useAIReview();
 * 
 * // 审核内容
 * await review('这是一段需要审核的文本');
 * 
 * // 查看结果
 * if (result) {
 *   console.log(result.decision, result.confidence);
 * }
 */
export function useAIReview(): UseAIReviewReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AIReviewResult | null>(null);

  const review = useCallback(async (
    content: string,
    contentType: 'text' | 'image' | 'document' = 'text'
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, contentType }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '审核失败');
      }

      const data: AIReviewResult = await response.json();
      setResult(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : '审核失败';
      setError(message);
      console.error('[useAIReview] 审核失败:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setResult(null);
  }, []);

  return { loading, error, result, review, reset };
}

/**
 * 流式审核 Hook（后续实现）
 * 
 * 提交内容后，AI 逐步返回审核分析过程
 * 
 * @example
 * const { loading, streamingText, startStream } = useStreamReview();
 * 
 * // 开始流式审核
 * await startStream('这是一段需要审核的文本');
 * 
 * // streamingText 会逐步更新
 */
export function useStreamReview() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [streamingText, setStreamingText] = useState('');

  const startStream = useCallback(async (content: string) => {
    setLoading(true);
    setError(null);
    setStreamingText('');

    try {
      // TODO: 实现流式响应
      // const response = await fetch('/api/ai/review/stream', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ content }),
      // });
      // 
      // const reader = response.body?.getReader();
      // const decoder = new TextDecoder();
      // 
      // while (true) {
      //   const { done, value } = await reader.read();
      //   if (done) break;
      //   const chunk = decoder.decode(value);
      //   setStreamingText((prev) => prev + chunk);
      // }

      // 当前使用 Mock
      setStreamingText('AI 正在审核内容...\n\n审核完成：内容正常，无违规信息。');
    } catch (err) {
      const message = err instanceof Error ? err.message : '流式审核失败';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, streamingText, startStream };
}
