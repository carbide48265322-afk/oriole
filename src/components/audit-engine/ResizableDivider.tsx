'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';

interface ResizableDividerProps {
  onResize: (delta: number) => void;
  minWidth: number;
  maxWidth: number;
  currentWidth: number;
}

export default function ResizableDivider({
  onResize,
  minWidth,
  maxWidth,
  currentWidth,
}: ResizableDividerProps) {
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);
  const onResizeRef = useRef(onResize);

  // 保持 onResize 引用最新
  useEffect(() => {
    onResizeRef.current = onResize;
  }, [onResize]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsDragging(true);
      startXRef.current = e.clientX;
      startWidthRef.current = currentWidth;
    },
    [currentWidth],
  );

  // 使用 useEffect 处理事件监听和清理
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const delta = e.clientX - startXRef.current;
      const newWidth = Math.min(
        Math.max(startWidthRef.current + delta, minWidth),
        maxWidth,
      );
      onResizeRef.current(newWidth - startWidthRef.current);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    // 清理函数
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, minWidth, maxWidth]);

  return (
    <div
      onMouseDown={handleMouseDown}
      style={{
        width: 4,
        cursor: 'col-resize',
        background: isDragging ? '#1677ff' : '#f0f0f0',
        transition: isDragging ? 'none' : 'background 0.2s',
        flexShrink: 0,
      }}
    />
  );
}
