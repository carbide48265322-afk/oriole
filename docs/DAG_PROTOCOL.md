# DAG Pipeline 协议

## 核心设计理念

**Pipeline 由 DAG (有向无环图) 驱动，不靠 Agent 记忆或自觉。**

### 为什么用 DAG？

| 能力 | 状态机 | 链表 | DAG |
|------|--------|------|-----|
| 知道下一步 | ❌ 需要硬编码 | ✅ `node.next` | ✅ `node.next` |
| 回溯上一步 | ❌ 困难 | ✅ `node.prev` | ✅ `node.depends_on` |
| 条件分支 | ❌ 复杂 | ❌ 不支持 | ✅ `conditions` 字段 |
| 循环重试 | ❌ 破坏状态 | ❌ 破坏链 | ✅ `type: loop` |
| 上下文占用 | 需要存状态 | ~100 字符 | ~100 字符 |
| 可观测性 | 低 | 中 | 高 (可生成流程图) |

### 为什么不并行？

1. **Agent 不是纯计算任务**：瓶颈在 LLM API 调用 + 文件系统 IO
2. **文件系统冲突**：多个 Agent 同时写同一文件 → 文件损坏
3. **实际收益低**：3 个 Task 串行 6 分钟，"并行"最多省到 4 分钟 (30%)
4. **复杂度飙升**：需要 Git Worktree 隔离 + 自动 Merge + 冲突解决

**结论**：串行执行，DAG 只用它的**条件分支**和**流程可视化**能力。

---

## DAG 结构

### 文件位置
```
.qwen/specs/<feature>/pipeline.json
```

### 节点类型

| 类型 | 说明 | 失败行为 |
|------|------|---------|
| `sequential` | 顺序执行 | 无法自动恢复 |
| `gate` | 门控节点 | 根据 `conditions` 选择下一步 |
| `loop` | 循环节点 | 检查 `max_retries`，超限转人工 |
| `terminal` | 终止节点 | 流程结束 |

### 节点定义

```json
{
  "id": "verify",
  "label": "质量门禁",
  "type": "gate",
  "depends_on": ["dev"],
  "next": ["review", "ralph"],
  "status": "pending",
  "artifact": "verify.log",
  "conditions": {
    "review": "exit_code == 0",
    "ralph": "exit_code != 0"
  }
}
```

### 字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | string | 节点唯一标识 |
| `label` | string | 人类可读标签 |
| `type` | string | 节点类型 (sequential/gate/loop/terminal) |
| `depends_on` | string[] | 前置依赖节点 ID |
| `next` | string[] | 后续节点 ID (可多个，由条件选择) |
| `status` | string | pending/running/done/failed/paused |
| `artifact` | string | 产物文件名 (可选) |
| `conditions` | object | 条件映射 (仅 gate 类型) |
| `max_retries` | number | 最大重试次数 (仅 loop 类型) |
| `current_retry` | number | 当前重试次数 (仅 loop 类型) |

---

## 流程图

```
spec → plan → tasks → dev → verify ──PASS──→ review ──PASS──→ qa ──PASS──→ regression ──PASS──→ done
                    ↑              │           │                │                │
                    │              FAIL        FAIL             FAIL            FAIL
                    │              ↓           ↓                ↓                ↓
                    └────────── ralph      fix-tasks ──────────┘           fix-regression
                                                                               │
                                                                          成功 → dev
                                                                          失败 → human-intervention
```

---

## 操作命令

```bash
# 查看当前状态
bash scripts/pipeline-dag.sh status

# 前进到下一个节点 (自动条件判断)
bash scripts/pipeline-dag.sh advance

# 标记当前节点完成
bash scripts/pipeline-dag.sh complete [产物名]

# 标记当前节点失败 (自动选择下一步)
bash scripts/pipeline-dag.sh fail [原因]

# 跳转到指定节点
bash scripts/pipeline-dag.sh goto <节点 ID>

# 检查是否可以前进
bash scripts/pipeline-dag.sh can_advance

# 可视化流程图
bash scripts/pipeline-dag.sh graph
```

---

## 标准工作流

### 三角色分工

| 角色 | 执行节点 | 职责 |
|------|---------|------|
| **Coordinator** | spec, plan, tasks | 派单、跟踪 DAG 状态、压缩上下文 |
| **Generator** | dev, ralph, fix-tasks | 写代码、修复代码 |
| **Reviewer** | verify, review | 运行 verify.sh + 代码审查，输出 VERDICT |
| **QA** | qa | 运行测试用例 + 功能验收，输出 VERDICT |
| **Regression** | regression | 依赖唤醒 + 回归测试（自动） |

