#!/bin/bash
# Cleanup 脚本 - 代码库健康检查
# 检测未使用依赖、待处理事项、大型文件等熵增信号
# 使用: bash scripts/cleanup.sh

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_ROOT"

echo "🧹 代码库健康检查 (Cleanup)"
echo "==============================="
echo ""

# 计数器
ISSUES_FOUND=0

# 检查 1: 未使用的依赖
echo "📋 检查 1/5: 未使用的 npm 依赖"
if command -v depcheck &> /dev/null; then
    UNUSED_DEPS=$(depcheck --ignores="@types/*,typescript,eslint,prettier" 2>/dev/null | grep "Missing dependencies" -A 100 || true)
    if [ -n "$UNUSED_DEPS" ]; then
        echo "⚠️  发现未使用或可能缺失的依赖"
        echo "$UNUSED_DEPS" | head -20
        ISSUES_FOUND=$((ISSUES_FOUND + 1))
    else
        echo "✅ 依赖检查通过"
    fi
else
    echo "ℹ️  depcheck 未安装，跳过 (pnpm add -D depcheck)"
fi

# 检查 2: TODO/FIXME 注释
echo ""
echo "📋 检查 2/5: 待处理事项 (TODO/FIXME)"
TODO_COUNT=$(grep -r "TODO\|FIXME\|HACK\|XXX" src/ --include="*.ts" --include="*.tsx" --include="*.js" 2>/dev/null | wc -l || echo "0")
if [ "$TODO_COUNT" -gt 0 ]; then
    echo "⚠️  发现 $TODO_COUNT 个待处理事项"
    echo ""
    echo "前 10 个:"
    grep -r "TODO\|FIXME\|HACK\|XXX" src/ --include="*.ts" --include="*.tsx" --include="*.js" 2>/dev/null | head -10 || true
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
else
    echo "✅ 无待处理事项"
fi

# 检查 3: 大型文件 (>500 行)
echo ""
echo "📋 检查 3/5: 大型文件 (>500 行)"
LARGE_FILES=$(find src/ -name "*.ts" -o -name "*.tsx" 2>/dev/null | xargs wc -l 2>/dev/null | sort -rn | head -10 || true)
if [ -n "$LARGE_FILES" ]; then
    echo "📊 最大的 10 个文件:"
    echo "$LARGE_FILES" | head -10
    LARGE_FILE_COUNT=$(echo "$LARGE_FILES" | awk '{if ($1 > 500) count++} END {print count+0}')
    if [ "$LARGE_FILE_COUNT" -gt 0 ]; then
        echo ""
        echo "⚠️  $LARGE_FILE_COUNT 个文件超过 500 行，建议拆分"
        ISSUES_FOUND=$((ISSUES_FOUND + 1))
    fi
else
    echo "✅ 无大型文件"
fi

# 检查 4: console.log 使用
echo ""
echo "📋 检查 4/5: console.log 使用 (生产代码)"
CONSOLE_COUNT=$(grep -r "console.log" src/ --include="*.ts" --include="*.tsx" 2>/dev/null | grep -v ".test." | grep -v "node_modules" | wc -l || echo "0")
if [ "$CONSOLE_COUNT" -gt 0 ]; then
    echo "⚠️  发现 $CONSOLE_COUNT 处使用 console.log"
    echo "💡 建议使用结构化日志库 (如 winston, pino)"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
else
    echo "✅ 无 console.log 使用"
fi

# 检查 5: Git 未提交文件
echo ""
echo "📋 检查 5/5: Git 状态"
if git rev-parse --git-dir > /dev/null 2>&1; then
    UNTRACKED=$(git ls-files --others --exclude-standard 2>/dev/null | wc -l || echo "0")
    MODIFIED=$(git diff --name-only 2>/dev/null | wc -l || echo "0")
    STAGED=$(git diff --cached --name-only 2>/dev/null | wc -l || echo "0")
    
    if [ "$UNTRACKED" -gt 0 ] || [ "$MODIFIED" -gt 0 ] || [ "$STAGED" -gt 0 ]; then
        echo "📊 Git 状态:"
        [ "$UNTRACKED" -gt 0 ] && echo "  未跟踪: $UNTRACKED 个文件"
        [ "$MODIFIED" -gt 0 ] && echo "  已修改: $MODIFIED 个文件"
        [ "$STAGED" -gt 0 ] && echo "  已暂存: $STAGED 个文件"
        ISSUES_FOUND=$((ISSUES_FOUND + 1))
    else
        echo "✅ Git 工作区干净"
    fi
else
    echo "ℹ️  非 Git 仓库，跳过检查"
fi

# 汇总报告
echo ""
echo "==============================="
echo "📊 健康检查报告"
echo "==============================="
if [ $ISSUES_FOUND -eq 0 ]; then
    echo "✅ 代码库健康良好！"
    HEALTH_SCORE=100
else
    HEALTH_SCORE=$((100 - ISSUES_FOUND * 15))
    [ $HEALTH_SCORE -lt 0 ] && HEALTH_SCORE=0
    echo "⚠️  发现 $ISSUES_FOUND 个问题"
    echo "📈 健康评分: $HEALTH_SCORE/100"
fi

echo ""
echo "💡 建议:"
echo "  - 定期清理 TODO/FIXME 注释"
echo "  - 拆分大型文件 (>500 行)"
echo "  - 使用结构化日志替代 console.log"
echo "  - 移除未使用的依赖"

exit 0
