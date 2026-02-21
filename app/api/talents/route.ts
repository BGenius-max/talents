// app/api/talents/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-very-secret-key-change-this'

// GET: Fetch all talents for the Management Dashboard
export async function GET() {
  try {
    const [rows]: any = await pool.query(`
      SELECT 
        talents_id AS id, 
        full_name, 
        email, 
        category, 
        description, 
        county, 
        status 
      FROM talents 
      ORDER BY talents_id DESC
    `)
    return NextResponse.json(rows)
  } catch (err) {
    console.error('Fetch error:', err)
    return NextResponse.json({ error: 'Failed to fetch talents' }, { status: 500 })
  }
}

// POST: Register a new talent
export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    const decoded: any = jwt.verify(token, JWT_SECRET)
    const userId = decoded.user_id 

    const formData = await req.formData()
    const email = formData.get('email') as string

    // 1. VERIFY MEMBERSHIP: Check if email exists in 'users' table
    const [userCheck]: any = await pool.query('SELECT email FROM users WHERE email = ?', [email])
    if (!userCheck || userCheck.length === 0) {
      return NextResponse.json({ 
        success: false, 
        message: 'Membership required. Please register as a member first.' 
      }, { status: 403 })
    }

    // 2. PREVENT DUPLICATES: Check if email is already in 'talents'
    const [talentCheck]: any = await pool.query('SELECT email FROM talents WHERE email = ?', [email])
    if (talentCheck && talentCheck.length > 0) {
      return NextResponse.json({ 
        success: false, 
        message: 'This email is already registered as a talent.' 
      }, { status: 409 })
    }

    // 3. INSERT NEW TALENT (Defaulting to 'pending')
    const values = [
      userId,
      formData.get('full_name'),
      email,
      formData.get('category'),
      formData.get('description'),
      formData.get('region'), // Map frontend 'region' to DB 'county'
      'pending'
    ]

    await pool.query(
      `INSERT INTO talents (user_id, full_name, email, category, description, county, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, formData.get('full_name'), email, formData.get('category'), formData.get('description'), formData.get('region'), 'pending']
    )

    return NextResponse.json({ success: true, message: 'Talent registered successfully!' })
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 })
  }
}