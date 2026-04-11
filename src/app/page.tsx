'use client';

import { Button, Typography, Space } from 'antd';
import { ArrowRightOutlined, AuditOutlined, RocketOutlined } from '@ant-design/icons';
import Link from 'next/link';

const { Title, Paragraph } = Typography;

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-b from-blue-50 to-white">
      <div className="text-center max-w-3xl">
        <Title level={1} className="mb-4">
          <RocketOutlined className="text-blue-500 mr-3" />
          Oriole 内容审核平台
        </Title>
        <Paragraph className="text-xl text-gray-600 mb-8">
          基于 Next.js 14 + TypeScript + Ant Design 的内容审核系统
        </Paragraph>
        
        <Space direction="vertical" size="large" className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <AuditOutlined className="text-3xl text-blue-500 mb-2" />
              <Paragraph strong>AI 自动审核</Paragraph>
              <Paragraph className="text-sm text-gray-500 mb-0">
                支持通义千问、美团 Longcat 等多模型
              </Paragraph>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <AuditOutlined className="text-3xl text-green-500 mb-2" />
              <Paragraph strong>人工复审</Paragraph>
              <Paragraph className="text-sm text-gray-500 mb-0">
                图片标注、文档标注、多级审核
              </Paragraph>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <AuditOutlined className="text-3xl text-purple-500 mb-2" />
              <Paragraph strong>微前端架构</Paragraph>
              <Paragraph className="text-sm text-gray-500 mb-0">
                基于 qiankun，支持独立运行和被加载
              </Paragraph>
            </div>
          </div>

          <Link href="/main">
            <Button type="primary" size="large" icon={<ArrowRightOutlined />} className="text-lg px-8 py-6">
              进入审核工作台
            </Button>
          </Link>
        </Space>
      </div>
    </main>
  );
}
