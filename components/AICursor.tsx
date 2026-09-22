'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function AICursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    const handleMouseEnter = () => setIsHovering(true)
    const handleMouseLeave = () => setIsHovering(false)

    // Add event listeners to interactive elements
    const interactiveElements = document.querySelectorAll('button, a, .interactive')
    
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter)
      el.addEventListener('mouseleave', handleMouseLeave)
    })

    window.addEventListener('mousemove', updateMousePosition)

    return () => {
      window.removeEventListener('mousemove', updateMousePosition)
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter)
        el.removeEventListener('mouseleave', handleMouseLeave)
      })
    }
  }, [])

  return (
    <>
      {/* Main cursor */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-50 mix-blend-difference"
        animate={{
          x: mousePosition.x - 10,
          y: mousePosition.y - 10,
          scale: isHovering ? 1.5 : 1
        }}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
      >
        <div className="w-5 h-5 bg-blue-400 rounded-full opacity-80" />
      </motion.div>

      {/* Trailing cursor */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-40"
        animate={{
          x: mousePosition.x - 20,
          y: mousePosition.y - 20,
          scale: isHovering ? 2 : 1
        }}
        transition={{ type: "spring", stiffness: 150, damping: 15 }}
      >
        <div className="w-10 h-10 border-2 border-purple-400 rounded-full opacity-50" />
      </motion.div>

      {/* AI particles following cursor */}
      {Array.from({ length: 3 }).map((_, i) => (
        <motion.div
          key={i}
          className="fixed top-0 left-0 pointer-events-none z-30"
          animate={{
            x: mousePosition.x - 2,
            y: mousePosition.y - 2,
            scale: isHovering ? 1.2 : 0.8
          }}
          transition={{ 
            type: "spring", 
            stiffness: 100 - i * 20, 
            damping: 20 + i * 5,
            delay: i * 0.05
          }}
        >
          <motion.div
            animate={{ 
              rotate: 360,
              opacity: [0.3, 0.8, 0.3]
            }}
            transition={{ 
              rotate: { duration: 2, repeat: Infinity, ease: "linear" },
              opacity: { duration: 1, repeat: Infinity, delay: i * 0.3 }
            }}
            className="w-1 h-1 bg-green-400 rounded-full"
          />
        </motion.div>
      ))}
    </>
  )
}
