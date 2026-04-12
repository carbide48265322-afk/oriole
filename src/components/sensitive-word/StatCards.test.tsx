import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import StatCards from '@/components/sensitive-word/StatCards';
import type { WordStats } from '@/types/sensitive-word';

const mockStats: WordStats = {
  total: 100,
  todayAdded: 5,
  enabled: 60,
  pending: 20,
  disabled: 20,
};

describe('StatCards', () => {
  it('应该正确渲染统计卡片', () => {
    render(<StatCards stats={mockStats} />);

    // 验证总词数
    expect(screen.getByText('总词数')).toBeInTheDocument();
    const allNumbers = screen.getAllByText('100');
    expect(allNumbers.length).toBeGreaterThan(0);

    // 验证今日新增
    expect(screen.getByText('今日新增')).toBeInTheDocument();
    const todayNumbers = screen.getAllByText('5');
    expect(todayNumbers.length).toBeGreaterThan(0);
  });

  it('应该显示启用/待审核/禁用状态', () => {
    render(<StatCards stats={mockStats} />);

    expect(screen.getByText('启用')).toBeInTheDocument();
    expect(screen.getByText('待审核')).toBeInTheDocument();
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

  it('不应该显示按分类统计', () => {
    render(<StatCards stats={mockStats} />);

    expect(screen.queryByText('按分类')).not.toBeInTheDocument();
  });

  it('不应该显示按级别统计', () => {
    render(<StatCards stats={mockStats} />);

    expect(screen.queryByText('按级别')).not.toBeInTheDocument();
  });

  it('应该正确渲染所有统计项', () => {
    render(<StatCards stats={mockStats} />);

    expect(screen.getByText('总词数')).toBeInTheDocument();
    expect(screen.getByText('今日新增')).toBeInTheDocument();
    expect(screen.getByText('启用')).toBeInTheDocument();
    expect(screen.getByText('待审核')).toBeInTheDocument();
    expect(screen.getByText('禁用')).toBeInTheDocument();
  });

  it('应该正确显示各状态的数量', () => {
    render(<StatCards stats={mockStats} />);

    expect(screen.getAllByText('60').length).toBeGreaterThan(0);
    expect(screen.getAllByText('20').length).toBeGreaterThan(0);
  });
});
