#!/bin/bash
# 质量门禁脚本 (Quality Gate)
# 用途: 在提交代码前验证代码质量
# 使用: bash scripts/verify.sh

set -e  # 遇到错误立即退出

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_ROOT"

echo "🚪 运行质量门禁检查..."
echo "================================"

# 计数器
PASS_COUNT=0
FAIL_COUNT=0
WARN_COUNT=0

# 颜色输出
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查结果函数
pass_check() {
    echo -e "${GREEN}✅ PASS${NC}: $1"
    PASS_COUNT=$((PASS_COUNT + 1))
}

fail_check() {
    echo -e "${RED}❌ FAIL${NC}: $1"
    FAIL_COUNT=$((FAIL_COUNT + 1))
}

warn_check() {
    echo -e "${YELLOW}⚠️  WARN${NC}: $1"
    WARN_COUNT=$((WARN_COUNT + 1))
}

echo ""
echo "📋 检查 1/4: TypeScript 类型检查"
if npx tsc --noEmit 2>/dev/null; then
    pass_check "TypeScript 类型检查通过"
else
    fail_check "TypeScript 类型检查失败"
fi

echo ""
echo "📋 检查 2/4: ESLint 代码规范"
if pnpm lint 2>/dev/null; then
    pass_check "ESLint 检查通过"
else
    warn_check "ESLint 发现问题 (非阻断)"
fi

echo ""
echo "📋 检查 3/4: 架构规范检查"
# 运行 lint-rules.json 中的架构规则
ARCH_ISSUES=$(node -e "
const rules = require('./scripts/lint-rules.json');
const { execSync } = require('child_process');
let issues = 0;
rules.rules.filter(r => r.id.startsWith('ARCH') || r.id.startsWith('SEC')).forEach(rule => {
  try {
    const output = execSync(rule.command, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
    if (output.trim()) {
      console.log('  ' + rule.id + ': ' + rule.name + ' - ' + output.trim().split('\n').length + ' issue(s)');
      issues++;
    }
  } catch (e) {}
});
process.exit(issues);
" 2>/dev/null && echo "0" || echo "1")

if [ "$ARCH_ISSUES" = "0" ]; then
    pass_check "架构规范检查通过"
else
    warn_check "架构规范发现问题 (查看详情)"
fi

echo ""
echo "📋 检查 4/4: 单元测试"
if pnpm test -- --passWithNoTests 2>/dev/null; then
    pass_check "单元测试通过"
else
    warn_check "单元测试失败或无测试 (非阻断)"
fi

# 汇总报告
echo ""
echo "================================"
echo "📊 质量门禁报告"
echo "================================"
echo -e "通过: ${GREEN}${PASS_COUNT}${NC}"
echo -e "失败: ${RED}${FAIL_COUNT}${NC}"
echo -e "警告: ${YELLOW}${WARN_COUNT}${NC}"
echo ""

# 判定结果
if [ $FAIL_COUNT -gt 0 ]; then
    echo -e "${RED}❌ 质量门禁未通过${NC}"
    echo "请修复上述问题后再提交代码"
    echo ""
    echo "💡 提示: 可以使用 Ralph 循环自动修复部分问题:"
    echo "   bash scripts/ralph-loop.sh"
    exit 1
else
    echo -e "${GREEN}✅ 质量门禁通过${NC}"
    if [ $WARN_COUNT -gt 0 ]; then
        echo -e "${YELLOW}⚠️  存在 $WARN_COUNT 个警告，建议优化${NC}"
    fi
    exit 0
fi
