import React from 'react';
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  Command,
  Eye,
  FileText,
  LayoutDashboard,
  Radio,
  Send,
  Share2,
  ShieldAlert,
  Target,
  UserX,
} from 'lucide-react';
import { playBeep, playClick } from '../utils/soundEngine';

const navigation = [
  {
    label: 'INTELLIGENCE MATRIX',
    code: 'SEC-01',
    items: [
      { id: 'dashboard', label: 'Operations Overview', subtitle: 'Real-time telemetry & matrix KPIs', short: 'Overview', icon: LayoutDashboard },
      { id: 'surveillance', label: 'Surveillance Matrix', subtitle: 'Citywide optical CCTV node network', short: 'Surveillance', icon: Eye, badge: 'LIVE' },
      { id: 'livefeed', label: 'Live Camera Feeds', subtitle: 'Automated ANPR & facial matcher', short: 'Live feeds', icon: Radio },
      { id: 'cybercommand', label: 'Cyber Command (I4C)', subtitle: 'Mule accounts & financial forensics', short: 'Cyber net', icon: ShieldAlert, badge: 'I4C' },
    ],
  },
  {
    label: 'OPERATIONS & DEFENSE',
    code: 'SEC-02',
    items: [
      { id: 'alerts', label: 'Incident Queue', subtitle: '8 active dispatches · 2 critical sirens', short: 'Alerts', icon: Bell, badge: '8', alert: true },
      { id: 'campaigns', label: 'Active Campaigns', subtitle: 'Operation Aegis & Joint Strike Tasks', short: 'Campaigns', icon: Target },
      { id: 'reporting', label: 'Intelligence Reports', subtitle: 'Classified CIA Most Wanted dossiers', short: 'Dossiers', icon: FileText },
    ],
  },
];

const priorityTargets = [
  {
    id: 'target-alnami',
    name: 'Alnami (P-2204-02)',
    category: 'Critical Anomaly',
    codename: 'SPECTRE-02',
    threat: '98.4%',
    mugshot: '/assets/suspect_face_scan.jpg',
    status: 'ACTIVE DESYNC',
  },
  {
    id: 'target-elena',
    name: 'Elena Rostova',
    category: 'Confirmed Subject',
    codename: 'VIPER-9A',
    threat: '96.8%',
    mugshot: '/assets/suspect_face_scan.jpg',
    status: 'INFILTRATOR',
  },
  {
    id: 'target-makarov',
    name: 'Makarov, V. A.',
    category: 'Syndicate Boss',
    codename: 'KINGFISH',
    threat: '99.2%',
    mugshot: '/assets/target_kingfish_portrait.jpg',
    status: 'RED NOTICE',
  },
];

