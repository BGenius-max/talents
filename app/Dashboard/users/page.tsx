'use client'

import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { Shield, Trash2, Mail, Search, Filter, X, Edit3, UserCheck, Settings2 } from 'lucide-react'

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  
  // Modal State
  const [editingUser, setEditingUser] = useState<any | null>(null)

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users')
      const data = await res.json()
      setUsers(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error("Fetch failed", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchUsers() }, [])

  const filteredUsers = users.filter(u => {
    const name = `${u.first_name} ${u.second_name}`.toLowerCase()
    const matchesSearch = name.includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === 'all' || u.role.toLowerCase() === roleFilter.toLowerCase()
    return matchesSearch && matchesRole
  })

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingUser)
      })
      if (res.ok) {
        Swal.fire({ title: 'Updated!', icon: 'success', toast: true, position: 'top-end', showConfirmButton: false, timer: 2000 })
        setEditingUser(null)
        fetchUsers()
      }
    } catch (err) {
      Swal.fire('Error', 'Update failed', 'error')
    }
  }

  const deleteUser = async (id: number, name: string) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: `Deleting ${name} is permanent.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Yes, Delete'
    })
    if (confirm.isConfirmed) {
      await fetch(`/api/users?id=${id}`, { method: 'DELETE' })
      fetchUsers()
    }
  }

  if (loading) return <div className="p-12 text-blue-500 font-black animate-pulse">LOADING USER DIRECTORY...</div>

  return (
    <div className="space-y-6 pb-20">
      {/* HEADER: Responsive layout */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <p className="text-blue-500 text-[10px] font-black uppercase tracking-[0.4em] mb-1">Administration</p>
          <h1 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter text-white">System Users</h1>
        </div>
        <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-full flex items-center gap-3">
           <UserCheck size={16} className="text-blue-500" />
           <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Verified: {users.length}</span>
        </div>
      </div>

      {/* SEARCH & FILTERS: Stack on mobile, row on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-slate-900/50 p-3 rounded-2xl border border-slate-800">
        <div className="md:col-span-8 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
          <input 
            type="text" 
            placeholder="Search users..."
            className="w-full bg-black border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm focus:border-blue-500 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="md:col-span-4 flex gap-2">
          <select 
            className="w-full bg-black border border-slate-800 rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-widest outline-none appearance-none cursor-pointer hover:border-slate-600"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="admin">Admins</option>
            <option value="staff">Staff</option>
            <option value="member">Members</option>
          </select>
        </div>
      </div>

      {/* USERS LIST: Responsive Cards */}
      <div className="grid grid-cols-1 gap-3">
        {filteredUsers.map((u) => (
          <div key={u.user_id} className="bg-slate-950 border border-slate-900 p-4 md:p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:border-slate-700 transition-all">
            <div className="flex items-center gap-4">
              <div className="shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center font-black text-blue-500 overflow-hidden">
                {u.photo ? <img src={`/profile/${u.photo}`} className="w-full h-full object-cover" /> : <span>{u.first_name[0]}</span>}
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-white uppercase tracking-tight truncate">{u.first_name} {u.second_name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded border ${
                    u.role === 'admin' ? 'border-red-900 bg-red-950/30 text-red-500' : 'border-slate-800 bg-slate-900 text-slate-400'
                  }`}>{u.role}</span>
                  <span className="text-slate-600 text-[10px] truncate max-w-[150px] md:max-w-none">{u.email}</span>
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex items-center justify-end gap-2 pt-4 md:pt-0 border-t md:border-t-0 border-slate-900">
              <button 
                onClick={() => setEditingUser(u)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white hover:bg-blue-600 transition-all text-[10px] font-black uppercase tracking-widest"
              >
                <Edit3 size={14} /> <span className="hidden sm:inline">Edit</span>
              </button>
              <button 
                onClick={() => deleteUser(u.user_id, u.first_name)}
                className="p-2.5 rounded-xl bg-slate-900 text-slate-600 hover:text-white hover:bg-red-600 transition-all"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* EDIT MODAL PANEL */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <form 
            onSubmit={handleUpdate}
            className="bg-slate-950 border border-slate-800 w-full max-w-lg rounded-3xl p-6 md:p-10 shadow-2xl space-y-6"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black uppercase italic tracking-tighter">Edit User</h2>
              <button type="button" onClick={() => setEditingUser(null)} className="text-slate-500 hover:text-white"><X /></button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-slate-500 ml-1">First Name</label>
                <input 
                  className="w-full bg-slate-900 border-none rounded-xl p-3 text-sm"
                  value={editingUser.first_name}
                  onChange={(e) => setEditingUser({...editingUser, first_name: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-slate-500 ml-1">Second Name</label>
                <input 
                  className="w-full bg-slate-900 border-none rounded-xl p-3 text-sm"
                  value={editingUser.second_name}
                  onChange={(e) => setEditingUser({...editingUser, second_name: e.target.value})}
                />
              </div>
              <div className="col-span-2 space-y-1">
                <label className="text-[9px] font-black uppercase text-slate-500 ml-1">Account Role</label>
                <select 
                  className="w-full bg-slate-900 border-none rounded-xl p-3 text-sm"
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                >
                  <option value="member">Member</option>
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-xl font-black uppercase tracking-widest text-xs shadow-lg shadow-blue-600/20 transition-all">
              Save Changes
            </button>
          </form>
        </div>
      )}
    </div>
  )
}