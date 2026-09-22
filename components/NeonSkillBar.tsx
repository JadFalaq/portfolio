'use client'

import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

interface NeonSkillBarProps {
  name: string
  level: number
  icon: LucideIcon
  index: number
}

export default function NeonSkillBar({ name, level, icon: Icon, index }: NeonSkillBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className="group"
    >
      <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-blue-500/50 transition-all relative overflow-hidden">
        {/* Neon glow effect */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-green-500/10 rounded-xl"
        />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <motion.div
              whileHover={{ rotate: 360, scale: 1.2 }}
              transition={{ duration: 0.5 }}
              className="p-2 bg-blue-500/20 rounded-lg"
            >
              <Icon className="text-blue-400" size={24} />
            </motion.div>
            <h3 className="text-white font-semibold text-lg">{name}</h3>
            <span className="ml-auto text-blue-400 font-bold">{level}%</span>
          </div>
          
          {/* Skill bar container */}
          <div className="relative">
            <div className="w-full bg-gray-700/50 rounded-full h-3 overflow-hidden">
              {/* Background glow */}
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${level}%` }}
                transition={{ duration: 1.5, delay: index * 0.1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 rounded-full relative"
              >
                {/* Animated shine effect */}
                <motion.div
                  animate={{ x: [-100, 200] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 w-20"
                />
              </motion.div>
            </div>
            
            {/* Floating percentage */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 + 1 }}
              className="absolute -top-8 bg-slate-800/90 backdrop-blur-sm px-2 py-1 rounded text-xs text-blue-400 border border-blue-500/30"
              style={{ left: `${Math.min(level - 5, 90)}%` }}
            >
              {level}%
            </motion.div>
          </div>
          
          {/* Particle effects on hover */}
          <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
            {Array.from({ length: 3 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, opacity: 0 }}
                whileHover={{ 
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                  x: [0, Math.random() * 100 - 50],
                  y: [0, Math.random() * 100 - 50]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.3
                }}
                className="absolute top-1/2 left-1/2 w-1 h-1 bg-blue-400 rounded-full"
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
