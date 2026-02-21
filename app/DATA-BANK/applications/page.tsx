// Public Application Submission Page: app/applications/page.tsx
'use client';

import { useState } from 'react';

export default function ApplicationsPage() {
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const data = new FormData(form);

    const res = await fetch('/api/applications', {
      method: 'POST',
      body: data,
    });

    setLoading(false);

    if (res.ok) {
      alert('Application submitted successfully');
      form.reset();
    } else {
      const errorData = await res.json();
      alert(errorData.error || 'Submission failed');
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex justify-center px-4 py-16">
      <form
        onSubmit={submit}
        className="w-full max-w-3xl bg-slate-900 rounded-2xl p-8 space-y-6 shadow-xl"
      >
        <h1 className="text-3xl font-bold text-center">
          Application Form
        </h1>

        {/* NAME */}
        <input
          name="full_name"
          required
          placeholder="Full Name"
          className="input w-full bg-slate-800 border border-slate-700 p-3 rounded focus:outline-none focus:border-indigo-600"
        />

        {/* EMAIL */}
        <input
          name="email"
          type="email"
          placeholder="Email Address"
          className="input w-full bg-slate-800 border border-slate-700 p-3 rounded focus:outline-none focus:border-indigo-600"
        />

        {/* PHONE */}
        <input
          name="phone"
          placeholder="Phone Number"
          className="input w-full bg-slate-800 border border-slate-700 p-3 rounded focus:outline-none focus:border-indigo-600"
        />

        {/* APPLYING FOR */}
        <select
          name="apply_for"
          required
          className="input w-full bg-slate-800 border border-slate-700 p-3 rounded focus:outline-none focus:border-indigo-600 text-white"
        >
          <option value="">Select Application Type</option>
          <option value="job">Job</option>
          <option value="bursary">Bursary</option>
          <option value="charity">Charity</option>
          <option value="funding">Funding</option>
        </select>

        {/* DESCRIPTION */}
        <textarea
          name="description"
          required
          placeholder="Explain what you are applying for"
          className="input w-full h-36 bg-slate-800 border border-slate-700 p-3 rounded focus:outline-none focus:border-indigo-600"
        />

        {/* PHOTO */}
        <input
          type="file"
          name="photo"
          accept="image/*"
          className="block w-full text-sm text-slate-300
            file:mr-4 file:py-2 file:px-4
            file:rounded-lg file:border-0
            file:bg-slate-800 file:text-white
            hover:file:bg-slate-700"
        />

        {/* SUBMIT */}
        <button
          disabled={loading}
          className={`w-full py-3 rounded-xl font-semibold transition
            ${loading
              ? 'bg-slate-600 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700'}
          `}
        >
          {loading ? 'Submitting...' : 'Submit Application'}
        </button>
      </form>
    </div>
  );
}