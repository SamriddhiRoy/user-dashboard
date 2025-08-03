'use client'

import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export interface User {
  id: string
  email: string
  name: string | null
  avatarUrl: string | null
  role: string
  emailVerified: boolean
  createdAt: Date
  updatedAt: Date
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user: supabaseUser } } = await supabase.auth.getUser()
        
        if (supabaseUser) {
          // Fetch user from our API
          const response = await fetch('/api/auth/me')
          if (response.ok) {
            const userData = await response.json()
            setUser(userData)
          }
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error('Error fetching user:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    getUser()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT' || !session) {
          setUser(null)
          router.push('/auth/login')
        } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          // Refresh user data
          const response = await fetch('/api/auth/me')
          if (response.ok) {
            const userData = await response.json()
            setUser(userData)
          }
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, router])

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    router.push('/auth/login')
  }

  return {
    user,
    loading,
    signOut,
    isAuthenticated: !!user,
    isSuperuser: user?.role === 'superuser',
  }
}