#!/bin/bash
# Regression Checker 脚本 - 依赖唤醒 + 回归测试
# 使用: bash scripts/regression-checker.sh

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_ROOT"

echo "🔍 回归测试检查"
echo "================="
echo ""

# 1. 检查依赖是否需要更新
echo "📦 检查依赖更新..."
if [ -f "package.json" ]; then
    OUTDATED=$(npm outdated 2>/dev/null | tail -n +2 | wc -l || echo "0")
    if [ "$OUTDATED" -gt 0 ]; then
        echo "⚠️  发现 $OUTDATED 个可更新的依赖"
        echo ""
        echo "前 5 个:"
        npm outdated 2>/dev/null | head -6 || true
    else
        echo "✅ 依赖已是最新"
    fi
else
    echo "ℹ️  未找到 package.json"
fi

# 2. 运行回归测试
echo ""
echo "🧪 运行回归测试..."
if [ -f "package.json" ]; then
    if pnpm test -- --passWithNoTests --coverage 2>/dev/null; then
        echo ""
        echo "✅ 回归测试通过"
    else
        echo ""
        echo "⚠️  回归测试失败或无测试"
        echo "💡 建议: 为关键功能添加测试"
    fi
else
    echo "ℹ️  未找到 package.json，跳过测试"
fi

# 3. 检查架构回归
echo ""
echo "🏗️  架构回归检查..."
if [ -f "scripts/lint-rules.json" ]; then
    ARCH_VIOLATIONS=$(bash scripts/verify.sh 2>&1 | grep -c "FAIL" || echo "0")
    if [ "$ARCH_VIOLATIONS" -gt 0 ]; then
        echo "⚠️  发现 $ARCH_VIOLATIONS 个架构违规"
    else
        echo "✅ 架构检查通过"
    fi
else
    echo "ℹ️  未找到 lint-rules.json"
fi

# 4. 生成回归报告
echo ""
echo "📊 回归测试报告"
echo "=================="
echo ""
echo "💡 建议定期运行此检查:"
echo "  - 每次合并前"
echo "  - 每周自动运行"
echo "  - 大版本发布前"
echo ""
echo "🔧 自动化:"
echo "  添加到 CI/CD 流水线或 cron 任务"
