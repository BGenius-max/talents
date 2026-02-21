export default function StatisticsPage() {
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Talent & Beneficiary Statistics</h1>

      <ul className="list-disc pl-6 text-slate-700">
        <li>Total registered talents: 1,240</li>
        <li>Age range: 15–35 (aggregated)</li>
        <li>Gender distribution (aggregated)</li>
        <li>County-level distribution</li>
      </ul>

      <p className="text-sm text-slate-500">
        No personal or identifiable data is displayed.
      </p>
    </div>
  )
}
