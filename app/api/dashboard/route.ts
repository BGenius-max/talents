// app/api/dashboard/route.ts
import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { query } from "@/lib/db"

export async function GET() {
  try {
    // ✅ MUST be awaited
    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      )
    }

    const members = await query(
      `SELECT COUNT(*) AS total FROM users WHERE role = 'member'`
    )
    const messages = await query(
      `SELECT COUNT(*) AS total FROM messages`
    )
    const applications = await query(
      `SELECT COUNT(*) AS total FROM applications`
    )
    const talents = await query(
      `SELECT COUNT(*) AS total FROM talents`
    )

    return NextResponse.json({
      members: members[0]?.total ?? 0,
      messages: messages[0]?.total ?? 0,
      applications: applications[0]?.total ?? 0,
      talents: talents[0]?.total ?? 0,
    })
  } catch (error) {
    console.error("DASHBOARD ROUTE ERROR:", error)
    return NextResponse.json(
      { error: "Failed to load dashboard stats" },
      { status: 500 }
    )
  }
}
