'use client';

import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';
import { getPerformanceSettings, debounce } from '@/lib/mobileOptimization';
import { useState, useEffect, useCallback } from 'react';

export const ThemeToggle = () => {
  const { theme, toggleTheme, colors } = useTheme();
  const [performanceSettings, setPerformanceSettings] = useState(null);
  
  // Initialize performance settings
  useEffect(() => {
    const settings = getPerformanceSettings();
    setPerformanceSettings(settings);
  }, []);

  // Debounced toggle function to prevent rapid clicking issues
  const debouncedToggleTheme = useCallback(
    debounce(() => {
      toggleTheme();
    }, 150), // 150ms debounce
    [toggleTheme]
  );

  const handleClick = useCallback(() => {
    // Use debounced version on mobile, immediate on desktop
    if (performanceSettings?.isMobile) {
      debouncedToggleTheme();
    } else {
      toggleTheme();
    }
  }, [performanceSettings, debouncedToggleTheme, toggleTheme]);

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
      whileHover={performanceSettings.enableComplexAnimations ? { scale: 1.1 } : undefined}
      whileTap={performanceSettings.enableComplexAnimations ? { scale: 0.9 } : { scale: 0.95 }}
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
      // Reduce animation overhead on mobile
      transition={performanceSettings.isMobile ? { duration: 0.2 } : { duration: 0.3 }}
    >
      <motion.div
        initial={false}
        animate={{ 
          rotate: theme === 'dark' ? 0 : 180,
          scale: 1
        }}
        transition={{ 
          duration: performanceSettings.isMobile ? 0.3 : 0.5,
          ease: "easeInOut"
        }}
        className="absolute"
        style={{
          willChange: performanceSettings.isMobile ? 'auto' : 'transform'
        }}
      >
        {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
      </motion.div>
    </motion.button>
  );
}; 