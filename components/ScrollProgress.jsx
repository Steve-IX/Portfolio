'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/lib/ThemeContext';

export const ScrollProgress = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const { colors } = useTheme();

  useEffect(() => {
    const updateScrollProgress = () => {
      const currentScroll = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollHeight > 0 ? (currentScroll / scrollHeight) * 100 : 0;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    updateScrollProgress(); // Initial call

    return () => window.removeEventListener('scroll', updateScrollProgress);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 w-full h-1 z-50 bg-opacity-20"
      style={{ 
        background: `linear-gradient(90deg, ${colors.primary}20, ${colors.accent}20)` 
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="h-full rounded-r-full"
        style={{
          background: `linear-gradient(90deg, ${colors.primary}, ${colors.accent})`,
          boxShadow: `0 0 10px ${colors.primary}50, 0 0 20px ${colors.accent}30`,
        }}
        initial={{ width: 0 }}
        animate={{ width: `${scrollProgress}%` }}
        transition={{ 
          type: "spring", 
          stiffness: 400, 
          damping: 40,
          mass: 0.5
        }}
      />
      
      {/* Animated particle at the end */}
      {scrollProgress > 0 && (
        <motion.div
          className="absolute top-1/2 w-3 h-3 rounded-full -translate-y-1/2"
          style={{
            left: `${scrollProgress}%`,
            background: `radial-gradient(circle, ${colors.accent}, ${colors.primary})`,
            boxShadow: `0 0 15px ${colors.accent}, 0 0 30px ${colors.primary}`,
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
    </motion.div>
  );
}; 