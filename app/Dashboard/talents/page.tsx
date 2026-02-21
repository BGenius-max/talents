'use client'

import { useEffect, useState } from 'react'

const STATUS_OPTIONS = ['pending', 'verified', 'active', 'suspended'] as const

type Talent = {
  id: number
  full_name: string
  email: string
  category: string
  county: string | null
  status: 'pending' | 'verified' | 'active' | 'suspended'
  description?: string
}

export default function TalentsDashboard() {
  const [talents, setTalents] = useState<Talent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Edit modal state
  const [editingTalent, setEditingTalent] = useState<Talent | null>(null)
  const [editForm, setEditForm] = useState<Partial<Talent>>({})

  useEffect(() => {
    fetchTalents()
  }, [])

  async function fetchTalents() {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch('/api/talents')
      if (!res.ok) {
        throw new Error(`HTTP ${res.status} - Failed to load talents`)
      }
      const data = await res.json()
      setTalents(Array.isArray(data) ? data : [])
    } catch (err: any) {
      setError(err.message || 'Could not load talent records')
    } finally {
      setLoading(false)
    }
  }

  async function updateStatus(id: number, newStatus: string) {
    if (!confirm(`Set status to "${newStatus}"?`)) return

    try {
      const res = await fetch(`/api/talents/refactor?id=${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.error || `HTTP ${res.status}`)
      }

      setTalents(prev =>
        prev.map(t => (t.id === id ? { ...t, status: newStatus as any } : t))
      )
    } catch (err: any) {
      alert(`Failed to update status: ${err.message}`)
    }
  }

  async function deleteTalent(id: number) {
    if (!confirm('Delete this talent profile permanently?\nThis action cannot be undone.')) return

    try {
      const res = await fetch(`/api/talents/refactor?id=${id}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.error || `HTTP ${res.status}`)
      }

      setTalents(prev => prev.filter(t => t.id !== id))
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`)
    }
  }

  function startEdit(talent: Talent) {
    setEditingTalent(talent)
    setEditForm({ ...talent })
  }

  function handleEditChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setEditForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  async function saveEdit() {
    if (!editingTalent) return

    try {
      const res = await fetch(`/api/talents/refactor?id=${editingTalent.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      })

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.error || `HTTP ${res.status}`)
      }

      await fetchTalents()
      setEditingTalent(null)
      setEditForm({})
    } catch (err: any) {
      alert(`Save failed: ${err.message}`)
    }
  }

  if (loading) {
    return (
      <div className="p-10 text-center text-slate-500 uppercase text-xs tracking-widest">
        Loading talent directory...
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 w-full min-h-screen bg-[#020617] text-slate-200">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white">Talent Management</h1>
        <p className="text-sm text-slate-500 mt-1">
          {talents.length} talent profile{talents.length !== 1 ? 's' : ''}
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 text-red-400 rounded-xl text-sm">
          {error}
        </div>
      )}

      <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
        <div className="hidden md:grid md:grid-cols-6 bg-slate-950/50 p-4 text-xs font-bold uppercase text-slate-400 border-b border-slate-800">
          <div>Applicant</div>
          <div>Category</div>
          <div>Location</div>
          <div>Status</div>
          <div>Actions</div>
          <div className="text-right">More</div>
        </div>

        <div className="divide-y divide-slate-800">
          {talents.map(talent => (
            <div
              key={talent.id}
              className="hover:bg-slate-800/30 transition-colors"
            >
              <div className="flex flex-col md:grid md:grid-cols-6 p-4 gap-4 md:gap-0 items-start md:items-center">
                <div className="flex flex-col">
                  <div className="font-semibold text-sky-400">{talent.full_name}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{talent.email}</div>
                </div>

                <div>
                  <span className="inline-block text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded border border-slate-700">
                    {talent.category}
                  </span>
                </div>

                <div className="text-sm text-slate-400">
                  {talent.county || '—'}
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                      talent.status === 'active'     ? 'bg-emerald-950/40 text-emerald-400' :
                      talent.status === 'verified'   ? 'bg-blue-950/40    text-blue-400' :
                      talent.status === 'pending'    ? 'bg-amber-950/40   text-amber-400' :
                      /* suspended */                 'bg-red-950/40     text-red-400'
                    }`}
                  >
                    {talent.status.toUpperCase()}
                  </span>

                  <select
                    value={talent.status}
                    onChange={e => updateStatus(talent.id, e.target.value)}
                    className="text-xs bg-slate-800 border border-slate-700 rounded px-2 py-1 focus:outline-none focus:border-sky-600"
                  >
                    {STATUS_OPTIONS.map(s => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => startEdit(talent)}
                    className="text-xs bg-blue-700 hover:bg-blue-600 px-3 py-1.5 rounded transition"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteTalent(talent.id)}
                    className="text-xs bg-red-700 hover:bg-red-600 px-3 py-1.5 rounded transition"
                  >
                    Delete
                  </button>
                </div>

                <div className="text-right w-full md:w-auto">
                  <button className="text-xs text-slate-500 hover:text-slate-300 uppercase tracking-tight">
                    View full profile →
                  </button>
                </div>
              </div>
            </div>
          ))}

          {talents.length === 0 && !error && (
            <div className="p-16 text-center text-slate-600">
              No talent profiles found.
            </div>
          )}
        </div>
      </div>

      {/* Edit modal */}
      {editingTalent && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-5 text-white">Edit Talent Profile</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Full name</label>
                <input
                  name="full_name"
                  value={editForm.full_name ?? ''}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:border-sky-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-1">Email</label>
                <input
                  name="email"
                  value={editForm.email ?? ''}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:border-sky-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-1">Category</label>
                <input
                  name="category"
                  value={editForm.category ?? ''}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:border-sky-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-1">County</label>
                <input
                  name="county"
                  value={editForm.county ?? ''}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:border-sky-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-1">Status</label>
                <select
                  name="status"
                  value={editForm.status ?? 'pending'}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:border-sky-600 outline-none"
                >
                  {STATUS_OPTIONS.map(s => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => {
                  setEditingTalent(null)
                  setEditForm({})
                }}
                className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 rounded transition"
              >
                Cancel
              </button>

              <button
                onClick={saveEdit}
                className="flex-1 py-2.5 bg-sky-600 hover:bg-sky-500 rounded transition font-medium"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}