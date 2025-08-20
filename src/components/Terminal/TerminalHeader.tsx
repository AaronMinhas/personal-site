import React from 'react';

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
  return (
    <div className="flex items-center px-4 py-2" style={{ backgroundColor: '#161616', borderBottom: '1px solid #282828' }}>
      <div className="flex gap-0.5 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-3 py-1.5 rounded-t-md text-sm font-medium transition-all duration-200 flex items-center gap-2 whitespace-nowrap ${
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