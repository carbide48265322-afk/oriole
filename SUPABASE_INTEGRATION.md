# Supabase 接入详细步骤

## 1. 安装 Supabase 客户端库

首先，我们需要安装 Supabase 客户端库：

```bash
pnpm add @supabase/supabase-js
```

## 2. 创建 Supabase 项目

1. 访问 [Supabase 官网](https://supabase.com/) 并登录或注册账号
2. 点击 "New Project" 创建一个新的 Supabase 项目
3. 填写项目名称、数据库密码等信息
4. 选择一个合适的地区，最好与你的 Vercel 部署地区一致
5. 点击 "Create Project" 按钮

## 3. 获取 Supabase 项目配置

项目创建完成后，在项目控制台中：

1. 点击左侧导航栏的 "Project Settings"
2. 点击 "API" 选项卡
3. 复制以下信息：
   - Project URL
   - Anon Key (public API key)

## 4. 配置环境变量

### 本地开发环境

在项目根目录创建 `.env.local` 文件（如果不存在），并添加以下内容：

```env
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=你的项目URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的匿名密钥
```

### Vercel 部署环境

1. 登录 Vercel 控制台
2. 找到你的项目
3. 点击 "Settings" → "Environment Variables"
4. 添加以下环境变量：
   - `NEXT_PUBLIC_SUPABASE_URL`：你的项目 URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`：你的匿名密钥

## 5. 创建 Supabase 客户端实例

在 `src/lib` 目录下创建 `supabase.ts` 文件：

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

## 6. 集成到项目中

### 6.1 更新布局文件

修改 `src/app/layout.tsx` 文件，添加 Supabase 客户端的全局配置：

```typescript
import { SupabaseProvider } from '@/components/SupabaseProvider'

// ... 其他导入

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <AntdRegistry>
          <QueryClientProvider client={queryClient}>
            <SupabaseProvider>
              {children}
            </SupabaseProvider>
          </QueryClientProvider>
        </AntdRegistry>
      </body>
    </html>
  )
}
```

### 6.2 创建 SupabaseProvider 组件

在 `src/components` 目录下创建 `SupabaseProvider.tsx` 文件：

```typescript
'use client'

import { createContext, useContext, ReactNode, useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Session } from '@supabase/supabase-js'

interface SupabaseContextType {
  supabase: typeof supabase
  session: Session | null
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined)

export function SupabaseProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    // 监听会话变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    // 初始化会话
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <SupabaseContext.Provider value={{ supabase, session }}>
      {children}
    </SupabaseContext.Provider>
  )
}

export function useSupabase() {
  const context = useContext(SupabaseContext)
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider')
  }
  return context
}
```

### 6.3 更新现有的认证逻辑

修改 `src/hooks/useAuth.ts` 文件，使用 Supabase 进行认证：

```typescript
import { useSupabase } from '@/components/SupabaseProvider'

export function useAuth() {
  const { supabase, session } = useSupabase()

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  }

  const register = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
    return data
  }

  const logout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  return {
    user: session?.user,
    isAuthenticated: !!session?.user,
    login,
    register,
    logout
  }
}
```

## 7. 数据库操作示例

### 7.1 创建表

在 Supabase 控制台的 "Database" 选项卡中，你可以创建所需的表。例如，创建一个 `users` 表：

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  name TEXT,
  email TEXT UNIQUE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 7.2 数据操作

在组件中使用 Supabase 进行数据操作：

```typescript
import { useSupabase } from '@/components/SupabaseProvider'

function UserProfile() {
  const { supabase, session } = useSupabase()
  const [userProfile, setUserProfile] = useState<any>(null)

  useEffect(() => {
    if (session?.user) {
      fetchUserProfile()
    }
  }, [session])

  const fetchUserProfile = async () => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', session?.user?.id)
      .single()

    if (error) {
      console.error('Error fetching user profile:', error)
    } else {
      setUserProfile(data)
    }
  }

  const updateUserProfile = async (name: string) => {
    const { data, error } = await supabase
      .from('users')
      .update({ name })
      .eq('id', session?.user?.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating user profile:', error)
    } else {
      setUserProfile(data)
    }
  }

  // ... 组件其余部分
}
```

## 8. 部署到 Vercel

当你完成所有代码修改后，将代码推送到你的 Git 仓库，Vercel 会自动触发部署。确保你已经在 Vercel 控制台中配置了正确的环境变量。

## 9. 测试

部署完成后，测试你的应用，确保：

1. 认证功能正常工作
2. 数据库操作正常
3. 所有功能都能正常运行

## 10. 注意事项

1. **安全性**：不要在代码中硬编码你的 Supabase 密钥
2. **错误处理**：在生产环境中，确保适当处理 Supabase 返回的错误
3. **性能**：对于频繁访问的数据，考虑使用缓存
4. **监控**：设置适当的监控，以便及时发现和解决问题

## 11. 进阶功能

如果你需要更高级的功能，如：

- 实时数据订阅
- 存储功能
- 函数和触发器
- 边缘函数

请参考 [Supabase 官方文档](https://supabase.com/docs) 了解更多信息。