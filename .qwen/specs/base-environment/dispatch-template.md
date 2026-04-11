# 派单模板: 基础环境搭建 (base-environment)

## 🚨 项目规则 (固化，不可跳过)

### 安全规则 (来自 docs/SECURITY.md，注入到 SPEC.md)
- 所有敏感信息必须存储在 `.env.local` 文件
- `.env.local` 必须加入 `.gitignore`
- 绝不硬编码密钥/Token/密码
- 使用 Zod 验证所有用户输入
- XSS 防护: 不直接使用 `dangerouslySetInnerHTML`

### 编码规则 (来自 docs/CODING_STANDARDS.md，注入到 PLAN.md)
- 所有组件使用 TypeScript，禁止 `any` 类型
- 默认使用 Server Components，客户端组件必须标记 `'use client'`
- 使用 Ant Design 构建 UI
- 状态管理: Zustand (全局), React Context (场景化)
- 组件名 PascalCase，文件名 PascalCase (组件) / camelCase (工具)

### 工具使用规则 (来自 docs/TOOLS_PROTOCOL.md，注入到 PLAN.md)
- 按需读取文件，不要猜测内容
- 修改文件前必须先读取
- 新文件使用 `write_file`，修改已有文件使用 `edit`

### VERDICT 协议 (来自 docs/VERDICT_PROTOCOL.md)
- 所有任务完成后必须输出 `VERDICT: PASS` 或 `VERDICT: FAIL`
- PASS: 所有验收标准均已满足
- FAIL: 生成修复报告，列出不满足的标准

---

## 派单模板 (6 行)

```markdown
## 当前阶段: dev (开发执行)
📍 上一步: tasks ✅
📍 下一步: verify

## 任务: [Task Name]
📍 需求路标: `.qwen/specs/base-environment/SPEC.md` — 请先读取
📍 设计路标: `.qwen/specs/base-environment/PLAN.md` — 请先读取

完成后:
1. 输出 VERDICT: PASS 或 VERDICT: FAIL
2. 返回: 修改的文件列表 + 结果摘要
3. 运行: pnpm type-check && pnpm lint (验证代码)
```
