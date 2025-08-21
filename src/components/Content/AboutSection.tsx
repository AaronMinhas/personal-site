import React, { useState, useRef, useEffect } from 'react';

interface Command {
  command: string;
  output: React.ReactNode;
}

export default function AboutSection() {
  const [commands, setCommands] = useState<Command[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [cursorVisible, setCursorVisible] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Cursor blinking effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible(prev => !prev);
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

  // Handle key presses
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand(currentInput);
      setCurrentInput('');
    }
  };

  // Execute commands
  const executeCommand = (command: string) => {
    const trimmedCommand = command.trim().toLowerCase();
    
    let output: React.ReactNode;
   
    switch (trimmedCommand) {
      case 'fastfetch':
        output = (
          <div className="flex gap-6 mb-4">
            <div className="flex-shrink-0 text-xs leading-tight font-mono whitespace-pre">
            <div style={{ color: '#e6edf3' }}>                     ..'</div>
              <div style={{ color: '#ff6b6b' }}>                 ,xNMM.</div>
              <div style={{ color: '#51cf66' }}>               .OMMMMo</div>
              <div style={{ color: '#ffd43b' }}>               lMM"</div>
              <div style={{ color: '#339af0' }}>     .;loddo:.  .olloddol;.</div>
              <div style={{ color: '#e599f7' }}>   cKMMMMMMMMMMNWMMMMMMMMMM0:</div>
              <div style={{ color: '#3bc9db' }}> .KMMMMMMMMMMMMMMMMMMMMMMMWd.</div>
              <div style={{ color: '#e6edf3' }}> XMMMMMMMMMMMMMMMMMMMMMMMX.</div>
              <div style={{ color: '#ff6b6b' }}>;MMMMMMMMMMMMMMMMMMMMMMMM:</div>
              <div style={{ color: '#51cf66' }}>:MMMMMMMMMMMMMMMMMMMMMMMM:</div>
              <div style={{ color: '#ffd43b' }}>.MMMMMMMMMMMMMMMMMMMMMMMMX.</div>
              <div style={{ color: '#339af0' }}> kMMMMMMMMMMMMMMMMMMMMMMMMWd.</div>
              <div style={{ color: '#e599f7' }}> 'XMMMMMMMMMMMMMMMMMMMMMMMMMMk</div>
              <div style={{ color: '#3bc9db' }}>  'XMMMMMMMMMMMMMMMMMMMMMMMMK.</div>
              <div style={{ color: '#e6edf3' }}>   kMMMMMMMMMMMMMMMMMMMMMMd</div>
              <div style={{ color: '#ff6b6b' }}>    ;KMMMMMMMWXXWMMMMMMMk.</div>
              <div style={{ color: '#51cf66' }}>      "cooc*"    "*coo'"</div>
            </div>

            {/* System Info */}
            <div className="flex-1 text-sm leading-relaxed">
              <div className="text-white font-semibold">aaron@portfolio</div>
              <div className="text-vesper-secondary mb-1">-----------------</div>
              
              <div className="mb-0.5">
                <span className="text-vesper-accent font-medium inline-block min-w-[120px]">Role:</span>
                <span className="text-white">Software Engineering & Business Student</span>
              </div>
              <div className="mb-0.5">
                <span className="text-vesper-accent font-medium inline-block min-w-[120px]">Location:</span>
                <span className="text-white">Sydney, Australia</span>
              </div>
              
              <div className="mb-0.5">
                <span className="text-vesper-accent font-medium inline-block min-w-[120px]">Focus:</span>
                <span className="text-white">DevOps Engineering & Cloud Infrastructure</span>
              </div>
              <div className="mb-0.5">
                <span className="text-vesper-accent font-medium inline-block min-w-[120px]">Learning:</span>
                <span className="text-white">CI/CD, Infrastructure as Code, Containerisation</span>
              </div>
              <div className="mb-0.5">
                <span className="text-vesper-accent font-medium inline-block min-w-[120px]">Education:</span>
                <span className="text-white">Macquarie University – Software Engineering & Business</span>
              </div>
              
              <div className="mb-0.5">
                <span className="text-vesper-accent font-medium inline-block min-w-[120px]">Languages:</span>
                <span className="text-white">Python, Bash, Java, JS, YAML</span>
              </div>
              <div className="mb-0.5">
                <span className="text-vesper-accent font-medium inline-block min-w-[120px]">Tools:</span>
                <span className="text-white">Docker, Jenkins, Ansible, Prometheus, Grafana</span>
              </div>
              <div className="mb-0.5">
                <span className="text-vesper-accent font-medium inline-block min-w-[120px]">Infra:</span>
                <span className="text-white">ESXi, Nginx, Docker Swarm</span>
              </div>
              
              <div className="mb-0.5">
                <span className="text-vesper-accent font-medium inline-block min-w-[120px]">Homelab:</span>
                <span className="text-white">Home Assistant, ESPHome, various self-hosted applications</span>
              </div>
              <div className="mb-0.5">
                <span className="text-vesper-accent font-medium inline-block min-w-[120px]">Interests:</span>
                <span className="text-white">IoT automation, Self-hosting, IaC</span>
              </div>

              <div className="mb-0.5">
                <span className="text-vesper-accent font-medium inline-block min-w-[120px]">Terminal:</span>
                <span className="text-white">Ghostty with zsh</span>
              </div>
              <div className="mb-0.5">
                <span className="text-vesper-accent font-medium inline-block min-w-[120px]">Editor:</span>
                <span className="text-white">VS Code with JetBrains Mono</span>
              </div>
              <div className="mb-0.5">
                <span className="text-vesper-accent font-medium inline-block min-w-[120px]">Theme:</span>
                <span className="text-white">Vesper (Dark) – because dark mode is life</span>
              </div>
                
              <div className="mb-0.5">
                <span className="text-vesper-accent font-medium inline-block min-w-[120px]">Portfolio:</span>
                <span className="text-white">Built with love using Astro, React & Tailwind</span>
              </div>
            </div>
          </div>
        );
        break;
            
      case 'help':
        output = (
          <div className="text-white">
            <div className="mb-2">Available commands:</div>
            <div className="ml-4">
              <div className="mb-1"><span className="text-vesper-accent">fastfetch</span> - Display system information</div>
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
      ref={terminalRef}
      className="p-4 cursor-text h-full overflow-auto"
      onClick={handleTerminalClick}
      style={{ contain: 'layout style paint' }}
    >
      {/* Terminal Login */}
      <div className="text-vesper-secondary text-sm mb-2">
        Last login: Mon 27 Sep 21:30:28 on ttys001
      </div>

      {/* Previous Commands */}
      {commands.map((cmd, index) => (
        <div key={index} className="mb-4">
          <div className="flex items-center">
            <span className="text-vesper-accent mr-2 font-medium">aaron@portfolio ~ %</span>
            <span className="text-white">{cmd.command}</span>
          </div>
          {cmd.output && <div className="mt-2">{cmd.output}</div>}
        </div>
      ))}

      {/* Current Input Line */}
      <div className="flex items-center">
        <span className="text-vesper-accent mr-2 font-medium">aaron@portfolio ~ %</span>
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
  );
}