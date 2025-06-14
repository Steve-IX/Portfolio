'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Github, Linkedin, Mail, ExternalLink } from "lucide-react";

// -----------------------------
//  THEME CONSTANTS
// -----------------------------
const P3_COLORS = {
  primary: "#4d9de0",   // light blue
  secondary: "#011627", // deep navy
  accent: "#2ec4b6",    // teal accent
  danger: "#ff3366",    // pink highlight
};

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

// Animated Grid Background Component
const AnimatedGridBackground = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePosition({ x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)) });
  };

  return (
    <div 
      className="absolute inset-0 overflow-hidden"
      onMouseMove={handleMouseMove}
      style={{ pointerEvents: 'auto' }}
    >
      <div className="absolute inset-0">
        {/* Generate grid dots */}
        {Array.from({ length: 300 }).map((_, i) => {
          const x = (i % 25) * 4; // 25 columns, 4% spacing
          const y = Math.floor(i / 25) * 8.33; // 12 rows, ~8.33% spacing
          
          // Calculate distance from mouse for morphing effect
          const distanceFromMouse = Math.sqrt(
            Math.pow((x / 100) - mousePosition.x, 2) + 
            Math.pow((y / 100) - mousePosition.y, 2)
          );
          
          // More responsive scaling and opacity
          const scale = Math.max(0.5, Math.min(3, 1 + (1 - distanceFromMouse) * 2));
          const opacity = Math.max(0.2, Math.min(1, 0.4 + (1 - distanceFromMouse) * 0.6));
          
          return (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                backgroundColor: P3_COLORS.accent,
              }}
              animate={{
                scale: scale,
                opacity: opacity,
              }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 25,
                duration: 0.2
              }}
            />
          );
        })}
        
        {/* Connecting lines that respond to mouse */}
        <svg className="absolute inset-0 w-full h-full">
          {/* Horizontal lines */}
          {Array.from({ length: 300 }).map((_, i) => {
            const x1 = (i % 25) * 4;
            const y1 = Math.floor(i / 25) * 8.33;
            const x2 = ((i + 1) % 25) * 4;
            const y2 = Math.floor((i + 1) / 25) * 8.33;
            
            if ((i + 1) % 25 === 0) return null; // Skip end of rows
            
            const midX = (x1 + x2) / 200; // Convert to 0-1 range
            const midY = (y1 + y2) / 200;
            
            const distanceFromMouse = Math.sqrt(
              Math.pow(midX - mousePosition.x, 2) + 
              Math.pow(midY - mousePosition.y, 2)
            );
            
            const lineOpacity = Math.max(0.1, Math.min(0.8, 0.2 + (1 - distanceFromMouse) * 0.6));
            const strokeWidth = Math.max(0.5, Math.min(2, 0.5 + (1 - distanceFromMouse) * 1.5));
            
            return (
              <motion.line
                key={`h-${i}`}
                x1={`${x1}%`}
                y1={`${y1}%`}
                x2={`${x2}%`}
                y2={`${y1}%`}
                stroke={P3_COLORS.primary}
                animate={{
                  opacity: lineOpacity,
                  strokeWidth: strokeWidth,
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                  duration: 0.2
                }}
              />
            );
          })}
          
          {/* Vertical lines */}
          {Array.from({ length: 275 }).map((_, i) => {
            const x1 = (i % 25) * 4;
            const y1 = Math.floor(i / 25) * 8.33;
            const y2 = Math.floor((i + 25) / 25) * 8.33;
            
            if (Math.floor(i / 25) >= 11) return null; // Skip bottom row
            
            const midX = x1 / 100;
            const midY = (y1 + y2) / 200;
            
            const distanceFromMouse = Math.sqrt(
              Math.pow(midX - mousePosition.x, 2) + 
              Math.pow(midY - mousePosition.y, 2)
            );
            
            const lineOpacity = Math.max(0.1, Math.min(0.8, 0.2 + (1 - distanceFromMouse) * 0.6));
            const strokeWidth = Math.max(0.5, Math.min(2, 0.5 + (1 - distanceFromMouse) * 1.5));
            
            return (
              <motion.line
                key={`v-${i}`}
                x1={`${x1}%`}
                y1={`${y1}%`}
                x2={`${x1}%`}
                y2={`${y2}%`}
                stroke={P3_COLORS.primary}
                animate={{
                  opacity: lineOpacity,
                  strokeWidth: strokeWidth,
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                  duration: 0.2
                }}
              />
            );
          })}
        </svg>
        
        {/* Floating particles that follow mouse */}
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-2 h-2 rounded-full"
            style={{
              backgroundColor: P3_COLORS.accent,
              opacity: 0.6,
              boxShadow: `0 0 10px ${P3_COLORS.accent}50`,
            }}
            animate={{
              left: `${mousePosition.x * 90 + (i * 6)}%`,
              top: `${mousePosition.y * 85 + (i * 4)}%`,
              scale: [1, 1.3, 1],
            }}
            transition={{
              left: { duration: 1.2 + i * 0.1, ease: "easeOut" },
              top: { duration: 1.2 + i * 0.1, ease: "easeOut" },
              scale: {
                duration: 1.8 + i * 0.2,
                repeat: Infinity,
                repeatType: "reverse",
              },
            }}
          />
        ))}
        
        {/* Cursor glow effect */}
        <motion.div
          className="absolute w-32 h-32 rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${P3_COLORS.accent}25 0%, ${P3_COLORS.primary}15 30%, transparent 70%)`,
            filter: 'blur(15px)',
          }}
          animate={{
            left: `${mousePosition.x * 100}%`,
            top: `${mousePosition.y * 100}%`,
            transform: 'translate(-50%, -50%)',
          }}
          transition={{
            type: "spring",
            stiffness: 150,
            damping: 20,
            duration: 0.4
          }}
        />
      </div>
    </div>
  );
};

