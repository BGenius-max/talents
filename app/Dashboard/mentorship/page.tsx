'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

type Mentee = {
  id: number
  full_name: string
  email: string
  phone?: string | null
  field?: string | null
  image?: string | null
  created_at: string
}

export default function MentorshipPage() {
  const [mentees, setMentees] = useState<Mentee[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    field: '',
  })

  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  useEffect(() => {
    loadMentees()
  }, [])

  async function loadMentees() {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch('/api/mentorship')
      if (!res.ok) throw new Error('Failed to load mentored people')
      const data = await res.json()
      setMentees(Array.isArray(data) ? data : [])
    } catch (err: any) {
      setError(err.message || 'Could not load records')
    } finally {
      setLoading(false)
    }
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0]
    if (!selected) return

    setFile(selected)
    const reader = new FileReader()
    reader.onloadend = () => setPreview(reader.result as string)
    reader.readAsDataURL(selected)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!form.full_name.trim() || !form.email.trim()) {
      alert('Full name and email are required')
      return
    }

    if (!form.email.includes('@')) {
      alert('Please enter a valid email address')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const data = new FormData()
      data.append('full_name', form.full_name.trim())
      data.append('email', form.email.trim())
      if (form.phone.trim()) data.append('phone', form.phone.trim())
      if (form.field.trim()) data.append('field', form.field.trim())
      if (file) data.append('image', file)

      const res = await fetch('/api/mentorship', {
        method: 'POST',
        body: data,
      })

      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.error || 'Failed to add mentee')
      }

      // Reset
      setForm({ full_name: '', email: '', phone: '', field: '' })
      setFile(null)
      setPreview(null)

      await loadMentees()
      alert('Mentee added successfully!')
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Remove this mentee record permanently?')) return

    try {
      const res = await fetch('/api/mentorship', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || 'Delete failed')
      }

      setMentees(prev => prev.filter(m => m.id !== id))
    } catch (err: any) {
      alert(err.message || 'Could not delete record')
    }
  }

  if (loading) return <div className="p-12 text-center text-slate-500">Loading mentorship records...</div>

  return (
    <div className="space-y-10 p-4 md:p-8 max-w-7xl mx-auto">
      <header className="pb-2">
        <h1 className="text-3xl font-bold tracking-tight">Mentorship</h1>
        <p className="text-slate-400 mt-1">
          {mentees.length} mentored {mentees.length === 1 ? 'person' : 'people'}
        </p>
      </header>

      {error && (
        <div className="p-4 bg-red-900/30 border border-red-700 text-red-300 rounded-xl">
          {error}
        </div>
      )}

      {/* Add Form */}
      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Full Name <span className="text-red-400">*</span>
            </label>
            <input
              required
              value={form.full_name}
              onChange={e => setForm({ ...form, full_name: e.target.value })}
              placeholder="Enter full name"
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Email (must be registered member) <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="Enter your registered email"
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Phone</label>
            <input
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              placeholder="+254 7XX XXX XXX"
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Field / Expertise</label>
            <input
              value={form.field}
              onChange={e => setForm({ ...form, field: e.target.value })}
              placeholder="e.g. Software Development, Leadership, Design"
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Profile Photo (optional)</label>
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <input
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="block w-full text-sm text-slate-300 file:mr-4 file:py-2.5 file:px-5 file:rounded-lg file:border-0 file:bg-slate-700 file:text-white hover:file:bg-slate-600 cursor-pointer"
            />
            {preview && (
              <div className="w-20 h-20 relative rounded-full overflow-hidden border-2 border-slate-700 shadow-sm">
                <Image src={preview} alt="Preview" fill className="object-cover" />
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className={`w-full py-3 rounded-xl font-semibold transition-all ${
            submitting
              ? 'bg-indigo-800 text-indigo-300 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-900/30'
          }`}
        >
          {submitting ? 'Adding...' : 'Add to Mentorship'}
        </button>
      </form>

      {/* List */}
      {mentees.length === 0 ? (
        <div className="text-center py-16 text-slate-500 border border-dashed border-slate-700 rounded-xl">
          No mentored individuals added yet.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mentees.map(m => (
            <div
              key={m.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-600 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 relative rounded-full overflow-hidden border-2 border-slate-700 flex-shrink-0">
                  <Image
                    src={m.image ? `/uploads/${m.image}` : '/profiles/default.png'}
                    alt={m.full_name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold truncate">{m.full_name}</h3>
                  {m.field && <p className="text-sm text-indigo-400">{m.field}</p>}
                </div>
              </div>

              <div className="mt-4 text-sm space-y-1 text-slate-400">
                <p>Email: {m.email}</p>
                {m.phone && <p>Phone: {m.phone}</p>}
              </div>

              <button
                onClick={() => handleDelete(m.id)}
                className="mt-4 text-xs text-red-400 hover:text-red-300 transition flex items-center gap-1"
              >
                <span>×</span> Remove from Mentorship
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}