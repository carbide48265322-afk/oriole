'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/components/SupabaseProvider';
import { Spin } from 'antd';

export default function Home() {
  const { session } = useSupabase();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      // 已登录，跳转到图片审核页面
      router.push('/audit/image');
    } else {
      // 未登录，跳转到登录页面
      router.push('/login');
    }
  }, [session, router]);

  // 显示加载状态
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(to bottom, #f0f4ff, #ffffff)',
      }}
    >
      <Spin size="large" tip="正在跳转..." />
    </div>
  );
}
