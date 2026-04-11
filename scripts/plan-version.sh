#!/bin/bash
# Plan Version 脚本 - 计划版本管理 + 动态调整
# 使用: bash scripts/plan-version.sh [version|create|diff] [plan-name]

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_ROOT"

echo "📋 Plan 版本管理"
echo "=================="
echo ""

ACTION=${1:-"version"}
PLAN_NAME=${2:-""}

case $ACTION in
    version)
        echo "📊 当前 Plan 版本"
        echo ""
        
        if [ -z "$PLAN_NAME" ]; then
            echo "显示所有 Spec 的 Plan 版本:"
            echo ""
            
            if [ -d ".qwen/specs" ]; then
                for spec_dir in .qwen/specs/*/; do
                    spec_name=$(basename "$spec_dir")
                    if [ -f "$spec_dir/PLAN.md" ]; then
                        VERSION=$(grep -m1 "^version:" "$spec_dir/PLAN.md" 2>/dev/null | cut -d' ' -f2 || "1.0.0")
                        UPDATED=$(grep -m1 "^updated:" "$spec_dir/PLAN.md" 2>/dev/null | cut -d' ' -f2 || "unknown")
                        echo "  📄 $spec_name - v${VERSION:-1.0.0} (更新: ${UPDATED:-unknown})"
                    fi
                done
            else
                echo "  ℹ️  无 Spec 目录"
            fi
        else
            PLAN_FILE=".qwen/specs/$PLAN_NAME/PLAN.md"
            if [ -f "$PLAN_FILE" ]; then
                echo "📄 Plan: $PLAN_NAME"
                grep -E "^version:|^updated:|^status:" "$PLAN_FILE" 2>/dev/null || echo "  版本信息未找到"
            else
                echo "❌ 未找到 Plan: $PLAN_NAME"
            fi
        fi
        ;;
        
    create)
        if [ -z "$PLAN_NAME" ]; then
            echo "❌ 用法: bash scripts/plan-version.sh create <plan-name>"
            exit 1
        fi
        
        PLAN_DIR=".qwen/specs/$PLAN_NAME"
        mkdir -p "$PLAN_DIR"
        
        if [ -f "$PLAN_DIR/PLAN.md" ]; then
            # 创建新版本
            TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
            BACKUP_FILE="$PLAN_DIR/PLAN.md.bak.$(date +%Y%m%d_%H%M%S)"
            cp "$PLAN_DIR/PLAN.md" "$BACKUP_FILE"
            echo "✅ 已备份当前版本: $BACKUP_FILE"
        fi
        
        echo "💡 使用 /spec-kit 或 /multi-plan 创建新的 Plan"
        ;;
        
    diff)
        if [ -z "$PLAN_NAME" ]; then
            echo "❌ 用法: bash scripts/plan-version.sh diff <plan-name>"
            exit 1
        fi
        
        PLAN_DIR=".qwen/specs/$PLAN_NAME"
        BACKUPS=$(ls -t "$PLAN_DIR"/PLAN.md.bak.* 2>/dev/null)
        
        if [ -z "$BACKUPS" ]; then
            echo "ℹ️  无历史版本可对比"
        else
            LATEST_BACKUP=$(echo "$BACKUPS" | head -1)
            echo "🔍 对比最新版本与上一个版本"
            echo "最新: $PLAN_DIR/PLAN.md"
            echo "上一个: $LATEST_BACKUP"
            echo ""
            diff -u "$LATEST_BACKUP" "$PLAN_DIR/PLAN.md" 2>/dev/null | head -50 || true
        fi
        ;;
        
    *)
        echo "❌ 未知操作: $ACTION"
        echo ""
        echo "用法: bash scripts/plan-version.sh [version|create|diff] [plan-name]"
        exit 1
        ;;
esac
