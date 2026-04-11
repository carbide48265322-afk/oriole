# TASKS: 审核工作台页面

> 功能名称: audit-workspace
> 关联 Spec: `.qwen/specs/audit-workspace/SPEC.md`
> 创建时间: 2026-04-11

## 第 1 轮：初始开发

### 任务 1: 创建审核工作台页面目录和占位页面
- **关联需求**: `SPEC.md` -> "路由结构 + 占位页面"
- **参考设计**: `SPEC.md` -> 页面目录结构
- **📍 需求路标**: `SPEC.md` - 页面目录结构部分
- **📍 设计路标**: 无（简单页面搭建）
- **📁 涉及文件**: 
  - `src/app/(main)/tasks/page.tsx` (新建)
  - `src/app/(main)/tasks/[id]/page.tsx` (新建)
  - `src/app/(main)/ai-review/page.tsx` (新建)
  - `src/app/(main)/manual-review/page.tsx` (新建)
  - `src/app/(main)/focus-review/page.tsx` (新建)
  - `src/app/(main)/history/page.tsx` (新建)
  - `src/app/(main)/stats/page.tsx` (新建)
  - `src/app/(main)/settings/page.tsx` (新建)
  - `src/app/(main)/layout.tsx` (修改，更新侧边栏菜单)
- **状态**: `[ ] 待开发`

**具体要求**:
1. 每个占位页面包含:
   - `'use client'` 标记
   - 页面标题（Ant Design Typography.Title）
   - 占位提示文字（Ant Design Typography.Text type="secondary"）
   - 简洁的卡片容器

2. 侧边栏菜单更新:
   - 更新 `src/components/AppLayout.tsx` 中的 `sidebarItems`
   - 确保每个菜单项 `key` 与路由路径对应
   - 添加对应图标

3. 路由结构:
   ```
   /main           -> 工作台首页（已存在）
   /main/tasks     -> 任务列表
   /main/tasks/[id] -> 任务详情
   /main/ai-review -> AI 审核
   /main/manual-review -> 人工复审
   /main/focus-review -> 审核沉浸页
   /main/history   -> 审核历史
   /main/stats     -> 统计数据
   /main/settings  -> 设置
   ```

## 协作模式: 单一 Agent 顺序处理
