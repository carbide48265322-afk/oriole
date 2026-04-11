# Fix Task: 修复首页路由链接

## 任务信息
- **来源**: 路由问题发现
- **严重级别**: P0 (功能阻断)

## 问题描述
首页 `src/app/page.tsx` 中 `Link href="/main"` 不生效，因为 `(main)` 是 Next.js 路由组，不产生 URL 路径。

## 修复方案
1. 将 `Link href="/main"` 改为 `Link href="/tasks"`
2. 或者将 `(main)` 路由组改为实际路径（如果后续需要）

## 验收标准
- [ ] 首页 "进入审核工作台" 按钮点击后跳转到 `/tasks`
- [ ] TypeScript 编译通过
- [ ] 无新的 ESLint error
