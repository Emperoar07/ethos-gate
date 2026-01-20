import { useEffect, useState, useCallback } from "react";

export interface EthosData {
  score: number;
  vouches: number;
  reviews: number;
  tier: string;
  loading: boolean;
  error: string | null;
  isRegistered: boolean; // true if wallet has an Ethos profile
}

const API_URL = import.meta.env?.VITE_API_URL || "http://localhost:8000";
const ETHOS_API_BASE = "https://api.ethos.network/api/v2";
const REQUEST_TIMEOUT_MS = 10000; // 10 second timeout

// Fetch with timeout using AbortController
async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs: number = REQUEST_TIMEOUT_MS
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

// LRU Cache for score data - shared across all hook instances
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const CACHE_MAX_SIZE = 500; // Max entries in cache

interface CacheEntry {
  data: EthosData;
  timestamp: number;
}

const scoreCache = new Map<string, CacheEntry>();

// Global map for in-flight requests - prevents duplicate fetches
const inflightRequests = new Map<string, Promise<EthosData>>();

function getCachedScore(address: string): EthosData | null {
  const key = address.toLowerCase();
  const entry = scoreCache.get(key);

  if (!entry) return null;

  // Check if expired
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    scoreCache.delete(key);
    return null;
  }

  // Move to end (most recently used) - LRU behavior
  scoreCache.delete(key);
  scoreCache.set(key, entry);

  return entry.data;
}

function setCachedScore(address: string, data: EthosData): void {
  const key = address.toLowerCase();

  // Delete existing entry to update position
  if (scoreCache.has(key)) {
    scoreCache.delete(key);
  }

  // Evict oldest entries if at capacity
  while (scoreCache.size >= CACHE_MAX_SIZE) {
    const oldestKey = scoreCache.keys().next().value;
    if (oldestKey !== undefined) {
      scoreCache.delete(oldestKey);
    } else {
      break;
    }
  }

  scoreCache.set(key, { data, timestamp: Date.now() });
}

function getTierFromScore(score: number): string {
  if (score >= 1600) return "ELITE";
  if (score >= 1200) return "TRUSTED";
  if (score >= 800) return "ESTABLISHED";
  if (score >= 400) return "BUILDING";
  return "NEW";
}

// Fetch directly from Ethos API (fallback when local API unavailable)
async function fetchScoreFromEthosAPI(address: string): Promise<EthosData> {
  const apiUrl = `${ETHOS_API_BASE}/score/address?address=${address}`;
  console.log("[EthosGate] Fetching score from Ethos API:", apiUrl);

  try {
    const scoreResponse = await fetchWithTimeout(apiUrl, {
      headers: {
        "Accept": "application/json",
        "X-Ethos-Client": "ethos-reputation-gate"
      }
    });

    const responseText = await scoreResponse.text();
    console.log("[EthosGate] API Response status:", scoreResponse.status, "body:", responseText);

    // 404 means wallet is not registered with Ethos
    if (scoreResponse.status === 404) {
      console.log("[EthosGate] Wallet not registered with Ethos");
      return {
        score: 0,
        vouches: 0,
        reviews: 0,
        tier: "UNREGISTERED",
        loading: false,
        error: null,
        isRegistered: false
      };
    }

    if (scoreResponse.ok) {
      try {
        const result = JSON.parse(responseText);
        const score = result.score ?? 0;

        console.log("[EthosGate] Parsed score:", score, "full result:", result);

        // Check if user actually has a profile (score > 0 or explicit registration)
        const isRegistered = score > 0 || result.level !== undefined;

        return {
          score,
          vouches: 0,
          reviews: 0,
          tier: isRegistered ? getTierFromScore(score) : "UNREGISTERED",
          loading: false,
          error: null,
          isRegistered
        };
      } catch (parseErr) {
        console.error("[EthosGate] Failed to parse API response:", parseErr);
      }
    } else {
      console.warn("[EthosGate] API returned error status:", scoreResponse.status);
    }
  } catch (err) {
    const isTimeout = err instanceof Error && err.name === "AbortError";
    console.error("[EthosGate] Failed to fetch score from Ethos API:", isTimeout ? "Request timed out" : err);
  }

  return {
    score: 0,
    vouches: 0,
    reviews: 0,
    tier: "UNREGISTERED",
    loading: false,
    error: "Could not fetch score from Ethos API",
    isRegistered: false
  };
}

// Try local API first, fall back to direct Ethos API
async function fetchScoreFromAPI(address: string): Promise<EthosData> {
  // Try local API first (shorter timeout for local)
  try {
    const response = await fetchWithTimeout(
      `${API_URL}/api/check-access`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address })
      },
      5000 // 5 second timeout for local API
    );

    if (response.ok) {
      const result = await response.json();
      const isRegistered = result.isRegistered ?? (result.score > 0 || result.vouches > 0);
      const data: EthosData = {
        score: result.score || 0,
        vouches: result.vouches || 0,
        reviews: result.reviews || 0,
        tier: isRegistered ? (result.tier || getTierFromScore(result.score || 0)) : "UNREGISTERED",
        loading: false,
        error: null,
        isRegistered
      };
      // If local API returns no data, try Ethos API directly
      if (!isRegistered && data.score === 0) {
        return fetchScoreFromEthosAPI(address);
      }
      return data;
    }
  } catch {
    // Local API unavailable, fall through to Ethos API
  }

  // Fallback: fetch directly from Ethos API
  return fetchScoreFromEthosAPI(address);
}

export function useEthosScore(address?: string): EthosData {
  const [data, setData] = useState<EthosData>(() => {
    // Initialize from cache if available
    if (address) {
      const cached = getCachedScore(address);
      if (cached) {
        return cached;
      }
    }
    return {
      score: 0,
      vouches: 0,
      reviews: 0,
      tier: "UNREGISTERED",
      loading: !!address,
      error: address ? null : "No address provided",
      isRegistered: false
    };
  });

  const fetchScore = useCallback(async (addr: string) => {
    const normalizedAddr = addr.toLowerCase();

    // Check cache first
    const cached = getCachedScore(addr);
    if (cached) {
      setData(cached);
      return;
    }

    // Check if there's already an in-flight request for this address
    const existing = inflightRequests.get(normalizedAddr);
    if (existing) {
      try {
        const result = await existing;
        setData(result);
      } catch (err) {
        setData(prev => ({
          ...prev,
          loading: false,
          error: err instanceof Error ? err.message : "Unknown error"
        }));
      }
      return;
    }

    // Create new request and store in inflight map
    const requestPromise = fetchScoreFromAPI(addr);
    inflightRequests.set(normalizedAddr, requestPromise);

    try {
      const result = await requestPromise;
      setCachedScore(addr, result);
      setData(result);
    } catch (err) {
      const errorData: EthosData = {
        score: 0,
        vouches: 0,
        reviews: 0,
        tier: "UNREGISTERED",
        loading: false,
        error: err instanceof Error ? err.message : "Unknown error",
        isRegistered: false
      };
      setData(errorData);
    } finally {
      // Clean up inflight request
      inflightRequests.delete(normalizedAddr);
    }
  }, []);

  useEffect(() => {
    if (!address) {
      setData({
        score: 0,
        vouches: 0,
        reviews: 0,
        tier: "UNREGISTERED",
        loading: false,
        error: "No address provided",
        isRegistered: false
      });
      return;
    }

    // Check cache immediately
    const cached = getCachedScore(address);
    if (cached) {
      setData(cached);
      return;
    }

    // Set loading state only if not cached
    setData(prev => ({ ...prev, loading: true }));
    fetchScore(address);
  }, [address, fetchScore]);

  return data;
}
