#!/bin/bash
# Snapshot 脚本 - 文件快照管理
# 保存、列出、对比代码库状态快照
# 使用: bash scripts/snapshot.sh [save|list|diff] [snapshot-name]

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_ROOT"

SNAPSHOT_DIR=".snapshots"
mkdir -p "$SNAPSHOT_DIR"

ACTION=${1:-"list"}
SNAPSHOT_NAME=${2:-""}

case $ACTION in
    save)
        if [ -z "$SNAPSHOT_NAME" ]; then
            echo "❌ 用法: bash scripts/snapshot.sh save <snapshot-name>"
            echo ""
            echo "示例:"
            echo "  bash scripts/snapshot.sh save initial"
            echo "  bash scripts/snapshot.sh save pre-refactor"
            exit 1
        fi
        
        TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
        SNAPSHOT_FILE="$SNAPSHOT_DIR/${SNAPSHOT_NAME}_${TIMESTAMP}.tar.gz"
        
        echo "📸 保存快照: $SNAPSHOT_NAME"
        echo "时间戳: $TIMESTAMP"
        echo ""
        
        # 创建快照 (排除 node_modules, .next 等)
        tar -czf "$SNAPSHOT_FILE" \
            --exclude='node_modules' \
            --exclude='.next' \
            --exclude='.snapshots' \
            --exclude='.agent-logs' \
            --exclude='.git' \
            src/ \
            .qwen/ \
            docs/ \
            scripts/ \
            package.json \
            tsconfig.json \
            2>/dev/null
        
        if [ $? -eq 0 ]; then
            echo "✅ 快照已保存: $SNAPSHOT_FILE"
            
            # 显示统计信息
            FILE_COUNT=$(tar -tzf "$SNAPSHOT_FILE" | grep -v '/$' | wc -l)
            SIZE=$(du -h "$SNAPSHOT_FILE" | cut -f1)
            echo "📊 文件数: $FILE_COUNT"
            echo "📦 大小: $SIZE"
        else
            echo "❌ 快照保存失败"
            exit 1
        fi
        ;;
        
    list)
        echo "📋 可用快照列表"
        echo "===================="
        echo ""
        
        if [ -z "$(ls -A $SNAPSHOT_DIR/*.tar.gz 2>/dev/null)" ]; then
            echo "ℹ️  无快照"
            echo ""
            echo "创建第一个快照:"
            echo "  bash scripts/snapshot.sh save initial"
        else
            ls -lht "$SNAPSHOT_DIR"/*.tar.gz 2>/dev/null | while read line; do
                echo "$line"
            done
            echo ""
            echo "对比快照:"
            echo "  bash scripts/snapshot.sh diff <snapshot1> <snapshot2>"
        fi
        ;;
        
    diff)
        if [ -z "$SNAPSHOT_NAME" ] || [ -z "${3:-}" ]; then
            echo "❌ 用法: bash scripts/snapshot.sh diff <snapshot1> <snapshot2>"
            echo ""
            echo "示例:"
            echo "  bash scripts/snapshot.sh diff initial pre-refactor"
            exit 1
        fi
        
        SNAPSHOT1=$(ls -t "$SNAPSHOT_DIR/${SNAPSHOT_NAME}_"*.tar.gz 2>/dev/null | head -1)
        SNAPSHOT2=$(ls -t "$SNAPSHOT_DIR/${3}_"*.tar.gz 2>/dev/null | head -1)
        
        if [ -z "$SNAPSHOT1" ] || [ -z "$SNAPSHOT2" ]; then
            echo "❌ 未找到指定的快照文件"
            echo "使用 'bash scripts/snapshot.sh list' 查看可用快照"
            exit 1
        fi
        
        echo "🔍 对比快照"
        echo "=============="
        echo "快照 1: $SNAPSHOT1"
        echo "快照 2: $SNAPSHOT2"
        echo ""
        
        # 创建临时目录
        TEMP_DIR=$(mktemp -d)
        mkdir -p "$TEMP_DIR/snap1" "$TEMP_DIR/snap2"
        
        # 解压快照
        tar -xzf "$SNAPSHOT1" -C "$TEMP_DIR/snap1" 2>/dev/null
        tar -xzf "$SNAPSHOT2" -C "$TEMP_DIR/snap2" 2>/dev/null
        
        # 对比
        echo "📊 差异统计:"
        diff -rq "$TEMP_DIR/snap1" "$TEMP_DIR/snap2" 2>/dev/null | grep -E "Only in|differ" | head -20 || true
        
        # 清理
        rm -rf "$TEMP_DIR"
        ;;
        
    *)
        echo "❌ 未知操作: $ACTION"
        echo ""
        echo "用法: bash scripts/snapshot.sh [save|list|diff] [snapshot-name]"
        echo ""
        echo "命令:"
        echo "  save <name>     保存快照"
        echo "  list            列出所有快照"
        echo "  diff <n1> <n2>  对比两个快照"
        exit 1
        ;;
esac
