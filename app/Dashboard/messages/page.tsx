'use client'

import { useEffect, useState } from 'react'

interface Message {
  id: number
  subject: string
  message: string
  name: string
  email: string
  created_at: string
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/messages/staff')
      .then(res => res.json())
      .then(data => {
        setMessages(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-black">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-blue-500 font-black uppercase tracking-widest text-[10px]">Syncing Data...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      {/* HEADER SECTION */}
      <header className="p-8 border-b border-slate-900 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter">
            System <span className="text-blue-600">Inbox</span>
          </h1>
          <p className="text-slate-500 text-[10px] uppercase tracking-[0.3em] mt-2 font-bold">
            Staff Communication Logs
          </p>
        </div>
        <div className="bg-blue-600/10 border border-blue-500/20 px-4 py-2 rounded-full">
          <span className="text-blue-500 text-xs font-black uppercase">
            {messages.length} Messages
          </span>
        </div>
      </header>

      {/* MESSAGES LIST */}
      <main className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
        {messages.length === 0 ? (
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-slate-900 rounded-[3rem]">
            <p className="text-slate-700 font-bold uppercase tracking-widest italic text-sm">No new transmissions detected</p>
          </div>
        ) : (
          messages.map((m, index) => (
            <div
              /* Safe key using index until your Auto-Increment fix is live */
              key={`msg-${m.id}-${index}`}
              className="bg-slate-950/30 border border-slate-900 rounded-[2.5rem] p-8 hover:border-blue-600/50 transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
                <div>
                  <span className="bg-blue-600 text-[9px] font-black uppercase px-3 py-1 rounded-full tracking-widest mb-3 inline-block">
                    Inbound
                  </span>
                  <h3 className="text-2xl font-bold leading-none tracking-tight">
                    {m.subject || "No Subject Transmission"}
                  </h3>
                </div>
                <div className="text-left md:text-right">
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Received</p>
                  <p className="text-sm font-bold text-slate-400">
                    {new Date(m.created_at).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* SENDER INFO */}
              <div className="flex items-center gap-4 p-4 bg-black rounded-2xl border border-slate-900 mb-6">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-black text-black">
                  {m.name?.[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-black uppercase tracking-tighter">{m.name}</p>
                  <p className="text-xs text-blue-500 font-bold">{m.email}</p>
                </div>
              </div>

              {/* MESSAGE CONTENT */}
              <div className="px-4">
                <p className="text-slate-400 text-sm leading-relaxed whitespace-pre-line font-light italic">
                  "{m.message}"
                </p>
              </div>

              {/* ACTIONS */}
              <div className="mt-8 pt-6 border-t border-slate-900/50 flex justify-end gap-4">
                <button className="px-6 py-2 rounded-full border border-slate-800 text-[10px] font-bold uppercase hover:bg-white hover:text-black transition-all">
                  Archive
                </button>
                <button className="px-6 py-2 rounded-full bg-blue-600 text-white text-[10px] font-bold uppercase hover:bg-blue-500 transition-all">
                  Reply
                </button>
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  )
}