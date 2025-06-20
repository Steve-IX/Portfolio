'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Github, Linkedin, Mail, ExternalLink, Globe } from "lucide-react";
import { useTheme } from '@/lib/ThemeContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LightModeBackground } from '@/components/LightModeBackground';
import { VisitCounter } from '@/components/VisitCounter';
import { Globe3D } from '@/components/Globe3D';
import { MusicPlayer } from '@/components/MusicPlayer';
import { ScrollProgress } from '@/components/ScrollProgress';
import { FloatingParticles } from '@/components/FloatingParticles';

import { AchievementsShowcase } from '@/components/AchievementsShowcase';
import { EnhancedContactForm } from '@/components/EnhancedContactForm';
import { InteractiveCodeEditor } from '@/components/InteractiveCodeEditor';
import { GitHubVisualizer } from '@/components/GitHubVisualizer';
import { NeuralNetworkVisualizer } from '@/components/NeuralNetworkVisualizer';
import { SkillsRadar3D } from '@/components/SkillsRadar3D';


// -----------------------------
//  SECTION COMPONENT
// -----------------------------
const Section = ({ id, title, children, direction = 'up' }) => {
  const { colors } = useTheme();

/** Motion variants helper */
const makeVariants = (dir = 'up', dist = 50) => {
  const prop = dir === 'up' || dir === 'down' ? 'y' : 'x';
  const from = (dir === 'up' || dir === 'left') ? dist : -dist;
  return {
    hidden: { opacity: 0, [prop]: from },
    show: {
      opacity: 1,
      [prop]: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };
  };

  return (
    <section id={id} className="min-h-screen flex items-center justify-center p-8">
      <motion.div
        className="max-w-4xl w-full"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={makeVariants(direction)}
      >
        <h2
          className="text-4xl md:text-5xl font-bold tracking-widest"
          style={{ color: colors.primary }}
        >
          {title}
        </h2>
        <div className="mt-6 border-t-4" style={{ borderColor: colors.primary }} />
        <div className="mt-8 space-y-6">
          {children}
        </div>
      </motion.div>
    </section>
  );
};

// Cosmic Background Component
const CosmicBackground = () => {
  const { colors } = useTheme();
  const [stars, setStars] = useState([]);
  const [shootingStars, setShootingStars] = useState([]);
  const [dustParticles, setDustParticles] = useState([]);
  
  // Generate random values only on client-side to prevent hydration mismatch
  useEffect(() => {
  // Generate random stars
    const generatedStars = Array.from({ length: 200 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 2,
  }));

  // Generate shooting stars
    const generatedShootingStars = Array.from({ length: 8 }).map((_, i) => ({
    id: i,
    startX: Math.random() * 100,
    startY: Math.random() * 50,
    duration: Math.random() * 2 + 1,
    delay: i * 3,
  }));

    // Generate dust particles
    const generatedDustParticles = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 2,
    }));

    setStars(generatedStars);
    setShootingStars(generatedShootingStars);
    setDustParticles(generatedDustParticles);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-b from-[#010b14] via-[#011627] to-black">
      {/* Static stars */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor: 'white',
          }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0.2, 1, 0.2],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
          }}
        />
      ))}

      {/* Shooting stars */}
      {shootingStars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute h-[1px] w-[50px] origin-left"
          style={{
            left: `${star.startX}%`,
            top: `${star.startY}%`,
            background: `linear-gradient(90deg, ${colors.primary}, transparent)`,
            transform: 'rotate(-45deg)',
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scaleX: [0, 1, 0],
            x: ['0%', '500%'],
            y: ['0%', '500%'],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
            ease: "linear",
          }}
        />
      ))}

      {/* Nebula effects */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: `
            radial-gradient(circle at 20% 30%, ${colors.primary}15 0%, transparent 40%),
            radial-gradient(circle at 80% 70%, ${colors.accent}15 0%, transparent 40%),
            radial-gradient(circle at 50% 50%, ${colors.primary}10 0%, transparent 60%)
          `,
        }}
      />

      {/* Cosmic dust particles */}
      {dustParticles.map((particle) => (
        <motion.div
          key={`dust-${particle.id}`}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: '2px',
            height: '2px',
            backgroundColor: colors.accent,
            opacity: 0.3,
          }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
          }}
        />
      ))}
    </div>
  );
};

