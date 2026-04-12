'use client';

import React, { useState, useCallback, useRef } from 'react';

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

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsDragging(true);
      startXRef.current = e.clientX;
      startWidthRef.current = currentWidth;

      const handleMouseMove = (e: MouseEvent) => {
        const delta = e.clientX - startXRef.current;
        const newWidth = Math.min(
          Math.max(startWidthRef.current + delta, minWidth),
          maxWidth,
        );
        onResize(newWidth - startWidthRef.current);
      };

      const handleMouseUp = () => {
        setIsDragging(false);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [currentWidth, minWidth, maxWidth, onResize],
  );

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
