import { describe, it, expect } from 'vitest';
import type {
  PreviewType,
  PreviewData,
  ImagePreviewProps,
  VideoPreviewProps,
  AudioPreviewProps,
  DocumentPreviewProps,
  AnnotationPreviewProps,
} from './AnnotationPreview.types';

describe('AnnotationPreview.types', () => {
  it('PreviewType 类型包含所有支持的文件类型', () => {
    const types: PreviewType[] = ['image', 'video', 'audio', 'document'];
    expect(types).toHaveLength(4);
    expect(types).toContain('image');
    expect(types).toContain('video');
    expect(types).toContain('audio');
    expect(types).toContain('document');
  });

  it('PreviewData 接口包含必需字段', () => {
    const data: PreviewData = {
      type: 'image',
      url: 'https://example.com/test.jpg',
    };
    expect(data.type).toBe('image');
    expect(data.url).toBe('https://example.com/test.jpg');
  });

  it('PreviewData 接口支持可选 title 字段', () => {
    const dataWithTitle: PreviewData = {
      type: 'video',
      url: 'https://example.com/test.mp4',
      title: '测试视频',
    };
    expect(dataWithTitle.title).toBe('测试视频');

    const dataWithoutTitle: PreviewData = {
      type: 'audio',
      url: 'https://example.com/test.mp3',
    };
    expect(dataWithoutTitle.title).toBeUndefined();
  });

  it('ImagePreviewProps 接口正确', () => {
    const props: ImagePreviewProps = {
      src: 'https://example.com/test.jpg',
      title: '测试图片',
    };
    expect(props.src).toBe('https://example.com/test.jpg');
    expect(props.title).toBe('测试图片');
  });

  it('VideoPreviewProps 接口正确', () => {
    const props: VideoPreviewProps = {
      src: 'https://example.com/test.mp4',
      title: '测试视频',
      poster: 'https://example.com/poster.jpg',
    };
    expect(props.src).toBe('https://example.com/test.mp4');
    expect(props.title).toBe('测试视频');
    expect(props.poster).toBe('https://example.com/poster.jpg');
  });

  it('AudioPreviewProps 接口正确', () => {
    const props: AudioPreviewProps = {
      src: 'https://example.com/test.mp3',
      title: '测试音频',
    };
    expect(props.src).toBe('https://example.com/test.mp3');
    expect(props.title).toBe('测试音频');
  });

  it('DocumentPreviewProps 接口正确', () => {
    const props: DocumentPreviewProps = {
      file: 'https://example.com/test.pdf',
      title: '测试文档',
    };
    expect(props.file).toBe('https://example.com/test.pdf');
    expect(props.title).toBe('测试文档');
  });

  it('AnnotationPreviewProps 接口支持可选 data 字段', () => {
    const propsWithData: AnnotationPreviewProps = {
      data: { type: 'image', url: 'https://example.com/test.jpg' },
    };
    expect(propsWithData.data?.type).toBe('image');

    const propsWithoutData: AnnotationPreviewProps = {};
    expect(propsWithoutData.data).toBeUndefined();

    const propsWithNull: AnnotationPreviewProps = {
      data: null,
    };
    expect(propsWithNull.data).toBeNull();
  });
});
