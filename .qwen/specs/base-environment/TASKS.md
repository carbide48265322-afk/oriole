# TASKS: 基础环境搭建

> 功能名称: base-environment
> 关联 Spec: `.qwen/specs/base-environment/SPEC.md`
> 关联 Plan: `.qwen/specs/base-environment/PLAN.md`
> 创建时间: 2026-04-11

## 第 1 轮：初始开发 (Dev Iteration)

### 任务 1: 项目初始化 + 依赖安装
- **关联需求**: `SPEC.md` -> "作为开发者，希望快速搭建 Next.js 项目基础环境"
- **参考设计**: `PLAN.md` -> "步骤 1: 项目初始化"
- **📍 需求路标**: `SPEC.md` - 验收标准：项目结构、机器标准
- **📍 设计路标**: `PLAN.md` - 步骤 1 + 文件变更清单 (package.json, tsconfig.json, .eslintrc.json)
- **📁 涉及文件**: `package.json`, `tsconfig.json`, `.eslintrc.json`, `next.config.mjs`, `.env.example` (预期)
- **状态**: `[ ] 待开发`

**具体内容**:
1. 初始化 Next.js 项目配置（如未初始化）
2. 安装核心依赖: `next`, `react`, `react-dom`, `typescript`
3. 安装开发依赖: `@types/react`, `@types/node`, `eslint`, `prettier`
4. 配置 TypeScript 严格模式
5. 配置 ESLint
6. 创建 `next.config.mjs`
7. 创建 `.env.example` 模板

---

### 任务 2: Ant Design UI 集成 + 基础布局
- **关联需求**: `SPEC.md` -> "UI 组件库: Ant Design 正确安装并配置，全局主题生效"
- **参考设计**: `PLAN.md` -> "步骤 2: UI 框架集成"
- **📍 需求路标**: `SPEC.md` - 验收标准：页面骨架、UI 组件库
- **📍 设计路标**: `PLAN.md` - 步骤 2 + 文件变更清单 (src/app/layout.tsx, src/components/)
- **📁 涉及文件**: `src/app/layout.tsx`, `src/app/(main)/layout.tsx`, `src/components/Sidebar.tsx`, `src/components/Header.tsx` (预期)
- **状态**: `[ ] 待开发`

**具体内容**:
1. 安装 Ant Design: `pnpm add antd @ant-design/icons`
2. 配置 Ant Design 主题（可选自定义颜色）
3. 创建根布局 `src/app/layout.tsx`（包含 Ant Design ConfigProvider）
4. 创建主布局 `src/app/(main)/layout.tsx`（侧边栏 + 顶栏 + 内容区）
5. 创建侧边栏组件 `src/components/Sidebar.tsx`
6. 创建顶栏组件 `src/components/Header.tsx`
7. 创建首页 `src/app/(main)/page.tsx`

---

### 任务 3: qiankun 微前端集成
- **关联需求**: `SPEC.md` -> "qiankun 子应用: 独立访问 + 被加载 + 样式隔离 + JS 沙箱"
- **参考设计**: `PLAN.md` -> "步骤 3: 微前端 (qiankun)"
- **📍 需求路标**: `SPEC.md` - 验收标准：qiankun 生命周期、独立运行/被加载
- **📍 设计路标**: `PLAN.md` - 步骤 3 + 文件变更清单 (src/micro-app/)
- **📁 涉及文件**: `src/micro-app/entry.ts`, `src/micro-app/lifecycle.ts`, `next.config.mjs` (修改) (预期)
- **状态**: `[ ] 待开发`

**具体内容**:
1. 安装 qiankun: `pnpm add qiankun`
2. 创建子应用入口 `src/micro-app/entry.ts`
3. 实现生命周期: `bootstrap`, `mount`, `unmount`
4. 配置 `next.config.mjs` 支持 qiankun（输出 umd 格式）
5. 处理路由和静态资源路径
6. 确保独立运行和子应用模式都正常

---

### 任务 4: Zustand 状态管理 + 假用户数据
- **关联需求**: `SPEC.md` -> "状态管理: Zustand (全局) + Context (按场景)"
- **参考设计**: `PLAN.md` -> "步骤 4: 状态管理 (Zustand)"
- **📍 需求路标**: `SPEC.md` - 验收标准：主子应用通信
- **📍 设计路标**: `PLAN.md` - 步骤 4 + 文件变更清单 (src/store/)
- **📁 涉及文件**: `src/store/index.ts`, `src/store/types.ts`, `src/hooks/useAuth.ts` (预期)
- **状态**: `[ ] 待开发`

**具体内容**:
1. 安装 Zustand: `pnpm add zustand`
2. 创建全局 Store 入口 `src/store/index.ts`
3. 创建 Store 类型定义 `src/store/types.ts`
4. 创建认证 Store（假用户数据: 用户名、角色、token）
5. 创建应用配置 Store
6. 创建 `useAuth` Hook 供组件使用

---

