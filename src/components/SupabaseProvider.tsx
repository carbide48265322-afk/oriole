'use client'

import { createContext, useContext, ReactNode, useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Session, SupabaseClient } from '@supabase/supabase-js'

interface SupabaseContextType {
  supabase: SupabaseClient | null
  session: Session | null
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined)

export function SupabaseProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    if (supabase) {
      // 初始化会话
      const initializeSession = async () => {
        if (!supabase) return
        try {
          const { data: { session } } = await supabase.auth.getSession()
          console.log('initial session:', session)
          setSession(session)
        } catch (error) {
          console.error('Error getting initial session:', error)
        }
      }

      // 立即初始化会话
      initializeSession()

      // 监听会话变化
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        console.log('auth state changed:', session)
        setSession(session)
      })

      return () => subscription.unsubscribe()
    }
  }, [supabase])

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
