import { useState } from "react";
import { useAccount } from "wagmi";
import { PayButton, TrustBadge, useEthosScore } from "@ethos/reputation-gate";
import TrustGate from "../components/TrustGate";
import toast from "react-hot-toast";

import { TREASURY_ADDRESS } from "../config/constants";

export function DAOProposalDemo() {
  const { address } = useAccount();
  const { score } = useEthosScore(address);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [proposalTitle, setProposalTitle] = useState("");
  const [proposalDescription, setProposalDescription] = useState("");
  const [requestedAmount, setRequestedAmount] = useState("");
  const ethAmount = 0.04;

  return (
    <div className="glass-card rounded-3xl p-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-sm font-semibold text-indigo-700">DAO</span>
        <div>
          <h2 className="text-2xl font-bold">DAO Governance</h2>
          <p className="text-gray-600">Submit Proposal to Based DAO</p>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6 mb-6">
        <h3 className="font-semibold mb-3">Current Treasury Stats:</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="text-2xl font-bold text-blue-600">$2.4M</div>
            <div className="text-xs text-gray-600">Treasury Value</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">1,247</div>
            <div className="text-xs text-gray-600">Token Holders</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">23</div>
            <div className="text-xs text-gray-600">Active Proposals</div>
          </div>
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
            <h4 className="font-semibold text-yellow-900 mb-2">Anti-Spam Protection</h4>
            <p className="text-sm text-yellow-800 mb-3">To prevent spam proposals, submitters must:</p>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li className="flex items-center gap-2">
                <span>REQ</span>
                <span>Have ELITE tier reputation (1800+ score)</span>
              </li>
              <li className="flex items-center gap-2">
                <span>REQ</span>
                <span>Stake $100 USDC or {ethAmount} ETH deposit</span>
              </li>
            </ul>
            <div className="mt-3 p-3 glass-pill rounded-xl text-xs">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-green-600">OK</span>
                <span className="font-semibold">If proposal passes (&gt;= 50% yes votes)</span>
              </div>
              <div className="ml-6 text-gray-600">Deposit returned to proposer</div>

              <div className="flex items-center gap-2 mt-2 mb-1">
                <span className="text-red-600">NO</span>
                <span className="font-semibold">If proposal fails (&lt; 10% approval)</span>
              </div>
              <div className="ml-6 text-gray-600">Deposit sent to DAO treasury</div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/40 pt-6 mb-6">
        {!hasSubmitted && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Proposal Title *</label>
              <input
                type="text"
                value={proposalTitle}
                onChange={(e) => setProposalTitle(e.target.value)}
                placeholder="e.g., Allocate $50k for Marketing Campaign"
                className="w-full px-4 py-2 glass-pill border border-white/40 rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Proposal Description *</label>
              <textarea
                value={proposalDescription}
                onChange={(e) => setProposalDescription(e.target.value)}
                placeholder="Describe your proposal in detail. Include objectives, timeline, and expected outcomes..."
                rows={6}
                className="w-full px-4 py-2 glass-pill border border-white/40 rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-transparent"
              />
              <div className="text-xs text-gray-500 mt-1">{proposalDescription.length}/500 characters</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Requested Amount (USDC)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={requestedAmount}
                  onChange={(e) => setRequestedAmount(e.target.value)}
                  placeholder="50000"
                  className="flex-1 px-4 py-2 glass-pill border border-white/40 rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-transparent"
                />
                <div className="px-4 py-2 glass-pill border border-white/40 rounded-xl text-slate-700 font-medium">
                  USDC
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Execution Timeline</label>
              <select className="w-full px-4 py-2 glass-pill border border-white/40 rounded-xl">
                <option>Immediate (upon approval)</option>
                <option>1 week after approval</option>
                <option>2 weeks after approval</option>
                <option>1 month after approval</option>
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-white/40 pt-6">
        {hasSubmitted ? (
          <div className="glass-card rounded-2xl p-6">
            <div className="text-center mb-4">
              <div className="text-2xl mb-2">OK</div>
              <h4 className="font-bold text-green-900 mb-2">Proposal Submitted!</h4>
              <p className="text-green-700 text-sm mb-4">
                Your deposit is locked. Voting begins in 24 hours.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-4 mb-4 text-sm">
              <div className="font-semibold mb-2">{proposalTitle || "Your Proposal"}</div>
              <div className="text-gray-600 text-xs mb-3">
                {proposalDescription.substring(0, 100)}
                {proposalDescription.length > 100 && "..."}
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span className="text-gray-600">Requested:</span>
                <span className="font-semibold">${requestedAmount || "0"} USDC</span>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-4 mb-4">
              <h5 className="font-semibold mb-2 text-sm">Proposal Timeline:</h5>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-300/70 rounded-full shadow-sm"></div>
                  <span className="text-gray-600">Now: Proposal submitted</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-slate-300/70 rounded-full shadow-sm"></div>
                  <span className="text-gray-600">24h: Voting begins</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-slate-300/70 rounded-full shadow-sm"></div>
                  <span className="text-gray-600">7d: Voting ends</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-slate-300/70 rounded-full shadow-sm"></div>
                  <span className="text-gray-600">8d: Execution / Refund</span>
                </div>
              </div>
            </div>

            <div className="glass-pill rounded-xl p-3 text-sm">
              <p className="text-blue-800">
                <strong>Note:</strong> If your proposal receives less than 10% approval, your deposit will be sent
                to the DAO treasury. This incentivizes well-researched, high-quality proposals.
              </p>
            </div>

            <div className="mt-4 text-center">
              <a href="#" onClick={(e) => e.preventDefault()} className="text-blue-600 hover:underline text-sm font-medium">
                View Your Proposal
              </a>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <h3 className="font-semibold mb-3">Requirements</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className={score >= 1800 ? "text-green-500" : "text-red-500"}>
                    {score >= 1800 ? "OK" : "NO"}
                  </span>
                  <span>
                    ELITE tier (1800+ score)
                    {score < 1800 && score > 0 && <span className="text-gray-500"> - You have {score}</span>}
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <span className={proposalTitle && proposalDescription ? "text-green-500" : "text-gray-400"}>
                    {proposalTitle && proposalDescription ? "OK" : "WAIT"}
                  </span>
                  <span>Complete proposal details</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-500">REQ</span>
                  <span>$100 USDC or {ethAmount} ETH proposal deposit</span>
                </li>
              </ul>
            </div>

            <TrustGate minScore={1800} userScore={score}>
              <PayButton
                amount={100}
                amounts={{ USDC: 100, ETH: ethAmount }}
                tokens={["USDC", "ETH"]}
                recipient={TREASURY_ADDRESS}
                label={(selectedToken, amount) => `Submit Proposal - ${amount} ${selectedToken} Deposit`}
                onSuccess={() => {
                  setHasSubmitted(true);
                  toast.success("Proposal submitted to DAO!");
                }}
                onError={(error) => {
                  toast.error(`Submission failed: ${error.message}`);
                }}
                disabled={!proposalTitle.trim() || !proposalDescription.trim()}
                className="w-full"
              />

              <p className="text-xs text-gray-500 text-center mt-3">
                Deposit returned if proposal passes (&gt;= 50% yes votes)
              </p>
            </TrustGate>
          </>
        )}
      </div>

      <div className="mt-6 glass-pill rounded-xl p-4">
        <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-500">WHY</span>
          <span>Why This Works:</span>
        </h4>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>- Only elite community members can propose</li>
          <li>- Financial stake ensures quality proposals</li>
          <li>- Failed proposals fund the treasury</li>
          <li>- Prevents governance attacks and spam</li>
          <li>- Reputation + stake = double layer of trust</li>
        </ul>
      </div>
    </div>
  );
}
