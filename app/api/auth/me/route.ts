import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import { query } from '@/lib/db' // Changed to your query helper for consistency

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth_token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 1. Verify the token to get the user ID
    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // 2. Fetch fresh data from the DB 
    // FIX: Removed 'AS image' so the property name is 'photo'
    const rows: any = await query(
      `SELECT user_id, first_name, role, photo 
       FROM users 
       WHERE user_id = ? LIMIT 1`,
      [payload.user_id]
    )

    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const user = rows[0]

    // 3. Return the user object
    // This now contains first_name and photo (the filename)
    return NextResponse.json({
      id: user.user_id,
      first_name: user.first_name,
      role: user.role,
      photo: user.photo // e.g., "image_703b7d.png"
    })

  } catch (err) {
    console.error('AUTH ME ERROR:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}