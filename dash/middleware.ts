import { NextResponse } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

export async function middleware(req) {
  try {
    const res = NextResponse.next()
    const supabase = createMiddlewareClient({ req, res })
    const { pathname } = req.nextUrl

    // Refresh session if expired - required for Server Components
    const { data: { session }, error } = await supabase.auth.getSession()

    // Log authentication status for debugging
    console.log(`Middleware: ${pathname}, Session: ${session ? 'exists' : 'none'}`)

    // Protected routes that require authentication
    const protectedRoutes = ['/dashboard']
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

    if (isProtectedRoute) {
      if (error) {
        console.error('Middleware auth error:', error)
        return NextResponse.redirect(new URL('/auth/login', req.url))
      }

      if (!session) {
        console.log('No session found, redirecting to login')
        return NextResponse.redirect(new URL('/auth/login', req.url))
      }

      // Optionally check if user is verified
      if (!session.user.email_confirmed_at && pathname !== '/auth/verify') {
        console.log('Email not verified, but allowing access for now')
        // Uncomment the line below if you want to enforce email verification
        // return NextResponse.redirect(new URL('/auth/verify', req.url))
      }
    }

    // Redirect authenticated users away from auth pages
    const authRoutes = ['/auth/login', '/auth/register']
    const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))

    if (isAuthRoute && session) {
      console.log('Authenticated user accessing auth page, redirecting to dashboard')
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // Allow access to home page and other public routes
    return res
  } catch (error) {
    console.error('Middleware error:', error)
    // In case of any error, redirect to login for protected routes
    const protectedRoutes = ['/dashboard']
    const isProtectedRoute = protectedRoutes.some(route => req.nextUrl.pathname.startsWith(route))
    
    if (isProtectedRoute) {
      return NextResponse.redirect(new URL('/auth/login', req.url))
    }
    
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}
