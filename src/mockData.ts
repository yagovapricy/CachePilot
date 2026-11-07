import { TelemetryLog, CacheRule, ApiKeyItem, EdgePopNode, PurgeHistoryItem } from './types';

export const INITIAL_LOGS: TelemetryLog[] = [
  {
    id: 'log-10921',
    timestamp: '14:02:18.421',
    method: 'GET',
    path: '/api/v2/catalog/items?category=sensors&sort=rating',
    cacheKey: 'cf_sha256:7f8b91a24d018c',
    status: 'HIT',
    pop: 'IAD-01',
    popRegion: 'Ashburn, VA',
    latencyMs: 6.4,
    originLatencyMs: 242.0,
    responseSizeBytes: 42100,
    ttlRemainingSec: 2840,
    contentType: 'application/json; charset=utf-8',
    swrActive: false,
    requestHeaders: {
      'host': 'api.cacheflow-client.dev',
      'user-agent': 'CacheFlow-Client/2.4.0',
      'accept-encoding': 'gzip, br',
      'cf-ray': '89a1f492b109-iad'
    },
    responseHeaders: {
      'cache-control': 'public, max-age=3600, stale-while-revalidate=86400',
      'cf-cache-status': 'HIT',
      'cf-edge-cache': 'tier-1-memory',
      'x-cacheflow-latency-savings': '235.6ms'
    }
  },
  {
    id: 'log-10920',
    timestamp: '14:02:17.892',
    method: 'GET',
    path: '/api/v2/pricing/tiers?org=enterprise&currency=usd',
    cacheKey: 'cf_sha256:3a1b90c74f51e2',
    status: 'HIT',
    pop: 'FRA-02',
    popRegion: 'Frankfurt, DE',
    latencyMs: 9.1,
    originLatencyMs: 310.5,
    responseSizeBytes: 12450,
    ttlRemainingSec: 1420,
    contentType: 'application/json',
    swrActive: false,
    requestHeaders: {
      'host': 'api.cacheflow-client.dev',
      'cf-ray': '89a1f491c482-fra'
    },
    responseHeaders: {
      'cache-control': 'public, max-age=1800',
      'cf-cache-status': 'HIT'
    }
  },
  {
    id: 'log-10919',
    timestamp: '14:02:17.104',
    method: 'POST',
    path: '/graphql?query={query+ProductMetrics}',
    cacheKey: 'cf_sha256:9c8d7e6f5a4b3c',
    status: 'MISS',
    pop: 'SJC-01',
    popRegion: 'San Jose, CA',
    latencyMs: 218.4,
    originLatencyMs: 214.0,
    responseSizeBytes: 6420,
    ttlRemainingSec: 3600,
    contentType: 'application/json',
    swrActive: false,
    requestHeaders: {
      'host': 'api.cacheflow-client.dev',
      'content-type': 'application/json'
    },
    responseHeaders: {
      'cf-cache-status': 'MISS',
      'cf-cached-on-origin': 'true'
    }
  },
  {
    id: 'log-10918',
    timestamp: '14:02:16.540',
    method: 'GET',
    path: '/api/v1/auth/session/token/validate',
    cacheKey: 'cf_sha256:1a2b3c4d5e6f7a',
    status: 'BYPASS',
    pop: 'LHR-01',
    popRegion: 'London, UK',
    latencyMs: 148.0,
    originLatencyMs: 145.2,
    responseSizeBytes: 1820,
    ttlRemainingSec: 0,
    contentType: 'application/json',
    swrActive: false,
    requestHeaders: {
      'authorization': 'Bearer cf_live_***',
      'cookie': 'session_token=valid'
    },
    responseHeaders: {
      'cf-cache-status': 'BYPASS',
      'cf-bypass-reason': 'Authorization-Header-Present'
    }
  },
  {
    id: 'log-10917',
    timestamp: '14:02:15.912',
    method: 'GET',
    path: '/api/v2/telemetry/feed?device=cluster-alpha&metric=cpu',
    cacheKey: 'cf_sha256:5d4c3b2a1e0f99',
    status: 'REVALIDATING',
    pop: 'NRT-01',
    popRegion: 'Tokyo, JP',
    latencyMs: 14.2,
    originLatencyMs: 285.0,
    responseSizeBytes: 32180,
    ttlRemainingSec: 0,
    contentType: 'application/json',
    swrActive: true,
    requestHeaders: {
      'host': 'api.cacheflow-client.dev'
    },
    responseHeaders: {
      'cf-cache-status': 'STALE-WHILE-REVALIDATING',
      'cf-async-origin-fetch': 'in-flight'
    }
  },
  {
    id: 'log-10916',
    timestamp: '14:02:14.330',
    method: 'GET',
    path: '/api/v2/catalog/items?category=optics',
    cacheKey: 'cf_sha256:4b5c6d7e8f9a01',
    status: 'HIT',
    pop: 'IAD-01',
    popRegion: 'Ashburn, VA',
    latencyMs: 7.1,
    originLatencyMs: 238.0,
    responseSizeBytes: 38400,
    ttlRemainingSec: 2190,
    contentType: 'application/json',
    swrActive: false
  },
  {
    id: 'log-10915',
    timestamp: '14:02:13.722',
    method: 'GET',
    path: '/v1/models/weights/metadata.json',
    cacheKey: 'cf_sha256:88192ab47c9102',
    status: 'HIT',
    pop: 'SIN-01',
    popRegion: 'Singapore, SG',
    latencyMs: 11.3,
    originLatencyMs: 340.0,
    responseSizeBytes: 98400,
    ttlRemainingSec: 86100,
    contentType: 'application/json',
    swrActive: false
  },
  {
    id: 'log-10914',
    timestamp: '14:02:12.805',
    method: 'GET',
    path: '/api/v2/analytics/summary?period=realtime',
    cacheKey: 'cf_sha256:091a2b3c4d5e6f',
    status: 'STALE',
    pop: 'DFW-01',
    popRegion: 'Dallas, TX',
    latencyMs: 12.0,
    originLatencyMs: 198.0,
    responseSizeBytes: 14300,
    ttlRemainingSec: -12,
    contentType: 'application/json',
    swrActive: true
  }
];

