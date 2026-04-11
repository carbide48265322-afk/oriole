# 状态持久化 - 长任务的生命线

## 问题

长时间运行的 Pipeline（如 6 小时、$200 成本），如果在第 5 小时进程崩溃，没有状态持久化的话，5 小时的工作和成本全部归零。

## 持久化策略（三层）

### 第一层：事件保存
每个 Agent 的执行历史（Thinking、Tools、Output）在执行完成的瞬间就写入磁盘。即使下一步进程崩溃，这次执行的成果也已经"安全了"。

### 第二层：定时自动保存
每 30 秒自动保存一次，确保系统正在执行中，最多丢失半分钟的数据。

### 第三层：退出前保存
无论是用户主动关闭还是强制关闭，都会触发最后一次保存。

## 保存内容

| 内容 | 位置 | 说明 |
|------|------|------|
| Sprint Board | `.pipeline-status.json` | 所有任务状态 |
| 执行历史 | `.agent-logs/` | 每个 Agent 最近 20 次执行 |
| 事件日志 | `.agent-logs/events.log` | 最近 200 条事件 |
| 错误日志 | `scripts/.ralph-errors.log` | Ralph 循环错误 |

## 恢复流程

```bash
# 1. 检查是否有未完成的状态
if [ -f ".pipeline-status.json" ]; then
  STATUS=$(cat .pipeline-status.json | jq -r '.status')
  STAGE=$(cat .pipeline-status.json | jq -r '.stage')
  
  if [ "$STATUS" = "running" ]; then
    echo "⚠️  检测到未完成的任务"
    echo "阶段: $STAGE"
    echo "是否恢复？(y/n)"
    read -r REPLY
    if [ "$REPLY" = "y" ]; then
      echo "🔄 恢复 Pipeline..."
      bash scripts/pipeline.sh --resume
    fi
  fi
fi
```

## 注意事项

### 正在运行的执行不会被保存
重启后进程已经不存在了。与其保存一个不完整的执行状态，不如干净地标记"上次执行中断"。

### 重启后消息恢复
持久化的 Chat 消息通过 channel 恢复，避免与实时消息混淆。

## 文件结构

```
project/
├── .pipeline-status.json      # Pipeline 状态
├── .agent-logs/
│   ├── current.log            # 当前执行日志
│   ├── events.log             # 事件日志
│   └── history/               # 历史执行（保留 20 个）
└── scripts/
    ├── .ralph-errors.log      # Ralph 错误日志
    └── .snapshots/            # 文件快照
```

## 自动清理

- 执行历史：保留最近 20 次
- 事件日志：保留最近 200 条
- 快照：保留最近 20 个
- 错误日志：每次循环追加，定期手动清理
