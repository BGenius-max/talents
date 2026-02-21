'use client'

import { useState } from 'react'
import Swal from 'sweetalert2'
import Image from 'next/image'

export default function RegisterTalent() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [consent, setConsent] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)

  const [form, setForm] = useState({
    full_name: '',
    email: '',
    region: '',
    category: '',
    description: '',
    sample: null as File | null,
  })

  // Validation
  const step1Valid =
    form.full_name.trim().length >= 3 &&
    form.email.trim().includes('@') &&
    form.region.trim().length >= 2

  const step2Valid =
    form.category.length > 0 &&
    form.description.trim().length >= 20

  // Predefined categories
  const TALENT_CATEGORIES = [
    'Arts & Culture',
    'Sports',
    'Technology & Innovation',
    'Academics & Research',
    'Leadership & Civic Engagement',
    'Health & Wellness',
  ]

  const update = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const updateFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setForm(prev => ({ ...prev, sample: file }))

    // Show preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()

    if (!step1Valid || !step2Valid || !consent) {
      Swal.fire({
        title: 'Incomplete!',
        text: 'Please fill all required fields and agree to the terms.',
        icon: 'warning',
        confirmButtonText: 'OK',
      })
      return
    }

    setLoading(true)

    try {
      const data = new FormData()
      data.append('full_name', form.full_name)
      data.append('email', form.email)
      data.append('region', form.region)
      data.append('category', form.category)
      data.append('description', form.description)

      if (form.sample) {
        data.append('sample', form.sample)
      }

      const res = await fetch('/api/talents/register', {
        method: 'POST',
        body: data,
      })

      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.message || 'Registration failed')
      }

      Swal.fire({
        title: 'Success!',
        text: result.message || 'Talent registered successfully.',
        icon: 'success',
        confirmButtonText: 'Great!',
      })

      // Reset form
      setForm({
        full_name: '',
        email: '',
        region: '',
        category: '',
        description: '',
        sample: null,
      })

      setPreview(null)
      setConsent(false)
      setStep(1)
    } catch (err: any) {
      Swal.fire({
        title: 'Error',
        text: err.message || 'Something went wrong',
        icon: 'error',
        confirmButtonText: 'Try Again',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black flex items-center justify-center px-4 py-12">
      <form
        onSubmit={submit}
        className="w-full max-w-2xl bg-slate-900/90 backdrop-blur-lg border border-slate-800 rounded-2xl p-8 shadow-2xl"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-2 text-white">
          Register Your Talent
        </h1>
        <p className="text-center text-slate-400 mb-8">
          Step {step} of 3 • Share your unique gift with the world
        </p>

        {/* Progress bar */}
        <div className="flex justify-center gap-4 mb-10">
          {[1, 2, 3].map(n => (
            <div
              key={n}
              className={`w-12 h-1.5 rounded-full transition-all duration-300 ${
                step >= n ? 'bg-indigo-500 shadow-md shadow-indigo-500/30' : 'bg-slate-700'
              }`}
            />
          ))}
        </div>

        {/* STEP 1 - Personal Info */}
        {step === 1 && (
          <section className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Full Name <span className="text-red-400">*</span>
              </label>
              <input
                name="full_name"
                value={form.full_name}
                onChange={update}
                placeholder="Your full name"
                className="input bg-slate-900 text-white border border-slate-700 focus:border-indigo-500"
                required
              />
            </div>

            {/* Email field */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email (Membership Email) <span className="text-red-400">*</span>
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={update}
                placeholder="Enter your registered member email"
                className="input bg-slate-900 text-white border border-slate-700 focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                County / Region <span className="text-red-400">*</span>
              </label>
              <input
                name="region"
                value={form.region}
                onChange={update}
                placeholder="e.g. Nairobi, Kisumu, Mombasa..."
                className="input bg-slate-900 text-white border border-slate-700 focus:border-indigo-500"
                required
              />
            </div>

            <button
              type="button"
              disabled={!step1Valid}
              onClick={() => setStep(2)}
              className={`w-full py-3.5 rounded-xl font-semibold transition-all ${
                step1Valid
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20'
                  : 'bg-slate-700 text-slate-400 cursor-not-allowed'
              }`}
            >
              Continue to Talent Details →
            </button>
          </section>
        )}

        {/* STEP 2 - Talent Details */}
        {step === 2 && (
          <section className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Talent Category <span className="text-red-400">*</span>
              </label>
              <select
                name="category"
                value={form.category}
                onChange={update}
                className="input bg-slate-900 text-white border border-slate-700 focus:border-indigo-500"
                required
              >
                <option value="" disabled>
                  Select Talent Category
                </option>
                {TALENT_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Describe Your Talent <span className="text-red-400">*</span>
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={update}
                placeholder="Tell us about your talent, skills, experience, achievements... (minimum 20 characters)"
                className="input bg-slate-900 text-white border border-slate-700 focus:border-indigo-500 h-32 resize-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Upload Sample (photo or short video)
              </label>
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={updateFile}
                  className="block w-full text-sm text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-slate-800 file:text-white hover:file:bg-slate-700 cursor-pointer"
                />
                {preview && (
                  <div className="w-24 h-24 relative rounded-lg overflow-hidden border border-slate-700">
                    <Image src={preview} alt="Preview" fill className="object-cover" />
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full sm:w-auto py-3.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-semibold transition"
              >
                ← Back
              </button>
              <button
                type="button"
                disabled={!step2Valid}
                onClick={() => setStep(3)}
                className={`w-full sm:w-auto py-3.5 px-8 rounded-xl font-semibold transition ${
                  step2Valid
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20'
                    : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                }`}
              >
                Review & Submit →
              </button>
            </div>
          </section>
        )}

        {/* STEP 3 - Confirmation */}
        {step === 3 && (
          <section className="space-y-6 text-center">
            <h2 className="text-2xl font-bold text-indigo-400">Almost There!</h2>
            <p className="text-slate-300">
              Please review your information and confirm it's accurate.
            </p>

            <div className="bg-slate-800/50 p-6 rounded-xl text-left space-y-4">
              <div>
                <span className="text-slate-400 block text-sm">Name</span>
                <p className="font-medium">{form.full_name || '—'}</p>
              </div>
              <div>
                <span className="text-slate-400 block text-sm">Region</span>
                <p className="font-medium">{form.region || '—'}</p>
              </div>
              <div>
                <span className="text-slate-400 block text-sm">Category</span>
                <p className="font-medium">{form.category || '—'}</p>
              </div>
              <div>
                <span className="text-slate-400 block text-sm">Description</span>
                <p className="text-sm">{form.description || '—'}</p>
              </div>
              {preview && (
                <div>
                  <span className="text-slate-400 block text-sm mb-2">Sample Preview</span>
                  <div className="w-32 h-32 relative rounded-lg overflow-hidden border border-slate-700 mx-auto">
                    <Image src={preview} alt="Preview" fill className="object-cover" />
                  </div>
                </div>
              )}
            </div>

            <label className="flex items-center justify-center gap-3 text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={consent}
                onChange={e => setConsent(e.target.checked)}
                className="w-5 h-5 accent-indigo-600"
              />
              <span>
                I confirm all information is accurate and agree to the{' '}
                <span className="text-indigo-400 hover:underline cursor-pointer">
                  ethical data usage policy
                </span>
              </span>
            </label>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full py-3.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-semibold transition"
              >
                ← Back to Edit
              </button>

              <button
                type="submit"
                disabled={!consent || loading}
                className={`w-full py-3.5 rounded-xl font-bold transition-all ${
                  consent && !loading
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-500/30'
                    : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                      />
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  'Submit Talent Registration'
                )}
              </button>
            </div>
          </section>
        )}
      </form>
    </div>
  )
}