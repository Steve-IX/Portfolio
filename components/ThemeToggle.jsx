'use client';

import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';
import { useCallback, useMemo } from 'react';

export const ThemeToggle = () => {
  const { theme, toggleTheme, colors } = useTheme();
  
  // Memoize the click handler to prevent unnecessary re-renders
  const handleClick = useCallback(() => {
    // Use scheduler.postTask for better INP if available, fallback to requestAnimationFrame
    if ('scheduler' in window && 'postTask' in window.scheduler) {
      window.scheduler.postTask(toggleTheme, { priority: 'user-blocking' });
    } else {
      requestAnimationFrame(toggleTheme);
    }
  }, [toggleTheme]);

  // Memoize style object to prevent recalculation
  const buttonStyle = useMemo(() => ({
    backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
    color: colors.accent,
    // CSS containment for better rendering performance
    contain: 'layout style paint',
    // Hardware acceleration
    transform: 'translateZ(0)',
    willChange: 'transform',
  }), [theme, colors.accent]);

  // Optimized animation variants
  const buttonVariants = {
    hover: { scale: 1.1 },
    tap: { scale: 0.9 },
    rest: { scale: 1 }
  };

  const iconVariants = {
    rotate: { 
      rotate: theme === 'dark' ? 0 : 180,
      transition: { 
        duration: 0.3, // Reduced from 0.5s
        ease: [0.4, 0, 0.2, 1] // Optimized easing curve
      }
    }
  };

  return (
    <motion.button
      variants={buttonVariants}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      onClick={handleClick}
      className="relative h-10 w-10 rounded-full flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2"
      style={buttonStyle}
      aria-label="Toggle theme"
      // Optimize for better interaction responsiveness
      onPointerDown={(e) => e.preventDefault()}
    >
      <motion.div
        variants={iconVariants}
        animate="rotate"
        className="absolute flex items-center justify-center"
        style={{ 
          // Ensure smooth icon transitions
          backfaceVisibility: 'hidden',
          transform: 'translateZ(0)'
        }}
      >
        {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
      </motion.div>
    </motion.button>
  );
}; 