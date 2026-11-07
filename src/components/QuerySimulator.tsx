import React, { useState } from 'react';
import { HttpMethod } from '../types';
import {
  Terminal,
  Play,
  RotateCcw,
  Zap,
  ArrowRight,
  Server,
  Database,
  Cpu,
  CheckCircle2,
  Copy,
  Check,
  Code,
  Globe
} from 'lucide-react';

export const QuerySimulator: React.FC = () => {
  const [method, setMethod] = useState<HttpMethod>('GET');
  const [url, setUrl] = useState('https://api.cacheflow.dev/v2/products/492?currency=USD');
  const [headersText, setHeadersText] = useState(
    'Accept: application/json\nUser-Agent: CacheFlow-Simulator/1.0\nx-tenant-id: org_alpha_99'
  );
  const [forceCold, setForceCold] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [lastExecutedKey, setLastExecutedKey] = useState<string | null>(null);
  const [cacheMemory, setCacheMemory] = useState<Record<string, { age: number; count: number }>>({});

  // Simulation output state
  const [result, setResult] = useState<{
    status: 'HIT' | 'MISS' | 'BYPASS';
    latencyMs: number;
    originLatencyMs: number;
    pop: string;
    keyHash: string;
    age: number;
    responseHeaders: Record<string, string>;
    body: string;
  } | null>(null);

  const presets = [
    {
      title: 'Product Catalog API',
      method: 'GET' as HttpMethod,
      url: 'https://api.cacheflow.dev/v2/products/492?currency=USD',
      headers: 'Accept: application/json\nx-client-region: us-east'
    },
    {
      title: 'Authenticated Session (Bypass)',
      method: 'GET' as HttpMethod,
      url: 'https://api.cacheflow.dev/v1/auth/user/session',
      headers: 'Authorization: Bearer cf_live_user_token_99\nCookie: session_auth=true'
    },
    {
      title: 'GraphQL Catalog Aggregation',
      method: 'POST' as HttpMethod,
      url: 'https://api.cacheflow.dev/graphql?query={products(first:5){id,name,price}}',
      headers: 'Content-Type: application/json\nx-graphql-operation: products'
    },
    {
      title: 'Dynamic Telemetry Feed (SWR)',
      method: 'GET' as HttpMethod,
      url: 'https://api.cacheflow.dev/v2/telemetry/feed?sensor=thermocouple-12',
      headers: 'Accept: application/json\nCache-Control: max-age=60'
    }
  ];

  const handleApplyPreset = (p: typeof presets[0]) => {
    setMethod(p.method);
    setUrl(p.url);
    setHeadersText(p.headers);
  };

  const handleExecute = () => {
    setIsRunning(true);

    // Compute key hash from URL and method
    const hash = 'cf_' + Math.abs(
      (method + url).split('').reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0)
    ).toString(16).padStart(12, '0');

    setTimeout(() => {
      const isAuthBypass = headersText.includes('Authorization') || headersText.includes('Cookie');
      const isWarm = !forceCold && !isAuthBypass && cacheMemory[hash] !== undefined;

      const currentCount = (cacheMemory[hash]?.count || 0) + 1;
      const currentAge = isWarm ? (cacheMemory[hash]?.age || 10) + 14 : 0;

      if (!isAuthBypass) {
        setCacheMemory((prev) => ({
          ...prev,
          [hash]: { age: currentAge, count: currentCount }
        }));
      }

      const status: 'HIT' | 'MISS' | 'BYPASS' = isAuthBypass
        ? 'BYPASS'
        : isWarm
        ? 'HIT'
        : 'MISS';

      const originLatency = Math.floor(Math.random() * 80 + 190);
      const edgeLatency =
        status === 'HIT'
          ? Math.round((Math.random() * 4 + 4) * 10) / 10
          : status === 'BYPASS'
          ? originLatency - 5
          : originLatency + 6;

      const mockBody = isAuthBypass
        ? JSON.stringify(
            {
              authenticated: true,
              userId: 'usr_882910',
              sessionTier: 'enterprise_operator',
              issuedAt: new Date().toISOString(),
              cacheBypassReason: 'Authorization header present'
            },
            null,
            2
          )
        : JSON.stringify(
            {
              itemId: 492,
              name: 'Industrial Fiber-Optic Transceiver Module SFP+ 10G',
              sku: 'CF-OPT-10G-LR',
              inStock: 184,
              price: { currency: 'USD', amount: 149.5 },
              cachedAtPop: 'IAD-01 (Ashburn DC)',
              edgeCachedTTLSeconds: 3600,
              telemetry: {
                edgeHitsCount: currentCount,
                computedLatency: `${edgeLatency}ms`
              }
            },
            null,
            2
          );

      setResult({
        status,
        latencyMs: edgeLatency,
        originLatencyMs: originLatency,
        pop: 'IAD-01 (Ashburn, VA)',
        keyHash: `cf_sha256:${hash}`,
        age: currentAge,
        responseHeaders: {
          'content-type': 'application/json; charset=utf-8',
          'cf-cache-status': status,
          'cf-cache-key': `cf_sha256:${hash}`,
          'cf-ray': `89f2a019e-${hash.substring(0, 4)}-iad`,
          'age': String(currentAge),
          'cache-control': isAuthBypass ? 'private, no-cache' : 'public, max-age=3600, stale-while-revalidate=86400',
          'server-timing': `edge;dur=${edgeLatency}, origin;dur=${status === 'HIT' ? 0 : originLatency}`,
          'x-cacheflow-origin-fallback': status === 'HIT' ? 'false' : 'true'
        },
        body: mockBody
      });

      setLastExecutedKey(hash);
      setIsRunning(false);
    }, 450);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
          Edge Query Simulator & Cache Inspector
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Simulate client-to-edge routing, test cold vs warm cache hits, inspect response headers, and verify latency drops.
        </p>
      </div>

      {/* Quick Preset Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mr-1">
          Preset Scenarios:
        </span>
        {presets.map((preset) => (
          <button
            key={preset.title}
            onClick={() => handleApplyPreset(preset)}
            className="px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg shadow-2xs transition-colors"
          >
            {preset.title}
          </button>
        ))}
      </div>

      {/* Main Request Form */}
      <div className="bg-white dark:bg-[#161b22] p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
        {/* Method & URL Bar */}
        <div className="flex flex-col sm:flex-row gap-2">
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value as HttpMethod)}
            className="sm:w-28 text-xs font-semibold font-mono px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="HEAD">HEAD</option>
          </select>

          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://api.yourdomain.com/v1/resource"
            className="flex-1 font-mono text-xs px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />

          <button
            onClick={handleExecute}
            disabled={isRunning || !url}
            className="flex items-center justify-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-[#4648d4] hover:bg-[#3b3db8] disabled:opacity-50 rounded-lg shadow-sm transition-colors whitespace-nowrap"
          >
            {isRunning ? (
              <>
                <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                <span>Simulating...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Send Request</span>
              </>
            )}
          </button>
        </div>

        {/* Headers Editor & Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Simulated Request Headers (one per line)
            </label>
            <textarea
              rows={3}
              value={headersText}
              onChange={(e) => setHeadersText(e.target.value)}
              className="w-full font-mono text-xs p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-lg border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              Edge Simulation Flags
            </div>

            <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                checked={forceCold}
                onChange={(e) => setForceCold(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span>Force Cold Cache (Miss)</span>
            </label>

            <div className="text-[11px] text-slate-400">
              Tip: Send the same request twice without checking "Force Cold Cache" to witness immediate cache warming!
            </div>
          </div>
        </div>
      </div>

      {/* Simulation Result Output */}
      {result && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Edge Execution Pipeline Visualizer */}
          <div className="bg-white dark:bg-[#161b22] p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
              Execution Trace & Edge Hop Breakdown
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 relative">
              {/* Step 1: Edge Ingestion */}
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-blue-500" />
                    1. Edge Gateway
                  </span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400">1.8ms</span>
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  POP: {result.pop}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  TLS 1.3 Handshake & Route Match
                </div>
              </div>

              {/* Step 2: Cache Lookup */}
              <div className={`p-3 rounded-lg border ${
                result.status === 'HIT'
                  ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
                  : 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800'
              }`}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-indigo-500" />
                    2. Cache Lookup
                  </span>
                  <span className={`font-mono font-bold ${
                    result.status === 'HIT' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
                  }`}>
                    {result.status}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 font-mono truncate" title={result.keyHash}>
                  Key: {result.keyHash}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  Lookup Latency: 0.9ms (In-Memory Tier)
                </div>
              </div>

              {/* Step 3: Origin Response */}
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Server className="w-3.5 h-3.5 text-purple-500" />
                    3. Origin Trip
                  </span>
                  <span className="font-mono text-slate-600 dark:text-slate-400">
                    {result.status === 'HIT' ? 'Skipped (0ms)' : `${result.originLatencyMs}ms`}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  {result.status === 'HIT' ? '100% Offloaded' : 'Origin Fallback Executed'}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  {result.status === 'HIT' ? 'Cached response delivered' : 'Response cached for future hits'}
                </div>
              </div>
            </div>

            {/* Total Latency Summary Bar */}
            <div className="mt-4 p-3 bg-indigo-50/80 dark:bg-indigo-950/40 rounded-lg border border-indigo-200 dark:border-indigo-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-indigo-950 dark:text-indigo-200">
                  Total End-to-End Latency:
                </span>
                <span className="font-mono font-bold text-base text-indigo-600 dark:text-indigo-400">
                  {result.latencyMs} ms
                </span>
                {result.status === 'HIT' && (
                  <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400">
                    (Saved ~{(result.originLatencyMs - result.latencyMs).toFixed(0)}ms vs direct origin!)
                  </span>
                )}
              </div>

              <button
                onClick={handleExecute}
                className="px-3 py-1 text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-white dark:bg-indigo-900/60 hover:bg-indigo-100 rounded border border-indigo-200 dark:border-indigo-800 transition-colors self-start sm:self-auto"
              >
                Send Again (Test Warm Cache)
              </button>
            </div>
          </div>

          {/* Response Headers & Body Split */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Headers Card */}
            <div className="bg-white dark:bg-[#161b22] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
                  Edge Response Headers
                </h4>
                <button
                  onClick={() =>
                    copyToClipboard(
                      Object.entries(result.responseHeaders)
                        .map(([k, v]) => `${k}: ${v}`)
                        .join('\n')
                    )
                  }
                  className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="bg-slate-900 text-slate-100 p-3 rounded-lg font-mono text-xs overflow-x-auto space-y-1">
                {Object.entries(result.responseHeaders).map(([key, value]) => (
                  <div key={key}>
                    <span className="text-indigo-400">{key}:</span>{' '}
                    <span className={key === 'cf-cache-status' ? 'font-bold text-emerald-400' : 'text-slate-300'}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Response Body Card */}
            <div className="bg-white dark:bg-[#161b22] p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
                  Response Payload Preview
                </h4>
                <button
                  onClick={() => copyToClipboard(result.body)}
                  className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <pre className="bg-slate-900 text-slate-100 p-3 rounded-lg font-mono text-xs overflow-x-auto max-h-56">
                <code>{result.body}</code>
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
