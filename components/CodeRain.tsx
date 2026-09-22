'use client'

import { useEffect, useRef } from 'react'

export default function CodeRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const codeSnippets = [
      'import tensorflow as tf',
      'model = Sequential()',
      'model.add(Dense(128))',
      'model.compile(optimizer="adam")',
      'X_train, y_train = load_data()',
      'model.fit(X_train, y_train)',
      'predictions = model.predict(X_test)',
      'from sklearn.ensemble import RandomForest',
      'clf = RandomForestClassifier()',
      'accuracy = accuracy_score(y_true, y_pred)',
      'import numpy as np',
      'import pandas as pd',
      'from keras.layers import LSTM',
      'model.add(Dropout(0.2))',
      'loss = categorical_crossentropy',
    ]

    const drops: Array<{
      x: number
      y: number
      text: string
      speed: number
      opacity: number
    }> = []

    // Initialize drops
    for (let i = 0; i < 15; i++) {
      drops.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        text: codeSnippets[Math.floor(Math.random() * codeSnippets.length)],
        speed: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.3 + 0.1
      })
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      drops.forEach(drop => {
        ctx.fillStyle = `rgba(34, 197, 94, ${drop.opacity})`
        ctx.font = '12px "Courier New", monospace'
        ctx.fillText(drop.text, drop.x, drop.y)

        drop.y += drop.speed
        
        if (drop.y > canvas.height) {
          drop.y = -20
          drop.x = Math.random() * canvas.width
          drop.text = codeSnippets[Math.floor(Math.random() * codeSnippets.length)]
        }
      })

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-20"
    />
  )
}
