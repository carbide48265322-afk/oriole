#!/bin/bash
# Progress 脚本 - Multi-Plan 进度追踪
# 使用: bash scripts/progress.sh

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_ROOT"

echo "📊 Multi-Plan 进度追踪"
echo "======================="
echo ""

# 读取 Plan Registry
if [ -f ".qwen/multi-plan/plan-registry.json" ]; then
    TOTAL_PLANS=$(node -e "const r = require('./.qwen/multi-plan/plan-registry.json'); console.log(r.plans.length)" 2>/dev/null || echo "0")
    COMPLETED=$(node -e "const r = require('./.qwen/multi-plan/plan-registry.json'); console.log(r.plans.filter(p => p.status === 'completed').length)" 2>/dev/null || echo "0")
    IN_PROGRESS=$(node -e "const r = require('./.qwen/multi-plan/plan-registry.json'); console.log(r.plans.filter(p => p.status === 'in_progress').length)" 2>/dev/null || echo "0")
    
    echo "📋 Plan 统计"
    echo "-------------"
    echo "总计: $TOTAL_PLANS"
    echo "已完成: $COMPLETED"
    echo "进行中: $IN_PROGRESS"
    echo "待开始: $((TOTAL_PLANS - COMPLETED - IN_PROGRESS))"
    echo ""
    
    if [ "$TOTAL_PLANS" -gt 0 ]; then
        echo "📝 Plan 列表:"
        node -e "
            const registry = require('./.qwen/multi-plan/plan-registry.json');
            registry.plans.forEach((plan, i) => {
                const status = plan.status || 'pending';
                const icon = status === 'completed' ? '✅' : status === 'in_progress' ? '🔄' : '⏳';
                console.log(\`  \${i + 1}. \${icon} \${plan.name} - \${status}\`);
            });
        " 2>/dev/null || echo "  无法解析 Plan Registry"
    else
        echo "ℹ️  暂无 Plan"
        echo "💡 使用 /multi-plan 技能创建多阶段规划"
    fi
else
    echo "⚠️  缺少 .qwen/multi-plan/plan-registry.json"
fi

echo ""
echo "💡 提示:"
echo "  - 使用 /spec-kit 创建单个 Spec"
echo "  - 使用 /multi-plan 创建多阶段规划"
echo "  - 使用 bash scripts/pipeline.sh <spec> 执行流水线"
