import { useEffect, useState, useCallback } from "react";

export interface EthosData {
  score: number;
  vouches: number;
  reviews: number;
  tier: string;
  loading: boolean;
  error: string | null;
}

const API_URL = import.meta.env?.VITE_API_URL || "http://localhost:8000";
const ETHOS_API_BASE = "https://api.ethos.network/api/v2";

// Global cache for score data - shared across all hook instances
const scoreCache = new Map<string, EthosData>();

// Global map for in-flight requests - prevents duplicate fetches
const inflightRequests = new Map<string, Promise<EthosData>>();

// Cache TTL: 5 minutes
const CACHE_TTL = 5 * 60 * 1000;
const cacheTimestamps = new Map<string, number>();

function getCachedScore(address: string): EthosData | null {
  const cached = scoreCache.get(address.toLowerCase());
  const timestamp = cacheTimestamps.get(address.toLowerCase());

  if (cached && timestamp && Date.now() - timestamp < CACHE_TTL) {
    return cached;
  }
  return null;
}

function setCachedScore(address: string, data: EthosData): void {
  scoreCache.set(address.toLowerCase(), data);
  cacheTimestamps.set(address.toLowerCase(), Date.now());
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
  let lastError: Error | null = null;

  try {
    const scoreResponse = await fetch(`${ETHOS_API_BASE}/score/address?address=${address}`, {
      headers: {
        "Accept": "application/json",
        "X-Ethos-Client": "ethos-reputation-gate"
      }
    });

    if (scoreResponse.ok) {
      const result = await scoreResponse.json();
      const score = result.score ?? 0;

      return {
        score,
        vouches: 0,
        reviews: 0,
        tier: getTierFromScore(score),
        loading: false,
        error: null
      };
    }
  } catch (err) {
    lastError = err instanceof Error ? err : new Error("Unknown error");
  }

  // If all endpoints fail, return default with error
  if (lastError) {
    console.warn("[EthosGate] Failed to fetch score from Ethos API:", lastError.message);
  }

  return {
    score: 0,
    vouches: 0,
    reviews: 0,
    tier: "NEW",
    loading: false,
    error: lastError?.message || "Could not fetch score"
  };
}

// Try local API first, fall back to direct Ethos API
async function fetchScoreFromAPI(address: string): Promise<EthosData> {
  // Try local API first
  try {
    const response = await fetch(`${API_URL}/api/check-access`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address })
    });

    if (response.ok) {
      const result = await response.json();
      const data: EthosData = {
        score: result.score || 0,
        vouches: result.vouches || 0,
        reviews: result.reviews || 0,
        tier: result.tier || "NEW",
        loading: false,
        error: null
      };
      if (data.score === 0 && data.vouches === 0 && data.reviews === 0) {
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
      tier: "NEW",
      loading: !!address,
      error: address ? null : "No address provided"
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
        tier: "NEW",
        loading: false,
        error: err instanceof Error ? err.message : "Unknown error"
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
        tier: "NEW",
        loading: false,
        error: "No address provided"
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
