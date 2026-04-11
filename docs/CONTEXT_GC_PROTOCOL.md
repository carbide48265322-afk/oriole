# 上下文压缩协议 (Context GC Protocol)

## 核心原则

**上下文里只放指针，不放内容。**

### 类比 JS GC 的标记-可达算法

```
根引用 (外部文件)          当前上下文 (活跃引用)
┌─────────────┐          ┌──────────────────┐
│ SPEC.md     │ ───────→ │ "spec": "#2"     │  ← 路标指针
│ PLAN.md     │ ───────→ │ "plan": "#3"     │  ← 路标指针
│ TASKS.md    │ ───────→ │ "task": "001"    │  ← 任务指针
│ verify.sh   │ ───────→ │ "next": "verify" │  ← 下一步指针
└─────────────┘          └──────────────────┘
                              ↑
                         恒定大小 ~50 字
                         不会被 LRU 挤出
```

## 压缩时机

| 触发条件 | 动作 | 压缩后内容 |
|---------|------|-----------|
| 一个阶段完成 | 清除历史对话，只留状态摘要 | `{"stage": "dev", "status": "ready"}` |
| 派单给子 Agent | 只给路标 + 任务卡 | 6 行模板 |
| 子 Agent 返回 | 提取结果摘要，丢弃过程 | `{"result": "pass", "files": [...]}` |
| 上下文 > 80% | 强制压缩 | 保留路标 + 状态 |

## 压缩规则

### ❌ 不要放进上下文的

| 类型 | 原因 | 正确做法 |
|------|------|---------|
| 完整的 SPEC/PLAN 内容 | 太大，且会被挤出 | 放路标，Agent 自己读 |
| 历史对话记录 | 冷数据 | 压缩成状态摘要 |
| 规则文档 | 重复注入撑爆上下文 | 放外部文件，需要时指过去 |
| verify.sh 输出全文 | 太长 | 只保留 PASS/FAIL + 错误数 |

### ✅ 只放这些

```json
{
  "spec": "user-auth",
  "stage": "dev",
  "current_task": "task-001",
  "task_pointer": "读取 .qwen/specs/user-auth/TASKS.md #1",
  "spec_pointer": "读取 .qwen/specs/user-auth/SPEC.md #2",
  "plan_pointer": "读取 .qwen/specs/user-auth/PLAN.md #3",
  "next_action": "bash scripts/verify.sh",
  "changes": ["src/auth.ts", "src/api/login.ts"]
}
```

**总大小：~150 字符。无论项目多大，上下文恒定。**

## 子 Agent 派单模板 (恒定 6 行)

```markdown
## 任务: [Task Name]
📍 需求路标: [SPEC.md 章节] — 请先读取
📍 设计路标: [PLAN.md 章节] — 请先读取

完成后:
1. 运行 bash scripts/verify.sh
2. 返回: 运行结果 + 修改的文件列表
```

## 状态压缩示例

### 压缩前（占用 ~5000 字符）

```
用户: 做个登录功能
AI: 好的，让我问需求...（5轮对话）
AI: 好，SPEC 生成了：[完整 SPEC 内容]
AI: 好，PLAN 生成了：[完整 PLAN 内容]
AI: 好，TASKS 生成了：[完整 TASKS 内容]
Generator: 完成了，改了 auth.ts, api.ts, 测试.ts
AI: verify.sh 结果: [完整输出 20 行]
Reviewer: 有个问题...
Generator: 修好了
Reviewer: PASS
```

### 压缩后（占用 ~100 字符）

```json
{
  "spec": "user-auth",
  "stage": "qa",
  "status": "review_passed",
  "changes": ["src/auth.ts", "src/api/login.ts"],
  "verify": "pass",
  "review": "pass",
  "next": "qa_verification"
}
```

## 实施步骤

1. **每完成一个阶段**：Coordinator 生成状态摘要
2. **清除上下文**：只保留状态摘要 + 下一步指令
3. **子 Agent 启动**：收到路标模板，自己读外部文件
4. **子 Agent 返回**：只保留结果摘要，不保留过程

## 验证

```bash
# Coordinator 不依赖 Agent 说的，自己验证
bash scripts/verify.sh
```

**核心：Coordinator 记住状态，不记住对话。**
