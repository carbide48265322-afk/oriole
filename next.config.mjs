/** @type {import('next').NextConfig} */
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  basePath: process.env.NEXT_PUBLIC_MICRO_APP === 'true' ? '/oriole' : '',
  serverExternalPackages: [],
  experimental: {
    optimizePackageImports: ['antd', '@ant-design/icons'],
  },
  turbopack: {
    root: __dirname,
  },
  async headers() {
    return [
      {
        // 支持 qiankun 跨域访问
        source: '/:path*',
        headers: [
          { 
            key: 'Access-Control-Allow-Origin', 
            // 开发环境允许 localhost，生产环境使用环境变量控制
            value: process.env.NODE_ENV === 'development' 
              ? 'http://localhost:3000' 
              : (process.env.ALLOWED_ORIGIN || '*') 
          },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type,Authorization' },
        ],
      },
    ];
  },
};

export default nextConfig;
