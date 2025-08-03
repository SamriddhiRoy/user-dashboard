'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

import { FcGoogle } from 'react-icons/fc'

export default function AuthForm({ isLogin }) {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      let data, authError
      if (isLogin) {
        ({ data, error: authError } = await supabase.auth.signInWithPassword({ 
          email, 
          password 
        }))
      } else {
        ({ data, error: authError } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            emailRedirectTo: `${location.origin}/auth/callback`
          }
        }))
      }

      if (authError) {
        setError(authError.message)
      } else if (isLogin && data.session) {
        router.push('/dashboard')
        router.refresh()
      } else if (!isLogin) {
        setError('Please check your email for a verification link.')
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setError(null)
    setLoading(true)
    
    try {
      const { error: googleError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${location.origin}/auth/callback`
        }
      })
      if (googleError) {
        setError(googleError.message)
      }
    } catch (err) {
      setError('Failed to sign in with Google. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-center mb-2">Welcome to GGTodo</h1>
      <p className="text-center text-gray-500 mb-6">
        To get started, please {isLogin ? 'sign in' : 'sign up'}
      </p>

      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 border px-4 py-2 rounded hover:bg-gray-100 transition mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FcGoogle className="text-xl" />
        <span>{loading ? 'Signing in...' : 'Log In with Google'}</span>
      </button>

      <div className="flex items-center my-4">
        <hr className="flex-grow border-t" />
        <span className="mx-2 text-sm text-gray-400">Or</span>
        <hr className="flex-grow border-t" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex items-center justify-between text-sm mt-2">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="accent-green-600" />
            Remember me
          </label>
          <a href="#" className="text-green-600 hover:underline">
            Forgot Password
          </a>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Loading...' : (isLogin ? 'Login' : 'Sign Up')}
        </button>
      </form>

      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <a 
            href={isLogin ? '/auth/register' : '/auth/login'} 
            className="text-green-600 hover:underline"
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </a>
        </p>
      </div>
    </div>
  )
}