import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '../../../../lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      console.log('No user found in /api/auth/me')
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    console.log('User found in /api/auth/me:', user.email)
    return NextResponse.json(user)
  } catch (error) {
    console.error('Error in /api/auth/me:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}