'use client'

import { useState } from 'react'

export default function ContactPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)

    const form = e.currentTarget

    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: (form.elements.namedItem('name') as HTMLInputElement).value,
        email: (form.elements.namedItem('email') as HTMLInputElement).value,
        message: (form.elements.namedItem('message') as HTMLTextAreaElement)
          .value,
      }),
    })

    if (res.ok) {
      setSuccess(true)
      form.reset()
    } else {
      alert('Failed to send message')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 animate-modalDrop">
        <h1 className="text-2xl font-bold text-center mb-1">
          Contact Us
        </h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          We’d love to hear from you. Send us a message.
        </p>

        {success && (
          <div className="mb-4 rounded-lg bg-green-50 border border-green-200 p-3 text-sm text-green-700 animate-pop">
            ✅ Message sent successfully. We’ll get back to you soon.
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Your Name
            </label>
            <input
              name="name"
              required
              placeholder="John Doe"
              className="w-full rounded-lg border px-4 py-2
                         focus:outline-none focus:ring-2 focus:ring-black/20"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Email Address
            </label>
            <input
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              className="w-full rounded-lg border px-4 py-2
                         focus:outline-none focus:ring-2 focus:ring-black/20"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Message
            </label>
            <textarea
              name="message"
              required
              placeholder="Type your message here..."
              rows={4}
              className="w-full rounded-lg border px-4 py-2
                         resize-none
                         focus:outline-none focus:ring-2 focus:ring-black/20"
            />
          </div>

          <button
            disabled={loading}
            className="w-full rounded-lg py-3 font-semibold
                       bg-black text-white
                       hover:bg-black/90
                       active:scale-[0.98]
                       transition
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Sending…' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  )
}
