'use client'

import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'

interface NewsEvent {
  event_id: number
  title: string
  description: string
  type: string
  image: string | null
  created_at: string
}

export default function PublicNewsPage() {
  const [posts, setPosts] = useState<NewsEvent[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch('/api/news-events')
      .then(res => res.json())
      .then(setPosts)
  }, [])

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Replace with your actual submission logic
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // SUCCESS SWAL - Black/Blue Theme
      Swal.fire({
        title: 'MESSAGE TRANSMITTED',
        text: 'Your enquiry has been successfully sent to our team.',
        icon: 'success',
        iconColor: '#3b82f6', // Bright Blue Tick
        background: '#000000', // Pure Black
        color: '#ffffff',      // White Text
        confirmButtonColor: '#3b82f6',
        confirmButtonText: 'CONFIRM',
        customClass: {
          popup: 'border border-slate-800 rounded-3xl'
        }
      })

      e.currentTarget.reset()
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'FAILED',
        text: 'System error. Please try again.',
        background: '#000000',
        color: '#ffffff'
      })
    } finally {
      setLoading(false)
    }
  }

  if (!posts.length) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  )

  const [featured, ...others] = posts

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500/30">
      
      {/* 1. FEATURED HERO - FULL WIDTH */}
      <section className="relative h-[70vh] w-full overflow-hidden border-b border-slate-900">
        {featured.image && (
          <img 
            src={`/news/${featured.image}`} 
            className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-1000" 
            alt="featured"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent flex flex-col justify-end p-10 md:p-20">
          <div className="max-w-7xl mx-auto w-full">
            <span className="text-blue-500 font-black text-xs uppercase tracking-[0.5em] mb-4 block">Top Priority</span>
            <h1 className="text-5xl md:text-8xl font-black mb-6 tracking-tighter uppercase italic leading-none">
              {featured.title}
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl font-light leading-relaxed">
              {featured.description}
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 space-y-32 py-24">
        
        {/* 2. CENTERED 3-COLUMN GRID */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black uppercase tracking-widest italic">Latest Feed</h2>
            <div className="h-1 w-20 bg-blue-500 mx-auto mt-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 justify-items-center">
            {others.map(post => (
              <article key={post.event_id} className="bg-black border border-slate-900 rounded-[2.5rem] overflow-hidden group hover:border-blue-500/50 transition-all duration-500 w-full">
                <div className="h-64 overflow-hidden relative">
                  <img src={`/news/${post.image}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={post.title} />
                  <div className="absolute top-4 right-4 bg-blue-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                    {post.type}
                  </div>
                </div>
                <div className="p-8 text-center">
                  <h3 className="text-2xl font-bold mb-4 line-clamp-2 leading-tight group-hover:text-blue-400 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-slate-500 text-sm font-light leading-relaxed mb-6 line-clamp-3 italic">
                    {post.description}
                  </p>
                  <div className="pt-6 border-t border-slate-900 flex flex-col items-center">
                    <span className="text-[10px] text-blue-500 font-bold tracking-widest uppercase">Release Date</span>
                    <span className="text-xs text-slate-400">{new Date(post.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* 3. CENTERED BLACK THEME CONTACT FORM */}
        <section className="flex justify-center pt-10">
          <div className="w-full max-w-4xl bg-black border border-slate-800 p-12 md:p-20 rounded-[3.5rem] flex flex-col items-center text-center shadow-[0_0_80px_-20px_rgba(59,130,246,0.15)]">
            <h2 className="text-4xl md:text-6xl font-black mb-4 uppercase italic">
              CONTACT <span className="text-blue-500 underline decoration-slate-800">US</span>
            </h2>
            <p className="text-slate-500 mb-14 font-light tracking-widest text-sm">WE ARE READY TO RESPOND TO YOUR TRANSMISSION</p>

            <form onSubmit={handleSendMessage} className="w-full space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="text-left">
                  <label className="text-[10px] font-bold text-blue-500 uppercase tracking-widest ml-4 mb-2 block">Name</label>
                  <input 
                    name="name"
                    placeholder="ENTER FULL NAME" 
                    className="w-full bg-slate-950 border border-slate-800 p-5 rounded-2xl focus:border-blue-500 outline-none transition-all text-white placeholder:text-slate-700 text-sm"
                    required
                  />
                </div>
                <div className="text-left">
                  <label className="text-[10px] font-bold text-blue-500 uppercase tracking-widest ml-4 mb-2 block">Email</label>
                  <input 
                    name="email"
                    type="email"
                    placeholder="ENTER EMAIL ADDRESS" 
                    className="w-full bg-slate-950 border border-slate-800 p-5 rounded-2xl focus:border-blue-500 outline-none transition-all text-white placeholder:text-slate-700 text-sm"
                    required
                  />
                </div>
              </div>
              <div className="text-left">
                <label className="text-[10px] font-bold text-blue-500 uppercase tracking-widest ml-4 mb-2 block">Your Message</label>
                <textarea 
                  name="message"
                  placeholder="TYPE YOUR MESSAGE HERE..." 
                  rows={6}
                  className="w-full bg-slate-950 border border-slate-800 p-6 rounded-3xl focus:border-blue-500 outline-none transition-all text-white placeholder:text-slate-700 text-sm resize-none"
                  required
                />
              </div>
              
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-white hover:text-black text-white font-black py-6 rounded-2xl transition-all duration-500 uppercase tracking-[0.4em] text-xs active:scale-95 disabled:opacity-50"
              >
                {loading ? 'Transmitting...' : 'Send Message'}
              </button>
            </form>
          </div>
        </section>

      </div>
    </div>
  )
}