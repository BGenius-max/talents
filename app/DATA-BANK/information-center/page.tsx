'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function InformationCenterPublic() {
  const [items, setItems] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch('/api/information-center');

        if (!res.ok) {
          const errorText = await res.text().catch(() => 'No details available');
          console.error(`API returned error ${res.status}: ${errorText}`);
          throw new Error(`Server error ${res.status}: ${errorText}`);
        }

        const data = await res.json();

        // Ensure we always have an array
        const safeItems = Array.isArray(data) ? data : [];
        setItems(safeItems);

        if (safeItems.length === 0) {
          console.log('No published items found in information_center');
        }
      } catch (err: any) {
        console.error('Failed to load Information Center:', err);
        setError(
          err.message?.includes('500')
            ? 'Server error — something went wrong on the backend. Please try again later.'
            : err.message || 'Could not load the information center'
        );
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Safe filtering
  const filteredItems = Array.isArray(items)
    ? items.filter((item) => {
        const searchLower = search.toLowerCase().trim();
        const matchesSearch =
          (item?.name?.toLowerCase()?.includes(searchLower) ?? false) ||
          (item?.summary?.toLowerCase()?.includes(searchLower) ?? false) ||
          (item?.content?.toLowerCase()?.includes(searchLower) ?? false);

        const matchesCategory =
          !categoryFilter || item?.category === categoryFilter;

        return matchesSearch && matchesCategory;
      })
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-10 bg-gradient-to-r from-sky-400 to-indigo-500 bg-clip-text text-transparent">
          Information Center
        </h1>

        {/* Loading */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
            <p className="mt-4 text-slate-400">Loading entries...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="max-w-2xl mx-auto bg-red-900/40 border border-red-700 text-red-200 px-6 py-8 rounded-xl text-center">
            <p className="font-medium text-lg mb-2">Something went wrong</p>
            <p>{error}</p>
            <p className="mt-3 text-sm text-red-300">
              The server returned an error (500). Please check the backend logs or try again later.
            </p>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Search + Filter */}
            <div className="max-w-4xl mx-auto mb-12 flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                placeholder="Search by name, summary or content..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 px-5 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition"
              />

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-5 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition"
              >
                <option value="">All Categories</option>
                <option value="organization">Organization</option>
                <option value="event">Event</option>
                <option value="location">Location / Area</option>
                <option value="official_person">Official Person</option>
                <option value="individual">Individual</option>
                <option value="asset">Asset</option>
              </select>
            </div>

            {/* Results */}
            {filteredItems.length === 0 ? (
              <div className="text-center py-20 text-slate-400">
                <p className="text-xl font-medium">
                  {search || categoryFilter
                    ? 'No matching entries found'
                    : 'No published information available yet'}
                </p>
                <p className="mt-3 text-sm">
                  {search || categoryFilter
                    ? 'Try different search terms or clear the filter'
                    : 'Staff will add entries soon — check back later!'}
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-sky-600/50 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-sky-900/20"
                  >
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-white mb-2 line-clamp-2">
                        {item.name || 'Untitled Entry'}
                      </h3>

                      <p className="text-sm text-sky-400 capitalize mb-3">
                        {item.category?.replace('_', ' ') || 'Uncategorized'}
                      </p>

                      {item.summary && (
                        <p className="text-slate-300 mb-4 line-clamp-3">
                          {item.summary}
                        </p>
                      )}

                      <Link
                        href={`/information-center/${item.slug || item.id}`}
                        className="inline-flex items-center text-sky-400 hover:text-sky-300 font-medium transition gap-1"
                      >
                        Read more
                        <span aria-hidden="true">→</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}