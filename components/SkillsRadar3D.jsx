'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/lib/ThemeContext';
import { TrendingUp, Award, Code, Database, Cpu, Globe, BarChart3, Target } from 'lucide-react';
import { scheduleUserBlockingTask, throttleEvent } from '@/lib/performanceUtils';

export const SkillsRadar3D = () => {
  const { theme, colors } = useTheme();
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [activeTab, setActiveTab] = useState('radar');
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const skillCategories = {
    'Programming Languages': [
      { name: 'JavaScript', level: 95, experience: '4+ years', projects: 25, color: '#f1e05a', icon: Code },
      { name: 'Python', level: 90, experience: '3+ years', projects: 18, color: '#3572A5', icon: Code },
      { name: 'C++', level: 85, experience: '3+ years', projects: 12, color: '#f34b7d', icon: Code },
      { name: 'Java', level: 83, experience: '2+ years', projects: 13, color: '#b07219', icon: Code }
    ],
    'Frameworks & Libraries': [
      { name: 'React', level: 92, experience: '3+ years', projects: 20, color: '#61dafb', icon: Globe },
      { name: 'Next.js', level: 88, experience: '2+ years', projects: 12, color: '#000000', icon: Globe },
      { name: 'Node.js', level: 85, experience: '3+ years', projects: 16, color: '#339933', icon: Cpu },
      { name: 'Express', level: 82, experience: '2+ years', projects: 14, color: '#ff0000', icon: Database }
    ],
    'Tools & Technologies': [
      { name: 'Git', level: 90, experience: '4+ years', projects: 30, color: '#f05032', icon: Database },
      { name: 'Docker', level: 75, experience: '1+ years', projects: 8, color: '#2496ed', icon: Cpu },
      { name: 'AWS', level: 70, experience: '1+ years', projects: 6, color: '#ff9900', icon: Globe },
      { name: 'MongoDB', level: 80, experience: '2+ years', projects: 10, color: '#47a248', icon: Database }
    ]
  };

  // Memoize calculated values to prevent recalculation
  const allSkills = useMemo(() => Object.values(skillCategories).flat(), [skillCategories]);
  const avgSkillLevel = useMemo(() => 
    Math.round(allSkills.reduce((sum, skill) => sum + skill.level, 0) / allSkills.length), 
    [allSkills]
  );
  const totalProjects = useMemo(() => 
    allSkills.reduce((sum, skill) => sum + skill.projects, 0), 
    [allSkills]
  );
  const expertSkills = useMemo(() => 
    allSkills.filter(skill => skill.level >= 90).length, 
    [allSkills]
  );

  // Optimized tab switching handler
  const handleTabChange = useCallback((tab) => {
    scheduleUserBlockingTask(() => {
      setActiveTab(tab);
    });
  }, []);

  // Enhanced canvas setup and animation with proper tab handling
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Always clean up previous animation first
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    setIsAnimating(false);

    // Only start animation if radar tab is active
    if (activeTab !== 'radar') {
      return;
    }

    // Setup canvas with proper sizing
    const setupCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const radius = Math.min(rect.width, rect.height) * 0.35;
      
      return { centerX, centerY, radius, width: rect.width, height: rect.height };
    };

    let { centerX, centerY, radius, width, height } = setupCanvas();
    let time = 0;
    let animationActive = true;

    const draw = () => {
      // Double check we should still be animating
      if (!animationActive || !canvas || !ctx || activeTab !== 'radar') {
        return;
      }
      
      try {
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        time += 0.01;

        // Draw concentric circles (skill levels)
        const levels = [20, 40, 60, 80, 100];
        levels.forEach((level, index) => {
          const levelRadius = (level / 100) * radius;
          ctx.beginPath();
          ctx.arc(centerX, centerY, levelRadius, 0, Math.PI * 2);
          ctx.strokeStyle = theme === 'dark' ? 
            `rgba(255, 255, 255, ${0.1 + index * 0.05})` : 
            `rgba(0, 0, 0, ${0.1 + index * 0.05})`;
          ctx.lineWidth = 1;
          ctx.stroke();

          // Level labels
          if (index % 2 === 0) {
            ctx.fillStyle = theme === 'dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)';
            ctx.font = '10px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(`${level}%`, centerX + levelRadius - 15, centerY - 5);
          }
        });

        // Draw axis lines and skills
        const topSkills = allSkills.slice(0, 8);
        if (topSkills.length === 0) return;
        
        topSkills.forEach((skill, index) => {
          if (!skill || typeof skill.level !== 'number' || !skill.color) return;
          
          const angle = (index * Math.PI * 2) / topSkills.length;
          const endX = centerX + Math.cos(angle - Math.PI / 2) * radius;
          const endY = centerY + Math.sin(angle - Math.PI / 2) * radius;

          // Axis lines
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.lineTo(endX, endY);
          ctx.strokeStyle = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
          ctx.lineWidth = 1;
          ctx.stroke();

          // Skill labels
          const labelDistance = radius + 25;
          const labelX = centerX + Math.cos(angle - Math.PI / 2) * labelDistance;
          const labelY = centerY + Math.sin(angle - Math.PI / 2) * labelDistance;
          
          ctx.fillStyle = theme === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)';
          ctx.font = 'bold 11px Inter, sans-serif';
          ctx.textAlign = labelX > centerX ? 'left' : 'right';
          ctx.fillText(skill.name || 'Unknown', labelX, labelY);
          
          // Skill percentage
          ctx.font = '9px Inter, sans-serif';
          ctx.fillStyle = skill.color;
          ctx.fillText(`${skill.level}%`, labelX, labelY + 12);
        });

        // Draw skill polygon
        ctx.beginPath();
        topSkills.forEach((skill, index) => {
          if (!skill || typeof skill.level !== 'number') return;
          
          const angle = (index * Math.PI * 2) / topSkills.length;
          const skillRadius = (skill.level / 100) * radius;
          const x = centerX + Math.cos(angle - Math.PI / 2) * skillRadius;
          const y = centerY + Math.sin(angle - Math.PI / 2) * skillRadius;
          
          if (index === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        });
        ctx.closePath();
        ctx.fillStyle = theme === 'dark' ? 
          'rgba(0, 210, 255, 0.1)' : 
          'rgba(0, 210, 255, 0.15)';
        ctx.fill();
        ctx.strokeStyle = theme === 'dark' ? 
          'rgba(0, 210, 255, 0.6)' : 
          'rgba(0, 210, 255, 0.8)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw skill points with animation
        topSkills.forEach((skill, index) => {
          if (!skill || typeof skill.level !== 'number' || !skill.color) return;
          
          const angle = (index * Math.PI * 2) / topSkills.length;
          const skillRadius = (skill.level / 100) * radius;
          const x = centerX + Math.cos(angle - Math.PI / 2) * skillRadius;
          const y = centerY + Math.sin(angle - Math.PI / 2) * skillRadius;
          
          // Glow effect
          const glowRadius = 15 + Math.sin(time * 2 + index) * 3;
          const gradient = ctx.createRadialGradient(x, y, 0, x, y, glowRadius);
          gradient.addColorStop(0, `${skill.color}80`);
          gradient.addColorStop(1, `${skill.color}00`);
          
          ctx.beginPath();
          ctx.fillStyle = gradient;
          ctx.arc(x, y, glowRadius, 0, Math.PI * 2);
          ctx.fill();
          
          // Skill point
          ctx.beginPath();
          ctx.fillStyle = skill.color;
          ctx.arc(x, y, 5, 0, Math.PI * 2);
          ctx.fill();
          
          // Inner highlight
          ctx.beginPath();
          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.arc(x, y, 2, 0, Math.PI * 2);
          ctx.fill();
        });

        // Continue animation only if still active
        if (animationActive && activeTab === 'radar') {
          animationRef.current = requestAnimationFrame(draw);
        }
      } catch (error) {
        console.error('Canvas drawing error:', error);
        animationActive = false;
      }
    };

    // Force canvas refresh and start animation
    setIsAnimating(true);
    
    // Use a more reliable delay to ensure canvas is ready
    const startAnimation = () => {
      if (activeTab === 'radar' && animationActive) {
        draw();
      }
    };

    // Start animation immediately and also with a small delay as backup
    startAnimation();
    const timeoutId = setTimeout(startAnimation, 100);

    // Handle resize
    const handleResize = throttleEvent(() => {
      if (activeTab === 'radar' && canvas && animationActive) {
        const newDimensions = setupCanvas();
        centerX = newDimensions.centerX;
        centerY = newDimensions.centerY;
        radius = newDimensions.radius;
        width = newDimensions.width;
        height = newDimensions.height;
      }
    }, 250);

    window.addEventListener('resize', handleResize);

    return () => {
      animationActive = false;
      setIsAnimating(false);
      clearTimeout(timeoutId);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [theme, colors, allSkills, activeTab]); // Keep activeTab as dependency

  const StatCard = ({ icon: Icon, title, value, subtitle, color }) => (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      className="glass-card p-4 text-center"
      style={{ 
        backgroundColor: theme === 'dark' ? `${color}15` : `${color}10`,
        border: `1px solid ${color}30`
      }}
    >
      <Icon size={24} style={{ color }} className="mx-auto mb-2" />
      <div className="text-2xl font-bold" style={{ color }}>{value}</div>
      <div className="text-sm font-semibold" style={{ color: colors.text }}>{title}</div>
      <div className="text-xs" style={{ color: colors.muted }}>{subtitle}</div>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="max-w-6xl mx-auto"
    >
      <div className="text-center mb-8">
        <h3 className="text-4xl font-bold mb-4 gradient-text">
          📊 Technical Skills Analytics
        </h3>
        <p className="text-lg" style={{ color: colors.muted }}>
          Comprehensive analysis of my technical expertise and project experience
        </p>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard 
          icon={Award}
          title="Avg. Proficiency"
          value={`${avgSkillLevel}%`}
          subtitle="Across all skills"
          color={colors.primary}
        />
        <StatCard 
          icon={Target}
          title="Expert Level"
          value={expertSkills}
          subtitle="Skills above 90%"
          color={colors.accent}
        />
        <StatCard 
          icon={Code}
          title="Total Skills"
          value={allSkills.length}
          subtitle="Technologies mastered"
          color="#00d2ff"
        />
        <StatCard 
          icon={BarChart3}
          title="Projects Built"
          value={totalProjects}
          subtitle="Using these skills"
          color="#ff006e"
        />
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center mb-6">
        <div className="flex gap-2 p-1 rounded-lg glass-card">
          {['radar', 'categories', 'timeline'].map((tab) => (
            <Button
              key={tab}
              onClick={() => handleTabChange(tab)}
              variant={activeTab === tab ? 'default' : 'ghost'}
              size="sm"
              className="capitalize"
              style={{
                backgroundColor: activeTab === tab ? colors.primary : 'transparent',
                color: activeTab === tab ? '#ffffff' : colors.text
              }}
            >
              {tab === 'radar' ? '📡 Radar' : tab === 'categories' ? '📋 Categories' : '📈 Experience'}
            </Button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'radar' && (
          <motion.div
            key="radar"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="glass-card p-6">
              <CardContent className="p-0">
                <canvas
                  ref={canvasRef}
                  className="w-full h-96 rounded-lg"
                  style={{ 
                    backgroundColor: theme === 'dark' ? '#0a0a0a' : '#f8fafc',
                    contain: 'layout style paint',
                    transform: 'translateZ(0)',
                  }}
                />
              </CardContent>
            </Card>
          </motion.div>
        )}

        {activeTab === 'categories' && (
          <motion.div
            key="categories"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {Object.entries(skillCategories).map(([category, skills]) => (
              <Card key={category} className="glass-card p-6">
                <CardContent className="p-0">
                  <h4 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: colors.primary }}>
                    <Code size={20} />
                    {category}
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    {skills.map((skill) => (
                      <div
                        key={skill.name}
                        className="p-4 rounded-lg border transition-all duration-300 hover:scale-105 cursor-pointer"
                        style={{ 
                          backgroundColor: theme === 'dark' ? `${skill.color}10` : `${skill.color}05`,
                          borderColor: `${skill.color}30`
                        }}
                        onMouseEnter={() => setHoveredSkill(skill.name)}
                        onMouseLeave={() => setHoveredSkill(null)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold" style={{ color: colors.text }}>
                            {skill.name}
                          </span>
                          <span className="text-sm font-bold" style={{ color: skill.color }}>
                            {skill.level}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                          <motion.div
                            className="h-2 rounded-full"
                            style={{ backgroundColor: skill.color }}
                            initial={{ width: 0 }}
                            animate={{ width: `${skill.level}%` }}
                            transition={{ duration: 1, delay: 0.2 }}
                          />
                        </div>
                        <div className="flex justify-between text-xs" style={{ color: colors.muted }}>
                          <span>{skill.experience}</span>
                          <span>{skill.projects} projects</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        )}

        {activeTab === 'timeline' && (
          <motion.div
            key="timeline"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="glass-card p-6">
              <CardContent className="p-0">
                <h4 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: colors.primary }}>
                  <TrendingUp size={20} />
                  Learning Journey Timeline
                </h4>
                <div className="space-y-4">
                  {allSkills
                    .sort((a, b) => b.level - a.level)
                    .map((skill, index) => (
                      <motion.div
                        key={skill.name}
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-4 p-3 rounded-lg"
                        style={{ 
                          backgroundColor: theme === 'dark' ? `${skill.color}05` : `${skill.color}03`,
                          border: `1px solid ${skill.color}20`
                        }}
                      >
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: skill.color }}
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <span className="font-semibold" style={{ color: colors.text }}>
                              {skill.name}
                            </span>
                            <span className="text-sm" style={{ color: skill.color }}>
                              {skill.level}% • {skill.experience}
                            </span>
                          </div>
                          <div className="text-xs" style={{ color: colors.muted }}>
                            {skill.projects} projects completed
                          </div>
                        </div>
                      </motion.div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}; 