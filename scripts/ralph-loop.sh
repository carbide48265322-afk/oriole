#!/bin/bash
# Ralph 循环 - 自动迭代修复
# 用途: 重复运行质量门禁，AI 自动分析错误并修复，直到通过或达到上限
# 使用: bash scripts/ralph-loop.sh [max-iterations]

set -e

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_ROOT"

MAX_ITERATIONS=${1:-3}  # 默认最多运行 3 次

echo "🔄 Ralph 自动迭代修复循环"
echo "==========================="
echo "最大迭代次数: $MAX_ITERATIONS"
echo ""

iteration=0
while [ $iteration -lt $MAX_ITERATIONS ]; do
    iteration=$((iteration + 1))
    echo ""
    echo "═══════════════════════════════════════"
    echo "🔄 迭代 $iteration/$MAX_ITERATIONS"
    echo "═══════════════════════════════════════"
    
    # 运行质量门禁
    if bash scripts/verify.sh 2>&1 | tee /tmp/ralph-output.txt; then
        echo ""
        echo "✅ 质量门禁通过！"
        echo "🎉 Ralph 循环在第 $iteration 次迭代后成功"
        rm -f /tmp/ralph-output.txt
        exit 0
    else
        echo ""
        echo "❌ 质量门禁未通过 (迭代 $iteration/$MAX_ITERATIONS)"
        
        # 检查是否还有下一次机会
        if [ $iteration -lt $MAX_ITERATIONS ]; then
            echo ""
            echo "📋 错误输出已保存到 /tmp/ralph-output.txt"
            echo "💡 下一步: AI 将分析错误并自动修复"
            echo ""
            echo "⚠️  需要 AI Agent 介入修复 (手动触发 /spec-kit 或委派 Generator)"
            echo ""
            read -p "是否继续下一次迭代？(y/N): " -n 1 -r
            echo
            if [[ ! $REPLY =~ ^[Yy]$ ]]; then
                echo "已取消 Ralph 循环"
                exit 1
            fi
        else
            echo ""
            echo "❌ 已达到最大迭代次数 ($MAX_ITERATIONS)"
            echo "💡 建议: 手动审查错误日志并修复"
            cat /tmp/ralph-output.txt
            rm -f /tmp/ralph-output.txt
            exit 1
        fi
    fi
done
