import React, { useState } from 'react';
import { EdgePopNode } from '../types';
import {
  Globe,
  Radio,
  Wifi,
  Server,
  Zap,
  CheckCircle2,
  Activity,
  HardDrive,
  RefreshCw,
  Search
} from 'lucide-react';

interface EdgeNetworkViewProps {
  nodes: EdgePopNode[];
}

export const EdgeNetworkView: React.FC<EdgeNetworkViewProps> = ({ nodes }) => {
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [pingResults, setPingResults] = useState<Record<string, { pinging: boolean; ms: number }>>({});
  const [activeNode, setActiveNode] = useState<EdgePopNode | null>(nodes[0] || null);

  const filteredNodes = nodes.filter((n) => {
    const matchRegion = selectedRegion === 'All' || n.region === selectedRegion;
    const matchQuery =
      searchQuery === '' ||
      n.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.country.toLowerCase().includes(searchQuery.toLowerCase());
    return matchRegion && matchQuery;
  });

  const handlePingNode = (nodeId: string) => {
    setPingResults((prev) => ({
      ...prev,
      [nodeId]: { pinging: true, ms: prev[nodeId]?.ms || 8.2 }
    }));

    setTimeout(() => {
      const simulatedPing = Math.round((Math.random() * 8 + 4) * 10) / 10;
      setPingResults((prev) => ({
        ...prev,
        [nodeId]: { pinging: false, ms: simulatedPing }
      }));
    }, 400);
  };

  const handlePingAll = () => {
    filteredNodes.forEach((n) => handlePingNode(n.id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Global Edge POP Network Topology
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            42 Points of Presence (POPs) routing anycast edge cache traffic with zero-origin latency.
          </p>
        </div>

        <button
          onClick={handlePingAll}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg shadow-2xs transition-colors self-start sm:self-auto"
        >
          <Radio className="w-3.5 h-3.5 text-indigo-500" />
          <span>Ping All Edge Nodes</span>
        </button>
      </div>

      {/* Interactive Global Network Map Container */}
      <div className="bg-white dark:bg-[#161b22] p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#4648d4] dark:text-indigo-400" />
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              Anycast Edge POP Map
            </h2>
            <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
              100% Operational
            </span>
          </div>
          <div className="text-xs text-slate-500 font-mono">
            Active Global Egress: 338.2 Gbps
          </div>
        </div>

        {/* Visual Map Canvas with Stylized Coordinates */}
        <div className="relative w-full h-64 sm:h-80 bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center p-4">
          {/* Subtle World Map Grid lines */}
          <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:32px_32px]" />

          {/* Map Node Pins */}
          {nodes.map((node) => {
            const isSelected = activeNode?.id === node.id;
            const ping = pingResults[node.id];

            return (
              <button
                key={node.id}
                onClick={() => setActiveNode(node)}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 group z-10 focus:outline-none"
                style={{ left: `${node.coords.x}%`, top: `${node.coords.y}%` }}
              >
                {/* Ping ring animation */}
                <span className="absolute -inset-2 rounded-full bg-indigo-500/30 animate-ping opacity-75 group-hover:opacity-100" />
                
                {/* Node dot */}
                <div
                  className={`relative w-4 h-4 rounded-full flex items-center justify-center transition-transform ${
                    isSelected
                      ? 'bg-white scale-125 ring-4 ring-indigo-500'
                      : 'bg-indigo-500 hover:scale-110'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-950" />
                </div>

                {/* Node badge tag */}
                <div className="absolute top-5 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] font-mono px-2 py-1 rounded shadow-lg border border-slate-700 whitespace-nowrap pointer-events-none z-20">
                  <div className="font-bold text-indigo-400">{node.code}</div>
                  <div>{node.city}</div>
                  <div className="text-emerald-400">
                    {ping ? `${ping.ms}ms` : `${node.p95LatencyMs}ms`} · {node.hitRatio}% Hit
                  </div>
                </div>
              </button>
            );
          })}

          {/* Active Node Detail Card Overlay */}
          {activeNode && (
            <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-xs bg-slate-900/95 backdrop-blur-md border border-slate-700 p-3.5 rounded-lg text-white shadow-xl z-20">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-indigo-400 font-mono text-sm">
                  {activeNode.code}
                </span>
                <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {activeNode.status}
                </span>
              </div>
              <div className="text-xs font-semibold">{activeNode.city}, {activeNode.country}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">{activeNode.region}</div>

              <div className="grid grid-cols-2 gap-2 mt-3 pt-2 border-t border-slate-800 text-[11px] font-mono">
                <div>
                  <div className="text-slate-400 text-[10px]">p95 Latency</div>
                  <div className="text-emerald-400 font-semibold">{activeNode.p95LatencyMs}ms</div>
                </div>
                <div>
                  <div className="text-slate-400 text-[10px]">Hit Ratio</div>
                  <div className="text-white font-semibold">{activeNode.hitRatio}%</div>
                </div>
                <div>
                  <div className="text-slate-400 text-[10px]">Cached Objects</div>
                  <div className="text-white">{(activeNode.cachedObjects / 1000000).toFixed(1)}M</div>
                </div>
                <div>
                  <div className="text-slate-400 text-[10px]">Egress Bandwidth</div>
                  <div className="text-white">{activeNode.bandwidthServedGbps} Gbps</div>
                </div>
              </div>

              <button
                onClick={() => handlePingNode(activeNode.id)}
                className="w-full mt-3 py-1 px-2 text-xs font-medium bg-indigo-600 hover:bg-indigo-500 rounded text-white flex items-center justify-center gap-1.5 transition-colors"
              >
                <Radio className={`w-3 h-3 ${pingResults[activeNode.id]?.pinging ? 'animate-spin' : ''}`} />
                <span>
                  {pingResults[activeNode.id]?.pinging
                    ? 'Measuring round trip...'
                    : pingResults[activeNode.id]?.ms
                    ? `Ping: ${pingResults[activeNode.id].ms}ms (Click to re-ping)`
                    : 'Test Ping Node'}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* POP Nodes List & Filter */}
      <div className="bg-white dark:bg-[#161b22] rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
        {/* Controls */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              POP Status & Performance Matrix
            </h3>
            <span className="text-xs font-mono text-slate-400">
              ({filteredNodes.length} nodes)
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative min-w-[200px]">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search city, code, region..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Region selector */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200/60 dark:border-slate-700 text-xs">
              {(['All', 'North America', 'Europe', 'Asia-Pacific', 'Latin America'] as const).map((reg) => (
                <button
                  key={reg}
                  onClick={() => setSelectedRegion(reg)}
                  className={`px-2.5 py-1 rounded font-medium transition-colors ${
                    selectedRegion === reg
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {reg}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Nodes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-4">
          {filteredNodes.map((node) => {
            const ping = pingResults[node.id];
            const isSelected = activeNode?.id === node.id;

            return (
              <div
                key={node.id}
                onClick={() => setActiveNode(node)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/20 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-1.5 py-0.5 rounded border border-indigo-200/60 dark:border-indigo-900/60">
                      {node.code}
                    </span>
                    <span className="font-semibold text-xs text-slate-900 dark:text-white">
                      {node.city}
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Nominal
                  </span>
                </div>

                <div className="text-[11px] text-slate-500 mb-3">{node.country} · {node.region}</div>

                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div>
                    <div className="text-slate-400 text-[10px]">p95 Latency</div>
                    <div className="text-emerald-600 dark:text-emerald-400 font-bold">{node.p95LatencyMs}ms</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-[10px]">Hit Ratio</div>
                    <div className="text-slate-700 dark:text-slate-300 font-bold">{node.hitRatio}%</div>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/60">
                  <span className="text-[10px] text-slate-400 font-mono">
                    {node.bandwidthServedGbps} Gbps egress
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePingNode(node.id);
                    }}
                    className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    <Radio className={`w-3 h-3 ${ping?.pinging ? 'animate-spin' : ''}`} />
                    <span>{ping ? `${ping.ms}ms` : 'Ping'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
