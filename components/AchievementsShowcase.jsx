'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Target, Zap, Code, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useTheme } from '@/lib/ThemeContext';

export const AchievementsShowcase = () => {
  const { theme, colors } = useTheme();
  const [counts, setCounts] = useState({});

  const achievements = [
    {
      icon: Code,
      title: 'LeetCode Problems',
      value: 63,
      suffix: '',
      description: 'Algorithmic challenges solved',
      color: '#FF6B6B'
    },
    {
      icon: Users,
      title: 'Daily Users Served',
      value: 10000,
      suffix: '+',
      description: 'Through Labelbox systems',
      color: '#4ECDC4'
    },
    {
      icon: Zap,
      title: 'Performance Boost',
      value: 50,
      suffix: '%',
      description: 'Load time optimization',
      color: '#45B7D1'
    },
    {
      icon: Target,
      title: 'First Class',
      value: 1,
      suffix: '',
      description: 'Honors trajectory maintained',
      color: '#96CEB4'
    },
    {
      icon: Trophy,
      title: 'Years Experience',
      value: 3,
      suffix: '+',
      description: 'Professional development',
      color: '#FFEAA7'
    },
    {
      icon: Star,
      title: 'Projects Completed',
      value: 15,
      suffix: '+',
      description: 'Personal & professional',
      color: '#DDA0DD'
    }
  ];

  const testimonials = [
    {
      quote: "An exceptional developer with a keen eye for optimization and user experience.",
      author: "Tech Lead",
      company: "Labelbox",
      rating: 5
    },
    {
      quote: "Consistently delivers high-quality solutions that exceed expectations.",
      author: "Project Manager",
      company: "Lancaster University",
      rating: 5
    },
    {
      quote: "Shows remarkable problem-solving skills and attention to detail.",
      author: "Senior Developer",
      company: "Development Team",
      rating: 5
    }
  ];

  // Animated counter effect
  useEffect(() => {
    const animateCount = (target, key) => {
      let start = 0;
      const increment = target / 50;
      const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
          setCounts(prev => ({ ...prev, [key]: target }));
          clearInterval(timer);
        } else {
          setCounts(prev => ({ ...prev, [key]: Math.floor(start) }));
        }
      }, 40);
    };

    achievements.forEach((achievement, index) => {
      setTimeout(() => animateCount(achievement.value, index), index * 200);
    });
  }, []);

  return (
    <div className="space-y-12">
      {/* Achievements Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {achievements.map((achievement, index) => {
          const Icon = achievement.icon;
          return (
            <motion.div
              key={achievement.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="group"
            >
              <Card 
                className="enhanced-card text-center p-6 h-full"
                style={{ 
                  backgroundColor: theme === 'dark' ? `${colors.primary}15` : 'rgba(255,255,255,0.8)',
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${achievement.color}30`
                }}
              >
                <CardContent className="p-0 space-y-4">
                  <motion.div
                    className="w-16 h-16 mx-auto rounded-full flex items-center justify-center group-hover:pulse-glow"
                    style={{ 
                      background: `linear-gradient(135deg, ${achievement.color}20, ${achievement.color}40)`,
                      border: `2px solid ${achievement.color}60`
                    }}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Icon 
                      size={28} 
                      style={{ color: achievement.color }}
                    />
                  </motion.div>
                  
                  <div>
                    <motion.h3 
                      className="text-3xl md:text-4xl font-bold"
                      style={{ color: achievement.color }}
                    >
                      {counts[index] || 0}{achievement.suffix}
                    </motion.h3>
                    <h4 
                      className="font-semibold text-sm uppercase tracking-wider mt-2"
                      style={{ color: colors.primary }}
                    >
                      {achievement.title}
                    </h4>
                    <p 
                      className="text-xs mt-1"
                      style={{ color: theme === 'dark' ? '#a0aec0' : colors.muted }}
                    >
                      {achievement.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Testimonials Carousel */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mt-16"
      >
        <h3 
          className="text-3xl font-bold text-center mb-8"
          style={{ color: colors.primary }}
        >
          What People Say
        </h3>
        
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              whileHover={{ y: -5 }}
            >
              <Card 
                className="glass-card p-6 h-full"
                style={{ 
                  backgroundColor: theme === 'dark' ? `${colors.accent}10` : 'rgba(255,255,255,0.9)',
                  border: `1px solid ${colors.accent}30`
                }}
              >
                <CardContent className="p-0 space-y-4">
                  {/* Rating Stars */}
                  <div className="flex justify-center space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.2 + i * 0.1 }}
                      >
                        <Star 
                          size={16} 
                          fill={colors.accent}
                          style={{ color: colors.accent }}
                        />
                      </motion.div>
                    ))}
                  </div>
                  
                  <blockquote 
                    className="text-center italic text-sm leading-relaxed"
                    style={{ color: theme === 'dark' ? '#d1d5db' : colors.text }}
                  >
                    "{testimonial.quote}"
                  </blockquote>
                  
                  <div className="text-center">
                    <p 
                      className="font-semibold text-sm"
                      style={{ color: colors.primary }}
                    >
                      {testimonial.author}
                    </p>
                    <p 
                      className="text-xs"
                      style={{ color: colors.accent }}
                    >
                      {testimonial.company}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}; 