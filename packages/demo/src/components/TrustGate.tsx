import React, { useState } from "react";
import { Shield, Lock, CheckCircle2, Wallet, ChevronRight } from "lucide-react";

interface TrustGateProps {
  minScore: number;
  userScore: number;
  children: React.ReactNode;
}

const TrustGate = ({ minScore, userScore, children }: TrustGateProps) => {
  const isLocked = userScore < minScore;
  const [isHovered, setIsHovered] = useState(false);

  if (!isLocked) {
    return (
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500" />
        <div className="relative glass-panel rounded-2xl p-1 overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border-b border-emerald-500/20 mb-4">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-medium text-emerald-200 tracking-wider">REPUTATION VERIFIED</span>
          </div>
          {children}
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative w-full max-w-md mx-auto overflow-hidden rounded-3xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 bg-slate-950">
        <div className="liquid-blob bg-emerald-600 w-64 h-64 rounded-full top-[-20%] left-[-20%] mix-blend-screen animate-delay-0" />
        <div className="liquid-blob bg-cyan-600 w-72 h-72 rounded-full bottom-[-20%] right-[-20%] mix-blend-screen animation-delay-2000" />
        <div className="liquid-blob bg-purple-600 w-48 h-48 rounded-full top-[40%] left-[30%] mix-blend-screen animation-delay-4000 opacity-40" />
      </div>

      <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      <div className="relative z-10 p-8 flex flex-col items-center text-center h-full glass-panel min-h-[400px] justify-center transition-all duration-500">
        <div className={`relative mb-6 transition-transform duration-500 ${isHovered ? "scale-110" : "scale-100"}`}>
          <div className="absolute inset-0 bg-emerald-400 blur-xl opacity-20 rounded-full" />
          <div className="relative bg-slate-900/50 p-4 rounded-full border border-white/10 ring-1 ring-white/5 shadow-2xl">
            <Shield
              className={`w-12 h-12 ${isHovered ? "text-emerald-400" : "text-slate-400"} transition-colors duration-300`}
            />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-slate-900 border border-slate-700 p-1.5 rounded-full shadow-lg">
            <Lock className="w-4 h-4 text-rose-500" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">
          Trust Gate <span className="text-emerald-400">Active</span>
        </h2>
        <p className="text-slate-400 text-sm mb-8 leading-relaxed max-w-[280px]">
          This action is protected by the Ethos Reputation Layer. You need a higher credibility score to proceed.
        </p>

        <div className="w-full bg-slate-800/50 h-12 rounded-xl border border-white/5 flex items-center justify-between px-4 mb-8 relative overflow-hidden group">
          <span className="text-xs text-slate-400 font-mono">YOUR SCORE</span>
          <div className="flex items-center gap-3">
            <span className="text-rose-400 font-bold font-mono">{userScore}</span>
            <span className="text-slate-600 text-xs">/</span>
            <span className="text-emerald-400 font-bold font-mono">{minScore}</span>
          </div>
          <div className="absolute bottom-0 left-0 h-1 bg-slate-700 w-full">
            <div
              className="h-full bg-gradient-to-r from-rose-500 to-rose-400"
              style={{ width: `${Math.min((userScore / minScore) * 100, 100)}%` }}
            />
          </div>
        </div>

        <button className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 p-[1px] focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-slate-900">
          <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2E8F0_0%,#310000_50%,#E2E8F0_100%)] opacity-0 group-hover:opacity-30 transition-opacity" />
          <span className="relative flex h-full w-full items-center justify-center rounded-xl bg-slate-950 px-8 py-3 text-sm font-medium text-white transition-all group-hover:bg-slate-900">
            <Wallet className="mr-2 h-4 w-4" />
            Connect Wallet to Verify
            <ChevronRight className="ml-1 h-4 w-4 opacity-50 group-hover:translate-x-1 transition-transform" />
          </span>
        </button>
      </div>
    </div>
  );
};

export default TrustGate;
