'use client'

import Image from 'next/image'
import { motion, type Variants } from 'framer-motion'

const boardMembers = [
  {
    id: 'chairperson',
    name: 'Harbert Ponyochi Kunyobo',
    position: 'Chairperson',
    phone: '+254 729 706 770',
    image: '/profile/chairman.png',
  },
  {
    id: 'secretary',
    name: 'Gloria Ocholi Kunyobo',
    position: 'Secretary',
    phone: '+254 727 900 735',
    image: '/profile/secretary.png',
  },
  {
    id: 'treasurer',
    name: 'Michel Wetindi Kunyobo',
    position: 'Treasurer',
    phone: '+254 740 860 976',
    image: '/profile/treasurer.png',
  },
  {
    id: 'member-jacob',
    name: 'Jacob Jumbi Owen',
    position: 'Board Member',
    phone: '+254 740 177 870',
    image: '/profile/member1.png',
  },
  {
    id: 'member-laban',
    name: 'Laban Wesonga Akhonya',
    position: 'Board Member',
    phone: '+254 723 300 847',
    image: '/profile/member2.png',
  },
  {
    id: 'member-vacant-1',
    name: '',
    position: 'Board Member',
    phone: '',
    image: '/profile/member2.png',
  },
  {
    id: 'member-vacant-2',
    name: '',
    position: 'Board Member',
    phone: '',
    image: '/profile/member3.png',
  },
]

/* ---------------- ANIMATION VARIANTS ---------------- */

const heroVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  },
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
}

/* ---------------- PAGE ---------------- */

export default function BoardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white overflow-x-hidden">
      {/* HERO */}
      <motion.section
        className="bg-indigo-700 text-white py-16 md:py-24"
        initial="hidden"
        animate="visible"
        variants={heroVariants}
      >
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Board of Management
          </h1>
          <p className="text-lg md:text-xl opacity-90 max-w-3xl mx-auto">
            Meet the dedicated leaders guiding Talents & Impact toward a brighter
            future for youth and communities.
          </p>
        </div>
      </motion.section>

      {/* BOARD MEMBERS */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 md:gap-10"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {boardMembers.map((member, index) => (
            <motion.div
              key={member.id}
              layout={false}
              variants={cardVariants}
              className="group bg-white rounded-2xl border border-gray-100
                         shadow-lg hover:shadow-2xl transition-shadow duration-300
                         overflow-hidden"
            >
              {/* IMAGE */}
              <div className="relative h-48 flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50 p-6">
                <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-xl group-hover:scale-105 transition-transform duration-500">
                  <Image
                    src={member.image || '/placeholder-avatar.png'}
                    alt={member.name || 'Board member'}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 160px, 200px"
                    priority={index < 2}
                  />
                </div>
              </div>

              {/* INFO */}
              <div className="p-6 text-center">
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {member.name || 'Board Member'}
                </h3>
                <p className="text-indigo-600 font-medium mb-3">
                  {member.position}
                </p>

                {member.phone && (
                  <a
                    href={`tel:${member.phone.replace(/\s/g, '')}`}
                    className="inline-flex items-center gap-2 text-gray-600 text-sm
                               hover:text-indigo-700 transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    {member.phone}
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  )
}
