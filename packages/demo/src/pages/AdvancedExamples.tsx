import { useState } from "react";
import { useAccount } from "wagmi";
import { EthosGate, PayButton, TrustBadge, useEthosScore, calculateRequiredScore } from "@ethos/reputation-gate";
import { ScoreSelector } from "../examples/ScoreSelector";

export function AdvancedExamples() {
  const { address } = useAccount();
  const { score } = useEthosScore(address);

  return (
    <div className="min-h-screen py-12 relative overflow-hidden">
      <div className="glass-orb glass-orb--one" />
      <div className="glass-orb glass-orb--two" />
      <div className="glass-orb glass-orb--three" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card rounded-3xl px-6 sm:px-10 py-8 mb-10">
          <div className="inline-flex items-center gap-2 glass-pill px-4 py-2 text-xs uppercase tracking-[0.3em] text-slate-600">
            Advanced Examples
          </div>
          <h1 className="text-4xl sm:text-5xl font-semibold mt-4 text-slate-900">Flexible Integrations</h1>
          <p className="text-slate-600 mt-3 max-w-2xl">
            Customize Ethos Reputation Gate for your specific needs.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <PresetExample />
          <DynamicScoreExample />
          <RiskBasedExample />
          <ProgressiveAccessExample score={score} />
        </div>

        <div className="mt-12">
          <ScoreSelector />
        </div>
      </div>
    </div>
  );
}

function PresetExample() {
  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="text-2xl font-bold mb-4">1. Using Presets</h3>
      <p className="text-slate-600 mb-6">
        Quick start with pre-configured requirements for common use cases
      </p>

      <div className="space-y-4">
        <div>
          <code className="text-sm bg-white/70 px-2 py-1 rounded mb-2 block">preset="APPLY_JOB"</code>
          <EthosGate preset="APPLY_JOB" showRequirements>
            <button className="w-full bg-blue-500 text-white px-4 py-2 rounded">Apply for Job</button>
          </EthosGate>
        </div>

        <div>
          <code className="text-sm bg-white/70 px-2 py-1 rounded mb-2 block">preset="VOTE"</code>
          <EthosGate preset="VOTE" showRequirements>
            <button className="w-full bg-purple-500 text-white px-4 py-2 rounded">Vote on Proposal</button>
          </EthosGate>
        </div>

        <div>
          <code className="text-sm bg-white/70 px-2 py-1 rounded mb-2 block">preset="BORROW"</code>
          <EthosGate preset="BORROW" showRequirements>
            <button className="w-full bg-green-500 text-white px-4 py-2 rounded">Borrow USDC</button>
          </EthosGate>
        </div>
      </div>
    </div>
  );
}

function DynamicScoreExample() {
  const [amount, setAmount] = useState(1000);

  const requiredScore =
    amount > 10000 ? 1800 : amount > 5000 ? 1600 : amount > 1000 ? 1400 : 1200;

  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="text-2xl font-bold mb-4">2. Dynamic Requirements</h3>
      <p className="text-slate-600 mb-6">Adjust requirements based on transaction value</p>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Loan Amount: ${amount.toLocaleString()}</label>
        <input
          type="range"
          min="100"
          max="20000"
          step="100"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full"
        />
      </div>

      <div className="glass-pill rounded-xl p-3 mb-4 text-sm">
        <p className="font-semibold">Required Score: {requiredScore}</p>
        <p className="text-slate-600">
          {amount > 10000 && "Elite tier for high-value loans"}
          {amount > 5000 && amount <= 10000 && "Premium tier for medium-value loans"}
          {amount > 1000 && amount <= 5000 && "Standard tier for standard loans"}
          {amount <= 1000 && "Basic tier for small loans"}
        </p>
      </div>

      <EthosGate minScore={requiredScore} showRequirements>
        <PayButton
          amount={Math.min(amount / 100, 100)}
          token="USDC"
          label={`Borrow $${amount.toLocaleString()}`}
          className="w-full"
        />
      </EthosGate>
    </div>
  );
}

function RiskBasedExample() {
  const [monetaryValue, setMonetaryValue] = useState(5000);
  const [sensitivity, setSensitivity] = useState<"low" | "medium" | "high" | "critical">("medium");

  const requiredScore = calculateRequiredScore({
    monetaryValue,
    sensitivity,
    reversibility: false
  });

  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="text-2xl font-bold mb-4">3. Risk-Based Scoring</h3>
      <p className="text-slate-600 mb-6">Calculate requirements based on multiple risk factors</p>

      <div className="space-y-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-2">Value: ${monetaryValue.toLocaleString()}</label>
          <input
            type="range"
            min="100"
            max="50000"
            step="1000"
            value={monetaryValue}
            onChange={(e) => setMonetaryValue(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Sensitivity</label>
          <select
            value={sensitivity}
            onChange={(e) => setSensitivity(e.target.value as "low" | "medium" | "high" | "critical")}
            className="w-full p-2 border rounded"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
      </div>

      <div className="glass-pill rounded-xl p-3 mb-4 text-sm">
        <p className="font-semibold">Recommended Score: {requiredScore}</p>
        <p className="text-slate-600">Based on value, sensitivity, and reversibility</p>
      </div>

      <EthosGate minScore={requiredScore} showRequirements>
        <button className="w-full bg-blue-600 text-white px-4 py-2 rounded">Submit Action</button>
      </EthosGate>
    </div>
  );
}

function ProgressiveAccessExample({ score }: { score: number }) {
  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="text-2xl font-bold mb-4">4. Progressive Access</h3>
      <p className="text-slate-600 mb-6">Unlock more features as reputation increases</p>

      <div className="space-y-3">
        <TierCard label="Basic" active score={score} threshold={0} />
        <TierCard label="Intermediate" active={score >= 1200} score={score} threshold={1200} />
        <TierCard label="Advanced" active={score >= 1600} score={score} threshold={1600} />
        <TierCard label="Elite" active={score >= 1800} score={score} threshold={1800} />
      </div>
    </div>
  );
}

function TierCard({
  label,
  active,
  score,
  threshold
}: {
  label: string;
  active: boolean;
  score: number;
  threshold: number;
}) {
  return (
    <div
      className={`glass-pill rounded-xl p-3 border ${active ? "border-green-200 bg-white/70" : "border-white/60"}`}
    >
      <div className="flex items-center justify-between">
        <span className="font-medium">{label}</span>
        <span className="text-sm text-slate-600">
          {score} / {threshold}
        </span>
      </div>
      <div className="mt-2">
        <TrustBadge score={score} showScore={false} />
      </div>
    </div>
  );
}
