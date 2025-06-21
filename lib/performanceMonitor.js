// Performance monitoring utility for tracking INP improvements

class PerformanceMonitor {
  constructor() {
    this.interactions = new Map();
    this.inpThreshold = 200; // INP threshold in milliseconds
    this.isEnabled = typeof window !== 'undefined' && 'performance' in window;
    
    if (this.isEnabled) {
      this.init();
    }
  }

  init() {
    // Monitor button interactions specifically
    this.monitorButtons();
    
    // Monitor theme toggle performance
    this.monitorThemeToggle();
    
    // Monitor music player interactions
    this.monitorMusicPlayer();
    
    // General interaction monitoring
    this.monitorGeneralInteractions();
    
    // Report performance metrics periodically
    this.startPerformanceReporting();
  }

  monitorButtons() {
    const buttons = document.querySelectorAll('button, [role="button"]');
    buttons.forEach(button => {
      this.addInteractionListener(button, 'click', 'button');
    });
  }

  monitorThemeToggle() {
    // Use a more specific selector or wait for the element
    const checkThemeToggle = () => {
      const themeToggle = document.querySelector('[aria-label="Toggle theme"]');
      if (themeToggle) {
        this.addInteractionListener(themeToggle, 'click', 'theme-toggle');
      } else {
        // Retry after a short delay
        setTimeout(checkThemeToggle, 1000);
      }
    };
    
    checkThemeToggle();
  }

  monitorMusicPlayer() {
    const checkMusicPlayer = () => {
      const playButtons = document.querySelectorAll('[title="Play"], [title="Pause"]');
      playButtons.forEach(button => {
        this.addInteractionListener(button, 'click', 'music-player');
      });
      
      if (playButtons.length === 0) {
        setTimeout(checkMusicPlayer, 1000);
      }
    };
    
    checkMusicPlayer();
  }

  monitorGeneralInteractions() {
    // Monitor all interactive elements
    const interactiveElements = document.querySelectorAll(
      'a, button, input, textarea, select, [tabindex], [role="button"]'
    );
    
    interactiveElements.forEach(element => {
      this.addInteractionListener(element, 'click', 'general');
    });
  }

