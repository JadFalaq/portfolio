'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import {
  Download,
  Briefcase,
  GraduationCap,
  Award,
  Calendar,
  MapPin,
  Mail,
  Phone,
  Globe,
  Github,
  Linkedin,
  Cpu
} from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import { siteContent, contact } from '../data/content'

export default function CVSection() {
  const { language } = useLanguage()
  const t = siteContent[language]

  const handleDownloadCV = () => {
    const fileName = language === 'fr' ? '/CV_JadFalaq.pdf' : '/Resume_JadFalaq.pdf'
    const link = document.createElement('a')
    link.href = fileName
    link.download = language === 'fr' ? 'CV_JadFalaq.pdf' : 'Resume_JadFalaq.pdf'
    link.target = '_blank'

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  }

  return (
    <section id="cv" className="py-20 bg-black/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {/* Header */}
          <div className="text-center mb-16">
            <motion.h2
              variants={fadeInUp}
              className="text-4xl font-bold text-white mb-6"
            >
              {t.cv.heading}
            </motion.h2>
            <motion.button
              variants={fadeInUp}
              whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(59, 130, 246, 0.5)" }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDownloadCV}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center gap-2 mx-auto"
            >
              <Download size={20} />
              {t.cv.downloadLabel}
            </motion.button>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Colonne gauche - Informations personnelles */}
            <motion.div variants={fadeInUp} className="lg:col-span-1">
              <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 mb-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Mail className="text-blue-400" size={20} />
                  {t.cv.contactHeading}
                </h3>
                <div className="space-y-3 text-gray-300">
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="text-blue-400" />
                    <span>{contact.email}</span>
                  </div>
                  {contact.phones.map((phone) => (
                    <div key={phone} className="flex items-center gap-2">
                      <Phone size={16} className="text-blue-400" />
                      <span>{phone}</span>
                    </div>
                  ))}
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-blue-400" />
                    <span>{t.contact.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Github size={16} className="text-blue-400" />
                    <span>{contact.github}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Linkedin size={16} className="text-blue-400" />
                    <span>{contact.linkedin}</span>
                  </div>
                </div>
              </div>

              {/* Langues */}
              <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 mb-6">
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                  <Globe className="text-blue-400" size={20} />
                  {t.cv.languagesHeading}
                </h3>
                <div className="space-y-4">
                  {t.cv.languages.map((lang, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-white font-medium">{lang.name}</span>
                      <span className="text-gray-300 text-sm">{lang.level}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Compétences Techniques */}
              <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Cpu className="text-blue-400" size={20} />
                  {t.cv.technicalSkillsHeading}
                </h3>
                <div className="space-y-5">
                  {t.cv.skillGroups.map((group, groupIndex) => (
                    <div key={groupIndex}>
                      <h4 className="text-blue-300 text-sm font-semibold mb-2">{group.heading}</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {group.items.map((item, index) => (
                          <motion.span
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: groupIndex * 0.05 + index * 0.02 }}
                            className="px-2 py-1 bg-blue-600/10 text-gray-300 rounded-md text-xs border border-white/10"
                          >
                            {item}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Colonne droite - Expérience et Formation */}
            <div className="lg:col-span-2 space-y-8">
              {/* Expérience Professionnelle */}
              <motion.div variants={fadeInUp}>
                <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
                  <Briefcase className="text-blue-400" size={24} />
                  {t.cv.experienceProHeading}
                </h3>
                <div className="space-y-6">
                  {t.experiencePro.map((exp, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-blue-500/50 transition-all"
                    >
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-3">
                        <div className="flex items-start gap-3">
                          {exp.logo && (
                            <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-white/10 flex-shrink-0 bg-white">
                              <Image src={exp.logo} alt={exp.company} fill className="object-cover" />
                            </div>
                          )}
                          <div>
                            <h4 className="text-lg font-semibold text-white">{exp.title}</h4>
                            <p className="text-blue-400 font-medium">{exp.company}</p>
                          </div>
                        </div>
                        <div className="text-right text-sm text-gray-400 mt-2 md:mt-0">
                          <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            {exp.period}
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <MapPin size={14} />
                            {exp.location}
                          </div>
                        </div>
                      </div>
                      <ul className="space-y-2">
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

              {/* Projets */}
              <motion.div variants={fadeInUp}>
                <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
                  <Award className="text-blue-400" size={24} />
                  {t.cv.projectsHeading}
                </h3>
                <div className="space-y-4">
                  {t.projects.map((project, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-purple-500/50 transition-all"
                    >
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2 gap-2">
                        <h4 className="text-lg font-semibold text-white">{project.title}</h4>
                        {project.github && (
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 transition-colors flex-shrink-0"
                          >
                            <Github size={14} />
                            {contact.github.replace('github.com/', '')}
                          </a>
                        )}
                      </div>
                      <p className="text-gray-300 text-sm mb-3">{project.description}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {project.technologies.map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            className="px-2 py-0.5 bg-purple-600/10 text-purple-300 rounded-md text-xs border border-purple-500/20"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Formation */}
              <motion.div variants={fadeInUp}>
                <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
                  <GraduationCap className="text-blue-400" size={24} />
                  {t.cv.educationHeading}
                </h3>
                <div className="space-y-6">
                  {t.education.map((edu, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-purple-500/50 transition-all"
                    >
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-3">
                        <div>
                          <h4 className="text-lg font-semibold text-white">{edu.degree}</h4>
                          <p className="text-purple-400 font-medium">{edu.school}</p>
                        </div>
                        <div className="text-right text-sm text-gray-400 mt-2 md:mt-0">
                          <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            {edu.period}
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <MapPin size={14} />
                            {edu.location}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm">{edu.details}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
