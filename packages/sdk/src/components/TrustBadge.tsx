import React, { useEffect, useState } from "react";
import type { CSSProperties } from "react";

import { getTrustTier } from "../utils/tiers";
import { injectCommonKeyframes } from "../utils/animations";

interface TrustBadgeProps {
  score: number;
  showScore?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "badge" | "card";
}

const sizeConfig = {
  sm: { padding: "5px 12px", fontSize: "12px", gap: "5px", ringSize: 40, strokeWidth: 3 },
  md: { padding: "7px 16px", fontSize: "14px", gap: "6px", ringSize: 56, strokeWidth: 4 },
  lg: { padding: "9px 20px", fontSize: "16px", gap: "8px", ringSize: 72, strokeWidth: 5 }
};

// Tier color configurations
const tierStyles: Record<string, { gradient: string; bg: string; border: string; text: string; glow: string }> = {
  ELITE: {
    gradient: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)",
    bg: "linear-gradient(145deg, rgba(255,251,235,0.95) 0%, rgba(254,243,199,0.8) 100%)",
    border: "rgba(251,191,36,0.4)",
    text: "#b45309",
    glow: "rgba(251,191,36,0.3)"
  },
  TRUSTED: {
    gradient: "linear-gradient(135deg, #60a5fa 0%, #3b82f6 50%, #2563eb 100%)",
    bg: "linear-gradient(145deg, rgba(239,246,255,0.95) 0%, rgba(219,234,254,0.8) 100%)",
    border: "rgba(59,130,246,0.3)",
    text: "#1d4ed8",
    glow: "rgba(59,130,246,0.25)"
  },
  EMERGING: {
    gradient: "linear-gradient(135deg, #34d399 0%, #10b981 50%, #059669 100%)",
    bg: "linear-gradient(145deg, rgba(236,253,245,0.95) 0%, rgba(209,250,229,0.8) 100%)",
    border: "rgba(16,185,129,0.3)",
    text: "#047857",
    glow: "rgba(16,185,129,0.25)"
  },
  NEW: {
    gradient: "linear-gradient(135deg, #9ca3af 0%, #6b7280 50%, #4b5563 100%)",
    bg: "linear-gradient(145deg, rgba(249,250,251,0.95) 0%, rgba(243,244,246,0.8) 100%)",
    border: "rgba(107,114,128,0.3)",
    text: "#374151",
    glow: "rgba(107,114,128,0.15)"
  }
};

export function TrustBadge({ score, showScore = true, size = "md", variant = "badge" }: TrustBadgeProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const tier = getTrustTier(score);
  const config = sizeConfig[size];
  const colors = tierStyles[tier.name] || tierStyles.NEW;

  // Animate score counting
  useEffect(() => {
    injectCommonKeyframes();
    if (score === 0) {
      setAnimatedScore(0);
      return;
    }

    const duration = 1000;
    const steps = 30;
    const increment = score / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= score) {
        setAnimatedScore(score);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [score]);

  // Calculate ring progress (max score ~2000)
  const maxScore = 2000;
  const progress = Math.min(score / maxScore, 1);
  const circumference = 2 * Math.PI * (config.ringSize / 2 - config.strokeWidth);
  const strokeDashoffset = circumference * (1 - progress);

  if (variant === "card") {
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "16px",
        padding: "16px 20px",
        background: colors.bg,
        backdropFilter: "blur(16px) saturate(180%)",
        WebkitBackdropFilter: "blur(16px) saturate(180%)",
        border: `1px solid ${colors.border}`,
        borderRadius: "20px",
        boxShadow: `0 8px 32px ${colors.glow}, inset 0 1px 0 rgba(255,255,255,0.7)`,
      }}>
        {/* Score Ring */}
        <div style={{ position: "relative", width: config.ringSize, height: config.ringSize }}>
          <svg
            width={config.ringSize}
            height={config.ringSize}
            style={{ transform: "rotate(-90deg)" }}
          >
            {/* Background ring */}
            <circle
              cx={config.ringSize / 2}
              cy={config.ringSize / 2}
              r={config.ringSize / 2 - config.strokeWidth}
              fill="none"
              stroke="rgba(0,0,0,0.06)"
              strokeWidth={config.strokeWidth}
            />
            {/* Progress ring with gradient */}
            <defs>
              <linearGradient id={`ring-gradient-${tier.name}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={tier.name === "ELITE" ? "#fbbf24" : tier.name === "TRUSTED" ? "#60a5fa" : tier.name === "EMERGING" ? "#34d399" : "#9ca3af"} />
                <stop offset="100%" stopColor={tier.name === "ELITE" ? "#d97706" : tier.name === "TRUSTED" ? "#2563eb" : tier.name === "EMERGING" ? "#059669" : "#4b5563"} />
              </linearGradient>
            </defs>
            <circle
              cx={config.ringSize / 2}
              cy={config.ringSize / 2}
              r={config.ringSize / 2 - config.strokeWidth}
              fill="none"
              stroke={`url(#ring-gradient-${tier.name})`}
              strokeWidth={config.strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{ transition: "stroke-dashoffset 1s ease-out" }}
            />
          </svg>
          {/* Center score */}
          <div style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: size === "lg" ? "18px" : size === "md" ? "14px" : "11px",
            fontWeight: 700,
            color: colors.text,
            animation: "ethos-score-count 0.6s ease-out"
          }}>
            {animatedScore}
          </div>
        </div>

        {/* Info */}
        <div style={{ flex: 1 }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            marginBottom: "4px"
          }}>
            <span style={{ fontSize: size === "lg" ? "20px" : "16px" }}>{tier.emoji}</span>
            <span style={{
              fontSize: size === "lg" ? "18px" : "15px",
              fontWeight: 700,
              color: colors.text,
              letterSpacing: "-0.02em"
            }}>
              {tier.name}
            </span>
          </div>
          <div style={{
            fontSize: size === "lg" ? "13px" : "11px",
            color: "rgba(0,0,0,0.5)",
            fontWeight: 500
          }}>
            {tier.description}
          </div>
        </div>
      </div>
    );
  }

  // Badge variant (default)
  const badgeStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: config.gap,
    padding: config.padding,
    fontSize: config.fontSize,
    fontWeight: 600,
    letterSpacing: "-0.01em",
    borderRadius: "100px",
    background: colors.bg,
    backdropFilter: "blur(12px) saturate(180%)",
    WebkitBackdropFilter: "blur(12px) saturate(180%)",
    border: `1px solid ${colors.border}`,
    boxShadow: `0 4px 16px ${colors.glow}, inset 0 1px 0 rgba(255,255,255,0.8)`,
    color: colors.text,
    transition: "all 0.2s ease",
  };

  return (
    <div style={badgeStyle}>
      <span style={{
        fontSize: `calc(${config.fontSize} * 1.2)`,
        filter: tier.name === "ELITE" ? "drop-shadow(0 0 4px rgba(251,191,36,0.5))" : "none"
      }}>
        {tier.emoji}
      </span>
      <span style={{ fontWeight: 700 }}>{tier.name}</span>
      {showScore && (
        <span style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          minWidth: "36px",
          padding: "2px 8px",
          fontSize: `calc(${config.fontSize} * 0.85)`,
          fontWeight: 700,
          background: "rgba(255,255,255,0.6)",
          borderRadius: "20px",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.9)",
          color: colors.text
        }}>
          {animatedScore}
        </span>
      )}
    </div>
  );
}
