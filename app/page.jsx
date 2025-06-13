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
    bullets: [
      'Refined large‑language‑model datasets and annotation tasks to boost prediction accuracy.',
      'Analysed and curated large‑scale datasets for high‑fidelity fine‑tuning.',
    ],
  },
  {
    company: 'Lancaster University',
    role: 'Software Engineering Intern',
    period: 'Jun 2024 – Aug 2024',
    bullets: [
      'Developed web apps using modern JavaScript, focusing on performance and UX.',
      'Refactored asynchronous code, halving load times for 10k‑user applications.',
    ],
  },
  {
    company: 'Specsavers',
    role: 'Optical Assistant',
    period: 'Sep 2023 – May 2025',
    bullets: [
      'Provided front‑line customer service and pre‑examination support in high‑volume settings.',
    ],
  },
  {
    company: 'Boots Opticians',
    role: 'Optical Consultant',
    period: 'Aug 2022 – Aug 2024',
    bullets: [
      'Advised patients on eyewear, performing quality pre‑exam tests and building rapport.',
    ],
  },
];

const projects = [
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

const skills = [
  'C++',
  'Python',
  'C',
  'Java',
  'SQL',
  'Assembly',
  'HTML',
  'PHP',
  'Boost Libraries',
  'Data Structures & Algorithms',
  'Object‑Oriented Design',
  'Data Analysis (Python / SQL / Excel)',
];

// -----------------------------
//  MAIN COMPONENT
// -----------------------------
export default function Portfolio() {
  return (
    <div className="font-sans text-white" style={{ backgroundColor: P3_COLORS.secondary }}>
      <NavBar />

      {/* HERO */}
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-transparent to-black relative">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center p-8"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-wider" style={{ color: P3_COLORS.primary }}>
            Stephen Addo
          </h1>
          <p className="mt-4 text-xl md:text-2xl max-w-2xl mx-auto">
            Software Engineer · AI & Quantum‑Computing Enthusiast · Final‑Year CS @ Lancaster University
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button asChild size="lg" style={{ backgroundColor: P3_COLORS.accent }}>
              <a href="#contact">Get in Touch</a>
            </Button>
            <Button asChild variant="outline" size="lg" style={{ borderColor: P3_COLORS.primary }}>
              <a href="#projects">View Work</a>
            </Button>
          </div>
        </motion.div>
        {/* subtle stripes */}
        <div className="absolute inset-0 bg-[url('/stripes.svg')] opacity-5" />
      </section>

      {/* ABOUT */}
      <Section id="about" title="About" direction="left">
        <p>
          I'm a <span className="font-bold" style={{ color: P3_COLORS.accent }}>final‑year Computer Science student</span> at
          Lancaster University (~1st‑class), graduating July 2025. By day I build scalable, high‑performance systems at
          Labelbox; by night I explore quantum algorithms and crack LeetCode problems (700+ solved).
        </p>
      </Section>

      {/* EXPERIENCE */}
      <Section id="experience" title="Experience" direction="right">
        <div className="space-y-6">
          {experiences.map(({ company, role, period, bullets }) => (
            <Card key={company} className="bg-opacity-10" style={{ backgroundColor: P3_COLORS.primary }}>
              <CardContent className="p-6 space-y-3">
                <h3 className="text-2xl font-semibold">{company}</h3>
                <p className="text-sm uppercase tracking-wider">{role} · {period}</p>
                <ul className="list-disc list-inside text-base leading-relaxed space-y-1">
                  {bullets.map((b, i) => (<li key={i}>{b}</li>))}
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
        <div className="flex flex-wrap gap-3">
          {skills.map((skill) => (
            <span
              key={skill}
              className="px-3 py-1 rounded-full text-sm border"
              style={{ borderColor: P3_COLORS.accent }}
            >
              {skill}
            </span>
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