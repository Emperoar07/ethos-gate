import { useMemo } from "react";

import { getTrustTier, TierInfo } from "../utils/tiers";
import { useEthosScore } from "./useEthosScore";

export function useTrustTier(address?: string): TierInfo & { loading: boolean } {
  const { score, loading } = useEthosScore(address);
  const tier = useMemo(() => getTrustTier(score), [score]);

  return { ...tier, loading };
}
