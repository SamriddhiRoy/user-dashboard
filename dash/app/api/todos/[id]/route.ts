import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '../../../../lib/auth'
import { db } from '../../../../server/db'
import { todos } from '../../../../server/schema'
import { eq, and } from 'drizzle-orm'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const [updatedTodo] = await db
      .update(todos)
      .set({
        title: title.trim(),
        description: description?.trim() || null,
        scheduledAt: scheduledDate,
        updatedAt: new Date(),
      })
      .where(and(eq(todos.id, params.id), eq(todos.userId, user.id)))
      .returning()

    if (!updatedTodo) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 })
    }

    return NextResponse.json(updatedTodo)
  } catch (error) {
    console.error('Error in PUT /api/todos/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const body = await request.json()
    const { completed } = body

    const updateData: any = {
      updatedAt: new Date(),
    }

    if (typeof completed === 'boolean') {
      updateData.completed = completed
      if (completed) {
        updateData.completedAt = new Date()
      } else {
        updateData.completedAt = null
      }
    }

    const [updatedTodo] = await db
      .update(todos)
      .set(updateData)
      .where(and(eq(todos.id, params.id), eq(todos.userId, user.id)))
      .returning()

    if (!updatedTodo) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 })
    }

    return NextResponse.json(updatedTodo)
  } catch (error) {
    console.error('Error in PATCH /api/todos/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const [deletedTodo] = await db
      .delete(todos)
      .where(and(eq(todos.id, params.id), eq(todos.userId, user.id)))
      .returning()

    if (!deletedTodo) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in DELETE /api/todos/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}