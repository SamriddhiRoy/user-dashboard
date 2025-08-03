'use client'

import { useAuth } from '../hooks/useAuth'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  HomeIcon, 
  CheckSquareIcon, 
  BellIcon, 
  UsersIcon, 
  UserIcon, 
  LogOutIcon,
  MenuIcon,
  XIcon
} from 'lucide-react'
import NotificationDrawer from './NotificationDrawer'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, loading, signOut, isSuperuser } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notificationOpen, setNotificationOpen] = useState(false)
  const pathname = usePathname()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (!user) {
    return null // Middleware should handle redirect
  }

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'My Todos', href: '/dashboard/todos', icon: CheckSquareIcon },
    { name: 'Profile', href: '/dashboard/profile', icon: UserIcon },
  ]

  // Add superuser-only navigation items
  if (isSuperuser) {
    navigation.push(
      { name: 'User Management', href: '/dashboard/users', icon: UsersIcon }
    )
  }

  const isActive = (href: string) => {
    return pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <h1 className="text-xl font-bold text-green-600">GGTodo</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-md hover:bg-gray-100"
          >
            <XIcon className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive(item.href)
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="border-t p-4">
          <div className="flex items-center space-x-3 mb-4">
            <div className="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center">
              <span className="text-sm font-semibold text-white">
                {user.name?.charAt(0) || user.email.charAt(0)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.name || 'User'}
              </p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
              {isSuperuser && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                  Superuser
                </span>
              )}
            </div>
          </div>
          <button
            onClick={signOut}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <LogOutIcon className="mr-3 h-4 w-4" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-white shadow-sm border-b px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100"
            >
              <MenuIcon className="h-6 w-6" />
            </button>

            <div className="flex-1" />

            {/* Notification button */}
            <button
              onClick={() => setNotificationOpen(true)}
              className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <BellIcon className="h-6 w-6 text-gray-700" />
              {/* Notification badge - we'll add logic for this later */}
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </div>

        {/* Page content */}
        <main className="py-6 px-4 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>

      {/* Notification Drawer */}
      <NotificationDrawer 
        open={notificationOpen} 
        onClose={() => setNotificationOpen(false)} 
      />
    </div>
  )
}