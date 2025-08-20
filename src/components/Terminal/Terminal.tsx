import React, { useState } from 'react';
import TerminalHeader from './TerminalHeader';

interface TerminalProps {
  children?: React.ReactNode;
  className?: string;
}

const tabs = [
  { id: 'about', title: 'About', filename: 'about.sh' },
  { id: 'projects', title: 'Projects', filename: 'projects.py' },
  { id: 'contact', title: 'Contact', filename: 'contact.js' },
  { id: 'blog', title: 'Blog', filename: 'blog.md' }
];

export default function Terminal({ children, className }: TerminalProps) {
  const [activeTab, setActiveTab] = useState('about');

  return (
    <div className="flex items-center justify-center min-h-screen p-5" style={{ backgroundColor: '#0a0a0a' }}>
      <div className="w-full max-w-[1100px]">
        <div 
          className="rounded-md overflow-hidden border"
          style={{ 
            backgroundColor: '#101010',
            borderColor: '#282828',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)'
          }}
        >
          <TerminalHeader 
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
          <div 
            className={`font-mono text-white ${className || ''}`}
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}