### 任务 5: MSW Mock 服务集成
- **关联需求**: `SPEC.md` -> "Mock 服务: MSW 正确安装并配置，开发时可拦截 API 请求"
- **参考设计**: `PLAN.md` -> "步骤 5: Mock 服务 (MSW)"
- **📍 需求路标**: `SPEC.md` - 边界情况：后端 API 不可用
- **📍 设计路标**: `PLAN.md` - 步骤 5 + 文件变更清单 (src/mocks/)
- **📁 涉及文件**: `src/mocks/browser.ts`, `src/mocks/handlers.ts`, `src/mocks/mock-data.ts` (预期)
- **状态**: `[ ] 待开发`

**具体内容**:
1. 安装 MSW: `pnpm add -D msw`
2. 创建 Mock handlers `src/mocks/handlers.ts`
3. 创建浏览器入口 `src/mocks/browser.ts`
4. 定义 Mock 数据 `src/mocks/mock-data.ts`（用户、审核任务等）
5. 在开发环境自动启用 MSW
6. 确保 API 调用返回 Mock 数据，不报错

---

### 任务 6: Vercel AI SDK 集成
- **关联需求**: `SPEC.md` -> "AI 服务: Vercel AI SDK，支持流式对话和结构化返回"
- **参考设计**: `PLAN.md` -> "步骤 6: AI 服务集成"
- **📍 需求路标**: `SPEC.md` - 技术决策：AI 服务/模型
- **📍 设计路标**: `PLAN.md` - 步骤 6 + 文件变更清单 (src/lib/ai-client.ts)
- **📁 涉及文件**: `src/lib/ai-client.ts`, `.env.example` (修改) (预期)
- **状态**: `[ ] 待开发`

**具体内容**:
1. 安装 Vercel AI SDK: `pnpm add ai @ai-sdk/provider`
2. 创建 AI 客户端配置 `src/lib/ai-client.ts`
3. 支持 Qwen 和 Longcat（兼容 OpenAI 格式，通过 base URL 切换）
4. 创建流式对话 Hook（使用 `useChat`）
5. 创建结构化返回 Hook（使用 `generateObject` 或 `streamObject`）
6. 配置环境变量 `.env.example`（AI_API_URL, AI_API_KEY）
7. MSW 配置排除 AI 流式接口

---

### 任务 7: Electron 集成
- **关联需求**: `SPEC.md` -> "跨端支持: Web + Electron"
- **参考设计**: `PLAN.md` -> "步骤 7: Electron 集成"
- **📍 需求路标**: `SPEC.md` - 技术决策：跨端支持
- **📍 设计路标**: `PLAN.md` - 步骤 7 + 文件变更清单 (electron/)
- **📁 涉及文件**: `electron/main.ts`, `electron/preload.ts`, `electron-builder.json`, `package.json` (修改) (预期)
- **状态**: `[ ] 待开发`

**具体内容**:
1. 安装 Electron 依赖: `pnpm add -D electron electron-builder concurrently wait-on`
2. 创建主进程 `electron/main.ts`
3. 创建预加载脚本 `electron/preload.ts`
4. 配置 `next.config.mjs` 支持 Electron
5. 创建 `electron-builder.json` 打包配置
6. 添加脚本: `pnpm dev:electron` (开发), `pnpm build:electron` (打包)

---

### 任务 8: 验证 + 文档
- **关联需求**: `SPEC.md` -> "验收标准: 机器标准 + 语义标准全部满足"
- **参考设计**: `PLAN.md` -> "步骤 8: 环境变量 + 验证"
- **📍 需求路标**: `SPEC.md` - 所有验收标准
- **📍 设计路标**: `PLAN.md` -> 验证方案
- **📁 涉及文件**: `README.md` (修改), 所有已创建文件 (验证) (预期)
- **状态**: `[ ] 待开发`

**具体内容**:
1. 运行 `pnpm dev` 验证项目启动
2. 运行 `pnpm type-check` 验证 TypeScript
3. 运行 `pnpm lint` 验证 ESLint
4. 验证页面渲染（侧边栏 + 顶栏 + 内容区）
5. 验证 Mock 拦截（调用 API 返回假数据）
6. 验证 qiankun 生命周期导出
7. 更新 README.md 添加启动说明

---

## 协作模式评估

### 推荐模式: **单一 Agent 顺序处理**

**原因**:
- 任务之间有明确依赖关系（必须先初始化才能集成）
- 涉及文件无重叠，但顺序执行更安全
- 当前只有 1 个开发者，无需并行

### 任务执行顺序

```
任务 1 (初始化) → 任务 2 (UI) → 任务 3 (qiankun) → 任务 4 (状态管理)
    → 任务 5 (Mock) → 任务 6 (AI) → 任务 7 (Electron) → 任务 8 (验证)
```

---

## API 契约管理策略

当前阶段无后端 API，使用 Mock 数据。后续接入真实后端时：
- 开发中: 收集 Mock 与实际 API 的差异到 `.qwen/specs/base-environment/api-changes.json`
- 审查时: 对比 PLAN，评估合理性
- 测试时: 验证接口可用性
- 发布时: 所有变更 verified 后，生成 `docs/API_CONTRACT.md`
