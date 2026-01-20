import React, { useState, useEffect } from "react";
import type { CSSProperties } from "react";
import { useEthosScore } from "../hooks/useEthosScore";
import { getTrustTier } from "../utils/tiers";

interface VerificationFlowProps {
  address?: string;
  onComplete?: (passed: boolean, score: number) => void;
  minScore?: number;
  autoStart?: boolean;
}

const injectKeyframes = () => {
  if (typeof document !== "undefined") {
    const styleId = "ethos-verification-keyframes";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        @keyframes ethos-scale-in {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes ethos-particle {
          0% { transform: translate(-50%, -50%) rotate(var(--angle)) translateY(0) scale(1); opacity: 1; }
          100% { transform: translate(-50%, -50%) rotate(var(--angle)) translateY(-80px) scale(0); opacity: 0; }
        }
        @keyframes ethos-spin-slow {
          to { transform: rotate(360deg); }
        }
        @keyframes ethos-pulse-ring {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
      `;
      document.head.appendChild(style);
    }
  }
};

export function VerificationFlow({
  address,
  onComplete,
  minScore = 700,
  autoStart = true
}: VerificationFlowProps) {
  const { score, loading } = useEthosScore(address);
  const [stage, setStage] = useState<"idle" | "checking" | "analyzing" | "complete">(
    autoStart ? "checking" : "idle"
  );
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    injectKeyframes();
  }, []);

  useEffect(() => {
    if (!loading && score !== undefined && stage === "checking") {
      const timer1 = setTimeout(() => {
        setStage("analyzing");
        setProgress(50);
      }, 800);

      const timer2 = setTimeout(() => {
        setStage("complete");
        setProgress(100);
        onComplete?.(score >= minScore, score);
      }, 1600);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [loading, score, minScore, onComplete, stage]);

  const tier = getTrustTier(score);
  const passed = score >= minScore;

  const containerStyle: CSSProperties = {
    position: "relative",
    width: "100%",
    maxWidth: "400px",
    margin: "0 auto",
    padding: "32px",
    background: "linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.9) 100%)",
    backdropFilter: "blur(20px)",
    borderRadius: "24px",
    border: "1px solid rgba(255,255,255,0.6)",
    boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
  };

  const circleContainerStyle: CSSProperties = {
    position: "relative",
    width: "192px",
    height: "192px",
    margin: "0 auto 24px",
  };

  const circumference = 2 * Math.PI * 88;

  return (
    <div style={containerStyle}>
      <div style={circleContainerStyle}>
        {/* Background glow */}
        <div
          style={{
            position: "absolute",
            inset: "-20px",
            borderRadius: "50%",
            background: passed && stage === "complete"
              ? "radial-gradient(circle, rgba(16,185,129,0.2) 0%, transparent 70%)"
              : stage === "complete"
              ? "radial-gradient(circle, rgba(239,68,68,0.2) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)",
            animation: stage !== "complete" ? "ethos-pulse-ring 2s ease-in-out infinite" : undefined,
          }}
        />

        {/* SVG Ring */}
        <svg
          width="192"
          height="192"
          style={{ position: "absolute", inset: 0, transform: "rotate(-90deg)" }}
        >
          <circle
            cx="96"
            cy="96"
            r="88"
            stroke="rgba(0,0,0,0.06)"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx="96"
            cy="96"
            r="88"
            stroke={
              stage === "complete"
                ? passed
                  ? "#10B981"
                  : "#EF4444"
                : "#3B82F6"
            }
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - progress / 100)}
            style={{ transition: "stroke-dashoffset 0.8s ease-out, stroke 0.3s ease" }}
          />
        </svg>

        {/* Spinning indicator */}
        {stage !== "complete" && stage !== "idle" && (
          <div
            style={{
              position: "absolute",
              inset: "8px",
              borderRadius: "50%",
              border: "3px solid transparent",
              borderTopColor: "#3B82F6",
              animation: "ethos-spin-slow 1.5s linear infinite",
            }}
          />
        )}

        {/* Center content */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {stage === "idle" && (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "48px", marginBottom: "8px" }}>{"\uD83D\uDD12"}</div>
              <p style={{ fontSize: "14px", color: "#64748B" }}>Ready to verify</p>
            </div>
          )}

          {stage === "checking" && (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "48px", marginBottom: "8px" }}>{"\uD83D\uDD0D"}</div>
              <p style={{ fontSize: "14px", color: "#64748B" }}>Checking reputation...</p>
            </div>
          )}

          {stage === "analyzing" && (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "48px", marginBottom: "8px" }}>{"\u26A1"}</div>
              <p style={{ fontSize: "14px", color: "#64748B" }}>Analyzing score...</p>
            </div>
          )}

          {stage === "complete" && (
            <div
              style={{
                textAlign: "center",
                animation: "ethos-scale-in 0.5s ease-out",
              }}
            >
              <div style={{ fontSize: "56px", marginBottom: "8px" }}>{tier.emoji}</div>
              <div
                style={{
                  fontSize: "36px",
                  fontWeight: 700,
                  color: passed ? "#059669" : "#DC2626",
                  marginBottom: "4px",
                }}
              >
                {score}
              </div>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: passed ? "#10B981" : "#EF4444",
                }}
              >
                {passed ? "\u2713 Verified" : "\u2717 Below Threshold"}
              </div>
            </div>
          )}
        </div>

        {/* Success particles */}
        {stage === "complete" && passed && (
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  width: "8px",
                  height: "8px",
                  background: "#10B981",
                  borderRadius: "50%",
                  top: "50%",
                  left: "50%",
                  animation: "ethos-particle 1.5s ease-out forwards",
                  animationDelay: `${i * 0.1}s`,
                  ["--angle" as string]: `${i * 60}deg`,
                } as CSSProperties}
              />
            ))}
          </div>
        )}
      </div>

      {/* Status message */}
      {stage === "complete" && (
        <div
          style={{
            padding: "16px",
            borderRadius: "12px",
            background: passed
              ? "linear-gradient(145deg, rgba(236,253,245,0.9) 0%, rgba(209,250,229,0.7) 100%)"
              : "linear-gradient(145deg, rgba(254,242,242,0.9) 0%, rgba(254,226,226,0.7) 100%)",
            border: `1px solid ${passed ? "rgba(134,239,172,0.5)" : "rgba(252,165,165,0.5)"}`,
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontWeight: 600,
              color: passed ? "#047857" : "#B91C1C",
              margin: 0,
            }}
          >
            {passed
              ? `${tier.name} tier - Access granted!`
              : `Score ${score} is below required ${minScore}`}
          </p>
        </div>
      )}
    </div>
  );
}
