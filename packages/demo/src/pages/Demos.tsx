import { useState } from "react";

import { EventAccessDemo } from "../demos/EventAccess";
import { StakeToApplyDemo } from "../demos/StakeToApply";
import { SubscriptionDemo } from "../demos/Subscription";
import { NFTAllowlistDemo } from "../demos/NFTAllowlist";
import { MicrotasksDemo } from "../demos/Microtasks";
import { P2PLendingDemo } from "../demos/P2PLending";
import { DeFiVaultDemo } from "../demos/DeFiVault";
import { BetaAccessDemo } from "../demos/BetaAccess";

const DEMOS = [
  {
    id: "event",
    name: "Event Access",
    icon: "\uD83C\uDFAB",
    component: EventAccessDemo,
    description: "Reputation-gated ticket sales with payment"
  },
  {
    id: "stake",
    name: "Stake to Apply",
    icon: "\uD83D\uDCBC",
    component: StakeToApplyDemo,
    description: "Anti-sybil freelance applications with deposits"
  },
  {
    id: "subscription",
    name: "Subscription",
    icon: "\u2B50",
    component: SubscriptionDemo,
    description: "Tiered pricing based on reputation"
  },
  {
    id: "nft",
    name: "NFT Allowlist",
    icon: "\uD83D\uDDBC\uFE0F",
    component: NFTAllowlistDemo,
    description: "Dynamic mint pricing by credibility"
  },
  {
    id: "tasks",
    name: "Microtasks",
    icon: "\u2705",
    component: MicrotasksDemo,
    description: "Spam-free task posting platform"
  },
  {
    id: "p2p-lending",
    name: "P2P Lending",
    icon: "\uD83E\uDD1D",
    component: P2PLendingDemo,
    description: "Reputation-backed peer-to-peer crypto loans"
  },
  {
    id: "defi-vault",
    name: "DeFi Vault",
    icon: "\uD83C\uDFE6",
    component: DeFiVaultDemo,
    description: "Higher APY and deposit limits for trusted users"
  },
  {
    id: "beta-access",
    name: "Beta Access",
    icon: "\uD83D\uDE80",
    component: BetaAccessDemo,
    description: "Early access to features for trusted users"
  }
];

export function Demos() {
  const [activeDemo, setActiveDemo] = useState("event");

  const ActiveComponent = DEMOS.find((d) => d.id === activeDemo)?.component || EventAccessDemo;
  const activeDemoInfo = DEMOS.find((d) => d.id === activeDemo);

  return (
    <div className="min-h-screen py-12 relative overflow-hidden">
      <div className="glass-orb glass-orb--one" />
      <div className="glass-orb glass-orb--two" />
      <div className="glass-orb glass-orb--three" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card rounded-3xl px-6 sm:px-10 py-10 text-center mb-12">
          <div className="inline-flex items-center gap-2 glass-pill px-4 py-2 text-xs uppercase tracking-[0.3em] text-slate-600">
            Live Showcase
          </div>
          <h1 className="text-4xl sm:text-5xl font-semibold mt-4 mb-4 text-slate-900">Ethos Gate Demos</h1>
          <p className="text-lg text-slate-600 mb-2">
            See Ethos Reputation Gate in action across 8 different use cases.
          </p>
          <p className="text-sm text-slate-500">Connect your wallet to interact with real Ethos data.</p>
        </div>

        <div className="flex flex-wrap gap-3 justify-center mb-8">
          {DEMOS.map((demo) => (
            <button
              key={demo.id}
              onClick={() => setActiveDemo(demo.id)}
              className={`glass-pill px-4 sm:px-6 py-3 rounded-full font-semibold transition-all flex items-center gap-2 ${
                activeDemo === demo.id
                  ? "bg-white/80 text-slate-900 shadow-[0_18px_30px_rgba(15,23,42,0.18)] scale-105"
                  : "text-slate-700 hover:text-slate-900 hover:bg-white/70"
              }`}
              title={demo.description}
            >
              <span className="text-xl emoji">{demo.icon}</span>
              <span className="hidden sm:inline">{demo.name}</span>
            </button>
          ))}
        </div>

        {activeDemoInfo && (
          <div className="text-center mb-6">
            <p className="text-sm text-slate-600 max-w-2xl mx-auto">{activeDemoInfo.description}</p>
          </div>
        )}

        <div className="mb-8 relative">
          <div className="pointer-events-none absolute -inset-3 rounded-[32px] border-2 border-blue-500/80 shadow-[0_18px_40px_rgba(37,99,235,0.35)] z-0" />
          <div className="pointer-events-none absolute -inset-6 rounded-[40px] bg-blue-500/25 blur-3xl opacity-90 z-0" />
          <div className="relative z-10">
            <ActiveComponent />
          </div>
        </div>

        <div className="glass-card rounded-3xl p-6 sm:p-8">
          <div className="text-center mb-4">
            <h3 className="font-semibold text-slate-900 mb-2 flex items-center justify-center gap-2">
              <span className="emoji">{"\uD83D\uDD10"}</span>
              <span>All demos use live Ethos API data</span>
            </h3>
            <p className="text-slate-600 text-sm">
              Connect your wallet to see your actual reputation score and tier. Payments use Base Sepolia testnet (no
              real money required).
            </p>
          </div>
          <div className="flex gap-4 justify-center text-sm flex-wrap">
            <a
              href="https://docs.ethos.network"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-700 hover:text-slate-900 font-medium"
            >
              <span className="emoji">{"\uD83D\uDCDA"}</span> API Docs
            </a>
            <a
              href="https://github.com/Emperoar07/ethos-gate"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-700 hover:text-slate-900 font-medium"
            >
              <span className="emoji">{"\uD83D\uDCBB"}</span> Source Code
            </a>
            <a
              href="https://www.coinbase.com/faucets/base-ethereum-goerli-faucet"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-700 hover:text-slate-900 font-medium"
            >
              <span className="emoji">{"\uD83D\uDCA7"}</span> Get Test ETH
            </a>
            <a
              href="https://ethos.network"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-700 hover:text-slate-900 font-medium"
            >
              <span className="emoji">{"\uD83D\uDCC8"}</span> Build Your Score
            </a>
          </div>
          <div className="mt-6 grid sm:grid-cols-3 gap-4 text-center">
            <div className="glass-pill rounded-2xl p-4">
              <div className="text-2xl font-semibold text-slate-900">8</div>
              <div className="text-xs text-slate-600">Live Demos</div>
            </div>
            <div className="glass-pill rounded-2xl p-4">
              <div className="text-2xl font-semibold text-slate-900">4</div>
              <div className="text-xs text-slate-600">Trust Tiers</div>
            </div>
            <div className="glass-pill rounded-2xl p-4">
              <div className="text-2xl font-semibold text-slate-900">100%</div>
              <div className="text-xs text-slate-600">Real Data</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
