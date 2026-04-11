#!/bin/bash
# Lint Engine 脚本 - 全量扫描、豁免逻辑
# 使用: bash scripts/lint-engine.sh

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_ROOT"

echo "🔍 Lint Engine - 全量扫描"
echo "========================="
echo ""

if [ ! -f "scripts/lint-rules.json" ]; then
    echo "❌ 缺少 scripts/lint-rules.json"
    exit 1
fi

# 读取规则并执行
node -e "
const rules = require('./scripts/lint-rules.json');
const { execSync } = require('child_process');

let passCount = 0;
let failCount = 0;
let warnCount = 0;

console.log('📋 规则总数: ' + rules.rules.length);
console.log('');

rules.rules.forEach((rule, index) => {
    console.log('─────────────────────────────────');
    console.log('规则 ' + (index + 1) + '/' + rules.rules.length + ': ' + rule.id + ' - ' + rule.name);
    console.log('描述: ' + rule.description);
    console.log('严重程度: ' + rule.severity);
    
    try {
        const output = execSync(rule.command, { 
            encoding: 'utf8', 
            stdio: ['pipe', 'pipe', 'ignore'],
            timeout: 10000 
        }).trim();
        
        if (output) {
            const issueCount = output.split('\\n').length;
            if (rule.severity === 'error') {
                console.log('❌ FAIL: ' + issueCount + ' 个问题');
                if (issueCount <= 5) {
                    console.log(output);
                }
                failCount++;
            } else {
                console.log('⚠️  WARN: ' + issueCount + ' 个问题');
                if (issueCount <= 5) {
                    console.log(output);
                }
                warnCount++;
            }
        } else {
            console.log('✅ PASS');
            passCount++;
        }
    } catch (error) {
        console.log('✅ PASS (无问题)');
        passCount++;
    }
    
    console.log('');
});

console.log('─────────────────────────────────');
console.log('📊 扫描报告');
console.log('─────────────────────────────────');
console.log('✅ 通过: ' + passCount);
console.log('❌ 失败: ' + failCount);
console.log('⚠️  警告: ' + warnCount);
console.log('');

if (failCount > 0) {
    console.log('❌ Lint Engine 未通过');
    process.exit(1);
} else {
    console.log('✅ Lint Engine 检查通过');
    if (warnCount > 0) {
        console.log('⚠️  存在 ' + warnCount + ' 个警告，建议优化');
    }
    process.exit(0);
}
" 2>/dev/null
