import { NextResponse } from 'next/server'
import supabase from './lib/supabaseClient'

export function middleware(req) {
  const { pathname } = req.nextUrl

  // Only protect dashboard route
  if (pathname.startsWith('/dashboard')) {
    const token = req.cookies.get('sb-access-token')?.value

    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }

  return NextResponse.next()
}
