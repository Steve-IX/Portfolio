'use client';

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Brain, Zap, Activity, Play, Pause, RotateCcw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useTheme } from '@/lib/ThemeContext';
import { createOptimizedObserver, throttleEvent } from '@/lib/performanceUtils';

export const NeuralNetworkVisualizer = () => {
  const { theme, colors } = useTheme();
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const networkRef = useRef(null);
  const [isAnimating, setIsAnimating] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [networkStats, setNetworkStats] = useState({
    totalNodes: 0,
    activeConnections: 0,
    processingSpeed: 0
  });

  // Professional network configuration
  const networkConfig = useMemo(() => ({
    layers: [5, 8, 6, 3], // Input, Hidden1, Hidden2, Output
    nodeRadius: 8,
    connectionOpacity: 0.6,
    pulseSpeed: 2,
    dataFlowSpeed: 1.5,
    colors: {
      input: '#4ade80',      // Green for input
      hidden: '#3b82f6',     // Blue for hidden
      output: '#f59e0b',     // Orange for output
      connection: theme === 'dark' ? '#64748b' : '#475569',
      dataFlow: '#06b6d4',   // Cyan for data flow
      background: theme === 'dark' ? '#0f172a' : '#f8fafc'
    }
  }), [theme]);

  // Initialize professional network structure
  const initializeNetwork = useCallback((canvas) => {
    if (!canvas) return null;

    const { layers } = networkConfig;
    const padding = 60; // Reduced padding for better fit
    const rect = canvas.getBoundingClientRect();
    const canvasWidth = rect.width;
    const canvasHeight = rect.height;
    const layerSpacing = (canvasWidth - padding * 2) / (layers.length - 1);
    
    const network = layers.map((nodeCount, layerIndex) => {
      const nodes = [];
      const availableHeight = canvasHeight - padding * 2;
      const nodeSpacing = availableHeight / (nodeCount + 1);
      
      for (let i = 0; i < nodeCount; i++) {
        nodes.push({
          x: padding + layerSpacing * layerIndex,
          y: padding + nodeSpacing * (i + 1),
          activation: 0.3 + Math.random() * 0.4,
          targetActivation: 0.3 + Math.random() * 0.4,
          pulsePhase: Math.random() * Math.PI * 2,
          id: `${layerIndex}-${i}`,
          layer: layerIndex,
          connections: [],
          dataPackets: []
        });
      }
      return nodes;
    });

    // Create connections between layers
      for (let layerIndex = 0; layerIndex < network.length - 1; layerIndex++) {
        const currentLayer = network[layerIndex];
        const nextLayer = network[layerIndex + 1];
        
        currentLayer.forEach(node => {
          nextLayer.forEach(nextNode => {
          const weight = (Math.random() - 0.5) * 2;
          const connection = {
            from: node,
            to: nextNode,
            weight,
            strength: Math.abs(weight),
            active: false,
            dataFlow: 0
          };
          node.connections.push(connection);
        });
      });
    }

    networkRef.current = network;
    
    // Calculate stats
    const totalNodes = network.reduce((sum, layer) => sum + layer.length, 0);
    const totalConnections = network.slice(0, -1).reduce((sum, layer) => 
      sum + layer.reduce((layerSum, node) => layerSum + node.connections.length, 0), 0);
    
    setNetworkStats({
      totalNodes,
      activeConnections: totalConnections,
      processingSpeed: 100
    });

    return network;
  }, [networkConfig]);

  // Professional animation with data flow simulation
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isAnimating || !isVisible) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const network = networkRef.current;
    if (!network) return;

    const time = performance.now() * 0.001;

    // Clear with subtle gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, networkConfig.colors.background);
    gradient.addColorStop(1, theme === 'dark' ? '#1e293b' : '#e2e8f0');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update network state
      network.forEach((layer, layerIndex) => {
        layer.forEach(node => {
        // Smooth activation transitions
        node.activation += (node.targetActivation - node.activation) * 0.02;
        
        // Periodic activation changes
        if (Math.random() < 0.01) {
          node.targetActivation = 0.2 + Math.random() * 0.6;
        }
        
        // Update pulse phase
        node.pulsePhase += 0.03;

        // Update connections
        node.connections.forEach(connection => {
          const distance = Math.sqrt(
            Math.pow(connection.to.x - connection.from.x, 2) + 
            Math.pow(connection.to.y - connection.from.y, 2)
          );
          
          // Activate connection based on source node activation
          connection.active = connection.from.activation > 0.5;
          connection.dataFlow += connection.active ? 0.05 : -0.02;
          connection.dataFlow = Math.max(0, Math.min(1, connection.dataFlow));
        });
      });
    });

    // Draw connections with professional styling
    network.forEach(layer => {
      layer.forEach(node => {
        node.connections.forEach(connection => {
          if (connection.strength < 0.1) return; // Skip weak connections
          
          const opacity = connection.dataFlow * networkConfig.connectionOpacity;
          if (opacity < 0.05) return;

          // Connection line with gradient
          const gradient = ctx.createLinearGradient(
            connection.from.x, connection.from.y,
            connection.to.x, connection.to.y
          );
          gradient.addColorStop(0, `rgba(100, 116, 139, ${opacity})`);
          gradient.addColorStop(0.5, `rgba(59, 130, 246, ${opacity * 1.5})`);
          gradient.addColorStop(1, `rgba(100, 116, 139, ${opacity})`);

          ctx.beginPath();
          ctx.moveTo(connection.from.x, connection.from.y);
          ctx.lineTo(connection.to.x, connection.to.y);
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 1 + connection.strength * 2;
          ctx.stroke();

          // Data flow animation
          if (connection.active && connection.dataFlow > 0.3) {
            const progress = (time * networkConfig.dataFlowSpeed + connection.from.id.charCodeAt(0)) % 1;
            const flowX = connection.from.x + (connection.to.x - connection.from.x) * progress;
            const flowY = connection.from.y + (connection.to.y - connection.from.y) * progress;

            // Data packet
            ctx.beginPath();
            ctx.arc(flowX, flowY, 3, 0, Math.PI * 2);
            ctx.fillStyle = networkConfig.colors.dataFlow;
            ctx.shadowColor = networkConfig.colors.dataFlow;
            ctx.shadowBlur = 10;
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        });
      });
    });

    // Draw nodes with professional styling
    network.forEach((layer, layerIndex) => {
      layer.forEach(node => {
        const activation = node.activation;
        const pulseSize = networkConfig.nodeRadius + Math.sin(node.pulsePhase) * activation * 3;
        
        // Node glow effect
        if (activation > 0.4) {
          const glowRadius = pulseSize * 2.5;
          const glowGradient = ctx.createRadialGradient(
            node.x, node.y, 0,
            node.x, node.y, glowRadius
          );
          
          let nodeColor;
          if (layerIndex === 0) nodeColor = networkConfig.colors.input;
          else if (layerIndex === network.length - 1) nodeColor = networkConfig.colors.output;
          else nodeColor = networkConfig.colors.hidden;
          
          glowGradient.addColorStop(0, `${nodeColor}40`);
          glowGradient.addColorStop(0.7, `${nodeColor}20`);
          glowGradient.addColorStop(1, 'transparent');
          
          ctx.beginPath();
          ctx.fillStyle = glowGradient;
          ctx.arc(node.x, node.y, glowRadius, 0, Math.PI * 2);
          ctx.fill();
        }

        // Main node body with gradient
        const nodeGradient = ctx.createRadialGradient(
          node.x - pulseSize * 0.3, node.y - pulseSize * 0.3, 0,
          node.x, node.y, pulseSize
        );
        
        let nodeColor;
        if (layerIndex === 0) nodeColor = networkConfig.colors.input;
        else if (layerIndex === network.length - 1) nodeColor = networkConfig.colors.output;
        else nodeColor = networkConfig.colors.hidden;
        
        nodeGradient.addColorStop(0, `${nodeColor}ff`);
        nodeGradient.addColorStop(0.7, `${nodeColor}cc`);
        nodeGradient.addColorStop(1, `${nodeColor}88`);

        ctx.beginPath();
        ctx.arc(node.x, node.y, pulseSize, 0, Math.PI * 2);
        ctx.fillStyle = nodeGradient;
        ctx.fill();

        // Node border
        ctx.beginPath();
        ctx.arc(node.x, node.y, pulseSize, 0, Math.PI * 2);
        ctx.strokeStyle = theme === 'dark' ? '#ffffff40' : '#00000020';
        ctx.lineWidth = 1.5;
          ctx.stroke();

        // Activation indicator (inner circle)
        const innerRadius = pulseSize * activation * 0.6;
        if (innerRadius > 2) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, innerRadius, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.fill();
        }

        // Node ID for debugging (optional)
        if (activation > 0.7) {
          ctx.fillStyle = theme === 'dark' ? '#ffffff' : '#000000';
          ctx.font = '8px Inter, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(node.id, node.x, node.y + 25);
        }
      });
    });

    // Draw layer labels
    const layerLabels = ['Input Layer', 'Hidden Layer 1', 'Hidden Layer 2', 'Output Layer'];
    network.forEach((layer, layerIndex) => {
      if (layer.length > 0) {
        const x = layer[0].x;
        const y = 30;
        
        ctx.fillStyle = colors.primary;
        ctx.font = 'bold 12px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(layerLabels[layerIndex] || `Layer ${layerIndex + 1}`, x, y);
        
        // Layer stats
        const activeNodes = layer.filter(node => node.activation > 0.5).length;
        ctx.fillStyle = colors.muted;
        ctx.font = '10px Inter, sans-serif';
        ctx.fillText(`${activeNodes}/${layer.length} active`, x, y + 15);
      }
    });

    // Update stats
    if (Math.floor(time * 10) % 30 === 0) { // Update every 3 seconds
      const activeConnections = network.reduce((sum, layer) =>
        sum + layer.reduce((layerSum, node) =>
          layerSum + node.connections.filter(conn => conn.active).length, 0), 0);
      
      setNetworkStats(prev => ({
        ...prev,
        activeConnections,
        processingSpeed: Math.floor(50 + Math.random() * 50)
      }));
    }

    animationRef.current = requestAnimationFrame(animate);
  }, [isAnimating, isVisible, theme, networkConfig, colors]);

  // Throttled toggle function
  const toggleAnimation = useCallback(
    throttleEvent(() => {
      setIsAnimating(prev => !prev);
    }, 100),
    []
  );

  const resetNetwork = useCallback(() => {
    if (canvasRef.current) {
      initializeNetwork(canvasRef.current);
    }
  }, [initializeNetwork]);

  // Canvas setup and resize handling
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const setupCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      
      // Set actual canvas size with proper aspect ratio
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      
      const ctx = canvas.getContext('2d');
      ctx.scale(dpr, dpr);
      
      // Set canvas display size
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      
      // Initialize network with proper dimensions
      initializeNetwork(canvas);
    };

    setupCanvas();

    // Throttled resize handler
    const handleResize = throttleEvent(setupCanvas, 250);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [initializeNetwork]);

  // Animation lifecycle
  useEffect(() => {
    if (isAnimating && isVisible) {
      animationRef.current = requestAnimationFrame(animate);
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isAnimating, isVisible, animate]);

  // Intersection observer for performance
  useEffect(() => {
    const observer = createOptimizedObserver(
      (entries) => {
        setIsVisible(entries[0].isIntersecting);
      },
      { threshold: 0.2 }
    );

    const canvas = canvasRef.current;
    if (canvas && observer) {
      observer.observe(canvas);
    }

    return () => {
      if (observer && canvas) {
        observer.unobserve(canvas);
      }
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, type: "tween" }}
      className="max-w-6xl mx-auto"
    >
      <motion.div className="text-center mb-6">
        <h3 className="text-3xl font-bold mb-3 gradient-text flex items-center justify-center gap-3">
          <Brain size={32} style={{ color: colors.primary }} />
          AI Neural Network Simulator
        </h3>
        <p style={{ color: theme === 'dark' ? '#a0aec0' : colors.muted }}>
          Professional-grade neural network visualization with real-time data flow
        </p>
      </motion.div>

      {/* Network Statistics */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="glass-card p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Brain size={16} style={{ color: colors.primary }} />
            <span className="text-sm font-semibold" style={{ color: colors.text }}>Nodes</span>
          </div>
          <div className="text-2xl font-bold" style={{ color: colors.primary }}>
            {networkStats.totalNodes}
          </div>
        </Card>
        
        <Card className="glass-card p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Zap size={16} style={{ color: colors.accent }} />
            <span className="text-sm font-semibold" style={{ color: colors.text }}>Active Links</span>
          </div>
          <div className="text-2xl font-bold" style={{ color: colors.accent }}>
            {networkStats.activeConnections}
          </div>
        </Card>
        
        <Card className="glass-card p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Activity size={16} style={{ color: '#f59e0b' }} />
            <span className="text-sm font-semibold" style={{ color: colors.text }}>Processing</span>
          </div>
          <div className="text-2xl font-bold" style={{ color: '#f59e0b' }}>
            {networkStats.processingSpeed}%
          </div>
        </Card>
      </div>

      <Card className="glass-card p-4">
        <CardContent className="p-0">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-lg font-bold flex items-center gap-2" style={{ color: colors.primary }}>
              <Activity size={18} />
              Live Network Activity
            </h4>
            <div className="flex gap-2">
              <button
                onClick={resetNetwork}
                className="flex items-center gap-1 px-3 py-1 rounded text-sm transition-all duration-200 hover:scale-105"
                style={{
                  backgroundColor: `${colors.muted}20`,
                  border: `1px solid ${colors.muted}40`,
                  color: colors.muted,
                  contain: 'layout style paint',
                  transform: 'translateZ(0)',
                }}
              >
                <RotateCcw size={14} />
                Reset
              </button>
            <button
                onClick={toggleAnimation}
                className="flex items-center gap-1 px-3 py-1 rounded text-sm transition-all duration-200 hover:scale-105"
              style={{
                backgroundColor: isAnimating ? colors.accent : 'transparent',
                border: `1px solid ${colors.accent}`,
                  color: isAnimating ? '#ffffff' : colors.accent,
                  contain: 'layout style paint',
                  transform: 'translateZ(0)',
              }}
            >
                {isAnimating ? <Pause size={14} /> : <Play size={14} />}
              {isAnimating ? 'Pause' : 'Play'}
            </button>
            </div>
          </div>
          
          <canvas
            ref={canvasRef}
            className="w-full h-64 rounded-lg border" // Fixed height for better aspect ratio
            style={{ 
              backgroundColor: networkConfig.colors.background,
              borderColor: `${colors.primary}20`,
              contain: 'layout style paint',
              transform: 'translateZ(0)',
              aspectRatio: '16/9', // Ensure proper aspect ratio
              maxHeight: '320px', // Prevent it from getting too tall
            }}
          />
          
          <div className="mt-3 text-xs" style={{ color: colors.muted }}>
            <div className="flex justify-between">
              <span>🟢 Input Layer • 🔵 Hidden Layers • 🟠 Output Layer</span>
              <span>🔵 Data Flow • ⚡ Neural Activation</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}; 