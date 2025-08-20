import React from 'react';

export default function AboutSection() {
  return (
    <div className="p-4">
      {/* Terminal Login */}
      <div className="text-vesper-secondary text-sm mb-2">
        Last login: Mon 27 Sep 21:30:28 on ttys001
      </div>

      {/* Terminal Command Line */}
      <div className="flex items-center mb-4">
        <span className="text-vesper-accent mr-2 font-medium">aaron@portfolio ~ %</span>
        <span className="text-white">fastfetch</span>
      </div>

      {/* Fastfetch Display */}
      <div className="flex gap-6 mb-4">
        <div className="flex-shrink-0 text-xs leading-tight font-mono whitespace-pre">
          <div style={{ color: '#e6edf3' }}>                     ..'</div>
          <div style={{ color: '#ff6b6b' }}>                 ,xNMM.</div>
          <div style={{ color: '#51cf66' }}>               .OMMMMo</div>
          <div style={{ color: '#ffd43b' }}>               lMM&quot;</div>
          <div style={{ color: '#339af0' }}>     .;loddo:.  .olloddol;.</div>
          <div style={{ color: '#e599f7' }}>   cKMMMMMMMMMMNWMMMMMMMMMM0:</div>
          <div style={{ color: '#3bc9db' }}> .KMMMMMMMMMMMMMMMMMMMMMMMWd.</div>
          <div style={{ color: '#e6edf3' }}> XMMMMMMMMMMMMMMMMMMMMMMMX.</div>
          <div style={{ color: '#ff6b6b' }}>;MMMMMMMMMMMMMMMMMMMMMMMM:</div>
          <div style={{ color: '#51cf66' }}>:MMMMMMMMMMMMMMMMMMMMMMMM:</div>
          <div style={{ color: '#ffd43b' }}>.MMMMMMMMMMMMMMMMMMMMMMMMX.</div>
          <div style={{ color: '#339af0' }}> kMMMMMMMMMMMMMMMMMMMMMMMMWd.</div>
          <div style={{ color: '#e599f7' }}> &apos;XMMMMMMMMMMMMMMMMMMMMMMMMMMk</div>
          <div style={{ color: '#3bc9db' }}>  &apos;XMMMMMMMMMMMMMMMMMMMMMMMMK.</div>
          <div style={{ color: '#e6edf3' }}>   kMMMMMMMMMMMMMMMMMMMMMMd</div>
          <div style={{ color: '#ff6b6b' }}>    ;KMMMMMMMWXXWMMMMMMMk.</div>
          <div style={{ color: '#51cf66' }}>      &quot;cooc*&quot;    &quot;*coo&apos;&quot;</div>
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

      {/* Colourss */}
      <div className="flex gap-1 mb-4 flex-wrap">
        <span className="w-4 h-4 rounded-sm block" style={{ backgroundColor: '#ff6b6b' }}></span>
        <span className="w-4 h-4 rounded-sm block" style={{ backgroundColor: '#4ecdc4' }}></span>
        <span className="w-4 h-4 rounded-sm block" style={{ backgroundColor: '#45b7d1' }}></span>
        <span className="w-4 h-4 rounded-sm block" style={{ backgroundColor: '#f9ca24' }}></span>
        <span className="w-4 h-4 rounded-sm block" style={{ backgroundColor: '#f0932b' }}></span>
        <span className="w-4 h-4 rounded-sm block" style={{ backgroundColor: '#eb4d4b' }}></span>
        <span className="w-4 h-4 rounded-sm block" style={{ backgroundColor: '#6c5ce7' }}></span>
        <span className="w-4 h-4 rounded-sm block" style={{ backgroundColor: '#a29bfe' }}></span>
      </div>
    </div>
  );
}