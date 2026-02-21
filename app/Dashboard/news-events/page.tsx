'use client'

import { useEffect, useState } from 'react'

interface NewsEvent {
  event_id: number
  title: string
  description: string
  type: string
  image: string | null
  video_url: string | null
  event_date: string | null
  created_at: string
  first_name: string
  second_name: string
  role: string
}

export default function NewsEventsPage() {
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [items, setItems] = useState<NewsEvent[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchNews()
  }, [])

  async function fetchNews() {
    try {
      const res = await fetch('/api/news-events')
      const data = await res.json()
      setItems(data)
    } catch {
      setError('Failed to load news')
    }
  }

  function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) setPreview(URL.createObjectURL(file))
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault()

  const form = e.currentTarget   // ✅ store before async
  setLoading(true)

  const formData = new FormData(form)

  try {
    const res = await fetch('/api/news-events', {
      method: 'POST',
      body: formData,
    })

    if (!res.ok) {
      throw new Error('Failed to post')
    }

    alert('Posted successfully')

    form.reset()      // ✅ safe now
    setPreview(null)
    fetchNews()

  } catch (error) {
    console.error(error)
    alert('Something went wrong')
  } finally {
    setLoading(false)
  }
}

  return (
    <div className="space-y-10 max-w-6xl mx-auto">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">News & Events Management</h1>
        <p className="text-slate-400 text-sm mt-1">
          Total Posts: {items.length}
        </p>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-700 text-red-300 p-4 rounded-xl">
          {error}
        </div>
      )}

      {/* FORM */}
      <form
        onSubmit={submit}
        className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6"
      >
        <h2 className="text-xl font-semibold">Create New Post</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <input
            name="title"
            placeholder="Title"
            required
            className="px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg"
          />

          <select
            name="type"
            required
            className="px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg"
          >
            <option value="">Select type</option>
            <option value="news">News</option>
            <option value="event">Event</option>
            <option value="discussion">Discussion</option>
            <option value="show">Show</option>
          </select>
        </div>

        <textarea
          name="description"
          placeholder="Description"
          required
          rows={5}
          className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg"
        />

        <div className="grid md:grid-cols-2 gap-6">
          <input
            type="date"
            name="event_date"
            className="px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg"
          />

          <input
            type="url"
            name="video_url"
            placeholder="Video URL (optional)"
            className="px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg"
          />
        </div>

        {/* IMAGE PREVIEW */}
        <label className="block">
          <input type="file" name="image" hidden onChange={handleImage} />
          <div className="w-40 h-40 border border-slate-700 rounded-xl flex items-center justify-center bg-slate-800 cursor-pointer">
            {preview ? (
              <img src={preview} className="w-full h-full object-cover rounded-xl" />
            ) : (
              <span className="text-slate-400 text-sm">Upload Image</span>
            )}
          </div>
        </label>

        <button
          disabled={loading}
          className="bg-sky-600 hover:bg-sky-700 px-6 py-3 rounded-lg font-semibold transition"
        >
          {loading ? 'Posting...' : 'Publish Post'}
        </button>
      </form>

      {/* POSTS LIST */}
      <div>
        <h2 className="text-2xl font-bold mb-6">
          All Posts ({items.length})
        </h2>

        {items.length === 0 ? (
          <p className="text-slate-400 text-center py-10">
            No posts yet
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map(item => (
              <div
                key={item.event_id}
                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col"
              >
                {item.image && (
                  <img
                    src={`/news/${item.image}`}
                    className="h-48 w-full object-cover"
                  />
                )}

                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="font-semibold text-lg mb-2">
                    {item.title}
                  </h3>

                  <p className="text-sm text-slate-400 mb-4 line-clamp-3 flex-grow">
                    {item.description}
                  </p>

                  <div className="text-xs text-slate-500 border-t border-slate-800 pt-3 mt-auto">
                    <p>
                      Posted by: {item.first_name} {item.second_name}
                    </p>
                    <p className="capitalize">
                      Role: {item.role}
                    </p>
                    <p>
                      {new Date(item.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
