import React, { useState, useRef, useEffect } from 'react';

interface TerminalProps {
  children?: React.ReactNode;
  className?: string;
}

interface Command {
  command: string;
  output: React.ReactNode;
}

export default function Terminal({ children, className }: TerminalProps) {
  // Terminal transparency settings - easily editable
  const TERMINAL_OPACITY = 'bg-black/60'; // Change this value: /20 = very transparent, /60 = less transparent
  const BACKDROP_BLUR = 'backdrop-blur-sm'; // Change this: backdrop-blur-none, backdrop-blur-sm, backdrop-blur-md
  
  const [commands, setCommands] = useState<Command[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [cursorVisible, setCursorVisible] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Focus input when terminal is clicked
  const handleTerminalClick = () => {
    inputRef.current?.focus();
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentInput(e.target.value);
  };

  // Execute commands
  const executeCommand = (command: string) => {
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
            </div>
          </div>
        );
        break;

      case 'clear':
        setCommands([]);
        return;
      
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

  // Auto-focus on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

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
      
      <div className={`w-full max-w-6xl ${TERMINAL_OPACITY} ${BACKDROP_BLUR} border border-vesper-border rounded-lg shadow-2xl overflow-hidden relative z-10`}>
        {/* Simple terminal header */}
        <div className="flex items-center justify-between px-2 sm:px-4 py-2" style={{ backgroundColor: '#161616', borderBottom: '1px solid #282828' }}>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="ml-4 text-vesper-secondary text-sm font-mono">
            aaron@mind
          </div>
          <div className="text-vesper-secondary text-sm font-mono">
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
              <div className="flex items-center">
                <span className="text-vesper-accent mr-2 font-medium">aaron@mind ~ %</span>
                <span className="text-white">{cmd.command}</span>
              </div>
              {cmd.output && <div className="mt-1">{cmd.output}</div>}
            </div>
          ))}

          {/* Current Input Line */}
          <div className="flex items-center">
            <span className="text-vesper-accent mr-2 font-medium">aaron@mind ~ %</span>
            <div className="flex items-center flex-1">
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
              />
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
