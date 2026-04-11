# Pipeline 文档

> 项目: 内容审核平台
> 技术栈: Next.js + TypeScript

## 🔄 流水线概览

本项目使用 Spec → Plan → Tasks 规范驱动开发流程，配合自动化质量门禁和审查机制。

## 📋 核心脚本

| 脚本 | 用途 | 使用方式 |
|------|------|---------|
| `verify.sh` | 质量门禁 | `bash scripts/verify.sh` |
| `pipeline.sh` | 完整流水线 | `bash scripts/pipeline.sh <spec-name>` |
| `ralph-loop.sh` | 自动迭代修复 | `bash scripts/ralph-loop.sh [max-iterations]` |
| `cleanup.sh` | 代码库健康检查 | `bash scripts/cleanup.sh` |
| `snapshot.sh` | 文件快照管理 | `bash scripts/snapshot.sh save/list/diff` |
| `context-cleanup.sh` | 上下文清理 | `bash scripts/context-cleanup.sh` |
| `lint-engine.sh` | Lint 全量扫描 | `bash scripts/lint-engine.sh` |
| `pipeline-dag.sh` | DAG 操作 | `bash scripts/pipeline-dag.sh run/status/reset` |
| `progress.sh` | 进度追踪 | `bash scripts/progress.sh` |
| `self-evolve.sh` | 自我进化 | `bash scripts/self-evolve.sh` |
| `batch-scheduler.sh` | 批次调度 | `bash scripts/batch-scheduler.sh` |
| `regression-checker.sh` | 回归测试 | `bash scripts/regression-checker.sh` |
| `plan-version.sh` | Plan 版本管理 | `bash scripts/plan-version.sh version/create/diff` |

## 🚀 快速开始

### 1. 创建功能规格

```bash
# 使用 /spec-kit 技能创建规格
# 或在 .qwen/specs/<feature>/ 目录下手动创建
```

### 2. 执行流水线

```bash
bash scripts/pipeline.sh <feature-name>
```

### 3. 质量门禁

```bash
bash scripts/verify.sh
```

### 4. 自动修复 (如果门禁失败)

```bash
bash scripts/ralph-loop.sh
```

## 📊 质量门禁检查项

1. **TypeScript 类型检查**: 确保无类型错误
2. **ESLint 代码规范**: 确保代码风格一致
3. **架构规范**: 检查认证、输入验证等
4. **单元测试**: 确保测试通过

## 🔧 配置

### Lint 规则

编辑 `scripts/lint-rules.json` 添加或修改规则。

### 豁免机制

在规则中添加 `ignore_if` 字段:

```json
{
  "id": "QUAL001",
  "name": "no-console-log",
  "ignore_if": "test files only"
}
```

## 📈 监控

### 查看流水线状态

```bash
cat .pipeline-status.json
```

### 查看进度

```bash
bash scripts/progress.sh
```

## 🤖 自动化

### CI/CD 集成

在 CI 配置中添加:

```yaml
steps:
  - name: Quality Gate
    run: bash scripts/verify.sh
  
  - name: Regression Check
    run: bash scripts/regression-checker.sh
```

### 定时任务

```bash
# 每天运行清理和检查
0 2 * * * cd /path/to/project && bash scripts/cleanup.sh
0 3 * * 1 cd /path/to/project && bash scripts/regression-checker.sh
```
