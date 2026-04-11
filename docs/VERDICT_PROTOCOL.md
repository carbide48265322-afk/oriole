# VERDICT 协议 - 自动化审查/测试标准

## 目的

将主观的"代码看起来还行"转化为**二元通过/失败信号**，使得流水线可以基于这个信号做出自动化决策。

## 协议规则

### 1. 必须以 VERDICT 结尾

所有 Review 和 QA 的输出**必须**以以下之一结尾：

```
VERDICT: PASS
```
或
```
VERDICT: FAIL
```

### 2. FAIL 三要素

VERDICT: FAIL 必须包含：

| 要素 | 说明 | 示例 |
|------|------|------|
| **在哪里** | 文件路径 + 行号/函数名 | `src/db/user.ts:45` |
| **为什么** | 失败点分析 | `使用字符串拼接构建 SQL，存在注入风险` |
| **怎么修** | 明确的修复建议 | `使用参数化查询 WHERE id = $1` |

### 3. 优先级标签

每个问题必须标记优先级：

| 标签 | 含义 | 处理 |
|------|------|------|
| [高危] | 安全风险、数据丢失 | 必须修复，阻止合并 |
| [中危] | 潜在 Bug、规范违反 | 建议修复 |
| [低危] | 代码风格、小优化 | 可选修复 |

### 4. PASS 标准

VERDICT: PASS 不等于"完美代码"，而是：
- 没有高危问题
- 中危问题 ≤ 3 个
- 低危问题不影响功能

## 应用范围

| Agent | 审查维度 | VERDICT 依据 |
|-------|---------|-------------|
| **Reviewer** | 代码质量、安全、性能 | 无高危问题 |
| **Security Expert** | 漏洞、权限、加密 | 无安全漏洞 |
| **QA Engineer** | 测试覆盖率、通过率 | 覆盖率 ≥ 80%，通过率 100% |

## 使用示例

### 示例 1: Reviewer PASS

```
审查完成，未发现高危问题。

低危建议:
- src/utils/format.ts:12 - 函数可进一步拆分

VERDICT: PASS
```

### 示例 2: QA FAIL

```
测试报告:
- 总用例: 30
- 通过: 28
- 失败: 2
- 覆盖率: 76%（阈值 80%）

1. [测试失败] src/auth/jwt.ts - should reject expired_token
   原因: 过期 token 未被正确拒绝
   修复: 检查 token 有效期校验逻辑

2. [覆盖率不足] src/utils/crypto.ts - 覆盖率 45%
   原因: 缺少加密边界测试
   修复: 补充空输入、超长输入测试

VERDICT: FAIL
```

## 优雅降级

| 场景 | 行为 |
|------|------|
| Reviewer 未输出 VERDICT | 视为 FAIL |
| QA 输出未输出 VERDICT | 视为 FAIL |
| VERDICT 格式错误 | 视为 FAIL |

## 集成到 Pipeline

```bash
# Pipeline 检查 VERDICT
VERDICT=$(grep "^VERDICT:" output.txt)
if [ "$VERDICT" = "VERDICT: PASS" ]; then
  echo "✅ 通过"
  exit 0
else
  echo "❌ 失败"
  exit 1
fi
```
