import { useState } from "react";
import { SCORE_PRESETS, type UseCaseName, TrustBadge } from "@ethos/reputation-gate";

export function ScoreSelector() {
  const [selectedUseCase, setSelectedUseCase] = useState<UseCaseName | "">("");
  const [customScore, setCustomScore] = useState(1200);

  const selectedPreset = selectedUseCase ? SCORE_PRESETS.USE_CASES[selectedUseCase] : null;

  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="text-xl font-bold mb-4">Score Requirement Helper</h3>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Select Your Use Case:</label>
        <select
          className="w-full p-2 border rounded"
          value={selectedUseCase}
          onChange={(e) => setSelectedUseCase(e.target.value as UseCaseName | "")}
        >
          <option value="">-- Choose --</option>
          <option value="POST_CONTENT">Post Content</option>
          <option value="CHECKOUT">Checkout</option>
          <option value="VOTE">DAO Voting</option>
          <option value="BORROW">Borrow</option>
          <option value="PROPOSE">Submit Proposals</option>
        </select>

        {selectedPreset && (
          <div className="mt-4 p-4 glass-pill rounded-xl">
            <div className="font-semibold mb-2">Recommended:</div>
            <div className="text-2xl font-bold text-blue-600">
              {selectedPreset.minScore}+ score
            </div>
            <div className="text-sm text-slate-600 mt-2">{selectedPreset.description}</div>
          </div>
        )}
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Or Set Custom Score:</label>
        <input
          type="range"
          min="0"
          max="2000"
          step="100"
          value={customScore}
          onChange={(e) => setCustomScore(Number(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-slate-600 mt-1">
          <span>0 (Anyone)</span>
          <span className="font-bold text-lg">{customScore}</span>
          <span>2000 (Elite)</span>
        </div>

        <div className="mt-3">
          <TrustBadge score={customScore} showScore={false} />
        </div>
      </div>

      <div className="bg-gray-900 rounded p-4">
        <code className="text-green-400 text-sm">
          {`<EthosGate ${selectedUseCase ? `preset=\"${selectedUseCase}\"` : `minScore={${customScore}}`}>
  <YourComponent />
</EthosGate>`}
        </code>
      </div>
    </div>
  );
}
