import React, { useState } from 'react';
import { RefreshCw, X, AlertTriangle, CheckCircle2, Layers } from 'lucide-react';

interface InstantPurgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExecutePurge: (type: 'key' | 'tag' | 'prefix' | 'everything', target: string) => void;
  isPurging: boolean;
}

export const InstantPurgeModal: React.FC<InstantPurgeModalProps> = ({
  isOpen,
  onClose,
  onExecutePurge,
  isPurging
}) => {
  const [purgeType, setPurgeType] = useState<'prefix' | 'tag' | 'key' | 'everything'>('prefix');
  const [target, setTarget] = useState('');
  const [confirmAll, setConfirmAll] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (purgeType === 'everything' && !confirmAll) return;
    if (purgeType !== 'everything' && !target) return;

    const targetVal = purgeType === 'everything' ? '/* (Entire Cache Zone)' : target;
    onExecutePurge(purgeType, targetVal);
    setTarget('');
    setConfirmAll(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white dark:bg-[#161b22] rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Instant Global Cache Purge
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Evict stale cache objects across all 42 worldwide edge points of presence. Propagation latency averages ~34ms.
          </p>

          {/* Purge Scope selector */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'prefix', label: 'URL Prefix / Wildcard', desc: '/api/v2/*' },
              { id: 'tag', label: 'Cache Tag (Surrogate)', desc: 'tag:product-49' },
              { id: 'key', label: 'Exact Key Hash', desc: 'cf_sha256:...' },
              { id: 'everything', label: 'Entire Edge Zone', desc: 'Global reset' }
            ].map((opt) => (
              <button
                type="button"
                key={opt.id}
                onClick={() => {
                  setPurgeType(opt.id as any);
                  setConfirmAll(false);
                }}
                className={`p-2.5 rounded-lg text-left border transition-all ${
                  purgeType === opt.id
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-slate-900 dark:text-white'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50'
                }`}
              >
                <div className="text-xs font-semibold">{opt.label}</div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">{opt.desc}</div>
              </button>
            ))}
          </div>

          {/* Target input */}
          {purgeType !== 'everything' ? (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {purgeType === 'prefix'
                  ? 'URL Prefix Pattern'
                  : purgeType === 'tag'
                  ? 'Surrogate Cache Tag'
                  : 'Cache Key Hash'}
              </label>
              <input
                type="text"
                required
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder={
                  purgeType === 'prefix'
                    ? '/api/v2/catalog/*'
                    : purgeType === 'tag'
                    ? 'tag:catalog-winter-2026'
                    : 'cf_sha256:7f8b91a24d018c'
                }
                className="w-full font-mono text-xs px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          ) : (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 rounded-lg space-y-2">
              <div className="flex items-center gap-2 text-xs text-rose-800 dark:text-rose-300 font-medium">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>
                  Purging the entire cache will cause an immediate origin load spike while edge caches rewarm.
                </span>
              </div>
              <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={confirmAll}
                  onChange={(e) => setConfirmAll(e.target.checked)}
                  className="rounded text-rose-600 focus:ring-rose-500"
                />
                <span>I confirm purging all cached objects across all 42 POPs.</span>
              </label>
            </div>
          )}

          {/* Propagation progress bar if currently running */}
          {isPurging && (
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-lg border border-indigo-200 dark:border-indigo-900 space-y-1.5">
              <div className="flex items-center justify-between text-xs text-indigo-900 dark:text-indigo-200 font-medium">
                <span className="flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                  Broadcasting invalidation to 42 POPs...
                </span>
                <span className="font-mono">34ms est.</span>
              </div>
              <div className="w-full bg-indigo-200 dark:bg-indigo-900 h-1.5 rounded-full overflow-hidden">
                <div className="bg-indigo-600 h-full w-full animate-progress" />
              </div>
            </div>
          )}

          {/* Footer actions */}
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isPurging}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                isPurging ||
                (purgeType !== 'everything' && !target) ||
                (purgeType === 'everything' && !confirmAll)
              }
              className="px-4 py-2 text-xs font-semibold text-white bg-[#4648d4] hover:bg-[#3b3db8] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
            >
              {isPurging ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Purging Edge...</span>
                </>
              ) : (
                <span>Broadcast Purge</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
