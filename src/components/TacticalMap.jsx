import React, { useEffect, useRef, useState } from 'react';
import * as am5 from '@amcharts/amcharts5';
import * as am5map from '@amcharts/amcharts5/map';
import am5themesAnimated from '@amcharts/amcharts5/themes/Animated';
import worldLow from '@amcharts/amcharts5-geodata/worldLow';
import { Globe, Map, Pause, Play, ShieldAlert } from 'lucide-react';
import { playAlarm, playBeep, playClick } from '../utils/soundEngine';

const TACTICAL_HOTSPOTS = [
  { id: 'pin-1', title: 'Gotham Central Hub', latitude: 40.7128, longitude: -74.006, status: 'CRITICAL', threat: 'Marcus Thompson detected', commander: 'Alpha-1' },
  { id: 'pin-2', title: 'London Intercept Outpost', latitude: 51.5074, longitude: -0.1278, status: 'ELEVATED', threat: 'Signal anomaly detected', commander: 'Bravo-4' },
  { id: 'pin-3', title: 'Tokyo Surveillance Station', latitude: 35.6762, longitude: 139.6503, status: 'SECURE', threat: 'Data relay synchronized', commander: 'Kilo-9' },
  { id: 'pin-4', title: 'Berlin Relay Grid', latitude: 52.52, longitude: 13.405, status: 'ACTIVE', threat: 'David Richardson tracked', commander: 'Echo-2' },
];

const TARGET_NODES = [
  { id: 'T-109', name: 'Marcus Thompson', x: 0.32, y: 0.38, status: 'HOSTILE', color: '#fb7185' },
  { id: 'T-204', name: 'David Richardson', x: 0.65, y: 0.28, status: 'SURVEILLANCE', color: '#22d3ee' },
  { id: 'T-308', name: 'Dr. Aris Thorne', x: 0.48, y: 0.62, status: 'INTERCEPT', color: '#fbbf24' },
  { id: 'T-412', name: 'Northern relay', x: 0.78, y: 0.7, status: 'SECURE', color: '#34d399' },
];

