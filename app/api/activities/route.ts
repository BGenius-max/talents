import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'
import { verifyToken } from '@/lib/auth'
import fs from 'fs/promises'
import path from 'path'

export const runtime = 'nodejs'

/* =====================================================
   GET — PUBLIC: Fetch activities with media
===================================================== */
export async function GET() {
  try {
    const [rows] = await pool.query<any[]>(`
      SELECT 
        a.id, a.title, a.type, a.description, a.event_date, a.created_at,
        m.id AS media_id, m.media_type, m.file_name
      FROM activities a
      LEFT JOIN activity_media m ON a.id = m.activity_id
      ORDER BY a.created_at DESC
    `)

    const activitiesMap: Record<number, any> = {}

    for (const row of rows) {
      if (!activitiesMap[row.id]) {
        activitiesMap[row.id] = {
          ...row,
          media: []
        }
        delete activitiesMap[row.id].media_id
        delete activitiesMap[row.id].media_type
        delete activitiesMap[row.id].file_name
      }
      if (row.media_id) {
        activitiesMap[row.id].media.push({
          id: row.media_id,
          media_type: row.media_type,
          file_name: row.file_name,
        })
      }
    }

    return NextResponse.json(Object.values(activitiesMap))
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch activities' }, { status: 500 })
  }
}

/* =====================================================
   POST — PROTECTED: Cookie-based Auth (Admin/Staff)
===================================================== */
export async function POST(req: NextRequest) {
  const connection = await pool.getConnection()
  try {
    // 1. Get token from Cookies (Matching your News sample)
    const token = req.cookies.get('auth_token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const user = await verifyToken(token) as { user_id: number; role: string } | null

    if (!user || !['admin', 'staff'].includes(user.role)) {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 })
    }

    const formData = await req.formData()
    const title = formData.get('title') as string
    const type = formData.get('type') as string
    const description = formData.get('description') as string
    const event_date = formData.get('event_date') as string || null
    const mediaFiles = formData.getAll('media') as File[]

    await connection.beginTransaction()

    const [result]: any = await connection.query(
      `INSERT INTO activities (title, type, description, event_date, created_by) VALUES (?, ?, ?, ?, ?)`,
      [title, type, description, event_date, user.user_id]
    )

    const activityId = result.insertId
    const uploadDir = path.join(process.cwd(), 'public/uploads/activities')
    await fs.mkdir(uploadDir, { recursive: true })

    for (const file of mediaFiles) {
      if (!file || file.size === 0 || typeof file === 'string') continue

      const buffer = Buffer.from(await file.arrayBuffer())
      const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`
      await fs.writeFile(path.join(uploadDir, filename), buffer)

      const mediaType = file.type.startsWith('video') ? 'video' : file.type.startsWith('audio') ? 'audio' : 'image'

      await connection.query(
        `INSERT INTO activity_media (activity_id, media_type, file_name) VALUES (?, ?, ?)`,
        [activityId, mediaType, filename]
      )
    }

    await connection.commit()
    return NextResponse.json({ success: true, id: activityId }, { status: 201 })
  } catch (error) {
    await connection.rollback()
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  } finally {
    connection.release()
  }
}