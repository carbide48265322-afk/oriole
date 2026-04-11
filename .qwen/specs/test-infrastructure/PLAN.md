# PLAN: 测试基础设施

> 功能名称: test-infrastructure
> 关联 Spec: `.qwen/specs/test-infrastructure/SPEC.md`
> 创建时间: 2026-04-11

## 技术架构

### 测试框架选型

| 测试类型 | 框架 | 说明 |
|---------|------|------|
| 单元测试 | Vitest | 快速、原生 TypeScript、与 Vite 生态兼容 |
| E2E 测试 | Playwright | 多浏览器支持、自动等待、截图/视频 |

### 目录结构

```
src/
├── lib/
│   ├── http-client.ts       # 已有
│   └── http-client.test.ts  # 新增：单元测试
├── store/
│   ├── authStore.ts         # 已有
│   └── authStore.test.ts    # 新增：单元测试
e2e/
├── home.spec.ts             # 新增：首页 E2E 测试
└── sidebar.spec.ts          # 新增：侧边栏 E2E 测试
```

## 文件变更清单

| 文件 | 类型 | 说明 |
|------|------|------|
| `package.json` | 修改 | 添加测试脚本和依赖 |
| `vitest.config.ts` | 新增 | Vitest 配置 |
| `playwright.config.ts` | 新增 | Playwright 配置 |
| `src/lib/http-client.test.ts` | 新增 | HTTP 客户端单元测试 |
| `src/store/authStore.test.ts` | 新增 | 认证 Store 单元测试 |
| `e2e/home.spec.ts` | 新增 | 首页 E2E 测试 |
| `e2e/sidebar.spec.ts` | 新增 | 侧边栏 E2E 测试 |

## 实施步骤

1. 安装测试依赖 (Vitest, Playwright)
2. 配置 Vitest 和 Playwright
3. 添加 package.json 脚本
4. 编写 http-client 单元测试
5. 编写 authStore 单元测试
6. 编写首页 E2E 测试
7. 编写侧边栏 E2E 测试

## 风险与依赖

- **风险**: Playwright 浏览器安装可能需要额外时间
- **依赖**: 开发服务器需要运行中才能运行 E2E 测试

---

## 📋 编码规则 (固化自 docs/CODING_STANDARDS.md)

- 所有测试文件使用 TypeScript
- 测试命名规范: `describe('模块名', () => { it('应该...', () => {}) })`
- 单元测试覆盖率 > 80%

---

## 🕵️‍♀️ 验证方案 (供 QA 验收使用)

*QA 将基于以下细节进行 E2E 验证：*
- **E2E-1**: 打开首页 → 点击按钮 → 跳转到 `/tasks`
- **E2E-2**: 在 `/tasks` → 点击侧边栏菜单 → 跳转并高亮
