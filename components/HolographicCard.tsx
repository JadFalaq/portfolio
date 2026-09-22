'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { ExternalLink, Github, Brain, Zap } from 'lucide-react'
import Image from 'next/image'
import { useLanguage } from '../contexts/LanguageContext'

interface Project {
  title: string
  description: string
  technologies: string[]
  github?: string
  demo?: string
  image?: string
}

interface HolographicCardProps {
  project: Project
  index: number
}

export default function HolographicCard({ project, index }: HolographicCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const { language } = useLanguage()
  const demoLabel = language === 'fr' ? 'Démo' : 'Demo'

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative group"
    >
      {/* Holographic border effect */}
      <motion.div
        animate={isHovered ? { 
          background: [
            'linear-gradient(45deg, #3b82f6, #8b5cf6, #06d6a0, #3b82f6)',
            'linear-gradient(90deg, #8b5cf6, #06d6a0, #3b82f6, #8b5cf6)',
            'linear-gradient(135deg, #06d6a0, #3b82f6, #8b5cf6, #06d6a0)',
            'linear-gradient(180deg, #3b82f6, #8b5cf6, #06d6a0, #3b82f6)'
          ]
        } : {}}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute inset-0 rounded-xl p-[2px] bg-gradient-to-r from-blue-500 via-purple-500 to-green-500"
      >
        <div className="w-full h-full rounded-xl bg-slate-900/90 backdrop-blur-lg"></div>
      </motion.div>

      {/* Card content */}
      <div className="relative p-6 h-full">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="w-full h-full"
          >
            <Brain className="absolute top-4 right-4 text-blue-400" size={32} />
            <Zap className="absolute bottom-4 left-4 text-purple-400" size={24} />
          </motion.div>
        </div>

        {/* Project visual */}
        <motion.div
          animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
          className="h-48 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-lg mb-6 flex items-center justify-center relative overflow-hidden"
        >
          {project.image ? (
            <>
              {/* Project Image */}
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover rounded-lg"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              {/* Overlay for better text readability */}
              <div className="absolute inset-0 bg-black/40 rounded-lg" />
            </>
          ) : (
            <>
              {/* Animated grid fallback */}
              <div className="absolute inset-0 opacity-30">
                <div className="grid grid-cols-8 grid-rows-6 h-full w-full">
                  {Array.from({ length: 48 }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.1
                      }}
                      className="border border-blue-400/20"
                    />
                  ))}
                </div>
              </div>
              
              <motion.div
                animate={isHovered ? { rotate: [0, 360] } : {}}
                transition={{ duration: 2 }}
              >
                <Brain size={64} className="text-white/60" />
              </motion.div>
            </>
          )}
        </motion.div>

        <h3 className="text-xl font-semibold text-white mb-3 relative z-10">{project.title}</h3>
        <p className="text-gray-300 mb-4 relative z-10">{project.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4 relative z-10">
          {project.technologies.map((tech, techIndex) => (
            <motion.span
              key={techIndex}
              whileHover={{ scale: 1.1 }}
              className="px-3 py-1 bg-blue-600/20 text-blue-300 rounded-full text-sm border border-blue-500/30"
            >
              {tech}
            </motion.span>
          ))}
        </div>
        
        {(project.github || project.demo) && (
          <div className="flex gap-4 relative z-10">
            {project.github && (
              <motion.a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, color: '#60a5fa' }}
                className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
              >
                <Github size={20} />
                Code
              </motion.a>
            )}
            {project.demo && (
              <motion.a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, color: '#a855f7' }}
                className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
              >
                <ExternalLink size={20} />
                {demoLabel}
              </motion.a>
            )}
          </div>
        )}

        {/* Floating particles */}
        {isHovered && (
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  x: [0, Math.random() * 200 - 100],
                  y: [0, Math.random() * 200 - 100]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
                className="absolute top-1/2 left-1/2 w-2 h-2 bg-blue-400 rounded-full"
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}
