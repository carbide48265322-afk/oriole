'use client';

import { Card, Row, Col, Statistic, Typography, Button, Space } from 'antd';
import {
  AuditOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  RocketOutlined,
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

export default function DashboardPage() {
  // 假数据（后续接入真实 API）
  const mockStats = {
    totalTasks: 128,
    pending: 23,
    completed: 95,
    accuracy: 96.5,
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* 欢迎区域 */}
      <div className="mb-8">
        <Title level={2} className="mb-2">
          <RocketOutlined className="text-blue-500 mr-2" />
          审核工作台
        </Title>
        <Paragraph className="text-gray-500">
          欢迎使用 Oriole 内容审核平台，支持 AI 自动审核与人工复审流程。
        </Paragraph>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} className="mb-8">
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="总任务数"
              value={mockStats.totalTasks}
              prefix={<AuditOutlined />}
              valueStyle={{ color: '#1677ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="待审核"
              value={mockStats.pending}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="已完成"
              value={mockStats.completed}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="AI 准确率"
              value={mockStats.accuracy}
              suffix="%"
              precision={1}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 快捷操作 */}
      <Card title="快捷操作" className="mb-8">
        <Space wrap>
          <Button type="primary" size="large" icon={<AuditOutlined />}>
            开始审核
          </Button>
          <Button size="large" icon={<ClockCircleOutlined />}>
            查看历史
          </Button>
          <Button size="large" icon={<RocketOutlined />}>
            AI 配置
          </Button>
        </Space>
      </Card>

      {/* 说明 */}
      <Card title="系统说明">
        <ul className="space-y-2 text-gray-600">
          <li>📋 <Text strong>审核任务</Text>：查看并处理待审核的内容</li>
          <li>🤖 <Text strong>AI 审核</Text>：AI 自动初审，输出置信度评分</li>
          <li>👤 <Text strong>人工复审</Text>：对低置信度结果进行人工复核</li>
          <li>📊 <Text strong>统计数据</Text>：查看审核效率和质量指标</li>
        </ul>
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <Text type="secondary">
            💡 当前为开发环境，使用 Mock 数据。接入后端后将显示真实数据。
          </Text>
        </div>
      </Card>
    </div>
  );
}