// ----------------------------------
//  3D SPINNING GLOBE COMPONENT
// ----------------------------------
const SpinningGlobe = () => {
  return <Globe3D />;
};

// -----------------------------
//  NAVBAR COMPONENT
// -----------------------------
const links = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'code-playground', label: 'Code Lab' },
  { id: 'ai-showcase', label: 'AI Showcase' },
  { id: 'github-stats', label: 'GitHub' },
  { id: 'contact', label: 'Contact' },
];

const NavBar = () => {
  const [active, setActive] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, colors } = useTheme();
  
  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="fixed top-0 left-0 right-0 z-50 bg-opacity-70 backdrop-blur-lg"
      style={{ backgroundColor: colors.secondary }}
    >
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        {/* Desktop Navigation */}
        <ul className="hidden md:flex justify-center gap-6 py-4">
        {links.map(({ id, label }) => (
          <li key={id}>
            <a
                href={id === 'home' ? '#' : `#${id}`}
              onClick={() => setActive(id)}
              className="relative uppercase text-sm tracking-wider transition-all duration-300 hover:text-white"
                style={{ 
                  color: active === id ? colors.accent : theme === 'dark' ? '#ffffff' : colors.text
                }}
            >
              {label}
              {active === id && (
                <motion.span
                  layoutId="underline"
                  className="absolute -bottom-1 left-0 right-0 h-0.5"
                    style={{ backgroundColor: colors.accent }}
                />
              )}
            </a>
          </li>
        ))}
      </ul>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2"
            aria-label="Toggle menu"
          >
            <div className="w-6 flex flex-col gap-1.5">
              <span 
                className="block h-0.5 w-full transition-all duration-300"
                style={{ 
                  backgroundColor: colors.primary,
                  transform: isMenuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none'
                }}
              />
              <span 
                className="block h-0.5 transition-all duration-300"
                style={{ 
                  backgroundColor: colors.primary,
                  width: isMenuOpen ? '0%' : '100%',
                  opacity: isMenuOpen ? 0 : 1
                }}
              />
              <span 
                className="block h-0.5 w-full transition-all duration-300"
                style={{ 
                  backgroundColor: colors.primary,
                  transform: isMenuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none'
                }}
              />
            </div>
          </button>
        </div>

        {/* Theme Toggle */}
        <ThemeToggle />
      </div>

      {/* Mobile Menu Dropdown */}
      <motion.div
        initial={false}
        animate={{ 
          height: isMenuOpen ? 'auto' : 0,
          opacity: isMenuOpen ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
        className="md:hidden overflow-hidden"
        style={{ backgroundColor: theme === 'dark' ? 'rgba(1, 22, 39, 0.95)' : 'rgba(255, 255, 255, 0.95)' }}
      >
        {isMenuOpen && (
          <ul className="flex flex-col py-4 px-6 space-y-4">
            {links.map(({ id, label }) => (
              <li key={id}>
                <a
                  href={id === 'home' ? '#' : `#${id}`}
                  onClick={() => {
                    setActive(id);
                    setIsMenuOpen(false);
                  }}
                  className="block py-2 uppercase text-sm tracking-wider transition-all duration-300"
                  style={{ 
                    color: active === id ? colors.accent : theme === 'dark' ? '#ffffff' : colors.text
                  }}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </motion.div>
    </motion.nav>
  );
};

// -----------------------------
//  DATA
// -----------------------------
const experiences = [
  {
    company: 'Labelbox',
    role: 'Software Engineer',
    period: 'Jun 2024 – Present',
    image: '/images/Labelbox_Logo.png',
    bullets: [
      'Design and develop robust systems that accelerate AI model development.',
      'Created high‑performance data‑labelling tools, improving accuracy & efficiency.',
      'Optimised the codebase, cutting load times by 50% and supporting 10k+ daily users.',
    ],
  },
  {
    company: 'Outlier AI',
    role: 'AI Trainer',
    period: 'Jul 2024 – Mar 2025',
    image: '/images/outlier_logo.png',
    bullets: [
      'Refined large‑language‑model datasets and annotation tasks to boost prediction accuracy.',
      'Analysed and curated large‑scale datasets for high‑fidelity fine‑tuning.',
    ],
  },
  {
    company: 'Lancaster University',
    role: 'Software Engineering Intern',
    period: 'Jun 2024 – Aug 2024',
    image: '/images/Lancaster_uni.png',
    bullets: [
      'Developed web apps using modern JavaScript, focusing on performance and UX.',
      'Refactored asynchronous code, halving load times for 10k‑user applications.',
    ],
  },
  {
    company: 'Specsavers',
    role: 'Optical Assistant',
    period: 'Sep 2023 – May 2025',
    image: '/images/specsavers.png',
    bullets: [
      'Provided front‑line customer service and pre‑examination support in high‑volume settings.',
    ],
  },
  {
    company: 'Boots Opticians',
    role: 'Optical Consultant',
    period: 'Aug 2022 – Aug 2024',
    image: '/images/Boots_Opticians.png',
    bullets: [
      'Advised patients on eyewear, performing quality pre‑exam tests and building rapport.',
    ],
  },
];

const projects = [
  {
    title: '3D Physics Simulation',
    period: '2022',
    description:
      'Built a C++ / Python VPython simulation modelling gravity, collisions, and vector dynamics in a confined 3D space.',
    link: 'https://github.com/Steve-IX/Simulations',
    tech: ['C++', 'Python', 'VPython', 'Physics'],
  },
  {
    title: 'BBC-micro-bit-Timers-Software-Serial-Demo',
    period: '2023',
    description:
      'A bare-metal implementation exploring timers and software serial communication on the BBC micro:bit without using high-level CODAL helpers or interrupts.',
    link: 'https://github.com/Steve-IX/BBC-micro-bit-Timers-Software-Serial-Demo',
    tech: ['C++', 'Embedded Systems', 'nRF52'],
  },
  {
    title: 'HOG-Harris-Corner-Detection',
    period: '2023',
    description:
      'A MATLAB implementation of HOG and Harris Corner Detection algorithms from scratch, with analysis of their robustness in feature extraction.',
    link: 'https://github.com/Steve-IX/HOG-Harris-Corner-Detection',
    tech: ['MATLAB', 'Computer Vision', 'Feature Detection'],
  },
  {
    title: 'Interrupts-and-displays',
    period: '2023',
    description:
      'A C++ implementation that transforms a BBC micro:bit into a dual-display, real-time data logger using interrupt-driven programming.',
    link: 'https://github.com/Steve-IX/Interrupts-and-displays',
    tech: ['C++', 'Embedded Systems', 'Interrupts'],
  },
  {
    title: 'Genetic-Algorithms',
    period: '2023',
    description:
      'GA-PathPlanner: A MATLAB project that finds collision-free, near-shortest paths for a point-robot using genetic algorithms on a 500×500 binary map.',
    link: 'https://github.com/Steve-IX/Genetic-Algorithms',
    tech: ['MATLAB', 'Genetic Algorithms', 'Path Planning'],
  },
  {
    title: 'Quantum Computing for Combinatorial Optimisation',
    period: 'Oct 2024 – Present',
    description:
      'Dissertation exploring QAOA & Grover\'s algorithm via Qiskit / Cirq, benchmarking against classical heuristics.',
    link: 'https://github.com/Steve-IX/Exploring-Quantum-Algorithms-for-Combinatorial-Optimization',
    tech: ['Python', 'Quantum Computing', 'Qiskit'],
  },
];

// Organized skill categories
const skillCategories = {
  languages: [
    'C++', 'Python', 'Java', 'JavaScript', 'TypeScript', 'C', 'SQL', 
    'HTML', 'CSS', 'PHP', 'Assembly', 'MATLAB'
  ],
  frameworks: [
    'React', 'Next.js', 'Node.js', 'Express', 'Django', 'Flask', 
    'Boost Libraries', 'Tailwind CSS', 'Framer Motion', 'Qiskit'
  ],
  tools: [
    'Git', 'Docker', 'AWS', 'Vercel', 'VS Code', 'Jupyter', 
    'Linux', 'Windows', 'PostgreSQL', 'MongoDB', 'Excel'
  ]
};

// -----------------------------
//  MAIN COMPONENT
// -----------------------------
export default function Portfolio() {
  const { theme, colors } = useTheme();
  
  return (
    <>
      <div 
        className="font-sans transition-colors duration-300" 
        style={{ 
          backgroundColor: colors.background,
          color: colors.text
        }}
      >
          <ScrollProgress />
          <FloatingParticles count={30} />
          <NavBar />
          <VisitCounter />
          <MusicPlayer />

      {/* HERO */}
      <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Background based on theme */}
        {theme === 'dark' ? <CosmicBackground /> : <LightModeBackground />}
        {/* Subtle Spinning Globe */}
        <SpinningGlobe />
        
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center p-8 relative z-10 pointer-events-none"
        >
          <motion.h1 
            className="text-5xl md:text-7xl font-extrabold tracking-wider gradient-text float" 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1, delay: 0.5, type: "spring", stiffness: 100 }}
          >
            Stephen Addo
          </motion.h1>
          <motion.div 
            className="mt-6 text-xl md:text-2xl max-w-2xl mx-auto relative z-10 text-center"
            style={{ color: colors.text }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            <div className="typing-animation">
              Software Engineer · AI & Quantum‑Computing Enthusiast
            </div>
            <div className="mt-2 text-lg md:text-xl" style={{ color: colors.primary }}>
              Final‑Year CS @ Lancaster University
            </div>
          </motion.div>
          <motion.div 
            className="mt-8 flex justify-center gap-4 relative z-10 pointer-events-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.6 }}
          >
            <Button 
              asChild 
              size="lg" 
              className="btn-enhanced magnetic"
              style={{ 
                background: `linear-gradient(135deg, ${colors.accent}, ${colors.primary})`,
                color: '#ffffff',
                boxShadow: `0 8px 32px ${colors.accent}40`
              }}
            >
              <a href="#contact">Get in Touch</a>
            </Button>
            <Button 
              asChild 
              variant="outline" 
              size="lg" 
              className="btn-enhanced magnetic glass-card"
              style={{ 
                borderColor: colors.primary,
                color: colors.primary,
                backgroundColor: theme === 'dark' ? `${colors.primary}15` : 'rgba(255,255,255,0.2)'
              }}
            >
              <a href="#projects">View Work</a>
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* ABOUT */}
      <Section id="about" title="About" direction="left">
        <div className="space-y-6">
          <p className="text-lg leading-relaxed">
            I'm a <span className="font-bold" style={{ color: colors.accent }}>passionate Software Engineer</span> and 
            final-year Computer Science student at Lancaster University, maintaining a first-class honors trajectory and 
            graduating in July 2025. Currently, I'm pushing the boundaries of AI development at <span className="font-semibold" style={{ color: colors.primary }}>Labelbox</span>, 
            where I architect high-performance data labeling systems that serve over 10,000 daily users and accelerate machine learning workflows.
          </p>
          <p className="text-lg leading-relaxed">
            My journey spans from <span className="font-semibold" style={{ color: colors.accent }}>low-level embedded systems</span> programming 
            on BBC micro:bits to exploring the cutting-edge frontiers of <span className="font-semibold" style={{ color: colors.primary }}>quantum computing</span> through 
            my dissertation research. I've solved 63 algorithmic challenges on LeetCode, refined large-language models at Outlier AI, 
            and built everything from 3D physics simulations to genetic algorithm pathfinders. Whether I'm optimizing C++ performance, 
            implementing quantum algorithms with Qiskit, or crafting seamless user experiences with React, I thrive on transforming 
            complex problems into elegant, scalable solutions.
          </p>
          <p className="text-lg leading-relaxed">
            Beyond the code, I'm driven by the intersection of <span className="font-semibold" style={{ color: colors.accent }}>artificial intelligence</span> and 
            <span className="font-semibold" style={{ color: colors.primary }}> quantum computing</span>—exploring how these revolutionary technologies 
            can reshape our digital future. I'm always eager to collaborate on challenging projects that push technological boundaries.
          </p>
        </div>
      </Section>

      {/* ACHIEVEMENTS */}
      <Section id="achievements" title="Achievements" direction="right">
        <AchievementsShowcase />
      </Section>

      {/* EXPERIENCE */}
      <Section id="experience" title="Experience" direction="right">
        <div className="space-y-6">
          {experiences.map(({ company, role, period, bullets, image }) => (
            <Card 
              key={company} 
              className="enhanced-card transition-all duration-300 hover:scale-[1.02] cursor-pointer group magnetic glass-card"
              style={{ 
                backgroundColor: theme === 'dark' ? `${colors.primary}1A` : colors.cardBg,
                boxShadow: theme === 'dark' ? `0 10px 40px ${colors.primary}20` : '0 4px 6px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.1)',
                borderColor: theme === 'dark' ? `${colors.accent}30` : '#e2e8f0'
              }}
            >
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div 
                      className="w-16 h-16 rounded-lg p-2 flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                      style={{ 
                        backgroundColor: theme === 'dark' ? 'white' : '#f8fafc' 
                      }}
                    >
                      <img 
                        src={image} 
                        alt={`${company} logo`}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 
                      className="text-2xl font-semibold transition-colors duration-300"
                      style={{ color: theme === 'dark' ? '#ffffff' : colors.text }}
                    >
                      {company}
                    </h3>
                    <p 
                      className="text-sm uppercase tracking-wider mt-1" 
                      style={{ color: colors.accent }}
                    >
                      {role} · {period}
                    </p>
                  </div>
                </div>
                <ul 
                  className="list-disc list-inside text-base leading-relaxed space-y-2 ml-20"
                >
                  {bullets.map((b, i) => (
                    <li 
                      key={i} 
                      className="transition-colors duration-300"
                      style={{ 
                        color: theme === 'dark' ? '#d1d5db' : colors.text
                      }}
                    >
                      {b}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {/* PROJECTS */}
      <Section id="projects" title="Projects" direction="up">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map(({ title, description, period, link, tech }) => (
            <Card 
              key={title} 
              className="enhanced-card transition-all duration-300 hover:scale-[1.02] cursor-pointer magnetic glass-card"
              style={{ 
                backgroundColor: theme === 'dark' ? `${colors.primary}1A` : colors.cardBg,
                boxShadow: theme === 'dark' ? `0 10px 40px ${colors.primary}20` : '0 4px 6px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.1)',
                borderColor: theme === 'dark' ? `${colors.accent}30` : '#e2e8f0'
              }}
              onClick={() => link !== '#' && window.open(link, '_blank')}
            >
              <CardContent className="p-6 space-y-4">
                <h4 
                  className="text-xl font-semibold transition-colors duration-300"
                  style={{ color: theme === 'dark' ? '#ffffff' : colors.text }}
                >
                  {title}
                </h4>
                <p className="text-xs uppercase tracking-wider" style={{ color: colors.primary }}>
                  {period}
                </p>
                <p className="transition-colors duration-300" style={{ color: theme === 'dark' ? '#d1d5db' : colors.muted }}>
                  {description}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {tech.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-1 text-xs rounded-full"
                      style={{ 
                        backgroundColor: theme === 'dark' ? `${colors.accent}20` : `${colors.accent}15`,
                        color: colors.accent,
                        border: `1px solid ${colors.accent}40`
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
                  <Button 
                    asChild 
                    variant="outline" 
                    size="sm" 
                    className="mt-4 hover:scale-105 transition-transform"
                  style={{ 
                    borderColor: colors.accent,
                    color: colors.accent,
                    opacity: link === '#' ? 0.5 : 1,
                    pointerEvents: link === '#' ? 'none' : 'auto'
                  }}
                    onClick={(e) => {
                      e.stopPropagation();
                    if (link !== '#') {
                      window.open(link, '_blank');
                    }
                    }}
                  >
                    <a href={link} target="_blank" rel="noreferrer">
                    {link === '#' ? 'Coming Soon' : 'View Project'} {link !== '#' && <ExternalLink className="ml-2 h-4 w-4" />}
                    </a>
                  </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {/* SKILLS */}
      <Section id="skills" title="Skills" direction="left">
        <div className="space-y-8">
          {Object.entries(skillCategories).map(([category, skillList]) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="group"
            >
              <h3 
                className="text-2xl font-bold mb-4 uppercase tracking-wider flex items-center gap-3"
                style={{ color: colors.primary }}
              >
                <span 
                  className="w-8 h-0.5 bg-current transform group-hover:w-12 transition-all duration-300"
                  style={{ backgroundColor: colors.accent }}
                />
                {category}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {skillList.map((skill, index) => (
                  <motion.div
                    key={skill}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="relative group/skill"
                  >
                    <div
                      className="px-4 py-3 rounded-lg text-center font-medium text-sm transition-all duration-300 cursor-pointer backdrop-blur-sm border border-opacity-30 hover:border-opacity-60 group-hover/skill:shadow-lg magnetic glass-card"
                      style={{ 
                        backgroundColor: theme === 'dark' ? `${colors.primary}15` : `${colors.primary}10`,
                        borderColor: colors.accent,
                        color: theme === 'dark' ? 'white' : colors.text,
                        boxShadow: `0 4px 20px ${colors.accent}20`
                      }}
                    >
                      <span className="relative z-10">{skill}</span>
                      <div 
                        className="absolute inset-0 rounded-lg opacity-0 group-hover/skill:opacity-20 transition-opacity duration-300"
                        style={{ backgroundColor: colors.accent }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* CODE PLAYGROUND */}
      <Section id="code-playground" title="Interactive Code Lab" direction="up">
        <InteractiveCodeEditor />
      </Section>

      {/* AI SHOWCASE */}
      <Section id="ai-showcase" title="AI & Neural Networks" direction="left">
        <div className="space-y-16">
          <NeuralNetworkVisualizer />
          <SkillsRadar3D />
        </div>
      </Section>

      {/* GITHUB STATS */}
      <Section id="github-stats" title="GitHub Analytics" direction="right">
        <GitHubVisualizer />
      </Section>

      {/* CONTACT */}
      <Section id="contact" title="Contact" direction="down">
        <EnhancedContactForm />
        <div className="mt-12 text-center">
          <p className="mb-6 text-lg">Or connect with me on social platforms:</p>
          <div className="flex gap-6 justify-center">
            <motion.a 
              href="mailto:a.stephenyeboah04@gmail.com" 
              aria-label="Email" 
              className="magnetic pulse-glow"
              style={{ color: colors.primary }}
              whileHover={{ scale: 1.2, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              <Mail size={32} />
            </motion.a>
            <motion.a 
              href="https://github.com/Steve-IX" 
              target="_blank" 
              rel="noreferrer" 
              aria-label="GitHub" 
              className="magnetic pulse-glow"
              style={{ color: colors.primary }}
              whileHover={{ scale: 1.2, rotate: -5 }}
              whileTap={{ scale: 0.9 }}
            >
              <Github size={32} />
            </motion.a>
            <motion.a 
              href="https://linkedin.com/in/stephen-addo-568b43215" 
              target="_blank" 
              rel="noreferrer" 
              aria-label="LinkedIn" 
              className="magnetic pulse-glow"
              style={{ color: colors.primary }}
              whileHover={{ scale: 1.2, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              <Linkedin size={32} />
            </motion.a>
            <motion.a 
              href="https://leetcode.com/u/SteveIX/" 
              target="_blank" 
              rel="noreferrer" 
              aria-label="LeetCode" 
              className="magnetic pulse-glow"
              style={{ color: colors.primary }}
              whileHover={{ scale: 1.2, rotate: -5 }}
              whileTap={{ scale: 0.9 }}
            >
              <ExternalLink size={32} />
            </motion.a>
          </div>
        </div>
      </Section>

          {/* FOOTER */}
          <footer 
            className="py-6 text-center text-sm backdrop-blur glass-card"
            style={{ 
              backgroundColor: theme === 'dark' ? 'rgba(0,0,0,0.2)' : 'rgba(240,245,250,0.8)',
              color: theme === 'dark' ? '#a0aec0' : colors.muted
            }}
          >
            © {new Date().getFullYear()} Stephen Addo · Built with ❤️ Next.js & Modern Tech · 🚀 Interactive Code Lab · 🧠 Neural Networks · 📊 3D Visualizations · ✨ Enhanced Animations · v3.0
          </footer>
        </div>
    </>
  );
} 