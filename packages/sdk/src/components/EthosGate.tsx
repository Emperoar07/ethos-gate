import React from "react";
import type { ReactNode, CSSProperties } from "react";
import { useAccount } from "wagmi";

import { useEthosScore } from "../hooks/useEthosScore";
import type { EthosData } from "../hooks/useEthosScore";
import { getPreset } from "../utils/presets";
import type { PresetName, UseCaseName } from "../utils/presets";
import { useEthosConfig } from "./EthosProvider";

export interface EthosGateProps {
  preset?: PresetName | UseCaseName;
  minScore?: number;
  minVouches?: number;
  minReviews?: number;
  children: ReactNode;
  fallback?: ReactNode;
  loadingComponent?: ReactNode;
  showRequirements?: boolean;
  showDescription?: boolean;
  scoreData?: EthosData;
}

// Apple Liquid Glass Design - Light Airy Windows 11 Bloom Style
const glassStyles = {
  // Base glass panel - soft frosted white
  panel: {
    background: "linear-gradient(145deg, rgba(255,255,255,0.75) 0%, rgba(240,247,255,0.55) 100%)",
    backdropFilter: "blur(24px) saturate(180%)",
    WebkitBackdropFilter: "blur(24px) saturate(180%)",
    borderRadius: "20px",
    border: "1px solid rgba(255,255,255,0.6)",
    boxShadow: `
      0 8px 32px rgba(100,149,237,0.12),
      0 2px 8px rgba(0,0,0,0.04),
      inset 0 1px 0 rgba(255,255,255,0.8)
    `,
    padding: "24px",
  } as CSSProperties,

  // Disconnected state - soft neutral
  disconnected: {
    background: "linear-gradient(145deg, rgba(255,255,255,0.7) 0%, rgba(248,250,252,0.5) 100%)",
    backdropFilter: "blur(24px) saturate(180%)",
    WebkitBackdropFilter: "blur(24px) saturate(180%)",
    borderRadius: "20px",
    border: "1px solid rgba(255,255,255,0.5)",
    boxShadow: `
      0 8px 32px rgba(100,116,139,0.08),
      0 2px 8px rgba(0,0,0,0.03),
      inset 0 1px 0 rgba(255,255,255,0.7)
    `,
    padding: "24px",
    textAlign: "center" as const,
  } as CSSProperties,

  // Loading state - soft sky blue
  loading: {
    background: "linear-gradient(145deg, rgba(224,242,254,0.8) 0%, rgba(186,230,253,0.5) 100%)",
    backdropFilter: "blur(24px) saturate(180%)",
    WebkitBackdropFilter: "blur(24px) saturate(180%)",
    borderRadius: "20px",
    border: "1px solid rgba(147,197,253,0.4)",
    boxShadow: `
      0 8px 32px rgba(59,130,246,0.1),
      0 2px 8px rgba(0,0,0,0.03),
      inset 0 1px 0 rgba(255,255,255,0.8)
    `,
    padding: "24px",
    textAlign: "center" as const,
  } as CSSProperties,

  // Restricted state - soft rose/coral
  restricted: {
    background: "linear-gradient(145deg, rgba(254,242,242,0.85) 0%, rgba(254,226,226,0.6) 100%)",
    backdropFilter: "blur(24px) saturate(180%)",
    WebkitBackdropFilter: "blur(24px) saturate(180%)",
    borderRadius: "20px",
    border: "1px solid rgba(252,165,165,0.35)",
    boxShadow: `
      0 8px 32px rgba(239,68,68,0.08),
      0 2px 8px rgba(0,0,0,0.03),
      inset 0 1px 0 rgba(255,255,255,0.7)
    `,
    padding: "24px",
  } as CSSProperties,

  // Success state - soft mint/emerald
  success: {
    background: "linear-gradient(145deg, rgba(236,253,245,0.85) 0%, rgba(209,250,229,0.6) 100%)",
    backdropFilter: "blur(24px) saturate(180%)",
    WebkitBackdropFilter: "blur(24px) saturate(180%)",
    borderRadius: "20px",
    border: "1px solid rgba(134,239,172,0.4)",
    boxShadow: `
      0 8px 32px rgba(34,197,94,0.1),
      0 2px 8px rgba(0,0,0,0.03),
      inset 0 1px 0 rgba(255,255,255,0.8)
    `,
    padding: "16px 20px",
    marginBottom: "16px",
  } as CSSProperties,

  // Inner card - clean white glass
  innerCard: {
    background: "linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.7) 100%)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    borderRadius: "16px",
    border: "1px solid rgba(255,255,255,0.7)",
    boxShadow: `
      0 4px 16px rgba(0,0,0,0.04),
      inset 0 1px 0 rgba(255,255,255,0.9)
    `,
    padding: "16px",
    marginBottom: "16px",
  } as CSSProperties,

  // Info card - soft sky blue tint
  infoCard: {
    background: "linear-gradient(145deg, rgba(240,249,255,0.9) 0%, rgba(224,242,254,0.6) 100%)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    borderRadius: "16px",
    border: "1px solid rgba(186,230,253,0.5)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.7)",
    padding: "16px",
    marginBottom: "16px",
  } as CSSProperties,

  // Text styles
  title: {
    fontSize: "18px",
    fontWeight: 600,
    color: "#1e293b",
    margin: 0,
    letterSpacing: "-0.02em",
  } as CSSProperties,

  subtitle: {
    fontSize: "14px",
    color: "#64748b",
    margin: "4px 0 0 0",
    fontWeight: 400,
  } as CSSProperties,

  label: {
    fontSize: "13px",
    fontWeight: 500,
    color: "#64748b",
    letterSpacing: "0.02em",
  } as CSSProperties,

  value: {
    fontSize: "14px",
    fontWeight: 600,
    letterSpacing: "-0.01em",
  } as CSSProperties,

  link: {
    fontSize: "14px",
    fontWeight: 500,
    color: "#3b82f6",
    textDecoration: "none",
    transition: "opacity 0.2s ease",
  } as CSSProperties,

  // Spinner animation
  spinner: {
    width: "32px",
    height: "32px",
    border: "3px solid rgba(59,130,246,0.2)",
    borderTopColor: "#3b82f6",
    borderRadius: "50%",
    animation: "ethosgate-spin 0.8s linear infinite",
    margin: "0 auto 12px auto",
  } as CSSProperties,
};