export const INITIAL_RULES: CacheRule[] = [
  {
    id: 'rule-1',
    name: 'Static Assets & JSON Schemas',
    pathPattern: '/static/*, *.json, /assets/**',
    tier: 'Tiered Storage',
    ttlSeconds: 604800, // 7 days
    staleWhileRevalidateSeconds: 2592000,
    queryParamsPolicy: 'ignore-all',
    enabled: true,
    priority: 1,
    hitCount: 4892019,
    lastUpdated: '2 hours ago'
  },
  {
    id: 'rule-2',
    name: 'Product Catalog & Public Read APIs',
    pathPattern: '/api/v2/catalog/*',
    tier: 'Edge Memory',
    ttlSeconds: 3600,
    staleWhileRevalidateSeconds: 86400,
    queryParamsPolicy: 'whitelist',
    whitelistParams: ['category', 'sort', 'page', 'currency'],
    enabled: true,
    priority: 2,
    hitCount: 1284902,
    lastUpdated: '1 day ago'
  },
  {
    id: 'rule-3',
    name: 'GraphQL Query Smart Hash',
    pathPattern: '/graphql*',
    tier: 'NVMe SSD',
    ttlSeconds: 1800,
    staleWhileRevalidateSeconds: 7200,
    queryParamsPolicy: 'preserve-all',
    bypassCookie: 'admin_session,auth_preview',
    enabled: true,
    priority: 3,
    hitCount: 842100,
    lastUpdated: '3 days ago'
  },
  {
    id: 'rule-4',
    name: 'Authenticated Session Endpoints',
    pathPattern: '/api/*/auth/*, /api/*/account/*',
    tier: 'Edge Memory',
    ttlSeconds: 0,
    staleWhileRevalidateSeconds: 0,
    queryParamsPolicy: 'preserve-all',
    bypassCookie: '*',
    enabled: true,
    priority: 4,
    hitCount: 310500,
    lastUpdated: '5 days ago'
  }
];

