'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Spin } from 'antd'
import { useSupabase } from './SupabaseProvider'

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode
}) {
  const { session } = useSupabase()
  const router = useRouter()

  useEffect(() => {
    if (session === null) {
      router.push('/login')
    }
  }, [session, router])

  if (session === null) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <Spin size="large" tip="正在验证..." />
      </div>
    )
  }

  return <>{children}</>
}
