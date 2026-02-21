'use client'

import { useEffect, useState } from 'react'

interface Application {
  id: number
  full_name: string
  email: string | null
  phone: string | null
  application_type: string
  details: string | null // Added back as per your request
  status: 'pending' | 'approved' | 'rejected' | null 
  created_at: string
}

export default function ApplicationsDashboard() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<number | null>(null) // For the details toggle

  useEffect(() => {
    fetchApplications()
  }, [])

  async function fetchApplications() {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/applications')
      const data = await res.json()
      setApplications(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error("Fetch error:", err)
    } finally {
      setLoading(false)
    }
  }

  async function updateStatus(id: number, newStatus: string) {
    try {
      const res = await fetch(`/api/admin/applications/refactor/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (res.ok) fetchApplications()
    } catch (err) {
      alert("Failed to update status")
    }
  }

  if (loading) return <div className="p-10 text-center text-slate-500">Loading...</div>

  return (
    // Removed max-w-6xl and used w-full to ensure it extends to your sidebar
    <div className="p-4 md:p-6 w-full min-h-screen bg-[#020617] text-slate-200">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white">Applicant Management</h1>
        <p className="text-sm text-slate-500">{applications.length} total applications found</p>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
        {/* Desktop Header */}
        <div className="hidden md:grid md:grid-cols-6 bg-slate-950/50 p-4 text-xs font-bold uppercase text-slate-400 border-b border-slate-800">
          <div className="col-span-1">Applicant</div>
          <div>Type</div>
          <div>Contact</div>
          <div>Status</div>
          <div>Details</div>
          <div className="text-right">Action</div>
        </div>

        <div className="divide-y divide-slate-800">
          {applications.map((app) => (
            <div key={app.id} className="hover:bg-slate-800/20 transition-colors">
              <div className="flex flex-col md:grid md:grid-cols-6 p-4 gap-4 md:gap-0 md:items-center">
                
                {/* Applicant */}
                <div className="flex flex-col">
                  <span className="md:hidden text-[10px] text-slate-500 font-bold uppercase">Applicant</span>
                  <span className="font-semibold text-sky-400">{app.full_name || 'N/A'}</span>
                  <span className="text-[11px] text-slate-500">{new Date(app.created_at).toLocaleDateString()}</span>
                </div>

                {/* Type */}
                <div className="flex flex-col">
                  <span className="md:hidden text-[10px] text-slate-500 font-bold uppercase">Type</span>
                  <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-1 rounded border border-slate-700 w-fit capitalize">
                    {app.application_type || 'General'}
                  </span>
                </div>

                {/* Contact */}
                <div className="flex flex-col">
                  <span className="md:hidden text-[10px] text-slate-500 font-bold uppercase">Contact</span>
                  <span className="text-sm truncate pr-2">{app.email || '—'}</span>
                  <span className="text-xs text-slate-500">{app.phone || '—'}</span>
                </div>

                {/* Status */}
                <div className="flex flex-col">
                  <span className="md:hidden text-[10px] text-slate-500 font-bold uppercase">Status</span>
                  <span className={`text-xs font-bold ${
                    app.status === 'approved' ? 'text-emerald-400' : 
                    app.status === 'rejected' ? 'text-rose-400' : 'text-amber-400'
                  }`}>
                    ● {(app.status || 'pending').toUpperCase()}
                  </span>
                </div>

                {/* Details Trigger */}
                <div className="flex flex-col">
                  <span className="md:hidden text-[10px] text-slate-500 font-bold uppercase">Info</span>
                  <button 
                    onClick={() => setExpandedId(expandedId === app.id ? null : app.id)}
                    className="text-xs text-sky-500 hover:text-sky-400 text-left underline underline-offset-4"
                  >
                    {expandedId === app.id ? 'Hide Details' : 'View Details'}
                  </button>
                </div>

                {/* Action */}
                <div className="flex flex-col md:items-end">
                  <select 
                    value={app.status || 'pending'}
                    onChange={(e) => updateStatus(app.id, e.target.value)}
                    className="w-full md:w-32 bg-slate-950 border border-slate-700 rounded-md p-2 text-xs text-white focus:border-sky-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approve</option>
                    <option value="rejected">Reject</option>
                  </select>
                </div>
              </div>

              {/* Collapsible Details Section */}
              {expandedId === app.id && (
                <div className="bg-slate-950/80 p-5 border-t border-slate-800 animate-in slide-in-from-top-2 duration-200">
                  <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Application Details</h4>
                  <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {app.details || "No additional details provided for this applicant."}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}