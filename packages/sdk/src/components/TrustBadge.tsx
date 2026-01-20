import React from "react";
import type { CSSProperties } from "react";

import { getTrustTier } from "../utils/tiers";

interface TrustBadgeProps {
  score: number;
  showScore?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizeStyles: Record<string, CSSProperties> = {
  sm: { padding: "5px 12px", fontSize: "12px", gap: "5px" },
  md: { padding: "7px 16px", fontSize: "14px", gap: "6px" },
  lg: { padding: "9px 20px", fontSize: "16px", gap: "8px" }
};

// Light, airy tier colors
const tierColors: Record<string, { bg: string; border: string; text: string }> = {
  "#10b981": { // ELITE - emerald
    bg: "linear-gradient(145deg, rgba(236,253,245,0.95) 0%, rgba(209,250,229,0.7) 100%)",
    border: "rgba(134,239,172,0.5)",
    text: "#059669"
  },
  "#3b82f6": { // TRUSTED - blue
    bg: "linear-gradient(145deg, rgba(239,246,255,0.95) 0%, rgba(219,234,254,0.7) 100%)",
    border: "rgba(147,197,253,0.5)",
    text: "#2563eb"
  },
  "#f59e0b": { // EMERGING - amber
    bg: "linear-gradient(145deg, rgba(255,251,235,0.95) 0%, rgba(254,243,199,0.7) 100%)",
    border: "rgba(252,211,77,0.5)",
    text: "#d97706"
  },
  "#6b7280": { // NEW - gray
    bg: "linear-gradient(145deg, rgba(249,250,251,0.95) 0%, rgba(243,244,246,0.7) 100%)",
    border: "rgba(209,213,219,0.5)",
    text: "#4b5563"
  }
};

export function TrustBadge({ score, showScore = true, size = "md" }: TrustBadgeProps) {
  const tier = getTrustTier(score);
  const dims = sizeStyles[size];
  const colors = tierColors[tier.color] || tierColors["#6b7280"];

  const glassStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: dims.gap,
    padding: dims.padding,
    fontSize: dims.fontSize,
    fontWeight: 600,
    letterSpacing: "-0.01em",
    borderRadius: "100px",
    background: colors.bg,
    backdropFilter: "blur(12px) saturate(180%)",
    WebkitBackdropFilter: "blur(12px) saturate(180%)",
    border: `1px solid ${colors.border}`,
    boxShadow: `
      0 4px 12px rgba(0,0,0,0.04),
      inset 0 1px 0 rgba(255,255,255,0.8)
    `,
    color: colors.text,
    transition: "all 0.2s ease",
  };

  return (
    <div style={glassStyle}>
      <span style={{ fontSize: `calc(${dims.fontSize} * 1.1)` }}>{tier.emoji}</span>
      <span>{tier.name}</span>
      {showScore && (
        <span style={{
          opacity: 0.7,
          fontWeight: 500,
          marginLeft: "2px"
        }}>
          ({score})
        </span>
      )}
    </div>
  );
}
