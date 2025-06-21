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

// Performance utilities for optimizing interactions and reducing INP

/**
 * Optimized scheduler for better INP performance
 * Uses scheduler.postTask if available, fallback to requestAnimationFrame
 */
export const scheduleUserBlockingTask = (callback, options = {}) => {
  if ('scheduler' in window && 'postTask' in window.scheduler) {
    return window.scheduler.postTask(callback, { 
      priority: 'user-blocking', 
      ...options 
    });
  } else {
    return requestAnimationFrame(callback);
  }
};

/**
 * Optimized scheduler for background tasks
 */
export const scheduleBackgroundTask = (callback, options = {}) => {
  if ('scheduler' in window && 'postTask' in window.scheduler) {
    return window.scheduler.postTask(callback, { 
      priority: 'background', 
      ...options 
    });
  } else if ('requestIdleCallback' in window) {
    return requestIdleCallback(callback, { timeout: 100, ...options });
  } else {
    return setTimeout(callback, 0);
  }
};

/**
 * Debounced interaction handler for better INP
 */
export const createOptimizedHandler = (handler, delay = 16) => {
  let timeoutId;
  let isScheduled = false;

  return (...args) => {
    // Clear existing timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // If not already scheduled, schedule immediately for better responsiveness
    if (!isScheduled) {
      isScheduled = true;
      scheduleUserBlockingTask(() => {
        handler(...args);
        isScheduled = false;
      });
    } else {
      // Debounce subsequent calls
      timeoutId = setTimeout(() => {
        scheduleUserBlockingTask(() => {
          handler(...args);
        });
      }, delay);
    }
  };
};

/**
 * Optimized style calculator to prevent recalculation
 */
export const memoizeStyles = (styleFunction, dependencies = []) => {
  let cachedResult;
  let cachedDeps;

  return (...args) => {
    const currentDeps = dependencies.map(dep => typeof dep === 'function' ? dep() : dep);
    
    if (!cachedDeps || !currentDeps.every((dep, i) => dep === cachedDeps[i])) {
      cachedResult = styleFunction(...args);
      cachedDeps = currentDeps;
    }
    
    return cachedResult;
  };
};

/**
 * Prevent layout thrashing by batching DOM reads/writes
 */
export const batchDOMOperations = (operations) => {
  return new Promise((resolve) => {
    scheduleUserBlockingTask(() => {
      const results = [];
      
      // Batch all reads first
      const reads = operations.filter(op => op.type === 'read');
      reads.forEach(op => {
        results.push(op.fn());
      });
      
      // Then batch all writes
      const writes = operations.filter(op => op.type === 'write');
      writes.forEach(op => {
        op.fn();
      });
      
      resolve(results);
    });
  });
};

/**
 * Optimize animation frames for better performance
 */
export const createAnimationController = () => {
  let animationId;
  let isRunning = false;

  return {
    start: (callback) => {
      if (isRunning) return;
      
      isRunning = true;
      const animate = (timestamp) => {
        if (!isRunning) return;
        
        callback(timestamp);
        animationId = requestAnimationFrame(animate);
      };
      
      animationId = requestAnimationFrame(animate);
    },
    
    stop: () => {
      isRunning = false;
      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
    },
    
    isRunning: () => isRunning
  };
};

/**
 * Optimize event handlers to prevent unnecessary firing
 */
export const throttleEvent = (callback, limit = 16) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      callback.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Intersection Observer utilities for performance
 */
export const createOptimizedObserver = (callback, options = {}) => {
  const defaultOptions = {
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  };

  return new IntersectionObserver((entries) => {
    scheduleBackgroundTask(() => {
      callback(entries);
    });
  }, defaultOptions);
};

/**
 * Memory-efficient event listener manager
 */
export class EventManager {
  constructor() {
    this.listeners = new Map();
  }

  add(element, event, handler, options = {}) {
    const key = `${element.toString()}-${event}`;
    
    if (this.listeners.has(key)) {
      this.remove(element, event);
    }

    const optimizedHandler = options.throttle 
      ? throttleEvent(handler, options.throttle)
      : handler;

    element.addEventListener(event, optimizedHandler, {
      passive: true,
      ...options
    });

    this.listeners.set(key, { element, event, handler: optimizedHandler });
  }

  remove(element, event) {
    const key = `${element.toString()}-${event}`;
    const listener = this.listeners.get(key);
    
    if (listener) {
      listener.element.removeEventListener(listener.event, listener.handler);
      this.listeners.delete(key);
    }
  }

  removeAll() {
    this.listeners.forEach(({ element, event, handler }) => {
      element.removeEventListener(event, handler);
    });
    this.listeners.clear();
  }
}

// Export singleton instance
export const eventManager = new EventManager();

/**
 * Performance monitoring utilities
 */
export const measureINP = (elementSelector, interactionType = 'click') => {
  const element = document.querySelector(elementSelector);
  if (!element) return;

  let startTime;
  
  element.addEventListener(`${interactionType}start`, () => {
    startTime = performance.now();
  }, { passive: true });
  
  element.addEventListener(interactionType, () => {
    if (!startTime) return;
    
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const endTime = performance.now();
        const inp = endTime - startTime;
        console.log(`INP for ${elementSelector}: ${inp.toFixed(2)}ms`);
        
        if (inp > 200) {
          console.warn(`⚠️ INP above threshold (${inp.toFixed(2)}ms) for ${elementSelector}`);
        }
      });
    });
  }, { passive: true });
}; 