'use client';

import React from 'react';
import { Card, Col, Row, Statistic, Typography } from 'antd';
import {
  ArrowUpOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import type { WordStats } from '@/types/sensitive-word';

interface StatCardsProps {
  stats: WordStats;
}

export default function StatCards({ stats }: StatCardsProps) {
  return (
    <Card style={{ marginBottom: 16 }}>
      <Row gutter={[16, 16]}>
        <Col xs={12} sm={6} md={6}>
          <Statistic title="总词数" value={stats.total} />
        </Col>
        <Col xs={12} sm={6} md={6}>
          <Statistic
            title="今日新增"
            value={stats.todayAdded}
            prefix={<ArrowUpOutlined />}
            valueStyle={{ color: stats.todayAdded > 0 ? '#3f8600' : undefined }}
          />
        </Col>
        <Col xs={8} sm={4} md={4}>
          <Statistic
            title={
              <Typography.Text type="success">
                <CheckCircleOutlined style={{ marginRight: 4 }} />
                启用
              </Typography.Text>
            }
            value={stats.enabled}
            valueStyle={{ color: '#52c41a' }}
          />
        </Col>
        <Col xs={8} sm={4} md={4}>
          <Statistic
            title={
              <Typography.Text style={{ color: '#faad14' }}>
                <ClockCircleOutlined style={{ marginRight: 4 }} />
                待审核
              </Typography.Text>
            }
            value={stats.pending}
            valueStyle={{ color: '#faad14' }}
          />
        </Col>
        <Col xs={8} sm={4} md={4}>
          <Statistic
            title={
              <Typography.Text type="secondary">
                <CloseCircleOutlined style={{ marginRight: 4 }} />
                禁用
              </Typography.Text>
            }
            value={stats.disabled}
            valueStyle={{ color: '#8c8c8c' }}
          />
        </Col>
      </Row>
    </Card>
  );
}
