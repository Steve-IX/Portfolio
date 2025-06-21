'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/lib/ThemeContext';
import { getPerformanceSettings, createPerformanceObserver, getResponsiveScale } from '@/lib/mobileOptimization';

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
  }, []);

  // Intersection Observer for performance optimization
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

    // Use responsive particle count - scales down but maintains feature
    const count = Math.min(defaultCount, performanceSettings.particleCount);

    const generatedParticles = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: getResponsiveScale(Math.random() * 4 + 2, 'particles') * performanceSettings.particleSize,
      duration: performanceSettings.particleAnimationDuration + Math.random() * 10,
      delay: Math.random() * 5,
      opacity: Math.random() * 0.6 + 0.2,
      moveX: (Math.random() - 0.5) * getResponsiveScale(200, 'effects'),
      moveY: (Math.random() - 0.5) * getResponsiveScale(200, 'effects'),
    }));
    setParticles(generatedParticles);
  }, [defaultCount, performanceSettings]);

  // Only skip rendering if user prefers reduced motion
  if (!performanceSettings || 
      performanceSettings.prefersReducedMotion ||
      particles.length === 0) {
    return null;
  }

  return (
    <div 
      ref={containerRef}
      className="particles-container"
      style={{
        opacity: isVisible ? 1 : 0.3,
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
              : (theme === 'dark' ? colors.primary : colors.accent),
            filter: performanceSettings.enableBlur 
              ? `blur(${getResponsiveScale(0.5, 'effects')}px)` 
              : 'none',
            willChange: isVisible ? 'transform, opacity' : 'auto',
          }}
          animate={isVisible ? {
            x: [0, particle.moveX, 0],
            y: [0, particle.moveY, 0],
            scale: [1, 1 + getResponsiveScale(0.2, 'animations'), 1],
            opacity: [particle.opacity, particle.opacity * 1.5, particle.opacity],
          } : false}
          transition={{
            duration: particle.duration / performanceSettings.animationSpeed,
            repeat: isVisible ? Infinity : 0,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}
      
      {/* Enhanced floating elements - available on all devices with responsive scaling */}
      {performanceSettings.enableComplexAnimations && [1, 2, 3].map((i) => (
        <motion.div
          key={`special-${i}`}
          className="absolute pointer-events-none"
          style={{
            left: `${20 + i * 25}%`,
            top: `${10 + i * 20}%`,
            width: `${getResponsiveScale(20, 'effects')}px`,
            height: `${getResponsiveScale(20, 'effects')}px`,
            background: performanceSettings.enableGradients
              ? `conic-gradient(from 0deg, ${colors.primary}${Math.floor(performanceSettings.gradientComplexity * 64).toString(16)}, ${colors.accent}${Math.floor(performanceSettings.gradientComplexity * 64).toString(16)}, ${colors.primary}${Math.floor(performanceSettings.gradientComplexity * 64).toString(16)})`
              : `${colors.primary}40`,
            borderRadius: '50%',
            filter: performanceSettings.enableBlur 
              ? `blur(${getResponsiveScale(1, 'effects') * performanceSettings.blurIntensity}px)` 
              : 'none',
            willChange: isVisible ? 'transform, opacity' : 'auto',
          }}
          animate={isVisible ? {
            rotate: [0, 360],
            scale: [1, 1 + getResponsiveScale(0.3, 'animations'), 1],
            opacity: [0.3, 0.6, 0.3],
          } : false}
          transition={{
            duration: (15 + i * 5) / performanceSettings.animationSpeed,
            repeat: isVisible ? Infinity : 0,
            ease: "linear",
          }}
        />
      ))}

      {/* Mobile-specific touch interaction indicator */}
      {performanceSettings.touchOptimization && (
        <motion.div
          className="absolute pointer-events-none"
          style={{
            right: '10%',
            bottom: '10%',
            width: '8px',
            height: '8px',
            background: colors.accent,
            borderRadius: '50%',
            filter: 'blur(0.5px)',
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}
    </div>
  );
}; 