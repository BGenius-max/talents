import { pool } from '@/lib/db'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'

export async function GET() {
  const user = verifyToken(cookies().get('token')?.value)

  if (!user || !['admin', 'staff'].includes(user.role))
    return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const [data]: any = await pool.query(
    `SELECT category, county, COUNT(*) as count
     FROM talents
     WHERE status='active'
     GROUP BY category, county`
  )

  return Response.json(data)
}