export const INITIAL_API_KEYS: ApiKeyItem[] = [
  {
    id: 'key-1',
    name: 'Production Edge Ingestion & Purge',
    prefix: 'cf_live_9f8a',
    fullKey: 'cf_live_9f8a27b819c4d0e5f2a1b9c8d7e6',
    role: 'Admin',
    createdDate: 'Oct 12, 2026',
    lastUsedDate: 'Just now',
    expiresIn: 'Never',
    requestsCount: 42189020
  },
  {
    id: 'key-2',
    name: 'CI/CD Deploy Webhook Purger',
    prefix: 'cf_live_3c2d',
    fullKey: 'cf_live_3c2d5e6f7a8b9c0d1e2f3a4b5c6d',
    role: 'Purge-Only',
    createdDate: 'Nov 01, 2026',
    lastUsedDate: '42 mins ago',
    expiresIn: '90 days',
    requestsCount: 18490
  },
  {
    id: 'key-3',
    name: 'Datadog & Grafana Telemetry Exporter',
    prefix: 'cf_live_7a1b',
    fullKey: 'cf_live_7a1b4c3d2e1f0a9b8c7d6e5f4a3b',
    role: 'Telemetry-Read',
    createdDate: 'Nov 04, 2026',
    lastUsedDate: '2 mins ago',
    expiresIn: '180 days',
    requestsCount: 194820
  }
];

export const EDGE_POP_NODES: EdgePopNode[] = [
  {
    id: 'pop-iad',
    code: 'IAD-01',
    city: 'Ashburn (DC)',
    country: 'United States',
    region: 'North America',
    status: 'operational',
    p95LatencyMs: 7.2,
    hitRatio: 96.8,
    cachedObjects: 14200000,
    bandwidthServedGbps: 42.8,
    coords: { x: 26, y: 34 }
  },
  {
    id: 'pop-sjc',
    code: 'SJC-01',
    city: 'San Jose (Silicon Valley)',
    country: 'United States',
    region: 'North America',
    status: 'operational',
    p95LatencyMs: 6.8,
    hitRatio: 97.4,
    cachedObjects: 18900000,
    bandwidthServedGbps: 58.2,
    coords: { x: 18, y: 36 }
  },
  {
    id: 'pop-dfw',
    code: 'DFW-01',
    city: 'Dallas',
    country: 'United States',
    region: 'North America',
    status: 'operational',
    p95LatencyMs: 8.4,
    hitRatio: 94.2,
    cachedObjects: 8400000,
    bandwidthServedGbps: 24.1,
    coords: { x: 22, y: 40 }
  },
  {
    id: 'pop-lhr',
    code: 'LHR-01',
    city: 'London',
    country: 'United Kingdom',
    region: 'Europe',
    status: 'operational',
    p95LatencyMs: 8.1,
    hitRatio: 95.9,
    cachedObjects: 12100000,
    bandwidthServedGbps: 38.6,
    coords: { x: 48, y: 26 }
  },
  {
    id: 'pop-fra',
    code: 'FRA-02',
    city: 'Frankfurt',
    country: 'Germany',
    region: 'Europe',
    status: 'operational',
    p95LatencyMs: 9.3,
    hitRatio: 96.2,
    cachedObjects: 15400000,
    bandwidthServedGbps: 44.9,
    coords: { x: 52, y: 28 }
  },
  {
    id: 'pop-ams',
    code: 'AMS-01',
    city: 'Amsterdam',
    country: 'Netherlands',
    region: 'Europe',
    status: 'operational',
    p95LatencyMs: 8.7,
    hitRatio: 95.1,
    cachedObjects: 9200000,
    bandwidthServedGbps: 29.4,
    coords: { x: 50, y: 25 }
  },
  {
    id: 'pop-nrt',
    code: 'NRT-01',
    city: 'Tokyo',
    country: 'Japan',
    region: 'Asia-Pacific',
    status: 'operational',
    p95LatencyMs: 10.8,
    hitRatio: 94.6,
    cachedObjects: 11800000,
    bandwidthServedGbps: 36.1,
    coords: { x: 84, y: 38 }
  },
  {
    id: 'pop-sin',
    code: 'SIN-01',
    city: 'Singapore',
    country: 'Singapore',
    region: 'Asia-Pacific',
    status: 'operational',
    p95LatencyMs: 12.1,
    hitRatio: 93.8,
    cachedObjects: 9800000,
    bandwidthServedGbps: 31.0,
    coords: { x: 76, y: 56 }
  },
  {
    id: 'pop-syd',
    code: 'SYD-01',
    city: 'Sydney',
    country: 'Australia',
    region: 'Asia-Pacific',
    status: 'operational',
    p95LatencyMs: 14.5,
    hitRatio: 92.4,
    cachedObjects: 6400000,
    bandwidthServedGbps: 18.7,
    coords: { x: 88, y: 78 }
  },
  {
    id: 'pop-gru',
    code: 'GRU-01',
    city: 'São Paulo',
    country: 'Brazil',
    region: 'Latin America',
    status: 'operational',
    p95LatencyMs: 15.2,
    hitRatio: 91.5,
    cachedObjects: 5200000,
    bandwidthServedGbps: 14.3,
    coords: { x: 34, y: 72 }
  }
];

