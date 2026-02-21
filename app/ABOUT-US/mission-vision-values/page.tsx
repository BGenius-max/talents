export default function MissionVisionPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16 md:py-24 space-y-16 md:space-y-20 bg-gradient-to-b from-gray-50 to-white">
      {/* Hero / Introduction */}
      <section className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          About Talents & Impact
        </h1>
        <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
          We are dedicated to nurturing a generation of confident, skilled, and ethical youth who are empowered to lead, innovate, and transform their communities for a better future.
        </p>
      </section>

      {/* Tagline + Motto */}
      <section className="text-center bg-indigo-600 text-white py-12 rounded-2xl shadow-lg">
        <p className="text-2xl md:text-3xl font-semibold italic mb-4">
          “Inspiring Youth. Igniting Potential.”
        </p>
        <p className="text-xl font-medium">
          Empowering the youth today for a greater tomorrow.
        </p>
      </section>

      {/* Vision */}
      <section className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Vision</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            To nurture a vibrant generation of confident, skilled, and ethical youth who are empowered to lead, innovate, and transform their communities for a better future.
          </p>
        </div>
        <div className="hidden md:block">
          <div className="bg-indigo-100 rounded-xl p-8 text-center">
            <p className="text-2xl font-semibold text-indigo-800">
              A society where every child and youth is safeguarded, educated, mentored, and empowered — regardless of background.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="grid md:grid-cols-2 gap-12 items-center">
        <div className="order-2 md:order-1">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Mission</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            To empower and inspire young people through holistic mentorship that nurtures economic independence, social responsibility, creative expression, entrepreneurial thinking, transformational leadership, and lifelong learning — equipping them to lead meaningful lives and build thriving communities.
          </p>
        </div>
        <div className="order-1 md:order-2">
          <div className="bg-green-50 rounded-xl p-8 text-center">
            <p className="text-2xl font-semibold text-green-800">
              Protecting, nurturing, and empowering children and youth for a responsible, self-reliant, and socially productive future.
            </p>
          </div>
        </div>
      </section>

      {/* Core Focus Areas */}
      <section>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-10">
          Core Focus Areas
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { title: "Mentorship & Leadership Training", icon: "🌟" },
            { title: "Economic Empowerment & Entrepreneurship", icon: "💼" },
            { title: "Social Development & Civic Responsibility", icon: "🤝" },
            { title: "Authorship & Creative Expression", icon: "✍️" },
            { title: "Health Support & Lifelong Learning", icon: "🩺" },
            { title: "Environmental & Climate Action", icon: "🌍" },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100"
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800">{item.title}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Closing Statement */}
      <section className="text-center py-12 bg-gray-100 rounded-2xl">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          Our Commitment
        </h2>
        <p className="text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed">
          We remain strictly non-political, non-partisan, and inclusive of all faiths, tribes, and communities — operating in full compliance with NGO laws while working with schools, faith institutions, and partners to reach and uplift every young person.
        </p>
      </section>
    </div>
  )
}