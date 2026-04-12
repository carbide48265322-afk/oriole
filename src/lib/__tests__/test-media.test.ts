import { describe, it, expect } from 'vitest';
import {
  getTestAudioUrl,
  getTestVideoUrl,
  isExternalUrl,
  getFallbackUrl,
} from '@/lib/test-media';

describe('test-media', () => {
  describe('isExternalUrl', () => {
    it('应该识别 http URL 为外部 URL', () => {
      expect(isExternalUrl('http://example.com/video.mp4')).toBe(true);
    });

    it('应该识别 https URL 为外部 URL', () => {
      expect(isExternalUrl('https://example.com/video.mp4')).toBe(true);
    });

    it('应该识别 Google Storage URL 为外部 URL', () => {
      expect(
        isExternalUrl(
          'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
        )
      ).toBe(true);
    });

    it('应该识别 SoundHelix URL 为外部 URL', () => {
      expect(
        isExternalUrl(
          'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
        )
      ).toBe(true);
    });

    it('应该将相对路径识别为非外部 URL', () => {
      expect(isExternalUrl('/assets/test-video.mp4')).toBe(false);
    });

    it('应该将 base64 data URL 识别为非外部 URL', () => {
      expect(isExternalUrl('data:video/mp4;base64,AAAA')).toBe(false);
    });

    it('应该将 blob URL 识别为非外部 URL', () => {
      expect(isExternalUrl('blob:http://localhost:3000/xxx')).toBe(false);
    });

    it('应该将无效 URL 识别为非外部 URL', () => {
      expect(isExternalUrl('not-a-url')).toBe(false);
    });

    it('应该将空字符串识别为非外部 URL', () => {
      expect(isExternalUrl('')).toBe(false);
    });
  });

  describe('getTestAudioUrl', () => {
    it('应该返回 base64 编码的音频 URL', () => {
      const url = getTestAudioUrl();
      expect(url).toMatch(/^data:audio\/mp3;base64,/);
    });

    it('应该返回有效的 base64 数据', () => {
      const url = getTestAudioUrl();
      const base64Data = url.split(',')[1];
      expect(base64Data).toBeDefined();
      expect(base64Data.length).toBeGreaterThan(0);
    });
  });

  describe('getTestVideoUrl', () => {
    it('应该返回 base64 编码的视频 URL', () => {
      const url = getTestVideoUrl();
      expect(url).toMatch(/^data:video\/mp4;base64,/);
    });

    it('应该返回有效的 base64 数据', () => {
      const url = getTestVideoUrl();
      const base64Data = url.split(',')[1];
      expect(base64Data).toBeDefined();
      expect(base64Data.length).toBeGreaterThan(0);
    });
  });

  describe('getFallbackUrl', () => {
    it('应该为 audio 类型返回音频 URL', () => {
      const url = getFallbackUrl('audio');
      expect(url).toMatch(/^data:audio\/mp3;base64,/);
    });

    it('应该为 video 类型返回视频 URL', () => {
      const url = getFallbackUrl('video');
      expect(url).toMatch(/^data:video\/mp4;base64,/);
    });

    it('audio fallback 应该与 getTestAudioUrl 相同', () => {
      expect(getFallbackUrl('audio')).toBe(getTestAudioUrl());
    });

    it('video fallback 应该与 getTestVideoUrl 相同', () => {
      expect(getFallbackUrl('video')).toBe(getTestVideoUrl());
    });
  });
});
