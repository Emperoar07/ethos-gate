import { useState } from "react";
import { EthosGate, useEthosScore } from "@ethos/reputation-gate";

export function PresetExample() {
  return (
    <div className="space-y-4">
      <EthosGate preset="APPLY_JOB">
        <button className="px-4 py-2 rounded bg-blue-600 text-white">Apply for Job</button>
      </EthosGate>

      <EthosGate preset="VOTE">
        <button className="px-4 py-2 rounded bg-blue-600 text-white">Vote on Proposal</button>
      </EthosGate>

      <EthosGate preset="BORROW">
        <button className="px-4 py-2 rounded bg-blue-600 text-white">Borrow USDC</button>
      </EthosGate>
    </div>
  );
}

export function CustomRequirementsExample() {
  return (
    <div className="space-y-4">
      <EthosGate minScore={700}>
        <ChatBox accessLevel="basic" />
      </EthosGate>

      <EthosGate minScore={1400} minReviews={5}>
        <ChatBox accessLevel="premium" features={["dm", "voice"]} />
      </EthosGate>

      <EthosGate minScore={1800} minVouches={10}>
        <ModeratorPanel />
      </EthosGate>
    </div>
  );
}

export function DynamicScoreExample() {
  const [loanAmount, setLoanAmount] = useState(1000);

  const requiredScore =
    loanAmount > 10000 ? 1800 : loanAmount > 5000 ? 1600 : loanAmount > 1000 ? 1400 : 1200;

  return (
    <div className="space-y-4">
      <input
        type="number"
        value={loanAmount}
        onChange={(e) => setLoanAmount(Number(e.target.value))}
        className="border rounded px-3 py-2"
      />

      <EthosGate minScore={requiredScore} showRequirements>
        <button className="px-4 py-2 rounded bg-blue-600 text-white">
          Borrow ${loanAmount}
        </button>
      </EthosGate>
    </div>
  );
}

export function ProgressiveAccessExample({ address }: { address?: string }) {
  const { score } = useEthosScore(address);

  return (
    <div className="space-y-3">
      <BasicFeatures />
      {score >= 1200 && <IntermediateFeatures />}
      {score >= 1600 && <AdvancedFeatures />}
      {score >= 1800 && <EliteFeatures />}
    </div>
  );
}

function ChatBox({ accessLevel, features }: { accessLevel: string; features?: string[] }) {
  return (
    <div className="border rounded p-3 text-sm">
      <div className="font-semibold">Chat Access: {accessLevel}</div>
      {features && <div className="text-gray-600">Features: {features.join(", ")}</div>}
    </div>
  );
}

function ModeratorPanel() {
  return <div className="border rounded p-3 text-sm">Moderator tools enabled.</div>;
}

function BasicFeatures() {
  return <div className="border rounded p-3 text-sm">Basic features unlocked.</div>;
}

function IntermediateFeatures() {
  return <div className="border rounded p-3 text-sm">Intermediate features unlocked.</div>;
}

function AdvancedFeatures() {
  return <div className="border rounded p-3 text-sm">Advanced features unlocked.</div>;
}

function EliteFeatures() {
  return <div className="border rounded p-3 text-sm">Elite features unlocked.</div>;
}
