'use client';

import { Button, Card, Row, Col, Typography, Space } from 'antd';
import { ArrowRightOutlined, AuditOutlined, RocketOutlined } from '@ant-design/icons';
import Link from 'next/link';

const { Title, Paragraph, Text } = Typography;

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #f0f4ff, #ffffff)' }}>
      <div style={{ padding: '64px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <Space orientation="vertical" size="large" style={{ width: '100%', textAlign: 'center' }}>
          <Title level={1} style={{ margin: 0 }}>
            <RocketOutlined style={{ color: '#3b82f6', marginRight: 12 }} />
            Oriole 内容审核平台
          </Title>
          <Paragraph style={{ fontSize: 18, color: '#666', maxWidth: 600, margin: '0 auto' }}>
            基于 Next.js 14 + TypeScript + Ant Design 的内容审核系统
          </Paragraph>

          <Row gutter={[16, 16]} justify="center">
            <Col xs={24} sm={8}>
              <Card>
                <Space orientation="vertical" size="middle" style={{ width: '100%', textAlign: 'center' }}>
                  <AuditOutlined style={{ fontSize: 32, color: '#3b82f6' }} />
                  <Title level={5} style={{ margin: 0 }}>AI 自动审核</Title>
                  <Text type="secondary" style={{ fontSize: 14 }}>
                    支持通义千问、美团 Longcat 等多模型
                  </Text>
                </Space>
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card>
                <Space orientation="vertical" size="middle" style={{ width: '100%', textAlign: 'center' }}>
                  <AuditOutlined style={{ fontSize: 32, color: '#52c41a' }} />
                  <Title level={5} style={{ margin: 0 }}>人工复审</Title>
                  <Text type="secondary" style={{ fontSize: 14 }}>
                    图片标注、文档标注、多级审核
                  </Text>
                </Space>
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card>
                <Space orientation="vertical" size="middle" style={{ width: '100%', textAlign: 'center' }}>
                  <AuditOutlined style={{ fontSize: 32, color: '#722ed1' }} />
                  <Title level={5} style={{ margin: 0 }}>微前端架构</Title>
                  <Text type="secondary" style={{ fontSize: 14 }}>
                    基于 qiankun，支持独立运行和被加载
                  </Text>
                </Space>
              </Card>
            </Col>
          </Row>

          <Link href="/tasks">
            <Button type="primary" size="large" icon={<ArrowRightOutlined />} style={{ fontSize: 16, padding: '0 32px', height: 48 }}>
              进入审核工作台
            </Button>
          </Link>
        </Space>
      </div>
    </div>
  );
}
