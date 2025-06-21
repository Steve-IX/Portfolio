// Universal Performance Optimization Utilities
// Optimized settings applied to all devices for better performance

/**
 * Check if device has reduced motion preference
 */
export const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Get optimized performance settings for all devices
 */
export const getPerformanceSettings = () => {
  const reducedMotion = prefersReducedMotion();
  
  return {
    // Particle settings - optimized for all devices
    particleCount: 25, // Reduced from 50 for better performance
    particleAnimationDuration: 25, // Balanced animation duration
    
    // Canvas settings - optimized for all devices
    canvasFrameRate: 45, // Balanced frame rate
    canvasHighDPI: true, // Keep high DPI for quality
    
    // Animation settings - optimized for all devices
    enableComplexAnimations: !reducedMotion, // Only disable for reduced motion users
    animationFrameSkip: 1, // No frame skipping needed
    
    // Audio visualizer settings - optimized for all devices
    visualizerBars: 20, // Balanced between 16 and 32
    visualizerUpdateRate: 75, // Balanced update rate
    
    // General settings - optimized for all devices
    enableBackgroundAnimations: !reducedMotion,
    enableParallax: !reducedMotion,
    enableBlur: true, // Keep blur effects for visual quality
    enableGradients: true, // Keep gradients for visual quality
    
    // Intersection observer settings - optimized for all devices
    rootMargin: '75px', // Balanced margin
    threshold: 0.2, // Balanced threshold
    
    // Device info - simplified
    prefersReducedMotion: reducedMotion
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
 * Intersection Observer for pausing animations when not visible
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