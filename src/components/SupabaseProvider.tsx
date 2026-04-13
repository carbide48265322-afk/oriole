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