**关键原则**:
- Generator **不验证自己的代码**
- Reviewer 和 QA 是独立的验证角色
- Coordinator 只派单和跟踪，不执行不验证
- **Regression 自动触发，无需人工介入**

### 1. 初始化 (Tasks 阶段完成后)

```bash
# 复制模板
cp ~/.qwen/skills/project-init/templates/pipeline.json .qwen/specs/<feature>/pipeline.json

# 更新 spec 字段
jq --arg spec "user-auth" '.spec = $spec | .current = "dev" | .nodes.dev.status = "running"' \
  .qwen/specs/user-auth/pipeline.json > tmp.json && mv tmp.json .qwen/specs/user-auth/pipeline.json
```

### 2. 开发执行 (Generator)

```bash
# Coordinator 派单 (6 行模板)
## 当前阶段: dev (开发执行)
## 📍 上一步: tasks ✅
## 📍 下一步: verify
##
## 任务: task-001-login-api
## 📍 需求路标: SPEC.md #2 — 请先读取
## 📍 设计路标: PLAN.md #3 — 请先读取

# Generator 完成后，更新 DAG
bash scripts/pipeline-dag.sh complete
bash scripts/pipeline-dag.sh advance  # → verify (由 Reviewer 执行)
```

### 3. 条件分支 (Verify/Review 节点 — Reviewer 执行)

```bash
# Reviewer 执行 verify.sh + 审查代码
# Reviewer 输出 VERDICT: PASS 或 VERDICT: FAIL

# 根据 VERDICT 更新 DAG
if [ "$VERDICT" = "PASS" ]; then
  bash scripts/pipeline-dag.sh complete review.md
  bash scripts/pipeline-dag.sh advance  # → qa (VERDICT == PASS)
else
  bash scripts/pipeline-dag.sh fail "VERDICT: FAIL - [原因]"
  bash scripts/pipeline-dag.sh advance  # → fix-tasks (VERDICT == FAIL)
fi
```

### 4. 循环重试 (Ralph 节点)

```bash
# Ralph 循环
bash scripts/ralph-loop.sh 3
RALPH_EXIT=$?

if [ $RALPH_EXIT -eq 0 ]; then
  bash scripts/pipeline-dag.sh complete
  bash scripts/pipeline-dag.sh advance  # → dev (重新执行)
else
  bash scripts/pipeline-dag.sh fail "达到最大重试次数"
  # 自动转 human-intervention
fi
```

### 5. 上下文压缩

每完成一个阶段：
1. 提取结果摘要 (PASS/FAIL、修改文件列表)
2. 更新 `pipeline.json`: 当前节点 status = "done", 下一个节点 status = "running"
3. **清除历史对话**，只保留状态摘要：
   ```json
   {
     "spec": "user-auth",
     "dag_file": ".qwen/specs/user-auth/pipeline.json",
     "current_node": "review",
     "status": "running"
   }
   ```
4. 上下文占用：从 ~5000 字符压缩到 ~100 字符

---

## 上下文 GC 协议

详见 `docs/CONTEXT_GC_PROTOCOL.md`

**核心原则**：
- 上下文里只放指针，不放内容
- 外部文件是"根引用"，路标是"强引用"
- 类比 JS GC：被引用的对象不会被回收

---

## 异常处理

| 场景 | 行为 |
|------|------|
| 依赖未满足 | 无法 advance，提示未完成的依赖 |
| 达到最大重试 | 自动转 human-intervention |
| 条件不匹配 | 提示可用条件，等待人工指定 |
| DAG 文件损坏 | 从模板重新初始化 |
| 节点不存在 | 报错，不执行 |

---

## 扩展：动态插入 Task 节点

当 TASKS.md 中有多个任务时，可以在 `dev` 和 `verify` 之间动态插入 task 节点：

```json
{
  "dev": {
    "depends_on": ["tasks"],
    "next": ["task-001"]
  },
  "task-001": {
    "depends_on": ["dev"],
    "next": ["task-002"]
  },
  "task-002": {
    "depends_on": ["task-001"],
    "next": ["verify"]
  },
  "verify": {
    "depends_on": ["task-002"]
  }
}
```

**串行执行**：task-001 → task-002 → verify
