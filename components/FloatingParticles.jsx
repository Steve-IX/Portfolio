'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/lib/ThemeContext';
import { createOptimizedObserver } from '@/lib/performanceUtils';

export const FloatingParticles = ({ count = 30 }) => {
  const [particles, setParticles] = useState([]);
  const [isVisible, setIsVisible] = useState(true);
  const { theme, colors } = useTheme();

  const generateParticles = useCallback(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1.5,
      duration: Math.random() * 15 + 8,
      delay: Math.random() * 3,
      opacity: Math.random() * 0.4 + 0.1,
      moveX: (Math.random() - 0.5) * 150,
      moveY: (Math.random() - 0.5) * 150,
    }));
  }, [count]);

  const particleStyles = useMemo(() => {
    return particles.map(particle => ({
      left: `${particle.x}%`,
      top: `${particle.y}%`,
      width: `${particle.size}px`,
      height: `${particle.size}px`,
      background: theme === 'dark' 
        ? `radial-gradient(circle, ${colors.primary}${Math.floor(particle.opacity * 255).toString(16).padStart(2, '0')}, transparent)`
        : `radial-gradient(circle, ${colors.accent}${Math.floor(particle.opacity * 255).toString(16).padStart(2, '0')}, transparent)`,
      filter: 'blur(0.5px)',
      contain: 'layout style paint',
      transform: 'translateZ(0)',
      willChange: 'transform, opacity',
    }));
  }, [particles, theme, colors]);

  const specialElementStyles = useMemo(() => {
    return [1, 2, 3].map((i) => ({
      left: `${15 + i * 30}%`,
      top: `${5 + i * 25}%`,
      width: '16px',
      height: '16px',
      background: `conic-gradient(from 0deg, ${colors.primary}30, ${colors.accent}30, ${colors.primary}30)`,
      borderRadius: '50%',
      filter: 'blur(0.8px)',
      contain: 'layout style paint',
      transform: 'translateZ(0)',
      willChange: 'transform, opacity',
    }));
  }, [colors]);

  useEffect(() => {
    setParticles(generateParticles());
  }, [generateParticles]);

  useEffect(() => {
    const observer = createOptimizedObserver(
      (entries) => {
        setIsVisible(entries[0].isIntersecting);
      },
      { threshold: 0.1 }
    );

    const container = document.querySelector('.particles-container');
    if (container && observer) {
      observer.observe(container);
    }

    return () => {
      if (observer && container) {
        observer.unobserve(container);
      }
    };
  }, []);

  if (particles.length === 0) return null;

  return (
    <div className="particles-container" style={{ 
      contain: 'layout style paint',
      transform: 'translateZ(0)',
      opacity: isVisible ? 1 : 0.3,
    }}>
      {particles.map((particle, index) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full pointer-events-none"
          style={particleStyles[index]}
          animate={isVisible ? {
            x: [0, particle.moveX * 0.7, 0],
            y: [0, particle.moveY * 0.7, 0],
            scale: [1, 1.15, 1],
            opacity: [particle.opacity, particle.opacity * 1.3, particle.opacity],
          } : {}}
          transition={{
            duration: particle.duration,
            repeat: isVisible ? Infinity : 0,
            delay: particle.delay,
            ease: "easeInOut",
            type: "tween",
          }}
        />
      ))}
      
      {isVisible && [1, 2].map((i) => (
        <motion.div
          key={`special-${i}`}
          className="absolute pointer-events-none"
          style={specialElementStyles[i - 1]}
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 12 + i * 3,
            repeat: Infinity,
            ease: "linear",
            type: "tween",
          }}
        />
      ))}
    </div>
  );
}; 