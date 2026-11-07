import React, { useState, useEffect } from 'react';
import { ActiveTab, TelemetryLog, CacheRule, ApiKeyItem, PurgeHistoryItem } from './types';
import {
  INITIAL_LOGS,
  INITIAL_RULES,
  INITIAL_API_KEYS,
  EDGE_POP_NODES,
  INITIAL_PURGE_HISTORY,
  generateRandomTelemetry
} from './mockData';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { TelemetryDashboard } from './components/TelemetryDashboard';
import { RulesEngine } from './components/RulesEngine';
import { QuerySimulator } from './components/QuerySimulator';
import { ApiKeysView } from './components/ApiKeysView';
import { EdgeNetworkView } from './components/EdgeNetworkView';
import { CommandPalette } from './components/CommandPalette';
import { InstantPurgeModal } from './components/InstantPurgeModal';
import { Toast } from './components/Toast';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('telemetry');
  const [environment, setEnvironment] = useState<string>('production');
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Core Data States
  const [logs, setLogs] = useState<TelemetryLog[]>(INITIAL_LOGS);
  const [rules, setRules] = useState<CacheRule[]>(INITIAL_RULES);
  const [apiKeys, setApiKeys] = useState<ApiKeyItem[]>(INITIAL_API_KEYS);
  const [purgeHistory, setPurgeHistory] = useState<PurgeHistoryItem[]>(INITIAL_PURGE_HISTORY);

  // Runtime interaction states
  const [isStreaming, setIsStreaming] = useState<boolean>(true);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isInstantPurgeOpen, setIsInstantPurgeOpen] = useState<boolean>(false);
  const [isPurging, setIsPurging] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync dark mode class on document element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Real-time telemetry ingestion simulator
  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      const newEntry = generateRandomTelemetry();
      setLogs((prev) => [newEntry, ...prev.slice(0, 49)]);
    }, 2800);

    return () => clearInterval(interval);
  }, [isStreaming]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3200);
  };

  const handleTriggerPurge = (type: 'key' | 'tag' | 'prefix' | 'everything', target: string) => {
    setIsPurging(true);

    setTimeout(() => {
      const propagationMs = Math.floor(Math.random() * 15 + 28);
      const newPurge: PurgeHistoryItem = {
        id: `purge-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        type,
        target,
        propagationTimeMs: propagationMs,
        status: 'completed',
        popsConfirmed: 42,
        totalPops: 42
      };

      setPurgeHistory((prev) => [newPurge, ...prev]);
      setIsPurging(false);
      setIsInstantPurgeOpen(false);
      showToast(`Purge propagated to 42 POPs in ${propagationMs}ms (${target})`);
    }, 600);
  };

  const handleInjectBurst = () => {
    const burst = [
      generateRandomTelemetry(),
      generateRandomTelemetry(),
      generateRandomTelemetry(),
      generateRandomTelemetry()
    ];
    setLogs((prev) => [...burst, ...prev.slice(0, 46)]);
    showToast('Injected 4 live edge cache events');
  };

  const handlePurgeSingleKey = (key: string) => {
    handleTriggerPurge('key', key);
  };

  const currentHitRatio =
    logs.length > 0
      ? (logs.filter((l) => l.status === 'HIT').length / logs.length) * 100
      : 94.8;

  return (
    <div className="min-h-screen bg-[#f7f9fb] dark:bg-[#090d13] text-[#191c1e] dark:text-[#f0f6fc] flex flex-col font-sans transition-colors duration-200">
      {/* Top Bar adheres to strict 3-zone Top Bar Contract */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        environment={environment}
        setEnvironment={setEnvironment}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenInstantPurge={() => setIsInstantPurgeOpen(true)}
        isStreaming={isStreaming}
        totalRequests={logs.length}
      />

      {/* Main Workspace: Sidebar + Viewport */}
      <div className="flex-1 flex overflow-hidden">
        {/* Developer Console Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isStreaming={isStreaming}
          setIsStreaming={setIsStreaming}
          onOpenInstantPurge={() => setIsInstantPurgeOpen(true)}
          hitRatio={currentHitRatio}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {activeTab === 'telemetry' && (
            <TelemetryDashboard
              logs={logs}
              isStreaming={isStreaming}
              setIsStreaming={setIsStreaming}
              onInjectBurst={handleInjectBurst}
              onPurgeKey={handlePurgeSingleKey}
              environment={environment}
            />
          )}

          {activeTab === 'rules' && (
            <RulesEngine
              rules={rules}
              setRules={setRules}
              purgeHistory={purgeHistory}
              onTriggerPurge={handleTriggerPurge}
              isPurging={isPurging}
            />
          )}

          {activeTab === 'simulator' && <QuerySimulator />}

          {activeTab === 'network' && <EdgeNetworkView nodes={EDGE_POP_NODES} />}

          {activeTab === 'api-keys' && (
            <ApiKeysView
              apiKeys={apiKeys}
              setApiKeys={setApiKeys}
              onShowToast={showToast}
            />
          )}
        </main>
      </div>

      {/* Global Modals and Overlays */}
      <CommandPalette
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        setActiveTab={setActiveTab}
        onOpenInstantPurge={() => {
          setIsSearchOpen(false);
          setIsInstantPurgeOpen(true);
        }}
      />

      <InstantPurgeModal
        isOpen={isInstantPurgeOpen}
        onClose={() => setIsInstantPurgeOpen(false)}
        onExecutePurge={handleTriggerPurge}
        isPurging={isPurging}
      />

      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}
