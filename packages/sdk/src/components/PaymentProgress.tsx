import React, { useState, useEffect } from "react";
import type { CSSProperties } from "react";

interface PaymentProgressProps {
  isProcessing: boolean;
  stage?: "initiating" | "confirming" | "success" | "error";
  txHash?: string;
  amount?: number;
  token?: string;
  onClose?: () => void;
}

const injectKeyframes = () => {
  if (typeof document !== "undefined") {
    const styleId = "ethos-payment-keyframes";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        @keyframes ethos-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes ethos-slide-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes ethos-bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes ethos-check-draw {
          to { stroke-dashoffset: 0; }
        }
      `;
      document.head.appendChild(style);
    }
  }
};

export function PaymentProgress({
  isProcessing,
  stage = "initiating",
  txHash,
  amount,
  token,
  onClose
}: PaymentProgressProps) {
  const [dots, setDots] = useState("");

  useEffect(() => {
    injectKeyframes();
  }, []);

  useEffect(() => {
    if (isProcessing && stage !== "success" && stage !== "error") {
      const interval = setInterval(() => {
        setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isProcessing, stage]);

  if (!isProcessing && stage !== "success" && stage !== "error") return null;

  const stages = [
    { id: "initiating", label: "Initiating", icon: "\uD83D\uDD04", color: "#3B82F6" },
    { id: "confirming", label: "Confirming", icon: "\u23F3", color: "#F59E0B" },
    { id: "success", label: "Complete", icon: "\u2705", color: "#10B981" }
  ];

  const currentStageIndex = stages.findIndex((s) => s.id === stage);

  const overlayStyle: CSSProperties = {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    animation: "ethos-fade-in 0.3s ease-out",
  };

  const modalStyle: CSSProperties = {
    background: "linear-gradient(145deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.95) 100%)",
    borderRadius: "24px",
    padding: "32px",
    maxWidth: "420px",
    width: "90%",
    boxShadow: "0 25px 80px rgba(0,0,0,0.2)",
    animation: "ethos-slide-up 0.4s ease-out",
  };

  return (
    <div style={overlayStyle} onClick={stage === "success" || stage === "error" ? onClose : undefined}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        {/* Header Icon */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div
            style={{
              fontSize: "56px",
              animation: stage !== "success" && stage !== "error" ? "ethos-bounce-slow 2s ease-in-out infinite" : undefined,
            }}
          >
            {stage === "error" ? "\u274C" : stages[Math.min(currentStageIndex, 2)]?.icon}
          </div>
          <h3 style={{ fontSize: "24px", fontWeight: 700, marginTop: "12px", color: "#1E293B" }}>
            {stage === "error" ? "Transaction Failed" : stages[currentStageIndex]?.label}
          </h3>
          {amount && token && (
            <p style={{ color: "#64748B", marginTop: "4px" }}>
              {amount} {token}
            </p>
          )}
        </div>

        {/* Progress Steps */}
        <div style={{ marginBottom: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            {stages.map((s, index) => (
              <React.Fragment key={s.id}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "20px",
                      background: index <= currentStageIndex
                        ? `linear-gradient(135deg, ${s.color} 0%, ${s.color}dd 100%)`
                        : "#E2E8F0",
                      color: index <= currentStageIndex ? "white" : "#94A3B8",
                      transform: index === currentStageIndex ? "scale(1.1)" : "scale(1)",
                      transition: "all 0.3s ease",
                      boxShadow: index <= currentStageIndex ? `0 4px 12px ${s.color}40` : "none",
                    }}
                  >
                    {s.icon}
                  </div>
                  <span style={{ fontSize: "11px", marginTop: "8px", fontWeight: 500, color: "#64748B" }}>
                    {s.label}
                  </span>
                </div>

                {index < stages.length - 1 && (
                  <div
                    style={{
                      flex: 1,
                      height: "4px",
                      margin: "0 8px",
                      marginBottom: "24px",
                      background: "#E2E8F0",
                      borderRadius: "2px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        background: stages[index + 1].color,
                        width: index < currentStageIndex ? "100%" : "0%",
                        transition: "width 0.5s ease",
                      }}
                    />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Status Message */}
        <div style={{ textAlign: "center", marginBottom: "16px" }}>
          {stage === "initiating" && (
            <p style={{ color: "#64748B" }}>Preparing transaction{dots}</p>
          )}
          {stage === "confirming" && (
            <p style={{ color: "#64748B" }}>Waiting for network confirmation{dots}</p>
          )}
          {stage === "success" && (
            <p style={{ color: "#059669", fontWeight: 600 }}>
              {"\u2705"} Payment confirmed on Base Sepolia!
            </p>
          )}
          {stage === "error" && (
            <p style={{ color: "#DC2626", fontWeight: 600 }}>
              Transaction failed. Please try again.
            </p>
          )}
        </div>

        {/* Transaction Hash */}
        {txHash && (
          <div
            style={{
              background: "#F8FAFC",
              borderRadius: "12px",
              padding: "12px",
              marginBottom: "16px",
            }}
          >
            <div style={{ fontSize: "11px", color: "#64748B", marginBottom: "4px" }}>
              Transaction Hash:
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <code
                style={{
                  flex: 1,
                  fontSize: "12px",
                  fontFamily: "monospace",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {txHash}
              </code>
              <a
                href={`https://sepolia.basescan.org/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#3B82F6",
                  fontSize: "12px",
                  fontWeight: 500,
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                }}
              >
                View {"\u2192"}
              </a>
            </div>
          </div>
        )}

        {/* Loading dots */}
        {isProcessing && stage !== "success" && stage !== "error" && (
          <div style={{ display: "flex", justifyContent: "center", gap: "4px" }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: "8px",
                  height: "8px",
                  background: "#3B82F6",
                  borderRadius: "50%",
                  animation: `ethos-bounce-slow 1s ease-in-out infinite`,
                  animationDelay: `${i * 0.15}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* Close button for completed states */}
        {(stage === "success" || stage === "error") && onClose && (
          <button
            onClick={onClose}
            style={{
              width: "100%",
              marginTop: "16px",
              padding: "12px 24px",
              background: stage === "success"
                ? "linear-gradient(135deg, #10B981 0%, #059669 100%)"
                : "linear-gradient(135deg, #6B7280 0%, #4B5563 100%)",
              color: "white",
              border: "none",
              borderRadius: "12px",
              fontSize: "16px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {stage === "success" ? "Done" : "Close"}
          </button>
        )}
      </div>
    </div>
  );
}
