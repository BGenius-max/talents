'use client'

import { useEffect, useRef, useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'

interface Suggestion {
  id: number
  message: string
  created_at: string
  user_id: number
  first_name: string
  second_name: string
  role: string
  is_read: number
}

export default function SuggestionsPage() {
  const [list, setList] = useState<Suggestion[]>([])
  const [messageInput, setMessageInput] = useState('')
  const [currentUser, setCurrentUser] = useState<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  /* ============================
     LOAD USER
  ============================ */
  async function loadUser() {
    const res = await fetch('/api/auth/me')
    if (res.ok) {
      const data = await res.json()
      setCurrentUser(data)
    }
  }

  /* ============================
     LOAD SUGGESTIONS
  ============================ */
  async function loadSuggestions() {
    const res = await fetch('/api/suggestions')
    const data = await res.json()
    setList(data)
  }

  /* ============================
     REAL-TIME POLLING
  ============================ */
  useEffect(() => {
    loadUser()
    loadSuggestions()
    const interval = setInterval(() => {
      loadSuggestions()
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  /* ============================
     AUTO SCROLL
  ============================ */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [list])

  /* ============================
     SEND MESSAGE
  ============================ */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!messageInput.trim()) return
    await fetch('/api/suggestions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: messageInput }),
    })
    setMessageInput('')
    loadSuggestions()
  }

/* ============================
   MARK AS READ
============================ */
async function markAsRead(id: number) {
  try {
    const res = await fetch('/api/suggestions/read', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })

    if (res.status === 403) return
    if (!res.ok) return

    loadSuggestions()
  } catch (error) {
    console.error('Mark as read error:', error)
  }
}

 /* ============================
   DELETE SUGGESTION
============================ */
async function handleDelete(id: number) {
  if (!id) return;
  if (!confirm('Are you sure you want to delete this suggestion?')) return;

  try {
    const res = await fetch('/api/suggestions/delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Delete failed:', res.status, errorText);
      throw new Error('Failed to delete');
    }

    loadSuggestions();
  } catch (error) {
    console.error('Error deleting suggestion:', error);
  }
}

/* ============================
   UPDATE SUGGESTION
============================ */
async function handleEdit(id: number, newMessage: string) {
  if (!id || !newMessage.trim()) return;

  try {
    const res = await fetch('/api/suggestions/update', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id,
        message: newMessage.trim(),
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Update failed:', res.status, errorText);
      throw new Error('Failed to update');
    }

    loadSuggestions();
  } catch (error) {
    console.error('Error updating suggestion:', error);
  }
}

 return (
  <div className="flex flex-col h-[calc(100vh-120px)] bg-slate-950 rounded-xl">

    {/* Header */}
    <div className="p-4 border-b border-slate-800">
      <h1 className="text-xl font-bold">Suggestions</h1>
    </div>

    {/* Messages */}
    <div className="flex-1 overflow-y-auto p-4 space-y-4">

      {list.map((s) => {
      const isMine = currentUser?.user_id === s.user_id

        return (
          <div
            key={`suggestion-${s.id}`}
            className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-md w-full sm:w-auto px-4 py-3 rounded-2xl text-sm shadow
              ${
                isMine
                  ? 'bg-sky-600 text-white rounded-br-sm'
                  : 'bg-slate-800 text-slate-200 rounded-bl-sm'
              }`}
            >

              {/* Message */}
              <div className="break-words">{s.message}</div>

              {/* Footer */}
              <div className="mt-2 flex items-start justify-between gap-3 text-[10px] opacity-80">

                {/* LEFT: name + time */}
                <div className="flex flex-col leading-tight">

                  <span className="font-medium text-slate-300">
                    {s.first_name} {s.second_name}
                  </span>

                  <span>
                    {new Date(s.created_at).toLocaleTimeString()}
                  </span>

{!s.is_read && currentUser && !isMine && (
  <button
    onClick={() => markAsRead(s.id)}
    className="text-yellow-300 hover:underline mt-1 text-left"
  >
    Mark as Read
  </button>
)}


                </div>

                {/* RIGHT: edit/delete */}
               {currentUser &&
  currentUser.user_id === s.user_id && (


                    <div className="flex gap-2 shrink-0">

                      <button
                        onClick={() => {
                          const newMsg = prompt(
                            'Edit suggestion:',
                            s.message
                          )
                          if (newMsg !== null) handleEdit(s.id, newMsg)
                        }}
                        className="hover:text-gray-200"
                      >
                        <Pencil size={14} />
                      </button>

                      <button
                        onClick={() => handleDelete(s.id)}
                        className="hover:text-gray-200"
                      >
                        <Trash2 size={14} />
                      </button>

                    </div>
                  )}

              </div>

            </div>
          </div>
        )
      })}

      <div ref={messagesEndRef} />
    </div>

    {/* Input */}
    <form
      onSubmit={handleSubmit}
      className="p-4 border-t border-slate-800 bg-slate-900"
    >
      <div className="flex gap-3">

        <input
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          placeholder="Write your suggestion..."
          className="flex-1 bg-slate-800 border border-slate-700 rounded-full px-4 py-2 text-sm"
        />

        <button
          type="submit"
          className="bg-sky-600 px-6 py-2 rounded-full font-medium whitespace-nowrap"
        >
          Send
        </button>

      </div>
    </form>

  </div>
)
}