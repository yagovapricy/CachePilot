export type CacheStatus = 'HIT' | 'MISS' | 'STALE' | 'BYPASS' | 'REVALIDATING';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD';

export interface TelemetryLog {
  id: string;
  timestamp: string;
  method: HttpMethod;
  path: string;
  cacheKey: string;
  status: CacheStatus;
  pop: string;
  popRegion: string;
  latencyMs: number;
  originLatencyMs: number;
  responseSizeBytes: number;
  ttlRemainingSec: number;
  contentType: string;
  swrActive: boolean;
  requestHeaders?: Record<string, string>;
  responseHeaders?: Record<string, string>;
}

export interface CacheRule {
  id: string;
  name: string;
  pathPattern: string;
  tier: 'Edge Memory' | 'NVMe SSD' | 'Tiered Storage';
  ttlSeconds: number;
  staleWhileRevalidateSeconds: number;
  queryParamsPolicy: 'preserve-all' | 'ignore-all' | 'whitelist';
  whitelistParams?: string[];
  bypassCookie?: string;
  enabled: boolean;
  priority: number;
  hitCount: number;
  lastUpdated: string;
}

export interface ApiKeyItem {
  id: string;
  name: string;
  prefix: string;
  fullKey: string;
  role: 'Admin' | 'Purge-Only' | 'Telemetry-Read';
  createdDate: string;
  lastUsedDate: string;
  expiresIn: string;
  requestsCount: number;
}

export interface EdgePopNode {
  id: string;
  code: string;
  city: string;
  country: string;
  region: 'North America' | 'Europe' | 'Asia-Pacific' | 'Latin America';
  status: 'operational' | 'degraded' | 'maintenance';
  p95LatencyMs: number;
  hitRatio: number;
  cachedObjects: number;
  bandwidthServedGbps: number;
  coords: { x: number; y: number }; // percentage on map
}

export interface PurgeHistoryItem {
  id: string;
  timestamp: string;
  type: 'key' | 'tag' | 'prefix' | 'everything';
  target: string;
  propagationTimeMs: number;
  status: 'completed' | 'propagating';
  popsConfirmed: number;
  totalPops: number;
}

export type ActiveTab = 'telemetry' | 'rules' | 'simulator' | 'api-keys' | 'network';
