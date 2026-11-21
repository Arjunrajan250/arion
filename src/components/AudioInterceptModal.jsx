import React, { useEffect, useRef, useState } from 'react';
import { Download, Pause, Play, Radio, RotateCcw, Volume2, X } from 'lucide-react';
import { playBeep, playClick } from '../utils/soundEngine';

const TRANSCRIPT = [
  '[21:54:19] SPEAKER A (UNKNOWN): Confirm rendezvous at Substation 4 before midnight.',
  '[21:54:22] SPEAKER B (SUSPECT): Secondary package is loaded on the container vessel.',
  '[21:54:28] SPEAKER A (UNKNOWN): Frequency 88-B is compromised. Switch to backup relay immediately.',
  '[21:54:35] INTERCEPT LOG: Signal burst terminated by remote party.',
];

export default function AudioInterceptModal({ intercept, onClose }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [transcriptIndex, setTranscriptIndex] = useState(0);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!isPlaying) return undefined;
    const interval = window.setInterval(() => {
      setTranscriptIndex((current) => {
        if (current >= TRANSCRIPT.length) {
          setIsPlaying(false);
          return current;
        }
        return current + 1;
      });
    }, 1800 / speed);
    return () => window.clearInterval(interval);
  }, [isPlaying, speed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const context = canvas.getContext('2d');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let animationId;
    let step = 0;

    const draw = () => {
      const { width, height } = canvas;
      context.clearRect(0, 0, width, height);

      // Draw subtle grid lines
      context.strokeStyle = 'rgba(34, 211, 238, 0.08)';
      context.lineWidth = 1;
      context.beginPath();
      for (let x = 0; x < width; x += 25) {
        context.moveTo(x, 0);
        context.lineTo(x, height);
      }
      context.stroke();

      // Draw center audio axis line
      context.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      context.beginPath();
      context.moveTo(0, height / 2);
      context.lineTo(width, height / 2);
      context.stroke();

      // Draw waveform
      context.strokeStyle = isPlaying ? '#22d3ee' : '#64748b';
      context.shadowColor = isPlaying ? '#22d3ee' : 'transparent';
      context.shadowBlur = isPlaying ? 10 : 0;
      context.lineWidth = 2;
      context.beginPath();
      const centerY = height / 2;
      step += isPlaying ? 0.08 * speed : 0;
      for (let x = 0; x < width; x += 3) {
        const amplitude = isPlaying ? Math.sin(x * 0.03 + step) * 32 * Math.cos(x * 0.01) : 4;
        const y = centerY + amplitude;
        if (x === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
      }
      context.stroke();
      context.shadowBlur = 0;

      if (isPlaying && !reduceMotion) animationId = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animationId);
  }, [isPlaying, speed]);

  if (!intercept) return null;

  const restart = () => {
    setTranscriptIndex(0);
    setIsPlaying(true);
    playBeep();
  };

  const downloadTranscript = () => {
    playClick();
    const content = `ARION INTERCEPT TRANSCRIPT — SIMULATED DATA\nFrequency: 440.25 MHz\nCaptured: ${new Date().toISOString()}\n\n${TRANSCRIPT.join('\n\n')}`;
    const url = URL.createObjectURL(new Blob([content], { type: 'text/plain' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'arion-intercept-transcript.txt';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 backdrop-blur-md sm:p-4 select-none font-mono"
      onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}
    >
      <div
        className="tactical-corner relative flex max-h-[calc(100dvh-1.5rem)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#070b14] shadow-2xl text-xs"
        role="dialog"
        aria-modal="true"
        aria-labelledby="intercept-title"
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-white/[0.08] px-5 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <Radio className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <h2 id="intercept-title" className="font-tech text-base font-bold uppercase tracking-wider text-white">
                SIGNAL INTERCEPT LAB
              </h2>
              <p className="mt-0.5 text-[10px] text-slate-400">440.25 MHz · Substation 4 Burst · 98.4% Signal Lock</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => { playBeep(); onClose(); }}
            className="rounded-lg p-1.5 text-slate-400 hover:text-white"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex min-h-0 flex-col gap-4 overflow-y-auto p-5 custom-scrollbar">
          {/* Signal Waveform Container */}
          <div className="tactical-corner relative h-36 overflow-hidden rounded-xl border border-white/[0.09] bg-black/50 shadow-inner">
            <canvas ref={canvasRef} width={640} height={144} className="h-full w-full" aria-label="Simulated signal waveform" role="img" />
            <div className="absolute left-3 top-3 flex items-center gap-2 rounded bg-black/80 px-2 py-1 font-mono text-[9px] font-bold text-cyan-300 border border-cyan-800/40">
              <Volume2 className="h-3 w-3 animate-pulse text-cyan-400" />
              <span>SPECTRUM VISUALIZER // LIVE</span>
            </div>
            <div className="absolute right-3 top-3 rounded bg-black/80 px-2 py-1 font-mono text-[9px] text-amber-300 border border-amber-800/40">
              FREQ: 440.25 MHz
            </div>
          </div>

          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/[0.08] bg-black/40 p-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => { setIsPlaying(!isPlaying); playClick(); }}
                disabled={transcriptIndex >= TRANSCRIPT.length && !isPlaying}
                className="flex min-h-9 items-center gap-2 rounded-xl bg-cyan-400 px-3.5 font-tech text-xs font-bold uppercase tracking-wider text-slate-950 hover:bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.3)] transition-all"
              >
                {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                <span>{isPlaying ? 'PAUSE' : 'RESUME'}</span>
              </button>

              <button
                type="button"
                onClick={restart}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.02] text-slate-400 hover:text-white transition-colors"
                aria-label="Restart transcript"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center gap-1 rounded-xl border border-white/[0.08] bg-black/50 p-1 font-mono text-[10px]">
              <span className="text-[9px] text-slate-500 font-bold px-1.5 uppercase">SPEED:</span>
              {[0.5, 1, 1.5, 2].map((value) => (
                <button
                  type="button"
                  key={value}
                  onClick={() => { setSpeed(value); playBeep(); }}
                  aria-pressed={speed === value}
                  className={`rounded-lg px-2 py-1 font-bold ${
                    speed === value ? 'bg-cyan-400 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {value}×
                </button>
              ))}
            </div>
          </div>

          {/* Decoded Output Box */}
          <div className="min-h-40 flex-1 rounded-2xl border border-white/[0.08] bg-black/40 p-4 font-mono text-xs">
            <div className="mb-3 flex items-center justify-between border-b border-white/[0.08] pb-2 text-[9px] font-bold uppercase tracking-wider text-slate-400">
              <span className="text-cyan-400">DECRYPTED RADIO BURST LOG</span>
              <span>{transcriptIndex}/{TRANSCRIPT.length} LINES DECODED</span>
            </div>
            <div className="space-y-2.5">
              {transcriptIndex === 0 && (
                <p className="text-slate-500 italic">Synchronizing receiver buffer…</p>
              )}
              {TRANSCRIPT.slice(0, transcriptIndex).map((line) => (
                <p key={line} className="select-text leading-relaxed text-slate-200">
                  <span className="text-cyan-400 font-bold">{line.slice(0, 10)}</span>
                  <span>{line.slice(10)}</span>
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex shrink-0 justify-end border-t border-white/[0.08] bg-black/30 px-5 py-3">
          <button
            type="button"
            onClick={downloadTranscript}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 font-mono text-xs font-bold text-slate-200 hover:bg-white/10 transition-colors"
          >
            <Download className="h-3.5 w-3.5 text-cyan-400" />
            <span>EXPORT TRANSCRIPT (.TXT)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
