'use client'

import { useState } from 'react'
import supabase from '../lib/supabase'
import { useRouter } from 'next/navigation'

import { FcGoogle } from 'react-icons/fc'

export default function AuthForm({ isLogin }) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    let data, authError
    if (isLogin) {
      ({ data, error: authError } = await supabase.auth.signInWithPassword({ email, password }))
    } else {
      ({ data, error: authError } = await supabase.auth.signUp({ email, password }))
    }

    if (authError) {
      setError(authError.message)
    } else {
      router.push('/dashboard')
    }
  }

  const handleGoogleLogin = async () => {
    const { error: googleError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    })
    if (googleError) {
      setError(googleError.message)
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
        className="w-full flex items-center justify-center gap-2 border px-4 py-2 rounded hover:bg-gray-100 transition mb-4"
      >
        <FcGoogle className="text-xl" />
        <span>Log In with Google</span>
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
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded mt-4"
        >
          {isLogin ? 'Login' : 'Sign Up'}
        </button>
      </form>
    </div>
  )
}