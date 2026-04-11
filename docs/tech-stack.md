# 技术栈规范 (Tech Stack)

> 项目: 内容审核平台
> 更新日期: 2026-04-11

## 🎯 核心技术栈

### 前端框架

| 技术 | 版本 | 用途 | 说明 |
|------|------|------|------|
| **Next.js** | 14.x | 全栈框架 | App Router, Server Components |
| **React** | 18.x | UI 库 | 函数组件, Hooks |
| **TypeScript** | 5.x | 类型系统 | 严格模式, noImplicitAny |

### 样式方案

| 技术 | 版本 | 用途 | 说明 |
|------|------|------|------|
| **TailwindCSS** | 3.x | 原子化 CSS | 实用优先类 |
| **shadcn/ui** | latest | UI 组件库 | 基于 Radix UI, 可定制 |

### 状态管理

| 技术 | 版本 | 用途 | 说明 |
|------|------|------|------|
| **Zustand** | 4.x | 客户端全局状态 | 轻量, 易于使用 |
| **React Query** | 5.x | 服务端状态 | 数据获取, 缓存, 同步 |

### 数据库与 ORM

| 技术 | 版本 | 用途 | 说明 |
|------|------|------|------|
| **PostgreSQL** | 15+ | 关系型数据库 | 主数据存储 |
| **Prisma** | 5.x | ORM | 类型安全, 迁移工具 |
| **Redis** | 7.x | 缓存/队列 | 会话, 任务队列 |

### 认证与授权

| 技术 | 版本 | 用途 | 说明 |
|------|------|------|------|
| **NextAuth.js** | 5.x | 认证框架 | OAuth, 凭证登录 |
| **Zod** | 3.x | 验证库 | 类型安全验证 |

### AI 服务

| 技术 | 版本 | 用途 | 说明 |
|------|------|------|------|
| **OpenAI API** | latest | 文本审核 | GPT-4/3.5 |
| **自研模型** | - | 图片审核 | 根据业务需求 |

### 测试

| 技术 | 版本 | 用途 | 说明 |
|------|------|------|------|
| **Jest** | 29.x | 单元测试 | 测试框架 |
| **React Testing Library** | 14.x | 组件测试 | 用户行为测试 |
| **Playwright** | latest | E2E 测试 | 端到端测试 |

### 开发工具

| 技术 | 版本 | 用途 | 说明 |
|------|------|------|------|
| **ESLint** | 8.x | 代码检查 | 代码质量 |
| **Prettier** | 3.x | 代码格式化 | 统一风格 |
| **Husky** | 8.x | Git Hooks | 提交前检查 |

## 📦 包管理

**首选**: pnpm (更快, 更节省空间)

```bash
# 安装依赖
pnpm install

# 添加依赖
pnpm add <package>
pnpm add -D <package>  # 开发依赖

# 运行脚本
pnpm dev        # 开发服务器
pnpm build      # 生产构建
pnpm start      # 启动生产服务
pnpm test       # 运行测试
pnpm lint       # 代码检查
```

## ⚙️ 配置详解

### TypeScript 配置 (tsconfig.json)

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    },
    "noImplicitAny": true,
    "strictNullChecks": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

**关键规则**:
- `strict: true`: 启用所有严格检查
- `noImplicitAny: true`: 禁止隐式 any
- `paths`: 路径别名 `@/*` → `./src/*`

### ESLint 配置 (.eslintrc.json)

```json
{
  "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": "warn",
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

### TailwindCSS 配置 (tailwind.config.ts)

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

## 🚀 开发工作流

### 1. 项目启动

```bash
# 安装依赖
pnpm install

# 配置环境变量
cp .env.example .env.local

# 数据库迁移
pnpm prisma migrate dev

# 启动开发服务器
pnpm dev
```

### 2. 开发流程

```bash
# 1. 创建功能分支
git checkout -b feature/audit-task-list

# 2. 开发功能
# ... 编写代码 ...

# 3. 运行检查
pnpm lint
pnpm test

# 4. 提交代码
git add .
git commit -m "feat: add audit task list"

# 5. 推送并创建 PR
git push origin feature/audit-task-list
```

### 3. 代码审查

- 所有 PR 必须经过至少 1 人审查
- 通过 CI 检查 (lint, test, build)
- 使用 AI Reviewer 辅助审查

## 🔧 常用命令

```bash
# 开发
pnpm dev                    # 启动开发服务器
pnpm build                  # 构建生产版本
pnpm start                  # 启动生产服务

# 数据库
pnpm prisma studio          # 打开 Prisma 管理 UI
pnpm prisma migrate dev     # 创建并应用迁移
pnpm prisma generate        # 生成 Prisma 客户端

# 测试
pnpm test                   # 运行单元测试
pnpm test:watch             # 监听模式
pnpm test:coverage          # 生成覆盖率报告

# 质量检查
pnpm lint                   # ESLint 检查
pnpm type-check             # TypeScript 类型检查
pnpm format                 # Prettier 格式化

# AI Harness
bash scripts/verify.sh      # 质量门禁
bash scripts/pipeline.sh    # 完整流水线
bash scripts/cleanup.sh     # 代码库清理
```

## 📚 学习资源

- [Next.js 官方文档](https://nextjs.org/docs)
- [React 官方文档](https://react.dev)
- [TypeScript 手册](https://www.typescriptlang.org/docs/)
- [Prisma 文档](https://www.prisma.io/docs)
- [TailwindCSS 文档](https://tailwindcss.com/docs)
- [Zustand 文档](https://github.com/pmndrs/zustand)
- [React Query 文档](https://tanstack.com/query/latest)
