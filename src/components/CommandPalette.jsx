import React, { useState, useEffect } from 'react';
import { 
  Search, Command, Globe, Eye, ShieldAlert, FileText, 
  Target, Volume2, VolumeX, Palette, ArrowRight, X 
} from 'lucide-react';
import { playClick, playBeep } from '../utils/soundEngine';

export default function CommandPalette({ 
  isOpen, 
  onClose, 
  setActiveTab, 
  setTheme, 
  isMuted, 
  onToggleMute,
  onSelectTarget 
}) {
  const [query, setQuery] = useState('');

  // Keybindings listener for Cmd+K / Ctrl+K / '/'
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClose(!isOpen);
      } else if (e.key === '/' && !isOpen && document.activeElement.tagName !== 'INPUT') {
        e.preventDefault();
        onClose(true);
      } else if (e.key === 'Escape' && isOpen) {
        onClose(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const commands = [
    {
      category: 'Navigation',
      items: [
        { id: 'nav-dashboard', label: 'Go to Main Dashboard', icon: Globe, action: () => setActiveTab('dashboard') },
        { id: 'nav-surveillance', label: 'Open Live Surveillance Matrix', icon: Eye, action: () => setActiveTab('surveillance') },
        { id: 'nav-alerts', label: 'Open Tactical Alerts Log', icon: ShieldAlert, action: () => setActiveTab('alerts') },
        { id: 'nav-reporting', label: 'Open Intelligence Dossier Builder', icon: FileText, action: () => setActiveTab('reporting') },
        { id: 'nav-campaigns', label: 'Open Active Campaigns Timeline', icon: Target, action: () => setActiveTab('campaigns') },
      ]
    },
    {
      category: 'Target Dossiers',
      items: [
        { 
          id: 'target-marcus', 
          label: 'View Dossier: Marcus Thompson', 
          icon: Target, 
          action: () => onSelectTarget({ id: 'marcus', name: 'Marcus Thompson', category: 'High Threat Level' }) 
        },
        { 
          id: 'target-david', 
          label: 'View Dossier: David Richardson', 
          icon: Target, 
          action: () => onSelectTarget({ id: 'david', name: 'David Richardson', category: 'Under Surveillance' }) 
        },
      ]
    },
    {
      category: 'Theme & Customization',
      items: [
        { id: 'theme-midnight', label: 'Theme: Midnight Cyan (Default)', icon: Palette, action: () => setTheme('midnight') },
        { id: 'theme-amber', label: 'Theme: Tactical Cyber Amber', icon: Palette, action: () => setTheme('amber') },
        { id: 'theme-stealth', label: 'Theme: Stealth Obsidian', icon: Palette, action: () => setTheme('stealth') },
        { id: 'theme-crimson', label: 'Theme: Emergency Crimson Alert', icon: Palette, action: () => setTheme('crimson') },
      ]
    },
    {
      category: 'System Audio',
      items: [
        { 
          id: 'audio-toggle', 
          label: isMuted ? 'Unmute Tactical UI Sounds' : 'Mute Tactical UI Sounds', 
          icon: isMuted ? VolumeX : Volume2, 
          action: () => onToggleMute() 
        },
      ]
    }
  ];

  const filteredCommands = commands.map(group => ({
    ...group,
    items: group.items.filter(item => item.label.toLowerCase().includes(query.toLowerCase()))
  })).filter(group => group.items.length > 0);

  const executeCommand = (cmdAction) => {
    playClick();
    cmdAction();
    onClose(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/80 backdrop-blur-md px-4 animate-in fade-in">
      <div className="w-full max-w-xl bg-[#0b0e14] border border-cyan-500/50 rounded-2xl shadow-[0_0_50px_rgba(0,242,254,0.25)] overflow-hidden font-mono">
        
        {/* Search Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3 bg-[#0f131c]">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search targets..."
            autoFocus
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none font-sans font-semibold"
          />
          <button 
            onClick={() => onClose(false)}
            className="p-1 rounded text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Command Options List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-3">
          {filteredCommands.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500">
              No matching tactical commands found.
            </div>
          ) : (
            filteredCommands.map((group) => (
              <div key={group.category}>
                <div className="px-3 py-1 text-[10px] font-extrabold text-cyan-400 uppercase tracking-widest">
                  {group.category}
                </div>
                <div className="mt-1 space-y-0.5">
                  {group.items.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => executeCommand(item.action)}
                        className="w-full px-3 py-2 rounded-lg flex items-center justify-between text-xs text-slate-200 hover:bg-slate-800 hover:text-white transition-all group text-left"
                      >
                        <div className="flex items-center gap-2.5">
                          <IconComponent className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                          <span className="font-semibold">{item.label}</span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-cyan-400 transition-opacity" />
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Hint */}
        <div className="px-4 py-2 bg-[#080a0f] border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-500">
          <div className="flex items-center gap-2">
            <span>Use <kbd className="px-1 py-0.5 bg-slate-800 rounded text-slate-300">↑</kbd> <kbd className="px-1 py-0.5 bg-slate-800 rounded text-slate-300">↓</kbd> to navigate</span>
            <span>•</span>
            <span><kbd className="px-1 py-0.5 bg-slate-800 rounded text-slate-300">ESC</kbd> to exit</span>
          </div>
          <span className="text-cyan-400 font-bold">ARION COMMAND K</span>
        </div>

      </div>
    </div>
  );
}
