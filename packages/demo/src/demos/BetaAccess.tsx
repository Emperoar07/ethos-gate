import { useState } from "react";
import { useAccount } from "wagmi";
import { TrustBadge, useEthosScore, EthosGate } from "@ethos/reputation-gate";
import toast from "react-hot-toast";

interface Feature {
  id: string;
  name: string;
  description: string;
  minScore: number;
  status: "live" | "beta" | "alpha" | "coming";
  icon: string;
}

const FEATURES: Feature[] = [
  {
    id: "basic-analytics",
    name: "Basic Analytics",
    description: "View transaction history and basic portfolio stats",
    minScore: 0,
    status: "live",
    icon: "chart"
  },
  {
    id: "advanced-charts",
    name: "Advanced Charts",
    description: "Interactive charts with technical indicators",
    minScore: 700,
    status: "live",
    icon: "trending"
  },
  {
    id: "ai-insights",
    name: "AI Market Insights",
    description: "AI-powered market analysis and predictions",
    minScore: 1200,
    status: "beta",
    icon: "brain"
  },
  {
    id: "auto-trading",
    name: "Auto-Trading Bot",
    description: "Automated trading strategies with risk controls",
    minScore: 1400,
    status: "beta",
    icon: "robot"
  },
  {
    id: "whale-alerts",
    name: "Whale Movement Alerts",
    description: "Real-time notifications for large transactions",
    minScore: 1600,
    status: "alpha",
    icon: "bell"
  },
  {
    id: "api-access",
    name: "Developer API",
    description: "Full API access for custom integrations",
    minScore: 1800,
    status: "alpha",
    icon: "code"
  },
];

const STATUS_COLORS = {
  live: { bg: "bg-green-100", text: "text-green-700", label: "Live" },
  beta: { bg: "bg-blue-100", text: "text-blue-700", label: "Beta" },
  alpha: { bg: "bg-purple-100", text: "text-purple-700", label: "Alpha" },
  coming: { bg: "bg-gray-100", text: "text-gray-500", label: "Coming Soon" },
};

export function BetaAccessDemo() {
  const { address } = useAccount();
  const { score } = useEthosScore(address);
  const [joinedFeatures, setJoinedFeatures] = useState<Set<string>>(new Set());

  const unlockedCount = FEATURES.filter((f) => score >= f.minScore).length;
  const betaCount = FEATURES.filter((f) => f.status === "beta" || f.status === "alpha").length;

  const handleJoinBeta = (feature: Feature) => {
    setJoinedFeatures((prev) => new Set([...prev, feature.id]));
    toast.success(`Joined ${feature.name} beta program!`);
  };

  const getFeatureIcon = (icon: string) => {
    const icons: Record<string, string> = {
      chart: "~",
      trending: "^",
      brain: "*",
      robot: "@",
      bell: "!",
      code: "</>",
    };
    return icons[icon] || "?";
  };

  return (
    <div className="glass-card rounded-3xl p-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-sm font-semibold text-purple-700">EARLY ACCESS</span>
        <div>
          <h2 className="text-2xl font-bold">Beta Features</h2>
          <p className="text-gray-600">Reputation-gated early access</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="glass-pill rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{unlockedCount}/{FEATURES.length}</div>
          <div className="text-xs text-gray-600">Unlocked</div>
        </div>
        <div className="glass-pill rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{betaCount}</div>
          <div className="text-xs text-gray-600">Beta Features</div>
        </div>
        <div className="glass-pill rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-emerald-600">{joinedFeatures.size}</div>
          <div className="text-xs text-gray-600">Joined</div>
        </div>
      </div>

      {address && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-700">Your Access Level:</span>
            <TrustBadge score={score} showScore />
          </div>
        </div>
      )}

      {/* Feature List */}
      <div className="glass-card rounded-2xl p-6 mb-6">
        <h3 className="font-semibold mb-4">Feature Access</h3>
        <div className="space-y-3">
          {FEATURES.map((feature) => {
            const isUnlocked = score >= feature.minScore;
            const hasJoined = joinedFeatures.has(feature.id);
            const statusStyle = STATUS_COLORS[feature.status];

            return (
              <div
                key={feature.id}
                className={`glass-pill rounded-xl p-4 transition-all ${
                  !isUnlocked ? "opacity-50" : ""
                } ${hasJoined ? "border-2 border-purple-500/30" : ""}`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg font-mono ${
                    isUnlocked ? "bg-purple-100 text-purple-600" : "bg-gray-100 text-gray-400"
                  }`}>
                    {getFeatureIcon(feature.icon)}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">{feature.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${statusStyle.bg} ${statusStyle.text}`}>
                        {statusStyle.label}
                      </span>
                      {hasJoined && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                          Joined
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{feature.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Min Score: {feature.minScore}</span>

                      {isUnlocked ? (
                        feature.status === "live" ? (
                          <button
                            onClick={() => toast.success(`Launched ${feature.name}!`)}
                            className="text-xs px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors"
                          >
                            Launch
                          </button>
                        ) : hasJoined ? (
                          <button
                            onClick={() => toast.success(`Accessing ${feature.name} beta...`)}
                            className="text-xs px-3 py-1 rounded-full bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors"
                          >
                            Access Beta
                          </button>
                        ) : (
                          <button
                            onClick={() => handleJoinBeta(feature)}
                            className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                          >
                            Join {statusStyle.label}
                          </button>
                        )
                      ) : (
                        <span className="text-xs text-gray-400">
                          +{feature.minScore - score} points needed
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Exclusive Alpha Section */}
      <div className="glass-card rounded-2xl p-6 mb-6 border border-purple-200/50">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">*</span>
          <h3 className="font-semibold">Exclusive: AI Trading Copilot</h3>
          <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">Alpha</span>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Our most advanced feature yet. AI-powered trading assistant that analyzes markets,
          suggests trades, and executes strategies automatically. Only for our most trusted users.
        </p>

        <EthosGate
          minScore={1800}
          fallback={
            <div className="glass-pill rounded-xl p-4 text-center">
              <p className="text-sm text-gray-600 mb-2">
                Requires <span className="font-semibold text-purple-600">ELITE</span> tier (1800+ score)
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-500 h-2 rounded-full transition-all"
                  style={{ width: `${Math.min(100, (score / 1800) * 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">{score}/1800 points</p>
            </div>
          }
        >
          <button
            onClick={() => toast.success("Welcome to the AI Trading Copilot alpha!")}
            className="w-full glass-cta rounded-xl py-4 font-semibold text-slate-900 hover:scale-[1.02] transition-all"
          >
            Access AI Trading Copilot
          </button>
        </EthosGate>
      </div>

      {/* Benefits */}
      <div className="glass-pill rounded-xl p-4">
        <h4 className="font-semibold text-sm mb-3">Why Reputation-Gated Beta?</h4>
        <div className="grid grid-cols-2 gap-3 text-xs text-gray-600">
          <div className="flex items-start gap-2">
            <span className="text-emerald-500 mt-0.5">OK</span>
            <span>Quality feedback from engaged users</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-emerald-500 mt-0.5">OK</span>
            <span>Reduced spam and abuse</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-emerald-500 mt-0.5">OK</span>
            <span>Reward loyal community members</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-emerald-500 mt-0.5">OK</span>
            <span>Build trust incrementally</span>
          </div>
        </div>
      </div>
    </div>
  );
}
