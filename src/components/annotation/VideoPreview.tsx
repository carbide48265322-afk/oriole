'use client';

import React, { useRef, useEffect, useState } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import { Empty } from 'antd';
import type { VideoPreviewProps } from './AnnotationPreview.types';

export default function VideoPreview({
  src,
  title,
  poster,
}: VideoPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<ReturnType<typeof videojs> | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!src || !videoRef.current) return;

    setError(false);

    const player = videojs(videoRef.current, {
      controls: true,
      autoplay: false,
      preload: 'auto',
      fluid: true,
      poster: poster || undefined,
      sources: [
        {
          src,
          type: 'video/mp4',
        },
      ],
    });

    player.on('error', () => {
      setError(true);
    });

    playerRef.current = player;

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [src, poster]);

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
