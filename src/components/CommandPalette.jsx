import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, Eye, FileText, Globe, Palette, Search, ShieldAlert, Target, Volume2, VolumeX, X } from 'lucide-react';
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
      category: 'Navigate',
      items: [
        { id: 'nav-dashboard', label: 'Operations overview', icon: Globe, action: () => setActiveTab('dashboard') },
        { id: 'nav-surveillance', label: 'Surveillance matrix', icon: Eye, action: () => setActiveTab('surveillance') },
        { id: 'nav-cybercommand', label: 'Cyber command', icon: ShieldAlert, action: () => setActiveTab('cybercommand') },
        { id: 'nav-livefeed', label: 'Live camera network', icon: Eye, action: () => setActiveTab('livefeed') },
        { id: 'nav-alerts', label: 'Incident response and alerts', icon: ShieldAlert, action: () => setActiveTab('alerts') },
        { id: 'nav-reporting', label: 'Intelligence reports', icon: FileText, action: () => setActiveTab('reporting') },
        { id: 'nav-campaigns', label: 'Active campaigns', icon: Target, action: () => setActiveTab('campaigns') },
      ],
    },
    {
      category: 'Target dossiers',
      items: [
        { id: 'target-alnami', label: 'Alnami · P-2204-02', icon: Target, action: () => onSelectTarget({ id: 'target-alnami', name: 'Alnami (P-2204-02)', category: 'Critical Anomaly', mugshot: '/assets/suspect_face_scan.jpg' }) },
        { id: 'target-elena', label: 'Elena Rostova · 4783-9A', icon: Target, action: () => onSelectTarget({ id: 'target-elena', name: 'Elena Rostova (4783-9A)', category: 'Confirmed Subject', mugshot: '/assets/suspect_face_scan.jpg' }) },
        { id: 'target-marcus', label: 'Marcus Thompson', icon: Target, action: () => onSelectTarget({ id: 'marcus', name: 'Marcus Thompson', category: 'High Threat Level', mugshot: '/assets/marcus_thompson.png' }) },
        { id: 'target-david', label: 'David Richardson', icon: Target, action: () => onSelectTarget({ id: 'david', name: 'David Richardson', category: 'Under Surveillance', mugshot: '/assets/david_richardson.png' }) },
      ],
    },
    {
      category: 'Preferences',
      items: [
        { id: 'theme-cyberhud', label: 'Use sentinel green theme', icon: Palette, action: () => setTheme('cyberhud') },
        { id: 'theme-cybercrime', label: 'Use crimson alert theme', icon: Palette, action: () => setTheme('cybercrime') },
        { id: 'theme-cyan', label: 'Use arctic cyan theme', icon: Palette, action: () => setTheme('cyan') },
        { id: 'theme-vintage', label: 'Use steel blue theme', icon: Palette, action: () => setTheme('vintage') },
        { id: 'theme-amber', label: 'Use thermal amber theme', icon: Palette, action: () => setTheme('amber') },
        { id: 'audio-toggle', label: isMuted ? 'Unmute interface sounds' : 'Mute interface sounds', icon: isMuted ? VolumeX : Volume2, action: onToggleMute },
      ],
    },
  ], [isMuted, onSelectTarget, onToggleMute, setActiveTab, setTheme]);

  const filteredCommands = commands.map((group) => ({
    ...group,
    items: group.items.filter((item) => `${item.label} ${group.category}`.toLowerCase().includes(query.trim().toLowerCase())),
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
    <div className="fixed inset-0 z-[70] flex items-start justify-center bg-slate-950/75 px-3 pt-[8vh] backdrop-blur-sm sm:px-4 sm:pt-[12vh]" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(false); }}>
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-[#0b1018] shadow-2xl shadow-black/70" role="dialog" aria-modal="true" aria-label="Command palette">
        <div className="flex items-center gap-3 border-b border-white/[0.07] px-4 py-3.5">
          <Search className="h-5 w-5 shrink-0 text-cyan-400" aria-hidden="true" />
          <label htmlFor="command-search" className="sr-only">Search commands and targets</label>
          <input
            ref={inputRef}
            id="command-search"
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder="Search views, targets, or actions…"
            autoComplete="off"
            role="combobox"
            aria-expanded="true"
            aria-controls="command-results"
            aria-activedescendant={flatCommands.length ? `command-option-${activeIndex}` : undefined}
            className="min-w-0 flex-1 bg-transparent text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none"
          />
          <button type="button" onClick={() => onClose(false)} className="rounded-md p-1.5 text-slate-500 hover:bg-white/[0.05] hover:text-white" aria-label="Close command palette">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div id="command-results" className="max-h-[55vh] overflow-y-auto p-2" role="listbox" aria-label="Available commands">
          {flatCommands.length === 0 ? (
            <div className="px-4 py-12 text-center">
              <Search className="mx-auto mb-3 h-6 w-6 text-slate-700" />
              <p className="text-sm text-slate-400">No matching commands</p>
              <p className="mt-1 text-xs text-slate-600">Try a view, target name, or theme.</p>
            </div>
          ) : filteredCommands.map((group) => (
            <div key={group.category} className="mb-2 last:mb-0">
              <p className="px-3 pb-1.5 pt-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-600">{group.category}</p>
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
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${isActive ? 'bg-cyan-400/[0.09] text-cyan-100' : 'text-slate-300 hover:bg-white/[0.04]'}`}
                  >
                    <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-600'}`} aria-hidden="true" />
                    <span className="flex-1 text-xs font-medium sm:text-sm">{item.label}</span>
                    <ArrowRight className={`h-3.5 w-3.5 ${isActive ? 'text-cyan-500' : 'text-slate-700'}`} aria-hidden="true" />
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-white/[0.07] bg-black/10 px-4 py-2.5 text-[10px] text-slate-600">
          <div className="flex items-center gap-3">
            <span><kbd className="mr-1 text-slate-400">↑↓</kbd> Navigate</span>
            <span><kbd className="mr-1 text-slate-400">↵</kbd> Select</span>
          </div>
          <span><kbd className="mr-1 text-slate-400">esc</kbd> Close</span>
        </div>
      </div>
    </div>
  );
}
