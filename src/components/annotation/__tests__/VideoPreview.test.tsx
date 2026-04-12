import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import VideoPreview from '@/components/annotation/VideoPreview';

// Mock video.js
vi.mock('video.js', () => {
  const mockPlayer = {
    src: vi.fn(),
    on: vi.fn(),
    play: vi.fn().mockResolvedValue(undefined),
    dispose: vi.fn(),
  };

  return {
    default: vi.fn(() => mockPlayer),
  };
});

// Mock test-media
vi.mock('@/lib/test-media', () => ({
  getFallbackUrl: vi.fn().mockReturnValue('data:video/mp4;base64,test'),
  isExternalUrl: vi.fn().mockImplementation((url: string) => {
    return url.startsWith('http://') || url.startsWith('https://');
  }),
}));

describe('VideoPreview', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('应该在没有 src 时显示空状态', () => {
    render(<VideoPreview src="" title="测试视频" />);
    expect(screen.getByText('暂无视频')).toBeInTheDocument();
  });

  it('应该在没有 src 时显示默认空状态', () => {
    render(<VideoPreview src={null as any} />);
    expect(screen.getByText('暂无视频')).toBeInTheDocument();
  });

  it('应该渲染视频播放器容器', () => {
    render(<VideoPreview src="/test-video.mp4" title="测试视频" />);
    expect(screen.getByText('测试视频')).toBeInTheDocument();
  });

  it('应该为外部 URL 设置 crossOrigin 属性', () => {
    const { container } = render(
      <VideoPreview src="https://example.com/video.mp4" />
    );

    const video = container.querySelector('video');
    expect(video?.crossOrigin).toBe('anonymous');
  });

  it('不应该为本地 URL 设置 crossOrigin 属性', () => {
    const { container } = render(
      <VideoPreview src="/assets/test-video.mp4" />
    );

    const video = container.querySelector('video');
    // 本地 URL 不设置 crossOrigin，值应该是 null
    expect(video?.crossOrigin).toBeNull();
  });

  it('应该在有标题时显示标题', () => {
    render(<VideoPreview src="/test-video.mp4" title="我的视频" />);
    expect(screen.getByText('我的视频')).toBeInTheDocument();
  });

  it('应该在没有标题时不显示标题', () => {
    render(<VideoPreview src="/test-video.mp4" />);
    expect(screen.queryByText(/.+/)).not.toBeInTheDocument();
  });
});
