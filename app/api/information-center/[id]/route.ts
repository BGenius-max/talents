import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const [item] = await query(
      `SELECT * FROM information_center WHERE id = ?`,
      [params.id]
    );

    if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    return NextResponse.json(item);
  } catch (err) {
    console.error('GET /api/information-center/[id] error:', err);
    return NextResponse.json({ error: 'Failed to fetch item' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

    const user = verifyToken(token);

    if (!user || !['admin', 'staff'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();

    const fields: string[] = [];
    const values: any[] = [];

    // Dynamically build update fields
    const addField = (key: string) => {
      if (body[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(body[key]);
      }
    };

    addField('category');
    addField('name');
    addField('content');
    addField('summary');
    addField('location');
    addField('date_start');
    addField('date_end');
    addField('contact_person');
    addField('contact_email');
    addField('contact_phone');
    addField('address');
    addField('image');
    addField('attachment');
    if (body.is_published !== undefined) {
      fields.push('is_published = ?');
      values.push(body.is_published ? 1 : 0);
    }

    if (fields.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    values.push(params.id);

    await query(
      `UPDATE information_center SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('PATCH /api/information-center/[id] error:', err);
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

    const user = verifyToken(token);

    if (!user || !['admin', 'staff'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await query('DELETE FROM information_center WHERE id = ?', [params.id]);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/information-center/[id] error:', err);
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
  }
}