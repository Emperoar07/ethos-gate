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

async function fetchScoreFromAPI(address: string): Promise<EthosData> {
  const response = await fetch(`${API_URL}/api/check-access`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ address })
  });

  if (!response.ok) {
    throw new Error("Failed to fetch Ethos score");
  }

  const result = await response.json();

  return {
    score: result.score || 0,
    vouches: result.vouches || 0,
    reviews: result.reviews || 0,
    tier: result.tier || "NEW",
    loading: false,
    error: null
  };
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
