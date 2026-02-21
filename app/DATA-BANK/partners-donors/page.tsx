export default function PartnersDonorsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-16">
      <div className="max-w-6xl mx-auto space-y-16">

        {/* HEADER */}
        <section className="text-center">
          <h1 className="text-4xl font-bold mb-4">
            Partners & Donors
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            We collaborate with organizations, institutions, and individuals
            who believe in ethical talent development and community impact.
          </p>
        </section>

        {/* PARTNERS */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Our Partners</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div
                key={i}
                className="bg-slate-900 border border-slate-800 rounded-xl p-6"
              >
                <div className="h-12 w-12 bg-slate-800 rounded mb-4" />
                <h3 className="font-semibold mb-2">
                  Partner Organization
                </h3>
                <p className="text-sm text-slate-400">
                  Description of partnership, goals, and impact.
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* DONORS */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Donors</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div
                key={i}
                className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center"
              >
                <div className="h-10 w-10 bg-slate-800 rounded-full mx-auto mb-3" />
                <p className="text-sm font-medium">
                  Donor Name
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <h3 className="text-xl font-semibold mb-3">
            Become a Partner or Donor
          </h3>
          <p className="text-slate-400 mb-6">
            Join us in empowering talents and transforming communities.
          </p>
          <a
            href="/CONTACT-US"
            className="inline-block px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-semibold"
          >
            Contact Us
          </a>
        </section>

      </div>
    </div>
  )
}
