'use client';

import { motion } from 'framer-motion';

export const LightModeBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-b from-[#f0f5fa] via-[#e6f0f9] to-[#d9e8f5] z-0">
      {/* Enhanced gradients */}
      <div className="absolute inset-0 opacity-30" style={{
        background: `
          radial-gradient(circle at 20% 30%, rgba(26, 111, 176, 0.25) 0%, transparent 45%),
          radial-gradient(circle at 80% 70%, rgba(22, 166, 153, 0.25) 0%, transparent 45%),
          radial-gradient(circle at 50% 50%, rgba(26, 111, 176, 0.2) 0%, transparent 60%)
        `
      }} />

      {/* Stars - matching dark mode quantity */}
      {Array.from({ length: 50 }).map((_, i) => (
        <motion.div
          key={`light-particle-${i}`}
          className="absolute rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: Math.random() < 0.2 ? '3px' : '2px',
            height: Math.random() < 0.2 ? '3px' : '2px',
            backgroundColor: '#1a6fb0', // Using primary blue color
            opacity: Math.random() * 0.4 + 0.4, // Higher base opacity
            boxShadow: '0 0 2px rgba(26, 111, 176, 0.5)', // Subtle glow
          }}
          animate={{
            opacity: [0.4, 0.8, 0.4],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
      
      {/* Accent stars - matching dark mode quality */}
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={`accent-star-${i}`}
          className="absolute rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: '4px',
            height: '4px',
            backgroundColor: '#16a699', // Teal accent color
            opacity: 0.6,
            boxShadow: '0 0 4px rgba(22, 166, 153, 0.8)',
          }}
          animate={{
            opacity: [0.6, 0.9, 0.6],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: Math.random() * 4 + 3,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
      
      {/* Light rays */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white to-transparent opacity-30" />
    </div>
  );
}; 