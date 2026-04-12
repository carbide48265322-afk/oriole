'use client';

import React from 'react';
import { Card, Col, Row, Statistic, Tag, Typography } from 'antd';
import { ArrowUpOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import type { WordStats, WordCategory, WordLevel } from '@/types/sensitive-word';

const { Text } = Typography;

const CATEGORY_CONFIG: Record<
  WordCategory,
  { label: string; color: string }
> = {
  text: { label: '文字', color: 'blue' },
  image: { label: '图片', color: 'green' },
  video: { label: '视频', color: 'orange' },
  audio: { label: '音频', color: 'purple' },
};

const LEVEL_CONFIG: Record<
  WordLevel,
  { label: string; color: string }
> = {
  high: { label: '高', color: 'red' },
  medium: { label: '中', color: 'gold' },
  low: { label: '低', color: 'green' },
};

interface StatCardsProps {
  stats: WordStats;
}

export default function StatCards({ stats }: StatCardsProps) {
  return (
    <Card style={{ marginBottom: 16 }}>
      {/* 总词数和今日新增 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={12} sm={8} md={6}>
          <Statistic title="总词数" value={stats.total} />
        </Col>
        <Col xs={12} sm={8} md={6}>
          <Statistic
            title="今日新增"
            value={stats.todayAdded}
            prefix={<ArrowUpOutlined />}
            valueStyle={{ color: stats.todayAdded > 0 ? '#3f8600' : undefined }}
          />
        </Col>
      </Row>

      {/* 按分类统计 */}
      <div style={{ marginBottom: 8 }}>
        <Text strong style={{ marginBottom: 8, display: 'block' }}>
          按分类
        </Text>
      </div>
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        {(Object.keys(CATEGORY_CONFIG) as WordCategory[]).map((category) => (
          <Col xs={12} sm={6} md={6} key={category}>
            <Card size="small">
              <Statistic
                title={
                  <Tag color={CATEGORY_CONFIG[category].color}>
                    {CATEGORY_CONFIG[category].label}
                  </Tag>
                }
                value={stats.byCategory[category]}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* 按级别统计 */}
      <div style={{ marginBottom: 8 }}>
        <Text strong style={{ marginBottom: 8, display: 'block' }}>
          按级别
        </Text>
      </div>
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        {(Object.keys(LEVEL_CONFIG) as WordLevel[]).map((level) => (
          <Col xs={8} sm={8} md={8} key={level}>
            <Card size="small">
              <Statistic
                title={
                  <Tag color={LEVEL_CONFIG[level].color}>
                    {LEVEL_CONFIG[level].label}
                  </Tag>
                }
                value={stats.byLevel[level]}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* 启用/禁用状态 */}
      <div style={{ marginBottom: 8 }}>
        <Text strong style={{ marginBottom: 8, display: 'block' }}>
          状态
        </Text>
      </div>
      <Row gutter={[16, 16]}>
        <Col xs={12} sm={8} md={6}>
          <Statistic
            title={
              <Text type="success">
                <CheckCircleOutlined style={{ marginRight: 4 }} />
                启用
              </Text>
            }
            value={stats.enabled}
            valueStyle={{ color: '#52c41a' }}
          />
        </Col>
        <Col xs={12} sm={8} md={6}>
          <Statistic
            title={
              <Text type="danger">
                <CloseCircleOutlined style={{ marginRight: 4 }} />
                禁用
              </Text>
            }
            value={stats.disabled}
            valueStyle={{ color: '#ff4d4f' }}
          />
        </Col>
      </Row>
    </Card>
  );
}
