import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { db } from '../server/db'
import { users } from '../server/schema'
import { eq } from 'drizzle-orm'

export async function getCurrentUser() {
  const cookieStore = cookies()
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )
  
  try {
    const { data: { user: supabaseUser } } = await supabase.auth.getUser()
    
    if (!supabaseUser) {
      return null
    }

    // Get user from our database
    const [dbUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, supabaseUser.email!))
      .limit(1)

    if (!dbUser) {
      // Create user in our database if they don't exist
      const [newUser] = await db
        .insert(users)
        .values({
          email: supabaseUser.email!,
          name: supabaseUser.user_metadata?.full_name || supabaseUser.email!.split('@')[0],
          avatarUrl: supabaseUser.user_metadata?.avatar_url,
          googleId: supabaseUser.app_metadata?.provider === 'google' ? supabaseUser.id : null,
          emailVerified: supabaseUser.email_confirmed_at ? true : false,
        })
        .returning()

      return newUser
    }

    return dbUser
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('Authentication required')
  }
  return user
}

export async function requireSuperuser() {
  const user = await requireAuth()
  if (user.role !== 'superuser') {
    throw new Error('Superuser access required')
  }
  return user
}

export function isServer() {
  return typeof window === 'undefined'
}

export async function getServerSession() {
  if (!isServer()) {
    throw new Error('getServerSession can only be called on the server')
  }
  
  return getCurrentUser()
}