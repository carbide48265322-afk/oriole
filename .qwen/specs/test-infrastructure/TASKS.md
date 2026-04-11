# TASKS: 测试基础设施

> 功能名称: test-infrastructure
> 关联 Spec: `.qwen/specs/test-infrastructure/SPEC.md`
> 关联 Plan: `.qwen/specs/test-infrastructure/PLAN.md`
> 创建时间: 2026-04-11

## 第 1 轮：初始开发

### 任务 1: 配置测试框架
- **关联需求**: `SPEC.md` -> "机器标准"
- **参考设计**: `PLAN.md` -> "测试框架选型 + 目录结构"
- **📍 需求路标**: `SPEC.md` - 机器标准部分
- **📍 设计路标**: `PLAN.md` - 测试框架选型
- **📁 涉及文件**: `package.json` (修改), `vitest.config.ts` (新建), `playwright.config.ts` (新建)
- **🧪 测试文件**: 无（配置任务）
- **状态**: `[ ] 待开发`

**具体要求**:
1. 安装 Vitest: `pnpm add -D vitest @vitest/coverage-v8`
2. 安装 Playwright: `pnpm add -D @playwright/test playwright`
3. 创建 `vitest.config.ts`
4. 创建 `playwright.config.ts`
5. 更新 `package.json` 脚本: `test`, `test:e2e`, `test:coverage`

### 任务 2: 编写 http-client 单元测试
- **关联需求**: `SPEC.md` -> "语义标准: 核心工具函数有测试覆盖"
- **参考设计**: `PLAN.md` -> "文件变更清单"
- **📍 需求路标**: `SPEC.md` - 语义标准
- **📍 设计路标**: `PLAN.md` - 文件变更清单
- **📁 涉及文件**: `src/lib/http-client.ts` (已有)
- **🧪 测试文件**: `src/lib/http-client.test.ts` (新建)
- **状态**: `[ ] 待开发`

**具体要求**:
1. 测试 `get` 方法正确构建 URL 和 headers
2. 测试 `post` 方法正确发送请求体
3. 测试自动携带 Token
4. 测试错误处理逻辑

### 任务 3: 编写 authStore 单元测试
- **关联需求**: `SPEC.md` -> "语义标准: 核心工具函数有测试覆盖"
- **参考设计**: `PLAN.md` -> "文件变更清单"
- **📍 需求路标**: `SPEC.md` - 语义标准
- **📍 设计路标**: `PLAN.md` - 文件变更清单
- **📁 涉及文件**: `src/store/authStore.ts` (已有)
- **🧪 测试文件**: `src/store/authStore.test.ts` (新建)
- **状态**: `[ ] 待开发`

**具体要求**:
1. 测试 `login` 方法更新状态
2. 测试 `logout` 方法清空状态
3. 测试权限检查逻辑

### 任务 4: 编写首页 E2E 测试
- **关联需求**: `SPEC.md` -> "E2E-1: 首页访问和导航"
- **参考设计**: `PLAN.md` -> "验证方案"
- **📍 需求路标**: `SPEC.md` - E2E-1 测试用例
- **📍 设计路标**: `PLAN.md` - 验证方案
- **📁 涉及文件**: 无
- **🧪 测试文件**: `e2e/home.spec.ts` (新建)
- **状态**: `[ ] 待开发`

**具体要求**:
1. 访问首页，验证页面标题
2. 点击"进入审核工作台"按钮
3. 验证跳转到 `/tasks`
4. 验证 `/tasks` 页面显示占位内容

### 任务 5: 编写侧边栏 E2E 测试
- **关联需求**: `SPEC.md` -> "E2E-2: 侧边栏导航"
- **参考设计**: `PLAN.md` -> "验证方案"
- **📍 需求路标**: `SPEC.md` - E2E-2 测试用例
- **📍 设计路标**: `PLAN.md` - 验证方案
- **📁 涉及文件**: 无
- **🧪 测试文件**: `e2e/sidebar.spec.ts` (新建)
- **状态**: `[ ] 待开发`

**具体要求**:
1. 访问 `/tasks` 页面
2. 点击侧边栏 "AI 审核" 菜单
3. 验证跳转到 `/ai-review` 且菜单高亮
4. 点击"审核历史"菜单
5. 验证跳转到 `/history` 且菜单高亮

## 协作模式: 单一 Agent 顺序处理
