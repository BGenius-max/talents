import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'
import { verifyToken } from '@/lib/auth'

/**
 * Security Helper: Validates the 'auth_token' cookie 
 * and ensures the user has 'admin' privileges.
 */
async function getAdminUser(req: NextRequest) {
  // Syncing with your News route cookie name: 'auth_token'
  const token = req.cookies.get('auth_token')?.value 
  
  if (!token) return null

  try {
    const user = await verifyToken(token)
    // Matches the 'role' enum in your database
    if (!user || user.role.toLowerCase() !== 'admin') return null
    
    return user
  } catch (err) {
    return null
  }
}

/* =========================================================
   GET — Admin Only: Fetch all system users
========================================================= */
export async function GET(req: NextRequest) {
  const admin = await getAdminUser(req)
  
  if (!admin) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized: Admin access required' }, 
      { status: 403 }
    )
  }

  try {
    // Selecting fields based on your table structure
    const [rows]: any = await pool.query(`
      SELECT 
        user_id, 
        first_name, 
        second_name, 
        email, 
        role, 
        phone, 
        photo, 
        gender,
        aspiration
      FROM users 
      ORDER BY created_at DESC
    `)

    // Returning the array directly so the frontend .map() works
    return NextResponse.json(rows)

  } catch (error) {
    console.error('GET /api/users error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users from database' }, 
      { status: 500 }
    )
  }
}

/* =========================================================
   PUT — Admin Only: Update User Details or Role
========================================================= */
export async function PUT(req: NextRequest) {
  const admin = await getAdminUser(req)
  
  if (!admin) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 })
  }

  try {
    const body = await req.json()
    const { user_id, first_name, second_name, role } = body

    if (!user_id || !first_name || !role) {
      return NextResponse.json({ success: false, error: 'Required fields missing' }, { status: 400 })
    }

    await pool.query(
      'UPDATE users SET first_name = ?, second_name = ?, role = ? WHERE user_id = ?',
      [first_name, second_name, role, user_id]
    )

    return NextResponse.json({ success: true, message: 'User updated successfully' })

  } catch (error) {
    console.error('PUT /api/users error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

/* =========================================================
   DELETE — Admin Only: Remove User from System
========================================================= */
export async function DELETE(req: NextRequest) {
  const admin = await getAdminUser(req)
  
  if (!admin) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 })
  }

  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ success: false, error: 'User ID is required' }, { status: 400 })
    }

    // Safety check: Prevent Admin from deleting themselves
    if (Number(id) === admin.user_id) {
      return NextResponse.json({ success: false, error: 'You cannot delete your own account' }, { status: 400 })
    }

    await pool.query('DELETE FROM users WHERE user_id = ?', [id])
    
    return NextResponse.json({ success: true, message: 'User deleted successfully' })

  } catch (error) {
    console.error('DELETE /api/users error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}