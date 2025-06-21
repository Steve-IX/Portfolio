// Performance Optimization Utilities for LCP and INP

import { useEffect, useCallback, useRef } from 'react';

/**
 * Hook to optimize Largest Contentful Paint (LCP)
 */
export const useLCPOptimization = () => {
  useEffect(() => {
    // Preload critical resources
    const preloadCriticalResources = () => {
      // Preload critical fonts
      const fontPreloads = [
        'Inter',
        'JetBrains Mono'
      ];

      fontPreloads.forEach(font => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'font';
        link.type = 'font/woff2';
        link.crossOrigin = 'anonymous';
        link.href = `https://fonts.googleapis.com/css2?family=${font.replace(' ', '+')}:wght@400;500;600;700&display=swap`;
        document.head.appendChild(link);
      });

      // Preload critical images
      const criticalImages = [
        '/images/Lancaster_uni.png',
        '/images/Labelbox_Logo.png'
      ];

      criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
      });
    };

    // Use requestIdleCallback to avoid blocking main thread
    if ('requestIdleCallback' in window) {
      requestIdleCallback(preloadCriticalResources);
    } else {
      setTimeout(preloadCriticalResources, 1);
    }

    // Optimize critical rendering path
    const optimizeCriticalPath = () => {
      // Remove unnecessary animations from critical content
      const criticalElements = document.querySelectorAll('.lcp-optimized');
      criticalElements.forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
        el.style.visibility = 'visible';
      });
    };

    // Run immediately for LCP
    optimizeCriticalPath();

    // Also run after DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', optimizeCriticalPath);
    }

    return () => {
      document.removeEventListener('DOMContentLoaded', optimizeCriticalPath);
    };
  }, []);
};

/**
 * Hook to optimize Interaction to Next Paint (INP)
 */
export const useINPOptimization = () => {
  const interactionTimeouts = useRef(new Set());

  const optimizedClickHandler = useCallback((handler, debounceTime = 100) => {
    return (event) => {
      // Clear any pending timeouts
      interactionTimeouts.current.forEach(timeoutId => {
        clearTimeout(timeoutId);
      });
      interactionTimeouts.current.clear();

      // Debounce the interaction
      const timeoutId = setTimeout(() => {
        // Use scheduler if available
        if ('scheduler' in window && window.scheduler.postTask) {
          window.scheduler.postTask(() => {
            handler(event);
          }, { priority: 'user-blocking' });
        } else if ('requestIdleCallback' in window) {
          requestIdleCallback(() => {
            handler(event);
          }, { timeout: 50 });
        } else {
          handler(event);
        }
        
        interactionTimeouts.current.delete(timeoutId);
      }, debounceTime);

      interactionTimeouts.current.add(timeoutId);
    };
  }, []);

  const optimizedInputHandler = useCallback((handler, debounceTime = 150) => {
    let timeoutId;
    
    return (event) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        handler(event);
      }, debounceTime);
    };
  }, []);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      interactionTimeouts.current.forEach(timeoutId => {
        clearTimeout(timeoutId);
      });
      interactionTimeouts.current.clear();
    };
  }, []);

  return {
    optimizedClickHandler,
    optimizedInputHandler
  };
};

/**
 * Hook to optimize overall page performance
 */
export const usePagePerformanceOptimization = () => {
  useEffect(() => {
    // Optimize images loading
    const optimizeImages = () => {
      const images = document.querySelectorAll('img');
      images.forEach(img => {
        // Add loading="lazy" to non-critical images
        if (!img.closest('.hero-content') && !img.hasAttribute('loading')) {
          img.loading = 'lazy';
        }
        
        // Add decoding="async" for better performance
        if (!img.hasAttribute('decoding')) {
          img.decoding = 'async';
        }
      });
    };

    // Optimize third-party scripts
    const optimizeScripts = () => {
      const scripts = document.querySelectorAll('script[src]');
      scripts.forEach(script => {
        // Add loading optimizations to external scripts
        if (script.src && !script.src.includes(window.location.hostname)) {
          if (!script.hasAttribute('async') && !script.hasAttribute('defer')) {
            script.defer = true;
          }
        }
      });
    };

    // Run optimizations
    optimizeImages();
    optimizeScripts();

    // Set up observer for dynamic content
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              // Optimize newly added images
              const newImages = node.querySelectorAll ? node.querySelectorAll('img') : [];
              newImages.forEach(img => {
                if (!img.closest('.hero-content')) {
                  img.loading = 'lazy';
                  img.decoding = 'async';
                }
              });
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      observer.disconnect();
    };
  }, []);
};

/**
 * Critical CSS inlining utility
 */
export const inlineCriticalCSS = () => {
  const criticalCSS = `
    .hero-content {
      opacity: 1 !important;
      transform: none !important;
    }
    .lcp-optimized {
      opacity: 1 !important;
      visibility: visible !important;
    }
    .typing-animation {
      opacity: 1;
      width: 100%;
    }
  `;

  const style = document.createElement('style');
  style.textContent = criticalCSS;
  document.head.insertBefore(style, document.head.firstChild);
};

/**
 * Resource hints utility
 */
export const addResourceHints = () => {
  const hints = [
    { rel: 'dns-prefetch', href: '//fonts.googleapis.com' },
    { rel: 'dns-prefetch', href: '//fonts.gstatic.com' },
    { rel: 'preconnect', href: 'https://fonts.googleapis.com', crossorigin: true },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true }
  ];

  hints.forEach(hint => {
    const link = document.createElement('link');
    Object.assign(link, hint);
    document.head.appendChild(link);
  });
};

/**
 * Performance monitoring with Web Vitals
 */
export const measureWebVitals = () => {
  // Measure LCP
  if ('PerformanceObserver' in window) {
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log('📊 LCP:', Math.round(lastEntry.startTime), 'ms');
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // Measure FID/INP
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          console.log('⚡ FID/INP:', Math.round(entry.processingStart - entry.startTime), 'ms');
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

      // Measure CLS
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (!entry.hadRecentInput) {
            console.log('📐 CLS:', entry.value.toFixed(4));
          }
        });
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });

    } catch (error) {
      console.log('Performance measurement not supported');
    }
  }
}; 