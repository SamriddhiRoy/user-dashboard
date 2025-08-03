'use client'

import DashboardLayout from '../../../components/DashboardLayout'
import { useAuth } from '../../../hooks/useAuth'
import { useState, useEffect } from 'react'
import { UsersIcon, ShieldCheckIcon, UserIcon, ToggleLeftIcon, ToggleRightIcon } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface User {
  id: string
  email: string
  name: string | null
  role: string
  emailVerified: boolean
  createdAt: Date
  updatedAt: Date
}

export default function UsersPage() {
  const { user: currentUser, isSuperuser } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null)

  useEffect(() => {
    if (isSuperuser) {
      fetchUsers()
    }
  }, [isSuperuser])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data.map((user: any) => ({
          ...user,
          createdAt: new Date(user.createdAt),
          updatedAt: new Date(user.updatedAt),
        })))
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleUserRole = async (userId: string, currentRole: string) => {
    if (userId === currentUser?.id) {
      alert('You cannot change your own role')
      return
    }

    setUpdatingUserId(userId)
    try {
      const newRole = currentRole === 'superuser' ? 'normal' : 'superuser'
      const response = await fetch(`/api/users/${userId}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      })

      if (response.ok) {
        // Update the user in the local state
        setUsers(users.map(user => 
          user.id === userId ? { ...user, role: newRole } : user
        ))
      } else {
        const errorData = await response.json()
        alert(errorData.error || 'Failed to update user role')
      }
    } catch (error) {
      console.error('Error updating user role:', error)
      alert('Failed to update user role')
    } finally {
      setUpdatingUserId(null)
    }
  }

  if (!isSuperuser) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <ShieldCheckIcon className="mx-auto h-12 w-12 text-red-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Access Denied</h3>
          <p className="mt-1 text-sm text-gray-500">
            You need superuser permissions to access this page.
          </p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage users and their permissions</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <UsersIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? '...' : users.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <ShieldCheckIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Superusers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? '...' : users.filter(u => u.role === 'superuser').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <UserIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Normal Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? '...' : users.filter(u => u.role === 'normal').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Users List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">All Users</h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {users.map((user) => (
                <div key={user.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-sm font-semibold text-gray-700">
                          {user.name?.charAt(0) || user.email.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">
                          {user.name || 'Unnamed User'}
                        </h3>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        <p className="text-xs text-gray-400">
                          Joined {formatDistanceToNow(user.createdAt, { addSuffix: true })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      {/* Role Badge */}
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === 'superuser' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role === 'superuser' ? 'Superuser' : 'Normal User'}
                      </span>

                      {/* Role Toggle */}
                      {user.id !== currentUser?.id && (
                        <button
                          onClick={() => toggleUserRole(user.id, user.role)}
                          disabled={updatingUserId === user.id}
                          className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50"
                          title={`Make ${user.role === 'superuser' ? 'normal user' : 'superuser'}`}
                        >
                          {updatingUserId === user.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                          ) : user.role === 'superuser' ? (
                            <ToggleRightIcon className="h-5 w-5 text-purple-600" />
                          ) : (
                            <ToggleLeftIcon className="h-5 w-5 text-gray-400" />
                          )}
                          <span>Toggle Role</span>
                        </button>
                      )}

                      {user.id === currentUser?.id && (
                        <span className="text-sm text-gray-500 italic">(You)</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}