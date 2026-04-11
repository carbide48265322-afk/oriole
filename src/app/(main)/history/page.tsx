'use client';

import { Card, Typography } from 'antd';

const { Title, Text } = Typography;

export default function HistoryPage() {
  return (
    <div>
      <Title level={3}>审核历史</Title>
      <Card>
        <Text type="secondary">此模块正在开发中，敬请期待...</Text>
      </Card>
    </div>
  );
}
