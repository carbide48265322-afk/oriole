import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import VideoPreview from './VideoPreview';

// Mock video.js
const mockOn = vi.fn();
const mockDispose = vi.fn();
const mockVideojs = vi.fn().mockReturnValue({
  on: mockOn,
  dispose: mockDispose,
});

vi.mock('video.js', () => ({
  default: (...args: unknown[]) => mockVideojs(...args),
}));

// Mock video-js.css
vi.mock('video.js/dist/video-js.css', () => ({}));

describe('VideoPreview', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('空 src 时显示空状态', () => {
    render(<VideoPreview src="" />);
    expect(screen.getByText('暂无视频')).toBeInTheDocument();
  });

  it('渲染视频元素和标题', () => {
    render(
      <VideoPreview
        src="https://example.com/test.mp4"
        title="测试视频"
      />,
    );
    expect(screen.getByText('测试视频')).toBeInTheDocument();
    const video = document.querySelector('video');
    expect(video).toBeInTheDocument();
  });

  it('无标题时正常渲染', () => {
    render(<VideoPreview src="https://example.com/test.mp4" />);
    const video = document.querySelector('video');
    expect(video).toBeInTheDocument();
  });

  it('传递 poster 属性', () => {
    render(
      <VideoPreview
        src="https://example.com/test.mp4"
        poster="https://example.com/poster.jpg"
      />,
    );
    expect(mockVideojs).toHaveBeenCalled();
    const callArgs = mockVideojs.mock.calls[0][1];
    expect(callArgs.poster).toBe('https://example.com/poster.jpg');
  });

  it('视频加载失败时显示错误提示', async () => {
    render(<VideoPreview src="https://example.com/test.mp4" />);

    // 触发错误回调
    await act(async () => {
      const errorHandler = mockOn.mock.calls.find(
        (call: string[]) => call[0] === 'error',
      )?.[1];
      if (errorHandler) {
        errorHandler();
      }
    });

    expect(screen.getByText('视频加载失败')).toBeInTheDocument();
  });

  it('组件卸载时销毁播放器', () => {
    const { unmount } = render(
      <VideoPreview src="https://example.com/test.mp4" />,
    );
    expect(mockDispose).not.toHaveBeenCalled();

    unmount();
    expect(mockDispose).toHaveBeenCalled();
  });
});
