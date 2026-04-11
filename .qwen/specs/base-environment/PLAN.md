# PLAN: 基础环境搭建

> 功能名称: base-environment
> 关联 Spec: `.qwen/specs/base-environment/SPEC.md`
> 创建时间: 2026-04-11

## 技术架构

### 整体架构

```
┌─────────────────────────────────────────────────────┐
│                   主应用 (待定)                       │
│                  qiankun MicroApp                    │
└───────────────────────┬─────────────────────────────┘
                        │ loadMicroApp()
                        ▼
┌─────────────────────────────────────────────────────┐
│              审核平台子应用 (当前项目)                  │
├─────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌──────────────┐  ┌────────────┐ │
│  │  审核工作台   │  │  AI 审核面板  │  │  任务管理   │ │
│  │  (Ant Design)│  │ (Vercel AI)  │  │           │ │
│  └─────────────┘  └──────────────┘  └────────────┘ │
├─────────────────────────────────────────────────────┤
│  Zustand (全局状态)  │  MSW (Mock)  │  qiankun SDK  │
└─────────────────────────────────────────────────────┘
                        │
                        ▼
              后端 API (待开发, MSW Mock)
```

### 技术选型

| 层级 | 技术 | 用途 |
|------|------|------|
| 框架 | Next.js 14 (App Router) | 全栈框架 |
| 语言 | TypeScript 5 (严格模式) | 类型安全 |
| UI | Ant Design 5.x | 组件库 |
| 状态 | Zustand + React Context | 状态管理 |
| AI | Vercel AI SDK | AI 服务封装 |
| Mock | MSW 2.x | 开发时 Mock |
| 微前端 | qiankun 2.x | 子应用接入 |
| 桌面端 | Electron + electron-builder | 桌面打包 |
| 包管理 | pnpm | 依赖管理 |

## 文件变更清单

### 新增/修改文件

| 文件 | 类型 | 说明 |
|------|------|------|
| `package.json` | 修改 | 添加所有依赖和脚本 |
| `tsconfig.json` | 修改 | TypeScript 严格模式配置 |
| `.env.example` | 新增 | 环境变量模板 |
| `.eslintrc.json` | 修改 | ESLint 配置 |
| `next.config.mjs` | 修改 | Next.js 配置（含 qiankun/Electron） |
| `src/app/layout.tsx` | 新增 | 根布局（Ant Design 主题） |
| `src/app/page.tsx` | 新增 | 首页（审核工作台入口） |
| `src/app/loading.tsx` | 新增 | 全局加载组件 |
| `src/app/error.tsx` | 新增 | 全局错误边界 |
| `src/app/(main)/layout.tsx` | 新增 | 主布局（侧边栏 + 顶栏） |
| `src/app/(main)/page.tsx` | 新增 | 审核工作台首页 |
| `src/micro-app/entry.ts` | 新增 | qiankun 子应用入口 |
| `src/micro-app/lifecycle.ts` | 新增 | qiankun 生命周期 |
| `src/lib/api-client.ts` | 新增 | HTTP 客户端封装 |
| `src/lib/ai-client.ts` | 新增 | Vercel AI SDK 配置 |
| `src/store/index.ts` | 新增 | Zustand 全局 Store |
| `src/store/types.ts` | 新增 | Store 类型定义 |
| `src/mocks/browser.ts` | 新增 | MSW 浏览器入口 |
| `src/mocks/handlers.ts` | 新增 | MSW Mock 处理器 |
| `src/mocks/mock-data.ts` | 新增 | Mock 数据定义 |
| `src/components/Sidebar.tsx` | 新增 | 侧边栏组件 |
| `src/components/Header.tsx` | 新增 | 顶栏组件 |
| `src/components/Loading.tsx` | 新增 | 加载指示器 |
| `src/types/index.ts` | 新增 | 全局类型定义 |
| `src/hooks/useAuth.ts` | 新增 | 认证 Hook（假数据） |
| `electron/main.ts` | 新增 | Electron 主进程 |
| `electron/preload.ts` | 新增 | Electron 预加载 |
| `electron-builder.json` | 新增 | Electron 打包配置 |

