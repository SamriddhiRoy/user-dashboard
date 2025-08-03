import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request) {
  try {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const error = requestUrl.searchParams.get('error')
    const errorDescription = requestUrl.searchParams.get('error_description')

    // Handle authentication errors
    if (error) {
      console.error('Auth callback error:', error, errorDescription)
      const errorMessage = encodeURIComponent(errorDescription || error)
      return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=${errorMessage}`)
    }

    // Handle successful authentication
    if (code) {
      const supabase = createRouteHandlerClient({ cookies })
      
      // Exchange the code for a session
      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
      
      if (exchangeError) {
        console.error('Error exchanging code for session:', exchangeError)
        const errorMessage = encodeURIComponent('Failed to complete authentication')
        return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=${errorMessage}`)
      }

      if (data.session) {
        console.log('Successfully authenticated user:', data.user?.email)
        
        // Check if this is a new user (first time signing up)
        const isNewUser = data.user?.created_at === data.user?.last_sign_in_at
        
        // Redirect to dashboard with success message
        const successMessage = isNewUser 
          ? 'Account created successfully!' 
          : 'Successfully signed in!'
        
        return NextResponse.redirect(
          `${requestUrl.origin}/dashboard?message=${encodeURIComponent(successMessage)}`
        )
      }
    }

    // If no code or error, redirect to login
    console.log('No code or error in callback, redirecting to login')
    return NextResponse.redirect(`${requestUrl.origin}/auth/login`)
    
  } catch (error) {
    console.error('Unexpected error in auth callback:', error)
    const errorMessage = encodeURIComponent('An unexpected error occurred during authentication')
    return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=${errorMessage}`)
  }
}