'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion'
import Image from 'next/image'
import {
  ArrowUpRight,
  ArrowUp,
  Download,
  Mail,
  MapPin,
  Github,
  Linkedin,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Languages as LanguagesIcon,
  Menu,
  X,
  Briefcase,
  Calendar,
  GraduationCap,
  Award,
  Check,
} from 'lucide-react'
import ProjectCard from '../components/ProjectCard'
import { useLanguage } from '../contexts/LanguageContext'
import { useProfile, PROFILE_IDS, type ProfileId } from '../contexts/ProfileContext'
import { siteContent, contact } from '../data/content'

type FormStatus = 'idle' | 'sending' | 'success' | 'error'

const EASE = [0.22, 1, 0.36, 1] as const
const ROMAN = ['I', 'II', 'III']

// One color per profile, used by the navbar switcher and the mobile menu.
const PROFILE_COLORS: Record<ProfileId, string> = {
  'data-ai': '#4FB8C4', // teal
  genai: '#B794F6', // violet
  mlops: '#EE8F6A', // coral
}

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, ease: EASE },
}

function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p
      className={`flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em] ${
        light ? 'text-mutedInk' : 'text-muted'
      }`}
    >
      <span className={`h-px w-8 ${light ? 'bg-accentDeep' : 'bg-accent'}`} />
      {children}
    </p>
  )
}

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState('hero')
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [showAllProjects, setShowAllProjects] = useState(false)
  const { language, toggleLanguage } = useLanguage()
  const { profile, setProfile } = useProfile()
  const t = siteContent[language]
  const p = t.profiles[profile]

  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 })

  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [formStatus, setFormStatus] = useState<FormStatus>('idle')

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24)
      const sections = ['hero', 'profiles', 'about', 'experience', 'projects', 'cv', 'contact']
      const scrollPosition = window.scrollY + 140
      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setShowAllProjects(false)
  }, [profile])

  const selectProfile = (id: ProfileId) => {
    setProfile(id)
    setMenuOpen(false)
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormStatus('sending')
    const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY
    if (!accessKey) {
      console.error('Missing NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY env variable — contact form cannot send.')
      setFormStatus('error')
      return
    }
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: accessKey,
          subject: `Nouveau message depuis le portfolio de ${formData.name}`,
          from_name: 'Portfolio - Jad Falaq',
          name: formData.name,
          email: formData.email,
          message: formData.message,
        }),
      })
      const result = await res.json()
      if (result.success) {
        setFormStatus('success')
        setFormData({ name: '', email: '', message: '' })
      } else {
        console.error('Web3Forms error:', result)
        setFormStatus('error')
      }
    } catch (err) {
      console.error('Contact form submit failed:', err)
      setFormStatus('error')
    }
  }

  const curatedProjects = p.projectIds.map((id) => ({ id, ...t.projects[id] }))
  const remainingIds = Object.keys(t.projects).filter((id) => !p.projectIds.includes(id))
  const remainingProjects = remainingIds.map((id) => ({ id, ...t.projects[id] }))
  const visibleProjects = showAllProjects ? [...curatedProjects, ...remainingProjects] : curatedProjects

  // Marquee band: the current profile's skills, de-duplicated.
  const marqueeItems = Array.from(new Set(p.skills.flatMap((g) => g.items))).slice(0, 18)

  const navLinks: { id: string; label: string }[] = [
    { id: 'projects', label: t.nav.projects },
    { id: 'cv', label: t.nav.cv },
    { id: 'contact', label: t.nav.contact },
  ]

  const inputClass =
    'w-full border-0 border-b border-line bg-transparent px-0 py-4 text-base text-paper placeholder-muted/70 outline-none transition-colors focus:border-accent focus:ring-0'

  return (
    <div className="min-h-screen bg-ink text-paper">
      {/* Scroll progress */}
      <motion.div
        style={{ scaleX: progress }}
        className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-accentDeep via-accent to-[rgb(var(--accent-light))]"
      />

      {/* ---------------------------------------------------------------- */}
      {/* Nav                                                               */}
      {/* ---------------------------------------------------------------- */}
      <nav
        className={`fixed top-0 z-50 w-full transition-all duration-500 ${
          scrolled || menuOpen ? 'border-b border-line bg-ink/80 backdrop-blur-xl' : 'border-b border-transparent'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-10">
          <a href="#hero" className="group flex items-baseline gap-2">
            <span className="font-display text-3xl italic leading-none text-paper">J</span>
            <span className="h-1.5 w-1.5 rounded-full bg-accent transition-transform group-hover:scale-150" />
            <span className="font-display text-3xl italic leading-none text-paper">F</span>
          </a>

          <div className="hidden items-center gap-6 md:flex lg:gap-8">
            {/* Profile switcher — all three profiles visible, each with its own color */}
            <div
              role="radiogroup"
              aria-label={t.nav.profileMenu.label}
              className="flex items-center gap-1 rounded-full border border-line bg-paper/[0.02] p-1"
            >
              {PROFILE_IDS.map((id) => {
                const active = profile === id
                const color = PROFILE_COLORS[id]
                return (
                  <button
                    key={id}
                    role="radio"
                    aria-checked={active}
                    title={t.profiles[id].title}
                    onClick={() => selectProfile(id)}
                    className={`flex items-center gap-2 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-[13px] transition-all duration-300 ${
                      active ? 'font-semibold' : 'border-transparent opacity-70 hover:bg-paper/[0.04] hover:opacity-100'
                    }`}
                    style={active ? { color, borderColor: `${color}99`, backgroundColor: `${color}1F` } : { color }}
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full transition-opacity"
                      style={{ backgroundColor: color }}
                    />
                    {t.profiles[id].navLabel}
                  </button>
                )
              })}
            </div>

            {navLinks.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`relative hidden text-[13px] tracking-wide transition-colors lg:block ${
                  activeSection === item.id ? 'text-paper' : 'text-muted hover:text-paper'
                }`}
              >
                {item.label}
                <span
                  className={`absolute -bottom-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-accent transition-opacity ${
                    activeSection === item.id ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              </a>
            ))}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 font-mono text-[11px] tracking-[0.15em] text-muted transition-colors hover:text-accent"
              aria-label="Toggle language"
            >
              <LanguagesIcon size={13} />
              {language === 'fr' ? 'FR' : 'EN'}
            </button>
          </div>

          <button className="text-paper md:hidden" onClick={() => setMenuOpen((v) => !v)} aria-label="Menu">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="overflow-hidden border-t border-line md:hidden"
            >
              <div className="flex flex-col gap-6 px-5 py-6">
                <div>
                  <p className="font-display text-lg italic text-paper">{t.nav.profileMenu.heading}</p>
                  <div className="mt-3 border border-line">
                    {PROFILE_IDS.map((id, index) => (
                      <button
                        key={id}
                        onClick={() => selectProfile(id)}
                        className="flex w-full items-start gap-3 border-b border-line px-4 py-3.5 text-left last:border-b-0"
                        style={profile === id ? { backgroundColor: `${PROFILE_COLORS[id]}14` } : undefined}
                      >
                        <span
                          className="w-6 font-display text-xl italic leading-none"
                          style={{ color: PROFILE_COLORS[id], opacity: profile === id ? 1 : 0.55 }}
                        >
                          {ROMAN[index]}
                        </span>
                        <span className="flex-1">
                          <span className="block text-sm font-semibold text-paper">{t.profiles[id].title}</span>
                          <span className="mt-0.5 block text-xs leading-relaxed text-muted">{t.profiles[id].pickerDescription}</span>
                        </span>
                        {profile === id && <Check size={15} className="mt-0.5 shrink-0" style={{ color: PROFILE_COLORS[id] }} />}
                      </button>
                    ))}
                  </div>
                </div>
                {navLinks.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={() => setMenuOpen(false)}
                    className="font-display text-3xl text-paper"
                  >
                    {item.label}
                  </a>
                ))}
                <button
                  onClick={toggleLanguage}
                  className="flex w-fit items-center gap-1.5 font-mono text-xs tracking-[0.15em] text-muted"
                >
                  <LanguagesIcon size={13} />
                  {language === 'fr' ? 'FR' : 'EN'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ---------------------------------------------------------------- */}
      {/* Hero                                                              */}
      {/* ---------------------------------------------------------------- */}
      <section id="hero" className="grain relative flex min-h-[100svh] items-center overflow-hidden pt-32 pb-24">
        {/* Atmosphere: drifting gold glow + editorial column rules */}
        <div className="pointer-events-none absolute -right-40 -top-40 h-[42rem] w-[42rem] animate-drift rounded-full bg-[radial-gradient(circle,rgb(var(--accent)_/_0.22),transparent_65%)] blur-2xl" />
        <div className="pointer-events-none absolute -bottom-60 -left-40 h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,rgba(120,140,190,0.10),transparent_65%)] blur-2xl" />
        <div className="pointer-events-none absolute inset-0 mx-auto hidden max-w-7xl grid-cols-4 px-10 lg:grid">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="border-l border-paper/[0.035] last:border-r" />
          ))}
        </div>

        <div className="relative mx-auto w-full max-w-7xl px-5 md:px-10">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, ease: EASE }}>
            <Eyebrow>{t.hero.eyebrow}</Eyebrow>
          </motion.div>

          <div className="mt-8 flex flex-col items-start justify-between gap-12 lg:flex-row lg:items-end">
            <h1 className="font-display text-[3.6rem] leading-[0.95] tracking-[-0.02em] sm:text-7xl md:text-8xl lg:text-[8.5rem]">
              <span className="block overflow-hidden">
                <motion.span
                  className="block"
                  initial={{ y: '110%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1.1, ease: EASE, delay: 0.1 }}
                >
                  {t.hero.headline[0]}
                </motion.span>
              </span>
              <span className="block overflow-hidden pb-2">
                <motion.span
                  className="block"
                  initial={{ y: '110%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1.1, ease: EASE, delay: 0.25 }}
                >
                  {t.hero.headline[1]} <em className="text-gold pr-2">{t.hero.headline[2]}</em>
                </motion.span>
              </span>
            </h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.6 }}
              className="relative shrink-0 border-l border-accent/40 pl-6"
            >
              <div className="font-display text-7xl leading-none text-gold md:text-8xl">{t.hero.statNumber}</div>
              <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.25em] text-paper/80">{t.hero.statLabel}</div>
              <div className="mt-1 font-display text-base italic text-muted">{t.hero.statSub}</div>
            </motion.div>
          </div>

          <div className="mt-14 grid gap-10 md:grid-cols-[1fr_auto] md:items-end">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.5 }}
              className="max-w-xl text-base leading-relaxed text-muted md:text-lg"
            >
              {t.hero.description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.65 }}
              className="flex flex-wrap gap-3"
            >
              <a
                href="#projects"
                className="btn-gold flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold tracking-wide shadow-[0_10px_40px_-10px_rgb(var(--accent)_/_0.6)] transition-transform hover:-translate-y-0.5"
              >
                {t.hero.ctaProjects}
                <ArrowUpRight size={16} />
              </a>
              <a
                href="#cv"
                className="flex items-center gap-2 rounded-full border border-paper/20 px-7 py-3.5 text-sm tracking-wide text-paper transition-all hover:border-accent hover:text-accent"
              >
                <Download size={15} />
                {t.hero.ctaCV}
              </a>
            </motion.div>
          </div>
        </div>

        {/* Scroll cue */}
        <motion.a
          href="#profiles"
          aria-label="Scroll"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 md:block"
        >
          <span className="relative block h-14 w-px overflow-hidden bg-line">
            <motion.span
              className="absolute left-0 top-0 h-5 w-px bg-accent"
              animate={{ y: [-20, 56] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            />
          </span>
        </motion.a>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Marquee — current profile's toolkit                               */}
      {/* ---------------------------------------------------------------- */}
      <div className="mask-fade-x overflow-hidden border-y border-line bg-surface py-5" aria-hidden="true">
        <div key={profile} className="flex w-max animate-marquee">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 items-center">
              {marqueeItems.map((item) => (
                <span key={item} className="flex items-center">
                  <span className="whitespace-nowrap px-6 font-display text-2xl italic text-paper/70 md:text-3xl">{item}</span>
                  <span className="text-xs text-accent">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Profile picker                                                    */}
      {/* ---------------------------------------------------------------- */}
      <section id="profiles" className="grain relative bg-paper py-24 text-ink md:py-36">
        <div className="mx-auto max-w-7xl px-5 md:px-10">
          <motion.div {...fadeUp} className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <Eyebrow light>{t.profilePicker.eyebrow}</Eyebrow>
              <h2 className="mt-6 font-display text-5xl leading-[1] tracking-[-0.01em] sm:text-6xl md:text-7xl">
                {t.profilePicker.heading[0]}
                <br />
                <em className="text-accentDeep">{t.profilePicker.heading[1]}</em>
              </h2>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-mutedInk">{t.profilePicker.description}</p>
          </motion.div>

          <div className="mt-16 grid gap-5 md:grid-cols-3">
            {PROFILE_IDS.map((id, index) => {
              const active = profile === id
              return (
                <motion.button
                  key={id}
                  data-profile={id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: index * 0.1, ease: EASE }}
                  onClick={() => {
                    setProfile(id)
                    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className={`group relative flex min-h-[22rem] flex-col items-start overflow-hidden p-8 text-left transition-all duration-500 hover:-translate-y-1 ${
                    active
                      ? 'bg-ink text-paper shadow-[0_30px_60px_-25px_rgba(10,13,19,0.6)]'
                      : 'border border-lineInk bg-paper hover:border-accentDeep/40 hover:shadow-[0_25px_50px_-30px_rgba(10,13,19,0.35)]'
                  }`}
                >
                  {/* Gold top rule — full when active, grows on hover otherwise */}
                  <span
                    className={`absolute left-0 top-0 h-[2px] bg-gradient-to-r from-accentDeep via-accent to-accentDeep transition-all duration-700 ${
                      active ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                  {active && (
                    <span className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgb(var(--accent)_/_0.18),transparent_70%)]" />
                  )}

                  <div className="flex w-full items-start justify-between">
                    <span
                      className={`font-display text-7xl italic leading-none ${
                        active ? 'text-gold' : 'text-accentDeep/40 transition-colors group-hover:text-accentDeep'
                      }`}
                    >
                      {ROMAN[index]}
                    </span>
                    {active && (
                      <span className="flex h-8 w-8 items-center justify-center rounded-full border border-accent/50 text-accent">
                        <Check size={14} />
                      </span>
                    )}
                  </div>

                  <span className="mt-auto pt-10 font-display text-3xl leading-tight">{t.profiles[id].title}</span>
                  <p className={`mt-3 text-sm leading-relaxed ${active ? 'text-muted' : 'text-mutedInk'}`}>
                    {t.profiles[id].pickerDescription}
                  </p>
                  <span
                    className={`mt-7 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] ${
                      active ? 'text-accent' : 'text-ink'
                    }`}
                  >
                    {t.profilePicker.enterLabel}
                    <ArrowUpRight size={13} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </motion.button>
              )
            })}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Bio                                                               */}
      {/* ---------------------------------------------------------------- */}
      <section id="about" className="relative overflow-hidden py-24 md:py-36">
        <div className="pointer-events-none absolute -left-40 top-1/3 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgb(var(--accent)_/_0.08),transparent_65%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-16 px-5 md:grid-cols-[340px_1fr] md:gap-20 md:px-10">
          <motion.div {...fadeUp}>
            <div className="relative w-full max-w-[20rem]">
              {/* Offset gold frame */}
              <div className="absolute inset-0 translate-x-4 translate-y-4 border border-accent/50" />
              <div className="group relative aspect-[4/5] overflow-hidden bg-surface">
                <Image
                  src="/profil.jpg"
                  alt="Jad Falaq"
                  fill
                  className="object-cover grayscale transition-all duration-700 group-hover:scale-[1.03] group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
              </div>
            </div>
            <p className="mt-9 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-muted">
              <MapPin size={12} className="text-accent" /> {t.bio.location}
            </p>
          </motion.div>

          <div>
            <motion.div {...fadeUp}>
              <Eyebrow>{t.bio.eyebrow}</Eyebrow>
              <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.25em] text-accent">{t.bio.tag}</p>
            </motion.div>

            <div className="relative mt-8">
              <span className="pointer-events-none absolute -left-2 -top-10 font-display text-[9rem] leading-none text-accent/15 md:-left-8">
                &ldquo;
              </span>
              <AnimatePresence mode="wait">
                <motion.h2
                  key={profile + '-quote'}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="relative font-display text-4xl italic leading-[1.15] text-paper sm:text-5xl"
                >
                  {p.bioQuote}
                </motion.h2>
              </AnimatePresence>
            </div>

            <AnimatePresence mode="wait">
              <motion.p
                key={profile + '-summary'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="mt-8 max-w-2xl text-base leading-relaxed text-muted md:text-[17px]"
              >
                {p.summary}
              </motion.p>
            </AnimatePresence>

            <div className="mt-8 flex flex-wrap gap-2">
              {p.keywords.map((k) => (
                <span key={k} className="rounded-full border border-accent/25 bg-accent/[0.05] px-4 py-1.5 text-xs text-paper/80">
                  {k}
                </span>
              ))}
            </div>

            <div className="mt-14 grid grid-cols-3 border-t border-line">
              {t.bio.stats.map((s, i) => (
                <div key={s.label} className={`pt-7 ${i > 0 ? 'border-l border-line pl-5 md:pl-8' : ''}`}>
                  <div className="font-display text-5xl leading-none text-gold md:text-6xl">{s.value}</div>
                  <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Skills                                                            */}
      {/* ---------------------------------------------------------------- */}
      <section className="border-t border-line bg-surface py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-5 md:px-10">
          <motion.h2 {...fadeUp} className="font-display text-4xl sm:text-5xl">
            {t.skillsHeading}
          </motion.h2>
          <AnimatePresence mode="wait">
            <motion.div
              key={profile + '-skills'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="mt-14 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-3"
            >
              {p.skills.map((group, i) => (
                <div key={group.heading} className="group bg-surface p-7 transition-colors duration-500 hover:bg-ink">
                  <div className="flex items-baseline gap-3">
                    <span className="font-display text-lg italic text-accent/60">{String(i + 1).padStart(2, '0')}</span>
                    <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-paper">{group.heading}</h3>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-x-2 gap-y-2">
                    {group.items.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-line px-3 py-1 text-xs text-muted transition-colors group-hover:border-accent/20 group-hover:text-paper/80"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Experience — timeline                                             */}
      {/* ---------------------------------------------------------------- */}
      <section id="experience" className="border-t border-line py-24 md:py-36">
        <div className="mx-auto max-w-7xl px-5 md:px-10">
          <motion.h2 {...fadeUp} className="font-display text-4xl sm:text-5xl">
            {t.experienceHeading}
          </motion.h2>

          <AnimatePresence mode="wait">
            <motion.div
              key={profile + '-exp'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="relative mt-16"
            >
              <div className="absolute bottom-0 left-[7px] top-2 w-px bg-gradient-to-b from-accent/70 via-line to-transparent md:left-[calc(240px+7px)]" />
              <div className="space-y-16">
                {p.experience.map((exp, index) => (
                  <div key={index} className="relative grid gap-6 pl-10 md:grid-cols-[240px_1fr] md:gap-0 md:pl-0">
                    <span className="absolute left-0 top-2 flex h-[15px] w-[15px] items-center justify-center rounded-full border border-accent bg-ink md:left-[240px]">
                      <span className="h-[5px] w-[5px] rounded-full bg-accent" />
                    </span>

                    <div className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted md:pr-10 md:text-right">
                      <p className="flex items-center gap-1.5 text-paper md:justify-end">
                        <Calendar size={12} className="text-accent" /> {exp.period}
                      </p>
                      <p className="mt-2 flex items-center gap-1.5 md:justify-end">
                        <MapPin size={12} /> {exp.location}
                      </p>
                    </div>

                    <div className="md:pl-14">
                      <div className="flex items-center gap-4">
                        {exp.logo ? (
                          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-accent/30 bg-white">
                            <Image src={exp.logo} alt={exp.company} fill sizes="48px" className="object-contain p-1.5" />
                          </div>
                        ) : (
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-line">
                            <Briefcase size={18} className="text-accent" />
                          </div>
                        )}
                        <div>
                          <h3 className="font-display text-2xl leading-tight text-paper md:text-3xl">{exp.title}</h3>
                          <p className="mt-1 text-sm">
                            <span className="text-accent">{exp.company}</span>
                            <span className="text-muted"> · {exp.type}</span>
                          </p>
                        </div>
                      </div>
                      <ul className="mt-7 space-y-4">
                        {exp.description.map((item, i) => (
                          <li key={i} className="flex items-start gap-4 text-[15px] leading-relaxed text-muted">
                            <span className="mt-[0.7em] h-px w-4 shrink-0 bg-accent/70" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Projects                                                          */}
      {/* ---------------------------------------------------------------- */}
      <section id="projects" className="border-t border-line py-24 md:py-36">
        <div className="mx-auto max-w-7xl px-5 md:px-10">
          <motion.div {...fadeUp} className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <Eyebrow>{t.projectsSection.eyebrow}</Eyebrow>
              <h2 className="mt-6 font-display text-5xl leading-[1] sm:text-6xl md:text-7xl">
                {t.projectsSection.heading[0]} <em className="text-gold pr-1">{t.projectsSection.heading[1]}</em>
              </h2>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-muted">{t.projectsSection.description}</p>
            </div>
            <button
              onClick={() => setShowAllProjects((v) => !v)}
              className="group flex w-fit items-center gap-3 rounded-full border border-line px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.2em] text-paper transition-colors hover:border-accent hover:text-accent"
            >
              {showAllProjects ? t.projectsSection.viewLessLabel : t.projectsSection.viewAllLabel}
              <ArrowUpRight size={13} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </button>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={profile + '-projects-' + showAllProjects}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="mt-16 grid gap-px overflow-hidden border border-line bg-line"
            >
              {visibleProjects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                  codeLabel={t.projectsSection.codeLabel}
                  demoLabel={t.projectsSection.demoLabel}
                  noLinkLabel={t.projectsSection.noLinkLabel}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* CV                                                                */}
      {/* ---------------------------------------------------------------- */}
      <section id="cv" className="grain relative bg-paper py-24 text-ink md:py-36">
        <div className="mx-auto max-w-7xl px-5 md:px-10">
          <motion.div {...fadeUp} className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <h2 className="font-display text-5xl leading-[1] sm:text-6xl md:text-7xl">
                {t.cv.heading.split(' ').slice(0, -1).join(' ')}{' '}
                <em className="text-accentDeep">{t.cv.heading.split(' ').slice(-1)}</em>
              </h2>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-mutedInk">{t.cv.description}</p>
            </div>
            <a
              href={p.cvFile}
              download
              className="group flex w-fit items-center gap-3 rounded-full bg-ink py-2 pl-6 pr-2 text-sm text-paper transition-all hover:shadow-[0_15px_40px_-15px_rgba(10,13,19,0.6)]"
            >
              <span>
                {t.cv.downloadLabel} <span className="font-display text-base italic text-accent">— {p.title}</span>
              </span>
              <span className="btn-gold flex h-10 w-10 items-center justify-center rounded-full">
                <Download size={16} />
              </span>
            </a>
          </motion.div>

          <div className="mt-16 grid gap-14 md:grid-cols-3">
            <div className="space-y-10 md:col-span-1">
              <div>
                <h3 className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-accentDeep">
                  <Mail size={13} /> {t.cv.contactHeading}
                </h3>
                <div className="mt-4 space-y-2 text-sm">
                  <p>{contact.email}</p>
                  {contact.phones.map((ph) => (
                    <p key={ph}>{ph}</p>
                  ))}
                  <p>{t.bio.location}</p>
                  <p>{t.bio.secondLocation}</p>
                  <a href={contact.githubUrl} target="_blank" rel="noopener noreferrer" className="block underline-offset-4 hover:text-accentDeep hover:underline">
                    {contact.github}
                  </a>
                  <a href={contact.linkedinUrl} target="_blank" rel="noopener noreferrer" className="block underline-offset-4 hover:text-accentDeep hover:underline">
                    {contact.linkedin}
                  </a>
                </div>
              </div>

              <div>
                <h3 className="font-mono text-[10px] uppercase tracking-[0.25em] text-accentDeep">{t.cv.languagesHeading}</h3>
                <div className="mt-4 divide-y divide-lineInk text-sm">
                  {t.languages.map((l) => (
                    <div key={l.name} className="flex justify-between py-2">
                      <span>{l.name}</span>
                      <span className="font-display italic text-mutedInk">{l.level}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-mono text-[10px] uppercase tracking-[0.25em] text-accentDeep">{t.cv.softSkillsHeading}</h3>
                <div className="mt-4 space-y-4 text-sm">
                  {t.softSkills.map((s) => (
                    <div key={s.title}>
                      <p className="font-semibold">{s.title}</p>
                      <p className="mt-1 text-xs leading-relaxed text-mutedInk">{s.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-5 md:col-span-2">
              <h3 className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-accentDeep">
                <GraduationCap size={13} /> {t.cv.educationHeading}
              </h3>
              {t.education.map((edu) => (
                <div key={edu.degree} className="border border-lineInk bg-white/40 p-7 transition-colors hover:bg-white/70">
                  <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
                    <div>
                      <h4 className="font-display text-2xl leading-tight">{edu.degree}</h4>
                      <p className="mt-1 text-sm text-mutedInk">{edu.school}</p>
                    </div>
                    <div className="shrink-0 font-mono text-[10px] uppercase tracking-[0.15em] text-mutedInk md:text-right">
                      <p>{edu.period}</p>
                      <p className="mt-1">{edu.location}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-mutedInk">{edu.details}</p>
                </div>
              ))}

              <h3 className="flex items-center gap-2 pt-6 font-mono text-[10px] uppercase tracking-[0.25em] text-accentDeep">
                <Award size={13} /> {t.projectsSection.heading.join(' ')}
              </h3>
              <AnimatePresence mode="wait">
                <motion.div
                  key={profile + '-cv-projects'}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="divide-y divide-lineInk border-y border-lineInk"
                >
                  {curatedProjects.map((project) => (
                    <div key={project.id} className="py-5">
                      <div className="flex items-start justify-between gap-3">
                        <h4 className="font-display text-xl leading-tight">{project.title}</h4>
                        {project.github && (
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex shrink-0 items-center gap-1 font-mono text-[10px] uppercase tracking-[0.15em] text-mutedInk hover:text-accentDeep"
                          >
                            <Github size={12} /> {contact.github.replace('github.com/', '')}
                          </a>
                        )}
                      </div>
                      <p className="mt-2 text-xs leading-relaxed text-mutedInk">{project.description}</p>
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Contact                                                           */}
      {/* ---------------------------------------------------------------- */}
      <section id="contact" className="grain relative overflow-hidden py-24 md:py-36">
        <div className="pointer-events-none absolute -bottom-40 right-0 h-[40rem] w-[40rem] animate-drift rounded-full bg-[radial-gradient(circle,rgb(var(--accent)_/_0.16),transparent_65%)] blur-2xl" />
        <div className="relative mx-auto max-w-7xl px-5 md:px-10">
          <motion.div {...fadeUp}>
            <Eyebrow>{t.contact.eyebrow}</Eyebrow>
            <h2 className="mt-6 font-display text-6xl leading-[0.95] tracking-[-0.02em] sm:text-7xl md:text-[7.5rem]">
              {t.contact.heading[0]}
              <br />
              <em className="text-gold pr-2">{t.contact.heading[1]}</em>
            </h2>
            <p className="mt-8 max-w-md text-base leading-relaxed text-muted">{t.contact.description}</p>
            <p className="mt-4 inline-flex items-center gap-2.5 rounded-full border border-accent/30 bg-accent/[0.06] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.15em] text-accent">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              {t.contact.availability}
            </p>
          </motion.div>

          <div className="mt-20 grid gap-16 md:grid-cols-[1fr_1.2fr]">
            <motion.div {...fadeUp} className="flex flex-col">
              {[
                { href: `mailto:${contact.email}`, icon: Mail, label: contact.email, external: false },
                { href: contact.linkedinUrl, icon: Linkedin, label: 'LinkedIn', external: true },
                { href: contact.githubUrl, icon: Github, label: 'GitHub', external: true },
              ].map(({ href, icon: Icon, label, external }) => (
                <a
                  key={label}
                  href={href}
                  {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="group flex items-center justify-between border-b border-line py-6 transition-colors hover:border-accent/50"
                >
                  <span className="flex items-center gap-4">
                    <Icon size={18} className="text-accent" />
                    <span className="font-display text-2xl text-paper transition-transform duration-300 group-hover:translate-x-1 md:text-3xl">
                      {label}
                    </span>
                  </span>
                  <ArrowUpRight size={18} className="text-muted transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
                </a>
              ))}
            </motion.div>

            <motion.form {...fadeUp} onSubmit={handleFormSubmit} className="border border-line bg-surface/60 p-7 backdrop-blur md:p-10">
              <div className="grid gap-2 sm:grid-cols-2 sm:gap-8">
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleFormChange}
                  placeholder={t.contact.form.name}
                  className={inputClass}
                />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleFormChange}
                  placeholder={t.contact.form.email}
                  className={inputClass}
                />
              </div>
              <textarea
                rows={4}
                name="message"
                required
                value={formData.message}
                onChange={handleFormChange}
                placeholder={t.contact.form.message}
                className={`${inputClass} mt-2 resize-none`}
              />
              <button
                type="submit"
                disabled={formStatus === 'sending'}
                className="btn-gold mt-10 flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 text-sm font-semibold tracking-wide transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {formStatus === 'sending' && <Loader2 className="animate-spin" size={16} />}
                {formStatus === 'sending' ? t.contact.form.sending : t.contact.form.submit}
                {formStatus !== 'sending' && <ArrowUpRight size={16} />}
              </button>
              {formStatus === 'success' && (
                <p className="mt-5 flex items-center gap-2 text-sm text-accent">
                  <CheckCircle2 size={16} /> {t.contact.form.success}
                </p>
              )}
              {formStatus === 'error' && (
                <p className="mt-5 flex items-center gap-2 text-sm text-red-400">
                  <AlertCircle size={16} /> {t.contact.form.error}
                </p>
              )}
            </motion.form>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Footer — signature wordmark                                       */}
      {/* ---------------------------------------------------------------- */}
      <footer className="relative overflow-hidden border-t border-line pt-16">
        <div className="mx-auto max-w-7xl px-5 md:px-10">
          <div className="flex flex-col items-start justify-between gap-6 font-mono text-[10px] uppercase tracking-[0.2em] text-muted md:flex-row md:items-center">
            <span>{t.footer}</span>
            <a href="#hero" className="group flex items-center gap-2 transition-colors hover:text-accent">
              <ArrowUp size={13} className="transition-transform group-hover:-translate-y-0.5" />
              Top
            </a>
          </div>
          <div className="rule-gold mt-10" />
        </div>
        <p
          aria-hidden="true"
          className="select-none whitespace-nowrap pb-2 pt-6 text-center font-display text-[22vw] italic leading-[0.85] tracking-[-0.03em] text-transparent"
          style={{
            backgroundImage: 'linear-gradient(180deg, rgb(var(--accent) / 0.45), rgb(var(--accent) / 0.02) 90%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
          }}
        >
          Jad Falaq
        </p>
      </footer>
    </div>
  )
}