function NavigationItem({ item, activeTab, collapsed, onSelect }) {
  const Icon = item.icon;
  const isActive = activeTab === item.id;

  return (
    <button
      type="button"
      onClick={() => onSelect(item.id)}
      aria-current={isActive ? 'page' : undefined}
      title={collapsed ? `${item.label} — ${item.subtitle}` : undefined}
      className={`group relative flex w-full items-center text-left transition-all duration-150 ${
        collapsed
          ? 'justify-center p-2.5 rounded-xl'
          : 'gap-3 px-3 py-2.5 rounded-xl'
      } ${
        isActive
          ? 'bg-[#0d1627] border border-white/[0.12] border-l-[3px] border-l-[var(--theme-accent)] shadow-[0_4px_16px_rgba(0,0,0,0.6)]'
          : 'border border-transparent border-l-[3px] border-l-transparent text-slate-400 hover:bg-white/[0.03] hover:text-slate-100 hover:border-white/[0.06]'
      }`}
    >
      {/* Dedicated Tactical Icon Tile */}
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all ${
          isActive
            ? 'bg-[var(--theme-accent)]/15 border border-[var(--theme-accent)]/40 text-[var(--theme-accent)] shadow-[0_0_12px_var(--theme-glow)]'
            : 'bg-white/[0.03] border border-white/[0.06] text-slate-500 group-hover:text-slate-300 group-hover:border-white/[0.12]'
        }`}
      >
        <Icon className="h-4 w-4" aria-hidden="true" />
      </div>

      {/* Item Title & Subtitle */}
      {!collapsed && (
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-1.5">
            <span
              className={`font-tech text-xs font-bold tracking-wide truncate ${
                isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'
              }`}
            >
              {item.label}
            </span>
            {item.badge && (
              <span
                className={`rounded px-1.5 py-0.2 font-mono text-[9px] font-bold tracking-wider shrink-0 ${
                  item.alert
                    ? 'bg-red-500/20 text-red-300 border border-red-500/40 animate-pulse'
                    : 'bg-[var(--theme-glow)] text-[var(--theme-accent)] border border-[var(--theme-accent)]/30'
                }`}
              >
                {item.badge}
              </span>
            )}
          </div>
          <div className="font-mono text-[9.5px] text-slate-500 truncate mt-0.5">
            {item.subtitle}
          </div>
        </div>
      )}

      {/* Active Indicator Chevron */}
      {isActive && !collapsed && (
        <div className="flex items-center gap-1 shrink-0 ml-1">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--theme-accent)] animate-ping" />
          <ChevronRight className="h-3.5 w-3.5 text-[var(--theme-accent)] opacity-80" />
        </div>
      )}

      {/* Collapsed Alert Indicator */}
      {item.badge && collapsed && (
        <span
          className={`absolute right-1.5 top-1.5 h-2 w-2 rounded-full ${
            item.alert ? 'bg-red-400 animate-pulse' : 'bg-[var(--theme-accent)]'
          }`}
        />
      )}
    </button>
  );
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  collapsed,
  setCollapsed,
  onOpenCommand,
  onOpenGraph,
  onOpenAudio,
  onOpenDispatch,
  onOpenPdf,
  onSelectTarget,
}) {
  const handleSelect = (tab) => {
    playBeep();
    setActiveTab(tab);
  };

  const handleTargetClick = (target) => {
    playClick();
    if (onSelectTarget) {
      onSelectTarget(target);
    }
  };

  const tacticalTools = [
    { label: 'Intel Graph', short: 'Graph', icon: Share2, action: onOpenGraph, hint: 'Network links' },
    { label: 'Audio Wire', short: 'Audio', icon: Radio, action: onOpenAudio, hint: 'Radio intercept' },
    { label: 'Deploy Unit', short: 'Dispatch', icon: Send, action: onOpenDispatch, hint: 'Rapid response' },
    { label: 'Print Dossier', short: 'Dossier', icon: FileText, action: onOpenPdf, hint: 'Classified PDF' },
  ];

  return (
    <>
      <aside
        className={`relative hidden shrink-0 flex-col border-r border-white/[0.08] bg-[#060912] transition-[width] duration-200 lg:flex ${
          collapsed ? 'w-[74px]' : 'w-[290px]'
        }`}
      >
        {/* Navigation & Intelligence Feed Container */}
        <div className={`flex-1 overflow-y-auto py-4 ${collapsed ? 'px-2.5' : 'px-3.5'} custom-scrollbar flex flex-col gap-5`}>
          
          {/* Main Navigation Groups */}
          {navigation.map((group) => (
            <div key={group.label} className="space-y-1.5">
              {!collapsed ? (
                <div className="mb-2 flex items-center justify-between px-2 font-mono text-[9px]">
                  <span className="font-tech font-bold uppercase tracking-[0.18em] text-slate-400 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--theme-accent)]/80" />
                    {group.label}
                  </span>
                  <span className="opacity-60 text-slate-500 font-mono">{group.code}</span>
                </div>
              ) : (
                <div className="mb-2 text-center font-mono text-[8px] text-slate-600 font-bold">
                  {group.code.split('-')[0]}
                </div>
              )}
              <div className="space-y-1.5">
                {group.items.map((item) => (
                  <NavigationItem
                    key={item.id}
                    item={item}
                    activeTab={activeTab}
                    collapsed={collapsed}
                    onSelect={handleSelect}
                  />
                ))}
              </div>
            </div>
          ))}

          {/* Tactical Directives / Quick Overlays */}
          {!collapsed && tacticalTools.some(t => t.action) && (
            <div className="space-y-2 pt-2 border-t border-white/[0.06]">
              <div className="flex items-center justify-between px-2 font-mono text-[9px]">
                <span className="font-tech font-bold uppercase tracking-[0.18em] text-slate-400 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400/80" />
                  TACTICAL DIRECTIVES
                </span>
                <span className="opacity-60 text-slate-500 font-mono">TOOLS-03</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {tacticalTools.map((tool) => {
                  const ToolIcon = tool.icon;
                  if (!tool.action) return null;
                  return (
                    <button
                      key={tool.label}
                      type="button"
                      onClick={() => {
                        playClick();
                        tool.action();
                      }}
                      className="group flex flex-col gap-1 rounded-xl border border-white/[0.08] bg-[#080d1a] p-2.5 text-left transition-all hover:border-[var(--theme-accent)]/50 hover:bg-[#0c162c] hover:shadow-md"
                    >
                      <div className="flex items-center justify-between">
                        <ToolIcon className="h-3.5 w-3.5 text-slate-400 group-hover:text-[var(--theme-accent)]" />
                        <span className="h-1.5 w-1.5 rounded-full bg-slate-700 group-hover:bg-[var(--theme-accent)]" />
                      </div>
                      <span className="font-tech font-bold text-[11px] text-slate-200 group-hover:text-white truncate mt-0.5">
                        {tool.label}
                      </span>
                      <span className="text-[9px] font-mono text-slate-500 group-hover:text-slate-400 truncate">
                        {tool.hint}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Priority Targets Watchlist (Uses the vertical space dynamically) */}
          {!collapsed && (
            <div className="space-y-2 pt-2 border-t border-white/[0.06]">
              <div className="flex items-center justify-between px-2 font-mono text-[9px]">
                <span className="font-tech font-bold uppercase tracking-[0.18em] text-slate-400 flex items-center gap-1.5">
                  <UserX className="h-3 w-3 text-red-400" />
                  PRIORITY WATCHLIST
                </span>
                <span className="text-red-400 font-bold font-mono text-[9px]">3 TARGETS</span>
              </div>

              <div className="space-y-1.5">
                {priorityTargets.map((target) => (
                  <button
                    key={target.id}
                    type="button"
                    onClick={() => handleTargetClick(target)}
                    className="group flex w-full items-center gap-2.5 rounded-xl border border-white/[0.06] bg-[#080d18] p-2 text-left transition-all hover:border-red-500/40 hover:bg-[#0e1424]"
                  >
                    <img
                      src={target.mugshot}
                      alt={target.name}
                      className="h-8 w-8 rounded-lg object-cover border border-slate-700 group-hover:border-red-400 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-tech text-[11px] font-bold text-white group-hover:text-cyan-300 truncate">
                          {target.name}
                        </span>
                        <span className="font-mono text-[9px] font-bold text-red-400 shrink-0">
                          {target.threat}
                        </span>
                      </div>
                      <div className="flex items-center justify-between font-mono text-[8.5px] text-slate-500 mt-0.5">
                        <span className="truncate">{target.codename}</span>
                        <span className="text-amber-400/80 font-bold">{target.status}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sector Containment Readiness Card */}
          {!collapsed && (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-3 font-mono text-[10px] space-y-1.5">
              <div className="flex items-center justify-between text-amber-400">
                <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider font-tech text-xs">
                  <ShieldAlert className="h-3.5 w-3.5 text-amber-400" />
                  <span>DEFCON 2 ACTIVE</span>
                </span>
                <span className="px-1.5 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[8.5px] font-bold">
                  HIGH ALERT
                </span>
              </div>
              <p className="text-[9.5px] text-slate-400 leading-relaxed">
                Sector 4 Vault under active containment. 8 open dispatches in queue.
              </p>
            </div>
          )}

        </div>

        {/* Bottom System Telemetry Widget */}
        <div className={`border-t border-white/[0.08] bg-[#05070c]/95 ${collapsed ? 'p-2' : 'p-3.5'}`}>
          {!collapsed ? (
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => {
                  playClick();
                  onOpenCommand();
                }}
                className="group flex w-full items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.025] px-3.5 py-2.5 text-xs font-mono text-slate-400 transition-all hover:border-[var(--theme-accent)] hover:bg-[var(--theme-glow)] hover:text-white"
              >
                <Command className="h-3.5 w-3.5 text-slate-400 group-hover:text-[var(--theme-accent)]" aria-hidden="true" />
                <span className="flex-1 text-left font-mono">Quick console</span>
                <kbd className="rounded border border-white/10 bg-black/40 px-1.5 py-0.5 text-[9px] text-slate-500">⌘K</kbd>
              </button>

              {/* Real-Time Hardware Telemetry Card */}
              <div className="rounded-xl border border-white/[0.06] bg-black/40 p-3 font-mono text-[10px]">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    CORE ENGINES
                  </span>
                  <span className="text-emerald-400 font-bold">ONLINE (12/12)</span>
                </div>

                <div className="mt-2.5 space-y-2">
                  <div>
                    <div className="flex justify-between text-[9px] text-slate-500">
                      <span>CPU LOAD</span>
                      <span className="text-slate-300 font-bold">38%</span>
                    </div>
                    <div className="mt-1 h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                      <div className="h-full w-[38%] rounded-full bg-cyan-400" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[9px] text-slate-500">
                      <span>UPLINK RATE</span>
                      <span className="text-slate-300 font-bold">1.2 GB/S</span>
                    </div>
                    <div className="mt-1 h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                      <div className="h-full w-[65%] rounded-full bg-emerald-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 py-1">
              <button
                type="button"
                onClick={() => {
                  playClick();
                  onOpenCommand();
                }}
                className="p-2 rounded-lg border border-white/[0.08] text-slate-400 hover:text-white hover:border-[var(--theme-accent)] transition-all"
                title="Quick console (⌘K)"
              >
                <Command className="h-4 w-4" />
              </button>
              <span className="relative flex h-2.5 w-2.5" title="All core systems nominal">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
              </span>
            </div>
          )}
        </div>

        {/* Expand / Collapse Button */}
        <button
          type="button"
          onClick={() => {
            playClick();
            setCollapsed(!collapsed);
          }}
          className="absolute -right-3 top-5 z-30 flex h-6 w-6 items-center justify-center rounded-full border border-white/15 bg-[#0d131f] text-slate-400 shadow-xl transition-all hover:border-[var(--theme-accent)] hover:text-white"
          aria-label={collapsed ? 'Expand navigation' : 'Collapse navigation'}
        >
          {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
        </button>
      </aside>

      {/* Mobile Top Scrollable Navigation */}
      <nav
        className="flex shrink-0 gap-1.5 overflow-x-auto border-b border-white/[0.08] bg-[#060910] px-3 py-2.5 no-scrollbar lg:hidden font-mono text-xs"
        aria-label="Mobile Navigation"
      >
        {navigation.flatMap((group) => group.items).map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              type="button"
              key={item.id}
              onClick={() => handleSelect(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex min-h-9 shrink-0 items-center gap-2 rounded-lg px-3 text-xs font-semibold transition-all ${
                isActive
                  ? 'border border-[var(--theme-accent)] bg-[var(--theme-glow)] text-white shadow-sm'
                  : 'border border-transparent text-slate-400 hover:bg-white/[0.05] hover:text-white'
              }`}
            >
              <Icon className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="font-tech text-xs">{item.short}</span>
              {item.badge && (
                <span
                  className={`rounded px-1.5 py-0.2 text-[9px] font-bold ${
                    item.alert ? 'bg-red-500/20 text-red-300' : 'bg-white/10 text-slate-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </>
  );
}
