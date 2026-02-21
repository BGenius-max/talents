// app/api/talents/register/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()

    const full_name = formData.get('full_name') as string
    const email = formData.get('email') as string
    const category = formData.get('category') as string
    const description = formData.get('description') as string
    const county = formData.get('region') as string

    if (!full_name || !email || !category || !description || !county) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // ✅ Check membership email exists
    const [users]: any = await pool.query(
      'SELECT email FROM users WHERE email = ? LIMIT 1',
      [email]
    )

    if (users.length === 0) {
      return NextResponse.json(
        { message: 'Email not registered as a member' },
        { status: 403 }
      )
    }

    // ✅ Prevent duplicates
    const [existing]: any = await pool.query(
      'SELECT email FROM talents WHERE email = ? LIMIT 1',
      [email]
    )

    if (existing.length > 0) {
      return NextResponse.json(
        { message: 'Talent already registered with this email' },
        { status: 409 }
      )
    }

    // ✅ Insert talent
    await pool.query(
      `INSERT INTO talents 
      (full_name, email, category, description, county, status)
      VALUES (?, ?, ?, ?, ?, 'pending')`,
      [full_name, email, category, description, county]
    )

    return NextResponse.json({
      message: 'Talent registration submitted successfully!',
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    )
  }
}
