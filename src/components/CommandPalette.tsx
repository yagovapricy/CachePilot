import React, { useState, useEffect } from 'react';
import { ActiveTab } from '../types';
import { Search, X, Activity, Sliders, Terminal, Globe, Key, Trash2, Zap, ArrowRight } from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenInstantPurge: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  setActiveTab,
  onOpenInstantPurge
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actions = [
    {
      id: 'telemetry',
      title: 'Navigate to Live Telemetry',
      category: 'Navigation',
      icon: <Activity className="w-4 h-4 text-indigo-500" />,
      run: () => {
        setActiveTab('telemetry');
        onClose();
      }
    },
    {
      id: 'rules',
      title: 'Configure Cache Rules & TTLs',
      category: 'Navigation',
      icon: <Sliders className="w-4 h-4 text-blue-500" />,
      run: () => {
        setActiveTab('rules');
        onClose();
      }
    },
    {
      id: 'simulator',
      title: 'Open Edge Query Simulator & Request Tester',
      category: 'Navigation',
      icon: <Terminal className="w-4 h-4 text-emerald-500" />,
      run: () => {
        setActiveTab('simulator');
        onClose();
      }
    },
    {
      id: 'network',
      title: 'Inspect Global Edge POPs & Latency',
      category: 'Navigation',
      icon: <Globe className="w-4 h-4 text-amber-500" />,
      run: () => {
        setActiveTab('network');
        onClose();
      }
    },
    {
      id: 'api-keys',
      title: 'Manage API Keys & SDK Integration',
      category: 'Navigation',
      icon: <Key className="w-4 h-4 text-purple-500" />,
      run: () => {
        setActiveTab('api-keys');
        onClose();
      }
    },
    {
      id: 'purge',
      title: 'Trigger Instant Global Cache Purge (Wildcard / Tag / Key)',
      category: 'Actions',
      icon: <Trash2 className="w-4 h-4 text-rose-500" />,
      run: () => {
        onClose();
        onOpenInstantPurge();
      }
    }
  ];

  const filtered = actions.filter(
    (a) =>
      a.title.toLowerCase().includes(query.toLowerCase()) ||
      a.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-white dark:bg-[#161b22] rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200 dark:border-slate-800">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search screens, cache keys, actions..."
            className="w-full bg-transparent text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400">
              No matching commands or actions found.
            </div>
          ) : (
            <div className="space-y-1">
              {filtered.map((item) => (
                <button
                  key={item.id}
                  onClick={item.run}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg text-left hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-md bg-slate-100 dark:bg-slate-800 group-hover:bg-white dark:group-hover:bg-slate-700">
                      {item.icon}
                    </div>
                    <div>
                      <div className="text-xs font-medium text-slate-800 dark:text-slate-100">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-slate-400">{item.category}</div>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1.5 py-0.5 font-mono text-[10px] bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                ↵
              </kbd>{' '}
              to select
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 font-mono text-[10px] bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                esc
              </kbd>{' '}
              to close
            </span>
          </div>
          <span className="font-mono text-slate-500">CacheFlow CLI v2.4</span>
        </div>
      </div>
    </div>
  );
};
