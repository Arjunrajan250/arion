import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, Eye, FileText, Globe, Palette, Search, ShieldAlert, Target, Volume2, VolumeX, X, Terminal, Radio } from 'lucide-react';
import { playClick } from '../utils/soundEngine';

export default function CommandPalette({ isOpen, onClose, setActiveTab, setTheme, isMuted, onToggleMute, onSelectTarget }) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const target = event.target;
      const isTyping = ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable;
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        onClose(!isOpen);
      } else if ((event.key === '/' || ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'p')) && !isOpen && !isTyping) {
        event.preventDefault();
        onClose(true);
      } else if (event.key === 'Escape' && isOpen) {
        onClose(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setActiveIndex(0);
      window.requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [isOpen]);

  const commands = useMemo(() => [
    {
      category: 'Navigate Operations',
      items: [
        { id: 'nav-dashboard', label: 'Operations Overview', icon: Globe, detail: 'Main telemetry & threat overview', action: () => setActiveTab('dashboard') },
        { id: 'nav-surveillance', label: 'Surveillance Matrix', icon: Eye, detail: 'Citywide CCTV and optical streams', action: () => setActiveTab('surveillance') },
        { id: 'nav-cybercommand', label: 'Cyber Command (I4C)', icon: ShieldAlert, detail: 'Mule accounts & financial forensics', action: () => setActiveTab('cybercommand') },
        { id: 'nav-livefeed', label: 'Live Camera Network & ANPR', icon: Radio, detail: 'Plate recognition & facial matching', action: () => setActiveTab('livefeed') },
        { id: 'nav-alerts', label: 'Incident Response & Alerts', icon: ShieldAlert, detail: 'Active dispatch queue & sirens', action: () => setActiveTab('alerts') },
        { id: 'nav-reporting', label: 'Intelligence Reports & Dossiers', icon: FileText, detail: 'Classified cases & print dossiers', action: () => setActiveTab('reporting') },
        { id: 'nav-campaigns', label: 'Active Defense Campaigns', icon: Target, detail: 'Operation timeline & objectives', action: () => setActiveTab('campaigns') },
      ],
    },
    {
      category: 'Target Dossiers',
      items: [
        { id: 'target-alnami', label: 'Alnami · P-2204-02', icon: Target, detail: 'Critical Anomaly // Crosswalk Alpha', action: () => onSelectTarget({ id: 'target-alnami', name: 'Alnami (P-2204-02)', category: 'Critical Anomaly', mugshot: '/assets/suspect_face_scan.jpg' }) },
        { id: 'target-elena', label: 'Elena Rostova · 4783-9A', icon: Target, detail: 'Confirmed Subject // PTZ Dome 4th', action: () => onSelectTarget({ id: 'target-elena', name: 'Elena Rostova (4783-9A)', category: 'Confirmed Subject', mugshot: '/assets/suspect_face_scan.jpg' }) },
        { id: 'target-marcus', label: 'Marcus Thompson', icon: Target, detail: 'High Threat // Perimeter Breach', action: () => onSelectTarget({ id: 'marcus', name: 'Marcus Thompson', category: 'High Threat Level', mugshot: '/assets/marcus_thompson.png' }) },
        { id: 'target-david', label: 'David Richardson', icon: Target, detail: 'Under Surveillance // Sector 4', action: () => onSelectTarget({ id: 'david', name: 'David Richardson', category: 'Under Surveillance', mugshot: '/assets/david_richardson.png' }) },
      ],
    },
    {
      category: 'Preferences & Audio',
      items: [
        { id: 'theme-cyan', label: 'Theme: Arctic Cyan (Default)', icon: Palette, detail: 'High-tech military HUD cyan', action: () => setTheme('cyan') },
        { id: 'theme-cyberhud', label: 'Theme: Sentinel Green', icon: Palette, detail: 'Tactical phosphor radar emerald', action: () => setTheme('cyberhud') },
        { id: 'theme-cybercrime', label: 'Theme: Crimson Alert', icon: Palette, detail: 'DEFCON 1 critical strike red', action: () => setTheme('cybercrime') },
        { id: 'theme-vintage', label: 'Theme: Steel Blue', icon: Palette, detail: 'Classic naval command matrix', action: () => setTheme('vintage') },
        { id: 'theme-amber', label: 'Theme: Thermal Amber', icon: Palette, detail: 'FLIR optics & night ops amber', action: () => setTheme('amber') },
        { id: 'audio-toggle', label: isMuted ? 'Unmute Interface Audio Engine' : 'Mute Interface Audio Engine', icon: isMuted ? VolumeX : Volume2, detail: 'Synthesized cyber audio telemetry', action: onToggleMute },
      ],
    },
  ], [isMuted, onSelectTarget, onToggleMute, setActiveTab, setTheme]);

  const filteredCommands = commands.map((group) => ({
    ...group,
    items: group.items.filter((item) => `${item.label} ${item.detail || ''} ${group.category}`.toLowerCase().includes(query.trim().toLowerCase())),
  })).filter((group) => group.items.length > 0);
  const flatCommands = filteredCommands.flatMap((group) => group.items);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    document.getElementById(`command-option-${activeIndex}`)?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  if (!isOpen) return null;

  const executeCommand = (command) => {
    if (!command) return;
    playClick();
    command.action();
    onClose(false);
  };

  const handleSearchKeyDown = (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((index) => flatCommands.length ? (index + 1) % flatCommands.length : 0);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((index) => flatCommands.length ? (index - 1 + flatCommands.length) % flatCommands.length : 0);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      executeCommand(flatCommands[activeIndex]);
    }
  };

  let optionIndex = -1;

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center bg-slate-950/80 px-3 pt-[8vh] backdrop-blur-md sm:px-4 sm:pt-[12vh]" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(false); }}>
      <div className="tactical-corner w-full max-w-2xl overflow-hidden rounded-2xl border border-cyan-500/40 bg-[#080d17]/98 shadow-[0_20px_60px_rgba(0,0,0,0.95)]" role="dialog" aria-modal="true" aria-label="Command palette">
        
        {/* Top Search Input */}
        <div className="flex items-center gap-3 border-b border-white/[0.08] px-4 py-3.5 bg-[#0a101f]">
          <Terminal className="h-5 w-5 shrink-0 text-cyan-400" aria-hidden="true" />
          <label htmlFor="command-search" className="sr-only">Search commands and targets</label>
          <input
            ref={inputRef}
            id="command-search"
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder="Type directive, view name, target, or theme…"
            autoComplete="off"
            role="combobox"
            aria-expanded="true"
            aria-controls="command-results"
            aria-activedescendant={flatCommands.length ? `command-option-${activeIndex}` : undefined}
            className="min-w-0 flex-1 bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none font-mono"
          />
          <button type="button" onClick={() => onClose(false)} className="rounded-lg p-1.5 text-slate-400 hover:bg-white/[0.08] hover:text-white transition-all" aria-label="Close command palette">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Quick Filter Directives */}
        <div className="flex items-center gap-1.5 px-4 py-2 bg-black/40 border-b border-white/[0.05] overflow-x-auto no-scrollbar font-mono text-[10px]">
          <span className="text-slate-500 uppercase tracking-wider mr-1">QUICK:</span>
          {['Overview', 'Surveillance', 'Cyber', 'Alnami', 'Elena', 'Cyan', 'Alert'].map((keyword) => (
            <button
              key={keyword}
              onClick={() => setQuery(keyword)}
              className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-300 hover:border-cyan-500/50 transition-all"
            >
              {keyword}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div id="command-results" className="max-h-[55vh] overflow-y-auto p-2.5 custom-scrollbar" role="listbox" aria-label="Available commands">
          {flatCommands.length === 0 ? (
            <div className="px-4 py-12 text-center">
              <Search className="mx-auto mb-3 h-6 w-6 text-slate-600" />
              <p className="text-sm text-slate-400 font-mono">No matching tactical directives</p>
              <p className="mt-1 text-xs text-slate-600 font-mono">Try searching for a view, suspect name, or color theme.</p>
            </div>
          ) : filteredCommands.map((group) => (
            <div key={group.category} className="mb-2.5 last:mb-0">
              <p className="px-3 pb-1.5 pt-2 text-[10px] font-mono font-bold uppercase tracking-[0.16em] text-cyan-400/80">{group.category}</p>
              {group.items.map((item) => {
                optionIndex += 1;
                const index = optionIndex;
                const Icon = item.icon;
                const isActive = index === activeIndex;
                return (
                  <button
                    id={`command-option-${index}`}
                    key={item.id}
                    type="button"
                    role="option"
                    aria-selected={isActive}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => executeCommand(item)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-left transition-all ${
                      isActive 
                        ? 'bg-cyan-500/15 border border-cyan-500/40 text-white shadow-[0_0_15px_rgba(0,242,254,0.15)]' 
                        : 'border border-transparent text-slate-300 hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className={`p-2 rounded-lg shrink-0 ${isActive ? 'bg-cyan-500 text-black' : 'bg-slate-900 text-slate-400 border border-slate-800'}`}>
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs sm:text-sm font-bold truncate font-sans">{item.label}</div>
                      {item.detail && (
                        <div className="text-[10px] text-slate-400 truncate font-mono mt-0.5">{item.detail}</div>
                      )}
                    </div>
                    <ArrowRight className={`h-4 w-4 shrink-0 transition-transform ${isActive ? 'text-cyan-400 translate-x-1' : 'text-slate-600'}`} aria-hidden="true" />
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between border-t border-white/[0.08] bg-[#070b13] px-4 py-2.5 text-[10px] text-slate-400 font-mono">
          <div className="flex items-center gap-3">
            <span><kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 mr-1">↑↓</kbd> Navigate</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 mr-1">↵</kbd> Execute</span>
          </div>
          <span><kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 mr-1">ESC</kbd> Close</span>
        </div>
      </div>
    </div>
  );
}
