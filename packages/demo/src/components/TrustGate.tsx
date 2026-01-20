import React, { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { useEthosScore, getTrustTier } from "@ethos/reputation-gate";
import { ConnectButton } from "@rainbow-me/rainbowkit";

interface TrustGateProps {
  minScore: number;
  userScore?: number; // Optional - will fetch if not provided
  children: React.ReactNode;
}

const TrustGate = ({ minScore, userScore: externalScore, children }: TrustGateProps) => {
  const { address, isConnected } = useAccount();
  const { score: fetchedScore, loading, isRegistered } = useEthosScore(address);
  const [animatedScore, setAnimatedScore] = useState(0);

  // Use external score if provided, otherwise use fetched score
  const userScore = externalScore ?? fetchedScore;
  const isLocked = !isConnected || !isRegistered || userScore < minScore;
  const tier = getTrustTier(userScore);
  const progress = isRegistered ? Math.min((userScore / minScore) * 100, 100) : 0;

  // Animate score counting
  useEffect(() => {
    if (userScore === 0) {
      setAnimatedScore(0);
      return;
    }

    const duration = 1000;
    const steps = 30;
    const increment = userScore / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= userScore) {
        setAnimatedScore(userScore);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [userScore]);

  // Unlocked state - show children with success indicator
  if (isConnected && isRegistered && !isLocked) {
    return (
      <div className="relative">
        {/* Success glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400/20 to-cyan-400/20 rounded-2xl blur-lg" />

        <div className="relative rounded-2xl overflow-hidden" style={{
          background: "linear-gradient(145deg, rgba(236,253,245,0.95) 0%, rgba(209,250,229,0.85) 100%)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(134,239,172,0.4)",
          boxShadow: "0 8px 32px rgba(34,197,94,0.15), inset 0 1px 0 rgba(255,255,255,0.8)",
        }}>
          {/* Verified banner */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-emerald-200/50" style={{
            background: "linear-gradient(90deg, rgba(187,247,208,0.5) 0%, rgba(167,243,208,0.3) 100%)",
          }}>
            <span className="text-lg">{"\u2705"}</span>
            <span className="text-sm font-semibold text-emerald-700 tracking-wide">REPUTATION VERIFIED</span>
            <span className="ml-auto text-sm font-bold text-emerald-600">{tier.emoji} {animatedScore}</span>
          </div>

          {/* Content */}
          <div className="p-1">
            {children}
          </div>
        </div>
      </div>
    );
  }

  // Locked state - show gate UI
  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Ambient glow effects */}
      <div className="absolute -inset-4 opacity-60 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-32 h-32 bg-blue-300 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-purple-300 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <div className="relative rounded-3xl overflow-hidden" style={{
        background: "linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.85) 100%)",
        backdropFilter: "blur(24px) saturate(180%)",
        border: "1px solid rgba(255,255,255,0.6)",
        boxShadow: "0 20px 60px rgba(100,116,139,0.15), inset 0 1px 0 rgba(255,255,255,0.9)",
      }}>
        {/* Header accent */}
        <div style={{
          height: "4px",
          background: "linear-gradient(90deg, #3b82f6 0%, #8b5cf6 50%, #06b6d4 100%)",
        }} />

        <div className="p-8 flex flex-col items-center text-center">
          {/* Shield icon */}
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-blue-400/20 blur-xl rounded-full" />
            <div className="relative p-5 rounded-full" style={{
              background: "linear-gradient(145deg, rgba(239,246,255,0.95) 0%, rgba(219,234,254,0.8) 100%)",
              border: "1px solid rgba(147,197,253,0.4)",
              boxShadow: "0 8px 24px rgba(59,130,246,0.15), inset 0 1px 0 rgba(255,255,255,0.9)",
            }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>

              {/* Lock indicator */}
              <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full" style={{
                background: "linear-gradient(145deg, rgba(254,242,242,0.95) 0%, rgba(254,226,226,0.8) 100%)",
                border: "1px solid rgba(252,165,165,0.4)",
                boxShadow: "0 4px 12px rgba(239,68,68,0.15)",
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-rose-500">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-slate-800 mb-2 tracking-tight">
            Trust Gate <span className="text-blue-500">Active</span>
          </h2>
          <p className="text-slate-500 text-sm mb-6 leading-relaxed max-w-[300px]">
            This action is protected by Ethos Reputation. Connect your wallet to verify your credibility score.
          </p>

          {/* Score display */}
          <div className="w-full mb-6 p-4 rounded-2xl" style={{
            background: "linear-gradient(145deg, rgba(248,250,252,0.9) 0%, rgba(241,245,249,0.7) 100%)",
            border: "1px solid rgba(226,232,240,0.6)",
            boxShadow: "inset 0 2px 4px rgba(0,0,0,0.02)",
          }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 tracking-wider">YOUR SCORE</span>
              <div className="flex items-center gap-2">
                {loading ? (
                  <span className="text-slate-400 text-sm">Loading...</span>
                ) : !isConnected ? (
                  <span className="text-slate-400 text-sm">Connect Wallet</span>
                ) : !isRegistered ? (
                  <span className="text-amber-500 text-sm font-semibold">Not Registered</span>
                ) : (
                  <>
                    <span className={`text-lg font-bold ${userScore >= minScore ? "text-emerald-500" : "text-rose-500"}`}>
                      {animatedScore}
                    </span>
                    <span className="text-slate-300">/</span>
                    <span className="text-lg font-bold text-emerald-500">{minScore}</span>
                  </>
                )}
              </div>
            </div>

            {/* Progress bar */}
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: `${progress}%`,
                  background: progress >= 100
                    ? "linear-gradient(90deg, #10b981 0%, #34d399 100%)"
                    : progress >= 50
                    ? "linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%)"
                    : "linear-gradient(90deg, #ef4444 0%, #f87171 100%)",
                }}
              />
            </div>

            {/* Tier indicator */}
            {isConnected && isRegistered && userScore > 0 && (
              <div className="mt-3 flex items-center justify-center gap-2">
                <span className="text-lg">{tier.emoji}</span>
                <span className="text-sm font-medium text-slate-600">{tier.name} Tier</span>
              </div>
            )}
            {isConnected && !isRegistered && (
              <div className="mt-3 flex items-center justify-center gap-2">
                <span className="text-lg">{"\u26A0\uFE0F"}</span>
                <span className="text-sm font-medium text-amber-600">No Ethos Profile Found</span>
              </div>
            )}
          </div>

          {/* Connect button */}
          {!isConnected ? (
            <div className="w-full">
              <ConnectButton.Custom>
                {({ openConnectModal }) => (
                  <button
                    onClick={openConnectModal}
                    className="w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                    style={{
                      background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
                      boxShadow: "0 8px 24px rgba(59,130,246,0.35), inset 0 1px 0 rgba(255,255,255,0.2)",
                    }}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      Connect Wallet to Verify
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-60">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </span>
                  </button>
                )}
              </ConnectButton.Custom>
            </div>
          ) : !isRegistered ? (
            <div className="w-full">
              <a
                href="https://ethos.network"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-4 px-6 rounded-xl font-semibold text-white text-center transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)",
                  boxShadow: "0 8px 24px rgba(139,92,246,0.35), inset 0 1px 0 rgba(255,255,255,0.2)",
                }}
              >
                <span className="flex items-center justify-center gap-2">
                  {"\u2728"} Create Ethos Profile
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-60">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </span>
              </a>
              <p className="text-xs text-slate-400 text-center mt-3">
                Register on Ethos Network to build your reputation
              </p>
            </div>
          ) : userScore < minScore ? (
            <div className="w-full">
              <a
                href="https://ethos.network"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-4 px-6 rounded-xl font-semibold text-white text-center transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: "linear-gradient(135deg, #f59e0b 0%, #f97316 100%)",
                  boxShadow: "0 8px 24px rgba(245,158,11,0.35), inset 0 1px 0 rgba(255,255,255,0.2)",
                }}
              >
                <span className="flex items-center justify-center gap-2">
                  {"\uD83D\uDCC8"} Build Your Reputation
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-60">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </span>
              </a>
              <p className="text-xs text-slate-400 text-center mt-3">
                You need {minScore - userScore} more points to unlock
              </p>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 text-center border-t border-slate-100" style={{
          background: "linear-gradient(180deg, rgba(248,250,252,0.5) 0%, rgba(241,245,249,0.8) 100%)",
        }}>
          <p className="text-xs text-slate-400">
            Powered by Ethos Network {"\u2022"} Base Sepolia Testnet
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrustGate;
