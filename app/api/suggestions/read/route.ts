import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'

async function getUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value
  if (!token) return null
  return verifyToken(token)
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const id = Number(body.id)

    if (!id || isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
    }

    const [rows] = await pool.query(
      'SELECT user_id, is_read FROM suggestions WHERE id = ?',
      [id]
    ) as any[]

    if (!rows || rows.length === 0) {
      return NextResponse.json(
        { error: 'Suggestion not found' },
        { status: 404 }
      )
    }

    const suggestion = rows[0]

    // Prevent marking your own message
    if (Number(suggestion.user_id) === Number(user.user_id)) {
      return NextResponse.json(
        { error: 'Cannot mark your own message as read' },
        { status: 403 }
      )
    }

    // If already read, do nothing
    if (suggestion.is_read === 1) {
      return NextResponse.json({ success: true })
    }

    await pool.query(
      'UPDATE suggestions SET is_read = 1 WHERE id = ?',
      [id]
    )

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Mark-read error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
