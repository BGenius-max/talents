"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import Login from "@/components/popin/Login"
import Register from "@/components/popin/Register"

// ────────────────────────────────────────
// HERO SLIDES
// ────────────────────────────────────────
const heroSlides = [
  {
    title: "Identifying Talents. Driving Impact.",
    subtitle: "Ethical, data-driven talents development and community transformation.",
    focus: "Mentorship & Leadership Training",
    image: "/photo/hero1.jpg",
  },
  {
    title: "Identifying Talents. Driving Impact.",
    subtitle: "Ethical, data-driven talents development and community transformation.",
    focus: "Economic Empowerment & Entrepreneurship",
    image: "/photo/hero2.jpg",
  },
  {
    title: "Identifying Talents. Driving Impact.",
    subtitle: "Ethical, data-driven talents development and community transformation.",
    focus: "Social Development & Civic Responsibility",
    image: "/photo/hero3.jpg",
  },
  {
    title: "Identifying Talents. Driving Impact.",
    subtitle: "Ethical, data-driven talents development and community transformation.",
    focus: "Authorship & Creative Expression",
    image: "/photo/hero4.jpg",
  },
  {
    title: "Identifying Talents. Driving Impact.",
    subtitle: "Ethical, data-driven talents development and community transformation.",
    focus: "Health Support & Lifelong Learning",
    image: "/photo/hero5.jpg",
  },
] as const

// ────────────────────────────────────────
// ANIMATION VARIANTS
// ────────────────────────────────────────
const waveVariant = {
  initial: { clipPath: "ellipse(0% 100% at 0% 50%)" },
  animate: {
    clipPath: "ellipse(150% 100% at 50% 50%)",
    transition: { duration: 2, ease: "easeInOut" },
  },
  exit: {
    clipPath: "ellipse(0% 100% at 100% 50%)",
    transition: { duration: 1.5, ease: "easeInOut" },
  },
}

const titleVariant = {
  hidden: { y: 80, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.9, ease: "easeOut" } },
}

const subtitleVariant = {
  hidden: { y: 60, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { delay: 0.3, duration: 0.9, ease: "easeOut" },
  },
}

const focusVariant = {
  hidden: { y: 40, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { delay: 0.7, duration: 0.7, ease: "easeOut" },
  },
}

