'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/lib/ThemeContext';
import { TrendingUp, Award, Code, Database, Cpu, Globe, BarChart3, Target } from 'lucide-react';

export const SkillsRadar3D = () => {
  const { theme, colors } = useTheme();
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [activeTab, setActiveTab] = useState('radar');
  const [hoveredSkill, setHoveredSkill] = useState(null);

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

  const allSkills = Object.values(skillCategories).flat();
  const avgSkillLevel = Math.round(allSkills.reduce((sum, skill) => sum + skill.level, 0) / allSkills.length);
  const totalProjects = allSkills.reduce((sum, skill) => sum + skill.projects, 0);
  const expertSkills = allSkills.filter(skill => skill.level >= 90).length;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return; // Fix: Check if context exists
    
    // Fix: Add error handling for canvas operations
    try {
      canvas.width = canvas.offsetWidth * 2; // High DPI
      canvas.height = canvas.offsetHeight * 2;
      ctx.scale(2, 2);
    } catch (error) {
      console.error('Canvas initialization error:', error);
      return;
    }

    const centerX = canvas.offsetWidth / 2;
    const centerY = canvas.offsetHeight / 2;
    const radius = Math.min(canvas.offsetWidth, canvas.offsetHeight) * 0.35;

    let time = 0;
    let isAnimating = true;

    const draw = () => {
      if (!isAnimating || !canvas || !ctx) return; // Fix: Check animation state and canvas validity
      
      try {
        // Always continue animation regardless of active tab
        ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
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

        // Draw axis lines
        const topSkills = allSkills.slice(0, 8); // Top 8 skills for radar
        if (topSkills.length === 0) return; // Fix: Prevent division by zero
        
        topSkills.forEach((skill, index) => {
          if (!skill || typeof skill.level !== 'number' || !skill.color) return; // Fix: Validate skill data
          
          const angle = (index * Math.PI * 2) / topSkills.length;
          const endX = centerX + Math.cos(angle - Math.PI / 2) * radius;
          const endY = centerY + Math.sin(angle - Math.PI / 2) * radius;

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
          if (!skill || typeof skill.level !== 'number') return; // Fix: Validate skill data
          
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
          if (!skill || typeof skill.level !== 'number' || !skill.color) return; // Fix: Validate skill data
          
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

        // Continue animation regardless of active tab
        if (isAnimating) {
          animationRef.current = requestAnimationFrame(draw);
        }
      } catch (error) {
        console.error('Canvas drawing error:', error);
        isAnimating = false; // Stop animation on error
      }
    };

    // Start the animation
    draw();

    return () => {
      isAnimating = false; // Fix: Properly stop animation
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [theme, colors, allSkills]); // Added allSkills to dependencies to ensure updates

  // Separate effect to handle tab changes and ensure radar visibility
  useEffect(() => {
    // Force a re-render of the canvas when switching back to radar tab
    if (activeTab === 'radar' && canvasRef.current) {
      const canvas = canvasRef.current;
      // Trigger a resize event to refresh the canvas
      const resizeEvent = new Event('resize');
      window.dispatchEvent(resizeEvent);
      
      // Ensure canvas is properly sized and visible
      setTimeout(() => {
        if (canvas) {
          canvas.width = canvas.offsetWidth * 2;
          canvas.height = canvas.offsetHeight * 2;
          const ctx = canvas.getContext('2d');
          ctx.scale(2, 2);
        }
      }, 100);
    }
  }, [activeTab]);

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
              onClick={() => setActiveTab(tab)}
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
                    backgroundColor: theme === 'dark' ? '#0a0a0a' : '#f8fafc'
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
                            whileInView={{ width: `${skill.level}%` }}
                            viewport={{ once: true }}
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
                <h4 className="text-xl font-bold mb-6 text-center" style={{ color: colors.primary }}>
                  📈 Skill Development Timeline
                </h4>
                <div className="space-y-4">
                  {[
                    { year: '2021', skills: ['JavaScript', 'HTML/CSS', 'Git'], level: 'Beginner' },
                    { year: '2022', skills: ['Python', 'React', 'Node.js'], level: 'Intermediate' },
                    { year: '2023', skills: ['Java', 'Next.js', 'C++'], level: 'Advanced' },
                    { year: '2024', skills: ['AWS', 'Docker', 'MongoDB'], level: 'Professional' }
                  ].map((period, index) => (
                    <motion.div
                      key={period.year}
                      initial={{ opacity: 0, x: -50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex items-center gap-4 p-4 rounded-lg glass-card"
                    >
                      <div className="text-2xl font-bold" style={{ color: colors.accent }}>
                        {period.year}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold mb-1" style={{ color: colors.text }}>
                          {period.level} Level
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {period.skills.map((skill) => (
                            <span
                              key={skill}
                              className="px-2 py-1 text-xs rounded-full"
                              style={{ 
                                backgroundColor: `${colors.primary}20`,
                                color: colors.primary,
                                border: `1px solid ${colors.primary}40`
                              }}
                            >
                              {skill}
                            </span>
                          ))}
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