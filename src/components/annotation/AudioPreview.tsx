'use client';

import React, { useRef, useEffect, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { Button, Space, Empty } from 'antd';
import { PlayCircleOutlined, PauseCircleOutlined } from '@ant-design/icons';
import type { AudioPreviewProps } from './AnnotationPreview.types';
import { getFallbackUrl, isExternalUrl } from '@/lib/test-media';

export default function AudioPreview({ src, title }: AudioPreviewProps) {
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState(false);
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    if (!src || !waveformRef.current) return;

    setError(false);
    setIsPlaying(false);
    setUseFallback(false);

    const isExternal = isExternalUrl(src);
    const currentSrc = src;

    const wavesurfer = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: '#a0a0a0',
      progressColor: '#1677ff',
      cursorColor: '#1677ff',
      barWidth: 2,
      barRadius: 3,
      cursorWidth: 1,
      height: 80,
      normalize: true,
      backend: 'WebAudio',
    });

    wavesurfer.load(currentSrc);

    wavesurfer.on('play', () => setIsPlaying(true));
    wavesurfer.on('pause', () => setIsPlaying(false));
    
    // 监听错误事件，如果加载失败则使用 fallback
    wavesurfer.on('error', () => {
      // 如果是外部 URL 且加载失败，尝试使用 fallback
      if (isExternal && !useFallback) {
        setUseFallback(true);
        const fallbackUrl = getFallbackUrl('audio');
        wavesurfer.load(fallbackUrl);
      } else {
        setError(true);
      }
    });

    wavesurferRef.current = wavesurfer;

    return () => {
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
        wavesurferRef.current = null;
      }
    };
  }, [src, useFallback]);

  const togglePlay = () => {
    if (wavesurferRef.current) {
      wavesurferRef.current.playPause();
    }
  };

  if (!src) {
    return <Empty description="暂无音频" />;
  }

  if (error) {
    return <Empty description="音频加载失败" />;
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {title && (
        <div style={{ padding: '8px 0', fontWeight: 500 }}>{title}</div>
      )}
      <div
        ref={waveformRef}
        style={{ flex: 1, minHeight: 80, padding: '16px 0' }}
      />
      <div style={{ padding: '8px 0', textAlign: 'center' }}>
        <Space>
          <Button
            type="primary"
            shape="circle"
            size="large"
            icon={isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
            onClick={togglePlay}
            aria-label={isPlaying ? '暂停' : '播放'}
          />
        </Space>
      </div>
    </div>
  );
}
