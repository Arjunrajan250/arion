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
  Signal,
  X,
} from 'lucide-react';
import { playAlarm, playBeep, playClick } from '../utils/soundEngine';

const MAP_WIDTH = 1200;
const MAP_HEIGHT = 600;

const TACTICAL_HOTSPOTS = [
  { id: 'pin-1', code: 'NYC-01', title: 'Gotham Central Hub', region: 'North Atlantic seaboard', latitude: 40.7128, longitude: -74.006, status: 'CRITICAL', threat: 'Marcus Thompson detected', commander: 'Alpha-1', signal: '98.4%', mugshot: '/assets/marcus_thompson.png' },
  { id: 'pin-2', code: 'LON-04', title: 'London Intercept Outpost', region: 'United Kingdom', latitude: 51.5074, longitude: -0.1278, status: 'ELEVATED', threat: 'Encrypted signal anomaly', commander: 'Bravo-4', signal: '86.7%', mugshot: '/assets/suspect_face_scan.jpg' },
  { id: 'pin-3', code: 'TYO-09', title: 'Tokyo Surveillance Station', region: 'Kanto relay corridor', latitude: 35.6762, longitude: 139.6503, status: 'SECURE', threat: 'Data relay synchronized', commander: 'Kilo-9', signal: '99.9%', mugshot: '/assets/target_kingfish_portrait.jpg' },
  { id: 'pin-4', code: 'BER-02', title: 'Berlin Relay Grid', region: 'Central European sector', latitude: 52.52, longitude: 13.405, status: 'ACTIVE', threat: 'David Richardson tracked', commander: 'Echo-2', signal: '92.3%', mugshot: '/assets/david_richardson.png' },
];

const STATUS_COLORS = {
  CRITICAL: '#fb7185',
  ELEVATED: '#fbbf24',
  ACTIVE: '#22d3ee',
  SECURE: '#34d399',
};

const FILTERS = ['ALL', 'HOSTILE', 'INTERCEPT', 'SECURE'];

