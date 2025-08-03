import { NextRequest, NextResponse } from 'next/server'
import { requireSuperuser } from '../../../../../lib/auth'
import { db } from '../../../../../server/db'
import { users } from '../../../../../server/schema'
import { eq } from 'drizzle-orm'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = await requireSuperuser()

    // Prevent users from changing their own role
    if (params.id === currentUser.id) {
      return NextResponse.json({ 
        error: 'You cannot change your own role' 
      }, { status: 400 })
    }

    const body = await request.json()
    const { role } = body

    if (!role || !['normal', 'superuser'].includes(role)) {
      return NextResponse.json({ 
        error: 'Invalid role. Must be "normal" or "superuser"' 
      }, { status: 400 })
    }

    const [updatedUser] = await db
      .update(users)
      .set({
        role,
        updatedAt: new Date(),
      })
      .where(eq(users.id, params.id))
      .returning({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
      })

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(updatedUser)
  } catch (error) {
    if (error instanceof Error && error.message === 'Superuser access required') {
      return NextResponse.json({ error: 'Superuser access required' }, { status: 403 })
    }
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }
    
    console.error('Error in PATCH /api/users/[id]/role:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}