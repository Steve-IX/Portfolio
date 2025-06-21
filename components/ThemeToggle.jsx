'use client';

import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';
import { getPerformanceSettings, createTouchOptimizedHandler } from '@/lib/mobileOptimization';
import { useState, useEffect, useCallback } from 'react';

export const ThemeToggle = () => {
  const { theme, toggleTheme, colors } = useTheme();
  const [performanceSettings, setPerformanceSettings] = useState(null);
  
  // Initialize performance settings
  useEffect(() => {
    const settings = getPerformanceSettings();
    setPerformanceSettings(settings);
  }, []);

  // Touch-optimized toggle function
  const handleClick = useCallback(
    createTouchOptimizedHandler(() => {
      toggleTheme();
    }, { debounce: performanceSettings?.touchOptimization ? 150 : 50 }),
    [toggleTheme, performanceSettings]
  );

  if (!performanceSettings) {
    // Fallback while loading performance settings
    return (
      <button
        onClick={toggleTheme}
        className="relative h-10 w-10 rounded-full flex items-center justify-center"
        style={{ 
          backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
          color: colors.accent
        }}
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
      </button>
    );
  }
  
  return (
    <motion.button
      whileHover={!performanceSettings.touchOptimization ? { scale: 1.1 } : undefined}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className="relative h-10 w-10 rounded-full flex items-center justify-center"
      style={{ 
        backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
        color: colors.accent,
        // Optimize CSS properties for better mobile performance
        willChange: 'transform',
        touchAction: 'manipulation', // Prevents 300ms click delay on mobile
      }}
      aria-label="Toggle theme"
      // Responsive animation timing
      transition={{ duration: performanceSettings.touchOptimization ? 0.2 : 0.3 }}
    >
      <motion.div
        initial={false}
        animate={{ 
          rotate: theme === 'dark' ? 0 : 180,
          scale: 1
        }}
        transition={{ 
          duration: performanceSettings.touchOptimization ? 0.3 : 0.5,
          ease: "easeInOut"
        }}
        className="absolute"
        style={{
          willChange: performanceSettings.touchOptimization ? 'auto' : 'transform'
        }}
      >
        {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
      </motion.div>
    </motion.button>
  );
}; 