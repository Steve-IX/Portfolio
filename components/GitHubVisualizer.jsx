'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, TrendingUp, Star, GitBranch, Code, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useTheme } from '@/lib/ThemeContext';

export const GitHubVisualizer = () => {
  const { theme, colors } = useTheme();
  const [activeTab, setActiveTab] = useState('contributions');
  const [animationKey, setAnimationKey] = useState(0);

  // Simulated GitHub data (in a real app, you'd fetch this from GitHub API)
  const githubData = {
    profile: {
      repos: 24,
      stars: 127,
      followers: 89,
      contributions: 1247
    },
    languages: [
      { name: 'JavaScript', percentage: 35.2, color: '#f1e05a' },
      { name: 'Python', percentage: 28.7, color: '#3572A5' },
      { name: 'C++', percentage: 18.3, color: '#f34b7d' },
      { name: 'TypeScript', percentage: 10.1, color: '#2b7489' },
      { name: 'Java', percentage: 4.8, color: '#b07219' },
      { name: 'MATLAB', percentage: 2.9, color: '#e16737' }
    ],
    recentActivity: [
      { type: 'push', repo: 'Portfolio', time: '2 hours ago', commits: 3 },
      { type: 'star', repo: 'awesome-quantum-computing', time: '1 day ago' },
      { type: 'fork', repo: 'react-three-fiber', time: '2 days ago' },
      { type: 'push', repo: 'Quantum-Algorithms', time: '3 days ago', commits: 5 },
      { type: 'create', repo: 'AI-Training-Pipeline', time: '1 week ago' }
    ]
  };

  // Generate contribution graph data (52 weeks)
  const generateContributions = () => {
    const weeks = [];
    for (let week = 0; week < 53; week++) {
      const days = [];
      for (let day = 0; day < 7; day++) {
        const contributions = Math.floor(Math.random() * 8);
        days.push({
          contributions,
          date: new Date(2024, 0, week * 7 + day + 1),
          intensity: contributions === 0 ? 0 : Math.min(Math.floor(contributions / 2) + 1, 4)
        });
      }
      weeks.push(days);
    }
    return weeks;
  };

  const [contributions] = useState(generateContributions());

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationKey(prev => prev + 1);
    }, 5000); // Restart animations every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const getContributionColor = (intensity) => {
    const baseColors = {
      0: theme === 'dark' ? '#161b22' : '#ebedf0',
      1: '#0e4429',
      2: '#006d32',
      3: '#26a641',
      4: '#39d353'
    };
    return baseColors[intensity] || baseColors[0];
  };

  const tabs = [
    { id: 'contributions', label: 'Contributions', icon: Calendar },
    { id: 'languages', label: 'Languages', icon: Code },
    { id: 'activity', label: 'Activity', icon: TrendingUp }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="max-w-6xl mx-auto"
    >
      <h3 className="text-4xl font-bold mb-4 gradient-text text-center">
        📊 GitHub Stats
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Repositories', value: githubData.profile.repos, icon: GitBranch },
          { label: 'Stars', value: githubData.profile.stars, icon: Star },
          { label: 'Followers', value: githubData.profile.followers, icon: Github },
          { label: 'Contributions', value: githubData.profile.contributions, icon: TrendingUp }
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <Card className="glass-card text-center p-4">
                <CardContent className="p-0">
                  <Icon size={24} style={{ color: colors.accent }} className="mx-auto mb-2" />
                  <div className="text-2xl font-bold" style={{ color: colors.primary }}>
                    {stat.value}
                  </div>
                  <div className="text-sm" style={{ color: colors.text }}>
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}; 