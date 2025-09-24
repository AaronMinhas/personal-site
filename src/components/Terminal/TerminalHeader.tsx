import React, { useEffect, useRef, useState } from 'react';

interface Tab {
  id: string;
  title: string;
  filename: string;
}

interface TerminalHeaderProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export default function TerminalHeader({ tabs, activeTab, onTabChange }: TerminalHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const activeTabData = tabs.find((tab) => tab.id === activeTab) ?? tabs[0];
  const inactiveTabs = tabs.filter((tab) => tab.id !== activeTab);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <div className="flex items-center px-2 sm:px-4 py-2" style={{ backgroundColor: '#161616', borderBottom: '1px solid #282828' }}>
      <div className="sm:hidden w-full" ref={menuRef}>
        <button
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="w-full flex items-center justify-between px-3 py-2 rounded-md border border-vesper-border bg-vesper-terminal text-vesper-text text-sm font-medium transition-colors"
        >
          <span className="truncate">{activeTabData?.filename}</span>
          <svg
            className={`h-4 w-4 text-vesper-secondary transition-transform ${isMenuOpen ? 'rotate-180' : ''}`}
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.584l3.71-3.354a.75.75 0 111.02 1.104l-4.25 3.845a.75.75 0 01-1.02 0L5.21 8.334a.75.75 0 01.02-1.124z" clipRule="evenodd" />
          </svg>
        </button>

        {isMenuOpen && (
          <div className="relative">
            <div className="absolute left-0 right-0 mt-2 bg-vesper-terminal border border-vesper-border rounded-md shadow-xl overflow-hidden z-20">
              <div className="px-3 py-2 text-xs uppercase tracking-wide text-vesper-secondary border-b border-vesper-border">
                Switch tab
              </div>
              <div className="divide-y divide-vesper-border/60">
                {inactiveTabs.length === 0 ? (
                  <div className="px-3 py-3 text-sm text-vesper-secondary">All tabs open</div>
                ) : (
                  inactiveTabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        onTabChange(tab.id);
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 text-left text-sm text-vesper-secondary hover:bg-vesper-hover transition-colors"
                    >
                      <span>{tab.filename}</span>
                      <span className="text-xs uppercase tracking-wide text-vesper-accent">Open</span>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="hidden sm:-mx-2 sm:px-2 sm:flex gap-0.5 overflow-x-auto whitespace-nowrap">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-3 py-1.5 sm:py-2.5 rounded-t-md text-sm font-medium transition-all duration-200 flex items-center gap-2 whitespace-nowrap ${
              activeTab === tab.id
                ? 'text-vesper-secondary border-b-2'
                : 'text-vesper-secondary hover:bg-vesper-hover'
            }`}
            style={{
              backgroundColor: activeTab === tab.id ? '#101010' : '#282828',
              borderBottomColor: activeTab === tab.id ? '#FFC799' : 'transparent'
            }}
          >
            <span>{tab.filename}</span>
            <span className="text-vesper-secondary hover:text-vesper-accent cursor-pointer">×</span>
          </button>
        ))}
      </div>
    </div>
  );
}
