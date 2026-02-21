export default function CategoriesPage() {
  const categories = [
    { name: 'Arts & Culture', count: 320 },
    { name: 'Sports', count: 210 },
    { name: 'Technology & Innovation', count: 180 },
  ]

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Talent Categories</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {categories.map(c => (
          <div key={c.name} className="border rounded-xl p-6">
            <h3 className="font-semibold">{c.name}</h3>
            <p className="text-slate-500">{c.count} registered talents</p>
          </div>
        ))}
      </div>
    </div>
  )
}
