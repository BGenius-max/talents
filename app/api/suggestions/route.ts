// app/api/suggestions/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import { RowDataPacket } from 'mysql2'

interface SuggestionRow extends RowDataPacket {
  id: number
  message: string
  created_at: string
  user_id: number
  first_name: string
  second_name: string
  role: string
  is_read: number
}

/* ===============================
   GET ALL SUGGESTIONS
================================ */
export async function GET() {
  try {
    const [rows] = await pool.query<SuggestionRow[]>(`
      SELECT
        s.id,
        s.message,
        s.created_at,
        s.user_id,
        u.first_name,
        u.second_name,
        u.role,
        COALESCE(s.is_read, 0) AS is_read
      FROM suggestions s
      JOIN users u ON s.user_id = u.user_id
      ORDER BY s.created_at ASC
    `)

    return NextResponse.json(rows)
  } catch (err) {
    console.error('GET suggestions error:', err)
    return NextResponse.json(
      { error: 'Failed to load suggestions' },
      { status: 500 }
    )
  }
}

/* ===============================
   POST SUGGESTION
================================ */
export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth_token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = verifyToken(token)
    if (!user?.user_id) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { message } = await req.json()

    if (!message?.trim()) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    await pool.query(
      `INSERT INTO suggestions (user_id, message, is_read)
       VALUES (?, ?, 0)`,
      [user.user_id, message.trim()]
    )

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (err) {
    console.error('POST suggestions error:', err)
    return NextResponse.json(
      { error: 'Failed to post suggestion' },
      { status: 500 }
    )
  }
}
