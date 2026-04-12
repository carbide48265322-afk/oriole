import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import AnnotationPreview from './AnnotationPreview';

// Mock 子组件
vi.mock('./ImagePreview', () => ({
  default: ({ src, title }: { src: string; title?: string }) => (
    <div data-testid="image-preview">
      Image: {src} {title && `- ${title}`}
    </div>
  ),
}));

vi.mock('./VideoPreview', () => ({
  default: ({ src, title }: { src: string; title?: string }) => (
    <div data-testid="video-preview">
      Video: {src} {title && `- ${title}`}
    </div>
  ),
}));

vi.mock('./AudioPreview', () => ({
  default: ({ src, title }: { src: string; title?: string }) => (
    <div data-testid="audio-preview">
      Audio: {src} {title && `- ${title}`}
    </div>
  ),
}));

vi.mock('./DocumentPreview', () => ({
  default: ({ file, title }: { file: string; title?: string }) => (
    <div data-testid="document-preview">
      Document: {file} {title && `- ${title}`}
    </div>
  ),
}));

describe('AnnotationPreview', () => {
  it('data 为 null 时显示请选择审核项', () => {
    render(<AnnotationPreview data={null} />);
    expect(screen.getByText('请选择审核项')).toBeInTheDocument();
  });

  it('data 为 undefined 时显示请选择审核项', () => {
    render(<AnnotationPreview />);
    expect(screen.getByText('请选择审核项')).toBeInTheDocument();
  });

  it('image 类型渲染图片预览', () => {
    render(
      <AnnotationPreview
        data={{
          type: 'image',
          url: 'https://example.com/test.jpg',
          title: '测试图片',
        }}
      />,
    );
    expect(screen.getByTestId('image-preview')).toBeInTheDocument();
    expect(screen.getByText('Image: https://example.com/test.jpg - 测试图片')).toBeInTheDocument();
  });

  it('video 类型渲染视频预览', () => {
    render(
      <AnnotationPreview
        data={{
          type: 'video',
          url: 'https://example.com/test.mp4',
        }}
      />,
    );
    expect(screen.getByTestId('video-preview')).toBeInTheDocument();
  });

  it('audio 类型渲染音频预览', () => {
    render(
      <AnnotationPreview
        data={{
          type: 'audio',
          url: 'https://example.com/test.mp3',
        }}
      />,
    );
    expect(screen.getByTestId('audio-preview')).toBeInTheDocument();
  });

  it('document 类型渲染文档预览', () => {
    render(
      <AnnotationPreview
        data={{
          type: 'document',
          url: 'https://example.com/test.pdf',
        }}
      />,
    );
    expect(screen.getByTestId('document-preview')).toBeInTheDocument();
  });

  it('不支持的类型显示错误提示', () => {
    render(
      <AnnotationPreview
        data={{
          type: 'unknown' as never,
          url: 'https://example.com/test.xyz',
        }}
      />,
    );
    expect(screen.getByText('不支持的文件类型')).toBeInTheDocument();
  });
});
