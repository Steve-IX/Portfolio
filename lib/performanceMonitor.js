// Performance Monitoring Utilities for Mobile Optimization

/**
 * Simple performance monitor to track key metrics
 */
export class PerformanceMonitor {
  constructor() {
    this.metrics = {
      fps: 0,
      memoryUsage: 0,
      animationFrames: 0,
      renderTime: 0
    };
    this.frameCount = 0;
    this.lastTime = performance.now();
    this.isMonitoring = false;
  }

  start() {
    if (this.isMonitoring) return;
    this.isMonitoring = true;
    this.lastTime = performance.now();
    this.frameCount = 0;
    this.monitor();
  }

  stop() {
    this.isMonitoring = false;
  }

  monitor() {
    if (!this.isMonitoring) return;

    const now = performance.now();
    this.frameCount++;

    // Calculate FPS every second
    if (now - this.lastTime >= 1000) {
      this.metrics.fps = Math.round((this.frameCount * 1000) / (now - this.lastTime));
      this.frameCount = 0;
      this.lastTime = now;

      // Get memory usage if available
      if (performance.memory) {
        this.metrics.memoryUsage = Math.round(performance.memory.usedJSHeapSize / 1024 / 1024);
      }
    }

    requestAnimationFrame(() => this.monitor());
  }

  getMetrics() {
    return { ...this.metrics };
  }

  logMetrics() {
    const metrics = this.getMetrics();
    console.log('📊 Performance Metrics:', {
      'FPS': metrics.fps,
      'Memory (MB)': metrics.memoryUsage,
      'Device Type': this.getDeviceType()
    });
  }

  getDeviceType() {
    const userAgent = navigator.userAgent.toLowerCase();
    if (/mobile|android|iphone|ipad|ipod/.test(userAgent)) {
      return 'Mobile';
    }
    return 'Desktop';
  }
}

/**
 * Measure interaction performance (INP related)
 */
export class InteractionMonitor {
  constructor() {
    this.interactions = [];
    this.isMonitoring = false;
  }

  start() {
    if (this.isMonitoring) return;
    this.isMonitoring = true;
    
    // Monitor click events
    document.addEventListener('click', this.handleInteraction.bind(this), { capture: true });
    document.addEventListener('touchstart', this.handleInteraction.bind(this), { capture: true });
  }

  stop() {
    this.isMonitoring = false;
    document.removeEventListener('click', this.handleInteraction.bind(this), { capture: true });
    document.removeEventListener('touchstart', this.handleInteraction.bind(this), { capture: true });
  }

  handleInteraction(event) {
    if (!this.isMonitoring) return;

    const startTime = performance.now();
    
    // Measure time to next paint
    requestAnimationFrame(() => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      this.interactions.push({
        type: event.type,
        target: event.target.tagName,
        duration: Math.round(duration),
        timestamp: startTime,
        isOptimized: duration < 100 // Good INP threshold
      });

      // Keep only last 50 interactions
      if (this.interactions.length > 50) {
        this.interactions.shift();
      }
    });
  }

  getAverageINP() {
    if (this.interactions.length === 0) return 0;
    
    const totalDuration = this.interactions.reduce((sum, interaction) => sum + interaction.duration, 0);
    return Math.round(totalDuration / this.interactions.length);
  }

  getWorstINP() {
    if (this.interactions.length === 0) return 0;
    return Math.max(...this.interactions.map(i => i.duration));
  }

  logINPReport() {
    const avgINP = this.getAverageINP();
    const worstINP = this.getWorstINP();
    const optimizedCount = this.interactions.filter(i => i.isOptimized).length;
    const optimizedPercentage = Math.round((optimizedCount / this.interactions.length) * 100) || 0;

    console.log('⚡ Interaction Performance Report:', {
      'Average INP (ms)': avgINP,
      'Worst INP (ms)': worstINP,
      'Optimized Interactions': `${optimizedPercentage}%`,
      'Total Interactions': this.interactions.length,
      'Status': avgINP < 100 ? '✅ Good' : avgINP < 200 ? '⚠️ Needs Improvement' : '❌ Poor'
    });
  }
}

/**
 * Global performance monitoring instance
 */
let globalMonitor = null;
let globalInteractionMonitor = null;

export const startPerformanceMonitoring = () => {
  if (typeof window === 'undefined') return;

  globalMonitor = new PerformanceMonitor();
  globalInteractionMonitor = new InteractionMonitor();
  
  globalMonitor.start();
  globalInteractionMonitor.start();

  // Log metrics every 10 seconds
  setInterval(() => {
    if (globalMonitor && globalInteractionMonitor) {
      globalMonitor.logMetrics();
      globalInteractionMonitor.logINPReport();
    }
  }, 10000);

  console.log('🚀 Performance monitoring started');
};

export const stopPerformanceMonitoring = () => {
  if (globalMonitor) {
    globalMonitor.stop();
    globalMonitor = null;
  }
  
  if (globalInteractionMonitor) {
    globalInteractionMonitor.stop();
    globalInteractionMonitor = null;
  }

  console.log('⏹️ Performance monitoring stopped');
};

export const getPerformanceReport = () => {
  if (!globalMonitor || !globalInteractionMonitor) {
    return { error: 'Monitoring not active' };
  }

  return {
    ...globalMonitor.getMetrics(),
    avgINP: globalInteractionMonitor.getAverageINP(),
    worstINP: globalInteractionMonitor.getWorstINP()
  };
}; 