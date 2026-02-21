import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'
import { verifyToken } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

/* Required for file system operations */
export const runtime = 'nodejs'

/* =========================================================
   GET — Public: Fetch all news & events
========================================================= */
export async function GET() {
  try {
    const [rows] = await pool.query(`
      SELECT 
        n.event_id,
        n.title,
        n.description,
        n.type,
        n.image,
        n.video_url,
        n.event_date,
        n.created_at,
        u.first_name,
        u.second_name,
        u.role
      FROM news_events n
      LEFT JOIN users u ON n.created_by = u.user_id
      ORDER BY n.created_at DESC
    `)

    return NextResponse.json(rows)

  } catch (error) {
    console.error('GET /api/news-events error:', error)

    return NextResponse.json(
      { success: false, error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}

/* =========================================================
   POST — Admin/Staff Only
========================================================= */
export async function POST(req: NextRequest) {
  try {
    /* =============================
       1️⃣  Get auth token
    ============================== */
    const token = req.cookies.get('auth_token')?.value

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    /* =============================
       2️⃣  Verify token
    ============================== */
    const user = await verifyToken(token)

    if (!user || !['admin', 'staff'].includes(user.role)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized access' },
        { status: 403 }
      )
    }

    /* =============================
       3️⃣  Parse form data
    ============================== */
    const formData = await req.formData()

    const title = formData.get('title')?.toString().trim()
    const description = formData.get('description')?.toString().trim()
    const type = formData.get('type')?.toString()
    const event_date = formData.get('event_date')?.toString() || null
    const video_url = formData.get('video_url')?.toString() || null
    const imageFile = formData.get('image') as File | null

    if (!title || !description || !type) {
      return NextResponse.json(
        { success: false, error: 'Title, description and type are required' },
        { status: 400 }
      )
    }

    /* =============================
       4️⃣  Handle image upload
    ============================== */
    let imageName: string | null = null

    if (imageFile && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer()
      const buffer = Buffer.from(bytes)

      imageName = `${Date.now()}-${imageFile.name.replace(/\s+/g, '-')}`

      const uploadDir = path.join(process.cwd(), 'public/news')

      // Ensure folder exists
      await mkdir(uploadDir, { recursive: true })

      const uploadPath = path.join(uploadDir, imageName)

      await writeFile(uploadPath, buffer)
    }

    /* =============================
       5️⃣  Insert into database
    ============================== */
    await pool.query(
      `INSERT INTO news_events
       (title, description, type, image, video_url, event_date, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        description,
        type,
        imageName,
        video_url,
        event_date,
        user.user_id,
      ]
    )

    return NextResponse.json(
      { success: true, message: 'Post created successfully' },
      { status: 201 }
    )

  } catch (error) {
    console.error('POST /api/news-events error:', error)

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
