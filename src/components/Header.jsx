import React, { useEffect, useRef, useState } from 'react';
import {
  AudioLines,
  Bell,
  Check,
  ChevronDown,
  Command,
  FileText,
  Lock,
  Mic,
  MicOff,
  Network,
  Palette,
  RadioTower,
  Search,
  Terminal,
  User,
  Volume2,
  VolumeX,
  Wrench,
  X,
} from 'lucide-react';
import { playClick } from '../utils/soundEngine';

const themes = [
  { id: 'cyberhud', label: 'Sentinel green', color: '#34d399' },
  { id: 'cybercrime', label: 'Crimson alert', color: '#f87171' },
  { id: 'cyan', label: 'Arctic cyan', color: '#22d3ee' },
  { id: 'vintage', label: 'Steel blue', color: '#60a5fa' },
  { id: 'amber', label: 'Thermal amber', color: '#fbbf24' },
];

function IconButton({ label, onClick, active = false, children, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-colors ${
        active
          ? 'border-cyan-400/30 bg-cyan-400/10 text-cyan-300'
          : 'border-transparent text-slate-400 hover:border-white/[0.08] hover:bg-white/[0.05] hover:text-slate-100'
      } ${className}`}
      aria-label={label}
      title={label}
    >
      {children}
    </button>
  );
}

export default function Header({
  setActiveTab,
  alertCount = 8,
  onToggleSplash,
  onOpenCmdPalette,
  isMuted,
  onToggleMute,
  currentTheme,
  setTheme,
  isVoiceActive,
  onToggleVoice,
  onOpenTerminal,
  onOpenGraph,
  onOpenDispatch,
  onOpenAudio,
  onOpenPdf,
  onOpenProfile,
}) {
  const [openMenu, setOpenMenu] = useState(null);
  const headerRef = useRef(null);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) setOpenMenu(null);
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setOpenMenu(null);
    };
    document.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const toggleMenu = (menu) => {
    playClick();
    setOpenMenu((current) => (current === menu ? null : menu));
  };

  const runAction = (action) => {
    playClick();
    setOpenMenu(null);
    action?.();
  };

  const tools = [
    { label: 'Dispatch response unit', description: 'Deploy a tactical response team', icon: RadioTower, action: onOpenDispatch },
    { label: 'Intelligence graph', description: 'Explore linked targets and signals', icon: Network, action: onOpenGraph },
    { label: 'Cyber terminal', description: 'Open the ARION command line', icon: Terminal, action: onOpenTerminal },
    { label: 'Dossier preview', description: 'Review and print a classified report', icon: FileText, action: onOpenPdf },
    { label: 'Intercept transcript lab', description: 'Review a simulated decoded transmission', icon: AudioLines, action: onOpenAudio },
    { label: isVoiceActive ? 'Disable voice control' : 'Enable voice control', description: 'Hands-free console navigation', icon: isVoiceActive ? Mic : MicOff, action: onToggleVoice },
  ];

  return (
    <header ref={headerRef} className="relative z-40 flex h-[68px] shrink-0 items-center gap-3 border-b border-white/[0.07] bg-[#080c13]/95 px-3 backdrop-blur-xl sm:px-5 lg:px-6">
      <button
        type="button"
        onClick={() => runAction(() => setActiveTab('dashboard'))}
        className="group flex shrink-0 items-center gap-3 rounded-lg text-left"
        aria-label="Go to ARION overview"
      >
        <span className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-400/25 bg-cyan-400/[0.08] text-cyan-300 transition-colors group-hover:border-cyan-400/50">
          <svg viewBox="0 0 40 24" className="h-4 w-7 fill-current" aria-hidden="true">
            <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="2.5" />
            <circle cx="25" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="2.5" />
          </svg>
        </span>
        <span className="hidden sm:block">
          <span className="block text-[15px] font-bold tracking-[0.22em] text-slate-100">ARION</span>
          <span className="mt-0.5 block text-[9px] font-medium uppercase tracking-[0.13em] text-slate-600">Intelligence OS</span>
        </span>
      </button>

      <div className="mx-2 hidden h-7 w-px bg-white/[0.07] md:block" />
      <div className="hidden min-w-0 md:block">
        <p className="truncate text-sm font-medium text-slate-300">City operations center</p>
        <p className="mt-0.5 flex items-center gap-1.5 text-[10px] text-slate-600">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Secure channel · Sector HJ-66
        </p>
      </div>

      <div className="ml-auto flex min-w-0 items-center gap-1 sm:gap-1.5">
        <button
          type="button"
          onClick={() => runAction(onOpenCmdPalette)}
          className="mr-1 flex h-9 min-w-0 items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.025] px-2.5 text-slate-500 transition-colors hover:border-cyan-400/25 hover:bg-cyan-400/[0.04] hover:text-slate-300 sm:w-48 lg:w-60"
          aria-label="Search or open command palette"
        >
          <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span className="hidden flex-1 truncate text-left text-xs sm:block">Search command center</span>
          <kbd className="hidden rounded border border-white/[0.08] bg-black/20 px-1.5 py-0.5 font-mono text-[9px] text-slate-600 lg:block">⌘ K</kbd>
        </button>

        <IconButton label={`Open alerts (${alertCount} active)`} onClick={() => runAction(() => setActiveTab('alerts'))} className="relative hidden sm:flex">
          <Bell className="h-[18px] w-[18px]" />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-red-400" />
        </IconButton>

        <IconButton label={isMuted ? 'Unmute interface sounds' : 'Mute interface sounds'} onClick={() => runAction(onToggleMute)} className="hidden xl:flex">
          {isMuted ? <VolumeX className="h-[18px] w-[18px]" /> : <Volume2 className="h-[18px] w-[18px]" />}
        </IconButton>

        <IconButton
          label={isVoiceActive ? 'Disable voice control' : 'Enable voice control'}
          active={isVoiceActive}
          onClick={() => runAction(onToggleVoice)}
          className="hidden xl:flex"
        >
          {isVoiceActive ? <Mic className="h-[18px] w-[18px]" /> : <MicOff className="h-[18px] w-[18px]" />}
        </IconButton>

        <button
          type="button"
          onClick={() => runAction(onOpenDispatch)}
          className="ml-1 hidden h-9 items-center gap-2 rounded-lg bg-cyan-400 px-3.5 text-xs font-semibold text-slate-950 transition-colors hover:bg-cyan-300 md:flex"
        >
          <RadioTower className="h-4 w-4" aria-hidden="true" />
          Dispatch
        </button>

        <div className="relative">
          <IconButton label="Open operations tools" active={openMenu === 'tools'} onClick={() => toggleMenu('tools')}>
            <Wrench className="h-[18px] w-[18px]" />
          </IconButton>
          {openMenu === 'tools' && (
            <div className="absolute right-0 top-12 w-72 rounded-xl border border-white/10 bg-[#0d121c] p-2 shadow-2xl shadow-black/60">
              <div className="flex items-center justify-between px-2 pb-2 pt-1">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-600">Operations tools</p>
                <button type="button" onClick={() => setOpenMenu(null)} className="text-slate-600 hover:text-slate-300" aria-label="Close tools menu"><X className="h-3.5 w-3.5" /></button>
              </div>
              {tools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <button key={tool.label} type="button" onClick={() => runAction(tool.action)} className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2.5 text-left transition-colors hover:bg-white/[0.05]">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] text-cyan-400"><Icon className="h-4 w-4" /></span>
                    <span className="min-w-0">
                      <span className="block text-xs font-medium text-slate-200">{tool.label}</span>
                      <span className="mt-0.5 block truncate text-[10px] text-slate-600">{tool.description}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="relative">
          <IconButton label="Change interface theme" active={openMenu === 'theme'} onClick={() => toggleMenu('theme')}>
            <Palette className="h-[18px] w-[18px]" />
          </IconButton>
          {openMenu === 'theme' && (
            <div className="absolute right-0 top-12 w-56 rounded-xl border border-white/10 bg-[#0d121c] p-2 shadow-2xl shadow-black/60">
              <p className="px-2 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-600">Interface theme</p>
              {themes.map((theme) => (
                <button key={theme.id} type="button" onClick={() => runAction(() => setTheme(theme.id))} className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-xs text-slate-300 hover:bg-white/[0.05]">
                  <span className="h-3 w-3 rounded-full border border-white/20" style={{ backgroundColor: theme.color }} />
                  <span className="flex-1">{theme.label}</span>
                  {currentTheme === theme.id && <Check className="h-3.5 w-3.5 text-cyan-400" />}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative ml-1 border-l border-white/[0.07] pl-2 sm:pl-3">
          <button
            type="button"
            onClick={() => toggleMenu('profile')}
            className="flex items-center gap-2 rounded-lg p-1 transition-colors hover:bg-white/[0.04]"
            aria-label="Open operator menu"
            aria-expanded={openMenu === 'profile'}
          >
            <img src="/assets/robert_mitchell.png" alt="" className="h-8 w-8 rounded-lg border border-white/10 object-cover" />
            <span className="hidden text-left 2xl:block">
              <span className="block text-xs font-medium text-slate-200">R. Mitchell</span>
              <span className="mt-0.5 block text-[9px] text-slate-600">Duty commander</span>
            </span>
            <ChevronDown className="hidden h-3.5 w-3.5 text-slate-600 2xl:block" />
          </button>
          {openMenu === 'profile' && (
            <div className="absolute right-0 top-12 w-56 rounded-xl border border-white/10 bg-[#0d121c] p-2 shadow-2xl shadow-black/60">
              <div className="border-b border-white/[0.07] px-2.5 pb-3 pt-1">
                <p className="text-sm font-medium text-slate-100">Robert Mitchell</p>
                <p className="mt-1 text-[10px] text-slate-500">Duty commander · Level 5</p>
              </div>
              <button type="button" onClick={() => runAction(onOpenProfile)} className="mt-2 flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs text-slate-300 hover:bg-white/[0.05]"><User className="h-4 w-4 text-slate-500" />Operator dossier</button>
              <button type="button" onClick={() => runAction(onOpenCmdPalette)} className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs text-slate-300 hover:bg-white/[0.05]"><Command className="h-4 w-4 text-slate-500" />Command palette</button>
              <button type="button" onClick={() => runAction(onToggleSplash)} className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs text-red-300 hover:bg-red-500/10"><Lock className="h-4 w-4" />Lock console</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
