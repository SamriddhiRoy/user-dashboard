'use client'

import { useState, useEffect } from 'react'
import { XIcon, CheckCircleIcon, ClockIcon } from 'lucide-react'
import { formatDistanceToNow, isAfter, isBefore, addHours } from 'date-fns'

interface Todo {
  id: string
  title: string
  description?: string
  scheduledAt: Date
  completed: boolean
  completedAt?: Date
}

interface NotificationDrawerProps {
  open: boolean
  onClose: () => void
}

export default function NotificationDrawer({ open, onClose }: NotificationDrawerProps) {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      fetchNotifications()
    }
  }, [open])

  const fetchNotifications = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/todos/notifications')
      if (response.ok) {
        const data = await response.json()
        setTodos(data.map((todo: any) => ({
          ...todo,
          scheduledAt: new Date(todo.scheduledAt),
          completedAt: todo.completedAt ? new Date(todo.completedAt) : undefined,
        })))
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  // Filter todos for upcoming (next 4 hours) and recently completed
  const now = new Date()
  const fourHoursFromNow = addHours(now, 4)
  
  const upcomingTodos = todos.filter(todo => 
    !todo.completed && 
    isAfter(todo.scheduledAt, now) && 
    isBefore(todo.scheduledAt, fourHoursFromNow)
  )

  const completedTodos = todos.filter(todo => todo.completed)

  if (!open) return null

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50" onClick={onClose} />
      
      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <XIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              </div>
            ) : (
              <div className="p-6 space-y-6">
                {/* Upcoming Todos */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                    <ClockIcon className="h-4 w-4 mr-2 text-orange-500" />
                    Upcoming (Next 4 Hours)
                  </h3>
                  {upcomingTodos.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">No upcoming todos</p>
                  ) : (
                    <div className="space-y-3">
                      {upcomingTodos.map((todo) => (
                        <div key={todo.id} className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                          <h4 className="font-medium text-gray-900 text-sm">{todo.title}</h4>
                          {todo.description && (
                            <p className="text-xs text-gray-600 mt-1">{todo.description}</p>
                          )}
                          <p className="text-xs text-orange-600 mt-2">
                            Due {formatDistanceToNow(todo.scheduledAt, { addSuffix: true })}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Completed Todos */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                    <CheckCircleIcon className="h-4 w-4 mr-2 text-green-500" />
                    Recently Completed
                  </h3>
                  {completedTodos.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">No completed todos</p>
                  ) : (
                    <div className="space-y-3">
                      {completedTodos.slice(0, 5).map((todo) => (
                        <div key={todo.id} className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <h4 className="font-medium text-gray-900 text-sm line-through">
                            {todo.title}
                          </h4>
                          {todo.description && (
                            <p className="text-xs text-gray-600 mt-1 line-through">
                              {todo.description}
                            </p>
                          )}
                          <p className="text-xs text-green-600 mt-2">
                            Completed {todo.completedAt && formatDistanceToNow(todo.completedAt, { addSuffix: true })}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}