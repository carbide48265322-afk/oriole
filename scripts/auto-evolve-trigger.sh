#!/bin/bash
# 自动进化触发器
# 当 verify.sh 发现新的失败模式时，自动记录到失败模式库

set -e

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_ROOT"

MEMORY_DIR="$PROJECT_ROOT/scripts/.harness-memory"
mkdir -p "$MEMORY_DIR"

FAILURE_FILE="$MEMORY_DIR/failure-patterns.json"
EVOLUTION_LOG="$MEMORY_DIR/evolution.log"

# 初始化失败模式文件
if [ ! -f "$FAILURE_FILE" ]; then
    echo '[]' > "$FAILURE_FILE"
fi

# 检查 verify.sh 输出中的新警告
echo "🔍 检查是否有新的失败模式..."

# 从最近的 verify 输出中提取警告
RECENT_WARNINGS=$(tail -100 /tmp/verify-output.log 2>/dev/null | grep -i "deprecated\|warning" || echo "")

if [ -n "$RECENT_WARNINGS" ]; then
    echo "⚠️  发现新的警告模式"
    
    # 提取警告类型
    WARN_TYPE=$(echo "$RECENT_WARNINGS" | head -1 | sed 's/.*\[antd:\([^]]*\)\].*/\1/' || echo "unknown")
    
    # 记录到失败模式
    TIMESTAMP=$(date +%Y-%m-%d)
    PATTERN_ID="FP-$(date +%Y%m%d-%H%M)"
    
    # 追加到 evolution.log
    echo "[$TIMESTAMP] $PATTERN_ID: 自动检测到新失败模式" >> "$EVOLUTION_LOG"
    echo "  - 警告: $WARN_TYPE" >> "$EVOLUTION_LOG"
    echo "  - 详情: $RECENT_WARNINGS" >> "$EVOLUTION_LOG"
    echo "  - 状态: 待人工审查" >> "$EVOLUTION_LOG"
    echo "" >> "$EVOLUTION_LOG"
    
    echo "📝 已记录到进化日志: $EVOLUTION_LOG"
    echo "⚡ 建议运行: bash scripts/self-evolve.sh analyze"
else
    echo "✅ 未发现新的失败模式"
fi
