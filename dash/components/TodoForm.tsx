'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'

interface Todo {
  id: string
  title: string
  description?: string
  scheduledAt: Date
  completed: boolean
}

interface TodoFormProps {
  todo?: Todo | null
  onSuccess: () => void
  onCancel: () => void
}

export default function TodoForm({ todo, onSuccess, onCancel }: TodoFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    scheduledAt: '',
    scheduledTime: '',
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (todo) {
      const scheduledDate = new Date(todo.scheduledAt)
      setFormData({
        title: todo.title,
        description: todo.description || '',
        scheduledAt: format(scheduledDate, 'yyyy-MM-dd'),
        scheduledTime: format(scheduledDate, 'HH:mm'),
      })
    }
  }, [todo])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }

    if (!formData.scheduledAt) {
      newErrors.scheduledAt = 'Date is required'
    }

    if (!formData.scheduledTime) {
      newErrors.scheduledTime = 'Time is required'
    }

    if (formData.scheduledAt && formData.scheduledTime) {
      const scheduledDateTime = new Date(`${formData.scheduledAt}T${formData.scheduledTime}`)
      const now = new Date()
      
      if (scheduledDateTime <= now) {
        newErrors.scheduledAt = 'Todo must be scheduled for a future date and time'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const scheduledDateTime = new Date(`${formData.scheduledAt}T${formData.scheduledTime}`)

      const response = await fetch(todo ? `/api/todos/${todo.id}` : '/api/todos', {
        method: todo ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          description: formData.description.trim() || null,
          scheduledAt: scheduledDateTime.toISOString(),
        }),
      })

      if (response.ok) {
        onSuccess()
      } else {
        const errorData = await response.json()
        setErrors({ general: errorData.error || 'Failed to save todo' })
      }
    } catch (error) {
      console.error('Error saving todo:', error)
      setErrors({ general: 'Failed to save todo' })
    } finally {
      setLoading(false)
    }
  }

  const getTodayDate = () => {
    return format(new Date(), 'yyyy-MM-dd')
  }

  const getCurrentTime = () => {
    return format(new Date(), 'HH:mm')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.general && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-sm text-red-600">{errors.general}</p>
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
            errors.title ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="Enter todo title"
        />
        {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title}</p>}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="Enter todo description (optional)"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="scheduledAt" className="block text-sm font-medium text-gray-700 mb-1">
            Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="scheduledAt"
            value={formData.scheduledAt}
            onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
            min={getTodayDate()}
            className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
              errors.scheduledAt ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.scheduledAt && <p className="text-sm text-red-600 mt-1">{errors.scheduledAt}</p>}
        </div>

        <div>
          <label htmlFor="scheduledTime" className="block text-sm font-medium text-gray-700 mb-1">
            Time <span className="text-red-500">*</span>
          </label>
          <input
            type="time"
            id="scheduledTime"
            value={formData.scheduledTime}
            onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
            className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
              errors.scheduledTime ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {errors.scheduledTime && <p className="text-sm text-red-600 mt-1">{errors.scheduledTime}</p>}
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : todo ? 'Update Todo' : 'Create Todo'}
        </button>
      </div>
    </form>
  )
}