import React, { useState, useRef, useEffect, useCallback } from 'react';

interface TerminalProps {
  children?: React.ReactNode;
  className?: string;
}

interface Command {
  command: string;
  output: React.ReactNode;
}

export default function Terminal({ children, className }: TerminalProps) {
  const TERMINAL_OPACITY = 'bg-black/60'; 
  const BACKDROP_BLUR = 'backdrop-blur-sm'; // backdrop-blur-none, backdrop-blur-sm, backdrop-blur-md
  
  const [commands, setCommands] = useState<Command[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [cursorVisible, setCursorVisible] = useState(true);
  const [spotifyData, setSpotifyData] = useState<any | null>(null);
  const [isLoadingSpotify, setIsLoadingSpotify] = useState(false);
  const [isSpotifyPolling, setIsSpotifyPolling] = useState(false);
  const [animatedProgress, setAnimatedProgress] = useState<number>(0);
  const [lastUpdateTime, setLastUpdateTime] = useState<number>(0);
  const [isTypingCommand, setIsTypingCommand] = useState(false);
  const [typedCommand, setTypedCommand] = useState('');
  const [showSpotifyOutput, setShowSpotifyOutput] = useState(false);
  const [isAutoLoaded, setIsAutoLoaded] = useState(false);
  const [allowRealTimeUpdates, setAllowRealTimeUpdates] = useState(true);
  const [typingComplete, setTypingComplete] = useState(false);
  const [autoLoadAttempted, setAutoLoadAttempted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const spotifyIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const animationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const animationRafRef = useRef<number | null>(null);
  const baseProgressRef = useRef<number>(0);
  const baseStartTimeRef = useRef<number>(0);
  const durationRef = useRef<number>(0);
  const pauseCheckCountRef = useRef<number>(0);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Helper functions for ncspot-style display
  const formatTime = useCallback((milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // CSS-based typing animation function
  const typeCommand = useCallback((command: string, onComplete: () => void) => {
    // Prevent double animations
    if (isTypingCommand) {
      return;
    }
    
    setIsTypingCommand(true);
    setTypedCommand(command); // Set the full command immediately for CSS animation
    setShowSpotifyOutput(false);
    setTypingComplete(false);
    
    // Clear any existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Calculate animation duration based on command length (roughly 100ms per character + base time)
    const animationDuration = (command.length * 100) + 800 + 1200; // 800ms base + 100ms per char + 1200ms delay
    
    // Mark typing as complete when animation finishes (before the caret disappears)
    setTimeout(() => {
      setTypingComplete(true);
    }, animationDuration - 300);
    
    // Complete the animation after the CSS animation finishes
    typingTimeoutRef.current = setTimeout(() => {
      setIsTypingCommand(false);
      // Small delay before showing output
      setTimeout(() => {
        setShowSpotifyOutput(true);
        onComplete();
      }, 300);
    }, animationDuration);
  }, [isTypingCommand]);

  const calculateProgress = useCallback((progressMs: number, durationMs: number) => {
    if (!durationMs || durationMs === 0) return 0;
    return Math.round((progressMs / durationMs) * 100);
  }, []);

  // Start smooth progress animation
  const startProgressAnimation = useCallback((initialProgressMs: number, durationMs: number) => {
    if (animationIntervalRef.current) {
      clearInterval(animationIntervalRef.current);
      animationIntervalRef.current = null;
    }
    if (animationRafRef.current !== null) {
      cancelAnimationFrame(animationRafRef.current);
      animationRafRef.current = null;
    }

    baseProgressRef.current = initialProgressMs;
    baseStartTimeRef.current = performance.now();
    durationRef.current = durationMs;
    setAnimatedProgress(initialProgressMs);
    setLastUpdateTime(Date.now());

    const tick = () => {
      const elapsed = performance.now() - baseStartTimeRef.current;
      const next = Math.min(baseProgressRef.current + elapsed, durationRef.current);
      setAnimatedProgress(next);
      if (next < durationRef.current) {
        animationRafRef.current = requestAnimationFrame(tick);
      } else {
        animationRafRef.current = null;
      }
    };
    animationRafRef.current = requestAnimationFrame(tick);
  }, []);

  // Update animated progress when real data comes in with smart sync
  const updateProgressAnimation = useCallback((newProgressMs: number, durationMs: number) => {
    // If we get a new server progress, reset the base and continue RAF from there
    const current = animatedProgress;
    const diff = Math.abs(newProgressMs - current);
    const SYNC_THRESHOLD = 5000; // 5s
    if (diff > SYNC_THRESHOLD || current > newProgressMs + 2000) {
      if (animationRafRef.current !== null) {
        cancelAnimationFrame(animationRafRef.current);
        animationRafRef.current = null;
      }
      baseProgressRef.current = newProgressMs;
      baseStartTimeRef.current = performance.now();
      durationRef.current = durationMs;
      setAnimatedProgress(newProgressMs);
      const tick = () => {
        const elapsed = performance.now() - baseStartTimeRef.current;
        const next = Math.min(baseProgressRef.current + elapsed, durationRef.current);
        setAnimatedProgress(next);
        if (next < durationRef.current) {
          animationRafRef.current = requestAnimationFrame(tick);
        } else {
          animationRafRef.current = null;
        }
      };
      animationRafRef.current = requestAnimationFrame(tick);
    }
  }, [animatedProgress]);

  // Stop polling for Spotify updates
  const stopSpotifyPolling = useCallback(() => {
    if (spotifyIntervalRef.current) {
      clearTimeout(spotifyIntervalRef.current);
      spotifyIntervalRef.current = null;
    }
    if (animationIntervalRef.current) {
      clearInterval(animationIntervalRef.current);
      animationIntervalRef.current = null;
    }
    if (animationRafRef.current !== null) {
      cancelAnimationFrame(animationRafRef.current);
      animationRafRef.current = null;
    }
    setIsSpotifyPolling(false);
    pauseCheckCountRef.current = 0; // Reset pause check counter
  }, []);

  // Start polling for Spotify updates with smart intervals
  const startSpotifyPolling = useCallback(() => {
    if (spotifyIntervalRef.current || isSpotifyPolling) return;
    
    let pollInterval = 20000; // Start with 20 seconds
    let consecutiveErrors = 0;
    
    const poll = async () => {
      try {
        const response = await fetch('/api/spotify.json');
        const result = await response.json();
        
        if (result.success && result.data) {
          // Check if track changed (always sync on track change)
          const trackChanged = spotifyData && spotifyData.track && result.data.track && 
                              spotifyData.track.id !== result.data.track.id;
          
          setSpotifyData(result.data);
          consecutiveErrors = 0; // Reset error count on success
          
          // Reset pause check counter when music is playing
          if (result.data.isPlaying) {
            pauseCheckCountRef.current = 0;
          }
          
          // Update animation with new progress data
          if (result.data.isPlaying && result.data.progress_ms !== undefined) {
            const durationMs = result.data.duration_ms || result.data.track?.duration_ms || 180000;
            
            if (trackChanged) {
              // Force sync on track change
              console.log('Track changed - forcing sync');
              setAnimatedProgress(result.data.progress_ms);
              setLastUpdateTime(Date.now());
              
              if (animationIntervalRef.current) {
                clearInterval(animationIntervalRef.current);
              }

              animationIntervalRef.current = setInterval(() => {
                setAnimatedProgress(prev => {
                  if (prev >= durationMs) return prev;
                  return prev + 1000;
                });
              }, 1000);
            } else {
              // Use smart sync for same track
              updateProgressAnimation(result.data.progress_ms, durationMs);
            }
            
            // Adaptive polling: more frequent near song end
            const remainingMs = durationMs - result.data.progress_ms;
            if (remainingMs < 10000) { // Less than 10 seconds left
              pollInterval = 3000; // Poll every 3 seconds - very end
            } else if (remainingMs < 30000) { // Less than 30 seconds left
              pollInterval = 8000; // Poll every 8 seconds near song end
            } else if (remainingMs > 180000) { // More than 3 minutes left
              pollInterval = 25000; // Poll every 25 seconds for long songs
            } else {
              pollInterval = 20000; // Default 20 seconds
            }
          }
          
          // Handle pause/stop with grace period
          if (!result.data.isPlaying) {
            pauseCheckCountRef.current++;
            console.log(`Music paused/stopped - check ${pauseCheckCountRef.current}/3`);
            
            // Continue polling for 3 more cycles to capture pause state
            if (pauseCheckCountRef.current >= 3) {
              console.log('Stopping polling after confirming pause state');
              stopSpotifyPolling();
              return;
            }
            // Continue polling with shorter interval when paused
            pollInterval = 10000; // 10 seconds when paused
          }
        }
      } catch (error) {
        consecutiveErrors++;
        console.log('Polling error:', error);
        
        // Exponential backoff on errors
        if (consecutiveErrors > 3) {
          pollInterval = Math.min(pollInterval * 2, 30000); // Max 30 seconds
        }
      }
      
      // Schedule next poll with adaptive interval (minimum 3 seconds)
      const finalInterval = Math.max(pollInterval, 3000); // Minimum 3 seconds
      spotifyIntervalRef.current = setTimeout(poll, finalInterval);
    };
    
    setIsSpotifyPolling(true);
    poll(); // Start immediately
  }, [isSpotifyPolling, updateProgressAnimation, stopSpotifyPolling]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Update terminal display when Spotify data changes (real-time updates)
  useEffect(() => {
    if (spotifyData && isSpotifyPolling && allowRealTimeUpdates) {
      // Find the last spotify command and update its output
      setCommands(prev => {
        const lastSpotifyIndex = prev.findLastIndex(cmd => cmd.command === 'spotify');
        if (lastSpotifyIndex !== -1) {
          const updated = [...prev];
          
          // Create updated Spotify display (unified for both auto-loaded and manual)
          const UpdatedSpotifyDisplay = () => {
            if (!spotifyData.track) {
              return (
                <div className="text-white font-mono text-sm">
                  <div className="text-vesper-secondary">
                    No recent Spotify activity found
                  </div>
                </div>
              );
            }

            const progressMs = spotifyData.isPlaying ? animatedProgress : (spotifyData.progress_ms || 0);
            const durationMs = spotifyData.duration_ms || spotifyData.track.duration_ms || 180000;
            const progress = calculateProgress(progressMs, durationMs);
            const currentTime = formatTime(progressMs);
            const totalTime = formatTime(durationMs);
            
            return (
              <div className="text-white font-mono text-sm">
                {/* ncspot-style header */}
                <div className="mb-2">
                  <div className="text-green-400">
                    ┌─ {spotifyData.isPlaying ? '▶' : '⏸'} spotify 
                    <span className="text-vesper-secondary text-xs ml-2">
                      {isAutoLoaded ? (
                        spotifyData.isPlaying ? '(auto-detected) live' : '(auto-detected)'
                      ) : (
                        spotifyData.isPlaying && isSpotifyPolling ? 'actively playing:' : 
                        !spotifyData.isPlaying ? 'not actively playing:' : ''
                      )}
                    </span>
                  </div>
                </div>

                {/* Track info line - ncspot style */}
                <div className="mb-1">
                  <span className="text-white">{spotifyData.track.artists.map((a: any) => a.name).join(', ')}</span>
                  <span className="text-vesper-secondary"> - </span>
                  <span className="text-vesper-accent">{spotifyData.track.name}</span>
                </div>

                {/* Progress bar - ncspot style */}
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-vesper-secondary text-xs">{currentTime}</span>
                  <div className="flex-1 bg-gray-700 h-1 rounded overflow-hidden">
                    <div 
                      className={`h-full spotify-progress-bar ${spotifyData.isPlaying ? 'bg-green-400 smooth-playing' : 'bg-gray-500'}`}
                      style={{ 
                        width: `${progress}%`
                      } as React.CSSProperties}
                    ></div>
                  </div>
                  <span className="text-vesper-secondary text-xs">{totalTime}</span>
                  <span className="text-vesper-secondary text-xs">[{progress}%]</span>
                </div>

                {/* Album info */}
                <div className="text-vesper-secondary text-xs mb-2">
                  from <span className="text-white">{spotifyData.track.album.name}</span>
                </div>

                {/* Status line */}
                <div className="flex items-center justify-between text-xs">
                  <div className="text-vesper-secondary">
                    {spotifyData.isPlaying ? (
                      <span className="text-green-400">● playing</span>
                    ) : (
                      <span>⏸ last played {spotifyData.lastPlayedAt ? (() => {
                        const date = new Date(spotifyData.lastPlayedAt);
                        const time = date.toLocaleTimeString('en-GB', { hour12: false });
                        const day = date.getDate();
                        const month = date.getMonth() + 1;
                        const year = date.getFullYear();
                        return `${time}, ${day}/${month}/${year}`;
                      })() : ''}</span>
                    )}
                  </div>
                  {spotifyData.track.external_urls?.spotify && (
                    <div>
                      <a 
                        href={spotifyData.track.external_urls.spotify} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-green-400 hover:text-green-300 transition-colors"
                      >
                        open →
                      </a>
                    </div>
                  )}
                </div>

                {/* Bottom border */}
                <div className="mt-2 text-green-400">
                  └─
                </div>
              </div>
            );
          };

          updated[lastSpotifyIndex] = {
            ...updated[lastSpotifyIndex],
            output: <UpdatedSpotifyDisplay />
          };
          
          return updated;
        }
        return prev;
      });
    }
  }, [spotifyData, isSpotifyPolling, calculateProgress, formatTime, animatedProgress, isAutoLoaded, allowRealTimeUpdates]);

  // Focus input when terminal is clicked
  const handleTerminalClick = () => {
    inputRef.current?.focus();
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentInput(e.target.value);
  };

  // Simple Spotify command handler
  const handleSpotifyCommand = useCallback(async () => {
    setIsLoadingSpotify(true);
    
    try {
      const response = await fetch('/api/spotify.json');
      const result = await response.json();
      
      setIsLoadingSpotify(false);
      
      if (result.success && result.data) {
        const status = result.data;
        setSpotifyData(status);
        
        // Start polling and animation if music is playing
        if (status.isPlaying) {
          const durationMs = status.duration_ms || status.track?.duration_ms || 180000;
          const progressMs = status.progress_ms || 0;
          startProgressAnimation(progressMs, durationMs);
          startSpotifyPolling();
        }

        const SpotifyDisplay = () => {
          if (!status.track) {
            return (
              <div className="text-white font-mono text-sm">
                <div className="text-vesper-secondary">
                  No recent Spotify activity found
                </div>
              </div>
            );
          }

          // For non-playing tracks, show full duration (completed)
          const progressMs = status.isPlaying ? animatedProgress : (status.duration_ms || status.track.duration_ms || 180000);
          const durationMs = status.duration_ms || status.track.duration_ms || 180000;
          const progress = status.isPlaying ? calculateProgress(animatedProgress, durationMs) : 100;
          const currentTime = status.isPlaying ? formatTime(animatedProgress) : formatTime(durationMs);
          const totalTime = formatTime(durationMs);
          
          return (
            <div className="text-white font-mono text-sm">
              {/* ncspot-style header */}
                <div className="mb-2">
                  <div className="text-green-400">
                    ┌─ {status.isPlaying ? '▶' : '⏸'} spotify
                    <span className="text-vesper-secondary text-xs ml-2">
                      {status.isPlaying && isSpotifyPolling ? 'actively playing:' : ''}
                      {!status.isPlaying ? 'not actively playing' : ''}
                    </span>
                  </div>
                </div>

              {/* Track info line - ncspot style */}
              <div className="mb-1">
                <span className="text-white">{status.track.artists.map((a: any) => a.name).join(', ')}</span>
                <span className="text-vesper-secondary"> - </span>
                <span className="text-vesper-accent">{status.track.name}</span>
              </div>

              {/* Progress bar - ncspot style */}
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-vesper-secondary text-xs">{currentTime}</span>
                  <div className="flex-1 bg-gray-700 h-1 rounded overflow-hidden">
                    <div 
                      className={`h-full spotify-progress-bar ${status.isPlaying ? 'bg-green-400 smooth-playing' : 'bg-gray-500'}`}
                      style={{ 
                        width: `${progress}%`
                      } as React.CSSProperties}
                    ></div>
                  </div>
                  <span className="text-vesper-secondary text-xs">{totalTime}</span>
                  <span className="text-vesper-secondary text-xs">[{progress}%]</span>
                </div>

              {/* Album info */}
              <div className="text-vesper-secondary text-xs mb-2">
                from <span className="text-white">{status.track.album.name}</span>
              </div>

              {/* Status line */}
              <div className="flex items-center justify-between text-xs">
                <div className="text-vesper-secondary">
                  {status.isPlaying ? (
                    <span className="text-green-400">● playing</span>
                  ) : (
                    <span>⏸ last played {status.lastPlayedAt ? (() => {
                      const date = new Date(status.lastPlayedAt);
                      const time = date.toLocaleTimeString('en-GB', { hour12: false });
                      const day = date.getDate();
                      const month = date.getMonth() + 1;
                      const year = date.getFullYear();
                      return `${time}, ${day}/${month}/${year}`;
                    })() : ''}</span>
                  )}
                </div>
                {status.track.external_urls?.spotify && (
                  <div>
                    <a 
                      href={status.track.external_urls.spotify} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-green-400 hover:text-green-300 transition-colors"
                    >
                      open →
                    </a>
                  </div>
                )}
              </div>

              {/* Bottom border */}
              <div className="mt-2 text-green-400">
                └─
              </div>
            </div>
          );
        };

        return <SpotifyDisplay />;
      } else {
        return (
          <div className="text-vesper-secondary">
            {result.data?.message || 'Unable to fetch Spotify data'}
          </div>
        );
      }
    } catch (error) {
      setIsLoadingSpotify(false);
      return (
        <div className="text-red-400">
          Error fetching Spotify data: {error instanceof Error ? error.message : 'Network error'}
        </div>
      );
    }
  }, []);

  // Execute commands
  const executeCommand = async (command: string) => {
    const trimmedCommand = command.trim().toLowerCase();
    
    let output: React.ReactNode;
   
    switch (trimmedCommand) {
      case 'help':
        output = (
          <div className="text-white">
            <div className="mb-2">Available commands:</div>
            <div className="ml-4">
              <div className="mb-1"><span className="text-vesper-accent">help</span> - Show this help message</div>
              <div className="mb-1"><span className="text-vesper-accent">clear</span> - Clear the terminal</div>
              <div className="mb-1"><span className="text-vesper-accent">spotify</span> - Show my current or last played song</div>
            </div>
          </div>
        );
        break;

      case 'clear':
        setCommands([]);
        return;

      case 'spotify':
        setIsAutoLoaded(false); // Reset auto-loaded flag for manual commands
        setAllowRealTimeUpdates(true); // Ensure real-time updates are enabled for manual commands
        output = await handleSpotifyCommand();
        break;
      
      case '':
        // Empty command, just add a new line
        output = null;
        break;

      default:
        output = (
          <div className="text-red-400">
            Command not found: {command}. Type 'help' for available commands.
          </div>
        );
    }
            
    setCommands(prev => [...prev, { command, output }]);
  };

  // Handle key presses
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand(currentInput);
      setCurrentInput('');
    }
  };

  // Auto-focus on mount and check for Spotify activity
  useEffect(() => {
    inputRef.current?.focus();
    
    // Auto-load Spotify status if I am currently listening
    const checkSpotifyOnLoad = async () => {
      if (autoLoadAttempted) {
        return;
      }
      
      setAutoLoadAttempted(true);
      
      try {
        const response = await fetch('/api/spotify.json');
        const result = await response.json();
        
        if (result.success && result.data && result.data.isPlaying) {
          const status = result.data;
          setSpotifyData(status);
          
          // Start animation and polling for auto-loaded content
          const durationMs = status.duration_ms || status.track?.duration_ms || 180000;
          const progressMs = status.progress_ms || 0;
          startProgressAnimation(progressMs, durationMs);
          startSpotifyPolling();
          
          // Use typing animation instead of immediate display
          setIsAutoLoaded(true);
          setAllowRealTimeUpdates(false); // Disable real-time updates during typing
          
          try {
            typeCommand('spotify', () => {
            // Create the initial display immediately without loading state
            const InitialSpotifyDisplay = () => {
              try {
                if (!status?.track) {
                  return (
                    <div className="text-white font-mono text-sm">
                      <div className="text-vesper-secondary">
                        No track data available
                      </div>
                    </div>
                  );
                }

                const progressMs = status.isPlaying ? animatedProgress : (status.progress_ms || 0);
                const durationMs = status.duration_ms || status.track?.duration_ms || 180000;
                const progress = calculateProgress(progressMs, durationMs);
                const currentTime = formatTime(progressMs);
                const totalTime = formatTime(durationMs);
              
              return (
                <div className="text-white font-mono text-sm">
                  {/* ncspot-style header */}
                  <div className="mb-2">
                    <div className="text-green-400">
                      ┌─ {status.isPlaying ? '▶' : '⏸'} spotify 
                      <span className="text-vesper-secondary text-xs ml-2">
                        {status.isPlaying ? '(auto-detected) live' : '(auto-detected)'}
                      </span>
                    </div>
                  </div>

                  {/* Track info line - ncspot style */}
                  <div className="mb-1">
                    <span className="text-white">{status.track?.artists?.map((a: any) => a.name).join(', ')}</span>
                    <span className="text-vesper-secondary"> - </span>
                    <span className="text-vesper-accent">{status.track?.name}</span>
                  </div>

                  {/* Progress bar - ncspot style */}
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-vesper-secondary text-xs">{currentTime}</span>
                    <div className="flex-1 bg-gray-700 h-1 rounded overflow-hidden">
                      <div 
                        className={`h-full spotify-progress-bar ${status.isPlaying ? 'bg-green-400 smooth-playing' : 'bg-gray-500'}`}
                        style={{ 
                          width: `${progress}%`
                        } as React.CSSProperties}
                      ></div>
                    </div>
                    <span className="text-vesper-secondary text-xs">{totalTime}</span>
                    <span className="text-vesper-secondary text-xs">[{progress}%]</span>
                  </div>

                  {/* Album info */}
                  <div className="text-vesper-secondary text-xs mb-2">
                    from <span className="text-white">{status.track?.album?.name}</span>
                  </div>

                  {/* Status line */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="text-vesper-secondary">
                      {status.isPlaying ? (
                        <span className="text-green-400">● playing</span>
                      ) : (
                        <span>⏸ last played {status.lastPlayedAt ? (() => {
                          const date = new Date(status.lastPlayedAt);
                          const time = date.toLocaleTimeString('en-GB', { hour12: false });
                          const day = date.getDate();
                          const month = date.getMonth() + 1;
                          const year = date.getFullYear();
                          return `${time}, ${day}/${month}/${year}`;
                        })() : ''}</span>
                      )}
                    </div>
                    {status.track?.external_urls?.spotify && (
                      <div>
                        <a 
                          href={status.track.external_urls.spotify} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-green-400 hover:text-green-300 transition-colors"
                        >
                          open →
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Bottom border */}
                  <div className="mt-2 text-green-400">
                    └─
                  </div>
                </div>
              );
              } catch (error) {
                console.error('Error rendering InitialSpotifyDisplay:', error);
                return (
                  <div className="text-white font-mono text-sm">
                    <div className="text-red-400">
                      Error loading Spotify data
                    </div>
                  </div>
                );
              }
            };

            setCommands([{ command: 'spotify', output: <InitialSpotifyDisplay /> }]);
            
            // Re-enable real-time updates after a short delay
            setTimeout(() => {
              setAllowRealTimeUpdates(true);
            }, 1000);
          });
          } catch (typeError) {
            console.error('Error in typeCommand:', typeError);
            // Fallback: just set a simple command without animation
            setCommands([{ 
              command: 'spotify', 
              output: <div className="text-red-400">Error loading Spotify animation</div> 
            }]);
            setAllowRealTimeUpdates(true);
          }
        }
      } catch (error) {
        // Silently fail on initial load - visitors can manually run spotify command
      }
    };
    
    // Small delay to ensure component is mounted
    const autoLoadTimeout = setTimeout(() => {
      checkSpotifyOnLoad().catch(() => {
        // Ensure the page doesn't stay blank - reset states
        setIsTypingCommand(false);
        setIsAutoLoaded(false);
        setAllowRealTimeUpdates(true);
      });
    }, 1500);

    // Cleanup timeout if component unmounts
    return () => {
      clearTimeout(autoLoadTimeout);
    };
  }, []); // Empty dependency array - only run once on mount

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      stopSpotifyPolling();
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
    };
  }, [stopSpotifyPolling]);


  // Scroll to bottom when new commands are added
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [commands]);

  return (
    <div 
      className="flex flex-col items-center justify-center min-h-screen p-3 sm:p-4 md:p-5 relative"
      style={{ 
        backgroundColor: '#0a0a0a',
        backgroundImage: 'url("/background.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Background overlay for better text readability */}
      <div className="absolute inset-0 bg-black/20"></div>
      
      {/* Navigation Bar*/}
      <div className="w-full max-w-6xl mb-6 relative z-10 flex justify-center">
        <div className="w-full sm:w-3/4 md:w-1/2 bg-black/50 px-2 sm:px-4 py-2 rounded-lg backdrop-blur-sm flex items-center justify-center gap-2 sm:gap-4 md:gap-6">
          <a href="/about" className="text-white text-sm font-mono hover:text-vesper-accent transition-colors">
            about
          </a>
          <a href="/projects" className="text-white text-sm font-mono hover:text-vesper-accent transition-colors">
            projects
          </a>
          <a href="/takes" className="text-white text-sm font-mono hover:text-vesper-accent transition-colors">
            takes
          </a>
          <a href="/thoughts" className="text-white text-sm font-mono hover:text-vesper-accent transition-colors">
            thoughts
          </a>
          <a href="/setup" className="text-white text-sm font-mono hover:text-vesper-accent transition-colors">
            setup
          </a>
          <a href="/contact" className="text-white text-sm font-mono hover:text-vesper-accent transition-colors">
            contact
          </a>
        </div>
      </div>
      
      <div className={`w-full max-w-6xl ${TERMINAL_OPACITY} ${BACKDROP_BLUR} border border-vesper-border rounded-lg shadow-2xl overflow-hidden relative z-10`}>
        <div className="relative flex items-center px-2 sm:px-4 py-2" style={{ backgroundColor: '#161616', borderBottom: '1px solid #282828' }}>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="absolute left-1/2 transform -translate-x-1/2 text-vesper-secondary text-sm font-mono">
            aaron@mind
          </div>
          <div className="ml-auto text-vesper-secondary text-sm font-mono hidden sm:block">
            Mon 27 Sep 21:30:28 ❤️
          </div>
        </div>
        
        <div 
          ref={terminalRef}
          className="bg-transparent text-white font-mono text-xs sm:text-sm overflow-auto overscroll-contain h-[70vh] md:h-[600px] p-4 cursor-text"
          onClick={handleTerminalClick}
          style={{ 
            contain: 'strict'
          }}
        >
          {/* Welcome message */}
          <div className="text-vesper-secondary text-sm mb-2">
            Welcome to my corner of the internet. Here lies a glimpse into my mind, tread carefully. <br />
            Type 'help' to see available commands.
          </div>

          {/* Previous Commands */}
          {commands.map((cmd, index) => (
            <div key={index} className="mb-1">
              <div className="flex items-baseline">
                <span className="text-vesper-accent mr-2 font-medium">aaron@mind ~ %</span>
                <span className="text-white">{cmd.command}</span>
              </div>
              {cmd.output && <div className="mt-1">{cmd.output}</div>}
            </div>
          ))}

          {/* Current Input Line */}
          <div className="flex items-baseline">
            <span className="text-vesper-accent mr-2 font-medium">aaron@mind ~ %</span>
            <div className="flex items-baseline flex-1">
              {isTypingCommand ? (
                <div className="typing-container">
                  <span 
                    className={`text-white typing-text ${typingComplete ? 'typing-complete' : ''}`}
                    style={{
                      '--char-count': typedCommand.length,
                    } as React.CSSProperties}
                  >
                    {typedCommand}
                  </span>
                </div>
              ) : (
                <>
                  <span className="text-white whitespace-pre">{currentInput}{cursorVisible ? '|' : ''}</span>
                  <input
                    ref={inputRef}
                    type="text"
                    value={currentInput}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    className="absolute opacity-0 pointer-events-none"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    disabled={isTypingCommand}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Spotify Embed */}
      <div className="w-full max-w-6xl mt-6 relative z-10 flex flex-col items-center">
        <div className="w-full sm:w-3/4 md:w-1/2 bg-black/20 backdrop-blur-sm border border-vesper-border rounded-lg shadow-2xl overflow-hidden">
          <iframe 
            data-testid="embed-iframe" 
            style={{borderRadius: '12px'}} 
            src="https://open.spotify.com/embed/playlist/7ziIhBdyGXfdbSa35o2hhD?utm_source=generator&theme=0" 
            width="100%" 
            height="152" 
            allowFullScreen 
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
            loading="lazy"
            className="w-full"
          />
        </div>
        <div className="text-vesper-secondary text-base mt-4 text-center font-medium tracking-wide leading-relaxed bg-black/30 px-2 py-0 rounded-lg backdrop-blur-sm" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
          This is what I usually listen to.
        </div>
      </div>
    </div>
  );
}

