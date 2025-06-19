'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Music, Minimize2, Maximize2, SkipBack, SkipForward } from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';

export const MusicPlayer = () => {
    // Playlist of tracks - add new songs here!
  const playlist = [
    {
      title: "Last Goodbye",
      artist: "Undertale OST",
      album: "Undertale Soundtrack",
      filename: "Undertale OST - Last Goodbye.mp3",
      coverArt: "/music/covers/undertale-last-goodbye.jpg"
    },
    {
      title: "Field of Hopes and Dreams",
      artist: "Deltarune OST",
      album: "Deltarune Soundtrack",
      filename: "Deltarune OST： 13 - Field of Hopes and Dreams.mp3",
      coverArt: "/music/covers/deltarune-field-of-hopes.jpg"
    },
    {
      title: "Amore Mio Aiutami (Dream Version)",
      artist: "Piero Piccioni",
      album: "The Best of Piero Piccioni - The Greatest Hits 2",
      filename: "Amore Mio Aiutami (Dream Version) ● Piero Piccioni.mp3",
      coverArt: "/music/covers/piero-piccioni-greatest-hits.jpg"
    },
    {
      title: "Naruto Shippūden",
      artist: "Naruto OST",
      album: "Naruto Shippūden Soundtrack",
      filename: "Naruto Shippūden.mp3",
      coverArt: "/music/covers/naruto-shippuden.jpg"
    },
    {
      title: "Crossing Field (Orchestra)",
      artist: "Orchestra Version",
      album: "Sword Art Online OST",
      filename: "Crossing Field (Orchestra).mp3",
      coverArt: "/music/covers/crossing-field-orchestra.jpg"
    },
    // Add more tracks here in the future:
    // {
    //   title: "Your Song Title",
    //   artist: "Artist Name", 
    //   album: "Album Name",
    //   filename: "your-audio-file.mp3",
    //   coverArt: "/music/covers/your-cover-art.jpg"
    // },
  ];

  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.3);
  const [isMuted, setIsMuted] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [coverArtLoaded, setCoverArtLoaded] = useState(false);
  const [coverArtError, setCoverArtError] = useState(false);
  const audioRef = useRef(null);
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyzerRef = useRef(null);
  const sourceRef = useRef(null);
  const { theme, colors } = useTheme();

  const currentTrack = playlist[currentTrackIndex];

  // Audio Visualizer Setup
  const cleanupAudioContext = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    if (sourceRef.current) {
      try {
        sourceRef.current.disconnect();
      } catch (error) {
        console.log('Source already disconnected');
      }
      sourceRef.current = null;
    }
    
    if (analyzerRef.current) {
      try {
        analyzerRef.current.disconnect();
      } catch (error) {
        console.log('Analyzer already disconnected');
      }
      analyzerRef.current = null;
    }
    
    console.log('Audio context cleaned up');
  };

  const setupAudioContext = () => {
    if (!audioRef.current) return;
    
    try {
      // Complete cleanup first
      cleanupAudioContext();
      
      // If context doesn't exist, create it
      if (!audioContextRef.current) {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        audioContextRef.current = audioContext;
      }
      
      const audioContext = audioContextRef.current;
      
      // Create new analyzer and source
      const analyzer = audioContext.createAnalyser();
      analyzer.fftSize = 256;
      analyzer.smoothingTimeConstant = 0.8;
      
      // Create source from current audio element
      const source = audioContext.createMediaElementSource(audioRef.current);
      
      // Connect the chain
      source.connect(analyzer);
      analyzer.connect(audioContext.destination);
      
      // Store references
      analyzerRef.current = analyzer;
      sourceRef.current = source;
      
      console.log('Audio context setup/reconnection successful for:', currentTrack.title);
    } catch (error) {
      console.error('Error setting up audio context:', error);
      // If createMediaElementSource fails, it's likely because source already exists
      // Try to reuse existing context
      if (error.name === 'InvalidStateError') {
        console.log('Reusing existing audio context connection');
      }
    }
  };

  const drawVisualizer = () => {
    if (!canvasRef.current || !analyzerRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const analyzer = analyzerRef.current;
    
    const bufferLength = analyzer.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    analyzer.getByteFrequencyData(dataArray);
    
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    if (!isPlaying) {
      // Show static bars when not playing
      const barCount = 32;
      const barWidth = width / barCount;
      
      for (let i = 0; i < barCount; i++) {
        const barHeight = 2;
        const x = i * barWidth;
        const y = height - barHeight;
        
        ctx.fillStyle = `${colors.primary}20`;
        ctx.fillRect(x, y, barWidth - 1, barHeight);
      }
      return;
    }
    
    // Dynamic visualization when playing
    const barCount = 32;
    const barWidth = width / barCount;
    const dataStep = Math.floor(bufferLength / barCount);
    
    for (let i = 0; i < barCount; i++) {
      const dataIndex = i * dataStep;
      const barHeight = Math.max(2, (dataArray[dataIndex] / 255) * height * 0.8);
      const x = i * barWidth;
      const y = height - barHeight;
      
      // Create gradient effect
      const gradient = ctx.createLinearGradient(0, height, 0, 0);
      gradient.addColorStop(0, colors.primary);
      gradient.addColorStop(1, `${colors.primary}40`);
      
      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, barWidth - 1, barHeight);
    }
    
    animationFrameRef.current = requestAnimationFrame(drawVisualizer);
  };

  const startVisualizer = () => {
    if (!audioContextRef.current) {
      setupAudioContext();
      // Small delay to ensure audio context is ready
      setTimeout(() => {
        if (canvasRef.current) {
          drawVisualizer();
        }
      }, 100);
    } else {
      // Ensure we have a valid analyzer connection
      if (!analyzerRef.current && audioRef.current) {
        setupAudioContext();
      }
      drawVisualizer();
    }
  };

  const stopVisualizer = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    // Draw static state
    if (canvasRef.current) {
      drawVisualizer();
    }
  };

  // Cleanup audio context on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Start/stop visualizer based on play state
  useEffect(() => {
    if (isPlaying) {
      startVisualizer();
    } else {
      stopVisualizer();
    }
  }, [isPlaying, colors.primary]);

  // Handle audio element changes (due to key prop) and ensure visualizer connection
  useEffect(() => {
    // When track changes and is playing, ensure visualizer is connected
    if (isPlaying && audioRef.current && audioContextRef.current) {
      // Check if we need to reconnect
      if (!analyzerRef.current || !sourceRef.current) {
        console.log('Reconnecting visualizer for new audio element');
        setTimeout(() => {
          setupAudioContext();
          startVisualizer();
        }, 150); // Longer delay to ensure audio element is fully ready
      }
    }
  }, [currentTrackIndex, isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      console.log('Audio metadata loaded for:', currentTrack.title);
      setDuration(audio.duration);
      setIsLoaded(true);
      setError(null);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handlePlay = () => {
      console.log('Audio started playing:', currentTrack.title);
      setIsPlaying(true);
      
      // Ensure visualizer is connected when audio starts playing
      if (audioContextRef.current && (!analyzerRef.current || !sourceRef.current)) {
        console.log('Setting up visualizer connection on play');
        setTimeout(() => {
          setupAudioContext();
          startVisualizer();
        }, 50);
      }
    };

    const handlePause = () => {
      console.log('Audio paused:', currentTrack.title);
      setIsPlaying(false);
    };

    const handleEnded = () => {
      console.log('Audio ended:', currentTrack.title);
      setIsPlaying(false);
      setCurrentTime(0);
      
      // Auto-advance to next track
      if (currentTrackIndex < playlist.length - 1) {
        nextTrack();
      } else {
        // Loop back to first track
        setCurrentTrackIndex(0);
      }
    };

    const handleCanPlay = () => {
      console.log('Audio can play:', currentTrack.title);
      setIsLoaded(true);
      setError(null);
    };

    const handleError = (e) => {
      console.error('Audio error:', e);
      setError(`Failed to load: ${currentTrack.title}`);
      setIsLoaded(false);
      setIsPlaying(false);
    };

    const handleLoadStart = () => {
      console.log('Audio loading started:', currentTrack.title);
      setError(null);
      setIsLoaded(false);
    };

    // Add event listeners
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);
    audio.addEventListener('loadstart', handleLoadStart);

    // Set initial volume
    audio.volume = volume;

    // Force initial load of metadata
    if (audio.readyState >= 1) {
      // Metadata already loaded
      handleLoadedMetadata();
    } else {
      // Force load metadata
      audio.load();
    }

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('loadstart', handleLoadStart);
    };
  }, [volume, currentTrackIndex]);

  // Reset player state when track changes
  useEffect(() => {
    setCurrentTime(0);
    setDuration(0);
    setIsLoaded(false);
    setError(null);
    setCoverArtLoaded(true); // Start as loaded for immediate display
    setCoverArtError(false);
    
    // Complete cleanup of audio context for new track
    console.log('Track changed, resetting visualizer');
    cleanupAudioContext();
    
    // If was playing, continue playing the new track
    if (isPlaying && audioRef.current) {
      const playNewTrack = async () => {
        try {
          // Wait a bit for audio element to be ready
          await new Promise(resolve => setTimeout(resolve, 50));
          
          // Setup audio context for new track
          if (audioContextRef.current) {
            setupAudioContext();
            // Resume audio context if suspended
            if (audioContextRef.current.state === 'suspended') {
              await audioContextRef.current.resume();
            }
          }
          
          await audioRef.current.play();
          
          // Start visualizer after successful play
          setTimeout(() => {
            if (isPlaying && analyzerRef.current) {
              startVisualizer();
            }
          }, 100);
          
        } catch (error) {
          console.error('Error playing new track:', error);
          setIsPlaying(false);
          setError('Failed to play new track');
        }
      };
      
      // Small delay to ensure audio element is ready
      setTimeout(playNewTrack, 100);
    }
  }, [currentTrackIndex]);

  // Initialize states on component mount
  useEffect(() => {
    console.log('MusicPlayer component mounted, initializing...');
    
    // Reset all states to ensure clean initialization
    setCurrentTime(0);
    setDuration(0);
    setIsLoaded(false);
    setError(null);
    setCoverArtLoaded(true); // Start as loaded for immediate display
    setCoverArtError(false);
    
    // Preload all cover art images for immediate display
    const preloadCoverArt = () => {
      playlist.forEach((track, index) => {
        if (track.coverArt) {
          const img = new Image();
          img.onload = () => {
            console.log(`Preloaded cover art for: ${track.title}`);
          };
          img.onerror = () => {
            console.log(`Failed to preload cover art for: ${track.title}`);
          };
          img.src = track.coverArt;
        }
      });
    };
    
    // Start preloading cover art immediately
    preloadCoverArt();
    
    // Small delay to ensure audio element is fully rendered
    const initTimer = setTimeout(() => {
      const audio = audioRef.current;
      if (audio) {
        console.log('Forcing initial audio load for:', currentTrack.title);
        audio.load(); // Force reload to trigger metadata loading
      }
    }, 100);

    return () => clearTimeout(initTimer);
  }, []); // Only run on mount

  const togglePlay = async () => {
    if (!audioRef.current) {
      console.error('Audio element not found');
      return;
    }

    const audio = audioRef.current;

    try {
      if (isPlaying) {
        console.log('Attempting to pause audio');
        audio.pause();
      } else {
        console.log('Attempting to play audio');
        
        // If minimized and about to play, expand the player
        if (isMinimized) {
          setIsMinimized(false);
        }
        
        // Check if audio is ready
        if (audio.readyState < 2) {
          console.log('Audio not ready, waiting for load...');
          setError('Loading audio...');
          return;
        }

        // Resume audio context if suspended (required by browsers)
        if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
          await audioContextRef.current.resume();
        }
        
        // Setup audio context on first play if not already setup
        if (!audioContextRef.current) {
          setupAudioContext();
        }

        // Clear any previous error
        setError(null);
        
        // Play the audio
        await audio.play();
        console.log('Audio play successful');
      }
    } catch (error) {
      console.error('Error toggling play:', error);
      setError('Playback failed - try clicking again');
      setIsPlaying(false);
    }
  };

  const nextTrack = () => {
    if (currentTrackIndex < playlist.length - 1) {
      setCurrentTrackIndex(currentTrackIndex + 1);
    } else {
      setCurrentTrackIndex(0); // Loop to first track
    }
  };

  const previousTrack = () => {
    if (currentTrackIndex > 0) {
      setCurrentTrackIndex(currentTrackIndex - 1);
    } else {
      setCurrentTrackIndex(playlist.length - 1); // Loop to last track
    }
  };

  const handleProgressClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!audioRef.current || !duration) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const newTime = pos * duration;
    
    console.log('Seeking to:', newTime);
    audioRef.current.currentTime = newTime;
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    
    if (isMuted) {
      audioRef.current.volume = volume;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const handleMinimizeToggle = () => {
    setIsMinimized(!isMinimized);
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration ? (currentTime / duration) * 100 : 0;

  return (
    <>
      <audio
        ref={audioRef}
        src={`/music/${currentTrack.filename}`}
        preload="metadata"
        playsInline
        key={currentTrackIndex} // Force re-render when track changes
      />
      
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 2 }}
        className={`fixed bottom-4 left-4 z-50 ${isMinimized ? 'w-16 h-16' : 'w-80'} transition-all duration-300`}
      >
        <div
          className="backdrop-blur-lg rounded-lg shadow-xl border transition-all duration-300"
          style={{
            backgroundColor: theme === 'dark' 
              ? 'rgba(1, 22, 39, 0.9)' 
              : 'rgba(255, 255, 255, 0.95)',
            borderColor: theme === 'dark' 
              ? 'rgba(77, 157, 224, 0.3)' 
              : 'rgba(26, 111, 176, 0.2)',
          }}
        >
          <AnimatePresence>
            {!isMinimized ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="p-4"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Music size={16} style={{ color: colors.primary }} />
                    <span className="text-xs font-medium" style={{ color: colors.text }}>
                      {error ? 'Error' : isPlaying ? 'Now Playing' : 'Paused'}
                    </span>
                    <span className="text-xs" style={{ color: colors.muted || (theme === 'dark' ? '#9CA3AF' : '#6B7280') }}>
                      {currentTrackIndex + 1}/{playlist.length}
                    </span>
                  </div>
                  <button
                    onClick={handleMinimizeToggle}
                    className="p-1 rounded hover:bg-opacity-20 transition-colors"
                    style={{ backgroundColor: `${colors.primary}10` }}
                  >
                    <Minimize2 size={14} style={{ color: colors.primary }} />
                  </button>
                </div>

                {/* Error message */}
                {error && (
                  <div className="mb-3 p-2 rounded text-xs" style={{ 
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    color: '#ef4444'
                  }}>
                    {error}
                  </div>
                )}

                {/* Track Info */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden relative">
                    {!coverArtError && currentTrack.coverArt ? (
                      <>
                        <img
                          src={currentTrack.coverArt}
                          alt={`${currentTrack.title} cover art`}
                          className="w-full h-full object-cover"
                          onLoad={() => {
                            console.log('Cover art loaded for:', currentTrack.title);
                            setCoverArtLoaded(true);
                            setCoverArtError(false);
                          }}
                          onError={() => {
                            console.log('Cover art failed to load:', currentTrack.coverArt);
                            setCoverArtError(true);
                            setCoverArtLoaded(false);
                          }}
                          style={{ 
                            opacity: 1, // Always visible immediately
                            transition: 'opacity 0.2s ease'
                          }}
                          loading="eager" // Force immediate loading
                        />
                        {/* Fallback overlay only shows on error */}
                        {coverArtError && (
                          <div 
                            className="absolute inset-0 w-full h-full rounded-lg flex items-center justify-center"
                            style={{ 
                              backgroundColor: `${colors.primary}20`,
                              backdropFilter: 'blur(2px)'
                            }}
                          >
                            <Music size={20} style={{ color: colors.primary }} />
                          </div>
                        )}
                      </>
                    ) : (
                      <div 
                        className="w-full h-full rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${colors.primary}20` }}
                      >
                        <Music size={20} style={{ color: colors.primary }} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div 
                      className="font-medium text-sm truncate"
                      style={{ color: colors.text }}
                    >
                      {currentTrack.title}
                    </div>
                    <div 
                      className="text-xs truncate"
                      style={{ color: colors.muted || (theme === 'dark' ? '#9CA3AF' : '#6B7280') }}
                    >
                      {currentTrack.artist}
                    </div>
                    {currentTrack.album && (
                      <div 
                        className="text-xs truncate opacity-75"
                        style={{ color: colors.muted || (theme === 'dark' ? '#9CA3AF' : '#6B7280') }}
                      >
                        {currentTrack.album}
                      </div>
                    )}
                  </div>
                </div>

                {/* Audio Visualizer */}
                <div className="mb-3">
                  <div 
                    className="w-full h-12 rounded-lg overflow-hidden relative"
                    style={{ 
                      backgroundColor: theme === 'dark' 
                        ? 'rgba(77, 157, 224, 0.05)' 
                        : 'rgba(26, 111, 176, 0.05)',
                      border: `1px solid ${theme === 'dark' 
                        ? 'rgba(77, 157, 224, 0.1)' 
                        : 'rgba(26, 111, 176, 0.1)'}`
                    }}
                  >
                    <canvas
                      ref={canvasRef}
                      width={320}
                      height={48}
                      className="w-full h-full"
                      style={{ 
                        filter: isPlaying ? 'none' : 'opacity(0.6)',
                        transition: 'filter 0.3s ease'
                      }}
                    />
                    
                    {/* Overlay gradient for professional look */}
                    <div 
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: `linear-gradient(90deg, 
                          ${theme === 'dark' ? 'rgba(1, 22, 39, 0.2)' : 'rgba(255, 255, 255, 0.2)'} 0%, 
                          transparent 20%, 
                          transparent 80%, 
                          ${theme === 'dark' ? 'rgba(1, 22, 39, 0.2)' : 'rgba(255, 255, 255, 0.2)'} 100%)`
                      }}
                    />
                    
                    {/* Center line for reference */}
                    <div 
                      className="absolute left-0 right-0 top-1/2 transform -translate-y-1/2 h-px opacity-20"
                      style={{ backgroundColor: colors.primary }}
                    />
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div 
                    className="w-full h-2 rounded-full cursor-pointer relative"
                    style={{ backgroundColor: `${colors.primary}20` }}
                    onClick={handleProgressClick}
                  >
                    <div 
                      className="h-full rounded-full transition-all duration-100"
                      style={{ 
                        width: `${progressPercentage}%`,
                        backgroundColor: colors.primary 
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-xs mt-1">
                    <span style={{ color: colors.muted || (theme === 'dark' ? '#9CA3AF' : '#6B7280') }}>
                      {formatTime(currentTime)}
                    </span>
                    <span style={{ color: colors.muted || (theme === 'dark' ? '#9CA3AF' : '#6B7280') }}>
                      {formatTime(duration)}
                    </span>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {/* Previous Track Button */}
                    <button
                      onClick={previousTrack}
                      className="flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 hover:scale-105 focus:outline-none"
                      style={{ backgroundColor: `${colors.primary}20` }}
                      type="button"
                      title="Previous Track"
                      disabled={playlist.length <= 1}
                    >
                      <SkipBack size={14} style={{ color: colors.primary, opacity: playlist.length <= 1 ? 0.5 : 1 }} />
                    </button>

                    {/* Play/Pause Button */}
                    <button
                      onClick={togglePlay}
                      className="flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2"
                      style={{ 
                        backgroundColor: colors.primary,
                        opacity: error ? 0.5 : 1
                      }}
                      type="button"
                      title={isPlaying ? 'Pause' : 'Play'}
                    >
                      {isPlaying ? (
                        <Pause size={18} color="white" />
                      ) : (
                        <Play size={18} color="white" style={{ marginLeft: '2px' }} />
                      )}
                    </button>

                    {/* Next Track Button */}
                    <button
                      onClick={nextTrack}
                      className="flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 hover:scale-105 focus:outline-none"
                      style={{ backgroundColor: `${colors.primary}20` }}
                      type="button"
                      title="Next Track"
                      disabled={playlist.length <= 1}
                    >
                      <SkipForward size={14} style={{ color: colors.primary, opacity: playlist.length <= 1 ? 0.5 : 1 }} />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={toggleMute}
                      className="p-2 rounded hover:bg-opacity-20 transition-colors focus:outline-none"
                      style={{ backgroundColor: `${colors.primary}10` }}
                      type="button"
                    >
                      {isMuted ? (
                        <VolumeX size={16} style={{ color: colors.primary }} />
                      ) : (
                        <Volume2 size={16} style={{ color: colors.primary }} />
                      )}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="w-20 h-2 rounded-full appearance-none cursor-pointer focus:outline-none"
                      style={{
                        background: `linear-gradient(to right, ${colors.primary} 0%, ${colors.primary} ${(isMuted ? 0 : volume) * 100}%, ${colors.primary}30 ${(isMuted ? 0 : volume) * 100}%, ${colors.primary}30 100%)`
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="p-4 flex items-center justify-center"
              >
                <button
                  onClick={togglePlay}
                  className="flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 hover:scale-105 focus:outline-none"
                  style={{ 
                    backgroundColor: colors.primary,
                    opacity: error ? 0.5 : 1
                  }}
                  type="button"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? (
                    <Pause size={16} color="white" />
                  ) : (
                    <Play size={16} color="white" style={{ marginLeft: '1px' }} />
                  )}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
}; 