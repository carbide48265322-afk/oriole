'use client';

import { Result, Button } from 'antd';
import { useRouter } from 'next/navigation';

export default function AudioAuditPage() {
  const router = useRouter();

  return (
    <Result
      status="info"
      title="音频审核"
      subTitle="页面开发中，敬请期待"
      extra={
        <Button type="primary" onClick={() => router.back()}>
          返回
        </Button>
      }
    />
  );
}
