# Fix Task: 修复侧边栏菜单点击跳转功能

## 任务信息
- **来源**: E2E 测试失败
- **严重级别**: P0 (E2E FAIL)

## 问题描述
侧边栏菜单点击后不跳转页面。E2E 测试验证失败：
- 点击 "AI 审核" 后 URL 仍为 `/tasks`
- 所有 7 个侧边栏 E2E 测试均失败

## 问题分析
可能原因:
1. `sidebarItems` 数组中 `path` 属性被 Ant Design Menu 类型推断丢弃
2. `handleMenuClick` 中的 `find()` 可能拿不到 `path` 属性
3. Ant Design Menu 的 `onClick` 事件可能需要直接在 item 上定义

## 修复要求
1. 确保侧边栏菜单点击后能正确跳转到对应页面
2. 保持 TypeScript 类型安全，不使用 `any`
3. 修复后在子 Agent 内部运行 `BASE_URL=http://localhost:3000 npx playwright test --project=chrome e2e/sidebar.spec.ts` 验证

## 验收标准
- [ ] E2E 侧边栏导航测试 7/7 通过
- [ ] TypeScript 编译通过
- [ ] 不破坏现有功能
