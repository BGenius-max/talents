import { pool } from '@/lib/db'

export async function POST(req: Request) {
  const body = await req.json()

  await pool.query(
    `INSERT INTO messages (name, email, subject, message)
     VALUES (?, ?, ?, ?)`,
    [body.name, body.email, body.subject, body.message]
  )

  return Response.json({ success: true })
}
