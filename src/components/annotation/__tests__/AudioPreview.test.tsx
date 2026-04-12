import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import AudioPreview from '@/components/annotation/AudioPreview';

// Mock wavesurfer.js
vi.mock('wavesurfer.js', () => {
  const mockWavesurfer = {
    load: vi.fn(),
    on: vi.fn(),
    playPause: vi.fn(),
    destroy: vi.fn(),
    play: vi.fn().mockResolvedValue(undefined),
  };

  return {
    default: {
      create: vi.fn(() => mockWavesurfer),
    },
  };
});

// Mock test-media
vi.mock('@/lib/test-media', () => ({
  getFallbackUrl: vi.fn().mockReturnValue('data:audio/mp3;base64,test'),
  isExternalUrl: vi.fn().mockImplementation((url: string) => {
    return url.startsWith('http://') || url.startsWith('https://');
  }),
}));

describe('AudioPreview', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('应该在没有 src 时显示空状态', () => {
    render(<AudioPreview src="" title="测试音频" />);
    expect(screen.getByText('暂无音频')).toBeInTheDocument();
  });

  it('应该在没有 src 时显示默认空状态', () => {
    render(<AudioPreview src={null as any} />);
    expect(screen.getByText('暂无音频')).toBeInTheDocument();
  });

  it('应该渲染音频波形容器', () => {
    render(<AudioPreview src="/test-audio.mp3" title="测试音频" />);
    expect(screen.getByText('测试音频')).toBeInTheDocument();
  });

  it('应该渲染播放按钮', () => {
    render(<AudioPreview src="/test-audio.mp3" />);
    const playButton = screen.getByRole('button');
    expect(playButton).toBeInTheDocument();
  });

  it('应该在有标题时显示标题', () => {
    render(<AudioPreview src="/test-audio.mp3" title="我的音频" />);
    expect(screen.getByText('我的音频')).toBeInTheDocument();
  });

  it('应该在没有标题时不显示标题', () => {
    render(<AudioPreview src="/test-audio.mp3" />);
    // 只应该显示播放按钮，不应该有标题文本
    const titles = screen.queryAllByText(/.+/);
    const hasTitle = titles.some(
      (el) =>
        el.textContent === '我的音频' || el.textContent === '测试音频'
    );
    expect(hasTitle).toBe(false);
  });
});
