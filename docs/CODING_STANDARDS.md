# 编码规范 (Coding Standards)

> 技术栈: Next.js + TypeScript + React
> 项目类型: 内容审核平台

## 📌 核心原则

1. **类型安全优先**: 所有接口、组件、函数必须明确类型
2. **组件化思维**: UI 拆分为可复用组件，单一职责
3. **错误边界**: 关键操作必须有错误处理和降级方案
4. **性能意识**: 避免不必要的重渲染，使用 React.memo/useMemo/useCallback

##  UI 技术栈规范

### 核心原则

**禁止使用项目技术栈未提及的 UI 库或样式方案。**

### 为什么？

| 问题 | 说明 |
|------|------|
| **样式冲突** | 不同 UI 库的样式会互相冲突，导致 UI 变形 |
| **包体积膨胀** | 引入多个 UI 库增加 bundle 大小 |
| **维护困难** | 混合写法导致代码风格不统一，后续维护成本高 |
| **水合问题** | 不同 UI 库的 SSR 策略不同，混合使用容易产生水合错误 |

### 类比

> 在 React 项目中你不会用 Vue 的写法（如 `v-if`、`v-for`），  
> 同理，项目技术栈没写的 UI 库，你也不应该用。

### 如何判断？

1. 看项目技术栈文档/README/`package.json`
2. 技术栈里没写的 UI 库 → 禁止使用
3. 技术栈里有的 → 优先使用
4. 技术栈里提到的样式方案 → 遵守其规则

### 禁止事项

| 禁止 | 说明 |
|------|------|
| 技术栈未提及的 UI 库 | 如技术栈写 antd，不要用 Tailwind/MUI/Element |
| 混用多个 UI 库 | 同时用 antd + Tailwind + MUI |

### 已发现的 UI 混用问题记录

| 日期 | 问题 | 修复 |
|------|------|------|
| 2025-04-11 | 首页/布局使用 Tailwind 类名（技术栈未提及） | 全部改为 antd 组件 + inline style |
| 2025-04-11 | 移除 Tailwind 依赖和配置 | 技术栈只写了 antd，不需要的依赖全部清理 |

##  已发现的 API 兼容问题记录

> **原则**：发现问题时记录到此处，后续代码自动遵循。不要每次去查所有依赖。

| 日期 | 依赖 | 问题 | 正确用法 |
|------|------|------|----------|
| 2025-04-11 | antd 6.x | `Space` 组件 `direction` 属性已废弃 | 使用 `orientation` |

## 🎨 代码风格

### TypeScript 规范

```typescript
// ✅ 正确: 明确的类型定义
interface AuditTask {
  id: string;
  content: string;
  contentType: 'text' | 'image';
  status: 'pending' | 'ai_reviewing' | 'manual_review' | 'approved' | 'rejected';
  aiConfidence?: number;
  createdAt: Date;
}

// ❌ 错误: 使用 any
const task: any = fetchData();
```

### React 组件规范

```typescript
// ✅ 正确: 函数组件 + TypeScript
interface AuditCardProps {
  task: AuditTask;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export const AuditCard: React.FC<AuditCardProps> = ({ task, onApprove, onReject }) => {
  return (
    <div className="audit-card">
      {/* 组件内容 */}
    </div>
  );
};
```

### 命名规范

| 类型 | 规范 | 示例 |
|------|------|------|
| 组件名 | PascalCase | `AuditCard`, `ReviewPanel` |
| 文件名 | PascalCase (组件) / camelCase (工具) | `AuditCard.tsx`, `api.ts` |
| 变量/函数 | camelCase | `fetchAuditTasks`, `handleApprove` |
| 常量 | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT`, `API_BASE_URL` |
| 接口/类型 | PascalCase + Interface/Type 后缀 (可选) | `AuditTask`, `UserType` |

## 🔒 安全规范

详见: [SECURITY.md](./SECURITY.md)

### 关键规则

1. **绝不硬编码密钥**: 使用 `.env.local` 管理敏感信息
2. **输入验证**: 所有用户输入必须验证 (使用 Zod)
3. **XSS 防护**: 不直接使用 `dangerouslySetInnerHTML`
4. **CSRF 防护**: 所有 mutation 操作需要 CSRF token

## 📁 目录结构

```
src/
├── app/              # Next.js App Router
│   ├── (auth)/       # 认证相关路由
│   ├── (dashboard)/  # 审核工作台
│   └── api/          # API 路由
├── components/       # 可复用组件
│   ├── ui/           # 基础 UI 组件
│   └── audit/        # 审核相关组件
├── lib/              # 工具函数
│   ├── api.ts        # API 调用
│   └── utils.ts      # 通用工具
├── types/            # TypeScript 类型定义
├── hooks/            # 自定义 React Hooks
└── store/            # 状态管理
```

## 🧪 测试规范

- 单元测试: Jest + React Testing Library
- E2E 测试: Playwright
- 测试文件位置: 与源文件同目录 `*.test.tsx`

## ⚡ 性能优化

1. **图片优化**: 使用 `next/image`，指定宽高比
2. **字体优化**: 使用 `next/font`，避免 FOIT
3. **代码分割**: 动态 `import()` 大型组件
4. **缓存策略**: 合理使用 React Query / SWR 缓存

## 🚫 禁止事项

- ❌ 使用 `any` 类型
- ❌ 在组件中直接调用 `fetch`，使用封装的 API 客户端
- ❌ 忽略 TypeScript 错误 (`@ts-ignore`)
- ❌ 未处理的 Promise rejection
- ❌ 直接操作 DOM (除非使用 useRef)
