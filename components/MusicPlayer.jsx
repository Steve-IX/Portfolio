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
  const { theme, colors } = useTheme();

  const currentTrack = playlist[currentTrackIndex];

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
    
    // If was playing, continue playing the new track
    if (isPlaying && audioRef.current) {
      const playNewTrack = async () => {
        try {
          await audioRef.current.play();
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