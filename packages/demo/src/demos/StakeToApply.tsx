import { useState } from "react";
import { useAccount } from "wagmi";
import { PayButton, TrustBadge, useEthosScore } from "@ethos/reputation-gate";
import TrustGate from "../components/TrustGate";
import toast from "react-hot-toast";

import { TREASURY_ADDRESS } from "../config/constants";

export function StakeToApplyDemo() {
  const { address } = useAccount();
  const { score } = useEthosScore(address);
  const [hasStaked, setHasStaked] = useState(false);
  const ethAmount = 0.004;

  return (
    <div className="glass-card rounded-3xl p-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-sm font-semibold text-blue-700">GIG</span>
        <div>
          <h2 className="text-2xl font-bold">Freelance Gig</h2>
          <p className="text-gray-600">Design landing page for DeFi protocol</p>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6 mb-6">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <span className="text-sm text-gray-600">Budget</span>
            <p className="text-xl font-bold text-blue-600">$20 USDC</p>
          </div>
          <div>
            <span className="text-sm text-gray-600">Deadline</span>
            <p className="text-xl font-bold">7 days</p>
          </div>
        </div>

        <div className="border-t border-white/40 pt-4">
          <h4 className="font-semibold mb-2">Description:</h4>
          <p className="text-sm text-gray-700">
            Need a clean, modern landing page for our new DeFi lending protocol. Must include hero section, features,
            and clear call-to-action. Figma design preferred.
          </p>
        </div>
      </div>

      {address && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700">Your Reputation:</span>
            <TrustBadge score={score} showScore />
          </div>
        </div>
      )}

      <div className="glass-card rounded-2xl p-4 mb-6">
        <div className="flex items-start gap-2">
          <span className="text-xs font-semibold text-yellow-800">NOTE</span>
          <div className="flex-1">
            <h4 className="font-semibold text-yellow-900 mb-1">Anti-Sybil Protection</h4>
            <p className="text-sm text-yellow-800">
              Stake $10 USDC (or {ethAmount} ETH) to apply. If you complete the work, you get your stake back plus the
              full payment. If you ghost the client, your stake is slashed.
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/40 pt-6">
        <h3 className="font-semibold mb-3">Requirements to Apply</h3>
        <ul className="space-y-2 text-sm mb-6">
          <li className="flex items-center gap-2">
            <span className={score >= 1100 ? "text-green-500" : "text-red-500"}>
              {score >= 1100 ? "OK" : "NO"}
            </span>
            <span>Min score: 1100 (TRUSTED tier)</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-blue-500">REQ</span>
            <span>$10 USDC or {ethAmount} ETH stake required</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-blue-500">REQ</span>
            <span>Portfolio of previous work</span>
          </li>
        </ul>

        {hasStaked ? (
          <div className="glass-card rounded-2xl p-6">
            <div className="text-center mb-4">
              <div className="text-2xl mb-2">OK</div>
              <h4 className="font-bold text-green-900 mb-2">Application Submitted!</h4>
              <p className="text-green-700 text-sm">
                Your stake is locked. The client will review your application.
              </p>
            </div>

            <div className="glass-pill rounded-2xl p-4 text-sm">
              <h5 className="font-semibold mb-2">Next Steps:</h5>
              <ol className="list-decimal list-inside space-y-1 text-gray-700">
                <li>Client reviews your application</li>
                <li>If selected, begin work on the project</li>
                <li>Submit completed work before deadline</li>
                <li>Receive $20 payment + your stake back</li>
              </ol>
            </div>
          </div>
        ) : (
          <TrustGate minScore={1100} userScore={score}>
            <PayButton
              amount={10}
              amounts={{ USDC: 10, ETH: ethAmount }}
              tokens={["USDC", "ETH"]}
              recipient={TREASURY_ADDRESS}
              label={(selectedToken, amount) => `Stake ${amount} ${selectedToken} and Apply`}
              onSuccess={() => {
                setHasStaked(true);
                toast.success("Application submitted with stake!");
              }}
              onError={(error) => {
                toast.error(`Stake failed: ${error.message}`);
              }}
              className="w-full"
            />

            <p className="text-xs text-gray-500 text-center mt-3">
              Your stake will be returned if you complete the work successfully
            </p>
          </TrustGate>
        )}
      </div>

      <p className="text-xs text-gray-500 text-center mt-6">Payments on Base Sepolia testnet</p>
    </div>
  );
}
