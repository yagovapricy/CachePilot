import React from 'react';
import { ActiveTab } from '../types';
import {
  Activity,
  Sliders,
  Terminal,
  Globe,
  Key,
  HardDrive,
  Cpu,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isStreaming: boolean;
  setIsStreaming: (val: boolean | ((prev: boolean) => boolean)) => void;
  onOpenInstantPurge: () => void;
  hitRatio: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isStreaming,
  setIsStreaming,
  onOpenInstantPurge,
  hitRatio,
}) => {
  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      id: 'telemetry',
      label: 'Live Telemetry',
      icon: <Activity className="w-4 h-4" />,
      desc: 'Real-time hit stream'
    },
    {
      id: 'rules',
      label: 'Cache Rules',
      icon: <Sliders className="w-4 h-4" />,
      desc: 'TTL & SWR routing'
    },
    {
      id: 'simulator',
      label: 'Query Simulator',
      icon: <Terminal className="w-4 h-4" />,
      desc: 'Edge request playground'
    },
    {
      id: 'network',
      label: 'Edge Network',
      icon: <Globe className="w-4 h-4" />,
      desc: '42 global POP nodes'
    },
    {
      id: 'api-keys',
      label: 'API Keys & SDKs',
      icon: <Key className="w-4 h-4" />,
      desc: 'Credentials & code'
    }
  ];

  return (
    <aside className="w-64 shrink-0 hidden md:flex flex-col justify-between border-r border-slate-200 dark:border-slate-800 bg-[#f7f9fb] dark:bg-[#090d13] p-4 select-none">
      <div className="space-y-6">
        {/* Navigation list */}
        <div>
          <div className="px-2 mb-2 text-[11px] font-semibold text-slate-400 dark:text-slate-500 tracking-wider">
            CONSOLE
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-all ${
                    active
                      ? 'bg-white dark:bg-slate-800/90 text-[#4648d4] dark:text-indigo-400 font-semibold shadow-xs border border-slate-200/90 dark:border-slate-700/80'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={active ? 'text-[#4648d4] dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'}>
                      {item.icon}
                    </span>
                    <div>
                      <div className="text-xs font-medium leading-none">{item.label}</div>
                      <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 leading-none">{item.desc}</div>
                    </div>
                  </div>
                  {active && <ChevronRight className="w-3.5 h-3.5 text-[#4648d4] dark:text-indigo-400" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Real-time Streaming Controller */}
        <div className="p-3 bg-white dark:bg-slate-900/70 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isStreaming ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
              Live Ingestion
            </span>
            <button
              onClick={() => setIsStreaming((prev) => !prev)}
              className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              {isStreaming ? 'PAUSE' : 'RESUME'}
            </button>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between tabular-nums">
            <span>Global Hit Ratio:</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
              {hitRatio.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* Footer Storage / System State */}
      <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
        {/* Edge Memory Usage */}
        <div className="px-2">
          <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1.5">
            <span className="flex items-center gap-1">
              <HardDrive className="w-3 h-3 text-slate-400" />
              SSD Edge Cache
            </span>
            <span className="font-mono tabular-nums text-slate-700 dark:text-slate-300">1.42 / 5.0 TB</span>
          </div>
          <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full" style={{ width: '28.4%' }} />
          </div>
          <div className="flex items-center justify-between mt-2 text-[10px] text-slate-400">
            <span>Tier: Enterprise Global</span>
            <span>42 POPs active</span>
          </div>
        </div>

        {/* Quick purge shortcut */}
        <button
          onClick={onOpenInstantPurge}
          className="w-full flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          <RefreshCw className="w-3 h-3 text-slate-500" />
          <span>Instant Cache Invalidation</span>
        </button>
      </div>
    </aside>
  );
};
