import React, { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { useAccount } from "wagmi";

import { usePayment } from "../hooks/usePayment";

type PaymentToken = "USDC" | "ETH";

export interface PayButtonProps {
  amount: number;
  amounts?: Partial<Record<PaymentToken, number>>;
  ethUsdRate?: number;
  token?: PaymentToken;
  tokens?: PaymentToken[];
  recipient?: string;
  label?: string | ((token: PaymentToken, amount: number) => string);
  onHash?: (hash: `0x${string}`) => void;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  className?: string;
  disabled?: boolean;
}

// Light Airy Liquid Glass Design for PayButton
const glassStyles = {
  // Primary button - soft blue gradient
  button: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "14px 28px",
    fontSize: "16px",
    fontWeight: 600,
    letterSpacing: "-0.01em",
    borderRadius: "14px",
    border: "none",
    cursor: "pointer",
    transition: "all 0.2s ease",
    width: "100%",
  } as CSSProperties,

  primary: {
    background: "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)",
    boxShadow: `
      0 8px 24px rgba(59,130,246,0.35),
      0 2px 8px rgba(0,0,0,0.08),
      inset 0 1px 0 rgba(255,255,255,0.2)
    `,
    color: "white",
  } as CSSProperties,

  processing: {
    background: "linear-gradient(135deg, #93c5fd 0%, #a5b4fc 100%)",
    boxShadow: `
      0 8px 24px rgba(147,197,253,0.3),
      inset 0 1px 0 rgba(255,255,255,0.2)
    `,
    color: "white",
    cursor: "wait",
  } as CSSProperties,

  success: {
    background: "linear-gradient(135deg, #22c55e 0%, #10b981 100%)",
    boxShadow: `
      0 8px 24px rgba(34,197,94,0.35),
      0 2px 8px rgba(0,0,0,0.08),
      inset 0 1px 0 rgba(255,255,255,0.2)
    `,
    color: "white",
  } as CSSProperties,

  error: {
    background: "linear-gradient(135deg, #ef4444 0%, #f43f5e 100%)",
    boxShadow: `
      0 8px 24px rgba(239,68,68,0.35),
      0 2px 8px rgba(0,0,0,0.08),
      inset 0 1px 0 rgba(255,255,255,0.2)
    `,
    color: "white",
  } as CSSProperties,

  disabled: {
    background: "linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.3)",
    color: "#94a3b8",
    cursor: "not-allowed",
  } as CSSProperties,

  // Select dropdown - light glass style
  select: {
    width: "100%",
    padding: "12px 16px",
    fontSize: "14px",
    fontWeight: 500,
    borderRadius: "12px",
    background: "linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.7) 100%)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    border: "1px solid rgba(226,232,240,0.8)",
    boxShadow: `
      0 4px 12px rgba(0,0,0,0.04),
      inset 0 1px 0 rgba(255,255,255,0.9)
    `,
    color: "#1e293b",
    outline: "none",
    cursor: "pointer",
    appearance: "none" as const,
    WebkitAppearance: "none" as const,
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2364748b' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 12px center",
    paddingRight: "36px",
  } as CSSProperties,

  label: {
    display: "block",
    fontSize: "12px",
    fontWeight: 500,
    color: "#64748b",
    marginBottom: "6px",
    letterSpacing: "0.02em",
  } as CSSProperties,

  // Transaction link - soft style
  txLink: {
    display: "block",
    marginTop: "12px",
    padding: "10px 16px",
    fontSize: "13px",
    fontWeight: 500,
    textAlign: "center" as const,
    textDecoration: "none",
    borderRadius: "10px",
    background: "linear-gradient(145deg, rgba(240,249,255,0.9) 0%, rgba(224,242,254,0.6) 100%)",
    border: "1px solid rgba(186,230,253,0.5)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.7)",
    color: "#0369a1",
    transition: "all 0.2s ease",
  } as CSSProperties,

  spinner: {
    width: "18px",
    height: "18px",
    border: "2px solid rgba(255,255,255,0.3)",
    borderTopColor: "white",
    borderRadius: "50%",
    animation: "ethosgate-spin 0.8s linear infinite",
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

export function PayButton({
  amount,
  amounts,
  ethUsdRate = 2500,
  token = "USDC",
  tokens,
  recipient,
  label,
  onHash,
  onSuccess,
  onError,
  disabled = false
}: PayButtonProps) {
  const { isConnected } = useAccount();
  const { pay, isPaying, hash } = usePayment();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  // Inject animation keyframes
  useEffect(() => {
    injectKeyframes();
  }, []);

  const availableTokens = tokens && tokens.length > 0 ? tokens : [token];
  const [selectedToken, setSelectedToken] = useState<PaymentToken>(availableTokens[0] ?? token);

  useEffect(() => {
    setSelectedToken(availableTokens[0] ?? token);
  }, [availableTokens, token]);

  useEffect(() => {
    if (hash) {
      onHash?.(hash);
    }
  }, [hash, onHash]);

  const resolvedAmount = useMemo(() => {
    const mappedAmount = amounts?.[selectedToken];
    if (typeof mappedAmount === "number") {
      return mappedAmount;
    }

    if (selectedToken === "ETH") {
      return Number((amount / ethUsdRate).toFixed(6));
    }

    return amount;
  }, [amount, amounts, selectedToken, ethUsdRate]);

  async function handlePay() {
    setStatus("idle");

    await pay({
      amount: resolvedAmount,
      token: selectedToken,
      recipient,
      onSuccess: () => {
        setStatus("success");
        onSuccess?.();
      },
      onError: (error) => {
        setStatus("error");
        onError?.(error);
      }
    });
  }

  const resolvedLabel =
    typeof label === "function" ? label(selectedToken, resolvedAmount) : label;
  const buttonText = resolvedLabel || `Pay ${resolvedAmount} ${selectedToken}`;

  // Determine button style based on state
  const getButtonStyle = (): CSSProperties => {
    if (!isConnected || disabled) {
      return { ...glassStyles.button, ...glassStyles.disabled };
    }
    if (isPaying) {
      return { ...glassStyles.button, ...glassStyles.processing };
    }
    if (status === "success") {
      return { ...glassStyles.button, ...glassStyles.success };
    }
    if (status === "error") {
      return { ...glassStyles.button, ...glassStyles.error };
    }
    return { ...glassStyles.button, ...glassStyles.primary };
  };

  if (!isConnected) {
    return (
      <button disabled style={getButtonStyle()}>
        {"\uD83D\uDD12"} Connect Wallet First
      </button>
    );
  }

  return (
    <div>
      {availableTokens.length > 1 && (
        <div style={{ marginBottom: "12px" }}>
          <label style={glassStyles.label}>Payment token</label>
          <select
            value={selectedToken}
            onChange={(event) => setSelectedToken(event.target.value as "USDC" | "ETH")}
            style={glassStyles.select}
          >
            {availableTokens.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      )}
      <button
        onClick={handlePay}
        disabled={disabled || isPaying}
        style={getButtonStyle()}
        onMouseEnter={(e) => {
          if (!disabled && !isPaying && status === "idle") {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = `
              0 12px 32px rgba(59,130,246,0.4),
              0 4px 12px rgba(0,0,0,0.1),
              inset 0 1px 0 rgba(255,255,255,0.2)
            `;
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          if (!disabled && !isPaying && status === "idle") {
            e.currentTarget.style.boxShadow = `
              0 8px 24px rgba(59,130,246,0.35),
              0 2px 8px rgba(0,0,0,0.08),
              inset 0 1px 0 rgba(255,255,255,0.2)
            `;
          }
        }}
      >
        {isPaying ? (
          <>
            <span style={glassStyles.spinner} />
            Processing...
          </>
        ) : status === "success" ? (
          <>{"\u2713"} Payment Successful</>
        ) : status === "error" ? (
          <>{"\u2717"} Payment Failed - Try Again</>
        ) : (
          buttonText
        )}
      </button>

      {hash && (
        <a
          href={`https://sepolia.basescan.org/tx/${hash}`}
          target="_blank"
          rel="noopener noreferrer"
          style={glassStyles.txLink}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          View transaction on BaseScan {"\u2192"}
        </a>
      )}
    </div>
  );
}
