import React from 'react';
import { Shield, Radio, Eye, Cpu } from 'lucide-react';
import { playClick } from '../utils/soundEngine';

export default function SplashScreen({ onLaunch }) {
  const handleLaunch = () => {
    playClick();
    onLaunch();
  };

  return (
    <div
      className="relative w-full min-h-dvh overflow-y-auto flex flex-col items-center justify-center select-none bg-[#03060a] py-8"
      style={{
        background: 'radial-gradient(circle at 50% 40%, rgba(0, 242, 254, 0.12) 0%, rgba(4, 16, 26, 0.6) 45%, #020408 100%)'
      }}
    >
      {/* Background Cyber Grid Pattern */}
      <div className="absolute inset-0 bg-cyber-grid opacity-25 pointer-events-none" />

      {/* Ambient Radial Glowing Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />

      {/* Main Interactive Clearance Console Container */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-xl px-6 gap-6">

        {/* Holographic Concentric Security Badge */}
        <div className="group relative flex items-center justify-center transition-transform duration-500" aria-hidden="true">
          {/* Pulsing Outer Aura */}
          <div className="absolute -inset-4 rounded-full bg-cyan-400/20 blur-xl group-hover:bg-cyan-400/35 transition-all duration-500" />

          {/* Rotating Perimeter Reticle */}
          <div className="absolute w-44 h-44 rounded-full border-2 border-dashed border-cyan-500/40 animate-spin-slow pointer-events-none" />
          <div className="absolute w-52 h-52 rounded-full border border-cyan-500/20 pointer-events-none" />

          {/* Hexagonal Core Shield */}
          <div
            className="relative w-36 h-40 flex flex-col items-center justify-center shadow-2xl transition-all duration-300 border border-cyan-400/50"
            style={{
              clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
              background: 'linear-gradient(145deg, #091c2b 0%, #06121c 50%, #03080e 100%)',
              boxShadow: 'inset 0 0 25px rgba(0,242,254,0.3), 0 25px 50px rgba(0,0,0,0.9)'
            }}
          >
            <div className="relative flex items-center justify-center mb-1">
              <svg viewBox="0 0 40 24" className="w-10 h-6 text-cyan-400 fill-current drop-shadow-[0_0_12px_rgba(0,242,254,0.9)]">
                <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2.8" />
                <circle cx="24" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2.8" />
              </svg>
            </div>
            <span className="font-mono text-xs font-black tracking-widest text-cyan-300">
              ARION
            </span>
          </div>
        </div>

        {/* System Title & Clearance Level */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-[10px] font-mono font-bold text-cyan-300 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>CLASSIFIED DEFENSE OS • LEVEL 5 AUTHORIZATION</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black font-sans tracking-tight text-white drop-shadow-lg">
            TACTICAL INTELLIGENCE COMMAND
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 font-mono max-w-md mx-auto">
            Live Optical Biometrics, Pose Mesh Reconstruction & National Cyber Crime Intercept Matrix
          </p>
        </div>

        {/* System Diagnostics Readiness Checklist */}
        <div className="grid grid-cols-3 gap-2 w-full font-mono text-[10px]">
          <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 flex flex-col items-center gap-1 shadow-sm">
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-bold text-white">OPTICAL CCTV</span>
            <span className="text-emerald-400 font-extrabold">4K SYNCED</span>
          </div>

          <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 flex flex-col items-center gap-1 shadow-sm">
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-bold text-white">AI POSE MESH</span>
            <span className="text-emerald-400 font-extrabold">17 JOINTS</span>
          </div>

          <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 flex flex-col items-center gap-1 shadow-sm">
            <Shield className="w-3.5 h-3.5 text-red-400" />
            <span className="font-bold text-white">I4C CYBER NET</span>
            <span className="text-red-400 font-extrabold">DEFCON 1</span>
          </div>
        </div>

        {/* Big Launch Button */}
        <button
          onClick={handleLaunch}
          className="group w-full max-w-sm py-3 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-400 to-cyan-500 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-mono font-black text-xs sm:text-sm tracking-widest uppercase transition-all shadow-[0_0_30px_rgba(0,242,254,0.4)] flex items-center justify-center gap-3 cursor-pointer"
        >
          <Radio className="w-4 h-4 text-slate-950 animate-pulse" />
          <span>INITIALIZE COMMAND CONSOLE</span>
        </button>

      </div>
    </div>
  );
}
