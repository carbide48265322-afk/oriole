# 🚀 项目快速开始

> 初始化时间: 2026-04-11 11:15:00
> 模式: new (完全新建)
> 技术栈: Next.js + TypeScript
> 项目类型: 内容审核平台

## ✅ 已配置组件清单

| 组件 | 路径 | 说明 |
|------|------|------|
| 项目规范 | `.qwen/AGENTS.md` | 包含角色设定、规则索引、子智能体列表 |
| 编码规范 | `docs/CODING_STANDARDS.md` | TypeScript/React 编码规范 |
| 安全规范 | `docs/SECURITY.md` | 密钥管理、输入验证、权限控制 |
| 架构文档 | `docs/ARCHITECTURE.md` | 分层架构、目录结构、依赖规则 |
| 技术栈规范 | `docs/tech-stack.md` | Next.js/React 技术栈详细规范 |
| 质量门禁 | `scripts/verify.sh` | TypeScript/ESLint/测试/架构检查 |
| Ralph 循环 | `scripts/ralph-loop.sh` | 自动迭代修复 |
| Pipeline | `scripts/pipeline.sh` | Spec→Plan→Code→QA 流水线 |
| Lint Engine | `scripts/lint-engine.sh` | 全量代码扫描 |
| Lint 规则 | `scripts/lint-rules.json` | TypeScript/React/安全规则库 |
| 熵管理 | `scripts/cleanup.sh` | 代码库健康维护 |
| 快照工具 | `scripts/snapshot.sh` | 文件变更追踪 |
| 上下文清理 | `scripts/context-cleanup.sh` | 上下文压缩 |
| 自我进化 | `scripts/self-evolve.sh` | 失败模式分析与规则进化 |
| DAG 编排 | `scripts/pipeline-dag.sh` | DAG 驱动的操作编排 |
| 进度追踪 | `scripts/progress.sh` | Multi-Plan 进度查看 |
| 批次调度 | `scripts/batch-scheduler.sh` | 多 Plan 并行调度 |
| 回归测试 | `scripts/regression-checker.sh` | 依赖更新 + 回归检查 |
| Plan 版本 | `scripts/plan-version.sh` | Plan 版本管理 |
| 流水线文档 | `docs/PIPELINE.md` | Pipeline 使用说明 |
| Ralph 文档 | `docs/RALPH_LOOP.md` | Ralph 循环说明 |
| 快照文档 | `docs/SNAPSHOT.md` | 快照管理指南 |

## 🤖 可用子智能体

| 智能体 | 调用方式 | 职责 |
|--------|---------|------|
| **Generator** | `@generator` | 代码生成与实现 (Next.js 全栈工程师) |
| **Reviewer** | `@reviewer` | 代码审查与质量把关 |
| **QA Expert** | `@qa` | 验收标准和功能验证 |
| **Security Expert** | `@security-expert` | 安全漏洞扫描 |
| **Test Expert** | `@test-expert` | 测试用例编写与覆盖率提升 |

## 🏃 快速开始命令

### 1. 初始化 Next.js 项目

```bash
# 使用 Create Next App 初始化
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/*"

# 或使用 pnpm
pnpm create next-app . --typescript --tailwind --app
```

### 2. 安装依赖

```bash
pnpm install

# 安装核心依赖
pnpm add @prisma/client next-auth zod zustand @tanstack/react-query
pnpm add -D prisma @types/node @types/react @types/react-dom
```

### 3. 配置数据库

```bash
# 初始化 Prisma
npx prisma init

# 创建数据模型 (编辑 prisma/schema.prisma 后)
npx prisma migrate dev --name init
```

### 4. 验证环境

```bash
# 运行质量门禁 (需先安装依赖)
bash scripts/verify.sh

# 检查架构合规
bash scripts/lint-engine.sh

# 保存基线快照
bash scripts/snapshot.sh save "initial"
```

### 5. 启动开发

```bash
pnpm dev
```

访问 http://localhost:3000

## 📖 下一步

### 1. 使用 `/spec-kit` 开始规范驱动开发

为你的第一个功能制定需求规范，例如：

- 用户认证系统
- 审核任务列表
- AI 审核接口
- 人工复审面板

### 2. 查看详细文档

- `docs/CODING_STANDARDS.md` - 编码规范
- `docs/SECURITY.md` - 安全规范
- `docs/ARCHITECTURE.md` - 架构设计
- `docs/tech-stack.md` - 技术栈规范
- `docs/PIPELINE.md` - Pipeline 使用指南

### 3. 配置环境变量

```bash
cp .env.example .env.local
```

编辑 `.env.local` 添加：

- `DATABASE_URL` - 数据库连接
- `NEXTAUTH_SECRET` - NextAuth 密钥
- `NEXTAUTH_URL` - 认证 URL
- `OPENAI_API_KEY` - OpenAI API 密钥 (AI 审核)

### 4. 常用命令速查

```bash
# 开发
pnpm dev                    # 启动开发服务器
pnpm build                  # 构建生产版本
pnpm start                  # 启动生产服务

# 数据库
pnpm prisma studio          # 打开 Prisma 管理 UI
pnpm prisma migrate dev     # 创建并应用迁移

# 质量检查
bash scripts/verify.sh      # 质量门禁
pnpm lint                   # ESLint 检查
pnpm type-check             # TypeScript 类型检查

# AI Harness
bash scripts/cleanup.sh     # 代码库健康检查
bash scripts/snapshot.sh save <name>  # 保存快照
bash scripts/progress.sh    # 查看进度
```

## 🎯 项目特色

作为内容审核平台，本项目已预配置：

1. **审核流程架构**: 支持 AI 初审 → 置信度评估 → 人工复审
2. **安全规范**: 严格的输入验证、权限控制、审计日志
3. **AI 集成**: OpenAI API 集成模板
4. **角色权限**: 管理员/审核员/观察者三级权限
5. **质量门禁**: 确保代码质量和安全性

## 💡 提示

- 所有开发规范已固化到 `.qwen/specs/dispatch-template.md`
- 子 Agent 会自动加载项目配置
- 使用 `bash scripts/verify.sh` 确保代码质量
- 定期运行 `bash scripts/cleanup.sh` 保持代码库健康

---

**🎉 环境已就绪！开始构建你的内容审核平台吧！**
