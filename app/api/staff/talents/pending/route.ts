import { pool } from '@/lib/db'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'

export async function GET() {
  const token = cookies().get('token')?.value
  const user = verifyToken(token)

  if (!user || !['staff', 'admin'].includes(user.role)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const [rows]: any = await pool.query(
    `SELECT id, full_name, category, county, description, created_at
     FROM talents
     WHERE status = 'pending'
     ORDER BY created_at DESC`
  )

  return Response.json(rows)
}