// Inject keyframes for spinner animation
const injectKeyframes = () => {
  if (typeof document !== "undefined") {
    const styleId = "ethosgate-keyframes";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        @keyframes ethosgate-spin {
          to { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(style);
    }
  }
};

export function EthosGate({
  preset,
  minScore,
  minVouches,
  minReviews,
  children,
  fallback,
  loadingComponent,
  showRequirements = false,
  showDescription = true,
  scoreData: externalScoreData
}: EthosGateProps) {
  const { address, isConnected } = useAccount();
  const config = useEthosConfig();

  // Inject animation keyframes
  React.useEffect(() => {
    injectKeyframes();
  }, []);

  // Use external score data if provided, otherwise fetch internally
  const internalScoreData = useEthosScore(externalScoreData ? undefined : address);
  const scoreData = externalScoreData || internalScoreData;
  const { score, vouches, reviews, loading } = scoreData;

  const presetRequirements = preset ? getPreset(preset) : null;
  const finalMinScore =
    minScore ?? presetRequirements?.minScore ?? config.defaultMinScore ?? 0;
  const finalMinVouches =
    minVouches ?? presetRequirements?.minVouches ?? config.defaultMinVouches ?? 0;
  const finalMinReviews =
    minReviews ?? presetRequirements?.minReviews ?? config.defaultMinReviews ?? 0;
  const description = presetRequirements?.description;
  const showRequirementInfo = showRequirements ?? config.showRequirements ?? false;

  if (!isConnected) {
    return (
      <div style={glassStyles.disconnected}>
        <div style={{ fontSize: "32px", marginBottom: "12px", opacity: 0.7 }}>
          {"\uD83D\uDD12"}
        </div>
        <p style={{ ...glassStyles.title, marginBottom: "8px" }}>Connect wallet to continue</p>
        {description && showDescription && (
          <p style={glassStyles.subtitle}>This feature requires: {description}</p>
        )}
      </div>
    );
  }

  if (loading) {
    return (
      loadingComponent ?? (
        <div style={glassStyles.loading}>
          <div style={glassStyles.spinner} />
          <p style={{ ...glassStyles.title, color: "#0369a1" }}>
            Checking your Ethos reputation...
          </p>
        </div>
      )
    );
  }

  const meetsScore = score >= finalMinScore;
  const meetsVouches = vouches >= finalMinVouches;
  const meetsReviews = reviews >= finalMinReviews;
  const hasAccess = meetsScore && meetsVouches && meetsReviews;

  if (!hasAccess) {
    return (
      fallback ?? (
        <div style={glassStyles.restricted}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <span style={{ fontSize: "28px" }}>{"\uD83D\uDD12"}</span>
            <div>
              <h3 style={{ ...glassStyles.title, color: "#dc2626" }}>
                Access Restricted
              </h3>
              {description && showDescription && (
                <p style={{ ...glassStyles.subtitle, marginTop: "4px" }}>
                  Required: {description}
                </p>
              )}
            </div>
          </div>

          <div style={glassStyles.innerCard}>
            <h4 style={{ ...glassStyles.label, marginBottom: "12px", textTransform: "uppercase" }}>
              Your Status
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {finalMinScore > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={glassStyles.label}>Reputation score</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{
                      ...glassStyles.value,
                      color: meetsScore ? "#16a34a" : "#dc2626"
                    }}>
                      {score} / {finalMinScore}
                    </span>
                    <span style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "12px",
                      fontWeight: 700,
                      background: meetsScore
                        ? "linear-gradient(145deg, rgba(220,252,231,0.9) 0%, rgba(187,247,208,0.6) 100%)"
                        : "linear-gradient(145deg, rgba(254,226,226,0.9) 0%, rgba(254,202,202,0.6) 100%)",
                      color: meetsScore ? "#16a34a" : "#dc2626",
                    }}>
                      {meetsScore ? "\u2713" : "\u2717"}
                    </span>
                  </div>
                </div>
              )}
              {finalMinVouches > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={glassStyles.label}>Vouches received</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{
                      ...glassStyles.value,
                      color: meetsVouches ? "#16a34a" : "#dc2626"
                    }}>
                      {vouches} / {finalMinVouches}
                    </span>
                    <span style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "12px",
                      fontWeight: 700,
                      background: meetsVouches
                        ? "linear-gradient(145deg, rgba(220,252,231,0.9) 0%, rgba(187,247,208,0.6) 100%)"
                        : "linear-gradient(145deg, rgba(254,226,226,0.9) 0%, rgba(254,202,202,0.6) 100%)",
                      color: meetsVouches ? "#16a34a" : "#dc2626",
                    }}>
                      {meetsVouches ? "\u2713" : "\u2717"}
                    </span>
                  </div>
                </div>
              )}
              {finalMinReviews > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={glassStyles.label}>Reviews received</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{
                      ...glassStyles.value,
                      color: meetsReviews ? "#16a34a" : "#dc2626"
                    }}>
                      {reviews} / {finalMinReviews}
                    </span>
                    <span style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "12px",
                      fontWeight: 700,
                      background: meetsReviews
                        ? "linear-gradient(145deg, rgba(220,252,231,0.9) 0%, rgba(187,247,208,0.6) 100%)"
                        : "linear-gradient(145deg, rgba(254,226,226,0.9) 0%, rgba(254,202,202,0.6) 100%)",
                      color: meetsReviews ? "#16a34a" : "#dc2626",
                    }}>
                      {meetsReviews ? "\u2713" : "\u2717"}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div style={glassStyles.infoCard}>
            <p style={{ ...glassStyles.label, marginBottom: "10px", textTransform: "uppercase" }}>
              How to gain access
            </p>
            <ul style={{ margin: 0, paddingLeft: "16px", fontSize: "13px", color: "#475569", lineHeight: 1.6 }}>
              {!meetsScore && (
                <li>Increase your Ethos score through positive contributions</li>
              )}
              {!meetsVouches && <li>Get vouches from trusted community members</li>}
              {!meetsReviews && <li>Receive reviews for your work and participation</li>}
            </ul>
          </div>

          <a
            href="https://ethos.network"
            target="_blank"
            rel="noopener noreferrer"
            style={glassStyles.link}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Learn more about building your Ethos reputation {"\u2192"}
          </a>
        </div>
      )
    );
  }

  return (
    <>
      {showRequirementInfo && (
        <div style={glassStyles.success}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{
              width: "24px",
              height: "24px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "14px",
              fontWeight: 700,
              background: "linear-gradient(145deg, rgba(187,247,208,0.9) 0%, rgba(134,239,172,0.6) 100%)",
              color: "#16a34a",
            }}>
              {"\u2713"}
            </span>
            <div style={{ flex: 1 }}>
              <p style={{ ...glassStyles.value, color: "#16a34a", margin: 0 }}>
                Access granted - you meet all requirements
              </p>
              {description && showDescription && (
                <p style={{ ...glassStyles.subtitle, fontSize: "12px", marginTop: "4px" }}>
                  {description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
      {children}
    </>
  );
}
