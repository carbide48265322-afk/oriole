# SPEC: 基础环境搭建

> 功能名称: base-environment
> 技术栈: Next.js 14 (App Router) + TypeScript + Ant Design
> 创建时间: 2026-04-11

## 用户故事

- 作为**开发者**，希望**快速搭建 Next.js 项目基础环境**，以便**开始内容审核平台的开发**
- 作为**审核员**，希望**有基础的登录页面和布局框架**，以便**后续开发审核工作台**

## 验收标准 (Definition of Done)

### 机器标准 (Layer 1 - 拦截依据)
- [ ] TypeScript 无 `any` 类型，严格模式通过
- [ ] ESLint 检查无 error 级别问题
- [ ] 项目成功启动 (`pnpm dev`) 且无控制台报错
- [ ] 构建成功 (`pnpm build`) 且无 TypeScript 错误
- [ ] qiankun 生命周期函数正确导出 (`bootstrap`, `mount`, `unmount`)
- [ ] 独立运行时与子应用模式下页面渲染一致

### 语义标准 (Layer 2 - E2E 依据)
- [ ] **项目结构**: `src/app` 目录包含基础布局 (`layout.tsx`) 和首页 (`page.tsx`)
- [ ] **UI 组件库**: Ant Design 正确安装并配置，全局主题生效
- [ ] **Mock 服务**: MSW 正确安装并配置，开发时可拦截 API 请求
- [ ] **HTTP 客户端**: 封装的 API 客户端可正常调用 Mock 接口
- [ ] **页面骨架**: 审核工作台基础布局（侧边栏 + 顶栏 + 内容区）可正常渲染
- [ ] **环境变量**: `.env.example` 文件包含所有必要配置项
- [ ] **qiankun 子应用**: 
  - 独立访问: 直接 `pnpm dev` 可正常访问
  - 被加载: 主应用通过 `loadMicroApp` 加载后正常渲染
  - 样式隔离: 子应用样式不泄露到主应用
  - JS 沙箱: 子应用全局变量不污染主应用
- [ ] **主子应用通信**: 支持主应用传递 props (如用户信息、token、权限等)

## 边界情况

- **后端 API 不可用**: MSW 自动拦截请求并返回 Mock 数据，不报错
- **环境变量缺失**: 项目启动时给出明确错误提示，不静默失败
- **TypeScript 编译失败**: `pnpm build` 时拦截并显示详细错误信息
- **主应用未传 props**: 子应用使用默认 Mock 数据降级运行
- **样式冲突**: 主应用与子应用样式隔离，不互相影响

## 非功能性需求

- **性能**: 首屏加载 < 3s (开发环境)
- **安全**: 不硬编码任何密钥，所有敏感信息使用环境变量
- **可维护性**: 清晰的目录结构，README 包含启动说明

---

## 📋 安全规则 (固化自 docs/SECURITY.md)

### 密钥管理
- 所有敏感信息必须存储在 `.env.local` 文件
- `.env.local` 必须加入 `.gitignore`
- 提交前检查是否有密钥泄露

### 输入验证
- 使用 Zod 验证所有用户输入
- 所有 API 路由必须验证用户身份和权限

### XSS 防护
- 不直接使用 `dangerouslySetInnerHTML`
- 使用 DOMPurify 清理用户内容

### API 安全
- 速率限制: 防止 API 滥用
- CSRF 防护: 使用 next-auth 内置 CSRF token

---

## 技术决策记录

| 决策项 | 选择 | 原因 |
|--------|------|------|
| 项目架构 | App Router (src/app) | Next.js 官方推荐，Server Components 性能更好 |
| UI 组件库 | Ant Design | 适合后台管理系统，组件丰富 |
| Mock 方案 | MSW (Mock Service Worker) | 拦截请求，支持开发时热切换 |
| 认证方案 | 先跳过，使用假用户数据 | 后端未完成，后续接入 |
| 包管理 | pnpm | 更快，更节省磁盘空间 |
| **微前端** | **qiankun** | **支持独立运行 + 可被加载，样式隔离，JS 沙箱** |
| **主子通信** | **Props + GlobalState** | **主应用通过 props 传递用户信息/token，子应用通过 initGlobalState 共享状态** |
| **AI 服务** | **Vercel AI SDK** | **统一封装流式对话和结构化返回，支持多模型切换** |
| **AI 模型** | **通义千问 (Qwen) + 美团 Longcat** | **均兼容 OpenAI API 格式，可通过 base URL 无缝切换** |
| **状态管理** | **Zustand (全局) + Context (按场景)** | **全局状态用 Zustand，场景化状态用 React Context** |
| **跨端支持** | **Web + Electron** | **一套代码，Web 部署 + Electron 桌面端打包** |
