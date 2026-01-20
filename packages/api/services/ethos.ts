import { Cache } from "./cache.ts";

const ETHOS_API_BASE = "https://api.ethos.network/api/v2";
const CLIENT_ID = "ethos-reputation-gate";

interface EthosScore {
  score: number;
}

interface EthosProfile {
  id: number;
  vouchCount: number;
  reviewCount: number;
  positiveReviewCount: number;
  negativeReviewCount: number;
}

const scoreCache = new Cache<number>(5);
const profileCache = new Cache<EthosProfile>(5);

export async function getEthosScore(address: string): Promise<number> {
  const cached = scoreCache.get(address);
  // Mask address for privacy in logs
  const maskedAddr = `${address.slice(0, 6)}...${address.slice(-4)}`;

  if (cached !== null) {
    console.log(`[Cache Hit] Score for ${maskedAddr}: ${cached}`);
    return cached;
  }

  try {
    // Use URLSearchParams for safe URL encoding
    const params = new URLSearchParams({ address });
    const response = await fetch(`${ETHOS_API_BASE}/score/address?${params}`, {
      headers: {
        "X-Ethos-Client": CLIENT_ID
      }
    });

    if (!response.ok) {
      console.error(`Ethos API error: ${response.status}`);
      return 0;
    }

    const data: EthosScore = await response.json();
    const score = data.score || 0;

    scoreCache.set(address, score);
    console.log(`[API Fetch] Score for ${maskedAddr}: ${score}`);

    return score;
  } catch (error) {
    console.error("Error fetching Ethos score:", error);
    return 0;
  }
}

export async function getEthosProfile(address: string): Promise<EthosProfile | null> {
  const cached = profileCache.get(address);
  // Mask address for privacy in logs
  const maskedAddr = `${address.slice(0, 6)}...${address.slice(-4)}`;

  if (cached) {
    console.log(`[Cache Hit] Profile for ${maskedAddr}`);
    return cached;
  }

  try {
    // URL encode the address for safe path construction
    const encodedAddress = encodeURIComponent(address);
    const response = await fetch(`${ETHOS_API_BASE}/user/by/address/${encodedAddress}`, {
      headers: {
        "X-Ethos-Client": CLIENT_ID
      }
    });

    if (!response.ok) {
      console.error(`Ethos API error: ${response.status}`);
      return null;
    }

    const profile: EthosProfile = await response.json();

    profileCache.set(address, profile);
    console.log(`[API Fetch] Profile for ${maskedAddr}`);

    return profile;
  } catch (error) {
    console.error("Error fetching Ethos profile:", error);
    return null;
  }
}

export function getTier(score: number): string {
  if (score >= 1600) return "ELITE";
  if (score >= 1200) return "TRUSTED";
  if (score >= 700) return "EMERGING";
  return "NEW";
}

setInterval(() => {
  scoreCache.cleanup();
  profileCache.cleanup();
  console.log(
    `[Cache Cleanup] Score cache: ${scoreCache.size()} entries, Profile cache: ${profileCache.size()} entries`
  );
}, 10 * 60 * 1000);
