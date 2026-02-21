'use client'

import Link from 'next/link'
import {
  Menu, LogOut, FileText, Newspaper, Lightbulb, GraduationCap,
  Briefcase, Activity, Users, Info, MessageSquare, LayoutDashboard, X
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'

interface User {
  first_name: string
  role: 'admin' | 'staff' | 'member'
  photo?: string | null
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => (res.ok ? res.json() : null))
      .then(data => {
        if (!data) router.push('/')
        else setUser(data)
      })
      .finally(() => setLoading(false))
  }, [router])

  // Close sidebar automatically when clicking a link on mobile
  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
  }

  if (loading) return (
    <div className="h-screen bg-black flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  )

  if (!user) return null

  const profileImage = user.photo ? `/profile/${user.photo}` : '/profile/default.jpg'

  return (
    <div className="h-screen flex bg-black text-white overflow-hidden font-sans">
      
      {/* MOBILE BACKDROP - Closes sidebar when clicking "empty space" */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[50] lg:hidden transition-all"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 w-72 bg-black border-r border-slate-900
        z-[60] transform transition-transform duration-500 ease-in-out flex flex-col
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* User Profile Info */}
        <div className="p-8 text-center border-b border-slate-900 bg-gradient-to-b from-slate-950 to-black">
          <div className="relative w-20 h-20 mx-auto mb-4 group">
            <div className="absolute inset-0 bg-blue-600 rounded-full blur-xl opacity-10 group-hover:opacity-30 transition-opacity"></div>
            <img
              src={profileImage}
              alt="User"
              className="relative w-full h-full rounded-full object-cover border-2 border-slate-800 shadow-2xl"
              onError={(e) => { (e.target as HTMLImageElement).src = '/profile/default.jpg' }}
            />
          </div>
          <h2 className="font-black italic uppercase text-lg tracking-tighter leading-none">{user.first_name}</h2>
          <p className="text-[9px] font-bold text-blue-500 uppercase tracking-[0.3em] mt-2">{user.role}</p>
        </div>

        {/* NAVIGATION - ALL FEATURES INCLUDED */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
          <SidebarLink href="/Dashboard" label="Dashboard" icon={<LayoutDashboard size={18} />} pathname={pathname} />
          
          {/* MEMBER FEATURES */}
          {user.role === 'member' && (
            <SidebarLink href="/Dashboard/suggestions" label="Suggestions" icon={<Lightbulb size={18} />} pathname={pathname} />
          )}

          {/* STAFF & ADMIN FEATURES */}
          {(user.role === 'staff' || user.role === 'admin') && (
            <>
              <div className="pt-6 pb-2 px-4 text-[10px] font-black text-slate-700 uppercase tracking-widest">Management</div>
              <SidebarLink href="/Dashboard/applications" label="Applications" icon={<FileText size={18} />} pathname={pathname} />
              <SidebarLink href="/Dashboard/talents" label="Talents" icon={<GraduationCap size={18} />} pathname={pathname} />
              <SidebarLink href="/Dashboard/mentorship" label="Mentorship" icon={<Briefcase size={18} />} pathname={pathname} />
              <SidebarLink href="/Dashboard/activities" label="Activities" icon={<Activity size={18} />} pathname={pathname} />
              <SidebarLink href="/Dashboard/suggestions" label="Suggestions" icon={<Lightbulb size={18} />} pathname={pathname} />
              <SidebarLink href="/Dashboard/news-events" label="News & Events" icon={<Newspaper size={18} />} pathname={pathname} />
              <SidebarLink href="/Dashboard/information-center" label="Information Center" icon={<Info size={18} />} pathname={pathname} />
              <SidebarLink href="/Dashboard/messages" label="Messages" icon={<MessageSquare size={18} />} pathname={pathname} />
            </>
          )}

          {/* ADMIN ONLY */}
          {user.role === 'admin' && (
            <>
              <div className="pt-6 pb-2 px-4 text-[10px] font-black text-slate-700 uppercase tracking-widest">Administration</div>
              <SidebarLink href="/Dashboard/users" label="Users" icon={<Users size={18} />} pathname={pathname} />
            </>
          )}
        </nav>

        {/* LOGOUT */}
        <div className="p-4 border-t border-slate-900">
          <button 
            onClick={logout} 
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-500 font-bold uppercase tracking-widest text-[11px] hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 bg-black overflow-hidden relative">
        
        {/* HEADER */}
        <header className="h-20 px-8 flex items-center justify-between border-b border-slate-900 bg-black/50 backdrop-blur-md z-40">
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-white p-2 hover:bg-slate-900 rounded-lg transition" onClick={() => setSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <h1 className="font-black uppercase italic text-2xl tracking-tighter">
              {pathname === '/Dashboard' ? 'Dashboard' : pathname.split('/').pop()?.replace('-', ' ')}
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="hidden sm:flex flex-col items-end">
                <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest leading-none">Status</span>
                <span className="text-[11px] font-bold text-slate-500 uppercase">Live Connection</span>
             </div>
             <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_#3b82f6]"></div>
          </div>
        </header>

        {/* PAGE BODY - Fixed centering and scrolling */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-12 custom-scrollbar scroll-smooth">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

function SidebarLink({ href, label, icon, pathname }: any) {
  const active = pathname === href
  return (
    <Link href={href} className={`
      flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group
      ${active 
        ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' 
        : 'text-slate-500 hover:text-white hover:bg-slate-900'}
    `}>
      <span className={`${active ? 'text-white' : 'group-hover:text-blue-500 transition-colors duration-300'}`}>{icon}</span>
      <span className="text-[11px] font-black uppercase tracking-widest">{label}</span>
    </Link>
  )
}