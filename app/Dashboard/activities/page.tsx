'use client'

import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'

interface Media {
  id: number
  media_type: string
  file_name: string
}

interface Activity {
  id: number
  title: string
  type: string
  description: string
  event_date: string | null
  created_at: string
  media: Media[]
}

export default function ActivitiesPage() {
  const [items, setItems] = useState<Activity[]>([])
  const [loading, setLoading] = useState(false)

  const fetchActivities = async () => {
    try {
      const res = await fetch('/api/activities')
      const data = await res.json()
      if (Array.isArray(data)) setItems(data)
    } catch (err) {
      console.error('Fetch error', err)
    }
  }

  useEffect(() => { fetchActivities() }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const form = e.currentTarget
    const formData = new FormData(form)

    // Verification check for the console
    console.log("Posting Title:", formData.get('title'))

    try {
      const res = await fetch('/api/activities', {
        method: 'POST',
        // Browser handles headers for FormData automatically
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        Swal.fire('Error', data.error || 'Check fields', 'error')
      } else {
        Swal.fire('Success', 'Activity Posted!', 'success')
        form.reset()
        fetchActivities()
      }
    } catch (err) {
      Swal.fire('Error', 'Connection failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 space-y-10 text-white max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manage Activities</h1>
        <span className="bg-slate-800 px-4 py-1 rounded-full text-sm border border-slate-700">
          Total: {items.length}
        </span>
      </div>

      {/* CREATE FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-slate-900 p-8 rounded-2xl space-y-6 border border-slate-800 shadow-2xl"
      >
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm text-slate-400">Activity Title</label>
            <input
              name="title"
              placeholder="e.g. Annual Youth Summit"
              required
              className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 focus:border-blue-500 outline-none transition"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-slate-400">Category</label>
            <select
              name="type"
              required
              className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 focus:border-blue-500 outline-none"
            >
              <option value="">Select Type</option>
              <option value="Event">Event</option>
              <option value="Announcement">Announcement</option>
              <option value="News">News</option>
              <option value="Job">Job</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-slate-400">Description</label>
          <textarea
            name="description"
            placeholder="Provide all details here..."
            required
            className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 h-32 focus:border-blue-500 outline-none resize-none"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm text-slate-400">Event Date (Optional)</label>
            <input
              type="date"
              name="event_date"
              className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 focus:border-blue-500 outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-slate-400">Media Uploads (Images/Videos/Audio)</label>
            <input
              type="file"
              name="media"
              multiple
              accept="image/*,video/*,audio/*"
              className="w-full p-2.5 rounded-lg bg-slate-800 border border-slate-700 text-sm file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-xl font-bold text-lg transition shadow-lg shadow-blue-900/20 disabled:opacity-50"
        >
          {loading ? 'Processing Upload...' : 'Publish Activity'}
        </button>
      </form>

      {/* DISPLAY LIST */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col hover:border-slate-600 transition group"
          >
            {/* Media Preview Logic */}
            <div className="h-48 bg-slate-800 relative overflow-hidden">
              {item.media.length > 0 ? (
                item.media[0].media_type === 'image' ? (
                  <img
                    src={`/uploads/activities/${item.media[0].file_name}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    alt=""
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-500">
                    {item.media[0].media_type.toUpperCase()} Content
                  </div>
                )
              ) : (
                <div className="flex items-center justify-center h-full text-slate-600 text-sm uppercase tracking-widest">No Media</div>
              )}
              <div className="absolute top-3 left-3">
                <span className="text-[10px] font-bold bg-blue-600 px-2 py-1 rounded uppercase">
                  {item.type}
                </span>
              </div>
            </div>

            <div className="p-6 space-y-3 flex-grow">
              <h2 className="text-xl font-bold line-clamp-1">{item.title}</h2>
              <p className="text-slate-400 text-sm line-clamp-3 leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="p-6 pt-0 mt-auto border-t border-slate-800/50">
               <div className="flex justify-between items-center mt-4">
                  <span className="text-[11px] text-slate-500 italic">
                    {item.event_date ? new Date(item.event_date).toLocaleDateString() : 'No Date Set'}
                  </span>
                  <button className="text-blue-500 text-xs font-semibold hover:underline">View Details</button>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}