## 实施步骤

### 步骤 1: 项目初始化

1. 安装 Next.js 基础依赖
2. 配置 TypeScript 严格模式
3. 配置 ESLint + Prettier
4. 创建基础目录结构

### 步骤 2: UI 框架集成

1. 安装 Ant Design
2. 配置 Ant Design 主题
3. 创建全局布局组件
4. 创建侧边栏和顶栏组件

### 步骤 3: 微前端 (qiankun)

1. 安装 qiankun
2. 配置 `next.config.mjs` 支持 qiankun
3. 创建子应用入口和生命周期
4. 处理路由和静态资源

### 步骤 4: 状态管理 (Zustand)

1. 安装 Zustand
2. 创建全局 Store
3. 创建认证 Store（假用户数据）
4. 创建应用配置 Store

### 步骤 5: Mock 服务 (MSW)

1. 安装 MSW
2. 创建 Mock handlers
3. 配置浏览器端拦截
4. 创建假 API 响应数据

### 步骤 6: AI 服务集成

1. 安装 Vercel AI SDK
2. 配置 AI 客户端（支持 Qwen/Longcat）
3. 创建流式对话 Hook
4. 创建结构化返回 Hook

### 步骤 7: Electron 集成

1. 安装 Electron 相关依赖
2. 创建主进程和预加载脚本
3. 配置 `next.config.mjs` 支持 Electron
4. 创建打包脚本

### 步骤 8: 环境变量

1. 创建 `.env.example`
2. 配置 AI API Key 占位
3. 配置后端 API URL 占位
4. 配置 Electron 相关变量

## 风险与依赖

### 风险

| 风险 | 影响 | 缓解措施 |
|------|------|---------|
| qiankun 与 Next.js App Router 兼容性 | 子应用可能无法正常加载 | 使用自定义路由配置，避免 App Router 冲突 |
| MSW 与 Vercel AI SDK 流式响应 | 流式响应可能被 MSW 拦截异常 | MSW 配置中排除 AI 流式接口 |
| Electron 打包体积 | 桌面端包过大 | 按需加载，优化依赖 |

### 依赖

- 后端 API 尚未完成，需要持续维护 Mock 数据
- AI API Key 需要后续配置
- 主应用 qiankun 配置需要协调

---

## 📋 编码规则 (固化自 docs/CODING_STANDARDS.md)

### TypeScript 规范
- 所有组件使用 TypeScript，禁止 `any` 类型
- 默认使用 Server Components，客户端组件必须标记 `'use client'`
- 接口、类型必须明确定义

### React 组件规范
- 函数组件 + TypeScript
- 使用 `React.FC` 或显式返回类型
- 组件名 PascalCase

### 命名规范
- 组件名: PascalCase
- 文件名: PascalCase (组件) / camelCase (工具)
- 变量/函数: camelCase
- 常量: UPPER_SNAKE_CASE

---

## 📋 工具使用规则 (固化自 docs/TOOLS_PROTOCOL.md)

### 工具调用原则
- 按需读取文件，不要猜测内容
- 修改文件前必须先读取
- 批量操作优于多次单操作

### 文件操作
- 新文件使用 `write_file`
- 修改已有文件使用 `edit`（包含至少 3 行上下文）
- 避免删除用户未确认的文件

---

## 🕵️‍♀️ 验证方案 (供 QA 验收使用)

*QA 将基于以下细节进行 E2E 验证：*

- **项目启动**: `pnpm dev` → http://localhost:3000 正常访问
- **页面渲染**: 侧边栏 + 顶栏 + 内容区正常显示
- **Mock 拦截**: 调用 API 时返回 Mock 数据，不报错
- **qiankun 生命周期**: 导出 `bootstrap`, `mount`, `unmount` 函数
- **AI 配置**: Vercel AI SDK 正确初始化，支持流式和结构化返回
- **Electron**: `pnpm dev:electron` 可启动桌面端
- **类型检查**: `pnpm type-check` 无错误
- **构建**: `pnpm build` 成功
