import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import bcrypt from 'bcryptjs'
import { query } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()

    // 1. Extract and Clean Data
    const first_name      = formData.get('first_name') as string | null
    const second_name     = formData.get('second_name') as string | null
    const email           = formData.get('email') as string | null
    const password        = formData.get('password') as string | null
    const phone           = formData.get('phone') as string | null
    const address         = formData.get('address') as string | null
    const gender          = formData.get('gender') as string | null
    const aspiration      = formData.get('aspiration') as string | null 
    const image           = formData.get('image') as File | null

    // 2. Validation
    if (!first_name || !email || !password || !aspiration) {
      return NextResponse.json(
        { success: false, message: 'Required fields are missing' },
        { status: 400 }
      )
    }

    // 3. Check if user already exists
    const existing: any = await query(
      'SELECT user_id FROM users WHERE email = ? LIMIT 1',
      [email.trim()]
    )

    if (existing && existing.length > 0) {
      return NextResponse.json(
        { success: false, message: 'This email is already registered' },
        { status: 409 }
      )
    }

    // 4. Hash Password
    const password_hash = await bcrypt.hash(password, 12)

    // 5. Handle Image Upload
    let photoFilename: string | null = null
    if (image && image.size > 0) {
      try {
        const uploadDir = path.join(process.cwd(), 'public', 'profile')
        // Ensure directory exists
        await fs.mkdir(uploadDir, { recursive: true })
        
        const uniqueName = `${Date.now()}-${image.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`
        const buffer = Buffer.from(await image.arrayBuffer())
        await fs.writeFile(path.join(uploadDir, uniqueName), buffer)
        photoFilename = uniqueName
      } catch (uploadError) {
        console.error('FILE UPLOAD ERROR:', uploadError)
        // We continue even if image fails, or you can throw error
      }
    }

    // 6. Database Insertion
    // IMPORTANT: Verify these column names match your MySQL table EXACTLY
    const sql = `
      INSERT INTO users 
      (first_name, second_name, email, phone, address, photo, gender, aspiration, password_hash, role)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `
    const values = [
      first_name.trim(),
      second_name ? second_name.trim() : null,
      email.trim().toLowerCase(),
      phone ? phone.trim() : null,
      address ? address.trim() : null,
      photoFilename,
      gender,
      aspiration.trim(),
      password_hash,
      'member' // default role
    ]

    const result: any = await query(sql, values)

    return NextResponse.json({
      success: true,
      message: 'Registration successful!',
      userId: result.insertId
    }, { status: 201 })

  } catch (err: any) {
    // This logs the ACTUAL error to your VS Code / Terminal console
    console.error('FULL REGISTRATION ERROR:', err)
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Server error during registration.',
        debug: err.message // Temporary: helps you see the error in the browser
      },
      { status: 500 }
    )
  }
}