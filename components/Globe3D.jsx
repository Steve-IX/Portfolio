'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useTheme } from '@/lib/ThemeContext';

export const Globe3D = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const globeRef = useRef(null);
  const { colors } = useTheme();

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    // Set size to match the container - made bigger
    const size = Math.min(window.innerWidth * 0.6, 800); // Increased from 0.4 and 600
    renderer.setSize(size, size);
    renderer.setClearColor(0x000000, 0); // Transparent background
    
    mountRef.current.appendChild(renderer.domElement);
    sceneRef.current = { scene, camera, renderer };

    // Create wireframe globe
    const createGlobe = () => {
      const globeGroup = new THREE.Group();
      
      // Globe parameters matching your Python code
      const latStep = 20; // Degrees between latitude lines
      const lonStep = 20; // Degrees between longitude lines
      const samples = 100; // Points per line
      const radius = 1.5; // Increased radius from 1 to 1.5

      // Material for the wireframe
      const material = new THREE.LineBasicMaterial({ 
        color: colors.primary,
        transparent: true,
        opacity: 0.8,
        linewidth: 1
      });

      // Create latitude rings (horizontal circles)
      for (let lat = -90 + latStep; lat < 90; lat += latStep) {
        const latRad = (lat * Math.PI) / 180;
        const points = [];
        
        for (let i = 0; i <= samples; i++) {
          const theta = (i / samples) * 2 * Math.PI;
          const x = Math.cos(latRad) * Math.cos(theta) * radius;
          const y = Math.cos(latRad) * Math.sin(theta) * radius;
          const z = Math.sin(latRad) * radius;
          points.push(new THREE.Vector3(x, y, z));
        }
        
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(geometry, material);
        globeGroup.add(line);
      }

      // Create longitude meridians (vertical semicircles)
      for (let lon = 0; lon < 360; lon += lonStep) {
        const lonRad = (lon * Math.PI) / 180;
        const points = [];
        
        for (let i = 0; i <= samples; i++) {
          const phi = ((i / samples) - 0.5) * Math.PI; // -π/2 to π/2
          const x = Math.cos(phi) * Math.cos(lonRad) * radius;
          const y = Math.cos(phi) * Math.sin(lonRad) * radius;
          const z = Math.sin(phi) * radius;
          points.push(new THREE.Vector3(x, y, z));
        }
        
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(geometry, material);
        globeGroup.add(line);
      }

      return globeGroup;
    };

    // Create and add globe to scene
    const globe = createGlobe();
    scene.add(globe);
    globeRef.current = globe;

    // Position camera - moved closer to make globe appear bigger
    camera.position.z = 2.5; // Reduced from 3 to 2.5

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Rotate the globe
      if (globeRef.current) {
        globeRef.current.rotation.y += 0.005; // Slow rotation
        globeRef.current.rotation.x += 0.002; // Slight tilt rotation
      }
      
      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current) return;
      const newSize = Math.min(window.innerWidth * 0.6, 800); // Updated resize values
      renderer.setSize(newSize, newSize);
      camera.aspect = 1;
      camera.updateProjectionMatrix();
    };

    window.addEventListener('resize', handleResize);

    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [colors.primary]);

  // Update colors when theme changes
  useEffect(() => {
    if (globeRef.current) {
      globeRef.current.children.forEach(child => {
        if (child.material) {
          child.material.color.setStyle(colors.primary);
        }
      });
    }
  }, [colors.primary]);

  return (
    <div 
      ref={mountRef} 
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      style={{ 
        zIndex: 5,
        filter: `drop-shadow(0 0 32px ${colors.primary})`,
        opacity: 0.25
      }}
    />
  );
}; 