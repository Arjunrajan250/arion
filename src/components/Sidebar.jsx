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
  ShieldAlert,
  Target,
} from 'lucide-react';
import { playBeep } from '../utils/soundEngine';

const navigation = [
  {
    label: 'Intelligence',
    items: [
      { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
      { id: 'surveillance', label: 'Surveillance', icon: Eye },
      { id: 'livefeed', label: 'Live feeds', icon: Radio },
      { id: 'cybercommand', label: 'Cyber command', icon: ShieldAlert },
    ],
  },
  {
    label: 'Operations',
    items: [
      { id: 'alerts', label: 'Alerts', icon: Bell, badge: '8' },
      { id: 'campaigns', label: 'Campaigns', icon: Target },
      { id: 'reporting', label: 'Reports', icon: FileText },
    ],
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
      title={collapsed ? item.label : undefined}
      className={`group relative flex min-h-11 w-full items-center rounded-lg border text-left text-sm font-medium transition-colors ${
        collapsed ? 'justify-center px-2' : 'gap-3 px-3'
      } ${
        isActive
          ? 'border-cyan-400/25 bg-cyan-400/10 text-cyan-200'
          : 'border-transparent text-slate-400 hover:bg-white/[0.04] hover:text-slate-100'
      }`}
    >
      {isActive && <span className="absolute -left-[9px] h-5 w-0.5 rounded-full bg-cyan-400" aria-hidden="true" />}
      <Icon className={`h-[18px] w-[18px] shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'}`} aria-hidden="true" />
      {!collapsed && <span className="min-w-0 flex-1 truncate">{item.label}</span>}
      {item.badge && (
        <span className={`${collapsed ? 'absolute right-1 top-1 h-2 w-2 rounded-full bg-red-400' : 'rounded-md bg-red-500/15 px-2 py-0.5 text-[10px] font-semibold text-red-300'}`}>
          {!collapsed && item.badge}
        </span>
      )}
    </button>
  );
}

export default function Sidebar({ activeTab, setActiveTab, collapsed, setCollapsed, onOpenCommand }) {
  const handleSelect = (tab) => {
    playBeep();
    setActiveTab(tab);
  };

  return (
    <>
      <aside className={`relative hidden shrink-0 flex-col border-r border-white/[0.07] bg-[#080c13] transition-[width] duration-200 lg:flex ${collapsed ? 'w-[76px]' : 'w-60'}`}>
        <div className={`flex-1 overflow-y-auto py-5 ${collapsed ? 'px-3' : 'px-4'}`}>
          {navigation.map((group, groupIndex) => (
            <div key={group.label} className={groupIndex ? 'mt-7' : ''}>
              {!collapsed && (
                <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-600">
                  {group.label}
                </p>
              )}
              <div className="space-y-1">
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
        </div>

        <div className={`border-t border-white/[0.07] ${collapsed ? 'p-3' : 'p-4'}`}>
          {!collapsed && (
            <button
              type="button"
              onClick={onOpenCommand}
              className="mb-4 flex w-full items-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.025] px-3 py-2 text-xs text-slate-500 transition-colors hover:border-cyan-400/25 hover:text-slate-300"
            >
              <Command className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="flex-1 text-left">Quick actions</span>
              <kbd className="font-mono text-[10px]">⌘K</kbd>
            </button>
          )}
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-2.5 px-1'}`} title="All core services are online">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            {!collapsed && (
              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-300">Systems operational</p>
                <p className="mt-0.5 text-[10px] text-slate-600">12/12 services online</p>
              </div>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-7 flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-[#111722] text-slate-500 shadow-md transition-colors hover:border-cyan-400/40 hover:text-cyan-300"
          aria-label={collapsed ? 'Expand navigation' : 'Collapse navigation'}
        >
          {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
        </button>
      </aside>

      <nav className="flex shrink-0 gap-1 overflow-x-auto border-b border-white/[0.07] bg-[#080c13] px-3 py-2 no-scrollbar lg:hidden" aria-label="Primary navigation">
        {navigation.flatMap((group) => group.items).map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              type="button"
              key={item.id}
              onClick={() => handleSelect(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex min-h-10 shrink-0 items-center gap-2 rounded-lg px-3 text-xs font-medium transition-colors ${
                isActive ? 'bg-cyan-400/10 text-cyan-200' : 'text-slate-500 hover:bg-white/[0.04] hover:text-slate-200'
              }`}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {item.label}
              {item.badge && <span className="rounded bg-red-500/15 px-1.5 py-0.5 text-[9px] text-red-300">{item.badge}</span>}
            </button>
          );
        })}
      </nav>
    </>
  );
}
