export { EthosGate } from "./components/EthosGate";
export { PayButton } from "./components/PayButton";
export { TrustBadge } from "./components/TrustBadge";
export { AccessDenied } from "./components/AccessDenied";
export { EthosProvider, useEthosConfig } from "./components/EthosProvider";

// Animated & Interactive Components
export { VerificationFlow } from "./components/VerificationFlow";
export { ScoreComparison } from "./components/ScoreComparison";
export { PaymentProgress } from "./components/PaymentProgress";
export { DiscountCalculator } from "./components/DiscountCalculator";
export { ActivityFeed } from "./components/ActivityFeed";

export { useEthosScore } from "./hooks/useEthosScore";
export { useEthosAccessToken } from "./hooks/useEthosAccessToken";
export { usePayment } from "./hooks/usePayment";
export { useTrustTier } from "./hooks/useTrustTier";

export { getTrustTier, getTierColor, TRUST_TIERS } from "./utils/tiers";
export { SCORE_PRESETS, getPreset, listPresets } from "./utils/presets";
export { calculateRequiredScore, getRecommendedRequirements, suggestTier } from "./utils/scoreCalculator";

export type { TrustTier, TierInfo } from "./utils/tiers";
export type { PresetName, UseCaseName, ScoreRequirement } from "./utils/presets";
export type { RiskFactors } from "./utils/scoreCalculator";
export type { EthosGateProps } from "./components/EthosGate";
export type { EthosConfigContextType } from "./components/EthosProvider";
export type { PayButtonProps } from "./components/PayButton";
export type { EthosData } from "./hooks/useEthosScore";
export type { AccessTokenData } from "./hooks/useEthosAccessToken";
export type { PaymentOptions } from "./hooks/usePayment";
