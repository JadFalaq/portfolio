'use client'

import { motion } from 'framer-motion'

export default function NeuralNetwork() {
  const layers = [4, 6, 6, 3] // Architecture du réseau
  
  const generateNodes = (layerIndex: number, nodeCount: number) => {
    return Array.from({ length: nodeCount }, (_, nodeIndex) => (
      <motion.circle
        key={`${layerIndex}-${nodeIndex}`}
        cx={layerIndex * 120 + 50}
        cy={nodeIndex * 60 + 50}
        r="8"
        fill="rgba(59, 130, 246, 0.8)"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.8, 1, 0.8]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay: layerIndex * 0.2 + nodeIndex * 0.1
        }}
      />
    ))
  }

  const generateConnections = () => {
    const connections = []
    for (let layer = 0; layer < layers.length - 1; layer++) {
      for (let node = 0; node < layers[layer]; node++) {
        for (let nextNode = 0; nextNode < layers[layer + 1]; nextNode++) {
          connections.push(
            <motion.line
              key={`${layer}-${node}-${nextNode}`}
              x1={layer * 120 + 50}
              y1={node * 60 + 50}
              x2={(layer + 1) * 120 + 50}
              y2={nextNode * 60 + 50}
              stroke="rgba(147, 197, 253, 0.3)"
              strokeWidth="1"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                pathLength: 1, 
                opacity: [0.3, 0.7, 0.3]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: layer * 0.5 + node * 0.1
              }}
            />
          )
        }
      }
    }
    return connections
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <motion.svg
        width="400"
        height="300"
        viewBox="0 0 400 300"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ duration: 2 }}
      >
        {generateConnections()}
        {layers.map((nodeCount, layerIndex) => 
          generateNodes(layerIndex, nodeCount)
        )}
        
        {/* Pulse effect */}
        <motion.circle
          cx="50"
          cy="110"
          r="15"
          fill="none"
          stroke="rgba(34, 197, 94, 0.8)"
          strokeWidth="2"
          initial={{ scale: 0 }}
          animate={{ scale: [1, 2, 1] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "loop"
          }}
        />
      </motion.svg>
    </div>
  )
}
