// Universal Performance Optimization Utilities

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
 * Get optimized performance settings for all devices
 */
export const getPerformanceSettings = () => {
  const lowEnd = isLowEndDevice();
  const reducedMotion = prefersReducedMotion();
  
  return {
    // Particle settings - optimized for all devices
    particleCount: lowEnd ? 20 : 30,
    particleAnimationDuration: 25,
    
    // Canvas settings - optimized frame rates
    canvasFrameRate: lowEnd ? 45 : 60,
    canvasHighDPI: !lowEnd, // Disable high DPI on low-end devices
    
    // Animation settings - balanced for performance
    enableComplexAnimations: !reducedMotion,
    animationFrameSkip: lowEnd ? 2 : 1,
    
    // Audio visualizer settings - optimized
    visualizerBars: lowEnd ? 20 : 28,
    visualizerUpdateRate: 60, // Consistent update rate
    
    // General settings - performance optimized
    enableBackgroundAnimations: !reducedMotion,
    enableParallax: !reducedMotion,
    enableBlur: !lowEnd, // Disable blur effects on low-end devices
    enableGradients: !lowEnd, // Disable complex gradients on low-end devices
    
    // Intersection observer settings
    rootMargin: '75px',
    threshold: 0.2,
    
    // Device info
    isLowEnd: lowEnd,
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