import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import AudioPreview from './AudioPreview';

// Mock wavesurfer.js
const mockOn = vi.fn();
const mockLoad = vi.fn();
const mockPlayPause = vi.fn();
const mockDestroy = vi.fn();

const mockCreate = vi.fn().mockReturnValue({
  on: mockOn,
  load: mockLoad,
  playPause: mockPlayPause,
  destroy: mockDestroy,
});

vi.mock('wavesurfer.js', () => ({
  default: {
    create: (...args: unknown[]) => mockCreate(...args),
  },
}));

describe('AudioPreview', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('空 src 时显示空状态', () => {
    render(<AudioPreview src="" />);
    expect(screen.getByText('暂无音频')).toBeInTheDocument();
  });

  it('渲染波形图容器和标题', () => {
    render(
      <AudioPreview
        src="https://example.com/test.mp3"
        title="测试音频"
      />,
    );
    expect(screen.getByText('测试音频')).toBeInTheDocument();
    expect(mockCreate).toHaveBeenCalled();
  });

  it('无标题时正常渲染', () => {
    render(<AudioPreview src="https://example.com/test.mp3" />);
    expect(mockCreate).toHaveBeenCalled();
  });

  it('播放按钮触发 playPause', () => {
    render(<AudioPreview src="https://example.com/test.mp3" />);
    const playBtn = screen.getByLabelText('播放');
    fireEvent.click(playBtn);
    expect(mockPlayPause).toHaveBeenCalled();
  });

  it('音频加载失败时显示错误提示', async () => {
    render(<AudioPreview src="https://example.com/test.mp3" />);

    // 触发错误回调
    await act(async () => {
      const errorHandler = mockOn.mock.calls.find(
        (call: string[]) => call[0] === 'error',
      )?.[1];
      if (errorHandler) {
        errorHandler();
      }
    });

    expect(screen.getByText('音频加载失败')).toBeInTheDocument();
  });

  it('组件卸载时销毁 wavesurfer', () => {
    const { unmount } = render(
      <AudioPreview src="https://example.com/test.mp3" />,
    );
    expect(mockDestroy).not.toHaveBeenCalled();

    unmount();
    expect(mockDestroy).toHaveBeenCalled();
  });

  it('播放状态变化时更新按钮图标', async () => {
    render(<AudioPreview src="https://example.com/test.mp3" />);

    // 初始状态是播放按钮
    expect(screen.getByLabelText('播放')).toBeInTheDocument();

    // 触发 play 事件
    await act(async () => {
      const playHandler = mockOn.mock.calls.find(
        (call: string[]) => call[0] === 'play',
      )?.[1];
      if (playHandler) {
        playHandler();
      }
    });

    // 状态变为暂停按钮
    expect(screen.getByLabelText('暂停')).toBeInTheDocument();
  });
});
