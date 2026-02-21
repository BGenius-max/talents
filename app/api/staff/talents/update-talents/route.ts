import { pool } from '@/lib/db'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'

export async function POST(req: Request) {
  const token = cookies().get('token')?.value
  const user = verifyToken(token)

  if (!user || !['staff', 'admin'].includes(user.role)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { talent_id, status } = await req.json()

  if (!['active', 'rejected'].includes(status)) {
    return Response.json({ error: 'Invalid status' }, { status: 400 })
  }

  await pool.query(
    `UPDATE talents SET status=?, verified_by=? WHERE id=?`,
    [status, user.user_id, talent_id]
  )

  return Response.json({ success: true })
}
