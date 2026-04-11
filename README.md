# Oriole - 内容审核平台

> 基于 Next.js + TypeScript 构建的内容审核平台，支持 AI 自动审核与人工复审流程。

## 🚀 快速开始

### 环境要求

- Node.js >= 18
- pnpm >= 8
- PostgreSQL >= 15

### 安装

```bash
# 安装依赖
pnpm install

# 配置环境变量
cp .env.example .env.local

# 数据库迁移
pnpm prisma migrate dev
```

### 开发

```bash
pnpm dev
```

访问 http://localhost:3000

### 构建

```bash
pnpm build
pnpm start
```

## 📋 核心功能

- **AI 自动审核**: 集成 AI 模型进行内容初审
- **人工复审流程**: 审核员工作台，支持人工复核
- **置信度评估**: AI 审核结果自动评估置信度
- **角色权限管理**: 管理员/审核员/观察者三级权限

## 🛠️ 技术栈

| 类别 | 技术 |
|------|------|
| 前端框架 | Next.js 14 (App Router) |
| 编程语言 | TypeScript 5 |
| UI 库 | React 18 + TailwindCSS |
| 状态管理 | Zustand + React Query |
| 数据库 | PostgreSQL + Prisma ORM |
| 认证 | NextAuth.js v5 |
| 验证 | Zod |

## 📖 文档

- [快速开始指南](GETTING_STARTED.md)
- [编码规范](docs/CODING_STANDARDS.md)
- [安全规范](docs/SECURITY.md)
- [架构文档](docs/ARCHITECTURE.md)
- [技术栈规范](docs/tech-stack.md)

## 🔧 质量门禁

```bash
# 运行质量检查
bash scripts/verify.sh

# 代码库健康检查
bash scripts/cleanup.sh

# 保存快照
bash scripts/snapshot.sh save <name>
```

## 📄 License

MIT
