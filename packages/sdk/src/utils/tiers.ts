export type TrustTier = "ELITE" | "TRUSTED" | "EMERGING" | "NEW";

export interface TierInfo {
  name: TrustTier;
  minScore: number;
  emoji: string;
  color: string;
  description: string;
}

export const TRUST_TIERS: TierInfo[] = [
  {
    name: "ELITE",
    minScore: 1600,
    emoji: "\u2B50",
    color: "#FFD700",
    description: "Top 5% of Ethos users"
  },
  {
    name: "TRUSTED",
    minScore: 1200,
    emoji: "\u2705",
    color: "#3B82F6",
    description: "Established community member"
  },
  {
    name: "EMERGING",
    minScore: 700,
    emoji: "\uD83C\uDF31",
    color: "#10B981",
    description: "Growing reputation"
  },
  {
    name: "NEW",
    minScore: 0,
    emoji: "\uD83D\uDC64",
    color: "#6B7280",
    description: "New to Ethos - build your reputation"
  }
];

export function getTrustTier(score: number): TierInfo {
  for (const tier of TRUST_TIERS) {
    if (score >= tier.minScore) {
      return tier;
    }
  }

  return TRUST_TIERS[TRUST_TIERS.length - 1];
}

export function getTierColor(tier: TrustTier): string {
  return TRUST_TIERS.find((candidate) => candidate.name === tier)?.color || "#6B7280";
}
