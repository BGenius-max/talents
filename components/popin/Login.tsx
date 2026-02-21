'use client'

import { useState } from 'react'
import Swal from 'sweetalert2'

type LoginProps = {
  onClose: () => void
}

export default function Login({ onClose }: LoginProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const isValid = /^\S+@\S+\.\S+$/.test(email.trim()) && password.length >= 6

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!isValid || loading) return

    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim(), password }),
      })

      let data
      try {
        data = await res.json()
      } catch {
        data = {}
      }

      if (res.ok && data?.success) {
        // Success feedback
        Swal.fire({
          title: 'Success!',
          text: 'You have been logged in',
          icon: 'success',
          timer: 1800,
          showConfirmButton: false,
        })

        // Redirect after short delay (give Swal time to show)
        setTimeout(() => {
          window.location.href = '/Dashboard' // or wherever your dashboard is
        }, 1800)
      } else {
        const message =
          data?.error ||
          data?.message ||
          'Invalid email or password. Please try again.'
        setError(message)
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('Something went wrong. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-slate-900 text-white rounded-2xl w-full max-w-md p-6 sm:max-w-lg sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh] border border-slate-700"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6">Welcome Back</h2>

        {/* Error message */}
        {error && (
          <div className="bg-red-900/40 border border-red-600 text-red-300 p-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        {/* Email */}
        <div className="mb-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            className="input w-full"
            required
            autoComplete="email"
            autoFocus
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="input w-full"
            required
            autoComplete="current-password"
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={!isValid || loading}
          className={`w-full py-3 rounded-xl font-semibold text-lg transition-all ${
            isValid && !loading
              ? 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800'
              : 'bg-slate-700 cursor-not-allowed opacity-70'
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
              Signing in...
            </span>
          ) : (
            'Login'
          )}
        </button>

        {/* Cancel */}
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="w-full mt-4 text-sm text-slate-400 hover:text-slate-300 transition"
        >
          Cancel
        </button>
      </form>
    </div>
  )
}