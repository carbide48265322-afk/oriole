# Harness 自我进化 - 从失败中学习

## 核心理念

Harness 不是静态的规则集合，而是能从 Agent 的失败中学习的**活系统**。

## 自我进化闭环

```
Agent 执行任务
    ↓
验证抓到问题
    ↓
Critic 分析根因
    ↓
人类审查（可选）
    ↓
更新 Harness 规则
    ↓
应用到所有后续任务
```

## 失败记忆库

存储在 `scripts/.harness-memory/`：

| 文件 | 内容 |
|------|------|
| `evolution.log` | 规则进化历史 |
| `success-patterns.json` | 成功模式（重复率 > 90%） |
| `failure-patterns.json` | 失败模式（重复出现 ≥ 3 次） |

## 棘轮效应：只进不退

- 新规则一旦添加，**永不删除**
- 规则库只会增长，不会缩减
- 每次添加规则前检查是否已有类似规则

## 何时触发进化

| 触发条件 | 动作 |
|---------|------|
| 同一类错误出现 ≥ 3 次 | 建议生成新规则 |
| 成功模式重复率 > 90% | 编码为确定性工作流 |
| Review 发现问题 ≥ 2 次 | 添加到 Linter |

## 使用方式

```bash
# 分析重复失败模式
bash scripts/self-evolve.sh analyze

# 生成规则建议
bash scripts/self-evolve.sh suggest

# 应用进化规则（需人工审查）
bash scripts/self-evolve.sh apply
```

## 进化示例

### 问题发现
```
Iteration 1: import 循环依赖
Iteration 2: import 循环依赖
Iteration 3: import 循环依赖
```

### 进化过程
1. `self-evolve.sh analyze` 检测到重复 3 次
2. `self-evolve.sh suggest` 生成建议
3. 人工审查后 `self-evolve.sh apply`
4. 添加 ESLint 规则 `import/no-cycle`
5. 后续所有代码自动检查

### 结果
- **之前**：每次都需要人工发现
- **之后**：自动拦截，Agent 自动修复

## 注意事项

- 进化建议**必须人工审查**，避免错误规则
- 规则添加后需要测试，确保不误杀正常代码
- 定期回顾规则库，确保仍然适用
