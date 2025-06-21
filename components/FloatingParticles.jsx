'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/lib/ThemeContext';
import { getPerformanceSettings, createPerformanceObserver } from '@/lib/mobileOptimization';

export const FloatingParticles = ({ count: defaultCount = 50 }) => {
  const [particles, setParticles] = useState([]);
  const [isVisible, setIsVisible] = useState(true);
  const [performanceSettings, setPerformanceSettings] = useState(null);
  const containerRef = useRef(null);
  const observerRef = useRef(null);
  const { theme, colors } = useTheme();

  // Initialize performance settings
  useEffect(() => {
    const settings = getPerformanceSettings();
    setPerformanceSettings(settings);
    
    // Don't render particles on mobile with reduced motion preference
    if (settings.prefersReducedMotion && settings.isMobile) {
      return;
    }
  }, []);

  // Intersection Observer to pause animations when not visible
  useEffect(() => {
    if (!performanceSettings || !containerRef.current) return;

    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        setIsVisible(entry.isIntersecting);
      });
    };

    observerRef.current = createPerformanceObserver(handleIntersection);
    
    if (observerRef.current && containerRef.current) {
      observerRef.current.observe(containerRef.current);
    }

    return () => {
      if (observerRef.current && containerRef.current) {
        observerRef.current.unobserve(containerRef.current);
      }
    };
  }, [performanceSettings]);

  useEffect(() => {
    if (!performanceSettings) return;

    // Use performance-optimized particle count
    const count = performanceSettings.isMobile 
      ? performanceSettings.particleCount 
      : Math.min(defaultCount, performanceSettings.particleCount);

    const generatedParticles = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: performanceSettings.isMobile 
        ? Math.random() * 2 + 1 // Smaller particles on mobile
        : Math.random() * 4 + 2,
      duration: performanceSettings.particleAnimationDuration + Math.random() * 10,
      delay: Math.random() * 5,
      opacity: performanceSettings.isMobile 
        ? Math.random() * 0.4 + 0.1 // Lower opacity on mobile
        : Math.random() * 0.6 + 0.2,
      moveX: (Math.random() - 0.5) * (performanceSettings.isMobile ? 100 : 200),
      moveY: (Math.random() - 0.5) * (performanceSettings.isMobile ? 100 : 200),
    }));
    setParticles(generatedParticles);
  }, [defaultCount, performanceSettings]);

  // Don't render if performance settings not loaded or on mobile with reduced motion
  if (!performanceSettings || 
      (performanceSettings.prefersReducedMotion && performanceSettings.isMobile) ||
      particles.length === 0) {
    return null;
  }

  return (
    <div 
      ref={containerRef}
      className="particles-container"
      style={{
        opacity: isVisible ? 1 : 0.3, // Reduce opacity when not visible
        transition: 'opacity 0.3s ease'
      }}
    >
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            background: performanceSettings.enableGradients
              ? (theme === 'dark' 
                  ? `radial-gradient(circle, ${colors.primary}${Math.floor(particle.opacity * 100).toString(16)}, transparent)`
                  : `radial-gradient(circle, ${colors.accent}${Math.floor(particle.opacity * 100).toString(16)}, transparent)`)
              : (theme === 'dark' ? colors.primary : colors.accent), // Solid color fallback
            filter: performanceSettings.enableBlur ? 'blur(0.5px)' : 'none',
            willChange: isVisible ? 'transform, opacity' : 'auto', // Only set willChange when animating
          }}
          animate={isVisible ? {
            x: [0, particle.moveX, 0],
            y: [0, particle.moveY, 0],
            scale: performanceSettings.enableComplexAnimations ? [1, 1.2, 1] : [1, 1.1, 1],
            opacity: [particle.opacity, particle.opacity * 1.5, particle.opacity],
          } : false} // Pause animation when not visible
          transition={{
            duration: particle.duration,
            repeat: isVisible ? Infinity : 0,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}
      
      {/* Special larger floating elements - only on desktop */}
      {performanceSettings.enableComplexAnimations && [1, 2, 3].map((i) => (
        <motion.div
          key={`special-${i}`}
          className="absolute pointer-events-none"
          style={{
            left: `${20 + i * 25}%`,
            top: `${10 + i * 20}%`,
            width: '20px',
            height: '20px',
            background: performanceSettings.enableGradients
              ? `conic-gradient(from 0deg, ${colors.primary}40, ${colors.accent}40, ${colors.primary}40)`
              : `${colors.primary}40`, // Solid color fallback
            borderRadius: '50%',
            filter: performanceSettings.enableBlur ? 'blur(1px)' : 'none',
            willChange: isVisible ? 'transform, opacity' : 'auto',
          }}
          animate={isVisible ? {
            rotate: [0, 360],
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
          } : false}
          transition={{
            duration: 15 + i * 5,
            repeat: isVisible ? Infinity : 0,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}; 