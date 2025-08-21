import React, { useState } from 'react';
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

  const renderContent = () => {
    switch (activeTab) {
      case 'about':
        return <AboutSection />;
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
        return <AboutSection />;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-5" style={{ backgroundColor: '#0a0a0a' }}>
      <div className="w-full max-w-6xl bg-vesper-terminal border border-vesper-border rounded-lg shadow-2xl overflow-hidden">
        <TerminalHeader tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        
        <div 
          className="bg-vesper-terminal text-white font-mono text-sm overflow-auto"
          style={{ 
            height: '600px',
            contain: 'strict'
          }}
        >
          {renderContent()}
        </div>
      </div>
    </div>
  );
}