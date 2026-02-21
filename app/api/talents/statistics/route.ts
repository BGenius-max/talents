// app/api/talents/statistics/route.ts
import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'

export async function GET() {
  try {
    const [total]: any = await pool.query(
      `SELECT COUNT(*) as total FROM talents WHERE status='active'`
    )

    const [byField]: any = await pool.query(
      `SELECT field, COUNT(*) as count
       FROM talents
       WHERE status='active'
       GROUP BY field`
    )

    return NextResponse.json({
      total: total[0].total,
      categories: byField.map((r: any) => ({
        category: r.field,
        count: r.count,
      })),
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: 'Failed to load talent statistics' },
      { status: 500 }
    )
  }
}
