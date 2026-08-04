import React from 'react';
import { Shield, Radio, Eye } from 'lucide-react';

export default function SplashScreen({ onLaunch }) {
  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col items-center justify-center select-none"
         style={{
           background: 'radial-gradient(circle at 15% 15%, rgba(0, 180, 160, 0.35) 0%, rgba(0, 80, 80, 0.15) 30%, #030508 65%)'
         }}>
      
      {/* Top Left Teal Atmospheric Glow */}
      <div 
        className="absolute top-0 left-0 w-[500px] h-[500px] pointer-events-none rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(0, 242, 254, 0.25) 0%, rgba(0, 180, 160, 0.1) 45%, transparent 70%)',
          filter: 'blur(50px)'
        }}
      />

      {/* Hexagonal Emblem Container */}
      <div 
        onClick={onLaunch}
        className="group relative cursor-pointer flex flex-col items-center justify-center transition-transform duration-500 hover:scale-105"
      >
        {/* Outer Glow */}
        <div className="absolute inset-0 rounded-full bg-teal-400/20 blur-2xl group-hover:bg-teal-400/40 transition-all duration-500" />
        
        {/* Hexagon shape using CSS polygon */}
        <div 
          className="relative w-44 h-48 flex items-center justify-center shadow-2xl transition-all duration-300"
          style={{
            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
            background: 'linear-gradient(145deg, #1b4b47 0%, #0d2825 50%, #051412 100%)',
            border: '1px solid rgba(0, 242, 254, 0.3)',
            boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.2), 0 20px 40px rgba(0,0,0,0.8)'
          }}
        >
          {/* Subtle Inner Highlight lines */}
          <div 
            className="absolute inset-1 opacity-70"
            style={{
              clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
              background: 'radial-gradient(circle at 50% 20%, rgba(0, 242, 254, 0.3) 0%, transparent 60%)'
            }}
          />

          <span className="relative z-10 text-white font-sans text-3xl tracking-wide font-normal drop-shadow-md">
            arion
          </span>
        </div>

        {/* Action Prompt Below */}
        <div className="mt-10 flex flex-col items-center gap-2">
          <div className="px-6 py-2.5 rounded-full bg-slate-900/80 border border-teal-500/30 text-teal-300 font-mono text-sm tracking-widest uppercase flex items-center gap-2 shadow-lg backdrop-blur-md group-hover:border-teal-400 group-hover:shadow-teal-500/20 transition-all">
            <Radio className="w-4 h-4 animate-pulse text-teal-400" />
            <span>Click to Launch Command System</span>
          </div>
          <span className="text-xs text-slate-500 font-mono tracking-wider">SECURE SURVEILLANCE MATRIX v4.8</span>
        </div>
      </div>
    </div>
  );
}
