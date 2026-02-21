'use client';

import { useState, useEffect } from 'react';

const categories = [
  'organization',
  'event',
  'location',
  'official_person',
  'individual',
  'asset',
];

interface InfoItem {
  id: number
  category: string
  name: string
  content: string
  summary?: string
  location?: string
  date_start?: string
  date_end?: string
  contact_person?: string
  contact_email?: string
  contact_phone?: string
  address?: string
  image?: string
  attachment?: string
  is_published: boolean
  slug: string
}

export default function InformationCenterAdmin() {
  const [items, setItems] = useState<InfoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Partial<InfoItem>>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    try {
      setLoading(true);
      const res = await fetch('/api/information-center');
      if (!res.ok) throw new Error('Failed to fetch');
      setItems(await res.json());
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    try {
      const method = editingId ? 'PATCH' : 'POST';
      const url = editingId ? `/api/information-center/${editingId}` : '/api/information-center';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save');
      }

      resetForm();
      fetchItems();
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function remove(id: number) {
    if (!confirm('Delete this entry?')) return;

    try {
      const res = await fetch(`/api/information-center/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      fetchItems();
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function edit(id: number) {
    try {
      const res = await fetch(`/api/information-center/${id}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const item = await res.json();
      setForm(item);
      setEditingId(id);
    } catch (err: any) {
      setError(err.message);
    }
  }

  function resetForm() {
    setForm({});
    setEditingId(null);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setForm(prev => ({
      ...prev,
      [e.target.name]: value
    }));
  }

  if (loading) return <p className="text-slate-400">Loading entries...</p>;

  return (
    <div className="space-y-8 max-w-full"> {/* Widened to full width */}
      <h1 className="text-2xl font-bold">Information Center Management</h1>

      {error && <p className="text-red-400">{error}</p>}

      {/* Create/Edit Form */}
      <form onSubmit={handleSubmit} className="bg-slate-900 p-6 rounded-xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Category</label>
            <select
              name="category"
              value={form.category || ''}
              onChange={handleChange}
              className="w-full p-2 bg-slate-800 border border-slate-700 rounded"
              required
            >
              <option value="">Select category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat.replace('_', ' ').toUpperCase()}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">Name / Title</label>
            <input
              name="name"
              value={form.name || ''}
              onChange={handleChange}
              className="w-full p-2 bg-slate-800 border border-slate-700 rounded"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1">Summary (optional)</label>
          <textarea
            name="summary"
            value={form.summary || ''}
            onChange={handleChange}
            className="w-full p-2 bg-slate-800 border border-slate-700 rounded h-20"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Main Content</label>
          <textarea
            name="content"
            value={form.content || ''}
            onChange={handleChange}
            className="w-full p-2 bg-slate-800 border border-slate-700 rounded h-48"
            required
          />
        </div>

        {/* Additional fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Location (optional)</label>
            <input
              name="location"
              value={form.location || ''}
              onChange={handleChange}
              className="w-full p-2 bg-slate-800 border border-slate-700 rounded"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Start Date (optional)</label>
            <input
              name="date_start"
              type="date"
              value={form.date_start || ''}
              onChange={handleChange}
              className="w-full p-2 bg-slate-800 border border-slate-700 rounded"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">End Date (optional)</label>
            <input
              name="date_end"
              type="date"
              value={form.date_end || ''}
              onChange={handleChange}
              className="w-full p-2 bg-slate-800 border border-slate-700 rounded"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Contact Person (optional)</label>
            <input
              name="contact_person"
              value={form.contact_person || ''}
              onChange={handleChange}
              className="w-full p-2 bg-slate-800 border border-slate-700 rounded"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Contact Email (optional)</label>
            <input
              name="contact_email"
              type="email"
              value={form.contact_email || ''}
              onChange={handleChange}
              className="w-full p-2 bg-slate-800 border border-slate-700 rounded"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Contact Phone (optional)</label>
            <input
              name="contact_phone"
              value={form.contact_phone || ''}
              onChange={handleChange}
              className="w-full p-2 bg-slate-800 border border-slate-700 rounded"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1">Address (optional)</label>
          <textarea
            name="address"
            value={form.address || ''}
            onChange={handleChange}
            className="w-full p-2 bg-slate-800 border border-slate-700 rounded h-20"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="is_published"
            checked={form.is_published ?? true}
            onChange={handleChange}
            id="published"
          />
          <label htmlFor="published">Publish immediately</label>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-sky-600 hover:bg-sky-700 px-6 py-3 rounded-lg font-medium"
          >
            {editingId ? 'Update' : 'Create'} Entry
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded-lg font-medium"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {/* List of Entries */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Existing Entries</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(item => (
            <div key={item.id} className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-xs text-slate-400 capitalize">{item.category.replace('_', ' ')}</p>
              <p className="text-sm">{item.summary?.slice(0, 100) || item.content.slice(0, 100)}...</p>
              <p className="text-xs text-slate-400">Published: {item.is_published ? 'Yes' : 'No'}</p>

              <div className="flex gap-2">
                <button
                  onClick={() => edit(item.id)}
                  className="px-3 py-1 text-xs bg-blue-600 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => remove(item.id)}
                  className="px-3 py-1 text-xs bg-red-600 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}