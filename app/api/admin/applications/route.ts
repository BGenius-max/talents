// app/api/admin/applications/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { verifyToken } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth_token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const user = verifyToken(token)

    if (!user || !['admin', 'staff'].includes(user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized – admin or staff access required' },
        { status: 403 }
      )
    }

    const applications = await query(`
      SELECT 
        id,
        full_name,
        email,
        phone,
        photo,
        region,
        application_type,
        details,
        created_at
      FROM applications
      ORDER BY created_at DESC
    `)

    return NextResponse.json(applications)
  } catch (err) {
    console.error('GET /api/admin/applications error:', err)
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 })
  }
}