export default function TacticalMap({ onSelectTarget }) {
  const canvasRef = useRef(null);
  const chartDivRef = useRef(null);
  const [showGlobe, setShowGlobe] = useState(true);
  const [activeSignalFilter, setActiveSignalFilter] = useState('ALL');
  const [isRotating, setIsRotating] = useState(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [rotationSpeed, setRotationSpeed] = useState(1);
  const [is3DMode, setIs3DMode] = useState(true);
  const [selectedHotspot, setSelectedHotspot] = useState(null);

  useEffect(() => {
    if (!showGlobe || !chartDivRef.current) return undefined;

    const root = am5.Root.new(chartDivRef.current);
    root.setThemes([am5themesAnimated.new(root)]);
    const chart = root.container.children.push(am5map.MapChart.new(root, {
      panX: is3DMode ? 'rotateX' : 'translateX',
      panY: is3DMode ? 'rotateY' : 'translateY',
      projection: is3DMode ? am5map.geoOrthographic() : am5map.geoMercator(),
      paddingBottom: is3DMode ? 50 : 20,
      paddingTop: is3DMode ? 50 : 20,
      paddingLeft: is3DMode ? 50 : 20,
      paddingRight: is3DMode ? 50 : 20,
      wheelY: 'zoom',
    }));

    const backgroundSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {}));
    backgroundSeries.mapPolygons.template.setAll({
      fill: am5.color(0x08121d),
      fillOpacity: 0.92,
      stroke: am5.color(0x164e63),
      strokeOpacity: 0.5,
      strokeWidth: 1,
    });
    backgroundSeries.data.push({ geometry: am5map.getGeoRectangle(90, 180, -90, -180) });

    const polygonSeries = chart.series.push(am5map.MapPolygonSeries.new(root, { geoJSON: worldLow }));
    polygonSeries.mapPolygons.template.setAll({
      fill: am5.color(0x172532),
      fillOpacity: 0.95,
      stroke: am5.color(0x245064),
      strokeWidth: 0.65,
      tooltipText: '{name}',
      interactive: true,
    });
    polygonSeries.mapPolygons.template.states.create('hover', {
      fill: am5.color(0x164e63),
      fillOpacity: 1,
      stroke: am5.color(0x22d3ee),
    });

    const graticuleSeries = chart.series.push(am5map.GraticuleSeries.new(root, {}));
    graticuleSeries.mapLines.template.setAll({
      stroke: am5.color(0x3290a8),
      strokeOpacity: 0.13,
      strokeWidth: 0.7,
    });

    const pointSeries = chart.series.push(am5map.MapPointSeries.new(root, {}));
    pointSeries.bullets.push(() => {
      const circle = am5.Circle.new(root, {
        radius: 6,
        tooltipText: '{title} · {status}',
        fill: am5.color(0x22d3ee),
        stroke: am5.color(0xecfeff),
        strokeWidth: 1.5,
        cursorOverStyle: 'pointer',
      });
      circle.events.on('click', (event) => {
        setSelectedHotspot(event.target.dataItem.dataContext);
        playAlarm();
      });
      return am5.Bullet.new(root, { sprite: circle });
    });

    TACTICAL_HOTSPOTS.filter((pin) => activeSignalFilter === 'ALL'
      || (activeSignalFilter === 'HOSTILE' && pin.status === 'CRITICAL')
      || (activeSignalFilter === 'INTERCEPT' && ['ELEVATED', 'ACTIVE'].includes(pin.status))
      || pin.status === activeSignalFilter).forEach((pin) => {
      pointSeries.pushDataItem({
        geometry: { type: 'Point', coordinates: [pin.longitude, pin.latitude] },
        ...pin,
      });
    });

    if (is3DMode && isRotating) {
      chart.animate({
        key: 'rotationX',
        from: chart.get('rotationX', 0),
        to: chart.get('rotationX', 0) + 360,
        duration: 30000 / rotationSpeed,
        loops: Infinity,
      });
    }
    chart.appear(500, 100);

    return () => root.dispose();
  }, [showGlobe, is3DMode, isRotating, rotationSpeed, activeSignalFilter]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const context = canvas.getContext('2d');
    let animationId;
    let scanAngle = 0;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let width = 0;
    let height = 0;

    const resize = () => {
      const bounds = canvas.parentElement.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = bounds.width;
      height = bounds.height;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas.parentElement);

    const drawOverlay = () => {
      context.clearRect(0, 0, width, height);
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(centerX, centerY) * 0.83;
      scanAngle += 0.012;

      context.save();
      context.translate(centerX, centerY);
      context.beginPath();
      context.moveTo(0, 0);
      context.arc(0, 0, radius, scanAngle, scanAngle + 0.28);
      context.closePath();
      const gradient = context.createRadialGradient(0, 0, 5, 0, 0, radius);
      gradient.addColorStop(0, 'rgba(34, 211, 238, 0.12)');
      gradient.addColorStop(1, 'rgba(34, 211, 238, 0)');
      context.fillStyle = gradient;
      context.fill();
      context.restore();

      TARGET_NODES.filter((node) => activeSignalFilter === 'ALL' || node.status === activeSignalFilter
        || (activeSignalFilter === 'HOSTILE' && node.status === 'HOSTILE')
        || (activeSignalFilter === 'INTERCEPT' && node.status === 'INTERCEPT')).forEach((node) => {
        const x = node.x * width;
        const y = node.y * height;
        context.strokeStyle = node.color;
        context.globalAlpha = 0.75;
        context.lineWidth = 1;
        context.beginPath();
        context.arc(x, y, 10, 0, Math.PI * 2);
        context.stroke();
        context.globalAlpha = 1;
        context.fillStyle = node.color;
        context.beginPath();
        context.arc(x, y, 2.5, 0, Math.PI * 2);
        context.fill();
        if (width > 440) {
          context.fillStyle = 'rgba(226, 232, 240, 0.85)';
          context.font = '500 10px "JetBrains Mono", monospace';
          context.fillText(`${node.id} · ${node.name}`, x + 15, y + 3);
        }
      });
      if (!reduceMotion) animationId = requestAnimationFrame(drawOverlay);
    };
    drawOverlay();

    return () => {
      cancelAnimationFrame(animationId);
      observer.disconnect();
    };
  }, [activeSignalFilter, showGlobe]);

  return (
    <section className="relative flex h-[430px] w-full min-w-0 shrink-0 flex-col overflow-hidden rounded-xl border border-white/[0.08] bg-[#070b11] shadow-xl sm:h-[480px] lg:h-full lg:min-h-[350px] lg:shrink" aria-label="Global radar matrix">
      <div className="z-20 flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-white/[0.07] bg-[#0b1018] px-3 py-2.5 sm:px-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
          <Globe className="h-4 w-4 text-cyan-400" aria-hidden="true" />
          <span>Global radar</span>
          <span className="rounded bg-emerald-400/10 px-1.5 py-0.5 text-[9px] font-medium text-emerald-300">Live</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="order-last flex w-full items-center justify-between gap-0.5 rounded-lg border border-white/[0.07] bg-black/10 p-0.5 sm:order-none sm:w-auto sm:justify-start" aria-label="Filter signals">
            {['ALL', 'HOSTILE', 'INTERCEPT', 'SECURE'].map((filter) => (
              <button
                type="button"
                key={filter}
                onClick={() => { setActiveSignalFilter(filter); playClick(); }}
                aria-pressed={activeSignalFilter === filter}
                className={`rounded-md px-2 py-1 text-[9px] font-semibold transition-colors ${activeSignalFilter === filter ? 'bg-cyan-400/15 text-cyan-200' : 'text-slate-600 hover:text-slate-300'}`}
              >
                {filter}
              </button>
            ))}
          </div>
          <button type="button" onClick={() => { setShowGlobe(!showGlobe); playBeep(); }} className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] px-2.5 py-1.5 text-[10px] font-medium text-slate-300 hover:border-cyan-400/30">
            {showGlobe ? <Map className="h-3.5 w-3.5 text-cyan-400" /> : <Globe className="h-3.5 w-3.5 text-cyan-400" />}
            {showGlobe ? 'City grid' : 'World map'}
          </button>
        </div>
      </div>

      <div className="relative min-h-0 flex-1 overflow-hidden bg-[#05090e]">
        {showGlobe ? (
          <div ref={chartDivRef} className="relative z-10 h-full w-full" role="img" aria-label="Interactive world map with tactical signal hotspots" />
        ) : (
          <div className="relative flex h-full w-full items-center justify-center">
            <img src="/assets/city_wireframe.png" alt="City surveillance grid" className="h-full w-full object-cover opacity-60 mix-blend-screen" />
          </div>
        )}
        <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 z-20 h-full w-full" aria-hidden="true" />

        {showGlobe && (
          <div className="absolute bottom-3 left-3 z-30 flex max-w-[calc(100%-1.5rem)] items-center gap-1.5 overflow-x-auto rounded-lg border border-white/10 bg-[#0a0f17]/90 p-1.5 shadow-lg backdrop-blur-md no-scrollbar">
            <button type="button" onClick={() => { setIsRotating(!isRotating); playClick(); }} className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[10px] font-medium text-slate-300 hover:bg-white/[0.05]" aria-label={isRotating ? 'Pause globe rotation' : 'Resume globe rotation'}>
              {isRotating ? <Pause className="h-3.5 w-3.5 text-cyan-400" /> : <Play className="h-3.5 w-3.5 text-emerald-400" />}
              <span className="hidden sm:inline">{isRotating ? 'Pause' : 'Rotate'}</span>
            </button>
            <span className="h-4 w-px bg-white/10" />
            {[0.5, 1, 2].map((speed) => (
              <button type="button" key={speed} onClick={() => { setRotationSpeed(speed); playBeep(); }} aria-pressed={rotationSpeed === speed} className={`rounded px-2 py-1 text-[9px] font-medium ${rotationSpeed === speed ? 'bg-cyan-400/15 text-cyan-200' : 'text-slate-600 hover:text-slate-300'}`}>{speed}×</button>
            ))}
            <span className="h-4 w-px bg-white/10" />
            <button type="button" onClick={() => { setIs3DMode(!is3DMode); playClick(); }} className="shrink-0 rounded-md px-2 py-1 text-[10px] font-medium text-slate-300 hover:bg-white/[0.05]">{is3DMode ? '3D' : '2D'} view</button>
          </div>
        )}

        {selectedHotspot && (
          <div className="absolute right-3 top-3 z-40 w-[min(280px,calc(100%-1.5rem))] rounded-xl border border-cyan-400/25 bg-[#0b111b]/95 p-4 shadow-2xl backdrop-blur-md" role="dialog" aria-label="Hotspot details">
            <div className="mb-3 flex items-start justify-between gap-3 border-b border-white/[0.07] pb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 shrink-0 text-cyan-400" />
                <h3 className="text-xs font-semibold text-white">{selectedHotspot.title}</h3>
              </div>
              <button type="button" onClick={() => setSelectedHotspot(null)} className="text-slate-500 hover:text-white" aria-label="Close hotspot details">×</button>
            </div>
            <dl className="space-y-2 text-[11px]">
              <div className="flex justify-between gap-3"><dt className="text-slate-500">Status</dt><dd className="font-medium text-amber-300">{selectedHotspot.status}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-slate-500">Intelligence</dt><dd className="text-right text-slate-200">{selectedHotspot.threat}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-slate-500">Commander</dt><dd className="font-mono text-cyan-300">{selectedHotspot.commander}</dd></div>
            </dl>
            <button type="button" onClick={() => { onSelectTarget?.(selectedHotspot); setSelectedHotspot(null); playClick(); }} className="mt-4 w-full rounded-lg bg-cyan-400 py-2 text-xs font-semibold text-slate-950 hover:bg-cyan-300">Open target dossier</button>
          </div>
        )}
      </div>
    </section>
  );
}
