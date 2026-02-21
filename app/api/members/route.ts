// app/api/members/route.ts
import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'

export async function GET() {
  try {
    const [rows]: any = await pool.query(
      `SELECT user_id, first_name, second_name, profile_photo AS image,
              aspiration AS inspiration, field
       FROM users
       WHERE role = 'member'
       ORDER BY created_at DESC
       LIMIT 12`
    )

    return NextResponse.json(rows)
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: 'Failed to load members' },
      { status: 500 }
    )
  }
}
