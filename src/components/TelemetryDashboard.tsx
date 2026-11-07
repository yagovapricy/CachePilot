import React, { useState, useMemo } from 'react';
import { TelemetryLog, CacheStatus } from '../types';
import {
  TrendingUp,
  Zap,
  Clock,
  HardDrive,
  Database,
  ArrowUpRight,
  Filter,
  Search,
  Pause,
  Play,
  RotateCw,
  X,
  ExternalLink,
  ChevronDown,
  Info,
  SlidersHorizontal,
  Flame
} from 'lucide-react';

interface TelemetryDashboardProps {
  logs: TelemetryLog[];
  isStreaming: boolean;
  setIsStreaming: React.Dispatch<React.SetStateAction<boolean>>;
  onInjectBurst: () => void;
  onPurgeKey: (key: string) => void;
  environment: string;
}

export const TelemetryDashboard: React.FC<TelemetryDashboardProps> = ({
  logs,
  isStreaming,
  setIsStreaming,
  onInjectBurst,
  onPurgeKey,
  environment
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLog, setSelectedLog] = useState<TelemetryLog | null>(null);
  const [timeRange, setTimeRange] = useState<'15m' | '1h' | '24h' | '7d'>('1h');
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; hits: number; misses: number; time: string } | null>(null);

  // Computed metrics
  const totalLogs = logs.length;
  const hitCount = logs.filter((l) => l.status === 'HIT').length;
  const hitRatio = totalLogs > 0 ? (hitCount / totalLogs) * 100 : 94.8;
  const avgLatency =
    logs.length > 0
      ? (logs.reduce((acc, l) => acc + l.latencyMs, 0) / logs.length).toFixed(1)
      : '8.4';
  const totalCachedBytes = logs.reduce((acc, l) => acc + l.responseSizeBytes, 0);

  // Filtered telemetry
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchStatus = selectedStatus === 'ALL' || log.status === selectedStatus;
      const matchQuery =
        searchQuery === '' ||
        log.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.cacheKey.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.pop.toLowerCase().includes(searchQuery.toLowerCase());
      return matchStatus && matchQuery;
    });
  }, [logs, selectedStatus, searchQuery]);

  // Chart data points (24 time buckets)
  const chartPoints = useMemo(() => {
    const points = [];
    const baseHits = [340, 380, 420, 390, 450, 490, 520, 580, 610, 680, 720, 790, 840, 880, 920, 890, 840, 810, 870, 920, 960, 990, 1040, 1080];
    const baseMisses = [28, 32, 35, 40, 38, 42, 45, 52, 48, 55, 50, 62, 58, 64, 60, 55, 52, 49, 58, 60, 55, 58, 64, 62];

    for (let i = 0; i < 24; i++) {
      const minute = (i * 2.5).toFixed(0);
      points.push({
        label: `-${60 - i * 2.5}m`,
        hits: baseHits[i] + Math.floor(Math.sin(i) * 20),
        misses: baseMisses[i] + Math.floor(Math.cos(i) * 8)
      });
    }
    return points;
  }, []);

  // Status Chip Renderer
  const renderStatusChip = (status: CacheStatus) => {
    switch (status) {
      case 'HIT':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/80">
            HIT
          </span>
        );
      case 'MISS':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/80">
            MISS
          </span>
        );
      case 'STALE':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800/80">
            STALE
          </span>
        );
      case 'BYPASS':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            BYPASS
          </span>
        );
      case 'REVALIDATING':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-400 border border-sky-200 dark:border-sky-800/80">
            REVALIDATING
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Environment Context Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Edge Telemetry & Latency Dashboard
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time multi-region cache hit telemetry, origin offload metrics, and live packet stream.
          </p>
        </div>

        {/* Time range & controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200/60 dark:border-slate-700 text-xs">
            {(['15m', '1h', '24h', '7d'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  timeRange === r
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsStreaming((prev) => !prev)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              isStreaming
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
            }`}
          >
            {isStreaming ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isStreaming ? 'Live Active' : 'Paused'}</span>
          </button>

          <button
            onClick={onInjectBurst}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors shadow-2xs"
            title="Simulate a 5-request traffic burst"
          >
            <Flame className="w-3.5 h-3.5 text-orange-500" />
            <span>Simulate Burst</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Hit Ratio */}
        <div className="bg-white dark:bg-[#161b22] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span className="font-medium">Global Cache Hit Ratio</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +3.4%
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
              {hitRatio.toFixed(1)}%
            </span>
            <span className="text-xs text-slate-400">target: 95.0%</span>
          </div>
          {/* Sparkline mini visual */}
          <div className="mt-3 h-8 flex items-end gap-1">
            {[65, 70, 78, 82, 85, 84, 88, 91, 92, 94, 95, 96, 94, 95, 97, 95, 98].map((v, idx) => (
              <div
                key={idx}
                className="flex-1 bg-indigo-500/20 dark:bg-indigo-400/20 hover:bg-indigo-500 transition-colors rounded-xs"
                style={{ height: `${(v / 100) * 100}%` }}
                title={`${v}% hit ratio`}
              />
            ))}
          </div>
        </div>

        {/* Card 2: Edge Latency vs Origin */}
        <div className="bg-white dark:bg-[#161b22] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span className="font-medium">Edge p95 Latency</span>
            <span className="font-mono text-[11px] text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-1.5 py-0.5 rounded">
              -95.2% vs Origin
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
              {avgLatency} <span className="text-sm font-normal text-slate-400">ms</span>
            </span>
            <span className="text-xs text-slate-400 line-through tabular-nums">245ms origin</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>p50: 6.2ms</span>
            <span>p95: 11.4ms</span>
            <span>p99: 19.8ms</span>
          </div>
        </div>

        {/* Card 3: Bandwidth & Egress Saved */}
        <div className="bg-white dark:bg-[#161b22] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span className="font-medium">Egress Bandwidth Offloaded</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
              ~$580/mo saved
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
              4.82 <span className="text-sm font-normal text-slate-400">TB</span>
            </span>
            <span className="text-xs text-slate-400">98.4% offload</span>
          </div>
          <div className="mt-3 w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden flex">
            <div className="bg-[#4648d4] h-full" style={{ width: '94%' }} title="Edge Served: 94%" />
            <div className="bg-amber-400 h-full" style={{ width: '6%' }} title="Origin Fallback: 6%" />
          </div>
        </div>

        {/* Card 4: Total Invocations / Peak QPS */}
        <div className="bg-white dark:bg-[#161b22] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span className="font-medium">Total Invocations</span>
            <span className="text-slate-400 font-mono text-[11px]">42 POPs</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
              142.8<span className="text-sm font-normal text-slate-400">M</span>
            </span>
            <span className="text-xs text-slate-500">1,480 req/sec peak</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
            <span>Cache Key collisions: 0</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">100% SLA</span>
          </div>
        </div>
      </div>

      {/* Main Real-Time Request Volume Chart Container */}
      <div className="bg-white dark:bg-[#161b22] p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              Cache Request Volume & Hit Distribution
            </h2>
            <p className="text-xs text-slate-500">
              Aggregated edge POP telemetry over time with HIT vs MISS breakdown.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#4648d4]" />
              <span className="text-slate-600 dark:text-slate-400">Cache Hits</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-amber-500" />
              <span className="text-slate-600 dark:text-slate-400">Origin Misses</span>
            </div>
          </div>
        </div>

        {/* SVG Area Chart */}
        <div className="relative h-44 w-full">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 800 160" preserveAspectRatio="none">
            <defs>
              <linearGradient id="hitGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4648d4" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#4648d4" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="missGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            <line x1="0" y1="40" x2="800" y2="40" stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeDasharray="3 3" />
            <line x1="0" y1="80" x2="800" y2="80" stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeDasharray="3 3" />
            <line x1="0" y1="120" x2="800" y2="120" stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeDasharray="3 3" />

            {/* Hits Area */}
            {(() => {
              const maxHits = 1200;
              const pointsStr = chartPoints
                .map((p, i) => {
                  const x = (i / (chartPoints.length - 1)) * 800;
                  const y = 150 - (p.hits / maxHits) * 130;
                  return `${x},${y}`;
                })
                .join(' ');
              return (
                <>
                  <polygon points={`0,150 ${pointsStr} 800,150`} fill="url(#hitGradient)" />
                  <polyline points={pointsStr} fill="none" stroke="#4648d4" strokeWidth="2.5" strokeLinecap="round" />
                </>
              );
            })()}

            {/* Misses Line */}
            {(() => {
              const maxHits = 1200;
              const pointsStr = chartPoints
                .map((p, i) => {
                  const x = (i / (chartPoints.length - 1)) * 800;
                  const y = 150 - (p.misses * 8 / maxHits) * 130;
                  return `${x},${y}`;
                })
                .join(' ');
              return (
                <polyline points={pointsStr} fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 2" />
              );
            })()}

            {/* Interactive hover points */}
            {chartPoints.map((p, i) => {
              const x = (i / (chartPoints.length - 1)) * 800;
              const y = 150 - (p.hits / 1200) * 130;
              return (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r="4"
                  className="fill-[#4648d4] opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                  onMouseEnter={() =>
                    setHoveredPoint({ x, y, hits: p.hits, misses: p.misses, time: p.label })
                  }
                  onMouseLeave={() => setHoveredPoint(null)}
                />
              );
            })}
          </svg>

          {/* Hover Tooltip */}
          {hoveredPoint && (
            <div
              className="absolute pointer-events-none transform -translate-x-1/2 -translate-y-full mb-2 bg-slate-900 text-white text-[11px] px-2.5 py-1.5 rounded-lg shadow-lg border border-slate-700 z-10"
              style={{ left: `${(hoveredPoint.x / 800) * 100}%`, top: `${(hoveredPoint.y / 160) * 100}%` }}
            >
              <div className="font-semibold text-slate-300">{hoveredPoint.time}</div>
              <div className="text-indigo-400 font-mono">Hits: {hoveredPoint.hits} req/s</div>
              <div className="text-amber-400 font-mono">Misses: {hoveredPoint.misses} req/s</div>
            </div>
          )}
        </div>

        {/* Bottom time markers */}
        <div className="flex justify-between text-[11px] font-mono text-slate-400 mt-2 border-t border-slate-100 dark:border-slate-800 pt-2">
          <span>-60 mins</span>
          <span>-45 mins</span>
          <span>-30 mins</span>
          <span>-15 mins</span>
          <span className="text-[#4648d4] font-semibold">Now (Live)</span>
        </div>
      </div>

      {/* Real-time Telemetry Log Feed */}
      <div className="bg-white dark:bg-[#161b22] rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
        {/* Table Controls */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Live Edge Request Stream
            </h3>
            <span className="text-[11px] font-mono text-slate-400">
              ({filteredLogs.length} events logged)
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Input */}
            <div className="relative min-w-[220px]">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by endpoint, key hash, POP..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200/60 dark:border-slate-700 text-xs">
              {(['ALL', 'HIT', 'MISS', 'STALE', 'BYPASS'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setSelectedStatus(st)}
                  className={`px-2 py-0.5 rounded font-medium transition-colors ${
                    selectedStatus === st
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Telemetry Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4">Timestamp</th>
                <th className="py-2.5 px-4">Method & Path</th>
                <th className="py-2.5 px-4">Cache Key</th>
                <th className="py-2.5 px-4">Edge POP</th>
                <th className="py-2.5 px-4 text-right">Edge Latency</th>
                <th className="py-2.5 px-4 text-right">Origin Delta</th>
                <th className="py-2.5 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No cache events matching current query and filter.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const latencySaved = Math.max(0, log.originLatencyMs - log.latencyMs);
                  return (
                    <tr
                      key={log.id}
                      onClick={() => setSelectedLog(log)}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group"
                    >
                      <td className="py-2.5 px-4 whitespace-nowrap">
                        {renderStatusChip(log.status)}
                      </td>
                      <td className="py-2.5 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                        {log.timestamp}
                      </td>
                      <td className="py-2.5 px-4 font-mono text-slate-800 dark:text-slate-200">
                        <div className="flex items-center gap-1.5 max-w-xs sm:max-w-md truncate">
                          <span className={`px-1 py-0.2 rounded font-semibold text-[10px] ${
                            log.method === 'GET' ? 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400' : 'bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400'
                          }`}>
                            {log.method}
                          </span>
                          <span className="truncate" title={log.path}>
                            {log.path}
                          </span>
                        </div>
                      </td>
                      <td className="py-2.5 px-4 font-mono text-[11px] text-[#4648d4] dark:text-indigo-400 whitespace-nowrap">
                        {log.cacheKey}
                      </td>
                      <td className="py-2.5 px-4 whitespace-nowrap text-slate-600 dark:text-slate-300">
                        <span className="font-mono font-medium">{log.pop}</span>
                        <span className="text-[10px] text-slate-400 ml-1">({log.popRegion})</span>
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono font-semibold text-slate-800 dark:text-slate-200 tabular-nums whitespace-nowrap">
                        {log.latencyMs.toFixed(1)}ms
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono text-[11px] text-emerald-600 dark:text-emerald-400 tabular-nums whitespace-nowrap">
                        {log.status === 'HIT' ? `-${latencySaved.toFixed(0)}ms` : 'origin trip'}
                      </td>
                      <td className="py-2.5 px-4 text-center whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedLog(log);
                          }}
                          className="px-2 py-1 text-[11px] text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspection Drawer / Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white dark:bg-[#161b22] rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
              <div className="flex items-center gap-2">
                {renderStatusChip(selectedLog.status)}
                <span className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-200">
                  {selectedLog.method} {selectedLog.path}
                </span>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Telemetry Summary Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-slate-50 dark:bg-slate-900/80 rounded-lg text-xs font-mono">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">Edge POP</div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">{selectedLog.pop}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">Latency</div>
                  <div className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {selectedLog.latencyMs}ms <span className="text-slate-400 font-normal">({selectedLog.originLatencyMs}ms origin)</span>
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">Payload Size</div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">
                    {(selectedLog.responseSizeBytes / 1024).toFixed(1)} KB
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">TTL Remaining</div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">
                    {selectedLog.ttlRemainingSec > 0 ? `${selectedLog.ttlRemainingSec}s` : 'Expired / None'}
                  </div>
                </div>
              </div>

              {/* Cache Key */}
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                  Cache Key Hash
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={selectedLog.cacheKey}
                    className="w-full font-mono text-xs p-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-300 select-all"
                  />
                  <button
                    onClick={() => {
                      onPurgeKey(selectedLog.cacheKey);
                      setSelectedLog(null);
                    }}
                    className="px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 border border-rose-200 dark:border-rose-900 rounded-lg whitespace-nowrap transition-colors"
                  >
                    Purge Key
                  </button>
                </div>
              </div>

              {/* Response Headers */}
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
                  Edge Response Headers
                </label>
                <div className="bg-slate-900 text-slate-100 rounded-lg p-3 font-mono text-xs overflow-x-auto space-y-1">
                  <div><span className="text-indigo-400">cf-cache-status:</span> {selectedLog.status}</div>
                  <div><span className="text-indigo-400">cf-cache-key:</span> {selectedLog.cacheKey}</div>
                  <div><span className="text-indigo-400">cf-pop:</span> {selectedLog.pop} ({selectedLog.popRegion})</div>
                  <div><span className="text-indigo-400">content-type:</span> {selectedLog.contentType}</div>
                  <div><span className="text-indigo-400">cache-control:</span> public, max-age=3600, stale-while-revalidate=86400</div>
                  <div><span className="text-indigo-400">x-cacheflow-latency-savings:</span> {Math.max(0, selectedLog.originLatencyMs - selectedLog.latencyMs).toFixed(1)}ms</div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-end">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
