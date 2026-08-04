import React, { useEffect, useRef, useState } from 'react';
import { 
  Play, Pause, RotateCcw, Globe, Map, ShieldAlert, Crosshair, 
  Eye, Radio, AlertTriangle, UserCheck, Maximize2, Zap, Info, Volume2
} from 'lucide-react';
import { playClick, playBeep, playAlarm } from '../utils/soundEngine';

export default function TacticalMap({ onSelectTarget }) {
  const canvasRef = useRef(null);
  const chartDivRef = useRef(null);

  const [showGlobe, setShowGlobe] = useState(true);
  const [selectedTarget, setSelectedTarget] = useState(null);
  const [activeSignalFilter, setActiveSignalFilter] = useState('ALL');
  
  // Interactive Globe Controls State
  const [isRotating, setIsRotating] = useState(true);
  const [rotationSpeed, setRotationSpeed] = useState(1.0); // 0.5x, 1x, 2x
  const [is3DMode, setIs3DMode] = useState(true);
  const [selectedHotspot, setSelectedHotspot] = useState(null);

  const chartInstanceRef = useRef(null);
  const rotationAnimRef = useRef(null);

  // Tactical Pins Dataset
  const tacticalHotspots = [
    { id: 'pin-1', title: 'Gotham Central Hub', latitude: 40.7128, longitude: -74.0060, status: 'CRITICAL', threat: 'Marcus Thompson Detected', commander: 'Alpha-1' },
    { id: 'pin-2', title: 'London Intercept Outpost', latitude: 51.5074, longitude: -0.1278, status: 'ELEVATED', threat: 'Signal Anomaly Detected', commander: 'Bravo-4' },
    { id: 'pin-3', title: 'Tokyo Surveillance Station', latitude: 35.6762, longitude: 139.6503, status: 'SECURE', threat: 'Data Relay Synchronized', commander: 'Kilo-9' },
    { id: 'pin-4', title: 'Berlin Relay Grid', latitude: 52.5200, longitude: 13.4050, status: 'ACTIVE', threat: 'David Richardson Tracked', commander: 'Echo-2' },
  ];

  // amCharts 5 Setup (3D Globe / 2D Flat Map with PointSeries Hotspots)
  useEffect(() => {
    if (!showGlobe || !chartDivRef.current) return;

    let root;

    const initAmCharts = () => {
      if (!window.am5 || !window.am5map || !window.am5geodata_worldLow) {
        setTimeout(initAmCharts, 200);
        return;
      }

      const am5 = window.am5;
      const am5map = window.am5map;
      const am5geodata_worldLow = window.am5geodata_worldLow;
      const am5themes_Animated = window.am5themes_Animated;

      root = am5.Root.new(chartDivRef.current);

      if (root._logo) {
        root._logo.dispose();
      }

      root.setThemes([am5themes_Animated.new(root)]);

      // Projection: 3D Orthographic vs 2D GeoMercator
      const projectionType = is3DMode ? am5map.geoOrthographic() : am5map.geoMercator();

      const chart = root.container.children.push(
        am5map.MapChart.new(root, {
          panX: is3DMode ? 'rotateX' : 'translateX',
          panY: is3DMode ? 'rotateY' : 'translateY',
          projection: projectionType,
          paddingBottom: is3DMode ? 60 : 20,
          paddingTop: is3DMode ? 60 : 20,
          paddingLeft: is3DMode ? 60 : 20,
          paddingRight: is3DMode ? 60 : 20
        })
      );

      chartInstanceRef.current = chart;

      // Ocean Background Fill
      const backgroundSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {}));
      backgroundSeries.mapPolygons.template.setAll({
        fill: am5.color(0xffffff),
        fillOpacity: 0.05,
        stroke: am5.color(0xe2e8f0),
        strokeOpacity: 0.6,
        strokeWidth: 1.5
      });
      backgroundSeries.data.push({
        geometry: am5map.getGeoRectangle(90, 180, -90, -180)
      });

      // Main Country Polygons
      const polygonSeries = chart.series.push(
        am5map.MapPolygonSeries.new(root, {
          geoJSON: am5geodata_worldLow
        })
      );

      polygonSeries.mapPolygons.template.setAll({
        fill: am5.color(0xffffff),
        fillOpacity: 0.45,
        stroke: am5.color(0x0f172a),
        strokeWidth: 0.8,
        tooltipText: '{name}',
        toggleKey: 'active',
        interactive: true
      });

      polygonSeries.mapPolygons.template.states.create('hover', {
        fill: am5.color(0xf1f5f9),
        fillOpacity: 1.0,
        stroke: am5.color(0x94a3b8)
      });

      // Graticule Grid Lines
      const graticuleSeries = chart.series.push(am5map.GraticuleSeries.new(root, {}));
      graticuleSeries.mapLines.template.setAll({
        stroke: am5.color(0xd1d5db),
        strokeOpacity: 0.3,
        strokeWidth: 0.8
      });

      // Tactical PointSeries Target Pins
      const pointSeries = chart.series.push(am5map.MapPointSeries.new(root, {}));
      
      pointSeries.bullets.push(() => {
        const circle = am5.Circle.new(root, {
          radius: 6,
          tooltipText: '{title} [{status}]',
          fill: am5.color(0x00f2fe),
          stroke: am5.color(0xffffff),
          strokeWidth: 2,
          cursorOverStyle: 'pointer'
        });

        circle.events.on('click', (ev) => {
          const dataItem = ev.target.dataItem.dataContext;
          setSelectedHotspot(dataItem);
          playAlarm();
        });

        return am5.Bullet.new(root, {
          sprite: circle
        });
      });

      // Add Pins to PointSeries
      tacticalHotspots.forEach((pin) => {
        pointSeries.pushDataItem({
          geometry: { type: 'Point', coordinates: [pin.longitude, pin.latitude] },
          title: pin.title,
          status: pin.status,
          threat: pin.threat,
          commander: pin.commander
        });
      });

      // Rotation animation setup
      if (is3DMode && isRotating) {
        const duration = 30000 / rotationSpeed;
        rotationAnimRef.current = chart.animate({
          key: 'rotationX',
          from: chart.get('rotationX', 0),
          to: chart.get('rotationX', 0) + 360,
          duration: duration,
          loops: Infinity
        });
      }

      chart.appear(1000, 100);
    };

    initAmCharts();

    return () => {
      if (root) {
        root.dispose();
      }
    };
  }, [showGlobe, is3DMode, isRotating, rotationSpeed]);

  // Tactical Overlay Canvas (Radar, Nodes, Signals)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let scanAngle = 0;

    const resize = () => {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const targetNodes = [
      { id: 'T-109', name: 'Marcus Thompson', x: 0.32, y: 0.38, status: 'HOSTILE', ping: true },
      { id: 'T-204', name: 'David Richardson', x: 0.65, y: 0.28, status: 'SURVEILLANCE', ping: false },
      { id: 'T-308', name: 'Dr. Aris Thorne', x: 0.48, y: 0.62, status: 'INTERCEPT', ping: true },
      { id: 'T-412', name: 'Unknown Signal Alpha', x: 0.78, y: 0.70, status: 'ALERT', ping: false }
    ];

    const drawOverlay = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      scanAngle += 0.015;
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, Math.min(centerX, centerY) * 0.85, scanAngle, scanAngle + 0.35);
      ctx.closePath();
      const grad = ctx.createRadialGradient(0, 0, 10, 0, 0, Math.min(centerX, centerY) * 0.85);
      grad.addColorStop(0, 'rgba(0, 242, 254, 0.15)');
      grad.addColorStop(1, 'rgba(0, 242, 254, 0.0)');
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.restore();

      targetNodes.forEach(node => {
        const nx = node.x * canvas.width;
        const ny = node.y * canvas.height;

        ctx.strokeStyle = node.status === 'HOSTILE' ? 'rgba(239, 68, 68, 0.8)' : 'rgba(0, 242, 254, 0.8)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(nx, ny, 12, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = node.status === 'HOSTILE' ? '#ef4444' : '#00f2fe';
        ctx.beginPath();
        ctx.arc(nx, ny, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 10px monospace';
        ctx.fillText(`${node.id}: ${node.name}`, nx + 16, ny + 4);
      });

      animationId = requestAnimationFrame(drawOverlay);
    };

    drawOverlay();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="relative w-full h-full bg-[#07090d] border border-slate-800/80 rounded-xl overflow-hidden flex flex-col shadow-2xl">
      
      {/* Map Control Top Bar */}
      <div className="px-4 py-2 bg-[#0b0e14] border-b border-slate-800 flex items-center justify-between z-20 shrink-0 text-xs font-mono">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
            <Globe className="w-4 h-4 animate-spin-slow" />
            <span>GLOBAL RADAR MATRIX</span>
          </div>

          {/* Signal Filters */}
          <div className="hidden md:flex items-center gap-1 bg-slate-900/90 p-0.5 rounded border border-slate-800">
            {['ALL', 'HOSTILE', 'INTERCEPT', 'SECURE'].map(filter => (
              <button
                key={filter}
                onClick={() => {
                  setActiveSignalFilter(filter);
                  playClick();
                }}
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                  activeSignalFilter === filter
                    ? 'bg-cyan-500 text-black shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* View Toggle Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setShowGlobe(!showGlobe);
              playBeep();
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-slate-200 hover:border-cyan-500 font-bold transition-all"
          >
            {showGlobe ? <Map className="w-3.5 h-3.5 text-cyan-400" /> : <Globe className="w-3.5 h-3.5 text-cyan-400" />}
            <span>{showGlobe ? 'Flat Map' : '3D Globe'}</span>
          </button>
        </div>
      </div>

      {/* Main Rendering Viewport */}
      <div className="relative flex-1 w-full h-full min-h-0 bg-[#05070a] overflow-hidden">
        
        {/* amCharts 5 Canvas Container */}
        {showGlobe ? (
          <div ref={chartDivRef} className="w-full h-full relative z-10" />
        ) : (
          <div className="w-full h-full relative flex items-center justify-center">
            <img 
              src="/assets/city_wireframe.png" 
              alt="Grid View" 
              className="w-full h-full object-cover opacity-60 mix-blend-screen" 
            />
          </div>
        )}

        {/* Tactical Canvas Overlay */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-20" />

        {/* Interactive Globe Rotation & Projection Control Bar */}
        {showGlobe && (
          <div className="absolute bottom-4 left-4 z-30 flex items-center gap-2 p-1.5 rounded-xl bg-[#0a0d14]/90 border border-slate-700 shadow-2xl backdrop-blur-md text-xs font-mono">
            {/* Play/Pause Rotation */}
            <button
              onClick={() => {
                setIsRotating(!isRotating);
                playClick();
              }}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold transition-all flex items-center gap-1.5"
              title={isRotating ? 'Pause Rotation' : 'Rotate Globe'}
            >
              {isRotating ? <Pause className="w-4 h-4 text-cyan-400" /> : <Play className="w-4 h-4 text-emerald-400" />}
              <span className="hidden sm:inline">{isRotating ? 'Pause' : 'Rotate'}</span>
            </button>

            <div className="w-[1px] h-5 bg-slate-800" />

            {/* Speed Multiplier */}
            <div className="flex items-center gap-1">
              {[0.5, 1.0, 2.0].map((speed) => (
                <button
                  key={speed}
                  onClick={() => {
                    setRotationSpeed(speed);
                    playBeep();
                  }}
                  className={`px-2 py-0.5 rounded font-bold text-[10px] transition-all ${
                    rotationSpeed === speed
                      ? 'bg-cyan-500 text-black'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>

            <div className="w-[1px] h-5 bg-slate-800" />

            {/* 3D vs 2D Projection Mode */}
            <button
              onClick={() => {
                setIs3DMode(!is3DMode);
                playClick();
              }}
              className={`px-2 py-1 rounded-lg font-bold text-xs flex items-center gap-1 transition-all ${
                is3DMode ? 'bg-cyan-950 border border-cyan-500/60 text-cyan-300' : 'bg-slate-900 text-slate-300'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{is3DMode ? '3D Projection' : '2D Mercator'}</span>
            </button>
          </div>
        )}

        {/* Hotspot Target Pin Briefing Popup Modal */}
        {selectedHotspot && (
          <div className="absolute top-4 right-4 z-40 w-72 p-3.5 rounded-xl bg-[#0b0e17]/95 border border-cyan-500/60 shadow-2xl backdrop-blur-md font-mono text-xs text-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-cyan-400" />
                <span className="font-bold text-white text-sm">{selectedHotspot.title}</span>
              </div>
              <button
                onClick={() => setSelectedHotspot(null)}
                className="text-slate-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-400">Status:</span>
                <span className="font-bold text-amber-400">{selectedHotspot.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Threat Intel:</span>
                <span className="font-bold text-slate-100">{selectedHotspot.threat}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Sector Cmd:</span>
                <span className="font-mono text-cyan-400">{selectedHotspot.commander}</span>
              </div>
            </div>
            <button
              onClick={() => {
                if (onSelectTarget) onSelectTarget(selectedHotspot);
                setSelectedHotspot(null);
                playClick();
              }}
              className="mt-3 w-full py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs transition-all shadow-md"
            >
              Dispatch Sector Units
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
