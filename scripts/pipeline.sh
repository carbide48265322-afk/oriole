#!/bin/bash
# Pipeline 脚本 - Spec → Plan → Code → QA 流水线
# 使用: bash scripts/pipeline.sh [spec-name]

set -e

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_ROOT"

echo "🔄 启动 Spec → Plan → Code → QA 流水线"
echo "=========================================="
echo ""

# 检查参数
SPEC_NAME=${1:-""}
if [ -z "$SPEC_NAME" ]; then
    echo "❌ 用法: bash scripts/pipeline.sh <spec-name>"
    echo ""
    echo "示例:"
    echo "  bash scripts/pipeline.sh user-auth"
    echo "  bash scripts/pipeline.sh audit-task-list"
    exit 1
fi

SPEC_DIR=".qwen/specs/$SPEC_NAME"

# 检查 Spec 是否存在
if [ ! -d "$SPEC_DIR" ]; then
    echo "❌ 未找到 Spec: $SPEC_NAME"
    echo "请先使用 /spec-kit 创建规格文档"
    exit 1
fi

echo "📋 Spec: $SPEC_NAME"
echo "📁 目录: $SPEC_DIR"
echo ""

# 阶段 1: 检查 Spec 完整性
echo "═══════════════════════════════════════"
echo "阶段 1/4: 检查 Spec 完整性"
echo "═══════════════════════════════════════"
if [ -f "$SPEC_DIR/SPEC.md" ]; then
    echo "✅ SPEC.md 存在"
else
    echo "❌ 缺少 SPEC.md"
    echo "请先完成 Spec 阶段"
    exit 1
fi

# 阶段 2: 检查 Plan
echo ""
echo "═══════════════════════════════════════"
echo "阶段 2/4: 检查 Plan 完整性"
echo "═══════════════════════════════════════"
if [ -f "$SPEC_DIR/PLAN.md" ]; then
    echo "✅ PLAN.md 存在"
else
    echo "⚠️  缺少 PLAN.md"
    echo "建议先完成 Plan 阶段再继续"
    read -p "是否继续？(y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "已取消"
        exit 0
    fi
fi

# 阶段 3: 执行代码生成
echo ""
echo "═══════════════════════════════════════"
echo "阶段 3/4: 执行代码实现"
echo "═══════════════════════════════════════"
echo "💡 此阶段将委派 Generator Agent 实现代码"
echo "使用 /spec-kit 技能自动派单执行"

# 阶段 4: 质量验收
echo ""
echo "═══════════════════════════════════════"
echo "阶段 4/4: 质量门禁"
echo "═══════════════════════════════════════"
echo "运行质量门禁检查..."
if bash scripts/verify.sh; then
    echo ""
    echo "✅ 流水线执行完成！"
    echo "📊 Spec '$SPEC_NAME' 已通过质量门禁"
else
    echo ""
    echo "❌ 质量门禁未通过"
    echo "💡 建议: 使用 Ralph 循环自动修复"
    echo "   bash scripts/ralph-loop.sh"
    exit 1
fi

echo ""
echo "🎉 流水线执行成功！"
echo "下一步: 提交代码并创建 PR"
