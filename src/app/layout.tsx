import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import './globals.css';
import AntdProvider from '@/components/AntdProvider';
import QueryProvider from '@/components/QueryProvider';
import { MockInitializer } from '@/components/MockInitializer';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-inter',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'Oriole - 内容审核平台',
  description: '基于 Next.js 和 AI 的内容审核平台',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <AntdRegistry>
          <QueryProvider>
            <MockInitializer />
            <AntdProvider>{children}</AntdProvider>
          </QueryProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
