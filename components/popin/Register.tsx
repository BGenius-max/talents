'use client'

import { useState, useEffect } from 'react'
import Swal from 'sweetalert2'

type RegisterProps = {
  onClose: () => void
}

export default function Register({ onClose }: RegisterProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [paypalReady, setPaypalReady] = useState(false)

  const [form, setForm] = useState({
    first_name: '',
    second_name: '',
    email: '',
    phone: '',
    address: '',
    gender: '',
    inspiration: '',           // kept in form state (UI field name)
    password: '',
    password_confirm: '',
  })

  // Wait for PayPal SDK to load
  useEffect(() => {
    if (typeof window !== 'undefined' && window.paypal) {
      setPaypalReady(true)
    }
  }, [])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errorMsg) setErrorMsg(null)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPhotoFile(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const passwordsMatch = form.password.length >= 6 && form.password === form.password_confirm

  const isValid =
    !!form.first_name.trim() &&
    !!form.second_name.trim() &&
    /^\S+@\S+\.\S+$/.test(form.email.trim()) &&
    !!form.phone.trim() &&
    !!form.address.trim() &&
    !!form.gender &&
    !!form.inspiration.trim() &&
    passwordsMatch &&
    !!photoFile

  // Create PayPal order and render buttons
  const initiatePayment = async () => {
    if (!paypalReady || !window.paypal) {
      Swal.fire({
        title: 'Payment Not Ready',
        text: 'PayPal is still loading. Please wait a moment and try again.',
        icon: 'warning',
      })
      return
    }

    setLoading(true)

    try {
      // 1. Create order on your backend
      const orderRes = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: '3.00',
          description: 'Talent & Impact Registration Fee',
        }),
      })

      const orderData = await orderRes.json()

      if (!orderRes.ok) {
        const errorMessage =
          typeof orderData.error === 'string'
            ? orderData.error
            : orderData?.details?.message || 'Failed to create PayPal order'
        throw new Error(errorMessage)
      }

      // 2. Render PayPal buttons
      const paypalButtons = window.paypal.Buttons({
        createOrder: () => orderData.id,

        onApprove: async (data: { orderID: string }) => {
          try {
            // Capture the payment
            const captureRes = await fetch('/api/paypal/capture-order', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ orderID: data.orderID }),
            })

            const captureData = await captureRes.json()

            // FIX: Check for the 'status' field at the top level
            if (!captureRes.ok || captureData.status !== 'COMPLETED') {
              throw new Error(captureData.error || 'Payment verification failed')
            }

            // Payment successful → proceed to registration
            await completeRegistration()
          } catch (captureErr: any) {
            console.error('Capture error:', captureErr)
            Swal.fire({
              title: 'Payment Confirmation Failed',
              text: captureErr.message || 'We could not verify your payment.',
              icon: 'error',
            })
          }
        },

        onCancel: () => {
          Swal.fire({
            title: 'Payment Cancelled',
            text: 'You cancelled the payment. Registration was not completed.',
            icon: 'info',
          })
        },

        onError: (err: any) => {
          console.error('PayPal error:', err)
          Swal.fire({
            title: 'Payment Failed',
            text:
              err.message ||
              'There was an issue processing your payment. Please try again.',
            icon: 'error',
          })
        },
      })

      await paypalButtons.render('#paypal-button-container')
    } catch (err: any) {
      console.error('Payment initiation failed:', err)
      Swal.fire({
        title: 'Payment Error',
        text: err.message || 'Unable to start payment process. Please try again.',
        icon: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  // Actual registration after successful payment
  const completeRegistration = async () => {
    setLoading(true)
    setErrorMsg(null)

    const formData = new FormData()

    formData.append('first_name', form.first_name)
    formData.append('second_name', form.second_name)
    formData.append('email', form.email)
    formData.append('phone', form.phone)
    formData.append('address', form.address)
    formData.append('gender', form.gender)
    // FIX: Match backend expectation 'aspiration'
    formData.append('aspiration', form.inspiration)
    formData.append('password', form.password)
    formData.append('password_confirm', form.password_confirm)
    formData.append('role', 'member')

    if (photoFile) {
      formData.append('image', photoFile)
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (res.ok && data?.success) {
        Swal.fire({
          title: 'Success!',
          text: 'Payment & registration completed successfully',
          icon: 'success',
          timer: 2200,
          showConfirmButton: false,
        })
        onClose()
      } else {
        throw new Error(data?.message || 'Registration failed after payment')
      }
    } catch (err: any) {
      console.error('Registration error:', err)
      const msg = err.message || 'Registration failed'
      setErrorMsg(msg)
      Swal.fire('Error', msg, 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!isValid || loading) return

    // Start PayPal payment flow
    await initiatePayment()
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-slate-900 text-white rounded-2xl w-full max-w-md p-6 sm:max-w-lg sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh] border border-slate-700"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6">Create Account</h2>

        {/* Photo upload */}
        <div className="flex justify-center mb-6">
          <label className="cursor-pointer group">
            <input
              type="file"
              name="image"
              hidden
              accept="image/*"
              onChange={handleImageChange}
            />
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-slate-600 bg-slate-800 overflow-hidden flex items-center justify-center transition-all group-hover:border-indigo-500">
              {preview ? (
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-sm text-slate-400 text-center px-3 leading-tight">
                  Upload Photo
                </span>
              )}
            </div>
          </label>
        </div>

        {/* Form fields */}
        <div className="space-y-4">
          <input
            name="first_name"
            value={form.first_name}
            onChange={handleChange}
            placeholder="First Name"
            className="input"
            required
          />
          <input
            name="second_name"
            value={form.second_name}
            onChange={handleChange}
            placeholder="Second Name"
            className="input"
            required
          />
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email Address"
            className="input"
            required
          />
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            className="input"
            required
          />
          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Address"
            className="input"
            required
          />
          <select name="gender" value={form.gender} onChange={handleChange} className="input" required>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <textarea
            name="inspiration"
            value={form.inspiration}
            onChange={handleChange}
            placeholder="Your aspiration / motivation"
            className="input min-h-[80px]"
            required
          />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password (min. 6 characters)"
            className="input"
            required
            minLength={6}
          />
          <input
            type="password"
            name="password_confirm"
            value={form.password_confirm}
            onChange={handleChange}
            placeholder="Confirm Password"
            className="input"
            required
          />

          {!passwordsMatch && form.password_confirm && (
            <p className="text-sm text-red-400 text-center">Passwords do not match</p>
          )}

          {errorMsg && (
            <p className="text-sm text-red-400 text-center bg-red-950/30 py-2 px-3 rounded">
              {errorMsg}
            </p>
          )}
        </div>

        {/* PayPal Button Container */}
        <div id="paypal-button-container" className="mt-6 min-h-[50px]"></div>

        <button
          type="submit"
          disabled={!isValid || loading || !paypalReady}
          className={`w-full mt-4 py-3 rounded-xl font-semibold text-lg transition-all ${
            isValid && !loading && paypalReady
              ? 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800'
              : 'bg-slate-700 cursor-not-allowed opacity-70'
          }`}
        >
          {loading
            ? 'Processing...'
            : paypalReady
            ? 'Register ($3 fee)'
            : 'Loading PayPal...'}
        </button>

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