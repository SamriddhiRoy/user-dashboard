import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '../../../lib/auth'
import { db } from '../../../server/db'
import { todos } from '../../../server/schema'
import { eq, desc } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const userTodos = await db
      .select()
      .from(todos)
      .where(eq(todos.userId, user.id))
      .orderBy(desc(todos.createdAt))

    return NextResponse.json(userTodos)
  } catch (error) {
    console.error('Error in GET /api/todos:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, scheduledAt } = body

    // Validation
    if (!title?.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    if (!scheduledAt) {
      return NextResponse.json({ error: 'Scheduled date/time is required' }, { status: 400 })
    }

    const scheduledDate = new Date(scheduledAt)
    if (scheduledDate <= new Date()) {
      return NextResponse.json({ 
        error: 'Todo must be scheduled for a future date and time' 
      }, { status: 400 })
    }

    const [newTodo] = await db
      .insert(todos)
      .values({
        userId: user.id,
        title: title.trim(),
        description: description?.trim() || null,
        scheduledAt: scheduledDate,
        completed: false,
      })
      .returning()

    return NextResponse.json(newTodo, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/todos:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}