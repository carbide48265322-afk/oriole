'use client';

import React, { useRef, useEffect, useState } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import { Empty } from 'antd';
import type { VideoPreviewProps } from './AnnotationPreview.types';
import { getFallbackUrl, isExternalUrl } from '@/lib/test-media';

export default function VideoPreview({
  src,
  title,
  poster,
}: VideoPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<ReturnType<typeof videojs> | null>(null);
  const [error, setError] = useState(false);
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    if (!src || !videoRef.current) return;

    setError(false);
    setUseFallback(false);

    // 判断是否是外部 URL，如果是，添加 crossorigin 属性尝试 CORS
    const isExternal = isExternalUrl(src);
    const videoElement = videoRef.current;
    
    if (isExternal) {
      videoElement.crossOrigin = 'anonymous';
    }

    const player = videojs(videoRef.current, {
      controls: true,
      autoplay: false,
      preload: 'auto',
      fluid: true,
      poster: poster || undefined,
    });

    // 设置视频源
    player.src(src);

    // 监听错误事件，如果加载失败则使用 fallback
    player.on('error', () => {
      // 如果是外部 URL 且加载失败，尝试使用 fallback
      if (isExternal && !useFallback) {
        setUseFallback(true);
        const fallbackUrl = getFallbackUrl('video');
        player.src(fallbackUrl);
        const playPromise = player.play();
        if (playPromise) {
          playPromise.catch(() => {
            // fallback 播放失败，显示错误
            setError(true);
          });
        }
      } else {
        setError(true);
      }
    });

    playerRef.current = player;

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [src, poster, useFallback]);

  if (!src) {
    return <Empty description="暂无视频" />;
  }

  if (error) {
    return <Empty description="视频加载失败" />;
  }

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {title && (
        <div style={{ padding: '8px 0', fontWeight: 500 }}>{title}</div>
      )}
      <div
        data-vjs-player
        style={{ flex: 1, display: 'flex', alignItems: 'center' }}
      >
        <video
          ref={videoRef}
          className="video-js vjs-default-skin"
          playsInline
        />
      </div>
    </div>
  );
}
