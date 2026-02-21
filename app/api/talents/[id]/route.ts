// app/api/talents/refactor/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { verifyToken } from '@/lib/auth'
import { cookies } from 'next/headers'

/**
 * GET    /api/talents/refactor          → list all talents
 * GET    /api/talents/refactor?id=123   → get single talent
 * PATCH  /api/talents/refactor?id=123   → partial update
 * DELETE /api/talents/refactor?id=123   → delete talent
 */

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')

  try {
    if (id) {
      // Single talent
      const [talent] = await query(
        `SELECT 
           talents_id AS id,
           full_name,
           email,
           category,
           description,
           county,
           status
         FROM talents
         WHERE talents_id = ?`,
        [id]
      )

      if (!talent) {
        return NextResponse.json(
          { error: 'Talent not found' },
          { status: 404 }
        )
      }

      return NextResponse.json(talent)
    }

    // All talents
    const talents = await query(
      `SELECT 
         talents_id AS id,
         full_name,
         email,
         category,
         county,
         status
       FROM talents
       ORDER BY talents_id DESC`
    )

    return NextResponse.json(talents)
  } catch (err) {
    console.error('[GET /api/talents/refactor]', err)
    return NextResponse.json(
      { error: 'Failed to fetch talent data' },
      { status: 500 }
    )
  }
}

export async function PATCH(req: NextRequest) {
  try {
    // Auth check
    const cookieStore = await cookies()
    const token = cookieStore.get('auth_token')?.value
    if (!token) {
      return unauthorized('Authentication required')
    }

    const user = verifyToken(token)
    if (!user || !['admin', 'staff'].includes(user.role)) {
      return unauthorized('Admin or staff access required')
    }

    // Get ID from query string
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) {
      return badRequest('Missing required parameter: ?id=')
    }

    const body = await req.json()

    // Build dynamic SET clause
    const updates: string[] = []
    const values: any[] = []

    const allowedFields = ['full_name', 'email', 'category', 'description', 'county', 'status']

    for (const field of allowedFields) {
      if (field in body) {
        updates.push(`${field} = ?`)
        values.push(body[field])
      }
    }

    if (updates.length === 0) {
      return badRequest('No valid fields provided for update')
    }

    values.push(id)

    const sql = `UPDATE talents SET ${updates.join(', ')} WHERE talents_id = ?`

    await query(sql, values)

    return NextResponse.json({
      success: true,
      message: 'Talent updated successfully'
    })
  } catch (err) {
    console.error('[PATCH /api/talents/refactor]', err)
    return NextResponse.json(
      { error: 'Failed to update talent' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    // Auth check
    const cookieStore = await cookies()
    const token = cookieStore.get('auth_token')?.value
    if (!token) {
      return unauthorized('Authentication required')
    }

    const user = verifyToken(token)
    if (!user || !['admin', 'staff'].includes(user.role)) {
      return unauthorized('Admin or staff access required')
    }

    // Get ID
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) {
      return badRequest('Missing required parameter: ?id=')
    }

    await query('DELETE FROM talents WHERE talents_id = ?', [id])

    return NextResponse.json({
      success: true,
      message: 'Talent deleted successfully'
    })
  } catch (err) {
    console.error('[DELETE /api/talents/refactor]', err)
    return NextResponse.json(
      { error: 'Failed to delete talent' },
      { status: 500 }
    )
  }
}

// ────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────

function unauthorized(message: string) {
  return NextResponse.json({ error: message }, { status: 401 })
}

function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 })
}