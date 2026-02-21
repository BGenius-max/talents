import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { signToken } from '@/lib/auth'
import { cookies } from 'next/headers'
import { query } from '@/lib/db'

export async function POST(req: NextRequest) {
  console.log('LOGIN ROUTE HIT —', new Date().toISOString())

  try {
    const body = await req.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      )
    }

    console.log('Login attempt for email:', email.trim())

    // 1. FETCH USER - Now including first_name and photo
    const users = await query(
      'SELECT user_id, email, password_hash, role, first_name, photo FROM users WHERE email = ? LIMIT 1',
      [email.trim()]
    )

    if (!Array.isArray(users) || users.length === 0) {
      console.log('→ No user found')
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      )
    }

    const user = users[0]

    // 2. VERIFY PASSWORD
    const passwordMatch = await bcrypt.compare(password, user.password_hash)

    if (!passwordMatch) {
      console.log('→ Password mismatch')
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // 3. GENERATE JWT - Adding name and photo to the payload
    const token = signToken({
      user_id: user.user_id,
      email: user.email,
      role: user.role,
      first_name: user.first_name,
      photo: user.photo, 
    })

    // 4. SET SECURE COOKIE
    const cookieStore = await cookies()
    cookieStore.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    console.log('→ LOGIN SUCCESS — Data transmitted to client')

    // 5. FINAL RESPONSE - Returning the photo filename to the frontend
    return NextResponse.json(
      {
        success: true,
        message: 'Logged in successfully',
        user: {
          id: user.user_id,
          email: user.email,
          role: user.role,
          first_name: user.first_name,
          photo: user.photo, // This is the filename (e.g., image_88b0a2.png)
        },
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('LOGIN ROUTE ERROR:', error.message || error)
    return NextResponse.json(
      { success: false, message: 'Server error during login' },
      { status: 500 }
    )
  }
}