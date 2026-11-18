import React, { useEffect, useRef, useState } from 'react';
import { Download, Pause, Play, Radio, RotateCcw, X } from 'lucide-react';
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
      context.strokeStyle = 'rgba(34, 211, 238, 0.10)';
      context.lineWidth = 1;
      context.beginPath();
      for (let x = 0; x < width; x += 30) {
        context.moveTo(x, 0);
        context.lineTo(x, height);
      }
      context.stroke();

      context.strokeStyle = isPlaying ? '#22d3ee' : '#64748b';
      context.lineWidth = 2;
      context.beginPath();
      const centerY = height / 2;
      step += isPlaying ? 0.08 * speed : 0;
      for (let x = 0; x < width; x += 4) {
        const amplitude = isPlaying ? Math.sin(x * 0.03 + step) * 28 * Math.cos(x * 0.01) : 4;
        const y = centerY + amplitude;
        if (x === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
      }
      context.stroke();
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
    const content = `ARION INTERCEPT TRANSCRIPT — SIMULATED DATA\nFrequency: 440.25 MHz\n\n${TRANSCRIPT.join('\n\n')}`;
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-3 backdrop-blur-sm sm:p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="relative flex max-h-[calc(100dvh-1.5rem)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0b1018] shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="intercept-title">
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-white/[0.07] px-4 py-4 sm:px-5">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-400/10 text-amber-400"><Radio className="h-5 w-5" /></span>
            <div className="min-w-0"><h2 id="intercept-title" className="truncate text-sm font-semibold text-white">Intercept transcript simulator</h2><p className="mt-1 truncate text-[10px] text-slate-500">440.25 MHz · Simulated signal · 98.4% lock</p></div>
          </div>
          <button type="button" onClick={() => { playBeep(); onClose(); }} className="rounded-lg p-2 text-slate-500 hover:bg-white/[0.05] hover:text-white" aria-label="Close intercept simulator"><X className="h-5 w-5" /></button>
        </div>

        <div className="flex min-h-0 flex-col gap-4 overflow-y-auto p-4 custom-scrollbar sm:p-5">
          <div className="rounded-lg border border-amber-400/15 bg-amber-400/[0.05] px-3 py-2 text-[10px] text-amber-200/80">Visualization and transcript use simulated data; no recorded audio is played.</div>
          <div className="relative h-32 overflow-hidden rounded-xl border border-white/[0.07] bg-black/20">
            <canvas ref={canvasRef} width={600} height={128} className="h-full w-full" aria-label="Simulated signal waveform" role="img" />
            <span className="absolute left-2 top-2 rounded bg-black/70 px-2 py-1 font-mono text-[9px] text-cyan-300">SIGNAL VISUALIZATION</span>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/[0.07] bg-black/10 p-2.5">
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => { setIsPlaying(!isPlaying); playClick(); }} disabled={transcriptIndex >= TRANSCRIPT.length && !isPlaying} className="flex min-h-9 items-center gap-2 rounded-lg bg-cyan-400 px-3 text-[10px] font-semibold text-slate-950 hover:bg-cyan-300">
                {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                {isPlaying ? 'Pause transcript' : 'Resume transcript'}
              </button>
              <button type="button" onClick={restart} className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] text-slate-400 hover:text-white" aria-label="Restart transcript"><RotateCcw className="h-4 w-4" /></button>
            </div>
            <div className="flex items-center gap-1 rounded-lg border border-white/[0.07] p-1" aria-label="Transcript speed">
              {[0.5, 1, 1.5, 2].map((value) => <button type="button" key={value} onClick={() => { setSpeed(value); playBeep(); }} aria-pressed={speed === value} className={`rounded px-2 py-1 font-mono text-[10px] ${speed === value ? 'bg-cyan-400/15 text-cyan-200' : 'text-slate-500 hover:text-white'}`}>{value}×</button>)}
            </div>
          </div>

          <div className="min-h-40 flex-1 rounded-xl border border-white/[0.07] bg-black/10 p-4 font-mono text-xs">
            <div className="mb-3 flex items-center justify-between border-b border-white/[0.07] pb-2 text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-500"><span>Decoded transcript</span><span>{transcriptIndex}/{TRANSCRIPT.length} lines</span></div>
            <div className="space-y-3" aria-live="polite" aria-relevant="additions">
              {transcriptIndex === 0 && <p className="text-slate-600">Waiting for the next simulated message…</p>}
              {TRANSCRIPT.slice(0, transcriptIndex).map((line) => <p key={line} className="select-text leading-relaxed text-slate-300">{line}</p>)}
            </div>
          </div>
        </div>

        <div className="flex shrink-0 justify-end border-t border-white/[0.07] bg-black/10 px-4 py-3 sm:px-5">
          <button type="button" onClick={downloadTranscript} className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-white/[0.05]"><Download className="h-3.5 w-3.5" />Download transcript</button>
        </div>
      </div>
    </div>
  );
}
