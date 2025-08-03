'use client'

import DashboardLayout from '../../components/DashboardLayout'
import { useAuth } from '../../hooks/useAuth'
import { useState, useEffect } from 'react'
import { CheckSquareIcon, UsersIcon, ClockIcon, TrendingUpIcon } from 'lucide-react'

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalTodos: 0,
    completedTodos: 0,
    upcomingTodos: 0,
    totalUsers: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/dashboard/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.name || 'User'}!
          </h1>
          <p className="text-gray-600">Here's an overview of your todo progress.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CheckSquareIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Todos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? '...' : stats.totalTodos}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUpIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? '...' : stats.completedTodos}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <ClockIcon className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Upcoming</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? '...' : stats.upcomingTodos}
                </p>
              </div>
            </div>
          </div>

          {user?.role === 'superuser' && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <UsersIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {loading ? '...' : stats.totalUsers}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a
                href="/dashboard/todos"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:shadow-md transition-all"
              >
                <CheckSquareIcon className="h-8 w-8 text-green-600 mr-4" />
                <div>
                  <h3 className="font-medium text-gray-900">Manage Todos</h3>
                  <p className="text-sm text-gray-600">Create and manage your tasks</p>
                </div>
              </a>

              <a
                href="/dashboard/profile"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:shadow-md transition-all"
              >
                <UsersIcon className="h-8 w-8 text-green-600 mr-4" />
                <div>
                  <h3 className="font-medium text-gray-900">Update Profile</h3>
                  <p className="text-sm text-gray-600">Manage your account settings</p>
                </div>
              </a>

              {user?.role === 'superuser' && (
                <a
                  href="/dashboard/users"
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:shadow-md transition-all"
                >
                  <UsersIcon className="h-8 w-8 text-purple-600 mr-4" />
                  <div>
                    <h3 className="font-medium text-gray-900">User Management</h3>
                    <p className="text-sm text-gray-600">Manage users and permissions</p>
                  </div>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
