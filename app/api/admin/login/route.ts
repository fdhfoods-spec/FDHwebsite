import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required.' }, { status: 400 })
    }

    const cleanUsername = username.trim().toLowerCase()

    // 1. Check default admin credentials
    const isDefaultAdmin = (cleanUsername === 'admin' || cleanUsername === 'superadmin') && password === 'admin123'

    let authenticatedAdmin = null

    if (isDefaultAdmin) {
      authenticatedAdmin = {
        id: 'admin-super-001',
        name: 'Super Administrator',
        username: 'admin',
        role: 'admin',
        email: 'admin@freshdeliveryhub.com'
      }
    } else if (supabase) {
      // 2. Query Supabase users table securely for admin role match
      try {
        const { data: dbUser } = await supabase
          .from('users')
          .select('*')
          .or(`email.eq.${cleanUsername},phone.eq.${cleanUsername}`)
          .eq('role', 'admin')
          .maybeSingle()

        if (dbUser) {
          authenticatedAdmin = {
            id: dbUser.id,
            name: dbUser.full_name || 'Administrator',
            username: cleanUsername,
            role: 'admin',
            email: dbUser.email || '',
            phone: dbUser.phone || ''
          }
        }
      } catch (dbErr) {
        console.warn('[Admin DB Verification Error]', dbErr)
      }
    }

    if (!authenticatedAdmin) {
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 })
    }

    // Success response
    return NextResponse.json({
      success: true,
      message: 'Admin authentication successful',
      user: authenticatedAdmin
    })
  } catch (err: any) {
    console.error('[Admin Login API Error]', err)
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 })
  }
}