export const INITIAL_PURGE_HISTORY: PurgeHistoryItem[] = [
  {
    id: 'purge-991',
    timestamp: '13:58:20',
    type: 'tag',
    target: 'tag:catalog-winter-2026',
    propagationTimeMs: 38,
    status: 'completed',
    popsConfirmed: 42,
    totalPops: 42
  },
  {
    id: 'purge-990',
    timestamp: '12:30:14',
    type: 'key',
    target: 'cf_sha256:7f8b91a24d018c',
    propagationTimeMs: 29,
    status: 'completed',
    popsConfirmed: 42,
    totalPops: 42
  },
  {
    id: 'purge-989',
    timestamp: '09:14:02',
    type: 'prefix',
    target: '/api/v2/pricing/*',
    propagationTimeMs: 44,
    status: 'completed',
    popsConfirmed: 42,
    totalPops: 42
  }
];

export function generateRandomTelemetry(): TelemetryLog {
  const paths = [
    { path: '/api/v2/catalog/items?category=hardware', method: 'GET' as const, size: 45200 },
    { path: '/api/v2/products/sku-9921', method: 'GET' as const, size: 8400 },
    { path: '/api/v2/pricing/tiers?tier=enterprise', method: 'GET' as const, size: 14200 },
    { path: '/api/v1/auth/session/token/validate', method: 'GET' as const, size: 1900 },
    { path: '/graphql?query={UserFeed}', method: 'POST' as const, size: 18400 },
    { path: '/v1/models/embeddings/cache.bin', method: 'GET' as const, size: 124000 },
    { path: '/api/v2/telemetry/feed?device=cluster-beta', method: 'GET' as const, size: 28400 }
  ];

  const statuses: { status: TelemetryLog['status']; weight: number }[] = [
    { status: 'HIT', weight: 75 },
    { status: 'MISS', weight: 12 },
    { status: 'REVALIDATING', weight: 8 },
    { status: 'BYPASS', weight: 3 },
    { status: 'STALE', weight: 2 }
  ];

  // Pick status based on weight
  const rand = Math.random() * 100;
  let cum = 0;
  let chosenStatus: TelemetryLog['status'] = 'HIT';
  for (const s of statuses) {
    cum += s.weight;
    if (rand <= cum) {
      chosenStatus = s.status;
      break;
    }
  }

  const sample = paths[Math.floor(Math.random() * paths.length)];
  const pops = EDGE_POP_NODES;
  const chosenPop = pops[Math.floor(Math.random() * pops.length)];
  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}.${String(Math.floor(Math.random() * 900 + 100))}`;

  const originLat = Math.floor(Math.random() * 160 + 180);
  const latency = chosenStatus === 'HIT' 
    ? Math.round((Math.random() * 6 + 4) * 10) / 10 
    : chosenStatus === 'MISS' 
      ? originLat + Math.round(Math.random() * 10) 
      : Math.round((Math.random() * 12 + 6) * 10) / 10;

  const hexHash = Math.random().toString(16).substring(2, 16);

  return {
    id: `log-${Math.floor(Math.random() * 90000 + 10000)}`,
    timestamp: timeStr,
    method: sample.method,
    path: sample.path,
    cacheKey: `cf_sha256:${hexHash}`,
    status: chosenStatus,
    pop: chosenPop.code,
    popRegion: chosenPop.city,
    latencyMs: latency,
    originLatencyMs: originLat,
    responseSizeBytes: sample.size + Math.floor(Math.random() * 800 - 400),
    ttlRemainingSec: chosenStatus === 'HIT' ? Math.floor(Math.random() * 3000 + 600) : 0,
    contentType: 'application/json',
    swrActive: chosenStatus === 'REVALIDATING' || chosenStatus === 'STALE',
    requestHeaders: {
      'host': 'api.cacheflow-client.dev',
      'user-agent': 'CacheFlow-Client/2.4.0',
      'cf-ray': `${hexHash.substring(0, 8)}-${chosenPop.code.toLowerCase()}`
    },
    responseHeaders: {
      'cache-control': 'public, max-age=3600, stale-while-revalidate=86400',
      'cf-cache-status': chosenStatus,
      'cf-pop': chosenPop.code
    }
  };
}
