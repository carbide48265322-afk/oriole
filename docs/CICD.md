# CI/CD 流程文档

> 自动化构建、测试和部署流程

## 📋 工作流概览

项目使用 **GitHub Actions** 实现完整的 CI/CD 自动化流程。

### 工作流列表

| 工作流 | 文件 | 触发条件 | 说明 |
|--------|------|---------|------|
| **CI/CD Pipeline** | `ci-cd.yml` | PR 到 dev/main，推送到 dev/main | 代码检查、构建、测试 |
| **CD Production** | `cd-production.yml` | 推送到 main，手动触发 | 生产环境部署 |
| **Code Review** | `code-review.yml` | PR 创建/更新 | 自动生成 PR 描述和提交信息检查 |

## 🔄 CI/CD Pipeline

### 触发条件

- **Push**: 推送到 `dev` 或 `main` 分支
- **Pull Request**: 创建 PR 到 `dev` 或 `main` 分支

### 执行流程

```
PR/Push
  ↓
┌─────────────────┐
│  🔍 代码检查     │ ← TypeScript + ESLint
└────────┬────────┘
         │
    ┌────▼────┐
    │  通过？  │
    └─┬────┬──┘
      │    │
     是    否 → ❌ 失败，阻止合并
      │
      ▼
┌─────────────┐    ┌─────────────┐
│  🏗️ 构建     │    │  🧪 测试     │ ← 并行执行
└──────┬──────┘    └──────┬──────┘
       │                  │
       └────────┬─────────┘
                │
                ▼
      ┌─────────────────┐
      │  📊 质量报告     │ ← 汇总所有检查结果
      └─────────────────┘
```

### 检查项

#### 1. 代码检查 (Lint Job)

- ✅ TypeScript 类型检查 (`pnpm type-check`)
- ✅ ESLint 代码规范检查 (`pnpm lint`)
- ⏱️ 超时限制: 10 分钟

#### 2. 构建验证 (Build Job)

- ✅ 安装依赖 (`pnpm install --frozen-lockfile`)
- ✅ 构建项目 (`pnpm build`)
- ✅ 保存构建产物 (3 天 retention)
- ⏱️ 超时限制: 15 分钟

#### 3. 测试运行 (Test Job)

- ✅ 运行单元测试 (`pnpm test`)
- ✅ 生成覆盖率报告
- ✅ 上传覆盖率报告
- ⏱️ 超时限制: 15 分钟

#### 4. 质量报告 (Quality Report)

- 汇总所有检查结果
- 生成 PR 摘要

## 🚀 CD Production

### 触发条件

- **Push**: 推送到 `main` 分支
- **手动触发**: GitHub Actions 页面手动触发

### 执行流程

```
Push to main
  ↓
┌──────────────────────┐
│  🏗️ 构建生产版本      │ ← 类型检查 + Lint + Build
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  🚀 部署到 Vercel     │ ← 可选，需要配置 Secret
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  📢 部署通知          │ ← 成功/失败通知
└──────────────────────┘
```

### 环境变量

需要在 GitHub Secrets 中配置：

| Secret | 说明 | 必需 |
|--------|------|------|
| `NEXT_PUBLIC_API_URL` | 后端 API 地址 | ✅ |
| `VERCEL_TOKEN` | Vercel 部署 Token | ❌ 可选 |
| `VERCEL_ORG_ID` | Vercel 组织 ID | ❌ 可选 |
| `VERCEL_PROJECT_ID` | Vercel 项目 ID | ❌ 可选 |

## 📝 Code Review Assistant

### 功能

1. **自动生成 PR 描述**: 统计变更文件数、新增/删除行数
2. **提交信息规范检查**: 检查是否遵循 Conventional Commits 规范

### Conventional Commits 规范

格式: `type(scope): description`

| Type | 说明 | 示例 |
|------|------|------|
| `feat` | 新功能 | `feat: 添加审核任务列表` |
| `fix` | Bug 修复 | `fix: 修复登录失败问题` |
| `docs` | 文档 | `docs: 更新 README` |
| `style` | 代码格式 | `style: 格式化代码` |
| `refactor` | 重构 | `refactor: 重构状态管理` |
| `test` | 测试 | `test: 添加单元测试` |
| `chore` | 构建/工具 | `chore: 更新依赖` |
| `perf` | 性能 | `perf: 优化渲染性能` |
| `ci` | CI/CD | `ci: 添加自动化流程` |
| `build` | 构建系统 | `build: 更新 webpack 配置` |
| `revert` | 回退 | `revert: 回退某个提交` |

## 🔧 配置说明

### 并发控制

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```

- **CI/CD Pipeline**: 相同分支的新运行会取消旧运行
- **CD Production**: 串行执行，不会取消

### 超时设置

| Job | 超时 |
|-----|------|
| Lint | 10 分钟 |
| Build | 15 分钟 |
| Test | 15 分钟 |
| Deploy | 15 分钟 |

### 分支保护

建议在 GitHub 仓库设置中配置：

1. **main 分支保护**:
   - 要求 PR 审查
   - 要求 CI 检查通过
   - 禁止直接推送

2. **dev 分支保护**:
   - 要求 PR 审查
   - 建议要求 CI 检查通过

## 📊 查看运行状态

### PR 页面

在 PR 页面底部可以看到所有检查项的状态：

```
✅ All checks have passed
```

或

```
❌ Some checks were not successful
```

### Actions 标签页

在 GitHub 仓库的 "Actions" 标签页可以查看所有运行历史。

### 失败排查

1. 点击失败的 Job 查看详细日志
2. 检查错误信息
3. 本地复现问题
4. 修复后重新推送

## 🚨 常见问题

### Q: 如何跳过 CI？

在提交信息中添加 `[skip ci]` 或 `[ci skip]`:

```bash
git commit -m "docs: 更新文档 [skip ci]"
```

### Q: 如何重新运行？

在 Actions 页面点击 "Re-run jobs" 按钮。

### Q: 本地如何模拟 CI？

```bash
# 类型检查
pnpm type-check

# Lint 检查
pnpm lint

# 构建
pnpm build

# 测试
pnpm test
```

### Q: 如何添加新的检查项？

编辑 `.github/workflows/ci-cd.yml`，在 `jobs` 中添加新的 job。

## 🔗 相关资源

- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [Conventional Commits 规范](https://www.conventionalcommits.org/)
- [pnpm 文档](https://pnpm.io/)
