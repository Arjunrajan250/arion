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
  Shield,
  Terminal,
  User,
  Volume2,
  VolumeX,
  Wrench,
  X,
} from 'lucide-react';
import { playClick } from '../utils/soundEngine';

const themes = [
  { id: 'cyberhud', label: 'Sentinel green', color: '#34d399', desc: 'HUD Night Ops' },
  { id: 'cybercrime', label: 'Crimson alert', color: '#f87171', desc: 'DEFCON 1 Threat' },
  { id: 'cyan', label: 'Arctic cyan', color: '#22d3ee', desc: 'Standard Defense OS' },
  { id: 'vintage', label: 'Steel blue', color: '#60a5fa', desc: 'Tactical Recon' },
  { id: 'amber', label: 'Thermal amber', color: '#fbbf24', desc: 'FLIR Thermography' },
  { id: 'midnight', label: 'Midnight neon', color: '#818cf8', desc: 'Covert Deep Black' },
  { id: 'stealth', label: 'Stealth slate', color: '#cbd5e1', desc: 'Low Signature' },
];

function IconButton({ label, onClick, active = false, children, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-all duration-150 ${
        active
          ? 'border-[var(--theme-accent)] bg-[var(--theme-glow)] text-[var(--theme-accent)] shadow-[0_0_12px_var(--theme-glow)]'
          : 'border-white/[0.08] bg-white/[0.02] text-slate-400 hover:border-white/20 hover:bg-white/[0.06] hover:text-slate-100'
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
    { label: 'Dispatch tactical unit', description: 'Deploy SWAT / drone response teams', icon: RadioTower, action: onOpenDispatch },
    { label: 'Intelligence network graph', description: 'Explore linked suspects & signal intercepts', icon: Network, action: onOpenGraph },
    { label: 'Cyber terminal CLI', description: 'Interactive command line console', icon: Terminal, action: onOpenTerminal },
    { label: 'Classified dossier PDF', description: 'Generate & print full report', icon: FileText, action: onOpenPdf },
    { label: 'Signal intercept lab', description: 'Review encrypted radio transcripts', icon: AudioLines, action: onOpenAudio },
    { label: isVoiceActive ? 'Deactivate voice control' : 'Activate voice control', description: 'Hands-free voice recognition', icon: isVoiceActive ? Mic : MicOff, action: onToggleVoice },
  ];

  return (
    <header ref={headerRef} className="relative z-40 flex h-[68px] shrink-0 items-center gap-3 border-b border-white/[0.08] bg-[#060910]/95 px-3 backdrop-blur-xl sm:px-5 lg:px-6">
      {/* Brand & System Logo */}
      <button
        type="button"
        onClick={() => runAction(() => setActiveTab('dashboard'))}
        className="group flex shrink-0 items-center gap-3 rounded-xl text-left transition-transform duration-200 hover:scale-[1.02]"
        aria-label="Go to ARION overview"
      >
        <span className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--theme-accent)] bg-[var(--theme-glow)] text-[var(--theme-accent)] shadow-[0_0_15px_var(--theme-glow)] transition-colors">
          <div className="animate-reticle-slow pointer-events-none absolute inset-0 rounded-xl border border-dashed border-[var(--theme-accent)] opacity-40" />
          <svg viewBox="0 0 40 24" className="h-4 w-7 fill-current drop-shadow-[0_0_8px_var(--theme-accent)]" aria-hidden="true">
            <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="2.5" />
            <circle cx="25" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="2.5" />
          </svg>
        </span>
        <div className="hidden sm:block">
          <div className="flex items-center gap-1.5">
            <span className="font-tech text-base font-black tracking-[0.2em] text-white">ARION</span>
            <span className="rounded bg-[var(--theme-glow)] px-1 py-0.2 font-mono text-[9px] font-bold text-[var(--theme-accent)]">v4.8</span>
          </div>
          <span className="block font-mono text-[9px] uppercase tracking-wider text-slate-500">Defense Intelligence OS</span>
        </div>
      </button>

      {/* Telemetry Status Center (Desktop) */}
      <div className="mx-2 hidden h-7 w-px bg-white/[0.08] md:block" />
      <div className="hidden min-w-0 md:flex md:items-center md:gap-4 font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
          </span>
          <div>
            <p className="truncate text-xs font-semibold text-slate-200">Sector HJ-66 Matrix</p>
            <p className="text-[10px] text-slate-500">4/4 Nodes · 22ms Ping</p>
          </div>
        </div>

        <div className="hidden xl:flex items-center gap-1.5 rounded-lg border border-red-500/25 bg-red-500/10 px-2.5 py-1 text-[10px] font-bold text-red-400">
          <Shield className="h-3 w-3 animate-pulse" />
          <span>DEFCON 2 ARMED</span>
        </div>
      </div>

      {/* Right Actions & Utilities */}
      <div className="ml-auto flex min-w-0 items-center gap-1 sm:gap-2">
        {/* Command Search Palette Trigger */}
        <button
          type="button"
          onClick={() => runAction(onOpenCmdPalette)}
          className="group mr-1 flex h-9 min-w-0 items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.025] px-3 text-slate-400 transition-all hover:border-[var(--theme-accent)] hover:bg-[var(--theme-glow)] hover:text-white sm:w-48 lg:w-60"
          aria-label="Search or open command palette"
        >
          <Search className="h-3.5 w-3.5 shrink-0 text-slate-400 group-hover:text-[var(--theme-accent)]" aria-hidden="true" />
          <span className="hidden flex-1 truncate text-left text-xs sm:block font-mono">Quick commands...</span>
          <kbd className="hidden rounded border border-white/10 bg-black/40 px-1.5 py-0.5 font-mono text-[9px] text-slate-400 lg:block">⌘K</kbd>
        </button>

        {/* Alerts Bell Badge */}
        <IconButton
          label={`Open alerts (${alertCount} active)`}
          onClick={() => runAction(() => setActiveTab('alerts'))}
          className="relative hidden sm:flex"
        >
          <Bell className="h-[18px] w-[18px]" />
          {alertCount > 0 && (
            <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
            </span>
          )}
        </IconButton>

        {/* Audio Engine Button with Visualizer Equalizer */}
        <button
          type="button"
          onClick={() => runAction(onToggleMute)}
          className={`flex h-9 items-center gap-1.5 rounded-lg border px-2.5 transition-all ${
            !isMuted
              ? 'border-cyan-400/30 bg-cyan-400/[0.08] text-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.15)]'
              : 'border-white/[0.08] bg-white/[0.02] text-slate-500 hover:text-slate-300'
          }`}
          title={isMuted ? 'Interface sounds muted (click to enable)' : 'Interface sounds active'}
          aria-label={isMuted ? 'Unmute interface sounds' : 'Mute interface sounds'}
        >
          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4 animate-pulse" />}
          {/* Animated Mini Equalizer Bars */}
          {!isMuted ? (
            <div className="flex items-end gap-0.5 h-3">
              <span className="w-0.5 bg-cyan-400 rounded-full animate-[equalizerBar_0.8s_ease-in-out_infinite]" />
              <span className="w-0.5 bg-cyan-400 rounded-full animate-[equalizerBar_1.1s_ease-in-out_0.2s_infinite]" />
              <span className="w-0.5 bg-cyan-400 rounded-full animate-[equalizerBar_0.9s_ease-in-out_0.4s_infinite]" />
            </div>
          ) : (
            <div className="flex items-end gap-0.5 h-3 opacity-40">
              <span className="w-0.5 h-1 bg-slate-500 rounded-full" />
              <span className="w-0.5 h-1 bg-slate-500 rounded-full" />
              <span className="w-0.5 h-1 bg-slate-500 rounded-full" />
            </div>
          )}
        </button>

        {/* Voice Control Button */}
        <IconButton
          label={isVoiceActive ? 'Voice listening active (click to deactivate)' : 'Activate voice navigation'}
          active={isVoiceActive}
          onClick={() => runAction(onToggleVoice)}
          className="hidden xl:flex"
        >
          {isVoiceActive ? <Mic className="h-[18px] w-[18px] animate-pulse text-red-400" /> : <MicOff className="h-[18px] w-[18px]" />}
        </IconButton>

        {/* Fast Dispatch Button */}
        <button
          type="button"
          onClick={() => runAction(onOpenDispatch)}
          className="ml-1 hidden h-9 items-center gap-2 rounded-lg bg-[var(--theme-accent)] px-3 text-xs font-tech font-bold uppercase tracking-wider text-slate-950 shadow-[0_0_15px_var(--theme-glow)] transition-all hover:brightness-110 active:scale-95 md:flex"
        >
          <RadioTower className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Dispatch</span>
        </button>

        {/* Tools Menu Dropdown */}
        <div className="relative">
          <IconButton label="Open operations tools" active={openMenu === 'tools'} onClick={() => toggleMenu('tools')}>
            <Wrench className="h-[18px] w-[18px]" />
          </IconButton>
          {openMenu === 'tools' && (
            <div className="tactical-corner absolute right-0 top-12 z-50 w-72 rounded-xl border border-white/10 bg-[#090d16] p-2 shadow-2xl shadow-black/80 backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-white/[0.08] px-2.5 pb-2 pt-1 font-mono text-[10px]">
                <span className="font-semibold uppercase tracking-wider text-slate-400">OPERATIONS TOOLS</span>
                <button type="button" onClick={() => setOpenMenu(null)} className="text-slate-500 hover:text-slate-200" aria-label="Close tools menu">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="mt-1 space-y-0.5">
                {tools.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <button
                      key={tool.label}
                      type="button"
                      onClick={() => runAction(tool.action)}
                      className="group flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-white/[0.06]"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.03] text-[var(--theme-accent)] group-hover:border-[var(--theme-accent)] group-hover:bg-[var(--theme-glow)]">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-xs font-semibold text-slate-200 group-hover:text-white">{tool.label}</span>
                        <span className="mt-0.5 block truncate font-mono text-[10px] text-slate-500">{tool.description}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Theme Palette Dropdown */}
        <div className="relative">
          <IconButton label="Change interface theme" active={openMenu === 'theme'} onClick={() => toggleMenu('theme')}>
            <Palette className="h-[18px] w-[18px]" />
          </IconButton>
          {openMenu === 'theme' && (
            <div className="tactical-corner absolute right-0 top-12 z-50 w-64 rounded-xl border border-white/10 bg-[#090d16] p-2 shadow-2xl shadow-black/80 backdrop-blur-xl">
              <div className="border-b border-white/[0.08] px-2.5 pb-2 pt-1 font-mono text-[10px] uppercase tracking-wider text-slate-400">
                TACTICAL COLORWAY
              </div>
              <div className="mt-1 space-y-0.5">
                {themes.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => runAction(() => setTheme(t.id))}
                    className={`flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-xs transition-colors hover:bg-white/[0.06] ${
                      currentTheme === t.id ? 'bg-white/[0.05] text-white font-semibold' : 'text-slate-300'
                    }`}
                  >
                    <span className="h-3.5 w-3.5 rounded-full border border-white/30 shadow-sm" style={{ backgroundColor: t.color }} />
                    <div className="flex-1 min-w-0">
                      <span className="block truncate">{t.label}</span>
                      <span className="block font-mono text-[9px] text-slate-500">{t.desc}</span>
                    </div>
                    {currentTheme === t.id && <Check className="h-4 w-4 text-[var(--theme-accent)]" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Operator Profile Dropdown */}
        <div className="relative ml-1 border-l border-white/[0.08] pl-2 sm:pl-3">
          <button
            type="button"
            onClick={() => toggleMenu('profile')}
            className="flex items-center gap-2 rounded-xl p-1 transition-colors hover:bg-white/[0.05]"
            aria-label="Open operator menu"
            aria-expanded={openMenu === 'profile'}
          >
            <div className="relative">
              <img src="/assets/robert_mitchell.png" alt="R. Mitchell" className="h-8 w-8 rounded-lg border border-cyan-400/40 object-cover" />
              <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-400 border border-black" />
            </div>
            <div className="hidden text-left 2xl:block">
              <span className="block font-tech text-xs font-bold text-slate-200">MITCHELL, R.</span>
              <span className="block font-mono text-[9px] text-slate-500">LEVEL 5 CLEARANCE</span>
            </div>
            <ChevronDown className="hidden h-3.5 w-3.5 text-slate-500 2xl:block" />
          </button>
          {openMenu === 'profile' && (
            <div className="tactical-corner absolute right-0 top-12 z-50 w-60 rounded-xl border border-white/10 bg-[#090d16] p-2 shadow-2xl shadow-black/80 backdrop-blur-xl">
              <div className="border-b border-white/[0.08] px-2.5 pb-2.5 pt-1">
                <p className="font-tech text-sm font-bold text-white">Robert Mitchell</p>
                <p className="font-mono text-[10px] text-cyan-400">Deputy Commander · Level 5</p>
                <p className="mt-1 font-mono text-[9px] text-slate-500">Badge #AR-90214 · Sector HJ-66</p>
              </div>
              <div className="mt-1 space-y-0.5">
                <button type="button" onClick={() => runAction(onOpenProfile)} className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs text-slate-300 hover:bg-white/[0.06]">
                  <User className="h-4 w-4 text-cyan-400" />
                  <span>Operator dossier</span>
                </button>
                <button type="button" onClick={() => runAction(onOpenCmdPalette)} className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs text-slate-300 hover:bg-white/[0.06]">
                  <Command className="h-4 w-4 text-slate-400" />
                  <span>Command palette</span>
                </button>
                <button type="button" onClick={() => runAction(onToggleSplash)} className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs text-red-300 hover:bg-red-500/10">
                  <Lock className="h-4 w-4 text-red-400" />
                  <span>Lock console</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
