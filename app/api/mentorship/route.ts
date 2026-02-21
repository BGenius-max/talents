import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'
import path from 'path'
import fs from 'fs/promises'
import type { RowDataPacket } from 'mysql2'

const UPLOAD_DIR = path.join(process.cwd(), 'public/uploads')

async function ensureUploadDir() {
  try {
    await fs.access(UPLOAD_DIR)
  } catch {
    await fs.mkdir(UPLOAD_DIR, { recursive: true })
  }
}

/* ============================
   Types
============================ */

interface MentorshipRow extends RowDataPacket {
  id: number
  full_name: string
  email: string
  phone: string | null
  field: string | null
  image: string | null
  created_at: string
}

interface UserRow extends RowDataPacket {
  email: string
}

/* ============================
   GET
============================ */

export async function GET() {
  try {
    const [rows] = await pool.query<MentorshipRow[]>(
      `SELECT id, full_name, email, phone, field, image, created_at
       FROM mentorship
       ORDER BY created_at DESC`
    )

    return NextResponse.json(rows)
  } catch (err) {
    console.error('[GET /api/mentorship]', err)
    return NextResponse.json(
      { error: 'Failed to load mentorship records' },
      { status: 500 }
    )
  }
}

/* ============================
   POST
============================ */

export async function POST(req: NextRequest) {
  try {
    await ensureUploadDir()

    const formData = await req.formData()

    const full_name = formData.get('full_name')?.toString().trim()
    const email = formData.get('email')?.toString().trim()
    const phone = formData.get('phone')?.toString().trim() || null
    const field = formData.get('field')?.toString().trim() || null
    const imageFile = formData.get('image') as File | null

    if (!full_name || !email) {
      return NextResponse.json(
        { error: 'Full name and email are required' },
        { status: 400 }
      )
    }

    /* --- Check membership --- */

    const [users] = await pool.query<UserRow[]>(
      'SELECT email FROM users WHERE email = ? LIMIT 1',
      [email]
    )

    if (users.length === 0) {
      return NextResponse.json(
        {
          error:
            'This email is not registered as a member. Please complete member registration first.',
        },
        { status: 403 }
      )
    }

    /* --- Prevent duplicates --- */

    const [existing] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM mentorship WHERE email = ? LIMIT 1',
      [email]
    )

    if (existing.length > 0) {
      return NextResponse.json(
        {
          error:
            'This email is already registered in the mentorship program.',
        },
        { status: 409 }
      )
    }

    /* --- Image upload --- */

    let imageFilename: string | null = null

    if (imageFile && imageFile.size > 0) {
      if (!imageFile.type.startsWith('image/')) {
        return NextResponse.json(
          { error: 'Only image files are allowed' },
          { status: 400 }
        )
      }

      if (imageFile.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { error: 'Image file size exceeds 5MB limit' },
          { status: 400 }
        )
      }

      const ext = path.extname(imageFile.name) || '.jpg'
      imageFilename = `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 10)}${ext}`

      const buffer = Buffer.from(await imageFile.arrayBuffer())

      await fs.writeFile(
        path.join(UPLOAD_DIR, imageFilename),
        buffer
      )
    }

    /* --- Insert --- */

    await pool.query(
      `INSERT INTO mentorship
       (full_name, email, phone, field, image, created_at)
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [full_name, email, phone, field, imageFilename]
    )

    return NextResponse.json(
      { success: true, message: 'Mentee added successfully' },
      { status: 201 }
    )
  } catch (err) {
    console.error('[POST /api/mentorship]', err)
    return NextResponse.json(
      { error: 'Server error - failed to add mentee' },
      { status: 500 }
    )
  }
}

/* ============================
   DELETE
============================ */

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json()

    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { error: 'Valid ID required' },
        { status: 400 }
      )
    }

    const [rows] = await pool.query<MentorshipRow[]>(
      'SELECT image FROM mentorship WHERE id = ?',
      [id]
    )

    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'Mentee record not found' },
        { status: 404 }
      )
    }

    const oldImage = rows[0].image

    await pool.query('DELETE FROM mentorship WHERE id = ?', [id])

    if (oldImage) {
      try {
        await fs.unlink(path.join(UPLOAD_DIR, oldImage))
      } catch (e) {
        console.warn('Failed to delete old image file:', e)
      }
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[DELETE /api/mentorship]', err)
    return NextResponse.json(
      { error: 'Failed to delete record' },
      { status: 500 }
    )
  }
}
