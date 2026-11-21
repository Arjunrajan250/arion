import React, { useEffect, useState } from 'react';
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Eye,
  Lock,
  Radio,
  Satellite,
  Shield,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { isMuted, playClick, toggleMute } from '../utils/soundEngine';

export default function SplashScreen({ onLaunch }) {
  const [muted, setMuted] = useState(isMuted());

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        playClick();
        onLaunch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onLaunch]);

  const handleLaunch = () => {
    playClick();
    onLaunch();
  };

  const handleToggleSound = (e) => {
    e.stopPropagation();
    const nextMuted = toggleMute();
    setMuted(nextMuted);
  };

  const diagnostics = [
    { label: 'OPTICAL CCTV MATRIX', value: '4K · 60 FPS', status: 'SYNCHRONIZED', icon: Eye, color: 'text-cyan-400', border: 'border-cyan-500/30' },
    { label: 'AI POSE MESH ESTIMATOR', value: '17 JOINTS', status: 'ACTIVE', icon: Cpu, color: 'text-emerald-400', border: 'border-emerald-500/30' },
    { label: 'I4C CYBER SHIELD', value: 'DEFCON 2', status: 'MONITORED', icon: Shield, color: 'text-red-400', border: 'border-red-500/30' },
    { label: 'SAT-LINK ORBITAL NODE', value: '4/4 LINKED', status: 'AES-256', icon: Satellite, color: 'text-amber-400', border: 'border-amber-500/30' },
  ];

  return (
    <div
      className="relative flex min-h-dvh w-full select-none flex-col items-center justify-between overflow-y-auto bg-[#03060a] p-4 sm:p-8 font-sans text-slate-100"
      style={{
        background: 'radial-gradient(circle at 50% 35%, rgba(0, 242, 254, 0.12) 0%, rgba(4, 14, 24, 0.75) 50%, #020408 100%)',
      }}
    >
      {/* Background Cyber Grid & Vignette */}
      <div className="pointer-events-none absolute inset-0 bg-cyber-grid opacity-30" />
      <div className="pointer-events-none absolute inset-0 bg-dot-matrix opacity-20" />

      {/* Top Banner & Security Classification */}
      <header className="relative z-10 flex w-full max-w-5xl items-center justify-between border-b border-white/[0.08] pb-4 font-mono text-xs">
        <div className="flex items-center gap-3">
          <span className="flex h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-pulse" />
          <span className="font-tech text-xs tracking-widest text-cyan-300">ARION DEFENSE SYSTEMS // C4ISR PLATFORM</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleToggleSound}
            className="flex items-center gap-1.5 rounded-lg border border-white/[0.09] bg-white/[0.03] px-2.5 py-1 text-[11px] text-slate-400 transition-colors hover:border-cyan-400/40 hover:text-white"
            title="Toggle interface audio sounds"
          >
            {muted ? <VolumeX className="h-3.5 w-3.5 text-slate-500" /> : <Volume2 className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />}
            <span className="hidden sm:inline font-mono">{muted ? 'AUDIO MUTED' : 'AUDIO ARMED'}</span>
          </button>
          <span className="hidden sm:inline-block rounded border border-red-500/30 bg-red-500/10 px-2 py-0.5 text-[10px] font-bold tracking-wider text-red-400">
            TOP SECRET // NOFORN
          </span>
        </div>
      </header>

      {/* Center Console Container */}
      <main className="relative z-10 my-auto flex max-w-2xl flex-col items-center gap-6 py-8 text-center">
        {/* Holographic Concentric Security Badge */}
        <div className="relative flex items-center justify-center" aria-hidden="true">
          {/* Outer Pulsing Glow */}
          <div className="absolute -inset-6 rounded-full bg-cyan-400/20 blur-2xl" />

          {/* Rotating Perimeter Reticles */}
          <div className="animate-reticle-slow pointer-events-none absolute h-52 w-52 rounded-full border border-dashed border-cyan-400/35" />
          <div className="animate-reticle-reverse pointer-events-none absolute h-64 w-64 rounded-full border border-cyan-500/20" />

          {/* Target Azimuth Ticks */}
          <div className="pointer-events-none absolute h-72 w-72">
            <span className="absolute top-0 left-1/2 -translate-x-1/2 font-mono text-[8px] text-cyan-500/60">000°</span>
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 font-mono text-[8px] text-cyan-500/60">180°</span>
            <span className="absolute left-0 top-1/2 -translate-y-1/2 font-mono text-[8px] text-cyan-500/60">270°</span>
            <span className="absolute right-0 top-1/2 -translate-y-1/2 font-mono text-[8px] text-cyan-500/60">090°</span>
          </div>

          {/* Hexagonal Core Shield */}
          <div
            className="tactical-corner relative flex h-40 w-36 flex-col items-center justify-center border border-cyan-400/50 shadow-2xl transition-all duration-300"
            style={{
              clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
              background: 'linear-gradient(145deg, #091d2d 0%, #06131e 50%, #03080e 100%)',
              boxShadow: 'inset 0 0 30px rgba(0,242,254,0.35), 0 25px 60px rgba(0,0,0,0.9)',
            }}
          >
            <div className="relative mb-1 flex items-center justify-center">
              <svg viewBox="0 0 40 24" className="h-7 w-12 text-cyan-400 fill-current drop-shadow-[0_0_15px_rgba(0,242,254,0.9)]">
                <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2.8" />
                <circle cx="24" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2.8" />
              </svg>
            </div>
            <span className="font-tech text-sm font-black tracking-widest text-cyan-300">ARION</span>
            <span className="font-mono text-[8px] text-cyan-400/70">v4.8.2 OS</span>
          </div>
        </div>

        {/* System Title & Clearance Level */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-950/80 px-3.5 py-1 font-mono text-[11px] font-bold text-cyan-300 shadow-sm backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span>CLASSIFIED DEFENSE OS • LEVEL 5 AUTHORIZATION</span>
          </div>

          <h1 className="font-tech text-3xl font-extrabold tracking-wider text-white sm:text-5xl drop-shadow-[0_0_20px_rgba(34,211,238,0.3)]">
            TACTICAL INTELLIGENCE COMMAND
          </h1>

          <p className="mx-auto max-w-lg font-mono text-xs leading-relaxed text-slate-400 sm:text-sm">
            Live Optical Biometrics, Dynamic 17-Joint Pose Mesh Tracking & National Cyber Intercept Matrix
          </p>
        </div>

        {/* Biometric Verification Ticker */}
        <div className="flex w-full max-w-md items-center justify-between rounded-xl border border-white/[0.08] bg-black/40 px-4 py-2.5 font-mono text-[11px] backdrop-blur-md">
          <div className="flex items-center gap-2">
            <Lock className="h-3.5 w-3.5 text-cyan-400" />
            <span className="text-slate-400">OPERATOR:</span>
            <span className="font-semibold text-slate-200">MITCHELL, R. (AUTHORIZED)</span>
          </div>
          <span className="flex items-center gap-1 font-semibold text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" />
            CLEARANCE GRANTED
          </span>
        </div>

        {/* System Diagnostics Readiness Checklist */}
        <div className="grid w-full grid-cols-2 gap-2.5 sm:grid-cols-4 font-mono text-[10px]">
          {diagnostics.map((diag) => {
            const Icon = diag.icon;
            return (
              <div
                key={diag.label}
                className={`tactical-corner flex flex-col items-center gap-1.5 rounded-xl border ${diag.border} bg-[#070d16]/80 p-3 shadow-md backdrop-blur-sm transition-all hover:border-white/20`}
              >
                <Icon className={`h-4 w-4 ${diag.color}`} />
                <span className="font-bold text-slate-200">{diag.value}</span>
                <span className="text-[9px] text-slate-400">{diag.label}</span>
                <span className={`text-[8px] font-bold ${diag.color}`}>{diag.status}</span>
              </div>
            );
          })}
        </div>

        {/* Primary Launch Action Button */}
        <div className="w-full max-w-sm pt-2">
          <button
            type="button"
            onClick={handleLaunch}
            className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500 via-teal-400 to-cyan-500 px-6 py-4 font-tech text-sm font-black uppercase tracking-widest text-slate-950 shadow-[0_0_35px_rgba(0,242,254,0.45)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_50px_rgba(0,242,254,0.7)] active:scale-[0.98]"
          >
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            <Radio className="h-4 w-4 text-slate-950 animate-pulse" />
            <span>INITIALIZE COMMAND CONSOLE</span>
            <ArrowRight className="h-4 w-4 text-slate-950 transition-transform group-hover:translate-x-1" />
          </button>
          <p className="mt-2 text-[10px] font-mono text-slate-500">
            Press <kbd className="rounded border border-white/20 bg-white/5 px-1 py-0.5 text-slate-400">ENTER</kbd> or click to access system
          </p>
        </div>
      </main>

      {/* Footer System Telemetry Status Bar */}
      <footer className="relative z-10 flex w-full max-w-5xl items-center justify-between border-t border-white/[0.08] pt-4 font-mono text-[10px] text-slate-500">
        <div className="flex items-center gap-2">
          <Activity className="h-3.5 w-3.5 text-emerald-400" />
          <span>ALL DEFENSE ENGINES ARMED · SECTOR HJ-66</span>
        </div>
        <div className="flex items-center gap-3">
          <span>LATENCY: 22MS</span>
          <span>•</span>
          <span>UPTIME: 99.98%</span>
          <span>•</span>
          <span>ENCRYPTION: QUANTUM AES-GCM</span>
        </div>
      </footer>
    </div>
  );
}
