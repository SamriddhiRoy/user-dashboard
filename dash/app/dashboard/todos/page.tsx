'use client'

import DashboardLayout from '../../../components/DashboardLayout'
import TodoList from '../../../components/TodoList'
import TodoForm from '../../../components/TodoForm'
import { useState, useEffect } from 'react'
import { PlusIcon } from 'lucide-react'

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

export default function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)

  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    try {
      const response = await fetch('/api/todos')
      if (response.ok) {
        const data = await response.json()
        setTodos(data.map((todo: any) => ({
          ...todo,
          scheduledAt: new Date(todo.scheduledAt),
          completedAt: todo.completedAt ? new Date(todo.completedAt) : undefined,
          createdAt: new Date(todo.createdAt),
          updatedAt: new Date(todo.updatedAt),
        })))
      }
    } catch (error) {
      console.error('Error fetching todos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleTodoCreated = () => {
    setShowForm(false)
    fetchTodos()
  }

  const handleTodoUpdated = () => {
    setEditingTodo(null)
    setShowForm(false)
    fetchTodos()
  }

  const handleTodoDeleted = () => {
    fetchTodos()
  }

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo)
    setShowForm(true)
  }

  const handleToggleComplete = async (todoId: string, completed: boolean) => {
    try {
      const response = await fetch(`/api/todos/${todoId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed }),
      })

      if (response.ok) {
        fetchTodos()
      }
    } catch (error) {
      console.error('Error updating todo:', error)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Todos</h1>
            <p className="text-gray-600">Manage your tasks and stay organized</p>
          </div>
          <button
            onClick={() => {
              setEditingTodo(null)
              setShowForm(true)
            }}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <PlusIcon className="h-5 w-5" />
            <span>New Todo</span>
          </button>
        </div>

        {/* Todo Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-screen overflow-y-auto">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  {editingTodo ? 'Edit Todo' : 'Create New Todo'}
                </h2>
                <TodoForm
                  todo={editingTodo}
                  onSuccess={editingTodo ? handleTodoUpdated : handleTodoCreated}
                  onCancel={() => {
                    setShowForm(false)
                    setEditingTodo(null)
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Todo List */}
        <div className="bg-white rounded-lg shadow">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
          ) : (
            <TodoList
              todos={todos}
              onEdit={handleEdit}
              onDelete={handleTodoDeleted}
              onToggleComplete={handleToggleComplete}
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}