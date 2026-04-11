# 快照管理文档

> 文件快照保存、列出、对比

## 📸 什么是快照？

快照是代码库在某个时间点的完整备份。用于：

- 重构前保存基线
- 对比不同阶段的变更
- 快速回滚到历史状态

## 🚀 使用方式

### 保存快照

```bash
bash scripts/snapshot.sh save <name>
```

示例:

```bash
# 保存初始状态
bash scripts/snapshot.sh save initial

# 重构前保存基线
bash scripts/snapshot.sh save pre-refactor

# 功能完成后保存
bash scripts/snapshot.sh save feature-auth-complete
```

### 列出所有快照

```bash
bash scripts/snapshot.sh list
```

输出示例:

```
📋 可用快照列表
====================

2026-04-11 11:30  initial         2.3M
2026-04-11 12:15  pre-refactor    2.5M
2026-04-11 14:00  post-refactor   2.8M
```

### 对比两个快照

```bash
bash scripts/snapshot.sh diff <snapshot1> <snapshot2>
```

示例:

```bash
bash scripts/snapshot.sh diff initial pre-refactor
```

## 📊 快照内容

快照包含以下目录和文件:

- ✅ `src/` - 源代码
- ✅ `.qwen/` - AI Harness 配置
- ✅ `docs/` - 文档
- ✅ `scripts/` - 脚本
- ✅ `package.json` - 依赖配置
- ✅ `tsconfig.json` - TypeScript 配置

排除:

- ❌ `node_modules/` - 依赖 (可通过 `pnpm install` 恢复)
- ❌ `.next/` - 构建产物
- ❌ `.git/` - Git 历史 (使用 `git` 管理)
- ❌ `.snapshots/` - 快照本身
- ❌ `.agent-logs/` - 日志

## 💡 最佳实践

### 何时保存快照

| 场景 | 快照名称示例 |
|------|-------------|
| 项目初始化 | `initial` |
| 重构前 | `pre-refactor` |
| 重构后 | `post-refactor` |
| 大功能完成 | `feature-auth-complete` |
| 迁移前 | `pre-migration` |
| 迁移后 | `post-migration` |

### 快照 vs Git

| 特性 | 快照 | Git |
|------|------|-----|
| 用途 | 快速备份、对比 | 版本控制、协作 |
| 速度 | 快 (秒级) | 慢 (需要提交) |
| 粒度 | 项目级 | 文件级 |
| 存储 | 本地 `.snapshots/` | `.git/` |
| 恢复 | 手动解压 | `git checkout` |

**建议**: 快照用于快速备份，Git 用于正式版本控制。

## 🔧 存储位置

快照保存在 `.snapshots/` 目录:

```
.snapshots/
├── initial_20260411_113000.tar.gz
├── pre-refactor_20260411_121500.tar.gz
└── post-refactor_20260411_140000.tar.gz
```

## 🗑️ 清理快照

手动删除不需要的快照:

```bash
rm .snapshots/old-snapshot_*.tar.gz
```

## 🔗 相关脚本

- `cleanup.sh`: 代码库健康检查
- `context-cleanup.sh`: 上下文清理
- `self-evolve.sh`: 自我进化机制
