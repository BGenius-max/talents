import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'

export async function GET() {
  try {
    const [rows] = await pool.query(
      `SELECT id, subject, message, name, email, created_at
       FROM messages
       ORDER BY created_at ASC`
    )

    return NextResponse.json(rows)
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to load messages' },
      { status: 500 }
    )
  }
}
