import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  Crosshair,
  Download,
  Layers3,
  LoaderCircle,
  LocateFixed,
  Maximize2,
  Minimize2,
  Minus,
  Plus,
  Radio,
  Satellite,
  ShieldAlert,
  Signal,
  X,
} from 'lucide-react';
import { playAlarm, playBeep, playClick } from '../utils/soundEngine';

const MAP_WIDTH = 1200;
const MAP_HEIGHT = 600;

const TACTICAL_HOTSPOTS = [
  { id: 'pin-1', code: 'NYC-01', title: 'Gotham Central Hub', region: 'North Atlantic seaboard', latitude: 40.7128, longitude: -74.006, status: 'CRITICAL', threat: 'Marcus Thompson detected', commander: 'Alpha-1', signal: '98.4%' },
  { id: 'pin-2', code: 'LON-04', title: 'London Intercept Outpost', region: 'United Kingdom', latitude: 51.5074, longitude: -0.1278, status: 'ELEVATED', threat: 'Encrypted signal anomaly', commander: 'Bravo-4', signal: '86.7%' },
  { id: 'pin-3', code: 'TYO-09', title: 'Tokyo Surveillance Station', region: 'Kanto relay corridor', latitude: 35.6762, longitude: 139.6503, status: 'SECURE', threat: 'Data relay synchronized', commander: 'Kilo-9', signal: '99.9%' },
  { id: 'pin-4', code: 'BER-02', title: 'Berlin Relay Grid', region: 'Central European sector', latitude: 52.52, longitude: 13.405, status: 'ACTIVE', threat: 'David Richardson tracked', commander: 'Echo-2', signal: '92.3%' },
];

const STATUS_COLORS = {
  CRITICAL: '#fb7185',
  ELEVATED: '#fbbf24',
  ACTIVE: '#22d3ee',
  SECURE: '#34d399',
};

const FILTERS = ['ALL', 'HOSTILE', 'INTERCEPT', 'SECURE'];

function matchesFilter(hotspot, filter) {
  if (filter === 'ALL') return true;
  if (filter === 'HOSTILE') return hotspot.status === 'CRITICAL';
  if (filter === 'INTERCEPT') return ['ELEVATED', 'ACTIVE'].includes(hotspot.status);
  return hotspot.status === filter;
}

function project(latitude, longitude) {
  return {
    x: ((longitude + 180) / 360) * MAP_WIDTH,
    y: ((90 - latitude) / 180) * MAP_HEIGHT,
  };
}

function SatelliteBasemap() {
  return (
    <defs>
      <radialGradient id="satelliteVignette" cx="50%" cy="45%" r="72%">
        <stop offset="0" stopColor="#02080d" stopOpacity="0.08" />
        <stop offset="0.68" stopColor="#02080d" stopOpacity="0.2" />
        <stop offset="1" stopColor="#010407" stopOpacity="0.72" />
      </radialGradient>
      <linearGradient id="satelliteTint" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#053642" stopOpacity="0.2" />
        <stop offset="0.52" stopColor="#06141c" stopOpacity="0.05" />
        <stop offset="1" stopColor="#020910" stopOpacity="0.32" />
      </linearGradient>
      <pattern id="satelliteGrid" width="100" height="100" patternUnits="userSpaceOnUse">
        <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#67e8f9" strokeOpacity="0.075" strokeWidth="0.8" />
      </pattern>
      <filter id="satelliteSoftGlow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="9" />
      </filter>
    </defs>
  );
}

