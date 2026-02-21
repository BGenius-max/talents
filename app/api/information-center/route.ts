// app/api/information-center/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET() {
  try {
const items = await query(`
  SELECT 
    id, 
    category, 
    name, 
    summary, 
    image, 
    slug, 
    created_at
  FROM information_center
  WHERE is_published = 1   -- changed to 1 (tinyint)
  ORDER BY created_at DESC
  LIMIT 50
`);
    
    return NextResponse.json(items);
  } catch (err: any) {
    console.error('GET information-center error:', err.message || err);
    return NextResponse.json(
      { error: 'Failed to fetch information items' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // 1. Read token from cookie (await is required!)
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required - please log in' },
        { status: 401 }
      );
    }

    // 2. Verify the token using your lib/auth function
    const user = verifyToken(token);

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    if (!['admin', 'staff'].includes(user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized - only staff or admin can create entries' },
        { status: 403 }
      );
    }

    // 3. Parse request body
    const body = await req.json();

    const {
      category,
      name,
      content,
      summary = null,
      location = null,
      date_start = null,
      date_end = null,
      contact_person = null,
      contact_email = null,
      contact_phone = null,
      address = null,
      image = null,
      attachment = null,
      is_published = true,
    } = body;

    // Basic validation
    if (!category || !name || !content) {
      return NextResponse.json(
        { error: 'Category, name and content are required' },
        { status: 400 }
      );
    }

    // 4. Generate unique slug
    let slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    let counter = 1;
    while (true) {
      const existing = await query(
        'SELECT 1 FROM information_center WHERE slug = ? LIMIT 1',
        [slug]
      ) as any[];

      if (existing.length === 0) break;
      slug = `${slug}-${counter}`;
      counter++;
    }

    // 5. Insert into database
    const result = await query(
      `INSERT INTO information_center (
        category, name, content, summary, location, date_start, date_end,
        contact_person, contact_email, contact_phone, address,
        image, attachment, is_published, created_by, slug
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        category,
        name,
        content,
        summary,
        location,
        date_start,
        date_end,
        contact_person,
        contact_email,
        contact_phone,
        address,
        image,
        attachment,
        is_published ? 1 : 0,
        user.user_id,
        slug,
      ]
    );

    const insertId = (result as any).insertId;

    return NextResponse.json(
      {
        success: true,
        message: 'Entry created successfully',
        id: insertId,
        slug,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error('POST information-center error:', err.message || err);
    return NextResponse.json(
      { error: 'Server error while creating entry' },
      { status: 500 }
    );
  }
}