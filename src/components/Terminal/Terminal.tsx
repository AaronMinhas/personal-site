import React, { useState, useRef, useEffect } from 'react';
import TerminalHeader from './TerminalHeader';
import AboutSection from '../Content/AboutSection';

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
  const [terminalHeight, setTerminalHeight] = useState<number | null>(null);
  const aboutSectionRef = useRef<HTMLDivElement>(null);

  // Calculate height when AboutSection mounts
  useEffect(() => {
    if (activeTab === 'about' && aboutSectionRef.current) {
      const height = aboutSectionRef.current.scrollHeight;
      setTerminalHeight(height);
    }
  }, [activeTab]);

  // Calculate on window resize
  useEffect(() => {
    const handleResize = () => {
      if (activeTab === 'about' && aboutSectionRef.current) {
        const height = aboutSectionRef.current.scrollHeight;
        setTerminalHeight(height);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeTab]);

  const renderContent = () => {
    switch (activeTab) {
      case 'about':
        return (
          <div ref={aboutSectionRef}>
            <AboutSection />
          </div>
        );
      case 'projects':
        return (
          <div className="p-4 h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-vesper-accent text-lg mb-2">Projects</div>
              <div className="text-vesper-secondary">Content coming soon...</div>
            </div>
          </div>
        );
      case 'contact':
        return (
          <div className="p-4 h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-vesper-accent text-lg mb-2">Contact</div>
              <div className="text-vesper-secondary">Content coming soon...</div>
            </div>
          </div>
        );
      case 'blog':
        return (
          <div className="p-4 h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-vesper-accent text-lg mb-2">Blog</div>
              <div className="text-vesper-secondary">Content coming soon...</div>
            </div>
          </div>
        );
      default:
        return (
          <div ref={aboutSectionRef}>
            <AboutSection />
          </div>
        );
    }
  };

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
            style={{ 
              fontFamily: "'JetBrains Mono', monospace",
              height: terminalHeight ? `${terminalHeight}px` : 'auto',
              overflow: 'hidden'
            }}
          >
            <div className="h-full overflow-y-auto">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}