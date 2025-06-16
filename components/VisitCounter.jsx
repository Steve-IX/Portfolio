'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye } from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';

export const VisitCounter = () => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const { theme, colors } = useTheme();

  useEffect(() => {
    // Simulate fetching the visit count from localStorage or a real API
    const fetchVisitCount = () => {
      // Get the current count from localStorage
      const storedCount = localStorage.getItem('visitCount');
      
      // If there's no count yet, initialize with a random number between 500-1500
      // This gives the impression the site already has some traffic
      if (!storedCount) {
        const initialCount = Math.floor(Math.random() * 1000) + 500;
        localStorage.setItem('visitCount', initialCount.toString());
        setCount(initialCount);
      } else {
        // If the user has visited before, increment the count
        const newCount = parseInt(storedCount) + 1;
        localStorage.setItem('visitCount', newCount.toString());
        setCount(newCount);
      }
    };

    // Show the counter with a slight delay for a nice entrance
    const timer = setTimeout(() => {
      setIsVisible(true);
      fetchVisitCount();
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: isVisible ? 1 : 0, 
        y: isVisible ? 0 : 20 
      }}
      transition={{ duration: 0.5 }}
      className="fixed bottom-4 right-4 z-50 flex items-center gap-2 px-3 py-2 rounded-full shadow-lg"
      style={{ 
        backgroundColor: theme === 'dark' 
          ? 'rgba(1, 22, 39, 0.8)' 
          : 'rgba(255, 255, 255, 0.9)',
        border: `1px solid ${theme === 'dark' ? 'rgba(77, 157, 224, 0.3)' : 'rgba(26, 111, 176, 0.2)'}`,
        backdropFilter: 'blur(8px)',
      }}
    >
      <Eye 
        size={16} 
        className="text-primary"
        style={{ color: colors.primary }}
      />
      <span 
        className="text-sm font-medium"
        style={{ color: colors.text }}
      >
        {count.toLocaleString()}
      </span>
    </motion.div>
  );
}; 