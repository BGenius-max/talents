export default function ImpactStoriesPage() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Impact Stories</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {[1,2,3].map(i => (
          <div key={i} className="border rounded-xl overflow-hidden">
            <div className="h-40 bg-slate-200" />
            <div className="p-4">
              <h3 className="font-semibold">Talent to Opportunity</h3>
              <p className="text-sm text-slate-600">
                A journey from identification to impact.
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
