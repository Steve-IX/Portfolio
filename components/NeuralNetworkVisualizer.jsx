'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Zap, Activity } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useTheme } from '@/lib/ThemeContext';

export const NeuralNetworkVisualizer = () => {
  const { theme, colors } = useTheme();
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Neural network configuration
    const layers = [6, 8, 6, 3]; // nodes per layer
    const layerSpacing = canvas.width / (layers.length + 1);
    const nodeRadius = 8;

    // Create network structure
    const network = layers.map((nodeCount, layerIndex) => {
      const nodes = [];
      const layerHeight = canvas.height * 0.8;
      const nodeSpacing = layerHeight / (nodeCount + 1);
      
      for (let i = 0; i < nodeCount; i++) {
        nodes.push({
          x: layerSpacing * (layerIndex + 1),
          y: (canvas.height - layerHeight) / 2 + nodeSpacing * (i + 1),
          activation: Math.random(),
          pulsePhase: Math.random() * Math.PI * 2
        });
      }
      return nodes;
    });

    let time = 0;

    const animate = () => {
      if (!isAnimating) return;

      time += 0.02;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update activations
      network.forEach(layer => {
        layer.forEach(node => {
          node.activation = 0.3 + 0.7 * Math.sin(time + node.pulsePhase);
          node.pulsePhase += 0.05;
        });
      });

      // Draw connections
      for (let layerIndex = 0; layerIndex < network.length - 1; layerIndex++) {
        const currentLayer = network[layerIndex];
        const nextLayer = network[layerIndex + 1];
        
        currentLayer.forEach(node => {
          nextLayer.forEach(nextNode => {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(nextNode.x, nextNode.y);
            
            const opacity = 0.1 + node.activation * 0.3;
            ctx.strokeStyle = theme === 'dark' 
              ? `rgba(255, 255, 255, ${opacity})` 
              : `rgba(0, 0, 0, ${opacity})`;
            ctx.lineWidth = 0.5 + node.activation;
            ctx.stroke();
          });
        });
      }

      // Draw nodes
      network.forEach((layer, layerIndex) => {
        layer.forEach(node => {
          const activation = node.activation;
          const pulseSize = nodeRadius + Math.sin(node.pulsePhase) * activation * 3;
          
          // Node glow
          if (activation > 0.3) {
            const gradient = ctx.createRadialGradient(
              node.x, node.y, 0,
              node.x, node.y, pulseSize * 2
            );
            gradient.addColorStop(0, `rgba(0, 210, 255, ${activation * 0.6})`);
            gradient.addColorStop(1, 'rgba(0, 210, 255, 0)');
            
            ctx.beginPath();
            ctx.fillStyle = gradient;
            ctx.arc(node.x, node.y, pulseSize * 2, 0, Math.PI * 2);
            ctx.fill();
          }
          
          // Node core
          ctx.beginPath();
          ctx.arc(node.x, node.y, pulseSize, 0, Math.PI * 2);
          
          if (layerIndex === 0) {
            ctx.fillStyle = `rgba(34, 197, 94, ${0.7 + activation * 0.3})`;
          } else if (layerIndex === network.length - 1) {
            ctx.fillStyle = `rgba(168, 85, 247, ${0.7 + activation * 0.3})`;
          } else {
            ctx.fillStyle = `rgba(59, 130, 246, ${0.5 + activation * 0.5})`;
          }
          
          ctx.fill();
          ctx.strokeStyle = theme === 'dark' ? '#ffffff' : '#000000';
          ctx.lineWidth = 1;
          ctx.stroke();
        });
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isAnimating, theme]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="max-w-4xl mx-auto"
    >
      <motion.div className="text-center mb-8">
        <h3 className="text-4xl font-bold mb-4 gradient-text">
          🧠 Neural Network
        </h3>
        <p style={{ color: theme === 'dark' ? '#a0aec0' : colors.muted }}>
          Watch AI in action - neural network visualization
        </p>
      </motion.div>

      <Card className="glass-card p-6">
        <CardContent className="p-0">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-xl font-bold" style={{ color: colors.primary }}>
              Live Network Activity
            </h4>
            <button
              onClick={() => setIsAnimating(!isAnimating)}
              className="px-3 py-1 rounded text-sm"
              style={{
                backgroundColor: isAnimating ? colors.accent : 'transparent',
                border: `1px solid ${colors.accent}`,
                color: isAnimating ? '#ffffff' : colors.accent
              }}
            >
              {isAnimating ? 'Pause' : 'Play'}
            </button>
          </div>
          
          <canvas
            ref={canvasRef}
            className="w-full h-64 rounded-lg"
            style={{ 
              backgroundColor: theme === 'dark' ? '#0a0a0a' : '#f8fafc',
              border: `1px solid ${colors.primary}20`
            }}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
}; 