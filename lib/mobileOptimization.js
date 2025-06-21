// Mobile Performance Optimization Utilities

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
 * Get optimized settings for current device
 */
export const getPerformanceSettings = () => {
  const mobile = isMobileDevice();
  const lowEnd = isLowEndDevice();
  const reducedMotion = prefersReducedMotion();
  
  return {
    // Particle settings
    particleCount: mobile ? (lowEnd ? 15 : 25) : 50,
    particleAnimationDuration: mobile ? 30 : 20,
    
    // Canvas settings
    canvasFrameRate: mobile ? (lowEnd ? 30 : 45) : 60,
    canvasHighDPI: !mobile, // Disable high DPI on mobile
    
    // Animation settings
    enableComplexAnimations: !mobile && !reducedMotion,
    animationFrameSkip: mobile ? (lowEnd ? 3 : 2) : 1, // Skip frames on mobile
    
    // Audio visualizer settings
    visualizerBars: mobile ? 16 : 32,
    visualizerUpdateRate: mobile ? 100 : 50, // ms between updates
    
    // General settings
    enableBackgroundAnimations: !mobile,
    enableParallax: !mobile,
    enableBlur: !mobile, // Disable blur effects on mobile
    enableGradients: !lowEnd, // Disable complex gradients on low-end devices
    
    // Intersection observer settings
    rootMargin: mobile ? '50px' : '100px',
    threshold: mobile ? 0.1 : 0.3,
    
    // Device info
    isMobile: mobile,
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