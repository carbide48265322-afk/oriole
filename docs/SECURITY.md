# 安全规范 (Security Standards)

> 项目类型: 内容审核平台 (处理敏感数据)

## 🔴 安全红线 (绝对禁止)

### 1. 密钥管理

```typescript
// ❌ 绝对禁止: 硬编码密钥
const API_KEY = "sk-1234567890abcdef";
const DB_PASSWORD = "password123";

// ✅ 正确: 使用环境变量
const API_KEY = process.env.OPENAI_API_KEY;
const DB_PASSWORD = process.env.DATABASE_URL;
```

**规则**:
- 所有敏感信息必须存储在 `.env.local` 文件
- `.env.local` 必须加入 `.gitignore`
- 提交前检查是否有密钥泄露

### 2. 认证与授权

```typescript
// ✅ 正确: API 路由必须验证用户身份
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return new Response("未授权", { status: 401 });
  }
  
  // 检查角色权限
  if (session.user.role !== 'auditor' && session.user.role !== 'admin') {
    return new Response("权限不足", { status: 403 });
  }
  
  // 业务逻辑
}
```

### 3. 输入验证

**使用 Zod 验证所有用户输入**:

```typescript
import { z } from "zod";

// ✅ 正确: 审核结果验证
const AuditResultSchema = z.object({
  taskId: z.string().uuid(),
  decision: z.enum(['approved', 'rejected']),
  reason: z.string().min(10).max(500), // 原因必须 10-500 字
  confidence: z.number().min(0).max(1).optional(),
});

export async function POST(request: Request) {
  const body = await request.json();
  const validation = AuditResultSchema.safeParse(body);
  
  if (!validation.success) {
    return new Response(validation.error.message, { status: 400 });
  }
  
  // 处理审核逻辑
}
```

### 4. XSS 防护

```typescript
// ❌ 禁止: 直接使用 dangerouslySetInnerHTML
<div dangerouslySetInnerHTML={{ __html: userContent }} />

// ✅ 正确: 使用 DOMPurify 清理
import DOMPurify from 'isomorphic-dompurify';

const sanitizedContent = DOMPurify.sanitize(userContent);
<div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
```

### 5. SQL 注入防护

```typescript
// ❌ 禁止: 字符串拼接 SQL
const query = `SELECT * FROM tasks WHERE id = '${taskId}'`;

// ✅ 正确: 使用参数化查询 (Prisma ORM)
const task = await prisma.auditTask.findUnique({
  where: { id: taskId }
});
```

## 🔐 数据保护

### 敏感数据处理

| 数据类型 | 保护方式 |
|---------|---------|
| 用户密码 | bcrypt 哈希存储，永不返回前端 |
| API 密钥 | 服务端调用，不暴露给客户端 |
| 审核内容 | 根据角色过滤，防止越权访问 |
| 个人信息 | 脱敏处理 (手机号、邮箱) |

### API 安全

1. **速率限制**: 防止 API 滥用
   ```typescript
   import { ratelimit } from "@/lib/ratelimit";
   
   export async function POST(request: Request) {
     const { success } = await ratelimit.limit(request.ip ?? 'anonymous');
     if (!success) {
       return new Response("请求过于频繁", { status: 429 });
     }
   }
   ```

2. **CORS 配置**: 仅允许信任的域名
3. **CSRF 防护**: 使用 `next-auth` 内置 CSRF token

## 📋 安全审计清单

每次提交代码前检查:

- [ ] 无硬编码密钥或敏感信息
- [ ] 所有用户输入已验证
- [ ] API 路由已添加认证和授权
- [ ] 无 `any` 类型 (可能导致类型安全漏洞)
- [ ] 错误消息不泄露敏感信息
- [ ] 日志不包含个人数据

## 🚨 安全事件响应

发现安全漏洞时:

1. **立即**: 创建 Issue 标记为 `security`
2. **不要**: 在公开 PR/Issue 中描述漏洞细节
3. **联系**: 项目负责人私聊处理
4. **修复**: 紧急修复后发布安全更新

## 📚 参考资源

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js 安全最佳实践](https://nextjs.org/docs/advanced-features/security)
- [React 安全指南](https://react.dev/learn/preserving-and-resetting-state)
