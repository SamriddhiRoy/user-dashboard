import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import LogoutButton from '../../components/LogoutButton'

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <LogoutButton />
        </div>
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600">Welcome back, {session.user.email}!</p>
            <p className="text-sm text-gray-500 mt-2">
              Last Login Time: {session.user.last_sign_in_at ? new Date(session.user.last_sign_in_at).toLocaleString() : 'First login'}
            </p>
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <p className="text-green-800">✅ Authentication is working correctly!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
