'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import {
  ArrowUpRight,
  Download,
  Mail,
  Phone,
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
} from 'lucide-react'
import ProjectCard from '../components/ProjectCard'
import { useLanguage } from '../contexts/LanguageContext'
import { useProfile, PROFILE_IDS, type ProfileId } from '../contexts/ProfileContext'
import { siteContent, contact } from '../data/content'

type FormStatus = 'idle' | 'sending' | 'success' | 'error'

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
}

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState('hero')
  const [menuOpen, setMenuOpen] = useState(false)
  const [showAllProjects, setShowAllProjects] = useState(false)
  const { language, toggleLanguage } = useLanguage()
  const { profile, setProfile } = useProfile()
  const t = siteContent[language]
  const p = t.profiles[profile]

  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [formStatus, setFormStatus] = useState<FormStatus>('idle')

  useEffect(() => {
    const handleScroll = () => {
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
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setShowAllProjects(false)
  }, [profile])

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

  const navLinks: { id: string; label: string }[] = [
    { id: 'profiles', label: t.nav.profiles },
    { id: 'projects', label: t.nav.projects },
    { id: 'cv', label: t.nav.cv },
    { id: 'contact', label: t.nav.contact },
  ]

  return (
    <div className="min-h-screen bg-ink text-paper">
      {/* ---------------------------------------------------------------- */}
      {/* Nav                                                               */}
      {/* ---------------------------------------------------------------- */}
      <nav className="fixed top-0 z-50 w-full border-b border-line bg-ink/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 md:px-8">
          <a href="#hero" className="font-mono text-lg font-bold text-paper">
            JF<span className="text-accent">.</span>
          </a>

          {/* Profile pill switcher — desktop */}
          <div className="hidden items-center gap-1 rounded-full border border-line p-1 lg:flex">
            {PROFILE_IDS.map((id) => (
              <button
                key={id}
                onClick={() => setProfile(id)}
                className={`rounded-full px-4 py-1.5 font-mono text-xs transition-colors ${
                  profile === id ? 'bg-paper text-ink' : 'text-muted hover:text-paper'
                }`}
              >
                {t.profiles[id].navLabel}
              </button>
            ))}
          </div>

          <div className="hidden items-center gap-6 md:flex">
            {navLinks.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`font-mono text-xs uppercase tracking-wider transition-colors ${
                  activeSection === item.id ? 'text-accent' : 'text-muted hover:text-paper'
                }`}
              >
                {item.label}
              </a>
            ))}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 font-mono text-xs text-muted transition-colors hover:text-paper"
              aria-label="Toggle language"
            >
              <LanguagesIcon size={13} />
              {language === 'fr' ? 'FR' : 'EN'}
            </button>
          </div>

          <button className="md:hidden" onClick={() => setMenuOpen((v) => !v)} aria-label="Menu">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-line md:hidden"
            >
              <div className="flex flex-col gap-4 px-5 py-5">
                <div className="flex flex-wrap gap-2">
                  {PROFILE_IDS.map((id) => (
                    <button
                      key={id}
                      onClick={() => { setProfile(id); setMenuOpen(false) }}
                      className={`rounded-full border px-3 py-1.5 font-mono text-xs ${
                        profile === id ? 'border-accent text-accent' : 'border-line text-muted'
                      }`}
                    >
                      {t.profiles[id].navLabel}
                    </button>
                  ))}
                </div>
                {navLinks.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={() => setMenuOpen(false)}
                    className="font-mono text-sm uppercase tracking-wider text-muted"
                  >
                    {item.label}
                  </a>
                ))}
                <button
                  onClick={toggleLanguage}
                  className="flex w-fit items-center gap-1.5 rounded-full border border-line px-3 py-1.5 font-mono text-xs text-muted"
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
      <section id="hero" className="relative overflow-hidden pt-36 pb-20 md:pt-44 md:pb-28">
        <svg
          className="pointer-events-none absolute left-0 top-24 w-full opacity-40"
          height="140"
          viewBox="0 0 1200 140"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d="M0 90 C 150 10, 300 130, 460 60 S 760 10, 900 70 S 1100 120, 1200 40"
            stroke="#A8E063"
            strokeWidth="1.5"
          />
        </svg>

        <div className="relative mx-auto max-w-6xl px-5 md:px-8">
          <motion.p {...fadeUp} className="font-mono text-xs uppercase tracking-widest text-muted">
            {t.hero.eyebrow}
          </motion.p>

          <div className="mt-5 flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
            <motion.h1
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.05 }}
              className="font-mono text-5xl font-bold leading-[1.05] sm:text-6xl md:text-7xl"
            >
              <span className="block">{t.hero.headline[0]}</span>
              <span className="block">
                {t.hero.headline[1]}{' '}
                <span className="text-accent">{t.hero.headline[2]}</span>
              </span>
            </motion.h1>

            <motion.div
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.1 }}
              className="shrink-0 text-right"
            >
              <div className="font-mono text-4xl font-bold text-accent">{t.hero.statNumber}</div>
              <div className="font-mono text-[11px] uppercase tracking-wider text-muted">{t.hero.statLabel}</div>
              <div className="font-mono text-[11px] text-muted">{t.hero.statSub}</div>
            </motion.div>
          </div>

          <motion.p
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.15 }}
            className="mt-8 max-w-xl text-base leading-relaxed text-muted md:text-lg"
          >
            {t.hero.description}
          </motion.p>

          <motion.div
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.2 }}
            className="mt-9 flex flex-wrap gap-4"
          >
            <a
              href="#projects"
              className="rounded-full bg-accent px-6 py-3 font-mono text-sm font-semibold text-ink transition-opacity hover:opacity-90"
            >
              {t.hero.ctaProjects}
            </a>
            <a
              href="#cv"
              className="flex items-center gap-2 rounded-full border border-line px-6 py-3 font-mono text-sm text-paper transition-colors hover:border-accent"
            >
              <Download size={16} />
              {t.hero.ctaCV}
            </a>
          </motion.div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Profile picker                                                    */}
      {/* ---------------------------------------------------------------- */}
      <section id="profiles" className="bg-paper py-20 text-ink md:py-28">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <motion.div {...fadeUp} className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-mutedInk">{t.profilePicker.eyebrow}</p>
              <h2 className="mt-3 font-mono text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
                {t.profilePicker.heading[0]}
                <br />
                {t.profilePicker.heading[1]}
              </h2>
            </div>
            <p className="max-w-xs text-sm text-mutedInk">{t.profilePicker.description}</p>
          </motion.div>

          <div className="mt-12 grid gap-px overflow-hidden border border-lineInk bg-lineInk md:grid-cols-3">
            {PROFILE_IDS.map((id, index) => (
              <motion.button
                key={id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                onClick={() => {
                  setProfile(id)
                  document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className={`group flex flex-col items-start bg-paper p-7 text-left transition-colors hover:bg-ink/5 ${
                  profile === id ? 'bg-ink/[0.04]' : ''
                }`}
              >
                <span className={`font-mono text-xs uppercase tracking-wider ${profile === id ? 'text-accent' : 'text-mutedInk'}`}>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="mt-2 font-mono text-xl font-bold">{t.profiles[id].title}</span>
                <p className="mt-4 text-sm leading-relaxed text-mutedInk">{t.profiles[id].pickerDescription}</p>
                <span className="mt-6 inline-flex items-center gap-1 font-mono text-xs font-semibold text-ink">
                  {t.profilePicker.enterLabel}
                  <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Bio                                                               */}
      {/* ---------------------------------------------------------------- */}
      <section id="about" className="py-20 md:py-28">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 md:grid-cols-[320px_1fr] md:px-8">
          <motion.div {...fadeUp}>
            <div className="relative aspect-[4/5] w-full max-w-xs overflow-hidden border border-line grayscale">
              <Image src="/profil.jpg" alt="Jad Falaq" fill className="object-cover" />
            </div>
            <p className="mt-3 font-mono text-[11px] uppercase tracking-wider text-muted">{t.bio.location}</p>
          </motion.div>

          <div>
            <motion.p {...fadeUp} className="font-mono text-xs uppercase tracking-widest text-muted">
              {t.bio.eyebrow}
            </motion.p>
            <motion.p
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.05 }}
              className="mt-3 font-mono text-[11px] uppercase tracking-wider text-accent"
            >
              {t.bio.tag}
            </motion.p>

            <AnimatePresence mode="wait">
              <motion.h2
                key={profile + '-quote'}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35 }}
                className="mt-4 font-mono text-2xl font-bold leading-snug sm:text-3xl md:text-4xl"
              >
                {p.bioQuote}
              </motion.h2>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.p
                key={profile + '-summary'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-6 max-w-2xl text-base leading-relaxed text-muted"
              >
                {p.summary}
              </motion.p>
            </AnimatePresence>

            <div className="mt-8 flex flex-wrap gap-2">
              {p.keywords.map((k) => (
                <span key={k} className="rounded-full border border-line px-3 py-1 font-mono text-[11px] text-muted">
                  {k}
                </span>
              ))}
            </div>

            <div className="mt-10 grid grid-cols-3 gap-6 border-t border-line pt-6">
              {t.bio.stats.map((s) => (
                <div key={s.label}>
                  <div className="font-mono text-2xl font-bold text-accent md:text-3xl">{s.value}</div>
                  <div className="mt-1 font-mono text-[11px] uppercase tracking-wider text-muted">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Skills                                                            */}
      {/* ---------------------------------------------------------------- */}
      <section className="border-t border-line py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <motion.h2 {...fadeUp} className="font-mono text-2xl font-bold sm:text-3xl">
            {t.skillsHeading}
          </motion.h2>
          <AnimatePresence mode="wait">
            <motion.div
              key={profile + '-skills'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
            >
              {p.skills.map((group) => (
                <div key={group.heading}>
                  <h3 className="font-mono text-xs uppercase tracking-wider text-accent">{group.heading}</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <span key={item} className="rounded-full border border-line px-3 py-1 text-xs text-muted">
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
      {/* Experience                                                        */}
      {/* ---------------------------------------------------------------- */}
      <section id="experience" className="border-t border-line py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <motion.h2 {...fadeUp} className="font-mono text-2xl font-bold sm:text-3xl">
            {t.experienceHeading}
          </motion.h2>

          <AnimatePresence mode="wait">
            <motion.div
              key={profile + '-exp'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-10 space-y-6"
            >
              {p.experience.map((exp, index) => (
                <div key={index} className="border border-line p-6 md:p-8">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="flex items-start gap-4">
                      {exp.logo ? (
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden border border-line bg-paper">
                          <Image src={exp.logo} alt={exp.company} fill className="object-cover" />
                        </div>
                      ) : (
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-line">
                          <Briefcase size={18} className="text-accent" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-mono text-lg font-semibold text-paper">{exp.title}</h3>
                        <p className="font-mono text-sm text-accent">
                          {exp.company} <span className="text-muted">· {exp.type}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-col gap-1 font-mono text-xs text-muted md:items-end">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={13} /> {exp.period}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin size={13} /> {exp.location}
                      </span>
                    </div>
                  </div>
                  <ul className="mt-5 space-y-2.5 md:pl-16">
                    {exp.description.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm leading-relaxed text-muted">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Projects                                                          */}
      {/* ---------------------------------------------------------------- */}
      <section id="projects" className="border-t border-line py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <motion.div {...fadeUp} className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-muted">{t.projectsSection.eyebrow}</p>
              <h2 className="mt-3 font-mono text-3xl font-bold leading-tight sm:text-4xl">
                {t.projectsSection.heading[0]} {t.projectsSection.heading[1]}
              </h2>
              <p className="mt-3 max-w-md text-sm text-muted">{t.projectsSection.description}</p>
            </div>
            <button
              onClick={() => setShowAllProjects((v) => !v)}
              className="flex w-fit items-center gap-1.5 font-mono text-xs text-accent"
            >
              {showAllProjects ? t.projectsSection.viewLessLabel : t.projectsSection.viewAllLabel}
              <ArrowUpRight size={14} />
            </button>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={profile + '-projects-' + showAllProjects}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-12 grid gap-px overflow-hidden border border-line bg-line md:grid-cols-2"
            >
              {visibleProjects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                  codeLabel={t.projectsSection.codeLabel}
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
      <section id="cv" className="border-t border-line bg-paper py-20 text-ink md:py-28">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <motion.div {...fadeUp} className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <h2 className="font-mono text-3xl font-bold sm:text-4xl">{t.cv.heading}</h2>
              <p className="mt-3 max-w-md text-sm text-mutedInk">{t.cv.description}</p>
            </div>
            <a
              href={p.cvFile}
              download
              className="flex w-fit items-center gap-2 rounded-full bg-ink px-6 py-3 font-mono text-sm font-semibold text-paper transition-opacity hover:opacity-90"
            >
              <Download size={16} />
              {t.cv.downloadLabel} — {p.title}
            </a>
          </motion.div>

          <div className="mt-14 grid gap-10 md:grid-cols-3">
            <div className="space-y-8 md:col-span-1">
              <div>
                <h3 className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-mutedInk">
                  <Mail size={14} /> {t.cv.contactHeading}
                </h3>
                <div className="mt-3 space-y-2 text-sm">
                  <p>{contact.email}</p>
                  {contact.phones.map((ph) => (
                    <p key={ph}>{ph}</p>
                  ))}
                  <p>{t.bio.location}</p>
                  <a href={contact.githubUrl} target="_blank" rel="noopener noreferrer" className="block hover:text-accent">
                    {contact.github}
                  </a>
                  <a href={contact.linkedinUrl} target="_blank" rel="noopener noreferrer" className="block hover:text-accent">
                    {contact.linkedin}
                  </a>
                </div>
              </div>

              <div>
                <h3 className="font-mono text-xs uppercase tracking-wider text-mutedInk">{t.cv.languagesHeading}</h3>
                <div className="mt-3 space-y-1.5 text-sm">
                  {t.languages.map((l) => (
                    <div key={l.name} className="flex justify-between">
                      <span>{l.name}</span>
                      <span className="text-mutedInk">{l.level}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-mono text-xs uppercase tracking-wider text-mutedInk">{t.cv.certificationsHeading}</h3>
                <div className="mt-3 space-y-3 text-sm">
                  {t.certifications.map((c) => (
                    <div key={c.title}>
                      <p className="font-medium">{c.title}</p>
                      <p className="text-xs text-mutedInk">{c.place} · {c.date}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-mono text-xs uppercase tracking-wider text-mutedInk">{t.cv.softSkillsHeading}</h3>
                <div className="mt-3 space-y-3 text-sm">
                  {t.softSkills.map((s) => (
                    <div key={s.title}>
                      <p className="font-medium">{s.title}</p>
                      <p className="text-xs text-mutedInk">{s.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6 md:col-span-2">
              <h3 className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-mutedInk">
                <GraduationCap size={14} /> {t.cv.educationHeading}
              </h3>
              {t.education.map((edu) => (
                <div key={edu.degree} className="border border-lineInk p-6">
                  <div className="flex flex-col justify-between gap-2 md:flex-row md:items-start">
                    <div>
                      <h4 className="font-mono text-base font-semibold">{edu.degree}</h4>
                      <p className="text-sm text-mutedInk">{edu.school}</p>
                    </div>
                    <div className="shrink-0 text-right font-mono text-xs text-mutedInk">
                      <p>{edu.period}</p>
                      <p>{edu.location}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-mutedInk">{edu.details}</p>
                </div>
              ))}

              <h3 className="flex items-center gap-2 pt-4 font-mono text-xs uppercase tracking-wider text-mutedInk">
                <Award size={14} /> {t.projectsSection.heading.join(' ')}
              </h3>
              <AnimatePresence mode="wait">
                <motion.div
                  key={profile + '-cv-projects'}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {curatedProjects.map((project) => (
                    <div key={project.id} className="border border-lineInk p-5">
                      <div className="flex items-start justify-between gap-3">
                        <h4 className="font-mono text-sm font-semibold">{project.title}</h4>
                        {project.github && (
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex shrink-0 items-center gap-1 font-mono text-xs text-mutedInk hover:text-ink"
                          >
                            <Github size={13} /> {contact.github.replace('github.com/', '')}
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
      <section id="contact" className="border-t border-line py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <motion.div {...fadeUp}>
            <p className="font-mono text-xs uppercase tracking-widest text-accent">{t.contact.eyebrow}</p>
            <h2 className="mt-3 font-mono text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
              {t.contact.heading[0]}
              <br />
              <span className="text-accent">{t.contact.heading[1]}</span>
            </h2>
            <p className="mt-5 max-w-md text-sm text-muted">{t.contact.description}</p>
            <p className="mt-2 font-mono text-xs text-muted">{t.contact.availability}</p>
          </motion.div>

          <div className="mt-14 grid gap-12 md:grid-cols-2">
            <motion.div {...fadeUp} className="flex flex-wrap gap-x-8 gap-y-3 font-mono text-sm">
              <a href={`mailto:${contact.email}`} className="flex items-center gap-1.5 text-paper hover:text-accent">
                <Mail size={15} /> {contact.email}
                <ArrowUpRight size={13} />
              </a>
              <a href={contact.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-paper hover:text-accent">
                <Linkedin size={15} /> LinkedIn
                <ArrowUpRight size={13} />
              </a>
              <a href={contact.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-paper hover:text-accent">
                <Github size={15} /> GitHub
                <ArrowUpRight size={13} />
              </a>
            </motion.div>

            <motion.form {...fadeUp} onSubmit={handleFormSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleFormChange}
                placeholder={t.contact.form.name}
                className="w-full border border-line bg-transparent px-4 py-3 text-sm text-paper placeholder-muted outline-none focus:border-accent"
              />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleFormChange}
                placeholder={t.contact.form.email}
                className="w-full border border-line bg-transparent px-4 py-3 text-sm text-paper placeholder-muted outline-none focus:border-accent"
              />
              <textarea
                rows={4}
                name="message"
                required
                value={formData.message}
                onChange={handleFormChange}
                placeholder={t.contact.form.message}
                className="w-full resize-none border border-line bg-transparent px-4 py-3 text-sm text-paper placeholder-muted outline-none focus:border-accent"
              />
              <button
                type="submit"
                disabled={formStatus === 'sending'}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 font-mono text-sm font-semibold text-ink transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {formStatus === 'sending' && <Loader2 className="animate-spin" size={16} />}
                {formStatus === 'sending' ? t.contact.form.sending : t.contact.form.submit}
              </button>
              {formStatus === 'success' && (
                <p className="flex items-center gap-2 text-sm text-accent">
                  <CheckCircle2 size={16} /> {t.contact.form.success}
                </p>
              )}
              {formStatus === 'error' && (
                <p className="flex items-center gap-2 text-sm text-red-400">
                  <AlertCircle size={16} /> {t.contact.form.error}
                </p>
              )}
            </motion.form>
          </div>
        </div>
      </section>

      <footer className="border-t border-line py-8">
        <div className="mx-auto max-w-6xl px-5 text-center font-mono text-xs text-muted md:px-8">
          {t.footer}
        </div>
      </footer>
    </div>
  )
}
