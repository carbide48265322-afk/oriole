# Fix Task: 修复审查发现的问题

## 任务信息
- **来源**: Harness Review 审查报告
- **严重级别**: Warning (8 个)
- **优先级**: P1

## 待修复问题

### 1. 未使用的导入
**位置**: `src/components/MockInitializer.tsx:3`
**问题**: `useState` 被导入但从未使用
**修复**: 移除未使用的 `useState` 导入

### 2. CORS 配置过于宽松
**位置**: `next.config.mjs`
**问题**: `Access-Control-Allow-Origin: '*'` 过于宽松
**修复**: 改为环境变量控制，默认允许 localhost 开发环境

### 3. AI 客户端 Key 泄露风险
**位置**: `src/lib/ai-client.ts`
**问题**: 客户端可导入含 Key 配置
**修复**: 添加注释说明仅服务端使用

### 4. Route 中 stream 参数未使用
**位置**: `src/app/api/ai/review/route.ts:39`
**问题**: `stream` 参数定义但未使用
**修复**: 移除未使用参数或添加 TODO 注释

### 5. POST_STREAM 导出无效
**位置**: `src/app/api/ai/review/route.ts:89`
**问题**: Next.js Route Handler 不识别 `POST_STREAM`
**修复**: 移除该导出，添加注释说明流式路由应独立创建

### 6. Electron 生产路径
**位置**: `electron/main.ts:13`
**问题**: 生产路径指向 `out/index.html`，但 Next.js 配置为 `standalone` 输出
**修复**: 添加注释说明后续需确认构建输出方式

### 7. Electron 缺少 IPC Handler
**位置**: `electron/main.ts`
**问题**: `preload.ts` 暴露了 `getVersion` 但主进程未实现
**修复**: 添加 `ipcMain.handle('get-version')` 实现

### 8. Token 存储方式
**位置**: `src/micro-app/lifecycle.ts`
**问题**: Token 存储在 localStorage
**修复**: 添加 TODO 注释，后续改用 httpOnly cookie

## 验收标准
- [ ] 所有 8 个 Warning 修复完成
- [ ] `pnpm type-check` 通过
- [ ] `pnpm lint` 无新增 error
