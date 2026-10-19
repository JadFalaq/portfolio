'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence, MotionConfig, useScroll, useSpring } from 'framer-motion'
import Image from 'next/image'
import {
  ArrowUpRight,
  ArrowUp,
  ArrowDown,
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
import FeaturedShowcase from '../components/FeaturedShowcase'
import HeroVideo from '../components/HeroVideo'
import AkwaPipeline from '../components/AkwaPipeline'
import { useLanguage } from '../contexts/LanguageContext'
import { useProfile, PROFILE_IDS, type ProfileId } from '../contexts/ProfileContext'
import { siteContent, contact } from '../data/content'
import { akwaCaseStudy } from '../data/akwa'

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
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '0px 0px -10% 0px' },
  transition: { duration: 0.5, ease: EASE },
}

// Profile switch: the new content is rendered immediately (no exit wait) and
// only fades from 40% — never hidden, never delayed.
const profileSwap = {
  initial: { opacity: 0.4 },
  animate: { opacity: 1 },
  transition: { duration: 0.22, ease: EASE },
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

// Every main section opens the same way: label, title, optional short intro.
function SectionHeader({
  eyebrow,
  title,
  intro,
  light = false,
  children,
}: {
  eyebrow: string
  title: React.ReactNode
  intro?: React.ReactNode
  light?: boolean
  children?: React.ReactNode
}) {
  return (
    <motion.div {...fadeUp} className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
      <div>
        <Eyebrow light={light}>{eyebrow}</Eyebrow>
        <h2 className="t-h2 mt-5">{title}</h2>
        {intro && <p className={`t-intro mt-5 ${light ? 'text-mutedInk' : 'text-muted'}`}>{intro}</p>}
      </div>
      {children}
    </motion.div>
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
    let frame = 0
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        handleScroll()
      })
    }
    handleScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])

  useEffect(() => {
    setShowAllProjects(false)
  }, [profile])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

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

  const curatedProjects = p.projectIds.map((id) => t.projects[id])
  const featuredProjects = p.featuredIds.map((id) => t.projects[id])
  // "View all": every other project, profile order first. Experience-only entries
  // (no public repo, e.g. Renault Digital) are already covered by the Experience section.
  const otherProjects = Array.from(new Set([...p.projectIds, ...Object.keys(t.projects)]))
    .filter((id) => !p.featuredIds.includes(id) && !t.projects[id].detailsHref)
    .map((id) => t.projects[id])

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
    <MotionConfig reducedMotion="user">
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
        className={`fixed top-0 z-50 w-full transition-[background-color,border-color,backdrop-filter] duration-300 ease-out ${
          scrolled || menuOpen ? 'border-b border-line bg-ink/80 backdrop-blur-xl' : 'border-b border-transparent'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-10">
          <a href="#hero" className="group flex items-baseline gap-2" aria-label="Jad Falaq — accueil">
            <span className="font-display text-3xl italic leading-none text-paper">J</span>
            <span className="h-1.5 w-1.5 rounded-full bg-accent transition-transform duration-200 ease-out group-hover:scale-150" />
            <span className="font-display text-3xl italic leading-none text-paper">F</span>
          </a>

          <div className="hidden items-center gap-6 lg:flex xl:gap-8">
            {/* Profile switcher — all three profiles visible, each with its own color */}
            <div
              role="group"
              aria-label={t.nav.profileMenu.label}
              className="flex items-center gap-1 rounded-full border border-line bg-paper/[0.02] p-1"
            >
              {PROFILE_IDS.map((id) => {
                const active = profile === id
                const color = PROFILE_COLORS[id]
                return (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={active}
                    title={t.profiles[id].title}
                    onClick={() => selectProfile(id)}
                    className={`relative flex items-center gap-2 whitespace-nowrap rounded-full px-3.5 py-1.5 text-[13px] transition-opacity duration-200 ease-out ${
                      active ? 'font-semibold' : 'opacity-90 hover:opacity-100'
                    }`}
                    style={{ color }}
                  >
                    {active && (
                      <motion.span
                        layoutId="nav-profile-indicator"
                        aria-hidden="true"
                        className="absolute inset-0 rounded-full border"
                        style={{ borderColor: `${color}99`, backgroundColor: `${color}1F` }}
                        transition={{ duration: 0.25, ease: EASE }}
                      />
                    )}
                    <span className="relative h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
                    <span className="relative">{t.profiles[id].navLabel}</span>
                  </button>
                )
              })}
            </div>

            {navLinks.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                aria-current={activeSection === item.id ? 'location' : undefined}
                className={`relative py-1 text-[13px] tracking-wide transition-colors duration-200 ease-out ${
                  activeSection === item.id ? 'text-paper' : 'text-muted hover:text-paper'
                }`}
              >
                {item.label}
                {activeSection === item.id && (
                  <motion.span
                    layoutId="nav-section-indicator"
                    aria-hidden="true"
                    className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-accent"
                    transition={{ duration: 0.25, ease: EASE }}
                  />
                )}
              </a>
            ))}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 font-mono text-[11px] tracking-[0.15em] text-muted transition-colors duration-200 ease-out hover:text-accent"
              aria-label={language === 'fr' ? 'Switch to English' : 'Passer en français'}
            >
              <LanguagesIcon size={13} />
              {language === 'fr' ? 'FR' : 'EN'}
            </button>
          </div>

          <button
            type="button"
            className="-mr-2 flex h-11 w-11 items-center justify-center text-paper lg:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              id="mobile-menu"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="overflow-hidden border-t border-line lg:hidden"
            >
              {/* Scrolls on its own if taller than the screen (small phones, landscape). */}
              <div className="flex max-h-[calc(100svh-4.5rem)] flex-col gap-6 overflow-y-auto overscroll-contain px-5 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
                <div>
                  <p className="font-display text-lg italic text-paper">{t.nav.profileMenu.heading}</p>
                  <div className="mt-3 border border-line">
                    {PROFILE_IDS.map((id, index) => (
                      <button
                        key={id}
                        type="button"
                        aria-pressed={profile === id}
                        onClick={() => selectProfile(id)}
                        className="flex w-full items-start gap-3 border-b border-line px-4 py-3.5 text-left transition-colors duration-200 ease-out last:border-b-0 hover:bg-paper/[0.03]"
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
                  type="button"
                  onClick={toggleLanguage}
                  aria-label={language === 'fr' ? 'Switch to English' : 'Passer en français'}
                  className="flex min-h-[44px] w-fit items-center gap-1.5 font-mono text-xs tracking-[0.15em] text-muted"
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
      {/* Entrance is CSS (.hero-rise: opacity + 8px, 450ms) so the hero is painted
          from the server HTML instead of waiting for hydration. */}
      {/* Full-bleed video background; profile details sit at the bottom over a gradient.
          The poster is in the server HTML, so the hero is complete without JavaScript. */}
      <section id="hero" className="relative isolate flex min-h-[100svh] items-end overflow-hidden pb-14 pt-28 md:pb-20">
        <div className="absolute inset-0 -z-10">
          <HeroVideo pauseLabel={t.hero.videoPause} playLabel={t.hero.videoPlay} />
          {/* Legibility: dark at the bottom (text) and top (navbar), lighter in the middle. */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/75 to-ink/10" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink/80 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-2/3 bg-gradient-to-r from-ink/70 to-transparent md:block" />
        </div>

        <div className="relative mx-auto w-full max-w-7xl px-5 md:px-10">
          <div className="max-w-3xl">
            <div className="hero-rise">
              <Eyebrow>{t.hero.eyebrow}</Eyebrow>
            </div>
            <h1
              className="hero-rise mt-5 font-display text-[clamp(2.75rem,8vw,6rem)] leading-[0.95] tracking-[-0.045em] text-paper"
              style={{ animationDelay: '60ms' }}
            >
              Jad <em className="text-gold pr-2">Falaq</em>
            </h1>
            <p className="hero-rise mt-4 max-w-xl text-lg font-medium leading-snug text-paper md:text-xl" style={{ animationDelay: '140ms' }}>
              {t.hero.role}
            </p>
          </div>

          <div className="hero-rise mt-6 max-w-2xl" style={{ animationDelay: '220ms' }}>
            <p className="text-base leading-relaxed text-paper/80 md:text-lg">{t.hero.description}</p>

            <div className="mt-5 border-l-2 border-accent pl-4">
              <p className="flex items-start gap-2.5 text-[15px] font-medium leading-snug text-paper">
                <span className="mt-[0.45em] h-2 w-2 shrink-0 rounded-full bg-accent shadow-[0_0_0_3px_rgb(var(--accent)_/_0.18)]" aria-hidden="true" />
                {t.hero.seeking}
              </p>
              <p className="mt-1.5 pl-[18px] text-sm text-paper/70">{t.hero.location}</p>
            </div>

            <p className="mt-5 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.15em] text-paper/75">
              <Briefcase size={13} className="shrink-0 text-accent" aria-hidden="true" />
              {t.hero.credibility}
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a
                href="#projects"
                className="btn-gold group flex min-h-[48px] items-center justify-center gap-2 rounded-full px-7 text-sm font-semibold tracking-wide shadow-[0_10px_30px_-12px_rgb(var(--accent)_/_0.55)] transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-px hover:shadow-[0_14px_34px_-12px_rgb(var(--accent)_/_0.7)]"
              >
                {t.hero.ctaProjects}
                <ArrowDown size={16} aria-hidden="true" className="icon-nudge-down" />
              </a>
              <a
                href={p.cvFile}
                download
                aria-label={`${t.hero.ctaCV} — ${p.title} (PDF)`}
                className="group flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-paper/25 px-7 text-sm tracking-wide text-paper transition-colors duration-200 ease-out hover:border-accent hover:bg-accent/[0.06] hover:text-accent"
              >
                <Download size={15} aria-hidden="true" className="icon-nudge-down" />
                {t.hero.ctaCV}
              </a>
              <a
                href="#contact"
                className="group flex min-h-[48px] items-center justify-center gap-2 rounded-full px-5 text-sm tracking-wide text-paper/85 transition-colors duration-200 ease-out hover:text-accent"
              >
                <Mail size={15} aria-hidden="true" />
                <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-200 ease-out group-hover:bg-[length:100%_1px]">
                  {t.hero.ctaContact}
                </span>
                <ArrowUpRight size={14} aria-hidden="true" className="icon-nudge-right opacity-60" />
              </a>
            </div>
          </div>
        </div>
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
      <section id="profiles" className="grain relative bg-paper section-y text-ink">
        <div className="mx-auto max-w-7xl px-5 md:px-10">
          <motion.div {...fadeUp} className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <Eyebrow light>{t.profilePicker.eyebrow}</Eyebrow>
              <h2 className="t-h2 mt-5">
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
                  transition={{ duration: 0.5, delay: index * 0.06, ease: EASE }}
                  aria-pressed={active}
                  onClick={() => {
                    setProfile(id)
                    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className={`group relative flex min-h-[22rem] flex-col items-start overflow-hidden p-8 text-left transition-[transform,background-color,border-color,box-shadow] duration-[250ms] ease-out hover:-translate-y-[3px] focus-visible:-translate-y-[3px] ${
                    active
                      ? 'bg-ink text-paper shadow-[0_30px_60px_-25px_rgba(10,13,19,0.6)]'
                      : 'border border-lineInk bg-paper hover:border-accentDeep/40 hover:shadow-[0_25px_50px_-30px_rgba(10,13,19,0.35)]'
                  }`}
                >
                  {/* Gold top rule — full when active, grows on hover otherwise */}
                  <span
                    className={`absolute left-0 top-0 h-[2px] bg-gradient-to-r from-accentDeep via-accent to-accentDeep transition-[width] duration-300 ease-out ${
                      active ? 'w-full' : 'w-0 group-hover:w-full group-focus-visible:w-full'
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
                    <ArrowUpRight size={13} className="icon-nudge-right" />
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
      <section id="about" className="relative overflow-hidden section-y">
        <div className="pointer-events-none absolute -left-40 top-1/3 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgb(var(--accent)_/_0.08),transparent_65%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-16 px-5 md:grid-cols-[340px_1fr] md:gap-20 md:px-10">
          <motion.div {...fadeUp}>
            <div className="relative w-full max-w-[13rem] sm:max-w-[20rem]">
              {/* Offset gold frame */}
              <div className="absolute inset-0 translate-x-4 translate-y-4 border border-accent/50" />
              <div className="group relative aspect-[4/5] overflow-hidden bg-surface">
                <Image
                  src="/profil.jpg"
                  alt="Jad Falaq"
                  fill
                  className="object-cover grayscale transition-[transform,filter] duration-300 ease-out group-hover:scale-[1.02] group-hover:grayscale-0"
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
                <motion.h2
                  key={profile + '-quote'}
                  {...profileSwap}
                  className="relative text-[clamp(1.75rem,3.4vw,2.75rem)] font-medium italic leading-[1.2] tracking-[-0.03em] text-paper"
                >
                  {p.bioQuote}
                </motion.h2>
            </div>

              <motion.p
                key={profile + '-summary'}
                {...profileSwap}
                className="mt-8 max-w-2xl text-base leading-relaxed text-muted md:text-[17px]"
              >
                {p.summary}
              </motion.p>

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
                  <div className="font-display text-4xl leading-none text-gold sm:text-5xl md:text-6xl">{s.value}</div>
                  <div className="mt-3 break-words font-mono text-[9px] uppercase leading-relaxed tracking-[0.12em] text-muted sm:text-[10px] sm:tracking-[0.2em]">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Experience — timeline                                             */}
      {/* ---------------------------------------------------------------- */}
      <section id="experience" className="border-t border-line section-y">
        <div className="mx-auto max-w-7xl px-5 md:px-10">
          <SectionHeader eyebrow={t.sections.experienceEyebrow} title={t.experienceHeading} intro={t.sections.experienceIntro} />

            <motion.div
              key={profile + '-exp'}
              {...profileSwap}
              className="relative mt-16"
            >
              <div className="absolute bottom-0 left-[7px] top-2 w-px bg-gradient-to-b from-accent/70 via-line to-transparent md:left-[calc(240px+7px)]" />
              <div className="space-y-16">
                {p.experience.map((exp, index) => (
                  <motion.div
                    key={index}
                    {...fadeUp}
                    className="group/exp relative grid gap-5 pl-8 md:grid-cols-[240px_minmax(0,1fr)] md:gap-0 md:pl-0"
                  >
                    {/* Timeline node: fills in when its card is hovered or focused. */}
                    <span className="absolute left-0 top-0.5 flex h-[15px] w-[15px] items-center justify-center rounded-full border border-accent bg-ink transition-colors duration-200 ease-out group-hover/exp:bg-accent/20 group-focus-within/exp:bg-accent/20 md:left-[240px] md:top-8">
                      <span className="h-[5px] w-[5px] rounded-full bg-accent transition-transform duration-200 ease-out group-hover/exp:scale-150 group-focus-within/exp:scale-150" />
                    </span>

                    <div className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted md:pr-10 md:pt-7 md:text-right">
                      <p className="flex items-center gap-1.5 text-paper md:justify-end">
                        <Calendar size={12} className="text-accent" /> {exp.period}
                      </p>
                      <p className="mt-2 flex items-center gap-1.5 md:justify-end">
                        <MapPin size={12} /> {exp.location}
                      </p>
                    </div>

                    {/* Everything stays visible — the card only sharpens its border on hover/focus. */}
                    <div className="rounded-sm border border-line bg-surface/40 p-5 transition-colors duration-[250ms] ease-out group-hover/exp:border-accent/35 group-hover/exp:bg-surface/70 sm:p-6 md:ml-14 md:p-8">
                      <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
                        {exp.logo ? (
                          // Logos are photos with the wordmark centered: a 2:1 cover crop keeps the name large.
                          <div className="relative aspect-[2/1] w-44 shrink-0 overflow-hidden rounded-xl bg-white shadow-[0_0_0_1px_rgb(var(--accent)_/_0.5),0_18px_40px_-12px_rgb(var(--accent)_/_0.45)] md:w-52">
                            <Image src={exp.logo} alt={exp.company} fill sizes="208px" className="object-cover" />
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
                            <span>
                              {(() => {
                                const m = item.match(/^([^:]{3,60}?)\s?:\s/)
                                return m ? (
                                  <>
                                    <strong className="font-semibold text-paper">{m[1]}</strong> — {item.slice(m[0].length)}
                                  </>
                                ) : (
                                  item
                                )
                              })()}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Projects                                                          */}
      {/* ---------------------------------------------------------------- */}
      <section id="projects" className="border-t border-line section-y">
        <div className="mx-auto max-w-7xl px-5 md:px-10">
          <SectionHeader
            eyebrow={t.projectsSection.eyebrow}
            title={
              <>
                {t.projectsSection.heading[0]} <em className="text-gold pr-1">{t.projectsSection.heading[1]}</em>
              </>
            }
            intro={
              <>
                <span className="text-paper">{p.title}</span> — {t.projectsSection.description}
              </>
            }
          />

          <motion.div key={profile + '-featured'} {...profileSwap} className="mt-12 md:mt-14">
            <FeaturedShowcase
              projects={featuredProjects}
              diagrams={{ akwa: akwaCaseStudy[language].pipeline }}
              labels={{
                code: t.projectsSection.codeLabel,
                demo: t.projectsSection.demoLabel,
                caseStudy: t.caseStudy.readLabel,
                problem: t.caseStudy.problemLabel,
                confidential: t.caseStudy.confidentialNote,
              }}
            />
          </motion.div>

          <div className="mt-12 flex justify-center">
            <button
              type="button"
              onClick={() => setShowAllProjects((v) => !v)}
              aria-expanded={showAllProjects}
              aria-controls="all-projects"
              className="group flex min-h-[44px] items-center gap-3 rounded-full border border-line px-6 font-mono text-[11px] uppercase tracking-[0.2em] text-paper transition-colors hover:border-accent hover:text-accent"
            >
              {showAllProjects ? t.projectsSection.viewLessLabel : `${t.projectsSection.viewAllLabel} (${otherProjects.length + featuredProjects.length})`}
              <ArrowDown
                size={13}
                aria-hidden="true"
                className={`transition-transform duration-300 ${showAllProjects ? 'rotate-180' : ''}`}
              />
            </button>
          </div>

          <div id="all-projects">
            {showAllProjects && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="mt-14">
                <h3 className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted">
                  {t.projectsSection.allHeading} · {otherProjects.length}
                </h3>
                <div className="mt-6 grid gap-px overflow-hidden border border-line bg-line">
                  {otherProjects.map((project, index) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      index={index + featuredProjects.length}
                      codeLabel={t.projectsSection.codeLabel}
                      demoLabel={t.projectsSection.demoLabel}
                      noLinkLabel={t.projectsSection.noLinkLabel}
                      caseStudyLabel={t.caseStudy.readLabel}
                      visual={
                        project.diagram === 'akwa' ? (
                          <>
                            <div className="md:hidden">
                              <AkwaPipeline copy={akwaCaseStudy[language].pipeline} variant="compact" />
                            </div>
                            <div className="hidden h-full md:block">
                              <AkwaPipeline copy={akwaCaseStudy[language].pipeline} />
                            </div>
                          </>
                        ) : undefined
                      }
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Skills                                                            */}
      {/* ---------------------------------------------------------------- */}
      <section className="border-t border-line bg-surface section-y">
        <div className="mx-auto max-w-7xl px-5 md:px-10">
          <SectionHeader eyebrow={t.sections.skillsEyebrow} title={t.skillsHeading} intro={t.sections.skillsIntro} />
            <motion.div
              key={profile + '-skills'}
              {...profileSwap}
              className="mt-14 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-3"
            >
              {p.skills.map((group, i) => (
                <div key={group.heading} className="group bg-surface p-7 transition-colors duration-200 ease-out hover:bg-ink">
                  <div className="flex items-baseline gap-3">
                    <span className="font-display text-lg italic text-accent" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
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
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* CV                                                                */}
      {/* ---------------------------------------------------------------- */}
      <section id="cv" className="grain relative bg-paper section-y text-ink">
        <div className="mx-auto max-w-7xl px-5 md:px-10">
          <motion.div {...fadeUp} className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <Eyebrow light>{t.sections.cvEyebrow}</Eyebrow>
              <h2 className="t-h2 mt-5">
                {t.cv.heading.split(' ').slice(0, -1).join(' ')}{' '}
                <em className="text-accentDeep">{t.cv.heading.split(' ').slice(-1)}</em>
              </h2>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-mutedInk">{t.cv.description}</p>
            </div>
            <a
              href={p.cvFile}
              download
              className="group flex w-fit items-center gap-3 rounded-full bg-ink py-2 pl-6 pr-2 text-sm text-paper transition-[box-shadow,transform] duration-200 ease-out hover:-translate-y-px hover:shadow-[0_15px_40px_-15px_rgba(10,13,19,0.6)]"
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
                    <div className="flex flex-col items-start gap-5 sm:flex-row">
                      {edu.logo && (
                        // Natural aspect ratio (4:3 and square) so neither logo is cropped.
                        <div className="shrink-0 overflow-hidden rounded-xl bg-white shadow-[0_0_0_1px_rgb(var(--accent-deep)_/_0.45),0_16px_34px_-14px_rgb(var(--accent-deep)_/_0.55)] transition-transform duration-[250ms] ease-out hover:scale-[1.02]">
                          <Image
                            src={edu.logo.src}
                            alt={edu.school.split(' — ')[0]}
                            width={edu.logo.width}
                            height={edu.logo.height}
                            sizes="320px"
                            className="h-24 w-auto md:h-28"
                            style={edu.logo.zoom ? { transform: `scale(${edu.logo.zoom})` } : undefined}
                          />
                        </div>
                      )}
                      <div>
                      <h4 className="font-display text-2xl leading-tight">{edu.degree}</h4>
                      <p className="mt-1 text-sm text-mutedInk">{edu.school}</p>
                      </div>
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
                <Award size={13} /> {t.nav.projects}
              </h3>
                <motion.div
                  key={profile + '-cv-projects'}
                  {...profileSwap}
                  className="divide-y divide-lineInk border-y border-lineInk"
                >
                  {curatedProjects.map((project) => (
                    <div key={project.id} className="flex items-center justify-between gap-4 py-3.5">
                      <div className="min-w-0">
                        <h4 className="font-display text-lg leading-snug">{project.title}</h4>
                        <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.15em] text-mutedInk">
                          {project.category} · {project.year}
                        </p>
                      </div>
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`GitHub — ${project.title}`}
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-lineInk text-mutedInk transition-colors hover:border-accentDeep hover:text-accentDeep"
                        >
                          <Github size={15} />
                        </a>
                      )}
                    </div>
                  ))}
                </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Contact                                                           */}
      {/* ---------------------------------------------------------------- */}
      <section id="contact" className="grain relative overflow-hidden section-y">
        <div className="pointer-events-none absolute -bottom-40 right-0 h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(circle,rgb(var(--accent)_/_0.16),transparent_65%)] blur-2xl" />
        <div className="relative mx-auto max-w-7xl px-5 md:px-10">
          <motion.div {...fadeUp}>
            <Eyebrow>{t.contact.eyebrow}</Eyebrow>
            <h2 className="mt-5 font-display text-[clamp(2.25rem,6.5vw,5rem)] leading-[1] tracking-[-0.045em]">
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
                  className="group flex items-center justify-between border-b border-line py-6 transition-colors duration-200 ease-out hover:border-accent/50"
                >
                  <span className="flex items-center gap-4">
                    <Icon size={18} className="text-accent" />
                    <span className="font-display text-2xl text-paper transition-transform duration-200 ease-out group-hover:translate-x-1 md:text-3xl">
                      {label}
                    </span>
                  </span>
                  <ArrowUpRight size={18} className="icon-nudge-right text-muted group-hover:text-accent" />
                </a>
              ))}
            </motion.div>

            <motion.form {...fadeUp} onSubmit={handleFormSubmit} className="border border-line bg-surface/60 p-7 backdrop-blur md:p-10">
              <div className="grid gap-2 sm:grid-cols-2 sm:gap-8">
                <div>
                <label htmlFor="contact-name" className="sr-only">{t.contact.form.name}</label>
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={handleFormChange}
                  placeholder={t.contact.form.name}
                  className={inputClass}
                />
                </div>
                <div>
                <label htmlFor="contact-email" className="sr-only">{t.contact.form.email}</label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleFormChange}
                  placeholder={t.contact.form.email}
                  className={inputClass}
                />
                </div>
              </div>
              <label htmlFor="contact-message" className="sr-only">{t.contact.form.message}</label>
              <textarea
                id="contact-message"
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
              <div aria-live="polite">
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
              </div>
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
            <nav aria-label="Contact" className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <a href={`mailto:${contact.email}`} className="transition-colors hover:text-accent">
                Email
              </a>
              <a href={contact.linkedinUrl} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-accent">
                LinkedIn
              </a>
              <a href={contact.githubUrl} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-accent">
                GitHub
              </a>
              <a href={p.cvFile} download className="flex items-center gap-1.5 text-paper transition-colors hover:text-accent">
                <Download size={12} aria-hidden="true" /> CV
              </a>
            </nav>
            <a href="#hero" className="group flex items-center gap-2 transition-colors hover:text-accent">
              <ArrowUp size={13} className="transition-transform group-hover:-translate-y-0.5" />
              Top
            </a>
          </div>
          <div className="rule-gold mt-10" />
        </div>
        <p
          aria-hidden="true"
          className="select-none whitespace-nowrap pb-4 pt-6 text-center font-display text-[16vw] leading-[0.9] tracking-[-0.05em] text-transparent"
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
    </MotionConfig>
  )
}