const MAP_MODES = [
  { id: 'recon', label: 'Orbital Recon' },
  { id: 'night', label: 'NVG Night Vision' },
  { id: 'thermal', label: 'FLIR Thermal' },
  { id: 'wireframe', label: 'Vector Grid' },
];

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
        <stop offset="0" stopColor="#02080d" stopOpacity="0.05" />
        <stop offset="0.68" stopColor="#02080d" stopOpacity="0.25" />
        <stop offset="1" stopColor="#010407" stopOpacity="0.8" />
      </radialGradient>
      <linearGradient id="satelliteTint" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#053642" stopOpacity="0.2" />
        <stop offset="0.52" stopColor="#06141c" stopOpacity="0.05" />
        <stop offset="1" stopColor="#020910" stopOpacity="0.35" />
      </linearGradient>
      <pattern id="satelliteGrid" width="80" height="80" patternUnits="userSpaceOnUse">
        <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#67e8f9" strokeOpacity="0.06" strokeWidth="0.8" />
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
  const [mapMode, setMapMode] = useState('recon');
  const [zoom, setZoom] = useState(1);
  const [showOverlays, setShowOverlays] = useState(true);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [cursorCoords, setCursorCoords] = useState({ lat: 40.71, lon: -74.01 });

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

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width;
    const relY = (e.clientY - rect.top) / rect.height;
    const mapX = viewX + relX * viewWidth;
    const mapY = viewY + relY * viewHeight;
    const lon = (mapX / MAP_WIDTH) * 360 - 180;
    const lat = 90 - (mapY / MAP_HEIGHT) * 180;
    setCursorCoords({ lat, lon });
  };

  useEffect(() => {
    if (!isFocusMode) return undefined;
    const handleEscape = (event) => {
      if (event.key === 'Escape') setIsFocusMode(false);
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isFocusMode]);

  const getImageFilter = () => {
    switch (mapMode) {
      case 'thermal':
        return 'invert(1) hue-rotate(180deg) saturate(2.2) contrast(1.35)';
      case 'night':
        return 'sepia(1) hue-rotate(75deg) saturate(3) contrast(1.25) brightness(1.1)';
      case 'wireframe':
        return 'grayscale(1) contrast(2.2) brightness(0.65)';
      default:
        return 'saturate(0.65) brightness(0.75) contrast(1.2)';
    }
  };

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

      context.filter = 'saturate(0.65) brightness(0.75) contrast(1.2)';
      context.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, canvas.width, canvas.height);
      context.filter = 'none';

      const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
      if (!blob) throw new Error('Image encoding failed');
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `arion-satellite-recon-${new Date().toISOString().slice(0, 10)}.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 0);
      onNotify?.('Satellite snapshot downloaded with active coordinates.');
    } catch {
      onNotify?.('Unable to export the satellite snapshot.', 'warning');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <section
      className={`tactical-corner flex w-full min-w-0 shrink-0 flex-col overflow-hidden rounded-xl border border-white/[0.09] bg-[#060a10] shadow-2xl shadow-black/30 ${
        isFocusMode
          ? 'fixed inset-2 z-[60] h-auto sm:inset-4'
          : 'relative h-[500px] sm:h-[520px] lg:h-full lg:min-h-[380px] lg:shrink'
      }`}
      aria-label="Global satellite radar"
    >
      {/* Tactical Radar Header Bar */}
      <header className="z-20 shrink-0 border-b border-white/[0.08] bg-[#080d16] px-3.5 py-2.5 sm:px-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-cyan-400/30 bg-cyan-400/[0.08] text-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.2)]">
              <Satellite className="h-4 w-4" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="truncate font-tech text-xs font-black uppercase tracking-wider text-white">GLOBAL SATELLITE RADAR</h2>
                <span className="rounded border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.5 font-mono text-[8px] font-bold uppercase tracking-wider text-emerald-400 animate-pulse">
                  ORBITAL SYNC
                </span>
              </div>
              <p className="truncate font-mono text-[9px] text-slate-500">Synthetic Reconnaissance Array · Sector HJ-66</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Map Mode Selector */}
            <div className="hidden sm:flex items-center gap-1 rounded-lg border border-white/[0.08] bg-black/40 p-0.5 font-mono text-[9px]">
              {MAP_MODES.map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => { setMapMode(mode.id); playClick(); }}
                  className={`rounded px-2 py-1 font-bold uppercase transition-all ${
                    mapMode === mode.id
                      ? 'bg-[var(--theme-accent)] text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>

            <span className="hidden shrink-0 items-center gap-1.5 font-mono text-[9px] text-slate-400 md:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-ping" />
              SAT-LINK 04
            </span>
          </div>
        </div>

        {/* Filter Pills Toolbar */}
        <div className="mt-2.5 flex items-center justify-between gap-2 border-t border-white/[0.06] pt-2">
          <div className="flex min-w-0 items-center gap-1 overflow-x-auto rounded-lg border border-white/[0.07] bg-black/30 p-1 no-scrollbar font-mono text-[9px]" aria-label="Filter signals">
            {FILTERS.map((filter) => (
              <button
                type="button"
                key={filter}
                onClick={() => { setActiveSignalFilter(filter); setSelectedHotspot(null); setZoom(1); playClick(); }}
                aria-pressed={activeSignalFilter === filter}
                className={`shrink-0 rounded-md px-2.5 py-1 font-bold transition-all ${
                  activeSignalFilter === filter
                    ? 'bg-cyan-400/20 text-cyan-200 border border-cyan-400/40'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            <button
              type="button"
              onClick={() => { setShowOverlays((current) => !current); playClick(); }}
              aria-pressed={showOverlays}
              className={`flex h-8 items-center gap-1.5 rounded-lg border px-2.5 font-mono text-[9px] font-bold transition-all ${
                showOverlays
                  ? 'border-cyan-400/30 bg-cyan-400/[0.08] text-cyan-300'
                  : 'border-white/[0.08] text-slate-500 hover:text-slate-300'
              }`}
            >
              <Layers3 className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">HUD Overlays</span>
            </button>

            <button
              type="button"
              onClick={exportSnapshot}
              disabled={isExporting}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.02] text-slate-400 transition-colors hover:border-cyan-400/30 hover:text-white"
              aria-label="Export satellite snapshot"
              title="Export snapshot"
            >
              {isExporting ? <LoaderCircle className="h-3.5 w-3.5 animate-spin text-cyan-400" /> : <Download className="h-3.5 w-3.5" />}
            </button>

            <button
              type="button"
              onClick={() => { setIsFocusMode((current) => !current); playClick(); }}
              className={`flex h-8 items-center gap-1.5 rounded-lg border px-2.5 font-mono text-[9px] font-bold transition-all ${
                isFocusMode
                  ? 'border-cyan-400/30 bg-cyan-400/[0.1] text-cyan-200'
                  : 'border-white/[0.08] text-slate-400 hover:border-cyan-400/30 hover:text-white'
              }`}
            >
              {isFocusMode ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
              <span className="hidden sm:inline">{isFocusMode ? 'Exit focus' : 'Focus'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* SVG Canvas Map Container */}
      <div
        className="relative min-h-0 flex-1 overflow-hidden bg-[#020508]"
        onMouseMove={handleMouseMove}
      >
        <svg
          className="h-full w-full"
          viewBox={`${viewX} ${viewY} ${viewWidth} ${viewHeight}`}
          preserveAspectRatio="xMidYMid slice"
          role="group"
          aria-label="Simulated satellite world map"
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
            style={{ filter: getImageFilter() }}
          />
          <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill="url(#satelliteTint)" />
          <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill="url(#satelliteVignette)" />

          {/* Tactical Latitude/Longitude Coordinate Grid */}
          {showOverlays && (
            <g opacity="0.35" fill="none" stroke="#4b8b97" strokeWidth="0.8" strokeDasharray="3 8">
              <path d="M0 100 Q280 70 600 100 T1200 100" />
              <path d="M0 300 Q300 275 600 300 T1200 300" />
              <path d="M0 500 Q280 530 600 500 T1200 500" />
            </g>
          )}

          {showOverlays && <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill="url(#satelliteGrid)" />}

          {/* Dotted Tactical Intercept Links between Nodes */}
          {showOverlays && (
            <g fill="none" stroke="#38bdf8" strokeOpacity="0.35" strokeWidth="1.2" strokeDasharray="6 8">
              {visibleHotspots.slice(1).map((hotspot) => {
                const origin = visibleHotspots[0];
                const middleX = (origin.x + hotspot.x) / 2;
                const middleY = Math.min(origin.y, hotspot.y) - Math.abs(origin.x - hotspot.x) * 0.12;
                return <path key={`${origin.id}-${hotspot.id}`} d={`M${origin.x} ${origin.y} Q${middleX} ${middleY} ${hotspot.x} ${hotspot.y}`} />;
              })}
            </g>
          )}

          {/* Hotspots Target Markers */}
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
                {showOverlays && (
                  <circle
                    cx={hotspot.x}
                    cy={hotspot.y}
                    r="28"
                    fill="none"
                    stroke={color}
                    strokeOpacity="0.35"
                    strokeWidth="1.2"
                    className="satellite-pulse"
                  />
                )}
                <circle cx={hotspot.x} cy={hotspot.y} r={isSelected ? 18 : 13} fill="#061016" fillOpacity="0.95" stroke={color} strokeWidth={isSelected ? 3 : 1.8} />
                <circle cx={hotspot.x} cy={hotspot.y} r="5" fill={color} />
                <path
                  d={`M${hotspot.x - 22} ${hotspot.y} h9 M${hotspot.x + 13} ${hotspot.y} h9 M${hotspot.x} ${hotspot.y - 22} v9 M${hotspot.x} ${hotspot.y + 13} v9`}
                  stroke={color}
                  strokeOpacity="0.75"
                  strokeWidth="1.2"
                />
                {showOverlays && (
                  <g transform={`translate(${hotspot.x + 24} ${hotspot.y - 12})`}>
                    <rect width="80" height="26" rx="4" fill="#04080e" fillOpacity="0.92" stroke={color} strokeOpacity="0.4" />
                    <text x="8" y="11" fill={color} fontSize="8.5" fontFamily="JetBrains Mono, monospace" fontWeight="700">{hotspot.code}</text>
                    <text x="8" y="20" fill="#94a3b8" fontSize="6.5" fontFamily="JetBrains Mono, monospace">{hotspot.signal} SIGNAL</text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {/* Sweeping Satellite Laser Line */}
        {showOverlays && (
          <div className="satellite-scan pointer-events-none absolute inset-x-0 top-0 z-10 h-28 bg-gradient-to-b from-transparent via-cyan-400/[0.04] to-cyan-400/15" />
        )}

        {/* Live Coordinate Ticker (Top Left) */}
        <div className="pointer-events-none absolute left-3 top-3 z-20 rounded-xl border border-white/10 bg-[#050b10]/90 px-3 py-2 font-mono text-[9px] backdrop-blur-md">
          <div className="flex items-center gap-1.5 font-bold tracking-wider text-cyan-300">
            <Crosshair className="h-3.5 w-3.5 text-cyan-400" />
            <span>ORBITAL RECON // SAT-04</span>
          </div>
          <p className="mt-1 text-slate-300 font-semibold">
            {cursorCoords.lat.toFixed(4)}° N, {cursorCoords.lon.toFixed(4)}° W
          </p>
          <p className="mt-0.5 text-slate-500">ALT 512 KM · AZ 184.2°</p>
        </div>

        {/* Zoom Controls (Top Right) */}
        <div className="absolute right-3 top-3 z-20 flex flex-col overflow-hidden rounded-xl border border-white/10 bg-[#050b10]/90 shadow-xl backdrop-blur-md">
          <button type="button" onClick={() => changeZoom(zoom + 0.35)} disabled={zoom >= 2.4} className="flex h-8 w-8 items-center justify-center text-slate-300 hover:bg-white/[0.08] hover:text-cyan-300 transition-colors" aria-label="Zoom in">
            <Plus className="h-3.5 w-3.5" />
          </button>
          <span className="h-px bg-white/[0.08]" />
          <button type="button" onClick={() => changeZoom(zoom - 0.35)} disabled={zoom <= 1} className="flex h-8 w-8 items-center justify-center text-slate-300 hover:bg-white/[0.08] hover:text-cyan-300 transition-colors" aria-label="Zoom out">
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="h-px bg-white/[0.08]" />
          <button type="button" onClick={resetMap} className="flex h-8 w-8 items-center justify-center text-slate-500 hover:bg-white/[0.08] hover:text-cyan-300 transition-colors" aria-label="Reset map">
            <LocateFixed className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Status Legend (Bottom Left) */}
        <div className="pointer-events-none absolute bottom-3 left-3 z-20 flex items-center gap-3 rounded-lg border border-white/[0.08] bg-[#050b10]/90 px-3 py-1.5 font-mono text-[8px] backdrop-blur-md">
          {Object.entries(STATUS_COLORS).map(([status, color]) => (
            <span key={status} className="flex items-center gap-1.5 text-slate-300">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
              {status}
            </span>
          ))}
        </div>

        {/* Zoom Readout (Bottom Right) */}
        <span className="pointer-events-none absolute bottom-3 right-3 z-20 rounded-lg border border-white/[0.08] bg-[#050b10]/90 px-2 py-1 font-mono text-[9px] text-slate-400 backdrop-blur-md">
          ZOOM {zoom.toFixed(2)}×
        </span>

        {/* Selected Hotspot Intelligence Modal Card */}
        {selectedHotspot && (
          <div
            className="tactical-corner absolute right-3 top-24 z-30 w-[min(300px,calc(100%-1.5rem))] rounded-2xl border border-cyan-400/40 bg-[#091119]/95 p-4 shadow-2xl shadow-black/80 backdrop-blur-xl"
            role="dialog"
            aria-label="Satellite signal details"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-start gap-2.5">
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-cyan-500/40 bg-slate-900">
                  <img src={selectedHotspot.mugshot} alt="" className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0 font-mono">
                  <p className="text-[9px] font-bold text-cyan-400">{selectedHotspot.code} // {selectedHotspot.status}</p>
                  <h3 className="mt-0.5 font-tech text-xs font-bold text-white truncate">{selectedHotspot.title}</h3>
                  <p className="text-[9px] text-slate-400 truncate">{selectedHotspot.region}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => { setSelectedHotspot(null); setZoom(1); }}
                className="rounded p-1 text-slate-400 hover:text-white"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <dl className="mt-3 space-y-1.5 border-t border-white/[0.08] pt-2.5 font-mono text-[10px]">
              <div className="flex justify-between gap-2">
                <span className="text-slate-500">Signal Confidence:</span>
                <span className="font-bold text-emerald-400">{selectedHotspot.signal}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-slate-500">Coordinates:</span>
                <span className="text-slate-300 font-semibold">{selectedHotspot.latitude.toFixed(2)}°, {selectedHotspot.longitude.toFixed(2)}°</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-slate-500">Commander:</span>
                <span className="text-cyan-300 font-semibold">{selectedHotspot.commander}</span>
              </div>
              <div className="mt-1">
                <span className="text-slate-500">Flagged Intel:</span>
                <p className="mt-0.5 text-red-300 font-semibold">{selectedHotspot.threat}</p>
              </div>
            </dl>

            <button
              type="button"
              onClick={() => {
                onSelectTarget?.(selectedHotspot);
                setSelectedHotspot(null);
                setZoom(1);
                playClick();
              }}
              className="mt-3.5 flex min-h-9 w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 font-tech text-xs font-bold uppercase tracking-wider text-slate-950 transition-all hover:bg-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.4)]"
            >
              <Crosshair className="h-3.5 w-3.5" />
              <span>Inspect Target Dossier</span>
            </button>
          </div>
        )}
      </div>

      {/* Footer Downlink Telemetry */}
      <footer className="grid shrink-0 grid-cols-3 divide-x divide-white/[0.06] border-t border-white/[0.08] bg-[#070b12] px-1 py-2 font-mono">
        <div className="flex items-center justify-center gap-2">
          <Signal className="h-3.5 w-3.5 text-cyan-400" />
          <div>
            <p className="text-[8px] uppercase tracking-wider text-slate-500">SIGNALS TRACKED</p>
            <p className="font-bold text-[10px] text-slate-200">{visibleHotspots.length} / {hotspots.length}</p>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2">
          <Radio className="h-3.5 w-3.5 text-emerald-400" />
          <div>
            <p className="text-[8px] uppercase tracking-wider text-slate-500">DOWNLINK BANDWIDTH</p>
            <p className="font-bold text-[10px] text-emerald-300">1.44 Gbps</p>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2">
          <Activity className="h-3.5 w-3.5 text-slate-400" />
          <div>
            <p className="text-[8px] uppercase tracking-wider text-slate-500">BURST FREQUENCY</p>
            <p className="font-bold text-[10px] text-slate-300">12.4 GHz</p>
          </div>
        </div>
      </footer>
    </section>
  );
}
