import AuthForm from '../../../components/AuthForm'
import { Suspense } from 'react'

function RegisterContent() {
  return <AuthForm isLogin={false} />
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

export default function RegisterPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <RegisterContent />
    </Suspense>
  )
}

export const metadata = {
  title: 'Sign Up - GGTodo',
  description: 'Create your GGTodo account to start managing your tasks and projects.',
}
