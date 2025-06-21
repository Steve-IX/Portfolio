// Responsive Performance Optimization Utilities
// Ensures all desktop features work on mobile with proper adaptations

/**
 * Detect if user is on mobile device
 */
export const isMobileDevice = () => {
  if (typeof window === 'undefined') return false;
  
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  
  // Check for mobile patterns
  const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
  const isMobile = mobileRegex.test(userAgent.toLowerCase());
  
  // Also check screen size
  const isSmallScreen = window.innerWidth <= 768;
  
  // Check for touch device
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  return isMobile || (isSmallScreen && isTouchDevice);
};

/**
 * Check if device has reduced motion preference
 */
export const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Check if device is low-end (based on hardware concurrency and memory)
 */
export const isLowEndDevice = () => {
  if (typeof navigator === 'undefined') return false;
  
  const cores = navigator.hardwareConcurrency || 1;
  const memory = navigator.deviceMemory || 1;
  
  // Consider device low-end if less than 4 cores or less than 2GB RAM
  return cores < 4 || memory < 2;
};

/**
 * Get responsive performance settings for current device
 * All features remain available but are optimized for performance
 */
export const getPerformanceSettings = () => {
  const mobile = isMobileDevice();
  const lowEnd = isLowEndDevice();
  const reducedMotion = prefersReducedMotion();
  
  return {
    // Particle settings - Scale down for performance but keep all features
    particleCount: mobile ? (lowEnd ? 30 : 40) : 50,
    particleSize: mobile ? 0.8 : 1.0, // Slightly smaller on mobile
    particleAnimationDuration: mobile ? 25 : 20,
    
    // Canvas settings - Optimize performance while maintaining quality
    canvasFrameRate: mobile ? (lowEnd ? 45 : 55) : 60,
    canvasHighDPI: mobile ? false : true, // Disable high DPI on mobile for performance
    canvasScale: mobile ? 0.9 : 1.0, // Slightly smaller canvas on mobile
    
    // Animation settings - Maintain all animations with performance tweaks
    enableComplexAnimations: !reducedMotion, // Keep all animations unless user prefers reduced motion
    animationFrameSkip: mobile ? (lowEnd ? 2 : 1) : 1,
    animationSpeed: mobile ? 1.2 : 1.0, // Slightly faster animations on mobile
    
    // Audio visualizer settings - Full features with performance scaling
    visualizerBars: mobile ? (lowEnd ? 24 : 28) : 32,
    visualizerUpdateRate: mobile ? 75 : 50, // ms between updates
    visualizerHeight: mobile ? 0.8 : 1.0, // Scale height for mobile
    
    // Visual effects - Keep all effects but optimize performance
    enableBackgroundAnimations: true, // Keep all background animations
    enableParallax: !reducedMotion, // Keep parallax unless user prefers reduced motion
    enableBlur: !lowEnd, // Keep blur effects unless low-end device
    enableGradients: true, // Keep gradients on all devices
    blurIntensity: mobile ? 0.7 : 1.0, // Reduce blur intensity on mobile
    gradientComplexity: mobile ? 0.8 : 1.0, // Simplify gradients slightly on mobile
    
    // 3D and WebGL settings - Maintain 3D features with performance scaling
    enable3D: true, // Keep 3D features on all devices
    webglAntialiasing: !mobile, // Disable antialiasing on mobile
    webglPreserveDrawingBuffer: false, // Optimize WebGL performance
    meshComplexity: mobile ? 0.8 : 1.0, // Slightly reduce mesh complexity on mobile
    
    // Interaction settings - Enhanced for touch devices
    touchOptimization: mobile,
    hoverEffects: !mobile, // Use touch-specific interactions on mobile
    clickDelay: mobile ? 0 : 0, // Remove click delays on mobile
    
    // Intersection observer settings
    rootMargin: mobile ? '30px' : '50px',
    threshold: mobile ? 0.15 : 0.25,
    
    // Performance monitoring
    enablePerformanceMonitoring: true,
    performanceReportingInterval: mobile ? 15000 : 10000, // Less frequent on mobile
    
    // Responsive breakpoints
    isTablet: mobile && window.innerWidth > 768,
    isPhone: mobile && window.innerWidth <= 768,
    
    // Device info
    isMobile: mobile,
    isLowEnd: lowEnd,
    prefersReducedMotion: reducedMotion,
    
    // Scaling factors for responsive design
    scaleFactors: {
      particles: mobile ? (lowEnd ? 0.6 : 0.8) : 1.0,
      animations: mobile ? 0.9 : 1.0,
      effects: mobile ? (lowEnd ? 0.7 : 0.85) : 1.0,
      canvas: mobile ? 0.9 : 1.0
    }
  };
};