  addInteractionListener(element, eventType, category) {
    let startTime;
    let interactionId;

    const startHandler = (event) => {
      startTime = performance.now();
      interactionId = `${category}-${Date.now()}-${Math.random()}`;
      
      // Store interaction start
      this.interactions.set(interactionId, {
        category,
        element: element.tagName,
        startTime,
        eventType
      });
    };

    const endHandler = (event) => {
      if (!startTime || !interactionId) return;
      
      // Use double RAF to measure until paint
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const endTime = performance.now();
          const inp = endTime - startTime;
          
          // Update interaction record
          const interaction = this.interactions.get(interactionId);
          if (interaction) {
            interaction.endTime = endTime;
            interaction.inp = inp;
            interaction.isGoodINP = inp <= this.inpThreshold;
            
            // Log performance
            this.logInteractionPerformance(interaction);
          }
        });
      });
    };

    // Add event listeners
    element.addEventListener(`${eventType}start`, startHandler, { passive: true });
    element.addEventListener(eventType, endHandler, { passive: true });
    
    // Handle touch events for mobile
    if (eventType === 'click') {
      element.addEventListener('touchstart', startHandler, { passive: true });
      element.addEventListener('touchend', endHandler, { passive: true });
    }
  }

  logInteractionPerformance(interaction) {
    const { category, element, inp, isGoodINP } = interaction;
    
    if (isGoodINP) {
      console.log(`✅ Good INP: ${category} (${element}) - ${inp.toFixed(2)}ms`);
    } else {
      console.warn(`⚠️ Poor INP: ${category} (${element}) - ${inp.toFixed(2)}ms (threshold: ${this.inpThreshold}ms)`);
    }
    
    // Store for reporting
    this.storeMetric(interaction);
  }

  storeMetric(interaction) {
    const metrics = this.getStoredMetrics();
    metrics.push({
      timestamp: Date.now(),
      category: interaction.category,
      element: interaction.element,
      inp: interaction.inp,
      isGoodINP: interaction.isGoodINP
    });
    
    // Keep only last 100 interactions
    if (metrics.length > 100) {
      metrics.splice(0, metrics.length - 100);
    }
    
    try {
      localStorage.setItem('performance-metrics', JSON.stringify(metrics));
    } catch (e) {
      // Handle localStorage errors gracefully
      console.warn('Could not store performance metrics');
    }
  }

  getStoredMetrics() {
    try {
      const stored = localStorage.getItem('performance-metrics');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  }

  startPerformanceReporting() {
    // Report performance summary every 30 seconds
    setInterval(() => {
      this.reportPerformanceSummary();
    }, 30000);
  }

  reportPerformanceSummary() {
    const metrics = this.getStoredMetrics();
    if (metrics.length === 0) return;
    
    const recentMetrics = metrics.filter(m => Date.now() - m.timestamp < 30000);
    if (recentMetrics.length === 0) return;
    
    const avgINP = recentMetrics.reduce((sum, m) => sum + m.inp, 0) / recentMetrics.length;
    const goodINPCount = recentMetrics.filter(m => m.isGoodINP).length;
    const goodINPPercentage = (goodINPCount / recentMetrics.length) * 100;
    
    console.log(`📊 Performance Summary (last 30s):`);
    console.log(`   Average INP: ${avgINP.toFixed(2)}ms`);
    console.log(`   Good INP: ${goodINPPercentage.toFixed(1)}% (${goodINPCount}/${recentMetrics.length})`);
    
    // Category breakdown
    const categoryStats = {};
    recentMetrics.forEach(m => {
      if (!categoryStats[m.category]) {
        categoryStats[m.category] = { total: 0, good: 0, totalINP: 0 };
      }
      categoryStats[m.category].total++;
      categoryStats[m.category].totalINP += m.inp;
      if (m.isGoodINP) categoryStats[m.category].good++;
    });
    
    Object.entries(categoryStats).forEach(([category, stats]) => {
      const avgCategoryINP = stats.totalINP / stats.total;
      const goodPercentage = (stats.good / stats.total) * 100;
      console.log(`   ${category}: ${avgCategoryINP.toFixed(2)}ms avg, ${goodPercentage.toFixed(1)}% good`);
    });
  }

  // Public API for manual monitoring
  measureInteraction(element, callback) {
    const startTime = performance.now();
    
    const result = callback();
    
    // Handle both sync and async callbacks
    const measure = () => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const endTime = performance.now();
          const inp = endTime - startTime;
          
          console.log(`🔍 Manual measurement: ${inp.toFixed(2)}ms`);
          
          if (inp > this.inpThreshold) {
            console.warn(`⚠️ Manual measurement exceeded threshold: ${inp.toFixed(2)}ms > ${this.inpThreshold}ms`);
          }
        });
      });
    };
    
    if (result && typeof result.then === 'function') {
      result.then(measure);
    } else {
      measure();
    }
    
    return result;
  }

  // Get current performance stats
  getPerformanceStats() {
    const metrics = this.getStoredMetrics();
    if (metrics.length === 0) return null;
    
    const avgINP = metrics.reduce((sum, m) => sum + m.inp, 0) / metrics.length;
    const goodINPCount = metrics.filter(m => m.isGoodINP).length;
    const goodINPPercentage = (goodINPCount / metrics.length) * 100;
    
    return {
      totalInteractions: metrics.length,
      averageINP: avgINP,
      goodINPPercentage,
      threshold: this.inpThreshold
    };
  }

  // Reset stored metrics
  resetMetrics() {
    try {
      localStorage.removeItem('performance-metrics');
      console.log('Performance metrics reset');
    } catch (e) {
      console.warn('Could not reset performance metrics');
    }
  }
}

// Create singleton instance
const performanceMonitor = new PerformanceMonitor();

// Export for use in other modules
export default performanceMonitor;

// Also export the class for custom instances
export { PerformanceMonitor };

// Auto-start monitoring when DOM is ready
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      // Re-scan for new elements after DOM is ready
      setTimeout(() => {
        performanceMonitor.monitorButtons();
        performanceMonitor.monitorThemeToggle();
        performanceMonitor.monitorMusicPlayer();
      }, 1000);
    });
  } else {
    // DOM is already ready
    setTimeout(() => {
      performanceMonitor.monitorButtons();
      performanceMonitor.monitorThemeToggle();
      performanceMonitor.monitorMusicPlayer();
    }, 1000);
  }
} 