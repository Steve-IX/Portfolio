'use client';

import { motion } from 'framer-motion';

export const LightModeBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-b from-[#f0f5fa] via-[#e6f0f9] to-[#d9e8f5] z-0">
      {/* Subtle gradients */}
      <div className="absolute inset-0 opacity-20" style={{
        background: `
          radial-gradient(circle at 20% 30%, rgba(26, 111, 176, 0.15) 0%, transparent 40%),
          radial-gradient(circle at 80% 70%, rgba(22, 166, 153, 0.15) 0%, transparent 40%),
          radial-gradient(circle at 50% 50%, rgba(26, 111, 176, 0.1) 0%, transparent 60%)
        `
      }} />

      {/* Subtle particles */}
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={`light-particle-${i}`}
          className="absolute rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: '2px',
            height: '2px',
            backgroundColor: '#1a6fb0',
            opacity: 0.2,
          }}
          animate={{
            opacity: [0.2, 0.5, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
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