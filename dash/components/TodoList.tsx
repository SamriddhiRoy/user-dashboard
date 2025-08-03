'use client'

import { format, formatDistanceToNow, isPast } from 'date-fns'
import { EditIcon, TrashIcon, CheckCircleIcon, CircleIcon, ClockIcon } from 'lucide-react'

interface Todo {
  id: string
  title: string
  description?: string
  scheduledAt: Date
  completed: boolean
  completedAt?: Date
  createdAt: Date
  updatedAt: Date
}

interface TodoListProps {
  todos: Todo[]
  onEdit: (todo: Todo) => void
  onDelete: (todoId: string) => void
  onToggleComplete: (todoId: string, completed: boolean) => void
}

export default function TodoList({ todos, onEdit, onDelete, onToggleComplete }: TodoListProps) {
  const handleDelete = async (todoId: string) => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      try {
        const response = await fetch(`/api/todos/${todoId}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          onDelete(todoId)
        }
      } catch (error) {
        console.error('Error deleting todo:', error)
      }
    }
  }

  if (todos.length === 0) {
    return (
      <div className="text-center py-12">
        <CheckCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No todos</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by creating a new todo.</p>
      </div>
    )
  }

  // Sort todos: incomplete first (by schedule date), then completed
  const sortedTodos = [...todos].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1
    }
    if (!a.completed) {
      return new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
    }
    return new Date(b.completedAt || b.updatedAt).getTime() - new Date(a.completedAt || a.updatedAt).getTime()
  })

  return (
    <div className="divide-y divide-gray-200">
      {sortedTodos.map((todo) => {
        const isOverdue = !todo.completed && isPast(todo.scheduledAt)
        const timeFromNow = formatDistanceToNow(todo.scheduledAt, { addSuffix: true })

        return (
          <div
            key={todo.id}
            className={`p-6 hover:bg-gray-50 transition-colors ${
              todo.completed ? 'opacity-75' : ''
            }`}
          >
            <div className="flex items-start space-x-4">
              {/* Checkbox */}
              <button
                onClick={() => onToggleComplete(todo.id, !todo.completed)}
                className="mt-1 flex-shrink-0"
              >
                {todo.completed ? (
                  <CheckCircleIcon className="h-5 w-5 text-green-600" />
                ) : (
                  <CircleIcon className="h-5 w-5 text-gray-400 hover:text-green-600 transition-colors" />
                )}
              </button>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3
                    className={`text-sm font-medium text-gray-900 ${
                      todo.completed ? 'line-through' : ''
                    }`}
                  >
                    {todo.title}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onEdit(todo)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                      title="Edit todo"
                    >
                      <EditIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(todo.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete todo"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {todo.description && (
                  <p
                    className={`mt-1 text-sm text-gray-600 ${
                      todo.completed ? 'line-through' : ''
                    }`}
                  >
                    {todo.description}
                  </p>
                )}

                {/* Schedule info */}
                <div className="mt-2 flex items-center text-xs text-gray-500">
                  <ClockIcon className="h-3 w-3 mr-1" />
                  <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
                    {todo.completed ? 'Was scheduled' : 'Scheduled'} for{' '}
                    {format(todo.scheduledAt, 'MMM d, yyyy \'at\' h:mm a')}
                  </span>
                  {!todo.completed && (
                    <span className={`ml-2 ${isOverdue ? 'text-red-600' : 'text-gray-400'}`}>
                      ({timeFromNow})
                    </span>
                  )}
                </div>

                {todo.completed && todo.completedAt && (
                  <div className="mt-1 text-xs text-green-600">
                    Completed {formatDistanceToNow(todo.completedAt, { addSuffix: true })}
                  </div>
                )}

                {isOverdue && (
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Overdue
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}