import React, { useState, useEffect } from "react";
import type { CSSProperties } from "react";
import { useEthosScore } from "../hooks/useEthosScore";
import { getTrustTier } from "../utils/tiers";

interface DiscountCalculatorProps {
  basePrice: number;
  address?: string;
  showBreakdown?: boolean;
  currency?: string;
}

const injectKeyframes = () => {
  if (typeof document !== "undefined") {
    const styleId = "ethos-discount-keyframes";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        @keyframes ethos-pulse-badge {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes ethos-shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
      `;
      document.head.appendChild(style);
    }
  }
};

export function DiscountCalculator({
  basePrice,
  address,
  showBreakdown = true,
  currency = "$"
}: DiscountCalculatorProps) {
  const { score } = useEthosScore(address);
  const tier = getTrustTier(score);
  const [animatedDiscount, setAnimatedDiscount] = useState(0);
  const [showSavings, setShowSavings] = useState(false);

  useEffect(() => {
    injectKeyframes();
  }, []);

  // Calculate discount based on tier
  const discountPercent =
    tier.name === "ELITE" ? 30 :
    tier.name === "TRUSTED" ? 20 :
    tier.name === "EMERGING" ? 10 : 0;

  const discountAmount = (basePrice * discountPercent) / 100;
  const finalPrice = basePrice - discountAmount;

  // Animate discount reveal
  useEffect(() => {
    let current = 0;
    const increment = discountPercent / 20;
    const timer = setInterval(() => {
      current += increment;
      if (current >= discountPercent) {
        setAnimatedDiscount(discountPercent);
        clearInterval(timer);
        setTimeout(() => setShowSavings(true), 300);
      } else {
        setAnimatedDiscount(Math.floor(current));
      }
    }, 50);

    return () => clearInterval(timer);
  }, [discountPercent]);

  const containerStyle: CSSProperties = {
    background: "linear-gradient(135deg, rgba(239,246,255,0.95) 0%, rgba(245,243,255,0.95) 100%)",
    backdropFilter: "blur(16px)",
    borderRadius: "20px",
    padding: "24px",
    border: "2px solid rgba(59,130,246,0.2)",
    boxShadow: "0 12px 40px rgba(59,130,246,0.1)",
  };

  return (
    <div style={containerStyle}>
      {/* Discount Badge */}
      {discountPercent > 0 && (
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
          <div
            style={{
              background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
              color: "white",
              padding: "10px 24px",
              borderRadius: "100px",
              fontWeight: 700,
              fontSize: "18px",
              boxShadow: "0 8px 24px rgba(16,185,129,0.4)",
              animation: "ethos-pulse-badge 2s ease-in-out infinite",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span>{"\uD83C\uDF89"}</span>
            <span>{Math.round(animatedDiscount)}% OFF</span>
          </div>
        </div>
      )}

      {/* Price Breakdown */}
      <div style={{ marginBottom: "20px" }}>
        {/* Original Price */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "12px",
          }}
        >
          <span style={{ color: "#64748B" }}>Base Price:</span>
          <span
            style={{
              fontWeight: 600,
              color: discountPercent > 0 ? "#94A3B8" : "#1E293B",
              textDecoration: discountPercent > 0 ? "line-through" : "none",
              fontSize: "18px",
            }}
          >
            {currency}{basePrice.toFixed(2)}
          </span>
        </div>

        {/* Discount Line */}
        {discountPercent > 0 && (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "12px",
                color: "#059669",
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "20px" }}>{tier.emoji}</span>
                <span>{tier.name} Discount:</span>
              </span>
              <span style={{ fontWeight: 700, fontSize: "18px" }}>
                -{currency}{discountAmount.toFixed(2)}
              </span>
            </div>

            {/* Divider */}
            <div
              style={{
                height: "2px",
                background: "repeating-linear-gradient(90deg, #CBD5E1 0, #CBD5E1 8px, transparent 8px, transparent 16px)",
                margin: "16px 0",
              }}
            />

            {/* Final Price */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: "20px", fontWeight: 700, color: "#1E293B" }}>You Pay:</span>
              <span
                style={{
                  fontSize: "28px",
                  fontWeight: 700,
                  color: "#2563EB",
                }}
              >
                {currency}{finalPrice.toFixed(2)}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Visual Savings Bar */}
      {showBreakdown && discountPercent > 0 && showSavings && (
        <div
          style={{
            marginTop: "20px",
            opacity: showSavings ? 1 : 0,
            transform: showSavings ? "translateY(0)" : "translateY(10px)",
            transition: "all 0.5s ease",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "13px",
              marginBottom: "8px",
            }}
          >
            <span style={{ color: "#64748B" }}>Your Savings:</span>
            <span style={{ fontWeight: 700, color: "#059669" }}>
              {currency}{discountAmount.toFixed(2)}
            </span>
          </div>

          <div
            style={{
              height: "12px",
              background: "#E2E8F0",
              borderRadius: "6px",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(90deg, #10B981 0%, #34D399 50%, #10B981 100%)",
                backgroundSize: "200% 100%",
                width: `${animatedDiscount}%`,
                transition: "width 1s ease-out",
                borderRadius: "6px",
                animation: "ethos-shimmer 2s linear infinite",
              }}
            />
            <div
              style={{
                position: "absolute",
                right: "8px",
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: "10px",
                fontWeight: 700,
                color: animatedDiscount > 50 ? "white" : "#059669",
              }}
            >
              {Math.round(animatedDiscount)}%
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "10px",
              color: "#94A3B8",
              marginTop: "4px",
            }}
          >
            <span>0% off</span>
            <span>30% off (max)</span>
          </div>
        </div>
      )}

      {/* Tier Info */}
      <div
        style={{
          marginTop: "20px",
          padding: "12px",
          background: "rgba(255,255,255,0.7)",
          borderRadius: "12px",
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: "12px", color: "#64748B", margin: 0 }}>
          {discountPercent === 0
            ? `Build your reputation to unlock discounts! Next tier at 700 score.`
            : tier.name === "ELITE"
            ? `${"\u2B50"} Maximum discount unlocked!`
            : `Level up to ${getNextTierName(tier.name)} for ${getNextTierDiscount(discountPercent)}% discount!`}
        </p>
      </div>
    </div>
  );
}

function getNextTierName(currentTier: string): string {
  if (currentTier === "NEW") return "EMERGING";
  if (currentTier === "EMERGING") return "TRUSTED";
  if (currentTier === "TRUSTED") return "ELITE";
  return "ELITE";
}

function getNextTierDiscount(currentDiscount: number): number {
  if (currentDiscount === 0) return 10;
  if (currentDiscount === 10) return 20;
  if (currentDiscount === 20) return 30;
  return 30;
}
