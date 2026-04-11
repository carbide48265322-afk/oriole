'use client';

import { Card, Typography } from 'antd';

const { Title, Text } = Typography;

export default function ManualReviewPage() {
  return (
    <div>
      <Title level={3}>人工复审</Title>
      <Card>
        <Text type="secondary">此模块正在开发中，敬请期待...</Text>
      </Card>
    </div>
  );
}
