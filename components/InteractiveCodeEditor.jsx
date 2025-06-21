'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, Download, Copy, Check, Terminal, Code2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useTheme } from '@/lib/ThemeContext';
import { getPerformanceSettings, throttle } from '@/lib/mobileOptimization';

export const InteractiveCodeEditor = () => {
  const { theme, colors } = useTheme();
  const [performanceSettings, setPerformanceSettings] = useState(null);
  const [code, setCode] = useState(`// Welcome to my Interactive Code Playground!
// Try editing this JavaScript code and click Run!

function createArt() {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Create animated gradient
  const gradient = ctx.createLinearGradient(0, 0, 400, 200);
  gradient.addColorStop(0, '#00d2ff');
  gradient.addColorStop(0.5, '#3a7bd5');
  gradient.addColorStop(1, '#ff006e');
  
  // Draw animated circles
  for (let i = 0; i < 10; i++) {
    ctx.beginPath();
    const x = Math.random() * 400;
    const y = Math.random() * 200;
    const radius = Math.random() * 30 + 10;
    
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.globalAlpha = 0.7;
    ctx.fill();
  }
  
  return "🎨 Art created! Check the canvas below.";
}

// Run the function
createArt();`);
  
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef(null);
  const editorRef = useRef(null);
  const animationFrameRef = useRef(null);
  const timeoutRef = useRef(null);

  // Track active animations and timeouts for proper cleanup
  const activeAnimationsRef = useRef(new Set());
  const activeTimeoutsRef = useRef(new Set());
  const activeIntervalsRef = useRef(new Set());

  // Initialize performance settings
  useEffect(() => {
    const settings = getPerformanceSettings();
    setPerformanceSettings(settings);
  }, []);

  // Enhanced cleanup function to stop all animations
  const cleanup = () => {
    // Cancel any running animation frames tracked by this component
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    // Clear component timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    // Cancel all tracked animations from user code
    activeAnimationsRef.current.forEach(id => {
      cancelAnimationFrame(id);
    });
    activeAnimationsRef.current.clear();
    
    // Clear all tracked timeouts from user code
    activeTimeoutsRef.current.forEach(id => {
      clearTimeout(id);
    });
    activeTimeoutsRef.current.clear();
    
    // Clear all tracked intervals from user code
    activeIntervalsRef.current.forEach(id => {
      clearInterval(id);
    });
    activeIntervalsRef.current.clear();
    
    // Clear canvas
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  // Wrapped functions to track animations and timeouts
  const wrappedRequestAnimationFrame = (callback) => {
    const id = requestAnimationFrame(callback);
    activeAnimationsRef.current.add(id);
    return id;
  };

  const wrappedCancelAnimationFrame = (id) => {
    cancelAnimationFrame(id);
    activeAnimationsRef.current.delete(id);
  };

  const wrappedSetTimeout = (callback, delay) => {
    const id = setTimeout((...args) => {
      activeTimeoutsRef.current.delete(id);
      callback(...args);
    }, delay);
    activeTimeoutsRef.current.add(id);
    return id;
  };

  const wrappedClearTimeout = (id) => {
    clearTimeout(id);
    activeTimeoutsRef.current.delete(id);
  };

  const wrappedSetInterval = (callback, delay) => {
    const id = setInterval(callback, delay);
    activeIntervalsRef.current.add(id);
    return id;
  };

  const wrappedClearInterval = (id) => {
    clearInterval(id);
    activeIntervalsRef.current.delete(id);
  };

  const predefinedExamples = [
    {
      name: "Particle Animation",
      code: `// Animated Particle System
function animateParticles() {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const particles = [];
  
  // Create particles
  for (let i = 0; i < 50; i++) {
    particles.push({
      x: Math.random() * 400,
      y: Math.random() * 200,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      color: \`hsl(\${Math.random() * 360}, 70%, 60%)\`
    });
  }
  
  function animate() {
    ctx.clearRect(0, 0, 400, 200);
    
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      
      if (p.x < 0 || p.x > 400) p.vx *= -1;
      if (p.y < 0 || p.y > 200) p.vy *= -1;
      
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
    });
    
    requestAnimationFrame(animate);
  }
  
  animate();
  return "✨ Particle animation started!";
}

animateParticles();`
    },
    {
      name: "Fractal Tree",
      code: `// Recursive Fractal Tree
function drawTree() {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, 400, 200);
  
  function branch(startX, startY, len, angle, branchWidth) {
    ctx.beginPath();
    ctx.save();
    
    ctx.strokeStyle = \`hsl(\${len * 2}, 70%, 50%)\`;
    ctx.fillStyle = \`hsl(\${len * 2}, 70%, 50%)\`;
    ctx.lineWidth = branchWidth;
    
    ctx.translate(startX, startY);
    ctx.rotate(angle * Math.PI / 180);
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -len);
    ctx.stroke();
    
    if (len < 10) {
      ctx.beginPath();
      ctx.arc(0, -len, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      return;
    }
    
    branch(0, -len, len * 0.8, -15, branchWidth * 0.8);
    branch(0, -len, len * 0.8, 15, branchWidth * 0.8);
    
    ctx.restore();
  }
  
  branch(200, 180, 60, 0, 8);
  return "🌳 Fractal tree grown!";
}

drawTree();`
    },
    {
      name: "Matrix Rain",
      code: `// Matrix Digital Rain Effect
function matrixRain() {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()";
  const fontSize = 14;
  const columns = Math.floor(400 / fontSize);
  const drops = Array(columns).fill(0);
  
  function draw() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, 400, 200);
    
    ctx.fillStyle = '#00FF00';
    ctx.font = fontSize + 'px monospace';
    
    drops.forEach((y, i) => {
      const text = letters[Math.floor(Math.random() * letters.length)];
      const x = i * fontSize;
      ctx.fillText(text, x, y * fontSize);
      
      if (y * fontSize > 200 && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    });
    
    setTimeout(() => {
      requestAnimationFrame(draw);
    }, 50);
  }
  
  draw();
  return "🔮 Welcome to the Matrix!";
}

matrixRain();`
    }
  ];

  const runCode = async () => {
    setIsRunning(true);
    setOutput('Running code...');
    
    try {
      // Clean up any previous animations first
      cleanup();
      
      // Small delay to ensure cleanup is complete
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Clear and setup canvas
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.id = 'canvas';
        canvas.width = 400;
        canvas.height = 200;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      
      // Execute the code safely with wrapped functions for proper tracking
      const result = new Function(
        'document', 
        'requestAnimationFrame', 
        'cancelAnimationFrame', 
        'setTimeout', 
        'clearTimeout', 
        'setInterval', 
        'clearInterval',
        code
      )(
        document, 
        wrappedRequestAnimationFrame, 
        wrappedCancelAnimationFrame, 
        wrappedSetTimeout, 
        wrappedClearTimeout, 
        wrappedSetInterval, 
        wrappedClearInterval
      );
      
      setOutput(result || 'Code executed successfully!');
    } catch (error) {
      setOutput(`❌ Error: ${error.message}`);
      // Clean up on error too
      cleanup();
    } finally {
      // Always reset running state after a delay
      timeoutRef.current = setTimeout(() => {
        setIsRunning(false);
      }, 1000);
    }
  };

  const resetCode = () => {
    cleanup();
    setCode(predefinedExamples[0].code);
    setOutput('Console cleared! Ready to run new code.');
    setIsRunning(false);
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code');
    }
  };

  const loadExample = (example) => {
    cleanup();
    setCode(example.code);
    setOutput('New example loaded! Click "Run Code" to execute.');
    setIsRunning(false);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="max-w-6xl mx-auto"
    >
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 
          className="text-4xl font-bold mb-4 gradient-text"
          style={{ color: colors.primary }}
        >
          🚀 Interactive Code Playground
        </h3>
        <p 
          className="text-lg mb-6"
          style={{ color: theme === 'dark' ? '#a0aec0' : colors.muted }}
        >
          Try out some live coding! Edit the JavaScript below and see it run in real-time.
        </p>
        
        {/* Example buttons */}
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {predefinedExamples.map((example, index) => (
            <Button
              key={example.name}
              onClick={() => loadExample(example)}
              size="sm"
              variant="outline"
              className="magnetic"
              style={{
                borderColor: colors.accent,
                color: colors.accent,
                backgroundColor: theme === 'dark' ? `${colors.accent}10` : 'rgba(255,255,255,0.8)'
              }}
            >
              {example.name}
            </Button>
          ))}
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Code Editor */}
        <Card 
          className="glass-card"
          style={{ 
            backgroundColor: theme === 'dark' ? `${colors.primary}10` : 'rgba(255,255,255,0.9)',
            border: `1px solid ${colors.primary}30`
          }}
        >
          <CardContent className="p-0">
            <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: `${colors.primary}30` }}>
              <div className="flex items-center gap-2">
                <Code2 size={20} style={{ color: colors.primary }} />
                <span className="font-semibold" style={{ color: colors.primary }}>
                  JavaScript Editor
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={copyCode}
                  size="sm"
                  variant="ghost"
                  className="magnetic"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </Button>
                <Button
                  onClick={resetCode}
                  size="sm"
                  variant="ghost"
                  className="magnetic"
                >
                  <RotateCcw size={16} />
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <textarea
                ref={editorRef}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-80 p-4 pl-12 font-mono text-sm bg-transparent border-none outline-none resize-none"
                style={{
                  color: colors.text,
                  backgroundColor: theme === 'dark' ? `${colors.primary}05` : 'rgba(255,255,255,0.5)',
                  fontFamily: 'JetBrains Mono, Fira Code, monospace'
                }}
                spellCheck={false}
              />
              
              {/* Line numbers */}
              <div 
                className="absolute left-2 top-4 pointer-events-none font-mono text-xs leading-5 select-none"
                style={{ color: `${colors.muted}60` }}
              >
                {code.split('\n').map((_, i) => (
                  <div key={i} className="h-5">{i + 1}</div>
                ))}
              </div>
            </div>
            
            <div className="p-4 border-t" style={{ borderColor: `${colors.primary}30` }}>
              <Button
                onClick={runCode}
                disabled={isRunning}
                className="btn-enhanced w-full"
                style={{
                  background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
                  color: '#ffffff'
                }}
              >
                <AnimatePresence mode="wait">
                  {isRunning ? (
                    <motion.div
                      key="running"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center"
                    >
                      <motion.div
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      Running...
                    </motion.div>
                  ) : (
                    <motion.div
                      key="run"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center"
                    >
                      <Play size={16} className="mr-2" />
                      Run Code
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Output Panel */}
        <Card 
          className="glass-card"
          style={{ 
            backgroundColor: theme === 'dark' ? `${colors.accent}10` : 'rgba(255,255,255,0.9)',
            border: `1px solid ${colors.accent}30`
          }}
        >
          <CardContent className="p-0">
            <div className="flex items-center gap-2 p-4 border-b" style={{ borderColor: `${colors.accent}30` }}>
              <Terminal size={20} style={{ color: colors.accent }} />
              <span className="font-semibold" style={{ color: colors.accent }}>
                Canvas Output
              </span>
            </div>
            
            {/* Canvas */}
            <div className="p-4">
              <canvas
                ref={canvasRef}
                width={400}
                height={200}
                className="w-full border rounded"
                style={{ 
                  backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
                  borderColor: `${colors.accent}30`,
                  maxWidth: '100%',
                  height: 'auto'
                }}
              />
            </div>
            
            {/* Console Output */}
            <div className="p-4 border-t" style={{ borderColor: `${colors.accent}30` }}>
              <div className="flex items-center gap-2 mb-2">
                <Terminal size={16} style={{ color: colors.accent }} />
                <span className="text-sm font-semibold" style={{ color: colors.accent }}>
                  Console Output:
                </span>
              </div>
              <div
                className="bg-black text-green-400 p-3 rounded font-mono text-sm min-h-[60px] overflow-auto"
                style={{
                  backgroundColor: theme === 'dark' ? '#0a0a0a' : '#1a1a1a',
                  color: '#00ff00'
                }}
              >
                {output || 'Click "Run Code" to see output...'}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Fun Challenge */}
      <motion.div
        className="mt-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <p 
          className="text-sm"
          style={{ color: theme === 'dark' ? '#a0aec0' : colors.muted }}
        >
          💡 <strong>Challenge:</strong> Can you create something cool? Try drawing your name, making a simple game, or creating generative art!
        </p>
      </motion.div>
    </motion.div>
  );
}; 