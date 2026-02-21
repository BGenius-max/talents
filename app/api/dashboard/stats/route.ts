// app/api/dashboard/stats/route.ts
import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'

export async function GET() {
  try {
    const [[members]]: any = await pool.query(
      `SELECT COUNT(*) AS count FROM users WHERE role='member'`
    )

    const [[messages]]: any = await pool.query(
      `SELECT COUNT(*) AS count FROM messages`
    )

    const [[applications]]: any = await pool.query(
      `SELECT COUNT(*) AS count FROM applications`
    )

    const [[talents]]: any = await pool.query(
      `SELECT COUNT(*) AS count FROM talents`
    )

    return NextResponse.json({
      members: members.count,
      messages: messages.count,
      applications: applications.count,
      talents: talents.count,
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: 'Failed to load dashboard stats' },
      { status: 500 }
    )
  }
}
