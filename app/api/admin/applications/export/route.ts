import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { cookies } from 'next/headers'
import * as XLSX from 'xlsx'
import PDFDocument from 'pdfkit'

export async function GET(req: Request) {
  /* ✅ READ COOKIES PROPERLY */
  const cookieStore = await cookies()
  const role = cookieStore.get('role')?.value

  if (role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type')

  const rows: any[] = await query(`
    SELECT full_name, email, phone, apply_for, status, created_at
    FROM applications
    ORDER BY created_at DESC
  `)

  /* ---------- EXCEL EXPORT ---------- */
  if (type === 'excel') {
    const ws = XLSX.utils.json_to_sheet(rows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Applications')

    const buffer = XLSX.write(wb, {
      type: 'buffer',
      bookType: 'xlsx',
    })

    return new NextResponse(buffer, {
      headers: {
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition':
          'attachment; filename="applications.xlsx"',
      },
    })
  }

  /* ---------- PDF EXPORT ---------- */
  if (type === 'pdf') {
    const doc = new PDFDocument({ margin: 40 })
    const chunks: Buffer[] = []

    doc.on('data', chunk => chunks.push(chunk))

    doc.fontSize(18).text('Applications', { align: 'center' })
    doc.moveDown()

    rows.forEach(r => {
      doc
        .fontSize(11)
        .text(`Name: ${r.full_name}`)
        .text(`Email: ${r.email}`)
        .text(`Phone: ${r.phone}`)
        .text(`Applying for: ${r.apply_for}`)
        .text(`Status: ${r.status}`)
        .text(`Date: ${new Date(r.created_at).toLocaleDateString()}`)
        .moveDown()
    })

    doc.end()

    return new NextResponse(Buffer.concat(chunks), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition':
          'attachment; filename="applications.pdf"',
      },
    })
  }

  return NextResponse.json(
    { error: 'Invalid export type' },
    { status: 400 }
  )
}
