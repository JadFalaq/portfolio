'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function AITerminal() {
  const [currentLine, setCurrentLine] = useState(0)
  const [displayedText, setDisplayedText] = useState('')
  
  const terminalLines = [
    '$ python train_model.py',
    'Loading dataset... ✓',
    'Preprocessing data... ✓',
    'Building neural network...',
    'Training model...',
    'Epoch 1/100 - loss: 0.4521 - accuracy: 0.8234',
    'Epoch 50/100 - loss: 0.1234 - accuracy: 0.9567',
    'Epoch 100/100 - loss: 0.0456 - accuracy: 0.9789',
    'Model training completed! ✓',
    'Saving model weights...',
    'Model saved successfully! 🚀',
    '$ python predict.py --input new_data.csv',
    'Loading trained model... ✓',
    'Making predictions...',
    'Predictions completed! Accuracy: 97.8%',
    '$ █'
  ]

  useEffect(() => {
    if (currentLine < terminalLines.length) {
      const line = terminalLines[currentLine]
      let charIndex = 0
      
      const typeWriter = setInterval(() => {
        if (charIndex < line.length) {
          setDisplayedText(prev => prev + line[charIndex])
          charIndex++
        } else {
          clearInterval(typeWriter)
          setTimeout(() => {
            setDisplayedText(prev => prev + '\n')
            setCurrentLine(prev => prev + 1)
          }, 500)
        }
      }, 50)

      return () => clearInterval(typeWriter)
    }
  }, [currentLine])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="bg-gray-900 rounded-lg p-6 font-mono text-sm max-w-2xl mx-auto"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        <span className="text-gray-400 ml-2">AI Terminal</span>
      </div>
      <div className="text-green-400 min-h-[300px]">
        <pre className="whitespace-pre-wrap">{displayedText}</pre>
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="text-white"
        >
          █
        </motion.span>
      </div>
    </motion.div>
  )
}