const modalVariant = {
  hidden: { opacity: 0, scale: 0.96, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
  exit: { opacity: 0, scale: 0.96, y: 20, transition: { duration: 0.2 } },
}

// ────────────────────────────────────────
// NAVIGATION COMPONENTS (defined here so no imports needed)
// ────────────────────────────────────────
// Core Focus Areas Data
const coreFocusAreas = [
  {
    title: "Mentorship & Leadership Training",
    content:
      "We provide structured mentorship programs and leadership development workshops to empower young talents with the skills, confidence, and networks needed to lead positive change in their communities.",
    image: "/photo/hero6.jpg",
  },
  {
    title: "Economic Empowerment & Entrepreneurship",
    content:
      "Through training, seed funding support, and business incubation, we help aspiring entrepreneurs turn ideas into sustainable ventures that create jobs and drive local economic growth.",
    image: "/photo/hero2.jpg",
  },
  {
    title: "Social Development & Civic Responsibility",
    content:
      "We promote active citizenship, community service, and social innovation projects that address local challenges and strengthen social cohesion.",
    image: "/photo/hero7.jpg",
  },
  {
    title: "Authorship & Creative Expression",
    content:
      "We support writers, artists, and creators by offering platforms, publishing opportunities, and creative workshops to amplify voices and cultural narratives.",
    image: "/photo/hero8.jpg",
  },
  {
    title: "Health Support & Lifelong Learning",
    content:
      "We deliver health education, wellness programs, and continuous learning opportunities to promote physical, mental, and intellectual well-being across all ages.",
    image: "/photo/hero9.jpg",
  },
] as const;

function NavItem({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="block px-5 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition"
    >
      {children}
    </Link>
  )
}

function Dropdown({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="relative group">
      <button className="flex items-center gap-1.5 px-1 py-2 text-gray-800 hover:text-blue-600 transition">
        {title}
        <span className="text-xs opacity-70">▼</span>
      </button>
      <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible z-50 transition-all duration-200 min-w-[240px]">
        <div className="bg-white rounded-xl shadow-xl border border-gray-200 py-3 overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  )
}

function MobileMenu({
  title,
  open,
  toggle,
  children,
}: {
  title: string;
  open: boolean;
  toggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={toggle}
        className="flex w-full items-center justify-between py-3.5 text-left font-medium text-gray-900 hover:text-blue-600 transition-colors"
      >
        <span>{title}</span>
        <span className="text-xl font-light">{open ? "−" : "+"}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="pb-3 pl-4 space-y-2 text-gray-700">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
// ────────────────────────────────────────
// HERO CONTENT COMPONENT
// ────────────────────────────────────────

function HeroContent({ slide }: { slide: (typeof heroSlides)[number] }) {
  const [registerOpen, setRegisterOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)

  return (
    <>
     <div className="relative z-10 h-full flex items-center justify-center text-center px-6 -translate-y-24 md:-translate-y-32 lg:-translate-y-48">
  <div className="max-w-4xl">
          <motion.h1
            key={`title-${slide.focus}`}
            variants={titleVariant}
            initial="hidden"
            animate="visible"
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
          >
            {slide.title}
          </motion.h1>

          <motion.p
            key={`sub-${slide.focus}`}
            variants={subtitleVariant}
            initial="hidden"
            animate="visible"
            className="text-lg md:text-xl mb-8 opacity-90 max-w-3xl mx-auto"
          >
            {slide.subtitle}
          </motion.p>

          <motion.div
            key={`focus-${slide.focus}`}
            variants={focusVariant}
            initial="hidden"
            animate="visible"
            className="inline-block px-7 py-3.5 rounded-full bg-white text-black font-semibold shadow-lg text-base md:text-lg"
          >
            Core Focus Area: {slide.focus}
          </motion.div>

      <div className="mt-10 flex flex-wrap justify-center gap-5 sm:gap-6">
  {/* Primary button - Register Now */}
  <button
    onClick={() => setRegisterOpen(true)}
    className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition shadow-md min-w-[180px]"
  >
    Register Now $3
  </button>

  {/* Secondary outlined button - Login */}
  <button
    onClick={() => setLoginOpen(true)}
    className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/20 transition min-w-[180px]"
  >
    Login
  </button>

  {/* New button 1 - Register Talent */}
  <Link
    href="/DATA-BANK/register-talent"
    className="bg-blue-600/90 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition shadow-md min-w-[180px] text-center"
  >
    Register Talent
  </Link>

{/* New button 2 - Information Center */}
<Link
  href="/DATA-BANK/information-center"   // ← this is correct for your current folder
  className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/20 transition min-w-[180px] text-center"
>
  Information Center
</Link>
</div>
        </div>
      </div>

      <AnimatePresence>
        {loginOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
            variants={modalVariant}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <Login onClose={() => setLoginOpen(false)} />
          </motion.div>
        )}

        {registerOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
            variants={modalVariant}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <Register onClose={() => setRegisterOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// ────────────────────────────────────────
// MAIN PAGE
// ────────────────────────────────────────

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [mobileMenu, setMobileMenu] = useState(false)
  const [openSub, setOpenSub] = useState<string | null>(null)

  const sectionsRef = useRef<(HTMLElement | null)[]>([])

  // Auto slide
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((s) => (s + 1) % heroSlides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

 useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");
          // Optional: stop observing after animation to improve performance
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 } // trigger when 15% of element is visible
  );

  sectionsRef.current.forEach((el) => {
    if (el) observer.observe(el);
  });

  return () => observer.disconnect();
}, []);
  const current = heroSlides[currentSlide]

  return (
    <>
      {/* NAVBAR */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo/ngo.png"
              alt="Talents & Impact Logo"
              width={64}
              height={64}
              className="rounded-full object-cover"
              priority
            />
            <span className="font-bold text-xl hidden sm:block">Talents & Impact</span>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium">
            <Link href="/" className="hover:text-blue-600 transition">Home</Link>

            <Dropdown title="About Us">
              <NavItem href="/ABOUT-US/history">History</NavItem>
              <NavItem href="/ABOUT-US/mission-vision-values">Mission & Vision</NavItem>
              <NavItem href="/ABOUT-US/objectives">Objectives</NavItem>
              <NavItem href="/ABOUT-US/governance">Governance</NavItem>
              <NavItem href="/ABOUT-US/board">Board & Management</NavItem>
            </Dropdown>

            <Dropdown title="Programs & Services">
              <NavItem href="/PROGRAMS-SERVICES/talent-development">Talent Development</NavItem>
              <NavItem href="/PROGRAMS-SERVICES/health-services">Health Services</NavItem>
              <NavItem href="/PROGRAMS-SERVICES/mentoring-coaching">Mentoring & Coaching</NavItem>
              <NavItem href="/PROGRAMS-SERVICES/leadership-development">Leadership Development</NavItem>
              <NavItem href="/PROGRAMS-SERVICES/community-outreach">Community Outreach</NavItem>
              <NavItem href="/PROGRAMS-SERVICES/research-advocacy">Research & Advocacy</NavItem>
              <NavItem href="/PROGRAMS-SERVICES/partnerships">Partnerships & Sponsorships</NavItem>
            </Dropdown>

            <Dropdown title="Talents & Impact">
              <NavItem href="/DATA-BANK/register-talent">Register Talent</NavItem>
              <NavItem href="/DATA-BANK/categories">Talent Categories</NavItem>
              <NavItem href="/DATA-BANK/statistics">Statistics</NavItem>
              <NavItem href="/DATA-BANK/ethics">Data Ethics</NavItem>
              <NavItem href="/IMPACT/stories">Impact Stories</NavItem>
              <NavItem href="/IMPACT/partners">Partners</NavItem>
              <NavItem href="/IMPACT/donate">Donate</NavItem>
            </Dropdown>

            <Link href="/PUBLICATIONS" className="hover:text-blue-600 transition">Publications</Link>
            <Link href="/NEWS" className="hover:text-blue-600 transition">News & Events</Link>
            <Link href="/CONTACT-US" className="hover:text-blue-600 transition">Contact</Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2.5 rounded-lg hover:bg-gray-100 transition"
            onClick={() => setMobileMenu(!mobileMenu)}
            aria-label="Toggle menu"
          >
            <span className="text-3xl">{mobileMenu ? "✕" : "☰"}</span>
          </button>
        </div>

   {/* Mobile Menu – top dropdown style, no overlay */}
<AnimatePresence>
  {mobileMenu && (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="lg:hidden bg-white border-b shadow-lg z-40"
    >
      <div className="max-h-[70vh] overflow-y-auto px-5 py-6">
        {/* Header with close button */}
        <div className="flex items-center justify-between mb-6">
          <span className="font-bold text-lg">Menu</span>
          <button
            onClick={() => setMobileMenu(false)}
            className="text-3xl text-gray-700 hover:text-black transition-colors"
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        {/* Menu items */}
        <div className="space-y-2">
          <MobileMenu
            title="About Us"
            open={openSub === "about"}
            toggle={() => setOpenSub(openSub === "about" ? null : "about")}
          >
            <NavItem href="/ABOUT-US/history">History</NavItem>
            <NavItem href="/ABOUT-US/mission-vision-values">Mission & Vision</NavItem>
            <NavItem href="/ABOUT-US/objectives">Objectives</NavItem>
            <NavItem href="/ABOUT-US/governance">Governance</NavItem>
            <NavItem href="/ABOUT-US/board">Board & Management</NavItem>
          </MobileMenu>

          <MobileMenu
            title="Programs & Services"
            open={openSub === "programs"}
            toggle={() => setOpenSub(openSub === "programs" ? null : "programs")}
          >
            <NavItem href="/PROGRAMS-SERVICES/talent-development">Talent Development</NavItem>
            <NavItem href="/PROGRAMS-SERVICES/health-services">Health Services</NavItem>
            <NavItem href="/PROGRAMS-SERVICES/mentoring-coaching">Mentoring & Coaching</NavItem>
            <NavItem href="/PROGRAMS-SERVICES/leadership-development">Leadership Development</NavItem>
            <NavItem href="/PROGRAMS-SERVICES/community-outreach">Community Outreach</NavItem>
            <NavItem href="/PROGRAMS-SERVICES/research-advocacy">Research & Advocacy</NavItem>
            <NavItem href="/PROGRAMS-SERVICES/partnerships">Partnerships & Sponsorships</NavItem>
          </MobileMenu>

          <MobileMenu
            title="Talents & Impact"
            open={openSub === "talents"}
            toggle={() => setOpenSub(openSub === "talents" ? null : "talents")}
          >
            <NavItem href="/DATA-BANK/register-talent">Register Talent</NavItem>
            <NavItem href="/DATA-BANK/categories">Talent Categories</NavItem>
            <NavItem href="/DATA-BANK/statistics">Statistics</NavItem>
            <NavItem href="/DATA-BANK/ethics">Data Ethics</NavItem>
            <NavItem href="/IMPACT/stories">Impact Stories</NavItem>
            <NavItem href="/IMPACT/partners">Partners</NavItem>
            <NavItem href="/IMPACT/donate">Donate</NavItem>
          </MobileMenu>

          <div className="pt-6 mt-3 border-t space-y-3">
            <NavItem href="/PUBLICATIONS">Publications</NavItem>
            <NavItem href="/NEWS">News & Events</NavItem>
            <NavItem href="/CONTACT-US">Contact</NavItem>
          </div>
        </div>
      </div>
    </motion.div>
  )}
</AnimatePresence>
      </header>

   <main className="bg-white text-gray-900 overflow-x-hidden pt-20 lg:pt-24">
  {/* HERO - already animated */}
  <section className="relative h-[100vh] min-h-[800px] lg:min-h-[900px] text-white overflow-hidden">
    <AnimatePresence mode="wait">
      <motion.div
        key={`bg-${currentSlide}`}
        variants={waveVariant}
        initial="initial"
        animate="animate"
        exit="exit"
        className="absolute inset-0"
      >
        <Image
          src={current.image}
          alt={current.focus}
          fill
          priority
          className="object-cover brightness-[0.85]"
        />
        {/* Optional: add overlay if text is hard to read */}
        {/* <div className="absolute inset-0 bg-black/50" /> */}
      </motion.div>
    </AnimatePresence>

    <HeroContent slide={current} />
  </section>

 {/* WHO WE SERVE — vertical slide + fade when scrolled into view */}
<motion.section
  initial={{ opacity: 0, y: 100 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.3 }} // starts when ~30% of section is visible
  transition={{ duration: 0.9, ease: "easeOut" }}
  className="py-20 lg:py-28 text-center max-w-6xl mx-auto px-6"
>
  <h2 className="text-3xl md:text-4xl font-bold mb-6">Who We Serve</h2>
  <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
    Youth, creatives, innovators, athletes, and community leaders seeking ethical talent
    identification, mentorship, and sustainable growth.
  </p>
</motion.section>

{/* CORE FOCUS AREAS – alternating slide from left/right */}
<section className="bg-gray-50 py-20 lg:py-28">
  <div className="max-w-6xl mx-auto px-6">
    <motion.h2
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="text-3xl md:text-4xl font-bold text-center mb-14 text-gray-900"
    >
      Our Core Focus Areas
    </motion.h2>

    <div className="space-y-16 lg:space-y-24">
      {coreFocusAreas.map((area, index) => {
        // Alternate direction: even index → image left, text right
        // odd index → image right, text left
        const isEven = index % 2 === 0;

        return (
          <div
            key={area.title}
            className={`grid md:grid-cols-2 gap-10 lg:gap-16 items-center ${
              isEven ? "" : "md:flex-row-reverse"
            }`}
          >
            {/* IMAGE – slides from left or right */}
            <motion.div
              className="relative h-64 md:h-80 lg:h-96 rounded-2xl overflow-hidden shadow-xl"
              initial={{ opacity: 0, x: isEven ? -100 : 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1.0, ease: "easeOut", delay: 0.1 }}
              whileHover={{ scale: 1.03 }}
            >
              <Image
                src={area.image}
                alt={area.title}
                fill
                className="object-cover"
              />
            </motion.div>

            {/* TEXT – slides from opposite side */}
            <motion.div
              className="flex flex-col justify-center"
              initial={{ opacity: 0, x: isEven ? 100 : -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1.0, ease: "easeOut", delay: 0.25 }}
            >
              <h3 className="text-2xl lg:text-3xl font-semibold mb-5 text-gray-900">
                {area.title}
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                {area.content}
              </p>
            </motion.div>
          </div>
        );
      })}
    </div>
  </div>
</section>

{/* ────────────────────────────────────────
    ALL THREE SECTIONS TOGETHER (single block)
    with smooth upward scroll animation
──────────────────────────────────────── */}

<motion.section
  initial={{ opacity: 0, y: 80 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.2 }}
  transition={{ duration: 0.9, ease: "easeOut" }}
  className="py-24 bg-gray-50"
>
  <div className="max-w-6xl mx-auto px-6">
    {/* KEY PROGRAMS */}
    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
      Key Programs
    </h2>

    <div className="grid md:grid-cols-4 gap-6 text-center mb-20">
      {[
        ["Talent Development", "Identification & growth"],
        ["Health Services", "Wellness & support"],
        ["Mentoring", "Guidance & coaching"],
        ["Leadership", "Future leaders"],
      ].map(([title, desc]) => (
        <motion.div
          key={title}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-shadow"
        >
          <h3 className="font-semibold text-xl mb-3 text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{desc}</p>
        </motion.div>
      ))}
    </div>

    {/* LIVE IMPACT */}
    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
      Live Impact
    </h2>

    <div className="grid md:grid-cols-4 gap-6 mb-20">
      {[
        ["500+", "Registered Talents"],
        ["67", "Programs Run"],
        ["18", "Regions Covered"],
        ["22%", "Annual Growth"],
      ].map(([value, label]) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="p-8 bg-black text-white rounded-xl shadow-lg hover:scale-105 transition-transform"
        >
          <div className="text-4xl font-bold mb-2">{value}</div>
          <div className="text-lg opacity-90">{label}</div>
        </motion.div>
      ))}
    </div>

    {/* LATEST NEWS & EVENTS */}
    <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-gray-900">
      Latest News & Events
    </h2>
    <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto">
      Talent showcases, leadership forums, cultural events, and community impact stories.
    </p>
  </div>
</motion.section>

{/* FOOTER — vertical slide + fade when near bottom */}
<motion.footer
  initial={{ opacity: 0, y: 100 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.7 }} // triggers when most of footer is visible
  transition={{ duration: 1.1, ease: "easeOut" }}
  className="bg-gray-900 text-white py-12 text-center"
>
  <div className="max-w-6xl mx-auto px-6">
    <p className="text-lg">
      © {new Date().getFullYear()} Talents & Impact. All rights reserved.
    </p>
    <p className="mt-3 text-gray-400 text-sm">
      Building ethical talent ecosystems for sustainable community transformation.
    </p>
  </div>
</motion.footer> </main>    </>
  )
}