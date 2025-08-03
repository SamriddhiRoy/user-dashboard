import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '../../../lib/auth'
import { db } from '../../../server/db'
import { users } from '../../../server/schema'
import { eq } from 'drizzle-orm'

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const body = await request.json()
    const { name, email } = body

    // Validation
    if (!name?.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    if (!email?.trim()) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 })
    }

    // Check if email is already taken by another user
    if (email !== user.email) {
      const existingUser = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.email, email))
        .limit(1)

      if (existingUser.length > 0 && existingUser[0].id !== user.id) {
        return NextResponse.json({ error: 'Email is already taken' }, { status: 400 })
      }
    }

    const [updatedUser] = await db
      .update(users)
      .set({
        name: name.trim(),
        email: email.trim(),
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id))
      .returning({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        emailVerified: users.emailVerified,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Error in PUT /api/profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}