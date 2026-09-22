'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { siteContent } from '../data/content'

export default function AIStats() {
  const { language } = useLanguage()
  const labels = siteContent[language].about.stats

  const [stats, setStats] = useState({
    accuracy: 0,
    models: 0,
    datasets: 0
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      setStats({
        accuracy: 85,
        models: 25,
        datasets: 150
      })
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const statItems = [
    { label: labels.accuracy, value: stats.accuracy, suffix: '%', color: 'text-green-400' },
    { label: labels.models, value: stats.models, suffix: '+', color: 'text-blue-400' },
    { label: labels.datasets, value: stats.datasets, suffix: '+', color: 'text-purple-400' }
  ]

  return (
    <div className="grid grid-cols-3 gap-6 my-12">
      {statItems.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          className="text-center"
        >
          <motion.div
            className={`text-3xl md:text-4xl font-bold ${item.color} mb-2`}
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 100,
              delay: index * 0.1 + 0.5 
            }}
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2, delay: index * 0.2 }}
            >
              {item.value.toLocaleString()}{item.suffix}
            </motion.span>
          </motion.div>
          <p className="text-gray-300 text-sm">{item.label}</p>
        </motion.div>
      ))}
    </div>
  )
}