export default function TacticalMap({ onSelectTarget, onNotify }) {
  const [activeSignalFilter, setActiveSignalFilter] = useState('ALL');
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [showOverlays, setShowOverlays] = useState(true);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const hotspots = useMemo(() => TACTICAL_HOTSPOTS.map((hotspot) => ({
    ...hotspot,
    ...project(hotspot.latitude, hotspot.longitude),
  })), []);
  const visibleHotspots = hotspots.filter((hotspot) => matchesFilter(hotspot, activeSignalFilter));
  const viewWidth = MAP_WIDTH / zoom;
  const viewHeight = MAP_HEIGHT / zoom;
  const center = selectedHotspot && zoom > 1 ? selectedHotspot : { x: MAP_WIDTH / 2, y: MAP_HEIGHT / 2 };
  const viewX = Math.max(0, Math.min(MAP_WIDTH - viewWidth, center.x - viewWidth / 2));
  const viewY = Math.max(0, Math.min(MAP_HEIGHT - viewHeight, center.y - viewHeight / 2));

  const changeZoom = (nextZoom) => {
    setZoom(Math.max(1, Math.min(2.4, nextZoom)));
    playBeep();
  };

  const resetMap = () => {
    setZoom(1);
    setSelectedHotspot(null);
    playClick();
  };

  const selectHotspot = (hotspot) => {
    setSelectedHotspot(hotspot);
    playAlarm();
  };

  useEffect(() => {
    if (!isFocusMode) return undefined;
    const handleEscape = (event) => {
      if (event.key === 'Escape') setIsFocusMode(false);
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isFocusMode]);

  const exportSnapshot = async () => {
    if (isExporting) return;
    setIsExporting(true);
    playClick();
    try {
      const image = new Image();
      image.src = '/assets/satellite_world_view.jpg';
      await image.decode();

      const canvas = document.createElement('canvas');
      canvas.width = 1600;
      canvas.height = 1000;
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Canvas is unavailable');

      context.fillStyle = '#03090d';
      context.fillRect(0, 0, canvas.width, canvas.height);
      const sourceX = (viewX / MAP_WIDTH) * image.naturalWidth;
      const sourceY = (viewY / MAP_HEIGHT) * image.naturalHeight;
      const sourceWidth = (viewWidth / MAP_WIDTH) * image.naturalWidth;
      const sourceHeight = (viewHeight / MAP_HEIGHT) * image.naturalHeight;
      context.filter = 'saturate(0.62) brightness(0.72) contrast(1.18)';
      context.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, canvas.width, canvas.height);
      context.filter = 'none';

      const shade = context.createRadialGradient(800, 450, 100, 800, 450, 900);
      shade.addColorStop(0, 'rgba(2, 8, 13, 0.05)');
      shade.addColorStop(1, 'rgba(1, 4, 7, 0.68)');
      context.fillStyle = shade;
      context.fillRect(0, 0, canvas.width, canvas.height);

      const scaleX = canvas.width / viewWidth;
      const scaleY = canvas.height / viewHeight;
      const pointOnCanvas = (hotspot) => ({
        x: (hotspot.x - viewX) * scaleX,
        y: (hotspot.y - viewY) * scaleY,
      });

      if (showOverlays) {
        context.strokeStyle = 'rgba(103, 232, 249, 0.09)';
        context.lineWidth = 1;
        for (let x = 0; x < canvas.width; x += 100) {
          context.beginPath(); context.moveTo(x, 0); context.lineTo(x, canvas.height); context.stroke();
        }
        for (let y = 0; y < canvas.height; y += 100) {
          context.beginPath(); context.moveTo(0, y); context.lineTo(canvas.width, y); context.stroke();
        }
        if (visibleHotspots.length > 1) {
          const origin = pointOnCanvas(visibleHotspots[0]);
          context.setLineDash([7, 11]);
          context.strokeStyle = 'rgba(56, 189, 248, 0.38)';
          visibleHotspots.slice(1).forEach((hotspot) => {
            const destination = pointOnCanvas(hotspot);
            context.beginPath();
            context.moveTo(origin.x, origin.y);
            context.quadraticCurveTo((origin.x + destination.x) / 2, Math.min(origin.y, destination.y) - 90, destination.x, destination.y);
            context.stroke();
          });
          context.setLineDash([]);
        }
      }

      visibleHotspots.forEach((hotspot) => {
        const { x, y } = pointOnCanvas(hotspot);
        if (x < -50 || y < -50 || x > canvas.width + 50 || y > canvas.height + 50) return;
        const color = STATUS_COLORS[hotspot.status];
        context.strokeStyle = color;
        context.fillStyle = '#061016';
        context.lineWidth = 2;
        context.beginPath(); context.arc(x, y, 13, 0, Math.PI * 2); context.fill(); context.stroke();
        context.fillStyle = color;
        context.beginPath(); context.arc(x, y, 4, 0, Math.PI * 2); context.fill();
        if (showOverlays) {
          context.fillStyle = 'rgba(5, 11, 16, 0.9)';
          context.fillRect(x + 20, y - 12, 116, 31);
          context.font = '600 11px monospace';
          context.fillStyle = color;
          context.fillText(`${hotspot.code} · ${hotspot.signal}`, x + 27, y + 7);
        }
      });

      const headerHeight = 76;
      context.fillStyle = 'rgba(4, 10, 15, 0.9)';
      context.fillRect(0, 0, canvas.width, headerHeight);
      context.fillStyle = '#e2e8f0';
      context.font = '600 22px sans-serif';
      context.fillText('ARION // GLOBAL SATELLITE', 28, 34);
      context.font = '13px monospace';
      context.fillStyle = '#67e8f9';
      context.fillText(`SIMULATED INTELLIGENCE · FILTER: ${activeSignalFilter} · ZOOM: ${zoom.toFixed(2)}×`, 28, 58);
      context.textAlign = 'right';
      context.fillStyle = '#94a3b8';
      context.fillText(new Date().toISOString(), canvas.width - 28, 45);
      context.textAlign = 'left';
      context.fillStyle = 'rgba(4, 10, 15, 0.85)';
      context.fillRect(0, canvas.height - 44, canvas.width, 44);
      context.fillStyle = '#94a3b8';
      context.font = '12px monospace';
      context.fillText(`${visibleHotspots.length} VISIBLE SIGNALS · SAT-LINK 04 · DEMONSTRATION DATA`, 28, canvas.height - 17);

      const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
      if (!blob) throw new Error('Image encoding failed');
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `arion-satellite-${activeSignalFilter.toLowerCase()}-${new Date().toISOString().replaceAll(':', '-').replaceAll('.', '-')}.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 0);
      onNotify?.('Satellite snapshot downloaded with the current filters and zoom.');
    } catch {
      onNotify?.('Unable to export the satellite snapshot. Please try again.', 'warning');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <section className={`flex w-full min-w-0 shrink-0 flex-col overflow-hidden rounded-xl border border-white/[0.09] bg-[#070b10] shadow-2xl shadow-black/20 ${isFocusMode ? 'fixed inset-2 z-[60] h-auto sm:inset-4' : 'relative h-[500px] sm:h-[520px] lg:h-full lg:min-h-[380px] lg:shrink'}`} aria-label="Global satellite radar">
      <header className="z-20 shrink-0 border-b border-white/[0.07] bg-[#0b1017] px-3.5 py-3 sm:px-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-cyan-400/20 bg-cyan-400/[0.07] text-cyan-300">
              <Satellite className="h-4 w-4" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="truncate text-xs font-semibold text-slate-100">Global satellite</h2>
                <span className="rounded border border-emerald-400/15 bg-emerald-400/[0.07] px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-wider text-emerald-300">Online</span>
              </div>
              <p className="mt-0.5 truncate text-[9px] text-slate-500">Synthetic orbital reconnaissance · Sector HJ-66</p>
            </div>
          </div>
          <span className="hidden shrink-0 items-center gap-1.5 font-mono text-[9px] text-slate-500 md:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
            SAT-LINK 04
          </span>
        </div>
        <div className="mt-3 flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-0.5 overflow-x-auto rounded-lg border border-white/[0.07] bg-black/20 p-0.5 no-scrollbar" aria-label="Filter signals">
            {FILTERS.map((filter) => (
              <button
                type="button"
                key={filter}
                onClick={() => { setActiveSignalFilter(filter); setSelectedHotspot(null); setZoom(1); playClick(); }}
                aria-pressed={activeSignalFilter === filter}
                className={`shrink-0 rounded-md px-2.5 py-1.5 text-[9px] font-semibold transition-colors ${activeSignalFilter === filter ? 'bg-cyan-400/[0.13] text-cyan-200' : 'text-slate-500 hover:bg-white/[0.03] hover:text-slate-300'}`}
              >
                {filter}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => { setShowOverlays((current) => !current); playClick(); }}
            aria-pressed={showOverlays}
            className={`flex h-8 shrink-0 items-center gap-1.5 rounded-lg border px-2.5 text-[9px] font-medium transition-colors ${showOverlays ? 'border-cyan-400/20 bg-cyan-400/[0.06] text-cyan-300' : 'border-white/[0.08] text-slate-500 hover:text-slate-300'}`}
          >
            <Layers3 className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">Overlays</span>
          </button>
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={exportSnapshot}
              disabled={isExporting}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] text-slate-400 transition-colors hover:border-cyan-400/25 hover:text-cyan-300"
              aria-label="Export satellite snapshot"
              title="Export current satellite view as PNG"
            >
              {isExporting ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
            </button>
            <button
              type="button"
              onClick={() => { setIsFocusMode((current) => !current); playClick(); }}
              className={`flex h-8 items-center gap-1.5 rounded-lg border px-2 text-[9px] font-medium transition-colors ${isFocusMode ? 'border-cyan-400/25 bg-cyan-400/[0.08] text-cyan-200' : 'border-white/[0.08] text-slate-400 hover:border-cyan-400/25 hover:text-cyan-300'}`}
              aria-label={isFocusMode ? 'Exit satellite focus mode' : 'Enter satellite focus mode'}
              aria-pressed={isFocusMode}
              title={isFocusMode ? 'Exit focus mode (Escape)' : 'Distraction-free focus mode'}
            >
              {isFocusMode ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
              <span className="hidden sm:inline">{isFocusMode ? 'Exit focus' : 'Focus'}</span>
            </button>
          </div>
        </div>
      </header>

      <div className="relative min-h-0 flex-1 overflow-hidden bg-[#03090d]">
        <svg
          className="h-full w-full"
          viewBox={`${viewX} ${viewY} ${viewWidth} ${viewHeight}`}
          preserveAspectRatio="xMidYMid slice"
          role="group"
          aria-label="Simulated satellite world map with selectable tactical signals"
        >
          <SatelliteBasemap />
          <image
            href="/assets/satellite_world_view.jpg"
            x="0"
            y="0"
            width={MAP_WIDTH}
            height={MAP_HEIGHT}
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
            style={{ filter: 'saturate(0.62) brightness(0.72) contrast(1.18)' }}
          />
          <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill="url(#satelliteTint)" />
          <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill="url(#satelliteVignette)" />
          {showOverlays && (
            <g opacity="0.32" fill="none" stroke="#4b8b97" strokeWidth="0.8" strokeDasharray="2 7">
              <path d="M0 100 Q280 70 600 100 T1200 100" />
              <path d="M0 300 Q300 275 600 300 T1200 300" />
              <path d="M0 500 Q280 530 600 500 T1200 500" />
            </g>
          )}
          <ellipse cx="355" cy="215" rx="120" ry="60" fill="#06b6d4" opacity="0.09" filter="url(#satelliteSoftGlow)" />
          <ellipse cx="650" cy="175" rx="105" ry="54" fill="#06b6d4" opacity="0.06" filter="url(#satelliteSoftGlow)" />
          {showOverlays && <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill="url(#satelliteGrid)" />}

          {showOverlays && (
            <g fill="none" stroke="#38bdf8" strokeOpacity="0.24" strokeWidth="1.1" strokeDasharray="5 8">
              {visibleHotspots.slice(1).map((hotspot) => {
                const origin = visibleHotspots[0];
                const middleX = (origin.x + hotspot.x) / 2;
                const middleY = Math.min(origin.y, hotspot.y) - Math.abs(origin.x - hotspot.x) * 0.12;
                return <path key={`${origin.id}-${hotspot.id}`} d={`M${origin.x} ${origin.y} Q${middleX} ${middleY} ${hotspot.x} ${hotspot.y}`} />;
              })}
            </g>
          )}

          {visibleHotspots.map((hotspot) => {
            const color = STATUS_COLORS[hotspot.status];
            const isSelected = selectedHotspot?.id === hotspot.id;
            return (
              <g
                key={hotspot.id}
                className="satellite-hotspot"
                role="button"
                tabIndex="0"
                aria-label={`${hotspot.title}, ${hotspot.status}`}
                onClick={() => selectHotspot(hotspot)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    selectHotspot(hotspot);
                  }
                }}
              >
                {showOverlays && <circle cx={hotspot.x} cy={hotspot.y} r="28" fill="none" stroke={color} strokeOpacity="0.25" strokeWidth="1" className="satellite-pulse" />}
                <circle cx={hotspot.x} cy={hotspot.y} r={isSelected ? 17 : 13} fill="#061016" fillOpacity="0.9" stroke={color} strokeWidth={isSelected ? 2.5 : 1.5} />
                <circle cx={hotspot.x} cy={hotspot.y} r="4.5" fill={color} />
                <path d={`M${hotspot.x - 21} ${hotspot.y} h9 M${hotspot.x + 12} ${hotspot.y} h9 M${hotspot.x} ${hotspot.y - 21} v9 M${hotspot.x} ${hotspot.y + 12} v9`} stroke={color} strokeOpacity="0.55" strokeWidth="1" />
                {showOverlays && (
                  <g transform={`translate(${hotspot.x + 23} ${hotspot.y - 10})`}>
                    <rect width="76" height="25" rx="4" fill="#050b10" fillOpacity="0.9" stroke={color} strokeOpacity="0.28" />
                    <text x="8" y="10.5" fill={color} fontSize="8" fontFamily="JetBrains Mono, monospace" fontWeight="700">{hotspot.code}</text>
                    <text x="8" y="19.5" fill="#94a3b8" fontSize="6.5" fontFamily="JetBrains Mono, monospace">{hotspot.signal} SIGNAL</text>
                  </g>
                )}
              </g>
            );
          })}
          <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill="none" stroke="#155e75" strokeOpacity="0.18" strokeWidth="4" />
        </svg>

        {showOverlays && <div className="satellite-scan pointer-events-none absolute inset-x-0 top-0 z-10 h-20 bg-gradient-to-b from-transparent via-cyan-300/[0.035] to-cyan-300/10" />}

        <div className="pointer-events-none absolute left-3 top-3 z-20 rounded-lg border border-white/10 bg-[#050b10]/85 px-2.5 py-2 font-mono backdrop-blur-md">
          <div className="flex items-center gap-1.5 text-[8px] font-semibold tracking-wider text-cyan-300"><Crosshair className="h-3 w-3" /> ORBITAL SWEEP</div>
          <p className="mt-1 text-[8px] text-slate-500">ALT 512 KM · PASS 00841</p>
          <p className="mt-0.5 text-[8px] text-slate-600">SIMULATED IMAGERY</p>
        </div>

        <div className="absolute right-3 top-3 z-20 flex flex-col overflow-hidden rounded-lg border border-white/10 bg-[#050b10]/90 shadow-lg backdrop-blur-md">
          <button type="button" onClick={() => changeZoom(zoom + 0.35)} disabled={zoom >= 2.4} className="flex h-8 w-8 items-center justify-center text-slate-300 hover:bg-white/[0.06] hover:text-cyan-300" aria-label="Zoom satellite map in"><Plus className="h-3.5 w-3.5" /></button>
          <span className="h-px bg-white/[0.08]" />
          <button type="button" onClick={() => changeZoom(zoom - 0.35)} disabled={zoom <= 1} className="flex h-8 w-8 items-center justify-center text-slate-300 hover:bg-white/[0.06] hover:text-cyan-300" aria-label="Zoom satellite map out"><Minus className="h-3.5 w-3.5" /></button>
          <span className="h-px bg-white/[0.08]" />
          <button type="button" onClick={resetMap} className="flex h-8 w-8 items-center justify-center text-slate-500 hover:bg-white/[0.06] hover:text-cyan-300" aria-label="Reset satellite map"><LocateFixed className="h-3.5 w-3.5" /></button>
        </div>

        <div className="pointer-events-none absolute bottom-3 left-3 z-20 flex items-center gap-3 rounded-lg border border-white/[0.08] bg-[#050b10]/85 px-2.5 py-2 text-[8px] backdrop-blur-md">
          {Object.entries(STATUS_COLORS).slice(0, 3).map(([status, color]) => (
            <span key={status} className="flex items-center gap-1.5 text-slate-400"><span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />{status}</span>
          ))}
        </div>

        <span className="pointer-events-none absolute bottom-3 right-3 z-20 rounded border border-white/[0.08] bg-[#050b10]/85 px-2 py-1 font-mono text-[8px] text-slate-500 backdrop-blur-md">ZOOM {zoom.toFixed(2)}×</span>

        {selectedHotspot && (
          <div className="absolute right-3 top-28 z-30 w-[min(290px,calc(100%-1.5rem))] rounded-xl border border-cyan-400/20 bg-[#091119]/95 p-4 shadow-2xl shadow-black/50 backdrop-blur-xl sm:top-24" role="dialog" aria-label="Satellite signal details">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-start gap-2.5">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-red-400/20 bg-red-400/[0.07] text-red-300"><ShieldAlert className="h-4 w-4" /></span>
                <div className="min-w-0"><p className="font-mono text-[9px] font-semibold text-cyan-400">{selectedHotspot.code} // {selectedHotspot.status}</p><h3 className="mt-1 text-xs font-semibold text-white">{selectedHotspot.title}</h3><p className="mt-0.5 text-[9px] text-slate-500">{selectedHotspot.region}</p></div>
              </div>
              <button type="button" onClick={() => { setSelectedHotspot(null); setZoom(1); }} className="rounded p-1 text-slate-500 hover:bg-white/[0.05] hover:text-white" aria-label="Close satellite signal details"><X className="h-3.5 w-3.5" /></button>
            </div>
            <dl className="mt-4 space-y-2.5 border-t border-white/[0.07] pt-3 text-[10px]">
              <div className="flex justify-between gap-3"><dt className="text-slate-500">Signal confidence</dt><dd className="font-mono font-medium text-emerald-300">{selectedHotspot.signal}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-slate-500">Coordinates</dt><dd className="font-mono text-slate-300">{selectedHotspot.latitude.toFixed(2)}°, {selectedHotspot.longitude.toFixed(2)}°</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-slate-500">Commander</dt><dd className="font-mono text-cyan-300">{selectedHotspot.commander}</dd></div>
              <div><dt className="text-slate-500">Intelligence</dt><dd className="mt-1 text-slate-300">{selectedHotspot.threat}</dd></div>
            </dl>
            <button type="button" onClick={() => { onSelectTarget?.(selectedHotspot); setSelectedHotspot(null); setZoom(1); playClick(); }} className="mt-4 flex min-h-9 w-full items-center justify-center gap-2 rounded-lg bg-cyan-400 text-[10px] font-semibold text-slate-950 hover:bg-cyan-300"><Crosshair className="h-3.5 w-3.5" />Open target dossier</button>
          </div>
        )}
      </div>

      <footer className="grid shrink-0 grid-cols-3 divide-x divide-white/[0.06] border-t border-white/[0.07] bg-[#090e14] px-1 py-2.5">
        <div className="flex items-center justify-center gap-2"><Signal className="h-3.5 w-3.5 text-cyan-500" /><div><p className="text-[8px] uppercase tracking-wider text-slate-600">Visible signals</p><p className="mt-0.5 font-mono text-[10px] font-semibold text-slate-300">{visibleHotspots.length} / {hotspots.length}</p></div></div>
        <div className="flex items-center justify-center gap-2"><Radio className="h-3.5 w-3.5 text-emerald-500" /><div><p className="text-[8px] uppercase tracking-wider text-slate-600">Downlink</p><p className="mt-0.5 font-mono text-[10px] font-semibold text-emerald-300">1.44 Gbps</p></div></div>
        <div className="flex items-center justify-center gap-2"><Activity className="h-3.5 w-3.5 text-slate-500" /><div><p className="text-[8px] uppercase tracking-wider text-slate-600">Refresh</p><p className="mt-0.5 font-mono text-[10px] font-semibold text-slate-300">00:04 UTC</p></div></div>
      </footer>
    </section>
  );
}
