// app/api/activities/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'
import fs from 'fs/promises'
import path from 'path'

// Use Promise<{ id: string }> for Next.js 15+
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }   // ← changed here
) {
  const params = await context.params;           // ← await it
  const { id } = params;

  const connection = await pool.getConnection()

  try {
    const formData = await req.formData()

    const title = formData.get('title') as string
    const type = formData.get('type') as string
    const description = formData.get('description') as string
    const event_date = formData.get('event_date') as string | null
    const mediaFiles = formData.getAll('media') as File[]

    await connection.query(
      `UPDATE activities 
       SET title=?, type=?, description=?, event_date=? 
       WHERE id=?`,
      [title, type, description, event_date || null, id]   // ← use id
    )

    // ... rest of your upload logic stays exactly the same ...
    // just replace params.id → id

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  } finally {
    connection.release()
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const { id } = params;

  const connection = await pool.getConnection()

  try {
    await connection.query(
      'DELETE FROM activity_media WHERE activity_id=?',
      [id]
    )

    await connection.query(
      'DELETE FROM activities WHERE id=?',
      [id]
    )

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  } finally {
    connection.release()
  }
}