/**
 * Throttle function calls for performance
 */
export const throttle = (func, delay) => {
  let timeoutId;
  let lastExecTime = 0;
  return function (...args) {
    const currentTime = Date.now();
    
    if (currentTime - lastExecTime > delay) {
      func.apply(this, args);
      lastExecTime = currentTime;
    } else {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
        lastExecTime = Date.now();
      }, delay - (currentTime - lastExecTime));
    }
  };
};

/**
 * Debounce function calls for performance
 */
export const debounce = (func, delay) => {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
};

/**
 * Adaptive frame rate controller
 */
export const createAdaptiveFrameRate = (baseFrameRate = 60) => {
  const settings = getPerformanceSettings();
  let currentFrameRate = settings.canvasFrameRate;
  let frameCount = 0;
  let lastTime = performance.now();
  
  return {
    shouldRender: () => {
      frameCount++;
      const now = performance.now();
      const elapsed = now - lastTime;
      const targetInterval = 1000 / currentFrameRate;
      
      if (elapsed >= targetInterval) {
        lastTime = now;
        return true;
      }
      return false;
    },
    
    adaptFrameRate: (performanceMetrics) => {
      // Adapt frame rate based on performance
      if (performanceMetrics.fps < currentFrameRate * 0.8) {
        currentFrameRate = Math.max(30, currentFrameRate - 5);
      } else if (performanceMetrics.fps > currentFrameRate * 0.95) {
        currentFrameRate = Math.min(settings.canvasFrameRate, currentFrameRate + 5);
      }
    }
  };
};

/**
 * Request idle callback polyfill for older browsers
 */
export const requestIdleCallback = (callback, options = {}) => {
  if (typeof window !== 'undefined' && window.requestIdleCallback) {
    return window.requestIdleCallback(callback, options);
  }
  
  // Polyfill for browsers that don't support requestIdleCallback
  const timeout = options.timeout || 5000;
  const startTime = performance.now();
  
  return setTimeout(() => {
    callback({
      didTimeout: false,
      timeRemaining() {
        return Math.max(0, 50 - (performance.now() - startTime));
      }
    });
  }, 1);
};

/**
 * Cancel idle callback
 */
export const cancelIdleCallback = (id) => {
  if (typeof window !== 'undefined' && window.cancelIdleCallback) {
    return window.cancelIdleCallback(id);
  }
  return clearTimeout(id);
};

/**
 * Intersection Observer for performance optimization
 */
export const createPerformanceObserver = (callback, options = {}) => {
  const settings = getPerformanceSettings();
  
  const observerOptions = {
    rootMargin: settings.rootMargin,
    threshold: settings.threshold,
    ...options
  };
  
  if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
    return new IntersectionObserver(callback, observerOptions);
  }
  
  // Fallback for browsers without IntersectionObserver
  return null;
};

/**
 * Responsive scaling utility
 */
export const getResponsiveScale = (baseValue, scaleFactor = 'effects') => {
  const settings = getPerformanceSettings();
  return baseValue * (settings.scaleFactors[scaleFactor] || 1.0);
};

/**
 * Touch-optimized event handling
 */
export const createTouchOptimizedHandler = (handler, options = {}) => {
  const settings = getPerformanceSettings();
  
  if (!settings.touchOptimization) {
    return handler;
  }
  
  const debounceDelay = options.debounce || 100;
  const debouncedHandler = debounce(handler, debounceDelay);
  
  return (event) => {
    // Prevent default touch behaviors that might interfere
    if (event.type.startsWith('touch')) {
      event.preventDefault();
    }
    
    // Add touch-specific optimizations
    if (event.touches && event.touches.length > 1) {
      // Handle multi-touch if needed
      return;
    }
    
    debouncedHandler(event);
  };
}; 