#!/bin/bash
# Self-Evolve 脚本 - Harness 自我进化机制
# 失败模式分析与规则进化
# 使用: bash scripts/self-evolve.sh

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_ROOT"

echo "🧬 Harness 自我进化机制"
echo "========================"
echo ""

LOG_DIR=".agent-logs"
EVOLUTION_LOG="$LOG_DIR/evolution.log"
mkdir -p "$LOG_DIR"

TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")

# 1. 分析最近的失败
echo "📋 分析最近的失败..."
echo ""

if [ -f "$LOG_DIR/ralph-failures.log" ]; then
    echo "发现失败日志"
    tail -20 "$LOG_DIR/ralph-failures.log"
else
    echo "ℹ️  无失败记录"
fi

# 2. 检查规则有效性
echo ""
echo "📊 规则有效性检查..."
echo ""

# 检查 lint-rules.json 中的规则是否有效
if [ -f "scripts/lint-rules.json" ]; then
    RULE_COUNT=$(node -e "const r = require('./scripts/lint-rules.json'); console.log(r.rules.length)" 2>/dev/null || echo "0")
    echo "当前规则数: $RULE_COUNT"
    
    # 统计规则触发次数
    echo ""
    echo "💡 建议定期审查规则有效性:"
    echo "  - 移除不再适用的规则"
    echo "  - 调整误报率高的规则"
    echo "  - 添加新的最佳实践"
else
    echo "⚠️  缺少 lint-rules.json"
fi

# 3. 生成进化建议
echo ""
echo "📝 进化建议"
echo "============"
echo ""

SUGGESTIONS=()

# 检查是否有重复的失败模式
if [ -f "$LOG_DIR/ralph-failures.log" ]; then
    REPEATED=$(grep -o "error: .*" "$LOG_DIR/ralph-failures.log" 2>/dev/null | sort | uniq -c | sort -rn | head -5 || true)
    if [ -n "$REPEATED" ]; then
        echo "🔁 重复失败模式:"
        echo "$REPEATED"
        SUGGESTIONS+=("针对重复失败模式，添加自动化修复策略")
    fi
fi

# 检查规则覆盖率
if [ -d "src" ]; then
    FILES_WITH_ISSUES=$(bash scripts/verify.sh 2>&1 | grep -c "FAIL\|WARN" || echo "0")
    if [ "$FILES_WITH_ISSUES" -gt 10 ]; then
        SUGGESTIONS+=("考虑添加更多自动化修复规则")
    fi
fi

if [ ${#SUGGESTIONS[@]} -eq 0 ]; then
    echo "✅ 暂无进化建议"
else
    echo "建议:"
    for suggestion in "${SUGGESTIONS[@]}"; do
        echo "  - $suggestion"
    done
fi

# 记录进化日志
echo "[$TIMESTAMP] Self-evolution check completed" >> "$EVOLUTION_LOG"
echo "  - Suggestions: ${#SUGGESTIONS[@]}" >> "$EVOLUTION_LOG"

echo ""
echo "📝 日志: $EVOLUTION_LOG"
echo ""
echo "💡 进化机制说明:"
echo "  1. 定期分析失败模式"
echo "  2. 自动添加修复规则"
echo "  3. 优化质量门禁"
echo "  4. 更新开发规范"
