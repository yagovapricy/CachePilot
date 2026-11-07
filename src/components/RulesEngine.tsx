import React, { useState } from 'react';
import { CacheRule, PurgeHistoryItem } from '../types';
import {
  Sliders,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
  RefreshCw,
  Search,
  AlertTriangle,
  X,
  Shield,
  Zap,
  Globe
} from 'lucide-react';

interface RulesEngineProps {
  rules: CacheRule[];
  setRules: React.Dispatch<React.SetStateAction<CacheRule[]>>;
  purgeHistory: PurgeHistoryItem[];
  onTriggerPurge: (type: 'key' | 'tag' | 'prefix' | 'everything', target: string) => void;
  isPurging: boolean;
}

export const RulesEngine: React.FC<RulesEngineProps> = ({
  rules,
  setRules,
  purgeHistory,
  onTriggerPurge,
  isPurging
}) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [purgeType, setPurgeType] = useState<'key' | 'tag' | 'prefix' | 'everything'>('prefix');
  const [purgeTarget, setPurgeTarget] = useState('');
  const [confirmEverything, setConfirmEverything] = useState(false);

  // New Rule Form State
  const [newRuleName, setNewRuleName] = useState('');
  const [newRulePattern, setNewRulePattern] = useState('');
  const [newRuleTier, setNewRuleTier] = useState<CacheRule['tier']>('Edge Memory');
  const [newRuleTTL, setNewRuleTTL] = useState(3600);
  const [newRuleSWR, setNewRuleSWR] = useState(86400);
  const [newRuleQueryPolicy, setNewRuleQueryPolicy] = useState<CacheRule['queryParamsPolicy']>('preserve-all');
  const [newRuleWhitelist, setNewRuleWhitelist] = useState('page,sort,limit');

  const handleToggleRule = (id: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const handleDeleteRule = (id: string) => {
    setRules((prev) => prev.filter((r) => r.id !== id));
  };

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleName || !newRulePattern) return;

    const created: CacheRule = {
      id: `rule-${Date.now()}`,
      name: newRuleName,
      pathPattern: newRulePattern,
      tier: newRuleTier,
      ttlSeconds: Number(newRuleTTL),
      staleWhileRevalidateSeconds: Number(newRuleSWR),
      queryParamsPolicy: newRuleQueryPolicy,
      whitelistParams: newRuleQueryPolicy === 'whitelist' ? newRuleWhitelist.split(',').map((s) => s.trim()) : undefined,
      enabled: true,
      priority: rules.length + 1,
      hitCount: 0,
      lastUpdated: 'Just now'
    };

    setRules([created, ...rules]);
    setIsCreateModalOpen(false);
    setNewRuleName('');
    setNewRulePattern('');
  };

  const handlePurgeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (purgeType === 'everything' && !confirmEverything) return;
    if (purgeType !== 'everything' && !purgeTarget) return;

    const targetVal = purgeType === 'everything' ? '/* (Entire Cache Zone)' : purgeTarget;
    onTriggerPurge(purgeType, targetVal);
    setPurgeTarget('');
    setConfirmEverything(false);
  };

  const formatSeconds = (sec: number) => {
    if (sec === 0) return '0s (Bypass)';
    if (sec < 60) return `${sec}s`;
    if (sec < 3600) return `${Math.floor(sec / 60)}m`;
    if (sec < 86400) return `${Math.floor(sec / 3600)}h`;
    return `${Math.floor(sec / 86400)}d`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Cache Rules & Invalidation Engine
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Orchestrate route TTLs, edge tiers, stale-while-revalidate policies, and execute instant global invalidations.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#4648d4] hover:bg-[#3b3db8] dark:bg-indigo-600 dark:hover:bg-indigo-500 rounded-lg shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Cache Rule</span>
        </button>
      </div>

      {/* Instant Purge Station */}
      <div className="bg-white dark:bg-[#161b22] p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <RefreshCw className={`w-4 h-4 text-[#4648d4] dark:text-indigo-400 ${isPurging ? 'animate-spin' : ''}`} />
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              Instant Global Cache Purge
            </h2>
          </div>
          <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
            Average Edge Invalidation: 34ms
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Evict content instantly from all 42 edge locations simultaneously with zero downtime.
        </p>

        <form onSubmit={handlePurgeSubmit} className="space-y-4">
          {/* Purge Scope Options */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'prefix', label: 'URL Prefix / Wildcard', hint: 'e.g. /api/v2/catalog/*' },
              { id: 'tag', label: 'Cache Tag (Surrogate-Key)', hint: 'e.g. tag:collection-summer' },
              { id: 'key', label: 'Exact Cache Key Hash', hint: 'e.g. cf_sha256:7f8b91a24d01' },
              { id: 'everything', label: 'Purge Entire Zone', hint: 'All cached objects globally' }
            ].map((option) => (
              <button
                type="button"
                key={option.id}
                onClick={() => {
                  setPurgeType(option.id as any);
                  setConfirmEverything(false);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  purgeType === option.id
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* Purge Input */}
          {purgeType !== 'everything' ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={purgeTarget}
                onChange={(e) => setPurgeTarget(e.target.value)}
                placeholder={
                  purgeType === 'prefix'
                    ? '/api/v2/products/*'
                    : purgeType === 'tag'
                    ? 'tag:catalog-winter-2026'
                    : 'cf_sha256:7f8b91a24d018c'
                }
                className="flex-1 font-mono text-xs px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <button
                type="submit"
                disabled={!purgeTarget || isPurging}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm transition-colors whitespace-nowrap"
              >
                {isPurging ? 'Purging Edge...' : 'Execute Purge'}
              </button>
            </div>
          ) : (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 rounded-lg space-y-2">
              <div className="flex items-center gap-2 text-xs text-rose-800 dark:text-rose-300 font-medium">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                Warning: Purging entire zone will cause immediate origin traffic spike until caches rewarm.
              </div>
              <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={confirmEverything}
                  onChange={(e) => setConfirmEverything(e.target.checked)}
                  className="rounded text-rose-600 focus:ring-rose-500"
                />
                <span>I understand and want to invalidate all 42 edge nodes immediately.</span>
              </label>
              <button
                type="submit"
                disabled={!confirmEverything || isPurging}
                className="mt-2 px-4 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm transition-colors"
              >
                {isPurging ? 'Purging Everything...' : 'Confirm Purge All'}
              </button>
            </div>
          )}
        </form>

        {/* Purge Propagation Status */}
        {isPurging && (
          <div className="mt-4 p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-lg border border-indigo-200 dark:border-indigo-900 animate-pulse">
            <div className="flex items-center justify-between text-xs text-indigo-900 dark:text-indigo-200 font-medium mb-1.5">
              <span className="flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                Broadcasting eviction signal to 42 POPs...
              </span>
              <span className="font-mono">42 / 42 POPs</span>
            </div>
            <div className="w-full bg-indigo-200 dark:bg-indigo-900 h-1.5 rounded-full overflow-hidden">
              <div className="bg-indigo-600 h-full w-full animate-progress" />
            </div>
          </div>
        )}
      </div>

      {/* Rules Table */}
      <div className="bg-white dark:bg-[#161b22] rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Active Edge Caching Rules
            </h3>
            <p className="text-xs text-slate-500">
              Evaluated sequentially in priority order. First matching rule dictates edge behavior.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {rules.filter((r) => r.enabled).length} of {rules.length} enabled
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-2.5 px-4 w-12 text-center">Pri</th>
                <th className="py-2.5 px-4">Rule Name & Route Pattern</th>
                <th className="py-2.5 px-4">Edge Tier</th>
                <th className="py-2.5 px-4">Edge TTL</th>
                <th className="py-2.5 px-4">SWR Window</th>
                <th className="py-2.5 px-4">Query Param Policy</th>
                <th className="py-2.5 px-4 text-right">Hit Invocations</th>
                <th className="py-2.5 px-4 text-center">Status</th>
                <th className="py-2.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {rules.map((rule) => (
                <tr
                  key={rule.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-3 px-4 text-center font-mono font-bold text-slate-400">
                    #{rule.priority}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-slate-900 dark:text-white">
                      {rule.name}
                    </div>
                    <div className="font-mono text-[11px] text-[#4648d4] dark:text-indigo-400 mt-0.5">
                      {rule.pathPattern}
                    </div>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {rule.tier}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-800 dark:text-slate-200 tabular-nums whitespace-nowrap">
                    {formatSeconds(rule.ttlSeconds)}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-400 tabular-nums whitespace-nowrap">
                    {formatSeconds(rule.staleWhileRevalidateSeconds)}
                  </td>
                  <td className="py-3 px-4 text-[11px] text-slate-600 dark:text-slate-400">
                    {rule.queryParamsPolicy === 'whitelist' ? (
                      <span title={rule.whitelistParams?.join(', ')}>
                        Whitelist ({rule.whitelistParams?.length} params)
                      </span>
                    ) : rule.queryParamsPolicy === 'ignore-all' ? (
                      <span className="text-amber-600 dark:text-amber-400 font-medium">Strip All (Max Cache Hit)</span>
                    ) : (
                      <span>Preserve All</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-700 dark:text-slate-300">
                    {(rule.hitCount / 1000).toFixed(0)}k
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleToggleRule(rule.id)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        rule.enabled ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          rule.enabled ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </td>
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    <button
                      onClick={() => handleDeleteRule(rule.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded transition-colors"
                      title="Delete Rule"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Invalidation History */}
      <div className="bg-white dark:bg-[#161b22] p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
          Recent Purge Executions
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-[11px] font-semibold text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-2">
                <th className="py-2">Time</th>
                <th className="py-2">Type</th>
                <th className="py-2">Target</th>
                <th className="py-2">Propagation</th>
                <th className="py-2 text-right">Confirmation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono text-[11px]">
              {purgeHistory.map((item) => (
                <tr key={item.id} className="text-slate-600 dark:text-slate-400">
                  <td className="py-2.5 text-slate-400">{item.timestamp}</td>
                  <td className="py-2.5 uppercase font-semibold text-indigo-600 dark:text-indigo-400">{item.type}</td>
                  <td className="py-2.5 text-slate-800 dark:text-slate-200 font-medium">{item.target}</td>
                  <td className="py-2.5 text-emerald-600 dark:text-emerald-400">{item.propagationTimeMs}ms (global)</td>
                  <td className="py-2.5 text-right text-emerald-600 dark:text-emerald-400 flex items-center justify-end gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {item.popsConfirmed}/{item.totalPops} POPs
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Rule Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-[#161b22] rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in duration-150">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Create Edge Caching Rule
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateRule} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Rule Name
                </label>
                <input
                  type="text"
                  required
                  value={newRuleName}
                  onChange={(e) => setNewRuleName(e.target.value)}
                  placeholder="e.g. Products Read API"
                  className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Route Pattern (Glob / Regex)
                </label>
                <input
                  type="text"
                  required
                  value={newRulePattern}
                  onChange={(e) => setNewRulePattern(e.target.value)}
                  placeholder="e.g. /api/v2/items/* or *.webp"
                  className="w-full font-mono text-xs px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Edge Storage Tier
                  </label>
                  <select
                    value={newRuleTier}
                    onChange={(e) => setNewRuleTier(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="Edge Memory">Edge Memory (&lt;1ms)</option>
                    <option value="NVMe SSD">NVMe SSD (&lt;5ms)</option>
                    <option value="Tiered Storage">Tiered Storage</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Edge TTL (seconds)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newRuleTTL}
                    onChange={(e) => setNewRuleTTL(Number(e.target.value))}
                    className="w-full font-mono text-xs px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Stale-While-Revalidate (sec)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newRuleSWR}
                    onChange={(e) => setNewRuleSWR(Number(e.target.value))}
                    className="w-full font-mono text-xs px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Query Parameter Handling
                  </label>
                  <select
                    value={newRuleQueryPolicy}
                    onChange={(e) => setNewRuleQueryPolicy(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="preserve-all">Preserve All Parameters</option>
                    <option value="whitelist">Whitelist Specific Keys</option>
                    <option value="ignore-all">Ignore All (Strip Queries)</option>
                  </select>
                </div>
              </div>

              {newRuleQueryPolicy === 'whitelist' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Allowed Query Keys (comma separated)
                  </label>
                  <input
                    type="text"
                    value={newRuleWhitelist}
                    onChange={(e) => setNewRuleWhitelist(e.target.value)}
                    placeholder="sort, page, currency"
                    className="w-full font-mono text-xs px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              )}

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#4648d4] hover:bg-[#3b3db8] rounded-lg shadow-sm transition-colors"
                >
                  Save & Deploy Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
