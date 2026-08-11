import React, { useState } from 'react';
import { 
  Bell, Shield, ChevronDown, User, Settings, LogOut, Volume2, VolumeX, 
  Command, Palette, Mic, MicOff, Terminal, Share2, ShieldAlert, FileText,
  LayoutGrid, Target, Eye, Radio, Activity, Cpu, Lock, RadioReceiver
} from 'lucide-react';
import { playClick, playBeep } from '../utils/soundEngine';

export default function Header({ 
  activeTab, 
  setActiveTab, 
  alertCount = 54, 
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
  onOpenPdf
}) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  const navTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'campaigns', label: 'Campaigns', icon: Target },
    { id: 'surveillance', label: 'Surveillance', icon: Eye },
    { id: 'reporting', label: 'Reporting', icon: FileText },
    { id: 'alerts', label: 'Alerts', icon: Bell, hasBadge: true },
    { id: 'livefeed', label: 'Live Feed', icon: Radio },
  ];

  const handleTabClick = (tabId) => {
    playBeep();
    setActiveTab(tabId);
  };

  return (
    <header className="w-full bg-[#05080e]/95 backdrop-blur-xl border-b border-cyan-500/25 px-6 sm:px-8 py-3.5 flex items-center justify-between z-40 shrink-0 shadow-[0_12px_40px_rgba(0,0,0,0.85)] min-h-[72px] sm:min-h-[76px] overflow-x-auto custom-scrollbar gap-6 relative">
      
      {/* Top Ambient Glow Hairline */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent pointer-events-none" />

      {/* Left Section: Insignia & Brand */}
      <div className="flex items-center gap-5 shrink-0">
        
        {/* Logo Insignia */}
        <div 
          onClick={() => {
            playClick();
            onToggleSplash();
          }}
          className="flex items-center gap-3.5 cursor-pointer group shrink-0 select-none"
          title="ARION Tactical Command Center"
        >
          <div className="relative flex items-center justify-center p-2.5 rounded-xl bg-gradient-to-br from-cyan-950 via-slate-900 to-slate-950 border border-cyan-500/60 group-hover:border-cyan-400 group-hover:shadow-[0_0_25px_rgba(0,242,254,0.55)] transition-all duration-300">
            <svg viewBox="0 0 40 24" className="w-7 h-5 text-cyan-400 fill-current drop-shadow-[0_0_12px_rgba(0,242,254,0.9)]">
              <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2.8" />
              <circle cx="24" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2.8" />
            </svg>
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-cyan-400 animate-ping opacity-75" />
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-cyan-300 shadow-[0_0_10px_#00f2fe]" />
          </div>

          <div className="flex flex-col hidden sm:flex">
            <div className="flex items-center gap-2">
              <span className="text-lg font-black font-mono tracking-[0.25em] text-white group-hover:text-cyan-300 transition-colors leading-none text-glow-cyan">
                ARION
              </span>
              <span className="px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-[10px] font-mono font-bold text-cyan-400">
                v4.8
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase mt-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              TACTICAL COMMAND OS
            </span>
          </div>
        </div>

      </div>

      {/* Center Section: Tactical Segmented Navigation Deck */}
      <nav className="flex items-center p-1.5 sm:p-2 rounded-2xl bg-[#090d16]/95 border border-slate-700/70 shadow-[inset_0_2px_10px_rgba(0,0,0,0.85)] backdrop-blur-md shrink-0 gap-1.5 sm:gap-2">
        {navTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`relative px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-mono font-bold tracking-tight transition-all duration-200 flex items-center gap-2.5 whitespace-nowrap ${
                isActive
                  ? 'text-cyan-200 bg-gradient-to-r from-cyan-950/90 via-[#0c233c] to-slate-900 border border-cyan-400/70 shadow-[0_0_20px_rgba(0,242,254,0.35)] font-extrabold'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 border border-transparent'
              }`}
            >
              <IconComponent className={`w-4 h-4 sm:w-4.5 sm:h-4.5 transition-transform duration-200 ${isActive ? 'text-cyan-400 scale-110 drop-shadow-[0_0_8px_rgba(0,242,254,0.85)]' : 'text-slate-400 group-hover:text-slate-200'}`} />
              <span>{tab.label}</span>
              
              {tab.id === 'alerts' && (
                <span className="px-2 py-0.5 text-[10px] font-mono font-black rounded-full bg-gradient-to-r from-red-600 to-red-500 text-white shadow-[0_0_12px_rgba(239,68,68,0.7)] animate-pulse">
                  {alertCount}
                </span>
              )}

              {isActive && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-[2.5px] bg-cyan-400 rounded-full shadow-[0_0_14px_#00f2fe]" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Right Section: Grouped Tactical Action Docks & Profile */}
      <div className="flex items-center gap-3 shrink-0 font-mono text-xs">

        {/* Intelligence Dock */}
        <div className="flex items-center p-1.5 rounded-xl bg-slate-900/90 border border-slate-800 gap-1.5 shadow-sm">
          {/* Voice AI */}
          <button
            onClick={() => {
              playClick();
              if (onToggleVoice) onToggleVoice();
            }}
            className={`p-2 rounded-lg transition-all duration-200 ${
              isVoiceActive 
                ? 'bg-red-950 border border-red-500 text-red-400 animate-pulse shadow-[0_0_14px_rgba(239,68,68,0.5)]' 
                : 'text-slate-400 hover:text-cyan-300 hover:bg-slate-800'
            }`}
            title="Toggle Voice Assistant AI"
          >
            {isVoiceActive ? <Mic className="w-4 h-4 text-red-400" /> : <MicOff className="w-4 h-4" />}
          </button>

          {/* Cyber CLI */}
          <button
            onClick={() => {
              playClick();
              if (onOpenTerminal) onOpenTerminal();
            }}
            className="p-2 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition-all"
            title="Open Cyber Terminal CLI"
          >
            <Terminal className="w-4 h-4 text-cyan-400" />
          </button>

          {/* Intel Graph */}
          <button
            onClick={() => {
              playClick();
              if (onOpenGraph) onOpenGraph();
            }}
            className="p-2 rounded-lg text-slate-400 hover:text-purple-300 hover:bg-slate-800 transition-all"
            title="Open Intelligence Network Graph"
          >
            <Share2 className="w-4 h-4 text-purple-400" />
          </button>
        </div>

        {/* Action Dock */}
        <div className="flex items-center p-1.5 rounded-xl bg-slate-900/90 border border-slate-800 gap-1.5 shadow-sm">
          {/* Dispatch Simulator */}
          <button
            onClick={() => {
              playClick();
              if (onOpenDispatch) onOpenDispatch();
            }}
            className="p-2 rounded-lg text-slate-400 hover:text-red-300 hover:bg-slate-800 transition-all"
            title="Dispatch Console"
          >
            <ShieldAlert className="w-4 h-4 text-red-400" />
          </button>

          {/* Export PDF Dossier */}
          <button
            onClick={() => {
              playClick();
              if (onOpenPdf) onOpenPdf();
            }}
            className="p-2 rounded-lg text-slate-400 hover:text-emerald-300 hover:bg-slate-800 transition-all"
            title="Export Dossier PDF"
          >
            <FileText className="w-4 h-4 text-emerald-400" />
          </button>

          {/* Command Palette */}
          <button
            onClick={() => {
              playClick();
              if (onOpenCmdPalette) onOpenCmdPalette();
            }}
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
            title="Open Command Palette (Cmd+K)"
          >
            <Command className="w-3.5 h-3.5 text-cyan-400" />
            <kbd className="px-1.5 py-0.5 text-[10px] bg-slate-950 border border-slate-700/80 rounded text-slate-400 font-mono">⌘K</kbd>
          </button>
        </div>

        {/* Settings & Theme */}
        <div className="flex items-center p-1.5 rounded-xl bg-slate-900/90 border border-slate-800 gap-1.5 shadow-sm">
          <button
            onClick={() => {
              if (onToggleMute) onToggleMute();
              playClick();
            }}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
            title={isMuted ? 'Unmute Audio SFX' : 'Mute Audio SFX'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          <div className="relative">
            <button
              onClick={() => {
                setShowThemeMenu(!showThemeMenu);
                playClick();
              }}
              className="p-2 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition-all"
              title="Switch Theme"
            >
              <Palette className="w-4 h-4 text-cyan-400" />
            </button>

            {showThemeMenu && (
              <div className="absolute right-0 top-12 w-48 p-2 rounded-2xl bg-[#0b0e14]/95 border border-slate-700/80 shadow-2xl backdrop-blur-xl z-50 text-xs font-mono">
                <div className="px-2 py-1 font-bold text-slate-400 text-[10px] uppercase border-b border-slate-800/80 mb-1 tracking-wider">
                  HUD Themes
                </div>
                {[
                  { id: 'midnight', label: 'Midnight Cyan' },
                  { id: 'amber', label: 'Tactical Amber' },
                  { id: 'stealth', label: 'Stealth Obsidian' },
                  { id: 'crimson', label: 'Crimson Alert' }
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => {
                      if (setTheme) setTheme(t.id);
                      setShowThemeMenu(false);
                      playClick();
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      currentTheme === t.id ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 shadow-sm' : 'text-slate-300 hover:bg-slate-800/70'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Operator Profile Badge */}
        <div className="relative shrink-0 pl-1 border-l border-slate-800">
          <button 
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              playClick();
            }}
            className="flex items-center gap-3 p-1.5 rounded-xl bg-gradient-to-r from-slate-900 to-cyan-950/50 border border-slate-700/80 hover:border-cyan-500/60 transition-all shadow-md group"
          >
            <div className="w-9 h-9 rounded-lg overflow-hidden border-2 border-cyan-400/80 shadow-[0_0_12px_rgba(0,242,254,0.35)] shrink-0">
              <img
                src="/assets/robert_mitchell.png"
                alt="CDR. Mitchell"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="hidden xl:flex flex-col text-left pr-1">
              <span className="text-xs font-bold text-white font-mono leading-none group-hover:text-cyan-300 transition-colors">
                CDR. MITCHELL
              </span>
              <span className="text-[9px] font-mono text-cyan-400/80 tracking-wider uppercase mt-1">
                LEVEL 5 CLEARANCE
              </span>
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 top-12 w-52 p-2 rounded-2xl bg-[#0b0e14]/95 border border-slate-700/80 shadow-2xl backdrop-blur-xl z-50 text-xs font-mono">
              <div className="px-3 py-2 border-b border-slate-800">
                <div className="font-bold text-white text-xs">Robert Mitchell</div>
                <div className="text-[10px] text-cyan-400 font-mono">Chief Tactical Officer</div>
              </div>
              <div className="p-1 space-y-1 mt-1">
                <button className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800/80 text-slate-300 flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-cyan-400" /> Profile Dossier
                </button>
                <button className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800/80 text-slate-300 flex items-center gap-2">
                  <Settings className="w-3.5 h-3.5 text-slate-400" /> Security System
                </button>
                <button className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-red-950/60 text-red-400 flex items-center gap-2">
                  <LogOut className="w-3.5 h-3.5" /> Lock Console
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

    </header>
  );
}
