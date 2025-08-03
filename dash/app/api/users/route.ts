import { NextRequest, NextResponse } from 'next/server'
import { requireSuperuser } from '../../../lib/auth'
import { db } from '../../../server/db'
import { users } from '../../../server/schema'
import { desc } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const user = await requireSuperuser()

    const allUsers = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        emailVerified: users.emailVerified,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .orderBy(desc(users.createdAt))

    return NextResponse.json(allUsers)
  } catch (error) {
    if (error instanceof Error && error.message === 'Superuser access required') {
      return NextResponse.json({ error: 'Superuser access required' }, { status: 403 })
    }
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }
    
    console.error('Error in GET /api/users:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}