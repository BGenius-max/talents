// app/about-us/page.tsx  (or wherever you want this page)
export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-indigo-700 text-white py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
            About Talents & Impact
          </h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto leading-relaxed">
            Learn about our organisation, leadership, and governance.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-24 space-y-20">
        {/* Introduction / Commitment */}
        <section className="text-center">
          <p className="text-lg md:text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
            We remain strictly non-political, non-partisan, and inclusive of all faiths, tribes, and communities — operating in full compliance with NGO laws while working with schools, faith institutions, and partners to reach and uplift every young person.
          </p>
        </section>

        {/* Objectives Section */}
        <section>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-12">
            Our Key Objectives
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
            {/* Group 1: Education & Scholarships */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <h3 className="text-2xl font-bold text-indigo-700 mb-6">
                Education & Scholarships
              </h3>
              <ul className="space-y-4 text-gray-700">
                <li>Provide scholarships and bursaries to vulnerable and bright children and youth across Kenya.</li>
                <li>Offer bursaries and scholarships.</li>
                <li>Establish a fully equipped community library that fosters a culture of reading and lifelong learning.</li>
                <li>Operate a computer and digital skills training center enhancing ICT capacity.</li>
              </ul>
            </div>

            {/* Group 2: Mentorship & Leadership */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <h3 className="text-2xl font-bold text-indigo-700 mb-6">
                Mentorship & Leadership
              </h3>
              <ul className="space-y-4 text-gray-700">
                <li>Establish youth mentorship programmes for guidance, character building, leadership, and career development.</li>
                <li>Develop and nurture talents among youth in music, art, sports, innovation, and leadership.</li>
                <li>Build a leadership and civic development institute for nurturing responsible leaders.</li>
                <li>Offer virtues and life skills training for responsible citizenship and moral grounding.</li>
              </ul>
            </div>

            {/* Group 3: Protection & Psychosocial */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <h3 className="text-2xl font-bold text-indigo-700 mb-6">
                Protection & Psychosocial Support
              </h3>
              <ul className="space-y-4 text-gray-700">
                <li>Promote and protect children’s rights, including freedom from abuse, child labor, early marriages, and neglect.</li>
                <li>Offer psychosocial support and rehabilitation for abused, abandoned, or emotionally distressed children and youth.</li>
                <li>Establish a children’s rescue and rehabilitation center offering safety and support for vulnerable children.</li>
              </ul>
            </div>

            {/* Group 4: Economic & Talent Development */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <h3 className="text-2xl font-bold text-indigo-700 mb-6">
                Economic & Talent Development
              </h3>
              <ul className="space-y-4 text-gray-700">
                <li>Empower youth through vocational training, entrepreneurship, and digital literacy for economic independence.</li>
                <li>Launch a youth-led book publishing unit promoting storytelling and literacy.</li>
                <li>Establish a vibrant talent and performing arts center for youth creative expression.</li>
                <li>Set up a youth-focused television station promoting education, values, and local talent.</li>
                <li>Establish a youth acting theatre and film lab for storytelling and career development.</li>
                <li>Encourage table banking and micro-financing.</li>
              </ul>
            </div>

            {/* Group 5: Health, Environment & Advocacy */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <h3 className="text-2xl font-bold text-indigo-700 mb-6">
                Health, Environment & Advocacy
              </h3>
              <ul className="space-y-4 text-gray-700">
                <li>Support health and wellness initiatives, including hygiene, mental health, nutrition, and reproductive education.</li>
                <li>Conserve environment and deal with climate change.</li>
                <li>Collaborate with local, national and international partners in advocating for child protection and youth empowerment policies.</li>
                <li>Advocate for youth-friendly policies and partnerships for sustainable youth development.</li>
                <li>Promote inclusion and participation of marginalized youth and children.</li>
                <li>Care for the most vulnerable youth in the community.</li>
              </ul>
            </div>

            {/* Group 6: Infrastructure & Media */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow md:col-span-2 lg:col-span-3">
              <h3 className="text-2xl font-bold text-indigo-700 mb-6">
                Infrastructure & Media Initiatives
              </h3>
              <ul className="grid md:grid-cols-2 gap-4 text-gray-700">
                <li>Establish a fully equipped community library that fosters reading and lifelong learning.</li>
                <li>Set up a youth-focused television station promoting education, values, and local talent.</li>
                <li>Create a business and health innovation hub offering entrepreneurship and wellness support.</li>
                <li>Establish a youth acting theatre and film lab for storytelling and career development.</li>
                <li>Operate a computer and digital skills training center enhancing ICT capacity.</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}