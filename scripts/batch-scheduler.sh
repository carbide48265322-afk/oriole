#!/bin/bash
# Batch Scheduler 脚本 - Multi-Plan 批次调度
# 使用: bash scripts/batch-scheduler.sh

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_ROOT"

echo "📦 Batch Scheduler - Multi-Plan 批次调度"
echo "========================================="
echo ""

# 读取 Plan Registry
if [ ! -f ".qwen/multi-plan/plan-registry.json" ]; then
    echo "⚠️  缺少 .qwen/multi-plan/plan-registry.json"
    echo "💡 使用 /multi-plan 技能创建规划"
    exit 1
fi

# 统计 Plan 状态
TOTAL=$(node -e "const r = require('./.qwen/multi-plan/plan-registry.json'); console.log(r.plans.length)" 2>/dev/null || echo "0")
PENDING=$(node -e "const r = require('./.qwen/multi-plan/plan-registry.json'); console.log(r.plans.filter(p => p.status === 'pending' || !p.status).length)" 2>/dev/null || echo "0")

if [ "$TOTAL" -eq 0 ]; then
    echo "ℹ️  暂无 Plan"
    exit 0
fi

echo "📊 Plan 统计"
echo "-------------"
echo "总计: $TOTAL"
echo "待调度: $PENDING"
echo ""

# 批次配置
BATCH_SIZE=3  # 每批次最多 3 个 Plan
echo "⚙️  批次配置: 每批次 $BATCH_SIZE 个 Plan"
echo ""

# 获取待调度的 Plan
if [ "$PENDING" -gt 0 ]; then
    echo "📋 待调度 Plan:"
    node -e "
        const registry = require('./.qwen/multi-plan/plan-registry.json');
        const pending = registry.plans.filter(p => p.status === 'pending' || !p.status);
        pending.slice(0, $BATCH_SIZE).forEach((plan, i) => {
            console.log(\`  \${i + 1}. \${plan.name}\`);
        });
    " 2>/dev/null
    
    echo ""
    echo "🚀 执行批次:"
    echo "  bash scripts/pipeline.sh <plan-name>"
    echo ""
    echo "💡 提示: 批次执行可以并行处理独立的 Plan"
else
    echo "✅ 所有 Plan 已调度或完成"
fi
