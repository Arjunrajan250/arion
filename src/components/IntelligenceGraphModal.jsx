import React, { useState } from 'react';
import { X, Share2, Target } from 'lucide-react';
import { playClick, playBeep } from '../utils/soundEngine';

export default function IntelligenceGraphModal({ isOpen, onClose, onSelectTarget }) {
  const [selectedNode, setSelectedNode] = useState(null);

  if (!isOpen) return null;

  const nodes = [
    { id: 'n1', label: 'Marcus Thompson', category: 'SUSPECT', threat: 'CRITICAL', color: '#ff3b5c', x: 220, y: 150, risk: 96 },
    { id: 'n2', label: 'Robert Mitchell', category: 'SUSPECT', threat: 'HIGH', color: '#ff7c3b', x: 480, y: 120, risk: 91 },
    { id: 'n3', label: 'Dr. Aris Thorne', category: 'SUSPECT', threat: 'ALPHA', color: '#c084fc', x: 350, y: 320, risk: 99 },
    { id: 'n4', label: 'Substation 4 Breach', category: 'EVENT', threat: 'HIGH', color: '#00f0ff', x: 120, y: 280, risk: 85 },
    { id: 'n5', label: 'Freq 440.25 Spike', category: 'INTERCEPT', threat: 'MEDIUM', color: '#facc15', x: 580, y: 280, risk: 78 },
    { id: 'n6', label: 'Dockyard Pier 12', category: 'LOCATION', threat: 'INFO', color: '#38bdf8', x: 250, y: 440, risk: 65 },
    { id: 'n7', label: 'Black SUV GTH-8891', category: 'VEHICLE', threat: 'MEDIUM', color: '#4ade80', x: 460, y: 440, risk: 72 },
  ];

  const links = [
    { source: 'n1', target: 'n4', label: 'Perimeter Breach' },
    { source: 'n1', target: 'n3', label: 'Encrypted Contact' },
    { source: 'n2', target: 'n5', label: 'Radio Signal Host' },
    { source: 'n3', target: 'n6', label: 'Drop Zone' },
    { source: 'n2', target: 'n7', label: 'Vehicle Owner' },
    { source: 'n3', target: 'n7', label: 'Location Tracking' },
    { source: 'n4', target: 'n6', label: 'Geographic Proximity' },
  ];

  const handleNodeClick = (node) => {
    playClick();
    setSelectedNode(node);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md font-sans select-none" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="tactical-corner relative w-full max-w-4xl h-[min(720px,calc(100dvh-1rem))] sm:h-[min(680px,calc(100dvh-2rem))] rounded-2xl bg-[#070b14] border border-cyan-500/40 shadow-[0_0_50px_rgba(0,242,254,0.25)] flex flex-col overflow-hidden" role="dialog" aria-modal="true" aria-labelledby="graph-title">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#0a0f1d] border-b border-white/[0.08] flex items-center justify-between font-mono shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-500/50 text-cyan-400 shadow-[0_0_15px_rgba(0,242,254,0.3)]">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 id="graph-title" className="font-tech text-sm sm:text-base font-extrabold uppercase tracking-wider text-white">
                INTELLIGENCE NETWORK RELATIONSHIP GRAPH
              </h2>
              <p className="text-xs text-slate-400">Cross-Referenced Suspect Links, Frequency Spikes &amp; Event Nodes</p>
            </div>
          </div>

          <button
            onClick={() => {
              playBeep();
              onClose();
            }}
            aria-label="Close intelligence graph"
            className="p-1.5 rounded-lg border border-white/10 bg-white/5 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Network Graph Canvas Container */}
        <div className="flex-1 relative bg-[#06080c] overflow-hidden flex">
          
          {/* SVG Visualizer Canvas */}
          <svg className="w-full h-full absolute inset-0" viewBox="0 0 700 520" preserveAspectRatio="xMidYMid meet" role="group" aria-label="Interactive intelligence relationship graph">
            {/* Draw Links */}
            {links.map((link, idx) => {
              const srcNode = nodes.find(n => n.id === link.source);
              const tgtNode = nodes.find(n => n.id === link.target);
              if (!srcNode || !tgtNode) return null;

              const isHighlighted = selectedNode && (selectedNode.id === srcNode.id || selectedNode.id === tgtNode.id);

              return (
                <g key={idx}>
                  <line
                    x1={srcNode.x}
                    y1={srcNode.y}
                    x2={tgtNode.x}
                    y2={tgtNode.y}
                    stroke={isHighlighted ? '#00f0ff' : '#1e293b'}
                    strokeWidth={isHighlighted ? 3 : 1.5}
                    strokeDasharray={isHighlighted ? '6 3' : 'none'}
                    className={isHighlighted ? 'animate-pulse' : ''}
                  />
                  <text
                    x={(srcNode.x + tgtNode.x) / 2}
                    y={(srcNode.y + tgtNode.y) / 2 - 5}
                    fill={isHighlighted ? '#00f0ff' : '#64748b'}
                    fontSize="9"
                    fontFamily="monospace"
                    textAnchor="middle"
                  >
                    {link.label}
                  </text>
                </g>
              );
            })}

            {/* Draw Nodes */}
            {nodes.map((node) => {
              const isSelected = selectedNode?.id === node.id;
              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  onClick={() => handleNodeClick(node)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      handleNodeClick(node);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`Inspect ${node.label}, ${node.category}, risk ${node.risk}%`}
                  aria-pressed={isSelected}
                  className="cursor-pointer group focus:outline-none focus-visible:stroke-cyan-300"
                >
                  {/* Outer Pulsing Aura Ring */}
                  <circle
                    r={isSelected ? 28 : 22}
                    fill={node.color}
                    opacity={isSelected ? 0.35 : 0.15}
                    className="group-hover:opacity-40 transition-all animate-ping"
                  />
                  {/* Main Circle */}
                  <circle
                    r={isSelected ? 20 : 16}
                    fill="#0b0e14"
                    stroke={node.color}
                    strokeWidth={isSelected ? 3.5 : 2}
                    className="group-hover:stroke-white transition-all shadow-xl"
                  />
                  {/* Node Icon Indicator */}
                  <circle r="4" fill={node.color} />

                  {/* Node Label Text */}
                  <text
                    y={32}
                    fill="#f8fafc"
                    fontSize="11"
                    fontWeight="bold"
                    fontFamily="sans-serif"
                    textAnchor="middle"
                    className="group-hover:fill-cyan-400 transition-colors"
                  >
                    {node.label}
                  </text>
                  <text
                    y={44}
                    fill="#94a3b8"
                    fontSize="9"
                    fontFamily="monospace"
                    textAnchor="middle"
                  >
                    {node.category} • Risk {node.risk}%
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Node Inspector Side Sidebar */}
          {selectedNode ? (
            <div className="absolute inset-x-3 bottom-3 max-h-[58%] overflow-y-auto sm:inset-x-auto sm:right-4 sm:top-4 sm:bottom-4 sm:w-72 p-4 rounded-xl bg-[#0d1017]/95 border border-cyan-500/50 shadow-2xl backdrop-blur-md flex flex-col justify-between gap-4 font-mono text-xs z-10 custom-scrollbar">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-[10px] text-cyan-400 font-bold">NODE DOSSIER</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-950 text-red-400 border border-red-700">
                    {selectedNode.threat}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-white">{selectedNode.label}</h3>
                  <p className="text-slate-400 text-[11px] mt-0.5">{selectedNode.category} Entity</p>
                </div>

                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-slate-300">
                    <span>Target Risk Score:</span>
                    <span className="font-bold text-cyan-400">{selectedNode.risk}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                    <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${selectedNode.risk}%` }} />
                  </div>
                </div>

                <div className="pt-2 text-[11px] text-slate-300">
                  <span className="font-bold text-slate-100">Interlinked Connections:</span>
                  <ul className="mt-1 space-y-1 text-slate-400">
                    {links.filter(l => l.source === selectedNode.id || l.target === selectedNode.id).map((l, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                        <span>{l.label}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {selectedNode.category === 'SUSPECT' && (
                <button
                  onClick={() => {
                    playClick();
                    if (onSelectTarget) onSelectTarget({ name: selectedNode.label });
                    onClose();
                  }}
                  className="w-full py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <Target className="w-4 h-4" />
                  <span>Inspect Full Dossier</span>
                </button>
              )}
            </div>
          ) : (
            <div className="absolute right-4 top-4 p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-400 font-mono text-xs pointer-events-none">
              Select any node to inspect relationship telemetry.
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
