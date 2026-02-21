// app/api/admin/applications/[id]/route.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }  // ← Promise type + better name
) {
  const params = await context.params;          // ← await it!
  const id = parseInt(params.id);               // ← use params.id

  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  const cookieStore = await cookies();  // note: cookies() is also Promise-based in Next 15+
  const role = cookieStore.get('role')?.value;

  if (role !== 'admin' && role !== 'staff') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const { status } = await req.json();
    const validStatuses = ['pending', 'approved', 'rejected'];

    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    await pool.query(
      `UPDATE applications SET status = ? WHERE id = ?`,
      [status, id]
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err); // ← good to log for debugging
    return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
  }
}