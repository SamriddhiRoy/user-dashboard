'use client'

import DashboardLayout from '../../../components/DashboardLayout'
import { useAuth } from '../../../hooks/useAuth'
import { useState } from 'react'
import { UserIcon, EditIcon, SaveIcon, XIcon, CameraIcon } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export default function ProfilePage() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleEdit = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
    })
    setIsEditing(true)
    setErrors({})
  }

  const handleCancel = () => {
    setIsEditing(false)
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
    })
    setErrors({})
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) {
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
        }),
      })

      if (response.ok) {
        setIsEditing(false)
        // The user data will be refreshed by the auth hook
        window.location.reload() // Simple refresh to get updated user data
      } else {
        const errorData = await response.json()
        setErrors({ general: errorData.error || 'Failed to update profile' })
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      setErrors({ general: 'Failed to update profile' })
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600">Manage your account information</p>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Account Information</h2>
              {!isEditing && (
                <button
                  onClick={handleEdit}
                  className="flex items-center space-x-2 text-sm text-green-600 hover:text-green-700 transition-colors"
                >
                  <EditIcon className="h-4 w-4" />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>
          </div>

          <div className="p-6 space-y-6">
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-600">{errors.general}</p>
              </div>
            )}

            {/* Avatar Section */}
            <div className="flex items-center space-x-6">
              <div className="h-20 w-20 rounded-full bg-green-600 flex items-center justify-center">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt="Profile"
                    className="h-20 w-20 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-semibold text-white">
                    {user.name?.charAt(0) || user.email.charAt(0)}
                  </span>
                )}
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {user.name || 'Unnamed User'}
                </h3>
                <p className="text-sm text-gray-500">{user.email}</p>
                <button className="mt-2 text-sm text-gray-600 hover:text-gray-700 flex items-center space-x-1">
                  <CameraIcon className="h-4 w-4" />
                  <span>Change Avatar</span>
                </button>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      errors.name ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter your full name"
                  />
                ) : (
                  <p className="text-sm text-gray-900 py-2">{user.name || 'Not set'}</p>
                )}
                {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      errors.email ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter your email address"
                  />
                ) : (
                  <p className="text-sm text-gray-900 py-2">{user.email}</p>
                )}
                {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Role
                </label>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  user.role === 'superuser' 
                    ? 'bg-purple-100 text-purple-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {user.role === 'superuser' ? 'Superuser' : 'Normal User'}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Verified
                </label>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  user.emailVerified
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {user.emailVerified ? 'Verified' : 'Not Verified'}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Member Since
                </label>
                <p className="text-sm text-gray-900 py-2">
                  {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex justify-end space-x-3 pt-6 border-t">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  <XIcon className="h-4 w-4 inline mr-1" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <SaveIcon className="h-4 w-4 inline mr-1" />
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}