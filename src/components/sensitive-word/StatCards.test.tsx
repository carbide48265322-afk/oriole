import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import StatCards from '@/components/sensitive-word/StatCards';
import type { WordStats } from '@/types/sensitive-word';

const mockStats: WordStats = {
  total: 100,
  todayAdded: 5,
  byCategory: {
    text: 40,
    image: 30,
    video: 20,
    audio: 10,
  },
  byLevel: {
    high: 30,
    medium: 50,
    low: 20,
  },
  enabled: 80,
  disabled: 20,
};

describe('StatCards', () => {
  it('应该正确渲染统计卡片', () => {
    render(<StatCards stats={mockStats} />);

    // 验证总词数
    expect(screen.getByText('总词数')).toBeInTheDocument();
    // 总词数 100 是唯一的
    const allNumbers = screen.getAllByText('100');
    expect(allNumbers.length).toBeGreaterThan(0);

    // 验证今日新增
    expect(screen.getByText('今日新增')).toBeInTheDocument();
    const todayNumbers = screen.getAllByText('5');
    expect(todayNumbers.length).toBeGreaterThan(0);
  });

  it('应该显示按分类统计', () => {
    render(<StatCards stats={mockStats} />);

    expect(screen.getByText('按分类')).toBeInTheDocument();
    expect(screen.getByText('文字')).toBeInTheDocument();
    expect(screen.getByText('图片')).toBeInTheDocument();
    expect(screen.getByText('视频')).toBeInTheDocument();
    expect(screen.getByText('音频')).toBeInTheDocument();
  });

  it('应该显示按级别统计', () => {
    render(<StatCards stats={mockStats} />);

    expect(screen.getByText('按级别')).toBeInTheDocument();
    expect(screen.getByText('高')).toBeInTheDocument();
    expect(screen.getByText('中')).toBeInTheDocument();
    expect(screen.getByText('低')).toBeInTheDocument();
  });

  it('应该显示启用/禁用状态', () => {
    render(<StatCards stats={mockStats} />);

    expect(screen.getByText('状态')).toBeInTheDocument();
    expect(screen.getByText('启用')).toBeInTheDocument();
    expect(screen.getByText('禁用')).toBeInTheDocument();
  });

  it('当今日新增为 0 时应该正确显示', () => {
    const statsWithZeroToday: WordStats = {
      ...mockStats,
      todayAdded: 0,
    };

    render(<StatCards stats={statsWithZeroToday} />);
    expect(screen.getByText('今日新增')).toBeInTheDocument();
  });

  it('应该正确渲染所有分类和级别标签', () => {
    const statsWithAllCategories: WordStats = {
      total: 50,
      todayAdded: 2,
      byCategory: {
        text: 20,
        image: 15,
        video: 10,
        audio: 5,
      },
      byLevel: {
        high: 15,
        medium: 25,
        low: 10,
      },
      enabled: 35,
      disabled: 15,
    };

    render(<StatCards stats={statsWithAllCategories} />);
    
    // 验证所有分类标签存在
    expect(screen.getByText('文字')).toBeInTheDocument();
    expect(screen.getByText('图片')).toBeInTheDocument();
    expect(screen.getByText('视频')).toBeInTheDocument();
    expect(screen.getByText('音频')).toBeInTheDocument();

    // 验证所有级别标签存在
    expect(screen.getByText('高')).toBeInTheDocument();
    expect(screen.getByText('中')).toBeInTheDocument();
    expect(screen.getByText('低')).toBeInTheDocument();

    // 验证状态标签存在
    expect(screen.getByText('启用')).toBeInTheDocument();
    expect(screen.getByText('禁用')).toBeInTheDocument();
  });
});
