import AuthForm from '../../../components/AuthForm'
import { Suspense } from 'react'

function LoginContent() {
  return <AuthForm isLogin={true} />
}

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <LoginContent />
    </Suspense>
  )
}

export const metadata = {
  title: 'Sign In - GGTodo',
  description: 'Sign in to your GGTodo account to manage your tasks and projects.',
}
