import React from 'react';
import { ActiveTab } from '../types';
import { Search, Moon, Sun, Layers, ShieldCheck, Zap } from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  environment: string;
  setEnvironment: (env: string) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  onOpenSearch: () => void;
  onOpenInstantPurge: () => void;
  isStreaming: boolean;
  totalRequests: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  environment,
  setEnvironment,
  darkMode,
  setDarkMode,
  onOpenSearch,
  onOpenInstantPurge,
  isStreaming,
}) => {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between gap-8 px-6 py-3.5 bg-white/95 dark:bg-[#0d1117]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      {/* Zone 1: Single element wordmark brand lockup */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={() => setActiveTab('telemetry')}
          className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-md"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#4648d4] via-[#6063ee] to-[#3B82F6] flex items-center justify-center text-white shadow-sm shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Zap className="w-4 h-4 fill-white" />
          </div>
          <div>
            <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
              CacheFlow<span className="text-[#4648d4] dark:text-[#818cf8] ml-0.5">AI</span>
            </span>
          </div>
        </button>

        {/* Quiet Environment Selector */}
        <div className="hidden sm:flex items-center ml-3 pl-3 border-l border-slate-200 dark:border-slate-800">
          <select
            value={environment}
            onChange={(e) => setEnvironment(e.target.value)}
            className="text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 px-2.5 py-1 rounded-md border border-slate-200/60 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="production">Production (Global 42 POPs)</option>
            <option value="staging">Staging (Edge Preview)</option>
            <option value="edge-us-east">Region: US-East (IAD)</option>
            <option value="edge-eu-west">Region: EU-West (FRA)</option>
          </select>
        </div>
      </div>

      {/* Zone 2: 4-5 single-line clean text nav links */}
      <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
        <button
          onClick={() => setActiveTab('telemetry')}
          className={`whitespace-nowrap transition-colors py-1 relative ${
            activeTab === 'telemetry'
              ? 'text-[#4648d4] dark:text-indigo-400 font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          Telemetry
          {activeTab === 'telemetry' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4648d4] dark:bg-indigo-400 rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('rules')}
          className={`whitespace-nowrap transition-colors py-1 relative ${
            activeTab === 'rules'
              ? 'text-[#4648d4] dark:text-indigo-400 font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          Cache Rules
          {activeTab === 'rules' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4648d4] dark:bg-indigo-400 rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('simulator')}
          className={`whitespace-nowrap transition-colors py-1 relative ${
            activeTab === 'simulator'
              ? 'text-[#4648d4] dark:text-indigo-400 font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          Query Simulator
          {activeTab === 'simulator' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4648d4] dark:bg-indigo-400 rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('network')}
          className={`whitespace-nowrap transition-colors py-1 relative ${
            activeTab === 'network'
              ? 'text-[#4648d4] dark:text-indigo-400 font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          Edge POPs
          {activeTab === 'network' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4648d4] dark:bg-indigo-400 rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('api-keys')}
          className={`whitespace-nowrap transition-colors py-1 relative ${
            activeTab === 'api-keys'
              ? 'text-[#4648d4] dark:text-indigo-400 font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          API & SDKs
          {activeTab === 'api-keys' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4648d4] dark:bg-indigo-400 rounded-full" />
          )}
        </button>
      </nav>

      {/* Zone 3: Primary action + utility tools */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Quick Search Trigger */}
        <button
          onClick={onOpenSearch}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200/70 dark:hover:bg-slate-700/70 rounded-lg border border-slate-200/80 dark:border-slate-700 transition-colors"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Quick search</span>
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-slate-900 rounded border border-slate-300 dark:border-slate-600 text-slate-500">
            ⌘K
          </kbd>
        </button>

        {/* Instant Purge Primary Action */}
        <button
          onClick={onOpenInstantPurge}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#4648d4] hover:bg-[#3b3db8] dark:bg-indigo-600 dark:hover:bg-indigo-500 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Purge Cache</span>
        </button>

        {/* Theme toggle */}
        <button
          onClick={() => setDarkMode((prev) => !prev)}
          title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          className="p-1.5 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
