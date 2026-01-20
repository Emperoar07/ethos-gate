export type EthosScore = {
  score?: number;
  level?: string;
};

export type EthosScoreResult = {
  ok: boolean;
  data?: EthosScore;
  error?: string;
};

export const ETHOS_API_BASE = "https://api.ethos.network/api/v2";

export function normalizeUserKey(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return trimmed;

  if (trimmed.includes(":")) {
    return trimmed;
  }

  if (trimmed.startsWith("0x")) {
    return `address:${trimmed}`;
  }

  const handle = trimmed.replace(/^@/, "");
  return `service:x.com:username:${handle}`;
}

export async function fetchEthosScore(
  userKey: string,
  clientId?: string
): Promise<EthosScoreResult> {
  if (!userKey) {
    return { ok: false, error: "Missing user key" };
  }

  const url = `${ETHOS_API_BASE}/score/userkey?userkey=${encodeURIComponent(userKey)}`;
  const headers: Record<string, string> = {
    "X-Ethos-Client": clientId || "ethosgate-demo"
  };

  try {
    const res = await fetch(url, { headers });
    if (!res.ok) {
      return { ok: false, error: `Ethos API error (${res.status})` };
    }

    const data = (await res.json()) as EthosScore;
    return { ok: true, data };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { ok: false, error: message };
  }
}
