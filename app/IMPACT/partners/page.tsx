export default function PartnersPage() {
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold">Our Partners</h1>

      <p>
        We collaborate with institutions, donors, and sponsors to unlock
        opportunities and scale impact.
      </p>

      <div className="grid md:grid-cols-3 gap-6">
        <PartnerCard name="Global Foundation" />
        <PartnerCard name="Tech for Good Initiative" />
        <PartnerCard name="Youth Development Trust" />
      </div>
    </div>
  )
}

function PartnerCard({ name }: { name: string }) {
  return (
    <div className="border rounded-xl p-6 text-center">
      <div className="h-16 bg-slate-200 mb-3 rounded" />
      <h3 className="font-semibold">{name}</h3>
    </div>
  )
}
