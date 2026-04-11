# Dispatch Template (派单模板)

> ⚠️ **重要**: 此模板包含固化的开发规范，派单时直接使用，**不要重新读取 docs/ 目录**

## 任务派发指令

### 项目上下文
- **项目**: 内容审核平台
- **技术栈**: Next.js 14 + TypeScript + React
- **架构**: App Router, Server Components 优先

### 固化规则 (已从 docs/ 注入)

#### 编码规范
1. 所有组件使用 TypeScript，禁止 `any` 类型
2. 默认使用 Server Components，客户端组件必须标记 `'use client'`
3. 使用 TailwindCSS + shadcn/ui 构建 UI
4. 状态管理: Zustand (客户端), React Query (服务端)

#### 安全规范
1. **绝不硬编码密钥**: 使用 `.env.local`
2. **所有 API 路由必须验证**: 身份 + 权限
3. **输入验证**: 使用 Zod 验证所有用户输入
4. **XSS 防护**: 不直接使用 `dangerouslySetInnerHTML`

#### 架构规范
1. 严格分层: 表现层 → 业务层 → 服务层 → 数据层
2. 禁止循环依赖
3. 组件隔离: UI 组件不直接调用 API，通过 Hooks
4. 审核操作必须记录审计日志

#### 质量要求
1. 所有公共 API 必须有 JSDoc 注释
2. 复杂逻辑必须有单元测试
3. 错误处理完整，不忽略 Promise rejection
4. 通过 `bash scripts/verify.sh` 质量门禁

### 任务信息

**任务名称**: [TASK_NAME]
**任务描述**: [TASK_DESCRIPTION]
**相关文件**: [FILE_PATHS]

### 验收标准

- [ ] 代码通过 TypeScript 类型检查
- [ ] 代码通过 ESLint 检查
- [ ] 单元测试覆盖核心逻辑
- [ ] 符合项目编码规范 (docs/CODING_STANDARDS.md)
- [ ] 无安全漏洞 (docs/SECURITY.md)
- [ ] 运行 `bash scripts/verify.sh` 通过

### 完成后操作

```bash
# 1. 运行质量门禁
bash scripts/verify.sh

# 2. 如果失败，使用 Ralph 循环
bash scripts/ralph-loop.sh

# 3. 提交代码
git add .
git commit -m "feat: [TASK_NAME]"
```

---

**⚠️ 协调者注意**: 
- 规则已固化在此模板中，派单时**不要**再去读取 docs/ 目录
- 子 Agent 完成后只保留摘要，清除历史对话
- 使用 `bash scripts/verify.sh` 验证，不手动检查
