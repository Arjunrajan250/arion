import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, Volume2, Radio, RefreshCw, Download } from 'lucide-react';
import { playClick, playBeep } from '../utils/soundEngine';

export default function AudioInterceptModal({ intercept, onClose }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [transcriptIndex, setTranscriptIndex] = useState(0);
  const canvasRef = useRef(null);

  const fullTranscript = [
    "[21:54:19] SPEAKER A (UNKNOWN): Confirm rendezvous at Substation 4 before midnight.",
    "[21:54:22] SPEAKER B (SUSPECT): Secondary package is loaded on the container vessel.",
    "[21:54:28] SPEAKER A (UNKNOWN): Frequency 88-B is compromised. Switch to backup relay immediately.",
    "[21:54:35] INTERCEPT LOG: Signal burst terminated by remote party."
  ];

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setTranscriptIndex(prev => (prev < fullTranscript.length ? prev + 1 : prev));
    }, 1800 / speed);

    return () => clearInterval(interval);
  }, [isPlaying, speed]);

  // Audio Waveform Animation Loop on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    let step = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;

      // Draw background grid lines
      ctx.strokeStyle = 'rgba(0, 242, 254, 0.1)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x < width; x += 30) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      ctx.stroke();

      // Draw Dynamic Sound Wave
      ctx.strokeStyle = isPlaying ? '#00f0ff' : '#64748b';
      ctx.lineWidth = 2.5;
      ctx.beginPath();

      const centerY = height / 2;
      step += isPlaying ? 0.08 * speed : 0;

      for (let x = 0; x < width; x += 4) {
        const amplitude = isPlaying ? Math.sin(x * 0.03 + step) * 28 * Math.cos(x * 0.01) : 4;
        const y = centerY + amplitude;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, speed]);

  if (!intercept) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md font-sans">
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#090b10] border border-cyan-500/40 shadow-[0_0_50px_rgba(0,242,254,0.2)] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#0b0e14] border-b border-slate-800 flex items-center justify-between font-mono shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-950 border border-amber-500/50 text-amber-400">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">INTERCEPTED AUDIO WAVEFORM LAB</h2>
              <p className="text-xs text-slate-400">Frequency: 440.25 MHz • Signal Lock 98.4%</p>
            </div>
          </div>

          <button
            onClick={() => {
              playBeep();
              onClose();
            }}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Waveform Canvas */}
        <div className="p-6 bg-[#06080c] flex flex-col gap-4">
          <div className="relative w-full h-36 bg-[#090c12] rounded-xl border border-slate-800 overflow-hidden">
            <canvas ref={canvasRef} width={600} height={144} className="w-full h-full" />
            
            <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 border border-slate-800 font-mono text-[10px] text-cyan-400">
              SPEECH DECRYPTION MATRIX
            </div>
          </div>

          {/* Controls Bar */}
          <div className="flex items-center justify-between font-mono text-xs p-2 rounded-xl bg-[#0d1017] border border-slate-800">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setIsPlaying(!isPlaying);
                  playClick();
                }}
                className="p-2 rounded-lg bg-cyan-500 text-black font-extrabold flex items-center gap-1.5 hover:bg-cyan-400 transition-all shadow-md"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isPlaying ? 'PAUSE STREAM' : 'PLAY STREAM'}</span>
              </button>
            </div>

            {/* Speed Selector */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
              {[0.5, 1, 1.5, 2].map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setSpeed(s);
                    playBeep();
                  }}
                  className={`px-2 py-0.5 rounded font-bold ${
                    speed === s ? 'bg-cyan-500 text-black' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>

          {/* Real-time Speech-to-Text Transcript Feed */}
          <div className="p-4 rounded-xl bg-[#0d1017] border border-slate-800 font-mono text-xs flex flex-col gap-2 max-h-44 overflow-y-auto custom-scrollbar">
            <div className="text-[10px] text-amber-400 font-bold uppercase border-b border-slate-800 pb-1">
              LIVE TRANSCRIPTION DECODE FEED:
            </div>
            {fullTranscript.slice(0, transcriptIndex).map((line, idx) => (
              <div key={idx} className="text-slate-200 animate-in fade-in">
                {line}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