// -----------------------------
//  SECTION COMPONENT
// -----------------------------
const Section = ({ id, title, children, direction = 'up' }) => (
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
        style={{ color: P3_COLORS.primary }}
      >
        {title}
      </h2>
      <div className="mt-6 border-t-4" style={{ borderColor: P3_COLORS.primary }} />
      <div className="mt-8 space-y-6">
        {children}
      </div>
    </motion.div>
  </section>
);

// -----------------------------
//  NAVBAR COMPONENT
// -----------------------------
const links = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
];

const NavBar = () => {
  const [active, setActive] = useState('about');
  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="fixed top-0 left-0 right-0 z-50 bg-opacity-70 backdrop-blur-lg"
      style={{ backgroundColor: P3_COLORS.secondary }}
    >
      <ul className="flex justify-center gap-6 py-4">
        {links.map(({ id, label }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              onClick={() => setActive(id)}
              className="relative uppercase text-sm tracking-wider transition-all duration-300 hover:text-white"
              style={{ color: active === id ? P3_COLORS.accent : '#ffffff' }}
            >
              {label}
              {active === id && (
                <motion.span
                  layoutId="underline"
                  className="absolute -bottom-1 left-0 right-0 h-0.5"
                  style={{ backgroundColor: P3_COLORS.accent }}
                />
              )}
            </a>
          </li>
        ))}
      </ul>
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
    link: '#',
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
    link: '#',
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
  return (
    <div className="font-sans text-white" style={{ backgroundColor: P3_COLORS.secondary }}>
      <NavBar />

      {/* HERO */}
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-transparent to-black relative overflow-hidden">
        {/* Animated Grid Background */}
        <AnimatedGridBackground />
        
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center p-8 relative z-10 pointer-events-none"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-wider relative" style={{ color: P3_COLORS.primary }}>
            Stephen Addo
            {/* Subtle glow effect */}
            <div 
              className="absolute inset-0 blur-3xl opacity-20 -z-10"
              style={{ 
                background: `linear-gradient(45deg, ${P3_COLORS.primary}, ${P3_COLORS.accent})`,
              }}
            />
          </h1>
          <p className="mt-4 text-xl md:text-2xl max-w-2xl mx-auto relative z-10">
            Software Engineer · AI & Quantum‑Computing Enthusiast · Final‑Year CS @ Lancaster University
          </p>
          <div className="mt-8 flex justify-center gap-4 relative z-10 pointer-events-auto">
            <Button asChild size="lg" style={{ backgroundColor: P3_COLORS.accent }}>
              <a href="#contact">Get in Touch</a>
            </Button>
            <Button asChild variant="outline" size="lg" style={{ borderColor: P3_COLORS.primary }}>
              <a href="#projects">View Work</a>
            </Button>
          </div>
        </motion.div>
        
        {/* Enhanced background overlay */}
        <div className="absolute inset-0 bg-[url('/stripes.svg')] opacity-3" />
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            background: `radial-gradient(circle at 30% 50%, ${P3_COLORS.primary}20 0%, transparent 50%)`,
          }}
        />
      </section>

      {/* ABOUT */}
      <Section id="about" title="About" direction="left">
        <div className="space-y-6">
          <p className="text-lg leading-relaxed">
            I'm a <span className="font-bold" style={{ color: P3_COLORS.accent }}>passionate Software Engineer</span> and 
            final-year Computer Science student at Lancaster University, maintaining a first-class honors trajectory and 
            graduating in July 2025. Currently, I'm pushing the boundaries of AI development at <span className="font-semibold" style={{ color: P3_COLORS.primary }}>Labelbox</span>, 
            where I architect high-performance data labeling systems that serve over 10,000 daily users and accelerate machine learning workflows.
          </p>
          <p className="text-lg leading-relaxed">
            My journey spans from <span className="font-semibold" style={{ color: P3_COLORS.accent }}>low-level embedded systems</span> programming 
            on BBC micro:bits to exploring the cutting-edge frontiers of <span className="font-semibold" style={{ color: P3_COLORS.primary }}>quantum computing</span> through 
            my dissertation research. I've solved 700+ algorithmic challenges on LeetCode, refined large-language models at Outlier AI, 
            and built everything from 3D physics simulations to genetic algorithm pathfinders. Whether I'm optimizing C++ performance, 
            implementing quantum algorithms with Qiskit, or crafting seamless user experiences with React, I thrive on transforming 
            complex problems into elegant, scalable solutions.
          </p>
          <p className="text-lg leading-relaxed">
            Beyond the code, I'm driven by the intersection of <span className="font-semibold" style={{ color: P3_COLORS.accent }}>artificial intelligence</span> and 
            <span className="font-semibold" style={{ color: P3_COLORS.primary }}> quantum computing</span>—exploring how these revolutionary technologies 
            can reshape our digital future. I'm always eager to collaborate on challenging projects that push technological boundaries.
          </p>
        </div>
      </Section>

      {/* EXPERIENCE */}
      <Section id="experience" title="Experience" direction="right">
        <div className="space-y-6">
          {experiences.map(({ company, role, period, bullets, image }) => (
            <Card 
              key={company} 
              className="bg-opacity-10 hover:bg-opacity-20 transition-all duration-300 hover:scale-[1.02] cursor-pointer group"
              style={{ backgroundColor: P3_COLORS.primary }}
            >
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-white rounded-lg p-2 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <img 
                        src={image} 
                        alt={`${company} logo`}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold group-hover:text-white transition-colors duration-300">{company}</h3>
                    <p className="text-sm uppercase tracking-wider mt-1" style={{ color: P3_COLORS.accent }}>
                      {role} · {period}
                    </p>
                  </div>
                </div>
                <ul className="list-disc list-inside text-base leading-relaxed space-y-2 ml-20 text-gray-300">
                  {bullets.map((b, i) => (
                    <li key={i} className="group-hover:text-white transition-colors duration-300">{b}</li>
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
              className="bg-opacity-10 hover:bg-opacity-20 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
              style={{ backgroundColor: P3_COLORS.primary }}
              onClick={() => link !== '#' && window.open(link, '_blank')}
            >
              <CardContent className="p-6 space-y-4">
                <h4 className="text-xl font-semibold">{title}</h4>
                <p className="text-xs uppercase tracking-wider">{period}</p>
                <p className="text-gray-300">{description}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {tech.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-1 text-xs rounded-full"
                      style={{ 
                        backgroundColor: P3_COLORS.accent + '20',
                        color: P3_COLORS.accent,
                        border: `1px solid ${P3_COLORS.accent}40`
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
                {link && (
                  <Button 
                    asChild 
                    variant="outline" 
                    size="sm" 
                    className="mt-4 hover:scale-105 transition-transform"
                    style={{ borderColor: P3_COLORS.accent }}
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(link, '_blank');
                    }}
                  >
                    <a href={link} target="_blank" rel="noreferrer">
                      View Project <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                )}
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
                style={{ color: P3_COLORS.primary }}
              >
                <span 
                  className="w-8 h-0.5 bg-current transform group-hover:w-12 transition-all duration-300"
                  style={{ backgroundColor: P3_COLORS.accent }}
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
                      className="px-4 py-3 rounded-lg text-center font-medium text-sm transition-all duration-300 cursor-pointer backdrop-blur-sm border border-opacity-30 hover:border-opacity-60 group-hover/skill:shadow-lg"
                      style={{ 
                        backgroundColor: P3_COLORS.primary + '15',
                        borderColor: P3_COLORS.accent,
                        color: 'white'
                      }}
                    >
                      <span className="relative z-10">{skill}</span>
                      <div 
                        className="absolute inset-0 rounded-lg opacity-0 group-hover/skill:opacity-20 transition-opacity duration-300"
                        style={{ backgroundColor: P3_COLORS.accent }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* CONTACT */}
      <Section id="contact" title="Contact" direction="down">
        <p className="mb-6">Feel free to reach out—I'm always open to new opportunities & collaborations.</p>
        <div className="flex gap-6 justify-center">
          <a href="mailto:a.stephenyeboah04@gmail.com" aria-label="Email"><Mail size={32} /></a>
          <a href="https://github.com/Steve-IX" target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={32} /></a>
          <a href="https://linkedin.com/in/stephen-addo-568b43215" target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={32} /></a>
          <a href="https://leetcode.com/u/SteveIX/" target="_blank" rel="noreferrer" aria-label="LeetCode"><ExternalLink size={32} /></a>
        </div>
      </Section>

      {/* FOOTER */}
      <footer className="py-6 text-center text-sm bg-black bg-opacity-20 backdrop-blur">
        © {new Date().getFullYear()}  Stephen Addo · Built with ❤ & Persona‑style vibes · v1.1
      </footer>
    </div>
  );
} 