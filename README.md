# Oriole - 内容审核平台

> 基于 Next.js + TypeScript + Ant Design 的内容审核平台，支持 AI 自动审核与人工复审流程。

## 🚀 快速开始

### 环境要求

- Node.js >= 18
- pnpm >= 8

### 安装

```bash
# 安装依赖
pnpm install

# 配置环境变量
cp .env.example .env.local
```

### 开发

```bash
# Web 开发
pnpm dev

# Electron 桌面端开发
pnpm dev:electron
```

访问 http://localhost:3000

### 构建

```bash
# Web 构建
pnpm build
pnpm start

# Electron 打包
pnpm build:electron        # 当前平台
pnpm build:electron:mac    # Mac
pnpm build:electron:win    # Windows
pnpm build:electron:linux  # Linux
```

## 📋 核心功能

- **AI 自动审核**: 集成通义千问 (Qwen) 和美团 Longcat，支持流式对话和结构化返回
- **人工复审流程**: 审核员工作台，支持人工复核
- **置信度评估**: AI 审核结果自动评估置信度
- **角色权限管理**: 管理员/审核员/观察者三级权限
- **微前端架构**: 基于 qiankun，支持独立运行和被主应用加载
- **跨端支持**: Web + Electron 桌面端

## 🛠️ 技术栈

| 类别 | 技术 |
|------|------|
| 前端框架 | Next.js 14 (App Router) |
| 编程语言 | TypeScript 5 |
| UI 组件库 | Ant Design 6 |
| 状态管理 | Zustand (全局) + React Context (场景化) |
| AI 服务 | Vercel AI SDK |
| AI 模型 | 通义千问 (Qwen) + 美团 Longcat |
| Mock 服务 | MSW (Mock Service Worker) |
| 微前端 | qiankun |
| 桌面端 | Electron + electron-builder |
| 包管理 | pnpm |

## 📁 项目结构

```
src/
├── app/              # Next.js App Router
│   ├── (main)/       # 审核工作台（带布局）
│   ├── api/          # API 路由
│   └── ...
├── components/       # React 组件
│   ├── AntdProvider.tsx    # Ant Design 主题配置
│   ├── AppLayout.tsx       # 审核工作台布局
│   └── ...
├── hooks/            # 自定义 React Hooks
│   ├── useAuth.ts          # 认证 Hook
│   └── useAIReview.ts      # AI 审核 Hook
├── lib/              # 工具函数
│   ├── ai-client.ts        # AI 客户端配置
│   └── http-client.ts      # HTTP 客户端封装
├── micro-app/        # qiankun 微前端
│   ├── entry.ts            # 子应用入口
│   ├── lifecycle.ts        # 生命周期管理
│   └── config.ts           # 配置说明
├── mocks/            # MSW Mock 服务
│   ├── browser.ts          # 浏览器入口
│   ├── handlers.ts         # API 处理器
│   └── mock-data.ts        # Mock 数据
└── store/            # Zustand 状态管理
    ├── authStore.ts        # 认证状态
    ├── appConfigStore.ts   # 应用配置
    └── auditTaskStore.ts   # 审核任务

electron/           # Electron 桌面端
├── main.ts         # 主进程
└── preload.ts      # Preload 脚本
```

## 🤖 可用子智能体

| 智能体 | 调用方式 | 职责 |
|--------|---------|------|
| **Generator** | `@generator` | 代码生成与实现 |
| **Reviewer** | `@reviewer` | 代码审查与质量把关 |
| **QA Expert** | `@qa` | 验收标准和功能验证 |
| **Security Expert** | `@security-expert` | 安全漏洞扫描 |
| **Test Expert** | `@test-expert` | 测试用例编写与覆盖率提升 |

## 🔧 质量门禁

```bash
# 类型检查
pnpm type-check

# ESLint 检查
pnpm lint

# 质量门禁 (包含以上所有)
bash scripts/verify.sh

# 代码库健康检查
bash scripts/cleanup.sh

# 保存快照
bash scripts/snapshot.sh save <name>
```

## 📖 文档

- [快速开始指南](GETTING_STARTED.md)
- [编码规范](docs/CODING_STANDARDS.md)
- [安全规范](docs/SECURITY.md)
- [架构文档](docs/ARCHITECTURE.md)
- [技术栈规范](docs/tech-stack.md)
- [Pipeline 文档](docs/PIPELINE.md)
- [Ralph 循环文档](docs/RALPH_LOOP.md)
- [快照管理文档](docs/SNAPSHOT.md)

## 🔌 API 说明

当前项目为前端项目，使用 MSW Mock 服务模拟后端 API。后续接入真实后端时：

1. 修改 `.env.local` 中的 `NEXT_PUBLIC_API_URL` 为真实后端地址
2. 设置 `NEXT_PUBLIC_USE_MOCK=false` 禁用 Mock

### Mock API 列表

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/auth/login` | POST | 用户登录 |
| `/api/auth/me` | GET | 获取当前用户 |
| `/api/auth/logout` | POST | 登出 |
| `/api/tasks` | GET | 获取任务列表 |
| `/api/tasks/:id` | GET | 获取任务详情 |
| `/api/tasks/:id/review` | POST | 提交审核结果 |
| `/api/stats` | GET | 获取统计数据 |
| `/api/ai/review` | POST | AI 审核 |

## 📄 License

MIT
