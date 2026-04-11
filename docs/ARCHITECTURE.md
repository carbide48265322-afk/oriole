# 架构文档 (Architecture)

> 项目: 内容审核平台
> 技术栈: Next.js (App Router) + TypeScript + React

## 🏗️ 架构概览

### 分层架构

```
┌─────────────────────────────────────────┐
│         表现层 (Presentation)            │
│   - Next.js App Router (路由)            │
│   - React 组件 (UI)                      │
│   - TailwindCSS (样式)                   │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         业务层 (Business Logic)          │
│   - React Hooks (状态管理)                │
│   - 审核流程控制                          │
│   - 权限验证                             │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         服务层 (Services)                │
│   - AI 审核服务 (OpenAI/自研模型)         │
│   - 任务调度服务                          │
│   - 通知服务                             │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         数据层 (Data)                    │
│   - Prisma ORM                           │
│   - PostgreSQL 数据库                    │
│   - Redis 缓存                           │
└─────────────────────────────────────────┘
```

## 📁 目录结构详解

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # 认证路由组 (登录/注册)
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/              # 审核工作台 (需要认证)
│   │   ├── layout.tsx            # 工作台布局
│   │   ├── audit/                # 审核页面
│   │   ├── history/              # 审核历史
│   │   └── stats/                # 统计数据
│   ├── api/                      # API 路由
│   │   ├── auth/[...nextauth]/   # NextAuth 端点
│   │   ├── tasks/                # 任务 CRUD
│   │   ├── ai-review/            # AI 审核接口
│   │   └── submit-review/        # 提交审核结果
│   └── layout.tsx                # 根布局
│
├── components/                   # React 组件
│   ├── ui/                       # 基础 UI 组件
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   └── Table.tsx
│   ├── audit/                    # 审核相关组件
│   │   ├── AuditCard.tsx         # 审核任务卡片
│   │   ├── ReviewPanel.tsx       # 审核面板
│   │   ├── AIResult.tsx          # AI 审核结果展示
│   │   └── TaskList.tsx          # 任务列表
│   └── layout/                   # 布局组件
│       ├── Header.tsx
│       ├── Sidebar.tsx
│       └── Footer.tsx
│
├── lib/                          # 工具函数和配置
│   ├── prisma.ts                 # Prisma 客户端
│   ├── api.ts                    # API 客户端封装
│   ├── auth.ts                   # NextAuth 配置
│   ├── ai-service.ts             # AI 审核服务
│   └── utils.ts                  # 通用工具函数
│
├── hooks/                        # 自定义 React Hooks
│   ├── useAuditTasks.ts          # 审核任务 Hook
│   ├── useReview.ts              # 审核操作 Hook
│   └── usePermissions.ts         # 权限检查 Hook
│
├── types/                        # TypeScript 类型定义
│   ├── audit.ts                  # 审核相关类型
│   ├── user.ts                   # 用户类型
│   └── api.ts                    # API 类型
│
└── store/                        # 全局状态管理
    └── auditStore.ts             # Zustand/Redux Store
```

## 🔌 核心模块

### 1. 审核流程模块

```
任务创建 → AI 初审 → 置信度评估
                          ↓ (低置信度)
                    人工复审队列
                          ↓
                    审核员处理 → 提交结果 → 任务完成
                          ↓ (高置信度)
                    AI 自动审核 → 人工抽检
```

**关键文件**:
- `src/lib/ai-service.ts`: AI 审核逻辑
- `src/hooks/useAuditTasks.ts`: 任务状态管理
- `src/components/audit/ReviewPanel.tsx`: 人工复审 UI

### 2. 认证授权模块

**技术选型**: NextAuth.js v5

**权限角色**:
- `admin`: 管理员 (全部权限)
- `auditor`: 审核员 (审核任务)
- `viewer`: 观察者 (只读)

**关键文件**:
- `src/lib/auth.ts`: NextAuth 配置
- `src/hooks/usePermissions.ts`: 权限检查

### 3. 数据管理模块

**ORM**: Prisma
**数据库**: PostgreSQL
**缓存**: Redis (任务队列/会话)

**关键文件**:
- `src/lib/prisma.ts`: Prisma 客户端
- `prisma/schema.prisma`: 数据模型定义

## 🔗 依赖关系

### 核心依赖

```json
{
  "dependencies": {
    "next": "^14.x",
    "react": "^18.x",
    "react-dom": "^18.x",
    "typescript": "^5.x",
    "@prisma/client": "^5.x",
    "next-auth": "^5.x",
    "zod": "^3.x",
    "zustand": "^4.x",
    "@tanstack/react-query": "^5.x",
    "tailwindcss": "^3.x"
  },
  "devDependencies": {
    "prisma": "^5.x",
    "eslint": "^8.x",
    "jest": "^29.x",
    "@testing-library/react": "^14.x"
  }
}
```

### 依赖规则

1. **禁止循环依赖**: 严格分层，下层不能依赖上层
2. **组件隔离**: UI 组件不直接调用 API，通过 Hooks
3. **服务端组件优先**: 默认使用 Server Components，客户端组件按需标记 `'use client'`

## 🚀 性能策略

### 渲染优化

| 策略 | 应用场景 |
|------|---------|
| Server Components | 数据获取、静态内容 |
| Client Components | 交互组件 (表单、按钮) |
| Streaming | 长列表、分页加载 |
| ISR/SSG | 统计页面、配置页 |

### 缓存策略

1. **React Query**: 服务端状态缓存
2. **Redis**: 会话、任务队列
3. **浏览器缓存**: 静态资源 (next.config.js 配置)

## 🔒 安全架构

详见: [SECURITY.md](./SECURITY.md)

### 关键安全措施

- 所有 API 路由: 认证 + 授权
- 用户输入: Zod 验证
- XSS 防护: DOMPurify
- CSRF: NextAuth 内置
- 速率限制: API 限流

## 📊 监控与可观测性

### 日志

- 服务端: `console.log` (开发) → 结构化日志 (生产)
- 客户端: Sentry 错误追踪

### 指标

- 审核任务处理时长
- AI 审核准确率
- 人工复审通过率
- 系统响应时间 (P50/P95/P99)
