import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '../../../../lib/auth'
import { db } from '../../../../server/db'
import { todos } from '../../../../server/schema'
import { eq, and, gte, lte, desc } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const now = new Date()
    const fourHoursFromNow = new Date(now.getTime() + (4 * 60 * 60 * 1000))

    // Get upcoming todos (next 4 hours)
    const upcomingTodos = await db
      .select()
      .from(todos)
      .where(and(
        eq(todos.userId, user.id),
        eq(todos.completed, false),
        gte(todos.scheduledAt, now),
        lte(todos.scheduledAt, fourHoursFromNow)
      ))
      .orderBy(todos.scheduledAt)

    // Get recently completed todos (last 10)
    const completedTodos = await db
      .select()
      .from(todos)
      .where(and(
        eq(todos.userId, user.id),
        eq(todos.completed, true)
      ))
      .orderBy(desc(todos.completedAt))
      .limit(10)

    const allNotificationTodos = [...upcomingTodos, ...completedTodos]

    return NextResponse.json(allNotificationTodos)
  } catch (error) {
    console.error('Error in GET /api/todos/notifications:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}