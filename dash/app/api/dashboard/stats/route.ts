import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '../../../../lib/auth'
import { db } from '../../../../server/db'
import { todos, users } from '../../../../server/schema'
import { eq, count, and, gte } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Get user's todo statistics
    const [totalTodos] = await db
      .select({ count: count() })
      .from(todos)
      .where(eq(todos.userId, user.id))

    const [completedTodos] = await db
      .select({ count: count() })
      .from(todos)
      .where(and(eq(todos.userId, user.id), eq(todos.completed, true)))

    const [upcomingTodos] = await db
      .select({ count: count() })
      .from(todos)
      .where(and(
        eq(todos.userId, user.id),
        eq(todos.completed, false),
        gte(todos.scheduledAt, new Date())
      ))

    const stats = {
      totalTodos: totalTodos.count,
      completedTodos: completedTodos.count,
      upcomingTodos: upcomingTodos.count,
      totalUsers: 0
    }

    // Only superusers can see total user count
    if (user.role === 'superuser') {
      const [totalUsers] = await db
        .select({ count: count() })
        .from(users)
      
      stats.totalUsers = totalUsers.count
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error in /api/dashboard/stats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}