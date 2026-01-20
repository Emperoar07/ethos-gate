import React, { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { useEthosScore } from "../hooks/useEthosScore";
import { getTrustTier } from "../utils/tiers";

interface ScoreComparisonProps {
  address?: string;
  minScore?: number;
  showNextTier?: boolean;
}

export function ScoreComparison({
  address,
  minScore = 1000,
  showNextTier = true
}: ScoreComparisonProps) {
  const { score } = useEthosScore(address);
  const tier = getTrustTier(score);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timer);
  }, [score]);

  const avgScore = 1150;
  const difference = score - avgScore;
  const percentile = Math.min(95, Math.floor((score / 2000) * 100));

  const containerStyle: CSSProperties = {
    background: "linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.9) 100%)",
    backdropFilter: "blur(16px)",
    borderRadius: "20px",
    padding: "24px",
    border: "1px solid rgba(255,255,255,0.6)",
    boxShadow: "0 12px 40px rgba(0,0,0,0.08)",
  };

  const barMaxHeight = 160;

  return (
    <div style={containerStyle}>
      <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
        <span>{"\uD83D\uDCCA"}</span>
        <span>Your Reputation Ranking</span>
      </h3>

      {/* Bar Chart */}
      <div style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: "16px", marginBottom: "8px", height: `${barMaxHeight + 30}px` }}>
          {/* User Score Bar */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ fontSize: "11px", color: "#64748B", marginBottom: "6px" }}>Your Score</div>
            <div
              style={{
                width: "100%",
                background: "linear-gradient(180deg, #60a5fa 0%, #3b82f6 100%)",
                borderRadius: "8px 8px 0 0",
                height: animated ? `${(score / 2000) * barMaxHeight}px` : "0px",
                minHeight: "40px",
                transition: "height 1s ease-out",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-end",
                padding: "8px",
                boxShadow: "0 4px 12px rgba(59,130,246,0.3)",
              }}
            >
              <span style={{ fontSize: "20px" }}>{tier.emoji}</span>
              <span style={{ color: "white", fontWeight: 700, fontSize: "16px" }}>{score}</span>
            </div>
          </div>

          {/* Average Bar */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ fontSize: "11px", color: "#64748B", marginBottom: "6px" }}>Network Avg</div>
            <div
              style={{
                width: "100%",
                background: "linear-gradient(180deg, #9ca3af 0%, #6b7280 100%)",
                borderRadius: "8px 8px 0 0",
                height: animated ? `${(avgScore / 2000) * barMaxHeight}px` : "0px",
                transition: "height 1s ease-out 0.2s",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-end",
                padding: "8px",
              }}
            >
              <span style={{ fontSize: "18px" }}>{"\uD83D\uDCCA"}</span>
              <span style={{ color: "white", fontWeight: 700, fontSize: "14px" }}>{avgScore}</span>
            </div>
          </div>

          {/* Required Bar */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ fontSize: "11px", color: "#64748B", marginBottom: "6px" }}>Required</div>
            <div
              style={{
                width: "100%",
                background: "linear-gradient(180deg, #a78bfa 0%, #8b5cf6 100%)",
                borderRadius: "8px 8px 0 0",
                height: animated ? `${(minScore / 2000) * barMaxHeight}px` : "0px",
                transition: "height 1s ease-out 0.4s",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-end",
                padding: "8px",
              }}
            >
              <span style={{ fontSize: "18px" }}>{"\uD83C\uDFAF"}</span>
              <span style={{ color: "white", fontWeight: 700, fontSize: "14px" }}>{minScore}</span>
            </div>
          </div>
        </div>

        {/* Baseline */}
        <div style={{ height: "4px", background: "#E2E8F0", borderRadius: "2px" }} />
      </div>

      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
        <div style={{ background: "linear-gradient(145deg, rgba(239,246,255,0.9) 0%, rgba(219,234,254,0.7) 100%)", borderRadius: "12px", padding: "12px" }}>
          <div style={{ fontSize: "11px", color: "#64748B", marginBottom: "4px" }}>vs. Average</div>
          <div style={{ fontSize: "24px", fontWeight: 700, color: difference >= 0 ? "#059669" : "#DC2626" }}>
            {difference >= 0 ? "+" : ""}{difference}
          </div>
        </div>

        <div style={{ background: "linear-gradient(145deg, rgba(245,243,255,0.9) 0%, rgba(237,233,254,0.7) 100%)", borderRadius: "12px", padding: "12px" }}>
          <div style={{ fontSize: "11px", color: "#64748B", marginBottom: "4px" }}>Percentile</div>
          <div style={{ fontSize: "24px", fontWeight: 700, color: "#7C3AED" }}>
            Top {100 - percentile}%
          </div>
        </div>
      </div>

      {/* Progress to Next Tier */}
      {showNextTier && tier.name !== "ELITE" && (
        <div style={{ background: "linear-gradient(90deg, rgba(239,246,255,0.8) 0%, rgba(245,243,255,0.8) 100%)", borderRadius: "12px", padding: "12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "8px" }}>
            <span style={{ fontWeight: 600 }}>Next: {getNextTier(score)}</span>
            <span style={{ color: "#64748B" }}>{Math.max(0, getNextTierScore(score) - score)} pts away</span>
          </div>
          <div style={{ height: "8px", background: "rgba(0,0,0,0.06)", borderRadius: "4px", overflow: "hidden" }}>
            <div
              style={{
                height: "100%",
                background: "linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)",
                borderRadius: "4px",
                width: animated ? `${getProgressToNextTier(score)}%` : "0%",
                transition: "width 1s ease-out 0.6s",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function getNextTier(score: number): string {
  if (score < 700) return "EMERGING";
  if (score < 1200) return "TRUSTED";
  if (score < 1600) return "ELITE";
  return "ELITE";
}

function getNextTierScore(score: number): number {
  if (score < 700) return 700;
  if (score < 1200) return 1200;
  if (score < 1600) return 1600;
  return 1600;
}

function getProgressToNextTier(score: number): number {
  if (score < 700) return (score / 700) * 100;
  if (score < 1200) return ((score - 700) / 500) * 100;
  if (score < 1600) return ((score - 1200) / 400) * 100;
  return 100;
}
