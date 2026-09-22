'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import {
  Brain,
  Code,
  Database,
  GitBranch,
  Mail,
  MapPin,
  Phone,
  Download,
  Github,
  Linkedin,
  ChevronDown,
  Cpu,
  Zap,
  Target,
  Award,
  Bot,
  Network,
  Activity,
  Languages as LanguagesIcon,
  Briefcase,
  Calendar,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'
import AIParticles from '../components/AIParticles'
import CodeRain from '../components/CodeRain'
import NeuralNetwork from '../components/NeuralNetwork'
import AIStats from '../components/AIStats'
import AITerminal from '../components/AITerminal'
import HolographicCard from '../components/HolographicCard'
import NeonSkillBar from '../components/NeonSkillBar'
import AICursor from '../components/AICursor'
import CVSection from '../components/CVSection'
import { useLanguage } from '../contexts/LanguageContext'
import { siteContent, contact } from '../data/content'

const skillIcons = [Brain, Cpu, Code, Zap, Database, Target, Brain, GitBranch]

type FormStatus = 'idle' | 'sending' | 'success' | 'error'

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState('hero')
  const { language, toggleLanguage } = useLanguage()
  const t = siteContent[language]

  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [formStatus, setFormStatus] = useState<FormStatus>('idle')

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

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'about', 'skills', 'experience', 'projects', 'cv', 'contact']
      const scrollPosition = window.scrollY + 100

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

  const navItems: { id: string; label: string }[] = [
    { id: 'hero', label: t.nav.hero },
    { id: 'about', label: t.nav.about },
    { id: 'skills', label: t.nav.skills },
    { id: 'experience', label: t.nav.experience },
    { id: 'projects', label: t.nav.projects },
    { id: 'cv', label: t.nav.cv },
    { id: 'contact', label: t.nav.contact },
  ]

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  }

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Dynamic Background Effects */}
      <AIParticles />
      <CodeRain />
      <AICursor />
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl font-bold text-white"
            >
              JF
            </motion.div>
            <div className="flex items-center gap-8">
              <div className="hidden md:flex space-x-8">
                {navItems.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={`text-sm font-medium transition-colors ${
                      activeSection === item.id
                        ? 'text-blue-400'
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
              <motion.button
                onClick={toggleLanguage}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/20 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all"
                aria-label="Toggle language"
              >
                <LanguagesIcon size={16} />
                {language === 'fr' ? 'FR' : 'EN'}
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>

        {/* Neural Network Background */}
        <div className="absolute inset-0 opacity-30">
          <NeuralNetwork />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            {/* Profile Photo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="relative mx-auto md:mx-0"
            >
              <div className="relative w-80 h-80 mx-auto">
                {/* Animated border */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 p-1"
                >
                  <div className="w-full h-full rounded-full bg-slate-900"></div>
                </motion.div>

                {/* Profile image */}
                <div className="absolute inset-2 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center overflow-hidden">
                  <Image
                    src="/profil.jpg"
                    alt="Jad Falaq - AI Engineer"
                    fill
                    className="object-cover rounded-full"
                    priority
                  />
                </div>

                {/* Floating AI icons */}
                <motion.div
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -top-4 -right-4 bg-blue-500/20 backdrop-blur-lg rounded-full p-3"
                >
                  <Bot className="text-blue-400" size={24} />
                </motion.div>
                <motion.div
                  animate={{ y: [10, -10, 10] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                  className="absolute -bottom-4 -left-4 bg-purple-500/20 backdrop-blur-lg rounded-full p-3"
                >
                  <Network className="text-purple-400" size={24} />
                </motion.div>
              </div>
            </motion.div>

            {/* Text Content */}
            <div className="text-left">
              <motion.h1
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-5xl md:text-7xl font-bold text-white mb-6"
              >
                Jad <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Falaq</span>
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex items-center gap-3 mb-6"
              >
                <Activity className="text-green-400" size={24} />
                <p className="text-xl md:text-2xl text-gray-300">
                  {t.hero.role}
                </p>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-lg text-gray-400 mb-8"
              >
                {t.hero.tagline}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <motion.a
                  href="#projects"
                  whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(59, 130, 246, 0.5)" }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all text-center"
                >
                  {t.hero.ctaWork}
                </motion.a>
                <motion.a
                  href="#cv"
                  whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(147, 51, 234, 0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 border border-white/20 text-white rounded-lg font-medium hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                >
                  <Download size={20} />
                  {t.hero.ctaCV}
                </motion.a>
              </motion.div>
            </div>
          </motion.div>
        </div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <ChevronDown className="text-white/60" size={32} />
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2
              variants={fadeInUp}
              className="text-4xl font-bold text-white text-center mb-16"
            >
              {t.about.heading}
            </motion.h2>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div variants={fadeInUp}>
                {/* AI Terminal Demo */}
                <AITerminal />
              </motion.div>
              <motion.div variants={fadeInUp} className="space-y-6">
                <p className="text-gray-300 text-lg leading-relaxed">
                  {t.about.paragraph1}
                </p>
                <p className="text-gray-300 text-lg leading-relaxed">
                  {t.about.paragraph2}
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                  <div className="flex items-center gap-2 text-blue-400">
                    <MapPin size={20} />
                    <span>{t.about.locationLabel}</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-400">
                    <Award size={20} />
                    <span>{t.about.badgeLabel}</span>
                  </div>
                </div>

                {/* AI Stats */}
                <AIStats />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2
              variants={fadeInUp}
              className="text-4xl font-bold text-white text-center mb-16"
            >
              {t.skillsHeading}
            </motion.h2>
            <div className="grid md:grid-cols-2 gap-6">
              {t.skills.map((skill, index) => (
                <NeonSkillBar
                  key={index}
                  name={skill.name}
                  level={skill.level}
                  icon={skillIcons[index % skillIcons.length]}
                  index={index}
                />
              ))}
            </div>

            {/* Technical toolbox (categorized skills from the CV) */}
            <motion.div variants={fadeInUp} className="mt-12">
              <h3 className="text-xl font-semibold text-white text-center mb-8">{t.skillGroupsHeading}</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {t.cv.skillGroups.map((group, groupIndex) => (
                  <div
                    key={groupIndex}
                    className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-blue-500/50 transition-all"
                  >
                    <h4 className="text-blue-300 font-semibold mb-3">{group.heading}</h4>
                    <div className="flex flex-wrap gap-2">
                      {group.items.map((item, itemIndex) => (
                        <span
                          key={itemIndex}
                          className="px-3 py-1 bg-blue-600/10 text-gray-300 rounded-full text-xs border border-white/10"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-20 bg-black/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2
              variants={fadeInUp}
              className="text-4xl font-bold text-white text-center mb-16"
            >
              {t.experienceHeading}
            </motion.h2>
            <div className="space-y-8">
              {t.experiencePro.map((exp, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  whileHover={{ scale: 1.01 }}
                  className="bg-white/5 backdrop-blur-lg rounded-xl p-6 md:p-8 border border-white/10 border-l-4 border-l-blue-500 hover:border-blue-500/50 transition-all"
                >
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4 gap-3">
                    <div className="flex items-start gap-3">
                      {exp.logo ? (
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-white/10 flex-shrink-0 bg-white">
                          <Image src={exp.logo} alt={exp.company} fill className="object-cover" />
                        </div>
                      ) : (
                        <div className="p-2 bg-blue-500/20 rounded-lg mt-1 flex-shrink-0">
                          <Briefcase className="text-blue-400" size={20} />
                        </div>
                      )}
                      <div>
                        <h3 className="text-xl font-semibold text-white">{exp.title}</h3>
                        <p className="text-blue-400 font-medium">{exp.company}</p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-400 flex flex-col md:items-end gap-1 flex-shrink-0">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        {exp.period}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin size={14} />
                        {exp.location}
                      </div>
                    </div>
                  </div>
                  <ul className="space-y-2 md:pl-11">
                    {exp.description.map((item, i) => (
                      <li key={i} className="text-gray-300 text-sm flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2
              variants={fadeInUp}
              className="text-4xl font-bold text-white text-center mb-16"
            >
              {t.projectsHeading}
            </motion.h2>
            <div className="grid md:grid-cols-2 gap-8">
              {t.projects.map((project, index) => (
                <HolographicCard key={index} project={project} index={index} />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CV Section */}
      <CVSection />

      {/* Contact Section */}
      <section id="contact" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2
              variants={fadeInUp}
              className="text-4xl font-bold text-white text-center mb-16"
            >
              {t.contact.heading}
            </motion.h2>
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12">
                <motion.div variants={fadeInUp} className="space-y-8">
                  <div>
                    <h3 className="text-2xl font-semibold text-white mb-4">{t.contact.subheading}</h3>
                    <p className="text-gray-300 text-lg">
                      {t.contact.paragraph}
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 text-gray-300">
                      <Mail className="text-blue-400" size={24} />
                      <span>{contact.email}</span>
                    </div>
                    {contact.phones.map((phone) => (
                      <div key={phone} className="flex items-center gap-4 text-gray-300">
                        <Phone className="text-blue-400" size={24} />
                        <span>{phone}</span>
                      </div>
                    ))}
                    <div className="flex items-center gap-4 text-gray-300">
                      <MapPin className="text-blue-400" size={24} />
                      <span>{t.contact.location}</span>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <a href={contact.githubUrl} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                      <Github className="text-white" size={24} />
                    </a>
                    <a href={contact.linkedinUrl} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                      <Linkedin className="text-white" size={24} />
                    </a>
                  </div>
                </motion.div>
                <motion.div variants={fadeInUp}>
                  <form className="space-y-6" onSubmit={handleFormSubmit}>
                    <div>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleFormChange}
                        placeholder={t.contact.form.name}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleFormChange}
                        placeholder={t.contact.form.email}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <textarea
                        rows={5}
                        name="message"
                        required
                        value={formData.message}
                        onChange={handleFormChange}
                        placeholder={t.contact.form.message}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-none"
                      />
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={formStatus === 'sending'}
                      className="w-full px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {formStatus === 'sending' && <Loader2 className="animate-spin" size={20} />}
                      {formStatus === 'sending' ? t.contact.form.sending : t.contact.form.submit}
                    </motion.button>
                    {formStatus === 'success' && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 text-green-400 text-sm"
                      >
                        <CheckCircle2 size={18} />
                        {t.contact.form.success}
                      </motion.p>
                    )}
                    {formStatus === 'error' && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 text-red-400 text-sm"
                      >
                        <AlertCircle size={18} />
                        {t.contact.form.error}
                      </motion.p>
                    )}
                  </form>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-black/40 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-400">
            <p>{t.footer}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
