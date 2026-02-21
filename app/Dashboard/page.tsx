'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface DashboardStats {
  members: number
  messages: number
  applications: number
  talents: number
}

interface User {
  first_name: string
  role: string
  photo?: string | null
}

export default function DashboardPage() {
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const meRes = await fetch('/api/auth/me')
        if (!meRes.ok) {
          router.push('/')
          return
        }
        setUser(await meRes.json())

        const statsRes = await fetch('/api/dashboard')
        if (!statsRes.ok) throw new Error('Failed to load dashboard stats')

        setStats(await statsRes.json())
      } catch (err: any) {
        setError(err.message || 'Something went wrong')
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [router])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen bg-slate-950 text-slate-300">Loading dashboard...</div>
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen bg-slate-950 text-red-400">{error}</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-slate-400">Welcome back{user?.first_name && `, ${user.first_name}`}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Members" value={stats?.members} />
        <StatCard title="Messages" value={stats?.messages} />
        <StatCard title="Applications" value={stats?.applications} />
        <StatCard title="Talents" value={stats?.talents} />
      </div>
    </div>
  )
}

function StatCard({ title, value }: { title: string; value?: number }) {
  return (
    <div className="bg-slate-900 rounded-2xl p-6 shadow">
      <p className="text-slate-400 text-sm">{title}</p>
      <p className="text-3xl font-bold">{value ?? 0}</p>
    </div>
  )
}
