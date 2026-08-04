import React, { useState } from 'react';
import { Bell, Shield, ChevronDown, User, Settings, LogOut, CheckCircle2, Volume2, VolumeX, Command, Palette, Mic, MicOff, Terminal, Share2, ShieldAlert, FileText } from 'lucide-react';
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
  const [showNotifications, setShowNotifications] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  const navTabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'campaigns', label: 'Campaigns' },
    { id: 'surveillance', label: 'Surveillance' },
    { id: 'reporting', label: 'Reporting' },
    { id: 'alerts', label: 'Alerts', hasBadge: true },
    { id: 'livefeed', label: 'Live Feed' },
  ];

  const handleTabClick = (tabId) => {
    playBeep();
    setActiveTab(tabId);
  };

  return (
    <header className="w-full bg-[#06080b] border-b border-slate-800/90 px-6 py-3 flex items-center justify-between z-40 shrink-0 shadow-xl min-h-[56px] overflow-x-auto custom-scrollbar gap-4">
      
      {/* Left Section: Branding & Navigation Tabs */}
      <div className="flex items-center gap-4 lg:gap-6 shrink-0">
        
        {/* Logo */}
        <div 
          onClick={() => {
            playClick();
            onToggleSplash();
          }}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
          title="ARION Tactical Dashboard"
        >
          <div className="flex items-center justify-center p-1.5 rounded-lg bg-cyan-950/60 border border-cyan-500/50 group-hover:border-cyan-400 group-hover:shadow-[0_0_15px_rgba(0,242,254,0.5)] transition-all">
            <svg viewBox="0 0 40 24" className="w-7 h-4.5 text-cyan-400 fill-current">
              <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2.8" />
              <circle cx="24" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2.8" />
            </svg>
          </div>
          <span className="text-base font-black font-mono tracking-widest text-white group-hover:text-cyan-300 transition-colors hidden sm:inline-block">
            ARION
          </span>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1.5 sm:gap-2 text-sm font-sans shrink-0">
          {navTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`relative px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold tracking-tight transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  isActive
                    ? 'text-white bg-slate-800 border border-slate-600 shadow-[0_0_12px_rgba(0,242,254,0.15)] font-black'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <span>{tab.label}</span>
                {tab.id === 'alerts' && (
                  <span className="px-1.5 py-0.2 text-[10px] font-mono font-bold rounded-full bg-red-600 text-white shadow-md">
                    {alertCount}
                  </span>
                )}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-[2.5px] bg-cyan-400 rounded-full shadow-[0_0_8px_#00f2fe]" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Right Section: Quick Modals & Tools */}
      <div className="flex items-center gap-2 shrink-0 font-mono text-xs">

        {/* Voice Assistant Toggle */}
        <button
          onClick={() => {
            playClick();
            if (onToggleVoice) onToggleVoice();
          }}
          className={`p-2 rounded-lg border transition-all flex items-center justify-center ${
            isVoiceActive 
              ? 'bg-red-950 border-red-500 text-red-400 animate-pulse shadow-[0_0_12px_rgba(239,68,68,0.5)]' 
              : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white'
          }`}
          title="Toggle Voice Assistant AI"
        >
          {isVoiceActive ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4 text-slate-400" />}
        </button>

        {/* CLI Terminal Toggle */}
        <button
          onClick={() => {
            playClick();
            if (onOpenTerminal) onOpenTerminal();
          }}
          className="p-2 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-500 text-slate-300 hover:text-white transition-all"
          title="Open Cyber Terminal CLI"
        >
          <Terminal className="w-4 h-4 text-cyan-400" />
        </button>

        {/* Intelligence Network Graph */}
        <button
          onClick={() => {
            playClick();
            if (onOpenGraph) onOpenGraph();
          }}
          className="p-2 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-500 text-slate-300 hover:text-white transition-all"
          title="Open Intelligence Network Graph"
        >
          <Share2 className="w-4 h-4 text-purple-400" />
        </button>

        {/* Tactical Dispatch Simulator */}
        <button
          onClick={() => {
            playClick();
            if (onOpenDispatch) onOpenDispatch();
          }}
          className="p-2 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-500 text-slate-300 hover:text-white transition-all"
          title="Tactical Unit Dispatch Console"
        >
          <ShieldAlert className="w-4 h-4 text-red-400" />
        </button>

        {/* Print PDF Dossier */}
        <button
          onClick={() => {
            playClick();
            if (onOpenPdf) onOpenPdf();
          }}
          className="p-2 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-500 text-slate-300 hover:text-white transition-all"
          title="Export / Print PDF Dossier Report"
        >
          <FileText className="w-4 h-4 text-emerald-400" />
        </button>

        {/* Command Palette Trigger */}
        <button
          onClick={() => {
            playClick();
            if (onOpenCmdPalette) onOpenCmdPalette();
          }}
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-500 text-slate-300 hover:text-white transition-all font-bold"
          title="Open Command Palette (Cmd+K)"
        >
          <Command className="w-3.5 h-3.5 text-cyan-400" />
          <kbd className="px-1 py-0.2 text-[9px] bg-slate-800 border border-slate-700 rounded text-slate-400">⌘K</kbd>
        </button>

        {/* Mute SFX Toggle */}
        <button
          onClick={() => {
            if (onToggleMute) onToggleMute();
            playClick();
          }}
          className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white transition-all"
          title={isMuted ? 'Unmute Audio SFX' : 'Mute Audio SFX'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
        </button>

        {/* Theme Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowThemeMenu(!showThemeMenu);
              playClick();
            }}
            className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white transition-all"
            title="Switch HUD Color Theme"
          >
            <Palette className="w-4 h-4 text-cyan-400" />
          </button>

          {showThemeMenu && (
            <div className="absolute right-0 top-11 w-44 p-2 rounded-xl bg-[#0d1017] border border-slate-700 shadow-2xl z-50 text-xs font-mono">
              <div className="px-2 py-1 font-bold text-slate-400 text-[10px] uppercase border-b border-slate-800 mb-1">
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
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    currentTheme === t.id ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="relative shrink-0">
          <button 
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              playClick();
            }}
            className="flex items-center gap-2 pl-2 py-1 border-l border-slate-800 hover:opacity-90 transition-opacity"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-cyan-400/60 shadow-md shrink-0">
              <img
                src="/assets/robert_mitchell.png"
                alt="Alpha Dog Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </button>
        </div>

      </div>

    </header>
  );
}
