/**
 * 测试媒体资源工具
 * 
 * 提供测试视频和音频数据，用于解决 CORS 跨域问题。
 * 当外部 URL 加载失败时，自动 fallback 到本地测试数据。
 */

/**
 * 获取本地测试音频 URL
 */
export function getTestAudioUrl(): string {
  return '/语音.mp3';
}

/**
 * 获取本地测试视频 URL
 */
export function getTestVideoUrl(): string {
  return '/国旗.mp4';
}

/**
 * 判断 URL 是否是外部 URL
 */
export function isExternalUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * 将外部 URL 转换为本地 fallback URL
 * 如果加载失败，返回测试数据
 */
export function getFallbackUrl(type: 'audio' | 'video'): string {
  if (type === 'audio') {
    return getTestAudioUrl();
  }
  return getTestVideoUrl();
}
