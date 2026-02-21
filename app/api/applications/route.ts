import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import path from 'path';
import fs from 'fs/promises';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const full_name = formData.get('full_name') as string;
    const email = formData.get('email') as string || null;
    const phone = formData.get('phone') as string || null;
    const application_type = formData.get('apply_for') as string;
    const details = formData.get('description') as string || null;
    const photo = formData.get('photo') as File | null;

    if (!full_name || !application_type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Photo validation
    let photoPath: string | null = null;

    if (photo && photo.size > 0) {
      // Size check
      if (photo.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: 'Photo too large. Maximum size is 5MB' },
          { status: 400 }
        );
      }

      // Type check
      if (!ALLOWED_TYPES.includes(photo.type)) {
        return NextResponse.json(
          { error: 'Invalid file type. Only JPEG, PNG, WebP, GIF allowed' },
          { status: 400 }
        );
      }

      const bytes = await photo.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadDir = path.join(process.cwd(), 'public/applications');
      await fs.mkdir(uploadDir, { recursive: true });

      const safeName = photo.name.replace(/[^a-zA-Z0-9.-]/g, '-');
      const fileName = `${Date.now()}-${safeName}`;
      const filePath = path.join(uploadDir, fileName);
      await fs.writeFile(filePath, buffer);

      photoPath = `/applications/${fileName}`;
    }

    await pool.query(
      `INSERT INTO applications 
       (full_name, email, phone, photo, region, application_type, details, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [full_name, email, phone, photoPath, null, application_type, details]
    );

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 });
  }
}