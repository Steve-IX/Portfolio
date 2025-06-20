'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/lib/ThemeContext';

export const FloatingParticles = ({ count = 50 }) => {
  const [particles, setParticles] = useState([]);
  const { theme, colors } = useTheme();

  useEffect(() => {
    const generatedParticles = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5,
      opacity: Math.random() * 0.6 + 0.2,
      moveX: (Math.random() - 0.5) * 200,
      moveY: (Math.random() - 0.5) * 200,
    }));
    setParticles(generatedParticles);
  }, [count]);

  if (particles.length === 0) return null;

  return (
    <div className="particles-container">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            background: theme === 'dark' 
              ? `radial-gradient(circle, ${colors.primary}${Math.floor(particle.opacity * 100).toString(16)}, transparent)`
              : `radial-gradient(circle, ${colors.accent}${Math.floor(particle.opacity * 100).toString(16)}, transparent)`,
            filter: 'blur(0.5px)',
          }}
          animate={{
            x: [0, particle.moveX, 0],
            y: [0, particle.moveY, 0],
            scale: [1, 1.2, 1],
            opacity: [particle.opacity, particle.opacity * 1.5, particle.opacity],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}
      
      {/* Special larger floating elements */}
      {[1, 2, 3].map((i) => (
        <motion.div
          key={`special-${i}`}
          className="absolute pointer-events-none"
          style={{
            left: `${20 + i * 25}%`,
            top: `${10 + i * 20}%`,
            width: '20px',
            height: '20px',
            background: `conic-gradient(from 0deg, ${colors.primary}40, ${colors.accent}40, ${colors.primary}40)`,
            borderRadius: '50%',
            filter: 'blur(1px)',
          }}
          animate={{
            rotate: [0, 360],
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 15 + i * 5,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}; 