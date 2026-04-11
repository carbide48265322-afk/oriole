#!/bin/bash
# Context Cleanup 脚本 - 上下文清理/压缩
# 在每个 DAG 节点完成后自动触发，提取语义摘要、写入变更日志、清理上下文
# 使用: bash scripts/context-cleanup.sh

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_ROOT"

echo "🧽 上下文清理"
echo "==============="
echo ""

# 1. 提取最近的 Git 变更
echo "📝 提取最近变更..."
if git rev-parse --git-dir > /dev/null 2>&1; then
    RECENT_COMMITS=$(git log --oneline -5 2>/dev/null || echo "无提交记录")
    echo ""
    echo "最近 5 次提交:"
    echo "$RECENT_COMMITS"
else
    echo "ℹ️  非 Git 仓库"
fi

# 2. 统计文件变更
echo ""
echo "📊 文件统计..."
if [ -d "src" ]; then
    TS_FILES=$(find src/ -name "*.ts" -o -name "*.tsx" 2>/dev/null | wc -l)
    TOTAL_LINES=$(find src/ -name "*.ts" -o -name "*.tsx" 2>/dev/null | xargs wc -l 2>/dev/null | tail -1 | awk '{print $1}' || echo "0")
    echo "TypeScript 文件: $TS_FILES"
    echo "总代码行数: $TOTAL_LINES"
else
    echo "src/ 目录不存在"
fi

# 3. 清理临时文件
echo ""
echo "🗑️  清理临时文件..."
TEMP_FILES=(
    "/tmp/ralph-output.txt"
    ".next/cache"
    "node_modules/.cache"
)

for temp in "${TEMP_FILES[@]}"; do
    if [ -e "$temp" ]; then
        rm -rf "$temp" 2>/dev/null
        echo "  已清理: $temp"
    fi
done

# 4. 生成上下文摘要 (用于传递给下一个 Agent)
echo ""
echo "📋 上下文摘要 (Payload)"
echo "========================="
echo "项目: 内容审核平台"
echo "技术栈: Next.js + TypeScript"
echo "状态: 开发中"
echo ""

# 5. 保存清理日志
LOG_DIR=".agent-logs"
mkdir -p "$LOG_DIR"

TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
LOG_FILE="$LOG_DIR/context-cleanup-$(date +%Y%m%d).log"

echo "[$TIMESTAMP] Context cleanup completed" >> "$LOG_FILE"
echo "  - Files: $TS_FILES" >> "$LOG_FILE"
echo "  - Lines: $TOTAL_LINES" >> "$LOG_FILE"

echo "✅ 上下文清理完成"
echo "📝 日志: $LOG_FILE"
