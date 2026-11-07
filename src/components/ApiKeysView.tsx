import React, { useState } from 'react';
import { ApiKeyItem } from '../types';
import {
  Key,
  Plus,
  Eye,
  EyeOff,
  Copy,
  Check,
  RefreshCw,
  Trash2,
  Code,
  Shield,
  Terminal,
  CheckCircle2,
  X,
  FileCode
} from 'lucide-react';

interface ApiKeysViewProps {
  apiKeys: ApiKeyItem[];
  setApiKeys: React.Dispatch<React.SetStateAction<ApiKeyItem[]>>;
  onShowToast: (msg: string) => void;
}

export const ApiKeysView: React.FC<ApiKeysViewProps> = ({
  apiKeys,
  setApiKeys,
  onShowToast
}) => {
  const [revealedKeyIds, setRevealedKeyIds] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyRole, setNewKeyRole] = useState<ApiKeyItem['role']>('Admin');
  const [newKeyExpiry, setNewKeyExpiry] = useState('90 days');

  // Code integration tab
  const [activeLang, setActiveLang] = useState<'node' | 'python' | 'go' | 'rust' | 'curl'>('node');
  const [customOrigin, setCustomOrigin] = useState('https://api.yourcompany.com');
  const [defaultTTL, setDefaultTTL] = useState(3600);

  const toggleReveal = (id: string) => {
    setRevealedKeyIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    onShowToast('API Key copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName) return;

    const randomSuffix = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
    const newPrefix = `cf_live_${randomSuffix.substring(0, 4)}`;
    const fullKey = `${newPrefix}_${randomSuffix}`;

    const created: ApiKeyItem = {
      id: `key-${Date.now()}`,
      name: newKeyName,
      prefix: newPrefix,
      fullKey: fullKey,
      role: newKeyRole,
      createdDate: 'Just now',
      lastUsedDate: 'Never',
      expiresIn: newKeyExpiry,
      requestsCount: 0
    };

    setApiKeys([created, ...apiKeys]);
    setIsCreateModalOpen(false);
    setNewKeyName('');
    onShowToast(`Created new API key: ${created.name}`);
  };

  const handleRegenerateKey = (id: string) => {
    const randomSuffix = Math.random().toString(36).substring(2, 12) + Math.random().toString(36).substring(2, 8);
    setApiKeys((prev) =>
      prev.map((k) =>
        k.id === id
          ? {
              ...k,
              prefix: `cf_live_${randomSuffix.substring(0, 4)}`,
              fullKey: `cf_live_${randomSuffix.substring(0, 4)}_${randomSuffix}`,
              lastUsedDate: 'Regenerated just now'
            }
          : k
      )
    );
    onShowToast('API Key regenerated successfully');
  };

  const handleDeleteKey = (id: string) => {
    setApiKeys((prev) => prev.filter((k) => k.id !== id));
    onShowToast('API Key revoked');
  };

  // Dynamic code snippets
  const getCodeSnippet = () => {
    const selectedKey = apiKeys[0]?.fullKey || 'cf_live_your_api_key_here';

    switch (activeLang) {
      case 'node':
        return `import { CacheFlowEdge } from '@cacheflow/edge';

// Initialize CacheFlow AI client
const cacheflow = new CacheFlowEdge({
  apiKey: process.env.CACHEFLOW_API_KEY || '${selectedKey}',
  origin: '${customOrigin}',
  defaultTtl: ${defaultTTL}, // ${defaultTTL / 60} minutes
  staleWhileRevalidate: 86400,
});

// Express / Next.js middleware handler
export async function handleRequest(req, res) {
  const cached = await cacheflow.fetch(req.url, {
    method: req.method,
    headers: req.headers,
    cacheKeyTags: ['catalog', 'pricing']
  });

  res.setHeader('cf-cache-status', cached.status);
  return res.status(cached.statusCode).send(cached.body);
}`;

      case 'python':
        return `from cacheflow import CacheFlowClient, CachePolicy

# Initialize CacheFlow Edge client
client = CacheFlowClient(
    api_key="${selectedKey}",
    origin_base="${customOrigin}",
    default_ttl=${defaultTTL}
)

# FastAPI / Flask route handler
@app.get("/api/v2/items")
async def get_items(category: str):
    response = await client.get(
        path=f"/api/v2/items?category={category}",
        policy=CachePolicy.STALE_WHILE_REVALIDATE
    )
    return response.json()`;

      case 'go':
        return `package main

import (
    "fmt"
    "github.com/cacheflow-ai/edge-go/cacheflow"
)

func main() {
    client, err := cacheflow.NewClient(cacheflow.Config{
        ApiKey:    "${selectedKey}",
        OriginURL: "${customOrigin}",
        DefaultTTL: ${defaultTTL},
    })
    if err != nil {
        panic(err)
    }

    res, err := client.Fetch("/v2/catalog", cacheflow.Options{
        Tags: []string{"products"},
    })
    fmt.Printf("Cache Status: %s, Latency: %v\\n", res.Status, res.Latency)
}`;

      case 'rust':
        return `use cacheflow_edge::{Client, Config, CacheMode};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let client = Client::new(Config {
        api_key: "${selectedKey}".to_string(),
        origin: "${customOrigin}".to_string(),
        default_ttl_secs: ${defaultTTL},
        mode: CacheMode::EdgeMemory,
    })?;

    let response = client.get("/api/v2/inventory").await?;
    println!("Status: {:?}, Latency: {}ms", response.cache_status, response.latency_ms);
    Ok(())
}`;

      case 'curl':
        return `# Purge cache tags via CLI
curl -X POST https://api.cacheflow.dev/v1/purge \\
  -H "Authorization: Bearer ${selectedKey}" \\
  -H "Content-Type: application/json" \\
  -d '{"type": "tag", "target": "catalog-winter-2026"}'

# Query cached endpoint directly through Edge POP
curl -i https://edge.cacheflow.dev/${customOrigin.replace('https://', '')}/v2/catalog \\
  -H "cf-api-key: ${selectedKey}"`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            API Keys & Developer SDKs
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage granular edge credentials, access tokens, and integrate CacheFlow client libraries into your backend stack.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#4648d4] hover:bg-[#3b3db8] dark:bg-indigo-600 dark:hover:bg-indigo-500 rounded-lg shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Generate API Key</span>
        </button>
      </div>

      {/* API Key Manager Card */}
      <div className="bg-white dark:bg-[#161b22] rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              Provisioned API Keys
            </h2>
            <p className="text-xs text-slate-500">
              Keys are encrypted at rest with AES-256. Keep secret tokens confidential.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {apiKeys.length} active keys
          </span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
          {apiKeys.map((key) => {
            const isRevealed = revealedKeyIds[key.id] || false;
            const displayToken = isRevealed
              ? key.fullKey
              : `${key.prefix}••••••••••••••••••••••••••`;

            return (
              <div key={key.id} className="p-4 hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-slate-900 dark:text-white">
                        {key.name}
                      </span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                        key.role === 'Admin'
                          ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400 border-purple-200 dark:border-purple-800'
                          : key.role === 'Purge-Only'
                          ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border-rose-200 dark:border-rose-800'
                          : 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border-blue-200 dark:border-blue-800'
                      }`}>
                        {key.role}
                      </span>
                    </div>

                    {/* Masked Key Display */}
                    <div className="flex items-center gap-2 pt-1">
                      <div className="font-mono text-xs px-2.5 py-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md text-slate-700 dark:text-slate-300 select-all max-w-sm sm:max-w-md truncate">
                        {displayToken}
                      </div>

                      <button
                        onClick={() => toggleReveal(key.id)}
                        className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded"
                        title={isRevealed ? 'Hide key' : 'Reveal key'}
                      >
                        {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={() => copyToClipboard(key.fullKey, key.id)}
                        className="p-1 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded"
                        title="Copy key"
                      >
                        {copiedId === key.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Metadata and Actions */}
                  <div className="flex items-center gap-4 text-xs">
                    <div className="text-right text-[11px] text-slate-500">
                      <div>Created: {key.createdDate}</div>
                      <div>Last used: <span className="text-slate-700 dark:text-slate-300 font-medium">{key.lastUsedDate}</span></div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleRegenerateKey(key.id)}
                        className="p-1.5 text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                        title="Regenerate Token"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDeleteKey(key.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                        title="Revoke Key"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Code Integration Studio */}
      <div className="bg-white dark:bg-[#161b22] p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Code className="w-4 h-4 text-[#4648d4]" />
              Edge SDK & Client Code Generator
            </h3>
            <p className="text-xs text-slate-500">
              Drop-in integration snippets configured with your live keys and origin settings.
            </p>
          </div>

          {/* Language selector */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200/60 dark:border-slate-700 text-xs">
            {(
              [
                { id: 'node', label: 'Node / TS' },
                { id: 'python', label: 'Python' },
                { id: 'go', label: 'Go' },
                { id: 'rust', label: 'Rust' },
                { id: 'curl', label: 'cURL' }
              ] as const
            ).map((lang) => (
              <button
                key={lang.id}
                onClick={() => setActiveLang(lang.id)}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  activeLang === lang.id
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic configuration helpers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-slate-900/60 rounded-lg border border-slate-200 dark:border-slate-800 text-xs">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Custom Origin URL
            </label>
            <input
              type="text"
              value={customOrigin}
              onChange={(e) => setCustomOrigin(e.target.value)}
              className="w-full font-mono text-xs px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-800 dark:text-slate-200"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Default Cache TTL (Seconds)
            </label>
            <input
              type="number"
              value={defaultTTL}
              onChange={(e) => setDefaultTTL(Number(e.target.value))}
              className="w-full font-mono text-xs px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-800 dark:text-slate-200"
            />
          </div>
        </div>

        {/* Terminal / Code Editor Display */}
        <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-md">
          <div className="flex items-center justify-between px-4 py-2 bg-slate-900/90 border-b border-slate-800 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              <span className="font-mono text-[11px] ml-2 text-slate-300">
                {activeLang === 'node'
                  ? 'cacheflow.ts'
                  : activeLang === 'python'
                  ? 'client.py'
                  : activeLang === 'go'
                  ? 'main.go'
                  : activeLang === 'rust'
                  ? 'main.rs'
                  : 'terminal.sh'}
              </span>
            </div>

            <button
              onClick={() => copyToClipboard(getCodeSnippet(), 'code-editor')}
              className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded text-[11px] text-slate-300 transition-colors"
            >
              {copiedId === 'code-editor' ? (
                <Check className="w-3 h-3 text-emerald-400" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
              <span>{copiedId === 'code-editor' ? 'Copied' : 'Copy Snippet'}</span>
            </button>
          </div>

          <pre className="p-4 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed">
            <code>{getCodeSnippet()}</code>
          </pre>
        </div>
      </div>

      {/* Create Key Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-[#161b22] rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in duration-150">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Generate API Key
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateKey} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Key Identifier Name
                </label>
                <input
                  type="text"
                  required
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="e.g. Production Webhook Invalidator"
                  className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Permission Scope / Role
                </label>
                <select
                  value={newKeyRole}
                  onChange={(e) => setNewKeyRole(e.target.value as any)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="Admin">Admin (Full Cache Ingestion & Purge)</option>
                  <option value="Purge-Only">Purge-Only (CI/CD Deploy Pipelines)</option>
                  <option value="Telemetry-Read">Telemetry-Read (Observability & Monitoring)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Expiration
                </label>
                <select
                  value={newKeyExpiry}
                  onChange={(e) => setNewKeyExpiry(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="30 days">30 days</option>
                  <option value="90 days">90 days</option>
                  <option value="180 days">180 days</option>
                  <option value="Never">Never (Non-expiring)</option>
                </select>
              </div>

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
                  Generate Key
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
