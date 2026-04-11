# Fix Task: 修复侧边栏菜单路由跳转

## 任务信息
- **来源**: Review FAIL
- **严重级别**: Critical

## 问题描述
`src/components/AppLayout.tsx` 侧边栏 Menu 组件缺少路由跳转逻辑，点击菜单项不会跳转页面。

## 修复方案
1. 导入 `usePathname` 和 `useRouter`（来自 `next/navigation`）
2. 绑定 `selectedKeys` 到当前路径
3. 添加 `onClick` 事件处理，调用 `router.push()` 跳转

## 验收标准
- [ ] 点击侧边栏菜单项能跳转到对应页面
- [ ] 当前页面对应的菜单项高亮
- [ ] `pnpm type-check` 通过
